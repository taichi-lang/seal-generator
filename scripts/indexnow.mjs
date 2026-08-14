#!/usr/bin/env node
/**
 * IndexNow への URL 送信ツール
 *
 * ■ なぜ必要か(2026-08-14 の実測が出発点)
 *   公開から13日たった時点で、当サイトは Bing 系のインデックスに1ページも入っていなかった。
 *   対照は2本とも成立している —
 *     ・実在して稼働中の競合 `kakuin.keydrop.net` は 8URL が返る(測定器は生きている)
 *     ・存在しないドメインは 0件(偽陽性が出ない)
 *     ・当サイト `seal-generator.vercel.app` は **0件**
 *   sitemap.xml も robots.txt も置いてあるので「読ませる用意が無い」のではなく、
 *   **こちらの存在を伝える経路が1本も無い**(被リンクが実質0本)のが理由と考えるのが自然である。
 *   IndexNow は、その「存在を伝える」だけを、アカウント登録も費用も無しに行える唯一の経路である。
 *
 * ■ できないことを先に書く
 *   ・**Google は IndexNow に参加していない。** これで増えるとしたら Bing / Yandex 系だけである
 *   ・送信は「見に来てください」という通知であって、**掲載も順位も約束しない**
 *   ・送信が成功しても、載ったかどうかは別に測る必要がある(このツールは測らない)
 *
 * ■ 道具の側で守らせているルール(2026-08-08 B4 の作り方に倣う)
 *   「中身が変わっていない URL を毎日送らない」を、覚えておく約束にせず、
 *   このツール自身が state ファイルで判定して弾く。
 *   同じ URL 集合を繰り返し送るのは、相手のサービスに対して無意味な負荷であり、
 *   送信元の信用を落とす行為でもある。
 *
 * 使い方:
 *   node scripts/indexnow.mjs           送信が必要なときだけ送る(必要が無ければ何もしない)
 *   node scripts/indexnow.mjs --dry-run 送らずに、何が送られるかだけ出す
 *   node scripts/indexnow.mjs --force   state を無視して送る(URL を変えていないのに再送したいとき)
 */

import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOST = "seal-generator.vercel.app";
const SITE_URL = `https://${HOST}`;
const KEY = "69b108b81e51996eaf78dfa0d53c07ff";
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = join(SCRIPT_DIR, "indexnow-state.json");

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const FORCE = args.has("--force");

/** 本番の sitemap.xml に載っている URL を取り出す。
 *
 *  リポジトリの `src/app/sitemap.ts` ではなく本番を読むのは、
 *  **まだデプロイされていない URL を「あります」と送らない**ためである。 */
async function fetchSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml の取得に失敗した (HTTP ${res.status})`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urls.length === 0) throw new Error("sitemap.xml から URL を1件も取り出せなかった");
  return urls;
}

/** 送る前に、1件ずつ本当に 200 が返るか確かめる。
 *
 *  404 を混ぜて送るのは、相手に嘘の情報を渡すことなので、1件でも欠けたら送信そのものを中止する。 */
async function verifyAllReachable(urls) {
  const results = [];
  for (const url of urls) {
    const res = await fetch(url, { method: "GET", redirect: "manual" });
    results.push({ url, status: res.status });
  }
  return results;
}

async function readState() {
  try {
    return JSON.parse(await readFile(STATE_PATH, "utf8"));
  } catch {
    return null;
  }
}

function fingerprint(urls) {
  return createHash("sha256").update([...urls].sort().join("\n")).digest("hex");
}

async function main() {
  const urls = await fetchSitemapUrls();
  console.log(`sitemap.xml の URL: ${urls.length}件`);

  const checks = await verifyAllReachable(urls);
  for (const { url, status } of checks) console.log(`  ${status}  ${url}`);
  const broken = checks.filter((c) => c.status !== 200);
  if (broken.length > 0) {
    console.error(`\n中止: 200 を返さない URL が ${broken.length}件ある。送信しない。`);
    process.exitCode = 1;
    return;
  }

  // 鍵ファイルが本番から読めることを、送る前に自分で確かめる。
  // ここが 404 だと IndexNow 側は所有者確認に失敗し、送信は黙って無視される。
  const keyRes = await fetch(KEY_LOCATION);
  const keyBody = keyRes.ok ? (await keyRes.text()).trim() : "";
  if (!keyRes.ok || keyBody !== KEY) {
    console.error(
      `\n中止: 鍵ファイルを確認できない。${KEY_LOCATION} は HTTP ${keyRes.status} / 中身="${keyBody}"`,
    );
    process.exitCode = 1;
    return;
  }
  console.log(`\n鍵ファイル: HTTP 200・中身が鍵と一致`);

  const fp = fingerprint(urls);
  const state = await readState();
  if (!FORCE && state?.fingerprint === fp) {
    console.log(
      `\n送信しない: URL 集合が前回送信時(${state.submittedAt})から変わっていない。` +
        `\n            再送するなら --force を付ける。`,
    );
    return;
  }

  const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls };
  if (DRY_RUN) {
    console.log("\n--dry-run のため送信しない。送る内容:");
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  console.log(`\nIndexNow の応答: HTTP ${res.status} ${res.statusText}${text ? ` / ${text}` : ""}`);

  // 200 = 受理 / 202 = 受理したが鍵の確認は保留。どちらも「受け取った」であり、掲載の約束ではない。
  if (res.status !== 200 && res.status !== 202) {
    console.error("受理されなかったため state を更新しない(次回もう一度送る)。");
    process.exitCode = 1;
    return;
  }

  await writeFile(
    STATE_PATH,
    `${JSON.stringify(
      { fingerprint: fp, urlCount: urls.length, urls, httpStatus: res.status, submittedAt: new Date().toISOString() },
      null,
      2,
    )}\n`,
    "utf8",
  );
  console.log(`state を更新した: ${STATE_PATH}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});

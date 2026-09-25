/** `/ads.txt` を、**審査する側の動線**で測る。
 *
 * AdSense はサイトの所有者確認にルート直下の `/ads.txt` を読む。
 * このファイルは、当事業で**審査側が最初に触る唯一の面**である。
 * にもかかわらず 2026-09-17 まで seal-generator 側には試験が1本も無かった
 * (invoice-tool 側には `tests/ads.test.js` にあった)。
 *
 * ⚠ ここで固定したいのは、とくに次の1点である:
 *   **広告ユニットID(`ARTICLE_SLOT`)は、審査に通るまで発行されない。**
 *   つまりオーナー様が審査を出す時点で手元にあるのは発行者IDだけである。
 *   → その状態で `/ads.txt` が 200 を返さないと、**審査が始まらない。**
 *   記事面の広告は「両方そろったときだけ」で正しいが、
 *   `/ads.txt` は**発行者IDだけで出す**必要がある。両者を取り違えない。
 *
 * ⚠ 測り方: 状態ごとに**子プロセスを分ける**(`tests/ads-txt-probe.mjs`)。
 *   `src/lib/ads.ts` は読み込み時に環境変数を定数へ入れるため、
 *   同一プロセスで `process.env` を書き換えても値は変わらない。
 *   ここを分けないと、測っているつもりで1つ前の状態を測ることになる。
 *
 * ⚠ ネットワークは1バイトも使っていない。本番への curl・ブラウザは0回。
 *   使っている発行者IDは公開値の形をまねた偽物で、実在のIDではない。
 *
 * 設計: AIBusiness `businesses/starter-tools/広告_設計.md`
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";

/** 公開値の形だけをまねた偽の発行者ID。実在しない。 */
const FAKE_CLIENT = "ca-pub-0000000000000000";
/** 公開値の形だけをまねた偽の広告ユニットID。実在しない。 */
const FAKE_SLOT = "1234567890";

const ROOT = path.resolve(import.meta.dirname, "..");

type Probe = { status: number; contentType: string | null; body: string };

/** 指定した環境変数の状態で `/ads.txt` を1回だけ測る。 */
function fetchAdsTxt(env: Record<string, string>): Probe {
  const out = execFileSync(
    process.execPath,
    ["--import", "./tests/alias-loader.mjs", "./tests/ads-txt-probe.mjs"],
    {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      env: {
        ...process.env,
        NEXT_PUBLIC_ADSENSE_CLIENT: "",
        NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT: "",
        ...env,
      },
    },
  );
  return JSON.parse(out) as Probe;
}

describe("/ads.txt: 審査に出す時点の状態(発行者IDだけ)", () => {
  test("発行者IDだけでも 200 を返す(ここが 404 だと審査が始まらない)", () => {
    const res = fetchAdsTxt({ NEXT_PUBLIC_ADSENSE_CLIENT: FAKE_CLIENT });
    assert.equal(res.status, 200);
  });

  test("中身は Google が定める1行そのもので、余計な行が無い", () => {
    const res = fetchAdsTxt({ NEXT_PUBLIC_ADSENSE_CLIENT: FAKE_CLIENT });
    assert.equal(res.body, "google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n");
    assert.equal(res.body.trimEnd().split("\n").length, 1);
  });

  test("`ca-` を落とした `pub-` 形で書く(`ca-pub-` のままでは読まれない)", () => {
    const res = fetchAdsTxt({ NEXT_PUBLIC_ADSENSE_CLIENT: FAKE_CLIENT });
    assert.ok(!res.body.includes("ca-pub-"), res.body);
    assert.ok(res.body.includes("pub-0000000000000000"), res.body);
  });

  test("text/plain で返す(HTML で返すと ads.txt として読まれない)", () => {
    const res = fetchAdsTxt({ NEXT_PUBLIC_ADSENSE_CLIENT: FAKE_CLIENT });
    assert.match(res.contentType ?? "", /^text\/plain/);
  });
});

describe("/ads.txt: 対照 — 出さないときは 404 で、空の 200 にしない", () => {
  test("何も設定していなければ 404", () => {
    const res = fetchAdsTxt({});
    assert.equal(res.status, 404);
  });

  test("対照: 広告ユニットIDだけでは 404(発行者IDが無ければ出さない)", () => {
    const res = fetchAdsTxt({ NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT: FAKE_SLOT });
    assert.equal(res.status, 404);
  });

  test("形が違う発行者IDは受け付けない", () => {
    for (const bad of ["pub-0000000000000000", "ca-pub-", "ca-pub-123", "ca-pub-abcdefghij"]) {
      const res = fetchAdsTxt({ NEXT_PUBLIC_ADSENSE_CLIENT: bad });
      assert.equal(res.status, 404, `発行者IDが ${JSON.stringify(bad)} のとき`);
    }
  });

  test("空文字・空白だけは「未設定」として扱う", () => {
    for (const value of ["", "   "]) {
      const res = fetchAdsTxt({ NEXT_PUBLIC_ADSENSE_CLIENT: value });
      assert.equal(res.status, 404, `発行者IDが ${JSON.stringify(value)} のとき`);
    }
  });
});

describe("/ads.txt: 審査に通ったあと(両方そろった状態)", () => {
  test("広告ユニットIDが増えても ads.txt の中身は変わらない", () => {
    const before = fetchAdsTxt({ NEXT_PUBLIC_ADSENSE_CLIENT: FAKE_CLIENT });
    const after = fetchAdsTxt({
      NEXT_PUBLIC_ADSENSE_CLIENT: FAKE_CLIENT,
      NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT: FAKE_SLOT,
    });
    assert.equal(after.status, 200);
    assert.equal(after.body, before.body);
  });

  test("広告ユニットIDは ads.txt に1文字も混ざらない", () => {
    const res = fetchAdsTxt({
      NEXT_PUBLIC_ADSENSE_CLIENT: FAKE_CLIENT,
      NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT: FAKE_SLOT,
    });
    assert.ok(!res.body.includes(FAKE_SLOT), res.body);
  });
});

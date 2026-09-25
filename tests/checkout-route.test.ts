/** `POST /api/checkout` と `GET /api/unlock` を、鍵なしで直接呼んで測る。
 *
 * 本番への curl ではなく、経路の関数をそのまま呼ぶ。理由は2つ:
 *   - 本番だと「500 がこの経路のものか、手前の何かか」を切り分けられない
 *   - 本番への疎通確認は稼働を宙吊りにした実績がある(●全社-26)
 *
 * ⚠ 対照の取り方: 「鍵が無い → 500」だけでは、500 の原因が鍵だとは言えない。
 *   そこで **鍵がある状態で、鍵より後ろの判定に引っかかる入力**を送り、
 *   500 ではない別の応答が返ることを見る。これで
 *   「500 は鍵の関門だけが出しており、鍵が入れば処理はその先へ進む」が言える。
 *
 * ⚠ ここでも Stripe には1バイトも送っていない。
 *   対照に使う入力は、Stripe を呼ぶ手前で弾かれるものだけを選んである。
 */

import { test, describe, afterEach } from "node:test";
import assert from "node:assert/strict";

import { POST as checkout } from "@/app/api/checkout/route";
import { GET as unlock } from "@/app/api/unlock/route";

const VALID_BODY = {
  companyName: "株式会社テスト商会",
  type: "square",
  fontStyle: "shippori",
  color: "#c0392b",
  squareSuffix: "之印",
  roundTitle: "",
  frameStyle: "single",
  layout: "vertical",
};

function post(body: unknown) {
  return checkout(
    new Request("https://example.test/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

afterEach(() => {
  delete process.env.STRIPE_SECRET_KEY;
});

describe("checkout: 鍵が無いとき", () => {
  test("500 と `payment not configured` を返す(本番で観測されている状態)", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const res = await post(VALID_BODY);
    assert.equal(res.status, 500);
    assert.deepEqual(await res.json(), { error: "payment not configured" });
  });

  test("空文字・空白だけの鍵も「未設定」として扱う", async () => {
    for (const value of ["", "   "]) {
      process.env.STRIPE_SECRET_KEY = value;
      const res = await post(VALID_BODY);
      assert.equal(res.status, 500, `鍵が ${JSON.stringify(value)} のとき`);
    }
  });
});

describe("checkout: 対照 — 鍵があれば判定はその先へ進む", () => {
  test("鍵があり本文が壊れているときは 500 ではなく 400", async () => {
    // 本文の検証は鍵の関門より後ろにある。ここが 400 で返る = 鍵の関門は抜けた。
    // かつ parseSealDesign で弾かれるので Stripe へは行かない。
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy_not_a_real_key";
    const res = await post({ ...VALID_BODY, companyName: "" });
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: "invalid request" });
  });
});

describe("unlock: 決済後の引渡し口も同じ関門を持つ", () => {
  function get(query: string) {
    return unlock(new Request(`https://example.test/api/unlock${query}`));
  }

  test("鍵が無ければ 500 `payment not configured`", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const res = await get("?session_id=cs_test_aaaaaaaaaaaaaaa");
    assert.equal(res.status, 500);
    assert.deepEqual(await res.json(), { error: "payment not configured" });
  });

  test("対照: 鍵があり session_id が不正なら 500 ではなく 400", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy_not_a_real_key";
    for (const q of ["", "?session_id=", "?session_id=../../etc", "?session_id=cs_short"]) {
      const res = await get(q);
      assert.equal(res.status, 400, `session_id が ${JSON.stringify(q)} のとき`);
    }
  });
});

describe("画面に出る文言の約束", () => {
  test("経路が返す文字列と、画面が分岐に使う文字列が一致している", async () => {
    // SealGenerator.tsx は `data.error === "payment not configured"` のときだけ
    // 「販売を一時停止しています。無料ダウンロードは使えます」と出す。
    // 経路側の文字列を変えると、画面は黙って
    // 「時間をおいて再度お試しください」(= 待てば直る、という誤った案内)に落ちる。
    const { readFile } = await import("node:fs/promises");
    const ui = await readFile(
      new URL("../src/components/SealGenerator.tsx", import.meta.url),
      "utf8",
    );

    delete process.env.STRIPE_SECRET_KEY;
    const { error } = (await (await post(VALID_BODY)).json()) as { error: string };

    assert.ok(
      ui.includes(`"${error}"`),
      `経路は ${JSON.stringify(error)} を返すが、画面はその文字列で分岐していない`,
    );
    assert.ok(ui.includes("無料で PNG ダウンロード"), "無料の逃げ道の案内が画面から消えている");
  });
});

/** 決済経路のテスト — 鍵を1バイトも使わずに測れる範囲だけを測る。
 *
 * なぜ要るか: `POST /api/checkout` は 2026-08-18 から 500 を返し続けている。
 * 原因は STRIPE_SECRET_KEY の未設定で、鍵を入れるのはオーナー様の操作である。
 * したがって当方にできるのは「鍵さえ入れれば通る状態か」を鍵なしで確かめることだけ。
 *
 * ⚠ ここで測っていないもの(測れないもの):
 *   - Stripe が実際にセッションを作るか / 決済が成立するか
 *   - Stripe が空文字の metadata をどう扱うか(Stripe 側の仕様は当方では検証できない)
 *   これらは鍵が入ってからでないと測れない。
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  parseSealDesign,
  toStripeMetadata,
  fromStripeMetadata,
  type SealDesign,
} from "@/lib/sealDesign";

const DESIGN: SealDesign = {
  companyName: "株式会社テスト商会",
  type: "square",
  fontStyle: "shippori",
  color: "#c0392b",
  squareSuffix: "之印",
  roundTitle: "代表取締役",
  frameStyle: "single",
  layout: "vertical",
};

/** Stripe の往復を模す: `metadata[x]` の形から素の metadata オブジェクトへ戻す。 */
function asStripeReturnedMetadata(form: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(form).map(([k, v]) => [k.replace(/^metadata\[(.+)\]$/, "$1"), v]),
  );
}

describe("購入内容の往復(checkout が載せ、unlock が取り出す)", () => {
  test("設計値が1項目も欠けずに戻る", () => {
    const back = fromStripeMetadata(asStripeReturnedMetadata(toStripeMetadata(DESIGN)));
    assert.deepEqual(back, DESIGN);
  });

  test("空の項目が Stripe 側で落ちても、決済済みの引渡しは止まらない", () => {
    // Stripe は metadata の値に空文字を渡すとキーごと消すことがある。
    // そうなっても「決済は済んだのに設計値が壊れている」(unlock の 500)にしない。
    const design: SealDesign = { ...DESIGN, squareSuffix: "", roundTitle: "" };
    const returned = asStripeReturnedMetadata(toStripeMetadata(design));
    delete returned.squareSuffix;
    delete returned.roundTitle;

    const back = fromStripeMetadata(returned);
    assert.deepEqual(back, design);
  });

  test("後から足した項目が無い古いセッションでも引き渡せる", () => {
    // frameStyle / layout は後から追加した。既定値に寄せる実装が効いているか。
    const returned = asStripeReturnedMetadata(toStripeMetadata(DESIGN));
    delete returned.frameStyle;
    delete returned.layout;

    const back = fromStripeMetadata(returned);
    assert.equal(back.frameStyle, "single");
    assert.equal(back.layout, "vertical");
    assert.equal(back.companyName, DESIGN.companyName);
  });
});

describe("Stripe の metadata の制限を超えない", () => {
  test("キーは50個まで / キー名は40文字まで", () => {
    const form = toStripeMetadata(DESIGN);
    const keys = Object.keys(form).map((k) => k.replace(/^metadata\[(.+)\]$/, "$1"));
    assert.ok(keys.length <= 50, `metadata のキーが多すぎる: ${keys.length}`);
    for (const k of keys) {
      assert.ok(k.length <= 40, `metadata のキー名が長すぎる: ${k}`);
    }
  });

  test("どんな長い入力でも値は500文字を超えない", () => {
    // 入力欄に上限が無くても、parseSealDesign が切ってから metadata に載る。
    const design = parseSealDesign({
      ...DESIGN,
      companyName: "あ".repeat(5000),
      squareSuffix: "い".repeat(5000),
      roundTitle: "う".repeat(5000),
    });
    for (const [k, v] of Object.entries(toStripeMetadata(design))) {
      assert.ok(v.length <= 500, `metadata の値が500文字を超える: ${k} = ${v.length}文字`);
    }
  });
});

describe("不正な入力は Stripe に届く前に落ちる", () => {
  for (const [name, input] of [
    ["会社名が空", { ...DESIGN, companyName: "" }],
    ["会社名が空白だけ", { ...DESIGN, companyName: "   " }],
    ["印種が不正", { ...DESIGN, type: "triangle" }],
    ["書体が不正", { ...DESIGN, fontStyle: "comic" }],
    ["色が16進でない", { ...DESIGN, color: "red" }],
    ["色に scheme が混ざる", { ...DESIGN, color: "javascript:x" }],
    ["本体が null", null],
    ["本体が配列", []],
  ] as const) {
    test(name, () => {
      assert.throws(() => parseSealDesign(input));
    });
  }
});

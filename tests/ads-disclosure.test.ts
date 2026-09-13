/** 広告の告知と、広告そのものが必ず同時に切り替わることを測る。
 *
 * なぜ要るか(2026-09-14・B2):
 * `/legal` の「広告配信」欄は手書きで「使用していません」と書かれていた。
 * 一方で広告の器(`AdSlot`)は実装済みで、オーナー様が発行者IDと広告ユニットIDを
 * 貼った瞬間に記事面へ描画される。つまり**貼った瞬間に本ページが嘘になる**状態だった。
 * AdSense は第三者配信と Cookie の告知を求めるため、これは審査に直接ひびく。
 *
 * ⚠ ここで測っていないもの:
 *   - 実際に審査に通るか(中身の判断であり、当方に事前に確かめる手段は無い)
 *   - 本番の `/legal` の見た目(本番は鍵も広告IDも未設定のため、無効側しか出ない)
 *   - Google が Cookie を実際にどう使うか(先方の仕様で、当方では検証できない)
 *
 * 測っているのは「判定関数が1つで、告知と描画が同じ条件を見ている」ことだけである。
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const LEGAL = readFileSync("src/app/legal/page.tsx", "utf8");
const AD_SLOT = readFileSync("src/components/AdSlot.tsx", "utf8");

describe("広告の告知(/legal)", () => {
  test("告知の出し分けは、広告の器と同じ判定関数を見ている", () => {
    // 別々の条件で書くと、片方だけ直して食い違う。出どころを1つに固定する。
    assert.ok(LEGAL.includes("isArticleAdEnabled()"));
    assert.ok(AD_SLOT.includes("isArticleAdEnabled()"));
  });

  test("広告が有効なときの文面に、第三者配信・Cookie・無効化手段がそろっている", () => {
    assert.ok(LEGAL.includes("第三者配信"));
    assert.ok(LEGAL.includes("Cookie"));
    assert.ok(LEGAL.includes("パーソナライズ広告を無効"));
    assert.ok(LEGAL.includes("https://policies.google.com/technologies/ads"));
  });

  test("広告が無効なときの文面は、従来どおり「使用していません」のままである", () => {
    assert.ok(LEGAL.includes("広告配信は使用していません"));
  });

  test("`/legal` 自身には広告を置かない(設計 §3 の禁止事項)", () => {
    // 告知の文言に AdSense の名前は出るが、広告の器そのものは置かない。
    assert.ok(!LEGAL.includes("<AdSlot"));
    assert.ok(!LEGAL.includes("adsbygoogle"));
  });
});

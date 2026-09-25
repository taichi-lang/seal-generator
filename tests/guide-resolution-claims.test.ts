/** 記事が px の推奨値を出したとき、本サイトの書き出しの実数も同じ節に在ることを測る。
 *
 * なぜ要るか(2026-09-26・B4):
 * `/guide/kakuin-tsukaikata` の h2 5 は「印刷して配る書類に使うなら1000px以上」と
 * 勧めていたが、**同じ節に本サイトの書き出しが何pxかが1度も書かれていなかった**。
 * 直後の文は「無料の書き出しでも透かしを入れていません」で、読者は
 * **無料の書き出しがその推奨を満たすと読める**。実際の無料の書き出しは
 * `FREE_SIZE`(=560px)で、**推奨の半分である**(本番で実測: 当該ページに `560` は0件だった)。
 *
 * 姉妹記事 `/guide/denshi-inkan-tsukurikata` は同じことを
 * 「無料のまま一辺 {FREE_SIZE}px です」と**実数で**書いている。
 * つまり正しい型は既にサイト内に在り、**この1枚だけがそこから外れていた**。
 *
 * ⚠ ここで測っていないもの:
 *   - 読者が実際にどう読むか(測る手段が無い)
 *   - 本番の描画(ビルド後のHTMLではなくソースを見ている)
 *   - 1000px という推奨値そのものの妥当性(一般論であり、当方の製品の話ではない)
 *   - 有料パック(最大2000px)で推奨を満たせるかどうか。**決済は第2シフトの持ち物**
 *
 * 測っているのは「px の数字を勧めた節に、自社の実数が併記されているか」だけである。
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const GUIDE_DIR = "src/app/guide";

/** ガイド記事の page.tsx を全部集める(名簿を手で書かない。ディスクを見る)。 */
function guidePages(): { slug: string; source: string }[] {
  return readdirSync(GUIDE_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => ({
      slug: e.name,
      source: readFileSync(`${GUIDE_DIR}/${e.name}/page.tsx`, "utf8"),
    }));
}

/** 本文が「◯◯px」という数字を推奨として出している箇所を拾う。 */
function pxClaims(source: string): string[] {
  return [...source.matchAll(/(\d{3,4})\s*px/g)].map((m) => m[1]);
}

describe("px の推奨値を出す記事は、自社の書き出しの実数も併記する", () => {
  for (const { slug, source } of guidePages()) {
    const claims = pxClaims(source);
    if (claims.length === 0) continue;

    test(`/guide/${slug} は px を出しているので FREE_SIZE を参照している`, () => {
      // 560 を直書きさせない。出どころは pricing.ts の FREE_SIZE 1か所に固定する。
      assert.ok(
        source.includes("FREE_SIZE"),
        `/guide/${slug} が px の数字(${claims.join(", ")})を出しているのに、` +
          "本サイトの書き出しの大きさ(FREE_SIZE)を1度も書いていない。" +
          "→ 読者はその推奨を本サイトの無料の書き出しが満たすと読む。" +
          "姉妹記事 denshi-inkan-tsukurikata と同じ形で実数を併記すること。",
      );
      assert.ok(
        source.includes('from "@/lib/pricing"'),
        `/guide/${slug} は FREE_SIZE を pricing.ts から import すること(数字を直書きしない)。`,
      );
    });
  }

  test("名簿ではなくディスクを見ているので、記事を足しても数え落とさない", () => {
    // 手書きの名簿は、14枚目で黙って漏れる(2026-09-25 に B2 が踏んだ形)。
    assert.ok(guidePages().length >= 2);
  });
});

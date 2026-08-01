/** 構造化データ(JSON-LD)を出力する。
 *
 * 検索エンジンに「このページは何なのか」を機械が読める形で伝えるためのもの。
 * 書いてよいのは、実際にページに書いてある事実だけ。
 * 評価・レビュー件数・利用者数のような、裏づけのない数値は入れない。 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // 入れるのは JSON.stringify の出力だけ(利用者の入力は一切通らない)。
      // それでも将来この関数に動的な値が渡されたときに備え、
      // `</script>` として解釈されうる `<` を必ずエスケープしておく。
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** 広告(第1段の収益)の設定値。
 *
 * 設計は AIBusiness `businesses/starter-tools/広告_設計.md`。
 * ここで決めているのは「値が無いときは1バイトも描画しない」という一点である。
 *
 * ⚠ 発行者ID・広告ユニットIDは HTML に公開される値であり、秘密鍵ではない。
 *   Stripe の鍵とは扱いが違うが、値そのものはオーナー様がアカウントを
 *   作らないと発行されないため、当方は空のまま置く。
 *
 * ⚠ 自動広告(Auto ads)は使わない。掲載面をこちらで選べず、
 *   印影を作る画面や請求書のプレビューに差し込まれる可能性があるためである。
 *   面を指定できる広告ユニット方式にし、そのぶんIDを2つ必要とする。 */

/** AdSense の発行者ID(`ca-pub-...`)。 */
export const ADSENSE_CLIENT = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "").trim();

/** 記事末尾に置く広告ユニットのID(数字10桁)。 */
export const ADSENSE_ARTICLE_SLOT = (process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT ?? "").trim();

/** 発行者IDが `ca-pub-` で始まる形をしているか。
 *
 * 空文字や書きかけの値で `<script>` を出すと、審査時に「壊れた広告コード」として
 * 見られる。形が合っているときだけ描画する。 */
export function hasPublisherId(): boolean {
  return /^ca-pub-\d{10,}$/.test(ADSENSE_CLIENT);
}

/** 記事面に広告を描画してよいか。発行者IDと広告ユニットIDの両方が要る。 */
export function isArticleAdEnabled(): boolean {
  return hasPublisherId() && /^\d{6,}$/.test(ADSENSE_ARTICLE_SLOT);
}

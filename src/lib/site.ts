/** サイト共通の表記。特商法表記・利用許諾書・フッターが同じ値を参照する。 */

export const SERVICE_NAME = "会社印ジェネレーター";

/** 公開しているサイトの絶対URL(末尾のスラッシュなし)。
 *
 * canonical と sitemap.xml は絶対URLでしか書けないため、ここを唯一の出どころにする。
 * Vercel のプレビュー環境でも本番URLを指すのが正しい(同じ内容の別URLを
 * 検索エンジンに別ページとして数えさせないため)。 */
export const SITE_URL = "https://seal-generator.vercel.app";

/** 検索結果に出したいトップページのタイトル。
 *
 * 「会社印ジェネレーター」だけでは何ができるのか分からず、
 * 実際に検索される言葉(角印・丸印・無料・作成)が1つも入っていなかったため、
 * 検索意図に合わせた語順に変えた。 */
export const SITE_TITLE = "角印・丸印を無料作成｜会社印ジェネレーター";

export const SITE_DESCRIPTION =
  "会社名を入力するだけで、請求書・見積書に押せる角印(社印)と丸印(代表者印)の印影を無料で作成できます。透過PNG・透かしなし。商用利用の可否と解像度を明記しています。";

/** 特定商取引法に基づき表示が必要な販売事業者名。 */
export const SELLER_NAME = "中村太一";

export const CONTACT_EMAIL = "nks.taichi@gmail.com";

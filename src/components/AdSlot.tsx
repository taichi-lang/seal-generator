import Script from "next/script";
import { ADSENSE_CLIENT, ADSENSE_ARTICLE_SLOT, isArticleAdEnabled } from "@/lib/ads";

/** 記事の末尾に置く広告の入れ物。
 *
 * 設定値が未設定のあいだは `null` を返す。器も余白も出さないので、
 * 未設定のうちは記事のHTMLが1バイトも変わらない。
 *
 * 置く場所の決まり(`広告_設計.md` §3):
 * - 置くのは解説記事の本文が終わったあとだけ
 * - 印影を作る画面(`<canvas>` と操作パネル)・`/legal`・ファーストビューには置かない
 *
 * 印刷対策(同 §4)は二重にしてある。ここで `no-print` を付け、
 * それとは別に `globals.css` が `.ad-slot` そのものを印刷時に消す。 */
export default function AdSlot() {
  if (!isArticleAdEnabled()) return null;

  return (
    <aside className="ad-slot no-print" aria-label="広告">
      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mb-1">広告</p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_ARTICLE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script
        id="adsbygoogle-loader"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      />
      <Script id="adsbygoogle-push" strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </aside>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, SELLER_NAME, SERVICE_NAME } from "@/lib/site";
import { PRICE_JPY } from "@/lib/pricing";

export const metadata: Metadata = {
  title: `特定商取引法に基づく表記・プライバシーポリシー | ${SERVICE_NAME}`,
  description: `${SERVICE_NAME}の特定商取引法に基づく表記とプライバシーポリシー`,
  alternates: { canonical: "/legal" },
  openGraph: { url: "/legal", title: `特定商取引法に基づく表記・プライバシーポリシー | ${SERVICE_NAME}` },
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-1 sm:gap-4 py-3 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-sm text-zinc-800 dark:text-zinc-200">{children}</dd>
    </div>
  );
}

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          特定商取引法に基づく表記・プライバシーポリシー
        </h1>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
            特定商取引法に基づく表記
          </h2>
          <dl>
            <Row label="販売事業者">{SELLER_NAME}</Row>
            <Row label="所在地">
              請求があった場合、遅滞なく開示いたします(下記お問い合わせ先までご請求ください)
            </Row>
            <Row label="電話番号">
              請求があった場合、遅滞なく開示いたします
            </Row>
            <Row label="お問い合わせ">{CONTACT_EMAIL}</Row>
            <Row label="販売価格">
              業務利用パック(利用許諾書つき) {PRICE_JPY.toLocaleString()}円(税込)。無料プランの利用に費用はかかりません
            </Row>
            <Row label="商品代金以外の必要料金">インターネット接続に係る通信料</Row>
            <Row label="支払方法">クレジットカード等(Stripe決済)</Row>
            <Row label="支払時期">ご注文時</Row>
            <Row label="引渡時期">
              決済完了後、直ちにダウンロードページを表示します
            </Row>
            <Row label="返品・キャンセル">
              デジタルコンテンツの性質上、決済完了後の返金には応じられません。
              ダウンロードできない等の不具合がある場合は、発行番号を添えてお問い合わせください。
            </Row>
          </dl>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
            プライバシーポリシー
          </h2>
          <dl>
            <Row label="取得する情報">
              印影の作成に入力された会社名・書体・色などの設定値。
              決済情報(カード番号等)はStripe社が直接取り扱い、当方は保持しません。
            </Row>
            <Row label="利用目的">印影データの生成および購入者への引渡しのためにのみ使用します。</Row>
            <Row label="保存">
              当方のサーバーはデータベースを持たず、入力情報を保存しません。
              無料プランの生成はすべてブラウザ内で完結し、入力内容は送信されません。
              有料プランでは、購入内容の引渡しのため設定値をStripeの決済セッションに一時的に含めます
              (Stripeのデータ保持ポリシーに従います)。
            </Row>
            <Row label="第三者提供">法令に基づく場合を除き、第三者に提供しません。</Row>
            <Row label="アクセス解析">
              どのページが見られているかを把握するため、Vercel Web Analytics を使用しています(2026年8月2日導入)。
              取得するのは、閲覧されたページのURL・参照元・おおよその地域(国・都市)・
              端末とブラウザの種類です。
              <strong>Cookieは使用せず、個人を特定できる情報は取得しません</strong>
              (提供元の説明によると、訪問者はリクエストから作られたハッシュ値で区別され、
              その値も24時間で破棄されます)。
              なお、決済後のダウンロード画面(/unlock)は計測の対象から除外しています。
            </Row>
            <Row label="広告配信">
              広告配信は使用していません。導入する場合は本ページで告知します。
            </Row>
          </dl>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
            ご利用上の注意
          </h2>
          {/* 2026-08-17: 無料プランの商用利用の可否を明記した(統括裁定 ●11)。
              それまでは明記も否定もしていない状態で、読み手には
              「有料でないと商用利用できない」と受け取られうる書き方だった。 */}
          <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
            <strong>無料プランで作成した印影も、商用利用していただけます。</strong>
            請求書・見積書・契約書などの業務書類にそのままお使いいただけます(利用料はかかりません)。
            有料の業務利用パックは、購入者名と発行番号の入った利用許諾書を書面として手元に残したい場合、
            および高解像度データが必要な場合にご利用ください。
          </p>

          <p className="mt-4 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
            本サービスが生成するのは印影の画像データであり、実物の印章ではありません。
            印鑑登録(実印)には使用できません。
            生成された印影が既存の登録商標や他社の印影と類似しないことは保証しませんので、
            ご使用にあたってはお客様の責任においてご確認ください。
          </p>
        </section>

        <p>
          <Link href="/" className="underline text-zinc-700 dark:text-zinc-300">
            トップへ戻る
          </Link>
        </p>
      </div>
    </main>
  );
}

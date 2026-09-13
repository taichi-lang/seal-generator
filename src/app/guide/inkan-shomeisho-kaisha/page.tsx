import type { Metadata } from "next";
import Link from "next/link";
import GuideArticle, { H2, Note, P } from "@/components/GuideArticle";
import { findGuide } from "@/lib/guides";
import { OG_IMAGE_PATH, SERVICE_NAME } from "@/lib/site";

const guide = findGuide("inkan-shomeisho-kaisha")!;

export const metadata: Metadata = {
  title: `${guide.title} | ${SERVICE_NAME}`,
  description: guide.description,
  alternates: { canonical: "/guide/inkan-shomeisho-kaisha" },
  openGraph: {
    title: guide.title,
    description: guide.description,
    url: "/guide/inkan-shomeisho-kaisha",
    type: "article",
    images: [OG_IMAGE_PATH],
  },
};

export default function Page() {
  return (
    <GuideArticle guide={guide}>
      <P>
        「印鑑証明を取ってきてください」と言われたとき、
        個人のものと会社のものでは<strong>取りに行く場所が違います</strong>。
        個人は市区町村の役所、会社は法務局です。ここを取り違えると一往復むだになります。
      </P>

      <H2>1. 個人と会社の違い</H2>
      <P>
        個人の印鑑証明書は、住んでいる市区町村に印鑑登録をしたうえで、
        その市区町村（や、対応していればコンビニ）で受け取ります。
      </P>
      <P>
        会社の印鑑証明書は、<strong>法務局</strong>が出します。
        もとになっているのは、登記のときに提出した代表者の印鑑です。
        したがって、<strong>印鑑を届け出ていない会社は印鑑証明書を取れません</strong>。
      </P>
      <P>
        届出のしかたは
        <Link href="/guide/inkan-todokedesho" className="underline">
          印鑑届書（印鑑届出書）の書き方
        </Link>
        にまとめています。
      </P>

      <H2>2. 先に印鑑カードが要る</H2>
      <P>
        会社の印鑑証明書を請求するには、<strong>印鑑カード</strong>が必要です。
        印鑑を届け出たあと、印鑑カード交付申請書を法務局に出すと交付されます。
      </P>
      <P>
        このカードは会社に1枚という運用が基本で、
        紛失すると廃止の届出をしてから再交付を受けることになります。
        金庫か、代表者印と同じ場所で管理しておくのが無難です。
      </P>

      <H2>3. 取り方は3つ</H2>
      <P>
        <strong>①窓口で取る</strong>。印鑑カードを持って、最寄りの法務局の証明書発行窓口に行きます。
        会社の管轄でなくても、全国どこの法務局でも取れます。その場で受け取れるのが利点です。
      </P>
      <P>
        <strong>②オンラインで請求する</strong>。「登記・供託オンライン申請システム」から請求し、
        郵送で受け取るか、法務局の窓口で受け取ります。
        このときも<strong>印鑑カードの番号</strong>を入力するので、カードは手元に要ります。
      </P>
      <P>
        <strong>③郵送で請求する</strong>。申請書に印鑑カードを同封して送る方法です。
        カードを預けることになるうえ往復に日数がかかるため、急ぐときには向きません。
      </P>
      <Note>
        手数料は登記手数料令で定められており、請求のしかたと受取のしかたで変わります
        （窓口請求より、オンライン請求のほうが安く設定されています）。
        金額と必要書類の最新の取扱いは、法務局のウェブサイトまたは窓口でご確認ください。
      </Note>

      <H2>4. どういう場面で求められるか</H2>
      <P>
        会社の印鑑証明書は、<strong>その書類に押してあるハンコが、
        たしかに登記された代表者印であること</strong>を示すために添えます。
        銀行の融資、不動産の売買や賃貸借、自動車の登録、
        官公庁への入札、他社との重要な契約などで求められます。
      </P>
      <P>
        逆に、日々の請求書や見積書に印鑑証明書が要ることはまずありません。
        そこで押しているのは角印（社印）で、こちらは登記とは関係のないハンコです。
        違いは
        <Link href="/guide/kaisha-inkan" className="underline">
          会社設立に必要な印鑑は何本か
        </Link>
        で整理しています。
      </P>

      <H2>5. 有効期限の考え方</H2>
      <P>
        印鑑証明書そのものに期限は書かれていません。
        期限を決めているのは<strong>提出先</strong>で、
        「発行から3か月以内」とされることが多く、登記の添付書類でも3か月以内が基本です。
      </P>
      <P>
        必要な通数と、いつ時点のものが要るかは、提出先に先に聞いておくと取り直しを避けられます。
      </P>

      <H2>6. 届け出る印鑑をこれから決める場合</H2>
      <P>
        印鑑証明書に載るのは、届け出た代表者印の印影です。
        つまり、ここで選んだ印影が、以後この会社の対外的な証明の顔になります。
      </P>
      <P>
        本サイトのツールでは、会社名を入れるだけで丸印（代表者印）の印影を無料で作れます。
        商号が枠に対してどう収まるかを見てから実物を注文すると、彫り直しを避けられます。
        ここで作った画像を法務局に届け出ることはできませんので、確認用としてお使いください。
      </P>
    </GuideArticle>
  );
}

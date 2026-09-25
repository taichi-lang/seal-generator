import type { Metadata } from "next";
import Link from "next/link";
import GuideArticle, { H2, Note, P } from "@/components/GuideArticle";
import { findGuide } from "@/lib/guides";
import { OG_IMAGE_PATH, SERVICE_NAME } from "@/lib/site";

const guide = findGuide("godo-kaisha-inkan")!;

export const metadata: Metadata = {
  title: `${guide.title} | ${SERVICE_NAME}`,
  description: guide.description,
  alternates: { canonical: "/guide/godo-kaisha-inkan" },
  openGraph: {
    title: guide.title,
    description: guide.description,
    url: "/guide/godo-kaisha-inkan",
    type: "article",
    images: [OG_IMAGE_PATH],
  },
};

export default function Page() {
  return (
    <GuideArticle guide={guide}>
      <P>
        合同会社は、株式会社とくらべて設立の手順が一つ少なく、印鑑まわりも少しだけ違います。
        違うのは「定款の認証が要らないこと」と「代表者印に彫る肩書き」の2点で、
        大きさの決まりや届出の要否は株式会社と同じです。順に見ていきます。
      </P>

      <H2>1. 合同会社は定款の認証が要らない</H2>
      <P>
        株式会社をつくるときは、作った定款を公証役場に持ち込んで認証してもらう必要があります。
        <strong>合同会社にはこの手続きがありません</strong>。定款は作りますが、認証は受けずにそのまま登記に進みます。
      </P>
      <P>
        印鑑の観点で言うと、これは
        <strong>「会社の印鑑が登場する場面が、登記の申請1回だけになる」</strong>
        ということです。株式会社では認証の場面で発起人個人の印鑑証明書が要りましたが、
        合同会社ではその場面自体がありません。
      </P>
      <Note>
        根拠: 会社法第30条第1項は株式会社の定款について認証を求める規定で、合同会社には及びません。
        手続きの詳細は、申請先の法務局や公証役場にご確認ください。
      </Note>

      <H2>2. 代表者印は「代表社員印」になる</H2>
      <P>
        合同会社では、会社を代表する人を<strong>代表社員</strong>と呼びます。
        株式会社の「代表取締役」にあたる立場です。
        そのため、登記所に届け出る会社実印（丸印）に彫る肩書きも、
        「代表取締役印」ではなく<strong>「代表社員印」</strong>とするのが一般的です。
      </P>
      <P>
        丸印は、外側のふちに沿って会社名を、中央に肩書きを入れる二重丸の形が広く使われています。
        合同会社であれば、外周が「合同会社○○」、中央が「代表社員印」という組み合わせになります。
        これは法令で決まった書き方ではなく、慣行です。
      </P>

      <H2>3. 大きさの決まりは株式会社と同じ</H2>
      <P>
        登記所に届け出る印鑑は、
        一辺1cmの正方形に収まってしまうほど小さいものと、
        一辺3cmの正方形に収まらないほど大きいものは受け付けられません。
        この決まりは会社の種類で変わらないので、合同会社の代表社員印にもそのまま当てはまります。
        形は丸でも四角でもかまいません。
      </P>
      <Note>根拠: 商業登記規則第9条第3項。銀行印・角印にはこの決まりは及びません。</Note>

      <H2>4. オンライン申請なら印鑑の届出は任意</H2>
      <P>
        2021年（令和3年）2月15日から、登記の申請をオンラインで行う場合、
        印鑑の提出は<strong>任意</strong>になりました。これも会社の種類を問いません。
        ただし、印鑑を届け出ていないと<strong>会社の印鑑証明書は発行されません</strong>。
        取引先や金融機関から会社の印鑑証明書を求められる場面があるため、
        届け出ておく会社が多いのが実情です。
      </P>
      <P>
        なお、代表社員が複数いる場合は、それぞれが自分の印鑑を届け出ることができます。
        誰が届け出るかで印鑑証明書を取れる人が変わるため、
        実際の届出は法務局にご確認のうえ決めてください。
      </P>
      <Note>
        根拠:{" "}
        <a
          href="https://www.moj.go.jp/MINJI/minji06_00070.html"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          法務省「商業登記規則が改正され，オンライン申請がより便利になりました（令和3年2月15日から）」
        </a>
        。
      </Note>

      <H2>5. 角印は届出不要。日々の書類で使うのはこちら</H2>
      <P>
        請求書や見積書に押す角印（社印）は、どこにも登録しない会社の認印です。
        届出も大きさの決まりもないので、合同会社でも自由に作れます。
        彫る文字は「合同会社○○之印」または「○○之印」が一般的で、
        3列に組むときは1列目に「合同会社」を置くと読みやすくなります。
      </P>
      <P>
        設立の手続きで実際に使うのは丸印のほうですが、
        <strong>会社が動き出したあと、いちばん出番が多いのは角印です</strong>。
        どちらも本サイトのツールで、注文する前に画面上で試すことができます。
      </P>
      <P>
        角印を押す位置については、
        <Link href="/guide/kakuin-tsukaikata" className="underline">
          角印（社印）の押し方
        </Link>
        で別に整理しています。
      </P>
    </GuideArticle>
  );
}

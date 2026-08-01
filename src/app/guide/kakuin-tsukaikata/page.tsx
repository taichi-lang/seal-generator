import type { Metadata } from "next";
import GuideArticle, { H2, Note, P } from "@/components/GuideArticle";
import { findGuide } from "@/lib/guides";
import { SERVICE_NAME } from "@/lib/site";

const guide = findGuide("kakuin-tsukaikata")!;

export const metadata: Metadata = {
  title: `${guide.title} | ${SERVICE_NAME}`,
  description: guide.description,
  alternates: { canonical: "/guide/kakuin-tsukaikata" },
  openGraph: {
    title: guide.title,
    description: guide.description,
    url: "/guide/kakuin-tsukaikata",
    type: "article",
  },
};

export default function Page() {
  return (
    <GuideArticle guide={guide}>
      <P>
        先に結論を書きます。請求書や見積書への押印は、
        <strong>法律上は必須ではありません</strong>。
        それでも押すのは、取引先の慣習に合わせるためと、
        発行元がはっきりして受け取る側が安心するためです。
      </P>

      <H2>1. 押す位置</H2>
      <P>
        角印は、書類の右上か左上にある「自社の会社名・住所」の欄に押します。
        会社名の文字に少しだけ重なるように押すのが一般的です。
        文字にかけるのは、印影だけを切り取って別の書類に貼り直すことをしにくくするためだと言われています。
      </P>
      <P>
        重ねる量は、社名の末尾の1〜2文字にかかる程度が目安です。
        全体を覆ってしまうと会社名が読めなくなるので、かけすぎないようにします。
      </P>

      <H2>2. そもそも押さなくてよいのか</H2>
      <P>
        国の見解として、契約書に押印がなくても法律違反にはならない、と明記された文書があります。
        押印がない場合に、代わりに何を残しておけば書類の成立を示せるか（メールのやりとりの記録など）まで整理されています。
      </P>
      <Note>
        根拠:{" "}
        <a
          href="https://www.moj.go.jp/content/001322410.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          内閣府・法務省・経済産業省「押印についてのQ&amp;A」（令和2年6月19日）
        </a>
        （PDF）。
      </Note>

      <H2>3. インボイス（適格請求書）にも押印の欄はない</H2>
      <P>
        2023年10月から始まったインボイス制度で、適格請求書に書くべき項目が決まりました。
        発行者の氏名または名称と登録番号、取引年月日、取引内容、
        税率ごとに区分した合計額と適用税率、税率ごとの消費税額、
        そして交付を受ける事業者の氏名または名称です。
      </P>
      <P>
        この中に<strong>押印は含まれていません</strong>。
        角印が押されていないという理由だけで、適格請求書として認められなくなることはありません。
      </P>
      <Note>
        記載事項は国税庁タックスアンサー No.6625「適格請求書等の記載事項」に基づきます。
        自社が該当するかどうかの判断は、税理士または所轄の税務署にご確認ください。
      </Note>

      <H2>4. 紙に押すか、画像を貼るか</H2>
      <P>
        PDFで請求書を送るのが当たり前になり、
        印刷して押印し、また取り込んでPDFに戻す、という手順は減っています。
        角印の画像（電子印鑑）を書類に貼り付ける方法なら、この往復がなくなります。
      </P>
      <P>
        ただし、印影の画像そのものに「本人が押した」ことを証明する力があるわけではありません。
        本人性をきちんと担保したい契約書などでは、電子署名のサービスを使うのが本来の形です。
        請求書・見積書・納品書のように、体裁として発行元を示す用途であれば、画像で足りることがほとんどです。
      </P>

      <H2>5. 作るときの実務的な注意</H2>
      <P>
        角印の画像は、<strong>背景が透明なPNG</strong>で用意します。
        背景が白のままだと、書類に貼ったときに白い四角が会社名を隠してしまうためです。
      </P>
      <P>
        大きさは、画面で見るだけなら一辺500px前後で足ります。
        印刷して配る書類に使うなら、粗さが目立たないよう1000px以上を用意しておくと安心です。
        本サイトのツールは、無料の書き出しでも透かしを入れていません。
      </P>

    </GuideArticle>
  );
}

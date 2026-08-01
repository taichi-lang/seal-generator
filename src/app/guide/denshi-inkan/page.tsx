import type { Metadata } from "next";
import GuideArticle, { H2, Note, P } from "@/components/GuideArticle";
import { findGuide } from "@/lib/guides";
import { SERVICE_NAME } from "@/lib/site";

const guide = findGuide("denshi-inkan")!;

export const metadata: Metadata = {
  title: `${guide.title} | ${SERVICE_NAME}`,
  description: guide.description,
  alternates: { canonical: "/guide/denshi-inkan" },
  openGraph: {
    title: guide.title,
    description: guide.description,
    url: "/guide/denshi-inkan",
    type: "article",
  },
};

export default function Page() {
  return (
    <GuideArticle guide={guide}>
      <P>
        「電子印鑑」と呼ばれるものには、大きく2種類あります。
        ひとつは<strong>印影の画像</strong>で、書類に貼り付けて見た目を整えるためのものです。
        もうひとつは<strong>電子署名</strong>で、誰がいつ承認したかを記録に残す仕組みです。
        このページで扱うのは前者、画像のほうです。
      </P>

      <H2>1. 無料ツールで作れるもの・作れないもの</H2>
      <P>
        会社名を入力して印影の画像を作るツールは、無料のものが複数あります。
        角印（社印）と丸印（代表者印）の見た目を作るところまでは、費用をかけずにできます。
      </P>
      <P>
        一方で、<strong>印鑑登録には使えません</strong>。
        登記所に届け出る会社実印は、実物の印章（ハンコそのもの）を用意して押した印影を届け出るものだからです。
        画像を作っただけでは実印になりません。ここは無料・有料を問わず共通です。
      </P>
      <Note>
        本サイトのツールが生成するのも画像データであり、実物の印章ではありません。
        印鑑登録には使用できません。
      </Note>

      <H2>2. 実物を注文する前の「下見」に使う</H2>
      <P>
        法人印鑑の3本セットは、材質にもよりますが、おおむね3,000円台から2万円前後です。
        金額そのものより問題になるのは、<strong>彫ってしまうとやり直しがきかない</strong>ことです。
      </P>
      <P>
        たとえば角印なら、次のような点は、実際に印影の形にしてみないと判断が難しいものです。
      </P>
      <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-zinc-800 dark:text-zinc-200 leading-7">
        <li>「株式会社」を1列目に置いたとき、社名の残りが何列に割れるか</li>
        <li>「之印」を付けるか、社名だけにするか</li>
        <li>社名が長い場合に、文字が細くなりすぎないか</li>
        <li>枠を太くしたほうが押印らしく見えるか</li>
      </ul>
      <P>
        画面上で会社名を入れ替えながら見比べれば、注文する前にここを決められます。
        これは、実物の印鑑を売っているお店では代わりにできないことです。
      </P>

      <H2>3. 画像として使うときの条件</H2>
      <P>
        書類に貼るなら、<strong>背景が透明なPNG</strong>であることが必須です。
        背景が白いままだと、貼り付けた場所の文字を白い四角で隠してしまいます。
      </P>
      <P>
        もうひとつ確認したいのが、無料で書き出した画像に
        <strong>透かし（サンプル文字）が入らないか</strong>です。
        透かしの入った画像は、そのままでは取引先に送る書類に使えません。
        本サイトは、無料の書き出しにも透かしを入れていません。
      </P>

      <H2>4. 実物と画像の使い分け</H2>
      <P>
        両方をそろえる必要はありません。用途で分けるのが現実的です。
      </P>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-300 dark:border-zinc-700 text-left">
              <th className="py-2 pr-3 font-medium text-zinc-700 dark:text-zinc-300">場面</th>
              <th className="py-2 font-medium text-zinc-700 dark:text-zinc-300">適したもの</th>
            </tr>
          </thead>
          <tbody className="text-zinc-800 dark:text-zinc-200">
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="py-2 pr-3">登記の申請、印鑑証明書が要る手続き</td>
              <td className="py-2">実物の会社実印（届出が必要）</td>
            </tr>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="py-2 pr-3">法人口座の開設・取引</td>
              <td className="py-2">実物の銀行印</td>
            </tr>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="py-2 pr-3">PDFで送る請求書・見積書</td>
              <td className="py-2">角印の画像（透過PNG）</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">紙でやりとりする請求書・納品書</td>
              <td className="py-2">実物の角印</td>
            </tr>
          </tbody>
        </table>
      </div>

      <P>
        会社を立ち上げた直後は、登記の手続きと並行して請求書を出し始めることになります。
        実物の印鑑が届くまでの間、PDFの書類だけでも先に体裁を整えたい、
        という場面で画像の角印が役に立ちます。
      </P>
    </GuideArticle>
  );
}

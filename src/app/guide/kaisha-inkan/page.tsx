import type { Metadata } from "next";
import GuideArticle, { H2, Note, P } from "@/components/GuideArticle";
import { findGuide } from "@/lib/guides";
import { SERVICE_NAME } from "@/lib/site";

const guide = findGuide("kaisha-inkan")!;

export const metadata: Metadata = {
  title: `${guide.title} | ${SERVICE_NAME}`,
  description: guide.description,
};

export default function Page() {
  return (
    <GuideArticle guide={guide}>
      <P>
        会社をつくるとき、印鑑は「3本セット」で売られていることが多いです。
        ただ、3本すべてが登記に必要なわけではありません。
        どれが手続きで要るもので、どれが日々の書類で使うものなのかを分けて整理します。
      </P>

      <H2>1. 3本セットの中身と役割</H2>
      <P>
        通販で「会社設立3本セット」として売られているのは、
        会社実印（代表者印）・銀行印・角印（社印）の3本です。役割は次のように分かれます。
      </P>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-300 dark:border-zinc-700 text-left">
              <th className="py-2 pr-3 font-medium text-zinc-700 dark:text-zinc-300">印鑑</th>
              <th className="py-2 pr-3 font-medium text-zinc-700 dark:text-zinc-300">主な用途</th>
              <th className="py-2 font-medium text-zinc-700 dark:text-zinc-300">登記所への届出</th>
            </tr>
          </thead>
          <tbody className="text-zinc-800 dark:text-zinc-200">
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="py-2 pr-3">会社実印（代表者印）</td>
              <td className="py-2 pr-3">登記申請、重要な契約書</td>
              <td className="py-2">届け出て初めて「実印」になる</td>
            </tr>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="py-2 pr-3">銀行印</td>
              <td className="py-2 pr-3">法人口座の開設・取引</td>
              <td className="py-2">不要（金融機関に届け出る）</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">角印（社印）</td>
              <td className="py-2 pr-3">請求書・見積書・納品書</td>
              <td className="py-2">不要（会社の認印にあたる）</td>
            </tr>
          </tbody>
        </table>
      </div>

      <P>
        角印は、どこにも登録しない「会社の認印」です。
        認印とは、役所に登録していない、日常の書類に押すハンコのことをいいます。
        登録が要らないぶん、会社ごとに自由に作れます。
      </P>

      <H2>2. 会社実印には大きさの決まりがある</H2>
      <P>
        登記所に届け出る会社実印だけは、大きさが法令で決まっています。
        一辺1cmの正方形に収まってしまうほど小さいものと、
        一辺3cmの正方形に収まらないほど大きいものは、届け出ることができません。
        つまり、1cm角より大きく3cm角より小さい範囲、というのが決まりです。形は丸でも四角でもかまいません。
      </P>
      <Note>
        根拠: 商業登記規則第9条第3項。銀行印・角印にはこの決まりは及びません。
      </Note>

      <H2>3. どの場面で印鑑が要るのか</H2>
      <P>
        会社設立の手続きは、おおまかに「定款をつくる → 登記を申請する」という順に進みます。
        印鑑が登場するのは次の場面です。
      </P>
      <P>
        <strong>定款の認証（株式会社の場合）</strong>
        — 公証役場で定款を認証してもらいます。ここで必要になるのは、
        会社の印鑑ではなく<strong>発起人（出資して会社を立ち上げる人）個人の印鑑証明書</strong>です。
        なお合同会社は定款の認証そのものが不要です。
      </P>
      <P>
        <strong>登記の申請</strong>
        — 法務局に申請します。このときに、会社の印鑑を登記所に届け出る
        「印鑑届出書」を一緒に出すのが従来の流れでした。
      </P>

      <H2>4. オンライン申請なら印鑑の提出は任意</H2>
      <P>
        2021年（令和3年）2月15日から、登記の申請をオンラインで行う場合、
        印鑑の提出は<strong>任意</strong>になりました。
        書面で申請する場合は、これまでどおり届け出た印鑑を使います。
      </P>
      <P>
        ただし「任意」は「不要」とは少し違います。
        会社の印鑑証明書は、印鑑を届け出ていないと発行してもらえません。
        補助金の申請や不動産の取引などで会社の印鑑証明書を求められる場面があるため、
        実務では届け出ておく会社が多いのが実情です。
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
        。手続きの詳細や最新の取扱いは、申請先の法務局にご確認ください。
      </Note>

      <H2>5. 実物を買う前にできること</H2>
      <P>
        法人印鑑の3本セットは、材質にもよりますが、おおむね3,000円台から2万円前後で売られています。
        彫り上がってしまうと、書体や文字の配置は変えられません。
      </P>
      <P>
        角印については、実物を注文する前に画面でデザインを確かめることができます。
        「株式会社」を1列目に置いた3列組みが読みやすいか、
        「之印」を付けるか付けないか、といった判断は、実際に印影の形にしてみないと決めにくいためです。
        本サイトのツールは、その確認を無料で行えるようにしたものです。
      </P>
    </GuideArticle>
  );
}

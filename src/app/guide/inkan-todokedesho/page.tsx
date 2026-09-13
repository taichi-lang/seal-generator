import type { Metadata } from "next";
import Link from "next/link";
import GuideArticle, { H2, Note, P } from "@/components/GuideArticle";
import { findGuide } from "@/lib/guides";
import { OG_IMAGE_PATH, SERVICE_NAME } from "@/lib/site";

const guide = findGuide("inkan-todokedesho")!;

export const metadata: Metadata = {
  title: `${guide.title} | ${SERVICE_NAME}`,
  description: guide.description,
  alternates: { canonical: "/guide/inkan-todokedesho" },
  openGraph: {
    title: guide.title,
    description: guide.description,
    url: "/guide/inkan-todokedesho",
    type: "article",
    images: [OG_IMAGE_PATH],
  },
};

export default function Page() {
  return (
    <GuideArticle guide={guide}>
      <P>
        会社を登記するときに、代表者の印鑑を法務局に届け出る書類が
        <strong>印鑑届書</strong>です。「印鑑届出書」と書かれることもありますが、
        法務局が配っている用紙の名前は「印鑑届書」です。同じものを指しています。
      </P>

      <H2>1. そもそも提出しなければならないのか</H2>
      <P>
        <strong>書面で登記を申請するときは、印鑑の提出が必要です。</strong>
        一方、<strong>オンラインで登記を申請するときは、印鑑の提出は任意</strong>になりました。
        2021年（令和3年）2月15日以降の取扱いです。
      </P>
      <P>
        ただし「任意になった」は「もう要らない」ではありません。
        印鑑を届け出ていないと、あとで説明する<strong>会社の印鑑証明書が取れません</strong>。
        融資や不動産の契約で印鑑証明書を求められる場面は残っているので、
        設立のタイミングで一緒に届け出ておくほうが、あとの手間は少なくなります。
      </P>
      <Note>
        根拠: 商業登記規則の改正（令和3年2月15日施行）による、オンライン申請時の印鑑提出の任意化。
        設立の登記そのものの要件は会社の種類や申請方法で変わります。
        個別の可否は管轄の法務局にご確認ください。
      </Note>

      <H2>2. 届け出る印鑑の大きさには決まりがある</H2>
      <P>
        届け出られるのは、
        <strong>辺の長さが1cmを超え、3cm以内の正方形に収まる大きさ</strong>の印鑑です。
        丸い印鑑なら、その円がこの正方形に収まっている必要があります。
        市販の代表者印が直径18mm前後に集まっているのは、この範囲の内側だからです。
      </P>
      <P>
        大きすぎても小さすぎても受け付けられません。
        また、ゴム印のように形が変わるもの、印影が不鮮明なものも使えません。
      </P>
      <Note>
        根拠: 商業登記規則第9条第3項（印鑑の大きさ等）。
        照合できない印影は受理されない旨も同条に定めがあります。
      </Note>

      <H2>3. 書く項目</H2>
      <P>
        用紙は法務局のウェブサイトで配布されています。埋めるのは、おおよそ次の項目です。
      </P>
      <P>
        <strong>①届け出る印鑑</strong>（枠の中に押す）／
        <strong>②商号・名称</strong>／<strong>③本店・主たる事務所</strong>／
        <strong>④資格</strong>（代表取締役、代表社員など）／<strong>⑤氏名</strong>／
        <strong>⑥生年月日</strong>／<strong>⑦会社法人等番号</strong>（設立時は空欄）／
        <strong>⑧届出人の欄</strong>（本人か代理人か）。
      </P>
      <P>
        設立と同時に出す場合、会社法人等番号はまだ振られていないので空欄のままで構いません。
        商号と本店は、<strong>登記申請書に書いたものと1字も違わないように</strong>写します。
        「株式会社」が前に付くか後ろに付くかも含めて同じにします。
      </P>

      <H2>4. 添えるもの</H2>
      <P>
        届出人本人が出す場合、<strong>市区町村が発行した個人の印鑑証明書</strong>（作成後3か月以内）を添えます。
        このとき、届出人の欄には<strong>個人の実印</strong>を押します。
        会社の印鑑を押す欄と、個人の実印を押す欄が別にあるので、取り違えないようにします。
      </P>
      <P>
        代理人が出す場合は、これに加えて委任状が要ります。
        委任状には委任した本人の個人実印を押します。
      </P>

      <H2>5. 出したあと — 印鑑カード</H2>
      <P>
        印鑑を届け出ただけでは、まだ印鑑証明書は取れません。
        別に<strong>印鑑カード交付申請書</strong>を出して、印鑑カードを受け取ります。
        このカードを持って窓口に行くと、会社の印鑑証明書が発行されます。
      </P>
      <P>
        取り方は
        <Link href="/guide/inkan-shomeisho-kaisha" className="underline">
          会社の印鑑証明書の取り方
        </Link>
        にまとめています。
      </P>

      <H2>6. 届け出る前に、印影を見ておく</H2>
      <P>
        代表者印は、外周に商号、中心に「代表取締役印」と彫るのが一般的です。
        商号が長いと外周の文字が細かくなり、逆に短いと間延びします。
        彫ってしまうと直せないうえ、届け出た印鑑を変えるには改印の届出が要ります。
      </P>
      <P>
        本サイトのツールは、会社名を入れるだけで丸印（代表者印）の印影をその場で作れます。
        注文する前に、商号の見え方だけでも画面で確かめておくと確実です。
        なお、ここで作れるのは<strong>画面上の印影</strong>で、これ自体を法務局に届け出ることはできません。
      </P>
    </GuideArticle>
  );
}

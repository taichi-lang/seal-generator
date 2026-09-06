import type { Metadata } from "next";
import Link from "next/link";
import GuideArticle, { H2, Note, P } from "@/components/GuideArticle";
import { findGuide } from "@/lib/guides";
import { OG_IMAGE_PATH, SERVICE_NAME } from "@/lib/site";

const guide = findGuide("kakuin-osu-basho")!;

export const metadata: Metadata = {
  title: `${guide.title} | ${SERVICE_NAME}`,
  description: guide.description,
  alternates: { canonical: "/guide/kakuin-osu-basho" },
  openGraph: {
    title: guide.title,
    description: guide.description,
    url: "/guide/kakuin-osu-basho",
    type: "article",
    images: [OG_IMAGE_PATH],
  },
};

export default function Page() {
  return (
    <GuideArticle guide={guide}>
      <P>
        角印（社印）を押す場所には、<strong>法律上の決まりはありません</strong>。
        決まっているのは慣行のほうです。ここでは、まず結論として置く位置を示し、
        そのあと「会社名に重ねるか、重ねないか」と、申請書のように押印欄が決まっている場合を分けて説明します。
      </P>

      <H2>1. 結論 — 社名・住所を書いたブロックの、社名の末尾あたり</H2>
      <P>
        請求書・見積書・納品書では、
        <strong>発行者（自社）の社名や住所を書いたブロックの、社名の末尾あたり</strong>に押すのが一般的です。
        用紙の右上か右下に発行者情報がまとまっていることが多いので、結果としてそのブロックの中に収まります。
      </P>
      <P>
        書類の中央や、相手先の宛名の側に押すことはありません。
        角印は「この書類はこの会社が出したものだ」と示す位置に置くもので、
        <strong>発行者の名前とセットで意味を持つ</strong>ためです。
      </P>

      <H2>2. 会社名に重ねるか、重ねないか</H2>
      <P>
        よくある慣行は、<strong>社名の最後の1〜2文字に、印影を少しかける</strong>押し方です。
        理由としては「印影の部分だけを切り取って別の書類に流用されにくくするため」という説明が広く使われています。
      </P>
      <P>
        一方で、<strong>文字にかけず、社名の右横の余白に単独で押す運用も普通に行われています</strong>。
        社名が読めなくなるほど重ねてしまうと、かえって書類として読みにくくなるためです。
      </P>
      <P>
        どちらでも構いません。実務上の基準は次の2つだけです。
        <strong>①社名の文字が読めなくならないこと</strong>、
        <strong>②取引先や社内で様式が決まっていれば、それに従うこと</strong>。
      </P>
      <Note>
        「重ねなければ無効」「重ねると失礼」といった決まりは、法令にも会計のルールにもありません。
        ここで書いているのは商慣行であり、当方が法的な効力を判定したものではありません。
        取引先から様式を指定されている場合は、その指定が優先します。
      </Note>

      <H2>3. そもそも押さなくてよい場合が多い</H2>
      <P>
        請求書や見積書に押印する<strong>法的な義務はありません</strong>。
        消費税の適格請求書（インボイス）として必要な記載事項にも、押印は含まれていません。
      </P>
      <P>
        それでも押されているのは、受け取る側が「押されているほうが体裁が整っている」と見なす慣行が
        残っているためです。相手が求めていないなら、押さないという選択もそのまま成立します。
      </P>
      <Note>
        根拠: 適格請求書に必要な記載事項は消費税法で定められており、押印は項目に含まれません。
        個別の取引で押印が必要かどうかは、契約書や取引先の規定で決まります。
      </Note>
      <P>
        押印が要るかどうかの整理は
        <Link href="/guide/kakuin-tsukaikata" className="underline">
          角印（社印）の押し方
        </Link>
        にまとめています。
      </P>

      <H2>4. 申請書など、押印欄が決まっている場合</H2>
      <P>
        官公庁の申請書や金融機関の届出書のように<strong>押印欄が印刷されている書類</strong>では、
        位置を自分で決める余地はありません。<strong>枠の中に、枠からはみ出さないように押します</strong>。
      </P>
      <P>
        このとき注意が要るのは位置よりも<strong>どの印鑑を押すか</strong>です。
        こうした書類で求められるのは多くの場合<strong>会社実印（代表者印）</strong>であり、角印ではありません。
        「代表者印」「実印」「登記所に届け出た印鑑」と書かれていれば、角印を押しても要件を満たしません。
      </P>
      <P>
        印鑑の種類の使い分けは
        <Link href="/guide/kaisha-inkan" className="underline">
          会社設立に必要な印鑑は何本か
        </Link>
        で整理しています。法務局への届出そのものは
        <Link href="/guide/inkan-todokedesho" className="underline">
          印鑑届書の書き方
        </Link>
        をご覧ください。
      </P>

      <H2>5. きれいに押すための実務的な注意</H2>
      <P>
        角印は面積が広いぶん、朱肉のむらが出やすい印鑑です。
        下に<strong>捺印マット</strong>を敷き、垂直に置いてから全体に均等に力をかけると、かすれにくくなります。
      </P>
      <P>
        押し直しは基本的にできません。書類そのものを作り直すのが確実です。
        失敗した印影の上から二重に押すと、どちらの印影も照合できなくなります。
      </P>

      <H2>6. 位置を何度でも試したいときは、画面上で決める</H2>
      <P>
        紙に押す前に配置を決めておきたい場合、印影を画像として作っておくと、
        書類のレイアウト上で<strong>重ね方や大きさを何度でも試せます</strong>。
        本サイトのツールは、会社名を入れるだけで角印の印影をその場で作れます。
      </P>
      <P>
        画像として使う場合の注意点は
        <Link href="/guide/denshi-inkan" className="underline">
          電子印鑑を無料で作る方法
        </Link>
        にまとめています。ここで作れるのは<strong>画面上の印影</strong>で、
        印鑑登録や法務局への届出に使えるものではありません。
      </P>
    </GuideArticle>
  );
}

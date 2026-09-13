import type { Metadata } from "next";
import Link from "next/link";
import GuideArticle, { H2, Note, P } from "@/components/GuideArticle";
import { findGuide } from "@/lib/guides";
import { FREE_SIZE } from "@/lib/pricing";
import { OG_IMAGE_PATH, SERVICE_NAME } from "@/lib/site";

const guide = findGuide("denshi-inkan-tsukurikata")!;

export const metadata: Metadata = {
  title: `${guide.title} | ${SERVICE_NAME}`,
  description: guide.description,
  alternates: { canonical: "/guide/denshi-inkan-tsukurikata" },
  openGraph: {
    title: guide.title,
    description: guide.description,
    url: "/guide/denshi-inkan-tsukurikata",
    type: "article",
    images: [OG_IMAGE_PATH],
  },
};

export default function Page() {
  return (
    <GuideArticle guide={guide}>
      <P>
        電子印鑑を作る作業は、<strong>①印影の画像を用意する</strong>、
        <strong>②書類に貼って位置を決める</strong>の2段階しかありません。
        つまずくのはたいてい②のほうで、原因は
        <strong>背景が白いまま貼っていること</strong>か、
        <strong>画像の配置設定が「行内」のままになっていること</strong>のどちらかです。
        ここでは①から順に、その2点を潰しながら進めます。
      </P>

      <H2>1. 印影の画像を作る</H2>
      <P>
        会社名を入れると、その場で角印・丸印の印影を作れます。
        書き出される PNG は<strong>背景が透けた状態</strong>で、無料のまま一辺{" "}
        {FREE_SIZE}px です。画面上の書類やPDFに貼る用途であればこの大きさで足ります。
      </P>
      <P>
        <Link href="/" className="underline">
          トップページのツール
        </Link>
        で会社名を入力し、角印か丸印を選んで書き出してください。ソフトのインストールは要りません。
      </P>
      <Note>
        ここで作れるのは<strong>画面上の印影</strong>です。印鑑登録や法務局への届出には使えません。
        実物の印鑑が要る場面については
        <Link href="/guide/kaisha-inkan" className="underline">
          会社設立に必要な印鑑は何本か
        </Link>
        をご覧ください。
      </Note>

      <H2>2. 「背景が透けている」がなぜ重要か</H2>
      <P>
        印鑑の画像でいちばん多い失敗は、<strong>四角い白地ごと書類に貼ってしまう</strong>ことです。
        白い紙の上なら気づきにくいのですが、罫線や文字の上に重ねた瞬間に、
        画像の四角が下の内容を隠してしまいます。
      </P>
      <P>
        これを避けるには、背景が透けた形式で保存された画像を使います。
        <strong>PNG は背景の透過を保持できる形式で、JPEG は保持できません</strong>。
        JPEG で保存し直すと、透けていた部分は白で塗りつぶされます。
        一度白くなった背景は、あとから元に戻せません。
      </P>
      <Note>
        スクリーンショットで印影を切り取る方法でも画像自体は作れますが、
        その場合の背景は<strong>透過ではなく白</strong>です。上に書いた問題がそのまま起きます。
      </Note>

      <H2>3. エクセルに貼る</H2>
      <P>
        <strong>［挿入］→［画像］→［このデバイス］</strong>で PNG を選びます。
        貼った直後の画像はセルとは無関係に浮いているだけなので、次の2つを決めます。
      </P>
      <P>
        <strong>①大きさ</strong>: 角をドラッグして縮めます。角以外の辺をドラッグすると縦横比が崩れ、
        印影がゆがみます。<strong>②セルと一緒に動くかどうか</strong>: 画像を右クリックして
        ［サイズとプロパティ］を開き、［プロパティ］の中から
        <strong>「セルに合わせて移動するがサイズ変更はしない」</strong>を選んでおくと、
        行の高さを変えても印影の大きさが変わりません。
      </P>
      <P>
        請求書の押印欄のように<strong>枠が決まっている場合は、枠からはみ出さない大きさ</strong>にします。
        枠が無い請求書・見積書での置き場所は
        <Link href="/guide/kakuin-osu-basho" className="underline">
          角印を押す場所
        </Link>
        にまとめています。
      </P>

      <H2>4. ワードに貼る</H2>
      <P>
        ワードでつまずくのは、ほぼ<strong>文字列の折り返し</strong>の設定です。
        貼った直後は<strong>「行内」</strong>になっていて、画像が1つの文字として扱われるため、
        社名の上に重ねようとしても行が押し広げられるだけで重なりません。
      </P>
      <P>
        画像を選んで<strong>［図の形式］→［文字列の折り返し］→［前面］</strong>に変えると、
        文字の上に自由に置けるようになります。そのうえで社名の末尾あたりへ動かします。
      </P>
      <Note>
        社名に少し重ねる押し方は商慣行であり、法令上の決まりではありません。
        重ねる／重ねないの判断は
        <Link href="/guide/kakuin-tsukaikata" className="underline">
          角印（社印）の押し方
        </Link>
        で整理しています。
      </Note>

      <H2>5. PDF に貼る</H2>
      <P>
        すでに PDF になっている書類に押す場合は、
        <strong>PDF を編集できるソフトの「画像を追加」「スタンプ」機能</strong>から PNG を読み込みます。
        Acrobat Reader のような閲覧専用のソフトには、画像を貼る機能はありません。
      </P>
      <P>
        編集ソフトが手元に無いなら、<strong>PDF にする前の元ファイル（エクセル・ワード）に貼ってから
        PDF として書き出す</strong>ほうが確実です。この順番なら追加のソフトは要りません。
      </P>

      <H2>6. 電子印鑑で代用できない場面</H2>
      <P>
        画像の印影は、<strong>誰でも複製できます</strong>。そのため、
        本人性の確認そのものを押印に頼っている手続きでは使えません。
        代表的なのは<strong>法務局への印鑑の届出、印鑑登録、印鑑証明書が求められる契約</strong>です。
      </P>
      <P>
        これらは実物の印鑑と、登録された印影の照合が前提になっています。
        会社の印鑑証明書のほうは
        <Link href="/guide/inkan-shomeisho-kaisha" className="underline">
          会社の印鑑証明書の取り方
        </Link>
        に、届出の書式は
        <Link href="/guide/inkan-todokedesho" className="underline">
          印鑑届書の書き方
        </Link>
        にまとめています。
      </P>
      <P>
        一方で、<strong>請求書・見積書・納品書・社内の回覧</strong>のように、
        そもそも押印の法的な義務が無い書類であれば、画像の印影で困る場面はほとんどありません。
      </P>

      <H2>7. 実物の印鑑を注文する前の下見にも使える</H2>
      <P>
        通販で会社印を注文すると、<strong>彫り上がるまで実物のデザインは見られません</strong>。
        書体や文字の詰まり方を先に確かめたい場合、同じ会社名で印影を作っておくと、
        <strong>画数の多い社名が枠の中でどれくらい詰まるか</strong>を注文前に見比べられます。
      </P>
      <P>
        無料でできる範囲と、実物との違いは
        <Link href="/guide/denshi-inkan" className="underline">
          電子印鑑を無料で作る方法
        </Link>
        に整理しています。
      </P>
    </GuideArticle>
  );
}

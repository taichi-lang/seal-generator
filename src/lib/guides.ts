/** 解説記事のメタデータ。
 *
 * ツール単体では「会社印 作成 無料」しか受け皿がないため、
 * 会社設立の周辺(定款・登記・印鑑届出書)からの検索流入を受ける記事を
 * セットで置く。一覧・各記事・関連リンクがこの1か所を参照する。
 */

export interface GuideMeta {
  slug: string;
  title: string;
  /** 一覧と <meta name="description"> に使う要約。 */
  description: string;
}

export const GUIDES: readonly GuideMeta[] = [
  {
    slug: "kaisha-inkan",
    title: "会社設立に必要な印鑑は何本か — 種類と、いつ必要になるか",
    description:
      "会社実印・銀行印・角印の違いと、定款認証・登記申請・印鑑届出書のどの場面で必要になるかを整理します。オンライン申請では印鑑の提出が任意になった点も解説します。",
  },
  {
    slug: "kakuin-tsukaikata",
    title: "角印（社印）の押し方 — 請求書・見積書のどこに押すか",
    description:
      "角印を押す位置と、そもそも押印が必要かどうかを整理します。適格請求書（インボイス）の記載事項に押印は含まれません。",
  },
  {
    slug: "denshi-inkan",
    title: "電子印鑑を無料で作る方法と、実物の印鑑を注文する前の確認",
    description:
      "無料ツールで作れる印影の範囲と、通販で実物を注文する前にデザインを確かめる使い方をまとめます。印鑑登録には使えない点も説明します。",
  },
] as const;

export function findGuide(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** 指定した記事以外を返す(記事末尾の関連リンク用)。 */
export function otherGuides(slug: string): GuideMeta[] {
  return GUIDES.filter((g) => g.slug !== slug);
}

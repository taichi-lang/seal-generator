/** 同じ運営者が公開している他サイトへのリンク。
 *
 * 全社の相互リンク施策(2026-08-06)で追加した。フッターから他の4事業へ1本ずつリンクする。
 *
 * 期待値は低く見積もっている: 同一運営者のサイト同士のリンクは、検索エンジンにとって
 * 外部からの評価(被リンク)としては弱い。狙いは「クローラーの巡回経路を増やすこと」だけで、
 * これで順位が上がるとは考えていない。
 *
 * URL はすべて追加時に HTTP 200 を実測してから記載している(存在しないURLは書かない)。 */
export type RelatedSite = {
  /** リンク文言。何のサイトかが読んだだけで分かる語にする。 */
  label: string;
  href: string;
};

export const RELATED_SITES: RelatedSite[] = [
  {
    // 会社印を作る人と読者が最も近い(法人設立直後・請求書を初めて出す時期)。
    label: "請求書・見積書・領収書の無料作成",
    href: "https://invoice-tool-kohl.vercel.app",
  },
  {
    // 同上。請求書に押印する場面の解説を書いた本で、当サイトの解説記事と話がつながる。
    label: "書籍『ひとり社長・フリーランスの請求書&インボイス実務』",
    href: "https://www.amazon.co.jp/dp/B0HCW64VV7",
  },
  {
    label: "工具えらび堂(電動工具の選び方)",
    href: "https://kougu-erabido.vercel.app",
  },
  {
    label: "星導Seido(星座占い・タロット)",
    href: "https://seido-web.vercel.app",
  },
];

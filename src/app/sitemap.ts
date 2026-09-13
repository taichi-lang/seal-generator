import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

/** 内容を最後に更新した日。
 *
 * ビルドのたびに現在時刻を入れると、中身が変わっていないのに
 * 「更新した」と検索エンジンに伝えることになるため、手で管理する。
 *
 * 逆に、中身を変えたのに古い日付のまま置くと
 * 「更新していない」と誤って伝えることになる。**ページ単位で持つ。**
 *
 * 更新するのは、そのページの**本文が変わったとき**だけ。
 * og:image の追加のような、検索結果の本文に出ない変更では動かさない。 */
const LAST_MODIFIED = {
  /** 08-16 説明文の書き換え / 08-17 無料プランの商用利用を明記(SealGenerator.tsx)。 */
  top: "2026-08-17",
  /** 解説ページ4件は 08-02 の土台整備が最後。08-23 の og:image は本文ではないので動かさない。 */
  guide: "2026-08-02",
} as const;

/**
 * sitemap.xml
 *
 * 載せるのは検索結果に出したいページだけ。
 * `/legal`(特商法・プライバシーポリシー)と `/unlock`(決済後のダウンロード画面)は
 * 検索から来てほしいページではないので除外する。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: LAST_MODIFIED.top,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/guide`,
      lastModified: LAST_MODIFIED.guide,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...GUIDES.map((guide) => ({
      url: `${SITE_URL}/guide/${guide.slug}`,
      lastModified: LAST_MODIFIED.guide,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

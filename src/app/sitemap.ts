import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

/** 内容を最後に更新した日。
 *
 * ビルドのたびに現在時刻を入れると、中身が変わっていないのに
 * 「更新した」と検索エンジンに伝えることになるため、手で管理する。 */
const LAST_MODIFIED = "2026-08-02";

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
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/guide`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...GUIDES.map((guide) => ({
      url: `${SITE_URL}/guide/${guide.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

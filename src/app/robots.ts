import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt
 *
 * `/unlock` は決済後の個別ページ(URLに購入者だけが持つセッションIDが付く)なので、
 * ページ側の noindex と合わせて、クロール自体も断っておく。
 * `/api/` は画面ではないので同じく除外する。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/unlock", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

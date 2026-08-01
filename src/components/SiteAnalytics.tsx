"use client";

import { Analytics } from "@vercel/analytics/next";

/** アクセス計測。ただし決済後のページは送らない。
 *
 * `/unlock` の URL には Stripe のセッションID(`?session_id=cs_...`)が付く。
 * これは購入した本人だけが持つ値なので、計測サービスに渡さない。
 * `beforeSend` で null を返すと、そのページビューは送信されない。 */
export default function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) =>
        new URL(event.url).pathname.startsWith("/unlock") ? null : event
      }
    />
  );
}

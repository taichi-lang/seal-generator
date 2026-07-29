/** GET /api/unlock?session_id=cs_xxx — 決済済みか検証し、印影の設計値を返す。
 *
 * Stripe に問い合わせて payment_status が paid のときだけ metadata を返す。
 * 併せて利用許諾書に載せる発行番号(セッションID)と購入日時を返す。
 */

import { fromStripeMetadata } from "@/lib/sealDesign";

const STRIPE_SESSION_API = "https://api.stripe.com/v1/checkout/sessions";

/** Stripe の Checkout セッション ID の形式。想定外の文字列で外部 URL を組み立てない。 */
const SESSION_ID = /^cs_[A-Za-z0-9_]{10,120}$/;

export async function GET(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    return Response.json({ error: "payment not configured" }, { status: 500 });
  }

  const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
  if (!SESSION_ID.test(sessionId)) {
    return Response.json({ error: "invalid session" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${STRIPE_SESSION_API}/${sessionId}`, {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
  } catch {
    return Response.json({ error: "verification failed" }, { status: 502 });
  }

  if (!res.ok) {
    console.error("stripe error:", (await res.text()).slice(0, 500));
    // 存在しないセッションと、こちら側の設定不備(キー誤り等)を混同しない
    return res.status === 404
      ? Response.json({ error: "session not found" }, { status: 404 })
      : Response.json({ error: "verification failed" }, { status: 502 });
  }

  const session = (await res.json()) as {
    payment_status?: string;
    created?: number;
    metadata?: unknown;
  };

  if (session.payment_status !== "paid") {
    return Response.json({ error: "not paid" }, { status: 402 });
  }

  let design;
  try {
    design = fromStripeMetadata(session.metadata);
  } catch {
    // 決済は成立しているのに設計値が壊れている = こちらの不具合。調査できるよう記録する
    console.error("unlock: broken metadata for", sessionId);
    return Response.json({ error: "design unavailable" }, { status: 500 });
  }

  return Response.json(
    {
      design,
      licenseId: sessionId,
      purchasedAt: session.created ? session.created * 1000 : null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

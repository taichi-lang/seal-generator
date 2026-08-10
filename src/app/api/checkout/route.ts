/** POST /api/checkout — 業務利用パック(500円)の Stripe Checkout セッションを作成する。
 *
 * 印影の設計値はセッションの metadata に載せる(ステートレス)。
 * 決済完了後は /api/unlock が session_id で取り出すため、当方は何も保存しない。
 * SDK を入れずに Stripe の REST API を直接叩く(依存を増やさないため)。
 */

import { parseSealDesign, toStripeMetadata } from "@/lib/sealDesign";
import { PRICE_JPY, PRODUCT_NAME } from "@/lib/pricing";
import { SITE_URL } from "@/lib/site";

const STRIPE_SESSIONS_API = "https://api.stripe.com/v1/checkout/sessions";

export async function POST(request: Request) {
  // 決済に必要な設定は Stripe の秘密鍵だけにする。
  // 戻り先URLは canonical・sitemap・構造化データと同じ @/lib/site の定数を使う
  // (以前は同名の環境変数 SITE_URL を別途必須にしていたが、値はビルド時に確定しており、
  //  設定し忘れると鍵を入れても決済が動かないまま「未設定」と表示され続ける状態になっていた)。
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    return Response.json({ error: "payment not configured" }, { status: 500 });
  }
  const site = SITE_URL.replace(/\/+$/, "");

  let design;
  try {
    design = parseSealDesign(await request.json());
  } catch {
    return Response.json({ error: "invalid request" }, { status: 400 });
  }

  const form = new URLSearchParams({
    mode: "payment",
    "line_items[0][price_data][currency]": "jpy",
    "line_items[0][price_data][unit_amount]": String(PRICE_JPY),
    "line_items[0][price_data][product_data][name]": PRODUCT_NAME,
    "line_items[0][quantity]": "1",
    success_url: `${site}/unlock?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/?canceled=1`,
    ...toStripeMetadata(design),
  });

  let res: Response;
  try {
    res = await fetch(STRIPE_SESSIONS_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return Response.json({ error: "payment session failed" }, { status: 502 });
  }

  if (!res.ok) {
    // Stripe のエラー詳細はサーバーログのみに残し、クライアントには一般化して返す
    console.error("stripe error:", (await res.text()).slice(0, 500));
    return Response.json({ error: "payment session failed" }, { status: 502 });
  }

  const session = (await res.json()) as { url?: string };
  if (!session.url) {
    return Response.json({ error: "payment session failed" }, { status: 502 });
  }
  return Response.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
}

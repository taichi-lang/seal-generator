import { ADSENSE_CLIENT, hasPublisherId } from "@/lib/ads";

/** ads.txt
 *
 * AdSense はサイトの所有者確認と、広告枠の不正転売を防ぐために
 * ルート直下の `/ads.txt` を読む。発行者IDと同じ設定値から組み立てるので、
 * オーナー様が貼る値は1か所のままでよい。
 *
 * 発行者IDが未設定のあいだは 404 を返す。
 * 中身が空の 200 を返すと「ads.txt はあるが自分の枠が載っていない」と
 * 読まれ、かえって不利になるためである。
 *
 * 末尾の `f08c47fec0942fa0` は Google が全発行者に共通で定めている
 * 認証局IDで、秘密の値ではない。 */
/** 設定値はビルド時に決まるので、リクエストごとに作り直さない。 */
export const dynamic = "force-static";

export function GET() {
  if (!hasPublisherId()) {
    return new Response("Not Found", { status: 404 });
  }

  const body = `google.com, ${ADSENSE_CLIENT.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

/** `/ads.txt` を1つの環境変数の状態で1回だけ測るための小さな実行体。
 *
 * ⚠ 子プロセスに分けている理由: `src/lib/ads.ts` は環境変数を
 *   **モジュールの読み込み時**に定数へ入れる。同じプロセスの中で
 *   `process.env` を書き換えても、すでに読み込まれた値は変わらない。
 *   → 状態ごとにプロセスを分けないと、測っているつもりで
 *     1つ前の状態を測ることになる。
 *
 * 結果を1行の JSON で標準出力へ出す。呼び出し側は `tests/ads-txt.test.ts`。
 */
const { GET } = await import("@/app/ads.txt/route");
const res = GET();
process.stdout.write(
  JSON.stringify({
    status: res.status,
    contentType: res.headers.get("content-type"),
    body: await res.text(),
  }),
);

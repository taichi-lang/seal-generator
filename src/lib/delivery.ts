/** 決済後の引き渡し(複数ファイルの連続ダウンロード)の実行係。
 *
 * なぜ切り出したか(2026-09-13):
 * 引き渡しは UnlockPanel の中の `for` ループで、`try { … } finally { setBusy(false) }`
 * だけが囲っていた。そのため **途中の1件が投げると、残りが全部飛び、
 * 画面は成功時とまったく同じ状態に戻る**。買った人から見ると、
 * 「一括ダウンロード」を押して、何も落ちてこないまま元の画面に戻る。
 * 500円を受け取ったうえで、失敗したことすら伝えない経路だった。
 *
 * ここでは3つだけを保証する:
 *   1. 1件の失敗で残りを捨てない(渡せるものは全部渡す)
 *   2. どれが落ちたかを必ず持ち帰る(呼び出し側が画面に出せる)
 *   3. 1件ごとに間隔をあける(ブラウザの連続ダウンロード制限を避ける)
 *
 * ⚠ ブラウザがどこで連続ダウンロードを弾くかは、ここでは分からない。
 *   分からないからこそ、弾かれたときに黙らないことだけを引き受ける。
 */

/** 引き渡す1件。`label` はそのまま画面に出るため、買った人が分かる言葉にする。 */
export interface DeliveryItem {
  label: string;
  run: () => Promise<void> | void;
}

export interface DeliveryResult {
  /** 引き渡そうとした総数。 */
  total: number;
  /** 渡せなかったものの `label`。空なら全部渡せている。 */
  failed: string[];
}

export interface DeliveryOptions {
  /** 1件ごとの待ち。テストから差し替えられるようにしてある。 */
  pause?: () => Promise<void>;
  /** 1件終わるたびに呼ばれる(進捗表示用)。 */
  onProgress?: (done: number, total: number) => void;
}

/** 連続ダウンロードがブラウザにまとめて弾かれないようにあける間隔(ms)。 */
export const DELIVERY_INTERVAL_MS = 350;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** 引き渡しを1件ずつ順に実行し、落ちたものを持ち帰る。自身は決して投げない。 */
export async function runDelivery(
  items: readonly DeliveryItem[],
  options: DeliveryOptions = {},
): Promise<DeliveryResult> {
  const pause = options.pause ?? (() => sleep(DELIVERY_INTERVAL_MS));
  const failed: string[] = [];

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    try {
      // run() が同期的に投げる場合も await 前に捕まえる必要があるため try の中で呼ぶ
      await item.run();
    } catch {
      failed.push(item.label);
    }
    options.onProgress?.(i + 1, items.length);
    // 最後の1件のあとに待っても、買った人を待たせるだけで得るものがない
    if (i < items.length - 1) await pause();
  }

  return { total: items.length, failed };
}

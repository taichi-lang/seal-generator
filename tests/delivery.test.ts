/** 決済後の引き渡し(ダウンロード)のテスト。
 *
 * なぜ要るか: 有料の引き渡しは「8枚の PNG + 利用許諾書」を順に書き出す繰り返しで、
 * 途中の1件が失敗しても画面は成功時とまったく同じ見た目に戻っていた。
 * つまり **500円を払った人に、1枚も渡らないまま「終わった」ように見える**経路が
 * 存在していた(2026-09-13 に当方がコードで確認)。鍵が入ると本物のお金が動くため、
 * 鍵が入る前に、失敗が必ず画面に出ることを固定しておく。
 *
 * ⚠ ここで測っていないもの: 実ブラウザが複数ファイルの連続ダウンロードを
 *   どこで弾くか。これは実機のブラウザでしか測れない。
 *   ここで測るのは「弾かれたときに、こちらが黙らないこと」だけである。
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { runDelivery, type DeliveryItem } from "@/lib/delivery";

/** 成功する引き渡し1件。 */
function ok(label: string, log: string[]): DeliveryItem {
  return { label, run: async () => { log.push(label); } };
}

/** 失敗する引き渡し1件。 */
function ng(label: string): DeliveryItem {
  return { label, run: async () => { throw new Error("blocked"); } };
}

describe("runDelivery — 引き渡しの成否を必ず持ち帰る", () => {
  test("全部成功したら failed は空で、件数が合う", async () => {
    const log: string[] = [];
    const result = await runDelivery([ok("a", log), ok("b", log)]);
    assert.deepEqual(result.failed, []);
    assert.equal(result.total, 2);
    assert.deepEqual(log, ["a", "b"]);
  });

  test("順番どおりに1件ずつ実行する(まとめて投げない)", async () => {
    const log: string[] = [];
    await runDelivery([ok("1", log), ok("2", log), ok("3", log)]);
    assert.deepEqual(log, ["1", "2", "3"]);
  });

  test("⚠ 1件が失敗しても黙らない。どれが落ちたかを返す", async () => {
    const result = await runDelivery([ng("角印 600px")]);
    assert.deepEqual(result.failed, ["角印 600px"]);
  });

  test("⚠ 途中が失敗しても、残りの引き渡しは続ける", async () => {
    const log: string[] = [];
    const result = await runDelivery([ok("a", log), ng("b"), ok("c", log)]);
    // 買った人には渡せるものを全部渡す。1件の失敗で残り全部を捨てない
    assert.deepEqual(log, ["a", "c"]);
    assert.deepEqual(result.failed, ["b"]);
    assert.equal(result.total, 3);
  });

  test("⚠ 全部失敗しても、成功と見分けがつく", async () => {
    const result = await runDelivery([ng("a"), ng("b")]);
    assert.equal(result.failed.length, 2);
    assert.notDeepEqual(result.failed, []);
  });

  test("同期的に投げるものも捕まえる(throw が Promise でない場合)", async () => {
    const item: DeliveryItem = { label: "sync", run: () => { throw new Error("boom"); } };
    const result = await runDelivery([item]);
    assert.deepEqual(result.failed, ["sync"]);
  });

  test("1件ごとに間隔をあける(ブラウザのまとめ弾きを避ける)", async () => {
    const log: string[] = [];
    let waits = 0;
    await runDelivery([ok("a", log), ok("b", log), ok("c", log)], {
      pause: async () => { waits += 1; },
    });
    // 最後の1件のあとには待たない(待っても意味がないため)
    assert.equal(waits, 2);
  });

  test("引き渡すものが0件なら、何も実行せず失敗も0件", async () => {
    const result = await runDelivery([]);
    assert.equal(result.total, 0);
    assert.deepEqual(result.failed, []);
  });
});

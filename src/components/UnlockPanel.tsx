"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { drawSeal, type SealType } from "@/lib/seal";
import type { SealDesign } from "@/lib/sealDesign";
import { PAID_SIZES } from "@/lib/pricing";
import {
  downloadSealPng,
  downloadText,
  safeFileName,
  sealTypeLabel,
} from "@/lib/download";
import { buildLicenseText } from "@/lib/license";
import { runDelivery, type DeliveryItem } from "@/lib/delivery";
import { CONTACT_EMAIL } from "@/lib/site";

const PREVIEW_SIZE = 320;
const SEAL_TYPES: SealType[] = ["square", "round"];

interface Unlocked {
  design: SealDesign;
  licenseId: string;
  purchasedAt: number | null;
}

export default function UnlockPanel({ sessionId }: { sessionId: string }) {
  // session_id が無い場合は問い合わせる先がないので、初期値の時点で確定させる
  const [state, setState] = useState<"loading" | "ready" | "error">(
    sessionId ? "loading" : "error",
  );
  const [message, setMessage] = useState(
    sessionId ? "" : "決済セッションが指定されていません。",
  );
  const [data, setData] = useState<Unlocked | null>(null);
  const [busy, setBusy] = useState(false);
  // 渡せなかったものの名前。空でないあいだは画面に出し続ける
  const [undelivered, setUndelivered] = useState<string[]>([]);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/unlock?session_id=${encodeURIComponent(sessionId)}`,
        );
        if (cancelled) return;
        if (!res.ok) {
          setState("error");
          setMessage(
            res.status === 402
              ? "決済の確認がまだ取れていません。お支払いが完了している場合は、数秒おいてからページを再読み込みしてください(二重にお支払いなさらないでください)。"
              : "購入内容を確認できませんでした。お手数ですが決済完了メールを添えてお問い合わせください。",
          );
          return;
        }
        setData((await res.json()) as Unlocked);
        setState("ready");
      } catch {
        if (!cancelled) {
          setState("error");
          setMessage("通信に失敗しました。ページを再読み込みしてください。");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const downloadAll = useCallback(async () => {
    if (!data) return;
    setBusy(true);
    setUndelivered([]);

    // 引き渡すものを先に1本の並びにしてから、1件ずつ実行する。
    // 途中が失敗しても残りを捨てず、落ちたものを画面に出すため(@/lib/delivery)。
    const items: DeliveryItem[] = [
      ...SEAL_TYPES.flatMap((type) =>
        PAID_SIZES.map((size) => ({
          label: `${sealTypeLabel(type)} ${size}px`,
          run: () => downloadSealPng(data.design, type, size),
        })),
      ),
      {
        label: "利用許諾書",
        run: () =>
          downloadText(
            buildLicenseText({
              companyName: data.design.companyName,
              licenseId: data.licenseId,
              purchasedAt: data.purchasedAt,
            }),
            `${safeFileName(data.design.companyName)}_利用許諾書.txt`,
          ),
      },
    ];

    try {
      const { failed } = await runDelivery(items);
      setUndelivered(failed);
    } finally {
      setBusy(false);
    }
  }, [data]);

  if (state === "loading") {
    return <p className="text-center text-zinc-600 dark:text-zinc-400">購入内容を確認しています…</p>;
  }

  if (state === "error" || !data) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-4">
        <p className="text-red-700 dark:text-red-400">{message}</p>
        <Link href="/" className="inline-block underline text-zinc-700 dark:text-zinc-300">
          トップへ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          ご購入ありがとうございます
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          「{data.design.companyName}」の利用許諾書と高解像度データをダウンロードできます。
          <br />
          このページの URL は保存しておけば、あとから同じ内容を開き直せます。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SEAL_TYPES.map((type) => (
          <SealCard key={type} design={data.design} type={type} />
        ))}
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={downloadAll}
          disabled={busy}
          className="w-full py-3 rounded-lg bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white font-semibold transition"
        >
          {busy ? "書き出し中…" : "すべて一括ダウンロード(8 ファイル + 利用許諾書)"}
        </button>
        {undelivered.length > 0 && (
          // ⚠ 黙って戻らない。払った人が「何が来ていないか」を名前で分かるようにする
          <div
            role="alert"
            className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950 p-4 space-y-2"
          >
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
              {undelivered.length} 件が保存できませんでした
            </p>
            <p className="text-xs text-red-800 dark:text-red-300">
              {undelivered.join("・")}
            </p>
            <p className="text-xs text-red-800 dark:text-red-300">
              ブラウザが連続ダウンロードを止めている場合があります。ダウンロードの許可を出したうえで、
              もう一度上のボタンを押すか、各サイズのボタンから個別に保存してください。
              解決しないときは、下の発行番号を添えて {CONTACT_EMAIL} までご連絡ください。
            </p>
          </div>
        )}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
          発行番号: <span className="font-mono">{data.licenseId}</span>
        </p>
      </div>
    </div>
  );
}

function SealCard({ design, type }: { design: SealDesign; type: SealType }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    void drawSeal(canvas, { ...design, type, size: PREVIEW_SIZE });
  }, [design, type]);

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-4">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
        {sealTypeLabel(type)}
      </h3>
      <div className="flex justify-center bg-zinc-50 dark:bg-zinc-950 rounded-xl p-3">
        <canvas ref={canvasRef} className="max-w-full h-auto" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {PAID_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => void downloadSealPng(design, type, size)}
            className="py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            {size}px
          </button>
        ))}
      </div>
    </section>
  );
}

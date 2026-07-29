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
              ? "この決済はまだ完了していません。決済画面を最後まで進めてから、再度お試しください。"
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
    try {
      for (const type of SEAL_TYPES) {
        for (const size of PAID_SIZES) {
          await downloadSealPng(data.design, type, size);
          // 連続ダウンロードはブラウザにまとめて弾かれることがあるため間隔をあける
          await new Promise((r) => setTimeout(r, 350));
        }
      }
      downloadText(
        buildLicenseText({
          companyName: data.design.companyName,
          licenseId: data.licenseId,
          purchasedAt: data.purchasedAt,
        }),
        `${safeFileName(data.design.companyName)}_利用許諾書.txt`,
      );
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
          「{data.design.companyName}」の高解像度データをダウンロードできます。
          <br />
          このページは閉じると再表示できません。先にすべて保存してください。
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

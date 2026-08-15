"use client";

import { useEffect, useRef, useState } from "react";
import {
  FONT_LABELS,
  FRAME_LABELS,
  LAYOUT_LABELS,
  type FontStyle,
  type FrameStyle,
  type SealType,
  type TextLayout,
  drawSeal,
} from "@/lib/seal";
import type { SealDesign } from "@/lib/sealDesign";
import { FREE_SIZE, PAID_FEATURES, PRICE_JPY } from "@/lib/pricing";
import { downloadCanvasPng, safeFileName, sealTypeLabel } from "@/lib/download";

const DEFAULT_COLOR = "#B91C1C";
const CANVAS_SIZE = FREE_SIZE;

export default function SealGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [companyName, setCompanyName] = useState("株式会社サンプル");
  const [sealType, setSealType] = useState<SealType>("square");
  const [fontStyle, setFontStyle] = useState<FontStyle>("shippori");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [squareSuffix, setSquareSuffix] = useState("之印");
  const [roundTitle, setRoundTitle] = useState("代表取締役印");
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("single");
  const [layout, setLayout] = useState<TextLayout>("vertical");
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const design: SealDesign = {
    companyName,
    type: sealType,
    fontStyle,
    color,
    squareSuffix,
    roundTitle,
    frameStyle,
    layout,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    (async () => {
      await drawSeal(canvas, {
        companyName,
        type: sealType,
        fontStyle,
        size: CANVAS_SIZE,
        color,
        squareSuffix,
        roundTitle,
        frameStyle,
        layout,
      });
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [
    companyName,
    sealType,
    fontStyle,
    color,
    squareSuffix,
    roundTitle,
    frameStyle,
    layout,
  ]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    downloadCanvasPng(
      canvas,
      `${safeFileName(companyName)}_${sealTypeLabel(sealType)}_${CANVAS_SIZE}px.png`,
    );
  };

  const handlePurchase = async () => {
    setCheckoutError("");
    setCheckoutBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(design),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        // 決済手段が未設定のときは「時間をおけば直る」わけではないので、
        // 一時的な失敗と区別して、無料ダウンロードが使えることを伝える
        setCheckoutError(
          data.error === "payment not configured"
            ? "ただいま業務利用パックの販売を一時停止しています。上の「無料で PNG ダウンロード」は通常どおりご利用いただけます(透かしなし。購入者名の入った利用許諾書は付きません)。"
            : "決済ページを開けませんでした。時間をおいて再度お試しください。",
        );
        return;
      }
      window.location.href = data.url;
    } catch {
      setCheckoutError("通信に失敗しました。接続を確認してください。");
    } finally {
      setCheckoutBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto p-6">
      <section className="space-y-5 bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          印影の設定
        </h2>

        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            会社名
          </span>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="株式会社○○"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-700"
          />
          <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
            「株式会社」「有限会社」等は自動で1列目に配置されます
          </span>
        </label>

        <div>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">
            印種
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSealType("square")}
              className={`flex-1 py-2 rounded-lg border transition ${
                sealType === "square"
                  ? "bg-red-700 text-white border-red-700"
                  : "bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              角印（社印）
            </button>
            <button
              type="button"
              onClick={() => setSealType("round")}
              className={`flex-1 py-2 rounded-lg border transition ${
                sealType === "round"
                  ? "bg-red-700 text-white border-red-700"
                  : "bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              丸印（代表者印）
            </button>
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            書体
          </span>
          <select
            value={fontStyle}
            onChange={(e) => setFontStyle(e.target.value as FontStyle)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-700"
          >
            {(Object.keys(FONT_LABELS) as FontStyle[]).map((key) => (
              <option key={key} value={key}>
                {FONT_LABELS[key]}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
            ※ 実印篆書体は商用フォント要購入。Google Fonts の極太明朝で印篆の重厚感を再現しています
          </span>
        </label>

        {sealType === "square" ? (
          <label className="block">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              接尾語（角印）
            </span>
            <input
              type="text"
              value={squareSuffix}
              onChange={(e) => setSquareSuffix(e.target.value)}
              placeholder="之印 / 印 / 空欄"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-700"
            />
          </label>
        ) : (
          <label className="block">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              中央文字（丸印 / 役職名）
            </span>
            <input
              type="text"
              value={roundTitle}
              onChange={(e) => setRoundTitle(e.target.value)}
              placeholder="代表取締役印 / 代表者印 / 銀行之印"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-700"
            />
          </label>
        )}

        {sealType === "square" && (
          <div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">
              文字組み（角印）
            </span>
            <div className="flex gap-2">
              {(Object.keys(LAYOUT_LABELS) as TextLayout[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLayout(key)}
                  aria-pressed={layout === key}
                  className={`flex-1 py-2 px-2 text-sm rounded-lg border transition ${
                    layout === key
                      ? "bg-red-700 text-white border-red-700"
                      : "bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {LAYOUT_LABELS[key]}
                </button>
              ))}
            </div>
            <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
              社印は縦書きが一般的ですが、横書きの社名やロゴに合わせる場合は横書きも使われます
            </span>
          </div>
        )}

        {sealType === "square" && (
          <div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">
              枠デザイン（角印）
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(FRAME_LABELS) as FrameStyle[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFrameStyle(key)}
                  aria-pressed={frameStyle === key}
                  className={`py-2 px-2 text-sm rounded-lg border transition ${
                    frameStyle === key
                      ? "bg-red-700 text-white border-red-700"
                      : "bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {FRAME_LABELS[key]}
                </button>
              ))}
            </div>
            <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
              いずれの枠も無料でダウンロードできます
            </span>
          </div>
        )}

        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            朱色
          </span>
          <div className="mt-1 flex gap-2 items-center">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-14 shrink-0 rounded cursor-pointer border border-zinc-300 dark:border-zinc-700"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setColor(DEFAULT_COLOR)}
              className="shrink-0 whitespace-nowrap px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              リセット
            </button>
          </div>
        </label>

        <button
          type="button"
          onClick={handleDownload}
          className="w-full py-3 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold transition shadow-sm"
        >
          無料で PNG ダウンロード({CANVAS_SIZE}px・透かしなし)
        </button>
      </section>

      <section className="flex flex-col items-center justify-center bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100 self-start">
          プレビュー
        </h2>
        <div className="flex-1 flex items-center justify-center w-full bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto"
            style={{ imageRendering: "auto" }}
          />
        </div>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 text-center">
          透過 PNG / {CANVAS_SIZE}px。見積書・請求書にそのまま貼付可能
        </p>
      </section>

      <section className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            業務利用パック(利用許諾書つき)
          </h2>
          <p className="text-zinc-900 dark:text-zinc-100">
            <span className="text-2xl font-bold">{PRICE_JPY.toLocaleString()}</span>
            <span className="text-sm"> 円(税込・買い切り)</span>
          </p>
        </div>

        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          上のダウンロードは無料で、透かしも入りません。
          この印影を業務で使ってよいことを<strong>書面で残しておきたい方</strong>
          (発行番号と購入日の入った利用許諾書が必要な方)だけご購入ください。
        </p>

        <ul className="mt-4 space-y-2">
          {PAID_FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-300"
            >
              <span aria-hidden className="text-red-700 dark:text-red-500">
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* 看板を「許諾書」に架け替えた以上、それが何の書面かを誤解させない。
            許諾は当方が与える使用許可であって、押印の法的効力とは別のレイヤーである */}
        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          ※ 利用許諾書は、当方がこの印影データの業務利用を許諾する書面です。
          押印そのものに法的な効力を与えるものではありません(画像の印影は印鑑登録=実印には使えません)。
        </p>

        <button
          type="button"
          onClick={handlePurchase}
          disabled={checkoutBusy || companyName.trim().length === 0}
          className="mt-5 w-full py-3 rounded-lg border-2 border-red-700 text-red-700 dark:text-red-400 dark:border-red-500 font-semibold hover:bg-red-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition"
        >
          {checkoutBusy
            ? "決済ページへ移動しています…"
            : `業務利用パックを購入する(${PRICE_JPY.toLocaleString()}円)`}
        </button>

        {checkoutError && (
          <p className="mt-2 text-sm text-red-700 dark:text-red-400">{checkoutError}</p>
        )}

        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          決済は Stripe を利用します。カード情報が当方に渡ることはありません。
          いま画面に表示されている設定内容がそのまま高解像度で書き出されます。
        </p>
      </section>
    </div>
  );
}

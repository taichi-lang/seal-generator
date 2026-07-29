"use client";

import { useEffect, useRef, useState } from "react";
import {
  FONT_LABELS,
  type FontStyle,
  type SealType,
  drawSeal,
} from "@/lib/seal";

const DEFAULT_COLOR = "#B91C1C";
const CANVAS_SIZE = 560;

export default function SealGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [companyName, setCompanyName] = useState("株式会社サンプル");
  const [sealType, setSealType] = useState<SealType>("square");
  const [fontStyle, setFontStyle] = useState<FontStyle>("shippori");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [squareSuffix, setSquareSuffix] = useState("之印");
  const [roundTitle, setRoundTitle] = useState("代表取締役印");

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
      });
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [companyName, sealType, fontStyle, color, squareSuffix, roundTitle]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    const sanitized = companyName.replace(/[\\/:*?"<>|]/g, "_") || "seal";
    link.download = `${sanitized}_${sealType === "square" ? "角印" : "丸印"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
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

        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            朱色
          </span>
          <div className="mt-1 flex gap-2 items-center">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-14 rounded cursor-pointer border border-zinc-300 dark:border-zinc-700"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setColor(DEFAULT_COLOR)}
              className="px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
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
          PNG ダウンロード
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
    </div>
  );
}

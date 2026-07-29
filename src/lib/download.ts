/** ブラウザ上でのファイル書き出しヘルパー。無料・有料の両方の導線から使う。 */

import { drawSeal, type SealType } from "./seal";
import type { SealDesign } from "./sealDesign";

/** ファイル名に使えない文字を落とす。空になった場合は "seal" にフォールバックする。 */
export function safeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "_").trim() || "seal";
}

export function sealTypeLabel(type: SealType): string {
  return type === "square" ? "角印" : "丸印";
}

function triggerDownload(href: string, filename: string): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = href;
  link.click();
}

export function downloadCanvasPng(
  canvas: HTMLCanvasElement,
  filename: string,
): void {
  triggerDownload(canvas.toDataURL("image/png"), filename);
}

export function downloadText(text: string, filename: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  triggerDownload(url, filename);
  // revoke は click 直後だと Firefox でダウンロードが落ちるため、少し待ってから解放する
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** 画面外のキャンバスに指定サイズで描画して PNG として書き出す。 */
export async function downloadSealPng(
  design: SealDesign,
  type: SealType,
  size: number,
): Promise<void> {
  const canvas = document.createElement("canvas");
  await drawSeal(canvas, { ...design, type, size });
  downloadCanvasPng(
    canvas,
    `${safeFileName(design.companyName)}_${sealTypeLabel(type)}_${size}px.png`,
  );
}

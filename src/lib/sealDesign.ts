/** 印影の「設計値」と、その検証・Stripe metadata との相互変換。
 *
 * ステートレス設計(B1 seido-web の api/checkout.py と同じ考え方):
 * データベースを持たず、購入内容は Stripe の Checkout セッションの
 * metadata に載せて往復させる。決済後は session_id を鍵に Stripe から
 * 取り出すため、当方のサーバーには何も保存されない。
 */

import type { FontStyle, FrameStyle, SealType } from "./seal";
import { FONT_FAMILIES, FRAME_LABELS } from "./seal";

/** 印影を再現するのに必要な最小限の値。描画サイズは含めない(プランで決まるため)。 */
export interface SealDesign {
  companyName: string;
  type: SealType;
  fontStyle: FontStyle;
  color: string;
  squareSuffix: string;
  roundTitle: string;
  frameStyle: FrameStyle;
}

const SEAL_TYPES: readonly SealType[] = ["square", "round"];
const FONT_STYLES = Object.keys(FONT_FAMILIES) as FontStyle[];
const FRAME_STYLES = Object.keys(FRAME_LABELS) as FrameStyle[];

/** 会社名の上限。Stripe の metadata 値は 500 文字までだが、印影として成立する長さで切る。 */
const MAX_COMPANY_NAME = 30;
/** 接尾語・中央文字の上限。 */
const MAX_LABEL = 12;
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function pickString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

/** 外部入力(リクエストボディ / Stripe metadata)を SealDesign に検証・正規化する。
 *  不正な値は握りつぶさず Error を投げ、呼び出し側が 400 を返せるようにする。 */
export function parseSealDesign(input: unknown): SealDesign {
  if (typeof input !== "object" || input === null) {
    throw new Error("invalid design");
  }
  const raw = input as Record<string, unknown>;

  const companyName = pickString(raw.companyName, MAX_COMPANY_NAME);
  if (companyName.length === 0) throw new Error("companyName is required");

  const type = raw.type as SealType;
  if (!SEAL_TYPES.includes(type)) throw new Error("invalid type");

  const fontStyle = raw.fontStyle as FontStyle;
  if (!FONT_STYLES.includes(fontStyle)) throw new Error("invalid fontStyle");

  const color = pickString(raw.color, 7);
  if (!HEX_COLOR.test(color)) throw new Error("invalid color");

  // 枠デザインは後から追加した項目。値が無い決済セッション(旧仕様)を
  // エラーにすると購入済みの引渡しが止まるため、既定値に寄せる。
  const rawFrame = raw.frameStyle as FrameStyle;
  const frameStyle = FRAME_STYLES.includes(rawFrame) ? rawFrame : "single";

  return {
    companyName,
    type,
    fontStyle,
    color,
    squareSuffix: pickString(raw.squareSuffix, MAX_LABEL),
    roundTitle: pickString(raw.roundTitle, MAX_LABEL),
    frameStyle,
  };
}

/** Stripe の Checkout セッション作成フォームに載せる metadata[...] のキー・値。 */
export function toStripeMetadata(design: SealDesign): Record<string, string> {
  return {
    "metadata[companyName]": design.companyName,
    "metadata[type]": design.type,
    "metadata[fontStyle]": design.fontStyle,
    "metadata[color]": design.color,
    "metadata[squareSuffix]": design.squareSuffix,
    "metadata[roundTitle]": design.roundTitle,
    "metadata[frameStyle]": design.frameStyle,
  };
}

/** Stripe から取り出した metadata を SealDesign に戻す。検証は parseSealDesign と共通。 */
export function fromStripeMetadata(metadata: unknown): SealDesign {
  return parseSealDesign(metadata);
}

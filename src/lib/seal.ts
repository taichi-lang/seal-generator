export type SealType = "square" | "round";
export type FontStyle = "shippori" | "noto" | "kaisei" | "yuji";

export interface SealOptions {
  companyName: string;
  type: SealType;
  fontStyle: FontStyle;
  size: number;
  color: string;
  squareSuffix: string;
  roundTitle: string;
}

export const FONT_FAMILIES: Record<FontStyle, string> = {
  shippori:
    '"Shippori Mincho B1", "Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", serif',
  noto:
    '"Noto Serif JP", "Shippori Mincho B1", "Yu Mincho", "Hiragino Mincho ProN", serif',
  kaisei:
    '"Kaisei Decol", "Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", serif',
  yuji:
    '"Yuji Syuku", "Shippori Mincho B1", "Yu Mincho", "Hiragino Mincho ProN", serif',
};

export const FONT_WEIGHTS: Record<FontStyle, number> = {
  shippori: 800,
  noto: 900,
  kaisei: 700,
  yuji: 400,
};

export const FONT_LABELS: Record<FontStyle, string> = {
  shippori: "Shippori Mincho ExtraBold（推奨・印篆代用）",
  noto: "Noto Serif JP Black（標準）",
  kaisei: "Kaisei Decol（装飾・古印体寄り）",
  yuji: "Yuji Syuku（毛筆・行書寄り）",
};

const PREFIXES = [
  "株式会社",
  "有限会社",
  "合同会社",
  "合資会社",
  "合名会社",
  "一般社団法人",
  "一般財団法人",
  "公益社団法人",
  "公益財団法人",
  "医療法人",
  "学校法人",
  "宗教法人",
  "特定非営利活動法人",
];

export interface ParsedName {
  prefix: string;
  core: string;
  hasPrefix: boolean;
}

export function parseCompanyName(name: string): ParsedName {
  const trimmed = name.trim();
  for (const p of PREFIXES) {
    if (trimmed.startsWith(p)) {
      return {
        prefix: p,
        core: trimmed.slice(p.length).trim(),
        hasPrefix: true,
      };
    }
    if (trimmed.endsWith(p)) {
      return {
        prefix: p,
        core: trimmed.slice(0, -p.length).trim(),
        hasPrefix: true,
      };
    }
  }
  return { prefix: "", core: trimmed, hasPrefix: false };
}

export async function ensureFontLoaded(
  fontFamily: string,
  weight: number,
  size: number,
): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;
  const firstFont = fontFamily.split(",")[0].trim().replace(/"/g, "");
  try {
    await document.fonts.load(`${weight} ${size}px "${firstFont}"`, "印");
    await document.fonts.ready;
  } catch {
  }
}

export async function drawSeal(
  canvas: HTMLCanvasElement,
  options: SealOptions,
): Promise<void> {
  const { size, fontStyle } = options;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  await ensureFontLoaded(
    FONT_FAMILIES[fontStyle],
    FONT_WEIGHTS[fontStyle],
    size * 0.15,
  );

  ctx.clearRect(0, 0, size, size);

  if (options.type === "square") {
    drawSquareSeal(ctx, options);
  } else {
    drawRoundSeal(ctx, options);
  }
}

function drawCellChar(
  ctx: CanvasRenderingContext2D,
  char: string,
  cx: number,
  cy: number,
  cellW: number,
  cellH: number,
  fontFamily: string,
  weight: number,
  fillRatio = 0.92,
): void {
  const baseSize = Math.min(cellW, cellH);
  ctx.font = `${weight} ${baseSize}px ${fontFamily}`;
  const metrics = ctx.measureText(char);
  const charW =
    metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight ||
    metrics.width;
  const charH =
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent ||
    baseSize;

  const targetW = cellW * fillRatio;
  const targetH = cellH * fillRatio;
  const scaleX = targetW / charW;
  const scaleY = targetH / charH;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scaleX, scaleY);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, 0, 0);
  ctx.restore();
}

function drawSquareSeal(
  ctx: CanvasRenderingContext2D,
  options: SealOptions,
): void {
  const { companyName, fontStyle, size, color, squareSuffix } = options;

  const parsed = parseCompanyName(companyName);

  const groups: string[] = [];
  if (parsed.hasPrefix) groups.push(parsed.prefix);
  if (parsed.core) groups.push(parsed.core);
  if (squareSuffix) groups.push(squareSuffix);

  if (groups.length === 0) groups.push(companyName || "");

  const borderWidth = size * 0.035;
  const margin = size * 0.05;
  ctx.strokeStyle = color;
  ctx.lineWidth = borderWidth;
  ctx.lineJoin = "miter";
  ctx.strokeRect(
    margin,
    margin,
    size - 2 * margin,
    size - 2 * margin,
  );

  const padding = margin + borderWidth / 2 + size * 0.015;
  const innerSize = size - 2 * padding;

  const cols = groups.length;
  const cellW = innerSize / cols;

  ctx.fillStyle = color;

  for (let colIdx = 0; colIdx < cols; colIdx++) {
    const colFromRight = colIdx;
    const group = groups[colIdx];
    const chars = Array.from(group);
    if (chars.length === 0) continue;

    const rows = chars.length;
    const cellH = innerSize / rows;

    const cx = size - padding - cellW / 2 - cellW * colFromRight;

    chars.forEach((char, rowIdx) => {
      const cy = padding + cellH / 2 + cellH * rowIdx;
      drawCellChar(
        ctx,
        char,
        cx,
        cy,
        cellW,
        cellH,
        FONT_FAMILIES[fontStyle],
        FONT_WEIGHTS[fontStyle],
        0.94,
      );
    });
  }
}

function drawRoundSeal(
  ctx: CanvasRenderingContext2D,
  options: SealOptions,
): void {
  const { companyName, fontStyle, size, color, roundTitle } = options;

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.475;
  const innerR = outerR * 0.62;

  const parsed = parseCompanyName(companyName);
  const outerText = parsed.hasPrefix
    ? parsed.prefix + parsed.core
    : companyName;
  const centerText = roundTitle;

  ctx.strokeStyle = color;
  ctx.lineWidth = outerR * 0.08;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = outerR * 0.03;
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  drawOuterRingText(
    ctx,
    outerText,
    cx,
    cy,
    outerR,
    innerR,
    FONT_FAMILIES[fontStyle],
    FONT_WEIGHTS[fontStyle],
    color,
  );

  drawCenterTitle(
    ctx,
    centerText,
    cx,
    cy,
    innerR,
    FONT_FAMILIES[fontStyle],
    FONT_WEIGHTS[fontStyle],
  );
}

function drawOuterRingText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  fontFamily: string,
  weight: number,
  color: string,
): void {
  const chars = Array.from(text);
  if (chars.length === 0) return;

  const ringWidth = outerR - innerR;
  const textRadius = (outerR + innerR) / 2;
  const charBox = ringWidth * 0.78;

  const arcSpan = Math.PI * 1.45;
  const angleStep = arcSpan / chars.length;

  const startAngle = -Math.PI / 2 + angleStep / 2;

  ctx.fillStyle = color;

  chars.forEach((char, i) => {
    const angle = startAngle + angleStep * i;
    const x = cx + textRadius * Math.cos(angle);
    const y = cy + textRadius * Math.sin(angle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);

    ctx.font = `${weight} ${charBox}px ${fontFamily}`;
    const metrics = ctx.measureText(char);
    const charW =
      metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight ||
      metrics.width;
    const charH =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent ||
      charBox;

    const scaleX = (charBox * 0.95) / charW;
    const scaleY = (charBox * 0.95) / charH;
    ctx.scale(scaleX, scaleY);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, 0, 0);
    ctx.restore();
  });
}

function drawCenterTitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  innerR: number,
  fontFamily: string,
  weight: number,
): void {
  const chars = Array.from(text);
  if (chars.length === 0) return;

  const diameter = innerR * 2;
  const usable = diameter * 0.78;

  let cols: number;
  let rows: number;

  if (chars.length <= 2) {
    cols = 1;
    rows = chars.length;
  } else if (chars.length === 3) {
    cols = 1;
    rows = 3;
  } else if (chars.length === 4) {
    cols = 2;
    rows = 2;
  } else if (chars.length <= 6) {
    cols = 2;
    rows = Math.ceil(chars.length / 2);
  } else if (chars.length <= 9) {
    cols = 3;
    rows = Math.ceil(chars.length / 3);
  } else {
    cols = 3;
    rows = Math.ceil(chars.length / 3);
  }

  const maxCellFromDiagonal = usable / Math.sqrt(cols * cols + rows * rows);
  const cellW = Math.min(usable / cols, maxCellFromDiagonal * 1.2);
  const cellH = Math.min(usable / rows, maxCellFromDiagonal * 1.2);

  const gridW = cellW * cols;
  const gridH = cellH * rows;

  const gridLeft = cx - gridW / 2;
  const gridTop = cy - gridH / 2;

  chars.forEach((char, i) => {
    const colIdx = Math.floor(i / rows);
    const rowIdx = i % rows;

    const colFromRight = cols - 1 - colIdx;

    const x = gridLeft + cellW / 2 + cellW * colFromRight;
    const y = gridTop + cellH / 2 + cellH * rowIdx;

    drawCellChar(ctx, char, x, y, cellW, cellH, fontFamily, weight, 0.88);
  });
}

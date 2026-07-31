export type SealType = "square" | "round";
export type FontStyle = "shippori" | "noto" | "kaisei" | "yuji";
/** 角印の枠デザイン。丸印は二重円で固定のため適用しない。 */
export type FrameStyle = "single" | "bold" | "double" | "rounded";
/** 角印の文字組み。丸印は外周が円弧・中央が縦組み固定のため適用しない。 */
export type TextLayout = "vertical" | "horizontal";

export interface SealOptions {
  companyName: string;
  type: SealType;
  fontStyle: FontStyle;
  size: number;
  color: string;
  squareSuffix: string;
  roundTitle: string;
  frameStyle: FrameStyle;
  layout: TextLayout;
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

export const FRAME_LABELS: Record<FrameStyle, string> = {
  single: "標準（一重枠）",
  bold: "太枠（押印感が強い）",
  double: "二重枠（格式）",
  rounded: "角丸（やわらかい印象）",
};

export const LAYOUT_LABELS: Record<TextLayout, string> = {
  vertical: "縦書き（伝統的・右列から）",
  horizontal: "横書き（左から読む）",
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

/** 実際に描く文字を渡して、その字を含むフォントの読み込みを待つ。
 *
 *  Google Fonts は書体を文字コードの範囲ごとに分割して配信するため、
 *  「印」だけを読み込んでも社名の漢字・かなは届かない。
 *  読み込めていない字は別の書体で描かれてしまい、1つの印影の中で字面が揃わなくなる。 */
export async function ensureFontLoaded(
  fontFamily: string,
  weight: number,
  size: number,
  text: string,
): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;
  const firstFont = fontFamily.split(",")[0].trim().replace(/"/g, "");
  const chars = Array.from(new Set(Array.from(text + "印"))).join("");
  try {
    await document.fonts.load(`${weight} ${size}px "${firstFont}"`, chars);
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
    options.companyName + options.squareSuffix + options.roundTitle,
  );

  ctx.clearRect(0, 0, size, size);

  if (options.type === "square") {
    drawSquareSeal(ctx, options);
  } else {
    drawRoundSeal(ctx, options);
  }
}

/** マスの縦横比に合わせて文字を変形させるときの上限。
 *  実際の印章も字を長体・平体にして印面を埋めるが、比を取りすぎると読みにくくなる。 */
const MAX_CELL_STRETCH = 1.5;

/** 1文字を、指定の中心に、マスからはみ出さない大きさで描く。
 *
 *  文字の大きさはフォントの em(文字の設計上の正方形)で決める。
 *  文字ごとの外接矩形に合わせて拡大すると、「ン」「ル」「ー」のように
 *  もともと小さく設計された字が漢字と同じ大きさまで引き伸ばされ、字形が崩れる。
 *  em で揃えれば、漢字・かな・カタカナが本来の大きさの関係を保ったまま並ぶ。 */
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
  const emSize = Math.min(cellW, cellH) * fillRatio;
  ctx.font = `${weight} ${emSize}px ${fontFamily}`;

  // マスが正方形でないときは、印面が間延びしないよう長体・平体に変形させる。
  // 変形はマス単位(=同じ列のすべての字に同じ倍率)なので、字ごとの崩れは起きない
  const cellRatio = cellW / cellH;
  const stretchX = cellRatio > 1 ? Math.min(cellRatio, MAX_CELL_STRETCH) : 1;
  const stretchY = cellRatio < 1 ? Math.min(1 / cellRatio, MAX_CELL_STRETCH) : 1;

  const metrics = ctx.measureText(char);
  const charW =
    metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight ||
    metrics.width;
  const charH =
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent ||
    emSize;

  // em で描くと稀にマスをはみ出す字がある(装飾書体など)。その時だけ縮める
  const shrink = Math.min(
    1,
    (cellW * fillRatio) / (charW * stretchX),
    (cellH * fillRatio) / (charH * stretchY),
  );

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(stretchX * shrink, stretchY * shrink);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, 0, 0);
  ctx.restore();
}

/** 角印の枠を描き、文字を置ける内側の余白(片側)を返す。
 *  枠の太さは style ごとに変わるため、文字の配置もこの戻り値に従わせる。 */
function drawSquareFrame(
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string,
  style: FrameStyle,
): number {
  const margin = size * 0.05;
  const gap = size * 0.015;

  ctx.strokeStyle = color;
  ctx.lineJoin = "miter";

  if (style === "double") {
    const outerWidth = size * 0.03;
    const innerWidth = size * 0.014;
    const innerOffset = margin + size * 0.052;

    ctx.lineWidth = outerWidth;
    ctx.strokeRect(margin, margin, size - 2 * margin, size - 2 * margin);

    ctx.lineWidth = innerWidth;
    ctx.strokeRect(
      innerOffset,
      innerOffset,
      size - 2 * innerOffset,
      size - 2 * innerOffset,
    );

    // 内枠は線が細く、文字が近づくと枠と一体に見えてしまうため余白を広めに取る
    return innerOffset + innerWidth / 2 + gap * 1.8;
  }

  const borderWidth = style === "bold" ? size * 0.06 : size * 0.035;
  ctx.lineWidth = borderWidth;

  if (style === "rounded" && typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(
      margin,
      margin,
      size - 2 * margin,
      size - 2 * margin,
      size * 0.13,
    );
    ctx.stroke();
    // 角が丸い分、四隅で文字が枠に寄るため余白を少し広く取る
    return margin + borderWidth / 2 + gap + size * 0.012;
  }

  ctx.strokeRect(margin, margin, size - 2 * margin, size - 2 * margin);
  return margin + borderWidth / 2 + gap;
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

  const padding = drawSquareFrame(ctx, size, color, options.frameStyle);
  const innerSize = size - 2 * padding;

  ctx.fillStyle = color;

  // 縦書きは「語のまとまり=列」で右から左へ、横書きは「語のまとまり=行」で上から下へ。
  // どちらもまとまり単位で1マスの大きさが決まる点は同じなので、軸だけを入れ替える。
  const bandSize = innerSize / groups.length;

  // 文字の大きさは、まとまりごとではなく印面全体で1つに決める。
  // 列ごとに innerSize を割ると、「之印」のような2文字の列だけが極端に大きくなり、
  // 同じ印影の中で文字の大きさが揃わなくなるため。
  const maxChars = Math.max(...groups.map((g) => Array.from(g).length));
  const charSize = innerSize / maxChars;

  groups.forEach((group, groupIdx) => {
    const chars = Array.from(group);
    if (chars.length === 0) return;

    // 文字数が少ないまとまりは、印面の中央に寄せて配置する
    const runOffset = (innerSize - charSize * chars.length) / 2;

    chars.forEach((char, charIdx) => {
      const bandCenter = padding + bandSize / 2 + bandSize * groupIdx;
      const charCenter =
        padding + runOffset + charSize / 2 + charSize * charIdx;

      // 縦書きの列は右端から数えるため、x 座標だけ反転させる
      const cx =
        options.layout === "horizontal" ? charCenter : size - bandCenter;
      const cy = options.layout === "horizontal" ? bandCenter : charCenter;
      const cellW = options.layout === "horizontal" ? charSize : bandSize;
      const cellH = options.layout === "horizontal" ? bandSize : charSize;

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
  });
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

  // 社名は輪の上半分を中心に回す。使ってよい弧の長さには上限を設け、
  // 残りは下側の空きにする(実際の代表者印と同じ配置)。
  const maxSpan = Math.PI * 1.5;
  const idealBox = ringWidth * 0.78;
  // 文字と文字の間隔。字数が少ないときに間延びしないよう、1文字ぶんで頭打ちにする
  const maxStep = (idealBox * 1.15) / textRadius;
  const angleStep = Math.min(maxSpan / chars.length, maxStep);

  // 文字の大きさは「輪の幅」と「1文字あたりの弧の長さ」の小さいほうに合わせる。
  // 弧の長さを見ないと、社名が長いときに隣の文字と重なって潰れる。
  const charBox = Math.min(idealBox, textRadius * angleStep * 0.95);

  // 全体を真上に対して左右対称に置く
  const totalSpan = angleStep * chars.length;
  const startAngle = -Math.PI / 2 - totalSpan / 2 + angleStep / 2;

  ctx.fillStyle = color;

  chars.forEach((char, i) => {
    const angle = startAngle + angleStep * i;
    const x = cx + textRadius * Math.cos(angle);
    const y = cy + textRadius * Math.sin(angle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);

    // 角印と同じく em 基準。輪の中では隣の字とぶつかりやすいので、
    // はみ出す字だけを縮めて収める
    ctx.font = `${weight} ${charBox}px ${fontFamily}`;
    const metrics = ctx.measureText(char);
    const charW =
      metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight ||
      metrics.width;
    const charH =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent ||
      charBox;

    const shrink = Math.min(
      1,
      (charBox * 0.95) / charW,
      (charBox * 0.95) / charH,
    );
    if (shrink < 1) ctx.scale(shrink, shrink);
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

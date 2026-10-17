/**
 * East Indian chart — the Kala Chakra 1.5 geometry ported, not redrawn
 * (ADR-8; source: Advanced_Setup/web/src/app_shell_v15.html `chartSvg`).
 * Fixed signs: Aries top centre, counter-clockwise; corner boxes split by
 * diagonals; every text row computes its safe x from the diagonal at its own
 * height; a two-pass fit picks one font size per sign region.
 * The same component draws D1, every varga, bhava and transit charts.
 */
import type { JSX } from 'preact';

export interface ChartPart {
  text: string;
  /** Planet colour key (Su…Ke, As) or a style class. */
  tone?: string;
  bold?: boolean;
}
export interface ChartEntry { key: string; parts: ChartPart[] }
export interface CentreLine { text: string; size: number; display?: boolean }

export interface EastIndianChartProps {
  title: string;
  description?: string;
  /** Entries per sign, index 0 = Aries. */
  signs: ChartEntry[][];
  lagnaSign?: number;
  centre: CentreLine[];
  /** Largest font in viewBox units (the plate is 1020 × 780). */
  maxFont?: number;
  minFont?: number;
  /** Text along the outer edge of each sign region (index 0 = Aries), as PL prints house strengths. */
  edges?: (string | undefined)[];
}



const W = 1020, H = 780;
const x = [10, 340, 680, 1010] as const;
const y = [10, 265, 520, 775] as const;
const BH = y[1] - y[0];
const xdTL = (yy: number) => x[0] + ((x[1] - x[0]) * (yy - y[0])) / BH;
const xdTR = (yy: number) => x[3] - ((x[3] - x[2]) * (yy - y[0])) / BH;
const xdBL = (yy: number) => x[1] - ((x[1] - x[0]) * (yy - y[2])) / BH;
const xdBR = (yy: number) => x[2] + ((x[3] - x[2]) * (yy - y[2])) / BH;
const PAD = 12;

/** Where each sign region meets the outer frame: [x, y, rotation]. */
const EDGE_POS: [number, number, number][] = [
  /* Ar */ [(x[1] + x[2]) / 2, y[0] - 12, 0], /* Ta */ [(x[0] + x[1]) / 2, y[0] - 12, 0],
  /* Ge */ [x[0] - 12, (y[0] + y[1]) / 2, -90], /* Cn */ [x[0] - 12, (y[1] + y[2]) / 2, -90],
  /* Le */ [x[0] - 12, (y[2] + y[3]) / 2, -90], /* Vi */ [(x[0] + x[1]) / 2, y[3] + 26, 0],
  /* Li */ [(x[1] + x[2]) / 2, y[3] + 26, 0], /* Sc */ [(x[2] + x[3]) / 2, y[3] + 26, 0],
  /* Sg */ [x[3] + 12, (y[2] + y[3]) / 2, 90], /* Cp */ [x[3] + 12, (y[1] + y[2]) / 2, 90],
  /* Aq */ [x[3] + 12, (y[0] + y[1]) / 2, 90], /* Pi */ [(x[2] + x[3]) / 2, y[0] - 12, 0],
];
const EDGE_MARGIN = 34;

type Row = { x: number; a: 'start' | 'end'; w: number };
interface Region {
  /** Baseline of the first row for `n` rows at line height `lh`. */
  y0: (n: number, lh: number) => number;
  /** Lowest allowed baseline. */
  yMax: number;
  row: (yy: number) => Row;
  poly: string;
}

const P = (...pts: [number, number][]) => pts.map((p) => p.join(',')).join(' ');
/** Upper regions start just under the top edge (Kala Chakra: ~1.8 × font). */
const fromTop = (edge: number, k: number) => (_n: number, lh: number) => edge + (k * lh) / 1.24;
/** Lower triangles start at Kala Chakra's fixed row, or higher when crowded. */
const fromBottom = (fixed: number, yMax: number) => (n: number, lh: number) => Math.min(fixed, yMax - (n - 1) * lh);

/** Index 0 = Aries … 11 = Pisces. */
const REGIONS: Region[] = [
  /* Ar */ { y0: fromTop(y[0], 1.8), yMax: y[1] - 10, row: () => ({ x: x[1] + 12, a: 'start', w: x[2] - x[1] - 24 }), poly: P([x[1], y[0]], [x[2], y[0]], [x[2], y[1]], [x[1], y[1]]) },
  /* Ta */ { y0: fromTop(y[0], 1.8), yMax: y[1] - 10, row: (yy) => ({ x: xdTL(yy) + PAD, a: 'start', w: x[1] - 8 - (xdTL(yy) + PAD) }), poly: P([x[0], y[0]], [x[1], y[0]], [x[1], y[1]]) },
  /* Ge */ { y0: fromBottom(y[0] + 140, y[1] - 10), yMax: y[1] - 10, row: (yy) => ({ x: x[0] + 10, a: 'start', w: xdTL(yy) - PAD - (x[0] + 10) }), poly: P([x[0], y[0]], [x[1], y[1]], [x[0], y[1]]) },
  /* Cn */ { y0: fromTop(y[1], 2.1), yMax: y[2] - 10, row: () => ({ x: x[0] + 10, a: 'start', w: x[1] - x[0] - 22 }), poly: P([x[0], y[1]], [x[1], y[1]], [x[1], y[2]], [x[0], y[2]]) },
  /* Le */ { y0: fromTop(y[2], 1.9), yMax: y[3] - 10, row: (yy) => ({ x: x[0] + 10, a: 'start', w: xdBL(yy) - PAD - (x[0] + 10) }), poly: P([x[0], y[2]], [x[1], y[2]], [x[0], y[3]]) },
  /* Vi */ { y0: fromBottom(y[2] + 170, y[3] - 10), yMax: y[3] - 10, row: (yy) => ({ x: xdBL(yy) + PAD, a: 'start', w: x[1] - 8 - (xdBL(yy) + PAD) }), poly: P([x[1], y[2]], [x[1], y[3]], [x[0], y[3]]) },
  /* Li */ { y0: fromTop(y[2], 1.9), yMax: y[3] - 10, row: () => ({ x: x[1] + 12, a: 'start', w: x[2] - x[1] - 24 }), poly: P([x[1], y[2]], [x[2], y[2]], [x[2], y[3]], [x[1], y[3]]) },
  /* Sc */ { y0: fromBottom(y[2] + 150, y[3] - 10), yMax: y[3] - 10, row: (yy) => ({ x: x[2] + 10, a: 'start', w: xdBR(yy) - PAD - (x[2] + 10) }), poly: P([x[2], y[2]], [x[3], y[3]], [x[2], y[3]]) },
  /* Sg */ { y0: fromTop(y[2], 1.9), yMax: y[3] - 10, row: (yy) => ({ x: x[3] - 10, a: 'end', w: x[3] - 10 - (xdBR(yy) + PAD) }), poly: P([x[2], y[2]], [x[3], y[2]], [x[3], y[3]]) },
  /* Cp */ { y0: fromTop(y[1], 2.1), yMax: y[2] - 10, row: () => ({ x: x[2] + 12, a: 'start', w: x[3] - x[2] - 24 }), poly: P([x[2], y[1]], [x[3], y[1]], [x[3], y[2]], [x[2], y[2]]) },
  /* Aq */ { y0: fromBottom(y[0] + 150, y[1] - 10), yMax: y[1] - 10, row: (yy) => ({ x: x[3] - 10, a: 'end', w: x[3] - 10 - (xdTR(yy) + PAD) }), poly: P([x[3], y[0]], [x[3], y[1]], [x[2], y[1]]) },
  /* Pi */ { y0: fromTop(y[0], 1.8), yMax: y[1] - 10, row: (yy) => ({ x: x[2] + 12, a: 'start', w: xdTR(yy) - PAD - (x[2] + 12) }), poly: P([x[2], y[0]], [x[3], y[0]], [x[2], y[1]]) },
];

/** Fraction of the font size that glyphs rise above the baseline. */
const CAP = 0.74;

/**
 * Safe row at baseline `yy` for font `f`: the intersection of the region's row
 * at the baseline and at cap height, so tall glyphs never cross a diagonal.
 */
function safeRow(reg: Region, yy: number, f: number): Row {
  const span = (r: Row): [number, number] => (r.a === 'start' ? [r.x, r.x + r.w] : [r.x - r.w, r.x]);
  const a = reg.row(yy), b = reg.row(yy - CAP * f);
  const [l1, r1] = span(a), [l2, r2] = span(b);
  const l = Math.max(l1, l2), r = Math.min(r1, r2);
  return { x: a.a === 'start' ? l : r, a: a.a, w: Math.max(0, r - l) };
}

/** Average advance in ems, used only where text cannot be measured (Node tests); Kala Chakra used 0.585 for Georgia. */
const EM = 0.66;

/**
 * Width of an entry at font size 1, measured with the chart's real font via a
 * canvas (widths scale linearly with size, so one measurement per string is
 * cached). A measurement is cached only once every weight it uses (regular,
 * bold) has loaded: measured earlier, the canvas falls back to another font
 * and a stale, too-narrow width would stick (the CI failure of 2026-10-17).
 * The app re-renders when both weights are in (see app.tsx).
 */
const widthCache = new Map<string, number>();
let ctx: CanvasRenderingContext2D | null | undefined;
const weightLoaded = (w: number) => typeof document !== 'undefined' && !!document.fonts?.check?.(`${w} 16px "Atkinson Hyperlegible"`);
function unitWidth(e: ChartEntry): number {
  if (ctx === undefined) {
    try { ctx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null; } catch { ctx = null; }
  }
  if (!ctx) return EM * Math.max(e.parts.reduce((n, p) => n + p.text.length, 0), 4);
  const key = e.parts.map((p) => (p.bold ? '*' : '') + (p.tone === 'sign' || p.tone === 'house' ? '~' : '') + p.text).join('\u0001');
  const cached = widthCache.get(key);
  if (cached !== undefined) return cached;
  let w = 0;
  for (const p of e.parts) {
    ctx.font = `${p.bold ? 700 : 400} 100px "Atkinson Hyperlegible", system-ui, sans-serif`;
    // sign/house labels are drawn at 0.78em with letter-spacing (see styles.css .tone-sign)
    const k = p.tone === 'sign' || p.tone === 'house' ? 0.78 * 1.08 : 1;
    w += (ctx.measureText(p.text).width / 100) * k;
  }
  w *= 1.04; // safety margin for SVG text rendering differences
  if (e.parts.every((p) => weightLoaded(p.bold ? 700 : 400))) widthCache.set(key, w);
  return w;
}
const LH = 1.24;

/** Does every row fit, at its own position, with font size `f`? */
function fits(reg: Region, entries: ChartEntry[], f: number): boolean {
  const lh = f * LH;
  const y0 = reg.y0(entries.length, lh);
  if (y0 + (entries.length - 1) * lh > reg.yMax + 0.5) return false;
  return entries.every((e, i) => safeRow(reg, y0 + i * lh, f).w >= unitWidth(e) * f);
}

/**
 * One font size per region: the largest that fits. Kala Chakra's two-pass
 * estimate can oscillate at large sizes (a smaller font moves rows to where a
 * triangle is wider), so bisect instead; `minF` is the floor if nothing fits.
 */
export function fitFont(reg: Region, entries: ChartEntry[], maxF: number, minF: number): number {
  if (fits(reg, entries, maxF)) return maxF;
  let lo = minF, hi = maxF;
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2;
    if (fits(reg, entries, mid)) lo = mid; else hi = mid;
  }
  return lo;
}

export function EastIndianChart(props: EastIndianChartProps): JSX.Element {
  const maxF = props.maxFont ?? 26;
  const minF = props.minFont ?? 12;
  const lines: [number, number, number, number][] = [
    [x[1], y[0], x[1], y[3]], [x[2], y[0], x[2], y[3]],
    [x[0], y[1], x[3], y[1]], [x[0], y[2], x[3], y[2]],
    [x[0], y[0], x[1], y[1]], [x[3], y[0], x[2], y[1]],
    [x[0], y[3], x[1], y[2]], [x[3], y[3], x[2], y[2]],
  ];
  const cx = (x[1] + x[2]) / 2;
  const totalH = props.centre.reduce((h, l) => h + l.size * 1.45, 0);
  let cy = (y[1] + y[2]) / 2 - totalH / 2 + (props.centre[0]?.size ?? 0);
  const lagna = props.lagnaSign !== undefined ? REGIONS[props.lagnaSign] : undefined;

  return (
    <svg class="plate" viewBox={props.edges ? `${-EDGE_MARGIN} ${-EDGE_MARGIN} ${W + 2 * EDGE_MARGIN} ${H + 2 * EDGE_MARGIN}` : `0 0 ${W} ${H}`}
      role="img" aria-label={props.title}>
      <title>{props.title}</title>
      {props.description && <desc>{props.description}</desc>}
      <rect class="plate-ground" x={props.edges ? -EDGE_MARGIN : 0} y={props.edges ? -EDGE_MARGIN : 0}
        width={W + (props.edges ? 2 * EDGE_MARGIN : 0)} height={H + (props.edges ? 2 * EDGE_MARGIN : 0)} rx={14} />
      {props.edges?.map((txt, s) => {
        if (!txt) return null;
        const [ex, ey, rot] = EDGE_POS[s]!;
        return <text key={`e${s}`} class="plate-edge" x={ex} y={ey} text-anchor="middle" font-size={19}
          transform={rot ? `rotate(${rot} ${ex} ${ey})` : undefined}>{txt}</text>;
      })}
      {lagna && <polygon class="plate-lagna" points={lagna.poly} />}
      <rect class="plate-frame" x={x[0]} y={y[0]} width={x[3] - x[0]} height={y[3] - y[0]} />
      {lines.map(([a, b, c, d], i) => <line key={i} class="plate-line" x1={a} y1={b} x2={c} y2={d} />)}
      {props.centre.map((l, i) => {
        const yy = cy;
        cy += l.size * 1.45;
        return (
          <text key={`c${i}`} x={cx} y={yy} text-anchor="middle" font-size={l.size}
            class={l.display ? 'plate-centre plate-display' : 'plate-centre'}>
            {l.text}
          </text>
        );
      })}
      {props.signs.map((entries, s) => {
        if (!entries.length) return null;
        const reg = REGIONS[s]!;
        const f = fitFont(reg, entries, maxF, minF);
        const lh = f * LH;
        const y0 = reg.y0(entries.length, lh);
        return (
          <g key={s} data-sign={s} data-poly={reg.poly}>
            {entries.map((e, i) => {
              const yy = y0 + i * lh;
              const r = safeRow(reg, yy, f);
              return (
                <text key={e.key} x={r.x} y={yy} text-anchor={r.a} font-size={f.toFixed(1)} class="plate-text">
                  {e.parts.map((p, j) => (
                    <tspan key={j} class={p.tone ? `tone-${p.tone}` : undefined} font-weight={p.bold ? 700 : undefined}>{p.text}</tspan>
                  ))}
                </text>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

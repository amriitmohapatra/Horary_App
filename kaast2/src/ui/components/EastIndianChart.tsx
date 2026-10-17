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

const plainLen = (e: ChartEntry) => e.parts.reduce((n, p) => n + p.text.length, 0);
/** Average advance of the chart face in ems, conservative for bold Atkinson (Kala Chakra used 0.585 for Georgia). */
const EM = 0.66;
const LH = 1.24;

/** Does every row fit, at its own position, with font size `f`? */
function fits(reg: Region, entries: ChartEntry[], f: number): boolean {
  const lh = f * LH;
  const y0 = reg.y0(entries.length, lh);
  if (y0 + (entries.length - 1) * lh > reg.yMax + 0.5) return false;
  return entries.every((e, i) => safeRow(reg, y0 + i * lh, f).w >= EM * plainLen(e) * f);
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
    <svg class="plate" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={props.title}>
      <title>{props.title}</title>
      {props.description && <desc>{props.description}</desc>}
      <rect class="plate-ground" x={0} y={0} width={W} height={H} rx={14} />
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
          <g key={s} data-sign={s}>
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

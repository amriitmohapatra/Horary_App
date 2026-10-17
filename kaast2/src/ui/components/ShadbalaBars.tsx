/**
 * Shad Bala as a bar chart (dataviz skill): one series → one neutral hue, no
 * legend; planet names on the axis carry identity; values labelled directly
 * (7 bars); a labelled reference line at 1.0 (the required strength); a
 * tooltip per bar; the strength table above is the table view.
 * Thin bars, 4 px rounded data-end anchored to the baseline, recessive axis.
 */
import type { JSX } from 'preact';
import { GRAHAS7 } from '../../engine/strength/common';
import type { Page1Strengths } from '../../engine/strength';
import { PLANET_NAMES } from '../../engine/names';
import { t } from '../i18n';

export function ShadbalaBars({ s }: { s: Page1Strengths }): JSX.Element {
  const W = 560, H = 230, padL = 36, padR = 78, top = 22, bottom = 44;
  const vals = GRAHAS7.map((p) => s.breakdown.shadbala[p].ratio);
  const max = Math.max(1.6, Math.ceil(Math.max(...vals) * 5) / 5);
  const plotH = H - top - bottom, plotW = W - padL - padR;
  const yOf = (v: number) => top + plotH - (v / max) * plotH;
  const slot = plotW / GRAHAS7.length, bw = Math.min(30, slot * 0.46);
  const ticks = [0, 0.5, 1, 1.5, 2, 2.5].filter((v) => v <= max);
  return (
    <figure class="sb-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t('sb.aria', { values: GRAHAS7.map((p, i) => `${PLANET_NAMES[p]} ${vals[i]!.toFixed(2)}`).join(', ') })}>
        {ticks.map((v) => (
          <g key={v}>
            <line class="sb-grid" x1={padL} x2={W - padR} y1={yOf(v)} y2={yOf(v)} />
            <text class="sb-tick" x={padL - 6} y={yOf(v) + 4} text-anchor="end">{v.toFixed(1)}</text>
          </g>
        ))}
        {GRAHAS7.map((p, i) => {
          const v = vals[i]!, cx = padL + slot * (i + 0.5), y0 = yOf(0), y1 = yOf(v), r = 4;
          const h = y0 - y1;
          const d = `M${cx - bw / 2},${y0} V${y1 + r} Q${cx - bw / 2},${y1} ${cx - bw / 2 + r},${y1} H${cx + bw / 2 - r} Q${cx + bw / 2},${y1} ${cx + bw / 2},${y1 + r} V${y0} Z`;
          const b = s.breakdown.shadbala[p];
          return (
            <g key={p} class="sb-bar">
              <title>{t('sb.tip', { planet: PLANET_NAMES[p], total: b.total.toFixed(1), required: b.required, ratio: v.toFixed(2) })}</title>
              <rect x={cx - slot / 2} y={top} width={slot} height={plotH} fill="transparent" />
              {h > 0 && <path class={v >= 1 ? 'sb-fill' : 'sb-fill weak'} d={d} />}
              <text class="sb-val" x={cx} y={y1 - 6} text-anchor="middle">{v.toFixed(2)}</text>
              <text class={`sb-name pl-${p}`} x={cx} y={H - bottom + 18} text-anchor="middle">{p}</text>
            </g>
          );
        })}
        <line class="sb-ref" x1={padL} x2={W - padR} y1={yOf(1)} y2={yOf(1)} />
        <text class="sb-ref-label" x={W - padR + 6} y={yOf(1) + 4} text-anchor="start">{t('sb.required')}</text>
        <line class="sb-axis" x1={padL} x2={W - padR} y1={yOf(0)} y2={yOf(0)} />
      </svg>
      <figcaption class="hint-text">{t('sb.caption')}</figcaption>
    </figure>
  );
}

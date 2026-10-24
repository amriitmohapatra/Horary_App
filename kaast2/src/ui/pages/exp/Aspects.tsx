/**
 * Aspects: PL 7's worksheet 21 (aspects between planets: sign aspect and
 * virupas, coloured by the compound relation) and worksheet 22 (aspects
 * from / on each planet as bars). Rules: src/engine/exp/aspects.ts — all 72
 * cells match a PL 7.0.1 printout. Bars (dataviz skill): one series → one
 * hue, no legend, planet names on the axis, a tooltip per bar, the matrix is
 * the table view.
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult, PlanetId } from '../../../engine';
import { PLANETS } from '../../../engine/types';
import { PLANET_NAMES } from '../../../engine/names';
import { aspectMatrix, type AspectMatrix } from '../../../engine/exp/aspects';
import { Pl } from './common';

const REL_WORD = { friend: 'friend', neutral: 'neutral', enemy: 'enemy' } as const;

function Matrix({ m }: { m: AspectMatrix }): JSX.Element {
  return (
    <div class="table-wrap" tabIndex={0} role="region" aria-label="Aspects between planets">
      <table class="data exp-matrix" data-testid="exp-aspect-matrix">
        <caption class="hint-text cap">
          Columns: the planet giving the aspect; rows: the planet receiving it. Each cell: the sign aspect
          (¼ 3rd/10th, ½ 5th/9th, ¾ 4th/8th, full 7th and the special aspects; – none) and, in parentheses, the exact
          aspect in virupas (60 = full). Colour: how the receiving planet regards the giver — green friend, blue neutral,
          red enemy (five-fold relation); hover a cell for the words.
        </caption>
        <thead><tr><th scope="col"><span class="sr-only">Receives ↓ / gives →</span></th>{PLANETS.map((a) => <th key={a} scope="col" class="c"><Pl id={a} /></th>)}</tr></thead>
        <tbody>
          {PLANETS.map((t) => (
            <tr key={t}>
              <th scope="row"><Pl id={t} /></th>
              {PLANETS.map((a) => {
                const c = m[t][a];
                if (!c) return <td key={a} class="c muted">·</td>;
                return (
                  <td key={a} class={`c num rel-${c.relation}`}
                    title={`${PLANET_NAMES[a]} aspects ${PLANET_NAMES[t]}: ${c.fraction === '-' ? 'no sign aspect' : `${c.fraction} sign aspect`}, ${c.virupas} virupas; ${PLANET_NAMES[t]} regards ${PLANET_NAMES[a]} as ${REL_WORD[c.relation]}`}>
                    <span class="frac">{c.fraction === '-' ? '–' : c.fraction}</span>{c.virupas > 0 && <span> ({c.virupas})</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** One small bar chart: 9 planets, value = virupas / 60. */
export function AspectBars({ title, values, axis }: { title: string; values: { id: PlanetId; v: number | null; tip: string }[]; axis: string }): JSX.Element {
  const W = 320, H = 170, padL = 34, padR = 8, top = 10, bottom = 34;
  const plotH = H - top - bottom, plotW = W - padL - padR;
  const yOf = (pct: number) => top + plotH - (pct / 100) * plotH;
  const slot = plotW / values.length, bw = Math.min(18, slot * 0.55);
  return (
    <figure class="asp-chart">
      <figcaption class="asp-title">{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}: ${values.filter((x) => x.v !== null).map((x) => `${PLANET_NAMES[x.id]} ${Math.round((x.v! / 60) * 100)}%`).join(', ')}`}>
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line class="sb-grid" x1={padL} x2={W - padR} y1={yOf(v)} y2={yOf(v)} />
            <text class="sb-tick" x={padL - 4} y={yOf(v) + 4} text-anchor="end">{v}%</text>
          </g>
        ))}
        {values.map((x, i) => {
          const cx = padL + slot * (i + 0.5);
          const pct = x.v === null ? 0 : Math.min(100, (x.v / 60) * 100);
          const y0 = yOf(0), y1 = yOf(pct), r = Math.min(4, (y0 - y1) / 2);
          const d = `M${cx - bw / 2},${y0} V${y1 + r} Q${cx - bw / 2},${y1} ${cx - bw / 2 + r},${y1} H${cx + bw / 2 - r} Q${cx + bw / 2},${y1} ${cx + bw / 2},${y1 + r} V${y0} Z`;
          return (
            <g key={x.id} class="sb-bar">
              <title>{x.tip}</title>
              <rect x={cx - slot / 2} y={top} width={slot} height={plotH} fill="transparent" />
              {pct > 0 && <path class="asp-fill" d={d} />}
              <text class={`sb-name pl-${x.id}`} x={cx} y={H - bottom + 16} text-anchor="middle">{x.id}</text>
            </g>
          );
        })}
        <line class="sb-axis" x1={padL} x2={W - padR} y1={yOf(0)} y2={yOf(0)} />
        <text class="sb-tick" x={padL + plotW / 2} y={H - 2} text-anchor="middle">{axis}</text>
      </svg>
    </figure>
  );
}

export function Aspects({ chart, houses }: { chart: ChartResult; houses?: JSX.Element }): JSX.Element {
  const m = useMemo(() => aspectMatrix(chart), [chart]);
  const [mode, setMode] = useState<'from' | 'on'>('from');
  return (
    <>
      <section class="panel" aria-labelledby="h-exp-matrix">
        <header class="panel-head"><h2 id="h-exp-matrix">Aspects between planets</h2></header>
        <div class="panel-body"><Matrix m={m} /></div>
      </section>
      <section class="panel" aria-labelledby="h-exp-bars">
        <header class="panel-head"><h2 id="h-exp-bars">{mode === 'from' ? 'Aspects from planets' : 'Aspects on planets'}</h2></header>
        <div class="panel-body">
          <div class="segmented" role="group" aria-label="Direction of the aspects">
            <button type="button" class="seg" aria-pressed={mode === 'from'} onClick={() => setMode('from')}>From each planet</button>
            <button type="button" class="seg" aria-pressed={mode === 'on'} onClick={() => setMode('on')}>On each planet</button>
          </div>
          <div class="asp-grid" data-testid="exp-aspect-bars">
            {PLANETS.map((p) => (
              <AspectBars key={p}
                title={`${mode === 'from' ? 'Aspects from' : 'Aspects on'} ${PLANET_NAMES[p]}`}
                axis={mode === 'from' ? 'Aspected planets' : 'Aspecting planets'}
                values={PLANETS.map((q) => {
                  const c = mode === 'from' ? m[q][p] : m[p][q];
                  const [giver, taker] = mode === 'from' ? [p, q] : [q, p];
                  return { id: q, v: c ? c.virupas : null, tip: c ? `${PLANET_NAMES[giver]} on ${PLANET_NAMES[taker]}: ${c.virupas} virupas (${Math.round((c.virupas / 60) * 100)}%)` : PLANET_NAMES[q] };
                })} />
            ))}
          </div>
          <p class="hint-text">Height = the exact aspect in virupas as a share of a full aspect (60 virupas), as PL's worksheets 21 and 22 draw it.</p>
        </div>
      </section>
      {houses}
    </>
  );
}

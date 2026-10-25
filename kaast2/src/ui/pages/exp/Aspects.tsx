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
import type { ChartResult } from '../../../engine';
import { PLANETS } from '../../../engine/types';
import { PLANET_NAMES } from '../../../engine/names';
import { aspectMatrix, houseAspects, type AspectMatrix, type HousePoint } from '../../../engine/exp/aspects';
import { bhavaChart } from '../../../engine/houses/bhava';
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

export interface Bar { key: string; label: string; cls?: string; pct: number | null; tip: string }

/** One small bar chart (dataviz skill): one series, one hue, no legend; labels on the axis; a tooltip per bar. */
export function AspectBars({ title, bars, axis }: { title: string; bars: Bar[]; axis: string }): JSX.Element {
  const W = 320, H = 170, padL = 34, padR = 8, top = 10, bottom = 34;
  const plotH = H - top - bottom, plotW = W - padL - padR;
  const yOf = (pct: number) => top + plotH - (pct / 100) * plotH;
  const slot = plotW / bars.length, bw = Math.min(18, slot * 0.55);
  return (
    <figure class="asp-chart">
      <figcaption class="asp-title">{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}: ${bars.filter((x) => x.pct !== null).map((x) => `${x.label} ${Math.round(x.pct!)}%`).join(', ')}`}>
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line class="sb-grid" x1={padL} x2={W - padR} y1={yOf(v)} y2={yOf(v)} />
            <text class="sb-tick" x={padL - 4} y={yOf(v) + 4} text-anchor="end">{v}%</text>
          </g>
        ))}
        {bars.map((x, i) => {
          const cx = padL + slot * (i + 0.5);
          const pct = x.pct === null ? 0 : Math.max(0, Math.min(100, x.pct));
          const y0 = yOf(0), y1 = yOf(pct), r = Math.min(4, (y0 - y1) / 2);
          const d = `M${cx - bw / 2},${y0} V${y1 + r} Q${cx - bw / 2},${y1} ${cx - bw / 2 + r},${y1} H${cx + bw / 2 - r} Q${cx + bw / 2},${y1} ${cx + bw / 2},${y1 + r} V${y0} Z`;
          return (
            <g key={x.key} class="sb-bar">
              <title>{x.tip}</title>
              <rect x={cx - slot / 2} y={top} width={slot} height={plotH} fill="transparent" />
              {pct > 0 && <path class="asp-fill" d={d} />}
              <text class={`sb-name ${x.cls ?? ''}`} x={cx} y={H - bottom + 16} text-anchor="middle">{x.label}</text>
            </g>
          );
        })}
        <line class="sb-axis" x1={padL} x2={W - padR} y1={yOf(0)} y2={yOf(0)} />
        <text class="sb-tick" x={padL + plotW / 2} y={H - 2} text-anchor="middle">{axis}</text>
      </svg>
    </figure>
  );
}

const ORD = (n: number) => `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`;

function HouseGraphs({ chart }: { chart: ChartResult }): JSX.Element {
  const [what, setWhat] = useState<'house' | 'lord'>('house');
  const [view, setView] = useState<'byHouse' | 'byPlanet'>('byHouse');
  const [point, setPoint] = useState<HousePoint>('equal');
  const h = useMemo(() => houseAspects(chart, point, point === 'sripati' ? bhavaChart(chart, 'sripati').bhava.madhya : undefined), [chart, point]);
  const grid = what === 'house' ? h.onHouse : h.plusLord;
  const word = what === 'house' ? 'house' : 'house + lord';
  return (
    <section class="panel" aria-labelledby="h-exp-houses">
      <header class="panel-head"><h2 id="h-exp-houses">Aspects on houses</h2></header>
      <div class="panel-body">
        <div class="exp-controls">
          <div class="segmented" role="group" aria-label="What is aspected">
            <button type="button" class="seg" aria-pressed={what === 'house'} onClick={() => setWhat('house')}>On the nth house</button>
            <button type="button" class="seg" aria-pressed={what === 'lord'} onClick={() => setWhat('lord')}>On the nth house + lord</button>
          </div>
          <div class="segmented" role="group" aria-label="Arrange the graphs">
            <button type="button" class="seg" aria-pressed={view === 'byHouse'} onClick={() => setView('byHouse')}>One graph per house</button>
            <button type="button" class="seg" aria-pressed={view === 'byPlanet'} onClick={() => setView('byPlanet')}>One graph per planet</button>
          </div>
          <div class="field exp-field">
            <label for="exp-house-point">House point</label>
            <select id="exp-house-point" value={point} onChange={(e) => setPoint((e.currentTarget as HTMLSelectElement).value as HousePoint)}>
              <option value="equal">Lagna degree in each sign (PL rashi chart)</option>
              <option value="sripati">Sripati bhava cusps</option>
            </select>
          </div>
        </div>
        <div class="asp-grid" data-testid="exp-house-bars">
          {view === 'byHouse'
            ? h.points.map((_, n) => (
              <AspectBars key={n} title={`Aspects on the ${ORD(n + 1)} ${what === 'lord' ? `house + lord (${h.lords[n]})` : 'house'}`} axis="Aspecting planets"
                bars={PLANETS.map((i) => ({ key: i, label: i, cls: `pl-${i}`, pct: grid[n]![i], tip: `${PLANET_NAMES[i]} on the ${ORD(n + 1)} ${word}: ${grid[n]![i]}%` }))} />
            ))
            : PLANETS.map((i) => (
              <AspectBars key={i} title={`Aspects from ${PLANET_NAMES[i]} on each ${word}`} axis="Houses"
                bars={h.points.map((_, n) => ({ key: String(n), label: String(n + 1), pct: grid[n]![i], tip: `${PLANET_NAMES[i]} on the ${ORD(n + 1)} ${word}${what === 'lord' ? ` (${h.lords[n]})` : ''}: ${grid[n]![i]}%` }))} />
            ))}
        </div>
        <p class="hint-text">
          Height = the aspect as a share of a full aspect (60 virupas). "+ lord": half from the house point and half from the planet ruling it, as PL's
          worksheets 23–26 compute it. PL's rashi chart puts each house point at the Lagna's degree in that sign; whether PL's default house graphs
          use these or the bhava cusps is not yet confirmed on a printout, so both are offered.
        </p>
      </div>
    </section>
  );
}

export function Aspects({ chart }: { chart: ChartResult }): JSX.Element {
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
                bars={PLANETS.map((q) => {
                  const c = mode === 'from' ? m[q][p] : m[p][q];
                  const [giver, taker] = mode === 'from' ? [p, q] : [q, p];
                  return { key: q, label: q, cls: `pl-${q}`, pct: c ? (c.virupas / 60) * 100 : null, tip: c ? `${PLANET_NAMES[giver]} on ${PLANET_NAMES[taker]}: ${c.virupas} virupas (${Math.round((c.virupas / 60) * 100)}%)` : PLANET_NAMES[q] };
                })} />
            ))}
          </div>
          <p class="hint-text">Height = the exact aspect in virupas as a share of a full aspect (60 virupas), as PL's worksheets 21 and 22 draw it.</p>
        </div>
      </section>
      <HouseGraphs chart={chart} />
    </>
  );
}

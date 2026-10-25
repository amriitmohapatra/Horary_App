/**
 * Strength worksheet: PL 7's worksheet 14 — SB%, SB#, War, Ishta/Kashta,
 * Dominance and Functional nature per planet, the Shad Bala bars, and Bhava
 * Bala by component as PL prints it (components truncated, total in rupas).
 * Rules: src/engine/exp/worksheet14.ts, docs/specs/pl_worksheets.md §2–3.
 */
import { useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult } from '../../../engine';
import { PLANETS } from '../../../engine/types';
import { GRAHAS7, type Graha7 } from '../../../engine/strength/common';
import { dominance, ishtaKashta, planetaryWar, type Lons } from '../../../engine/exp/worksheet14';
import { SIGNS } from '../../../engine/zodiac';
import { ShadbalaBars } from '../../components/ShadbalaBars';
import { strength } from '../../state/store';
import { Pl } from './common';

const FUNC_SHORT = { Malefic: 'Malef', Benefic: 'Benef', Neutral: 'Neutr' } as const;

export function Worksheet({ chart }: { chart: ChartResult }): JSX.Element {
  const s = strength.value;
  const lon = useMemo(() => { const l = { As: chart.asc.lonDeg } as Lons; for (const p of PLANETS) l[p] = chart.bodies[p].lonDeg; return l; }, [chart]);
  const dom = useMemo(() => dominance(lon), [lon]);
  const ik = useMemo(() => (s ? ishtaKashta(lon, s.breakdown.shadbala, chart.moment.ayanamsaDeg) : null), [s, lon, chart]);
  const war = useMemo(() => planetaryWar(lon, Object.fromEntries(PLANETS.map((p) => [p, chart.bodies[p].latDeg]))), [lon, chart]);
  if (!s || !ik) return <p class="pending">Strengths are not available for this chart.</p>;
  const warOf = (p: Graha7) => war.find((w) => w.a === p || w.b === p);
  const trunc = (x: number) => Math.trunc(x);
  const madhyaDeg = Math.floor(chart.asc.lonDeg % 30);
  return (
    <>
      <div class="varga-main">
        <section class="panel" aria-labelledby="h-ws14">
          <header class="panel-head"><h2 id="h-ws14">Birth chart: strength columns</h2></header>
          <div class="panel-body table-wrap">
            <table class="data" data-testid="exp-ws14">
              <thead><tr>
                <th scope="col">Planet</th><th scope="col" class="r" title="Shad Bala ÷ required">SB%</th><th scope="col" class="r" title="Number of strong balas">SB#</th>
                <th scope="col" class="c" title="Planetary war">War</th><th scope="col" class="r" title="Ishta / Kashta phala, virupas">IshKas</th>
                <th scope="col" class="r" title="Dominance">Domin.</th><th scope="col">Func.</th>
              </tr></thead>
              <tbody>
                {PLANETS.map((p) => {
                  const g = (GRAHAS7 as readonly string[]).includes(p) ? (p as Graha7) : null;
                  const row = s.planets[p];
                  const w = g ? warOf(g) : undefined;
                  return (
                    <tr key={p}>
                      <th scope="row"><Pl id={p} /></th>
                      <td class="num r">{row.sbRatio !== null ? row.sbRatio.toFixed(2) : ''}</td>
                      <td class="num r">{row.sbStrongCount ?? ''}</td>
                      <td class="c" title={w ? `Within ${w.separation.toFixed(2)}° of ${w.a === p ? w.b : w.a}; textbook winner: the greater latitude` : undefined}>
                        {w ? (w.winner === p ? 'W*' : w.winner ? 'L*' : '?') : ''}
                      </td>
                      <td class="num r">{g ? `${ik[g].ishta}/${ik[g].kashta}` : ''}</td>
                      <td class="num r">{dom[p].toFixed(2)}</td>
                      <td>{FUNC_SHORT[row.functional]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p class="hint-text">
              Dominance and Func. reproduce a PL 7.0.1 printout for all nine planets; Ishta/Kashta matches for the Sun, Moon and Saturn and is within
              1–2 virupas for the others (PL times the motional strength from its own series). PL 7.0.1 always leaves the War column blank;
              W*/L* here mark a textbook planetary war (two of Mars to Saturn within 1°, the greater latitude wins), our addition.
            </p>
          </div>
        </section>
        <section class="panel" aria-labelledby="h-ws14-sb">
          <header class="panel-head"><h2 id="h-ws14-sb">Shad Bala</h2></header>
          <div class="panel-body"><ShadbalaBars s={s} /></div>
        </section>
      </div>
      <section class="panel" aria-labelledby="h-ws14-bb">
        <header class="panel-head"><h2 id="h-ws14-bb">Bhava Bala</h2></header>
        <div class="panel-body table-wrap">
          <table class="data" data-testid="exp-ws14-bhava">
            <thead><tr><th scope="col">Bhava Bala</th>{s.breakdown.bhava.map((b) => <th key={b.house} scope="col" class="r">{b.house}</th>)}</tr></thead>
            <tbody>
              <tr><th scope="row">Rashi</th>{s.breakdown.bhava.map((b) => <td key={b.house} class="r">{SIGNS[b.sign]}</td>)}</tr>
              <tr><th scope="row">Degree</th>{s.breakdown.bhava.map((b) => <td key={b.house} class="num r">{madhyaDeg}</td>)}</tr>
              <tr><th scope="row">From Lord</th>{s.breakdown.bhava.map((b) => <td key={b.house} class="num r">{trunc(b.fromLord)}</td>)}</tr>
              <tr><th scope="row">Dig Bala</th>{s.breakdown.bhava.map((b) => <td key={b.house} class="num r">{trunc(b.dig)}</td>)}</tr>
              <tr><th scope="row">Drishti</th>{s.breakdown.bhava.map((b) => <td key={b.house} class="num r">{trunc(b.drishti)}</td>)}</tr>
              <tr><th scope="row">Planets in</th>{s.breakdown.bhava.map((b) => <td key={b.house} class="num r">{trunc(b.planets)}</td>)}</tr>
              <tr><th scope="row">Day-Night</th>{s.breakdown.bhava.map((b) => <td key={b.house} class="num r">{trunc(b.dayNight)}</td>)}</tr>
              <tr class="sum"><th scope="row">Total (rupas)</th>{s.breakdown.bhava.map((b) => <td key={b.house} class="num r strong-cell">{Math.round(b.total / 60)}</td>)}</tr>
            </tbody>
          </table>
          <p class="hint-text">Components in virupas, cut to whole numbers as PL prints them; the total is in rupas (60 virupas). Full decimals are on the Strengths tab.</p>
        </div>
      </section>
    </>
  );
}

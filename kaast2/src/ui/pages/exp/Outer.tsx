/**
 * Outer planets: Uranus, Neptune, Pluto and Chiron in the chart's own
 * sidereal frame, with the Page 1 details of the grahas (nakshatra, pada,
 * syllable, KP lords, navamsha) plus the house from the Lagna and the Moon
 * and the grahas they share a sign with. Engine: src/engine/outer.ts
 * (checked against 10 Solar Fire Gold charts, ≤ 1″).
 */
import { useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult } from '../../../engine';
import { page1Model } from '../../../engine/page1';
import { OUTER_NAMES, outerPositions, outerRows, type OuterRow } from '../../../engine/outer';
import { summaryChartOf } from '../../../engine/exp/summary';
import { SIGNS } from '../../../engine/zodiac';
import { EastIndianChart, type ChartEntry } from '../../components/EastIndianChart';
import { summaryInfo } from '../../components/PlanetSummary';
import { rasiEntries } from '../../chartEntries';
import { dm, dms } from '../../format';
import { conjunctionOrb, engine, hoverInfo } from '../../state/store';
import { ordinal } from './common';

const LORD_CLASS = ['lord-star', 'lord-sub', 'lord-subsub'] as const;

function OuterBody({ r }: { r: OuterRow }): JSX.Element {
  return <span class="pl pl-outer" title={OUTER_NAMES[r.id]}>{r.id}</span>;
}

export function Outer({ chart }: { chart: ChartResult }): JSX.Element {
  const e = engine.value;
  const swe = e.status === 'ready' ? e.swe : null;
  const pos = useMemo(() => (swe ? outerPositions(swe, chart) : null), [swe, chart]);
  const model = useMemo(() => page1Model(chart), [chart]);
  if (!swe || !pos) return <p class="pending">Waiting for the ephemeris…</p>;
  const rows = outerRows(chart, pos);
  const name = chart.input.name || 'Birth chart';

  const signs: ChartEntry[][] = rasiEntries(model.rasi, model.ascSign);
  for (const r of rows) {
    signs[r.sign]!.push({
      key: r.id,
      parts: [
        { text: r.id, tone: 'outer', bold: true, point: r.id },
        ...(r.retrograde ? [{ text: 'R', tone: 'outer', point: r.id }] : []),
        { text: ` ${dm(r.deg, r.min)} ` },
        { text: r.nakshatraAbbr, tone: 'muted' },
      ],
    });
  }

  return (
    <>
      <div class="varga-main">
        <section class="panel" aria-labelledby="h-exp-outer-chart">
          <header class="panel-head"><h2 id="h-exp-outer-chart">Rasi with the outer planets</h2></header>
          <div class="panel-body">
            <EastIndianChart title={`Rasi with Uranus, Neptune, Pluto and Chiron: ${name}`} signs={signs} lagnaSign={model.ascSign}
              centre={[{ text: 'D1', size: 56, display: true }, { text: 'Ur Ne Pl Ch', size: 24 }]} maxFont={27} minFont={9}
              info={hoverInfo.value.exp ? summaryInfo(summaryChartOf(chart, 'D1', conjunctionOrb.value, pos), 'Rasi (D1)') : undefined} />
            <p class="hint-text">Ur Uranus · Ne Neptune · Pl Pluto · Ch Chiron, drawn in a muted colour beside the nine grahas.</p>
          </div>
        </section>

        <section class="panel" aria-labelledby="h-exp-outer">
          <header class="panel-head"><h2 id="h-exp-outer">Outer planets</h2></header>
          <div class="panel-body table-wrap" tabIndex={0} role="region" aria-labelledby="h-exp-outer">
            <table class="data planets" data-testid="exp-outer">
              <thead>
                <tr>
                  <th scope="col">Body</th><th scope="col">Longitude</th><th scope="col" class="c">Flags</th>
                  <th scope="col">Nakshatra</th><th scope="col">Syllable</th><th scope="col">Pada, lords</th>
                  <th scope="col" class="c">D9</th><th scope="col" class="r">From As</th><th scope="col" class="r">From Mo</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} data-point={r.id}>
                    <th scope="row"><OuterBody r={r} /></th>
                    <td class="num"><span class="sign">{SIGNS[r.sign]}</span> {dms(r.deg, r.min, r.sec)}</td>
                    <td class="c flags">{r.retrograde ? <abbr title="Retrograde">R</abbr> : ''}</td>
                    <td>{r.nakshatraName}</td>
                    <td>{r.syllable}</td>
                    <td class="num lords">{r.pada},{r.lords.map((l, i) => <span key={i}>{i ? '/' : ''}<span class={LORD_CLASS[i]}>{l}</span></span>)}</td>
                    <td class="c">{SIGNS[r.navamshaSign]}</td>
                    <td class="num r">{r.houseFromAsc}</td>
                    <td class="num r">{r.houseFromMoon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section class="panel" aria-labelledby="h-exp-outer-conj">
        <header class="panel-head"><h2 id="h-exp-outer-conj">Who shares their sign</h2></header>
        <div class="panel-body">
          <ul class="exp-conj" data-testid="exp-outer-conj">
            {rows.map((r) => (
              <li key={r.id} class={r.conjunctions.some((c) => c.orb <= conjunctionOrb.value) ? 'tone-good' : ''}>
                <OuterBody r={r} /> {OUTER_NAMES[r.id]} in {SIGNS[r.sign]} ({ordinal(r.houseFromAsc)} house):{' '}
                {r.conjunctions.length
                  ? r.conjunctions.map((c, i) => (
                    <span key={c.with}>{i ? ', ' : ''}<span class={c.with in OUTER_NAMES ? 'pl pl-outer' : `pl pl-${c.with}`}>{c.with}</span>
                      <span class="num"> {c.orb.toFixed(2)}°</span>{c.orb <= conjunctionOrb.value ? ' (close)' : ''}</span>
                  ))
                  : <span class="muted">alone in its sign</span>}
              </li>
            ))}
          </ul>
          <p class="exp-def">
            <strong>How they are used here.</strong> The positions are sidereal, in the same frame, ayanamsa and Delta-T as the
            nine grahas, so their nakshatras, padas and KP star, sub and sub-sub lords are read the same way. Parashari astrology
            gives them no sign rulership, no dasha, no aspect and no strength, so they appear nowhere else in the app's rules.
            "Close" uses the conjunction orb of the
            Highlights tab ({conjunctionOrb.value}°). The Transits page can show them too.
          </p>
        </div>
      </section>
    </>
  );
}

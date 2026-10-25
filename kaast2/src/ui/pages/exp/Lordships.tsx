/**
 * Lordships: PL 7's "Lordships" worksheet for any chart — "Lord of N in M",
 * exchanges of lordship marked * — beside the chart, with each lord's
 * placement class (kendra, trikona, dusthana, upachaya). Rules:
 * src/engine/exp/lordships.ts (matches a PL 7.0.1 printout for D1, D9, D10).
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult } from '../../../engine';
import { PLANETS, type PointId } from '../../../engine/types';
import { lordships, type LordshipChart } from '../../../engine/exp/lordships';
import { page1Model } from '../../../engine/page1';
import { vargaGroups, type VargaId } from '../../../engine/varga/rules';
import { EastIndianChart } from '../../components/EastIndianChart';
import { vargaEntries } from '../../chartEntries';
import { Chip, Pl, VargaSelect, vargaLabel, type Tone } from './common';

const KENDRA = [1, 4, 7, 10], TRIKONA = [1, 5, 9], DUSTHANA = [6, 8, 12], UPACHAYA = [3, 6, 10, 11];
export function houseClass(h: number): { word: string; tone: Tone }[] {
  const out: { word: string; tone: Tone }[] = [];
  if (KENDRA.includes(h)) out.push({ word: 'Kendra', tone: 'good' });
  if (TRIKONA.includes(h)) out.push({ word: 'Trikona', tone: 'good' });
  if (DUSTHANA.includes(h)) out.push({ word: 'Dusthana', tone: 'bad' });
  if (UPACHAYA.includes(h)) out.push({ word: 'Upachaya', tone: 'mixed' });
  return out;
}

function LordList({ l }: { l: LordshipChart }): JSX.Element {
  return (
    <>
      <ol class="exp-lords" data-testid={`exp-lords-${l.varga}`}>
        {l.rows.map((r) => (
          <li key={r.house}>
            <span class="num">Lord of {r.house} in {r.lordIn}{r.exchangeWith !== null ? ' *' : ''}</span>
            <span> – <Pl id={r.lord} /></span>
            {r.lordIn === r.house
              ? <Chip tone="good">Own house</Chip>
              : houseClass(r.lordIn).map((c) => <Chip key={c.word} tone={c.tone}>{c.word}</Chip>)}
          </li>
        ))}
      </ol>
      <p class="hint-text">
        * Exchange of lordship (parivartana){l.exchanges.length ? `: ${l.exchanges.map(([a, b]) => `${a}↔${b}`).join(', ')}` : ': none in this chart'}.
        Houses are whole signs from this chart's own Lagna; Rahu and Ketu rule no sign.
      </p>
    </>
  );
}

export function Lordships({ chart, yogas }: { chart: ChartResult; yogas?: (varga: VargaId) => JSX.Element }): JSX.Element {
  const [varga, setVarga] = useState<VargaId>('D1');
  const model = useMemo(() => page1Model(chart), [chart]);
  const points = useMemo(() => {
    const p: Partial<Record<PointId, number>> = { As: chart.asc.lon };
    for (const id of PLANETS) p[id] = chart.bodies[id].lon;
    return p;
  }, [chart]);
  const l = useMemo(() => lordships(chart, varga), [chart, varga]);
  const name = chart.input.name || 'Birth chart';
  return (
    <>
      <div class="exp-controls"><VargaSelect id="exp-lords-chart" value={varga} onChange={setVarga} /></div>
      <div class="varga-main">
        <section class="panel" aria-labelledby="h-exp-lchart">
          <header class="panel-head"><h2 id="h-exp-lchart">{vargaLabel(varga)}</h2></header>
          <div class="panel-body">
            <EastIndianChart title={`${vargaLabel(varga)}: ${name}`} signs={vargaEntries(vargaGroups(varga, points), model.rows, l.ascSign)}
              lagnaSign={l.ascSign} centre={[{ text: varga, size: 56, display: true }]} maxFont={40} minFont={12} />
          </div>
        </section>
        <section class="panel" aria-labelledby="h-exp-lords">
          <header class="panel-head"><h2 id="h-exp-lords">{varga === 'D1' ? 'Lordships' : `${varga} Lordships`}</h2></header>
          <div class="panel-body"><LordList l={l} /></div>
        </section>
      </div>
      {yogas?.(varga)}
    </>
  );
}

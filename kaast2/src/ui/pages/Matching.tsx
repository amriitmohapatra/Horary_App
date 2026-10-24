/**
 * Matching: PL 7's Reports → Compatibility, for two charts — the current chart
 * (or another first chart) and the prospective match. Sub-tabs follow PL's
 * menu: basic birth details; birth chart and planets; Moon chart, Navamsha and
 * Dashas; Ashtakoot; Mangala Dosha; Dash-Koota. Iyer's own way of matching is on
 * the NTP (Research) tab. Personal data: the second chart is never stored.
 */
import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult } from '../../engine';
import { PartnerEntry, chartSummary } from '../components/PartnerEntry';
import { chartInput, firstChart, firstRole, matchFirstInput, partnerChart, partnerInput, type MatchRole } from '../state/store';
import { BasicDetails, ChartsAndPlanets, MoonNavDashas } from './match/Reports';

export type MatchTab = 'basic' | 'charts' | 'moon';
const TABS: { id: MatchTab; label: string }[] = [
  { id: 'basic', label: 'Basic birth details' },
  { id: 'charts', label: 'Charts and planets' },
  { id: 'moon', label: 'Moon chart, Navamsha, Dashas' },
];

export interface Pair { boy: ChartResult; girl: ChartResult; first: ChartResult; second: ChartResult }

export function Matching(): JSX.Element {
  const [tab, setTab] = useState<MatchTab>('basic');
  const [otherFirst, setOtherFirst] = useState(matchFirstInput.value !== null);
  const f = firstChart.value, p = partnerChart.value;
  const role = firstRole.value;
  const ready = f && 'ok' in f && p && 'ok' in p;
  const pair: Pair | null = ready ? {
    first: f.ok, second: p.ok,
    boy: role === 'boy' ? f.ok : p.ok, girl: role === 'boy' ? p.ok : f.ok,
  } : null;
  const otherRole: MatchRole = role === 'boy' ? 'girl' : 'boy';
  const word = (r: MatchRole) => (r === 'boy' ? 'Boy' : 'Girl');

  return (
    <article class="match" data-testid="match-page">
      <p class="hint-text exp-intro">
        Compatibility of two birth charts, as Parashara's Light's Compatibility reports lay it out. Enter the prospective match,
        or both charts. Kootas count from the girl's Moon star to the boy's, so say who is who.
      </p>
      <div class="match-people">
        <section class="panel" aria-labelledby="h-m-first">
          <header class="panel-head"><h2 id="h-m-first">First chart</h2></header>
          <div class="panel-body">
            <div class="segmented" role="group" aria-label="The first chart is the">
              {(['boy', 'girl'] as const).map((r) => (
                <button key={r} type="button" class="seg" aria-pressed={role === r} onClick={() => { firstRole.value = r; }}>{word(r)}</button>
              ))}
            </div>
            {!otherFirst
              ? (
                <p class="partner-line">
                  <span>{chartInput.value ? `The current chart: ${chartSummary(chartInput.value)}` : 'The current chart'}</span>
                  <button type="button" class="btn btn-small" onClick={() => setOtherFirst(true)}>Use another chart</button>
                </p>
              ) : (
                <>
                  <PartnerEntry target={matchFirstInput} prefix="mf" title="Enter the first person's birth details" empty="Enter the first person's birth details." />
                  <button type="button" class="btn btn-small btn-quiet" onClick={() => { matchFirstInput.value = null; setOtherFirst(false); }}>Use the current chart instead</button>
                </>
              )}
          </div>
        </section>
        <section class="panel" aria-labelledby="h-m-second">
          <header class="panel-head"><h2 id="h-m-second">Prospective match ({word(otherRole).toLowerCase()})</h2></header>
          <div class="panel-body">
            <PartnerEntry target={partnerInput} prefix="pm" title="Enter the prospective match's birth details" empty="No second chart yet." />
          </div>
        </section>
      </div>
      {f && 'error' in f && <p class="status status-bad" role="alert">{f.error}</p>}
      {p && 'error' in p && <p class="status status-bad" role="alert">{p.error}</p>}

      {pair && (
        <>
          <div class="segmented" role="group" aria-label="Compatibility reports">
            {TABS.map((x) => <button key={x.id} type="button" class="seg" aria-pressed={tab === x.id} onClick={() => setTab(x.id)}>{x.label}</button>)}
          </div>
          {tab === 'basic' && <BasicDetails pair={pair} />}
          {tab === 'charts' && <ChartsAndPlanets pair={pair} />}
          {tab === 'moon' && <MoonNavDashas pair={pair} />}
        </>
      )}
    </article>
  );
}

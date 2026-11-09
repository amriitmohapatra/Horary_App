/**
 * Planet details on hover (v0.12): the card a chart shows for the body under
 * the pointer, and the per-page switch. Rules: src/engine/exp/summary.ts.
 */
import type { JSX } from 'preact';
import { bodySummary, type BodyId, type BodySummary, type SummaryChart } from '../../engine/exp/summary';
import type { PlanetState } from '../../engine/exp/states';
import { OUTER_NAMES, type OuterId } from '../../engine/outer';
import { PLANET_NAMES, SIGN_NAMES } from '../../engine/names';
import { t } from '../i18n';
import { ordinal, stateChips } from '../pages/exp/common';
import { hoverInfo, setHoverInfo, type HoverScope } from '../state/store';

const nameOf = (id: BodyId): string => (id in OUTER_NAMES ? OUTER_NAMES[id as OuterId] : PLANET_NAMES[id as keyof typeof PLANET_NAMES]);
const FRACTION: Record<string, string> = { '4/4': 'full', '3/4': '¾', '1/2': '½', '1/4': '¼' };
const OUTER_IDS = new Set<string>(Object.keys(OUTER_NAMES));

function B({ id }: { id: BodyId }): JSX.Element {
  return <b class={OUTER_IDS.has(id) ? 'pl pl-outer' : `pl pl-${id}`}>{id}</b>;
}

function list<T>(items: T[], render: (x: T) => JSX.Element | string): JSX.Element[] {
  return items.map((x, i) => <span key={i}>{i ? ', ' : ''}{render(x)}</span>);
}

export function SummaryCard({ s, chartLabel }: { s: BodySummary; chartLabel: string }): JSX.Element {
  const outer = OUTER_IDS.has(s.id);
  const asState: PlanetState = {
    id: s.id as PlanetState['id'], sign: s.sign, house: s.house, dignity: s.dignity, retrograde: s.retrograde, combust: s.combust,
    vargottama: s.vargottama, digBala: s.digBala, trik: s.house === 3 || s.house === 6 || s.house === 8 || s.house === 12 ? s.house : null,
  };
  const chips = stateChips(asState);
  const full = s.aspectedBy.filter((a) => a.fraction === '4/4');
  const partial = s.aspectedBy.filter((a) => a.fraction !== '4/4');
  const v = (x?: number) => (x !== undefined ? ` · ${x} v` : '');
  return (
    <div class="tip-card" data-point={s.id}>
      <p class="tip-head"><B id={s.id} /> {nameOf(s.id)} <span class="muted">· {chartLabel}</span></p>
      <p>{SIGN_NAMES[s.sign]}, {ordinal(s.house)} house
        {s.nakshatra && <> · {s.nakshatra.name} {s.nakshatra.pada} <span class="muted">(star lord {s.nakshatra.lord})</span></>}</p>
      <dl class="tip-list">
        <dt>State</dt>
        <dd>{chips.length ? chips.map((c) => <span key={c.word} class={`tip-chip tone-${c.tone}`}>{c.word}</span>) : <span class="muted">{outer ? 'No Parashari dignity' : 'Neutral sign, no special state'}</span>}</dd>
        <dt>Rules</dt>
        <dd>{s.rules.length ? `${s.rules.map(ordinal).join(' and ')} house${s.rules.length > 1 ? 's' : ''}`
          : <span class="muted">{outer ? 'No sign (not a graha)' : 'No sign (a node)'}</span>}
        {s.dispositor && s.dispositor.id !== s.id && <> · dispositor <B id={s.dispositor.id} /> in {ordinal(s.dispositor.house)}</>}</dd>
        <dt>Aspected by</dt>
        <dd>{full.length ? list(full, (a) => <><B id={a.from} /> ({ordinal(a.count)}{v(a.virupas)})</>) : <span class="muted">no full aspect</span>}
          {partial.length > 0 && <span class="tip-partial"> · partial: {list(partial, (a) => <><B id={a.from} /> {FRACTION[a.fraction]}{v(a.virupas)}</>)}</span>}</dd>
        {!outer && <>
          <dt>Aspects</dt>
          <dd>{s.aspectsHouses.length ? `${s.aspectsHouses.map(ordinal).join(', ')}` : '—'}
            {s.aspectsBodies.length > 0 && <> → {list(s.aspectsBodies, (b) => <B id={b} />)}</>}</dd>
        </>}
        <dt>Conjunct</dt>
        <dd>{s.conjunctions.length
          ? list(s.conjunctions, (c) => <><B id={c.with} />{c.orb !== null ? ` ${c.orb.toFixed(1)}°` : ''}{c.war ? ' (war)' : c.close ? ' (close)' : ''}</>)
          : <span class="muted">alone in its sign</span>}</dd>
        {s.overNatal.length > 0 && <>
          <dt>Over natal</dt>
          <dd>{list(s.overNatal, (n) => <><B id={n.id} /> {n.orb.toFixed(1)}°</>)}</dd>
        </>}
      </dl>
    </div>
  );
}

/** The `info` callback for EastIndianChart from a summary context. */
export function summaryInfo(c: SummaryChart, chartLabel: string): (point: string) => JSX.Element | null {
  return (point) => {
    const s = bodySummary(c, point as BodyId);
    return s ? <SummaryCard s={s} chartLabel={chartLabel} /> : null;
  };
}

/** The page's switch for planet details on hover. */
export function HoverToggle({ scope }: { scope: HoverScope }): JSX.Element {
  return (
    <label class="check hover-toggle" title={t('hover.hint')}>
      <input type="checkbox" checked={hoverInfo.value[scope]} data-testid={`hover-toggle-${scope}`}
        onChange={(e) => setHoverInfo(scope, e.currentTarget.checked)} /> {t('hover.toggle')}
    </label>
  );
}

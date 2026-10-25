/** Small pieces shared by the KP (Research) sub-tabs, and the moment of judgement. */
import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { cast, type ChartInput, type ChartResult, type PlanetId } from '../../../engine';
import type { SwissEph } from '../../../engine/ephem/swisseph';
import { ChartForm } from '../../components/ChartForm';
import { chartSummary } from '../../components/PartnerEntry';
import { kpMoment, nowInput, overrides } from '../../state/store';
import { PLANET_NAMES } from '../../../engine/names';
import type { GuidanceTone } from '../../../engine/kp/guidance';
import { t } from '../../i18n';
import { civilDate } from '../../format';

export function Pl({ id }: { id: PlanetId }): JSX.Element {
  return <span class={`pl pl-${id}`} title={PLANET_NAMES[id]}>{id}</span>;
}
export function Chips({ ids }: { ids: readonly PlanetId[] }): JSX.Element {
  if (!ids.length) return <span class="muted" aria-label={t('kp.none')}>–</span>;
  return <>{ids.map((id, i) => <span key={`${id}${i}`}>{i ? ' ' : ''}<Pl id={id} /></span>)}</>;
}
export const houseList = (hs: readonly number[]): string => (hs.length ? hs.join(', ') : '–');

const TONE_WORD: Record<GuidanceTone, string> = { good: 'Good', bad: 'Bad', mixed: 'Mixed', info: 'Note' };
export function ToneTag({ tone }: { tone: GuidanceTone }): JSX.Element {
  return <span class={`ntp-tag tone-${tone}`}>{TONE_WORD[tone]}</span>;
}
/** A period's dates in the chart's zone (India's war time shown as IST, as the dasha pages do). */
export function periodDates(start: number, end: number, zone: number): string {
  return `${civilDate(start, zone)} – ${civilDate(end, zone)}`;
}
export const zoneOf = (tz: number, dst: number): number => (tz + dst === 6.5 ? 5.5 : tz + dst);


/** The moment of judgement: set, or now at the chart's place. */
export function momentInput(c: ChartResult): ChartInput {
  return kpMoment.value ?? nowInput({ name: c.input.place.name, lat: c.input.place.latDeg, lon: c.input.place.lonDeg, tz: zoneOf(c.input.tzHours, c.input.dstHours) });
}
/** Cast another moment with the KP page's calculation (same profile, ayanamsa, node and year). */
export function castLike(swe: SwissEph, input: ChartInput, c: ChartResult): ChartResult {
  return cast(swe, { ...input, profileId: c.input.profileId, overrides: { ...overrides.value, ayanamsa: c.profile.ayanamsa, node: c.profile.node, dashaYearDays: c.profile.dashaYearDays } });
}

/** One line with the moment of judgement and buttons to set it (shared by Ruling planets and Horary). */
export function MomentPicker({ c }: { c: ChartResult }): JSX.Element {
  const [open, setOpen] = useState(false);
  const v = kpMoment.value;
  if (open) {
    return (
      <div class="partner-entry" data-testid="kpm-entry">
        <ChartForm target={kpMoment} prefix="kpm" label={t('kp.moment.set')} onDone={() => setOpen(false)} />
        <button type="button" class="btn btn-quiet" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    );
  }
  return (
    <p class="partner-line" data-testid="kpm-summary">
      <span><b>{t('kp.moment')}</b> {v ? chartSummary(v) : t('kp.moment.now', { place: c.input.place.name })}</span>
      <button type="button" class="btn btn-small" onClick={() => setOpen(true)}>{t('kp.moment.change')}</button>
      {v && <button type="button" class="btn btn-small btn-quiet" onClick={() => { kpMoment.value = null; }}>{t('kp.moment.useNow')}</button>}
    </p>
  );
}

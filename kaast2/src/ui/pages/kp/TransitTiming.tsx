/**
 * KP (Research) → Transit timing (src/engine/kp/transit.ts): within a period,
 * the days a body passes through units whose sign, star and sub lords are all
 * among the period lords (B5 pp. 226–229, KP5-060; B6 pp. 176, 254, 334).
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult, PlanetId } from '../../../engine';
import { PLANETS } from '../../../engine/types';
import { PLANET_NAMES } from '../../../engine/names';
import { chainAt, mahadashas } from '../../../engine/dasha/vimshottari';
import { zoneVisits } from '../../../engine/kp/transit';
import { julianDay } from '../../../engine/time/julian';
import { t } from '../../i18n';
import { civilDate, civilTime } from '../../format';
import { engine, kpPeriod } from '../../state/store';
import { Chips, Pl, periodDates, zoneOf } from './common';

const BODIES: PlanetId[] = ['Su', 'Mo', 'Ju', 'Ve', 'Me', 'Ma', 'Sa'];
const MAX_DAYS: Partial<Record<PlanetId, number>> = { Mo: 400, Su: 4000, Me: 4000, Ve: 4000, Ma: 8000, Ju: 30000, Sa: 30000 };

export function TransitTiming({ c }: { c: ChartResult }): JSX.Element {
  const e = engine.value;
  const swe = e.status === 'ready' ? e.swe : null;
  const zone = zoneOf(c.input.tzHours, c.input.dstHours);
  const current = useMemo(() => {
    const d = new Date();
    const jd = julianDay(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours() + d.getUTCMinutes() / 60);
    const ch = chainAt(mahadashas(c.bodies.Mo.lonDeg, c.moment.jdUT, c.profile.dashaYearDays), jd, 3);
    const an = ch.at(-1);
    return an ? { lords: an.lords, start: an.start, end: an.end } : null;
  }, [c]);
  const period = kpPeriod.value ?? current;
  const [body, setBody] = useState<PlanetId>('Su');
  const [extra, setExtra] = useState<PlanetId[]>([]);
  const lords = period ? [...new Set([...period.lords, ...extra])] : [];
  const span = period ? Math.min(period.end - period.start, MAX_DAYS[body] ?? 4000) : 0;
  const visits = useMemo(() => {
    if (!swe || !period) return [];
    return zoneVisits(swe, c.profile, body, (u) => lords.includes(u.signLord) && lords.includes(u.star) && lords.includes(u.sub), period.start, period.start + span);
  }, [swe, c, body, period?.start, span, lords.join()]);
  if (!period) return <p class="empty">{t('kp.tr.noPeriod')}</p>;

  return (
    <section class="panel" aria-labelledby="h-kp-tr">
      <header class="panel-head"><h2 id="h-kp-tr">{t('kp.tr')}</h2></header>
      <div class="panel-body">
        <p data-testid="kp-tr-period"><b>{t('kp.tr.period')}</b> <Chips ids={period.lords} /> · {periodDates(period.start, period.end, zone)}
          {kpPeriod.value && <button type="button" class="btn btn-small btn-quiet" onClick={() => { kpPeriod.value = null; }}>{t('kp.tr.current')}</button>}</p>
        <div class="field-row">
          <div class="field inline-field"><label for="kp-tr-body">{t('kp.tr.body')}</label>
            <select id="kp-tr-body" value={body} onChange={(ev) => setBody(ev.currentTarget.value as PlanetId)}>
              {BODIES.map((b) => <option key={b} value={b}>{PLANET_NAMES[b]}</option>)}
            </select></div>
          <fieldset class="check-group"><legend>{t('kp.tr.extra')}</legend>
            {PLANETS.filter((p) => !period.lords.includes(p)).map((p) => (
              <label key={p} class="check"><input type="checkbox" checked={extra.includes(p)} onChange={(ev) => setExtra(ev.currentTarget.checked ? [...extra, p] : extra.filter((x) => x !== p))} /> {p}</label>
            ))}
          </fieldset>
        </div>
        <p class="hint-text">{t('kp.tr.intro')}</p>
        {visits.length ? (
          <div class="table-wrap">
            <table class="data" data-testid="kp-tr">
              <thead><tr><th scope="col">{t('kp.tr.from')}</th><th scope="col">{t('kp.tr.to')}</th><th scope="col">{t('kp.tr.unit')}</th></tr></thead>
              <tbody>
                {visits.slice(0, 300).map((v) => (
                  <tr key={v.start}>
                    <td class="num">{civilDate(v.start, zone)} {civilTime(v.start, zone)}</td>
                    <td class="num">{civilDate(v.end, zone)} {civilTime(v.end, zone)}</td>
                    <td><Pl id={v.unit.signLord} /> / <Pl id={v.unit.star} /> / <Pl id={v.unit.sub} /> <span class="muted">(no. {v.unit.n})</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p class="muted">{t('kp.tr.none')}</p>}
        {span < period.end - period.start && <p class="muted">{t('kp.tr.cut', { days: Math.round(span) })}</p>}
        <p class="hint-text">{t('kp.tr.note')}</p>
      </div>
    </section>
  );
}

/**
 * Transits (slice 8): a transit chart drawn around the natal chart for any
 * instant, step controls (1 s … 10 years), the transit positions with houses
 * from the natal ascendant and Moon, upcoming sign/nakshatra changes and
 * stations, Sade Sati periods and Jupiter/Saturn returns. Same engine and
 * profile as the natal chart; no cache (PL's transit cache is not needed).
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult } from '../../engine';
import { PLANETS, type PlanetId } from '../../engine/types';
import { NAKSHATRA_SHORT, PLANET_NAMES, NAKSHATRA_NAMES } from '../../engine/names';
import { SIGNS, dmsInSign, nakshatraIndex, signIndex } from '../../engine/zodiac';
import { fromJulianDay, julianDay } from '../../engine/time/julian';
import { findEvents, returns, sadeSati, stepJd, transitPositions, type EventKind, type StepUnit } from '../../engine/transit';
import { EastIndianChart, type ChartEntry } from '../components/EastIndianChart';
import { signRow } from '../chartEntries';
import { Icon } from '../components/Icon';
import { t, type MessageKey } from '../i18n';
import { civilDate, civilTime, dm, pad2 } from '../format';
import { engine } from '../state/store';

const UNITS: StepUnit[] = ['s', 'min', 'h', 'd', 'mo', 'y', '10y'];
const HORIZONS = [30, 91, 365] as const;

function nowJd(): number {
  const d = new Date();
  return julianDay(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600);
}

export function Transits({ chart }: { chart: ChartResult }): JSX.Element {
  const e = engine.value;
  const swe = e.status === 'ready' ? e.swe : null;
  const [jd, setJd] = useState(nowJd);
  const [zone, setZone] = useState(chart.input.tzHours + chart.input.dstHours === 6.5 ? 5.5 : chart.input.tzHours + chart.input.dstHours);
  const [unit, setUnit] = useState<StepUnit>('d');
  const [kinds, setKinds] = useState<Record<EventKind, boolean>>({ sign: true, nakshatra: false, pada: false, station: true });
  const [horizon, setHorizon] = useState<(typeof HORIZONS)[number]>(91);

  const pos = useMemo(() => (swe ? transitPositions(swe, chart.profile, jd) : null), [swe, chart.profile, jd]);
  const events = useMemo(() => {
    if (!swe) return [];
    const ks = (Object.keys(kinds) as EventKind[]).filter((k) => kinds[k]);
    return ks.length ? findEvents(swe, chart.profile, { bodies: PLANETS, kinds: ks, fromJd: jd, toJd: jd + horizon }).slice(0, 300) : [];
  }, [swe, chart.profile, jd, kinds, horizon]);
  const life = useMemo(() => {
    if (!swe) return null;
    const from = chart.moment.jdUT, to = Math.min(chart.moment.jdUT + 100 * 365.25, 2597641);
    return {
      sade: sadeSati(swe, chart.profile, signIndex(chart.bodies.Mo.lon), from, to),
      // Start half a cycle after birth, so the birth's own retrograde loop is not counted as a return.
      ju: returns(swe, chart.profile, 'Ju', chart.bodies.Ju.lonDeg, from + 4333 / 2, to),
      sa: returns(swe, chart.profile, 'Sa', chart.bodies.Sa.lonDeg, from + 10759 / 2, to),
    };
  }, [swe, chart]);

  if (!swe || !pos) return <p class="pending">{t('engine.booting')}</p>;
  const natalAsc = signIndex(chart.asc.lon), natalMoon = signIndex(chart.bodies.Mo.lon);
  const local = fromJulianDay(jd + zone / 24);
  const setLocal = (date: string, time: string) => {
    const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date), tm = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(time);
    if (!d || !tm) return;
    setJd(julianDay(+d[1]!, +d[2]!, +d[3]!, +tm[1]! + +tm[2]! / 60 + +(tm[3] ?? 0) / 3600 - zone));
  };
  const dateStr = `${local.y}-${pad2(local.m)}-${pad2(local.d)}`, timeStr = `${pad2(local.h)}:${pad2(local.mi)}:${pad2(local.s)}`;
  const fmt = (x: number) => `${civilDate(x, zone)} ${civilTime(x, zone)}`;

  const signs: ChartEntry[][] = Array.from({ length: 12 }, (_, s) => [signRow(s, natalAsc)]);
  for (const p of PLANETS) {
    const tp = pos[p];
    const { d, m } = dmsInSign(tp.lon);
    signs[signIndex(tp.lon)]!.push({ key: `t${p}`, parts: [{ text: p, tone: p, bold: true }, ...(tp.retrograde ? [{ text: 'R', tone: p }] : []), { text: ` ${dm(d, m)}` }] });
  }
  for (const p of PLANETS) {
    const s = signIndex(chart.bodies[p].lon);
    const last = signs[s]!.find((x) => x.key === `n${s}`);
    if (last) last.parts.push({ text: ` ${p}`, tone: 'muted' });
    else signs[s]!.push({ key: `n${s}`, parts: [{ text: t('tr.natalShort'), tone: 'muted' }, { text: ` ${p}`, tone: 'muted' }] });
  }

  const evText = (ev: (typeof events)[number]): string => {
    if (ev.kind === 'station') return t(ev.direction === 'retrograde' ? 'tr.stationR' : 'tr.stationD');
    if (ev.kind === 'sign') return `${SIGNS[ev.from]} → ${SIGNS[ev.to]}`;
    if (ev.kind === 'nakshatra') return `${NAKSHATRA_SHORT[ev.from]} → ${NAKSHATRA_SHORT[ev.to]}`;
    return `${NAKSHATRA_SHORT[Math.floor(ev.to / 4)]} ${t('tr.pada')} ${(ev.to % 4) + 1}`;
  };

  return (
    <article class="transits" data-testid="transits-page">
      <section class="panel" aria-label={t('tr.controls')}>
        <div class="panel-body controls-row">
          <div class="field"><label for="tr-date">{t('form.date')}</label>
            <input id="tr-date" type="date" value={dateStr} onInput={(ev) => setLocal(ev.currentTarget.value, timeStr)} /></div>
          <div class="field"><label for="tr-time">{t('form.time')}</label>
            <input id="tr-time" type="time" step={1} value={timeStr} onInput={(ev) => setLocal(dateStr, ev.currentTarget.value)} /></div>
          <div class="field"><label for="tr-zone">{t('tr.zone')}</label>
            <input id="tr-zone" inputMode="decimal" value={String(zone)} onInput={(ev) => { const v = Number(ev.currentTarget.value); if (Number.isFinite(v) && Math.abs(v) <= 14) setZone(v); }} /></div>
          <div class="field"><label for="tr-unit">{t('tr.step')}</label>
            <span class="inline">
              <button type="button" class="icon-btn" aria-label={t('tr.back')} title={t('tr.back')} onClick={() => setJd((x) => stepJd(x, unit, -1))}><Icon name="arrowUp" /></button>
              <select id="tr-unit" value={unit} onChange={(ev) => setUnit(ev.currentTarget.value as StepUnit)}>
                {UNITS.map((u) => <option key={u} value={u}>{t(`tr.unit.${u}` as MessageKey)}</option>)}
              </select>
              <button type="button" class="icon-btn" aria-label={t('tr.forward')} title={t('tr.forward')} onClick={() => setJd((x) => stepJd(x, unit, 1))}><Icon name="arrowDown" /></button>
            </span>
          </div>
          <button type="button" class="btn btn-small" onClick={() => setJd(nowJd())}>{t('form.now')}</button>
        </div>
      </section>

      <div class="varga-main">
        <section class="panel" aria-labelledby="h-tchart">
          <header class="panel-head"><h2 id="h-tchart">{t('tr.chart')}</h2></header>
          <div class="panel-body">
            <EastIndianChart title={`${t('tr.chart')} ${fmt(jd)}`} signs={signs} lagnaSign={natalAsc}
              centre={[{ text: t('tr.transit'), size: 30, display: true }, { text: civilDate(jd, zone), size: 22 }, { text: civilTime(jd, zone), size: 22 }]}
              maxFont={30} minFont={11} />
            <p class="hint-text">{t('tr.chartNote')}</p>
          </div>
        </section>
        <section class="panel" aria-labelledby="h-tpos">
          <header class="panel-head"><h2 id="h-tpos">{t('tr.positions')}</h2></header>
          <div class="panel-body table-wrap">
            <table class="data" data-testid="transit-table">
              <thead><tr><th scope="col">{t('col.body')}</th><th scope="col">{t('col.longitude')}</th><th scope="col">{t('col.nakshatra')}</th>
                <th scope="col" class="r">{t('tr.fromAsc')}</th><th scope="col" class="r">{t('tr.fromMoon')}</th></tr></thead>
              <tbody>
                {PLANETS.map((p) => {
                  const tp = pos[p], s = signIndex(tp.lon), { d, m, s: sec } = dmsInSign(tp.lon);
                  return (
                    <tr key={p} data-point={p}>
                      <th scope="row"><span class={`pl pl-${p}`} title={PLANET_NAMES[p]}>{p}</span>{tp.retrograde ? ' R' : ''}</th>
                      <td class="num">{SIGNS[s]} {pad2(d)}:{pad2(m)}:{pad2(sec)}</td>
                      <td>{NAKSHATRA_NAMES[nakshatraIndex(tp.lon)]}</td>
                      <td class="num r">{((s - natalAsc + 12) % 12) + 1}</td>
                      <td class="num r">{((s - natalMoon + 12) % 12) + 1}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section class="panel" aria-labelledby="h-events">
        <header class="panel-head"><h2 id="h-events">{t('tr.events')}</h2></header>
        <div class="panel-body">
          <div class="controls-row">
            {(['sign', 'nakshatra', 'pada', 'station'] as EventKind[]).map((k) => (
              <label key={k} class="check"><input type="checkbox" checked={kinds[k]} onChange={(ev) => setKinds((o) => ({ ...o, [k]: ev.currentTarget.checked }))} /> {t(`tr.kind.${k}` as MessageKey)}</label>
            ))}
            <div class="field"><label for="tr-h">{t('tr.horizon')}</label>
              <select id="tr-h" value={horizon} onChange={(ev) => setHorizon(+ev.currentTarget.value as (typeof HORIZONS)[number])}>
                {HORIZONS.map((h) => <option key={h} value={h}>{t(`tr.horizon.${h}` as MessageKey)}</option>)}
              </select></div>
          </div>
          <div class="table-wrap events-wrap" tabIndex={0} role="region" aria-label={t('tr.events')}>
            <table class="data" data-testid="transit-events">
              <thead><tr><th scope="col">{t('tr.when')}</th><th scope="col">{t('col.body')}</th><th scope="col">{t('tr.event')}</th></tr></thead>
              <tbody>
                {events.length === 0 && <tr><td colSpan={3} class="muted">{t('tr.noEvents')}</td></tr>}
                {events.map((ev, i) => (
                  <tr key={i}>
                    <td class="num">{fmt(ev.jdUT)}</td>
                    <th scope="row"><span class={`pl pl-${ev.body}`}>{ev.body}</span></th>
                    <td>{evText(ev)}{ev.kind !== 'station' && ev.direction === 'retrograde' ? ` (${t('tr.retro')})` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {life && (
        <div class="two-col">
          <section class="panel" aria-labelledby="h-sade">
            <header class="panel-head"><h2 id="h-sade">{t('tr.sadeSati')}</h2></header>
            <div class="panel-body table-wrap">
              <table class="data" data-testid="sade-sati">
                <thead><tr><th scope="col">{t('tr.period')}</th><th scope="col">{t('tr.phases')}</th></tr></thead>
                <tbody>
                  {life.sade.map((p, i) => (
                    <tr key={i}>
                      <td class="num">{civilDate(p.start, zone)} → {civilDate(p.end, zone)}</td>
                      <td>{p.phases.map((ph) => `${ph.phase} (${SIGNS[ph.sign]})`).join(' · ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p class="hint-text">{t('tr.sadeNote', { sign: SIGNS[natalMoon]! })}</p>
            </div>
          </section>
          <section class="panel" aria-labelledby="h-returns">
            <header class="panel-head"><h2 id="h-returns">{t('tr.returns')}</h2></header>
            <div class="panel-body table-wrap">
              <table class="data" data-testid="returns">
                <thead><tr><th scope="col">{t('col.body')}</th><th scope="col">{t('tr.when')}</th></tr></thead>
                <tbody>
                  {([...life.ju, ...life.sa] as { jdUT: number; body: PlanetId; direction: string }[]).sort((a, b) => a.jdUT - b.jdUT).map((r, i) => (
                    <tr key={i}>
                      <th scope="row"><span class={`pl pl-${r.body}`}>{r.body}</span></th>
                      <td class="num">{civilDate(r.jdUT, zone)}{r.direction === 'retrograde' ? ` (${t('tr.retro')})` : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </article>
  );
}

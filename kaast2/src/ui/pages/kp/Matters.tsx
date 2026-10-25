/**
 * KP (Research) → Life matters: promise by the cuspal sub lord and candidate
 * Dasa–Bhukti–Anthra periods (src/engine/kp/matters.ts). The candidates are
 * ranked by Krishnamurti's order of strength but NOT narrowed by it: on the
 * Readers' own examples the rank alone barely singles out the event
 * (docs/specs/kp_research.md §6), so the page offers the ruling-planet
 * filter (KP6-046) and the transit search (KP6-062) as the next steps.
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult, PlanetId } from '../../../engine';
import { mahadashas } from '../../../engine/dasha/vimshottari';
import type { KpModel } from '../../../engine/kp/kp';
import type { kpSignifications } from '../../../engine/kp/significators';
import { MATTERS, judgeMatter, levelFor, timingWindows, type TimingWindow } from '../../../engine/kp/matters';
import { rulingPlanets } from '../../../engine/kp/ruling';
import { vara } from '../../../engine/panchanga/panchanga';
import { t } from '../../i18n';
import { engine, kpMoment, kpPeriod, kpTab } from '../../state/store';
import { Chips, Pl, castLike, houseList, momentInput, periodDates, zoneOf } from './common';

type Sig = ReturnType<typeof kpSignifications>;
const PROMISE_TONE = { promised: 'good', mixed: 'mixed', denied: 'bad', 'not shown': 'info' } as const;
const YEAR = 365.25;

export function Matters({ c, m, sig }: { c: ChartResult; m: KpModel; sig: Sig }): JSX.Element {
  const [id, setId] = useState('marriage');
  const birthYear = c.input.date.y;
  const thisYear = new Date().getFullYear();
  const [from, setFrom] = useState(Math.max(birthYear + 1, thisYear - 10));
  const [to, setTo] = useState(Math.min(birthYear + 100, Math.max(thisYear + 20, birthYear + 30)));
  const [strongOnly, setStrongOnly] = useState(true);
  const [rpOnly, setRpOnly] = useState(false);
  const judged = useMemo(() => MATTERS.map((x) => judgeMatter(x, m, sig)), [m, sig]);
  const matter = MATTERS.find((x) => x.id === id)!;
  const j = judged.find((x) => x.matter.id === id)!;
  const zone = zoneOf(c.input.tzHours, c.input.dstHours);

  const e = engine.value;
  const rps = useMemo(() => {
    if (!rpOnly || e.status !== 'ready') return null;
    const mc = castLike(e.swe, momentInput(c), c);  // now (or the set moment), recomputed when the filter is switched on
    return rulingPlanets(mc, vara(e.swe, mc).lord as PlanetId);
  }, [rpOnly, e, c, zone, kpMoment.value]);

  const windows = useMemo(() => {
    const mahas = mahadashas(c.bodies.Mo.lonDeg, c.moment.jdUT, c.profile.dashaYearDays);
    const a = c.moment.jdUT + (from - birthYear) * YEAR, b = c.moment.jdUT + (to - birthYear) * YEAR;
    let ws = timingWindows(mahas, matter, sig, a, b);
    if (rps) ws = ws.filter((w) => w.lords.every((l) => rps.ordered.includes(l)));
    if (strongOnly && ws.length) {
      // Strongest quarter of the candidate time.
      const sorted = [...ws].sort((x, y) => y.strength - x.strength);
      const total = ws.reduce((s, w) => s + (w.end - w.start), 0);
      let acc = 0, cut = sorted[0]!.strength;
      for (const w of sorted) { acc += w.end - w.start; cut = w.strength; if (acc >= total / 4) break; }
      ws = ws.filter((w) => w.strength >= cut);
    }
    return ws;
  }, [c, matter, sig, from, to, birthYear, strongOnly, rps]);

  const showTransit = (w: TimingWindow) => { kpPeriod.value = { lords: w.lords, start: w.start, end: w.end }; kpTab.value = 'transit'; };

  return (
    <>
      <section class="panel" aria-labelledby="h-kp-promise">
        <header class="panel-head"><h2 id="h-kp-promise">{t('kp.promise')}</h2></header>
        <div class="panel-body">
          <p class="hint-text">{t('kp.promiseIntro')}</p>
          <div class="table-wrap">
            <table class="data" data-testid="kp-promise">
              <thead><tr>
                <th scope="col">{t('kp.matter')}</th><th scope="col" class="c">{t('kp.cusp')}</th>
                <th scope="col">{t('kp.subLord')}</th><th scope="col">{t('kp.subStar')}</th>
                <th scope="col">{t('kp.subHouses')}</th><th scope="col">{t('kp.yesNo')}</th><th scope="col">{t('kp.promiseCol')}</th>
              </tr></thead>
              <tbody>
                {judged.map((x) => (
                  <tr key={x.matter.id} data-matter={x.matter.id} class={x.matter.id === id ? 'is-current' : undefined}>
                    <th scope="row"><button type="button" class="btn-link" aria-pressed={x.matter.id === id} onClick={() => setId(x.matter.id)}>{x.matter.label}</button></th>
                    <td class="c num">{x.cusp}</td>
                    <td><Pl id={x.subLord} /></td>
                    <td><Pl id={m.planets.find((p) => p.id === x.subLord)!.lords[0]} /></td>
                    <td class="num">{houseList(x.subHouses)}</td>
                    <td class="num">{x.matter.yes.join('-')} / {x.matter.deny.length ? x.matter.deny.join('-') : '–'}{x.matter.denyFrom === 'derived' ? '*' : ''}</td>
                    <td><span class={`ntp-tag tone-${PROMISE_TONE[x.promise]}`}>{x.promise}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="hint-text">{t('kp.promiseNote')}</p>
        </div>
      </section>

      <section class="panel" aria-labelledby="h-kp-matter">
        <header class="panel-head"><h2 id="h-kp-matter">{matter.label}</h2></header>
        <div class="panel-body">
          <p data-testid="kp-matter-chain">
            {t('kp.chain', { cusp: j.cusp })} <Pl id={j.subLord} /> → {t('kp.chainStar')} <Pl id={m.planets.find((p) => p.id === j.subLord)!.lords[0]} /> → {t('kp.chainHouses', { houses: houseList(j.subHouses) })} → <b>{j.promise}</b>
          </p>
          <ul class="hint-text">
            {matter.notes.map((n, i) => <li key={i}>{n}</li>)}
            <li><cite>{matter.cite}</cite></li>
          </ul>
          <p>{t('kp.sigOfMatter')} <span data-testid="kp-matter-sig"><Chips ids={j.significators} /></span>
            {j.pruned.length ? <span class="muted"> · {t('kp.pruned')} <Chips ids={j.pruned} /></span> : null}</p>

          <h3 class="ntp-sub">{t('kp.periods')}</h3>
          <p class="kp-warn" role="note">{t('kp.periodsWarn')}</p>
          <div class="field-row">
            <div class="field inline-field"><label for="kp-from">{t('kp.fromYear')}</label>
              <input id="kp-from" type="number" min={birthYear} max={birthYear + 120} value={from} onChange={(ev) => setFrom(Number(ev.currentTarget.value) || from)} /></div>
            <div class="field inline-field"><label for="kp-to">{t('kp.toYear')}</label>
              <input id="kp-to" type="number" min={birthYear} max={birthYear + 120} value={to} onChange={(ev) => setTo(Number(ev.currentTarget.value) || to)} /></div>
            <label class="check"><input type="checkbox" checked={strongOnly} onChange={(ev) => setStrongOnly(ev.currentTarget.checked)} /> {t('kp.strongOnly')}</label>
            <label class="check"><input type="checkbox" checked={rpOnly} onChange={(ev) => setRpOnly(ev.currentTarget.checked)} /> {t('kp.rpOnly')}</label>
          </div>
          {rps && <p class="hint-text" data-testid="kp-matter-rps">{t('kp.rpUsed')} <Chips ids={rps.ordered} /></p>}
          <div class="table-wrap">
            <table class="data" data-testid="kp-periods">
              <thead><tr>
                <th scope="col">{t('kp.dba')}</th><th scope="col">{t('kp.dates')}</th>
                <th scope="col" title={t('kp.levelsTitle')}>{t('kp.levels')}</th><th scope="col" class="c">{t('kp.strength')}</th>
                <th scope="col">{t('kp.obstructing')}</th><th scope="col"><span class="sr-only">{t('kp.transitDays')}</span></th>
              </tr></thead>
              <tbody>
                {windows.slice(0, 200).map((w) => (
                  <tr key={w.start}>
                    <th scope="row"><Chips ids={w.lords} /></th>
                    <td class="num">{periodDates(w.start, w.end, zone)}</td>
                    <td class="num">{w.levels.join(' · ')}</td>
                    <td class="c num">{w.strength}</td>
                    <td>{w.obstructing.length ? <Chips ids={w.obstructing} /> : '–'}</td>
                    <td><button type="button" class="btn btn-small" onClick={() => showTransit(w)}>{t('kp.transitDays')}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!windows.length && <p class="muted">{t('kp.noPeriods')}</p>}
          {windows.length > 200 && <p class="muted">{t('kp.periodsCut', { n: windows.length })}</p>}
          <p class="hint-text">{t('kp.periodsNote')}</p>
          <p class="hint-text">{t('kp.levelOf')} {(Object.keys(sig.planets) as PlanetId[]).map((p) => `${p} ${levelFor(matter, sig, p) ?? '–'}`).join(', ')}</p>
        </div>
      </section>
    </>
  );
}

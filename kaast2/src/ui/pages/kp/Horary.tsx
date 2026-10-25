/**
 * KP (Research) → Horary 1–249 (B6; src/engine/kp/horary.ts). The querist's
 * number gives the ascendant, the moment and place of judgement give the
 * planets, the ruling planets and the dasa. The question's cusp is judged by
 * the three-condition test (KP6-061) and the timing by significators that are
 * also ruling planets (KP6-062). The retrograde tests belong here, not in
 * natal work (B6 p. 154).
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult, PlanetId } from '../../../engine';
import { chainAt, mahadashas } from '../../../engine/dasha/vimshottari';
import { horaryChart } from '../../../engine/kp/horary';
import { kpModel } from '../../../engine/kp/kp';
import { kpSignifications } from '../../../engine/kp/significators';
import { HORARY_QUESTIONS, cuspTest, timingWindows, type Matter } from '../../../engine/kp/matters';
import { rulingPlanets } from '../../../engine/kp/ruling';
import { horaryUnit } from '../../../engine/kp/subs';
import { vara } from '../../../engine/panchanga/panchanga';
import { dmsInSign } from '../../../engine/zodiac';
import { t } from '../../i18n';
import { dms, signAbbr } from '../../format';
import { engine, kpMoment, overrides } from '../../state/store';
import { Chips, MomentPicker, Pl, houseList, momentInput, periodDates, zoneOf } from './common';

const OUT_TONE = { promised: 'good', delayed: 'mixed', denied: 'bad' } as const;
const pos = (a: number) => { const d = dmsInSign(a); return `${signAbbr(Math.floor(a / 108000))} ${dms(d.d, d.m, d.s)}`; };

export function Horary({ c }: { c: ChartResult }): JSX.Element {
  const e = engine.value;
  const swe = e.status === 'ready' ? e.swe : null;
  const [n, setN] = useState(1);
  const [draft, setDraft] = useState('1');
  const [qid, setQid] = useState('marriage');
  const q = HORARY_QUESTIONS.find((x) => x.id === qid)!;
  const input = useMemo(() => momentInput(c), [kpMoment.value, c]);
  const h = useMemo(() => {
    if (!swe) return null;
    try {
      return horaryChart(swe, { ...input, profileId: c.input.profileId, overrides: { ...overrides.value, ayanamsa: c.profile.ayanamsa, node: c.profile.node, dashaYearDays: c.profile.dashaYearDays } }, n);
    } catch (err) { return { error: err instanceof Error ? err.message : String(err) }; }
  }, [swe, input, c, n]);
  const data = useMemo(() => {
    if (!swe || !h || 'error' in h) return null;
    const m = kpModel(h.chart), sig = kpSignifications(m);
    // Ruling planets use the real rising degree of the moment, not the numbered one (B6 p. 212).
    const real = { ...h.chart, asc: { ...h.chart.asc, lon: h.momentAsc } };
    const rp = rulingPlanets(real, vara(swe, h.chart).lord as PlanetId);
    const test = cuspTest(m, sig, q.cusp, q.houses);
    const mahas = mahadashas(h.chart.bodies.Mo.lonDeg, h.chart.moment.jdUT, h.chart.profile.dashaYearDays);
    const now = chainAt(mahas, h.chart.moment.jdUT, 3);
    const matter: Matter = { id: q.id, label: q.label, cusp: q.cusp, yes: q.houses, deny: [], denyFrom: 'derived', notes: [], cite: q.cite };
    const jd = h.chart.moment.jdUT;
    const all = timingWindows(mahas, matter, sig, jd, jd + 5 * 365.25);
    const strict = all.filter((w) => w.lords.every((l) => rp.ordered.includes(l)));
    // If none, the bhukti and anthra lords only (the dasa runs for years; B6's examples name RPs for the sub-periods).
    const relaxed = strict.length === 0;
    const wins = relaxed ? all.filter((w) => w.lords.slice(1).every((l) => rp.ordered.includes(l))) : strict;
    const sigs: PlanetId[] = [];
    for (const hh of q.houses) for (const p of sig.houses[hh - 1]!.ordered) if (!sigs.includes(p)) sigs.push(p);
    return { m, sig, rp, test, now, wins, relaxed, sigs };
  }, [swe, h, q]);
  const zone = zoneOf(input.tzHours, input.dstHours);
  const u = horaryUnit(n);

  return (
    <>
      <section class="panel" aria-labelledby="h-kp-hor">
        <header class="panel-head"><h2 id="h-kp-hor">{t('kp.hor')}</h2></header>
        <div class="panel-body">
          <p class="hint-text">{t('kp.horIntro')}</p>
          <div class="field-row">
            <div class="field inline-field"><label for="kp-hor-n">{t('kp.hor.number')}</label>
              <input id="kp-hor-n" type="number" min={1} max={249} value={draft} onInput={(ev) => {
                const v = ev.currentTarget.value; setDraft(v);
                const k = Number(v); if (Number.isInteger(k) && k >= 1 && k <= 249) setN(k);
              }} aria-describedby="kp-hor-unit" />
              <small id="kp-hor-unit" class="hint">{t('kp.hor.unit', { asc: pos(u.start) })} <Pl id={u.signLord} />/<Pl id={u.star} />/<Pl id={u.sub} /></small></div>
            <div class="field inline-field"><label for="kp-hor-q">{t('kp.hor.question')}</label>
              <select id="kp-hor-q" value={qid} onChange={(ev) => setQid(ev.currentTarget.value)}>
                {HORARY_QUESTIONS.map((x) => <option key={x.id} value={x.id}>{x.label} ({t('kp.cusp')} {x.cusp}: {x.houses.join('-')})</option>)}
              </select></div>
          </div>
          <MomentPicker c={c} />
          {h && 'error' in h && <p class="status status-bad" role="alert">{h.error}</p>}
        </div>
      </section>

      {data && h && !('error' in h) && (
        <>
          <section class="panel" aria-labelledby="h-kp-hor-j">
            <header class="panel-head"><h2 id="h-kp-hor-j">{t('kp.hor.judgement')}</h2></header>
            <div class="panel-body">
              <ul class="ntp-findings" data-testid="kp-hor-test">
                <li class={`ntp-finding tone-${data.test.subDirect ? 'good' : 'mixed'}`}>{t('kp.hor.c1', { cusp: q.cusp })} <Pl id={data.test.subLord} /> — {data.test.subDirect ? t('kp.hor.direct') : t('kp.hor.retroWait')}</li>
                <li class={`ntp-finding tone-${data.test.starDirect ? 'good' : 'bad'}`}>{t('kp.hor.c2')} <Pl id={data.test.starOfSub} /> — {data.test.starDirect ? t('kp.hor.direct') : t('kp.hor.retroDeny')}</li>
                <li class={`ntp-finding tone-${data.test.signifies ? 'good' : 'bad'}`}>{t('kp.hor.c3', { houses: q.houses.join(', ') })} {houseList(data.sig.planets[data.test.subLord].all)} — {data.test.signifies ? t('kp.yes') : t('kp.no')}</li>
              </ul>
              <p data-testid="kp-hor-outcome"><b>{t('kp.hor.outcome')}</b> <span class={`ntp-tag tone-${OUT_TONE[data.test.outcome]}`}>{data.test.outcome}</span>
                <span class="muted"> · {t('kp.hor.subIn', { house: data.test.subHouse })} · <cite>{q.cite}; B6 KP6-061</cite></span></p>
              <p>{t('kp.sigOfMatter')} <Chips ids={data.sigs} /></p>
              <p>{t('kp.rp.ordered')} <Chips ids={data.rp.ordered} /></p>
              <p>{t('kp.hor.dasaNow')} <Chips ids={data.now.map((p) => p.lords.at(-1)!)} /></p>
              <h3 class="ntp-sub">{t('kp.hor.when')}</h3>
              {data.relaxed && data.wins.length > 0 && <p class="hint-text" data-testid="kp-hor-relaxed">{t('kp.hor.relaxed')}</p>}
              {data.wins.length ? (
                <div class="table-wrap">
                  <table class="data" data-testid="kp-hor-when">
                    <thead><tr><th scope="col">{t('kp.dba')}</th><th scope="col">{t('kp.dates')}</th><th scope="col" class="c">{t('kp.strength')}</th></tr></thead>
                    <tbody>
                      {data.wins.slice(0, 40).map((w) => (
                        <tr key={w.start}><th scope="row"><Chips ids={w.lords} /></th><td class="num">{periodDates(w.start, w.end, zone)}</td><td class="c num">{w.strength}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p class="muted">{t('kp.hor.noWhen')}</p>}
              <p class="hint-text">{t('kp.hor.whenNote')}</p>
            </div>
          </section>

          <section class="panel" aria-labelledby="h-kp-hor-c">
            <header class="panel-head"><h2 id="h-kp-hor-c">{t('kp.hor.chart')}</h2></header>
            <div class="panel-body table-wrap">
              <table class="data" data-testid="kp-hor-cusps">
                <thead><tr><th scope="col">{t('kp.cusp')}</th><th scope="col">{t('col.longitude')}</th><th scope="col">{t('kp.signLord')}</th><th scope="col">{t('kp.starLord')}</th><th scope="col">{t('kp.subLord')}</th><th scope="col">{t('kp.occupants')}</th></tr></thead>
                <tbody>
                  {data.m.cusps.map((k, i) => (
                    <tr key={i} data-cusp={i + 1}>
                      <th scope="row">{i + 1}</th><td class="num">{pos(k.lon)}</td>
                      <td><Pl id={k.signLord} /></td><td><Pl id={k.lords[0]} /></td><td><Pl id={k.lords[1]} /></td>
                      <td><Chips ids={data.m.houses[i]!.occupants} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p class="hint-text">{t('kp.hor.chartNote')}</p>
            </div>
          </section>
        </>
      )}
    </>
  );
}

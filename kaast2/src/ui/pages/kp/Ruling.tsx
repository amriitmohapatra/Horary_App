/**
 * KP (Research) → Ruling planets of the moment of judgement (src/engine/kp/
 * ruling.ts; B6 pp. 132–152, 194, 254, 285) and the rectification assistant
 * (src/engine/kp/rectify.ts; B6 pp. 146–152).
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { jdUTof, type ChartResult, type PlanetId } from '../../../engine';
import { rulingPlanets, type RpRole } from '../../../engine/kp/ruling';
import { rectify } from '../../../engine/kp/rectify';
import { vara } from '../../../engine/panchanga/panchanga';
import { dmsInSign, signIndex } from '../../../engine/zodiac';
import { t, type MessageKey } from '../../i18n';
import { civilTime, dms, signAbbr } from '../../format';
import { engine, kpMoment } from '../../state/store';
import { Chips, MomentPicker, Pl, castLike, momentInput } from './common';

const ROLE_KEY: Record<RpRole, MessageKey> = {
  'lagna sign': 'kp.rp.lagnaSign', 'lagna star': 'kp.rp.lagnaStar', 'Moon star': 'kp.rp.moonStar', 'Moon sign': 'kp.rp.moonSign',
  day: 'kp.rp.day', 'lagna sub': 'kp.rp.lagnaSub', 'Moon sub': 'kp.rp.moonSub',
};
const pos = (a: number) => { const d = dmsInSign(a); return `${signAbbr(signIndex(a))} ${dms(d.d, d.m, d.s)}`; };

export function Ruling({ c }: { c: ChartResult }): JSX.Element {
  const e = engine.value;
  const swe = e.status === 'ready' ? e.swe : null;
  const input = useMemo(() => momentInput(c), [kpMoment.value, c]);
  const mc = useMemo(() => (swe ? castLike(swe, input, c) : null), [swe, input, c]);
  const rp = useMemo(() => (swe && mc ? rulingPlanets(mc, vara(swe, mc).lord as PlanetId) : null), [swe, mc]);
  const [mins, setMins] = useState(30);
  const [depth, setDepth] = useState<3 | 4>(4);
  const [run, setRun] = useState(false);
  const birthZone = c.input.tzHours + c.input.dstHours;
  // Rectification rejects only RPs in a retrograde planet's star (B6 p. 147, KP6-050).
  const rectRps = useMemo(() => (swe && mc ? rulingPlanets(mc, vara(swe, mc).lord as PlanetId, { rejectBySub: false }).ordered : []), [swe, mc]);
  const cands = useMemo(() => {
    if (!run || !swe || !rectRps.length) return null;
    const jd = jdUTof(c.input);
    return rectify(swe, c.input, jd - mins / 1440, jd + mins / 1440, rectRps, depth);
  }, [run, swe, rectRps, c, mins, depth]);
  if (!mc || !rp) return <p class="empty">{t('kp.engineWait')}</p>;

  return (
    <>
      <section class="panel" aria-labelledby="h-kp-rp">
        <header class="panel-head"><h2 id="h-kp-rp">{t('kp.rp')}</h2></header>
        <div class="panel-body">
          <MomentPicker c={c} />
          <p class="hint-text">{t('kp.rpAt', { asc: pos(mc.asc.lon), moon: pos(mc.bodies.Mo.lon) })}</p>
          <div class="table-wrap">
            <table class="data" data-testid="kp-rp">
              <thead><tr><th scope="col">{t('kp.rp.role')}</th><th scope="col">{t('kp.rp.planet')}</th></tr></thead>
              <tbody>
                {rp.slots.map((s) => (
                  <tr key={s.role} data-role={s.role}><th scope="row">{t(ROLE_KEY[s.role])}</th><td><Pl id={s.planet} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
          {rp.nodes.length > 0 && (
            <ul class="hint-text" data-testid="kp-rp-nodes">
              {rp.nodes.map((n) => (
                <li key={n.node}><Pl id={n.node} /> {t('kp.rp.nodeFor')} {n.reps.map((r, i) => <span key={r.planet}>{i ? ', ' : ''}<Pl id={r.planet} /> ({r.why})</span>)}</li>
              ))}
            </ul>
          )}
          {rp.rejected.length > 0 && <p class="hint-text" data-testid="kp-rp-rejected">{t('kp.rp.rejected')} {rp.rejected.map((r) => `${r.planet} (${r.why})`).join('; ')}</p>}
          {rp.retrograde.length > 0 && <p class="hint-text">{t('kp.rp.retro')} <Chips ids={rp.retrograde} /></p>}
          <p><b>{t('kp.rp.ordered')}</b> <span data-testid="kp-rp-ordered"><Chips ids={rp.ordered} /></span></p>
          <p class="hint-text">{t('kp.rpNote')}</p>
        </div>
      </section>

      <section class="panel" aria-labelledby="h-kp-rect">
        <header class="panel-head"><h2 id="h-kp-rect">{t('kp.rect')}</h2></header>
        <div class="panel-body">
          <p class="hint-text">{t('kp.rectIntro')}</p>
          <p data-testid="kp-rect-rps">{t('kp.rect.rps')} <Chips ids={rectRps} /></p>
          <div class="field-row">
            <div class="field inline-field"><label for="kp-rect-min">{t('kp.rect.window')}</label>
              <input id="kp-rect-min" type="number" min={1} max={240} value={mins} onChange={(ev) => { setMins(Math.min(240, Math.max(1, Number(ev.currentTarget.value) || 30))); setRun(false); }} /></div>
            <div class="field inline-field"><label for="kp-rect-depth">{t('kp.rect.depth')}</label>
              <select id="kp-rect-depth" value={depth} onChange={(ev) => { setDepth(Number(ev.currentTarget.value) as 3 | 4); setRun(false); }}>
                <option value={4}>{t('kp.rect.d4')}</option><option value={3}>{t('kp.rect.d3')}</option>
              </select></div>
            <button type="button" class="btn btn-primary" onClick={() => setRun(true)}>{t('kp.rect.run')}</button>
          </div>
          {cands && (
            cands.length ? (
              <div class="table-wrap">
                <table class="data" data-testid="kp-rect">
                  <thead><tr><th scope="col">{t('kp.rect.time')}</th><th scope="col">{t('kp.rect.asc')}</th><th scope="col">{t('kp.rect.lords')}</th></tr></thead>
                  <tbody>
                    {cands.map((x) => (
                      <tr key={x.start}>
                        <th scope="row" class="num">{civilTime(x.start, birthZone)} – {civilTime(x.end, birthZone)} <span class="muted">({t('kp.rect.mid')} {civilTime(x.mid, birthZone)})</span></th>
                        <td class="num">{pos(x.ascStart)} – {pos(x.ascEnd)}</td>
                        <td><Chips ids={x.lords} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p class="muted">{t('kp.rect.none')}</p>
          )}
          <p class="hint-text">{t('kp.rectNote', { zone: String(birthZone) })}</p>
        </div>
      </section>
    </>
  );
}

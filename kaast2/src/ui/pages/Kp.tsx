/**
 * KP (Research) — Krishnamurti's KP as his six Readers teach it
 * (docs/specs/kp_research.md): the chart and PL-style tables, significators
 * in Krishnamurti's order, life matters (promise and candidate periods),
 * ruling planets and rectification, transit timing, horary 1–249, and KP
 * Guidance. Default calculation "Readers mode" (KP-New ayanamsa, mean node,
 * 365¼-day years); PL's choices remain (store.ts kpAyanamsa).
 */
import { useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult } from '../../engine';
import { PL_AYANAMSA } from '../../engine/ephem/ayanamsa';
import { kpModel } from '../../engine/kp/kp';
import { kpSignifications } from '../../engine/kp/significators';
import { t, type MessageKey } from '../i18n';
import { degDms } from '../format';
import { chart as mainChart, kpAyanamsa, kpChart, kpTab, setKpAyanamsa, type KpAyanamsa, type KpTab } from '../state/store';
import { Tables } from './kp/Tables';
import { Significators } from './kp/Significators';
import { Matters } from './kp/Matters';
import { Ruling } from './kp/Ruling';
import { TransitTiming } from './kp/TransitTiming';
import { Horary } from './kp/Horary';
import { Guidance } from './kp/Guidance';

const TABS: KpTab[] = ['tables', 'sig', 'matters', 'rp', 'transit', 'horary', 'guidance'];

const ayanamsaLabel = (c: ChartResult) =>
  c.profile.ayanamsa === 'sf_lahiri' ? 'Solar Fire Lahiri' : PL_AYANAMSA[c.profile.ayanamsa].label;

export function Kp(): JSX.Element {
  const kc = kpChart.value;
  const main = mainChart.value;
  const c = kc && 'ok' in kc ? kc.ok : null;
  const m = useMemo(() => (c ? kpModel(c) : null), [c]);
  const sig = useMemo(() => (m ? kpSignifications(m) : null), [m]);
  if (kc && 'error' in kc) return <p class="status status-bad" role="alert">{kc.error}</p>;
  if (!c || !m || !sig) return <p class="empty">{t('page1.empty')}</p>;
  const ayan = `${ayanamsaLabel(c)} ${degDms(c.moment.ayanamsaDeg, 0)}`;
  const differs = main && 'ok' in main && (main.ok.profile.ayanamsa !== c.profile.ayanamsa || main.ok.profile.node !== c.profile.node);
  const houseSystem = c.profile.houses.system === 'P' ? t('kp.placidus') : t('kp.topocentric');
  const tab = TABS.includes(kpTab.value) ? kpTab.value : 'tables';

  return (
    <article class="kp" data-testid="kp-page">
      <section class="panel" aria-labelledby="h-kp-calc">
        <header class="panel-head"><h2 id="h-kp-calc">{t('kp.calc')}</h2></header>
        <div class="panel-body">
          <div class="field inline-field">
            <label for="kp-ayan">{t('kp.ayanamsa')}</label>
            <select id="kp-ayan" value={kpAyanamsa.value} onChange={(e) => setKpAyanamsa(e.currentTarget.value as KpAyanamsa)}>
              <option value="readers">{t('kp.ayan.readers')}</option>
              <option value="auto">{t('kp.ayan.auto')}</option>
              <option value="pl_krishnamurti">PL: {PL_AYANAMSA.pl_krishnamurti.label}</option>
              <option value="pl_krishnamurti_new">PL: {PL_AYANAMSA.pl_krishnamurti_new.label}</option>
              <option value="chart">{t('kp.ayan.chart')}</option>
            </select>
            <small class="hint">{t('kp.ayan.hint')}</small>
          </div>
          <p class="hint-text" data-testid="kp-used">
            {t('kp.used', { ayanamsa: ayan, houses: houseSystem })}{' '}
            {t('kp.usedNode', { node: c.profile.node === 'mean' ? t('kp.node.mean') : t('kp.node.true'), year: c.profile.dashaYearDays === 365.25 ? '365¼' : String(c.profile.dashaYearDays) })}
            {differs ? ` ${t('kp.differs')}` : ''}
          </p>
        </div>
      </section>

      <div class="segmented" role="group" aria-label={t('kp.sections')}>
        {TABS.map((k) => (
          <button key={k} type="button" class="seg" aria-pressed={tab === k} onClick={() => { kpTab.value = k; }}>{t(`kp.tab.${k}` as MessageKey)}</button>
        ))}
      </div>
      {tab === 'tables' && <Tables c={c} m={m} ayan={ayan} />}
      {tab === 'sig' && <Significators m={m} sig={sig} />}
      {tab === 'matters' && <Matters c={c} m={m} sig={sig} />}
      {tab === 'rp' && <Ruling c={c} />}
      {tab === 'transit' && <TransitTiming c={c} />}
      {tab === 'horary' && <Horary c={c} />}
      {tab === 'guidance' && <Guidance m={m} sig={sig} />}
    </article>
  );
}

/**
 * Settings: the calculation constants PL lets you change in Options →
 * Calculation. Each one shows the active profile's own value; a change
 * applies to every chart until it is reset. Stored in this browser only.
 */
import type { JSX } from 'preact';
import { DASHA_YEARS, resolveProfile, type ChartInput, type ProfileOverrides } from '../../engine';
import { PL_AYANAMSA, type AyanamsaId } from '../../engine/ephem/ayanamsa';
import { DEFAULT_PROFILE } from '../../engine/profiles';
import { t, type MessageKey } from '../i18n';
import { overrides, setOverride, setTheme, theme, type Theme } from '../state/store';

const AYANAMSAS: [AyanamsaId, string][] = [
  ...Object.entries(PL_AYANAMSA).map(([id, v]) => [id as AyanamsaId, `${v.label} (PL)`] as [AyanamsaId, string]),
  ['sf_lahiri', 'Lahiri (Solar Fire / Kala Chakra)'],
];

function Setting<K extends keyof ProfileOverrides>(props: {
  k: K; label: MessageKey; hint: MessageKey; base: ProfileOverrides[K];
  options: [string, string][]; parse: (v: string) => ProfileOverrides[K];
}): JSX.Element {
  const cur = overrides.value[props.k];
  const value = String(cur ?? props.base);
  const id = `s-${props.k}`;
  return (
    <div class="setting">
      <label for={id}>{t(props.label)}</label>
      <select id={id} value={value} onChange={(e) => {
        const v = props.parse(e.currentTarget.value);
        setOverride(props.k, v === props.base ? undefined : v);
      }}>
        {props.options.map(([v, l]) => <option key={v} value={v}>{l}{v === String(props.base) ? ` — ${t('settings.profileValue')}` : ''}</option>)}
      </select>
      <small class="hint">{t(props.hint)}</small>
      {cur !== undefined && (
        <button type="button" class="btn btn-quiet btn-small" onClick={() => setOverride(props.k, undefined)}>{t('settings.reset')}</button>
      )}
    </div>
  );
}

export function Settings({ input }: { input: ChartInput | null }): JSX.Element {
  const base = resolveProfile(input?.profileId ?? DEFAULT_PROFILE);
  return (
    <article class="settings" data-testid="settings-page">
      <section class="panel" aria-labelledby="h-calc">
        <header class="panel-head"><h2 id="h-calc">{t('settings.calc')}</h2></header>
        <div class="panel-body settings-grid">
          <p class="hint-text">{t('settings.intro', { profile: base.label })}</p>
          <Setting k="ayanamsa" label="settings.ayanamsa" hint="settings.ayanamsa.hint" base={base.ayanamsa}
            options={AYANAMSAS} parse={(v) => v as AyanamsaId} />
          <Setting k="deltaT" label="settings.deltaT" hint="settings.deltaT.hint" base={base.deltaT}
            options={[['swiss', t('settings.deltaT.swiss')], ['pl7', t('settings.deltaT.pl7')], ['solarfire', t('settings.deltaT.solarfire')]]}
            parse={(v) => v as ProfileOverrides['deltaT']} />
          <Setting k="node" label="settings.node" hint="settings.node.hint" base={base.node}
            options={[['true', t('settings.node.true')], ['mean', t('settings.node.mean')]]} parse={(v) => v as 'true' | 'mean'} />
          <Setting k="dashaYearDays" label="dasha.year" hint="settings.dashaYear.hint" base={base.dashaYearDays}
            options={DASHA_YEARS.map((y) => [String(y), t(`dasha.year.${String(y).replace('.', '_')}` as MessageKey)])} parse={Number} />
        </div>
      </section>
      <section class="panel" aria-labelledby="h-look">
        <header class="panel-head"><h2 id="h-look">{t('settings.look')}</h2></header>
        <div class="panel-body settings-grid">
          <div class="setting">
            <label for="s-theme">{t('settings.theme')}</label>
            <select id="s-theme" value={theme.value} onChange={(e) => setTheme(e.currentTarget.value as Theme)}>
              <option value="auto">{t('settings.theme.auto')}</option>
              <option value="light">{t('settings.theme.light')}</option>
              <option value="dark">{t('settings.theme.dark')}</option>
            </select>
          </div>
        </div>
      </section>
    </article>
  );
}

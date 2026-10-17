/** Shell: header, engine status, chart form, Page 1. */
import { useEffect, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { bootEphemeris } from '../boot/wasmLoader';
import { ChartForm } from './components/ChartForm';
import { ChartBar } from './components/ChartBar';
import { Nav } from './components/Nav';
import { Page1 } from './pages/Page1';
import { Dashas } from './pages/Dashas';
import { Vargas } from './pages/Vargas';
import { Strengths } from './pages/Strengths';
import { Jaimini } from './pages/Jaimini';
import { YogiBhava } from './pages/YogiBhava';
import { Transits } from './pages/Transits';
import { Kp } from './pages/Kp';
import { Ntp } from './pages/Ntp';
import { Settings } from './pages/Settings';
import { t } from './i18n';
import { chart, chartInput, engine, formOpen, lastPlace, nowInput, route, setTheme, shownTheme, textSize, theme } from './state/store';
import { Icon } from './components/Icon';
import type { ChartResult } from '../engine';

function Routed({ c }: { c: ChartResult }): JSX.Element {
  switch (route.value) {
    case 'dashas': return <Dashas chart={c} />;
    case 'vargas': return <Vargas chart={c} />;
    case 'strengths': return <Strengths chart={c} />;
    case 'jaimini': return <Jaimini chart={c} />;
    case 'kp': return <Kp />;
    case 'ntp': return <Ntp />;
    case 'yogi': return <YogiBhava chart={c} />;
    case 'transits': return <Transits chart={c} />;
    case 'settings': return <Settings input={chartInput.value} />;
    default: return <Page1 chart={c} />;
  }
}

function EngineStatus(): JSX.Element {
  const e = engine.value;
  if (e.status === 'booting') return <p class="status" data-testid="engine-status" data-state="booting">{t('engine.booting')}</p>;
  if (e.status === 'failed') return <p class="status status-bad" role="alert" data-testid="engine-status" data-state="failed">{t('engine.failed', { error: e.error })}</p>;
  return (
    <p class="status status-ok" data-testid="engine-status" data-state="ready" title={t('engine.provenance', {
      version: e.info.version, loader: t(e.info.loader === 'embedded' ? 'loader.embedded' : 'loader.fetch'), ms: e.info.ms,
    })}>
      <span class="dot" aria-hidden="true" />{t('engine.ready')}
      <span class="status-detail"> · Swiss Ephemeris {e.info.version}</span>
    </p>
  );
}

export function App(): JSX.Element {
  // Re-render once the embedded fonts are ready, so charts are laid out with real text metrics.
  const [, setFontsReady] = useState(false);
  // Both chart weights are loaded explicitly: bold is otherwise fetched lazily, after `fonts.ready` may already have resolved.
  useEffect(() => {
    const f = document.fonts;
    if (!f) return;
    Promise.all([f.load('400 16px "Atkinson Hyperlegible"'), f.load('700 16px "Atkinson Hyperlegible"')])
      .then(() => f.ready).then(() => setFontsReady(true)).catch(() => undefined);
  }, []);

  useEffect(() => {
    bootEphemeris()
      .then(({ swe, loader, ms }) => {
        engine.value = { status: 'ready', swe, info: { loader, ms, version: swe.version() } };
        if (!chartInput.value) chartInput.value = nowInput(lastPlace());
      })
      .catch((err: unknown) => { engine.value = { status: 'failed', error: err instanceof Error ? err.message : String(err) }; });
  }, []);

  useEffect(() => {
    const th = theme.value;
    if (th === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', th);
  }, [theme.value]);
  useEffect(() => {
    if (textSize.value === 'normal') document.documentElement.removeAttribute('data-text');
    else document.documentElement.setAttribute('data-text', textSize.value);
  }, [textSize.value]);

  const c = chart.value;
  // Light → Dark → Warm night → Light
  const shown = shownTheme();
  const next = shown === 'light' ? 'dark' : shown === 'dark' ? 'warm' : 'light';
  const nextLabel = t(`settings.theme.${next}` as const);

  return (
    <>
      <header class="topbar">
        <div class="brand">
          <span class="wordmark">{t('app.name')}</span>
          <span class="tagline">{t('app.tagline')}</span>
        </div>
        <EngineStatus />
        <button type="button" class="icon-btn theme-btn" aria-label={t('theme.switchTo', { theme: nextLabel })}
          title={t('theme.switchTo', { theme: nextLabel })} onClick={() => setTheme(next)}>
          <Icon name={next === 'light' ? 'sun' : next === 'dark' ? 'moon' : 'sunset'} />
        </button>
      </header>
      <main>
        {engine.value.status === 'ready' && formOpen.value && <ChartForm />}
        {c && 'error' in c && <p class="status status-bad" role="alert">{c.error}</p>}
        {c && 'ok' in c && <ChartBar chart={c.ok} />}
        {engine.value.status === 'ready' && <Nav />}
        {route.value === 'settings'
          ? <Settings input={chartInput.value} />
          : c && 'ok' in c ? <Routed c={c.ok} /> : engine.value.status === 'ready' && <p class="empty">{t('page1.empty')}</p>}
      </main>
      <footer class="foot">
        Astro-Amriit v{__APP_VERSION__} · {__BUILD_MODE__} build {__BUILD_COMMIT__} · Swiss Ephemeris © Astrodienst AG, AGPL
      </footer>
    </>
  );
}

/** Shell: header, engine status, chart form, Page 1. */
import { useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import { bootEphemeris } from '../boot/wasmLoader';
import { ChartForm } from './components/ChartForm';
import { Page1 } from './pages/Page1';
import { t } from './i18n';
import { chart, chartInput, engine, lastPlace, nowInput, setTheme, theme } from './state/store';

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

  const c = chart.value;
  const dark = theme.value === 'dark' || (theme.value === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <>
      <header class="topbar">
        <div class="brand">
          <span class="wordmark">{t('app.name')}</span>
          <span class="tagline">{t('app.tagline')}</span>
        </div>
        <EngineStatus />
        <button type="button" class="icon-btn theme-btn" aria-label={t('theme.toggle')} title={t('theme.toggle')}
          onClick={() => setTheme(dark ? 'light' : 'dark')}>{dark ? '☀' : '☾'}</button>
      </header>
      <main>
        {engine.value.status === 'ready' && <ChartForm />}
        {c && 'error' in c && <p class="status status-bad" role="alert">{c.error}</p>}
        {c && 'ok' in c ? <Page1 chart={c.ok} /> : engine.value.status === 'ready' && <p class="empty">{t('page1.empty')}</p>}
      </main>
      <footer class="foot">
        KAAST 2 v{__APP_VERSION__} · {__BUILD_MODE__} build {__BUILD_COMMIT__} · Swiss Ephemeris © Astrodienst AG, AGPL
      </footer>
    </>
  );
}

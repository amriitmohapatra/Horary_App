/** The cast chart's identity, shown above every page, with "Edit chart". */
import type { JSX } from 'preact';
import type { ChartResult } from '../../engine';
import { t } from '../i18n';
import { coords, hms, longDate, zone } from '../format';
import { engine, formOpen } from '../state/store';
import { panchanga } from '../../engine/panchanga/panchanga';
import { useMemo } from 'preact/hooks';

export function ChartBar({ chart }: { chart: ChartResult }): JSX.Element {
  const { input } = chart;
  const e = engine.value;
  // Vara from sunrise as PL computes it: the Sun's centre, no refraction (NUM, two independent checks).
  const pa = useMemo(() => (e.status === 'ready' ? panchanga(e.swe, chart, { sunrise: 'hindu' }) : null), [e, chart]);
  return (
    <header class="chart-strip">
      <h1 class="chart-name">{input.name || t('page1.birthChart')}</h1>
      <p class="chart-meta">
        <span>{longDate(input.date.y, input.date.m, input.date.d)}</span>
        <span>{hms(input.time.h, input.time.mi, input.time.s)}</span>
        <span>{input.place.name}</span>
        <span>UTC{zone(input.tzHours + input.dstHours)}</span>
        <span>{coords(input.place.latDeg, input.place.lonDeg)}</span>
        <span>{chart.profile.label}</span>
      </p>
      {pa && (
        <p class="panchanga-line" data-testid="panchanga">
          <span class="pl-label">{t('panchanga.label')}</span>
          <span>{pa.tithi.paksha === 'shukla' ? t('panchanga.shukla') : t('panchanga.krishna')} {pa.tithi.name}</span>
          <span>{pa.nakshatra.name} {pa.nakshatra.pada}</span>
          <span>{pa.yoga.name} {t('panchanga.yoga')}</span>
          <span>{pa.karana.name} {t('panchanga.karana')}</span>
          <span>{pa.vara.name}{pa.vara.beforeSunrise ? ` ${t('panchanga.beforeSunrise')}` : ''}</span>
        </p>
      )}
      {!formOpen.value && (
        <button type="button" class="btn btn-small edit-btn" onClick={() => { formOpen.value = true; }}>{t('form.edit')}</button>
      )}
    </header>
  );
}

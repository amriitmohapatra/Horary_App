/** The cast chart's identity, shown above every page, with "Edit chart". */
import type { JSX } from 'preact';
import type { ChartResult } from '../../engine';
import { t } from '../i18n';
import { coords, hms, longDate, zone } from '../format';
import { formOpen } from '../state/store';

export function ChartBar({ chart }: { chart: ChartResult }): JSX.Element {
  const { input } = chart;
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
      {!formOpen.value && (
        <button type="button" class="btn btn-small edit-btn" onClick={() => { formOpen.value = true; }}>{t('form.edit')}</button>
      )}
    </header>
  );
}

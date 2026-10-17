/**
 * PL's dasha table (the family's PL screenshots): a "Maha-Antar" heading in
 * planet colours, then each sub-period with Beginning and Ending. As in PL,
 * periods that ended before the chart moment show no dates.
 */
import type { JSX } from 'preact';
import { subperiods, type DashaPeriod } from '../../engine/dasha/vimshottari';
import { PLANET_NAMES } from '../../engine/names';
import { t } from '../i18n';
import { civilDate, civilTime } from '../format';

export function PlDashaTable({ parent, chartJd, zoneHours, showTimes }:
  { parent: DashaPeriod; chartJd: number; zoneHours: number; showTimes: boolean }): JSX.Element {
  const rows = subperiods(parent);
  const fmt = (jd: number) => civilDate(jd, zoneHours) + (showTimes ? ` ${civilTime(jd, zoneHours)}` : '');
  return (
    <div class="pl-dasha" data-testid="pl-dasha-table">
      <h3 class="pl-dasha-title">
        {parent.lords.map((l, i) => <span key={i}>{i ? '-' : ''}<span class={`pl pl-${l}`}>{PLANET_NAMES[l]}</span></span>)}
      </h3>
      <div class="table-wrap"><table class="data">
        <caption class="sr-only">{t('dasha.plTable')}: {parent.lords.join('-')}</caption>
        <thead><tr><th scope="col">{t('dasha.sub')}</th><th scope="col">{t('dasha.beginning')}</th><th scope="col">{t('dasha.ending')}</th></tr></thead>
        <tbody>
          {rows.map((r) => {
            const l = r.lords[r.lords.length - 1]!;
            const past = r.end <= chartJd;
            return (
              <tr key={l}>
                <th scope="row"><span class={`pl pl-${l}`}>{PLANET_NAMES[l]}</span></th>
                <td class="num">{past ? '' : fmt(r.start)}</td>
                <td class="num">{past ? '' : fmt(r.end)}</td>
              </tr>
            );
          })}
        </tbody>
      </table></div>
    </div>
  );
}

/**
 * Vimshottari list in PL's Page 1 form (chain · weekday · start date), with
 * PL's four controls: one level shallower/deeper, earlier/later. Anchored
 * once at the chart moment (invariant 7); "Today" jumps to the running period.
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { LEVEL_NAMES, periodsInWindow, type DashaPeriod } from '../../engine/dasha/vimshottari';
import { t } from '../i18n';
import { Icon, type IconName } from './Icon';
import { civilDate, civilWeekday } from '../format';

const ROWS = 10;
/** Half-width (days) of the window generated around the anchor, per depth. Maha…Sookshma: whole cycle. */
const WINDOW = [Infinity, Infinity, Infinity, Infinity, 3 * 365, 60] as const;

export function DashaList({ mahas, zoneHours, nowJd }: { mahas: DashaPeriod[]; zoneHours: number; nowJd: number }): JSX.Element {
  const [depth, setDepth] = useState(2);
  const [anchor, setAnchor] = useState(nowJd);

  const list = useMemo(() => {
    const w = WINDOW[depth]!;
    return periodsInWindow(mahas, depth, anchor - w, anchor + w);
  }, [mahas, depth, anchor]);
  let idx = list.findIndex((p) => p.end > anchor);
  if (idx < 0) idx = Math.max(0, list.length - ROWS);
  const view = list.slice(idx, idx + ROWS);
  const first = mahas[0]!.start, last = mahas[8]!.end;
  const earlier = () => setAnchor(list[Math.max(0, idx - (ROWS - 1))]!.start);
  const later = () => setAnchor(view[view.length - 1]!.start);

  const level = LEVEL_NAMES[depth]!;
  const btn = (label: string, icon: IconName, onClick: () => void, disabled = false) => (
    <button type="button" class="icon-btn" aria-label={label} title={label} onClick={onClick} disabled={disabled}><Icon name={icon} /></button>
  );

  return (
    <div class="dasha" data-testid="dasha-list">
      <div class="dasha-bar">
        <span class="dasha-level">{level}</span>
        <span class="spacer" />
        {btn(t('page1.dashaShallower'), 'minus', () => setDepth((d) => Math.max(0, d - 1)), depth === 0)}
        {btn(t('page1.dashaDeeper'), 'plus', () => setDepth((d) => Math.min(5, d + 1)), depth === 5)}
        {btn(t('page1.dashaEarlier'), 'arrowUp', earlier, view[0]!.start <= first)}
        {btn(t('page1.dashaLater'), 'arrowDown', later, view[view.length - 1]!.end >= last)}
        <button type="button" class="btn btn-small" onClick={() => setAnchor(nowJd)}>{t('page1.dashaToday')}</button>
      </div>
      <table class="data dasha-table">
        <caption class="sr-only">{t('page1.vimshottari')} — {level}</caption>
        <thead class="sr-only">
          <tr><th scope="col">{t('col.period')}</th><th scope="col">{t('col.day')}</th><th scope="col">{t('col.begins')}</th></tr>
        </thead>
        <tbody>
          {view.map((p) => {
            const running = p.start <= nowJd && nowJd < p.end;
            return (
              <tr key={p.lords.join('-') + p.start} class={running ? 'running' : undefined} aria-current={running ? 'true' : undefined}>
                <th scope="row" class="chain">
                  {p.lords.map((l, i) => <span key={i}>{i ? '-' : ''}<span class={`pl pl-${l}`}>{l}</span></span>)}
                  {running && <span class="sr-only"> ({t('page1.running')})</span>}
                </th>
                <td class="num">{civilWeekday(p.start, zoneHours)}</td>
                <td class="num">{civilDate(p.start, zoneHours)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

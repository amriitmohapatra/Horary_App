/** Page 1 strength table: PL's columns, with full words on hover and for screen readers. */
import type { JSX } from 'preact';
import { PLANETS } from '../../engine/types';
import { PLANET_NAMES } from '../../engine/names';
import { AV3_LONG, DIGNITY_LONG, type Page1Strengths } from '../../engine/strength';
import { t } from '../i18n';

export function StrengthTable({ s }: { s: Page1Strengths }): JSX.Element {
  const head: [string, string][] = [
    ['col.dignity', 'col.dignity.long'], ['col.sb', 'col.sb.long'], ['col.sbn', 'col.sbn.long'], ['col.vb', 'col.vb.long'],
    ['col.av', 'col.av.long'], ['col.av3', 'col.av3.long'], ['col.av5', 'col.av5.long'], ['col.k7', 'col.k7.long'], ['col.func', 'col.func.long'],
  ];
  return (
    <div class="table-wrap">
      <table class="data strengths" data-testid="strength-table">
        <caption class="sr-only">{t('page1.strengths')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('col.body')}</th>
            {head.map(([k, long]) => <th key={k} scope="col"><abbr title={t(long as never)}>{t(k as never)}</abbr></th>)}
          </tr>
        </thead>
        <tbody>
          {PLANETS.map((p) => {
            const r = s.planets[p];
            return (
              <tr key={p} data-point={p}>
                <th scope="row"><span class={`pl pl-${p}`} title={PLANET_NAMES[p]}>{p}</span></th>
                <td title={DIGNITY_LONG[r.dignity]}>{r.dignityLabel}</td>
                <td class="num">{r.sbRatio === null ? '' : r.sbRatio.toFixed(2)}</td>
                <td class="num">{r.sbStrongCount ?? ''}</td>
                <td class="num" title={r.vimshopakaScore.toFixed(2)}>{r.vimshopaka}</td>
                <td class="num">{r.av ?? ''}</td>
                <td title={AV3_LONG[r.av3]}>{r.av3}</td>
                <td>{r.av5}</td>
                <td>{r.k7 ?? ''}</td>
                <td>{r.functional}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

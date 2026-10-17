/** Page 1 planet table: PL's columns, with KP lords coloured as in Kala Chakra. */
import type { JSX } from 'preact';
import type { PointRow } from '../../engine/page1';
import { PLANET_NAMES } from '../../engine/names';
import { t } from '../i18n';
import { dms, signAbbr } from '../format';

const LORD_CLASS = ['lord-star', 'lord-sub', 'lord-subsub'] as const;

function Flags({ flags }: { flags: string }): JSX.Element | null {
  if (!flags) return null;
  const words = [...flags].map((c) => (c === 'R' ? t('flag.R') : t('flag.c'))).join(', ');
  return <abbr title={words} aria-label={words}>{flags}</abbr>;
}

export function PlanetTable({ rows }: { rows: PointRow[] }): JSX.Element {
  return (
    <div class="table-wrap">
      <table class="data planets" data-testid="planet-table">
        <caption class="sr-only">{t('page1.planets')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('col.body')}</th>
            <th scope="col">{t('col.longitude')}</th>
            <th scope="col" class="c">{t('col.flags')}</th>
            <th scope="col">{t('col.nakshatra')}</th>
            <th scope="col">{t('col.syllable')}</th>
            <th scope="col">{t('col.padaLords')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} data-point={r.id}>
              <th scope="row"><span class={`pl pl-${r.id}`} title={PLANET_NAMES[r.id]}>{r.id}</span></th>
              <td class="num"><span class="sign">{signAbbr(r.sign)}</span> {dms(r.deg, r.min, r.sec)}</td>
              <td class="c flags"><Flags flags={r.flags} /></td>
              <td>{r.nakshatraName}</td>
              <td>{r.syllable}</td>
              <td class="num lords">
                {r.pada},{r.lords.map((l, i) => (
                  <span key={i}>{i ? '/' : ''}<span class={LORD_CLASS[i]}>{l}</span></span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Strengths: how every Page 1 strength number was computed — Shad Bala by
 * component, Bhava Bala by component, Ashtakavarga (BAV and SAV), and the
 * time context (sunrise, lords, hora). Values in virupas unless stated.
 */
import type { JSX } from 'preact';
import type { ChartResult } from '../../engine';
import { GRAHAS7 } from '../../engine/strength/common';
import { STRONG_GROUPS } from '../../engine/strength';
import { PLANET_NAMES } from '../../engine/names';
import { SIGNS } from '../../engine/zodiac';
import { t, type MessageKey } from '../i18n';
import { civilTime } from '../format';
import { strength } from '../state/store';

const SB_ROWS: [MessageKey, keyof import('../../engine/strength').ShadbalaBreakdown, boolean?][] = [
  ['sb.uchcha', 'uchcha'], ['sb.saptavargaja', 'saptavargaja'], ['sb.ojayugma', 'ojayugma'], ['sb.kendra', 'kendra'],
  ['sb.drekkana', 'drekkana'], ['sb.sthana', 'sthana', true], ['sb.dig', 'dig', true],
  ['sb.natonnata', 'natonnata'], ['sb.paksha', 'paksha'], ['sb.tribhaga', 'tribhaga'], ['sb.abda', 'abda'], ['sb.masa', 'masa'],
  ['sb.vara', 'vara'], ['sb.hora', 'hora'], ['sb.ayana', 'ayana'], ['sb.kala', 'kala', true],
  ['sb.cheshta', 'cheshta', true], ['sb.naisargika', 'naisargika', true], ['sb.drik', 'drik', true],
  ['sb.total', 'total', true], ['sb.requiredRow', 'required'], ['sb.ratio', 'ratio', true],
];

export function Strengths({ chart }: { chart: ChartResult }): JSX.Element {
  const s = strength.value;
  if (!s) return <p class="pending">{t('page1.strengthsUnavailable')}</p>;
  const zone = chart.input.tzHours + chart.input.dstHours;
  const k = s.breakdown.kala;
  const f2 = (v: number) => v.toFixed(2);
  return (
    <article class="strengths-page" data-testid="strengths-page">
      <section class="panel" aria-labelledby="h-sb">
        <header class="panel-head"><h2 id="h-sb">{t('page1.shadbala')}</h2></header>
        <div class="panel-body table-wrap">
          <table class="data comp-table" data-testid="shadbala-table">
            <caption class="hint-text cap">{t('sb.tableCaption')}</caption>
            <thead><tr><th scope="col">{t('sb.component')}</th>{GRAHAS7.map((p) => <th key={p} scope="col" class="r"><span class={`pl pl-${p}`} title={PLANET_NAMES[p]}>{p}</span></th>)}</tr></thead>
            <tbody>
              {SB_ROWS.map(([label, key, strong]) => (
                <tr key={key} class={strong ? 'sum' : undefined}>
                  <th scope="row">{t(label)}</th>
                  {GRAHAS7.map((p) => <td key={p} class="num r">{f2(s.breakdown.shadbala[p][key] as number)}</td>)}
                </tr>
              ))}
              <tr class="sum">
                <th scope="row">{t('sb.strongGroups')}</th>
                {GRAHAS7.map((p) => {
                  const b = s.breakdown.shadbala[p];
                  return <td key={p} class="num r" title={STRONG_GROUPS.filter((g) => b.strong[g]).join(', ')}>{b.strongCount}</td>;
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div class="two-col">
        <section class="panel" aria-labelledby="h-bb">
          <header class="panel-head"><h2 id="h-bb">{t('bb.title')}</h2></header>
          <div class="panel-body table-wrap">
            <table class="data comp-table" data-testid="bhavabala-table">
              <thead><tr>
                <th scope="col">{t('bb.house')}</th><th scope="col">{t('bb.sign')}</th><th scope="col">{t('bb.lord')}</th>
                <th scope="col" class="r">{t('bb.fromLord')}</th><th scope="col" class="r">{t('bb.dig')}</th>
                <th scope="col" class="r">{t('bb.drishti')}</th><th scope="col" class="r">{t('bb.planets')}</th>
                <th scope="col" class="r">{t('bb.dayNight')}</th><th scope="col" class="r">{t('bb.total')}</th>
              </tr></thead>
              <tbody>
                {s.breakdown.bhava.map((b) => (
                  <tr key={b.house}>
                    <th scope="row">{b.house}</th><td>{SIGNS[b.sign]}</td><td><span class={`pl pl-${b.lord}`}>{b.lord}</span></td>
                    <td class="num r">{f2(b.fromLord)}</td><td class="num r" title={b.digType}>{f2(b.dig)}</td>
                    <td class="num r">{f2(b.drishti)}</td><td class="num r" title={b.occupants.join(' ')}>{f2(b.planets)}</td>
                    <td class="num r">{f2(b.dayNight)}</td><td class="num r strong-cell">{f2(b.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section class="panel" aria-labelledby="h-time">
          <header class="panel-head"><h2 id="h-time">{t('kala.title')}</h2></header>
          <div class="panel-body">
            <dl class="facts">
              <div><dt>{t('kala.sunrise')}</dt><dd class="num">{civilTime(k.sunrise, zone)}</dd></div>
              <div><dt>{t('kala.sunset')}</dt><dd class="num">{civilTime(k.sunset, zone)}</dd></div>
              <div><dt>{t('kala.daynight')}</dt><dd>{k.isDay ? t('kala.day') : t('kala.night')}</dd></div>
              <div><dt>{t('kala.lords')}</dt><dd>{t('kala.lordsValue', { year: k.yearLord, month: k.monthLord, day: k.varaLord, hora: k.horaLord, n: k.horaNumber })}</dd></div>
            </dl>
            <p class="hint-text">{t('kala.note')}</p>
          </div>
        </section>
      </div>

      <section class="panel" aria-labelledby="h-av">
        <header class="panel-head"><h2 id="h-av">{t('av.title')}</h2></header>
        <div class="panel-body table-wrap">
          <table class="data comp-table av-table" data-testid="ashtakavarga-table">
            <caption class="hint-text cap">{t('av.caption')}</caption>
            <thead><tr><th scope="col">{t('av.chart')}</th>{SIGNS.map((sg) => <th key={sg} scope="col" class="r">{sg}</th>)}<th scope="col" class="r">{t('av.total')}</th></tr></thead>
            <tbody>
              {GRAHAS7.map((p) => (
                <tr key={p}>
                  <th scope="row"><span class={`pl pl-${p}`}>{p}</span></th>
                  {s.ashtakavarga.bav[p].map((v, i) => <td key={i} class={`num r${chart.bodies[p].lon !== undefined && Math.floor(chart.bodies[p].lonDeg / 30) === i ? ' own' : ''}`}>{v}</td>)}
                  <td class="num r">{s.ashtakavarga.bav[p].reduce((a, b) => a + b, 0)}</td>
                </tr>
              ))}
              <tr class="sum">
                <th scope="row">{t('av.sav')}</th>
                {s.ashtakavarga.sav.map((v, i) => <td key={i} class="num r">{v}</td>)}
                <td class="num r">{s.ashtakavarga.sav.reduce((a, b) => a + b, 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}

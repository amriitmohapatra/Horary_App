/**
 * Yogi points (slice 5) and Bhava chalit (slice 6). Yogi point is decoded
 * from PL (BIN); Avayogi and the Duplicate Yogi follow the textbook until a PL
 * printout settles them, so the Avayogi convention is selectable. Bhava
 * chalit: Sripati (PL's default, madhyas at Asc and MC, quadrants trisected)
 * or equal houses; in the fixed-sign East Indian layout each planet is drawn
 * in the sign of its bhava's madhya.
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult } from '../../engine';
import { PLANETS, type PointId } from '../../engine/types';
import { PLANET_NAMES, NAKSHATRA_NAMES } from '../../engine/names';
import { SIGNS, dmsInSign, signIndex } from '../../engine/zodiac';
import { page1Model } from '../../engine/page1';
import { bhavaChart, type BhavaKind } from '../../engine/houses/bhava';
import { dagdhaRashis, yogiPoints, type AvayogiVariant } from '../../engine/yogi/yogi';
import { tithi } from '../../engine/panchanga/panchanga';
import { EastIndianChart } from '../components/EastIndianChart';
import { vargaEntries } from '../chartEntries';
import { t } from '../i18n';
import { dms } from '../format';

const lonText = (a: number) => { const { d, m, s } = dmsInSign(a); return `${SIGNS[signIndex(a)]} ${dms(d, m, s)}`; };
const ORDER: PointId[] = ['As', ...PLANETS];

export function YogiBhava({ chart }: { chart: ChartResult }): JSX.Element {
  const [avVariant, setAvVariant] = useState<AvayogiVariant>('sixth-nakshatra');
  const [kind, setKind] = useState<BhavaKind>('sripati');
  const model = useMemo(() => page1Model(chart), [chart]);
  const y = yogiPoints(chart.bodies.Su.lon, chart.bodies.Mo.lon, { avayogi: avVariant });
  const ti = tithi(chart.bodies.Su.lon, chart.bodies.Mo.lon);
  const dagdha = dagdhaRashis(ti.num);
  const bc = useMemo(() => bhavaChart(chart, kind), [chart, kind]);
  const rasiHouse = (p: PointId) => ((model.rows.find((r) => r.id === p)!.sign - model.ascSign + 12) % 12) + 1;
  const groups: PointId[][] = Array.from({ length: 12 }, () => []);
  for (const p of ORDER) groups[bc.madhyaSign[bc.houses[p] - 1]!]!.push(p);
  const moved = ORDER.filter((p) => p !== 'As' && bc.houses[p] !== rasiHouse(p));
  const name = chart.input.name || t('page1.birthChart');

  const point = (label: string, p: { lon: number; nakshatra: number }, planet: string, testid: string) => (
    <tr data-testid={testid}>
      <th scope="row">{label}</th>
      <td class="num">{lonText(p.lon)}</td>
      <td>{NAKSHATRA_NAMES[p.nakshatra]}</td>
      <td><span class={`pl pl-${planet}`}>{planet}</span> {PLANET_NAMES[planet as keyof typeof PLANET_NAMES]}</td>
    </tr>
  );

  return (
    <article class="yogi-bhava" data-testid="yogi-page">
      <section class="panel" aria-labelledby="h-yogi">
        <header class="panel-head"><h2 id="h-yogi">{t('yogi.title')}</h2></header>
        <div class="panel-body">
          <div class="table-wrap">
            <table class="data">
              <thead><tr><th scope="col">{t('yogi.point')}</th><th scope="col">{t('col.longitude')}</th><th scope="col">{t('col.nakshatra')}</th><th scope="col">{t('yogi.planet')}</th></tr></thead>
              <tbody>
                {point(t('yogi.yogi'), y.yogiPoint, y.yogi, 'yogi-row')}
                {point(t('yogi.avayogi'), y.avayogiPoint, y.avayogi, 'avayogi-row')}
                <tr data-testid="duplicate-row">
                  <th scope="row">{t('yogi.duplicate')}</th><td colSpan={2} class="muted">{t('yogi.duplicateRule', { sign: SIGNS[y.yogiPoint.sign]! })}</td>
                  <td><span class={`pl pl-${y.duplicateYogi}`}>{y.duplicateYogi}</span> {PLANET_NAMES[y.duplicateYogi]}</td>
                </tr>
                <tr>
                  <th scope="row">{t('yogi.dagdha')}</th>
                  <td colSpan={3}>{dagdha.length ? dagdha.map((s) => SIGNS[s]).join(', ') : t('yogi.dagdhaNone')} <span class="muted">({t('yogi.dagdhaTithi', { n: ti.num })})</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="field inline-field">
            <label for="y-av">{t('yogi.avVariant')}</label>
            <select id="y-av" value={avVariant} onChange={(e) => setAvVariant(e.currentTarget.value as AvayogiVariant)}>
              <option value="sixth-nakshatra">{t('yogi.av.sixth')}</option>
              <option value="opposite-point">{t('yogi.av.opposite')}</option>
            </select>
          </div>
          <p class="hint-text">{t('yogi.note')}</p>
        </div>
      </section>

      <div class="varga-main">
        <section class="panel" aria-labelledby="h-bhava">
          <header class="panel-head"><h2 id="h-bhava">{t('bhava.title')}</h2></header>
          <div class="panel-body">
            <div class="segmented" role="group" aria-label={t('bhava.kind')}>
              <button type="button" class="seg" aria-pressed={kind === 'sripati'} onClick={() => setKind('sripati')}>{t('bhava.sripati')}</button>
              <button type="button" class="seg" aria-pressed={kind === 'equal'} onClick={() => setKind('equal')}>{t('bhava.equal')}</button>
            </div>
            <EastIndianChart title={`${t('bhava.title')} (${kind}): ${name}`} signs={vargaEntries(groups, model.rows, bc.madhyaSign[0]!)}
              lagnaSign={bc.madhyaSign[0]!} centre={[{ text: t('bhava.centre'), size: 34, display: true }, { text: kind === 'sripati' ? t('bhava.sripati') : t('bhava.equal'), size: 22 }]}
              maxFont={40} minFont={12} />
            <p class="hint-text" data-testid="bhava-moved">{moved.length
              ? t('bhava.moved', { list: moved.map((p) => `${p} ${rasiHouse(p)}→${bc.houses[p]}`).join(', ') })
              : t('bhava.noneMoved')}</p>
          </div>
        </section>
        <section class="panel" aria-labelledby="h-bhava-table">
          <header class="panel-head"><h2 id="h-bhava-table">{t('bhava.table')}</h2></header>
          <div class="panel-body table-wrap">
            <table class="data" data-testid="bhava-table">
              <thead><tr><th scope="col">{t('bb.house')}</th><th scope="col">{t('bhava.sandhi')}</th><th scope="col">{t('bhava.madhya')}</th><th scope="col">{t('bhava.in')}</th></tr></thead>
              <tbody>
                {bc.arcsec.madhya.map((m, i) => (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td class="num">{lonText(bc.arcsec.sandhi[i]!)}</td>
                    <td class="num">{lonText(m)}</td>
                    <td>{ORDER.filter((p) => bc.houses[p] === i + 1).map((p) => <span key={p} class={`pl pl-${p}`}>{p} </span>)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </article>
  );
}

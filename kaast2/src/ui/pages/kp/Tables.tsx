/**
 * KP (Research) → Chart and tables: PL's "Krishnamurti Chart" and "KP –
 * Significators" (PL 7 manual pp. 56, 205): the chart on the profile's cusps
 * (ascendant = beginning of house 1), cusp and planet lords, house-wise and
 * planet-wise significators (levels A–D), and Fortuna (B1 p. 129).
 */
import type { JSX } from 'preact';
import type { ChartResult } from '../../../engine';
import type { KpModel, KpPoint } from '../../../engine/kp/kp';
import { lordChain } from '../../../engine/kp/lords';
import { fortuna } from '../../../engine/kp/ruling';
import { PLANET_NAMES } from '../../../engine/names';
import { SIGNS, SIGN_LORD, dmsInSign, signIndex } from '../../../engine/zodiac';
import { EastIndianChart, type ChartEntry } from '../../components/EastIndianChart';
import { useMedia } from '../../hooks';
import { t } from '../../i18n';
import { dm, dms, hms, longDate, signAbbr } from '../../format';
import { Chips, houseList as houses } from './common';

const LORD_CLASS = ['lord-star', 'lord-sub', 'lord-subsub'] as const;

/** What each sign region of the KP chart lists: cusps then planets, Kala Chakra style. */
function kpEntries(m: KpModel, compact: boolean): ChartEntry[][] {
  return SIGNS.map((sign, s) => {
    const lines: ChartEntry[] = [{ key: `sign${s}`, parts: [{ text: sign, tone: 'sign' }] }];
    const cusps = m.cusps.map((c, i) => ({ c, h: i + 1 })).filter((x) => x.c.sign === s);
    const planets = m.planets.filter((p) => p.sign === s);
    if (compact) {
      if (cusps.length) lines.push({ key: 'c', parts: [{ text: cusps.map((x) => `C${x.h}`).join(' '), tone: 'muted', bold: true }] });
      for (let i = 0; i < planets.length; i += 3) {
        const chunk = planets.slice(i, i + 3);
        lines.push({ key: chunk.map((p) => p.id).join(''), parts: chunk.flatMap((p, j) => [
          { text: (j ? ' ' : '') + p.id, tone: p.id, bold: true }, { text: `-${p.house}` },
        ]) });
      }
      return lines;
    }
    for (const { c, h } of cusps) {
      const { d, m: mi } = dmsInSign(c.lon);
      lines.push({ key: `c${h}`, parts: [{ text: `${h}`, bold: true }, { text: ` ${dm(d, mi)} ` }, { text: `${c.lords[0]}/${c.lords[1]}`, tone: 'muted' }] });
    }
    for (const p of planets) {
      const { d, m: mi } = dmsInSign(p.lon);
      lines.push({ key: p.id, parts: [
        { text: p.id, tone: p.id, bold: true }, ...(p.retrograde ? [{ text: 'R', tone: p.id }] : []),
        { text: ` ${dm(d, mi)} ` }, { text: `${p.lords[0]}/${p.lords[1]}`, tone: 'muted' }, { text: `-${p.house}` },
      ] });
    }
    return lines;
  });
}

function Lon({ p }: { p: KpPoint }): JSX.Element {
  const { d, m, s } = dmsInSign(p.lon);
  return <td class="num"><span class="sign">{signAbbr(p.sign)}</span> {dms(d, m, s)}</td>;
}
function Lords({ p }: { p: KpPoint }): JSX.Element {
  return (
    <>
      <td><span class={`pl pl-${p.signLord}`}>{p.signLord}</span></td>
      {p.lords.map((l, i) => <td key={i} class={LORD_CLASS[i]}><span class={`pl pl-${l}`}>{l}</span></td>)}
    </>
  );
}
export function Tables({ c, m, ayan }: { c: ChartResult; m: KpModel; ayan: string }): JSX.Element {
  const compact = useMedia('(max-width: 560px)');
  const { input } = c;
  const name = input.name || t('page1.birthChart');
  const pf = fortuna(c);
  const pfd = dmsInSign(pf);
  const pfl = lordChain(pf, 2);
  return (
    <>
      <div class="varga-main">
        <section class="panel" aria-labelledby="h-kp-chart">
          <header class="panel-head"><h2 id="h-kp-chart">{t('kp.chart')}</h2></header>
          <div class="panel-body">
            <EastIndianChart title={`${t('kp.chart')}: ${name}`} description={t('kp.chartDesc')}
              signs={kpEntries(m, compact)} lagnaSign={m.cusps[0]!.sign}
              centre={compact
                ? [{ text: 'KP', size: 54, display: true }]
                : [
                  { text: name, size: 30, display: true },
                  { text: longDate(input.date.y, input.date.m, input.date.d), size: 21 },
                  { text: hms(input.time.h, input.time.mi, input.time.s), size: 21 },
                  { text: input.place.name, size: 19 },
                  { text: ayan, size: 16 },
                ]}
              maxFont={compact ? 40 : 24} minFont={compact ? 18 : 9} />
            <p class="hint-text">{t('kp.chartNote')}</p>
          </div>
        </section>

        <section class="panel" aria-labelledby="h-kp-cusps">
          <header class="panel-head"><h2 id="h-kp-cusps">{t('kp.cusps')}</h2></header>
          <div class="panel-body table-wrap">
            <table class="data" data-testid="kp-cusps">
              <thead><tr>
                <th scope="col">{t('kp.cusp')}</th><th scope="col">{t('col.longitude')}</th>
                <th scope="col">{t('kp.signLord')}</th><th scope="col">{t('kp.starLord')}</th>
                <th scope="col">{t('kp.subLord')}</th><th scope="col">{t('kp.subSub')}</th>
              </tr></thead>
              <tbody>
                {m.cusps.map((p, i) => (
                  <tr key={i} data-cusp={i + 1}><th scope="row">{i + 1}</th><Lon p={p} /><Lords p={p} /></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section class="panel" aria-labelledby="h-kp-planets">
        <header class="panel-head"><h2 id="h-kp-planets">{t('kp.planets')}</h2></header>
        <div class="panel-body table-wrap">
          <table class="data" data-testid="kp-planets">
            <thead><tr>
              <th scope="col">{t('col.body')}</th><th scope="col">{t('col.longitude')}</th><th scope="col" class="c">{t('kp.house')}</th>
              <th scope="col">{t('kp.signLord')}</th><th scope="col">{t('kp.starLord')}</th>
              <th scope="col">{t('kp.subLord')}</th><th scope="col">{t('kp.subSub')}</th>
            </tr></thead>
            <tbody>
              {m.planets.map((p) => (
                <tr key={p.id} data-point={p.id}>
                  <th scope="row"><span class={`pl pl-${p.id}`} title={PLANET_NAMES[p.id]}>{p.id}</span>{p.retrograde ? <abbr title={t('flag.R')}> R</abbr> : null}</th>
                  <Lon p={p} /><td class="c num">{p.house}</td><Lords p={p} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel" aria-labelledby="h-kp-sig">
        <header class="panel-head"><h2 id="h-kp-sig">{t('kp.sigHouses')}</h2></header>
        <div class="panel-body">
          <div class="table-wrap">
            <table class="data" data-testid="kp-sig-houses">
              <thead><tr>
                <th scope="col">{t('kp.house')}</th><th scope="col">{t('kp.occupants')}</th><th scope="col">{t('kp.tenantsOcc')}</th>
                <th scope="col">{t('kp.owner')}</th><th scope="col">{t('kp.tenantsOwner')}</th>
              </tr></thead>
              <tbody>
                {m.houses.map((h) => (
                  <tr key={h.house} data-house={h.house}>
                    <th scope="row">{h.house}</th>
                    <td><Chips ids={h.occupants} /></td><td><Chips ids={h.tenantsOfOccupants} /></td>
                    <td><Chips ids={[h.owner]} /></td><td><Chips ids={h.tenantsOfOwner} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="hint-text">{t('kp.sigHousesNote')}</p>
        </div>
      </section>

      <section class="panel" aria-labelledby="h-kp-sigp">
        <header class="panel-head"><h2 id="h-kp-sigp">{t('kp.sigPlanets')}</h2></header>
        <div class="panel-body">
          <div class="table-wrap">
            <table class="data" data-testid="kp-sig-planets">
              <thead><tr>
                <th scope="col">{t('col.body')}</th><th scope="col">{t('kp.star')}</th>
                <th scope="col" class="c" title={t('kp.levelA')}>A</th><th scope="col" class="c" title={t('kp.levelB')}>B</th>
                <th scope="col" class="c" title={t('kp.levelC')}>C</th><th scope="col" class="c" title={t('kp.levelD')}>D</th>
              </tr></thead>
              <tbody>
                {m.planetSignificators.map((s) => (
                  <tr key={s.id} data-point={s.id}>
                    <th scope="row"><span class={`pl pl-${s.id}`} title={PLANET_NAMES[s.id]}>{s.id}</span></th>
                    <td><Chips ids={[m.planets.find((p) => p.id === s.id)!.lords[0]]} /></td>
                    <td class="c num">{houses(s.a)}</td><td class="c num">{houses(s.b)}</td>
                    <td class="c num">{houses(s.c)}</td><td class="c num">{houses(s.d)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul class="hint-text kp-levels">
            <li><b>A</b> {t('kp.levelA')}</li><li><b>B</b> {t('kp.levelB')}</li>
            <li><b>C</b> {t('kp.levelC')}</li><li><b>D</b> {t('kp.levelD')}</li>
          </ul>
        </div>
      </section>
      <p class="hint-text" data-testid="kp-fortuna">{t('kp.fortuna', {
        pos: `${signAbbr(signIndex(pf))} ${dms(pfd.d, pfd.m, pfd.s)}`, sign: PLANET_NAMES[SIGN_LORD[signIndex(pf)]!], star: PLANET_NAMES[pfl[0]!], sub: PLANET_NAMES[pfl[1]!],
      })}</p>
    </>
  );
}

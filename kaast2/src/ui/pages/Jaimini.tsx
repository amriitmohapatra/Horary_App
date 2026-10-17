/**
 * Jaimini (slice 7): chara karakas (7 and 8), special lagnas, arudha padas
 * (D1, D9, D10) with upapada, Karakamsha, argala and rashi drishti. Where
 * Parashara's Light's own choice is not yet confirmed, the variant is
 * selectable and says so (docs: knowledge/06, PLAN §2.3).
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult } from '../../engine';
import { PLANETS, type PlanetId, type PointId } from '../../engine/types';
import { PLANET_NAMES } from '../../engine/names';
import { SIGNS, dmsInSign, signIndex } from '../../engine/zodiac';
import { vargaSign, type VargaId } from '../../engine/varga/rules';
import { page1Model } from '../../engine/page1';
import {
  argala, arudhaPadas, charaKarakas, jaiminiAspects, karakamsha, KARAKA_NAMES, specialLagnas,
  type ArgalaNodeRule, type ArudhaVariant, type SignMap,
} from '../../engine/jaimini';
import { EastIndianChart, type ChartEntry } from '../components/EastIndianChart';
import { signRow, vargaEntries } from '../chartEntries';
import { t, type MessageKey } from '../i18n';
import { civilTime, dms } from '../format';
import { engine } from '../state/store';

const lonText = (a: number) => { const { d, m, s } = dmsInSign(a); return `${SIGNS[signIndex(a)]} ${dms(d, m, s)}`; };

export function Jaimini({ chart }: { chart: ChartResult }): JSX.Element {
  const [varga, setVarga] = useState<VargaId>('D1');
  const [variant, setVariant] = useState<ArudhaVariant>('bphs');
  const [argalaFrom, setArgalaFrom] = useState<PointId>('As');
  const [nodeRule, setNodeRule] = useState<ArgalaNodeRule>('reverse-reference');
  const model = useMemo(() => page1Model(chart), [chart]);
  const lons = useMemo(() => {
    const l: Partial<Record<PointId, number>> = { As: chart.asc.lon };
    for (const p of PLANETS) l[p] = chart.bodies[p].lon;
    return l;
  }, [chart]);
  const signMap = (v: VargaId): SignMap => Object.fromEntries(Object.entries(lons).map(([k, a]) => [k, vargaSign(v, a!)]));
  const k7 = charaKarakas(chart.bodies, 7), k8 = charaKarakas(chart.bodies, 8);
  const km = karakamsha(chart.bodies, 7);
  const sm = signMap(varga);
  const ar = arudhaPadas(sm, sm.As!, { variant });
  const d1 = signMap('D1');
  const swe = engine.value.status === 'ready' ? engine.value.swe : null;
  const lag = useMemo(() => (swe ? specialLagnas(swe, chart) : null), [swe, chart]);
  const zone = chart.input.tzHours + chart.input.dstHours;
  const arg = argala(d1, argalaFrom === 'As' ? d1.As! : (argalaFrom as PlanetId), { nodes: nodeRule });
  const aspects = jaiminiAspects(d1);
  const name = chart.input.name || t('page1.birthChart');

  // Arudha chart: A1…A12 and UL written into their signs
  const arudhaSigns: ChartEntry[][] = Array.from({ length: 12 }, (_, s) => [signRow(s, sm.As!)]);
  const groups: string[][] = Array.from({ length: 12 }, () => []);
  ar.padas.forEach((s, i) => groups[s]!.push(i === 0 ? 'AL' : i === 11 ? 'UL' : `A${i + 1}`));
  groups.forEach((g, s) => {
    for (let i = 0; i < g.length; i += 3) arudhaSigns[s]!.push({ key: g.slice(i, i + 3).join(''), parts: [{ text: g.slice(i, i + 3).join(' '), bold: true, tone: 'As' }] });
  });
  const d9map = signMap('D9');
  const kmGroups: PointId[][] = Array.from({ length: 12 }, () => []);
  for (const p of ['As', ...PLANETS] as PointId[]) kmGroups[d9map[p]!]!.push(p);

  const karakaTable = (list: ReturnType<typeof charaKarakas>, id: string, label: MessageKey) => (
    <table class="data" data-testid={id}>
      <caption class="cap-top">{t(label)}</caption>
      <thead><tr><th scope="col">{t('jai.karaka')}</th><th scope="col">{t('col.body')}</th><th scope="col" class="r">{t('jai.degree')}</th></tr></thead>
      <tbody>
        {list.map((e) => (
          <tr key={e.karaka}>
            <th scope="row"><abbr title={KARAKA_NAMES[e.karaka]}>{e.karaka}</abbr></th>
            <td><span class={`pl pl-${e.planet}`}>{e.planet}</span> {PLANET_NAMES[e.planet]}</td>
            <td class="num r">{(() => { const { d, m, s } = dmsInSign(e.degree); return dms(d, m, s); })()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <article class="jaimini" data-testid="jaimini-page">
      <div class="two-col">
        <section class="panel" aria-labelledby="h-karakas">
          <header class="panel-head"><h2 id="h-karakas">{t('jai.karakas')}</h2></header>
          <div class="panel-body karaka-pair">
            {karakaTable(k7, 'karakas7', 'jai.k7')}
            {karakaTable(k8, 'karakas8', 'jai.k8')}
          </div>
        </section>
        <section class="panel" aria-labelledby="h-lagnas">
          <header class="panel-head"><h2 id="h-lagnas">{t('jai.lagnas')}</h2></header>
          <div class="panel-body">
            {lag ? (
              <>
                <table class="data" data-testid="special-lagnas">
                  <tbody>
                    {([['jai.bhava', lag.bhava.lon], ['jai.hora', lag.hora.lon], ['jai.ghatika', lag.ghatika.lon], ['jai.pranapada', lag.pranapada.lon], ['jai.sri', lag.sri.lon]] as [MessageKey, number][]).map(([k, v]) => (
                      <tr key={k}><th scope="row">{t(k)}</th><td class="num">{lonText(v)}</td></tr>
                    ))}
                    <tr><th scope="row">{t('jai.varnada')}</th><td class="num">{SIGNS[lag.varnada]}</td></tr>
                    <tr><th scope="row">{t('jai.indu')}</th><td class="num">{SIGNS[lag.indu]}</td></tr>
                  </tbody>
                </table>
                <p class="hint-text">{t('jai.lagnasNote', { sunrise: civilTime(lag.sunriseJdUT, zone), ishta: lag.ishtaMinutes.toFixed(1) })}</p>
              </>
            ) : <p class="pending">{t('engine.booting')}</p>}
          </div>
        </section>
      </div>

      <div class="varga-main">
        <section class="panel" aria-labelledby="h-arudha">
          <header class="panel-head"><h2 id="h-arudha">{t('jai.arudha')} · {varga}</h2></header>
          <div class="panel-body">
            <div class="controls-row">
              <div class="segmented" role="group" aria-label={t('jai.arudhaVarga')}>
                {(['D1', 'D9', 'D10'] as VargaId[]).map((v) => (
                  <button key={v} type="button" class="seg" aria-pressed={varga === v} onClick={() => setVarga(v)}>{v}</button>
                ))}
              </div>
              <div class="field">
                <label for="j-variant">{t('jai.exception')}</label>
                <select id="j-variant" value={variant} onChange={(e) => setVariant(e.currentTarget.value as ArudhaVariant)}>
                  <option value="bphs">{t('jai.exception.bphs')}</option>
                  <option value="tutorial">{t('jai.exception.tutorial')}</option>
                  <option value="none">{t('jai.exception.none')}</option>
                </select>
              </div>
            </div>
            <EastIndianChart title={`${t('jai.arudha')} ${varga}: ${name}`} signs={arudhaSigns} lagnaSign={sm.As!}
              centre={[{ text: varga, size: 52, display: true }, { text: t('jai.padas'), size: 24 }]} maxFont={34} minFont={12} />
            <p class="hint-text">{t('jai.arudhaNote', { ul: SIGNS[ar.upapada]! })}</p>
          </div>
        </section>
        <section class="panel" aria-labelledby="h-km">
          <header class="panel-head"><h2 id="h-km">{t('jai.karakamsha')}</h2></header>
          <div class="panel-body">
            <EastIndianChart title={`${t('jai.karakamsha')}: ${name}`} signs={vargaEntries(kmGroups, model.rows, km.sign)} lagnaSign={km.sign}
              centre={[{ text: 'KL', size: 52, display: true }, { text: `AK ${PLANET_NAMES[km.ak]}`, size: 24 }]} maxFont={40} minFont={12} />
            <p class="hint-text">{t('jai.kmNote', { sign: SIGNS[km.sign]!, ak: PLANET_NAMES[km.ak] })}</p>
          </div>
        </section>
      </div>

      <div class="two-col">
        <section class="panel" aria-labelledby="h-argala">
          <header class="panel-head"><h2 id="h-argala">{t('jai.argala')}</h2></header>
          <div class="panel-body">
            <div class="controls-row">
              <div class="field">
                <label for="j-from">{t('jai.from')}</label>
                <select id="j-from" value={argalaFrom} onChange={(e) => setArgalaFrom(e.currentTarget.value as PointId)}>
                  {(['As', ...PLANETS] as PointId[]).map((p) => <option key={p} value={p}>{p === 'As' ? t('chart.ascendant') : PLANET_NAMES[p]}</option>)}
                </select>
              </div>
              <div class="field">
                <label for="j-nodes">{t('jai.nodes')}</label>
                <select id="j-nodes" value={nodeRule} onChange={(e) => setNodeRule(e.currentTarget.value as ArgalaNodeRule)}>
                  <option value="reverse-reference">{t('jai.nodes.ref')}</option>
                  <option value="reverse-causers">{t('jai.nodes.causers')}</option>
                  <option value="none">{t('jai.nodes.none')}</option>
                </select>
              </div>
            </div>
            <table class="data" data-testid="argala-table">
              <thead><tr><th scope="col">{t('jai.place')}</th><th scope="col">{t('jai.argalaBy')}</th><th scope="col">{t('jai.virodhaBy')}</th><th scope="col">{t('jai.outcome')}</th></tr></thead>
              <tbody>
                {arg.map((a) => (
                  <tr key={a.place}>
                    <th scope="row">{a.place} / {a.obstructionPlace}</th>
                    <td>{a.argala.map((p) => <span key={p} class={`pl pl-${p}`}>{p} </span>)}</td>
                    <td>{a.virodha.map((p) => <span key={p} class={`pl pl-${p}`}>{p} </span>)}</td>
                    <td>{t(`jai.outcome.${a.outcome}` as MessageKey)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section class="panel" aria-labelledby="h-drishti">
          <header class="panel-head"><h2 id="h-drishti">{t('jai.drishti')}</h2></header>
          <div class="panel-body">
            <ul class="aspect-list" data-testid="rashi-drishti">
              {aspects.map((a, i) => (
                <li key={i}><span class={`pl pl-${a.a}`}>{a.a}</span> ↔ <span class={`pl pl-${a.b}`}>{a.b}</span>
                  <span class="muted"> · {t(a.kind === 'dual' ? 'jai.dual' : 'jai.fixedMovable')}</span></li>
              ))}
            </ul>
            <p class="hint-text">{t('jai.drishtiNote')}</p>
          </div>
        </section>
      </div>
    </article>
  );
}

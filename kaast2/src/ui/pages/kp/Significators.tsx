/**
 * KP (Research) → Significators in Krishnamurti's order of strength
 * (src/engine/kp/significators.ts; B6 pp. 94–100, 254; B3 pp. 354–355, 418).
 */
import type { JSX } from 'preact';
import type { PlanetId } from '../../../engine';
import type { KpModel } from '../../../engine/kp/kp';
import type { kpSignifications } from '../../../engine/kp/significators';
import { PLANET_NAMES } from '../../../engine/names';
import { t } from '../../i18n';
import { Chips, Pl, houseList } from './common';

type Sig = ReturnType<typeof kpSignifications>;
const WHY: Record<string, string> = { conjoined: 'conjoined', 'star lord': 'its star lord', aspecting: 'aspecting it', 'sign lord': 'its sign lord' };

export function Significators({ m, sig }: { m: KpModel; sig: Sig }): JSX.Element {
  return (
    <>
      <section class="panel" aria-labelledby="h-kp-rank">
        <header class="panel-head"><h2 id="h-kp-rank">{t('kp.rank')}</h2></header>
        <div class="panel-body">
          <p class="hint-text">{t('kp.rankIntro')}</p>
          <div class="table-wrap">
            <table class="data" data-testid="kp-rank">
              <thead><tr>
                <th scope="col">{t('kp.house')}</th>
                <th scope="col" title={t('kp.lv1')}>1</th><th scope="col" title={t('kp.lv2')}>2</th>
                <th scope="col" title={t('kp.lv3')}>3</th><th scope="col" title={t('kp.lv4')}>4</th>
                <th scope="col" title={t('kp.lv5')}>5</th>
                <th scope="col">{t('kp.nodesFor')}</th>
                <th scope="col">{t('kp.ordered')}</th>
              </tr></thead>
              <tbody>
                {sig.houses.map((h) => (
                  <tr key={h.house} data-house={h.house}>
                    <th scope="row">{h.house}</th>
                    {h.levels.map((L, i) => <td key={i}><Chips ids={L} /></td>)}
                    <td>{[...h.nodeAgents.map((a) => `${a.node} for ${a.for}`), ...h.nodeStar.map((x) => `${x.planet} in ${x.node}’s star`)].join('; ') || '–'}
                      {h.emptyStar.length ? <span class="muted"> · {t('kp.emptyStar')}: {h.emptyStar.join(', ')}</span> : null}</td>
                    <td class="kp-ordered"><Chips ids={h.ordered} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ol class="hint-text kp-levels">
            <li>{t('kp.lv1')}</li><li>{t('kp.lv2')}</li><li>{t('kp.lv3')}</li><li>{t('kp.lv4')}</li><li>{t('kp.lv5')}</li>
          </ol>
          <p class="hint-text">{t('kp.rankNote')}</p>
        </div>
      </section>

      <section class="panel" aria-labelledby="h-kp-psets">
        <header class="panel-head"><h2 id="h-kp-psets">{t('kp.psets')}</h2></header>
        <div class="panel-body">
          <div class="table-wrap">
            <table class="data" data-testid="kp-psets">
              <thead><tr>
                <th scope="col">{t('col.body')}</th><th scope="col">{t('kp.star')}</th>
                <th scope="col">{t('kp.allHouses')}</th><th scope="col">{t('kp.represents')}</th>
              </tr></thead>
              <tbody>
                {m.planets.map((p) => {
                  const s = sig.planets[p.id];
                  return (
                    <tr key={p.id} data-point={p.id}>
                      <th scope="row"><Pl id={p.id} /></th>
                      <td><Pl id={p.lords[0]} /></td>
                      <td class="num">{houseList(s.all)}</td>
                      <td>{s.represents.length
                        ? s.represents.map((r, i) => <span key={r.planet}>{i ? ', ' : ''}<Pl id={r.planet as PlanetId} /> <span class="muted">({WHY[r.why]})</span></span>)
                        : (p.lords[0] === 'Ra' || p.lords[0] === 'Ke')
                          ? <span class="muted">{t('kp.inNodeStar', { node: PLANET_NAMES[p.lords[0]] })}</span>
                          : '–'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p class="hint-text">{t('kp.psetsNote')}</p>
        </div>
      </section>
    </>
  );
}

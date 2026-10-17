/**
 * Vargas (slice 3): every Parashara's Light divisional chart. One large chart
 * for the selected varga with its rule and evidence grade, small charts for
 * the rest of the group, and the "signs in all vargas" table (PL's worksheet
 * of the same name) with vargottama marked by a symbol, not by colour alone.
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult } from '../../engine';
import { page1Model } from '../../engine/page1';
import { PLANETS, type PointId } from '../../engine/types';
import { VARGAS, vargaDef, vargaGroups, vargaSign, type VargaDef, type VargaId } from '../../engine/varga/rules';
import { SIGNS } from '../../engine/zodiac';
import { EastIndianChart } from '../components/EastIndianChart';
import { vargaEntries } from '../chartEntries';
import { t, type MessageKey } from '../i18n';

type GroupId = 'shodasha' | 'tajika' | 'alternates';
const GROUPS: { id: GroupId; label: MessageKey; ids: VargaId[] }[] = [
  { id: 'shodasha', label: 'vargas.group.shodasha', ids: VARGAS.filter((v) => v.position >= 1 && v.position <= 16).map((v) => v.id) },
  { id: 'tajika', label: 'vargas.group.tajika', ids: VARGAS.filter((v) => v.position >= 17 && v.position <= 21).map((v) => v.id) },
  { id: 'alternates', label: 'vargas.group.alternates', ids: VARGAS.filter((v) => v.position >= 22 || v.position === 0).map((v) => v.id) },
];
const ORDER: PointId[] = ['As', ...PLANETS];

/** The rule in plain words; the program address goes under "Source". */
function plainRule(v: VargaDef): { rule: string; source?: string } {
  const note = v.note ?? '';
  const src = /^(fcn\.[0-9a-f]+(?: case \d+)?)/.exec(note)?.[1];
  if (note.startsWith('fcn.0057d1e1')) {
    const extra = note.split('; ').slice(1).join('; ');
    return { rule: t('vargas.cyclic', { n: v.divisor }) + (extra ? ` (${extra.replace(/^equals /, t('vargas.sameAs') + ' ')})` : ''), source: src };
  }
  return { rule: note.replace(/^fcn\.[0-9a-f]+(?: case \d+)?:\s*/, ''), source: src };
}

function gradeText(v: VargaDef): string {
  return v.grade === 'BIN' ? t('vargas.grade.bin') : v.grade === 'OPEN' ? t('vargas.grade.open') : t('vargas.grade.std');
}

export function Vargas({ chart }: { chart: ChartResult }): JSX.Element {
  const [group, setGroup] = useState<GroupId>('shodasha');
  const [selected, setSelected] = useState<VargaId>('D9');
  const model = useMemo(() => page1Model(chart), [chart]);
  const points = useMemo(() => {
    const p: Partial<Record<PointId, number>> = { As: chart.asc.lon };
    for (const id of PLANETS) p[id] = chart.bodies[id].lon;
    return p;
  }, [chart]);
  const ids = GROUPS.find((g) => g.id === group)!.ids;
  const sel = vargaDef(ids.includes(selected) ? selected : ids[0]!);
  const name = chart.input.name || t('page1.birthChart');

  const plate = (v: VargaDef, big: boolean) => (
    <EastIndianChart
      title={`${v.id} ${v.name}: ${name}`}
      signs={vargaEntries(vargaGroups(v.id, points), model.rows, vargaSign(v.id, chart.asc.lon))}
      lagnaSign={vargaSign(v.id, chart.asc.lon)}
      centre={big ? [{ text: v.id, size: 56, display: true }, { text: v.name, size: 26 }] : [{ text: v.id, size: 72, display: true }]}
      maxFont={big ? 40 : 52} minFont={big ? 12 : 10}
    />
  );

  return (
    <article class="vargas" data-testid="vargas-page">
      <div class="segmented" role="group" aria-label={t('vargas.groups')}>
        {GROUPS.map((g) => (
          <button key={g.id} type="button" class="seg" aria-pressed={group === g.id}
            onClick={() => { setGroup(g.id); setSelected(g.ids.includes('D9') ? 'D9' : g.ids[0]!); }}>{t(g.label)}</button>
        ))}
      </div>

      <div class="varga-main">
        <section class="panel" aria-labelledby="h-varga">
          <header class="panel-head"><h2 id="h-varga">{sel.id} · {sel.name}</h2></header>
          <div class="panel-body">{plate(sel, true)}</div>
        </section>
        <section class="panel" aria-labelledby="h-rule">
          <header class="panel-head"><h2 id="h-rule">{t('vargas.rule')}</h2></header>
          <div class="panel-body varga-rule">
            <p><span class={`grade grade-${sel.grade}`}>{sel.grade}</span> {gradeText(sel)}</p>
            <p>{plainRule(sel).rule}</p>
            {plainRule(sel).source && <p class="muted">{t('vargas.source', { src: plainRule(sel).source! })}</p>}
            <p class="hint-text">{t('vargas.boundary')}</p>
          </div>
        </section>
      </div>

      <section class="panel" aria-labelledby="h-all">
        <header class="panel-head"><h2 id="h-all">{t('vargas.allSigns')}</h2></header>
        <div class="panel-body table-wrap">
          <table class="data varga-table" data-testid="varga-table">
            <caption class="hint-text cap">{t('vargas.vargottamaLegend')}</caption>
            <thead>
              <tr><th scope="col">{t('col.body')}</th>{ids.map((id) => <th key={id} scope="col" class="c">{id}</th>)}</tr>
            </thead>
            <tbody>
              {ORDER.map((p) => {
                const d1 = vargaSign('D1', points[p]!);
                return (
                  <tr key={p}>
                    <th scope="row"><span class={`pl pl-${p}`}>{p}</span></th>
                    {ids.map((id) => {
                      const s = vargaSign(id, points[p]!);
                      const vo = id !== 'D1' && s === d1;
                      return <td key={id} class={`c num${vo ? ' vargottama' : ''}`} title={vo ? t('vargas.vargottama') : undefined}>{SIGNS[s]}{vo ? '•' : ''}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-label={t('vargas.charts')} class="varga-grid">
        {ids.map((id) => {
          const v = vargaDef(id);
          return (
            <button key={id} type="button" class="varga-thumb" aria-pressed={sel.id === id}
              aria-label={t('vargas.show', { varga: `${v.id} ${v.name}` })} onClick={() => setSelected(id)}>
              {plate(v, false)}
              <span class="thumb-label">{v.id} · {v.name}</span>
            </button>
          );
        })}
      </section>
    </article>
  );
}

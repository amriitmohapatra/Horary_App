/**
 * Yogas: PL 7's 1001-yoga database evaluated with PL's own formulas
 * (src/engine/yoga), plus Angaraka and Guru-Chandala, which PL lacks. PL
 * evaluates yogas on the Rasi only; other charts are our extension.
 * The definitions and results are PL's own text (plYogaText.json, private).
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult } from '../../../engine';
import { plYogas, textbookYogas, vargaAsChart, type YogaResult } from '../../../engine/yoga';
import text from '../../../engine/yoga/plYogaText.json';
import { vargaSign, type VargaId } from '../../../engine/varga/rules';
import { vara } from '../../../engine/panchanga/panchanga';
import { engine, nativeSex, strength } from '../../state/store';
import { Chip } from './common';

const TEXT = text as unknown as Record<string, [string, string, string]>;
const POL = { positive: { word: 'Positive', tone: 'good' }, mixed: { word: 'Mixed', tone: 'mixed' }, negative: { word: 'Negative', tone: 'bad' } } as const;

export function Yogas({ chart, varga }: { chart: ChartResult; varga: VargaId }): JSX.Element {
  const [pol, setPol] = useState<'all' | 'good' | 'positive'>('all');
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const e = engine.value;
  const sex = nativeSex.value;
  const rasi = varga === 'D1';
  const results = useMemo(() => {
    const c = rasi ? chart : vargaAsChart(chart, (a) => vargaSign(varga, a));
    const wd = e.status === 'ready' ? vara(e.swe, chart).num : null;
    return plYogas(c, rasi ? strength.value : null, sex === 'unspecified' ? null : sex === 'female', wd);
  }, [chart, varga, strength.value, sex, e]);
  const extras = useMemo(() => (rasi ? textbookYogas(chart) : []), [chart, rasi]);
  const cats = useMemo(() => [...new Set(results.map((r) => r.rule.category))].sort(), [results]);
  const keep = (r: YogaResult) => (pol === 'all' || (pol === 'positive' ? r.rule.polarity === 'positive' : r.rule.polarity !== 'negative'))
    && (!cat || r.rule.category === cat)
    && (!q || `${r.rule.name} ${TEXT[r.rule.id]?.[0] ?? ''}`.toLowerCase().includes(q.toLowerCase()));
  const present = results.filter((r) => r.outcome === 'present' && keep(r));
  const unknown = results.filter((r) => r.outcome === 'unknown');
  return (
    <section class="panel" aria-labelledby="h-exp-yogas">
      <header class="panel-head"><h2 id="h-exp-yogas">Yogas{rasi ? '' : ` in ${varga}`}</h2></header>
      <div class="panel-body">
        <p class="hint-text">
          {rasi
            ? <>Parashara's Light 7's "1001 Yogas", tested with PL's own conditions on the Rasi chart: {results.filter((r) => r.outcome === 'present').length} present. Conjunction means the same sign; benefics and malefics are natural ones.</>
            : <>PL tests yogas on the Rasi only. Here PL's conditions are applied to the {varga} chart as if it were a Rasi (our extension); conditions that need Shad Bala are skipped.</>}
        </p>
        <div class="exp-controls">
          <div class="field exp-field"><label for="yoga-pol">Show</label>
            <select id="yoga-pol" value={pol} onChange={(ev) => setPol((ev.currentTarget as HTMLSelectElement).value as typeof pol)}>
              <option value="all">All yogas present</option><option value="good">Positive or partly positive</option><option value="positive">Only positive</option>
            </select></div>
          <div class="field exp-field"><label for="yoga-cat">Group</label>
            <select id="yoga-cat" value={cat} onChange={(ev) => setCat((ev.currentTarget as HTMLSelectElement).value)}>
              <option value="">All groups</option>{cats.map((c) => <option key={c} value={c}>{c}</option>)}
            </select></div>
          <div class="field exp-field"><label for="yoga-q">Find</label><input id="yoga-q" type="search" value={q} placeholder="e.g. Dhana, Raja, Gaja" onInput={(ev) => setQ((ev.currentTarget as HTMLInputElement).value)} /></div>
          <div class="field exp-field"><label for="yoga-sex">Native</label>
            <select id="yoga-sex" value={sex} onChange={(ev) => { nativeSex.value = (ev.currentTarget as HTMLSelectElement).value as typeof sex; }}>
              <option value="unspecified">Not set</option><option value="male">Male</option><option value="female">Female</option>
            </select></div>
        </div>
        {extras.length > 0 && (
          <ul class="exp-conj" data-testid="exp-textbook-yogas">
            {extras.map((x) => (
              <li key={x.id} class={x.present ? 'tone-bad' : ''}>
                <strong>{x.name}</strong>: {x.present ? 'present' : 'not present'}. <span class="muted">{x.text}</span> <span class="ntp-cite">{x.source}</span>
              </li>
            ))}
          </ul>
        )}
        <p class="muted" data-testid="exp-yoga-count">{present.length} shown.</p>
        <ul class="yoga-list" data-testid="exp-yogas">
          {present.map((r) => {
            const [def, res, src] = TEXT[r.rule.id] ?? ['', '', ''];
            const p = POL[r.rule.polarity];
            return (
              <li key={r.rule.id} class={`yoga tone-${p.tone}`}>
                <div class="yoga-head"><strong>{r.rule.name}</strong> <Chip tone={p.tone}>{p.word}</Chip> <span class="muted">{r.rule.category} · PL #{r.rule.id}</span></div>
                {def && <p class="yoga-def">{def}</p>}
                {res && <p class="yoga-res">{res}</p>}
                <details><summary>PL condition</summary><code class="yoga-formula">{r.rule.formula}</code>{src && <span class="ntp-cite"> {src}</span>}</details>
              </li>
            );
          })}
        </ul>
        {unknown.length > 0 && (
          <details class="ntp-more">
            <summary>{unknown.length} yoga{unknown.length === 1 ? '' : 's'} not evaluated</summary>
            <p class="hint-text">These depend on something the app does not compute in PL's way yet (named in brackets){sex === 'unspecified' ? ', or on the native’s sex: set it above' : ''}.</p>
            <ul class="hint-text">{unknown.map((r) => <li key={r.rule.id}>{r.rule.name} (#{r.rule.id}): {r.reason}</li>)}</ul>
          </details>
        )}
      </div>
    </section>
  );
}

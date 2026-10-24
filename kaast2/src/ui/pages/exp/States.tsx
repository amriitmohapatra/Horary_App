/**
 * Highlights: every planet's state in the chosen chart (dignity, retrograde,
 * combust, vargottama, the 3rd/6th/8th/12th houses, directional strength),
 * the conjunctions with their definition, and the dignity of each planet
 * across the 16 Parashari charts. Rules: src/engine/exp/states.ts.
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult, PlanetId } from '../../../engine';
import { PLANET_NAMES } from '../../../engine/names';
import { chartStates, WAR_ORB, type ChartStates, type PlanetState } from '../../../engine/exp/states';
import { SIGNS } from '../../../engine/zodiac';
import { type VargaId } from '../../../engine/varga/rules';
import { EastIndianChart, type ChartEntry, type ChartPart } from '../../components/EastIndianChart';
import { conjunctionOrb, setConjunctionOrb } from '../../state/store';
import { Chip, PARASHARI, Pl, VargaSelect, ordinal, vargaLabel, type Tone } from './common';

const DIGNITY: Record<NonNullable<PlanetState['dignity']>, { word: string; abbr: string; tone: Tone; tip: string }> = {
  EX: { word: 'Exalted', abbr: 'Ex', tone: 'good', tip: 'In its sign of exaltation' },
  MT: { word: 'Moolatrikona', abbr: 'Mt', tone: 'good', tip: 'In its moolatrikona sign and degrees (Rasi only)' },
  OWN: { word: 'Own sign', abbr: 'Ow', tone: 'good', tip: 'In a sign it rules' },
  DB: { word: 'Debilitated', abbr: 'Db', tone: 'bad', tip: 'In its sign of debilitation' },
};
const TRIK_TIP: Record<number, string> = {
  3: '3rd house: effort, courage, siblings; a mild dusthana (some texts count it with 6, 8, 12)',
  6: '6th house: enemies, debts, disease (dusthana)',
  8: '8th house: obstacles, longevity, the hidden (dusthana)',
  12: '12th house: loss, expense, retreat (dusthana)',
};

export function stateChips(p: PlanetState): { word: string; abbr: string; tone: Tone; tip: string }[] {
  const out: { word: string; abbr: string; tone: Tone; tip: string }[] = [];
  if (p.dignity) out.push(DIGNITY[p.dignity]);
  if (p.vargottama) out.push({ word: 'Vargottama', abbr: 'Vg', tone: 'good', tip: 'Same sign in the Rasi and the Navamsha' });
  if (p.digBala) out.push({ word: 'Dig bala', abbr: 'Dg', tone: 'good', tip: 'In its house of directional strength' });
  if (p.retrograde) out.push({ word: 'Retrograde', abbr: 'R', tone: 'info', tip: 'Moving backwards as seen from the Earth (Rahu and Ketu always)' });
  if (p.combust) out.push({ word: 'Combust', abbr: 'c', tone: 'bad', tip: 'Too close to the Sun' });
  if (p.trik) out.push({ word: `In the ${ordinal(p.trik)}`, abbr: String(p.trik), tone: p.trik === 3 ? 'mixed' : 'bad', tip: TRIK_TIP[p.trik]! });
  return out;
}

function plateEntries(s: ChartStates): ChartEntry[][] {
  const by: PlanetState[][] = Array.from({ length: 12 }, () => []);
  for (const p of s.planets) by[p.sign]!.push(p);
  return by.map((ps, sign) => {
    const house = ((sign - s.ascSign + 12) % 12) + 1;
    const trik = house === 3 || house === 6 || house === 8 || house === 12;
    const lines: ChartEntry[] = [{
      key: `sign${sign}`,
      parts: [{ text: SIGNS[sign]!, tone: 'sign' }, { text: ` ${house}`, tone: trik ? 'trik' : 'house' }],
    }];
    if (sign === s.ascSign) lines.push({ key: 'As', parts: [{ text: 'As', tone: 'As', bold: true }] });
    for (const p of ps) {
      const marks = stateChips(p).filter((c) => !/^\d+$/.test(c.abbr));
      const parts: ChartPart[] = [{ text: p.id, tone: p.id, bold: true }];
      for (const m of marks) parts.push({ text: ` ${m.abbr}`, tone: m.tone === 'good' ? 'good' : m.tone === 'bad' ? 'bad' : 'muted' });
      lines.push({ key: p.id, parts });
    }
    return lines;
  });
}

function DignityAcross({ chart }: { chart: ChartResult }): JSX.Element {
  const all = useMemo(() => PARASHARI.map((v) => chartStates(chart, v)), [chart]);
  const mark = (p: PlanetState) => (p.dignity === 'EX' ? '▲' : p.dignity === 'DB' ? '▼' : p.dignity ? '●' : '');
  return (
    <div class="table-wrap" tabIndex={0} role="region" aria-label="Dignity in the 16 Parashari charts">
      <table class="data exp-across" data-testid="exp-across">
        <caption class="hint-text cap">
          Sign and house of each planet in the 16 Parashari charts. ▲ exalted, ● own sign or moolatrikona, ▼ debilitated;
          a house number in red is the 3rd, 6th, 8th or 12th of that chart. The last column counts the marks.
        </caption>
        <thead><tr><th scope="col">Planet</th>{PARASHARI.map((v) => <th key={v} scope="col" class="c" title={vargaLabel(v)}>{v}</th>)}<th scope="col" class="c">▲ ● ▼</th></tr></thead>
        <tbody>
          {chart && (['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'] as PlanetId[]).map((id, i) => {
            const cells = all.map((s) => s.planets[i]!);
            const n = (d: string[]) => cells.filter((c) => c.dignity && d.includes(c.dignity)).length;
            return (
              <tr key={id}>
                <th scope="row"><Pl id={id} /></th>
                {cells.map((c, j) => (
                  <td key={j} class={`c num dg-${c.dignity ?? 'none'}`}
                    title={`${PLANET_NAMES[id]} in ${vargaLabel(PARASHARI[j]!)}: ${SIGNS[c.sign]}, house ${c.house}${c.dignity ? `, ${DIGNITY[c.dignity].word.toLowerCase()}` : ''}`}>
                    {SIGNS[c.sign]} <span class={c.trik && c.trik !== 3 ? 'trik' : c.trik ? 'trik3' : 'muted'}>{c.house}</span>{mark(c) && <span class="dg-mark"> {mark(c)}</span>}
                  </td>
                ))}
                <td class="c num">{n(['EX'])} {n(['OWN', 'MT'])} {n(['DB'])}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function States({ chart }: { chart: ChartResult }): JSX.Element {
  const [varga, setVarga] = useState<VargaId>('D1');
  const orb = conjunctionOrb.value;
  const s = useMemo(() => chartStates(chart, varga, orb), [chart, varga, orb]);
  const rasi = varga === 'D1';
  const name = chart.input.name || 'Birth chart';
  return (
    <>
      <div class="exp-controls">
        <VargaSelect id="exp-states-chart" value={varga} onChange={setVarga} />
        <div class="field exp-field">
          <label for="exp-orb">Close conjunction orb (°)</label>
          <input id="exp-orb" type="number" min={0.5} max={15} step={0.5} value={orb} inputMode="decimal"
            onChange={(e) => { const v = Number((e.currentTarget as HTMLInputElement).value); if (v > 0 && v <= 15) setConjunctionOrb(v); }} />
        </div>
      </div>

      <div class="varga-main">
        <section class="panel" aria-labelledby="h-exp-plate">
          <header class="panel-head"><h2 id="h-exp-plate">{vargaLabel(varga)}</h2></header>
          <div class="panel-body">
            <EastIndianChart title={`${vargaLabel(varga)} with planet states: ${name}`} signs={plateEntries(s)} lagnaSign={s.ascSign}
              centre={[{ text: varga, size: 56, display: true }, { text: 'States', size: 26 }]} maxFont={40} minFont={12} />
            <p class="hint-text">
              Ex exalted · Mt moolatrikona · Ow own sign · Db debilitated · Vg vargottama · Dg dig bala · R retrograde · c combust.
              House numbers in red mark the 3rd, 6th, 8th and 12th.
            </p>
          </div>
        </section>

        <section class="panel" aria-labelledby="h-exp-states">
          <header class="panel-head"><h2 id="h-exp-states">Planet states</h2></header>
          <div class="panel-body table-wrap">
            <table class="data" data-testid="exp-states">
              <thead><tr><th scope="col">Planet</th><th scope="col">Sign</th><th scope="col" class="c">House</th><th scope="col">States</th></tr></thead>
              <tbody>
                {s.planets.map((p) => (
                  <tr key={p.id}>
                    <th scope="row"><Pl id={p.id} /></th>
                    <td>{SIGNS[p.sign]}</td>
                    <td class="c num">{p.house}</td>
                    <td><span class="chips">{stateChips(p).map((c) => <Chip key={c.word} tone={c.tone} title={c.tip}>{c.word}</Chip>)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rasi && <p class="hint-text">In a divisional chart only the sign counts, so moolatrikona shows as own sign. Retrograde, combust and vargottama are the planet's Rasi states.</p>}
          </div>
        </section>
      </div>

      <section class="panel" aria-labelledby="h-exp-conj">
        <header class="panel-head"><h2 id="h-exp-conj">Conjunctions</h2></header>
        <div class="panel-body">
          <p class="exp-def">
            <strong>What counts as a conjunction.</strong> Two planets in the same sign of a chart are conjunct (yuti), whatever
            the distance — the Parashari rule. In the Rasi a conjunction within <strong>{orb}°</strong> is
            marked <em>close</em>: the closer, the stronger the blend. Two of Mars, Mercury, Jupiter, Venus and Saturn within {WAR_ORB}°
            are in <em>planetary war</em> (graha yuddha). Planets within the orb but in neighbouring signs are not conjunct; they are listed separately.
          </p>
          {s.conjunctions.length === 0
            ? <p class="muted">No two planets share a sign in this chart.</p>
            : (
              <ul class="exp-conj" data-testid="exp-conjunctions">
                {s.conjunctions.map((c) => (
                  <li key={c.a + c.b} class={c.war ? 'tone-bad' : c.close ? 'tone-good' : ''}>
                    <Pl id={c.a} /> + <Pl id={c.b} /> in {SIGNS[c.sign]}
                    {c.orb !== null && <span class="num"> · {c.orb.toFixed(2)}° apart</span>}
                    {c.close && <> <Chip tone="good">Close</Chip></>}
                    {c.war && <> <Chip tone="bad">Planetary war</Chip></>}
                  </li>
                ))}
              </ul>
            )}
          {s.acrossBoundary.length > 0 && (
            <p class="hint-text">Within {orb}° across a sign boundary (not conjunct): {s.acrossBoundary.map((n) => `${n.a}–${n.b} ${n.orb.toFixed(2)}°`).join(', ')}.</p>
          )}
        </div>
      </section>

      <section class="panel" aria-labelledby="h-exp-across">
        <header class="panel-head"><h2 id="h-exp-across">Across the divisional charts</h2></header>
        <div class="panel-body"><DignityAcross chart={chart} /></div>
      </section>
    </>
  );
}

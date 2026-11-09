/** Shared pieces of the Page 1 (Experimental) sub-tabs. */
import type { JSX } from 'preact';
import type { PlanetId } from '../../../engine';
import { PLANET_NAMES } from '../../../engine/names';
import { VARGAS, type VargaId } from '../../../engine/varga/rules';
import type { PlanetState } from '../../../engine/exp/states';

export type Tone = 'good' | 'bad' | 'mixed' | 'info';

export function Pl({ id }: { id: PlanetId }): JSX.Element {
  return <span class={`pl pl-${id}`} title={PLANET_NAMES[id]}>{id}</span>;
}

/** A state chip: the word carries the meaning, the colour only repeats it. */
export function Chip({ tone, children, title }: { tone: Tone; children: string; title?: string }): JSX.Element {
  return <span class={`chip tone-${tone}`} title={title}>{children}</span>;
}

const GROUPS: { label: string; ids: VargaId[] }[] = [
  { label: '16 Parashari charts', ids: VARGAS.filter((v) => v.position >= 1 && v.position <= 16).map((v) => v.id) },
  { label: 'Tajika and D150', ids: VARGAS.filter((v) => v.position >= 17 && v.position <= 21).map((v) => v.id) },
  { label: 'PL alternates', ids: VARGAS.filter((v) => v.position >= 22).map((v) => v.id) },
];
export const PARASHARI: VargaId[] = GROUPS[0]!.ids;
const NAME = new Map(VARGAS.map((v) => [v.id, v.name]));
export const vargaLabel = (id: VargaId): string => `${id} ${NAME.get(id) ?? ''}`.trim();

export function VargaSelect({ id, value, onChange, label = 'Chart' }: { id: string; value: VargaId; onChange: (v: VargaId) => void; label?: string }): JSX.Element {
  return (
    <div class="field exp-field">
      <label for={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange((e.currentTarget as HTMLSelectElement).value as VargaId)}>
        {GROUPS.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.ids.map((v) => <option key={v} value={v}>{vargaLabel(v)}</option>)}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

export const ordinal = (n: number): string => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;

/* Planet-state chips (Highlights table, chart marks, hover card). */
export const DIGNITY: Record<NonNullable<PlanetState['dignity']>, { word: string; abbr: string; tone: Tone; tip: string }> = {
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


/** Shared pieces of the Page 1 (Experimental) sub-tabs. */
import type { JSX } from 'preact';
import type { PlanetId } from '../../../engine';
import { PLANET_NAMES } from '../../../engine/names';
import { VARGAS, type VargaId } from '../../../engine/varga/rules';

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

/**
 * Place field with suggestions (ARIA 1.2 combobox): the user's saved places and the built-in
 * places first, then the world atlas. ↑/↓ move, Enter picks, Escape closes. Picking a place
 * hands back a Place; typing freely is still allowed (latitude, longitude and zone by hand).
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { Place } from '../../io/places';
import { allPlaces } from '../../io/places';
import { atlasLabel, atlasSize, atlasToPlace, fold, searchAtlas } from '../../io/atlas';
import { t } from '../i18n';

interface Option { key: string; place: Place; main: string; sub: string }

const coords = (lat: number, lon: number) =>
  `${Math.abs(lat).toFixed(2)}${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(2)}${lon >= 0 ? 'E' : 'W'}`;

function options(query: string): Option[] {
  const q = fold(query.split(',')[0] ?? '');
  if (q.length < 2) return [];
  const mine = allPlaces()
    .map((p) => ({ p, k: fold(p.name) }))
    .filter(({ k }) => k.startsWith(q) || k.includes(` ${q}`))
    .slice(0, 4)
    .map(({ p }): Option => ({ key: `my:${p.name}`, place: p, main: p.name, sub: `${t('place.mine')} · ${coords(p.lat, p.lon)}` }));
  const seen = new Set(mine.map((o) => o.place.name.toLowerCase()));
  const world = searchAtlas(query, 8)
    .filter((h) => !seen.has(atlasLabel(h.place).toLowerCase()))
    .map((h): Option => ({
      key: `at:${atlasLabel(h.place)}:${h.place.lat}:${h.place.lon}`,
      place: atlasToPlace(h.place),
      main: h.via ? `${h.place.name} (${h.via})` : h.place.name,
      sub: [h.place.region, h.place.country, coords(h.place.lat, h.place.lon)].filter(Boolean).join(' · '),
    }));
  return [...mine, ...world].slice(0, 10);
}

export interface PlaceSearchProps {
  id: string;
  value: string;
  onText: (text: string) => void;
  onPick: (p: Place) => void;
  placeholder?: string;
}

export function PlaceSearch({ id, value, onText, onPick, placeholder }: PlaceSearchProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const opts = useMemo(() => (open ? options(value) : []), [open, value]);
  const listId = `${id}-list`;
  const expanded = open && opts.length > 0;

  const pick = (o: Option) => { onPick(o.place); setOpen(false); setActive(-1); };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); setActive((a) => Math.min(a + 1, opts.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && expanded && active >= 0 && opts[active]) { e.preventDefault(); pick(opts[active]!); }
    else if (e.key === 'Escape' && expanded) { e.preventDefault(); setOpen(false); setActive(-1); }
  };

  return (
    <div class="place-search">
      <input id={id} value={value} placeholder={placeholder} autocomplete="off" spellcheck={false}
        role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls={listId}
        aria-activedescendant={expanded && active >= 0 ? `${listId}-${active}` : undefined}
        onInput={(e) => { onText(e.currentTarget.value); setOpen(true); setActive(-1); }}
        onFocus={() => { setOpen(true); setTimeout(atlasSize, 0); /* unpack the atlas before the first letter */ }} onBlur={() => { setOpen(false); setActive(-1); }} onKeyDown={onKeyDown} />
      <ul id={listId} role="listbox" class="place-list" aria-label={t('place.suggestions')} hidden={!expanded}>
        {opts.map((o, i) => (
          <li key={o.key} id={`${listId}-${i}`} role="option" aria-selected={i === active} class={i === active ? 'active' : undefined}
            onMouseDown={(e) => { e.preventDefault(); pick(o); }} onMouseEnter={() => setActive(i)}>
            <span class="place-main">{o.main}</span>
            <span class="place-sub">{o.sub}</span>
          </li>
        ))}
      </ul>
      <span class="sr-only" role="status" aria-live="polite">{open && value.trim().length >= 2 ? t('place.count', { n: opts.length }) : ''}</span>
    </div>
  );
}

/**
 * Three signal stores (ARCHITECTURE.md §7): engine/chart, settings, places.
 * The chart never auto-persists; only the last place and the theme are
 * remembered (localStorage, try/catch, versioned keys).
 */
import { computed, signal } from '@preact/signals';
import { cast, DEFAULT_PROFILE, type ChartInput, type ChartResult } from '../../engine';
import type { SwissEph } from '../../engine/ephem/swisseph';
import { BUILTIN_PLACES, type Place, zoneFor } from '../../io/places';
import type { BootResult } from '../../boot/wasmLoader';

export type EngineState =
  | { status: 'booting' }
  | { status: 'ready'; swe: SwissEph; info: Omit<BootResult, 'swe'> & { version: string } }
  | { status: 'failed'; error: string };

export const engine = signal<EngineState>({ status: 'booting' });
export const chartInput = signal<ChartInput | null>(null);

export const chart = computed<{ ok: ChartResult } | { error: string } | null>(() => {
  const e = engine.value, inp = chartInput.value;
  if (e.status !== 'ready' || !inp) return null;
  try { return { ok: cast(e.swe, inp) }; }
  catch (err) { return { error: err instanceof Error ? err.message : String(err) }; }
});

const LAST_PLACE = 'kaast2.lastPlace.v1';
const THEME = 'kaast2.theme.v1';

export function lastPlace(): Place {
  try {
    const raw = localStorage.getItem(LAST_PLACE);
    if (raw) { const p = JSON.parse(raw) as Place; if (p && typeof p.name === 'string') return p; }
  } catch { /* storage unavailable */ }
  return BUILTIN_PLACES[0]!;
}
export function rememberPlace(p: Place): void {
  try { localStorage.setItem(LAST_PLACE, JSON.stringify(p)); } catch { /* non-fatal */ }
}

export type Theme = 'auto' | 'light' | 'dark';
export const theme = signal<Theme>(((): Theme => {
  try { const t = localStorage.getItem(THEME); return t === 'light' || t === 'dark' ? t : 'auto'; } catch { return 'auto'; }
})());
export function setTheme(t: Theme): void {
  theme.value = t;
  try { localStorage.setItem(THEME, t); } catch { /* non-fatal */ }
}

/** A chart for this moment at the given place (horary default). */
export function nowInput(place: Place, now = new Date()): ChartInput {
  const probe = new Date(now.getTime() + place.tz * 3600_000);
  const z = zoneFor(place, probe.getUTCFullYear(), probe.getUTCMonth() + 1, probe.getUTCDate());
  const local = new Date(now.getTime() + z.tz * 3600_000);
  return {
    name: '',
    date: { y: local.getUTCFullYear(), m: local.getUTCMonth() + 1, d: local.getUTCDate() },
    time: { h: local.getUTCHours(), mi: local.getUTCMinutes(), s: local.getUTCSeconds() },
    tzHours: z.tz, dstHours: 0,
    place: { name: place.name, latDeg: place.lat, lonDeg: place.lon },
    profileId: DEFAULT_PROFILE,
  };
}

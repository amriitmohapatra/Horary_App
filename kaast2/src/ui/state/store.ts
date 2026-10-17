/**
 * Three signal stores (ARCHITECTURE.md §7): engine/chart, settings, places.
 * The chart never auto-persists; only the last place and the theme are
 * remembered (localStorage, try/catch, versioned keys).
 */
import { computed, signal } from '@preact/signals';
import { cast, DEFAULT_PROFILE, type ChartInput, type ChartResult, type ProfileOverrides } from '../../engine';
import type { SwissEph } from '../../engine/ephem/swisseph';
import { BUILTIN_PLACES, type Place, zoneFor } from '../../io/places';
import type { BootResult } from '../../boot/wasmLoader';
import { strengths, type Page1Strengths } from '../../engine/strength';

export type EngineState =
  | { status: 'booting' }
  | { status: 'ready'; swe: SwissEph; info: Omit<BootResult, 'swe'> & { version: string } }
  | { status: 'failed'; error: string };

export const engine = signal<EngineState>({ status: 'booting' });
export const chartInput = signal<ChartInput | null>(null);

/* ---- settings: profile overrides (PL's Options → Calculation) ---- */
const SETTINGS = 'kaast2.settings.v1';
export const overrides = signal<ProfileOverrides>(((): ProfileOverrides => {
  try { const raw = localStorage.getItem(SETTINGS); return raw ? (JSON.parse(raw) as ProfileOverrides) : {}; }
  catch { return {}; }
})());
export function setOverride<K extends keyof ProfileOverrides>(k: K, v: ProfileOverrides[K] | undefined): void {
  const next = { ...overrides.value, [k]: v };
  if (v === undefined) delete next[k];
  overrides.value = next;
  try { localStorage.setItem(SETTINGS, JSON.stringify(next)); } catch { /* non-fatal */ }
}

export const chart = computed<{ ok: ChartResult } | { error: string } | null>(() => {
  const e = engine.value, inp = chartInput.value;
  if (e.status !== 'ready' || !inp) return null;
  try { return { ok: cast(e.swe, { ...inp, overrides: overrides.value }) }; }
  catch (err) { return { error: err instanceof Error ? err.message : String(err) }; }
});

/** Page 1 strength fields and their breakdowns (slice 2b). */
export const strength = computed<Page1Strengths | null>(() => {
  const e = engine.value, c = chart.value;
  if (e.status !== 'ready' || !c || !('ok' in c)) return null;
  try { return strengths(e.swe, c.ok); } catch { return null; }
});

/* ---- navigation: #page1, #dashas, … (hash routing works from file://) ---- */
export const ROUTES = ['page1', 'strengths', 'vargas', 'dashas', 'yogi', 'jaimini', 'transits', 'settings'] as const;
export type Route = (typeof ROUTES)[number];
const routeFromHash = (): Route => {
  const h = location.hash.replace('#', '') as Route;
  return (ROUTES as readonly string[]).includes(h) ? h : 'page1';
};
export const route = signal<Route>(routeFromHash());
addEventListener('hashchange', () => { route.value = routeFromHash(); });
export function go(r: Route): void { if (location.hash !== `#${r}`) location.hash = r; route.value = r; }

/** Extra charts (events) held by the last opened PL file; kept here so they survive the form closing. */
export const openedEvents = signal<{ name: string; input: ChartInput }[]>([]);

/** The chart form folds away once a chart is cast; "Edit chart" opens it. */
export const formOpen = signal(true);

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

export type Theme = 'auto' | 'light' | 'dark' | 'warm';
export const theme = signal<Theme>(((): Theme => {
  try { const t = localStorage.getItem(THEME); return t === 'light' || t === 'dark' || t === 'warm' ? t : 'auto'; } catch { return 'auto'; }
})());
export function setTheme(t: Theme): void {
  theme.value = t;
  try { localStorage.setItem(THEME, t); } catch { /* non-fatal */ }
}
/** The theme actually showing (resolves 'auto' against the device). */
export function shownTheme(): Exclude<Theme, 'auto'> {
  if (theme.value !== 'auto') return theme.value;
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const TEXT = 'kaast2.textSize.v1';
export type TextSize = 'normal' | 'large' | 'larger';
export const textSize = signal<TextSize>(((): TextSize => {
  try { const t = localStorage.getItem(TEXT); return t === 'large' || t === 'larger' ? t : 'normal'; } catch { return 'normal'; }
})());
export function setTextSize(t: TextSize): void {
  textSize.value = t;
  try { localStorage.setItem(TEXT, t); } catch { /* non-fatal */ }
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

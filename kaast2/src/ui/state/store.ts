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
import type { AyanamsaId } from '../../engine/ephem/ayanamsa';

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

/* ---- KP page: PL's Krishnamurti printouts use the Krishnamurti ayanamsa
 * "regardless of the default set" (PL 7 manual pp. 218–219). 'auto' does that
 * for the PL profiles and keeps the chart's own ayanamsa for Solar Fire /
 * Kala Chakra (the family's KP practice on Lahiri). ---- */
export type KpAyanamsa = 'auto' | 'chart' | 'pl_krishnamurti' | 'pl_krishnamurti_new';
const KP_AYAN = 'kaast2.kpAyanamsa.v1';
export const kpAyanamsa = signal<KpAyanamsa>(((): KpAyanamsa => {
  try {
    const v = localStorage.getItem(KP_AYAN);
    return v === 'chart' || v === 'pl_krishnamurti' || v === 'pl_krishnamurti_new' ? v : 'auto';
  } catch { return 'auto'; }
})());
export function setKpAyanamsa(v: KpAyanamsa): void {
  kpAyanamsa.value = v;
  try { localStorage.setItem(KP_AYAN, v); } catch { /* non-fatal */ }
}
/** The ayanamsa the KP page uses for a chart cast with `chartAyanamsa` in profile `profileId`. */
export function kpAyanamsaFor(choice: KpAyanamsa, profileId: ChartInput['profileId'], chartAyanamsa: AyanamsaId): AyanamsaId {
  if (choice === 'chart') return chartAyanamsa;
  if (choice === 'auto') return profileId === 'solarfire' ? chartAyanamsa : 'pl_krishnamurti';
  return choice;
}
export const kpChart = computed<{ ok: ChartResult } | { error: string } | null>(() => {
  const e = engine.value, inp = chartInput.value, c = chart.value;
  if (e.status !== 'ready' || !inp || !c || !('ok' in c)) return null;
  const ayanamsa = kpAyanamsaFor(kpAyanamsa.value, inp.profileId, c.ok.profile.ayanamsa);
  if (ayanamsa === c.ok.profile.ayanamsa) return c;
  try { return { ok: cast(e.swe, { ...inp, overrides: { ...overrides.value, ayanamsa } }) }; }
  catch (err) { return { error: err instanceof Error ? err.message : String(err) }; }
});

/* ---- NTP page: Iyer uses the mean node ("Take always Mean Rahu", NTP-1 p. 101). ---- */
export type NtpNode = 'mean' | 'chart';
const NTP_NODE = 'kaast2.ntpNode.v1';
export const ntpNode = signal<NtpNode>(((): NtpNode => {
  try { return localStorage.getItem(NTP_NODE) === 'chart' ? 'chart' : 'mean'; } catch { return 'mean'; }
})());
export function setNtpNode(v: NtpNode): void {
  ntpNode.value = v;
  try { localStorage.setItem(NTP_NODE, v); } catch { /* non-fatal */ }
}
export const ntpChart = computed<{ ok: ChartResult } | { error: string } | null>(() => {
  const e = engine.value, inp = chartInput.value, c = chart.value;
  if (e.status !== 'ready' || !inp || !c || !('ok' in c)) return null;
  if (ntpNode.value === 'chart' || c.ok.profile.node === 'mean') return c;
  try { return { ok: cast(e.swe, { ...inp, overrides: { ...overrides.value, node: 'mean' } }) }; }
  catch (err) { return { error: err instanceof Error ? err.message : String(err) }; }
});

/* ---- Matching: a second chart (the prospective match) and, optionally, a first
 * chart other than the main one. Never persisted (personal data). ---- */
export type MatchRole = 'boy' | 'girl';
export const partnerInput = signal<ChartInput | null>(null);
export const matchFirstInput = signal<ChartInput | null>(null);
/** Who the first chart is; the partner is the other. Kootas count from the girl's star to the boy's. */
export const firstRole = signal<MatchRole>('boy');
const castOrError = (inp: ChartInput | null, extra: ProfileOverrides = {}): { ok: ChartResult } | { error: string } | null => {
  const e = engine.value;
  if (e.status !== 'ready' || !inp) return null;
  try { return { ok: cast(e.swe, { ...inp, overrides: { ...overrides.value, ...extra } }) }; }
  catch (err) { return { error: err instanceof Error ? err.message : String(err) }; }
};
export const firstChart = computed(() => (matchFirstInput.value ? castOrError(matchFirstInput.value) : chart.value));
export const partnerChart = computed(() => castOrError(partnerInput.value));
/** The partner for Iyer's rules: mean node, as the NTP page. */
export const ntpPartnerChart = computed(() => castOrError(partnerInput.value, ntpNode.value === 'mean' ? { node: 'mean' } : {}));

/* ---- navigation: #page1, #dashas, … (hash routing works from file://) ---- */
export const ROUTES = ['page1', 'exp', 'strengths', 'vargas', 'dashas', 'kp', 'ntp', 'yogi', 'jaimini', 'transits', 'match', 'settings'] as const;
export type Route = (typeof ROUTES)[number];
const routeFromHash = (): Route => {
  const h = location.hash.replace('#', '') as Route;
  return (ROUTES as readonly string[]).includes(h) ? h : 'page1';
};
export const route = signal<Route>(routeFromHash());
addEventListener('hashchange', () => { route.value = routeFromHash(); });
export function go(r: Route): void { if (location.hash !== `#${r}`) location.hash = r; route.value = r; }

/** The native's sex, for yogas that depend on it and for Nandi Nadi karakas; per session, never stored. */
export const nativeSex = signal<'unspecified' | 'male' | 'female'>('unspecified');

/* ---- Page 1 (Experimental): the open sub-tab and the conjunction orb survive tab switches. ---- */
export type ExpTab = 'states' | 'lords' | 'aspects' | 'worksheet' | 'nadi';
export const expTab = signal<ExpTab>('states');
const EXP_ORB = 'kaast2.conjunctionOrb.v1';
export const conjunctionOrb = signal<number>(((): number => {
  try { const v = Number(localStorage.getItem(EXP_ORB)); return v > 0 && v <= 15 ? v : 3; } catch { return 3; }
})());
export function setConjunctionOrb(v: number): void {
  conjunctionOrb.value = v;
  try { localStorage.setItem(EXP_ORB, String(v)); } catch { /* non-fatal */ }
}

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

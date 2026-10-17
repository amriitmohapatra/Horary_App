/**
 * Transit events: sign ingresses, nakshatra and pada changes, stations and
 * planetary returns, for any profile (ARCHITECTURE.md §3, PLAN.md §3.8).
 *
 * Definitions (STD unless noted):
 *  - An ingress/change is the instant the profile's integer-arcsecond
 *    longitude (Position.lon, rounded or truncated per profile, invariant 1)
 *    enters a new sign (108 000″), nakshatra (48 000″) or pada (12 000″).
 *    For rounding profiles that is 0.5″ before the exact boundary (≈ 1 s
 *    for the Moon, ≈ 1 min for the Sun).
 *  - A station is a sign change of Position.speedDeg — the speed that drives
 *    the chart's "R" flag. In PL profiles that speed is tropical (mean
 *    equinox of date); the sidereal turning point differs by
 *    3.8e-5 °/d ÷ acceleration (NUM, 2025: Mercury ≤ 0.7 min, Venus 1.4,
 *    Mars 4.4, Jupiter 16, Saturn 31–33 min). Swiss's speed carries ~1e-8
 *    °/d of noise, so at a Saturn station the flag itself flickers for
 *    about ±0.9 s; the reported instant lies inside that band.
 *  - The true node also wobbles: ~54 stations a year, most of them pauses
 *    of a few hours moving < 1″ (see body.ts for its lunar-file joints).
 *  - Ketu mirrors Rahu: computed from Rahu's scan, longitude + 180° (its
 *    integer arcsecond is Rahu's + 648 000″, as in bodiesIn()). 180° is 6
 *    signs and 54 padas but 13½ nakshatras, so Ketu's nakshatra changes fall
 *    at Rahu's pada 2→3 boundaries, not at Rahu's nakshatra changes.
 *  - Events are reported for fromJd < t ≤ toJd, sorted by time, so that the
 *    state at fromJd followed by the events gives the state at any instant.
 *  - A return is the instant the exact (float) sidereal longitude equals the
 *    natal longitude, every pass including retrograde ones.
 * Supported range: 1800-01-02 … 2400-01-01 UT (the sepl_18/semo_18 files;
 * Swiss switches to Moshier just before 1800-01-01 0h with sub-arcsecond
 * jumps, and PL7's ΔT table starts at 1800.0).
 */
import type { SwissEph } from '../ephem/swisseph';
import { bodiesIn, siderealFrame } from '../index';
import { PROFILES, type Profile, type ProfileId } from '../profiles';
import { PLANETS, type Arcsec, type PlanetId, type Position } from '../types';
import { NAKSHATRA, PADA, SIGN, ZODIAC, norm, nakshatraIndex, signIndex, toArcsec } from '../zodiac';
import { evaluator, motionOf } from './body';
import { BodyScan } from './search';

export type EventKind = 'sign' | 'nakshatra' | 'pada' | 'station';
export type Direction = 'direct' | 'retrograde';

export interface TransitEvent {
  jdUT: number;
  body: PlanetId;
  kind: EventKind;
  /**
   * Cell left and entered: sign 0…11, nakshatra 0…26, pada 0…107 (global:
   * nakshatra·4 + pada−1). For a station, both are the sign it stations in.
   */
  from: number;
  to: number;
  /** Motion through the boundary; for a station, the motion that begins. */
  direction: Direction;
  /** Profile integer longitude at the event (the boundary for changes). */
  lon: Arcsec;
}

export interface FindEventsOptions {
  bodies: readonly PlanetId[];
  kinds: readonly EventKind[];
  fromJd: number;
  toJd: number;
}

/** 1800-01-02 0h UT and 2400-01-01 0h UT. */
export const TRANSIT_JD_MIN = 2378497.5;
export const TRANSIT_JD_MAX = 2597641.5;

const KIND_ORDER: Record<EventKind, number> = { sign: 0, nakshatra: 1, pada: 2, station: 3 };
const CELL: Record<Exclude<EventKind, 'station'>, { W: number; n: number }> = {
  sign: { W: SIGN, n: 12 }, nakshatra: { W: NAKSHATRA, n: 27 }, pada: { W: PADA, n: 108 },
};

const resolve = (p: Profile | ProfileId): Profile => {
  const r = typeof p === 'string' ? PROFILES[p] : p;
  if (!r) throw new Error(`unknown profile ${String(p)}`);
  return r;
};

function checkRange(fromJd: number, toJd: number): void {
  if (!(toJd > fromJd)) throw new RangeError('toJd must be after fromJd');
  if (fromJd < TRANSIT_JD_MIN || toJd > TRANSIT_JD_MAX) {
    throw new RangeError('transit search supports 1800-01-02 … 2400-01-01 UT (ephemeris files)');
  }
}

/** Offset of the cell grid: the integer arcsecond reaches N when the float reaches N − 0.5 (rounding). */
const gridOff = (p: Profile) => (p.rounding === 'round' ? -0.5 : 0);

/** Transit chart: the nine grahas at an instant, same recipe as cast(). */
export function transitPositions(swe: SwissEph, profile: Profile | ProfileId, jdUT: number): Record<PlanetId, Position> {
  return bodiesIn(swe, siderealFrame(swe, resolve(profile), jdUT));
}

/** Cell index of an integer longitude for a kind (station → sign). */
export function cellOf(kind: EventKind, lon: Arcsec): number {
  if (kind === 'nakshatra') return nakshatraIndex(lon);
  if (kind === 'pada') return Math.floor(norm(lon) / PADA);
  return signIndex(lon);
}

/** All requested events, sorted by time (ties: body order, then kind). */
export function findEvents(swe: SwissEph, profile: Profile | ProfileId, opts: FindEventsOptions): TransitEvent[] {
  const p = resolve(profile);
  const { fromJd, toJd } = opts;
  checkRange(fromJd, toJd);
  const cellKinds = (['sign', 'nakshatra', 'pada'] as const).filter((k) => opts.kinds.includes(k));
  // The coarsest grid containing every requested boundary (all are pada boundaries).
  const W = cellKinds.length === 1 ? CELL[cellKinds[0]!].W : PADA;
  const off = gridOff(p);
  const out: TransitEvent[] = [];
  const wanted = new Set(opts.bodies);
  // Ketu is scanned through Rahu (one scan serves both): its integer
  // longitude is Rahu's + 648 000″, so its boundaries are Rahu's shifted by
  // that much — on a grid that divides 648 000″ (gcd; 24 000″ for nakshatras).
  const sources = new Set([...wanted].map((b) => (b === 'Ke' ? 'Ra' : b)));
  for (const src of sources) {
    const targets = src === 'Ra' ? (['Ra', 'Ke'] as const).filter((b) => wanted.has(b)) : [src];
    const node = src === 'Ra';
    const w0 = node ? gcd(W, HALF) : W;
    const scan = new BodyScan(evaluator(swe, p, src), motionOf(p, src), fromJd, toJd);
    if (cellKinds.length) {
      for (const c of scan.crossings({ W: w0, off })) {
        if (!(c.t > fromJd && c.t <= toJd)) continue;
        for (const body of targets) {
          const B = c.k * w0 + (body === 'Ke' ? HALF : 0); // boundary, unwrapped integer arcseconds
          for (const kind of cellKinds) {
            const { W: w, n } = CELL[kind];
            if (B % w !== 0) continue;
            const j = B / w;
            const to = c.dir > 0 ? j : j - 1, from = c.dir > 0 ? j - 1 : j;
            out.push({ jdUT: c.t, body, kind, from: mod(from, n), to: mod(to, n),
              direction: c.dir > 0 ? 'direct' : 'retrograde', lon: norm(c.dir > 0 ? B : B - 1) });
          }
        }
      }
    }
    if (opts.kinds.includes('station')) {
      for (const s of scan.stations()) {
        if (!(s.t > fromJd && s.t <= toJd)) continue;
        for (const body of targets) {
          const lon = norm(toArcsec(s.raw / 3600, p.rounding) + (body === 'Ke' ? HALF : 0));
          const sg = signIndex(lon);
          out.push({ jdUT: s.t, body, kind: 'station', from: sg, to: sg, direction: s.dir > 0 ? 'direct' : 'retrograde', lon });
        }
      }
    }
  }
  return sortEvents(out);
}

export interface ReturnEvent { jdUT: number; body: PlanetId; direction: Direction }

/** Every instant in (fromJd, toJd] where the body's exact sidereal longitude equals natalLonDeg. */
export function returns(swe: SwissEph, profile: Profile | ProfileId, body: PlanetId,
  natalLonDeg: number, fromJd: number, toJd: number): ReturnEvent[] {
  const p = resolve(profile);
  checkRange(fromJd, toJd);
  const scan = new BodyScan(evaluator(swe, p, body), motionOf(p, body), fromJd, toJd);
  const off = ((((natalLonDeg % 360) + 360) % 360) * 3600);
  return scan.crossings({ W: ZODIAC, off })
    .filter((c) => c.t > fromJd && c.t <= toJd)
    .sort((a, b) => a.t - b.t)
    .map((c) => ({ jdUT: c.t, body, direction: c.dir > 0 ? 'direct' : 'retrograde' }));
}

const mod = (a: number, n: number) => ((a % n) + n) % n;
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const HALF = ZODIAC / 2;

function sortEvents(ev: TransitEvent[]): TransitEvent[] {
  return ev.sort((a, b) => a.jdUT - b.jdUT || PLANETS.indexOf(a.body) - PLANETS.indexOf(b.body) || KIND_ORDER[a.kind] - KIND_ORDER[b.kind]);
}

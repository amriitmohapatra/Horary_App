/**
 * Shared tables and helpers of the Page 1 strength engine.
 * Spec: docs/spec/PAGE1_SPEC.md (section numbers quoted as §x.y);
 * oracle: oracle/page1_strengths.py (functions named in each comment).
 *
 * Grades (spec §0): BIN = read from PL7.exe, DOC = PL manual, NUM = fits the
 * PL9 Page 1 fixture, STD = textbook rule, OPEN = not settled.
 *
 * Tables here (all stated as rules in the spec, §3.1):
 *  - natural relationship 9×9, BIN table 0x613628 (Su–Sa BPHS, node rows PL's)
 *  - MT sign 0x5f1c58 + MT degree range 0x621aea (open intervals)
 *  - own signs 0x5f1cbc / 0x5f1ce0 (Rahu Ge+Aq, Ketu Sg+Sc)
 *  - debilitation sign 0x5f1c7c; exaltation = debilitation + 6
 *  - deep debilitation degrees 0x5f1ca4
 * Longitudes are exact sidereal degrees (the float behind the displayed
 * arcsecond), as the oracle and PL's own double arithmetic use them.
 */
import { PLANETS, type PlanetId } from '../types';
import { SIGN_LORD } from '../zodiac';

export const GRAHAS7 = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa'] as const;
export type Graha7 = (typeof GRAHAS7)[number];
export type StrengthPoint = PlanetId | 'As';

export { SIGN_LORD };

/** PL planet id 1…9 (Su 1 … Ke 9). */
export const pid = (p: PlanetId): number => PLANETS.indexOf(p) + 1;

export const normDeg = (x: number): number => ((x % 360) + 360) % 360;
/** Sign 0 = Aries … 11 = Pisces of an exact longitude. */
export const sgn = (x: number): number => Math.floor(normDeg(x) / 30);
/** Shortest arc 0…180 (BIN 0x5b1f1e). */
export function dist(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}
/** (b − a) mod 360 (BIN 0x45b0be). */
export const fwd = (a: number, b: number): number => ((b - a) % 360 + 360) % 360;
/** Wrap to [−180, 180). */
export const wrap180 = (x: number): number => (((x + 180) % 360) + 360) % 360 - 180;

/** Natural relationship, row = planet's view of column (Su…Ke): 2 friend, 1 neutral, 0 enemy (BIN 0x613628). */
const NAT: Readonly<Record<PlanetId, readonly number[]>> = {
  Su: [1, 2, 2, 1, 2, 0, 0, 0, 0], Mo: [2, 1, 1, 2, 1, 1, 1, 0, 0],
  Ma: [2, 2, 1, 0, 2, 1, 1, 0, 2], Me: [2, 0, 1, 1, 1, 2, 1, 1, 1],
  Ju: [2, 2, 2, 0, 1, 0, 1, 1, 1], Ve: [0, 0, 1, 2, 1, 1, 2, 2, 2],
  Sa: [0, 0, 0, 2, 1, 2, 1, 2, 0], Ra: [0, 0, 0, 1, 2, 2, 2, 1, 0],
  Ke: [0, 0, 2, 1, 1, 2, 0, 0, 1],
};

/** Deep debilitation degree (BIN 0x5f1ca4). */
export const DEBIL_DEG: Readonly<Record<Graha7, number>> = { Su: 190, Mo: 213, Ma: 118, Me: 345, Ju: 275, Ve: 177, Sa: 20 };
/** MT sign (0-based) and open degree interval (BIN 0x5f1c58, 0x621aea). */
export const MT: Readonly<Record<PlanetId, readonly [number, number, number]>> = {
  Su: [4, 0, 20], Mo: [1, 3, 30], Ma: [0, 0, 12], Me: [5, 15, 20], Ju: [8, 0, 10],
  Ve: [6, 0, 15], Sa: [10, 0, 20], Ra: [2, 0, 30], Ke: [8, 0, 30],
};
/** Own signs, 0-based (BIN 0x5f1cbc / 0x5f1ce0). */
export const OWN: Readonly<Record<PlanetId, readonly number[]>> = {
  Su: [4], Mo: [3], Ma: [0, 7], Me: [5, 2], Ju: [8, 11], Ve: [6, 1], Sa: [10, 9], Ra: [2, 10], Ke: [8, 7],
};
/** Debilitation sign, 0-based (BIN 0x5f1c7c). */
export const DEBIL_SIGN: Readonly<Record<PlanetId, number>> = { Su: 6, Mo: 7, Ma: 3, Me: 11, Ju: 9, Ve: 5, Sa: 0, Ra: 7, Ke: 1 };
export const EXALT_SIGN: Readonly<Record<PlanetId, number>> = Object.fromEntries(
  PLANETS.map((p) => [p, (DEBIL_SIGN[p] + 6) % 12]),
) as Record<PlanetId, number>;

/** Natural relation −1 enemy, 0 neutral, +1 friend. */
export const nat = (a: PlanetId, b: PlanetId): number => NAT[a][PLANETS.indexOf(b)]! - 1;
/** Temporal relation from rasi signs: +1 if b sits 2,3,4,10,11,12 from a, else −1. */
export function temp(signA: number, signB: number): number {
  const d = (((signB - signA) % 12) + 12) % 12 + 1;
  return d === 2 || d === 3 || d === 4 || d === 10 || d === 11 || d === 12 ? 1 : -1;
}

export type Relation = 'GF' | 'F' | 'N' | 'E' | 'GE';
const REL: Readonly<Record<number, Relation>> = { 2: 'GF', 1: 'F', 0: 'N', [-1]: 'E', [-2]: 'GE' };

/** Inputs every strength rule reads: exact sidereal longitudes, speeds, rasi signs. */
export interface StrengthContext {
  lon: Record<StrengthPoint, number>;
  speed: Record<PlanetId, number>;
  sign: Record<StrengthPoint, number>;
  asc: number;
  mc: number;
}

/** Compound (panchadha) relation of p towards `lord`, temporal part from rasi. */
export function compoundValue(c: StrengthContext, p: PlanetId, lord: PlanetId): number {
  return nat(p, lord) + temp(c.sign[p], c.sign[lord]);
}
export const compound = (c: StrengthContext, p: PlanetId, lord: PlanetId): Relation => REL[compoundValue(c, p, lord)]!;

/** Inside the MT sign and the open MT degree interval. */
export function inMt(p: PlanetId, l: number): boolean {
  const [s, a, b] = MT[p];
  const d = l % 30;
  return sgn(l) === s && a < d && d < b;
}

/** Mercury counts as malefic when it shares its sign with Su, Ma, Sa, Ra or Ke (option ids 3042/3044 default). */
export function mercuryWithMalefic(c: StrengthContext): boolean {
  return (['Su', 'Ma', 'Sa', 'Ra', 'Ke'] as const).some((q) => c.sign[q] === c.sign.Me);
}

/** Python round() (half to even), as the oracle displays VB. */
export function roundHalfEven(x: number): number {
  const f = Math.floor(x);
  const d = x - f;
  if (d > 0.5) return f + 1;
  if (d < 0.5) return f;
  return f % 2 === 0 ? f : f + 1;
}

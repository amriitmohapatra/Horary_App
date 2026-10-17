/**
 * Bhava chalit: the Sripati and equal bhava charts (PLAN.md §3.6). Pure.
 *
 * Rules, grades and sources:
 *  - Sripati (DOC): Asc = madhya 1, MC = madhya 10, their opposites madhyas 7
 *    and 4; each of the four quadrants between consecutive cardinal madhyas
 *    is trisected for madhyas 2/3, 5/6, 8/9, 11/12; sandhis lie halfway
 *    between adjacent madhyas. Sources: PL7 tutorial Extras1/pib11770 ("The
 *    spaces in between are further divided in 3 equal portions … The Bhava
 *    Sandhis are placed halfway between each pair of adjacent houses"); PL7
 *    manual p. 227 (dictionary, "Sripati Bhava Chart": MC→Asc divided by 3
 *    gives the 11th and 12th cusps, "the cusp is the center of the house").
 *  - Equal (DOC): madhya i = Asc + 30°(i−1), each house ±15° around it
 *    (pib11770 method 2: Pravarti 15° before, Poorti 15° after the madhya;
 *    manual p. 56: both bhava charts "treat the ascendant as the center of the
 *    first house").
 *  - Membership (invariant 1): half-open [sandhi i, sandhi i+1); a point
 *    exactly on a sandhi belongs to the house that begins there.
 *  - OPEN: whether PL builds the Sripati madhyas from the exact or the
 *    display-rounded Asc/MC, and whether PL's MC for Sripati is the Placidus
 *    10th cusp (it is the same point: the MC). Floats here, rounding only at
 *    the arcsecond boundary via `bhavaToArcsec`.
 */
import type { Arcsec, ChartResult, PlanetId, PointId } from '../types';
import { PLANETS } from '../types';
import { ZODIAC, norm, normDeg, toArcsec } from '../zodiac';

/** madhya[i] = centre of house i+1; sandhi[i] = start of house i+1 (end of house i). Degrees. */
export interface Bhava {
  madhya: number[];
  sandhi: number[];
}

/** The same in integer arcseconds (profile rounding). */
export interface BhavaArcsec {
  madhya: Arcsec[];
  sandhi: Arcsec[];
}

export type BhavaKind = 'sripati' | 'equal';

/** Forward arc from a to b, degrees in [0, 360). */
const arc = (a: number, b: number): number => normDeg(b - a);

/** Sandhis halfway (forward) between consecutive madhyas: sandhi[i] = mid(madhya[i−1], madhya[i]). */
function sandhisOf(madhya: number[]): number[] {
  return madhya.map((m, i) => {
    const prev = madhya[(i + 11) % 12]!;
    return normDeg(prev + arc(prev, m) / 2);
  });
}

/** Sripati bhava from the ascendant and MC (sidereal degrees). */
export function sripati(ascDeg: number, mcDeg: number): Bhava {
  const cardinal = [normDeg(ascDeg), normDeg(mcDeg + 180), normDeg(ascDeg + 180), normDeg(mcDeg)]; // madhyas 1, 4, 7, 10
  const madhya: number[] = new Array(12);
  for (let q = 0; q < 4; q++) {
    const from = cardinal[q]!, to = cardinal[(q + 1) % 4]!;
    const third = arc(from, to) / 3;
    madhya[3 * q] = from;
    madhya[3 * q + 1] = normDeg(from + third);
    madhya[3 * q + 2] = normDeg(from + 2 * third);
  }
  return { madhya, sandhi: sandhisOf(madhya) };
}

/** Equal bhava: madhya i = Asc + 30°(i−1), sandhi i = madhya i − 15°. */
export function equalBhava(ascDeg: number): Bhava {
  const madhya = Array.from({ length: 12 }, (_, i) => normDeg(ascDeg + 30 * i));
  return { madhya, sandhi: madhya.map((m) => normDeg(m - 15)) };
}

/** Integer-arcsecond copy of a bhava (madhyas and sandhis rounded independently). */
export function bhavaToArcsec(b: Bhava, rounding: 'round' | 'truncate'): BhavaArcsec {
  return { madhya: b.madhya.map((d) => toArcsec(d, rounding)), sandhi: b.sandhi.map((d) => toArcsec(d, rounding)) };
}

/** House 1…12 holding `lonDeg`, by sandhis, half-open [sandhi i, sandhi i+1). */
export function bhavaOf(lonDeg: number, b: Bhava): number {
  return houseBySandhi(normDeg(lonDeg), b.sandhi, 360, normDeg);
}

/** Integer variant of `bhavaOf` (invariant 1): longitude and sandhis in arcseconds. */
export function bhavaOfArcsec(lon: Arcsec, b: BhavaArcsec): number {
  return houseBySandhi(norm(lon), b.sandhi, ZODIAC, norm);
}

function houseBySandhi(lon: number, sandhi: readonly number[], circle: number, wrap: (x: number) => number): number {
  for (let i = 0; i < 12; i++) {
    const start = sandhi[i]!, end = sandhi[(i + 1) % 12]!;
    const span = wrap(end - start);
    if (wrap(lon - start) < span) return i + 1;
  }
  // Unreachable for 12 sandhis that tile the circle; guard against a degenerate input.
  throw new RangeError(`longitude ${lon} not in any bhava (circle ${circle})`);
}

export interface BhavaChart {
  kind: BhavaKind;
  /** Exact degrees. */
  bhava: Bhava;
  /** Profile-rounded arcseconds; `houses` are assigned on these (invariant 1). */
  arcsec: BhavaArcsec;
  /** House of each graha and the ascendant. */
  houses: Record<PointId, number>;
  /** Sign (0 = Aries) of each madhya — PL prints this sign number in the North Indian bhava chart (manual p. 56). */
  madhyaSign: number[];
}

/**
 * Bhava chart of a cast chart: Sripati or equal, planets re-housed.
 * MC: ChartResult carries it only as rounded arcseconds, so Sripati here uses
 * that value (≤0.5″ from the exact MC in PL profiles).
 */
export function bhavaChart(chart: ChartResult, kind: BhavaKind): BhavaChart {
  const ascDeg = chart.asc.lonDeg;
  const bhava = kind === 'sripati' ? sripati(ascDeg, chart.mc / 3600) : equalBhava(ascDeg);
  const arcsec = bhavaToArcsec(bhava, chart.profile.rounding);
  const houses = { As: bhavaOfArcsec(chart.asc.lon, arcsec) } as Record<PointId, number>;
  for (const id of PLANETS) houses[id as PlanetId] = bhavaOfArcsec(chart.bodies[id].lon, arcsec);
  return { kind, bhava, arcsec, houses, madhyaSign: arcsec.madhya.map((m) => Math.floor(m / 108_000)) };
}

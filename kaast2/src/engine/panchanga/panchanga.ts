/**
 * Panchanga line of Page 1 (PLAN.md §3.2): tithi, vara, nakshatra, yoga, karana.
 * The five limbs are pure functions of sidereal Sun and Moon (integer
 * arcseconds, half-open boundaries, invariant 1); only the vara needs the
 * ephemeris, for sunrise.
 *
 * Rules, grades and sources:
 *  - Definitions (DOC): PL7 manual p. 223 "Panchanga: Vaar, Nakshatra, Tithi,
 *    Yoga, and Karana"; p. 229 "Tithi: the lunar day"; p. 218 "Karana: Half a
 *    tithi"; p. 230 "Vaara: The day of the week, Sunday through Saturday";
 *    p. 102–103 "Yoga (a point based on the distance between the Sun and the Moon)".
 *  - Tithi (STD): 1 + ⌊(Moon − Sun) / 12°⌋, 1…30; 1–15 Shukla, 16–30 Krishna;
 *    15 = Purnima, 30 = Amavasya. Ayanamsa-free.
 *  - Nakshatra and pada of the Moon (STD; same helpers as Page 1, NUM there).
 *  - Yoga (STD): 1 + ⌊(Sun + Moon) / 13°20′⌋, 1…27, sidereal sum (depends on
 *    the ayanamsa, counted from sidereal 0° Aries).
 *  - Karana (STD): 1 + ⌊(Moon − Sun) / 6°⌋, 1…60. 1 = Kimstughna (fixed);
 *    2…57 = the seven movable karanas Bava…Vishti cycled eight times; 58 =
 *    Shakuni, 59 = Chatushpada, 60 = Naga (fixed).
 *  - Vara (STD): the Hindu day runs from sunrise to sunrise; a moment before
 *    that day's sunrise belongs to the previous weekday. The weekday is that
 *    of the local civil date (chart zone + DST) on which the governing
 *    sunrise falls.
 *  - Sunrise convention — OPEN. PL7 manual p. 192: "Some people use the edge
 *    of the Sun for this calculation, and others use the exact, astronomical
 *    longitude of the Sun"; PL's default and its refraction handling are
 *    undocumented. Named variants (Swiss swe_rise_trans flags):
 *      'upper-limb'  (default) upper limb, standard refraction — the almanac sunrise;
 *      'disc-centre' centre of the disc, standard refraction;
 *      'hindu'       centre of the disc, no refraction, ecliptic latitude
 *                    ignored (SE_BIT_HINDU_RISING; PyJHora's default).
 *  - Names: STD transliterations (no PL spellings decoded yet).
 */
import type { SwissEph } from '../ephem/swisseph';
import { SE } from '../ephem/swisseph';
import { NAKSHATRA_NAMES } from '../names';
import { weekday } from '../time/julian';
import type { Arcsec, ChartResult, PlanetId } from '../types';
import { NAKSHATRA, VIM_ORDER, nakshatraIndex, norm, pada } from '../zodiac';

const TITHI_ARC: Arcsec = 12 * 3600;
const KARANA_ARC: Arcsec = 6 * 3600;

export const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami',
  'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Amavasya',
] as const;

export const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula',
  'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
  'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti',
] as const;

export const MOVABLE_KARANAS = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti'] as const;
export const FIXED_KARANAS = ['Kimstughna', 'Shakuni', 'Chatushpada', 'Naga'] as const;

/** Index 0 = Sunday. */
export const VARA_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export const VARA_SANSKRIT = ['Ravivara', 'Somavara', 'Mangalavara', 'Budhavara', 'Guruvara', 'Shukravara', 'Shanivara'] as const;
export const VARA_LORDS: readonly PlanetId[] = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa'];

export interface Tithi {
  /** 1 … 30. */
  num: number;
  paksha: 'shukla' | 'krishna';
  /** 1 … 15 within the paksha. */
  inPaksha: number;
  name: string;
  /** Moon − Sun, arcseconds. */
  elongation: Arcsec;
  /** Part of the tithi already elapsed, 0 ≤ f < 1. */
  elapsed: number;
}

export interface Limb {
  /** 1-based traditional count. */
  num: number;
  name: string;
  elapsed: number;
}

export interface Karana extends Limb {
  fixed: boolean;
}

export interface MoonNakshatra extends Limb {
  pada: number;
  lord: PlanetId;
}

export interface Vara {
  /** 1 … 7, 1 = Sunday. */
  num: number;
  name: string;
  sanskrit: string;
  lord: PlanetId;
  /** JD (UT) of the sunrise that opened this Hindu day; null where the Sun does not rise (polar). */
  sunriseJdUT: number | null;
  /** True when the moment lies before the civil date's sunrise, so the vara is the previous weekday. */
  beforeSunrise: boolean;
  convention: SunriseConvention;
}

export const elongation = (sun: Arcsec, moon: Arcsec): Arcsec => norm(moon - sun);

export function tithi(sun: Arcsec, moon: Arcsec): Tithi {
  const e = elongation(sun, moon);
  const num = Math.floor(e / TITHI_ARC) + 1;
  const inPaksha = ((num - 1) % 15) + 1;
  const name = num === 30 ? 'Amavasya' : TITHI_NAMES[inPaksha - 1]!;
  return { num, paksha: num <= 15 ? 'shukla' : 'krishna', inPaksha, name, elongation: e, elapsed: (e % TITHI_ARC) / TITHI_ARC };
}

export function yoga(sun: Arcsec, moon: Arcsec): Limb {
  const s = norm(sun + moon);
  const i = Math.floor(s / NAKSHATRA);
  return { num: i + 1, name: YOGA_NAMES[i]!, elapsed: (s % NAKSHATRA) / NAKSHATRA };
}

/** Name of karana 1 … 60. */
export function karanaName(num: number): string {
  if (!Number.isInteger(num) || num < 1 || num > 60) throw new RangeError(`karana ${num}`);
  if (num === 1) return FIXED_KARANAS[0];
  if (num >= 58) return FIXED_KARANAS[num - 57]!;
  return MOVABLE_KARANAS[(num - 2) % 7]!;
}

export function karana(sun: Arcsec, moon: Arcsec): Karana {
  const e = elongation(sun, moon);
  const num = Math.floor(e / KARANA_ARC) + 1;
  return { num, name: karanaName(num), fixed: num === 1 || num >= 58, elapsed: (e % KARANA_ARC) / KARANA_ARC };
}

export function moonNakshatra(moon: Arcsec): MoonNakshatra {
  const i = nakshatraIndex(moon);
  return { num: i + 1, name: NAKSHATRA_NAMES[i]!, pada: pada(moon), lord: VIM_ORDER[i % 9]!, elapsed: (norm(moon) % NAKSHATRA) / NAKSHATRA };
}

export interface PanchangaLimbs {
  tithi: Tithi;
  nakshatra: MoonNakshatra;
  yoga: Limb;
  karana: Karana;
}

/** The four longitude limbs (everything but the vara). */
export function panchangaLimbs(sun: Arcsec, moon: Arcsec): PanchangaLimbs {
  return { tithi: tithi(sun, moon), nakshatra: moonNakshatra(moon), yoga: yoga(sun, moon), karana: karana(sun, moon) };
}

// ------------------------------------------------------------------ sunrise and vara

export type SunriseConvention = 'upper-limb' | 'disc-centre' | 'hindu';
export const DEFAULT_SUNRISE: SunriseConvention = 'upper-limb';

/** swe_rise_trans `rsmi` for a convention. */
export function sunriseFlags(c: SunriseConvention): number {
  switch (c) {
    case 'upper-limb': return SE.CALC_RISE;
    case 'disc-centre': return SE.CALC_RISE | SE.BIT_DISC_CENTER;
    case 'hindu': return SE.CALC_RISE | SE.BIT_HINDU_RISING;
  }
}

/**
 * The last sunrise at or before `jdUT` (UT), searching back at most two days;
 * null where the Sun does not rise.
 */
export function lastSunrise(swe: SwissEph, jdUT: number, latDeg: number, lonDeg: number, c: SunriseConvention = DEFAULT_SUNRISE): number | null {
  const rsmi = sunriseFlags(c);
  let sr = swe.riseTrans(jdUT - 2, SE.SUN, rsmi, lonDeg, latDeg);
  if (sr === null || sr > jdUT) return null;
  for (let guard = 0; guard < 4; guard++) {
    const next = swe.riseTrans(sr + 1e-4, SE.SUN, rsmi, lonDeg, latDeg);
    if (next === null || next > jdUT) return sr;
    sr = next;
  }
  return sr;
}

/** Weekday 0 = Sunday … 6 of the local civil date containing `jdUT`. */
export const civilWeekday = (jdUT: number, zoneHours: number): number => weekday(jdUT + zoneHours / 24);

/** Vara (Hindu weekday, sunrise to sunrise) of a cast chart. */
export function vara(swe: SwissEph, chart: ChartResult, opts: { sunrise?: SunriseConvention } = {}): Vara {
  const convention = opts.sunrise ?? DEFAULT_SUNRISE;
  const zone = chart.input.tzHours + chart.input.dstHours;
  const { jdUT } = chart.moment;
  const { latDeg, lonDeg } = chart.input.place;
  const civil = civilWeekday(jdUT, zone);
  const sr = lastSunrise(swe, jdUT, latDeg, lonDeg, convention);
  const w = sr === null ? civil : civilWeekday(sr, zone);
  return {
    num: w + 1, name: VARA_NAMES[w]!, sanskrit: VARA_SANSKRIT[w]!, lord: VARA_LORDS[w]!,
    sunriseJdUT: sr, beforeSunrise: sr !== null && w !== civil, convention,
  };
}

export interface Panchanga extends PanchangaLimbs {
  vara: Vara;
}

/** The full panchanga line of a chart. */
export function panchanga(swe: SwissEph, chart: ChartResult, opts: { sunrise?: SunriseConvention } = {}): Panchanga {
  return { ...panchangaLimbs(chart.bodies.Su.lon, chart.bodies.Mo.lon), vara: vara(swe, chart, opts) };
}

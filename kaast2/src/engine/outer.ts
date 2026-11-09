/**
 * Uranus, Neptune, Pluto and Chiron (the boss's v0.10 brief): positions in
 * the chart's own sidereal frame, with the same Page 1 details as the nine
 * grahas (nakshatra, pada, syllable, KP star/sub/sub-sub lords, navamsha).
 *
 * Recipe: exactly the grahas' (siderealFrame + one swe_calc per body, the
 * profile's rounding), so a profile's ayanamsa, Delta-T and equinox apply
 * unchanged. Chiron comes from the asteroid file seas_18 (1800–2399), the
 * others from sepl_18 — both already embedded, nothing new is shipped.
 * Evidence: the 10 Solar Fire Gold reference charts list all four bodies;
 * the Solar Fire profile reproduces them to ≤ 1″
 * (tests/engine/outer_bodies.test.ts).
 *
 * Not used anywhere else: these bodies rule no sign, have no dasha, no
 * Parashari aspect and no strength; PL's Page 1 does not show them.
 * Combustion is not defined for them.
 */
import { SE, type SwissEph } from './ephem/swisseph';
import { siderealFrame, type SiderealFrame } from './index';
import { lordChain } from './kp/lords';
import { NAKSHATRA_ABBR, NAKSHATRA_SHORT, PADA_SYLLABLES } from './names';
import { PLANETS, type Arcsec, type ChartResult, type PlanetId } from './types';
import { navamshaSign } from './varga/cyclic';
import { dmsInSign, nakshatraIndex, normDeg, pada, signIndex, toArcsec } from './zodiac';

export const OUTER = ['Ur', 'Ne', 'Pl', 'Ch'] as const;
export type OuterId = (typeof OUTER)[number];

export const OUTER_NAMES: Readonly<Record<OuterId, string>> = { Ur: 'Uranus', Ne: 'Neptune', Pl: 'Pluto', Ch: 'Chiron' };

export const OUTER_SWE: Readonly<Record<OuterId, number>> = { Ur: SE.URANUS, Ne: SE.NEPTUNE, Pl: SE.PLUTO, Ch: SE.CHIRON };

export interface OuterPosition {
  id: OuterId;
  /** Sidereal longitude, profile-rounded integer arcseconds. */
  lon: Arcsec;
  lonDeg: number;
  latDeg: number;
  speedDeg: number;
  retrograde: boolean;
}

/** One outer body in a frame (same steps as bodiesIn() for a graha). */
export function outerIn(swe: SwissEph, f: SiderealFrame, id: OuterId): OuterPosition {
  const r = swe.calc(f.jdTT, OUTER_SWE[id], f.planetFlags);
  const lonDeg = normDeg(r.lon + f.offsetDeg);
  return { id, lon: toArcsec(lonDeg, f.profile.rounding), lonDeg, latDeg: r.lat, speedDeg: r.lonSpeed, retrograde: r.lonSpeed < 0 };
}

/** All four in a frame. */
export function outersIn(swe: SwissEph, f: SiderealFrame): Record<OuterId, OuterPosition> {
  const out = {} as Record<OuterId, OuterPosition>;
  for (const id of OUTER) out[id] = outerIn(swe, f, id);
  return out;
}

/** The four bodies at the chart's moment, in the chart's profile. */
export function outerPositions(swe: SwissEph, chart: ChartResult): Record<OuterId, OuterPosition> {
  return outersIn(swe, siderealFrame(swe, chart.profile, chart.moment.jdUT));
}

/** Same-sign neighbour of an outer body, with the separation in degrees. */
export interface OuterConjunction { with: PlanetId | OuterId; orb: number }

export interface OuterRow {
  id: OuterId;
  sign: number;
  deg: number; min: number; sec: number;
  retrograde: boolean;
  nakshatra: number;
  nakshatraName: string;
  nakshatraAbbr: string;
  pada: number;
  syllable: string;
  /** [star, sub, sub-sub] (KP lords, computed like the grahas'). */
  lords: PlanetId[];
  navamshaSign: number;
  /** Whole-sign house from the Lagna and from the Moon. */
  houseFromAsc: number;
  houseFromMoon: number;
  /** Grahas and other outer bodies in the same Rasi sign, closest first. */
  conjunctions: OuterConjunction[];
}

const sep = (a: number, b: number): number => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/** Page-1-style rows for the four bodies of a chart. */
export function outerRows(chart: ChartResult, pos: Record<OuterId, OuterPosition>): OuterRow[] {
  const ascSign = signIndex(chart.asc.lon), moonSign = signIndex(chart.bodies.Mo.lon);
  const others: { id: PlanetId | OuterId; lon: Arcsec; lonDeg: number }[] = [
    ...PLANETS.map((id) => ({ id, lon: chart.bodies[id].lon, lonDeg: chart.bodies[id].lonDeg })),
    ...OUTER.map((id) => pos[id]),
  ];
  return OUTER.map((id) => {
    const p = pos[id];
    const { d, m, s } = dmsInSign(p.lon);
    const nak = nakshatraIndex(p.lon), pd = pada(p.lon), sign = signIndex(p.lon);
    const conjunctions = others
      .filter((o) => o.id !== id && signIndex(o.lon) === sign)
      .map((o) => ({ with: o.id, orb: sep(o.lonDeg, p.lonDeg) }))
      .sort((a, b) => a.orb - b.orb);
    return {
      id, sign, deg: d, min: m, sec: s, retrograde: p.retrograde,
      nakshatra: nak, nakshatraName: NAKSHATRA_SHORT[nak]!, nakshatraAbbr: NAKSHATRA_ABBR[nak]!,
      pada: pd, syllable: PADA_SYLLABLES[nak]![pd - 1]!,
      lords: lordChain(p.lon, 3),
      navamshaSign: navamshaSign(p.lon),
      houseFromAsc: ((sign - ascSign + 12) % 12) + 1,
      houseFromMoon: ((sign - moonSign + 12) % 12) + 1,
      conjunctions,
    };
  });
}

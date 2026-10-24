/**
 * Planet states for the Experimental highlights, in the Rasi and every varga:
 * dignity, retrogression, combustion, vargottama, the 3rd/6th/8th/12th
 * houses, directional strength, conjunctions and planetary war.
 *
 * Dignity tables are PL's (strength/common.ts, BIN): exaltation and
 * debilitation signs, own signs (Rahu Ge+Aq, Ketu Sg+Sc), and the Rasi-only
 * moolatrikona degree ranges. In a varga only the sign counts (a varga has no
 * degrees), so the moolatrikona sign shows as own.
 *
 * Conjunction (yuti): two planets in the same sign of that chart (Parashari
 * convention; BPHS counts planets in one sign as joined). "Close" adds an
 * orb in the Rasi (default 3°, the boss's rule of thumb; adjustable).
 * Planets in adjacent signs within the orb are reported as "across a sign
 * boundary", not as a conjunction. Planetary war (graha yuddha): two of
 * Mars, Mercury, Jupiter, Venus and Saturn within 1° of longitude (BPHS,
 * Surya Siddhanta); the Sun, Moon and nodes never fight.
 */
import { isCombust } from '../combust';
import { DEBIL_SIGN, EXALT_SIGN, OWN, inMt } from '../strength/common';
import { PLANETS, type ChartResult, type PlanetId } from '../types';
import { vargaSign, type VargaId } from '../varga/rules';
import { vargaSigns } from './lordships';

export type DignityTag = 'EX' | 'MT' | 'OWN' | 'DB';
export type TrikHouse = 3 | 6 | 8 | 12;

export interface PlanetState {
  id: PlanetId;
  sign: number;
  /** 1…12 from this chart's Lagna. */
  house: number;
  dignity: DignityTag | null;
  retrograde: boolean;
  combust: boolean;
  /** Same sign in the Rasi and the Navamsha. */
  vargottama: boolean;
  trik: TrikHouse | null;
  /** In its house of directional strength (Su Ma 10, Mo Ve 4, Me Ju 1, Sa 7). */
  digBala: boolean;
}

export interface Conjunction {
  a: PlanetId;
  b: PlanetId;
  sign: number;
  /** Separation in degrees (Rasi only; null in a varga). */
  orb: number | null;
  close: boolean;
  /** Graha yuddha (Rasi only). */
  war: boolean;
}

export interface NearMiss { a: PlanetId; b: PlanetId; orb: number }

export interface ChartStates {
  varga: VargaId;
  ascSign: number;
  planets: PlanetState[];
  conjunctions: Conjunction[];
  /** Rasi only: planets within the orb but in adjacent signs. */
  acrossBoundary: NearMiss[];
}

const DIG_HOUSE: Readonly<Record<PlanetId, number | null>> = { Su: 10, Ma: 10, Mo: 4, Ve: 4, Me: 1, Ju: 1, Sa: 7, Ra: null, Ke: null };
const WAR = new Set<PlanetId>(['Ma', 'Me', 'Ju', 'Ve', 'Sa']);
export const DEFAULT_CONJUNCTION_ORB = 3;
export const WAR_ORB = 1;

const sep = (a: number, b: number): number => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

export function dignityIn(p: PlanetId, sign: number, rasiLonDeg: number | null): DignityTag | null {
  if (sign === EXALT_SIGN[p]) return 'EX';
  if (sign === DEBIL_SIGN[p]) return 'DB';
  if (rasiLonDeg !== null && inMt(p, rasiLonDeg)) return 'MT';
  return OWN[p].includes(sign) ? 'OWN' : null;
}

export function chartStates(chart: ChartResult, varga: VargaId, orb = DEFAULT_CONJUNCTION_ORB): ChartStates {
  const signs = vargaSigns(chart, varga);
  const asc = signs.As;
  const rasi = varga === 'D1';
  const sun = chart.bodies.Su;
  const planets: PlanetState[] = PLANETS.map((id) => {
    const b = chart.bodies[id];
    const house = ((signs[id] - asc + 12) % 12) + 1;
    return {
      id, sign: signs[id], house,
      dignity: dignityIn(id, signs[id], rasi ? b.lonDeg : null),
      retrograde: b.retrograde,
      combust: id !== 'Su' && isCombust(b, sun),
      vargottama: vargaSign('D1', b.lon) === vargaSign('D9', b.lon),
      trik: house === 3 || house === 6 || house === 8 || house === 12 ? house : null,
      digBala: DIG_HOUSE[id] === house,
    };
  });
  const conjunctions: Conjunction[] = [];
  const acrossBoundary: NearMiss[] = [];
  for (let i = 0; i < PLANETS.length; i++) {
    for (let j = i + 1; j < PLANETS.length; j++) {
      const a = PLANETS[i]!, b = PLANETS[j]!;
      if ((a === 'Ra' && b === 'Ke')) continue;
      const d = rasi ? sep(chart.bodies[a].lonDeg, chart.bodies[b].lonDeg) : null;
      if (signs[a] === signs[b]) {
        conjunctions.push({
          a, b, sign: signs[a], orb: d,
          close: d !== null && d <= orb,
          war: d !== null && WAR.has(a) && WAR.has(b) && d <= WAR_ORB,
        });
      } else if (d !== null && d <= orb) {
        acrossBoundary.push({ a, b, orb: d });
      }
    }
  }
  return { varga, ascSign: asc, planets, conjunctions, acrossBoundary };
}

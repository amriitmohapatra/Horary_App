/**
 * PL 7 worksheet 14's extra columns (docs/specs/pl_worksheets.md §2):
 * Domin. (dominance, BIN 0x42cc9f; 9/9 on a PL 7.0.1 printout to 2 decimals),
 * IshKas (Ishta/Kashta phala of D1, BIN 0x58e1d4/0x58e6ea; Su Mo Sa exact,
 * Ma–Ve within 1–2 virupas, the residual coming from cheshta epochs) and
 * War (always blank in PL 7.0.1; our textbook winner is offered separately).
 * Pure: longitudes in exact sidereal degrees.
 */
import { aspectValue } from '../strength/drik';
import { DEBIL_DEG, GRAHAS7, MT, OWN, SIGN_LORD, dist, fwd, nat, pid, sgn, temp, type Graha7 } from '../strength/common';
import type { ShadbalaBreakdown } from '../strength/shadbala';
import { PLANETS, type PlanetId, type PointId } from '../types';

export type Lons = Record<PointId, number>;

/** Final dispositor of `p`: follow "lord of the sign it occupies" until a planet repeats. */
export function finalDispositor(lon: Lons, p: PlanetId): PlanetId {
  const seen: PlanetId[] = [];
  let q = p;
  while (!seen.includes(q)) { seen.push(q); q = SIGN_LORD[sgn(lon[q])]!; }
  return q;
}

/** Domin. column for all nine planets. */
export function dominance(lon: Lons): Record<PlanetId, number> {
  const asc = lon.As;
  const LL = SIGN_LORD[sgn(asc)]!, dispMo = SIGN_LORD[sgn(lon.Mo)]!, dispSu = SIGN_LORD[sgn(lon.Su)]!;
  const FD = finalDispositor(lon, LL);
  const s = (p: PointId) => sgn(lon[p]);
  const out = {} as Record<PlanetId, number>;
  for (const p of PLANETS) {
    const node = p === 'Ra' || p === 'Ke';
    const other = p === 'Ra' ? 'Ke' : 'Ra';
    const asp = (t: PointId): number => {
      if (node && s(t) === s(other)) return 0;
      return aspectValue(fwd(lon[p], lon[t]), pid(p)) / 60;
    };
    let D = 0;
    if (s(p) === s('As')) D += 1 - dist(lon[p], asc) / 30;
    if (p !== 'Mo' && s(p) === s('Mo')) D += 0.75;
    if (p !== 'Su' && s(p) === s('Su')) D += 0.5;
    D += p === LL ? 1 : s(p) === s(LL) ? 0.75 : 0;
    D += p === dispMo ? 0.75 : s(p) === s(dispMo) ? 0.5 : 0;
    D += p === dispSu ? 0.5 : s(p) === s(dispSu) ? 0.3 : 0;
    if (p === FD) D += 0.25;
    const A = asp(dispSu) * 0.3 + asp(dispMo) * 0.5 + asp(LL) * 0.75 + asp('As') * 1 + asp('Su') * 0.5 + asp('Mo') * 0.75;
    out[p] = D + A * (node ? 0.8 : 1);
  }
  return out;
}

const REL_POINTS: Readonly<Record<number, number>> = { 2: 22.5, 1: 15, 0: 7.5, [-1]: 3.75, [-2]: 1.875 };

/** Rasi points of planet `q` (own 30, moolatrikona 45), the temporal relation taken from the sign `fromSign`. */
function d1Points(lon: Lons, q: Graha7, fromSign: number): number {
  const sq = sgn(lon[q]);
  const [mtSign, a, b] = MT[q];
  const d = lon[q] % 30;
  if (sq === mtSign && a < d && d < b) return 45;
  if (OWN[q].includes(sq)) return 30;
  const M = SIGN_LORD[sq]!;
  return REL_POINTS[nat(q, M) + temp(fromSign, sgn(lon[M]))]!;
}

export interface IshtaKashta { ishta: number; kashta: number; ishtaPhala: number }

/** IshKas column (D1) for Su…Sa. `ayanamsaDeg` turns the Sun into sayana for its cheshta angle. */
export function ishtaKashta(lon: Lons, sb: Record<Graha7, ShadbalaBreakdown>, ayanamsaDeg: number): Record<Graha7, IshtaKashta> {
  const out = {} as Record<Graha7, IshtaKashta>;
  for (const p of GRAHAS7) {
    const b = sb[p];
    const u = dist(lon[p], DEBIL_DEG[p]);
    let c: number;
    if (p === 'Su') { let x = (((lon.Su + ayanamsaDeg + 90) % 360) + 360) % 360; if (x > 180) x = 360 - x; c = x; }
    else c = 3 * b.cheshta;
    const y = (u + c) / 6;
    const pos = (b.total * y) / 60;
    const S = b.saptavargajaParts.reduce((acc, part) => acc + (part.varga === 'D1' ? part.points : 0.5 * part.points), 0);
    const G = Math.max(0, 60 - S / 2);
    const L = SIGN_LORD[sgn(lon[p])] as Graha7;
    const w1 = d1Points(lon, L, sgn(lon[p]));
    out[p] = {
      ishtaPhala: y,
      ishta: Math.trunc((Math.sqrt(S * w1) * pos) / 60),
      kashta: Math.trunc((Math.sqrt(Math.max(0, 60 - w1) * G) * pos) / 60),
    };
  }
  return out;
}

export interface WarResult { a: Graha7; b: Graha7; separation: number; winner: Graha7 | null }
const WAR_PLANETS: Graha7[] = ['Ma', 'Me', 'Ju', 'Ve', 'Sa'];

/** Textbook graha yuddha (not PL output): two of Ma–Sa within 1°, the one with the greater (northern) latitude wins. */
export function planetaryWar(lon: Lons, lat: Partial<Record<PlanetId, number>>): WarResult[] {
  const out: WarResult[] = [];
  for (let i = 0; i < WAR_PLANETS.length; i++) for (let j = i + 1; j < WAR_PLANETS.length; j++) {
    const a = WAR_PLANETS[i]!, b = WAR_PLANETS[j]!;
    const d = dist(lon[a], lon[b]);
    if (d < 1) {
      const la = lat[a], lb = lat[b];
      out.push({ a, b, separation: d, winner: la === undefined || lb === undefined || la === lb ? null : la > lb ? a : b });
    }
  }
  return out;
}

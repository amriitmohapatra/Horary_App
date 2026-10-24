/**
 * Planet-to-planet aspects as PL 7's worksheet 21 ("Aspects on planets") and
 * worksheet 22 ("Aspects from planets") show them.
 *
 * Virupas: PL's own aspect curve (strength/drik.ts `aspectValue`, BIN 0x404f64)
 * at d = fwd(λ_aspecting, λ_aspected), shown floored. Fraction: the sign-count
 * (Parashari) aspect — 3rd/10th ¼, 5th/9th ½, 4th/8th ¾, 7th full; the special
 * aspects are full (Mars 4/8, Jupiter 5/9, Saturn 3/10, Rahu and Ketu 5/9 like
 * Jupiter, whose curve PL also gives them); "–" = no sign aspect.
 * Colour (PL prints each cell green, blue or red): the compound (five-fold)
 * relation of the aspected planet towards the aspecting one — natural
 * relation (BIN table) plus the temporal one from their Rasi signs.
 * All three rules reproduce all 72 cells of a PL 7.0.1 worksheet 21 (private
 * oracle test, tests/engine/exp_oracle.test.ts).
 */
import { aspectValue } from '../strength/drik';
import { fwd, nat, pid, temp } from '../strength/common';
import { PLANETS, type ChartResult, type PlanetId } from '../types';

export type AspectFraction = '-' | '1/4' | '1/2' | '3/4' | '4/4';
export type Relation = 'friend' | 'neutral' | 'enemy';
export interface AspectCell { fraction: AspectFraction; virupas: number }
export interface MatrixCell extends AspectCell {
  /** Compound relation of the aspected planet towards the aspecting one. */
  relation: Relation;
}

const SPECIAL: Partial<Record<PlanetId, readonly number[]>> = { Ma: [4, 8], Ju: [5, 9], Sa: [3, 10], Ra: [5, 9], Ke: [5, 9] };
const BY_COUNT: Readonly<Record<number, AspectFraction>> = { 3: '1/4', 10: '1/4', 5: '1/2', 9: '1/2', 4: '3/4', 8: '3/4', 7: '4/4' };

/** Sign-count aspect of `aspecting` on a point `n` signs away (1 = same sign). */
export function aspectFraction(aspecting: PlanetId, n: number): AspectFraction {
  if (SPECIAL[aspecting]?.includes(n)) return '4/4';
  return BY_COUNT[n] ?? '-';
}

/** Signs counted from `from` to `to`, 1…12. */
export const signCount = (from: number, to: number): number => ((to - from + 12) % 12) + 1;
const signOf = (deg: number): number => Math.floor((((deg % 360) + 360) % 360) / 30);

/** Aspect of a planet at `fromDeg` on a point at `toDeg` (exact sidereal degrees). */
export function aspectOn(aspecting: PlanetId, fromDeg: number, toDeg: number): AspectCell {
  return {
    fraction: aspectFraction(aspecting, signCount(signOf(fromDeg), signOf(toDeg))),
    virupas: Math.floor(aspectValue(fwd(fromDeg, toDeg), pid(aspecting)) + 1e-9),
  };
}

/** Compound relation of `p` (in sign `sp`) towards `q` (in sign `sq`). */
export function compoundRelation(p: PlanetId, sp: number, q: PlanetId, sq: number): Relation {
  const v = nat(p, q) + temp(sp, sq);
  return v > 0 ? 'friend' : v < 0 ? 'enemy' : 'neutral';
}

/** m[aspected][aspecting]; the diagonal is null. */
export type AspectMatrix = Record<PlanetId, Record<PlanetId, MatrixCell | null>>;

export function aspectMatrix(chart: ChartResult): AspectMatrix {
  const m = {} as AspectMatrix;
  const sign = (p: PlanetId) => signOf(chart.bodies[p].lonDeg);
  for (const t of PLANETS) {
    m[t] = {} as Record<PlanetId, MatrixCell | null>;
    for (const a of PLANETS) {
      m[t][a] = a === t ? null : {
        ...aspectOn(a, chart.bodies[a].lonDeg, chart.bodies[t].lonDeg),
        relation: compoundRelation(t, sign(t), a, sign(a)),
      };
    }
  }
  return m;
}

/** House point for the house graphs: PL's rashi chart uses the Ascendant degree in every sign (Equal); the bhava chart its cusps. */
export type HousePoint = 'equal' | 'sripati';

export interface HouseAspects {
  /** Longitude (degrees) of each house point, index 0 = house 1. */
  points: number[];
  lords: PlanetId[];
  /** onHouse[n][i] = % of a full aspect of planet i on house n+1 (PL graph type 2). */
  onHouse: Record<PlanetId, number>[];
  /** plusLord[n][i] = half from the house, half from its lord (PL graph type 3). */
  plusLord: Record<PlanetId, number>[];
}

const curve = (p: PlanetId, from: number, to: number): number => aspectValue(fwd(from, to), pid(p));

/** PL 7 worksheets 23–26 (docs/specs/pl_worksheets.md §4.2). `madhya` = bhava cusps in degrees, for 'sripati'. */
export function houseAspects(chart: ChartResult, mode: HousePoint, madhya?: number[]): HouseAspects {
  const asc = chart.asc.lonDeg;
  const points = Array.from({ length: 12 }, (_, n) => (mode === 'sripati' && madhya ? madhya[n]! : (asc + 30 * n) % 360));
  const lords = points.map((h) => SIGN_LORD_OF[signOf(h)]!);
  const onHouse = points.map((h) => Object.fromEntries(PLANETS.map((i) => [i, Math.trunc((curve(i, chart.bodies[i].lonDeg, h) * 100) / 60 + 1e-9)])) as Record<PlanetId, number>);
  const plusLord = points.map((h, n) => Object.fromEntries(PLANETS.map((i) => {
    const half = Math.trunc((curve(i, chart.bodies[i].lonDeg, h) * 50) / 60 + 1e-9);
    const lord = lords[n]!;
    const l = i === lord ? 0 : (curve(i, chart.bodies[i].lonDeg, chart.bodies[lord].lonDeg) * 50) / 60;
    return [i, Math.trunc(half + l + 1e-9)];
  })) as Record<PlanetId, number>);
  return { points, lords, onHouse, plusLord };
}
const SIGN_LORD_OF: readonly PlanetId[] = ['Ma', 'Ve', 'Me', 'Mo', 'Su', 'Me', 'Ve', 'Ma', 'Ju', 'Sa', 'Sa', 'Ju'];

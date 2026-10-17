/**
 * Page 1 strength fields — `strengths(swe, chart)`. Spec: docs/spec/PAGE1_SPEC.md;
 * oracle: oracle/page1_strengths.py (145 PL9 fields, 0 mismatches).
 *
 * Per planet: Dignity (§3.1), SB% (§3.2), SB# (§3.3), VB (§3.4), AV (§3.5), Av3 (§3.6),
 * Av5 (§3.7), K7 (§3.8), Func. (§3.9). Per house: SAV (§1.1) and Bhava Bala (§1.2).
 * Breakdown: Shadbala components (§4), Bhava Bala components, the kala time context and
 * the full BAV/SAV table, for a "How was this computed?" view and a later Ashtakavarga page.
 *
 * Pure except for Swiss calls the spec needs (sunrise = Asc = Sun; conjunction/opposition
 * and station searches for cheshta). Leaves Swiss's sidereal mode as cast() left it.
 * Open items carried as the oracle's current rule: Ketu VB (§3.4), Rahu AV (§3.5),
 * node Func. rule (§3.9), night-birth kala branches (§7 item 7), yuddha amount.
 */
import type { SwissEph } from '../ephem/swisseph';
import { PLANETS, type ChartResult, type PlanetId } from '../types';
import { GRAHAS7, roundHalfEven, sgn, type Graha7, type StrengthContext, type StrengthPoint } from './common';
import { ashtakavarga, avColumn, type Ashtakavarga } from './ashtakavarga';
import { baladi, jagradadi, type Av3Label, type Av5Label } from './avastha';
import { bhavaBala, type BhavaBalaBreakdown } from './bhavabala';
import { DIGNITY_SHORT, dignity, type DignityCode } from './dignity';
import { StrengthEphem } from './ephem';
import { functionalNature, type FunctionalNature } from './functional';
import { kalaContext, type KalaContext } from './kala';
import { karakas7, type K7Label } from './karakas7';
import { shadbala, type ShadbalaBreakdown } from './shadbala';
import { vimshopaka, type VimshopakaPart } from './vimshopaka';

export interface PlanetStrengthRow {
  id: PlanetId;
  dignity: DignityCode;
  /** PL's short label, e.g. "Grt.En.". */
  dignityLabel: string;
  /** Shadbala total / required (Su–Sa); null for the nodes. Display: 2 decimals. */
  sbRatio: number | null;
  /** Number of strong balas (Su–Sa); null for the nodes. */
  sbStrongCount: number | null;
  /** Vimshopaka score 0–20 (unrounded) and the displayed integer (half to even, as the oracle). */
  vimshopakaScore: number;
  vimshopaka: number;
  vimshopakaParts: VimshopakaPart[];
  /** BAV bindus in own sign; Rahu = OPEN candidate (dispositor's BAV); Ketu null. */
  av: number | null;
  av3: Av3Label;
  av5: Av5Label;
  /** Chara karaka (Su–Sa); null for the nodes. */
  k7: K7Label | null;
  functional: FunctionalNature;
}

export interface HouseStrengthRow {
  /** 1…12 from the ascendant (whole sign for SAV). */
  house: number;
  sign: number;
  sav: number;
  /** Bhava Bala total, virupas. */
  bhavaBala: number;
}

export interface Page1Strengths {
  planets: Record<PlanetId, PlanetStrengthRow>;
  houses: HouseStrengthRow[];
  breakdown: {
    shadbala: Record<Graha7, ShadbalaBreakdown>;
    bhava: BhavaBalaBreakdown[];
    kala: KalaContext;
    /** True obliquity used for ayana bala (deg). */
    obliquity: number;
  };
  ashtakavarga: Ashtakavarga;
  /** Number of Swiss evaluations made (diagnostic). */
  sweCalls: number;
}

export function strengthContext(chart: ChartResult, mcDeg: number, ascDeg: number): StrengthContext {
  const lon = {} as Record<StrengthPoint, number>;
  const speed = {} as Record<PlanetId, number>;
  for (const p of PLANETS) { lon[p] = chart.bodies[p].lonDeg; speed[p] = chart.bodies[p].speedDeg; }
  lon.As = ascDeg;
  const sign = Object.fromEntries(Object.entries(lon).map(([k, v]) => [k, sgn(v)])) as Record<StrengthPoint, number>;
  return { lon, speed, sign, asc: ascDeg, mc: mcDeg };
}

export function strengths(swe: SwissEph, chart: ChartResult): Page1Strengths {
  const e = new StrengthEphem(swe, chart);
  const jd = chart.moment.jdUT;
  try {
    const { mc } = e.ascMc(jd);
    const c = strengthContext(chart, mc, chart.asc.lonDeg);
    const kala = kalaContext(e, jd, c.asc, c.lon.Su, chart.input.place.lonDeg);
    const obliquity = e.obliquity();
    const sb = shadbala(e, { ctx: c, kala, jd, ayanamsaDeg: chart.moment.ayanamsaDeg, obliquity });
    const bhava = bhavaBala(c, sb, kala.isDay);
    const av = ashtakavarga(c);
    const k7 = karakas7(c);
    const ascSign = sgn(c.asc);

    const planets = {} as Record<PlanetId, PlanetStrengthRow>;
    for (const p of PLANETS) {
      const g = (GRAHAS7 as readonly string[]).includes(p) ? (p as Graha7) : null;
      const d = dignity(c, p);
      const vb = vimshopaka(c, p);
      planets[p] = {
        id: p, dignity: d, dignityLabel: DIGNITY_SHORT[d],
        sbRatio: g ? sb[g].ratio : null,
        sbStrongCount: g ? sb[g].strongCount : null,
        vimshopakaScore: vb.score, vimshopaka: roundHalfEven(vb.score), vimshopakaParts: vb.parts,
        av: avColumn(c, av, p),
        av3: jagradadi(c, p), av5: baladi(c, p),
        k7: g ? k7[g] : null,
        functional: functionalNature(c, p),
      };
    }
    const houses: HouseStrengthRow[] = bhava.map((b, h) => {
      const sign = (ascSign + h) % 12;
      return { house: h + 1, sign, sav: av.sav[sign]!, bhavaBala: b.total };
    });
    return { planets, houses, breakdown: { shadbala: sb, bhava, kala, obliquity }, ashtakavarga: av, sweCalls: e.calls };
  } finally {
    e.restore();
  }
}

export type { DignityCode } from './dignity';
export type { Av3Label, Av5Label } from './avastha';
export type { K7Label } from './karakas7';
export type { FunctionalNature } from './functional';
export type { ShadbalaBreakdown, StrongGroup, SaptavargajaPart } from './shadbala';
export type { BhavaBalaBreakdown, DigType } from './bhavabala';
export type { KalaContext } from './kala';
export type { CheshtaDetail } from './cheshta';
export type { Ashtakavarga, AvContributor } from './ashtakavarga';
export type { VimshopakaPart } from './vimshopaka';
export type { Graha7 } from './common';
export { DIGNITY_LONG, DIGNITY_SHORT } from './dignity';
export { AV3_LONG, AV5_LABELS } from './avastha';
export { K7_LABELS } from './karakas7';
export { REQUIRED_TOTAL, GROUP_MINIMA, STRONG_GROUPS } from './shadbala';
export { AV_CONTRIBUTORS } from './ashtakavarga';

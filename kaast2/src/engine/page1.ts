/**
 * Page 1 view-model: everything the Page 1 panels show, computed from a
 * ChartResult. Pure — the components only lay it out.
 */
import { isCombust } from './combust';
import { mahadashas, type DashaPeriod } from './dasha/vimshottari';
import { lordChain } from './kp/lords';
import { NAKSHATRA_ABBR, NAKSHATRA_NAMES, PADA_SYLLABLES } from './names';
import { PLANETS, type ChartResult, type PlanetId, type PointId, type Position } from './types';
import { navamshaSign } from './varga/cyclic';
import { dmsInSign, nakshatraIndex, pada, signIndex } from './zodiac';

export const POINT_ORDER: readonly PointId[] = ['As', ...PLANETS];

export interface PointRow {
  id: PointId;
  sign: number;
  deg: number; min: number; sec: number;
  retrograde: boolean;
  combust: boolean;
  /** PL flag text: "", "R", "c", "Rc". */
  flags: string;
  nakshatra: number;
  nakshatraName: string;
  nakshatraAbbr: string;
  pada: number;
  syllable: string;
  /** [star, sub, sub-sub] */
  lords: PlanetId[];
  navamshaSign: number;
}

export interface Page1Model {
  rows: PointRow[];
  /** Rows grouped by Rasi sign 0…11, ascendant first. */
  rasi: PointRow[][];
  /** Ids grouped by navamsha sign 0…11. */
  navamsha: PointId[][];
  ascSign: number;
  navamshaAscSign: number;
  mahas: DashaPeriod[];
}

function rowFor(p: Position, sun: Position): PointRow {
  const { d, m, s } = dmsInSign(p.lon);
  const nak = nakshatraIndex(p.lon);
  const pd = pada(p.lon);
  const combust = p.id !== 'As' && isCombust(p, sun);
  return {
    id: p.id, sign: signIndex(p.lon), deg: d, min: m, sec: s,
    retrograde: p.retrograde, combust,
    flags: (p.retrograde ? 'R' : '') + (combust ? 'c' : ''),
    nakshatra: nak, nakshatraName: NAKSHATRA_NAMES[nak]!, nakshatraAbbr: NAKSHATRA_ABBR[nak]!,
    pada: pd, syllable: PADA_SYLLABLES[nak]![pd - 1]!,
    lords: lordChain(p.lon, 3),
    navamshaSign: navamshaSign(p.lon),
  };
}

export function page1Model(chart: ChartResult): Page1Model {
  const sun = chart.bodies.Su;
  const positions: Position[] = [chart.asc, ...PLANETS.map((id) => chart.bodies[id])];
  const rows = positions.map((p) => rowFor(p, sun));
  const rasi: PointRow[][] = Array.from({ length: 12 }, () => []);
  const navamsha: PointId[][] = Array.from({ length: 12 }, () => []);
  for (const r of rows) {
    rasi[r.sign]!.push(r);
    navamsha[r.navamshaSign]!.push(r.id);
  }
  const moon = chart.profile.dashaMoon === 'exact' ? chart.bodies.Mo.lonDeg : chart.bodies.Mo.lon / 3600;
  return {
    rows, rasi, navamsha,
    ascSign: rows[0]!.sign,
    navamshaAscSign: rows[0]!.navamshaSign,
    mahas: mahadashas(moon, chart.moment.jdUT, chart.profile.dashaYearDays),
  };
}

/** House number (1…12) of a sign, counted from the ascendant's sign. */
export const houseOfSign = (sign: number, ascSign: number): number => ((sign - ascSign + 12) % 12) + 1;

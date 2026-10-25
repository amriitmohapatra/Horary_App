/**
 * Lordships and placements in the Rasi and every varga, as PL 7's
 * "Lordships" worksheet: houses are whole signs from that chart's own Lagna;
 * "Lord of N in M"; an exchange of lordship (parivartana) is marked when the
 * lord of N sits in M and the lord of M sits in N. The seven planets rule the
 * signs (the nodes rule none). Reproduces a PL 7.0.1 Lordships worksheet for
 * D1, D9 and D10 (private oracle test).
 */
import { PLANETS, type ChartResult, type PlanetId, type PointId } from '../types';
import { SIGN_LORD } from '../zodiac';
import { vargaSign, type VargaId } from '../varga/rules';

export interface LordshipRow {
  house: number;
  sign: number;
  lord: PlanetId;
  /** House 1…12 the lord occupies in this chart. */
  lordIn: number;
  /** The house this one exchanges with, if any. */
  exchangeWith: number | null;
}

export interface VargaPlacement {
  id: PointId;
  sign: number;
  /** 1…12 from this chart's Lagna. */
  house: number;
}

export interface LordshipChart {
  varga: VargaId;
  ascSign: number;
  rows: LordshipRow[];
  placements: Record<PointId, VargaPlacement>;
  /** Exchange pairs [lower house, higher house]. */
  exchanges: [number, number][];
}

/** Signs of the ascendant and the nine planets in a varga. */
export function vargaSigns(chart: ChartResult, varga: VargaId): Record<PointId, number> {
  const s = { As: vargaSign(varga, chart.asc.lon) } as Record<PointId, number>;
  for (const p of PLANETS) s[p] = vargaSign(varga, chart.bodies[p].lon);
  return s;
}

export function lordships(chart: ChartResult, varga: VargaId): LordshipChart {
  const signs = vargaSigns(chart, varga);
  const asc = signs.As;
  const houseOf = (sign: number): number => ((sign - asc + 12) % 12) + 1;
  const placements = {} as Record<PointId, VargaPlacement>;
  for (const id of ['As', ...PLANETS] as PointId[]) placements[id] = { id, sign: signs[id], house: houseOf(signs[id]) };
  const base = Array.from({ length: 12 }, (_, i) => {
    const sign = (asc + i) % 12;
    const lord = SIGN_LORD[sign]!;
    return { house: i + 1, sign, lord, lordIn: placements[lord].house };
  });
  const exchanges: [number, number][] = [];
  const rows: LordshipRow[] = base.map((r) => {
    const other = base[r.lordIn - 1]!;
    const ex = r.lordIn !== r.house && other.lordIn === r.house && other.lord !== r.lord;
    if (ex && r.house < other.house) exchanges.push([r.house, other.house]);
    return { ...r, exchangeWith: ex ? other.house : null };
  });
  return { varga, ascSign: asc, rows, placements, exchanges };
}

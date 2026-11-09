/**
 * The planet summary shown when the mouse rests on a planet in a chart (the
 * boss's v0.10 brief): its state, the houses it rules in THAT chart, the
 * aspects it receives and casts, and its conjunctions. One pure function
 * serves the Rasi, every varga and the transit chart; each caller states
 * what the chart is (SummaryChart) and the rules below do the rest.
 *
 * Rules — the same ones the Page 1 (Experimental) tabs state and test:
 *  - Dignity: states.ts `dignityIn` (PL's tables). Moolatrikona needs the
 *    Rasi degree, so it is checked only where exact degrees are given.
 *  - Houses: whole signs from the chart's own Lagna. Rulership: the seven
 *    planets rule their signs (SIGN_LORD); Rahu and Ketu rule none (PL's
 *    Lordships worksheet) — their dispositor is given instead.
 *  - Aspects: the sign-count (Parashari) aspect of aspects.ts
 *    `aspectFraction` — 7th full for all; Mars 4/8, Jupiter 5/9, Saturn
 *    3/10, Rahu and Ketu 5/9 full (PL); 3rd/10th ¼, 5th/9th ½, 4th/8th ¾
 *    partial. With exact degrees the virupas of PL's aspect curve are added.
 *    Uranus, Neptune, Pluto and Chiron cast no Parashari aspect.
 *  - Conjunction: same sign of that chart; with exact degrees, "close"
 *    within the orb and planetary war within 1° (states.ts).
 *  - Dig bala: states.ts DIG_HOUSE, counted from this chart's Lagna.
 */
import { DIG_HOUSE, WAR_ORB, WAR_PLANETS, dignityIn, type DignityTag } from './states';
import { aspectFraction, signCount, aspectOn, type AspectFraction } from './aspects';
import { vargaSigns } from './lordships';
import { isCombust } from '../combust';
import type { OuterId } from '../outer';
import { PLANETS, type Arcsec, type ChartResult, type PlanetId } from '../types';
import { vargaSign, type VargaId } from '../varga/rules';
import { NAKSHATRA_NAMES } from '../names';
import { SIGN_LORD, nakshatraIndex, pada, VIM_ORDER } from '../zodiac';

export type BodyId = PlanetId | OuterId;

export interface SummaryChart {
  /** Sign of this chart's Lagna, 0 = Aries. */
  ascSign: number;
  /** Sign of every body drawn in the chart. */
  signs: Partial<Record<BodyId, number>>;
  /**
   * Exact sidereal positions, for Rasi-type charts (D1, transits) only: they
   * add degrees, nakshatra, orbs, moolatrikona, planetary war and virupas.
   */
  pos?: Partial<Record<BodyId, { lon: Arcsec; lonDeg: number }>>;
  /** The planet's Rasi states (a varga has no motion of its own). */
  retro?: Partial<Record<BodyId, boolean>>;
  combust?: Partial<Record<PlanetId, boolean>>;
  vargottama?: Partial<Record<PlanetId, boolean>>;
  /** "Close" conjunction orb, degrees. */
  orb: number;
  /** Transit charts: the natal planets, for "over natal …". */
  natal?: Partial<Record<PlanetId, { sign: number; lonDeg: number }>>;
}

export interface AspectIn {
  from: PlanetId;
  /** Signs counted from the aspecting planet to this one (1…12). */
  count: number;
  fraction: Exclude<AspectFraction, '-'>;
  /** PL's aspect curve, exact charts only. */
  virupas?: number;
}

export interface ConjunctionIn {
  with: BodyId;
  /** Degrees apart, exact charts only. */
  orb: number | null;
  close: boolean;
  war: boolean;
}

export interface BodySummary {
  id: BodyId;
  sign: number;
  house: number;
  /** Exact charts: nakshatra 0…26, pada 1…4, star lord. */
  nakshatra?: { index: number; name: string; pada: number; lord: PlanetId };
  dignity: DignityTag | null;
  retrograde: boolean;
  combust: boolean;
  vargottama: boolean;
  digBala: boolean;
  /** Houses ruled in this chart, ascending (empty for the nodes and outer bodies). */
  rules: number[];
  /** Lord of the sign it occupies, and that lord's house (the planet itself when in its own sign). */
  dispositor: { id: PlanetId; house: number } | null;
  aspectedBy: AspectIn[];
  /** Full aspects cast: houses (ascending) and the bodies in them. */
  aspectsHouses: number[];
  aspectsBodies: BodyId[];
  conjunctions: ConjunctionIn[];
  /** Transit charts: natal planets in the same sign. */
  overNatal: { id: PlanetId; orb: number }[];
}

const isGraha = (id: BodyId): id is PlanetId => (PLANETS as readonly string[]).includes(id);
const houseOf = (sign: number, asc: number): number => ((sign - asc + 12) % 12) + 1;
const sep = (a: number, b: number): number => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};
const FRACTION_ORDER: Record<string, number> = { '4/4': 0, '3/4': 1, '1/2': 2, '1/4': 3 };

export function bodySummary(c: SummaryChart, id: BodyId): BodySummary | null {
  const sign = c.signs[id];
  if (sign === undefined) return null;
  const house = houseOf(sign, c.ascSign);
  const graha = isGraha(id);
  const p = c.pos?.[id];
  const bodies = (Object.keys(c.signs) as BodyId[]).filter((b) => b !== id);

  const rules = graha && id !== 'Ra' && id !== 'Ke'
    ? Array.from({ length: 12 }, (_, i) => i + 1).filter((h) => SIGN_LORD[(c.ascSign + h - 1) % 12] === id)
    : [];
  const lord = SIGN_LORD[sign]!;
  const lordSign = c.signs[lord];
  const dispositor = lordSign !== undefined ? { id: lord, house: houseOf(lordSign, c.ascSign) } : null;

  const aspectedBy: AspectIn[] = [];
  for (const b of bodies) {
    if (!isGraha(b)) continue;
    const count = signCount(c.signs[b]!, sign);
    const fraction = aspectFraction(b, count);
    if (fraction === '-') continue;
    const from = c.pos?.[b];
    aspectedBy.push({
      from: b, count, fraction,
      ...(p && from ? { virupas: aspectOn(b, from.lonDeg, p.lonDeg).virupas } : {}),
    });
  }
  aspectedBy.sort((a, b) => FRACTION_ORDER[a.fraction]! - FRACTION_ORDER[b.fraction]! || PLANETS.indexOf(a.from) - PLANETS.indexOf(b.from));

  const aspectsHouses: number[] = [];
  const aspectsBodies: BodyId[] = [];
  if (graha) {
    for (let n = 2; n <= 12; n++) {
      if (aspectFraction(id, n) !== '4/4') continue;
      const s = (sign + n - 1) % 12;
      aspectsHouses.push(houseOf(s, c.ascSign));
      for (const b of bodies) if (c.signs[b] === s) aspectsBodies.push(b);
    }
    aspectsHouses.sort((a, b) => a - b);
  }

  const conjunctions: ConjunctionIn[] = bodies
    .filter((b) => c.signs[b] === sign && !((id === 'Ra' && b === 'Ke') || (id === 'Ke' && b === 'Ra')))
    .map((b) => {
      const q = c.pos?.[b];
      const d = p && q ? sep(p.lonDeg, q.lonDeg) : null;
      return {
        with: b, orb: d,
        close: d !== null && d <= c.orb,
        war: d !== null && graha && isGraha(b) && WAR_PLANETS.has(id) && WAR_PLANETS.has(b) && d <= WAR_ORB,
      };
    })
    .sort((a, b) => (a.orb ?? 99) - (b.orb ?? 99));

  const overNatal = c.natal && p
    ? (Object.entries(c.natal) as [PlanetId, { sign: number; lonDeg: number }][])
      .filter(([, n]) => n.sign === sign)
      .map(([nid, n]) => ({ id: nid, orb: sep(n.lonDeg, p.lonDeg) }))
      .sort((a, b) => a.orb - b.orb)
    : [];

  const nak = p ? nakshatraIndex(p.lon) : null;
  return {
    id, sign, house,
    ...(p && nak !== null ? { nakshatra: { index: nak, name: NAKSHATRA_NAMES[nak]!, pada: pada(p.lon), lord: VIM_ORDER[nak % 9]! } } : {}),
    dignity: graha ? dignityIn(id, sign, p ? p.lonDeg : null) : null,
    retrograde: !!c.retro?.[id],
    combust: graha ? !!c.combust?.[id] : false,
    vargottama: graha ? !!c.vargottama?.[id] : false,
    digBala: graha && DIG_HOUSE[id] === house,
    rules, dispositor, aspectedBy, aspectsHouses, aspectsBodies, conjunctions, overNatal,
  };
}

/**
 * The summary context of a chart in the Rasi (`'D1'`, exact degrees) or a
 * varga (signs only). `outer` adds Uranus … Chiron where a chart draws them.
 */
export function summaryChartOf(chart: ChartResult, varga: VargaId, orb: number,
  outer?: Partial<Record<OuterId, { lon: Arcsec; lonDeg: number; retrograde: boolean }>>): SummaryChart {
  const signs = vargaSigns(chart, varga) as Partial<Record<BodyId | 'As', number>>;
  const ascSign = signs.As!;
  delete signs.As;
  const rasi = varga === 'D1';
  const pos: Partial<Record<BodyId, { lon: Arcsec; lonDeg: number }>> = {};
  const retro: Partial<Record<BodyId, boolean>> = {};
  const combust: Partial<Record<PlanetId, boolean>> = {};
  const vargottama: Partial<Record<PlanetId, boolean>> = {};
  const sun = chart.bodies.Su;
  for (const id of PLANETS) {
    const b = chart.bodies[id];
    pos[id] = b;
    retro[id] = b.retrograde;
    combust[id] = id !== 'Su' && isCombust(b, sun);
    vargottama[id] = vargaSign('D1', b.lon) === vargaSign('D9', b.lon);
  }
  for (const [id, o] of Object.entries(outer ?? {}) as [OuterId, { lon: Arcsec; lonDeg: number; retrograde: boolean }][]) {
    signs[id] = vargaSign(varga, o.lon);
    pos[id] = o;
    retro[id] = o.retrograde;
  }
  return { ascSign, signs: signs as Partial<Record<BodyId, number>>, ...(rasi ? { pos } : {}), retro, combust, vargottama, orb };
}

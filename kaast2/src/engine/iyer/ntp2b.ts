/**
 * NTP-2 ch. III–IV (Iyer, New Techniques of Prediction II, PDF pp. 44–101):
 * the Mathematical Navamsha and a planet's three stars, the area-by-area
 * (D-chart) reading of a Dasha lord, and the classical Bhukti rules A–E.
 * Catalogue: references/NTP/notes/ntp2b_rules.md. Pure.
 */
import type { ChartResult, PlanetId } from '../types';
import { SIGN_LORD, VIM_ORDER, signIndex } from '../zodiac';
import { aspectsSign, EXALT } from './ntp1';
import { IYER_DIVISIONS, iyerVarga, type IyerDivision } from './dcharts';
import type { Finding } from './ntp';

/* ---------- Mathematical Navamsha (pp. 82–85, chart pp. 90–91) ---------- */

/**
 * Where each star-pada (1…108, Ashwini-1 = 1) is placed in Iyer's Mathematical
 * Navamsha: sign S (1…12) holds slots 9(S−1)+1 … 9S and receives the padas
 * whose navamsa is S (n ≡ S mod 12). The one pada already inside S stays on its
 * own slot (Vargottama); the rest follow it on the next slots, cyclically,
 * in increasing order (pp. 84–85, worked for Vrishabha).
 */
const SLOT: number[] = (() => {
  const slot = Array<number>(109).fill(0);
  for (let S = 1; S <= 12; S++) {
    const first = 9 * (S - 1) + 1;
    const ns = Array.from({ length: 9 }, (_, k) => S + 12 * k);
    const v = ns.findIndex((n) => n >= first && n < first + 9);
    for (let j = 0; j < 9; j++) {
      const n = ns[(v + j) % 9]!;
      slot[n] = first + ((ns[v]! - first + j) % 9);
    }
  }
  return slot;
})();
export const mathNavamsaSlot = (pada: number): number => SLOT[pada]!;
const FALLS_ON: number[] = (() => { const f = Array<number>(109).fill(0); for (let n = 1; n <= 108; n++) f[SLOT[n]!] = n; return f; })();
export const padaFallingOn = (slot: number): number => FALLS_ON[slot]!;
export const padaOf = (lon: number): number => Math.floor(lon / 12_000) + 1;
const padaLord = (pada: number): PlanetId => VIM_ORDER[Math.floor((pada - 1) / 4) % 9]!;
export const padaName = (pada: number): { star: number; pada: number } => ({ star: Math.floor((pada - 1) / 4), pada: ((pada - 1) % 4) + 1 });

export interface ThreeStars {
  /** (a) the pada occupied; (b) the pada it gives its amsha to; (c) the pada falling on its radix (p. 83). */
  a: number; b: number; c: number;
  exchange: boolean;
  vargottama: boolean;
}
export function threeStars(lon: number): ThreeStars {
  const a = padaOf(lon), b = SLOT[a]!, c = FALLS_ON[a]!;
  return { a, b, c, exchange: b !== a && SLOT[b] === a, vargottama: b === a };
}

/* ---------- Area-by-area reading of a planet's Dasha (pp. 57–63, 82) ---------- */

export type Rating = 'good' | 'bad' | 'neutral' | 'mixed';
export interface AreaReading { d: IyerDivision; house: number; sign: number; rating: Rating; notes: string[] }

const KARAKA_D_LAGNA: Partial<Record<IyerDivision, PlanetId[]>> = { 24: ['Me'], 7: ['Ju'], 9: ['Ve'], 12: ['Su', 'Mo'], 3: ['Ma', 'Ju'] };
const OWN: Readonly<Record<PlanetId, readonly number[]>> = { Su: [4], Mo: [3], Ma: [0, 7], Me: [2, 5], Ju: [8, 11], Ve: [1, 6], Sa: [9, 10], Ra: [], Ke: [] };
const DIG_HOUSE: Partial<Record<PlanetId, number>> = { Su: 10, Ma: 10, Mo: 4, Ve: 4, Me: 1, Ju: 1, Sa: 7 };

/**
 * Iyer's reading of planet `p` in every division he uses (D-1 excluded: that is
 * the rest of the page). `combust`, `debilNoNB` and roles come from the D-1 model.
 */
export function areaReadings(chart: ChartResult, p: PlanetId, o: { combust: boolean; debilNoNB: boolean; yogi: PlanetId; duplicateYogi: PlanetId; avayogi: PlanetId }): AreaReading[] {
  const lon = chart.bodies[p].lon, d1 = signIndex(lon);
  return IYER_DIVISIONS.filter((d) => d !== 1).map((d) => {
    const sign = iyerVarga(d, lon), lag = iyerVarga(d, chart.asc.lon);
    const house = ((sign - lag + 12) % 12) + 1;
    const notes: string[] = [];
    let rating: Rating;
    const exalted = p !== 'Ra' && p !== 'Ke' && EXALT[p as keyof typeof EXALT][0] === sign;
    const dust = [3, 6, 8, 12].includes(house);
    const exception = (p === 'Ma' && house === 6) || (p === 'Me' && house === 8 && d === 4);
    if (dust && !exception) {
      rating = 'bad';
      notes.push(`house${house}`);
      if (exalted) notes.push('exaltedNoAvail');
      if (house === 3 || house === 8) notes.push(d === 10 && house === 3 ? 'retirement' : d === 8 ? 'strain' : 'severance');
    } else if (house === 2) { rating = 'neutral'; notes.push('house2'); }
    else { rating = 'good'; notes.push(exception ? `exception${house}` : `house${house}`); }
    // Combust in D-1: useless in every D-chart (NTP-2 rule 4) — but Saturn and Venus keep half their effects (NTP-1 p. 127).
    if (o.combust && (p === 'Ve' || p === 'Sa')) { if (rating === 'good') rating = 'mixed'; notes.push('combustHalf'); }
    else if (o.combust) { rating = 'bad'; notes.push(dust ? 'combustWorst' : 'combust'); }
    if (rating === 'good' && o.debilNoNB && p !== o.yogi && p !== o.duplicateYogi) { rating = 'bad'; notes.push('debilNoNB'); }
    if (rating === 'good' && o.debilNoNB && (p === o.yogi || p === o.duplicateYogi)) notes.push('debilYogi');
    if (p === o.yogi || p === o.duplicateYogi) notes.push(rating === 'good' ? 'yogiGood' : rating === 'bad' ? 'yogiLost' : 'yogi');
    if (p === o.avayogi && rating === 'good') { rating = 'mixed'; notes.push('avayogiGood'); }
    // Strengths that raise the magnitude (rule 6): exaltation, Vargottama, own sign, Digbala.
    if (rating === 'good' || rating === 'mixed') {
      if (exalted) notes.push('exalted');
      if (sign === d1) notes.push('vargottama');
      if (OWN[p].includes(sign)) notes.push('own');
      if (DIG_HOUSE[p] === house) notes.push('dig');
    }
    // Karaka in its own D-Lagna (rule 37).
    if (house === 1 && (KARAKA_D_LAGNA[d] ?? []).includes(p)) { rating = rating === 'good' ? 'mixed' : rating; notes.push('karakaLagna'); }
    // Lord of the D-Lagna (rules 35, 36).
    if (SIGN_LORD[lag] === p) {
      if (dust) notes.push('lagnaLordDust');
      if (p === o.yogi || p === o.duplicateYogi) notes.push('lagnaLordYogi');
    }
    // Only a strong Guru relieves a badly placed planet (rules 9, 27).
    if (rating === 'bad' && p !== 'Ju' && !o.combust) {
      const ju = iyerVarga(d, chart.bodies.Ju.lon);
      const juStrong = OWN.Ju.includes(ju) || EXALT.Ju[0] === ju;
      if (juStrong && aspectsSign('Ju', ju, sign)) { rating = 'mixed'; notes.push('guruRelief'); }
    }
    if (d === 11 && rating !== 'bad') notes.push(`gain${house}`);
    return { d, house, sign, rating, notes };
  });
}

/* ---------- Bhukti rules A–E (pp. 86–89) and the three-star rules F, G, D ---------- */

export type Good = 'good' | 'bad' | 'mixed';
/** Mutual relation of two planets (p. 86, Phaladeepika XV.30) — which of (a)–(e) hold. */
export function relation(chart: ChartResult, x: PlanetId, y: PlanetId): string[] {
  const sx = signIndex(chart.bodies[x].lon), sy = signIndex(chart.bodies[y].lon);
  const star = (p: PlanetId) => VIM_ORDER[Math.floor(chart.bodies[p].lon / 48_000) % 9]!;
  const out: string[] = [];
  if (SIGN_LORD[sx] === y && SIGN_LORD[sy] === x) out.push('a');
  if (sx === sy || (aspectsSign(x, sx, sy) && aspectsSign(y, sy, sx))) out.push('b');
  const dist = ((sy - sx + 12) % 12) + 1;
  if ([1, 4, 7, 10, 5, 9].includes(dist)) out.push('c');
  const tx = threeStars(chart.bodies[x].lon), ty = threeStars(chart.bodies[y].lon);
  if ([tx.b, tx.c].some((q) => padaLord(q) === y) || [ty.b, ty.c].some((q) => padaLord(q) === x)) out.push('d');
  if (star(x) === y && star(y) === x) out.push('e');
  return x === y ? ['self'] : out;
}

export function threeStarFindings(chart: ChartResult, p: PlanetId, yogi: PlanetId, avayogi: PlanetId): Finding[] {
  const lon = chart.bodies[p].lon, ts = threeStars(lon);
  const f: Finding[] = [];
  const lb = padaLord(ts.b), lc = padaLord(ts.c);
  const P = { planet: p, a: ts.a, b: ts.b, c: ts.c, lb, lc };
  f.push({ rule: 'M9stars', tone: 'info', params: P });
  if (lc === yogi && lc !== p) f.push({ rule: 'M9gYogi', tone: 'good', params: P });
  if (lc === avayogi && lc !== p) f.push({ rule: 'M9gAva', tone: 'bad', params: P });
  const d1 = signIndex(lon), nav = Math.floor((ts.b - 1) / 9);
  const dist = ((nav - d1 + 12) % 12) + 1;
  if ([3, 6, 8, 12].includes(dist)) f.push({ rule: ts.exchange ? 'M9fRect' : 'M9f', tone: ts.exchange ? 'mixed' : 'bad', params: { ...P, dist } });
  const ownStar = VIM_ORDER[Math.floor(lon / 48_000) % 9] === p;
  if (OWN[p].includes(d1) || ownStar || lb === p) f.push({ rule: 'M9d', tone: 'good', params: P });
  return f;
}

/** Classical Bhukti rules for Bhukti lord `b` in the Dasha of `d` (pp. 86–89, 94–101). */
export function bhuktiClassical(chart: ChartResult, d: PlanetId, b: PlanetId, toneOf: (p: PlanetId) => Good, bhavaOf: (p: PlanetId) => number): Finding[] {
  if (d === b) return [];
  const f: Finding[] = [];
  const sd = signIndex(chart.bodies[d].lon), sb = signIndex(chart.bodies[b].lon);
  const star = (p: PlanetId) => VIM_ORDER[Math.floor(chart.bodies[p].lon / 48_000) % 9]!;
  const rel = relation(chart, d, b);
  const Q = { dasha: d, bhukti: b, rel: rel.join(',') };
  const dist = ((sb - sd + 12) % 12) + 1;
  if ([3, 6, 8, 12].includes(dist)) f.push({ rule: 'BE', tone: 'bad', params: { ...Q, dist } });
  if ([3, 6, 8, 12].includes(bhavaOf(b))) f.push({ rule: 'BL', tone: 'bad', params: { ...Q, h: bhavaOf(b) } });
  if (SIGN_LORD[sb] === d || star(b) === d) f.push({ rule: 'BC1', tone: 'info', params: Q });
  if (SIGN_LORD[sd] === b || star(d) === b) f.push({ rule: 'BC2', tone: toneOf(b) === 'bad' ? 'bad' : 'info', params: Q });
  const td = toneOf(d), tb = toneOf(b), related = rel.length > 0;
  if (!related) f.push({ rule: 'BN', tone: 'info', params: Q });
  if (td === 'good') {
    if (tb === 'good') f.push({ rule: related ? 'BA1' : 'BA2', tone: 'good', params: Q });
    else if (tb === 'bad') f.push({ rule: related ? 'BA3' : 'BA4', tone: 'mixed', params: Q });
  } else if (td === 'bad') {
    if (tb === 'good') f.push({ rule: related ? 'BB1' : 'BB2', tone: related ? 'mixed' : 'bad', params: Q });
    else if (tb === 'bad') f.push({ rule: 'BB3', tone: 'bad', params: Q });
  }
  return f;
}

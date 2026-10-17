/**
 * Iyer's "Novel method of Dasha Bhukti reading" (H. R. Seshadri Iyer, New
 * Techniques of Prediction II, ch. II, PDF pp. 21–41). Pure; planets are
 * referred to by their Vimshottari ("Udu Dasha") order Ke Ve Su Mo Ma Ra Ju Sa Me.
 *
 *  - Enemy (Avayogi) of each planet: NTP-2 PDF p. 6 table (checked on the page
 *    image), repeated p. 27. It is the planet 5 places later in Udu Dasha order.
 *  - Triple sets (groups of common friendship): {Ke, Mo, Ju}, {Ve, Ma, Sa},
 *    {Su, Ra, Me} (p. 6). When one becomes a Yogi the other two "imbibe yoga
 *    character" — the planets 3 places apart in Udu Dasha order.
 *  - Starter of a planet in a Dasha, "easy way" (pp. 31–33): with S = the
 *    planet's stellar lord (for the Moon, S = the Dasha lord), count inclusively
 *    in Udu Dasha order (a) from the Sun's stellar lord to S, doubled,
 *    (b) from the Dasha lord to S, and add (c) the birth weekday (Sunday = 1);
 *    the remainder mod 9 counted from the Sun in Dasha order (Su Mo Ma Ra Ju Sa
 *    Me Ke Ve; remainder 0 = the 9th) is the Starter.
 *  - Ruler (p. 32): advance the Starter by as many places as the stellar lord
 *    lies after the planet in Udu Dasha order. A planet in its own star and the
 *    Lagna have Starter = Ruler (p. 33).
 *  - Dasha Raja Yogi (p. 36): the planet common to columns 1 and 2 of the Dasha
 *    chart, i.e. the stellar lord S whose Starter is S itself (unique: the
 *    Starter advances 3 places per place of S).
 *  - Dasha Yogi (pp. 29–30): lord of the star at Birth Yoga point + 2 × Dasha
 *    lord's longitude; the Moon's is the Birth Yogi; for Rahu/Ketu the node
 *    whose star lord's enemy is the other node's star lord is worked first and
 *    the other node takes the enemy of that result.
 * Verified against Iyer's worked Chart 1 (Guru Dasha, pp. 23–34): all ten
 * Starters and Rulers, the Raja Yogi and the three Dasha Yogis
 * (tests/unit/iyer.test.ts).
 */
import type { Arcsec, PlanetId } from '../types';
import { VIM_ORDER, nakshatraIndex, norm } from '../zodiac';

const vim = (p: PlanetId) => VIM_ORDER.indexOf(p);
const at = (i: number): PlanetId => VIM_ORDER[((i % 9) + 9) % 9]!;
/** Places from `a` to `b` in Udu Dasha order, 0 … 8. */
const ahead = (a: PlanetId, b: PlanetId) => (((vim(b) - vim(a)) % 9) + 9) % 9;

/** Iyer's single enemy of each planet (NTP-2 p. 6). */
export const ENEMY: Readonly<Record<PlanetId, PlanetId>> = {
  Su: 'Sa', Mo: 'Me', Ma: 'Ke', Me: 'Ma', Ju: 'Su', Ve: 'Ju', Sa: 'Mo', Ra: 'Ve', Ke: 'Ra',
};
export const enemyOf = (p: PlanetId): PlanetId => ENEMY[p];

/** The three triple sets, in Iyer's order (NTP-2 p. 6). */
export const TRIOS: readonly (readonly PlanetId[])[] = [['Ke', 'Mo', 'Ju'], ['Ve', 'Ma', 'Sa'], ['Su', 'Ra', 'Me']];
export const trioOf = (p: PlanetId): readonly PlanetId[] => TRIOS.find((t) => t.includes(p))!;
export const sameTrio = (a: PlanetId, b: PlanetId) => trioOf(a).includes(b);

/** Order used to count the Starter remainder: "counted from Sun in Dasha order". */
const FROM_SUN = (n: number): PlanetId => at(vim('Su') + ((n + 8) % 9));

export type ChartPoint = PlanetId | 'As';
export interface DashaChartRow { point: ChartPoint; stellarLord: PlanetId; starter: PlanetId; ruler: PlanetId }
export interface DashaChart {
  dashaLord: PlanetId;
  rows: DashaChartRow[];
  rajaYogi: PlanetId;
}

/**
 * Starter for stellar lord `s` in the Dasha of `dashaLord`. `sunStar` is the
 * Sun's stellar lord, `weekday` 1 = Sunday … 7 = Saturday.
 */
export function starterFor(s: PlanetId, dashaLord: PlanetId, sunStar: PlanetId, weekday: number): PlanetId {
  const a = ahead(sunStar, s) + 1;
  const b = ahead(dashaLord, s) + 1;
  return FROM_SUN((2 * a + b + weekday) % 9);
}

/**
 * The Dasha chart of `dashaLord`. `stellarLords` are the natal stellar lords
 * of the nine planets and the Lagna (the Moon's is replaced by the Dasha lord).
 */
export function dashaChart(stellarLords: Readonly<Record<ChartPoint, PlanetId>>, dashaLord: PlanetId, weekday: number): DashaChart {
  const sunStar = stellarLords.Su;
  const points: ChartPoint[] = [...VIM_ORDER_WEEK, 'As'];
  const rows = points.map((point) => {
    const s = point === 'Mo' ? dashaLord : stellarLords[point];
    const starter = starterFor(s, dashaLord, sunStar, weekday);
    const ruler = point === 'As' ? starter : at(vim(starter) + ahead(point, s));
    return { point, stellarLord: s, starter, ruler };
  });
  const rajaYogi = VIM_ORDER.find((s) => starterFor(s, dashaLord, sunStar, weekday) === s)!;
  return { dashaLord, rows, rajaYogi };
}
/** Week-day order of the Dasha chart's columns (p. 22): Sun … Saturn, Rahu, Ketu. */
const VIM_ORDER_WEEK: PlanetId[] = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'];

const starLord = (lon: Arcsec): PlanetId => VIM_ORDER[nakshatraIndex(lon) % 9]!;

/**
 * Dasha Yogi of every Dasha lord (pp. 29–30). `yogaPoint` is the Birth Yoga
 * point (Sun + Moon + 93°20′), `lons` the natal longitudes, `birthYogi` its lord.
 */
export function dashaYogis(yogaPoint: Arcsec, lons: Readonly<Record<PlanetId, Arcsec>>, birthYogi: PlanetId): Record<PlanetId, PlanetId> {
  const direct = (p: PlanetId) => starLord(norm(yogaPoint + 2 * lons[p]));
  const out = {} as Record<PlanetId, PlanetId>;
  for (const p of VIM_ORDER) if (p !== 'Ra' && p !== 'Ke') out[p] = direct(p);
  out.Mo = birthYogi;
  // Nodes: work first the node whose star lord's enemy is the other's star lord.
  const raStar = starLord(lons.Ra), keStar = starLord(lons.Ke);
  const first: 'Ra' | 'Ke' = enemyOf(raStar) === keStar ? 'Ra' : 'Ke';
  const second = first === 'Ra' ? 'Ke' : 'Ra';
  out[first] = direct(first);
  out[second] = enemyOf(out[first]);
  return out;
}

/**
 * Graha Samayam (NTP-1 PDF p. 28, checked on the page image): (signs from
 * Aries to the Lagna + signs from the Lagna to the Dasha lord) × 2 × its Udu
 * Dasha years, remainder by 27 → state 1 … 27. Counts are taken inclusively
 * (Aries to Aries = 1), the usual Indian convention; remainder 0 = state 27.
 */
export function grahaSamayam(lagnaSign: number, planetSign: number, years: number): number {
  const a = lagnaSign + 1;
  const b = ((planetSign - lagnaSign + 12) % 12) + 1;
  const r = ((a + b) * 2 * years) % 27;
  return r === 0 ? 27 : r;
}


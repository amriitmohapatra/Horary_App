/**
 * NTP guidance — H. R. Seshadri Iyer's rules (New Techniques of Prediction)
 * applied to a cast chart. Pure. The engine returns rule ids, tones and
 * parameters; the wording and page citations live in the UI rule catalogue
 * (src/ui/ntpRules.ts). Every rule here is cited to its source page there.
 *
 * Definitions (NTP-2 ch. I, PDF pp. 5–9; NTP-1 PDF pp. 17–19, 93–97):
 *  - Birth Yoga point = Sun + Moon + 93°20′ (Vishkambha yoga starts at
 *    Pushyami); Birth Yogi = its star lord; Duplicate Yogi = lord of the sign
 *    holding it; Avayogi = the Yogi's one enemy (ENEMY table).
 *  - Zero Rasis = Dagdha rasis of the birth tithi (Iyer's own table, same as
 *    the app's). Bhavas counted from them, their lords and planets in them
 *    lose power unless retrograde.
 *  - Houses: Sripati bhavas. Lord of a bhava = lord of the sign holding its
 *    madhya ("cuspal point"); a planet's bhava = the span it lies in.
 *  - Positive bhavas 1 2 4 5 7 9 10 11; negative (dusthana) 3 6 8 12.
 *    Positive rasi = own sign; negative rasi = Zero Rasi or debilitation sign.
 *  - Positive planets: lords of positive bhavas not in Zero Rasis, the Birth
 *    Yogi and the Duplicate Yogi. Negative planets: lords of negative bhavas,
 *    lords of Zero Rasis, the Birth Avayogi; Rahu and Ketu are natural
 *    negatives (unless a Yogi). Both kinds of reason → "mixed".
 *  - Stars take the character of their lords. Character multiplies like
 *    signs: + in + → +, + in − → −, − in + → −, − in − → +.
 */
import type { ChartResult, PlanetId } from '../types';
import { PLANETS } from '../types';
import { SIGN_LORD, nakshatraIndex, signIndex } from '../zodiac';
import { bhavaChart } from '../houses/bhava';
import { isCombust } from '../combust';
import { tithi as tithiOf } from '../panchanga/panchanga';
import { dagdhaRashis, yogiPoints } from '../yogi/yogi';
import { DEBIL_SIGN, EXALT_SIGN } from '../strength/common';
import { mahadashas, type DashaPeriod } from '../dasha/vimshottari';
import { ENEMY, dashaChart, dashaYogis, sameTrio, trioOf, type ChartPoint, type DashaChart } from './dashaChart';
import { VIM_ORDER } from '../zodiac';
import { aspectsSign, ntp1, type Ntp1Planet } from './ntp1';
import { areaReadings, bhuktiClassical, threeStarFindings, threeStars, type AreaReading, type ThreeStars } from './ntp2b';

export type Pol = '+' | '-' | 'mixed' | '0';
export type Tone = 'good' | 'bad' | 'mixed' | 'info';
export interface Finding { rule: string; tone: Tone; params?: Record<string, string | number> }

export const POSITIVE_BHAVAS = [1, 2, 4, 5, 7, 9, 10, 11] as const;
export const NEGATIVE_BHAVAS = [3, 6, 8, 12] as const;
const isPosBhava = (h: number) => (POSITIVE_BHAVAS as readonly number[]).includes(h);

/** Own signs of the seven grahas (nodes own none in Iyer's lordship scheme). */
const OWN_SIGNS: Readonly<Record<PlanetId, readonly number[]>> = {
  Su: [4], Mo: [3], Ma: [0, 7], Me: [2, 5], Ju: [8, 11], Ve: [1, 6], Sa: [9, 10], Ra: [], Ke: [],
};

/** Aspects as Iyer gives them (NTP-1 pp. 46, 126): 7th for all; Mars 4/8, Jupiter 5/9, Saturn, Rahu, Ketu 3/10. */
export function aspects(from: PlanetId, fromSign: number, toSign: number): boolean {
  return fromSign !== toSign && aspectsSign(from, fromSign, toSign);
}

const mul = (a: Pol, b: Pol): Pol => {
  if (a === '0' || b === '0') return '0';
  if (a === 'mixed' || b === 'mixed') return 'mixed';
  return a === b ? '+' : '-';
};

export interface PlanetNtp {
  id: PlanetId;
  sign: number;
  bhava: number;
  nakshatra: number;
  starLord: PlanetId;
  owns: number[];
  reasonsPos: string[];
  reasonsNeg: string[];
  pol: Pol;
  rasiPol: Pol;
  bhavaPol: Pol;
  starPol: Pol;
  /** Character after placement (planet × bhava, rasi, eclipse). */
  effective: Pol;
  exalted: boolean;
  debilitated: boolean;
  ownSign: boolean;
  zeroRasi: boolean;
  combust: boolean;
  retrograde: boolean;
  roles: ('yogi' | 'duplicateYogi' | 'avayogi')[];
  group: 'yogi' | 'avayogi' | 'other';
  findings: Finding[];
  tone: Tone;
  ntp1: Ntp1Planet;
  /** Iyer's area-by-area (D-chart) reading of this planet's Dasha (NTP-2 pp. 57–63, 82). */
  areas: AreaReading[];
  stars: ThreeStars;
}

export interface BhuktiReading {
  lord: PlanetId;
  start: number;
  end: number;
  starter: PlanetId;
  ruler: PlanetId;
  findings: Finding[];
  /** Tone at the start (Starter) and the final tone (Ruler — "the Ruler is most important"). */
  startTone: Tone;
  finalTone: Tone;
  /** Classical Bhukti rules A–E (NTP-2 ch. IV, pp. 86–89). */
  classical: Finding[];
}
export interface DashaReading {
  lord: PlanetId;
  start: number;
  end: number;
  dashaYogi: PlanetId;
  rajaYogi: PlanetId;
  chart: DashaChart;
  findings: Finding[];
  bhuktis: BhuktiReading[];
  tone: Tone;
}

export interface NtpModel {
  yogaPoint: number;
  yogi: PlanetId;
  duplicateYogi: PlanetId;
  avayogi: PlanetId;
  yogiTrio: readonly PlanetId[];
  avayogiTrio: readonly PlanetId[];
  tithi: number;
  zeroRasis: readonly number[];
  zeroBhavas: number[];
  bhavaLords: PlanetId[];
  weekday: number;
  lagnaStarLord: PlanetId;
  chartFindings: Finding[];
  planets: PlanetNtp[];
  dashaYogis: Record<PlanetId, PlanetId>;
  birthDashaLord: PlanetId;
}

const toneOf = (fs: Finding[]): Tone => {
  const g = fs.filter((f) => f.tone === 'good').length, b = fs.filter((f) => f.tone === 'bad').length;
  if (!g && !b) return 'info';
  if (g && b) return g >= 2 * b ? 'good' : b >= 2 * g ? 'bad' : 'mixed';
  return g ? 'good' : 'bad';
};
export { toneOf };

/**
 * The NTP model of a chart. `weekday` is the birth week day, 1 = Sunday (the
 * Hindu vara, sunrise to sunrise — Iyer does not say; see the guide).
 */
export function ntpModel(chart: ChartResult, weekday: number): NtpModel {
  const sun = chart.bodies.Su, moon = chart.bodies.Mo;
  const y = yogiPoints(sun.lon, moon.lon, { avayogi: 'sixth-nakshatra' });
  const yogi = y.yogi, duplicateYogi = y.duplicateYogi, avayogi = ENEMY[yogi];
  const t = tithiOf(sun.lon, moon.lon).num;
  const zeroRasis = dagdhaRashis(t);
  const bc = bhavaChart(chart, 'sripati');
  const bhavaLords = bc.madhyaSign.map((s) => SIGN_LORD[s]!);
  const zeroBhavas = bc.madhyaSign.map((s, i) => (zeroRasis.includes(s) ? i + 1 : 0)).filter(Boolean);
  const zeroLords = new Set(zeroRasis.map((s) => SIGN_LORD[s]!));

  const base = (p: PlanetId) => {
    const owns = bhavaLords.map((l, i) => (l === p ? i + 1 : 0)).filter(Boolean);
    const pos: string[] = [], neg: string[] = [];
    for (const h of owns) {
      if (isPosBhava(h) && !zeroBhavas.includes(h)) pos.push(`lord${h}`);
      if (!isPosBhava(h)) neg.push(`lord${h}`);
    }
    if (zeroLords.has(p)) neg.push('zeroLord');
    if (p === yogi) pos.push('yogi');
    if (p === duplicateYogi) pos.push('duplicateYogi');
    if (p === avayogi) neg.push('avayogi');
    if ((p === 'Ra' || p === 'Ke') && p !== yogi && p !== duplicateYogi) neg.push('node');
    const pol: Pol = pos.length && neg.length ? 'mixed' : pos.length ? '+' : neg.length ? '-' : '0';
    return { owns, pos, neg, pol };
  };
  const bases = Object.fromEntries(PLANETS.map((p) => [p, base(p)])) as Record<PlanetId, ReturnType<typeof base>>;
  const signOf = (p: PlanetId) => signIndex(chart.bodies[p].lon);
  const starOf = (p: PlanetId) => VIM_ORDER[nakshatraIndex(chart.bodies[p].lon) % 9]!;
  const isYogiish = (p: PlanetId) => p === yogi || p === duplicateYogi;
  const n1 = ntp1(chart, bc, yogi, bhavaLords);

  const planets: PlanetNtp[] = PLANETS.map((p) => {
    const b = bases[p];
    const sign = signOf(p), bhava = bc.houses[p], star = starOf(p);
    const zero = zeroRasis.includes(sign);
    const debil = p !== 'Ra' && p !== 'Ke' && DEBIL_SIGN[p] === sign;
    const exalted = p !== 'Ra' && p !== 'Ke' && EXALT_SIGN[p] === sign;
    const own = OWN_SIGNS[p].includes(sign);
    const rasiPol: Pol = zero || debil ? '-' : own ? '+' : '0';
    const bhavaPol: Pol = isPosBhava(bhava) ? '+' : '-';
    const starPol = bases[star].pol;
    const combust = isCombust(chart.bodies[p], sun);
    const retro = chart.bodies[p].retrograde;
    const placeNeg = bhavaPol === '-' || rasiPol === '-' || combust;
    const effective: Pol = b.pol === 'mixed' || b.pol === '0' ? b.pol : mul(b.pol, placeNeg ? '-' : '+');
    const roles: PlanetNtp['roles'] = [];
    if (p === yogi) roles.push('yogi');
    if (p === duplicateYogi) roles.push('duplicateYogi');
    if (p === avayogi) roles.push('avayogi');
    const group = sameTrio(p, yogi) ? 'yogi' : sameTrio(p, avayogi) ? 'avayogi' : 'other';
    const f: Finding[] = [];
    const P = { planet: p, star, bhava, sign };

    // --- Character of the planet as positive / negative (pp. 7–8).
    const roleList: ('+' | '-')[] = b.pol === 'mixed' ? ['+', '-'] : b.pol === '+' || b.pol === '-' ? [b.pol] : [];
    for (const r of roleList) {
      const role = b.pol === 'mixed' ? (r === '+' ? 'posRole' : 'negRole') : '';
      if (r === '+') {
        if (bhavaPol === '+' && rasiPol === '+') f.push({ rule: 'T1', tone: 'good', params: { ...P, role } });
        else if (bhavaPol === '+' && rasiPol === '-' && !combust) f.push({ rule: 'T2', tone: 'mixed', params: { ...P, role } });
        else if (bhavaPol === '-' || rasiPol === '-' || combust) {
          f.push(retro ? { rule: 'T4', tone: 'mixed', params: { ...P, role } } : { rule: 'T3', tone: 'bad', params: { ...P, role } });
        } else f.push({ rule: 'T1b', tone: 'good', params: { ...P, role } });
        if (starPol === '+') f.push({ rule: 'T5', tone: 'good', params: { ...P, role } });
        if (starPol === '-') f.push({ rule: 'T6', tone: 'bad', params: { ...P, role } });
        if ((bhavaPol === '-' || rasiPol === '-') && star === p) f.push({ rule: 'T7', tone: 'mixed', params: { ...P, role } });
        if (star === ENEMY[p]) f.push({ rule: 'T15p', tone: 'bad', params: { ...P, role } });
      } else {
        if (bhavaPol === '-' && rasiPol === '-' && combust) f.push({ rule: 'T11', tone: 'good', params: { ...P, role } });
        else if (bhavaPol === '+' && rasiPol !== '-' && !combust) f.push({ rule: 'T8', tone: 'bad', params: { ...P, role } });
        else if (bhavaPol === '+' && (rasiPol === '-' || combust)) f.push({ rule: 'T9', tone: 'good', params: { ...P, role } });
        else if (bhavaPol === '-') f.push({ rule: 'T10', tone: 'good', params: { ...P, role } });
        if (starPol === '+') f.push({ rule: 'T12', tone: 'bad', params: { ...P, role } });
        if (starPol === '-') f.push({ rule: 'T13', tone: 'good', params: { ...P, role } });
        if (star === ENEMY[p]) f.push({ rule: 'T15n', tone: 'good', params: { ...P, role } });
        if ((zero || rasiPol === '-' || bhavaPol === '-') && retro) f.push({ rule: 'O9', tone: 'bad', params: { ...P, role } });
        else if (retro) f.push({ rule: 'O6', tone: 'bad', params: { ...P, role } });
      }
    }
    if (b.pol === 'mixed') f.push({ rule: 'T33', tone: 'mixed', params: P });
    if (zero && !retro && p !== 'Ra' && p !== 'Ke') f.push({ rule: 'ZR', tone: 'bad', params: P });
    if (zero && retro) f.push({ rule: 'T30', tone: 'good', params: P });
    if (rasiPol === '-' && retro && (b.pol === '+' || b.pol === 'mixed') && !zero) f.push({ rule: 'O5', tone: 'mixed', params: P });

    // --- Yoga relations (pp. 8–20).
    if (star === yogi && p !== yogi) f.push({ rule: 'T14', tone: 'good', params: { ...P, yogi } });
    if (star === duplicateYogi && p !== duplicateYogi && star !== yogi) f.push({ rule: 'T14d', tone: 'good', params: { ...P, yogi: duplicateYogi } });
    if (star === avayogi && p !== avayogi && p !== 'Ra' && p !== 'Ke') f.push({ rule: 'O2a', tone: 'bad', params: { ...P, avayogi } });
    if (p !== yogi && group === 'yogi') f.push({ rule: 'T16y', tone: 'good', params: { ...P, yogi } });
    if (p !== avayogi && group === 'avayogi') f.push({ rule: 'T16a', tone: 'bad', params: { ...P, avayogi } });
    if (p !== yogi && p !== star && sameTrio(star, yogi) && group !== 'yogi') f.push({ rule: 'T16s', tone: 'good', params: { ...P, yogi } });
    const withOrAspect = (q: PlanetId) => q !== p && (signOf(q) === sign || aspects(q, signOf(q), sign));
    if (withOrAspect(yogi)) f.push({ rule: 'T17y', tone: 'good', params: { ...P, yogi, how: signOf(yogi) === sign ? 'with' : 'aspect' } });
    if (withOrAspect(avayogi) && p !== 'Ra' && p !== 'Ke') f.push({ rule: 'T17a', tone: 'bad', params: { ...P, avayogi, how: signOf(avayogi) === sign ? 'with' : 'aspect' } });

    if (isYogiish(p)) {
      if (p === duplicateYogi && p !== yogi) f.push({ rule: 'T20', tone: 'good', params: P });
      f.push({ rule: 'O1', tone: 'good', params: P });
      if (bhavaPol === '-' || rasiPol === '-') f.push({ rule: 'T18', tone: 'mixed', params: P });
      if (b.neg.some((r) => r.startsWith('lord') || r === 'zeroLord')) f.push({ rule: 'T19', tone: 'good', params: P });
      if ((p === duplicateYogi && star === yogi) || (p === yogi && star === duplicateYogi && yogi !== duplicateYogi)) f.push({ rule: 'O12', tone: 'good', params: P });
      if (exalted) f.push({ rule: 'T19x', tone: 'good', params: P });
    }
    if (p === avayogi) {
      const negPlace = bhavaPol === '-' || rasiPol === '-' || starPol === '-' || combust;
      if (negPlace) f.push({ rule: 'T22', tone: 'good', params: P });
      if (starPol === '+' && star !== yogi && star !== duplicateYogi) f.push({ rule: 'T21', tone: 'bad', params: P });
      if (star === yogi || star === duplicateYogi) f.push({ rule: 'T23', tone: 'good', params: { ...P, yogi: star } });
      if (zeroLords.has(p)) f.push({ rule: 'T24', tone: 'good', params: P });
      if (star === ENEMY[p]) f.push({ rule: 'T26', tone: 'good', params: P });
    }
    if (p === 'Ra' || p === 'Ke') {
      if (zero) f.push({ rule: p === 'Ra' ? 'O7r' : 'O7k', tone: 'good', params: P });
      else if (zeroLords.has(star)) f.push({ rule: 'T27', tone: 'good', params: P });
      if (star === avayogi || signOf(avayogi) === sign) f.push({ rule: 'T28', tone: 'good', params: { ...P, avayogi } });
      if (p === 'Ra' && star === 'Ke') f.push({ rule: 'T29r', tone: 'good', params: P });
      if (p === 'Ke' && star === 'Ra') f.push({ rule: 'T29k', tone: 'bad', params: P });
    }
    // Stellar lord (O8, T31) and exchange of stellar lords (T32).
    if (star !== p) f.push({ rule: 'O8', tone: 'info', params: P });
    const partner = PLANETS.find((q) => q !== p && starOf(q) === p && star === q);
    if (partner) f.push({ rule: 'T32', tone: 'info', params: { ...P, other: partner } });

    // NTP-1: eclipsed planets (p. 127), then the planet-state and bhava rules.
    if (combust) f.push({ rule: p === 'Sa' || p === 'Ve' ? 'N1combustHalf' : bhavaPol === '-' ? 'N1combustWorst' : 'N1combust', tone: p === 'Sa' || p === 'Ve' ? 'mixed' : 'bad', params: P });
    f.push(...n1.planets[p].findings);
    f.push(...threeStarFindings(chart, p, yogi, avayogi));
    if (p === 'Ra' || p === 'Ke') f.push({ rule: 'N2node', tone: 'info', params: P });
    const debilNoNB = f.some((x) => x.rule === 'N1debil');
    return {
      ntp1: n1.planets[p].info,
      areas: areaReadings(chart, p, { combust, debilNoNB, yogi, duplicateYogi, avayogi }),
      stars: threeStars(chart.bodies[p].lon),
      id: p, sign, bhava, nakshatra: nakshatraIndex(chart.bodies[p].lon), starLord: star, owns: b.owns,
      reasonsPos: b.pos, reasonsNeg: b.neg, pol: b.pol, rasiPol, bhavaPol, starPol, effective,
      exalted, debilitated: debil, ownSign: own, zeroRasi: zero, combust, retrograde: retro,
      roles, group, findings: f, tone: toneOf(f),
    };
  });

  // --- Chart-level points.
  const cf: Finding[] = [];
  const lagnaStar = VIM_ORDER[nakshatraIndex(chart.asc.lon) % 9]!;
  const lagnaSign = signIndex(chart.asc.lon);
  if (lagnaStar === yogi) cf.push({ rule: 'T34y', tone: 'good', params: { star: lagnaStar } });
  if (lagnaStar === avayogi) cf.push({ rule: 'T34a', tone: 'bad', params: { star: lagnaStar } });
  const lagnaLord = bhavaLords[0]!;
  if (lagnaLord === yogi || lagnaStar === yogi) cf.push({ rule: 'L2', tone: 'good', params: { lord: lagnaLord, star: lagnaStar, yogi } });
  const lsStar = starOf(lagnaStar);
  if (bc.houses[lagnaStar] === 1 || lsStar === lagnaStar) {
    cf.push({ rule: 'L3', tone: 'info', params: { star: lagnaStar } });
    if (lagnaStar === yogi || lsStar === yogi) cf.push({ rule: 'L3y', tone: 'good', params: { star: lagnaStar, yogi } });
  }
  if (zeroRasis.includes(lagnaSign)) cf.push({ rule: 'L4c', tone: 'good', params: { lord: lagnaLord } });
  if (bases[lagnaLord].pol === '-') cf.push({ rule: 'L4b', tone: 'good', params: { lord: lagnaLord } });
  for (const p of PLANETS) if (bases[p].pol === '-' && starOf(p) === lagnaStar && p !== lagnaStar) cf.push({ rule: 'L4a', tone: 'good', params: { planet: p, star: lagnaStar } });
  const dustZero = [6, 8, 12].filter((h) => zeroBhavas.includes(h));
  if (dustZero.length) cf.push({ rule: 'O4', tone: 'good', params: { list: dustZero.join(', ') } });
  if (!zeroRasis.length) cf.push({ rule: 'ZR0', tone: 'info' });
  if (yogi === duplicateYogi) cf.push({ rule: 'YD', tone: 'good', params: { yogi } });
  cf.push(...n1.chartFindings);

  const lons = Object.fromEntries(PLANETS.map((p) => [p, chart.bodies[p].lon])) as Record<PlanetId, number>;
  const dy = dashaYogis(y.yogiPoint.lon, lons, yogi);
  const moonDeg = chart.profile.dashaMoon === 'exact' ? moon.lonDeg : moon.lon / 3600;
  const birthDashaLord = mahadashas(moonDeg, chart.moment.jdUT, chart.profile.dashaYearDays)[0]!.lords[0]!;
  const birthChart = dashaChart(stellarLordsOf(chart), birthDashaLord, weekday);
  const inLagna = (p: PlanetId) => bc.houses[p] === 1;
  if (inLagna(yogi) && (inLagna(dy[birthDashaLord]) || inLagna(birthChart.rajaYogi))) {
    cf.push({ rule: 'L1', tone: 'good', params: { yogi, dasha: birthDashaLord } });
  }

  return {
    yogaPoint: y.yogiPoint.lon, yogi, duplicateYogi, avayogi,
    yogiTrio: trioOf(yogi), avayogiTrio: trioOf(avayogi),
    tithi: t, zeroRasis, zeroBhavas, bhavaLords, weekday, lagnaStarLord: lagnaStar,
    chartFindings: cf, planets, dashaYogis: dy, birthDashaLord,
  };
}

export function stellarLordsOf(chart: ChartResult): Record<ChartPoint, PlanetId> {
  const out = {} as Record<ChartPoint, PlanetId>;
  for (const p of PLANETS) out[p] = VIM_ORDER[nakshatraIndex(chart.bodies[p].lon) % 9]!;
  out.As = VIM_ORDER[nakshatraIndex(chart.asc.lon) % 9]!;
  return out;
}

/** "X crosses Y": in X's row of the Dasha chart, Y is the Starter or the Ruler (p. 36 P.S.). */
const crosses = (dc: DashaChart, x: ChartPoint, y: PlanetId) => {
  const r = dc.rows.find((q) => q.point === x)!;
  return r.starter === y || r.ruler === y;
};

/** Iyer's reading of one Mahadasha and its Bhuktis (NTP-2 pp. 21–41). */
export function dashaReading(chart: ChartResult, m: NtpModel, maha: DashaPeriod, bhuktis: DashaPeriod[]): DashaReading {
  const D = maha.lords[0]!;
  const dc = dashaChart(stellarLordsOf(chart), D, m.weekday);
  const dashaYogi = m.dashaYogis[D];
  const raja = dc.rajaYogi;
  const birthYogi = m.yogi, ava = m.avayogi;
  const f: Finding[] = [];
  const P = { dasha: D, dashaYogi, raja, yogi: birthYogi, avayogi: ava };
  if (crosses(dc, birthYogi, dashaYogi) && birthYogi !== dashaYogi) f.push({ rule: 'D8', tone: 'good', params: P });
  if (crosses(dc, birthYogi, birthYogi)) f.push({ rule: 'D9', tone: 'info', params: P });
  if (crosses(dc, ava, birthYogi)) f.push({ rule: 'D10', tone: 'mixed', params: P });
  if (crosses(dc, birthYogi, D) || crosses(dc, dashaYogi, D)) f.push({ rule: 'D13', tone: 'good', params: P });
  if (birthYogi === dashaYogi) f.push({ rule: 'D12', tone: 'good', params: P });
  const key = [...new Set<PlanetId>([D, birthYogi, dashaYogi, raja])];
  const crossPairs = key.flatMap((a) => key.filter((b) => b !== a && crosses(dc, a, b)).map((b) => `${a}→${b}`));
  if (crossPairs.length) f.push({ rule: 'D14', tone: 'good', params: { ...P, list: crossPairs.join(', ') } });
  if (ENEMY[birthYogi] === dashaYogi || ENEMY[dashaYogi] === birthYogi) f.push({ rule: 'D15', tone: 'mixed', params: P });
  if (ENEMY[D] === birthYogi) f.push({ rule: 'D17', tone: 'bad', params: P });
  const dPlanet = m.planets.find((p) => p.id === D)!;
  const lag = dc.rows.find((r) => r.point === 'As')!;
  f.push({ rule: 'D5', tone: sameTrio(lag.starter, birthYogi) ? 'good' : sameTrio(lag.starter, ava) ? 'bad' : 'info', params: { ...P, starter: lag.starter } });

  const polOf = (p: PlanetId): Pol => m.planets.find((q) => q.id === p)!.effective;
  const yogis = new Set<PlanetId>([birthYogi, dashaYogi, raja]);
  const readings: BhuktiReading[] = bhuktis.map((bp) => {
    const X = bp.lords[bp.lords.length - 1]!;
    const row = dc.rows.find((r) => r.point === X)!;
    const bf: Finding[] = [];
    const judge = (Y: PlanetId, which: 'starter' | 'ruler'): Finding[] => {
      const out: Finding[] = [];
      const px = polOf(X), py = polOf(Y);
      const Q = { bhukti: X, crossed: Y, which };
      const isY = yogis.has(Y), xIsY = yogis.has(X);
      if (xIsY && isY && X !== Y) out.push({ rule: 'B5', tone: 'good', params: Q });
      if (X === birthYogi && Y === ENEMY[X]) out.push({ rule: py === '-' ? 'B11' : 'B15', tone: py === '-' ? 'good' : 'bad', params: Q });
      else if (X === birthYogi && py === '-') out.push({ rule: 'B20', tone: 'bad', params: Q });
      if (X === ava && Y === ENEMY[X]) out.push({ rule: py === '-' ? 'B12' : 'B14', tone: 'good', params: Q });
      else if (X === ava && py === '+' && !isY) out.push({ rule: 'B19', tone: 'bad', params: Q });
      if ((X === raja || X === dashaYogi) && Y === ava) out.push({ rule: 'B21', tone: 'bad', params: Q });
      if (X === 'Ra' && Y === 'Ra' && birthYogi === 'Sa') out.push({ rule: 'B16', tone: 'good', params: Q });
      if (X === 'Ke' && Y === 'Ke' && birthYogi === 'Ma') out.push({ rule: 'B17', tone: 'good', params: Q });
      if (px === '-') {
        if (xIsY) out.push({ rule: 'B4', tone: 'good', params: Q });
        else if (isY && Y === ENEMY[X]) out.push({ rule: 'B10', tone: 'good', params: Q });
        else if (isY) out.push({ rule: 'B2', tone: 'good', params: Q });
        else if (py === '-') out.push({ rule: m.planets.find((q) => q.id === X)!.retrograde ? 'B13' : 'B1', tone: 'good', params: Q });
      } else if (px === '+') {
        if (isY && Y === ENEMY[X]) out.push({ rule: 'B9', tone: 'mixed', params: Q });
        else if (Y === X || py === '+' || isY) out.push({ rule: 'B3', tone: 'good', params: Q });
        if (Y === ava || py === '-' || Y === ENEMY[X]) out.push({ rule: 'B18', tone: 'bad', params: Q });
        if (Y === ENEMY[ava]) out.push({ rule: 'B22', tone: 'good', params: Q });
      }
      if (sameTrio(Y, birthYogi)) out.push({ rule: 'D16', tone: 'good', params: Q });
      return out;
    };
    const s = judge(row.starter, 'starter'), r = row.ruler === row.starter ? [] : judge(row.ruler, 'ruler');
    const px = polOf(X), ps = polOf(row.starter), pr = polOf(row.ruler);
    if (px === '+' && ps === '-' && (pr === '+' || yogis.has(row.ruler))) bf.push({ rule: 'B6', tone: 'mixed', params: { bhukti: X } });
    if (px === '-' && ps === '-' && pr === '+') bf.push({ rule: 'B7', tone: 'mixed', params: { bhukti: X } });
    if ((px === '+' && ps === '+' && pr === '+') || (px === '-' && ps === '-' && pr === '-')) bf.push({ rule: 'B8', tone: 'good', params: { bhukti: X } });
    if (row.ruler === ENEMY[D] && dPlanet.effective === '-') bf.push({ rule: 'D6', tone: 'bad', params: { bhukti: X, dasha: D } });
    const good = (q: PlanetId) => { const t = m.planets.find((z) => z.id === q)!.tone; return t === 'good' || t === 'bad' ? t : 'mixed'; };
    const classical = bhuktiClassical(chart, D, X, good, (q) => m.planets.find((z) => z.id === q)!.bhava);
    bf.push(...s, ...r);
    return {
      lord: X, start: bp.start, end: bp.end, starter: row.starter, ruler: row.ruler, findings: bf, classical,
      startTone: toneOf(s), finalTone: row.ruler === row.starter ? toneOf(s) : toneOf(r),
    };
  });
  return {
    lord: D, start: maha.start, end: maha.end, dashaYogi, rajaYogi: raja, chart: dc, findings: f, bhuktis: readings,
    tone: toneOf([...f, ...dPlanet.findings]),
  };
}


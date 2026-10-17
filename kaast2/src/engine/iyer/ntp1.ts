/**
 * NTP-1 rules on planet states, bhava placement and yogas (Iyer, New
 * Techniques of Prediction I, ch. V and VII; catalogue in
 * references/NTP/notes/ntp1_rules.md). Pure; returns findings for ntp.ts.
 *
 * Conventions taken from Iyer: aspects are judged in the Rasi chart and
 * include conjunction (PDF p. 125); aspects 7th for all, Mars 4/8, Jupiter
 * 5/9, Saturn, Rahu and Ketu 3/10 (pp. 46, 126); yogas and relative positions
 * are counted from the Lagna (p. 111); occupation and lordship use Sripati
 * bhavas, cusp = madhya (pp. 93–97). Exaltation degrees p. 45; own signs
 * pp. 59–67 (Iyer gives Rahu Kumbha and Ketu Mesha, but those do not change
 * lordships, which follow the seven planets' signs). Rahu/Ketu exaltation is
 * printed inconsistently (pp. 66–67 vs 118), so nodes get no dignity here.
 */
import type { ChartResult, PlanetId } from '../types';
import { PLANETS } from '../types';
import { SIGN_LORD, VIM_ORDER, nakshatraIndex, signIndex, ZODIAC } from '../zodiac';
import type { BhavaChart } from '../houses/bhava';
import type { Finding } from './ntp';

const SPECIAL: Partial<Record<PlanetId, number[]>> = { Ma: [4, 8], Ju: [5, 9], Sa: [3, 10], Ra: [3, 10], Ke: [3, 10] };
/** Does `p` in sign `from` aspect sign `to`? Includes conjunction (Iyer). */
export function aspectsSign(p: PlanetId, from: number, to: number): boolean {
  const n = ((to - from + 12) % 12) + 1;
  return n === 1 || n === 7 || (SPECIAL[p] ?? []).includes(n);
}

export const EXALT: Readonly<Record<Exclude<PlanetId, 'Ra' | 'Ke'>, [number, number]>> = {
  Su: [0, 10], Mo: [1, 3], Ma: [9, 28], Me: [5, 15], Ju: [3, 5], Ve: [11, 27], Sa: [6, 20],
};
const OWN: Readonly<Record<PlanetId, readonly number[]>> = {
  Su: [4], Mo: [3], Ma: [0, 7], Me: [2, 5], Ju: [8, 11], Ve: [1, 6], Sa: [9, 10], Ra: [], Ke: [],
};
const KARAKA_BHAVA: Partial<Record<PlanetId, number>> = { Su: 9, Mo: 4, Ma: 3, Me: 4, Ju: 5, Ve: 7, Sa: 8 };
const DIG_SIGN: Partial<Record<PlanetId, number>> = { Su: 10, Ma: 10, Mo: 4, Ve: 4, Me: 1, Ju: 1, Sa: 7 };
const FIXED_STARS = [3, 11, 20, 25];          // Rohini, Uttara, Uttarashada, Uttarabhadra
const MOVABLE_STARS = [21, 22, 23, 12, 14];   // Sravana, Dhanista, Shatabhisha, Hasta, Swati
const DUSTHANA = [3, 6, 8, 12];

export interface Ntp1Planet {
  /** 0–100: share of its bhava's effect by distance from the madhya (p. 128). */
  effectPct: number;
  aroha: boolean;
  /** Bhavas whose madhya lies in this planet's star (Sookshma lordship, p. 152). */
  sookshma: number[];
  rasiHouse: number;
}

/** Natural benefic? (p. 132): Ju, Ve, waxing Moon, Mercury not with natural malefics, the Sun "mostly". */
export function naturalBenefic(p: PlanetId, chart: ChartResult): boolean {
  if (p === 'Ju' || p === 'Ve' || p === 'Su') return true;
  if (p === 'Mo') return ((chart.bodies.Mo.lon - chart.bodies.Su.lon + ZODIAC) % ZODIAC) < ZODIAC / 2;
  if (p === 'Me') {
    const s = signIndex(chart.bodies.Me.lon);
    return !(['Ma', 'Sa', 'Ra', 'Ke'] as PlanetId[]).some((q) => signIndex(chart.bodies[q].lon) === s)
      && !(signIndex(chart.bodies.Mo.lon) === s && !naturalBenefic('Mo', chart));
  }
  return false;
}

export function ntp1(chart: ChartResult, bc: BhavaChart, yogi: PlanetId, bhavaLords: PlanetId[]): {
  planets: Record<PlanetId, { info: Ntp1Planet; findings: Finding[] }>;
  chartFindings: Finding[];
} {
  const lagnaSign = signIndex(chart.asc.lon);
  const signOf = (p: PlanetId) => signIndex(chart.bodies[p].lon);
  const rasiHouse = (s: number) => ((s - lagnaSign + 12) % 12) + 1;
  const starOf = (lon: number) => VIM_ORDER[nakshatraIndex(lon) % 9]!;
  const owns = (p: PlanetId) => bhavaLords.map((l, i) => (l === p ? i + 1 : 0)).filter(Boolean);
  const { madhya, sandhi } = bc.arcsec;
  const fwd = (a: number, b: number) => (b - a + ZODIAC) % ZODIAC;

  const planets = {} as Record<PlanetId, { info: Ntp1Planet; findings: Finding[] }>;
  for (const p of PLANETS) {
    const lon = chart.bodies[p].lon, sign = signOf(p), h = bc.houses[p];
    const f: Finding[] = [];
    const P = { planet: p, bhava: h, sign };
    // Degree of effect and aroha/avaroha (p. 128).
    const start = sandhi[h - 1]!, mid = madhya[h - 1]!, end = sandhi[h % 12]!;
    const toMid = fwd(start, mid), pos = fwd(start, lon);
    const aroha = pos < toMid;
    const effectPct = Math.round(100 * (aroha ? pos / toMid : 1 - (pos - toMid) / fwd(mid, end)));
    f.push({ rule: aroha ? 'N1aroha' : 'N1avaroha', tone: 'info', params: { ...P, pct: effectPct } });
    if (effectPct < 10) f.push({ rule: 'N1sandhi', tone: 'mixed', params: { ...P, pct: effectPct, other: aroha ? (h + 10) % 12 + 1 : h % 12 + 1 } });

    const own = owns(p);
    const sook = madhya.map((m, i) => (starOf(m) === p ? i + 1 : 0)).filter(Boolean);
    const fm = own.filter((x) => DUSTHANA.includes(x));
    const fb = own.filter((x) => !DUSTHANA.includes(x));
    const inDust = DUSTHANA.includes(h);

    // Dignity (pp. 45, 117–118, 134).
    if (p !== 'Ra' && p !== 'Ke') {
      const [ex] = EXALT[p];
      const exalted = sign === ex, debil = sign === (ex + 6) % 12;
      if (exalted) {
        f.push({ rule: 'N1exalt', tone: 'good', params: P });
        if (fm.length && !inDust) f.push({ rule: 'N1exaltFM', tone: 'bad', params: { ...P, list: fm.join(', ') } });
        if (inDust && fb.length) f.push({ rule: 'N1exaltDust', tone: 'bad', params: { ...P, list: fb.join(', ') } });
      }
      if (debil) {
        if (fb.length && !inDust) f.push({ rule: 'N1debilGood', tone: 'mixed', params: { ...P, list: fb.join(', ') } });
        const disp = SIGN_LORD[sign]!, exLord = SIGN_LORD[ex]!;
        const kt = (q: PlanetId) => [1, 4, 5, 7, 9, 10].includes(bc.houses[q]);
        const by: string[] = [];
        if (kt(disp)) by.push(`${disp}:lordKT`);
        if (kt(exLord)) by.push(`${exLord}:exLordKT`);
        if (chart.bodies[p].retrograde) by.push(`${p}:retro`);
        if (disp !== p && aspectsSign(disp, signOf(disp), sign)) by.push(`${disp}:aspect`);
        if (by.length) f.push({ rule: 'N1nb', tone: 'good', params: { ...P, by: by.join(','), timers: [...new Set(by.map((b) => b.split(':')[0]))].join(', ') } });
        else f.push({ rule: 'N1debil', tone: 'bad', params: P });
      }
    }
    if (OWN[p].includes(sign)) {
      const prot = bc.madhyaSign.map((s, i) => (s === sign ? i + 1 : 0)).filter(Boolean);
      if (prot.length) f.push({ rule: 'N1own', tone: 'good', params: { ...P, list: prot.join(', ') } });
    }
    // Functional nature (p. 133).
    if (fb.length) f.push({ rule: inDust ? 'N1fbDust' : 'N1fbGood', tone: inDust ? 'bad' : 'good', params: { ...P, list: fb.join(', ') } });
    if (fm.length) f.push({ rule: inDust ? 'N1viparita' : 'N1fmGood', tone: inDust ? 'good' : 'bad', params: { ...P, list: fm.join(', ') } });
    // Natural nature on the occupied bhava (p. 133).
    const nb = naturalBenefic(p, chart);
    f.push({ rule: nb ? 'N1nbOcc' : 'N1nmOcc', tone: 'info', params: { ...P, nature: nb ? 'benefic' : 'malefic' } });
    if ([3, 6].includes(h)) f.push({ rule: 'N1upachaya', tone: 'mixed', params: P });
    else if (nb && inDust) f.push({ rule: 'N1nbDust', tone: 'bad', params: P });
    else if (!nb && [8, 12].includes(h)) f.push({ rule: 'N1nmDust', tone: 'bad', params: P });
    // Combustion ("eclipsed", p. 127) is added in ntp.ts where the combust flag is known.
    // Karaka in its own karaka-bhava, judged in the cuspal chart (pp. 136–138).
    const kb = KARAKA_BHAVA[p];
    if (kb !== undefined && bc.madhyaSign[kb - 1] === sign) {
      const starYogi = starOf(lon) === yogi;
      if (p === 'Sa' && kb === 8) f.push({ rule: 'N1sa8', tone: 'good', params: P });
      else if (p === yogi || starYogi) f.push({ rule: 'N1karakaYogi', tone: 'good', params: { ...P, kb } });
      else f.push({ rule: 'N1karaka', tone: 'bad', params: { ...P, kb } });
    }
    if (p === 'Me' && bc.madhyaSign[7] === sign) f.push({ rule: 'N1me8', tone: 'good', params: P });
    // Bhavat bhava (pp. 138–140): lord of bhava N in the Nth sign from that bhava's cusp sign.
    for (const n of own) {
      if (n === 1) continue;
      if (((sign - bc.madhyaSign[n - 1]! + 12) % 12) + 1 === n) f.push({ rule: 'N1bb', tone: 'info', params: { ...P, n } });
    }
    // Digbala (p. 108–109), position from Lagna (p. 126), kendra (p. 21), star nature (pp. 70–71).
    const rh = rasiHouse(sign);
    if (DIG_SIGN[p] === rh) f.push({ rule: 'N1dig', tone: 'good', params: P });
    if ([1, 4, 7, 10].includes(h)) f.push({ rule: 'N1kendra', tone: 'good', params: P });
    // Relative position from the Lagna, read in the Bhava chart (Iyer: sign counts "will not always be correct", pp. 94–96).
    if ([1, 4, 5, 7, 9, 10].includes(h)) f.push({ rule: 'N1relGood', tone: 'good', params: { ...P, rh: h } });
    else if (h === 2) f.push({ rule: 'N1rel2', tone: 'info', params: { ...P, rh: h } });
    else if (p === 'Ma' && h === 6) f.push({ rule: 'N1relMa6', tone: 'good', params: { ...P, rh: h } });
    else f.push({ rule: 'N1relBad', tone: 'bad', params: { ...P, rh: h } });
    const nak = nakshatraIndex(lon);
    if (FIXED_STARS.includes(nak)) f.push({ rule: 'N1fixed', tone: 'info', params: P });
    if (MOVABLE_STARS.includes(nak)) f.push({ rule: 'N1movable', tone: 'info', params: P });
    if (sook.length) f.push({ rule: 'N1sookshma', tone: 'info', params: { ...P, list: sook.join(', ') } });

    planets[p] = { info: { effectPct, aroha, sookshma: sook, rasiHouse: rh }, findings: f };
  }

  // --- Yogas of Ch V, from the Lagna (pp. 110–118). Effective in the dashas of the forming planets.
  const cf: Finding[] = [];
  const benefics = PLANETS.filter((p) => p !== 'Ra' && p !== 'Ke' && naturalBenefic(p, chart) && p !== 'Su');
  const malefics = PLANETS.filter((p) => p !== 'Ra' && p !== 'Ke' && !naturalBenefic(p, chart));
  const rh = (p: PlanetId) => rasiHouse(signOf(p));
  const strong = (p: PlanetId) => p !== 'Ra' && p !== 'Ke' && (OWN[p].includes(signOf(p)) || EXALT[p as keyof typeof EXALT][0] === signOf(p));
  const MAHA: Partial<Record<PlanetId, string>> = { Ma: 'Ruchaka', Me: 'Bhadra', Ju: 'Hamsa', Ve: 'Malavya', Sa: 'Sasa' };
  for (const [p, name] of Object.entries(MAHA) as [PlanetId, string][]) {
    if ([1, 4, 7, 10].includes(rh(p)) && strong(p)) cf.push({ rule: 'Y1maha', tone: 'good', params: { name, planets: p } });
  }
  const moonSign = signOf('Mo');
  if ([0, 3, 6, 9].includes((signOf('Ju') - moonSign + 12) % 12)) cf.push({ rule: 'Y1kesari', tone: 'good', params: { planets: 'Ju, Mo' } });
  const from = (p: PlanetId, base: number) => ((signOf(p) - base + 12) % 12) + 1;
  const sevenNoSun = (['Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa'] as PlanetId[]);
  const s2 = sevenNoSun.filter((p) => p !== 'Mo' && from(p, moonSign) === 2 && strong(p));
  const s12 = sevenNoSun.filter((p) => p !== 'Mo' && from(p, moonSign) === 12 && strong(p));
  if (s2.length && s12.length) cf.push({ rule: 'Y1durudhara', tone: 'good', params: { planets: [...s2, ...s12].join(', ') } });
  else if (s2.length) cf.push({ rule: 'Y1sunapha', tone: 'good', params: { planets: s2.join(', ') } });
  else if (s12.length) cf.push({ rule: 'Y1anapha', tone: 'good', params: { planets: s12.join(', ') } });
  const b2 = benefics.filter((p) => rh(p) === 2), b12 = benefics.filter((p) => rh(p) === 12);
  const m2 = malefics.filter((p) => rh(p) === 2), m12 = malefics.filter((p) => rh(p) === 12);
  if (b2.length && b12.length) cf.push({ rule: 'Y1shubhaKartari', tone: 'good', params: { planets: [...b2, ...b12].join(', ') } });
  else if (b2.length && !m12.length) cf.push({ rule: 'Y1sushubha', tone: 'good', params: { planets: b2.join(', ') } });
  if (m2.length && m12.length) cf.push({ rule: 'Y1papaKartari', tone: 'bad', params: { planets: [...m2, ...m12].join(', ') } });
  const adhiB = benefics.filter((p) => p !== 'Mo' && [6, 7, 8].includes(from(p, moonSign)));
  if (adhiB.length) cf.push({ rule: 'Y1adhi', tone: 'good', params: { planets: adhiB.join(', ') } });
  if (benefics.length && benefics.every((p) => [3, 6, 10, 11].includes(rh(p)))) cf.push({ rule: 'Y1vasumat', tone: 'good', params: { planets: benefics.join(', ') } });
  const amala = benefics.filter((p) => rh(p) === 10 || from(p, moonSign) === 10);
  if (amala.length) cf.push({ rule: 'Y1amala', tone: 'good', params: { planets: amala.join(', ') } });
  // Raja yoga: a kendra lord and a trine lord combined (conjunction or aspect).
  const lordOf = (n: number) => bhavaLords[n - 1]!;
  const related = (a: PlanetId, b: PlanetId) => a !== b && (signOf(a) === signOf(b) || aspectsSign(a, signOf(a), signOf(b)) || aspectsSign(b, signOf(b), signOf(a)));
  const raja = new Set<string>();
  for (const k of [1, 4, 7, 10]) for (const t of [5, 9]) {
    const a = lordOf(k), b = lordOf(t);
    if (a === b) raja.add(`${a} (${k}+${t})`);
    else if (related(a, b)) raja.add(`${a}-${b} (${k}+${t})`);
  }
  if (raja.size) cf.push({ rule: 'Y1raja', tone: 'good', params: { list: [...raja].join('; '), planets: [...new Set([...raja].flatMap((r) => r.split(' ')[0]!.split('-')))].join(', ') } });
  // Viparita: lords of 3, 6, 8, 12 placed in 3, 6, 8, 12.
  const vip = [...new Set(DUSTHANA.map(lordOf))].filter((p) => DUSTHANA.includes(bc.houses[p]));
  if (vip.length) cf.push({ rule: 'Y1viparita', tone: 'good', params: { planets: vip.join(', ') } });
  // Parivartana: two planets in each other's signs.
  for (let i = 0; i < 7; i++) for (let j = i + 1; j < 7; j++) {
    const a = PLANETS[i]!, b = PLANETS[j]!;
    if (SIGN_LORD[signOf(a)] === b && SIGN_LORD[signOf(b)] === a) {
      const goodA = owns(a).some((x) => !DUSTHANA.includes(x)), goodB = owns(b).some((x) => !DUSTHANA.includes(x));
      const badA = owns(a).some((x) => DUSTHANA.includes(x)), badB = owns(b).some((x) => DUSTHANA.includes(x));
      const kind = goodA && goodB && !badA && !badB ? 'good' : badA && badB && !goodA && !goodB ? 'viparita' : 'mixed';
      cf.push({ rule: 'Y1parivartana', tone: kind === 'mixed' ? 'mixed' : 'good', params: { planets: `${a}, ${b}`, kind } });
    }
  }
  // Lakshmi: 9th lord and Venus in own or exaltation signs that are kendras or trines.
  const l9 = lordOf(9);
  const okLak = (p: PlanetId) => strong(p) && [1, 4, 5, 7, 9, 10].includes(rh(p));
  if (okLak(l9) && okLak('Ve')) cf.push({ rule: 'Y1lakshmi', tone: 'good', params: { planets: l9 === 'Ve' ? 'Ve' : `${l9}, Ve` } });
  // Lagna: aspects on it (pp. 142–143).
  const onLagna = PLANETS.filter((p) => aspectsSign(p, signOf(p), lagnaSign));
  if (!onLagna.length) cf.push({ rule: 'Y1lagnaNone', tone: 'info' });
  else cf.push({ rule: 'Y1lagnaAsp', tone: 'info', params: { planets: onLagna.join(', ') } });
  // Sun and Moon on either side of the Lagna protect it (p. 113).
  const sides = new Set([rh('Su'), rh('Mo')]);
  if (sides.has(2) && sides.has(12)) cf.push({ rule: 'Y1luminaries', tone: 'good' });
  return { planets, chartFindings: cf };
}

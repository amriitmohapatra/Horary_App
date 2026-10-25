/**
 * Marriage matching as Parashara's Light 7 computes it (Reports →
 * Compatibility). Spec: docs/specs/compatibility.md (rules read from PL7.exe;
 * section numbers quoted as §x). A = the bride (girl), B = the groom (boy).
 * Ashtakoota (North, 36) uses mode X0; Dashakoota (Kalaprakasika, 44) X1.
 * Where PL's code departs from the textbooks the spec reproduces it (QUIRK);
 * PyJHora 4.8.7 is the independent cross-check (tests/fixtures/compat_pyjhora.json,
 * every difference listed in §9). Numbering here is 1-based like PL's:
 * nakshatra 1 Ashwini … 27 Revati, sign 1 Aries … 12 Pisces.
 */
import type { ChartResult } from '../types';
import { nakshatraIndex, signIndex } from '../zodiac';

export interface KootaPerson {
  nak: number;
  sign: number;
  /** Moon's degree inside its sign (Vashya splits Sg/Cp at 15°). */
  degInSign: number;
  /** Moon's sidereal longitude, degrees (Gothram). */
  lon: number;
}

export function kootaPerson(c: ChartResult): KootaPerson {
  const lon = c.bodies.Mo.lonDeg;
  return { nak: nakshatraIndex(c.bodies.Mo.lon) + 1, sign: signIndex(c.bodies.Mo.lon) + 1, degInSign: lon % 30, lon };
}

/* ---- tables (§1.5, §2) ---- */
const SIGN_LORD = [0, 3, 6, 4, 2, 1, 4, 6, 3, 5, 7, 7, 5]; // planet 1 Su … 7 Sa
const REL: Record<number, number[]> = {
  1: [0, 1, 1, 0, 1, -1, -1], 2: [1, 0, 0, 1, 0, 0, 0], 3: [1, 1, 0, -1, 1, 0, 0],
  4: [1, -1, 0, 0, 0, 1, 0], 5: [1, 1, 1, -1, 0, -1, 0], 6: [-1, -1, 0, 1, 0, 0, 1],
  7: [-1, -1, -1, 1, 0, 1, 0],
};
const rel = (a: number, b: number): number => REL[a]![b - 1]!;
const YONI = [1, 2, 3, 4, 4, 5, 6, 3, 6, 7, 7, 8, 9, 10, 9, 10, 11, 11, 5, 12, 13, 12, 14, 1, 14, 8, 2];
const YONI_BITS: Record<number, number> = { 1: -4, 2: 2, 3: 1, 4: 32, 5: -128, 6: 16, 7: -16, 8: -8, 9: 4, 10: 8, 11: -2, 12: -1, 13: 64, 14: 256 };
const YONI_M = [
  [4, 2, 3, 2, 2, 3, 3, 2, 0, 1, 3, 2, 2, 1], [2, 4, 3, 2, 2, 3, 2, 3, 3, 1, 3, 2, 2, 0],
  [3, 3, 4, 2, 2, 3, 2, 3, 3, 1, 3, 0, 2, 1], [2, 2, 2, 4, 2, 1, 1, 2, 2, 2, 2, 1, 0, 2],
  [2, 2, 2, 2, 4, 1, 1, 2, 2, 2, 0, 2, 2, 2], [3, 3, 3, 1, 1, 4, 0, 3, 3, 2, 3, 2, 2, 2],
  [3, 2, 2, 1, 1, 0, 4, 3, 3, 2, 3, 2, 1, 2], [2, 3, 3, 2, 2, 3, 3, 4, 3, 0, 3, 2, 2, 1],
  [0, 3, 3, 2, 2, 3, 3, 3, 4, 1, 3, 2, 2, 1], [1, 1, 1, 2, 2, 2, 2, 0, 1, 4, 1, 2, 2, 3],
  [3, 3, 3, 2, 0, 3, 3, 3, 3, 1, 4, 2, 2, 1], [2, 2, 0, 1, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2],
  [2, 2, 2, 0, 2, 2, 1, 2, 2, 2, 2, 2, 4, 2], [1, 0, 1, 2, 2, 2, 2, 1, 1, 3, 1, 2, 2, 4],
];
const DEVA = new Set([1, 5, 7, 8, 13, 15, 17, 22, 27]);
const RAKSHASA = new Set([3, 9, 10, 14, 16, 18, 19, 23, 24]);
const NADI = [1, 2, 3, 3, 2, 1];
const RAJJU = [1, 2, 3, 4, 5, 4, 3, 2, 1];
const MALE = new Set([1, 3, 4, 7, 8, 13, 17, 25, 26, 27]);
const FEMALE = new Set([2, 6, 9, 10, 11, 12, 14, 15, 16, 18, 20, 21, 22, 23]);
const HERM = new Set([5, 19, 24]);
const VEDHA: [number, number][] = [[1, 18], [2, 17], [3, 16], [4, 15], [6, 22], [7, 21], [8, 20], [9, 19], [10, 27], [11, 26], [12, 25], [13, 24], [5, 14], [5, 23], [14, 23]];
const VASYA_OF: Record<number, number[]> = { 1: [10, 11], 2: [], 3: [6], 4: [8, 2], 5: [1, 2], 6: [3, 8], 7: [5], 8: [1, 4], 9: [4], 10: [7, 12], 11: [10], 12: [9, 6] };
const GOTHRA_EDGES = [53.3333333333333, 106.6666666666666, 159.9999999999999, 213.3333333333332, 266.6666666666665, 306.6666666666659];

export const ganaOf = (n: number): 1 | 2 | 3 => (DEVA.has(n) ? 1 : RAKSHASA.has(n) ? 3 : 2);
export const nadiOf = (n: number): number => NADI[(n - 1) % 6]!;
export const rajjuOf = (n: number): number => RAJJU[(n - 1) % 9]!;
export const yoniOf = (n: number): number => YONI[n - 1]!;
export const genderOf = (n: number): 'M' | 'F' | 'H' => (MALE.has(n) ? 'M' : HERM.has(n) ? 'H' : FEMALE.has(n) ? 'F' : 'F');
export function varnaOf(sign: number, x: 0 | 1): number {
  const m = sign % 4; // 1 fire, 2 earth, 3 air, 0 water
  if (m === 1) return 3;
  if (m === 0) return 4;
  return m === 2 ? (x === 0 ? 2 : 1) : (x === 0 ? 1 : 2);
}
export function vashyaOf(sign: number, deg: number): number {
  if (sign === 9) return deg <= 15 ? 2 : 1;
  if (sign === 10) return deg <= 15 ? 1 : 3;
  return [0, 1, 1, 2, 3, 4, 2, 2, 5, 0, 0, 2, 3][sign]!;
}
export const gothraOf = (lon: number): number => { const i = GOTHRA_EDGES.findIndex((e) => lon < e); return i < 0 ? 7 : i + 1; };
export const signLordOf = (sign: number): number => SIGN_LORD[sign]!;

/** §1.5: same lord, Moon signs 1/7 apart, or mutual natural friends. */
export function lordsFriendly(ra: number, rb: number): boolean {
  const la = SIGN_LORD[ra]!, lb = SIGN_LORD[rb]!;
  if (la === lb || ra === rb + 6 || ra === rb - 6) return true;
  return rel(lb, la) + rel(la, lb) === 2;
}

/* ---- names ---- */
export const VARNA_NAMES = ['', 'Shudra', 'Vaishya', 'Kshatriya', 'Brahmin'];
export const VASHYA_NAMES = ['', 'Chatushpada', 'Manava', 'Jalachara', 'Vanachara', 'Keeta'];
/** PL prints the Sanskrit names (Ashwa, Simha … as on its printout); the animal is in YONI_ANIMALS. */
export const YONI_NAMES = ['', 'Ashwa', 'Gaja', 'Mesha', 'Sarpa', 'Shwan', 'Marjar', 'Mushak', 'Gau', 'Mahish', 'Vyaghra', 'Mriga', 'Vanar', 'Nakul', 'Simha'];
export const YONI_ANIMALS = ['', 'horse', 'elephant', 'sheep', 'serpent', 'dog', 'cat', 'rat', 'cow', 'buffalo', 'tiger', 'deer', 'monkey', 'mongoose', 'lion'];
export const GANA_NAMES = ['', 'Deva', 'Manushya', 'Rakshasa'];
export const NADI_NAMES = ['', 'Adya', 'Madhya', 'Antya'];
export const RAJJU_NAMES = ['', 'Padha', 'Kati (Ooru)', 'Nabhi', 'Kanta', 'Siro'];
export const TARA_NAMES = ['Janma', 'Sampat', 'Vipat', 'Kshema', 'Pratyari', 'Sadhaka', 'Vadha', 'Mitra', 'Parama Mitra'];
export const GOTHRA_NAMES = ['', 'Mareechi', 'Vasishta', 'Angiras', 'Athri', 'Pulastya', 'Pulaha', 'Kratu'];
export const PLANET_BY_NUM = ['', 'Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa'] as const;
/** Tara of `to`'s star counted from `from`'s star. */
export const taraName = (from: number, to: number): string => TARA_NAMES[((to - from + 27) % 27) % 9]!;

/* ---- scorers (A = bride, B = groom) ---- */
export class Koota {
  constructor(readonly A: KootaPerson, readonly B: KootaPerson) {}
  private get na() { return this.A.nak; } private get nb() { return this.B.nak; }
  private get ra() { return this.A.sign; } private get rb() { return this.B.sign; }

  varna(x: 0 | 1): number { return varnaOf(this.ra, x) <= varnaOf(this.rb, x) ? 1 : 0; }
  vashya(): number {
    const a = vashyaOf(this.ra, this.A.degInSign), b = vashyaOf(this.rb, this.B.degInSign);
    if (a === b) return 2;
    if (a === 4) return 0;
    if (b === 1) return 1;
    if (a + b === 5) return 0.5;
    if (a + b === 9) return 0;
    if (b === 5 || a === 5) return 1;
    if (a === 2) return 0;
    return 1;
  }
  /** §3.3 QUIRK: one direction; 3 for Janma/Sampat, else 1.5. */
  tara(): number { return ((this.nb - this.na + 27) % 9) + 1 < 3 ? 3 : 1.5; }
  yoni(mode: 0 | 1): number {
    const ya = yoniOf(this.na), yb = yoniOf(this.nb);
    if (mode === 1) {
      const ca = YONI_BITS[ya]!, cb = YONI_BITS[yb]!;
      if (cb === -ca || [16, 96, -126].includes(ca + cb)) return 0;
      return ca === cb ? 4 : 2;
    }
    return YONI_M[ya - 1]![yb - 1]!;
  }
  /** §3.5 QUIRK: neutral–neutral = 1. */
  maitri(): number {
    const la = SIGN_LORD[this.ra]!, lb = SIGN_LORD[this.rb]!;
    const s = la === lb ? 2 : rel(lb, la) + rel(la, lb);
    return ({ 2: 5, 1: 4, 0: 1, [-1]: 0.5, [-2]: 0 } as Record<number, number>)[s]!;
  }
  gana(mode: 0 | 1): number {
    const code = 10 * ganaOf(this.na) + ganaOf(this.nb);
    let sc = ({ 11: 6, 12: 5, 13: 1, 21: 6, 22: 6, 33: 6 } as Record<number, number>)[code] ?? 0;
    if (mode === 1 && lordsFriendly(this.ra, this.rb) && sc < 3) sc = 3;
    return sc;
  }
  bhakoot(): number { return [1, 3, 4, 7, 10, 11].includes(((this.rb - this.ra + 12) % 12) + 1) ? 7 : 0; }
  nadi(): number { return nadiOf(this.na) !== nadiOf(this.nb) ? 8 : 0; }

  /** §7.1 Dhinam; returns [score, PL text code]. */
  dina(x: 0 | 1): [number, number] {
    const a = this.na, b = this.nb;
    const t = ((b - a + 27) % 9) + 1;
    let sc: number, code: number;
    if (x !== 1) return [2, 4, 6, 8].includes(t) ? [3, 1] : [0, 2];
    if (t === 1) [sc, code] = [1.5, 26];
    else if ([2, 4, 6, 8, 9].includes(t)) [sc, code] = [3, 1];
    else [sc, code] = [0, 2];
    if (t === 5) [sc, code] = [0, 7];
    const is = (pairs: [number, number][]) => pairs.some(([p, q]) => p === b && q === a);
    if (is([[3, 9], [9, 15], [14, 20], [17, 23], [23, 2], [24, 3]])) [sc, code] = [0, 9];
    if (is([[6, 12], [11, 17], [14, 8], [7, 13]])) [sc, code] = [3, 10];
    if (is([[7, 13]])) [sc, code] = [3, 11];
    if (is([[18, 24]])) [sc, code] = [0, 12];
    if (is([[12, 5]])) [sc, code] = [0, 13];
    if (is([[13, 19]])) [sc, code] = [0, 14];
    const only: [[number, number][], number][] = [
      [[[4, 10], [25, 4]], 15], [[[1, 7], [15, 21]], 16], [[[27, 6], [18, 12]], 17], [[[16, 10]], 18], [[[16, 22]], 19],
      [[[1, 22]], 20], [[[26, 5]], 21], [[[21, 27]], 22], [[[19, 25]], 23], [[[20, 26]], 24], [[[2, 8]], 25],
    ];
    for (const [pairs, c] of only) if (is(pairs)) code = c;
    if (b === a) {
      [sc, code] = [1.5, 26];
      if ([4, 6, 10, 13, 16, 22, 26, 27].includes(b)) [sc, code] = [3, 27];
      if ([2, 9, 15, 18, 19, 23, 24, 25].includes(b)) [sc, code] = [0, 28];
    }
    return [sc, code];
  }
  mahendra(): number { return [4, 7, 10, 13, 16, 19, 22, 25].includes(((this.nb - this.na + 27) % 27) + 1) ? 2 : 0; }
  stree(): number { return ((this.nb - this.na + 27) % 27) + 1 > 13 ? 2 : 0; }
  rasi(x: 0 | 1): number {
    const k = (this.rb - this.ra + 12) % 12;
    let sc = k === 0 || k >= 6 ? 7 : k === 1 ? (x === 1 && this.ra % 2 === 0 ? 3.5 : 0) : 0;
    if (x === 1) {
      if ([[1, 6], [9, 2], [7, 12], [11, 4], [5, 10], [3, 8]].some(([p, q]) => p === this.ra && q === this.rb)) sc = 3.5;
      if (sc < 3.5 && lordsFriendly(this.ra, this.rb)) sc = 3.5;
    }
    return sc;
  }
  vasya(): number { return VASYA_OF[this.rb]!.includes(this.ra) || VASYA_OF[this.ra]!.includes(this.rb) ? 2 : 0; }
  rajju(x: 0 | 1): number {
    let sc = rajjuOf(this.na) === rajjuOf(this.nb) ? 0 : 8;
    if (x === 1 && lordsFriendly(this.ra, this.rb)) sc = 4;
    return sc;
  }
  vedha(x: 0 | 1): number {
    let sc = VEDHA.some(([p, q]) => (p === this.na && q === this.nb) || (p === this.nb && q === this.na)) ? 0 : 2;
    if (x === 1 && lordsFriendly(this.ra, this.rb)) sc = 1;
    return sc;
  }
  gender(): number {
    const a = genderOf(this.na), b = genderOf(this.nb);
    let sc = 0;
    if (b === 'M' && a === 'F') sc = 1;
    if (b === 'M' && a === 'M') sc = 0.5;
    if (b === 'F' && a === 'F') sc = 0.5;
    if (b === 'H' && a === 'H') sc = 0.5;
    if (b === 'H' && a === 'F') sc = 0.5;
    if (a === 'H' && b === 'F') sc = 0.5;
    if (b === 'H' && a === 'M') sc = 0.5;
    if (a === 'H' && b === 'M') sc = 0.5;
    if (b === 'F' && a === 'M') sc = 0;
    return sc;
  }
  gothra(): number { return gothraOf(this.A.lon) !== gothraOf(this.B.lon) ? 1 : 0; }
}

export interface AshtakootaRow { id: 'varna' | 'vashya' | 'tara' | 'yoni' | 'maitri' | 'gana' | 'bhakoot' | 'nadi'; label: string; max: number; score: number; area: string; groom: string; bride: string; dosha: boolean }
export interface Ashtakoota { rows: AshtakootaRow[]; total: number; band: 'avoid' | 'medium' | 'good' | 'excellent' }

const LORD_NAME: Record<number, string> = { 1: 'Sun', 2: 'Moon', 3: 'Mars', 4: 'Mercury', 5: 'Jupiter', 6: 'Venus', 7: 'Saturn' };
const SIGN_NAME = ['', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

/** §3: the 36-point Ashtakoota (pib503). */
export function ashtakoota(bride: KootaPerson, groom: KootaPerson): Ashtakoota {
  const k = new Koota(bride, groom);
  const g = groom, b = bride;
  const rows: AshtakootaRow[] = [
    { id: 'varna', label: 'Varna', max: 1, score: k.varna(0), area: 'Work', groom: VARNA_NAMES[varnaOf(g.sign, 0)]!, bride: VARNA_NAMES[varnaOf(b.sign, 0)]!, dosha: false },
    { id: 'vashya', label: 'Vashya', max: 2, score: k.vashya(), area: 'Dominance', groom: VASHYA_NAMES[vashyaOf(g.sign, g.degInSign)]!, bride: VASHYA_NAMES[vashyaOf(b.sign, b.degInSign)]!, dosha: false },
    { id: 'tara', label: 'Tara', max: 3, score: k.tara(), area: 'Destiny', groom: taraName(g.nak, b.nak), bride: taraName(b.nak, g.nak), dosha: false },
    { id: 'yoni', label: 'Yoni', max: 4, score: k.yoni(0), area: 'Mentality', groom: YONI_NAMES[yoniOf(g.nak)]!, bride: YONI_NAMES[yoniOf(b.nak)]!, dosha: false },
    { id: 'maitri', label: 'Graha Maitri', max: 5, score: k.maitri(), area: 'Compatibility', groom: LORD_NAME[SIGN_LORD[g.sign]!]!, bride: LORD_NAME[SIGN_LORD[b.sign]!]!, dosha: false },
    { id: 'gana', label: 'Gana', max: 6, score: k.gana(0), area: 'Guna level', groom: GANA_NAMES[ganaOf(g.nak)]!, bride: GANA_NAMES[ganaOf(b.nak)]!, dosha: false },
    { id: 'bhakoot', label: 'Bhakoot', max: 7, score: k.bhakoot(), area: 'Love', groom: SIGN_NAME[g.sign]!, bride: SIGN_NAME[b.sign]!, dosha: false },
    { id: 'nadi', label: 'Nadi', max: 8, score: k.nadi(), area: 'Health', groom: NADI_NAMES[nadiOf(g.nak)]!, bride: NADI_NAMES[nadiOf(b.nak)]!, dosha: false },
  ];
  for (const r of rows) r.dosha = (r.id === 'gana' || r.id === 'bhakoot' || r.id === 'nadi') && r.score === 0;
  const total = rows.reduce((s, r) => s + r.score, 0);
  return { rows, total, band: total <= 16 ? 'avoid' : total <= 21 ? 'medium' : total <= 30 ? 'good' : 'excellent' };
}

export interface DashaKootaRow { id: string; label: string; area: string; max: number; score: number; word: 'Auspicious' | 'Average' | 'Inauspicious' | ''; note: string; /** PL's text code (Dhinam). */ code?: number; groom?: string; bride?: string }
const GENDER_WORD = { M: 'male', F: 'female', H: 'neuter' } as const;
const GENDER_LABEL = { M: 'Male nak.', F: 'Female nak.', H: 'Hermaphrodite nak.' } as const;
const STAR_NAMES = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhishak', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
const ordN = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;
export interface Dashakoota { rows: DashaKootaRow[]; other: DashaKootaRow[]; total44: number; bvRaman36: number; ashtakoota36: number; favourable: number }

const word3 = (s: number, max: number, mid: (s: number) => boolean): DashaKootaRow['word'] => (s === max ? 'Auspicious' : s === 0 || !mid(s) ? 'Inauspicious' : 'Average');

/** §7: Dashakoota (Kalaprakasika) with PL's three extra considerations, and the two 36-point totals. */
export function dashakoota(bride: KootaPerson, groom: KootaPerson): Dashakoota {
  const k = new Koota(bride, groom);
  const lf = lordsFriendly(bride.sign, groom.sign);
  const [dina, dinaCode] = k.dina(1);
  const gana = k.gana(1), yoni = k.yoni(1), rasi = k.rasi(1), maitri = k.maitri(), rajju = k.rajju(1), vedha = k.vedha(1);
  const count = ((groom.sign - bride.sign + 12) % 12) + 1;
  const STAR = (q: KootaPerson) => STAR_NAMES[q.nak - 1]!;
  const both = (f: (q: KootaPerson) => string) => ({ groom: f(groom), bride: f(bride) });
  const cols: Record<string, { groom: string; bride: string }> = {
    dina: both(STAR), gana: both((q) => GANA_NAMES[ganaOf(q.nak)]!), mahendra: both(STAR), stree: both(STAR),
    yoni: both((q) => YONI_NAMES[yoniOf(q.nak)]!), rasi: both((q) => SIGN_NAME[q.sign]!), rasyadhipati: both((q) => LORD_NAME[SIGN_LORD[q.sign]!]!),
    vasya: both((q) => SIGN_NAME[q.sign]!), rajju: both((q) => RAJJU_NAMES[rajjuOf(q.nak)]!), vedha: both(STAR),
    gender: both((q) => GENDER_LABEL[genderOf(q.nak)]), gothra: both(STAR), caste: both((q) => VARNA_NAMES[varnaOf(q.sign, 0)]!),
  };
  const rows: DashaKootaRow[] = [
    { id: 'dina', label: 'Dhinam', area: 'luck', max: 3, score: dina, word: dina === 3 ? 'Auspicious' : dina === 0 ? 'Inauspicious' : '', note: `the groom’s star is the ${ordN(((groom.nak - bride.nak + 27) % 27) + 1)} from the bride’s (${taraName(bride.nak, groom.nak)} tara)`, code: dinaCode },
    { id: 'gana', label: 'Ganam', area: 'wealth', max: 6, score: gana, word: gana === 6 ? 'Auspicious' : gana > 1 ? 'Average' : 'Inauspicious', note: `${GANA_NAMES[ganaOf(groom.nak)]} (groom) and ${GANA_NAMES[ganaOf(bride.nak)]} (bride)${lf && k.gana(0) < 3 ? '; raised to 3 because the Moon-sign lords agree' : ''}` },
    { id: 'mahendra', label: 'Mahendhram', area: 'attachment and well-being', max: 2, score: k.mahendra(), word: k.mahendra() ? 'Auspicious' : 'Inauspicious', note: 'the groom’s star 4th, 7th, 10th … 25th from the bride’s' },
    { id: 'stree', label: 'Stree-Dheergham', area: 'general welfare', max: 2, score: k.stree(), word: k.stree() ? 'Auspicious' : 'Inauspicious', note: 'the groom’s star more than 13 from the bride’s' },
    { id: 'yoni', label: 'Yoni', area: 'sexual', max: 4, score: yoni, word: word3(yoni, 4, (s) => s > 0), note: `${YONI_NAMES[yoniOf(groom.nak)]} (${YONI_ANIMALS[yoniOf(groom.nak)]}, groom) and ${YONI_NAMES[yoniOf(bride.nak)]} (${YONI_ANIMALS[yoniOf(bride.nak)]}, bride)${yoni === 0 ? ': mutually hostile' : yoni === 4 ? ': the same' : ': different, not hostile'}` },
    { id: 'rasi', label: 'Rasi', area: 'growth of the family', max: 7, score: rasi, word: word3(rasi, 7, (s) => s > 0), note: `the groom’s Moon sign is the ${ordN(count)} from the bride’s` },
    { id: 'rasyadhipati', label: 'Rasyadhipati', area: 'food', max: 5, score: maitri, word: maitri === 5 ? 'Auspicious' : maitri > 2 ? 'Average' : 'Inauspicious', note: `lords ${LORD_NAME[SIGN_LORD[groom.sign]!]} and ${LORD_NAME[SIGN_LORD[bride.sign]!]}` },
    { id: 'vasya', label: 'Vasyam', area: 'posterity', max: 2, score: k.vasya(), word: k.vasya() ? 'Auspicious' : 'Inauspicious', note: k.vasya() ? 'concordant signs' : 'not concordant' },
    { id: 'rajju', label: 'Rajju', area: 'felicity in marriage', max: 8, score: rajju, word: word3(rajju, 8, (s) => s > 0), note: `${RAJJU_NAMES[rajjuOf(groom.nak)]} (groom) and ${RAJJU_NAMES[rajjuOf(bride.nak)]} (bride)${lf ? '; set to 4 because the Moon-sign lords agree (PL)' : ''}` },
    { id: 'vedha', label: 'Vedhai', area: 'sons', max: 2, score: vedha, word: word3(vedha, 2, (s) => s > 0), note: `${vedha === 0 ? 'the stars obstruct each other (vedha)' : 'no vedha'}${lf ? '; set to 1 because the Moon-sign lords agree (PL)' : ''}` },
  ];
  const gen = k.gender(), got = k.gothra(), caste = k.varna(1);
  const other: DashaKootaRow[] = [
    { id: 'gender', label: 'Male / female', area: 'other', max: 1, score: gen, word: gen === 1 ? 'Auspicious' : gen ? 'Average' : 'Inauspicious', note: `${GENDER_WORD[genderOf(groom.nak)]} star (groom), ${GENDER_WORD[genderOf(bride.nak)]} star (bride)` },
    { id: 'gothra', label: 'Gothram', area: 'other', max: 1, score: got, word: got ? 'Auspicious' : 'Inauspicious', note: `${GOTHRA_NAMES[gothraOf(groom.lon)]} (groom) and ${GOTHRA_NAMES[gothraOf(bride.lon)]} (bride)` },
    { id: 'caste', label: 'Caste', area: 'other', max: 1, score: caste, word: caste ? 'Auspicious' : 'Inauspicious', note: `${VARNA_NAMES[varnaOf(groom.sign, 0)]} (groom) and ${VARNA_NAMES[varnaOf(bride.sign, 0)]} (bride); PL scores it with the Kalaprakasika varnas` },
  ];
  for (const r of [...rows, ...other]) Object.assign(r, cols[r.id]);
  const total44 = [...rows, ...other].reduce((s, r) => s + r.score, 0);
  const bvRaman36 = k.rasi(0) + k.dina(0)[0] + k.gana(0) + k.varna(0) + k.yoni(0) + k.vasya() + k.nadi() + k.maitri();
  return { rows, other, total44, bvRaman36, ashtakoota36: ashtakoota(bride, groom).total, favourable: rows.filter((r) => r.score === r.max).length };
}

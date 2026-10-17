/**
 * Shadbala of Su–Sa in virupas — spec §4 (PL7 0x58c342 → 0x58c3b2, init 0x58d9d4), BIN + NUM.
 * Oracle: shadbala(). SB% (§3.2, BIN 0x58cdb1, required totals 0x58cfd2) and SB# (§3.3,
 * "Number of strong Balas" ids 3643/3700, minima BIN 0x58cf30, comparison ≥).
 *
 * Total = sthana + dig + kala + cheshta + naisargika + drik. Yuddha (0x58ce59, war within 1°)
 * is computed for display but NOT added (BIN); the spec does not state its amount, so only
 * the war itself (pair and separation) is reported here (OPEN).
 *
 *  Sthana §4.1: uchcha = dist(λ, deep debilitation)/3; saptavargaja over D1 D2 D3 D7 D9 D12 D30
 *    (own sign 30, 45 in D1 inside the MT range, Moon in Taurus D1 checked as MT; else Raman
 *    points GF 22.5, F 15, N 7.5, E 3.75, GE 1.875 by compound relation, BIN float table
 *    0x58d6c8; exaltation not scored); ojayugma 15 each for rasi and navamsha (even for
 *    Mo/Ve, odd for the rest); kendra 60/30/15 by whole sign; drekkana 15 for decanate
 *    1 (Su Ma Ju), 2 (Me Sa), 3 (Mo Ve) — option [cfg+0x6a5] default.
 *  Dig §4.2: dist(λ, weak point)/3; weak points IC (Su, Ma), MC (Mo, Ve), Desc (Me, Ju),
 *    Asc (Sa); option id 3043 = cusps.
 *  Kala §4.3: natonnata, paksha (benefics e = dist(Su,Mo)/3, malefics 60 − e; Moon not
 *    doubled), tribhaga, abda 15, masa 30, vara 45, hora 60, ayana (s·δ + 23.45)/46.9·60 with
 *    δ the ecliptic point's declination asin(sin ε sin λtrop) (NUM; true ε).
 *  Cheshta §4.5: Sun = its ayana, Moon = its paksha, Ma–Sa: cheshta.ts.
 *  Naisargika §4.7: 60 × {1, .857, .286, .429, .571, .714, .143} (BIN 0x5f4900).
 *  Drik §4.6: drik.ts.
 */
import { DEBIL_DEG, GRAHAS7, MT, SIGN_LORD, compoundValue, dist, inMt, mercuryWithMalefic, normDeg, sgn, type Graha7, type StrengthContext } from './common';
import { cheshtaBala, type CheshtaDetail, type CheshtaPlanet } from './cheshta';
import { drik } from './drik';
import type { StrengthEphem } from './ephem';
import type { KalaContext } from './kala';
import { VARGA7, d9, type VargaName } from './vargas';

export const REQUIRED_TOTAL: Readonly<Record<Graha7, number>> = { Su: 390, Mo: 360, Ma: 300, Me: 420, Ju: 390, Ve: 330, Sa: 300 };
export const STRONG_GROUPS = ['sthana', 'dig', 'kala', 'cheshta', 'ayana'] as const;
export type StrongGroup = (typeof STRONG_GROUPS)[number];
export const GROUP_MINIMA: Readonly<Record<StrongGroup, Readonly<Record<Graha7, number>>>> = {
  sthana: { Su: 165, Mo: 133, Ma: 96, Me: 165, Ju: 165, Ve: 133, Sa: 96 },
  dig: { Su: 35, Mo: 50, Ma: 30, Me: 35, Ju: 35, Ve: 50, Sa: 30 },
  kala: { Su: 112, Mo: 100, Ma: 67, Me: 112, Ju: 112, Ve: 100, Sa: 67 },
  cheshta: { Su: 50, Mo: 30, Ma: 40, Me: 50, Ju: 50, Ve: 30, Sa: 40 },
  ayana: { Su: 30, Mo: 40, Ma: 20, Me: 30, Ju: 30, Ve: 40, Sa: 20 },
};
const NAIS: Readonly<Record<Graha7, number>> = { Su: 1, Mo: 0.857, Ma: 0.286, Me: 0.429, Ju: 0.571, Ve: 0.714, Sa: 0.143 };
const SV_POINTS: Readonly<Record<number, number>> = { 2: 22.5, 1: 15, 0: 7.5, [-1]: 3.75, [-2]: 1.875 };
const DREKKANA: Readonly<Record<Graha7, number>> = { Su: 0, Ma: 0, Ju: 0, Me: 1, Sa: 1, Mo: 2, Ve: 2 };

export interface SaptavargajaPart { varga: VargaName; sign: number; lord: Graha7; points: number }

export interface ShadbalaBreakdown {
  // sthana
  uchcha: number; saptavargaja: number; ojayugma: number; kendra: number; drekkana: number; sthana: number;
  saptavargajaParts: SaptavargajaPart[];
  dig: number;
  // kala
  natonnata: number; paksha: number; tribhaga: number; abda: number; masa: number; vara: number; hora: number;
  ayana: number; kala: number;
  /** Ecliptic-point declination used by ayana bala, degrees. */
  declination: number;
  cheshta: number;
  cheshtaDetail: CheshtaDetail | null;
  naisargika: number;
  drik: number;
  drikParts: Partial<Record<Graha7, number>>;
  total: number;
  /** Required total (virupas) and SB% = total / required. */
  required: number;
  ratio: number;
  /** Groups at or above their minimum; strongCount = SB#. */
  strong: Record<StrongGroup, boolean>;
  strongCount: number;
  /** Planetary war (Ma–Sa within 1°): computed, never added to the total. Amount OPEN. */
  yuddha: { with: Graha7; separationDeg: number } | null;
}

export interface ShadbalaInput { ctx: StrengthContext; kala: KalaContext; jd: number; ayanamsaDeg: number; obliquity: number }

export function shadbala(e: StrengthEphem, inp: ShadbalaInput): Record<Graha7, ShadbalaBreakdown> {
  const { ctx: c, kala: k, jd } = inp;
  const el = dist(c.lon.Su, c.lon.Mo) / 3;
  const meMal = mercuryWithMalefic(c);
  const out = {} as Record<Graha7, ShadbalaBreakdown>;
  for (const p of GRAHAS7) {
    const l = c.lon[p];
    const uchcha = dist(l, DEBIL_DEG[p]) / 3;
    let saptavargaja = 0;
    const saptavargajaParts: SaptavargajaPart[] = [];
    for (const [varga, f] of VARGA7) {
      const vs = f(l);
      const lord = SIGN_LORD[vs] as Graha7;
      let pts: number;
      if (lord === p || (varga === 'D1' && p === 'Mo' && vs === MT.Mo[0])) {
        pts = varga === 'D1' && inMt(p, l) ? 45 : 30;
      } else {
        pts = SV_POINTS[compoundValue(c, p, lord)]!;
      }
      saptavargaja += pts;
      saptavargajaParts.push({ varga, sign: vs, lord, points: pts });
    }
    const fem = p === 'Mo' || p === 'Ve';
    const ojayugma = [sgn(l), d9(l)].reduce((t, s) => t + ((s % 2 === 1) === fem ? 15 : 0), 0);
    const h = (((sgn(l) - sgn(c.asc)) % 12) + 12) % 12;
    const kendra = [60, 30, 15][h % 3]!;
    const drekkana = Math.floor((l % 30) / 10) === DREKKANA[p] ? 15 : 0;
    const sthana = uchcha + saptavargaja + ojayugma + kendra + drekkana;

    const weak = { Su: c.mc + 180, Ma: c.mc + 180, Mo: c.mc, Ve: c.mc, Me: c.asc + 180, Ju: c.asc + 180, Sa: c.asc }[p];
    const dig = dist(l, normDeg(weak)) / 3;

    const natonnata = p === 'Me' ? 60 : p === 'Su' || p === 'Ju' || p === 'Ve' ? k.diurnal : 60 - k.diurnal;
    const malefic = p === 'Su' || p === 'Ma' || p === 'Sa' || (p === 'Me' && meMal);
    const paksha = malefic ? 60 - el : el;
    const tribhaga = p === 'Ju' || p === k.tribhagaLord ? 60 : 0;
    const abda = p === k.yearLord ? 15 : 0;
    const masa = p === k.monthLord ? 30 : 0;
    const vara = p === k.varaLord ? 45 : 0;
    const hora = p === k.horaLord ? 60 : 0;
    const trop = normDeg(l + inp.ayanamsaDeg);
    const rad = Math.PI / 180;
    const declination = Math.asin(Math.sin(inp.obliquity * rad) * Math.sin(trop * rad)) / rad;
    const s = p === 'Mo' || p === 'Sa' ? -1 : p === 'Me' ? (declination >= 0 ? 1 : -1) : 1;
    const ayana = ((s * declination + 23.45) / 46.9) * 60;
    const kalaSum = natonnata + paksha + tribhaga + abda + masa + vara + hora + ayana;

    out[p] = {
      uchcha, saptavargaja, ojayugma, kendra, drekkana, sthana, saptavargajaParts, dig,
      natonnata, paksha, tribhaga, abda, masa, vara, hora, ayana, kala: kalaSum, declination,
      cheshta: 0, cheshtaDetail: null, naisargika: 60 * NAIS[p], drik: 0, drikParts: {},
      total: 0, required: REQUIRED_TOTAL[p], ratio: 0,
      strong: { sthana: false, dig: false, kala: false, cheshta: false, ayana: false }, strongCount: 0,
      yuddha: null,
    };
  }
  for (const p of GRAHAS7) {
    const o = out[p];
    if (p === 'Su') o.cheshta = o.ayana;
    else if (p === 'Mo') o.cheshta = o.paksha;
    else {
      o.cheshtaDetail = cheshtaBala(e, p as CheshtaPlanet, jd, c.lon[p], c.speed[p]);
      o.cheshta = o.cheshtaDetail.value;
    }
    const d = drik(c, c.lon[p], p);
    o.drik = d.total;
    o.drikParts = d.parts;
    o.total = o.sthana + o.dig + o.kala + o.cheshta + o.naisargika + o.drik;
    o.ratio = o.total / o.required;
    for (const g of STRONG_GROUPS) o.strong[g] = o[g] >= GROUP_MINIMA[g][p];
    o.strongCount = Object.values(o.strong).filter(Boolean).length;
  }
  const war: Graha7[] = ['Ma', 'Me', 'Ju', 'Ve', 'Sa'];
  for (const p of war) {
    let best: { with: Graha7; separationDeg: number } | null = null;
    for (const q of war) {
      if (q === p) continue;
      const sep = dist(c.lon[p], c.lon[q]);
      if (sep < 1 && (!best || sep < best.separationDeg)) best = { with: q, separationDeg: sep };
    }
    out[p].yuddha = best;
  }
  return out;
}

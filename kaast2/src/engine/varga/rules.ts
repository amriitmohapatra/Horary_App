/**
 * Varga registry: all 31 Parashara's Light varga list positions plus the
 * D11 "Iyer" placeholder. Pure functions on integer arcseconds.
 *
 * Grades: BIN = decoded from PL7.exe (routine address in each `note`), STD =
 * textbook rule not yet confirmed in PL, OPEN = rule not known. After slice 3
 * every PL position is BIN: the dispatcher fcn.0057d9cf (jump table 0x57db65,
 * divisor bytes 0x5f47b8) was decoded for all 31 positions. Only D11-iyer is
 * OPEN.
 *
 * Positions 1–16: Parashari (D1 … D60); 17–20: Tajika D5 D6 D8 D11;
 * 21: D150 Nadiamsha; 22–31: alternates with divisors 2,2,3,4,10,12,30,5,16,11.
 * PL's on-screen labels of the alternates ("II"/"III") were not decoded;
 * `name` gives the varga name plus the rule.
 *
 * Cross-checks: tests/unit/varga.test.ts against the literal float port of the
 * routines (oracle/vargas_pl7_bin.py), the PL7 report tables, and PyJHora
 * (oracle/vargas_pyjhora.py).
 */
import { PLANETS, type Arcsec, type PointId } from '../types';
import { cyclicVargaSign } from './cyclic';
import {
  akshavedamshaSign, ashtamshaSign, chaturthamshaSign, chaturvimshamshaSign, dashamshaSign, drekkanaSign,
  dwadashamshaSign, ekadashamshaAltSign, ekadashamshaSign, horaAlt2Sign, horaSign, khavedamshaSign,
  panchamshaSign, shashtamshaSign, shashtiamshaSign, shodashamshaAltSign, trimshamshaSign,
} from './signDependent';

export type VargaId = 'D1'|'D2'|'D3'|'D4'|'D5'|'D6'|'D7'|'D8'|'D9'|'D10'|'D11'|'D12'|'D16'|'D20'|'D24'|'D27'|'D30'|'D40'|'D45'|'D60'|'D150'
  | 'D2-alt1'|'D2-alt2'|'D3-alt'|'D4-alt'|'D10-alt'|'D12-alt'|'D30-alt'|'D5-alt'|'D16-alt'|'D11-alt'|'D11-iyer';

export interface VargaDef {
  id: VargaId;
  /** PL list position 1…31 (dispatcher index); 0 for D11-iyer. */
  position: number;
  divisor: number;
  /** e.g. 'Navamsha'. */
  name: string;
  grade: 'BIN' | 'STD' | 'OPEN';
  note?: string;
  /** Varga sign, 0 = Aries … 11 = Pisces. */
  sign(a: Arcsec): number;
}

const CYCLIC = 'fcn.0057d1e1 (n·λ mod 360°, cyclic from Aries)';
const cyclic = (n: number) => (a: Arcsec): number => cyclicVargaSign(a, n);

export const VARGAS: readonly VargaDef[] = [
  { id: 'D1', position: 1, divisor: 1, name: 'Rashi', grade: 'BIN', note: 'fcn.0057d9cf case 1: the longitude itself', sign: cyclic(1) },
  { id: 'D2', position: 2, divisor: 2, name: 'Hora', grade: 'BIN', note: 'fcn.0057d207: odd Leo→Cancer, even Cancer→Leo (BPHS)', sign: horaSign },
  { id: 'D3', position: 3, divisor: 3, name: 'Drekkana', grade: 'BIN', note: 'fcn.0057d2f3: 1st, 5th, 9th from the sign (BPHS)', sign: drekkanaSign },
  { id: 'D4', position: 4, divisor: 4, name: 'Chaturthamsha', grade: 'BIN', note: 'fcn.0057d350: 1st, 4th, 7th, 10th from the sign (BPHS)', sign: chaturthamshaSign },
  { id: 'D7', position: 5, divisor: 7, name: 'Saptamsha', grade: 'BIN', note: `${CYCLIC}; equals BPHS odd from the sign, even from the 7th`, sign: cyclic(7) },
  { id: 'D9', position: 6, divisor: 9, name: 'Navamsha', grade: 'BIN', note: `${CYCLIC}; equals BPHS movable/fixed/dual from 1st/9th/5th`, sign: cyclic(9) },
  { id: 'D10', position: 7, divisor: 10, name: 'Dashamsha', grade: 'BIN', note: 'fcn.0057d55c: odd from the sign, even from the 9th (BPHS)', sign: dashamshaSign },
  { id: 'D12', position: 8, divisor: 12, name: 'Dwadashamsha', grade: 'BIN', note: 'fcn.0057d647: from the sign (BPHS)', sign: dwadashamshaSign },
  { id: 'D16', position: 9, divisor: 16, name: 'Shodashamsha', grade: 'BIN', note: `${CYCLIC}; equals BPHS movable Ar, fixed Le, dual Sg`, sign: cyclic(16) },
  { id: 'D20', position: 10, divisor: 20, name: 'Vimshamsha', grade: 'BIN', note: `${CYCLIC}; equals BPHS movable Ar, fixed Sg, dual Le`, sign: cyclic(20) },
  { id: 'D24', position: 11, divisor: 24, name: 'Chaturvimshamsha', grade: 'BIN', note: 'fcn.0057d675: odd from Leo, even from Cancer (BPHS)', sign: chaturvimshamshaSign },
  { id: 'D27', position: 12, divisor: 27, name: 'Saptavimshamsha', grade: 'BIN', note: `${CYCLIC}; equals BPHS fire Ar, earth Cn, air Li, water Cp`, sign: cyclic(27) },
  { id: 'D30', position: 13, divisor: 30, name: 'Trimshamsha', grade: 'BIN', note: 'fcn.0057d6b1: unequal parts Ma Sa Ju Me Ve / Ve Me Ju Sa Ma (BPHS)', sign: trimshamshaSign },
  { id: 'D40', position: 14, divisor: 40, name: 'Khavedamsha', grade: 'BIN', note: 'fcn.0057d7ea: odd from Aries, even from Libra (BPHS)', sign: khavedamshaSign },
  { id: 'D45', position: 15, divisor: 45, name: 'Akshavedamsha', grade: 'BIN', note: 'fcn.0057d81e: movable Ar, fixed Le, dual Sg (BPHS)', sign: akshavedamshaSign },
  { id: 'D60', position: 16, divisor: 60, name: 'Shashtiamsha', grade: 'BIN', note: 'fcn.0057d86a: from the sign (BPHS)', sign: shashtiamshaSign },
  { id: 'D5', position: 17, divisor: 5, name: 'Panchamsha', grade: 'BIN', note: 'fcn.0057d397: odd Ar Aq Sg Ge Li, even Ta Vi Pi Cp Sc', sign: panchamshaSign },
  { id: 'D6', position: 18, divisor: 6, name: 'Shashtamsha', grade: 'BIN', note: 'fcn.0057d4dc: odd from Aries, even from Libra', sign: shashtamshaSign },
  { id: 'D8', position: 19, divisor: 8, name: 'Ashtamsha', grade: 'BIN', note: 'fcn.0057d510: movable Ar, fixed Sg, dual Le', sign: ashtamshaSign },
  { id: 'D11', position: 20, divisor: 11, name: 'Ekadashamsha', grade: 'BIN', note: 'fcn.0057d5a6: (11d/30 + 1 − s)·30 = 11λ cyclic from Aries', sign: ekadashamshaSign },
  { id: 'D150', position: 21, divisor: 150, name: 'Nadiamsha', grade: 'BIN', note: `${CYCLIC}; NOT the Chandra Kala Nadi rule (movable forward, fixed backward, dual from the middle)`, sign: cyclic(150) },
  { id: 'D2-alt1', position: 22, divisor: 2, name: 'Hora (alternate, cyclic)', grade: 'BIN', note: CYCLIC, sign: cyclic(2) },
  { id: 'D2-alt2', position: 23, divisor: 2, name: 'Hora (alternate, 1st/7th)', grade: 'BIN', note: 'fcn.0057d260: odd the 7th then the sign, even the sign then the 7th', sign: horaAlt2Sign },
  { id: 'D3-alt', position: 24, divisor: 3, name: 'Drekkana (alternate, cyclic)', grade: 'BIN', note: CYCLIC, sign: cyclic(3) },
  { id: 'D4-alt', position: 25, divisor: 4, name: 'Chaturthamsha (alternate, cyclic)', grade: 'BIN', note: CYCLIC, sign: cyclic(4) },
  { id: 'D10-alt', position: 26, divisor: 10, name: 'Dashamsha (alternate, cyclic)', grade: 'BIN', note: CYCLIC, sign: cyclic(10) },
  { id: 'D12-alt', position: 27, divisor: 12, name: 'Dwadashamsha (alternate, cyclic)', grade: 'BIN', note: `${CYCLIC}; every sign starts at Aries`, sign: cyclic(12) },
  { id: 'D30-alt', position: 28, divisor: 30, name: 'Trimshamsha (alternate, cyclic)', grade: 'BIN', note: CYCLIC, sign: cyclic(30) },
  { id: 'D5-alt', position: 29, divisor: 5, name: 'Panchamsha (alternate, cyclic)', grade: 'BIN', note: CYCLIC, sign: cyclic(5) },
  { id: 'D16-alt', position: 30, divisor: 16, name: 'Shodashamsha (alternate)', grade: 'BIN', note: 'fcn.0057d5fb: odd forwards from the sign, even backwards from the 4th', sign: shodashamshaAltSign },
  { id: 'D11-alt', position: 31, divisor: 11, name: 'Ekadashamsha (alternate)', grade: 'BIN', note: 'fcn.0057d5d6: (1 − 11d/30)·30, every sign from Aries backwards', sign: ekadashamshaAltSign },
  {
    id: 'D11-iyer', position: 0, divisor: 11, name: 'Ekadashamsha (Iyer)', grade: 'OPEN',
    note: 'PLACEHOLDER equal to D11-alt until the boss supplies the "Iyer Cure" rule; PL7 has no Iyer D11',
    sign: ekadashamshaAltSign,
  },
];

const BY_ID = new Map<VargaId, VargaDef>(VARGAS.map((v) => [v.id, v]));

export function vargaDef(id: VargaId): VargaDef {
  const v = BY_ID.get(id);
  if (!v) throw new Error(`unknown varga ${id}`);
  return v;
}

export function vargaSign(id: VargaId, a: Arcsec): number {
  return vargaDef(id).sign(a);
}

const POINTS: readonly PointId[] = ['As', ...PLANETS];

/** Points grouped by varga sign 0…11 (input: id → longitude). Within a sign: ascendant first, then Su … Ke. */
export function vargaGroups(id: VargaId, points: Partial<Record<PointId, Arcsec>>): PointId[][] {
  const def = vargaDef(id);
  const groups: PointId[][] = Array.from({ length: 12 }, () => []);
  for (const p of POINTS) {
    const a = points[p];
    if (a !== undefined) groups[def.sign(a)]!.push(p);
  }
  return groups;
}

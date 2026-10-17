/**
 * Iyer's division charts ("Phala Kundali", NTP-2 ch. III, PDF pp. 44–63).
 * Constructions as Iyer gives them (pp. 48–54; amsa table p. 55), several of
 * which differ from Parashara's Light: D-11 runs backwards from Mesha for every
 * sign, D-16 follows Mantreswara, D-30 places each part in the part lord's odd
 * or even sign, D-45 follows the BPHS D-16 rule. D-2 and D-60 Iyer leaves out
 * of reading (p. 44). Checked cell by cell against his own D-chart table for
 * Appendix Chart 1 (p. 159) in tests/unit/iyer.test.ts.
 */
import type { Arcsec } from '../types';
import { SIGN } from '../zodiac';

export const IYER_DIVISIONS = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 20, 24, 27, 30, 40, 45] as const;
export type IyerDivision = (typeof IYER_DIVISIONS)[number];

/** Portfolio of each division (pp. 48–54). */
export const PORTFOLIO: Readonly<Record<IyerDivision, string>> = {
  1: 'all effects', 3: 'co-borns', 4: 'net assets and property', 5: 'spirituality', 6: 'health', 7: 'children',
  8: 'longevity', 9: 'partner in life', 10: 'profession and status', 11: 'gains without effort, conferred positions',
  12: 'parents', 16: 'happiness and vehicles', 20: 'worship (upasana)', 24: 'education', 27: 'physical strength and stamina',
  30: 'happiness and misery', 40: 'auspicious and inauspicious effects', 45: 'character and conduct',
};

const m12 = (x: number) => ((x % 12) + 12) % 12;
const isOdd = (s: number) => s % 2 === 0;          // Mesha (0) is odd
const kind = (s: number) => s % 3;                 // 0 movable, 1 fixed, 2 dual

/** Iyer's D-n sign (0 = Mesha) of a sidereal longitude. */
export function iyerVarga(n: IyerDivision, lon: Arcsec): number {
  const s = Math.floor(lon / SIGN) % 12, a = lon % SIGN;
  const k = Math.floor((a * n) / SIGN);
  switch (n) {
    case 1: return s;
    case 3: return m12(s + 4 * k);
    case 4: return m12(s + 3 * k);
    case 5: return m12(s + [0, 4, 8][kind(s)]! + k);
    case 6: return m12((isOdd(s) ? 0 : 6) + k);
    case 7: return m12(s + (isOdd(s) ? 0 : 6) + k);
    case 8: case 20: return m12([0, 8, 4][kind(s)]! + k);
    case 9: return m12(s + [0, 8, 4][kind(s)]! + k);
    case 10: return m12(s + (isOdd(s) ? 0 : 8) + k);
    case 11: return m12(-k);
    case 12: return m12(s + k);
    case 16: return isOdd(s) ? m12(s + k) : m12(s + 3 - k);
    case 24: return m12((isOdd(s) ? 4 : 3) + k);
    case 27: return m12([0, 3, 6, 9][s % 4]! + k);
    case 30: {
      const deg = a / 3600;
      if (isOdd(s)) return deg < 5 ? 0 : deg < 10 ? 10 : deg < 18 ? 8 : deg < 25 ? 2 : 6;
      return deg < 5 ? 1 : deg < 12 ? 5 : deg < 20 ? 11 : deg < 25 ? 9 : 7;
    }
    case 40: return m12((isOdd(s) ? 0 : 6) + k);
    case 45: return m12([0, 4, 8][kind(s)]! + k);
  }
}

/**
 * Bhava Bala in virupas — spec §1.2, BIN (0x58ee8b) + NUM (12/12, residual ≤ 0.51 virupa,
 * entirely from the lord's shadbala total). Printout labels ids 2657–2665: Bhava Bala, Rashi,
 * Degree, From Lord, Dig Bala, Drishti, Planets in, Day-Night, Total. Oracle: bhava_bala().
 *
 *  Madhya: option "Bhava bala house cusps" (ids 841–843) — the fixture fits EQUAL:
 *    m_h = Asc + 30(h − 1) (Sripati misses by up to 65 virupas; PL9's default may be a user
 *    setting, spec §7 item 3). Only Equal is implemented.
 *  From Lord: total shadbala of the lord of sign(m_h).
 *  Dig: dist(m_h, m_w)/3, w = house where the madhya's sign type is weakest
 *    (BIN 0x57e204/0x57e263/0x57e2a2/0x57e320): nara (Ge Vi Li Aq, Sg < 15°) → 7;
 *    jalachara (Pi, Cp > 15°) → 10; chatushpada (Ar Ta Le, Sg > 15°, Cp < 15°) → 4;
 *    keeta (Cn, Sc) → 1. Cancer is keeta here (NUM, house 6).
 *  Drishti: drik bala function at m_h, all 7 grahas aspecting.
 *  Planets in (whole sign): n = −1 if the Sun is in (assignment), then Ma −1, Me +1, Ju +1,
 *    Sa −1; value 60·n. Moon, Venus, nodes ignored.
 *  Day-Night: +15 for a day birth in a śīrṣodaya sign (Ge Le Vi Li Sc Aq) or a night birth in a
 *    pṛṣṭhodaya sign (Ar Ta Cn Sg Cp). Pisces' twilight branch (0x58ee5a) is OPEN, not applied.
 */
import { SIGN_LORD, dist, normDeg, sgn, type Graha7, type StrengthContext } from './common';
import { drik } from './drik';
import type { ShadbalaBreakdown } from './shadbala';

export type DigType = 'nara' | 'jalachara' | 'chatushpada' | 'keeta';

export interface BhavaBalaBreakdown {
  house: number;
  /** Bhava madhya (equal houses), exact sidereal degrees, and its sign. */
  madhya: number;
  sign: number;
  lord: Graha7;
  /** From Lord = the lord's total shadbala. */
  fromLord: number;
  digType: DigType;
  /** House (1–12) where this sign type is weakest. */
  digWeakHouse: number;
  dig: number;
  drishti: number;
  drishtiParts: Partial<Record<Graha7, number>>;
  /** Grahas counted in "Planets in" and the resulting 60·n. */
  occupants: Graha7[];
  planets: number;
  dayNight: number;
  total: number;
}

function signType(l: number): [DigType, number] {
  const s = sgn(l), d = l % 30;
  if (s === 2 || s === 5 || s === 6 || s === 10 || (s === 8 && d < 15)) return ['nara', 7];
  if (s === 11 || (s === 9 && d > 15)) return ['jalachara', 10];
  if (s === 0 || s === 1 || s === 4 || (s === 8 && d > 15) || (s === 9 && d < 15)) return ['chatushpada', 4];
  return ['keeta', 1];
}

const OCC_DELTA: Readonly<Partial<Record<Graha7, number>>> = { Ma: -1, Me: 1, Ju: 1, Sa: -1 };

export function bhavaBala(c: StrengthContext, sb: Record<Graha7, ShadbalaBreakdown>, isDay: boolean): BhavaBalaBreakdown[] {
  const madhya = Array.from({ length: 12 }, (_, i) => normDeg(c.asc + 30 * i));
  const ascSign = sgn(c.asc);
  return madhya.map((bm, h) => {
    const sign = sgn(bm);
    const lord = SIGN_LORD[sign] as Graha7;
    const [digType, digWeakHouse] = signType(bm);
    const dig = dist(bm, madhya[digWeakHouse - 1]!) / 3;
    const dr = drik(c, bm);
    const occupants = (['Su', 'Ma', 'Me', 'Ju', 'Sa'] as const).filter((p) => (((c.sign[p] - ascSign) % 12) + 12) % 12 === h);
    let n = occupants.includes('Su') ? -1 : 0;
    for (const p of occupants) if (p !== 'Su') n += OCC_DELTA[p]!;
    const s1 = sign + 1;
    const dayNight = (!isDay && [1, 2, 4, 9, 10].includes(s1)) || (isDay && [3, 5, 6, 7, 8, 11].includes(s1)) ? 15 : 0;
    const fromLord = sb[lord].total;
    const planets = 60 * n;
    return {
      house: h + 1, madhya: bm, sign, lord, fromLord, digType, digWeakHouse, dig,
      drishti: dr.total, drishtiParts: dr.parts, occupants: [...occupants], planets, dayNight,
      total: fromLord + dig + dr.total + planets + dayNight,
    };
  });
}

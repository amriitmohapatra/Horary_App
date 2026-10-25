/**
 * The 249 sign–star–sub units of KP (B3 p. 28; B6 pp. 108–113, 239–241,
 * 248–250) and the horary number: number n is the n-th unit counted from
 * 0° Aries; the horary ascendant is the exact START of that unit (KP6-001…009,
 * checked on ~40 numbers of B6's examples). The 243 star subs become 249
 * units because 6 subs straddle a sign boundary. Integer arcseconds,
 * half-open [start, end).
 */
import type { Arcsec, PlanetId } from '../types';
import { NAKSHATRA, SIGN, SIGN_LORD, VIM_ORDER, VIM_YEARS } from '../zodiac';

export interface KpUnit { n: number; start: Arcsec; end: Arcsec; sign: number; signLord: PlanetId; star: PlanetId; sub: PlanetId }

function build(): KpUnit[] {
  const out: KpUnit[] = [];
  for (let k = 0; k < 27; k++) {
    const star = VIM_ORDER[k % 9]!;
    const i0 = VIM_ORDER.indexOf(star);
    let s = k * NAKSHATRA;
    for (let j = 0; j < 9; j++) {
      const sub = VIM_ORDER[(i0 + j) % 9]!;
      const e = s + (NAKSHATRA * VIM_YEARS[sub]) / 120;
      // split at a sign boundary inside the sub
      const b = Math.ceil(s / SIGN) * SIGN;
      const cuts = b > s && b < e ? [[s, b], [b, e]] : [[s, e]];
      for (const [a, z] of cuts) {
        const sign = Math.floor(a! / SIGN);
        out.push({ n: out.length + 1, start: a!, end: z!, sign, signLord: SIGN_LORD[sign]!, star, sub });
      }
      s = e;
    }
  }
  return out;
}

export const KP_UNITS: readonly KpUnit[] = build();

/** Horary number 1…249 → the unit (ascendant = its start). */
export function horaryUnit(n: number): KpUnit {
  if (!Number.isInteger(n) || n < 1 || n > 249) throw new RangeError('horary number must be 1…249');
  return KP_UNITS[n - 1]!;
}

/** Units whose sign, star and sub lords all belong to `set` (B6 KP6-048, B5 KP5-060). */
export function unitsRuledBy(set: readonly PlanetId[], depth: 2 | 3 = 3): KpUnit[] {
  return KP_UNITS.filter((u) => set.includes(u.signLord) && set.includes(u.star) && (depth === 2 || set.includes(u.sub)));
}

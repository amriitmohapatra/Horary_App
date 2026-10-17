/**
 * Ashtakavarga — spec §1.1 (SAV house labels, BIN/STD + NUM 12/12) and §3.5 (AV column,
 * NUM 7/7; Rahu OPEN). Oracle: ashtakavarga(), the AV checks in main().
 *
 * Bhinnashtakavarga uses the standard Parashari (BPHS) contributor tables for Su…Sa,
 * the Ascendant as eighth contributor. Totals Su 48, Mo 49, Ma 39, Me 54, Ju 56,
 * Ve 52, Sa 39 (sum 337). SAV(sign) = Σ BAV_p(sign).
 *
 * AV column: BAV_p(sign of p). Rahu (OPEN, §3.5): PL9 shows a number; the oracle's
 * current candidate is the dispositor's BAV at Rahu's sign. Ketu is blank.
 */
import type { PlanetId } from '../types';
import { GRAHAS7, SIGN_LORD, type Graha7, type StrengthContext } from './common';

export const AV_CONTRIBUTORS = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'As'] as const;
export type AvContributor = (typeof AV_CONTRIBUTORS)[number];

/** Benefic places (houses counted from the contributor), BPHS. */
const BAV: Readonly<Record<Graha7, Readonly<Record<AvContributor, readonly number[]>>>> = {
  Su: { Su: [1, 2, 4, 7, 8, 9, 10, 11], Mo: [3, 6, 10, 11], Ma: [1, 2, 4, 7, 8, 9, 10, 11], Me: [3, 5, 6, 9, 10, 11, 12], Ju: [5, 6, 9, 11], Ve: [6, 7, 12], Sa: [1, 2, 4, 7, 8, 9, 10, 11], As: [3, 4, 6, 10, 11, 12] },
  Mo: { Su: [3, 6, 7, 8, 10, 11], Mo: [1, 3, 6, 7, 10, 11], Ma: [2, 3, 5, 6, 9, 10, 11], Me: [1, 3, 4, 5, 7, 8, 10, 11], Ju: [1, 4, 7, 8, 10, 11, 12], Ve: [3, 4, 5, 7, 9, 10, 11], Sa: [3, 5, 6, 11], As: [3, 6, 10, 11] },
  Ma: { Su: [3, 5, 6, 10, 11], Mo: [3, 6, 11], Ma: [1, 2, 4, 7, 8, 10, 11], Me: [3, 5, 6, 11], Ju: [6, 10, 11, 12], Ve: [6, 8, 11, 12], Sa: [1, 4, 7, 8, 9, 10, 11], As: [1, 3, 6, 10, 11] },
  Me: { Su: [5, 6, 9, 11, 12], Mo: [2, 4, 6, 8, 10, 11], Ma: [1, 2, 4, 7, 8, 9, 10, 11], Me: [1, 3, 5, 6, 9, 10, 11, 12], Ju: [6, 8, 11, 12], Ve: [1, 2, 3, 4, 5, 8, 9, 11], Sa: [1, 2, 4, 7, 8, 9, 10, 11], As: [1, 2, 4, 6, 8, 10, 11] },
  Ju: { Su: [1, 2, 3, 4, 7, 8, 9, 10, 11], Mo: [2, 5, 7, 9, 11], Ma: [1, 2, 4, 7, 8, 10, 11], Me: [1, 2, 4, 5, 6, 9, 10, 11], Ju: [1, 2, 3, 4, 7, 8, 10, 11], Ve: [2, 5, 6, 9, 10, 11], Sa: [3, 5, 6, 12], As: [1, 2, 4, 5, 6, 7, 9, 10, 11] },
  Ve: { Su: [8, 11, 12], Mo: [1, 2, 3, 4, 5, 8, 9, 11, 12], Ma: [3, 5, 6, 9, 11, 12], Me: [3, 5, 6, 9, 11], Ju: [5, 8, 9, 10, 11], Ve: [1, 2, 3, 4, 5, 8, 9, 10, 11], Sa: [3, 4, 5, 8, 9, 10, 11], As: [1, 2, 3, 4, 5, 8, 9, 11] },
  Sa: { Su: [1, 2, 4, 7, 8, 10, 11], Mo: [3, 6, 11], Ma: [3, 5, 6, 10, 11, 12], Me: [6, 8, 9, 10, 11, 12], Ju: [5, 6, 11, 12], Ve: [6, 11, 12], Sa: [3, 5, 6, 11], As: [1, 3, 4, 6, 10, 11] },
};

export interface Ashtakavarga {
  /** bav[p][sign] — bindus of planet p's BAV in each sign (0 = Aries). */
  bav: Record<Graha7, number[]>;
  /** contrib[p][contributor][sign] — 1 when that contributor gives a bindu (12 signs × 8 contributors). */
  contrib: Record<Graha7, Record<AvContributor, number[]>>;
  /** Sarvashtakavarga per sign (0 = Aries). */
  sav: number[];
}

export function ashtakavarga(c: StrengthContext): Ashtakavarga {
  const bav = {} as Record<Graha7, number[]>;
  const contrib = {} as Record<Graha7, Record<AvContributor, number[]>>;
  for (const p of GRAHAS7) {
    const row = new Array<number>(12).fill(0);
    const per = {} as Record<AvContributor, number[]>;
    for (const ref of AV_CONTRIBUTORS) {
      const marks = new Array<number>(12).fill(0);
      for (const h of BAV[p][ref]) marks[(c.sign[ref] + h - 1) % 12] = 1;
      marks.forEach((m, s) => { row[s]! += m; });
      per[ref] = marks;
    }
    bav[p] = row;
    contrib[p] = per;
  }
  const sav = Array.from({ length: 12 }, (_, s) => GRAHAS7.reduce((t, p) => t + bav[p][s]!, 0));
  return { bav, contrib, sav };
}

/** AV column value: own-sign BAV for Su–Sa; Rahu = dispositor's BAV (OPEN candidate); Ketu blank. */
export function avColumn(c: StrengthContext, a: Ashtakavarga, p: PlanetId): number | null {
  if (p === 'Ke') return null;
  const s = c.sign[p];
  const who = p === 'Ra' ? (SIGN_LORD[s] as Graha7) : (p as Graha7);
  return a.bav[who][s]!;
}

/**
 * VB column — Vimshopaka, spec §3.4. Grade: NUM (8/9); Ketu OPEN. Oracle: vimshopaka().
 *
 * Scheme: shadvarga, weights D1 6, D2 2, D3 4, D9 5, D12 2, D30 1 (sum 20). PL7's manual
 * says 10 vargas (DOC) but the PL9 fixture fits shadvarga. Points per varga: 20 when the
 * varga sign is the planet's own sign (node own signs as §3.1), else by compound relation
 * with the varga lord (temporal part from the rasi): GF 18, F 15, N 10, E 7, GE 5.
 * Exaltation does not score 20. VB = Σ weight·points / 20, displayed ROUNDED
 * (the oracle uses Python round, half to even — PL's tie rule is unverified).
 *
 * Ketu (OPEN): this rule gives 9.1 against PL9's 14; see spec §3.4 for the two fits.
 */
import type { PlanetId } from '../types';
import { OWN, SIGN_LORD, compound, type Relation, type StrengthContext } from './common';
import { SHADVARGA, type VargaName } from './vargas';

const PTS: Readonly<Record<Relation, number>> = { GF: 18, F: 15, N: 10, E: 7, GE: 5 };

export interface VimshopakaPart { varga: VargaName; sign: number; lord: PlanetId; weight: number; points: number; own: boolean; relation: Relation | null }
export interface VimshopakaResult { score: number; parts: VimshopakaPart[] }

export function vimshopaka(c: StrengthContext, p: PlanetId): VimshopakaResult {
  let tot = 0;
  const parts: VimshopakaPart[] = [];
  for (const [varga, f, weight] of SHADVARGA) {
    const sign = f(c.lon[p]);
    const lord = SIGN_LORD[sign]!;
    const own = lord === p || OWN[p].includes(sign);
    const relation = own ? null : compound(c, p, lord);
    const points = own ? 20 : PTS[relation!];
    tot += weight * points;
    parts.push({ varga, sign, lord, weight, points, own, relation });
  }
  return { score: tot / 20, parts };
}

/**
 * Func. column — functional nature, spec §3.9. Grade: BIN (PL7 default table,
 * constructor 0x568339; user-editable in PL's "Planetary Natures" dialog, ids 844–860) + NUM (9/9).
 * Oracle: functional().
 *
 * Nodes (PL9, NUM, OPEN between two candidates): the node takes its dispositor's
 * functional nature. "Nature of the house occupied" fits the fixture equally; a
 * chart separating the two is needed (spec §7 item 6).
 */
import type { PlanetId } from '../types';
import { SIGN_LORD, pid, sgn, type StrengthContext } from './common';

export type FunctionalNature = 'Malefic' | 'Benefic' | 'Neutral';
const LABEL: Readonly<Record<string, FunctionalNature>> = { M: 'Malefic', B: 'Benefic', N: 'Neutral' };

/** Per ascendant sign (Ar…Pi), columns Su Mo Ma Me Ju Ve Sa Ra Ke. */
const FUNC: readonly string[] = [
  'BNBMBMMMM', 'BMNBMMBMM', 'MNMNMBBMM', 'NBBMBMNMM', 'BNBMBMMMM', 'NMMBMBMMM',
  'MNMBMNBMM', 'NBNMBMMMM', 'BNBMNMMMM', 'NMMBMBNMM', 'NMMNMBBMM', 'MBBMBMMMM',
];

export function functionalNature(c: StrengthContext, p: PlanetId): FunctionalNature {
  const row = FUNC[sgn(c.asc)]!;
  const who = p === 'Ra' || p === 'Ke' ? SIGN_LORD[c.sign[p]]! : p;
  return LABEL[row[pid(who) - 1]!]!;
}

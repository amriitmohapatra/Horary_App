/**
 * Func. column — functional nature, spec §3.9. Grade: BIN (PL7 default table,
 * constructor 0x568339; user-editable in PL's "Planetary Natures" dialog, ids 844–860) + NUM (9/9).
 * Oracle: functional().
 *
 * Nodes (BIN 0x426ee5…0x426fba, docs/specs/pl_worksheets.md §2.1; fits the PL9
 * fixture and a PL 7.0.1 worksheet 9/9): a node takes the nature of the nearest
 * other planet in its sign; with none there, its house from the Lagna decides —
 * 1/5/9 Benefic, 6/8/12 Malefic, else Neutral.
 */
import { PLANETS, type PlanetId } from '../types';
import { dist, pid, sgn, type StrengthContext } from './common';

export type FunctionalNature = 'Malefic' | 'Benefic' | 'Neutral';
const LABEL: Readonly<Record<string, FunctionalNature>> = { M: 'Malefic', B: 'Benefic', N: 'Neutral' };

/** Per ascendant sign (Ar…Pi), columns Su Mo Ma Me Ju Ve Sa Ra Ke. */
const FUNC: readonly string[] = [
  'BNBMBMMMM', 'BMNBMMBMM', 'MNMNMBBMM', 'NBBMBMNMM', 'BNBMBMMMM', 'NMMBMBMMM',
  'MNMBMNBMM', 'NBNMBMMMM', 'BNBMNMMMM', 'NMMBMBNMM', 'NMMNMBBMM', 'MBBMBMMMM',
];

export function functionalNature(c: StrengthContext, p: PlanetId): FunctionalNature {
  const row = FUNC[sgn(c.asc)]!;
  if (p !== 'Ra' && p !== 'Ke') return LABEL[row[pid(p) - 1]!]!;
  const mates = PLANETS.filter((q) => q !== p && c.sign[q] === c.sign[p])
    .sort((a, b) => dist(c.lon[a], c.lon[p]) - dist(c.lon[b], c.lon[p]));
  if (mates.length) return functionalNature(c, mates[0]!);
  const h = ((c.sign[p] - sgn(c.asc) + 12) % 12) + 1;
  return h === 1 || h === 5 || h === 9 ? 'Benefic' : h === 6 || h === 8 || h === 12 ? 'Malefic' : 'Neutral';
}

/**
 * Argala (intervention) and virodha-argala (obstruction) on a sign or a planet.
 *
 * Rules and grades
 *  - Planets in the 2nd, 4th and 11th from the reference cause argala,
 *    obstructed by planets in the 12th, 10th and 3rd respectively; the 5th is
 *    a secondary argala obstructed from the 9th (DOC: PL7 report
 *    features.tex §Jaimini; BPHS ch. 31 v. 2-9, CHAP/CHAP31.TXT). Obstruction
 *    places are counted from the reference, not from the argala place (BPHS
 *    note to 31.2-9).
 *  - Nodes: "As Rahu and Ketu have retrograde motions, the Argalas and
 *    obstructions be also counted accordingly in a reverse manner" (BPHS
 *    31.2-9). Two readings, both offered — PL's is OPEN:
 *    'reverse-reference' (default) — counting FROM Rahu or Ketu runs backward
 *      (the 2nd from a node is the sign behind it);
 *    'reverse-causers' — Rahu and Ketu as argala-causers are counted backward
 *      from the reference (a node in the 12th gives 2nd-house argala);
 *    'none' — no reversal (what PyJHora house.get_argala does).
 *  - Outcome by count only (BPHS: "if the number of Argalas are more than the
 *    obstructing grahas, then also the Argala will prevail"); equal counts
 *    are decided by strength, which this module does not judge
 *    ('by-strength'). Vipareeta argala (3+ malefics in the 3rd) and the
 *    quarter-of-sign refinement (BPHS 31.10) are not modelled (STD, OPEN for
 *    PL's display).
 */
import type { PlanetId } from '../types';
import { PLANETS } from '../types';
import { isNode, mod12, nthBackFrom, nthFrom, type SignMap } from './common';

export type ArgalaNodeRule = 'reverse-reference' | 'reverse-causers' | 'none';

/** [argala place, obstruction place], in PL's/BPHS order. */
export const ARGALA_PLACES: readonly (readonly [2 | 4 | 11 | 5, 12 | 10 | 3 | 9])[] = [[2, 12], [4, 10], [11, 3], [5, 9]];

export interface ArgalaEntry {
  place: 2 | 4 | 11 | 5;
  obstructionPlace: 12 | 10 | 3 | 9;
  argala: PlanetId[];
  virodha: PlanetId[];
  outcome: 'none' | 'unobstructed' | 'prevails' | 'obstructed' | 'by-strength';
}

/**
 * Argala on `from` (a sign index, or a planet whose sign is read from
 * `signOf`). `signOf` holds the planets' signs in the chart (any varga).
 */
export function argala(signOf: SignMap, from: number | PlanetId,
  opts: { nodes?: ArgalaNodeRule; planets?: readonly PlanetId[] } = {}): ArgalaEntry[] {
  const rule = opts.nodes ?? 'reverse-reference';
  const planets = opts.planets ?? PLANETS;
  const ref = typeof from === 'number' ? mod12(from) : signOf[from];
  if (ref === undefined) throw new Error(`argala: no sign for ${String(from)}`);
  const backward = rule === 'reverse-reference' && typeof from === 'string' && isNode(from);
  const at = (n: number, p: PlanetId): number =>
    backward || (rule === 'reverse-causers' && isNode(p)) ? nthBackFrom(ref, n) : nthFrom(ref, n);
  const occupants = (n: number) => planets.filter((p) => p !== from && signOf[p] !== undefined && signOf[p] === at(n, p));
  return ARGALA_PLACES.map(([place, obstructionPlace]) => {
    const a = occupants(place), v = occupants(obstructionPlace);
    const outcome: ArgalaEntry['outcome'] = !a.length ? 'none' : !v.length ? 'unobstructed'
      : a.length > v.length ? 'prevails' : a.length < v.length ? 'obstructed' : 'by-strength';
    return { place, obstructionPlace, argala: a, virodha: v, outcome };
  });
}

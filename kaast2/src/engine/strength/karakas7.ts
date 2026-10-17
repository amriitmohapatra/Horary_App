/**
 * K7 column — 7 chara karakas, spec §3.8, DOC + NUM (7/7). Oracle: karakas7().
 * Sort Su–Sa by degree in sign, descending (stable on ties, PL planet order);
 * labels AK, AmK, BK, MK, PiK, GK, DK (PL7 string id 3691 has "PK"; PL9 prints "PiK").
 * Rahu is excluded (row blank).
 *
 * Local to the strength engine on purpose: the Jaimini module
 * (src/engine/jaimini/karakas.ts) is built in parallel; Page 1 may later read
 * it from there once both agree on this rule.
 */
import { GRAHAS7, type Graha7, type StrengthContext } from './common';

export const K7_LABELS = ['AK', 'AmK', 'BK', 'MK', 'PiK', 'GK', 'DK'] as const;
export type K7Label = (typeof K7_LABELS)[number];

export function karakas7(c: StrengthContext): Record<Graha7, K7Label> {
  const order = [...GRAHAS7].sort((a, b) => (c.lon[b] % 30) - (c.lon[a] % 30));
  return Object.fromEntries(order.map((p, i) => [p, K7_LABELS[i]!])) as Record<Graha7, K7Label>;
}

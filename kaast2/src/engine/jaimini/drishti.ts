/**
 * Rashi drishti (Jaimini sign aspects).
 *
 * Rule (DOC: PL7 manual pp. 216-217, glossary "Jaimini Aspects"; BPHS ch. 8
 * v. 1-5, CHAP/CHAP08.TXT): a movable sign aspects the three fixed signs
 * except the one next to it; a fixed sign aspects the three movable signs
 * except the one next to it; a dual sign aspects the other three dual signs.
 * A planet aspects with the sign it occupies, and the planets in an aspected
 * sign are aspected. The relation is symmetric (STD; it follows from the rule).
 *
 * PL's "Jaimini karakas and aspects" table lists "first any aspects between
 * planets located in dual signs, and next any aspects between pairs of planets
 * located in fixed and movable signs" (manual p. 60): jaiminiAspects() returns
 * the pairs in that order. The table layout itself is not documented (OPEN).
 */
import type { PlanetId } from '../types';
import { PLANETS } from '../types';
import { modality, mod12, type SignMap } from './common';

/** Signs aspected by `sign` (ascending sign order). */
export function rashiDrishti(sign: number): number[] {
  const s = mod12(sign);
  const m = modality(s);
  const out: number[] = [];
  for (let t = 0; t < 12; t++) {
    if (t === s) continue;
    const mt = modality(t);
    if (m === 2 && mt === 2) out.push(t);
    // movable → fixed, not the next sign; fixed → movable, not the previous sign
    else if (m === 0 && mt === 1 && t !== mod12(s + 1)) out.push(t);
    else if (m === 1 && mt === 0 && t !== mod12(s - 1)) out.push(t);
  }
  return out;
}

export const aspectsSign = (from: number, to: number): boolean => rashiDrishti(from).includes(mod12(to));

export interface JaiminiAspect { a: PlanetId; b: PlanetId; kind: 'dual' | 'fixed-movable' }

/** Mutual planet-to-planet rashi aspects, dual-sign pairs first (PL's table order). */
export function jaiminiAspects(signOf: SignMap, planets: readonly PlanetId[] = PLANETS): JaiminiAspect[] {
  const dual: JaiminiAspect[] = [];
  const fm: JaiminiAspect[] = [];
  planets.forEach((a, i) => {
    const sa = signOf[a];
    if (sa === undefined) return;
    for (const b of planets.slice(i + 1)) {
      const sb = signOf[b];
      if (sb === undefined || !aspectsSign(sa, sb)) continue;
      (modality(sa) === 2 ? dual : fm).push({ a, b, kind: modality(sa) === 2 ? 'dual' : 'fixed-movable' });
    }
  });
  return [...dual, ...fm];
}

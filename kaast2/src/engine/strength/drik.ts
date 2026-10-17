/**
 * Drik bala of a planet / Drishti bala of a bhava — spec §4.6, BIN (0x58d8ad; aspect
 * curve 0x404f64) + NUM. Oracle: aspect(), drik().
 *
 * d = fwd(λ_aspecting, λ_target); the aspect value is a piecewise-linear curve by 30°
 * sector, with special curves for Mars, Jupiter (and the nodes) and Saturn. Weights:
 * Su, Ma, Sa −¼; Moon +¼ if fwd(Su, Mo) ≤ 180 else −¼; Venus +¼; Jupiter ×1; Mercury ×1,
 * negated when with a malefic (option id 3044 default). Option id 3045 "Jup & Merc in
 * Drig bala" = full weight. Degree-based aspects from every sign (no sign-drishti filter).
 */
import { GRAHAS7, fwd, mercuryWithMalefic, pid, type Graha7, type StrengthContext } from './common';

/** PL7 aspect curve: value of planet id p at forward distance d. */
export function aspectValue(d: number, p: number): number {
  const k = Math.floor(d / 30);
  const jup = p === 5 || p === 8 || p === 9;
  switch (k) {
    case 1: return p === 7 ? 2 * (d - 30) : (d - 30) / 2;
    case 2: return p === 3 ? (d - 60) * 1.5 + 15 : p === 7 ? 90 - d / 2 : (d - 60) + 15;
    case 3:
      if (p === 3) return 150 - d;
      if (jup) return d / 2;
      return p === 7 ? 90 - d / 2 : (120 - d) / 2 + 30;
    case 4: return jup ? 180 - d : 150 - d;
    case 5: return 2 * (d - 150);
    case 6: return p === 3 ? 60 : (300 - d) / 2;
    case 7:
      if (p === 3) return 270 - d;
      return jup ? (d - 210) / 2 + 45 : (300 - d) / 2;
    case 8:
      if (jup) return 300 - d;
      return p === 7 ? (d - 240) + 30 : (300 - d) / 2;
    case 9: return p === 7 ? 2 * (300 - d) : (300 - d) / 2;
    default: return 0;
  }
}

export interface DrikResult { total: number; parts: Partial<Record<Graha7, number>> }

/** Weighted aspects of the 7 grahas on `target` (λ), optionally without one planet. */
export function drik(c: StrengthContext, target: number, exclude?: Graha7): DrikResult {
  let total = 0;
  const parts: Partial<Record<Graha7, number>> = {};
  const meMal = mercuryWithMalefic(c);
  for (const p of GRAHAS7) {
    if (p === exclude) continue;
    let v = aspectValue(fwd(c.lon[p], target), pid(p));
    if (p === 'Su' || p === 'Ma' || p === 'Sa') v *= -0.25;
    else if (p === 'Mo') v *= fwd(c.lon.Su, c.lon.Mo) > 180 ? -0.25 : 0.25;
    else if (p === 'Ve') v *= 0.25;
    else if (p === 'Me' && meMal) v = -v;
    parts[p] = v;
    total += v;
  }
  return { total, parts };
}

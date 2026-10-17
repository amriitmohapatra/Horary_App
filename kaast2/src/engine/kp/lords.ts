/**
 * Star lord and nested sub lords, computed from Vimshottari proportions
 * (invariant 2) — port of Kala Chakra kp_logic.js `subLords`, exact integer
 * arithmetic: offsets are rescaled ×120 per level so every boundary is an
 * integer (depth 5 peaks near 8.3e10, inside 2^53). Boundaries half-open.
 */
import type { Arcsec, PlanetId } from '../types';
import { NAKSHATRA, VIM_ORDER, VIM_YEARS, nakshatraIndex, norm } from '../zodiac';

/** [star, sub, sub-sub, …] of length `depth`. */
export function lordChain(a: Arcsec, depth = 5): PlanetId[] {
  const lon = norm(a);
  let lord = VIM_ORDER[nakshatraIndex(lon) % 9]!;
  const lords: PlanetId[] = [lord];
  let rel = lon % NAKSHATRA;
  let w = NAKSHATRA;
  for (let level = 1; level < depth; level++) {
    rel *= 120;
    const start = VIM_ORDER.indexOf(lord);
    let cum = 0;
    for (let i = 0; i < 9; i++) {
      const l = VIM_ORDER[(start + i) % 9]!;
      const pw = w * VIM_YEARS[l];
      if (rel < cum + pw) { lord = l; rel -= cum; w = pw; break; }
      cum += pw;
    }
    lords.push(lord);
  }
  return lords;
}

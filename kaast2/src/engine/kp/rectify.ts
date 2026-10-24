/**
 * Birth-time rectification by ruling planets (B6 pp. 146–152, KP6-050; B1
 * pp. 159–169; B3 pp. 516–517). Take the RPs of the moment of judgement;
 * the birth lagna's sign, star, sub and sub-sub lords "must agree with the
 * ruling planets". Within the window the native gives, list every stretch of
 * time whose rising degree has all four (or the first three) lords among the
 * RPs; the Readers then pick by day/night and the date, and take the middle
 * of the sub-sub (B6 p. 148: 162°37′ is the middle of 162°27′20″–162°46′20″).
 * Traditional rules (Vighati, the prenatal epoch) are not used: they give
 * many candidates (B6 pp. 149–150; B3 pp. 511–515).
 */
import { cast } from '../index';
import type { SwissEph } from '../ephem/swisseph';
import type { ChartInput, PlanetId } from '../types';
import { SIGN_LORD, signIndex } from '../zodiac';
import { lordChain } from './lords';

export interface RectifyCandidate {
  /** Julian Days UT. */
  start: number;
  end: number;
  mid: number;
  /** Rising degree at start and end (arcsec). */
  ascStart: number;
  ascEnd: number;
  /** [sign lord, star lord, sub lord, sub-sub lord] (depth 3: first three). */
  lords: PlanetId[];
}

/** Candidate birth times between fromJd and toJd (UT). `input` supplies place and profile. */
export function rectify(swe: SwissEph, input: ChartInput, fromJd: number, toJd: number, rps: readonly PlanetId[], depth: 3 | 4 = 4): RectifyCandidate[] {
  const STEP = 4 / 86400;
  const ascAt = (t: number) => cast(swe, input, t).asc.lon;
  const key = (a: number) => [SIGN_LORD[signIndex(a)]!, ...lordChain(a, depth - 1)];
  const ok = (ls: PlanetId[]) => ls.every((l) => rps.includes(l));
  const edge = (a: number, b: number, k: string) => {
    for (let i = 0; i < 25 && b - a > 0.2 / 86400; i++) { const m = (a + b) / 2; if (key(ascAt(m)).join() === k) a = m; else b = m; }
    return b;
  };
  const out: RectifyCandidate[] = [];
  let t = fromJd, k = key(ascAt(t)), open: number | null = ok(k) ? t : null;
  const close = (end: number) => {
    if (open === null) return;
    out.push({ start: open, end, mid: (open + end) / 2, ascStart: ascAt(open), ascEnd: ascAt(end), lords: k });
  };
  while (t < toJd) {
    const t2 = Math.min(t + STEP, toJd), k2 = key(ascAt(t2));
    if (k2.join() !== k.join()) {
      const e = edge(t, t2, k.join());
      close(e);
      k = k2;
      open = ok(k) ? e : null;
    }
    t = t2;
  }
  close(toJd);
  return out;
}

/**
 * KP transit timing (B5 pp. 226–229, 362–365; B6 KP6-048/049/062; catalogue
 * KP5-042, KP5-060…068): an event comes when a slow or fast body moves
 * through the sign, star and sub of the period lords. Years: Jupiter; months:
 * the Sun; days: the Moon; hours: the lagna (B6 p. 334). This finds the
 * stretches of time a body spends in KP units whose lords are chosen.
 * Retrograde returns are found too (each pass is a separate visit).
 */
import type { SwissEph } from '../ephem/swisseph';
import { evaluator } from '../transit/body';
import type { Profile } from '../profiles';
import type { PlanetId } from '../types';
import { KP_UNITS, type KpUnit } from './subs';

export interface ZoneVisit { unit: KpUnit; start: number; end: number }

/** Sampling step (days): shorter than the time the body needs to cross 4′ at its fastest. */
const STEP: Partial<Record<PlanetId, number>> = { Mo: 0.004, Su: 0.05, Me: 0.03, Ve: 0.05, Ma: 0.1, Ju: 0.5, Sa: 0.5, Ra: 1, Ke: 1 };

const unitAt = (arcsec: number): number => {
  let lo = 0, hi = KP_UNITS.length - 1;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (KP_UNITS[m]!.start <= arcsec) lo = m; else hi = m - 1; }
  return lo;
};

/**
 * Visits of `body` to the units that `want` accepts, between fromJd and toJd
 * (Julian Days UT). Edges to about a second. A unit narrower than the step
 * (a few sign-split slivers under 4′) can be missed by the fastest bodies.
 */
export function zoneVisits(swe: SwissEph, profile: Profile, body: PlanetId, want: (u: KpUnit) => boolean,
  fromJd: number, toJd: number): ZoneVisit[] {
  const ev = evaluator(swe, profile, body);
  const step = STEP[body] ?? 0.05;
  const idx = (t: number) => unitAt(Math.floor(ev(t).raw));
  const edge = (a: number, b: number, ia: number) => {
    for (let k = 0; k < 30 && b - a > 1e-5; k++) { const m = (a + b) / 2; if (idx(m) === ia) a = m; else b = m; }
    return b;
  };
  const out: ZoneVisit[] = [];
  let t = fromJd, i = idx(t), open: number | null = want(KP_UNITS[i]!) ? fromJd : null;
  while (t < toJd) {
    const t2 = Math.min(t + step, toJd), i2 = idx(t2);
    if (i2 !== i) {
      const e = edge(t, t2, i);
      if (open !== null) out.push({ unit: KP_UNITS[i]!, start: open, end: e });
      open = want(KP_UNITS[i2]!) ? e : null;
      i = i2;
    }
    t = t2;
  }
  if (open !== null) out.push({ unit: KP_UNITS[i]!, start: open, end: toJd });
  return out;
}

/** Units with the given sign, star and sub lords (any of them may be left open). */
export function unitsOf(lords: { sign?: PlanetId; star?: PlanetId; sub?: PlanetId }): (u: KpUnit) => boolean {
  return (u) => (!lords.sign || u.signLord === lords.sign) && (!lords.star || u.star === lords.star) && (!lords.sub || u.sub === lords.sub);
}

/**
 * Single-body evaluator for the transit search, and the per-body motion
 * bounds that make the search complete (search.ts).
 *
 * Evaluator: the same recipe as bodiesIn() in engine/index.ts — the frame
 * comes from siderealFrame() (never re-derived here); only the Swiss body
 * code and the "+ offset, normalise" step are repeated, for ONE body, so a
 * search step costs one swe_calc (~7 µs) instead of nine (~67 µs). A parity
 * test (tests/engine/transit.test.ts) asserts bit-identical longitudes and
 * speeds against bodiesIn() for all bodies and profiles. Proposed shared
 * change: export a `bodyIn(swe, frame, id)` from engine/index.ts and let
 * bodiesIn() call it; this file would then import it.
 *
 * Motion bounds (NUM, measured over 1800-01-02 … 2400-01-01 with the pl9
 * profile, solar-fire spot-checked; script in the slice-8 report): Swiss
 * speeds sampled every 0.05 d (Mercury…Mars), 0.02 d (Jupiter, Saturn, true
 * node) or 0.25 d (Sun, mean node); |dv/dt| from consecutive samples. The
 * tabulated values carry ≥ 25 % margin. `az` bounds the acceleration only
 * where |speed| < `vz`: near solar conjunction Swiss's light-deflection term
 * makes short speed spikes (Saturn ±0.03 °/d in a few hours, BIN: none in
 * PL), which happen only at high speed and are excluded by `vz`.
 */
import { SE, type SwissEph } from '../ephem/swisseph';
import { siderealFrame } from '../index';
import type { Profile } from '../profiles';
import type { PlanetId } from '../types';
import { ZODIAC, normDeg } from '../zodiac';

/** One evaluation: profile longitude in float arcseconds [0, ZODIAC) and Swiss speed (°/day). */
export interface BodySample {
  t: number;
  /** lonDeg × 3600 exactly as bodiesIn() computes it (Ketu: Rahu's value + 648 000″). */
  raw: number;
  /** Position.speedDeg — the sign drives the chart's "R" flag. */
  v: number;
}

export type Evaluator = (jdUT: number) => BodySample;

const SWE_BODY: Record<Exclude<PlanetId, 'Ra' | 'Ke'>, number> = {
  Su: SE.SUN, Mo: SE.MOON, Ma: SE.MARS, Me: SE.MERCURY, Ju: SE.JUPITER, Ve: SE.VENUS, Sa: SE.SATURN,
};

export function evaluator(swe: SwissEph, profile: Profile, body: PlanetId): Evaluator {
  const node = body === 'Ra' || body === 'Ke';
  const code = node ? (profile.node === 'true' ? SE.TRUE_NODE : SE.MEAN_NODE) : SWE_BODY[body as keyof typeof SWE_BODY];
  const ketu = body === 'Ke';
  return (t) => {
    const f = siderealFrame(swe, profile, t);
    const r = swe.calc(f.jdTT, code, f.planetFlags);
    let raw = normDeg(r.lon + f.offsetDeg) * 3600;
    if (ketu) { raw += ZODIAC / 2; if (raw >= ZODIAC) raw -= ZODIAC; }
    return { t, raw, v: r.lonSpeed };
  };
}

export interface Motion {
  /** Top-level sampling step, days. ≤ vz/az, and vmax·h0 ≪ 180°. */
  h0: number;
  /** Bound on |d lon/dt| (sidereal), °/day. */
  vmax: number;
  /** Speed never changes sign over the range (Sun, Moon, mean node). */
  monotonic: boolean;
  /** Where |speed| < vz, |d speed/dt| ≤ az (°/day²). Unused when monotonic. */
  vz: number;
  az: number;
}

/**
 * |sidereal rate − Swiss speed| ≤ E (°/day). The PL frames subtract a
 * time-dependent ayanamsa (rate 3.8e-5 °/d) from a tropical speed; ΔT's own
 * rate adds < 1e-6. E is the margin used wherever the sign of the true
 * sidereal rate matters.
 */
export const RATE_SLACK = 1e-4;

export function motionOf(profile: Profile, body: PlanetId): Motion {
  if (body === 'Ra' || body === 'Ke') return profile.node === 'true' ? MOTION.trueNode : MOTION.meanNode;
  return MOTION[body as keyof typeof MOTION];
}

const MOTION = {
  Su: { h0: 4, vmax: 1.03, monotonic: true, vz: 0, az: 0 },
  Mo: { h0: 1, vmax: 15.6, monotonic: true, vz: 0, az: 0 },
  Me: { h0: 1, vmax: 2.4, monotonic: false, vz: 1.0, az: 0.25 },
  Ve: { h0: 2, vmax: 1.4, monotonic: false, vz: 0.5, az: 0.06 },
  Ma: { h0: 2, vmax: 0.9, monotonic: false, vz: 0.3, az: 0.04 },
  Ju: { h0: 4, vmax: 0.3, monotonic: false, vz: 0.15, az: 0.01 },
  Sa: { h0: 4, vmax: 0.18, monotonic: false, vz: 0.08, az: 0.005 },
  meanNode: { h0: 16, vmax: 0.06, monotonic: true, vz: 0, az: 0 },
  trueNode: { h0: 0.5, vmax: 0.45, monotonic: false, vz: 0.45, az: 0.5 },
} satisfies Record<string, Motion>;

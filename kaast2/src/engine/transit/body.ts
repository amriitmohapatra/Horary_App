/**
 * Single-body evaluator for the transit search, and the per-body motion
 * bounds that make the search complete (search.ts).
 *
 * Evaluator: the same recipe as bodiesIn() in engine/index.ts — the frame
 * comes from siderealFrame() (never re-derived here); only the Swiss body
 * code and the "+ offset, normalise" step are repeated, for ONE body, so a
 * search step costs one swe_calc (~7 µs) instead of nine (~67 µs). A parity
 * test (tests/engine/transit.test.ts) asserts bit-identical longitudes and
 * speeds against bodiesIn() for all bodies and three profiles (true node:
 * the de-spiked speed, below). Proposed shared change: export a
 * `bodyIn(swe, frame, id)` from engine/index.ts and let bodiesIn() call it;
 * this file would then import it.
 *
 * Motion bounds (NUM): Swiss speeds over 1800-01-02 … 2400-01-01, pl9
 * profile (solarfire spot-checked: same to 4e-5 °/d), sampled every 0.05 d
 * (Moon…Mars), 0.02 d (Jupiter, Saturn, true node) or 0.25 d (Sun, mean
 * node); |dv/dt| from consecutive samples. Table values carry ≥ 25 % margin;
 * the transit test re-checks them (1970–2030 by default, the full range
 * with KAAST_SLOW=1). `az` bounds the acceleration only where |speed| <
 * `vz`: near solar conjunction Swiss's light-deflection term makes speed
 * spikes lasting hours (Saturn 0.12 → 0.087 °/d, |dv/dt| to 0.6 °/d²), which
 * happen only at high speed and so lie outside `vz`.
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
  const one = (t: number): BodySample => {
    const f = siderealFrame(swe, profile, t);
    const r = swe.calc(f.jdTT, code, f.planetFlags);
    let raw = normDeg(r.lon + f.offsetDeg) * 3600;
    if (ketu) { raw += ZODIAC / 2; if (raw >= ZODIAC) raw -= ZODIAC; }
    return { t, raw, v: r.lonSpeed };
  };
  if (!(node && profile.node === 'true')) return one;
  // True node: Swiss derives it from the Moon's osculating orbit, which is
  // discontinuous at the lunar-file segment joints (every 27.55 d): the
  // longitude steps by ≤ 0.3″ and the numerical speed spikes for
  // ~17 s (to ±0.15 °/d). The search uses the median of the speeds at
  // t − 20 s, t, t + 20 s: equal to the speed at t wherever it is monotonic
  // over those 40 s, and never a spike.
  return (t) => {
    const c = one(t);
    const a = one(t - DESPIKE).v, b = one(t + DESPIKE).v;
    const v = c.v;
    c.v = Math.max(Math.min(a, b), Math.min(Math.max(a, b), v));
    return c;
  };
}

const DESPIKE = 20 / 86400;

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
  /** Allowance for a longitude discontinuity inside one step, arcseconds (true node only). */
  jump: number;
  /** Allowance for a speed discontinuity inside one step, °/day (true node only). */
  dv: number;
  /** Station resolution, days (default search.ts STATION_SEP = 60 s). */
  sep?: number;
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
  //             step       |speed| bound   no reversal      |v| < vz ⇒ |dv/dt| ≤ az   (measured: |v|max, az)
  Su: { h0: 4, vmax: 1.1, monotonic: true, vz: 0, az: 0, jump: 0, dv: 0 },                // 1.0199, speed ≥ 0.9528
  Mo: { h0: 1, vmax: 16, monotonic: true, vz: 0, az: 0, jump: 0, dv: 0 },                 // 15.401, speed ≥ 11.760
  Me: { h0: 2, vmax: 2.6, monotonic: false, vz: 1.5, az: 0.3, jump: 0, dv: 0 },           // 2.2034, 0.1987
  Ve: { h0: 4, vmax: 1.5, monotonic: false, vz: 0.9, az: 0.065, jump: 0, dv: 0 },         // 1.2625, 0.04245
  Ma: { h0: 8, vmax: 1.0, monotonic: false, vz: 0.6, az: 0.023, jump: 0, dv: 0 },         // 0.7916, 0.01516
  Ju: { h0: 16, vmax: 0.35, monotonic: false, vz: 0.2, az: 0.0055, jump: 0, dv: 0 },       // 0.2428, 0.003521
  Sa: { h0: 16, vmax: 0.2, monotonic: false, vz: 0.08, az: 0.003, jump: 0, dv: 0 },        // 0.1341, 0.001910
  meanNode: { h0: 16, vmax: 0.06, monotonic: true, vz: 0, az: 0, jump: 0, dv: 0 },        // −0.052954 … −0.052953
  // True node: smooth |v| ≤ 0.2593 (secant), smooth |dv/dt| ≤ 0.0789; at the lunar-file joints
  // (27.55 d apart) longitude steps ≤ 0.29″ and speed steps ≤ 5.9e-4 °/d (77 joints, 6 epochs).
  trueNode: { h0: 2, vmax: 0.3, monotonic: false, vz: 0.31, az: 0.12, jump: 0.6, dv: 0.001, sep: 1 / 24 },
} satisfies Record<string, Motion>;

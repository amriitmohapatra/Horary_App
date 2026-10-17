/**
 * Cheshta bala of Ma–Sa — PL's own geometric rule, spec §4.5, BIN (0x58c0f2 formula,
 * 0x55525c epochs, 0x58bfe5 station walk) + NUM (fixture SB% reproduced). Oracle:
 * events(), station_lon(), cheshta().
 *
 * Epochs from the TRUE ephemeris, as the oracle does. PL7 takes them from its own
 * analytic series (A 0x554dd9, B 0x55500c, coefficients 0x5f2960–0x5f2b30); those are
 * deliberately not reproduced here (spec §4.5; the two differ by ≤ 0.6 virupa).
 *
 *  A-events: conjunction with the Sun, planet direct (superior conjunction for Me/Ve).
 *  B-events: opposition (Ma, Ju, Sa) or inferior conjunction (Me, Ve), planet retrograde.
 *  x3 = the B between the previous and next A; x2 = previous A if jd < x3 else next A.
 *  Station: walk one day at a time from x3 − s·D (D = Ma 30, Me 10, Ju 55, Ve 21, Sa 60 d),
 *  max 12 steps; Lst = longitude at the last evaluated day.
 *  cheshta = 60·min(w, tot)/tot, 0 at conjunction, 60 at opposition.
 *
 * Search: the oracle samples elongation every 0.5 day over ±900 days. Here the search walks
 * outward from the chart moment with a coarse step that cannot skip a crossing (see STEP)
 * and refines each root by the Illinois method to 1e-8°. Same events, ~50× fewer Swiss calls.
 */
import { dist, fwd, wrap180, type Graha7 } from './common';
import type { StrengthEphem } from './ephem';

export type CheshtaPlanet = 'Ma' | 'Me' | 'Ju' | 'Ve' | 'Sa';
export const CHESHTA_PLANETS: readonly CheshtaPlanet[] = ['Ma', 'Me', 'Ju', 'Ve', 'Sa'];

const WALK: Readonly<Record<CheshtaPlanet, number>> = { Ma: 30, Me: 10, Ju: 55, Ve: 21, Sa: 60 };
/**
 * Scan step (days). Ma/Ju/Sa never outrun the Sun, so their elongation falls monotonically
 * (≤ 1.45°/day): any step under 180°/rate brackets every crossing. Me/Ve elongation
 * oscillates; the step stays far below the shortest interval between two conjunctions
 * (Me ≈ 40 d, Ve ≈ 270 d), so no pair of crossings fits in one step.
 */
const STEP: Readonly<Record<CheshtaPlanet, number>> = { Ma: 60, Me: 10, Ju: 60, Ve: 40, Sa: 60 };

export interface CheshtaDetail {
  /** Event instants (JD UT). */
  prevA: number; nextA: number; x2: number; x3: number;
  /** Sidereal longitudes at x2, x3, the station walk's end and now. */
  l2: number; l3: number; lst: number; ln: number;
  a: number; v: number; w: number; tot: number;
  retrograde: boolean;
  value: number;
}

interface Ev { t: number; a: boolean }

function refine(e: StrengthEphem, p: Graha7, target: number, lo: number, hi: number, flo: number, fhi: number): number {
  // Illinois (modified regula falsi) on wrap(elong − target); flo·fhi < 0.
  let side = 0;
  for (let i = 0; i < 60; i++) {
    const t = (lo * fhi - hi * flo) / (fhi - flo);
    const f = wrap180(e.elongation(p, t) - target);
    if (f === 0) return t;
    if ((f > 0) === (fhi > 0)) {
      hi = t; fhi = f;
      if (side === -1) flo /= 2;
      side = -1;
    } else {
      lo = t; flo = f;
      if (side === 1) fhi /= 2;
      side = 1;
    }
    if (Math.abs(f) < 1e-8 || hi - lo < 1e-9) return t;
  }
  return (lo + hi) / 2;
}

/** Events met walking from jd in direction dir until the first A-event (inclusive). */
function scan(e: StrengthEphem, p: CheshtaPlanet, jd: number, dir: 1 | -1): Ev[] {
  const out: Ev[] = [];
  let t = jd, el = e.elongation(p, t);
  for (let guard = 0; guard < 200; guard++) {
    const t2 = t + dir * STEP[p];
    const el2 = e.elongation(p, t2);
    let foundA = false;
    for (const target of [0, 180]) {
      const a = wrap180(el - target), b = wrap180(el2 - target);
      if (a * b < 0 && Math.abs(a - b) < 180) {
        const [lo, hi, flo, fhi] = dir > 0 ? [t, t2, a, b] : [t2, t, b, a];
        const tm = refine(e, p, target, lo, hi, flo, fhi);
        const isA = e.body(p, tm).speed > 0;
        out.push({ t: tm, a: isA });
        foundA ||= isA;
      }
    }
    if (foundA) return out;
    t = t2; el = el2;
  }
  throw new Error(`cheshta: no conjunction of ${p} found near JD ${jd}`);
}

/** PL7 0x58bfe5: day-by-day walk towards the station, max 12 steps. */
function stationLon(e: StrengthEphem, p: CheshtaPlanet, x3: number, jdNow: number): number {
  const s = jdNow < x3 ? 1 : -1;
  let tt = x3 - s * WALK[p], counter = 1, edx = 0;
  for (;;) {
    const prev = edx;
    const { lon, speed } = e.body(p, tt);
    edx = speed < 0 ? -1 : 1;
    if (counter > 1 && edx !== prev) counter = 0x6f;
    tt = s * speed < 0 ? tt - 1 : tt + 1;
    counter += 1;
    if (counter > 12) return lon;
  }
}

export function cheshtaBala(e: StrengthEphem, p: CheshtaPlanet, jd: number, ln: number, speedNow: number): CheshtaDetail {
  const back = scan(e, p, jd, -1);
  const ahead = scan(e, p, jd, 1);
  const prevA = back.filter((x) => x.a && x.t < jd).reduce((m, x) => Math.max(m, x.t), -Infinity);
  const nextA = ahead.filter((x) => x.a && x.t >= jd).reduce((m, x) => Math.min(m, x.t), Infinity);
  const bs = [...back, ...ahead].filter((x) => !x.a && prevA < x.t && x.t < nextA).map((x) => x.t).sort((a, b) => a - b);
  if (!Number.isFinite(prevA) || !Number.isFinite(nextA) || bs.length === 0) {
    throw new Error(`cheshta: incomplete synodic cycle for ${p} at JD ${jd}`);
  }
  const x3 = bs[0]!;
  const x2 = jd < x3 ? prevA : nextA;
  const l3 = e.body(p, x3).lon, l2 = e.body(p, x2).lon;
  const lst = stationLon(e, p, x3, jd);
  let a: number, v: number;
  if (x3 < x2) { a = fwd(lst, l2); v = fwd(ln, l2); } else { a = fwd(l2, lst); v = fwd(l2, ln); }
  if (v > 300) v = 360 - v;
  const tot = dist(l3, lst) + a;
  const retrograde = !(speedNow > 0);
  const w = retrograde ? dist(lst, ln) + a : v;
  return { prevA, nextA, x2, x3, l2, l3, lst, ln, a, v, w, tot, retrograde, value: (60 * Math.min(w, tot)) / tot };
}

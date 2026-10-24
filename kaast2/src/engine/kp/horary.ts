/**
 * KP horary chart from a number 1…249 (B6 pp. 108–113, 239–241; KP6-001…009).
 * The querist names a number; its unit's START is the ascendant. The other
 * cusps are the Placidus cusps of the sidereal time at which that degree
 * rises at the latitude of judgement (the Readers read them from Raphael's
 * tables of houses; here the same RAMC is found exactly). The planets, the
 * ruling planets and the dasa balance are those of the moment of judgement
 * at the place of judgement (B6 p. 112; KP6-005).
 */
import { cast, siderealFrame } from '../index';
import type { SwissEph } from '../ephem/swisseph';
import { SE } from '../ephem/swisseph';
import { geocentricLatitude } from '../houses/latitude';
import type { ChartInput, ChartResult } from '../types';
import { toArcsec } from '../zodiac';
import { horaryUnit } from './subs';

const DAY_SIDEREAL = 0.99726957;

/**
 * Placidus cusps (integer arcsec, index 0 = cusp 1) for a sidereal ascendant
 * `ascArcsec` at latitude `latDeg`, in the profile frame of `jdUT`.
 * Cusp 1 is returned exactly as asked; the others to the nearest arcsecond.
 */
export function cuspsForAscendant(swe: SwissEph, chartLike: Pick<ChartResult, 'profile'>, jdUT: number, latDeg: number, ascArcsec: number): { cusps: number[]; mc: number; jdRising: number } {
  const { profile } = chartLike;
  const f = siderealFrame(swe, profile, jdUT);
  const lat = profile.houses.latitude === 'geocentric' ? geocentricLatitude(latDeg) : latDeg;
  const target = ascArcsec / 3600;
  const shift = f.sf ? f.offsetDeg : 0;
  const ascAt = (t: number) => swe.houses(t, SE.FLG_SIDEREAL, lat, 0, profile.houses.system).asc + shift;
  const diff = (t: number) => ((ascAt(t) - target + 540) % 360) - 180;
  // The ascendant always moves forward: find the step where diff crosses 0 upwards, then bisect.
  const N = 144;
  let a = jdUT, da = diff(a);
  for (let i = 1; i <= N; i++) {
    const b = jdUT + (i * DAY_SIDEREAL) / N, db = diff(b);
    if (da <= 0 && db > 0 && db - da < 90) {
      let lo = a, hi = b;
      for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (diff(m) <= 0) lo = m; else hi = m; }
      const h = swe.houses(lo, SE.FLG_SIDEREAL, lat, 0, profile.houses.system);
      const cusps = h.cusps.map((c) => toArcsec(c + shift, profile.rounding));
      cusps[0] = ascArcsec;
      return { cusps, mc: toArcsec(h.mc + shift, profile.rounding), jdRising: lo };
    }
    a = b; da = db;
  }
  throw new Error('ascendant not reached at this latitude');
}

export interface HoraryChart {
  number: number;
  /** The chart of the moment and place of judgement, with the horary cusps in place of the natal ones. */
  chart: ChartResult;
  /** The cusps the moment itself would give (for the ruling planets). */
  momentAsc: number;
}

/** Cast the horary chart: planets at the judgement moment, cusps from the number. */
export function horaryChart(swe: SwissEph, judgement: ChartInput, n: number): HoraryChart {
  const moment = cast(swe, judgement);
  const u = horaryUnit(n);
  const { cusps, mc } = cuspsForAscendant(swe, moment, moment.moment.jdUT, judgement.place.latDeg, u.start);
  const asc = { ...moment.asc, lon: u.start, lonDeg: u.start / 3600 };
  return { number: n, chart: { ...moment, cusps, asc, mc, mcDeg: mc / 3600 }, momentAsc: moment.asc.lon };
}

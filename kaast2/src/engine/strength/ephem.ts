/**
 * The few Swiss Ephemeris evaluations the strength rules need away from the chart
 * moment, through the existing public adapter (SwissEph.calc / houses) and the chart's
 * own sidereal frame (index.ts siderealFrame) — no new Swiss entry points.
 *
 *  - sidereal longitude + speed of a graha at any instant (cheshta epochs, station walk)
 *  - Sun–planet elongation (ayanamsa cancels), for conjunction/opposition search
 *  - Ascendant at any instant: PL sunrise = instant Asc = Sun, sunset = Asc = Sun + 180
 *    (spec §4.3, BIN iteration in 0x58d9d4; geometric centre, no refraction — NUM)
 *  - true obliquity (SE_ECL_NUT, body −1) for the ayana declination
 *
 * Side effect: siderealFrame() sets Swiss's sidereal mode for the instant asked;
 * `restore()` puts back the chart moment's mode so later house calls are unaffected.
 */
import { siderealFrame, type SiderealFrame } from '../index';
import { SE, type SwissEph } from '../ephem/swisseph';
import { deltaTseconds } from '../time/deltaT';
import type { ChartResult } from '../types';
import { normDeg, wrap180, type Graha7 } from './common';

const BODY: Readonly<Record<Graha7, number>> = {
  Su: SE.SUN, Mo: SE.MOON, Ma: SE.MARS, Me: SE.MERCURY, Ju: SE.JUPITER, Ve: SE.VENUS, Sa: SE.SATURN,
};
const SE_ECL_NUT = -1;
/** Mean rate of Asc − Sun, degrees per day (oracle solve_asc_equals_sun). */
const ASC_RATE = 360.9856;

export class StrengthEphem {
  calls = 0;
  private readonly flags: number;
  constructor(private readonly swe: SwissEph, private readonly chart: ChartResult) {
    this.flags = this.frame(chart.moment.jdUT).planetFlags;
  }

  private frame(jdUT: number): SiderealFrame {
    return siderealFrame(this.swe, this.chart.profile, jdUT);
  }

  /** Sidereal longitude (deg) and longitude speed (deg/day) at jdUT. */
  body(p: Graha7, jdUT: number): { lon: number; speed: number } {
    const f = this.frame(jdUT);
    const r = this.swe.calc(f.jdTT, BODY[p], f.planetFlags);
    this.calls++;
    return { lon: normDeg(r.lon + f.offsetDeg), speed: r.lonSpeed };
  }

  /**
   * Planet − Sun, wrapped to [−180, 180). The ayanamsa cancels, so only the frame's Delta-T
   * and flags are needed (the chart frame's sidereal mode is constant for Solar Fire's flags).
   */
  elongation(p: Graha7, jdUT: number): number {
    const jdTT = jdUT + deltaTseconds(this.chart.profile.deltaT, jdUT, () => this.swe.deltaTsec(jdUT)) / 86400;
    const a = this.swe.calc(jdTT, BODY[p], this.flags).lon;
    const s = this.swe.calc(jdTT, SE.SUN, this.flags).lon;
    this.calls += 2;
    return wrap180(a - s);
  }

  /** Sidereal Ascendant and MC at jdUT, exactly as cast() computes them. */
  ascMc(jdUT: number): { asc: number; mc: number } {
    const f = this.frame(jdUT);
    const { place } = this.chart.input;
    const h = this.swe.houses(jdUT, SE.FLG_SIDEREAL, this.chart.provenance.houseLatitudeDeg, place.lonDeg,
      this.chart.profile.houses.system);
    this.calls++;
    const off = f.sf ? f.offsetDeg : 0;
    return { asc: normDeg(h.asc + off), mc: normDeg(h.mc + off) };
  }

  /** Asc(t) − (Sun(t) + off), wrapped to [−180, 180). Increases with t (Asc always advances). */
  private ascMinusSun(t: number, off: number): number {
    return wrap180(this.ascMc(t).asc - (this.body('Su', t).lon + off));
  }

  /**
   * The instant near `guess` when Asc = Sun + off (off 0 sunrise, 180 sunset), converged to
   * the float resolution of a JD (the oracle iterates to 1e-8° or 40 steps). Asc − Sun grows monotonically, so the wrapped difference
   * crosses 0 from below exactly once per day: step from the guess (≤ 1 h at a time, so a fast-
   * rising sign at high latitude cannot hide the crossing) until it is bracketed, then Illinois.
   */
  solveAscSun(guess: number, off: 0 | 180): number {
    const MAX_STEP = 1 / 24, MIN_STEP = 1 / 288;
    let t = guess, g = this.ascMinusSun(t, off);
    if (g === 0) return t;
    let lo: number, hi: number, glo: number, ghi: number;
    for (let i = 0; ; i++) {
      if (i > 200) throw new Error(`no Asc = Sun + ${off} crossing near JD ${guess}`);
      const dir = g < 0 ? 1 : -1;
      const t2 = t + dir * Math.min(MAX_STEP, Math.max(MIN_STEP, Math.abs(g) / ASC_RATE));
      const g2 = this.ascMinusSun(t2, off);
      const [a, ga, b, gb] = dir > 0 ? [t, g, t2, g2] : [t2, g2, t, g];
      if (ga < 0 && gb >= 0) { lo = a; glo = ga; hi = b; ghi = gb; break; }
      t = t2; g = g2;
    }
    let side = 0;
    for (let i = 0; i < 100; i++) {
      const tm = (lo * ghi - hi * glo) / (ghi - glo);
      const gm = this.ascMinusSun(tm, off);
      // 1e-7° of Asc is 3e-10 day, below one ulp of a JD (4.7e-10): stop at float resolution.
      if (Math.abs(gm) < 1e-7 || hi - lo < 2e-9 || tm <= lo || tm >= hi) return tm;
      if (gm < 0) { lo = tm; glo = gm; if (side === 1) ghi /= 2; side = 1; }
      else { hi = tm; ghi = gm; if (side === -1) glo /= 2; side = -1; }
    }
    return (lo + hi) / 2;
  }

  /** True obliquity of the ecliptic (deg) at the chart moment. */
  obliquity(): number {
    this.calls++;
    return this.swe.calc(this.chart.moment.jdTT, SE_ECL_NUT, SE.FLG_SWIEPH).lon;
  }

  /** Put back the chart moment's sidereal mode. */
  restore(): void {
    this.frame(this.chart.moment.jdUT);
  }
}

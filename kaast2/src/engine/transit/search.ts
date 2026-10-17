/**
 * Complete root finding over one body's motion (STD numerical method; the
 * bounds it relies on are NUM, see body.ts).
 *
 * Longitudes are handled as float arcseconds X(t), unwrapped inside each
 * top-level step (motion per step ≪ 180°). A threshold grid is
 * T_k = k·W + off; a crossing of T_k is the instant X passes it (direct:
 * from below to ≥ T_k). With off = −0.5″ (rounding profiles) the grid is
 * exactly where the profile-rounded integer arcsecond changes cell, so an
 * event is where the chart's own sign/nakshatra/pada changes.
 *
 * Why nothing is missed. Every top-level step [a, b] is either
 *  (1) proven free of motion reversals — then X is monotonic on [a, b] and
 *      the crossings are exactly the T_k between X(a) and X(b), each solved
 *      by safeguarded Newton (bracketed, to < 0.01 s); or
 *  (2) proven not to reach any threshold: X(t) can only lie in
 *      [(Xa+Xb−P)/2, (Xa+Xb+P)/2], P a bound on the path length ∫|dX/dt|; or
 *  (3) split in half and re-examined.
 * "No reversal" is proven from the endpoint speeds and an acceleration
 * bound: a zero of the rate at c forces |v(a)| + |v(b)| ≤ 2E + az·(b−a).
 * Recursion stops at TAU (0.5 s): an excursion across a boundary lasting
 * less than that is reported as at most one crossing. Stations (sign
 * changes of the Swiss speed, i.e. of the chart's "R" flag) use the same
 * bound on the speed itself, down to STATION_SEP (60 s): a hidden pair of
 * stations closer together than that (a reversal lasting < 1 min) can be
 * missed — both together, so directions still alternate.
 */
import { RATE_SLACK as E, type BodySample, type Evaluator, type Motion } from './body';
import { ZODIAC } from '../zodiac';

export const TAU = 0.5 / 86400;
export const STATION_SEP = 60 / 86400;
const TOL = 1e-7;
const HALF = ZODIAC / 2;

/** Wrap an arcsecond difference into (−180°, 180°]. */
const wrap = (d: number) => {
  let x = d % ZODIAC;
  if (x > HALF) x -= ZODIAC; else if (x <= -HALF) x += ZODIAC;
  return x;
};
const sgn = (v: number) => (v < 0 ? -1 : 1);

export interface Grid { W: number; off: number }
export interface Crossing { t: number; k: number; dir: 1 | -1 }
export interface Station { t: number; raw: number; dir: 1 | -1 }

interface Node { s: BodySample; X: number }

export class BodyScan {
  /** Number of ephemeris evaluations made (for tests and tuning). */
  evals = 0;
  private top: BodySample[] | null = null;

  constructor(private readonly f: Evaluator, private readonly m: Motion,
    private readonly fromJd: number, private readonly toJd: number) {}

  private at(t: number): BodySample { this.evals++; return this.f(t); }

  private topSamples(): BodySample[] {
    if (this.top) return this.top;
    const { fromJd: a, toJd: b } = this;
    const n = Math.max(1, Math.ceil((b - a) / this.m.h0));
    const out: BodySample[] = [];
    for (let i = 0; i <= n; i++) out.push(this.at(i === n ? b : a + ((b - a) * i) / n));
    return (this.top = out);
  }

  /** Rate cannot vanish on [a, b] (so X is strictly monotonic). */
  private noReversal(a: BodySample, b: BodySample): boolean {
    const m = this.m;
    if (m.monotonic) return true;
    const h = b.t - a.t, e = E + m.dv;
    if (h * m.az >= m.vz - e) return false;
    const va = Math.abs(a.v), vb = Math.abs(b.v);
    return sgn(a.v) === sgn(b.v) && va > e && vb > e && va + vb - 2 * e > m.az * h;
  }

  /** Bound on the path length ∫|dX/dt| over [a, b], arcseconds. */
  private path(a: BodySample, b: BodySample): number {
    const m = this.m, h = b.t - a.t;
    const va = Math.abs(a.v), vb = Math.abs(b.v);
    let p = m.vmax * h;
    if (Math.max(va, vb) + m.dv + m.az * h < m.vz) p = Math.min(p, (E + m.dv) * h + (h * (va + vb)) / 2 + (m.az * h * h) / 2);
    return p * 3600 + 2 * m.jump;
  }

  crossings(g: Grid): Crossing[] {
    const out: Crossing[] = [];
    const top = this.topSamples();
    for (let i = 0; i + 1 < top.length; i++) {
      const a = top[i]!, b = top[i + 1]!;
      this.seg({ s: a, X: a.raw }, { s: b, X: a.raw + wrap(b.raw - a.raw) }, g, out);
    }
    return out;
  }

  private seg(a: Node, b: Node, g: Grid, out: Crossing[]): void {
    if (this.noReversal(a.s, b.s)) { this.emit(a, b, g, true, out); return; }
    const p = this.path(a.s, b.s);
    const lo = (a.X + b.X - p) / 2, hi = (a.X + b.X + p) / 2;
    if (Math.ceil((lo - g.off) / g.W) > Math.floor((hi - g.off) / g.W)) return;
    if (b.s.t - a.s.t <= TAU) { this.emit(a, b, g, false, out); return; }
    const s = this.at((a.s.t + b.s.t) / 2);
    const mid = { s, X: a.X + wrap(s.raw - a.s.raw) };
    this.seg(a, mid, g, out);
    this.seg(mid, b, g, out);
  }

  /** The thresholds between X(a) and X(b), solved in time order. */
  private emit(a: Node, b: Node, g: Grid, monotonic: boolean, out: Crossing[]): void {
    const ia = Math.floor((a.X - g.off) / g.W), ib = Math.floor((b.X - g.off) / g.W);
    if (ib > ia) for (let k = ia + 1; k <= ib; k++) out.push({ t: this.solve(a, b, k * g.W + g.off, 1, monotonic), k, dir: 1 });
    else for (let k = ia; k > ib; k--) out.push({ t: this.solve(a, b, k * g.W + g.off, -1, monotonic), k, dir: -1 });
  }

  /**
   * Instant where dir·(X − T) turns ≥ 0 inside [a, b] (bracketed: negative
   * at a, ≥ 0 at b). Newton on the Swiss speed when X is monotonic,
   * bisection otherwise; < TOL days.
   */
  private solve(a: Node, b: Node, T: number, dir: 1 | -1, newton: boolean): number {
    let lo = a.s.t, hi = b.s.t;
    const ga = dir * (a.X - T), gb = dir * (b.X - T);
    let t = lo + ((hi - lo) * ga) / (ga - gb);
    if (!(t > lo && t < hi)) t = (lo + hi) / 2;
    for (let i = 0; i < 200 && hi - lo > TOL; i++) {
      const s = this.at(t);
      const gt = dir * (a.X + wrap(s.raw - a.s.raw) - T);
      if (gt < 0) lo = t; else hi = t;
      let next = (lo + hi) / 2;
      if (newton && s.v !== 0) {
        const step = gt / (dir * s.v * 3600);
        const n = t - step;
        if (n > lo && n < hi) {
          if (Math.abs(step) < TOL / 4) return n; // converged; root within |step|
          next = n;
        }
      }
      t = next;
    }
    return (lo + hi) / 2;
  }

  stations(): Station[] {
    const out: Station[] = [];
    if (this.m.monotonic) return out;
    const top = this.topSamples();
    for (let i = 0; i + 1 < top.length; i++) this.st(top[i]!, top[i + 1]!, out);
    return out;
  }

  /**
   * Stations in [a, b]. The evaluated samples form a partition of [a, b] and
   * each sign change between neighbours yields exactly one station, so
   * directions alternate by construction. Around a station c the speed is
   * re-sampled at c ± STATION_SEP; a second sign change inside that window
   * is still found (it shows as a sign difference with the bracket).
   */
  private st(a: BodySample, b: BodySample, out: Station[]): void {
    const m = this.m, h = b.t - a.t;
    if (sgn(a.v) !== sgn(b.v)) {
      const { lo, hi, station } = this.solveStation(a, b);
      out.push(station);
      const lt = station.t - STATION_SEP, rt = station.t + STATION_SEP;
      if (lt > a.t) { const l = this.at(lt); this.st(l, lo, out); this.st(a, l, out); } else this.st(a, lo, out);
      if (rt < b.t) { const r = this.at(rt); this.st(hi, r, out); this.st(r, b, out); } else this.st(hi, b, out);
      return;
    }
    if (h * m.az < m.vz - m.dv && Math.abs(a.v) + Math.abs(b.v) > m.az * h + 2 * m.dv) return;
    if (h <= STATION_SEP) return;
    const mid = this.at((a.t + b.t) / 2);
    this.st(a, mid, out);
    this.st(mid, b, out);
  }

  /** Illinois regula falsi on the speed; returns the final bracket and the station. */
  private solveStation(a: BodySample, b: BodySample): { lo: BodySample; hi: BodySample; station: Station } {
    let lo = a, hi = b;
    let flo = a.v, fhi = b.v;
    let side = 0;
    for (let i = 0; i < 200 && hi.t - lo.t > TOL; i++) {
      let t = lo.t + ((hi.t - lo.t) * flo) / (flo - fhi);
      if (!(t > lo.t && t < hi.t)) t = (lo.t + hi.t) / 2;
      const s = this.at(t);
      if (sgn(s.v) === sgn(a.v)) {
        lo = s; flo = s.v;
        if (side === -1) fhi /= 2;
        side = -1;
      } else {
        hi = s; fhi = s.v;
        if (side === 1) flo /= 2;
        side = 1;
      }
    }
    const raw = lo.raw + wrap(hi.raw - lo.raw) / 2;
    return { lo, hi, station: { t: (lo.t + hi.t) / 2, raw: ((raw % ZODIAC) + ZODIAC) % ZODIAC, dir: sgn(b.v) as 1 | -1 } };
  }
}

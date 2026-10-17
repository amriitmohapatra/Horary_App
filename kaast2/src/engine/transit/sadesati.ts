/**
 * Sade Sati: Saturn transiting the 12th, 1st and 2nd signs from the natal
 * Moon sign (STD, BPHS tradition; PL lists it in the transit screens).
 *
 * Retrograde re-entries are MERGED into one period and kept visible:
 *  - `phases` lists every stay in a window sign in time order, so a
 *    retrograde return from the 1st to the 12th appears as 12th, 1st, 12th,
 *    1st, …;
 *  - when Saturn leaves the window and comes back through the SAME edge
 *    (a retrograde loop straddling the start or end boundary), the time
 *    outside is an `excursion` of the same period. Leaving through the far
 *    edge (direct, out of the 2nd) ends the period; the next one starts
 *    about 22½ years later through the near edge.
 * The search looks 400 days beyond [fromJd, toJd] (clamped to the
 * ephemeris range) so that an excursion straddling a range edge is still
 * recognised; results are clipped to [fromJd, toJd] and flagged.
 */
import type { SwissEph } from '../ephem/swisseph';
import { PROFILES, type Profile, type ProfileId } from '../profiles';
import { signIndex } from '../zodiac';
import { TRANSIT_JD_MAX, TRANSIT_JD_MIN, findEvents, transitPositions } from './events';

export type SadeSatiPhase = '12th' | '1st' | '2nd';

export interface SadeSatiPeriod {
  start: number;
  end: number;
  /** The true start (or end) lies outside [fromJd, toJd]; start (end) is clipped. */
  startClipped: boolean;
  endClipped: boolean;
  phases: { phase: SadeSatiPhase; sign: number; start: number; end: number }[];
  /** Retrograde loops out of the window and back through the same edge. */
  excursions: { sign: number; start: number; end: number }[];
}

const LOOK = 400;
const PHASE: Record<number, SadeSatiPhase> = { 11: '12th', 0: '1st', 1: '2nd' };

interface Stay { sign: number; rel: number; start: number; end: number }

export function sadeSati(swe: SwissEph, profile: Profile | ProfileId, natalMoonSign: number,
  fromJd: number, toJd: number): SadeSatiPeriod[] {
  const p = typeof profile === 'string' ? PROFILES[profile] : profile;
  if (!(toJd > fromJd)) throw new RangeError('toJd must be after fromJd');
  const a = Math.max(TRANSIT_JD_MIN, fromJd - LOOK), b = Math.min(TRANSIT_JD_MAX, toJd + LOOK);
  const moon = ((natalMoonSign % 12) + 12) % 12;
  const rel = (s: number) => (s - moon + 12) % 12;

  // Saturn's sign timeline over [a, b].
  const stays: Stay[] = [];
  let sign = signIndex(transitPositions(swe, p, a).Sa.lon), start = a;
  for (const e of findEvents(swe, p, { bodies: ['Sa'], kinds: ['sign'], fromJd: a, toJd: b })) {
    stays.push({ sign, rel: rel(sign), start, end: e.jdUT });
    sign = e.to; start = e.jdUT;
  }
  stays.push({ sign, rel: rel(sign), start, end: b });

  const inWin = (s: Stay) => s.rel in PHASE;
  const periods: SadeSatiPeriod[] = [];
  let cur: SadeSatiPeriod | null = null;
  let gap: Stay[] = [];
  for (let i = 0; i < stays.length; i++) {
    const s = stays[i]!;
    if (!inWin(s)) { if (cur) gap.push(s); continue; }
    const before = stays[i - 1];
    if (cur && gap.length) {
      const exitedVia = gap[0]!.rel, enteredFrom = before!.rel;
      if (exitedVia === enteredFrom) cur.excursions.push(...gap.map(({ sign: sg, start: st, end: en }) => ({ sign: sg, start: st, end: en })));
      else { periods.push(cur); cur = null; }
      gap = [];
    }
    if (!cur) {
      // Unknown true start: Saturn already in the window at `a`, or (range
      // edge only) `a` may fall inside an excursion of an earlier period.
      const unknown = !before || (periods.length === 0 && a > fromJd - LOOK && stays.slice(0, i).every((x) => x.rel === before.rel));
      cur = { start: s.start, end: s.end, startClipped: unknown, endClipped: false, phases: [], excursions: [] };
    }
    cur.phases.push({ phase: PHASE[s.rel]!, sign: s.sign, start: s.start, end: s.end });
    cur.end = s.end;
  }
  if (cur) {
    // Still in the window at `b`, or left it too close to `b` to know whether it comes back.
    if (!gap.length || b - cur.end < LOOK) cur.endClipped = true;
    periods.push(cur);
  }

  // Clip to [fromJd, toJd].
  const out: SadeSatiPeriod[] = [];
  for (const per of periods) {
    if (per.end <= fromJd || per.start >= toJd) continue;
    const clip = <T extends { start: number; end: number }>(xs: T[]) =>
      xs.filter((x) => x.end > fromJd && x.start < toJd).map((x) => ({ ...x, start: Math.max(x.start, fromJd), end: Math.min(x.end, toJd) }));
    out.push({
      start: Math.max(per.start, fromJd), end: Math.min(per.end, toJd),
      startClipped: per.startClipped || per.start < fromJd,
      endClipped: per.endClipped || per.end > toJd,
      phases: clip(per.phases), excursions: clip(per.excursions),
    });
  }
  return out;
}

/**
 * Vimshottari dasha to six levels (Maha → Antar → Pratyantar → Sookshma →
 * Prana → Deha). Times are Julian Days (UT). The timeline is anchored ONCE
 * at the chart moment and walked structurally (invariant 7). The year
 * length comes from the profile: PL uses 365.2421875 days (BIN, and NUM on
 * the PL9 Page 1: 10/10 dates), Kala Chakra 365.25.
 */
import type { PlanetId } from '../types';
import { VIM_ORDER, VIM_YEARS } from '../zodiac';

export const LEVEL_NAMES = ['Maha', 'Antar', 'Pratyantar', 'Sookshma', 'Prana', 'Deha'] as const;

export interface DashaPeriod {
  /** Lords from Maha down to this level. */
  lords: PlanetId[];
  start: number;
  end: number;
}

const NAK_DEG = 40 / 3;

/** The nine Mahadashas of the cycle that contains the chart moment. */
export function mahadashas(moonDeg: number, jdUT: number, yearDays: number): DashaPeriod[] {
  const m = ((moonDeg % 360) + 360) % 360;
  const nak = Math.floor(m / NAK_DEG);
  const frac = m / NAK_DEG - nak;
  const first = VIM_ORDER[nak % 9]!;
  let t = jdUT - VIM_YEARS[first] * frac * yearDays;
  const i0 = VIM_ORDER.indexOf(first);
  const out: DashaPeriod[] = [];
  for (let i = 0; i < 9; i++) {
    const l = VIM_ORDER[(i0 + i) % 9]!;
    const dt = VIM_YEARS[l] * yearDays;
    out.push({ lords: [l], start: t, end: t + dt });
    t += dt;
  }
  return out;
}

/** Split a period into its nine sub-periods, starting from its own lord. */
export function subperiods(p: DashaPeriod): DashaPeriod[] {
  const total = p.end - p.start;
  const i0 = VIM_ORDER.indexOf(p.lords[p.lords.length - 1]!);
  const out: DashaPeriod[] = [];
  let t = p.start;
  for (let i = 0; i < 9; i++) {
    const l = VIM_ORDER[(i0 + i) % 9]!;
    const dt = (total * VIM_YEARS[l]) / 120;
    out.push({ lords: [...p.lords, l], start: t, end: t + dt });
    t += dt;
  }
  out[8]!.end = p.end;
  return out;
}

/** Chain of periods running at `jd`, `levels` deep (1 = Maha only). */
export function chainAt(mahas: DashaPeriod[], jd: number, levels = 3): DashaPeriod[] {
  let cur = mahas.find((p) => p.start <= jd && jd < p.end);
  if (!cur) return [];
  const chain = [cur];
  for (let i = 1; i < levels; i++) {
    const subs = subperiods(cur);
    cur = subs.find((p) => p.start <= jd && jd < p.end) ?? subs[8]!;
    chain.push(cur);
  }
  return chain;
}

/** All periods `depth` levels deep (0 = Maha) overlapping [from, to). */
export function periodsInWindow(mahas: DashaPeriod[], depth: number, from: number, to: number): DashaPeriod[] {
  const out: DashaPeriod[] = [];
  const walk = (p: DashaPeriod, level: number) => {
    if (p.end <= from || p.start >= to) return;
    if (level === depth) { out.push(p); return; }
    for (const s of subperiods(p)) walk(s, level + 1);
  };
  for (const m of mahas) walk(m, 0);
  return out;
}

/** The next `n` periods `depth` levels deep that end after `from` (current first). */
export function periodsFrom(mahas: DashaPeriod[], depth: number, from: number, n: number): DashaPeriod[] {
  const out: DashaPeriod[] = [];
  const walk = (p: DashaPeriod, level: number) => {
    if (out.length >= n || p.end <= from) return;
    if (level === depth) { out.push(p); return; }
    for (const s of subperiods(p)) walk(s, level + 1);
  };
  for (const m of mahas) walk(m, 0);
  return out;
}

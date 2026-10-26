/**
 * Historical UTC offsets from the IANA time-zone database that every browser carries (Intl),
 * so the app stays offline. Used for atlas places outside India; Indian places keep the
 * PL-verified rule in places.ts (IST, war time 1942–45), because the database's
 * Asia/Kolkata history follows Calcutta's clocks (local mean time before 1906, +6:30 in 1941–42)
 * rather than the IST convention PL and this app use.
 */

const fmt = new Map<string, Intl.DateTimeFormat>();
function formatter(zone: string): Intl.DateTimeFormat {
  let f = fmt.get(zone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', era: 'short', year: 'numeric', month: 'numeric',
      day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    fmt.set(zone, f);
  }
  return f;
}

/** Milliseconds since 1970 of a civil date-time read as UTC (years of any size, unlike Date.UTC). */
function civilMs(y: number, m: number, d: number, h = 0, mi = 0, s = 0): number {
  const t = new Date(0);
  t.setUTCFullYear(y, m - 1, d);
  t.setUTCHours(h, mi, s, 0);
  return t.getTime();
}

/** UTC offset of `zone` at the instant `ms`, in hours east (seconds kept: local mean time is not whole minutes). */
export function offsetAtInstant(zone: string, ms: number): number {
  const p: Record<string, string> = {};
  for (const x of formatter(zone).formatToParts(new Date(ms))) p[x.type] = x.value;
  const y = p.era === 'BC' || p.era === 'B' ? 1 - +p.year! : +p.year!;
  const local = civilMs(y, +p.month!, +p.day!, +p.hour! % 24, +p.minute!, +p.second!);
  return Math.round((local - Math.floor(ms / 1000) * 1000) / 1000) / 3600;
}

/** UTC offset in force at a local civil date-time in `zone` (hours east). */
export function offsetAtLocal(zone: string, y: number, m: number, d: number, h = 12, mi = 0): number {
  const wall = civilMs(y, m, d, h, mi);
  let off = offsetAtInstant(zone, wall);
  // two refinements settle times next to a clock change
  for (let k = 0; k < 2; k++) off = offsetAtInstant(zone, wall - off * 3600_000);
  return off;
}

const r6 = (x: number) => Math.round(x * 1e6) / 1e6;

/**
 * Zone and daylight saving for a local date-time, split the way the chart form holds them:
 * daylight saving is a whole hour on top of the standard zone (the smaller of the January and
 * July offsets of that year). Any other shift (double summer time, half-hour DST) goes into the zone.
 */
export function zoneAt(zone: string, y: number, m: number, d: number, h = 12, mi = 0): { tz: number; dst: number } {
  const total = offsetAtLocal(zone, y, m, d, h, mi);
  const std = Math.min(offsetAtLocal(zone, y, 1, 15), offsetAtLocal(zone, y, 7, 15));
  return Math.abs(total - std - 1) < 1e-9 ? { tz: r6(std), dst: 1 } : { tz: r6(total), dst: 0 };
}

/** True when the browser knows this IANA zone name. */
export function knownZone(zone: string): boolean {
  try { formatter(zone); return true; } catch { return false; }
}

/** Number and date formatting, centralised (the Odia edition swaps numerals here). */
import { fromJulianDay, weekday } from '../engine/time/julian';
import { SIGNS } from '../engine/zodiac';

export const pad2 = (n: number) => String(n).padStart(2, '0');
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export const signAbbr = (s: number) => SIGNS[s]!;
export const dms = (d: number, m: number, s: number) => `${pad2(d)}:${pad2(m)}:${pad2(s)}`;
export const dm = (d: number, m: number) => `${pad2(d)}:${pad2(m)}`;

/** Degrees → 24°12′23.0″ */
export function degDms(x: number, decimals = 1): string {
  const sign = x < 0 ? '−' : '';
  let t = Math.abs(x) * 3600;
  const d = Math.floor(t / 3600); t -= d * 3600;
  const m = Math.floor(t / 60); t -= m * 60;
  return `${sign}${d}°${pad2(m)}′${t.toFixed(decimals).padStart(decimals ? 3 + decimals : 2, '0')}″`;
}

/** JD (UT) → civil date in a zone, dd-mm-yyyy. */
export function civilDate(jdUT: number, zoneHours: number): string {
  const c = fromJulianDay(jdUT + zoneHours / 24);
  return `${pad2(c.d)}-${pad2(c.m)}-${c.y}`;
}
export function civilTime(jdUT: number, zoneHours: number): string {
  const c = fromJulianDay(jdUT + zoneHours / 24);
  return `${pad2(c.h)}:${pad2(c.mi)}`;
}
export function civilWeekday(jdUT: number, zoneHours: number): string {
  return WEEKDAYS[weekday(jdUT + zoneHours / 24)]!;
}
export function longDate(y: number, m: number, d: number): string {
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
export function hms(h: number, mi: number, s: number): string { return `${pad2(h)}:${pad2(mi)}:${pad2(s)}`; }

export function coords(lat: number, lon: number): string {
  const f = (v: number, pos: string, neg: string) => {
    const t = Math.round(Math.abs(v) * 60);
    return `${Math.floor(t / 60)}${v >= 0 ? pos : neg}${pad2(t % 60)}`;
  };
  return `${f(lat, 'N', 'S')}  ${f(lon, 'E', 'W')}`;
}

export function zone(h: number): string {
  const s = h < 0 ? '−' : '+';
  const t = Math.round(Math.abs(h) * 60);
  return `${s}${Math.floor(t / 60)}:${pad2(t % 60)}`;
}

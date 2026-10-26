/**
 * Place gazetteer: canonical built-in places plus the user's saved places
 * (localStorage, versioned key, try/catch everywhere — invariant 12).
 * Coordinates: decimal degrees, +N / +E. `tz`: standard zone, hours east.
 * `zone`: IANA time-zone name (atlas places), for the offset in force on a given date.
 */
import { knownZone, zoneAt } from './zones';

export interface Place { name: string; lat: number; lon: number; tz: number; country?: string; zone?: string }

export const BUILTIN_PLACES: readonly Place[] = [
  { name: 'Puri (Karar Ashram)', lat: 19.7944, lon: 85.8189, tz: 5.5, country: 'IN' },
  { name: 'Bhubaneswar', lat: 20.27, lon: 85.84, tz: 5.5, country: 'IN' },
  { name: 'Cuttack', lat: 20.465, lon: 85.879, tz: 5.5, country: 'IN' },
  { name: 'Lapanga', lat: 21.7033, lon: 84.03139, tz: 5.5, country: 'IN' },
  { name: 'New Delhi', lat: 28.6139, lon: 77.209, tz: 5.5, country: 'IN' },
  { name: 'Allahabad (Prayagraj)', lat: 25.45, lon: 81.85, tz: 5.5, country: 'IN' },
  { name: 'Mumbai', lat: 18.975, lon: 72.8258, tz: 5.5, country: 'IN' },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639, tz: 5.5, country: 'IN' },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, tz: 5.5, country: 'IN' },
  { name: 'Singapore', lat: 1.28333, lon: 103.85, tz: 8, country: 'SG' },
  { name: 'London', lat: 51.5074, lon: -0.1278, tz: 0, country: 'GB' },
  { name: 'New York', lat: 40.7128, lon: -74.006, tz: -5, country: 'US' },
];

const KEY = 'kaast2.places.v1';

export function savedPlaces(): Place[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as Place[]) : [];
    return Array.isArray(list) ? list.filter((p) => p && typeof p.name === 'string') : [];
  } catch { return []; }
}

export function allPlaces(): Place[] {
  const seen = new Set<string>();
  return [...savedPlaces(), ...BUILTIN_PLACES].filter((p) => {
    const k = p.name.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function savePlace(p: Place): boolean {
  if (!p.name.trim() || ![p.lat, p.lon, p.tz].every(Number.isFinite)) return false;
  const list = savedPlaces().filter((q) => q.name.toLowerCase() !== p.name.trim().toLowerCase());
  list.unshift({ ...p, name: p.name.trim() });
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, 100))); return true; }
  catch { return false; }
}

export interface ZoneOnDate {
  tz: number;
  /** Daylight-saving hour on top of `tz` (0 or 1). */
  dst: number;
  /** india_war_time: IST + 1 h applied; zone_db: taken from the time-zone database for that date. */
  note?: 'india_war_time' | 'zone_db';
}

/**
 * The zone in force at a place on a date. Indian places follow the PL-verified rule: IST, and
 * war time (IST + 1 h) from 1942-09-01 to 1945-10-15. Other places with an IANA zone (atlas
 * places) take the offset and daylight saving in force at that local date and time from the
 * time-zone database (zones.ts). Places without a zone keep their fixed `tz`.
 */
export function zoneFor(place: Place, y: number, m: number, d: number, h = 12, mi = 0): ZoneOnDate {
  const ymd = y * 10000 + m * 100 + d;
  // Indian places: by country, or (for typed/saved places) by IST and coordinates inside India.
  const inIndia = place.country === 'IN' || (place.country === undefined && place.lat >= 6 && place.lat <= 37.5 && place.lon >= 68 && place.lon <= 97.5);
  if (inIndia) {
    if (place.tz === 5.5 && ymd >= 19420901 && ymd < 19451015) return { tz: 6.5, dst: 0, note: 'india_war_time' };
    return { tz: place.tz, dst: 0 };
  }
  if (place.zone && knownZone(place.zone)) return { ...zoneAt(place.zone, y, m, d, h, mi), note: 'zone_db' };
  return { tz: place.tz, dst: 0 };
}

export function deletePlace(name: string): boolean {
  const list = savedPlaces().filter((q) => q.name.toLowerCase() !== name.trim().toLowerCase());
  try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch { return false; }
}

/**
 * Read a latitude or longitude typed in any common form: decimal degrees
 * ("21.7033", "-84.03"), degrees-minutes(-seconds) with spaces or symbols
 * ("21 42 12 N", "21°42′12″N", "84°01'53\"E", "21:42:12"), with N/S/E/W or a
 * sign. Returns decimal degrees (north and east positive), or null.
 */
export function parseCoord(text: string, kind: 'lat' | 'lon'): number | null {
  const s = text.trim().toUpperCase().replace(/[°º′'’″"”:]/g, ' ').replace(/,/g, '.').replace(/\s+/g, ' ').trim();
  if (!s) return null;
  // optional sign or leading hemisphere, 1–3 numbers, optional trailing hemisphere
  const m = /^([+-]|[NSEW])?\s*(\d+(?:\.\d+)?)(?:\s+(\d+(?:\.\d+)?))?(?:\s+(\d+(?:\.\d+)?))?\s*([NSEW])?$/.exec(s);
  if (!m) return null;
  const lead = m[1], trail = m[5];
  if (lead && /[NSEW]/.test(lead) && trail) return null;
  const hemi = trail ?? (lead && /[NSEW]/.test(lead) ? lead : undefined);
  const deg = +m[2]!, min = m[3] ? +m[3] : 0, sec = m[4] ? +m[4] : 0;
  if (min >= 60 || sec >= 60 || ((m[3] || m[4]) && !Number.isInteger(deg))) return null;
  if (hemi && ((kind === 'lat' && /[EW]/.test(hemi)) || (kind === 'lon' && /[NS]/.test(hemi)))) return null;
  const sign = (lead === '-' ? -1 : 1) * (hemi === 'S' || hemi === 'W' ? -1 : 1);
  const v = sign * (deg + min / 60 + sec / 3600);
  return Math.abs(v) <= (kind === 'lat' ? 90 : 180) ? v : null;
}

export const PLACES_FORMAT = 'astro-amriit-places';

/** A backup file of the saved places (to keep a copy, or move them to another device). */
export function exportPlaces(): string {
  return JSON.stringify({ format: PLACES_FORMAT, version: 1, places: savedPlaces() }, null, 2);
}

/** Merge places from a backup file: same name → replaced. Returns how many were read. */
export function importPlaces(text: string): number {
  let doc: unknown;
  try { doc = JSON.parse(text); } catch { throw new Error('This file is not a places file (not JSON).'); }
  const d = doc as { format?: string; places?: Place[] };
  if (d?.format !== PLACES_FORMAT || !Array.isArray(d.places)) throw new Error('This file is not an Astro-Amriit places file.');
  const ok = d.places.filter((p) => p && typeof p.name === 'string' && p.name.trim()
    && [p.lat, p.lon, p.tz].every((x) => typeof x === 'number' && Number.isFinite(x))
    && Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180 && Math.abs(p.tz) <= 14);
  for (const p of [...ok].reverse()) savePlace({ name: p.name, lat: p.lat, lon: p.lon, tz: p.tz, ...(p.country ? { country: p.country } : {}), ...(typeof p.zone === 'string' ? { zone: p.zone } : {}) });
  return ok.length;
}

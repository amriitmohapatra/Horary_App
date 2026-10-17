/**
 * Place gazetteer: canonical built-in places plus the user's saved places
 * (localStorage, versioned key, try/catch everywhere — invariant 12).
 * Coordinates: decimal degrees, +N / +E. `tz`: standard zone, hours east.
 */
export interface Place { name: string; lat: number; lon: number; tz: number; country?: string }

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

/**
 * Historical zone corrections that atlases (and PL) apply automatically.
 * India war time: IST + 1 h from 1942-09-01 to 1945-10-15.
 */
export function zoneFor(place: Place, y: number, m: number, d: number): { tz: number; note?: 'india_war_time' } {
  const ymd = y * 10000 + m * 100 + d;
  if (place.country === 'IN' && place.tz === 5.5 && ymd >= 19420901 && ymd < 19451015) {
    return { tz: 6.5, note: 'india_war_time' };
  }
  return { tz: place.tz };
}

/**
 * The offline world atlas: about 86 000 places from GeoNames (CC BY 4.0), embedded in the
 * app (src/io/atlas/atlas.txt, built by scripts/build_atlas.mjs; format described there).
 * Parsed on first use. Search is by name or former name (Bombay, Allahabad), without
 * diacritics; "Puri, Odisha" narrows by region or country. Larger places come first.
 */
import raw from './atlas/atlas.txt?raw';
import { type Place } from './places';
import { zoneAt } from './zones';

export interface AtlasPlace {
  name: string;
  /** English or former names (Indian places). */
  alts: string[];
  region: string;
  country: string;
  /** ISO country code. */
  cc: string;
  lat: number;
  lon: number;
  /** IANA time-zone name. */
  zone: string;
}

export const ATLAS_CREDIT = 'GeoNames (geonames.org), CC BY 4.0';

/** Lower case, accents removed, punctuation as spaces: "Bhubaneswar", "Bhubanēśvar" → "bhubaneswar". */
export const fold = (s: string): string =>
  (/^[\x20-\x7e]*$/.test(s) ? s : s.normalize('NFD').replace(/\p{M}/gu, '')).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

interface Loaded { rows: AtlasPlace[]; keys: string[]; altKeys: (string[] | null)[]; where: string[] }
let loaded: Loaded | null = null;

function load(): Loaded {
  if (loaded) return loaded;
  const lines = raw.split('\n');
  const zones = lines[1]!.split('\t').slice(1);
  const regions = lines[2]!.split('\t').slice(1).map((r) => r.split('|'));
  const regionWhere = regions.map(([cc, country, region]) => fold(`${region ?? ''} ${country ?? ''} ${cc}`));
  const rows: AtlasPlace[] = [], keys: string[] = [], altKeys: (string[] | null)[] = [], where: string[] = [];
  for (let i = 3; i < lines.length; i++) {
    const c = lines[i]!.split('\t');
    if (c.length < 6) continue;
    const r = parseInt(c[2]!, 36);
    const [cc, country, region] = regions[r]!;
    const alts = c[1] ? c[1].split(';') : [];
    rows.push({ name: c[0]!, alts, region: region ?? '', country: country ?? cc!, cc: cc!,
      lat: parseInt(c[3]!, 36) / 1e4, lon: parseInt(c[4]!, 36) / 1e4, zone: zones[parseInt(c[5]!, 36)]! });
    keys.push(fold(c[0]!));
    altKeys.push(alts.length ? alts.map(fold) : null);
    where.push(regionWhere[r]!);
  }
  loaded = { rows, keys, altKeys, where };
  return loaded;
}

/** Number of places in the atlas. */
export function atlasSize(): number { return load().rows.length; }

/** "Prayagraj, Uttar Pradesh, India". */
export function atlasLabel(p: AtlasPlace): string {
  return [p.name, p.region, p.country].filter(Boolean).join(', ');
}

export interface AtlasHit { place: AtlasPlace; /** the former name that matched, if any */ via?: string }

/**
 * Places matching `query`, best first: the name or a former name equal to the query, then
 * starting with it, then a later word of the name starting with it. Within each group, larger
 * places first (so "Calcutta" gives Kolkata before Calcutta, Ohio). Text after a comma must
 * match the region or country.
 */
export function searchAtlas(query: string, limit = 8): AtlasHit[] {
  const [head, ...rest] = query.split(',');
  const q = fold(head ?? '');
  if (q.length < 2) return [];
  const filters = rest.map(fold).filter(Boolean);
  const { rows, keys, altKeys, where } = load();
  const tiers: AtlasHit[][] = [[], [], []];
  for (let i = 0; i < rows.length; i++) {
    const k = keys[i]!, alts = altKeys[i];
    let tier = -1, via: string | undefined;
    if (k === q) tier = 0;
    else if (alts && alts.includes(q)) { tier = 0; via = rows[i]!.alts[alts.indexOf(q)]; }
    else if (k.startsWith(q)) tier = 1;
    else if (alts && alts.some((a) => a.startsWith(q))) { tier = 1; via = rows[i]!.alts[alts.findIndex((a) => a.startsWith(q))]; }
    else if (k.includes(` ${q}`)) tier = 2;
    if (tier < 0 || tiers[tier]!.length >= limit) continue;
    if (filters.length && !filters.every((f) => (` ${where[i]}`).includes(` ${f}`))) continue;
    tiers[tier]!.push({ place: rows[i]!, ...(via ? { via } : {}) });
    if (tiers[0]!.length >= limit) break; // exact matches alone fill the list
  }
  return tiers.flat().slice(0, limit);
}

/** An atlas place as a form place: the label as its name, its zone kept for historical offsets. */
export function atlasToPlace(p: AtlasPlace, y = new Date().getUTCFullYear()): Place {
  return { name: atlasLabel(p), lat: p.lat, lon: p.lon, tz: zoneAt(p.zone, y, 1, 15).tz, country: p.cc, zone: p.zone };
}

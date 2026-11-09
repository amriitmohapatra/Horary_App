/**
 * Build the offline world atlas (src/io/atlas/atlas.txt) from GeoNames dumps (CC BY 4.0).
 *   node scripts/build_atlas.mjs <geonames_dir>
 * <geonames_dir> holds, unzipped from https://download.geonames.org/export/dump/ :
 *   cities5000.txt, IN.txt, admin1CodesASCII.txt, countryInfo.txt, alternatenames/IN.txt
 * Places kept (populated places only; no sections, abandoned or historical sites):
 *   - every place of 5 000 people or more, worldwide (cities5000);
 *   - every Indian place GeoNames gives a population for;
 *   - every populated place in Odisha (GeoNames has no population for most villages).
 * Indian places also carry their English and historical names (Bombay, Calcutta, Allahabad, …).
 *
 * File format (UTF-8, tab-separated), rows ordered by population, largest first:
 *   #astro-amriit-atlas <tab> 1 <tab> <date> <tab> <credit>
 *   Z <tab> zone0 <tab> zone1 …              IANA time-zone names
 *   A <tab> CC|Country|Region <tab> …        country code, country name, first-level region
 *   name <tab> alt1;alt2 <tab> region# <tab> lat <tab> lon <tab> zone#
 * Numbers are base 36; lat and lon are in units of 1e-4 degree.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const src = process.argv[2];
if (!src) { console.error('usage: node scripts/build_atlas.mjs <geonames_dir>'); process.exit(2); }
const root = resolve(import.meta.dirname, '..');
const outDir = join(root, 'src/io/atlas');
const tsv = (f) => readFileSync(join(src, f), 'utf8').split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.split('\t'));

const KEEP = new Set(['PPL', 'PPLA', 'PPLA2', 'PPLA3', 'PPLA4', 'PPLA5', 'PPLC', 'PPLG', 'PPLL', 'PPLS', 'PPLF', 'PPLR']);
const ODISHA = '21';
// Well-known former names that GeoNames lists without an English/historic flag.
const FORMER = { Pune: ['Poona'], Vadodara: ['Baroda'], Kanpur: ['Cawnpore'], Brahmapur: ['Berhampur'], Shimla: ['Simla'],
  Mysuru: ['Mysore'], Gurugram: ['Gurgaon'], Puducherry: ['Pondicherry'], Kozhikode: ['Calicut'], Kochi: ['Cochin'],
  Mangaluru: ['Mangalore'], Belagavi: ['Belgaum'], Vijayawada: ['Bezwada'], Thoothukudi: ['Tuticorin'], Kollam: ['Quilon'] };

const countries = Object.fromEntries(tsv('countryInfo.txt').map((r) => [r[0], r[4]]));
const admin1 = Object.fromEntries(tsv('admin1CodesASCII.txt').map((r) => [r[0], r[1]]));

const places = new Map(); // geonameid -> row
const add = (r) => {
  if (r[6] !== 'P' || !KEEP.has(r[7]) || places.has(r[0])) return;
  places.set(r[0], { id: r[0], name: r[1], lat: +r[4], lon: +r[5], cc: r[8], adm: r[10], pop: +r[14] || 0, zone: r[17] });
};
for (const r of tsv('cities5000.txt')) add(r);
for (const r of tsv('IN.txt')) if ((+r[14] || 0) > 0 || r[10] === ODISHA) add(r);

// alternate names for Indian places: English or historical ones
const alts = new Map();
for (const r of tsv('alternatenames/IN.txt')) {
  const [, gid, lang, nm, , , colloquial, historic] = r;
  if (!places.has(gid) || (colloquial === '1' && historic !== '1') || !nm || /^https?:/.test(nm)) continue;
  if (!(lang === 'en' || (lang === '' && historic === '1'))) continue;          // English, or historic with no language
  if (!/^[a-z][a-z .'()-]*$/.test(nm.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase())) continue;  // Latin script only
  if (!alts.has(gid)) alts.set(gid, new Set());
  alts.get(gid).add(nm);
}
for (const p of places.values()) {
  if (p.cc === 'IN' && FORMER[p.name] && p.pop > 50000) for (const a of FORMER[p.name]) { if (!alts.has(p.id)) alts.set(p.id, new Set()); alts.get(p.id).add(a); }
}

const fold = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const list = [...places.values()].filter((p) => p.zone && Number.isFinite(p.lat) && Number.isFinite(p.lon))
  .sort((a, b) => b.pop - a.pop || a.name.localeCompare(b.name));
const zones = [...new Set(list.map((p) => p.zone))].sort();
const zi = new Map(zones.map((z, i) => [z, i]));
const regionKey = (p) => `${p.cc}|${countries[p.cc] ?? p.cc}|${admin1[`${p.cc}.${p.adm}`] ?? ''}`;
const regions = [...new Set(list.map(regionKey))].sort();
const ri = new Map(regions.map((r, i) => [r, i]));
const b36 = (n) => n.toString(36);
const clean = (s) => s.replace(/[\t\n;]/g, ' ').trim();

const lines = [
  ['#astro-amriit-atlas', '1', new Date().toISOString().slice(0, 10), 'GeoNames (geonames.org), CC BY 4.0'].join('\t'),
  ['Z', ...zones].join('\t'),
  ['A', ...regions].join('\t'),
];
let withAlts = 0;
for (const p of list) {
  const a = [...(alts.get(p.id) ?? [])].map(clean).filter((x) => x && fold(x) !== fold(p.name));
  if (a.length) withAlts++;
  lines.push([clean(p.name), a.join(';'), b36(ri.get(regionKey(p))), b36(Math.round(p.lat * 1e4)), b36(Math.round(p.lon * 1e4)), b36(zi.get(p.zone))].join('\t'));
}
mkdirSync(outDir, { recursive: true });
const text = lines.join('\n') + '\n';
writeFileSync(join(outDir, 'atlas.txt'), text);
const byCc = (cc) => list.filter((p) => p.cc === cc).length;
const odisha = list.filter((p) => p.cc === 'IN' && p.adm === ODISHA).length;
writeFileSync(join(outDir, 'SOURCE.md'), `# Atlas data

\`atlas.txt\` is generated by \`scripts/build_atlas.mjs\` from the GeoNames geographical database
(https://www.geonames.org), licensed under Creative Commons Attribution 4.0
(https://creativecommons.org/licenses/by/4.0/). Built ${lines[0].split('\t')[2]}.

- ${list.length} places in ${new Set(list.map((p) => p.cc)).size} countries, ${zones.length} time zones;
- India ${byCc('IN')} (Odisha ${odisha}), ${withAlts} Indian places with English or former names;
- every place of 5 000 people or more worldwide; every Indian place with a known population;
  every populated place in Odisha.

To rebuild: download cities5000.zip, IN.zip, admin1CodesASCII.txt, countryInfo.txt and
alternatenames/IN.zip from https://download.geonames.org/export/dump/, unzip them into one
folder (alternatenames/IN.txt in a subfolder), then run \`node scripts/build_atlas.mjs <folder>\`.
`);
console.log(`${list.length} places, ${zones.length} zones, ${regions.length} regions, India ${byCc('IN')} (Odisha ${odisha}), ` +
  `alternate names on ${withAlts}; ${(text.length / 1e6).toFixed(2)} MB`);

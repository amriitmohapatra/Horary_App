/**
 * Convert a folder of Parashara's Light chart files (*.xml) into Astro-Amriit chart files
 * (*.astro-amriit.json), using the app's own importer and writer, so each file is exactly what
 * the app saves after opening the PL file (birth chart only; PL "events" are listed in the report).
 *   npx vite-node scripts/pl_to_json.ts <in_dir> <out_dir>
 * The folder tree is mirrored. Every output is re-read with parseChartFile and converted back to
 * PL's format; the Julian Day must match the original to within one second.
 * Writes <out_dir>/conversion-report.json. Personal charts: keep the output out of git.
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { decodeChartBytes, parseGeoVision, toGeoVision } from '../src/io/geovision';
import { parseChartFile, toChartFile } from '../src/io/chartfile';

const [inDir, outDir] = process.argv.slice(2);
if (!inDir || !outDir) { console.error('usage: vite-node scripts/pl_to_json.ts <in_dir> <out_dir>'); process.exit(2); }

const walk = (d: string): string[] => readdirSync(d).flatMap((n) => {
  const p = join(d, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const jdOf = (xml: string, t: string) => Number(new RegExp(`<${t}>([^<]*)</${t}>`).exec(xml)?.[1]);
const DEFAULT_EVENTS = new Set(['Today', 'Muhurta']);

const report = { converted: 0, failed: [] as { file: string; error: string }[], skippedNonXml: [] as string[],
  outsideAppYears: [] as { file: string; year: number }[], namedEvents: [] as { file: string; events: string[] }[], maxRoundTripSec: 0 };

for (const file of walk(inDir).sort()) {
  const rel = relative(inDir, file);
  if (!file.toLowerCase().endsWith('.xml')) { report.skippedNonXml.push(rel); continue; }
  try {
    const text = decodeChartBytes(readFileSync(file));
    const { input, events } = parseGeoVision(text);
    const json = toChartFile(input);
    const back = parseChartFile(json);                       // the app reopens it
    const err = Math.abs(jdOf(toGeoVision(back), 'BirthDate') - jdOf(text, 'BirthDate')) * 86400;
    if (!(err <= 1)) throw new Error(`round trip differs by ${err.toFixed(1)} s`);
    report.maxRoundTripSec = Math.max(report.maxRoundTripSec, err);
    if (input.date.y < 1800 || input.date.y > 2399) report.outsideAppYears.push({ file: rel, year: input.date.y });
    const named = events.map((e) => e.name).filter((n) => !DEFAULT_EVENTS.has(n));
    if (named.length) report.namedEvents.push({ file: rel, events: named });
    const out = join(outDir, rel.replace(/\.xml$/i, '').trim() + '.astro-amriit.json');
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, json + '\n');
    report.converted++;
  } catch (e) {
    report.failed.push({ file: rel, error: (e as Error).message });
  }
}
report.maxRoundTripSec = +report.maxRoundTripSec.toFixed(3);
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'conversion-report.json'), JSON.stringify(report, null, 1) + '\n');
console.log(`converted ${report.converted}, failed ${report.failed.length}, non-xml ${report.skippedNonXml.length}, ` +
  `outside 1800–2399 ${report.outsideAppYears.length}, with named events ${report.namedEvents.length}, max round trip ${report.maxRoundTripSec} s`);

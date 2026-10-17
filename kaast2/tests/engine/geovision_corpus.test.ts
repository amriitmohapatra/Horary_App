/**
 * Every chart file in the boss's private PL collection opens (only where the
 * private folder exists; nothing from it is stored in kaast2/). The public
 * Amitabh Bachchan file must reproduce the Page 1 fixture input exactly.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { decodeChartBytes, parseGeoVision } from '../../src/io/geovision';

const root = resolve(import.meta.dirname, '../../../Astro_Fork/GeoVision/GeoVisionCharts');
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.toLowerCase().endsWith('.xml') ? [p] : [];
});

describe.skipIf(!existsSync(root))('private PL chart collection', () => {
  it('every chart file parses', () => {
    const files = walk(root);
    const bad = files.filter((f) => { try { parseGeoVision(decodeChartBytes(readFileSync(f))); return false; } catch { return true; } });
    console.log(`PL chart files: ${files.length - bad.length}/${files.length} parsed`);
    expect(bad).toEqual([]);
  });
  it('the Amitabh Bachchan file gives the Page 1 input (war time via DST)', () => {
    const f = join(root, 'Indian Celebrities/Actors/BACHHANA.xml');
    const { input } = parseGeoVision(decodeChartBytes(readFileSync(f)));
    expect([input.date, input.time, input.tzHours + input.dstHours, input.place.latDeg, input.place.lonDeg])
      .toEqual([{ y: 1942, m: 10, d: 11 }, { h: 16, mi: 0, s: 0 }, 6.5, 25.45, 81.85]);
  });
});

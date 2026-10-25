/** Rectification by ruling planets (src/engine/kp/rectify.ts) on B6's two worked cases (pp. 146–152, KP6-050). */
import { beforeAll, describe, expect, it } from 'vitest';
import { bootNode } from './boot';
import { jdUTof, type ChartInput } from '../../src/engine';
import { rectify } from '../../src/engine/kp/rectify';
import type { SwissEph } from '../../src/engine/ephem/swisseph';
import type { PlanetId } from '../../src/engine/types';

let swe: SwissEph;
beforeAll(async () => { swe = await bootNode(); });
const at = (y: number, m: number, d: number, h: number, mi: number, s: number, lat: number, lon: number): ChartInput => ({
  date: { y, m, d }, time: { h, mi, s }, tzHours: 5.5, dstHours: 0, place: { name: 'x', latDeg: lat, lonDeg: lon },
  profileId: 'pl9', overrides: { ayanamsa: 'pl_krishnamurti_new', node: 'mean' },
});
const sec = (jd: number, ref: number) => Math.round((jd - ref) * 86400);

describe('rectification by ruling planets (B6 pp. 146–152)', () => {
  it('16-10-1919, 21°07′N 73°40′E, between 4:30 and 5:30 IST; RPs Rahu, Moon, Mercury, Sun, Saturn → 5:23:50 IST', () => {
    const lat = 21 + 7 / 60, lon = 73 + 40 / 60;
    const book = jdUTof(at(1919, 10, 16, 5, 23, 50, lat, lon));
    const c = rectify(swe, at(1919, 10, 16, 4, 30, 0, lat, lon), jdUTof(at(1919, 10, 16, 4, 30, 0, lat, lon)), jdUTof(at(1919, 10, 16, 5, 30, 0, lat, lon)), ['Ra', 'Mo', 'Me', 'Su', 'Sa'] as PlanetId[]);
    const hit = c.find((x) => x.lords.join() === 'Me,Mo,Ra,Sa');
    expect(hit, JSON.stringify(c.map((x) => [x.lords.join('-'), sec(x.start, book), sec(x.end, book)]))).toBeDefined();
    // The book's moment lies in (or within a minute of) Virgo / Moon star / Rahu sub / Saturn sub-sub.
    expect(sec(hit!.start, book)).toBeLessThan(60);
    expect(sec(hit!.end, book)).toBeGreaterThan(-60);
  });
  it('13-11-1948, 17°44′N 83°23′E; RPs Sun, Moon, Mercury → Virgo 23°10′, 3:36:45 IST', () => {
    const lat = 17 + 44 / 60, lon = 83 + 23 / 60;
    const book = jdUTof(at(1948, 11, 13, 3, 36, 45, lat, lon));
    const c = rectify(swe, at(1948, 11, 13, 2, 0, 0, lat, lon), jdUTof(at(1948, 11, 13, 2, 0, 0, lat, lon)), jdUTof(at(1948, 11, 13, 5, 0, 0, lat, lon)), ['Su', 'Mo', 'Me'] as PlanetId[]);
    const hit = c.find((x) => x.lords.join() === 'Me,Mo,Su,Me');
    expect(hit, JSON.stringify(c.map((x) => [x.lords.join('-'), sec(x.start, book), sec(x.end, book)]))).toBeDefined();
    expect(sec(hit!.start, book)).toBeLessThan(60);
    expect(sec(hit!.end, book)).toBeGreaterThan(-60);
    // The Readers' four disputed lagnas (Virgo 13°, 18°, 22°, 25°) leave this one candidate in Virgo with all four lords.
    expect(c.filter((x) => x.lords[0] === 'Me' && x.lords[1] === 'Mo').length).toBeGreaterThanOrEqual(1);
  });
});

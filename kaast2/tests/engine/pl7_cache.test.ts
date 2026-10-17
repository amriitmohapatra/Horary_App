/**
 * Oracle: PL7's own transit cache — Moon and Rahu every 7.5 days, 2020–2048
 * (fixtures/pl7_cache_moon_rahu.json, from oracle/cache_moon_rahu.py).
 * Tests the PL7 profile's Delta-T curve and ayanamsa together.
 * Pass (PLAN.md slice 1): every sample < 1.5″.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import cache from '../fixtures/pl7_cache_moon_rahu.json';
import { bootNode } from './boot';
import { cast, type ChartInput } from '../../src/engine';
import type { SwissEph } from '../../src/engine/ephem/swisseph';

const input: ChartInput = {
  date: { y: 2020, m: 1, d: 1 }, time: { h: 0, mi: 0, s: 0 }, tzHours: 0, dstHours: 0,
  place: { name: 'Greenwich', latDeg: 51.48, lonDeg: 0 }, profileId: 'pl7',
};
const diff = (a: number, b: number) => ((((a - b) % 360) + 540) % 360 - 180) * 3600;

let swe: SwissEph;
beforeAll(async () => { swe = await bootNode(); });

describe('PL7 profile vs PL7 transit cache (Moon, Rahu)', () => {
  it(`all ${cache.rows.length} samples within 1.5″`, () => {
    let worstMo = 0, worstRa = 0;
    for (const [jd, mo, ra] of cache.rows as [number, number, number][]) {
      const r = cast(swe, input, jd);
      worstMo = Math.max(worstMo, Math.abs(diff(r.bodies.Mo.lonDeg, mo)));
      worstRa = Math.max(worstRa, Math.abs(diff(r.bodies.Ra.lonDeg, ra)));
    }
    console.log(`PL7 cache: worst Moon ${worstMo.toFixed(2)}″, worst Rahu ${worstRa.toFixed(2)}″`);
    expect(worstMo).toBeLessThan(1.5);
    expect(worstRa).toBeLessThan(1.5);
  });
});

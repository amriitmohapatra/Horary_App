/**
 * Regression gate for the Solar Fire / Kala Chakra profile: the 10 Solar
 * Fire Gold reference charts (port of Advanced_Setup/tests/test_wasm_engine.mjs).
 * Pass: planets ≤1″, cusps ≤12″.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import charts from '../fixtures/solarfire_reference_charts.json';
import { bootNode } from './boot';
import { cast, type PlanetId } from '../../src/engine';
import type { SwissEph } from '../../src/engine/ephem/swisseph';
import { fromJulianDay, julianDay } from '../../src/engine/time/julian';
import { geocentricLatitude } from '../../src/engine/houses/latitude';

const SF_NAME: Record<string, PlanetId> = { Mon: 'Mo', Sun: 'Su', Mer: 'Me', Ven: 'Ve', Mar: 'Ma', Jup: 'Ju', Sat: 'Sa', Nod: 'Ra' };

let swe: SwissEph;
beforeAll(async () => { swe = await bootNode(); });

describe('Solar Fire profile vs 10 Solar Fire Gold reference charts', () => {
  it.each(charts.map((c) => [c.title, c] as const))('%s', (_t, c) => {
    // Reconstruct civil time (whole seconds) and place from the report header.
    const tz = Math.abs(c.geoclat - 21.5839) < 0.01 ? 5.5 : 8.0;
    const cd = fromJulianDay(c.jde - c.deltat / 86400 + tz / 24);
    const jdUT = julianDay(cd.y, cd.m, cd.d, cd.h + cd.mi / 60 + cd.s / 3600 - tz);
    const gmst = (swe as any).m.ccall('swe_sidtime', 'number', ['number'], [jdUT]) as number;
    let lon = ((((c.lst - gmst) % 24) + 24) % 24) * 15;
    if (lon > 180) lon -= 360;
    let lat = c.geoclat;
    for (let i = 0; i < 6; i++) lat += c.geoclat - geocentricLatitude(lat);

    const r = cast(swe, {
      date: { y: cd.y, m: cd.m, d: cd.d }, time: { h: cd.h, mi: cd.mi, s: cd.s },
      tzHours: tz, dstHours: 0, place: { name: c.title, latDeg: lat, lonDeg: lon }, profileId: 'solarfire',
    });
    for (const [sf, id] of Object.entries(SF_NAME)) {
      const want = Math.round((c.planets as Record<string, number>)[sf]! * 3600);
      expect(Math.abs(r.bodies[id].lon - want), `${sf}`).toBeLessThanOrEqual(1);
    }
    for (let h = 1; h <= 12; h++) {
      const want = Math.round((c.cusps as Record<string, number>)[String(h)]! * 3600);
      expect(Math.abs(r.cusps[h - 1]! - want), `cusp ${h}`).toBeLessThanOrEqual(12);
    }
  });
});

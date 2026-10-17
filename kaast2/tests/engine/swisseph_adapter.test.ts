import { beforeAll, describe, expect, it } from 'vitest';
import { bootNode } from './boot';
import { SE, type SwissEph } from '../../src/engine/ephem/swisseph';
import { fromJulianDay, julianDay } from '../../src/engine/time/julian';

let swe: SwissEph;
beforeAll(async () => { swe = await bootNode(); });

describe('Swiss adapter: sunrise', () => {
  it('New Delhi, 2025-06-21: sunrise about 05:23 IST (upper limb, refraction)', () => {
    const jd = swe.riseTrans(julianDay(2025, 6, 20, 18.5), SE.SUN, SE.CALC_RISE, 77.209, 28.6139)!;
    const c = fromJulianDay(jd + 5.5 / 24);
    expect([c.y, c.m, c.d, c.h]).toEqual([2025, 6, 21, 5]);
    expect(c.mi).toBeGreaterThanOrEqual(20);
    expect(c.mi).toBeLessThanOrEqual(26);
  });
  it('disc-centre sunrise is later than upper-limb sunrise', () => {
    const t0 = julianDay(2025, 6, 20, 18.5);
    const limb = swe.riseTrans(t0, SE.SUN, SE.CALC_RISE, 77.209, 28.6139)!;
    const centre = swe.riseTrans(t0, SE.SUN, SE.CALC_RISE | SE.BIT_DISC_CENTER, 77.209, 28.6139)!;
    expect(centre).toBeGreaterThan(limb);
  });
  it('sidereal time is in [0, 24)', () => {
    const st = swe.sidTime(2451545);
    expect(st).toBeGreaterThanOrEqual(0);
    expect(st).toBeLessThan(24);
  });
});

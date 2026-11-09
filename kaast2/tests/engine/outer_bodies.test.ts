/**
 * Uranus, Neptune, Pluto and Chiron (src/engine/outer.ts).
 * Oracle: the 10 Solar Fire Gold reference charts list all four bodies; the
 * Solar Fire profile must reproduce them to ≤ 1″ (the same gate as the
 * grahas in solarfire_reference.test.ts, whose reconstruction this repeats).
 * The PL profiles share the grahas' frame: checked by the tropical
 * difference to the Sun, which no ayanamsa can change.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import charts from '../fixtures/solarfire_reference_charts.json';
import { bootNode } from './boot';
import { cast, type ChartInput } from '../../src/engine';
import { SE, type SwissEph } from '../../src/engine/ephem/swisseph';
import { OUTER, outerPositions, outerRows, type OuterId } from '../../src/engine/outer';
import { fromJulianDay, julianDay } from '../../src/engine/time/julian';
import { geocentricLatitude } from '../../src/engine/houses/latitude';
import { siderealFrame } from '../../src/engine';

const SF_NAME: Record<string, OuterId> = { Ura: 'Ur', Nep: 'Ne', Plu: 'Pl', Chi: 'Ch' };

let swe: SwissEph;
beforeAll(async () => { swe = await bootNode(); });

function sfInput(c: (typeof charts)[number]): ChartInput {
  const tz = Math.abs(c.geoclat - 21.5839) < 0.01 ? 5.5 : 8.0;
  const cd = fromJulianDay(c.jde - c.deltat / 86400 + tz / 24);
  const jdUT = julianDay(cd.y, cd.m, cd.d, cd.h + cd.mi / 60 + cd.s / 3600 - tz);
  const gmst = swe.sidTime(jdUT);
  let lon = ((((c.lst - gmst) % 24) + 24) % 24) * 15;
  if (lon > 180) lon -= 360;
  let lat = c.geoclat;
  for (let i = 0; i < 6; i++) lat += c.geoclat - geocentricLatitude(lat);
  return {
    date: { y: cd.y, m: cd.m, d: cd.d }, time: { h: cd.h, mi: cd.mi, s: cd.s },
    tzHours: tz, dstHours: 0, place: { name: c.title, latDeg: lat, lonDeg: lon }, profileId: 'solarfire',
  };
}

describe('outer bodies vs 10 Solar Fire Gold reference charts (Solar Fire profile)', () => {
  it.each(charts.map((c) => [c.title, c] as const))('%s: Uranus, Neptune, Pluto, Chiron ≤ 1″', (_t, c) => {
    const chart = cast(swe, sfInput(c));
    const pos = outerPositions(swe, chart);
    for (const [sf, id] of Object.entries(SF_NAME)) {
      const want = Math.round((c.planets as Record<string, number>)[sf]! * 3600);
      expect(Math.abs(pos[id].lon - want), sf).toBeLessThanOrEqual(1);
    }
  });
});

describe('outer bodies in the PL profiles', () => {
  const input: ChartInput = {
    date: { y: 1990, m: 5, d: 17 }, time: { h: 6, mi: 30, s: 0 }, tzHours: 5.5, dstHours: 0,
    place: { name: 'Test', latDeg: 20.3, lonDeg: 85.8 }, profileId: 'pl9',
  };
  it.each(['pl9', 'pl7'] as const)('%s: same frame as the grahas (tropical distance to the Sun kept)', (profileId) => {
    const chart = cast(swe, { ...input, profileId });
    const pos = outerPositions(swe, chart);
    const f = siderealFrame(swe, chart.profile, chart.moment.jdUT);
    const sun = swe.calc(f.jdTT, SE.SUN, f.planetFlags).lon;
    for (const id of OUTER) {
      const trop = swe.calc(f.jdTT, { Ur: SE.URANUS, Ne: SE.NEPTUNE, Pl: SE.PLUTO, Ch: SE.CHIRON }[id], f.planetFlags).lon;
      const want = (((trop - sun) % 360) + 360) % 360;
      const got = (((pos[id].lonDeg - chart.bodies.Su.lonDeg) % 360) + 360) % 360;
      expect(Math.abs(got - want), id).toBeLessThan(1e-9);
    }
  });
  it('rows: nakshatra, pada, lords and houses follow the longitude', () => {
    const chart = cast(swe, input);
    const rows = outerRows(chart, outerPositions(swe, chart));
    expect(rows.map((r) => r.id)).toEqual([...OUTER]);
    for (const r of rows) {
      expect(r.pada).toBeGreaterThanOrEqual(1);
      expect(r.lords).toHaveLength(3);
      expect(r.houseFromAsc).toBeGreaterThanOrEqual(1);
      for (const c of r.conjunctions) expect(c.orb).toBeLessThan(30);
    }
    // 1990: Uranus, Neptune in sidereal Sagittarius, conjunct each other.
    const ur = rows.find((r) => r.id === 'Ur')!;
    expect(ur.sign).toBe(8);
    expect(ur.conjunctions.some((c) => c.with === 'Ne')).toBe(true);
  });
});

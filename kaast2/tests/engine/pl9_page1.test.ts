/**
 * Oracle: the boss's Parashara's Light 9.0 Page 1 screenshot (Amitabh
 * Bachchan, transcribed in fixtures/pl9_page1_amitabh.json).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import fixture from '../fixtures/pl9_page1_amitabh.json';
import { bootNode } from './boot';
import { cast, type ChartInput, type ChartResult, type PlanetId } from '../../src/engine';
import { lordChain } from '../../src/engine/kp/lords';
import { navamshaSign } from '../../src/engine/varga/cyclic';
import { mahadashas, periodsFrom } from '../../src/engine/dasha/vimshottari';
import { dmsInSign, signIndex, pada } from '../../src/engine/zodiac';
import { fromJulianDay, julianDay } from '../../src/engine/time/julian';

const input: ChartInput = {
  name: fixture.input.name,
  date: { y: 1942, m: 10, d: 11 }, time: { h: 16, mi: 0, s: 0 },
  tzHours: fixture.input.tzHours, dstHours: 0,
  place: { name: fixture.input.place, latDeg: fixture.input.latDeg, lonDeg: fixture.input.lonDeg },
  profileId: 'pl9',
};
const table = fixture.planet_table as unknown as Record<string, [number, string, string, string, string, string]>;
const IDS = ['As', 'Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'] as const;

let chart: ChartResult;
beforeAll(async () => { chart = cast(await bootNode(), input); });

const pos = (id: (typeof IDS)[number]) => (id === 'As' ? chart.asc : chart.bodies[id as PlanetId]);
const fmt = (a: number) => { const { d, m, s } = dmsInSign(a); return [d, m, s].map((x) => String(x).padStart(2, '0')).join(':'); };

describe('PL9 Page 1 — Amitabh Bachchan', () => {
  it.each(IDS.filter((i) => i !== 'As'))('%s longitude matches PL9 to the displayed second', (id) => {
    const [sign, lon] = table[id]!;
    expect(signIndex(pos(id).lon) + 1).toBe(sign);
    expect(fmt(pos(id).lon)).toBe(lon);
  });

  it('ascendant within 5″ of PL9 (atlas coordinates are rounded to the minute)', () => {
    const [sign, lon] = table.As!;
    const [d, m, s] = lon.split(':').map(Number) as [number, number, number];
    const want = (sign - 1) * 108000 + d * 3600 + m * 60 + s;
    expect(Math.abs(chart.asc.lon - want)).toBeLessThanOrEqual(5);
  });

  it.each(IDS)('%s pada and star/sub/sub-sub lords match', (id) => {
    const want = table[id]![5];
    expect(`${pada(pos(id).lon)},${lordChain(pos(id).lon, 3).join('/')}`).toBe(want);
  });

  it('retrograde flags match (Me R, Sa R)', () => {
    const flagged = (['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa'] as const).filter((p) => chart.bodies[p].retrograde);
    expect(flagged).toEqual(['Me', 'Sa']);
  });

  it('D9 signs match', () => {
    const want = fixture.navamsa_signs as Record<string, number>;
    for (const id of IDS) expect([id, navamshaSign(pos(id).lon) + 1]).toEqual([id, want[id]]);
  });

  it('Vimshottari pratyantar dates match PL9 (10/10) with 365.2421875-day years', () => {
    const mahas = mahadashas(chart.bodies.Mo.lonDeg, chart.moment.jdUT, chart.profile.dashaYearDays);
    // The screenshot's list begins with Ve-Su-Ra (starts 2018-05-16 ~18:50 IST);
    // take the 10 pratyantars running from the end of that day. Dates in IST.
    const rows = periodsFrom(mahas, 2, julianDay(2018, 5, 16, 24 - 5.5), 10);
    const got = rows.map((p) => {
      const c = fromJulianDay(p.start + 5.5 / 24);
      return [p.lords.join('-'), `${String(c.d).padStart(2, '0')}-${String(c.m).padStart(2, '0')}-${c.y}`];
    });
    expect(got).toEqual(fixture.vimshottari.map(([chain, , date]) => [chain, date]));
  });

  it('365.25-day years (Kala Chakra) would match only 5/10 of those dates', () => {
    const mahas = mahadashas(chart.bodies.Mo.lonDeg, chart.moment.jdUT, 365.25);
    const rows = periodsFrom(mahas, 2, julianDay(2018, 5, 16, 0), 12);
    const want = new Map(fixture.vimshottari.map(([chain, , date]) => [chain, date]));
    const hits = rows.filter((p) => {
      const c = fromJulianDay(p.start + 5.5 / 24);
      return want.get(p.lords.join('-')) === `${String(c.d).padStart(2, '0')}-${String(c.m).padStart(2, '0')}-${c.y}`;
    }).length;
    expect(hits).toBe(5);
  });
});

describe('PL9 Page 1 — planet table view-model', () => {
  it('flags (retrograde, combust) match PL9 for every body', async () => {
    const { page1Model } = await import('../../src/engine/page1');
    const m = page1Model(chart);
    for (const r of m.rows) expect([r.id, r.flags]).toEqual([r.id, table[r.id]![2]]);
  });
  it('pada syllables match PL9 for every body', async () => {
    const { page1Model } = await import('../../src/engine/page1');
    const m = page1Model(chart);
    for (const r of m.rows) expect([r.id, r.syllable]).toEqual([r.id, table[r.id]![4]]);
  });
});

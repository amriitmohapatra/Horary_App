/** NTP guidance on a real cast chart: invariants of Iyer's definitions (NTP-2 ch. I–II). */
import { beforeAll, describe, expect, it } from 'vitest';
import fixture from '../fixtures/pl9_page1_amitabh.json';
import { bootNode } from './boot';
import { cast, type ChartInput, type ChartResult } from '../../src/engine';
import { ntpModel, dashaReading } from '../../src/engine/iyer/ntp';
import { ENEMY, sameTrio } from '../../src/engine/iyer/dashaChart';
import { yogiPoints } from '../../src/engine/yogi/yogi';
import { mahadashas, subperiods } from '../../src/engine/dasha/vimshottari';
import { vara } from '../../src/engine/panchanga/panchanga';
import type { SwissEph } from '../../src/engine/ephem/swisseph';

const input: ChartInput = {
  name: fixture.input.name,
  date: { y: 1942, m: 10, d: 11 }, time: { h: 16, mi: 0, s: 0 },
  tzHours: fixture.input.tzHours, dstHours: 0,
  place: { name: fixture.input.place, latDeg: fixture.input.latDeg, lonDeg: fixture.input.lonDeg },
  profileId: 'pl9',
};
let swe: SwissEph, chart: ChartResult;
beforeAll(async () => { swe = await bootNode(); chart = cast(swe, input); });

describe('NTP model of the example chart', () => {
  it("Iyer's Avayogi (enemy table) equals the app's sixth-nakshatra Avayogi", () => {
    const m = ntpModel(chart, vara(swe, chart).num);
    const y = yogiPoints(chart.bodies.Su.lon, chart.bodies.Mo.lon, { avayogi: 'sixth-nakshatra' });
    expect(m.yogi).toBe(y.yogi);
    expect(m.avayogi).toBe(y.avayogi);
    expect(m.duplicateYogi).toBe(y.duplicateYogi);
    expect(m.avayogi).toBe(ENEMY[m.yogi]);
    expect(sameTrio(m.yogi, m.yogiTrio[0]!)).toBe(true);
  });
  it('every planet gets a character and findings; every finding has a tone', () => {
    const m = ntpModel(chart, vara(swe, chart).num);
    expect(m.planets).toHaveLength(9);
    for (const p of m.planets) {
      expect(['+', '-', 'mixed', '0']).toContain(p.pol);
      for (const f of p.findings) expect(['good', 'bad', 'mixed', 'info']).toContain(f.tone);
    }
    // Rahu and Ketu are natural negatives unless a Yogi.
    for (const n of m.planets.filter((p) => (p.id === 'Ra' || p.id === 'Ke') && !p.roles.includes('yogi') && !p.roles.includes('duplicateYogi'))) {
      expect(n.reasonsNeg).toContain('node');
    }
  });
  it('dasha readings cover every Bhukti, Starter = Ruler when the planet is in its own star', () => {
    const m = ntpModel(chart, vara(swe, chart).num);
    const mahas = mahadashas(chart.bodies.Mo.lonDeg, chart.moment.jdUT, chart.profile.dashaYearDays);
    for (const maha of mahas) {
      const r = dashaReading(chart, m, maha, subperiods(maha));
      expect(r.bhuktis).toHaveLength(9);
      for (const b of r.bhuktis) {
        const p = m.planets.find((q) => q.id === b.lord)!;
        if (p.starLord === b.lord && b.lord !== 'Mo') expect(b.starter).toBe(b.ruler);
      }
    }
  });
});

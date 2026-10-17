/**
 * Iyer, New Techniques of Prediction II — oracle: the author's own worked
 * Chart 1 (19-6-1907), Guru Dasha (NTP-2 PDF pp. 23–34, tables checked on the
 * page images).
 */
import { describe, expect, it } from 'vitest';
import { ENEMY, TRIOS, dashaChart, dashaYogis, starterFor } from '../../src/engine/iyer/dashaChart';
import type { PlanetId } from '../../src/engine/types';

const dms = (sign: number, d: number, m: number) => sign * 108000 + d * 3600 + m * 60;

describe('Iyer enemies and triple sets (NTP-2 p. 6)', () => {
  it('enemy table as printed', () => {
    expect(ENEMY).toEqual({ Su: 'Sa', Mo: 'Me', Ma: 'Ke', Me: 'Ma', Ju: 'Su', Ve: 'Ju', Sa: 'Mo', Ra: 'Ve', Ke: 'Ra' });
  });
  it('sets of three', () => {
    expect(TRIOS).toEqual([['Ke', 'Mo', 'Ju'], ['Ve', 'Ma', 'Sa'], ['Su', 'Ra', 'Me']]);
  });
});

describe('Dasha chart, Chart 1, Guru Dasha (NTP-2 pp. 23–34)', () => {
  // Stellar lords: Sun Mrigasira (Ma), Moon (progressed to Vishaka for Guru Dasha),
  // Kuja Poorvashada (Ve), Budha Punarvasu (Ju), Guru Punarvasu (Ju), Shukra Rohini (Mo),
  // Shani U-Bhadra (Sa), Rahu Punarvasu (Ju), Ketu U-Shada (Su), Lagna Moola (Ke). Wednesday.
  const lords = { Su: 'Ma', Mo: 'Ju', Ma: 'Ve', Me: 'Ju', Ju: 'Ju', Ve: 'Mo', Sa: 'Sa', Ra: 'Ju', Ke: 'Su', As: 'Ke' } as const;
  const dc = dashaChart(lords, 'Ju', 4);
  it("matches the author's table of Starters and Rulers (p. 32)", () => {
    const want: Record<string, [PlanetId, PlanetId]> = {
      Su: ['Ju', 'Me'], Mo: ['Mo', 'Ju'], Ma: ['Ju', 'Mo'], Me: ['Mo', 'Ve'], Ju: ['Mo', 'Mo'],
      Ve: ['Mo', 'Ra'], Sa: ['Ju', 'Ju'], Ra: ['Mo', 'Ma'], Ke: ['Ke', 'Su'], As: ['Mo', 'Mo'],
    };
    for (const r of dc.rows) expect([r.starter, r.ruler], r.point).toEqual(want[r.point]);
  });
  it('Dasha Raja Yogi of Guru Dasha is the Moon (p. 36)', () => expect(dc.rajaYogi).toBe('Mo'));
  it('Shani Dasha: Moon starter Rahu, ruler Ketu (p. 33)', () => {
    const r = dashaChart(lords, 'Sa', 4).rows.find((x) => x.point === 'Mo')!;
    expect([r.starter, r.ruler]).toEqual(['Ra', 'Ke']);
  });
  it("Starter of Rahu worked by the author's star method is the Moon (pp. 27–28)", () => {
    expect(starterFor('Ju', 'Ju', 'Ma', 4)).toBe('Mo');
  });
  it('Dasha Yogis: Guru → Ketu, Rahu → Shukra, Ketu → Guru, Moon → Birth Yogi (pp. 29–30)', () => {
    const lons = { Su: 0, Mo: 0, Ma: 0, Me: 0, Ju: dms(2, 24, 7), Ve: 0, Sa: 0, Ra: dms(3, 2, 17), Ke: dms(9, 2, 17) } as Record<PlanetId, number>;
    const dy = dashaYogis(dms(10, 17, 49), lons, 'Ra');
    expect([dy.Ju, dy.Ra, dy.Ke, dy.Mo]).toEqual(['Ke', 'Ve', 'Ju', 'Ra']);
  });
});

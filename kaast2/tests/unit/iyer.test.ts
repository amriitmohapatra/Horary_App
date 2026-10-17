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

import { iyerVarga, IYER_DIVISIONS } from '../../src/engine/iyer/dcharts';
describe("Iyer's division charts vs his own table for Appendix Chart 1 (NTP-2 p. 159, page image)", () => {
  // sign (1 = Mesha), degree, minute — Rv Ch Kj Bd Gr Sk Sn Rh Kt Asc; Ketu = Rahu's degree.
  const pos: [string, number, number, number][] = [
    ['Rv', 3, 4, 34], ['Ch', 6, 9, 55], ['Kj', 9, 25, 4], ['Bd', 3, 28, 26], ['Gr', 3, 24, 7],
    ['Sk', 2, 11, 7], ['Sn', 12, 4, 34], ['Rh', 4, 2, 17], ['Kt', 10, 2, 17], ['Asc', 9, 10, 57],
  ];
  const table: Record<number, number[]> = {
    1: [3, 6, 9, 3, 3, 2, 12, 4, 10, 9], 3: [3, 6, 5, 11, 11, 6, 12, 4, 10, 1], 4: [3, 9, 6, 12, 12, 5, 12, 4, 10, 12],
    5: [11, 3, 9, 3, 3, 7, 8, 4, 10, 6], 6: [1, 8, 6, 6, 5, 9, 7, 7, 7, 3], 7: [4, 2, 2, 9, 8, 10, 7, 10, 4, 11],
    8: [6, 7, 11, 12, 11, 11, 6, 1, 1, 7], 9: [8, 12, 8, 3, 2, 1, 5, 4, 10, 4], 10: [4, 5, 5, 12, 11, 1, 9, 12, 6, 12],
    11: [12, 10, 4, 3, 5, 9, 12, 1, 1, 9], 12: [4, 9, 7, 2, 12, 6, 1, 4, 10, 1], 16: [5, 4, 10, 6, 3, 12, 1, 6, 12, 2],
    20: [8, 11, 9, 11, 9, 4, 8, 2, 2, 12], 24: [8, 11, 1, 3, 12, 12, 7, 5, 5, 1], 27: [11, 12, 11, 8, 4, 2, 2, 12, 6, 10],
    30: [1, 6, 3, 7, 3, 6, 2, 2, 2, 9], 40: [6, 8, 10, 2, 9, 9, 12, 10, 10, 3],
  };
  // Known book exceptions (NTP-2 notes OQ-3, OQ-4): D-30 Kuja at 25°04' (book 3, rule 9);
  // D-40 Sun and Saturn at 4°34' (book used the misprinted 4-50 boundary of p. 55).
  const EXCEPT = new Set(['30:Kj', '40:Rv', '40:Sn']);
  it('matches every cell except the three known book exceptions', () => {
    const bad: string[] = [];
    for (const [d, row] of Object.entries(table)) pos.forEach(([id, s, deg, min], i) => {
      const lon = (s - 1) * 108000 + deg * 3600 + min * 60;
      const got = iyerVarga(Number(d) as (typeof IYER_DIVISIONS)[number], lon) + 1;
      if (got !== row[i] && !EXCEPT.has(`${d}:${id}`)) bad.push(`D${d} ${id}: ${got} ≠ ${row[i]}`);
    });
    expect(bad).toEqual([]);
  });
});

import { mathNavamsaSlot, padaFallingOn } from '../../src/engine/iyer/ntp2b';
describe('Mathematical Navamsha (NTP-2 pp. 84–91): the seven worked examples', () => {
  // Pada numbers: star (1 = Ashwini) and pada 1–4 → 4(star−1)+pada.
  const P = (star: number, pada: number) => 4 * (star - 1) + pada;
  it('on U.Bhadra 3 falls Uttara 4 (p. 39)', () => expect(padaFallingOn(P(26, 3))).toBe(P(12, 4)));
  it('Punarvasu 2 and Rohini 3 exchange (p. 97)', () => {
    expect(mathNavamsaSlot(P(7, 2))).toBe(P(4, 3));
    expect(mathNavamsaSlot(P(4, 3))).toBe(P(7, 2));
  });
  it('Swathi 1 gives its amsha to P.Shada 3 (p. 99)', () => expect(mathNavamsaSlot(P(15, 1))).toBe(P(20, 3)));
  it('Shathabhisha 4 and Revathi 3 exchange (p. 99)', () => {
    expect(mathNavamsaSlot(P(24, 4))).toBe(P(27, 3));
    expect(mathNavamsaSlot(P(27, 3))).toBe(P(24, 4));
  });
  it('U.Bhadra 3 gives its amsha to Swathi 3 (p. 99)', () => expect(mathNavamsaSlot(P(26, 3))).toBe(P(15, 3)));
  it('on Aslesha 3 falls Ashwini 4 (p. 100)', () => expect(padaFallingOn(P(9, 3))).toBe(P(1, 4)));
  it('Krittika 1 gives its amsha to Moola 3 (p. 101)', () => expect(mathNavamsaSlot(P(3, 1))).toBe(P(19, 3)));
  it('12 Vargottama, 24 exchanging and 72 moving padas (p. 85)', () => {
    let v = 0, x = 0;
    for (let n = 1; n <= 108; n++) { const s = mathNavamsaSlot(n); if (s === n) v++; else if (mathNavamsaSlot(s) === n) x++; }
    expect([v, x, 108 - v - x]).toEqual([12, 24, 72]);
  });
});

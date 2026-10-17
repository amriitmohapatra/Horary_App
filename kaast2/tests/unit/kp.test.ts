import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { bhavaOf, kpModel } from '../../src/engine/kp/kp';
import { PLANETS, type ChartResult, type PlanetId } from '../../src/engine/types';

const require = createRequire(import.meta.url);
// Kala Chakra's validated KP engine (CommonJS) — the twin we must agree with.
const KC = require('../../../Advanced_Setup/web/src/kp_logic.js') as {
  Chart: new (cusps: Record<number, number>, planets: Record<string, number>) => { houseOf(a: number): number };
  subLords(a: number, depth: number): string[];
};

const D = 3600;
/** A stub chart: cusps every 30° from `asc`, planets at the given degrees. */
function stub(cuspsDeg: number[], planetsDeg: Partial<Record<PlanetId, number>>): ChartResult {
  const bodies = Object.fromEntries(PLANETS.map((id) => [id, { id, lon: Math.round((planetsDeg[id] ?? 0) * D), retrograde: false }]));
  return { cusps: cuspsDeg.map((c) => Math.round(c * D)), bodies } as unknown as ChartResult;
}

describe('KP bhava placement', () => {
  const cusps = [350, 20, 50, 80, 110, 140, 170, 200, 230, 260, 290, 320].map((c) => c * D);
  it('cusp h ≤ λ < cusp h+1, across 0° Aries', () => {
    expect(bhavaOf(350 * D, cusps)).toBe(1);
    expect(bhavaOf(0, cusps)).toBe(1);
    expect(bhavaOf(20 * D - 1, cusps)).toBe(1);
    expect(bhavaOf(20 * D, cusps)).toBe(2);
    expect(bhavaOf(349 * D, cusps)).toBe(12);
  });
  it('agrees with Kala Chakra houseOf on 2 000 random unequal charts', () => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
    for (let n = 0; n < 2000; n++) {
      const start = Math.floor(rnd() * 1_296_000);
      const widths = Array.from({ length: 12 }, () => 0.3 + rnd());
      const tot = widths.reduce((a, b) => a + b, 0);
      let acc = 0;
      const cs = widths.map((w) => { const c = (start + Math.floor((acc / tot) * 1_296_000)) % 1_296_000; acc += w; return c; });
      const kc = new KC.Chart(Object.fromEntries(cs.map((c, i) => [i + 1, c])), {});
      const lon = Math.floor(rnd() * 1_296_000);
      expect(bhavaOf(lon, cs)).toBe(kc.houseOf(lon));
    }
  });
});

describe('KP significators (PL 7 manual p. 205)', () => {
  // Cusps at 0° of each sign (Ar … Pi): owners Ma Ve Me Mo Su Me Ve Ma Ju Sa Sa Ju.
  const c = stub(Array.from({ length: 12 }, (_, i) => i * 30), {
    Su: 5,      // Aswini (Ke star), house 1
    Mo: 15,     // Bharani (Ve star), house 1
    Ma: 100,    // Pushya (Sa star), house 4
    Me: 125,    // Magha (Ke star), house 5
    Ju: 250,    // Mula (Ke star), house 9
    Ve: 280,    // Shravana (Mo star), house 10
    Sa: 330,    // Purvabhadra (Ju star), house 12
    Ra: 75,     // Ardra (Ra star), house 3
    Ke: 255,    // Purvashadha (Ve star), house 9
  });
  const m = kpModel(c);
  it('places planets and reads lords', () => {
    expect(m.planets.find((p) => p.id === 'Ve')).toMatchObject({ house: 10, signLord: 'Sa', lords: ['Mo', expect.any(String), expect.any(String)] });
    expect(m.cusps[0]).toMatchObject({ sign: 0, signLord: 'Ma', lords: ['Ke', 'Ke', 'Ke'] });
  });
  it('lists occupants, their tenants, owner and its tenants', () => {
    const h1 = m.houses[0]!;
    expect(h1.occupants).toEqual(['Su', 'Mo']);
    expect(h1.tenantsOfOccupants).toEqual(['Ve']); // Ve in Shravana (Mo)
    expect(h1.owner).toBe('Ma');
    expect(h1.tenantsOfOwner).toEqual([]);
    const h9 = m.houses[8]!;
    expect(h9.occupants).toEqual(['Ju', 'Ke']);
    expect(h9.tenantsOfOccupants).toEqual(['Su', 'Me', 'Ju', 'Sa']); // Ke stars: Su, Me, Ju; Ju star: Sa
    expect(h9.owner).toBe('Ju');
    expect(h9.tenantsOfOwner).toEqual(['Sa']);
    expect(m.houses[9]!.tenantsOfOwner).toEqual(['Ma']); // Cp owner Sa: Ma in Pushya
  });
  it('planet-wise A–D levels', () => {
    const ve = m.planetSignificators.find((p) => p.id === 'Ve')!;
    // star lord Mo: occupies 1, owns Cn = house 4; Ve occupies 10, owns Ta 2 and Li 7.
    expect(ve).toEqual({ id: 'Ve', a: [1], b: [10], c: [4], d: [2, 7] });
    const sa = m.planetSignificators.find((p) => p.id === 'Sa')!;
    // star lord Ju: occupies 9, owns Sg 9 and Pi 12; Sa occupies 12, owns Cp 10 and Aq 11.
    expect(sa).toEqual({ id: 'Sa', a: [9], b: [12], c: [9, 12], d: [10, 11] });
    // A node in its own star owns nothing.
    expect(m.planetSignificators.find((p) => p.id === 'Ra')).toEqual({ id: 'Ra', a: [3], b: [3], c: [], d: [] });
  });
  it('lords match Kala Chakra subLords for every cusp and planet', () => {
    for (const p of [...m.cusps, ...m.planets]) expect(p.lords).toEqual(KC.subLords(p.lon, 3));
  });
});

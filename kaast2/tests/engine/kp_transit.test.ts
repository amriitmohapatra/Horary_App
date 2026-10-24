/**
 * KP transit zones (src/engine/kp/transit.ts) against the dates the Readers
 * fix by transit through the sign, star and sub of the period lords.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { bootNode } from './boot';
import { resolveProfile } from '../../src/engine';
import { julianDay } from '../../src/engine/time/julian';
import { unitsOf, zoneVisits } from '../../src/engine/kp/transit';
import type { SwissEph } from '../../src/engine/ephem/swisseph';
import type { PlanetId } from '../../src/engine/types';

let swe: SwissEph;
beforeAll(async () => { swe = await bootNode(); });
const profile = resolveProfile('pl9', { ayanamsa: 'pl_krishnamurti_new', node: 'mean' });
const jd = (s: string) => { const [y, m, d] = s.split('-').map(Number); return julianDay(y!, m!, d!, 6.5); };
const day = (t: number) => { const z = t + 0.5 + 5.5 / 24, f = Math.floor(z); const a = f + 32044, b = Math.floor((4 * a + 3) / 146097), c = a - Math.floor(146097 * b / 4); const d = Math.floor((4 * c + 3) / 1461), e = c - Math.floor(1461 * d / 4), m = Math.floor((5 * e + 2) / 153); return `${100 * b + d - 4800 + Math.floor(m / 10)}-${String(m + 3 - 12 * Math.floor(m / 10)).padStart(2, '0')}-${String(e - Math.floor((153 * m + 2) / 5) + 1).padStart(2, '0')}`; };

/** `date` = when the zone is entered; `book` = the book's date where it differs (a slip in the book, named). */
const CASES: { id: string; body: PlanetId; sign?: PlanetId; star?: PlanetId; sub?: PlanetId; date: string; cite: string; book?: string }[] = [
  { id: 'b6-E04', body: 'Su', sign: 'Ve', star: 'Mo', sub: 'Ra', date: '1970-05-27', cite: 'B6 p. 254: Sun in Venus sign, Moon star, Rahu sub', book: '1970-05-25: the Sun is then at Taurus 10°, still in the Moon sub' },
  { id: 'b6-E16', body: 'Ve', sign: 'Ve', star: 'Ra', sub: 'Ju', date: '1969-11-13', cite: 'B6 p. 176: Venus in Libra, Swati, Jupiter sub' },
  { id: 'b6-E19', body: 'Su', sign: 'Ju', star: 'Ve', sub: 'Ve', date: '1973-12-28', cite: 'B6 p. 186: Sun in Jupiter sign, Venus star, Venus sub' },
  { id: 'b6-E27', body: 'Su', sign: 'Ma', star: 'Ju', sub: 'Ma', date: '1969-11-18', cite: 'B6 p. 212: Sun in Scorpio, Jupiter star, Mars sub' },
  { id: 'b6-E33', body: 'Mo', sign: 'Su', star: 'Ke', date: '1969-07-17', cite: 'B6 p. 231: Moon in Magha (Ketu star) in Leo', book: '1969-07-20: from the book’s own Moon (Gem 15°40′ on 13-7) Magha is reached on the 17th and left on the 18th' },
];

describe('KP transit zones on the Readers’ dated predictions', () => {
  for (const c of CASES) {
    it(`${c.id}: ${c.cite}`, () => {
      const t = jd(c.date);
      const vs = zoneVisits(swe, profile, c.body, unitsOf(c), t - 40, t + 40);
      const hit = vs.find((v) => v.start - 1.5 <= t && t <= v.end + 1.5);
      expect(hit, `${c.id} visits ${vs.map((v) => `${day(v.start)}..${day(v.end)}`).join(', ')}`).toBeDefined();
    });
  }
  it('visits are contiguous inside one unit and separated by its edges', () => {
    const t = jd('1970-01-01');
    const vs = zoneVisits(swe, profile, 'Mo', () => true, t, t + 3);
    for (let i = 1; i < vs.length; i++) expect(vs[i]!.start).toBeCloseTo(vs[i - 1]!.end, 9);
    expect(vs.length).toBeGreaterThan(8);
  });
});

/**
 * Panchanga limbs (tithi, nakshatra, yoga, karana) — pure rules on integer
 * arcseconds, plus the PyJHora cross-check (fixtures/bhava_yogi_panchanga_pyjhora.json).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  FIXED_KARANAS, MOVABLE_KARANAS, TITHI_NAMES, YOGA_NAMES, karana, karanaName, moonNakshatra, panchangaLimbs, tithi, yoga,
} from '../../src/engine/panchanga/panchanga';
import { ZODIAC } from '../../src/engine/zodiac';

interface Case {
  input: { name: string };
  arcsec: Record<string, number>;
  pyjhora: { limbs: { tithi: number; yoga: number; karana: number; nakshatra: number; pada: number } };
}
const fixture = JSON.parse(readFileSync(resolve(import.meta.dirname, '../fixtures/bhava_yogi_panchanga_pyjhora.json'), 'utf8')) as { cases: Case[] };
const D = 3600;

describe('tithi = 1 + ⌊(Moon − Sun)/12°⌋', () => {
  const at = (elongDeg: number, sun = 100 * D) => tithi(sun, sun + Math.round(elongDeg * D));
  it('boundaries are half-open', () => {
    expect(at(0)).toMatchObject({ num: 1, paksha: 'shukla', inPaksha: 1, name: 'Pratipada' });
    expect(tithi(0, 12 * D - 1).num).toBe(1);
    expect(tithi(0, 12 * D).num).toBe(2);
    expect(at(168)).toMatchObject({ num: 15, name: 'Purnima', paksha: 'shukla' });
    expect(at(180)).toMatchObject({ num: 16, name: 'Pratipada', paksha: 'krishna', inPaksha: 1 });
    expect(tithi(0, ZODIAC - 1)).toMatchObject({ num: 30, name: 'Amavasya', paksha: 'krishna', inPaksha: 15 });
  });
  it('wraps when the Moon is behind the Sun in longitude', () => {
    expect(tithi(350 * D, 5 * D).num).toBe(2); // elongation 15°
  });
  it('elapsed fraction', () => {
    expect(at(18).elapsed).toBeCloseTo(0.5, 9);
  });
  it('names table has 15 + Amavasya', () => expect(TITHI_NAMES).toHaveLength(16));
});

describe('karana = 1 + ⌊(Moon − Sun)/6°⌋, fixed karanas at the ends', () => {
  it('1 = Kimstughna; 2…57 cycle Bava…Vishti eight times; 58–60 Shakuni, Chatushpada, Naga', () => {
    expect(karanaName(1)).toBe('Kimstughna');
    expect(karanaName(2)).toBe('Bava');
    expect(karanaName(8)).toBe('Vishti');
    expect(karanaName(9)).toBe('Bava');
    expect(karanaName(57)).toBe('Vishti');
    expect([58, 59, 60].map(karanaName)).toEqual(['Shakuni', 'Chatushpada', 'Naga']);
    const movable = Array.from({ length: 56 }, (_, i) => karanaName(i + 2));
    for (const k of MOVABLE_KARANAS) expect(movable.filter((x) => x === k)).toHaveLength(8);
    expect(FIXED_KARANAS).toHaveLength(4);
  });
  it('each tithi t holds karanas 2t−1 and 2t', () => {
    for (let e = 0; e < ZODIAC; e += 1800) {
      const t = tithi(0, e).num, k = karana(0, e).num;
      expect(Math.ceil(k / 2)).toBe(t);
    }
  });
  it('Krishna Chaturdashi second half is Shakuni; Amavasya is Chatushpada then Naga', () => {
    expect(karana(0, 342 * D)).toMatchObject({ num: 58, name: 'Shakuni', fixed: true });
    expect(karana(0, 348 * D)).toMatchObject({ num: 59, name: 'Chatushpada', fixed: true });
    expect(karana(0, 354 * D)).toMatchObject({ num: 60, name: 'Naga', fixed: true });
    expect(karana(0, 342 * D - 1)).toMatchObject({ num: 57, name: 'Vishti', fixed: false });
  });
  it('rejects numbers outside 1…60', () => {
    expect(() => karanaName(0)).toThrow();
    expect(() => karanaName(61)).toThrow();
  });
});

describe('yoga = 1 + ⌊(Sun + Moon)/13°20′⌋', () => {
  it('first, last and a boundary', () => {
    expect(yoga(0, 0)).toMatchObject({ num: 1, name: 'Vishkambha' });
    expect(yoga(ZODIAC - 1, 0)).toMatchObject({ num: 27, name: 'Vaidhriti' });
    expect(yoga(48_000, 0).num).toBe(2);
    expect(yoga(47_999, 0).num).toBe(1);
    expect(yoga(300 * D, 100 * D).num).toBe(4); // 400° → 40° → Saubhagya
    expect(YOGA_NAMES).toHaveLength(27);
  });
});

describe('Moon nakshatra and pada', () => {
  it('Swati 2 at Libra 10°19′02″ (PL9 Page 1, Amitabh Bachchan Moon)', () => {
    expect(moonNakshatra(180 * D + 10 * D + 19 * 60 + 2)).toMatchObject({ num: 15, name: 'Swati', pada: 2, lord: 'Ra' });
  });
});

describe('PyJHora cross-check (drik.tithi / yogam / karana / nakshatra_pada on identical longitudes)', () => {
  const rows = fixture.cases.map((c) => ({ c, p: panchangaLimbs(c.arcsec.Su!, c.arcsec.Mo!) }));
  const mismatch = (pick: (r: (typeof rows)[number]) => [number, number]) =>
    rows.filter((r) => { const [a, b] = pick(r); return a !== b; }).map(({ c }) => c.input.name);
  it('tithi', () => expect(mismatch(({ c, p }) => [p.tithi.num, c.pyjhora.limbs.tithi])).toEqual([]));
  it('yoga', () => expect(mismatch(({ c, p }) => [p.yoga.num, c.pyjhora.limbs.yoga])).toEqual([]));
  it('karana', () => expect(mismatch(({ c, p }) => [p.karana.num, c.pyjhora.limbs.karana])).toEqual([]));
  it('nakshatra', () => expect(mismatch(({ c, p }) => [p.nakshatra.num, c.pyjhora.limbs.nakshatra])).toEqual([]));
  it('pada', () => expect(mismatch(({ c, p }) => [p.nakshatra.pada, c.pyjhora.limbs.pada])).toEqual([]));
  it('the sample covers both pakshas, fixed karanas and most yogas', () => {
    const t = new Set(rows.map(({ p }) => p.tithi.num));
    expect([...t].some((x) => x > 15) && [...t].some((x) => x <= 15)).toBe(true);
    expect(new Set(rows.map(({ p }) => p.yoga.num)).size).toBeGreaterThan(20);
  });
});

/**
 * Yogi point, Yogi, Avayogi (both variants), Duplicate Yogi, Dagdha rashis —
 * pure rules plus the PyJHora cross-check (fixtures/bhava_yogi_panchanga_pyjhora.json).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  AVAYOGI_OFFSET, YOGI_OFFSET, avayogiPoint, dagdhaRashis, duplicateYogi, nakshatraLord, yogiPoint, yogiPoints,
} from '../../src/engine/yogi/yogi';
import { NAKSHATRA, SIGN, SIGN_LORD, ZODIAC, nakshatraIndex } from '../../src/engine/zodiac';

interface Case {
  input: { name: string };
  arcsec: Record<string, number>;
  pyjhora: { yogi: { pointDeg: number; nakshatra: number; yogi: string; sahayogi: string; avayogiPointDeg: number; avayogiNakshatra: number; avayogi: string } };
}
const fixture = JSON.parse(readFileSync(resolve(import.meta.dirname, '../fixtures/bhava_yogi_panchanga_pyjhora.json'), 'utf8')) as { cases: Case[] };
const dms = (d: number, m: number, s = 0) => d * 3600 + m * 60 + s;

describe('Yogi point = Sun + Moon + 93°20′ (BIN)', () => {
  it('constants', () => {
    expect(YOGI_OFFSET).toBe(dms(93, 20));
    expect(AVAYOGI_OFFSET).toBe(dms(186, 40));
    expect(AVAYOGI_OFFSET).toBe(14 * NAKSHATRA);
  });
  it('Sun = Moon = 0 → 93°20′ = first point of Pushya, Yogi Saturn', () => {
    const r = yogiPoints(0, 0);
    expect(r.yogiPoint.lon).toBe(dms(93, 20));
    expect(r.yogiPoint.nakshatra).toBe(7);
    expect(r.yogi).toBe('Sa');
    expect(r.duplicateYogi).toBe('Mo'); // Cancer
  });
  it('normalises past 360°', () => {
    expect(yogiPoint(dms(300, 0), dms(300, 0))).toBe(dms(333, 20));
  });
  it('one arcsecond below a nakshatra boundary stays in the earlier nakshatra (half-open)', () => {
    expect(yogiPoints(0, -1).yogiPoint.nakshatra).toBe(6); // 93°19′59″ = Punarvasu
    expect(yogiPoints(0, -1).yogi).toBe('Ju');
  });
});

describe('Avayogi variants (OPEN)', () => {
  it("'sixth-nakshatra': lord of the 6th nakshatra from the Yogi nakshatra, for every nakshatra", () => {
    for (let n = 0; n < 27; n++) {
      const y = n * NAKSHATRA + 1234;
      const r = yogiPoints(y - YOGI_OFFSET, 0, { avayogi: 'sixth-nakshatra' });
      expect(r.yogiPoint.nakshatra).toBe(n);
      expect(r.avayogi).toBe(nakshatraLord(n + 5));
      // its point (+186°40′) lies in the 15th nakshatra, which has the same lord
      expect(r.avayogiPoint.nakshatra).toBe((n + 14) % 27);
      expect(nakshatraLord(n + 14)).toBe(nakshatraLord(n + 5));
    }
  });
  it("'opposite-point': Yogi point + 180° (PL7 dictionary p. 208)", () => {
    const y = dms(98, 1, 55);
    expect(avayogiPoint(y, 'opposite-point')).toBe(dms(278, 1, 55));
    const r = yogiPoints(y - YOGI_OFFSET, 0, { avayogi: 'opposite-point' });
    expect(r.avayogiPoint.nakshatra).toBe(nakshatraIndex(dms(278, 1, 55)));
    expect(r.avayogi).toBe('Su'); // U.Ashadha
  });
  it('the two variants disagree on the planet whenever the Yogi point is in the first half of its nakshatra', () => {
    let differ = 0;
    for (let a = 0; a < ZODIAC; a += 600) {
      const s = yogiPoints(a, 0, { avayogi: 'sixth-nakshatra' }).avayogi;
      const o = yogiPoints(a, 0, { avayogi: 'opposite-point' }).avayogi;
      const firstHalf = (yogiPoint(a, 0) % NAKSHATRA) < NAKSHATRA / 2;
      expect(s !== o).toBe(firstHalf);
      if (s !== o) differ++;
    }
    expect(differ).toBe(ZODIAC / 600 / 2);
  });
});

describe('Duplicate Yogi (OPEN) — sign-lord variant', () => {
  it('is the lord of the sign holding the Yogi point', () => {
    for (let s = 0; s < 12; s++) expect(duplicateYogi(s * SIGN + 5, 'sign-lord')).toBe(SIGN_LORD[s]);
  });
});

describe('Dagdha rashis (STD tithi table)', () => {
  it('both pakshas share the table; Purnima and Amavasya have none', () => {
    for (let t = 1; t <= 15; t++) expect(dagdhaRashis(t + 15)).toEqual(dagdhaRashis(t));
    expect(dagdhaRashis(15)).toEqual([]);
    expect(dagdhaRashis(30)).toEqual([]);
  });
  it('spot values (0 = Aries): Pratipada Li/Cp, Shashthi Ar/Le, Chaturdashi Ge/Vi/Sg/Pi', () => {
    expect(dagdhaRashis(1)).toEqual([6, 9]);
    expect(dagdhaRashis(6)).toEqual([0, 4]);
    expect(dagdhaRashis(14)).toEqual([2, 5, 8, 11]);
  });
  it('rejects tithis outside 1…30', () => {
    expect(() => dagdhaRashis(0)).toThrow();
    expect(() => dagdhaRashis(31)).toThrow();
  });
});

describe('PyJHora cross-check (sphuta.yogi_sphuta / avayogi_sphuta, same rounded longitudes)', () => {
  const rows = fixture.cases.map((c) => ({ c, r: yogiPoints(c.arcsec.Su!, c.arcsec.Mo!) }));
  it('Yogi point equals PyJHora to float precision', () => {
    const bad = rows.filter(({ c, r }) => Math.abs(r.yogiPoint.lon / 3600 - c.pyjhora.yogi.pointDeg) > 1e-6);
    expect(bad.map(({ c }) => c.input.name)).toEqual([]);
  });
  it('Yogi nakshatra and lord equal PyJHora', () => {
    const bad = rows.filter(({ c, r }) => r.yogiPoint.nakshatra !== c.pyjhora.yogi.nakshatra || r.yogi !== c.pyjhora.yogi.yogi);
    expect(bad.map(({ c }) => c.input.name)).toEqual([]);
  });
  it("Avayogi 'sixth-nakshatra' (point + 186°40′, lord) equals PyJHora's avayogi", () => {
    const bad = rows.filter(({ c, r }) => Math.abs(r.avayogiPoint.lon / 3600 - c.pyjhora.yogi.avayogiPointDeg) > 1e-6
      || r.avayogiPoint.nakshatra !== c.pyjhora.yogi.avayogiNakshatra || r.avayogi !== c.pyjhora.yogi.avayogi);
    expect(bad.map(({ c }) => c.input.name)).toEqual([]);
  });
  it("Duplicate Yogi 'sign-lord' equals PyJHora's sahayogi", () => {
    const bad = rows.filter(({ c, r }) => r.duplicateYogi !== c.pyjhora.yogi.sahayogi);
    expect(bad.map(({ c }) => c.input.name)).toEqual([]);
  });
});

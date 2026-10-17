/**
 * Bhava chalit (Sripati, equal) — pure rules, plus PyJHora cross-check on
 * KAAST pl9 longitudes (fixtures/bhava_yogi_panchanga_pyjhora.json).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { bhavaOf, bhavaOfArcsec, bhavaToArcsec, equalBhava, sripati, type Bhava } from '../../src/engine/houses/bhava';
import { normDeg } from '../../src/engine/zodiac';

interface JhHouse { start: number; mid: number; end: number; planets: string[] }
interface Case {
  input: { name: string };
  ascDeg: number; mcDeg: number;
  deg: Record<string, number>;
  pyjhora: { sripati_madhya: number[]; equal: JhHouse[]; sripati_method3: JhHouse[] };
}
const fixture = JSON.parse(readFileSync(resolve(import.meta.dirname, '../fixtures/bhava_yogi_panchanga_pyjhora.json'), 'utf8')) as { cases: Case[] };
const POINTS = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'] as const;

const angDiff = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);
const close = (a: number[], b: number[], tol = 1e-9) => a.every((x, i) => angDiff(x, b[i]!) <= tol);

describe('Sripati bhava (DOC: pib11770, manual p. 227)', () => {
  it('Asc and MC are madhyas 1 and 10, their opposites 7 and 4', () => {
    const b = sripati(301.25, 222.5);
    expect(b.madhya[0]).toBeCloseTo(301.25, 12);
    expect(b.madhya[9]).toBeCloseTo(222.5, 12);
    expect(b.madhya[6]).toBeCloseTo(121.25, 12);
    expect(b.madhya[3]).toBeCloseTo(42.5, 12);
  });

  it('trisects each quadrant (unequal quadrants: Asc 100°, MC 0°)', () => {
    const b = sripati(100, 0);
    // Q1 100→180 (80°), Q2 180→280 (100°), Q3 280→0 (80°), Q4 0→100 (100°)
    const want = [100, 126 + 2 / 3, 153 + 1 / 3, 180, 213 + 1 / 3, 246 + 2 / 3, 280, 306 + 2 / 3, 333 + 1 / 3, 0, 33 + 1 / 3, 66 + 2 / 3];
    expect(close(b.madhya, want)).toBe(true);
  });

  it('sandhis lie halfway between adjacent madhyas (sandhi i = start of house i)', () => {
    const b = sripati(100, 0);
    expect(b.sandhi[0]).toBeCloseTo((66 + 2 / 3 + 100) / 2, 9);          // between madhya 12 and 1
    expect(b.sandhi[3]).toBeCloseTo((153 + 1 / 3 + 180) / 2, 9);          // between 3 and 4
    expect(b.sandhi[9]).toBeCloseTo((333 + 1 / 3 + 360) / 2 - 360, 9);    // between 9 and 10, across 0°
  });

  it('wraps through 0° Aries (Asc 350°, MC 260°)', () => {
    const b = sripati(350, 260);
    expect(b.madhya[3]).toBeCloseTo(80, 12);
    expect(b.madhya[1]).toBeCloseTo(20, 12);
    expect(b.madhya[2]).toBeCloseTo(50, 12);
    for (let i = 0; i < 12; i++) expect(bhavaOf(b.madhya[i]!, b)).toBe(i + 1);
  });

  it('with equal quadrants it degenerates to the equal bhava', () => {
    expect(close(sripati(10, 280).madhya, equalBhava(10).madhya)).toBe(true);
    expect(close(sripati(10, 280).sandhi, equalBhava(10).sandhi)).toBe(true);
  });

  it('the 12 houses tile the circle: spans sum to 360°', () => {
    for (const [a, m] of [[301.95, 222.54], [15, 300], [200, 95], [359.99, 271]] as const) {
      const b = sripati(a, m);
      const total = b.sandhi.reduce((s, x, i) => s + normDeg(b.sandhi[(i + 1) % 12]! - x), 0);
      expect(total).toBeCloseTo(360, 9);
    }
  });
});

describe('equal bhava (DOC: pib11770 method 2)', () => {
  it('madhya i = Asc + 30(i−1), houses ±15°', () => {
    const b = equalBhava(301.9);
    for (let i = 0; i < 12; i++) {
      expect(b.madhya[i]).toBeCloseTo(normDeg(301.9 + 30 * i), 12);
      expect(b.sandhi[i]).toBeCloseTo(normDeg(301.9 + 30 * i - 15), 12);
    }
  });
  it('Asc at 15° of a sign aligns every bhava with a sign (tutorial)', () => {
    const b = equalBhava(105);
    expect(b.sandhi.map((s) => Math.round(s))).toEqual([90, 120, 150, 180, 210, 240, 270, 300, 330, 0, 30, 60]);
  });
});

describe('bhavaOf — half-open by sandhis (invariant 1)', () => {
  const b: Bhava = equalBhava(105); // sandhi of house 1 = 90°
  it('a point exactly on a sandhi belongs to the house that begins there', () => {
    expect(bhavaOf(90, b)).toBe(1);
    expect(bhavaOf(89.999999, b)).toBe(12);
    expect(bhavaOf(119.999999, b)).toBe(1);
    expect(bhavaOf(120, b)).toBe(2);
  });
  it('arcsecond variant agrees, including across 0°', () => {
    const a = bhavaToArcsec(b, 'round');
    expect(bhavaOfArcsec(90 * 3600, a)).toBe(1);
    expect(bhavaOfArcsec(90 * 3600 - 1, a)).toBe(12);
    expect(bhavaOfArcsec(0, a)).toBe(10);
    expect(bhavaOfArcsec(1_295_999, a)).toBe(9);
  });
});

describe('PyJHora cross-check (rules on identical longitudes)', () => {
  const cases = fixture.cases;
  it(`fixture holds ${cases.length} charts`, () => expect(cases.length).toBeGreaterThan(100));

  it('Sripati madhyas equal PyJHora bhaava_madhya_sripathi on every chart (≤1e-9°)', () => {
    const bad = cases.filter((c) => !close(sripati(c.ascDeg, c.mcDeg).madhya, c.pyjhora.sripati_madhya));
    expect(bad.map((c) => c.input.name)).toEqual([]);
  });

  it('equal bhava: madhyas, sandhis and the house of every planet equal PyJHora method 1', () => {
    const bad: string[] = [];
    for (const c of cases) {
      const b = equalBhava(c.ascDeg);
      if (!close(b.madhya, c.pyjhora.equal.map((h) => h.mid))) bad.push(`${c.input.name}: madhya`);
      if (!close(b.sandhi, c.pyjhora.equal.map((h) => h.start))) bad.push(`${c.input.name}: sandhi`);
      c.pyjhora.equal.forEach((h, i) => {
        for (const p of h.planets) if (p !== 'As' && bhavaOf(c.deg[p]!, b) !== i + 1) bad.push(`${c.input.name}: ${p}`);
      });
    }
    expect(bad).toEqual([]);
  });

  it('DISAGREEMENT (convention): PyJHora method 3 uses the Sripati madhyas as house BEGINNINGS', () => {
    // PyJHora drik._bhaava_madhya_new(method=3) puts start = madhya_i, end = madhya_{i+1}.
    // KAAST follows PL7's tutorial (madhya = centre, sandhis halfway), so planets can differ.
    let moved = 0, total = 0;
    for (const c of cases) {
      const b = sripati(c.ascDeg, c.mcDeg);
      expect(close(c.pyjhora.sripati_method3.map((h) => h.start), b.madhya)).toBe(true);
      c.pyjhora.sripati_method3.forEach((h, i) => {
        for (const p of h.planets) {
          if (p === 'As') continue;
          total++;
          if (bhavaOf(c.deg[p]!, b) !== i + 1) moved++;
        }
      });
    }
    // Roughly half the planets sit in the first half of a KAAST house and are one house back in PyJHora.
    expect(total).toBe(cases.length * POINTS.length);
    expect(moved / total).toBeGreaterThan(0.3);
    expect(moved / total).toBeLessThan(0.7);
  });
});

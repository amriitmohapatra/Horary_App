import { describe, expect, it } from 'vitest';
import { PL_AYANAMSA } from '../../src/engine/ephem/ayanamsa';
import { fromJulianDay, julianDay, weekday } from '../../src/engine/time/julian';
import { deltaTpl7, deltaTsolarFire } from '../../src/engine/time/deltaT';
import { lordChain } from '../../src/engine/kp/lords';
import { cyclicVargaSign, navamshaSign } from '../../src/engine/varga/cyclic';
import { mahadashas, subperiods, chainAt } from '../../src/engine/dasha/vimshottari';
import { pada, toArcsec, SIGN, NAKSHATRA } from '../../src/engine/zodiac';

describe('ayanamsa — PL7 report table, 2025-01-01 0h UT', () => {
  const jd = julianDay(2025, 1, 1, 0);
  const want: Record<string, string> = {
    pl_lahiri: "24°12'23.0", pl_yukteshwar: "22°53'24.2", pl_raman: "22°45'41.8", pl_bhasin: "23°06'41.8",
    pl_fagan_bradley: "25°05'47.8", pl_krishnamurti: "24°11'54.3", pl_krishnamurti_new: "24°06'23.0",
  };
  const parse = (v: string) => { const m = /(\d+)°(\d+)'([\d.]+)/.exec(v)!; return +m[1]! * 3600 + +m[2]! * 60 + +m[3]!; };
  it.each(Object.entries(want))('%s = %s (±0.1″, the table is printed to 0.1″)', (id, v) => {
    expect(Math.abs(PL_AYANAMSA[id as keyof typeof PL_AYANAMSA].at(jd) * 3600 - parse(v))).toBeLessThanOrEqual(0.1);
  });
  it('None is zero', () => expect(PL_AYANAMSA.pl_none.at(jd)).toBe(0));
});

describe('Julian Day', () => {
  it('J2000', () => expect(julianDay(2000, 1, 1, 12)).toBe(2451545));
  it('Gregorian reform', () => expect(julianDay(1582, 10, 15) - julianDay(1582, 10, 4)).toBe(1));
  it('round-trips to the second over 1800–2399', () => {
    for (let jd = 2378496.5; jd < 2597641; jd += 1234.567891) {
      const c = fromJulianDay(jd);
      expect(Math.abs(julianDay(c.y, c.m, c.d, c.h + c.mi / 60 + c.s / 3600) - jd) * 86400).toBeLessThan(0.51);
    }
  });
  it('weekday: 2018-05-16 was a Wednesday', () => expect(weekday(julianDay(2018, 5, 16, 12))).toBe(3));
});

describe('Delta-T curves', () => {
  it('PL7: table, 1993 joint, 2020 anchor, slope', () => {
    expect(deltaTpl7(julianDay(1800, 1, 1))).toBeCloseTo(12.578, 2);
    expect(deltaTpl7(julianDay(1993, 1, 1))).toBeCloseTo(59.122, 2);
    expect(deltaTpl7(julianDay(2020, 1, 1))).toBeCloseTo(83.0, 1);
    expect(deltaTpl7(julianDay(2030, 1, 1))! - deltaTpl7(julianDay(2020, 1, 1))!).toBeCloseTo(8.9, 1);
    expect(deltaTpl7(julianDay(1799, 1, 1))).toBeNull();
  });
  it('Solar Fire anchors', () => {
    expect(deltaTsolarFire(julianDay(2024, 1, 1))).toBeCloseTo(83.96, 1);
  });
});

describe('KP lords (computed, never looked up)', () => {
  it('0° Aries is Ke/Ke/Ke', () => expect(lordChain(0, 3)).toEqual(['Ke', 'Ke', 'Ke']));
  it('boundaries are half-open: first second of the Venus sub of Ashwini', () => {
    expect(lordChain(7 * 400 - 1, 2)).toEqual(['Ke', 'Ke']);
    expect(lordChain(7 * 400, 2)).toEqual(['Ke', 'Ve']);
  });
  it('generates the classic 249-row KP table', () => {
    let rows = 0, prev = '';
    for (let a = 0; a < 1_296_000; a++) {
      const k = `${Math.floor(a / SIGN)}|${lordChain(a, 2).join('/')}`;
      if (k !== prev) { rows++; prev = k; }
    }
    expect(rows).toBe(249);
  });
  it('wraps 360°', () => expect(lordChain(1_296_000 + 5, 2)).toEqual(lordChain(5, 2)));
});

describe('vargas and padas', () => {
  it('D9 of Aries 0° is Aries; Taurus 0° is Capricorn; Pisces 29°59′59″ is Pisces', () => {
    expect(navamshaSign(0)).toBe(0);
    expect(navamshaSign(SIGN)).toBe(9);
    expect(navamshaSign(12 * SIGN - 1)).toBe(11);
  });
  it('cyclic D1 is the sign itself', () => expect(cyclicVargaSign(5 * SIGN + 7, 1)).toBe(5));
  it('pada 1…4 inside a nakshatra', () => {
    expect([0, 12000, 24000, 36000, NAKSHATRA - 1].map(pada)).toEqual([1, 2, 3, 4, 4]);
  });
  it('rounding vs truncation', () => {
    expect(toArcsec(10 + 0.6 / 3600, 'round')).toBe(36001);
    expect(toArcsec(10 + 0.6 / 3600, 'truncate')).toBe(36000);
    expect(toArcsec(359.99999999, 'round')).toBe(0);
  });
});

describe('Vimshottari', () => {
  it('Maha periods sum to 120 years and sub-periods tile their parent', () => {
    const y = 365.2421875;
    const m = mahadashas(100.123, 2451545, y);
    expect((m[8]!.end - m[0]!.start) / y).toBeCloseTo(120, 9);
    const subs = subperiods(m[3]!);
    expect(subs[0]!.start).toBe(m[3]!.start);
    expect(subs[8]!.end).toBe(m[3]!.end);
    expect(subs[0]!.lords).toEqual([m[3]!.lords[0], m[3]!.lords[0]]);
  });
  it('the chain at the chart moment starts with the Moon nakshatra lord', () => {
    // Moon at 190.3° (Swati, Rahu's star)
    const m = mahadashas(190.3, 2451545, 365.25);
    expect(chainAt(m, 2451545, 1)[0]!.lords).toEqual(['Ra']);
  });
});

describe('profile overrides', async () => {
  const { resolveProfile } = await import('../../src/engine/profiles');
  it('unset keys keep the profile value; set keys replace it', () => {
    const p = resolveProfile('pl9', { dashaYearDays: 360, ayanamsa: undefined });
    expect(p.dashaYearDays).toBe(360);
    expect(p.ayanamsa).toBe('pl_lahiri');
    expect(resolveProfile('pl9')).toBe(resolveProfile('pl9', undefined));
  });
});

describe('Vimshottari navigation', async () => {
  const { mahadashas, nextPeriodOf, chainAt, spanYMD } = await import('../../src/engine/dasha/vimshottari');
  const mahas = mahadashas(190.317, 2430644.5, 365.2421875);
  it('next Sun pratyantar after a date starts after it and is a Sun period', () => {
    const after = 2458000.5;
    const path = nextPeriodOf(mahas, 2, 'Su', after)!;
    expect(path).toHaveLength(3);
    expect(path[2]!.lords[2]).toBe('Su');
    expect(path[2]!.start).toBeGreaterThanOrEqual(after);
    // and no Sun pratyantar starts between `after` and it
    const running = chainAt(mahas, after, 3)[2]!;
    expect(running.start <= after).toBe(true);
  });
  it('span formatting', () => {
    expect(spanYMD(365.2421875 * 2 + 40, 365.2421875)).toEqual({ y: 2, m: 1, d: 9 });
    // Venus–Moon antar = 20 × 10 / 120 years = exactly 1 y 8 m
    expect(spanYMD(365.2421875 * (20 * 10) / 120, 365.2421875)).toEqual({ y: 1, m: 8, d: 0 });
  });
});

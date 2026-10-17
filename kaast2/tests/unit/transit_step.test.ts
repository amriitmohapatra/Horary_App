import { describe, expect, it } from 'vitest';
import { stepJd } from '../../src/engine/transit/step';
import { fromJulianDay, julianDay } from '../../src/engine/time/julian';

const civil = (jd: number) => { const c = fromJulianDay(jd); return `${c.y}-${c.m}-${c.d} ${c.h}:${c.mi}:${c.s}`; };

describe('stepJd — transit step controls', () => {
  const t = julianDay(2024, 1, 31, 13 + 45 / 60 + 30 / 3600);
  it('fixed units', () => {
    expect(civil(stepJd(t, 's', 30))).toBe('2024-1-31 13:46:0');
    expect(civil(stepJd(t, 'min', -46))).toBe('2024-1-31 12:59:30');
    expect(civil(stepJd(t, 'h', 11))).toBe('2024-2-1 0:45:30');
    expect(civil(stepJd(t, 'd', 30))).toBe('2024-3-1 13:45:30');
    expect(civil(stepJd(t, 'w', 1))).toBe('2024-2-7 13:45:30');
    expect(civil(stepJd(t, 'w', -5))).toBe('2023-12-27 13:45:30');
  });
  it('months clamp to the end of a shorter month, keep the time of day', () => {
    expect(civil(stepJd(t, 'mo', 1))).toBe('2024-2-29 13:45:30');
    expect(civil(stepJd(julianDay(2023, 1, 31, 6), 'mo', 1))).toBe('2023-2-28 6:0:0');
    expect(civil(stepJd(t, 'mo', -2))).toBe('2023-11-30 13:45:30');
    expect(civil(stepJd(t, 'mo', 11))).toBe('2024-12-31 13:45:30');
  });
  it('years and decades', () => {
    const leap = julianDay(2024, 2, 29, 12);
    expect(civil(stepJd(leap, 'y', 1))).toBe('2025-2-28 12:0:0');
    expect(civil(stepJd(leap, 'y', 4))).toBe('2028-2-29 12:0:0');
    expect(civil(stepJd(leap, '10y', -22))).toBe('1804-2-29 12:0:0');
    expect(civil(stepJd(julianDay(1999, 12, 31, 23.999), '10y', 1))).toBe(civil(julianDay(2009, 12, 31, 23.999)));
  });
  it('steps are reversible when no clamping happens', () => {
    for (const u of ['s', 'min', 'h', 'd', 'mo', 'y', '10y'] as const) {
      const jd = julianDay(2001, 5, 15, 7.25);
      expect(Math.abs(stepJd(stepJd(jd, u, 7), u, -7) - jd) * 86400).toBeLessThan(1e-3);
    }
  });
  it('calendar steps need a whole count', () => expect(() => stepJd(t, 'mo', 0.5)).toThrow(RangeError));
});

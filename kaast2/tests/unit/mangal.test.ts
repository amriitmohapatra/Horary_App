/** Mangala Dosha (docs/specs/compatibility.md §8) on synthetic charts: houses, the gate and literal rules. */
import { describe, expect, it } from 'vitest';
import { mangalReport } from '../../src/engine/match/mangal';
import { PLANETS, type ChartResult, type PlanetId } from '../../src/engine/types';

/** A chart from signs (0 = Aries) at 15° each; Lagna at 15° of `asc`. */
function fake(asc: number, signs: Partial<Record<PlanetId, number>>, retro: PlanetId[] = []): ChartResult {
  const pos = (s: number) => ({ lon: s * 108000 + 54000, lonDeg: s * 30 + 15, latDeg: 0, speedDeg: 1 });
  const bodies = Object.fromEntries(PLANETS.map((p) => [p, { id: p, ...pos(signs[p] ?? 0), retrograde: retro.includes(p) }]));
  return { bodies, asc: { id: 'As', ...pos(asc), retrograde: false } } as unknown as ChartResult;
}

describe('Mangala Dosha', () => {
  it('counts Mars from the Lagna and from the Moon, houses 1 2 4 7 8 12', () => {
    // Lagna Aries, Mars Libra (7th), Moon Leo (Mars 3rd from the Moon).
    const g = fake(0, { Ma: 6, Mo: 4, Su: 10, Sa: 10 });
    const b = fake(0, { Ma: 2, Mo: 2, Su: 10, Sa: 10 });
    const r = mangalReport(g, b);
    expect(r.groom).toEqual({ fromLagna: 7, fromMoon: 3, lagnaDosha: true, moonDosha: false });
    expect(r.bride.lagnaDosha).toBe(false);
    expect(r.gate).toBe(true);
  });
  it('no dosha in either chart → nothing to cancel', () => {
    const r = mangalReport(fake(0, { Ma: 2, Mo: 2 }), fake(0, { Ma: 4, Mo: 4 }));
    expect(r.gate).toBe(false);
    expect(r.cancellations).toEqual([]);
  });
  it('R1 both Mangalik; R13 Mars 4th in Aries/Scorpio/Taurus/Libra; R18 Mars with Jupiter', () => {
    // Groom: Lagna Capricorn, Mars Aries = 4th. Bride: Lagna Aries, Mars Aries = 1st, with Jupiter.
    const r = mangalReport(fake(9, { Ma: 0, Ju: 5 }), fake(0, { Ma: 0, Ju: 0 }));
    const ids = r.cancellations.map((c) => `${c.who}:${c.id}`);
    expect(ids).toContain('pair:R1');
    expect(ids).toContain('groom:R13');
    expect(ids).toContain('bride:R18');
    expect(ids).not.toContain('groom:R18');
  });
  it('R15 Mars in the 8th for a Taurus Lagna', () => {
    const r = mangalReport(fake(1, { Ma: 8 }), fake(0, { Ma: 2 }));
    expect(r.cancellations.some((c) => c.who === 'groom' && c.id === 'R15')).toBe(true);
  });
});

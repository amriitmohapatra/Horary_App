/** PL 7 yoga formulas (docs/specs/pl_yogas.md §6) on synthetic charts: classical yogas as PL evaluates them. */
import { describe, expect, it } from 'vitest';
import { plYogas, PL_YOGAS } from '../../src/engine/yoga';
import { evaluateYoga } from '../../src/engine/yoga/evaluate';
import { PLANETS, type ChartResult, type PlanetId } from '../../src/engine/types';

/** Signs 0 = Aries; each planet at `deg` (default 15°) in its sign; Lagna at 15° of `asc`. */
function fake(asc: number, signs: Partial<Record<PlanetId, number>>, deg: Partial<Record<PlanetId, number>> = {}): ChartResult {
  const pos = (s: number, d = 15) => ({ lon: Math.round((s * 30 + d) * 3600), lonDeg: s * 30 + d, latDeg: 0, speedDeg: 1 });
  const bodies = Object.fromEntries(PLANETS.map((p) => [p, { id: p, ...pos(signs[p] ?? 0, deg[p]), retrograde: p === 'Ra' || p === 'Ke' }]));
  return { bodies, asc: { id: 'As', ...pos(asc), retrograde: false } } as unknown as ChartResult;
}
const present = (c: ChartResult, female: boolean | null = false) =>
  new Set(plYogas(c, null, female).filter((r) => r.outcome === 'present').map((r) => r.rule.id));

describe('PL 1001 yogas', () => {
  it('loads all 1001 records with ids 1…1001', () => {
    expect(PL_YOGAS).toHaveLength(1001);
    expect(PL_YOGAS.map((y) => y.id)).toEqual(Array.from({ length: 1001 }, (_, i) => i + 1));
  });
  // Lagna Aries; Moon Cancer, Jupiter Libra (4th from the Moon), Sun+Mercury Virgo, Mars Capricorn (exalted, 10th).
  const c = fake(0, { Su: 5, Me: 5, Mo: 3, Ju: 6, Ma: 9, Ve: 4, Sa: 10, Ra: 2, Ke: 8 });
  const p = present(c);
  it('Gaja-Kesari 65: Jupiter in a kendra from the Moon', () => { expect(p.has(65)).toBe(true); });
  it('Budha-Aditya 877: Sun and Mercury in one sign', () => { expect(p.has(877)).toBe(true); });
  it('Ruchaka 50: Mars in a kendra from the Lagna, exalted', () => { expect(p.has(50)).toBe(true); });
  it('Saraswati 200 is undecodable in PL and never present', () => { expect(p.has(200)).toBe(false); });
  it('Maha-Parivartana 630: Lagna lord exchanges with a good-house lord', () => {
    // Lagna Aries: Mars (L1) in Leo, Sun (L5) in Aries → exchange 1–5.
    expect(present(fake(0, { Ma: 4, Su: 0, Mo: 3, Ju: 8, Me: 2, Ve: 1, Sa: 10, Ra: 2, Ke: 8 })).has(630)).toBe(true);
  });
  it('Harsha 275: 6th lord in 6, 8 or 12', () => {
    // Lagna Aries: Mercury rules the 6th; Mercury in Scorpio (8th).
    expect(present(fake(0, { Me: 7, Mo: 3, Su: 6, Ju: 8, Ma: 0, Ve: 1, Sa: 10, Ra: 2, Ke: 8 })).has(275)).toBe(true);
  });
  it('Kemadruma 102: nothing of Mars…Saturn 2nd or 12th from the Moon', () => {
    const k = present(fake(0, { Mo: 3, Su: 4, Ma: 9, Me: 8, Ju: 6, Ve: 0, Sa: 10, Ra: 5, Ke: 11 }));
    expect(k.has(102)).toBe(true);
    expect(present(fake(0, { Mo: 3, Ma: 4, Su: 6, Me: 6, Ju: 8, Ve: 0, Sa: 10, Ra: 5, Ke: 11 })).has(102)).toBe(false);
  });
  it('gender-dependent yogas are "not evaluated" until the sex is set', () => {
    const w = { atom: '@W', subj: 'special:@W', rel: 'special' };
    expect(evaluateYoga(w, { chart: c, strength: null, female: null }).outcome).toBe('unknown');
    expect(evaluateYoga(w, { chart: c, strength: null, female: true }).outcome).toBe('present');
    expect(evaluateYoga({ ...w, atom: '-@W', neg: true }, { chart: c, strength: null, female: true }).outcome).toBe('absent');
  });
});

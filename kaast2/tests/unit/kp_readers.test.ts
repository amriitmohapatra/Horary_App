/**
 * KP significators in Krishnamurti's order (src/engine/kp/significators.ts)
 * against the planet → houses tables printed in KP Reader B6 (Figs. B6.20,
 * B6.26, B6.67; tests/fixtures/kp_b6_significators.json). Every row equals the
 * book except where the book itself is inconsistent; each exception is named.
 */
import { describe, expect, it } from 'vitest';
import fx from '../fixtures/kp_b6_significators.json';
import { kpModel } from '../../src/engine/kp/kp';
import { kpSignifications } from '../../src/engine/kp/significators';
import { PLANETS, type ChartResult, type PlanetId } from '../../src/engine/types';

type Case = (typeof fx.cases)[number];
function sig(c: Case) {
  const pl = c.planets as Record<string, { lon: number; retro: boolean }>;
  const bodies = Object.fromEntries(PLANETS.map((p) => [p, { id: p, lon: pl[p]!.lon, lonDeg: pl[p]!.lon / 3600, retrograde: pl[p]!.retro }]));
  return kpSignifications(kpModel({ cusps: c.cusps, bodies } as unknown as ChartResult));
}
const ALL_BUT_4 = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12];

/** Rows where Krishnamurti's printed table departs from his own rule (references/KP/notes/b6_rules.md KP6-024). */
const EXCEPTIONS: Record<string, Partial<Record<PlanetId, string>>> = {
  'b6-E16': {
    Ve: 'printed 3, 4 instead of 2: unexplained in the book',
    Ra: 'inherits the printed Venus row (conjoined Venus)',
    Sa: 'Saturn in Ketu’s star gets a reduced Ketu set in this figure',
  },
  'b6-E21': {
    Mo: 'Moon in Ketu’s star gets a reduced Ketu set in this figure',
    Ve: 'print omission: house IX lists Venus but the Venus row omits 9',
  },
  'b6-E55': { Ve: 'print omission: house II lists Venus but the Venus row omits 2' },
};

describe('KP significators against B6’s printed tables', () => {
  for (const c of fx.cases) {
    it(`${c.id} (${c.cite})`, () => {
      const s = sig(c);
      const printed = c.printed as Record<string, number[]>;
      for (const p of PLANETS) {
        if (EXCEPTIONS[c.id]?.[p]) continue;
        const want = printed[p] ?? (c.id === 'b6-E21' ? ALL_BUT_4 : c.id === 'b6-E55' && p === 'Ke' ? [1, 2, 3, 4, 6, 7, 8, 9, 10] : null);
        expect(s.planets[p].all, `${c.id} ${p}`).toEqual(want);
      }
    });
  }
  it('the exceptions differ from the book only as described', () => {
    const e21 = sig(fx.cases.find((c) => c.id === 'b6-E21')!);
    expect(e21.planets.Ve.all).toEqual([4, 9, 11]);
    const e55 = sig(fx.cases.find((c) => c.id === 'b6-E55')!);
    expect(e55.planets.Ve.all).toEqual([2, 3, 6, 8]);
  });
  it('house ranking: levels 1–5 strongest first, nodes before the planets they represent', () => {
    const s = sig(fx.cases.find((c) => c.id === 'b6-E55')!);
    for (const h of s.houses) {
      expect(h.levels).toHaveLength(5);
      for (const a of h.nodeAgents) expect(h.ordered.indexOf(a.node)).toBeLessThan(h.ordered.indexOf(a.for));
    }
  });
});

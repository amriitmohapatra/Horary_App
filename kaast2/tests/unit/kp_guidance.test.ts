/**
 * KP Guidance rule files (src/engine/kp/guidance/*.json): schema, policy and
 * evaluation on the Readers' printed charts (tests/fixtures/kp_b6_significators.json).
 */
import { describe, expect, it } from 'vitest';
import fx from '../fixtures/kp_b6_significators.json';
import { GUIDANCE_RULES, TOPICS, kpGuidance, validateCond } from '../../src/engine/kp/guidance';
import { kpModel } from '../../src/engine/kp/kp';
import { kpSignifications } from '../../src/engine/kp/significators';
import { PLANETS, type ChartResult } from '../../src/engine/types';
import MATCH from '../../src/engine/kp/guidance/match_notes.json';

/** Policy as on the NTP page: no death, longevity, accident, danger or disease prognosis. */
const FORBIDDEN = /\b(death|die|dies|dying|died|longevity|life span|lifespan|accident|danger|dangerous|fatal|suicide|murder|leprosy|tuberculosis|widow|widower|maraka|killed|kill)\b/i;

describe('KP guidance rules', () => {
  it('every rule is well formed', () => {
    const ids = new Set<string>();
    for (const r of GUIDANCE_RULES) {
      expect(validateCond(r.when), r.id).toEqual([]);
      expect(r.id, r.id).toMatch(/^KP[1-6]-\d{3}[a-z]?(\+KP[1-6]-\d{3}[a-z]?)*$/);
      expect(ids.has(`${r.id}|${r.text}`), `duplicate ${r.id}`).toBe(false);
      ids.add(`${r.id}|${r.text}`);
      expect(['good', 'bad', 'mixed', 'info']).toContain(r.tone);
      expect(TOPICS as readonly string[], `${r.id} topic`).toContain(r.topic);
      expect(r.cite, r.id).toMatch(/^B[1-6] pp?\. \d/);
      expect(r.text.length, `${r.id} text length`).toBeGreaterThan(15);
      expect(r.text.length, `${r.id} text length`).toBeLessThan(400);
    }
  });
  it('no rule speaks of death, longevity, accidents, danger or disease prognosis', () => {
    // The sign Cancer is allowed (capitalised); the disease is not.
    for (const r of GUIDANCE_RULES) expect(FORBIDDEN.test(r.text) || /\bcancer\b/.test(r.text), `${r.id}: ${r.text}`).toBe(false);
  });
  it('quotations stay short (the books are copyrighted)', () => {
    for (const r of GUIDANCE_RULES) for (const q of r.text.match(/[“"][^”"]+[”"]/g) ?? []) expect(q.split(/\s+/).length, `${r.id}: ${q}`).toBeLessThanOrEqual(12);
  });
  it('evaluates on the Readers’ charts without error, each finding with a reason', () => {
    for (const c of fx.cases) {
      const pl = c.planets as Record<string, { lon: number; retro: boolean }>;
      const bodies = Object.fromEntries(PLANETS.map((p) => [p, { id: p, lon: pl[p]!.lon, lonDeg: pl[p]!.lon / 3600, retrograde: pl[p]!.retro }]));
      const m = kpModel({ cusps: c.cusps, bodies } as unknown as ChartResult);
      const f = kpGuidance(m, kpSignifications(m));
      for (const x of f) expect(x.because.length).toBeGreaterThan(3);
    }
  });
  it('matching notes (B4): shape and the same policy', () => {
    for (const n of MATCH.notes) {
      expect(n.id).toMatch(/^KP4-\d{3}/);
      expect(n.cite).toMatch(/^B4 pp?\. \d/);
      expect(FORBIDDEN.test(n.text) || /\bcancer\b/.test(n.text), `${n.id}: ${n.text}`).toBe(false);
    }
  });
});

/**
 * Ruling planets (src/engine/kp/ruling.ts) at the judgement moments printed
 * in the KP Readers (tests/fixtures/kp_readers_rp.json). Readers mode: KP-New
 * ayanamsa, mean node; weekday from sunrise.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import fx from '../fixtures/kp_readers_rp.json';
import { bootNode } from './boot';
import { cast } from '../../src/engine';
import { vara } from '../../src/engine/panchanga/panchanga';
import { rulingPlanets } from '../../src/engine/kp/ruling';
import type { SwissEph } from '../../src/engine/ephem/swisseph';
import type { PlanetId } from '../../src/engine/types';

let swe: SwissEph;
beforeAll(async () => { swe = await bootNode(); });

function rpOf(c: (typeof fx.cases)[number]) {
  const ch = cast(swe, {
    date: c.date, time: c.time, tzHours: c.tzHours, dstHours: 0,
    place: { name: c.id, latDeg: c.latDeg, lonDeg: c.lonDeg }, profileId: 'pl9',
    overrides: { ayanamsa: 'pl_krishnamurti_new', node: 'mean' },
  });
  return rulingPlanets(ch, vara(swe, ch).lord as PlanetId);
}

describe('ruling planets at the Readers’ judgement moments', () => {
  for (const c of fx.cases) {
    it(`${c.id} (${c.cite})`, () => {
      const rp = rpOf(c);
      const got = Object.fromEntries(rp.slots.map((s) => [s.role, s.planet]));
      const skip = c.skip as Record<string, string>;
      for (const [role, p] of Object.entries(c.roles)) if (!skip[role]) expect(got[role], `${c.id} ${role}`).toBe(p);
      for (const n of c.nodes as { node: PlanetId; reps: PlanetId[]; first?: PlanetId; before?: PlanetId }[]) {
        expect(rp.ordered, `${c.id} ${n.node} is an RP`).toContain(n.node);
        const hit = rp.nodes.find((x) => x.node === n.node);
        for (const r of n.reps) expect(hit?.reps.map((x) => x.planet), `${c.id} ${n.node} represents`).toContain(r);
        if (n.first) expect(hit!.for, `${c.id} ${n.node} first`).toBe(n.first);
        if (n.before) expect(rp.ordered.indexOf(n.node)).toBeLessThan(rp.ordered.indexOf(n.before));
      }
      for (const r of c.rejected as PlanetId[]) expect(rp.rejected.map((x) => x.planet), `${c.id} rejected`).toContain(r);
    });
  }
});

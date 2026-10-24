/**
 * KP Guidance rules must say something about a chart: on 400 random real
 * charts (Readers mode, India), no chart rule may hold for more than 80% of
 * them. Rules that did (gem advice, broad node and Saturn rules) were removed;
 * see docs/specs/kp_research.md §4.
 */
import { beforeAll, expect, it } from 'vitest';
import { bootNode } from './boot';
import { cast } from '../../src/engine';
import { kpModel } from '../../src/engine/kp/kp';
import { kpSignifications } from '../../src/engine/kp/significators';
import { GUIDANCE_RULES, holds } from '../../src/engine/kp/guidance';
import type { SwissEph } from '../../src/engine/ephem/swisseph';

let swe: SwissEph;
beforeAll(async () => { swe = await bootNode(); });

it('no chart rule holds for more than 80% of random charts', () => {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const N = 400;
  const hits = new Array<number>(GUIDANCE_RULES.length).fill(0);
  for (let i = 0; i < N; i++) {
    const ch = cast(swe, {
      date: { y: 1930 + Math.floor(rnd() * 80), m: 1 + Math.floor(rnd() * 12), d: 1 + Math.floor(rnd() * 28) },
      time: { h: Math.floor(rnd() * 24), mi: Math.floor(rnd() * 60), s: 0 }, tzHours: 5.5, dstHours: 0,
      place: { name: 'x', latDeg: 8 + rnd() * 24, lonDeg: 72 + rnd() * 16 }, profileId: 'pl9',
      overrides: { ayanamsa: 'pl_krishnamurti_new', node: 'mean' },
    });
    const m = kpModel(ch), s = kpSignifications(m);
    GUIDANCE_RULES.forEach((r, k) => { if (holds(r.when, m, s) !== null) hits[k]!++; });
  }
  const broad = GUIDANCE_RULES.filter((r, k) => !('always' in r.when) && hits[k]! / N > 0.8).map((r) => r.id);
  expect(broad).toEqual([]);
});

/**
 * Voice assistant facts (src/ui/voice/facts.ts) against the oracle: the
 * boss's PL9 Page 1 screenshot (fixtures/pl9_page1_amitabh.json). What the
 * agent may say must equal what PL prints, in words a voice can read.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import fixture from '../fixtures/pl9_page1_amitabh.json';
import { bootNode } from './boot';
import { cast, type ChartInput } from '../../src/engine';
import { julianDay } from '../../src/engine/time/julian';
import { chartOverview, dashaFacts, houseFacts, planetFacts, voiceChart, type VoiceChart } from '../../src/ui/voice/facts';

const input: ChartInput = {
  name: fixture.input.name,
  date: { y: 1942, m: 10, d: 11 }, time: { h: 16, mi: 0, s: 0 },
  tzHours: fixture.input.tzHours, dstHours: 0,
  place: { name: fixture.input.place, latDeg: fixture.input.latDeg, lonDeg: fixture.input.lonDeg },
  profileId: 'pl9',
};
const NOW = julianDay(2026, 11, 10, 6);

let v: VoiceChart;
beforeAll(async () => { v = voiceChart(cast(await bootNode(), input)); });

/** PL9 "pada,star/sub/sub-sub" → the words the tool must return. */
const WORD: Record<string, string> = { Su: 'Sun', Mo: 'Moon', Ma: 'Mars', Me: 'Mercury', Ju: 'Jupiter', Ve: 'Venus', Sa: 'Saturn', Ra: 'Rahu', Ke: 'Ketu' };
const SIGN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const table = fixture.planet_table as unknown as Record<string, [number, string, string, string, string, string]>;

describe('voice facts — PL9 Page 1 oracle', () => {
  it.each(['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'])('%s: sign, degree, pada, star/sub/sub-sub, flags', (id) => {
    const [signNo, lon, flags, , , kp] = table[id]!;
    const f = planetFacts(v, WORD[id]!) as Record<string, unknown>;
    const [d, m] = lon.split(':').map(Number);
    const [pd, lords] = kp.split(',');
    const [star, sub, subsub] = lords!.split('/');
    expect(f.sign).toBe(SIGN[signNo - 1]);
    expect(f.degree_in_sign).toBe(`${d} degree${d === 1 ? '' : 's'} ${m} minute${m === 1 ? '' : 's'}`);
    expect(f.pada).toBe(Number(pd));
    expect([f.star_lord, f.sub_lord, f.sub_sub_lord]).toEqual([WORD[star!], WORD[sub!], WORD[subsub!]]);
    expect(f.retrograde).toBe(flags.includes('R'));
    expect(f.combust).toBe(flags.includes('c'));
  });

  it('ascendant: Aquarius 1°56′, Dhanishta pada 3, Mars/Ketu/Venus', () => {
    const o = chartOverview(v, NOW) as { ascendant: Record<string, unknown> };
    expect(o.ascendant).toMatchObject({ sign: 'Aquarius', degree_in_sign: '1 degree 56 minutes', nakshatra: 'Dhanishta',
      pada: 3, star_lord: 'Mars', sub_lord: 'Ketu', sub_sub_lord: 'Venus' });
  });

  it('nakshatras are spoken in full (PL abbreviates Satabhi.)', () => {
    expect(planetFacts(v, 'Ketu')).toMatchObject({ nakshatra: 'Shatabhisha' });
    expect(planetFacts(v, 'sun')).toMatchObject({ nakshatra: 'Chitra' });
  });

  it('houses count whole signs from the Aquarius ascendant', () => {
    expect(planetFacts(v, 'Sun')).toMatchObject({ house: 8 });
    expect(planetFacts(v, 'Jupiter')).toMatchObject({ house: 6, rules_houses: [2, 11] });
    expect(planetFacts(v, 'Mars')).toMatchObject({ rules_houses: [3, 10] });
    const h1 = houseFacts(v, 1) as Record<string, unknown>;
    expect(h1).toMatchObject({ sign: 'Aquarius', lord: 'Saturn', lord_placed: { sign: 'Taurus', house: 4 } });
    expect(houseFacts(v, 8)).toMatchObject({ sign: 'Virgo', planets_in_house: ['Sun', 'Mars', 'Mercury', 'Venus'] });
  });

  it('dashas: running Venus – Sun – Rahu from 16 May 2018 (PL9 row 1)', () => {
    const d = dashaFacts(v, NOW, '2018-06-01') as { running: Record<string, string>[] };
    expect(d.running[2]).toEqual({ level: 'Pratyantardasha', lords: 'Venus – Sun – Rahu', from: '16 May 2018', to: '10 July 2018' });
    expect(d.running[0]!.lords).toBe('Venus');
    const e = dashaFacts(v, NOW, '2019-01-01') as { next_antardashas: Record<string, string>[] };
    expect(e.next_antardashas[0]).toMatchObject({ lords: 'Venus – Moon', from: '8 March 2019' });
  });

  it('bad arguments come back as an error the agent can read, not an exception', () => {
    expect(planetFacts(v, 'Pluto')).toHaveProperty('error');
    expect(houseFacts(v, 13)).toHaveProperty('error');
    expect(dashaFacts(v, NOW, '15/03/2027')).toHaveProperty('error');
  });

  it('words, not codes; no name or place of the person', () => {
    const all = JSON.stringify([chartOverview(v, NOW), ...Object.values(WORD).map((p) => planetFacts(v, p)),
      ...Array.from({ length: 12 }, (_, i) => houseFacts(v, i + 1)), dashaFacts(v, NOW)]);
    expect(all).not.toMatch(/"(As|Su|Mo|Ma|Me|Ju|Ve|Sa|Ra|Ke|DB|EX|MT|OWN|4\/4|3\/4|1\/2|1\/4)"/);
    expect(all).not.toMatch(/Amitabh|Allahabad|25\.45|81\.85/);
  });
});

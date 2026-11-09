/** Planet summary on hover (src/engine/exp/summary.ts): the rules on hand-made charts. */
import { describe, expect, it } from 'vitest';
import { bodySummary, type SummaryChart } from '../../src/engine/exp/summary';

// Aries Lagna. Ma in Cancer, Ju in Scorpio, Sa in Aries, Su+Me in Leo, Mo in Taurus,
// Ve in Pisces, Ra in Virgo, Ke in Pisces, Uranus in Leo.
const base: SummaryChart = {
  ascSign: 0,
  signs: { Su: 4, Mo: 1, Ma: 3, Me: 4, Ju: 7, Ve: 11, Sa: 0, Ra: 5, Ke: 11, Ur: 4 },
  retro: { Sa: true },
  combust: { Me: true },
  orb: 3,
};

describe('bodySummary', () => {
  it('Mars in Cancer: debilitated, rules 1 and 8, aspected by Jupiter (9th, full)', () => {
    const s = bodySummary(base, 'Ma')!;
    expect(s.house).toBe(4);
    expect(s.dignity).toBe('DB');
    expect(s.rules).toEqual([1, 8]);
    expect(s.dispositor).toEqual({ id: 'Mo', house: 2 });
    const ju = s.aspectedBy.find((a) => a.from === 'Ju')!;
    expect(ju).toMatchObject({ count: 9, fraction: '4/4' });
    // Saturn from Aries to Cancer = 4th: a ¾ (partial) aspect, listed after the full ones.
    expect(s.aspectedBy.find((a) => a.from === 'Sa')).toMatchObject({ count: 4, fraction: '3/4' });
    expect(s.aspectedBy[0]!.fraction).toBe('4/4');
    // Mars casts 4th, 7th, 8th: houses 7 (Li), 10 (Cp), 11 (Aq) — all empty here.
    expect(s.aspectsHouses).toEqual([7, 10, 11]);
    expect(s.aspectsBodies).toEqual([]);
  });

  it('Saturn in Aries: debilitated, retrograde, rules 10 and 11, aspects 3, 7, 10', () => {
    const s = bodySummary(base, 'Sa')!;
    expect(s.dignity).toBe('DB');
    expect(s.retrograde).toBe(true);
    expect(s.rules).toEqual([10, 11]);
    expect(s.aspectsHouses).toEqual([3, 7, 10]);
  });

  it('Sun in Leo: own sign, conjunct Mercury and Uranus (no orbs in a sign-only chart)', () => {
    const s = bodySummary(base, 'Su')!;
    expect(s.dignity).toBe('OWN');
    expect(s.rules).toEqual([5]);
    expect(s.conjunctions.map((c) => c.with).sort()).toEqual(['Me', 'Ur']);
    expect(s.conjunctions.every((c) => c.orb === null && !c.close && !c.war)).toBe(true);
    expect(bodySummary(base, 'Me')!.combust).toBe(true);
  });

  it('nodes rule no house; Rahu and Ketu are not listed as conjunct each other', () => {
    const ra = bodySummary(base, 'Ra')!;
    expect(ra.rules).toEqual([]);
    expect(ra.dispositor).toEqual({ id: 'Me', house: 5 });
    const ke = bodySummary(base, 'Ke')!;
    expect(ke.conjunctions.map((c) => c.with)).toEqual(['Ve']);
    expect(ke.aspectedBy.some((a) => a.from === 'Ra' && a.fraction === '4/4')).toBe(true);
  });

  it('outer bodies: no dignity, no rulership, no aspects cast; still aspected', () => {
    const s = bodySummary(base, 'Ur')!;
    expect(s.dignity).toBeNull();
    expect(s.rules).toEqual([]);
    expect(s.aspectsHouses).toEqual([]);
    // Jupiter in Scorpio → Leo is the 10th from it: ¼. Saturn: Aries → Leo = 5th, ½. Mars, Leo → Leo: none.
    expect(s.aspectedBy.find((a) => a.from === 'Sa')).toMatchObject({ fraction: '1/2' });
    expect(s.aspectedBy.find((a) => a.from === 'Ju')).toMatchObject({ count: 10, fraction: '1/4' });
    expect(s.aspectedBy.some((a) => a.from === 'Su')).toBe(false);
    // Uranus casts no aspect, so the Moon is not aspected by it.
    expect(bodySummary(base, 'Mo')!.aspectedBy.some((a) => (a.from as string) === 'Ur')).toBe(false);
  });

  it('exact degrees: nakshatra, close conjunction, planetary war and moolatrikona', () => {
    const deg = (d: number) => ({ lon: Math.round(d * 3600), lonDeg: d });
    const c: SummaryChart = {
      ...base,
      signs: { ...base.signs, Ve: 4, Ma: 4 },
      pos: { Su: deg(125), Me: deg(127.5), Ur: deg(140), Ma: deg(141.2), Ve: deg(141.9) },
    };
    const su = bodySummary(c, 'Su')!;
    expect(su.dignity).toBe('MT'); // Leo 0–20° is the Sun's moolatrikona
    expect(su.nakshatra).toMatchObject({ name: 'Magha', pada: 2, lord: 'Ke' });
    expect(su.conjunctions[0]).toMatchObject({ with: 'Me', close: true, war: false });
    const ma = bodySummary(c, 'Ma')!;
    expect(ma.conjunctions.find((x) => x.with === 'Ve')).toMatchObject({ war: true, close: true });
    expect(ma.conjunctions.find((x) => x.with === 'Ur')).toMatchObject({ war: false, close: true });
  });

  it('transit: natal planets in the same sign', () => {
    const c: SummaryChart = { ...base, pos: { Sa: { lon: 36000, lonDeg: 10 } }, natal: { Mo: { sign: 0, lonDeg: 12 }, Su: { sign: 4, lonDeg: 130 } } };
    expect(bodySummary(c, 'Sa')!.overNatal).toEqual([{ id: 'Mo', orb: 2 }]);
  });

  it('a body not in the chart has no summary', () => {
    expect(bodySummary({ ...base, signs: { Su: 0 } }, 'Ne')).toBeNull();
  });
});

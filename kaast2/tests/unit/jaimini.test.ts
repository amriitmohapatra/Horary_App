/** Jaimini pure rules (engine/jaimini): counting, exceptions, ties, variants. */
import { describe, expect, it } from 'vitest';
import type { PlanetId } from '../../src/engine/types';
import { SIGN } from '../../src/engine/zodiac';
import {
  argala, arudhaPadas, charaKarakas, countFrom, housesFrom, induLagnaSign, jaiminiAspects, karakaDegree, karakamsha,
  lordOf, padaOf, pranapadaDeg, rashiDrishti, sriLagnaDeg, strongerCoLord, sunriseFlags, timeLagnaDeg,
  varnadaSign, varnadas, LAGNA_RATE, specialLagnasFrom, type SignMap,
} from '../../src/engine/jaimini';
import { SE } from '../../src/engine/ephem/swisseph';

const [Ar, Ta, Ge, Cn, Le, Vi, Li, Sc, Sg, Cp, Aq, Pi] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const at = (sign: number, deg: number, min = 0, sec = 0) => ({ lon: sign * SIGN + deg * 3600 + min * 60 + sec });

describe('chara karakas', () => {
  const bodies = {
    Su: at(Ar, 29), Mo: at(Ta, 3), Ma: at(Ge, 20), Me: at(Cn, 12), Ju: at(Le, 25), Ve: at(Vi, 7), Sa: at(Li, 15), Ra: at(Sc, 2), Ke: at(Ta, 2),
  };
  it('7 scheme: AK AmK BK MK PiK GK DK by degrees in the sign (PK merged with MK)', () => {
    expect(charaKarakas(bodies, 7).map((e) => `${e.karaka}=${e.planet}`)).toEqual(
      ['AK=Su', 'AmK=Ju', 'BK=Ma', 'MK=Sa', 'PiK=Me', 'GK=Ve', 'DK=Mo']);
  });
  it('8 scheme: Rahu at 2° counts as 28° and becomes AmK', () => {
    expect(karakaDegree('Ra', bodies.Ra.lon)).toBe(28 * 3600);
    expect(charaKarakas(bodies, 8).map((e) => `${e.karaka}=${e.planet}`)).toEqual(
      ['AK=Su', 'AmK=Ra', 'BK=Ju', 'MK=Ma', 'PiK=Sa', 'PK=Me', 'GK=Ve', 'DK=Mo']);
  });
  it('Rahu at exactly 0° counts as 30°00′00″ (the maximum)', () => {
    expect(charaKarakas({ ...bodies, Ra: at(Sc, 0) }, 8)[0]).toEqual({ karaka: 'AK', planet: 'Ra', degree: SIGN });
  });
  it('Ketu never takes part; a missing planet throws', () => {
    expect(charaKarakas(bodies, 8).some((e) => e.planet === 'Ke')).toBe(false);
    const { Sa: _drop, ...noSa } = bodies;
    expect(() => charaKarakas(noSa, 7)).toThrow(/Sa/);
  });
  describe('ties at the arcsecond (Mars and Venus both 17°17′17″)', () => {
    const tied = { ...bodies, Ma: at(Ge, 17, 17, 17), Ve: at(Sg, 17, 17, 17) };
    it("'bphs' (default): both share BK, the labels after shift up, DK is lost (BPHS 32.13-17)", () => {
      expect(charaKarakas(tied, 7).map((e) => `${e.karaka}=${e.planet}`)).toEqual(
        ['AK=Su', 'AmK=Ju', 'BK=Ma', 'BK=Ve', 'MK=Sa', 'PiK=Me', 'GK=Mo']);
    });
    it("'natural-order': Mars before Venus (Su Mo Ma Me Ju Ve Sa Ra)", () => {
      expect(charaKarakas(tied, 7, 'natural-order').map((e) => `${e.karaka}=${e.planet}`)).toEqual(
        ['AK=Su', 'AmK=Ju', 'BK=Ma', 'MK=Ve', 'PiK=Sa', 'GK=Me', 'DK=Mo']);
    });
    it('a one-arcsecond difference is not a tie', () => {
      expect(charaKarakas({ ...tied, Ve: at(Sg, 17, 17, 18) }, 7).slice(2, 4).map((e) => e.planet)).toEqual(['Ve', 'Ma']);
    });
  });
  it('karakamsha: navamsha sign of the AK (Sun 29° Aries → 9th navamsha → Sagittarius)', () => {
    expect(karakamsha(bodies, 7)).toEqual({ ak: 'Su', sign: Sg });
  });
  it('housesFrom: houses counted from a given lagna', () => {
    expect(housesFrom({ As: Cn, Su: Cn, Mo: Ge, Ma: Cp }, Cn)).toEqual({ As: 1, Su: 1, Mo: 12, Ma: 7 });
  });
});

describe('arudha padas — the count and its exceptions', () => {
  it.each([
    // [lord in the n-th from the house, bphs, tutorial, none] for a house in Aries
    [1, 'Cp', 'Cp', 'Ar'],   // lord in own house → 10th (both)
    [2, 'Ge', 'Ge', 'Ge'],
    [3, 'Le', 'Le', 'Le'],
    [4, 'Cn', 'Cn', 'Li'],   // raw pada = 7th → 4th from the house (both)
    [5, 'Sg', 'Sg', 'Sg'],
    [6, 'Aq', 'Aq', 'Aq'],
    [7, 'Cp', 'Cn', 'Ar'],   // THE ambiguity: BPHS 10th, tutorial 4th
    [8, 'Ge', 'Ge', 'Ge'],
    [9, 'Le', 'Le', 'Le'],
    [10, 'Cn', 'Cn', 'Li'],  // raw = 7th → 4th
    [11, 'Sg', 'Sg', 'Sg'],
    [12, 'Aq', 'Aq', 'Aq'],
  ])('lord in the %ith: bphs %s, tutorial %s, none %s', (n, bphs, tut, none) => {
    const S = ['Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];
    const lord = n - 1;
    expect([S[padaOf(Ar, lord, 'bphs')], S[padaOf(Ar, lord, 'tutorial')], S[padaOf(Ar, lord, 'none')]]).toEqual([bphs, tut, none]);
  });
  it('the result never falls in the house itself or its 7th under bphs (all 144 house/lord pairs)', () => {
    for (let h = 0; h < 12; h++) for (let l = 0; l < 12; l++) {
      const k = countFrom(h, padaOf(h, l));
      expect(k === 1 || k === 7).toBe(false);
    }
  });
  const chart: SignMap = { As: Cn, Su: Le, Mo: Cp, Ma: Ar, Me: Ge, Ju: Pi, Ve: Ta, Sa: Cn, Ra: Aq, Ke: Le };
  it('A1 … A12 and upapada on a constructed chart (Cancer lagna)', () => {
    // H1 Cn: Mo in Cp (7th) → raw Cn → 10th = Ar.  H12 Ge: Me own → 10th from Ge = Pi.
    const r = arudhaPadas(chart, Cn);
    expect(r.padas[0]).toBe(Ar);
    expect(r.upapada).toBe(Pi);
    expect(r.padas[11]).toBe(r.upapada);
    expect(r.lords).toEqual(['Mo', 'Su', 'Me', 'Ve', 'Ma', 'Ju', 'Sa', 'Sa', 'Ju', 'Ma', 'Ve', 'Me']);
    // tutorial: lord of the 1st in the 7th → the 4th = Libra
    expect(arudhaPadas(chart, Cn, { variant: 'tutorial' }).padas[0]).toBe(Li);
  });
  it('works for any varga: only sign placements are needed', () => {
    const r = arudhaPadas({ As: Ar, Ma: Ar, Ve: Ta, Me: Ge, Mo: Cn, Su: Le, Ju: Sg, Sa: Cp }, Ar);
    // houses whose lord sits in them (Ar Ta Ge Cn Le Sg Cp) → the 10th from the house
    expect([0, 1, 2, 3, 4, 8, 9].map((i) => r.padas[i])).toEqual([Cp, Aq, Pi, Ar, Ta, Vi, Li]);
    // Virgo: Mercury in Gemini, the 10th from it → raw pada Pisces (7th) → 4th from Virgo
    expect(r.padas[5]).toBe(Sg);
  });
  it('throws when a lord has no placement', () => {
    expect(() => arudhaPadas({ As: Ar }, Ar)).toThrow(/Ma/);
  });
});

describe('co-lords of Scorpio and Aquarius', () => {
  it("'single' (default) uses Mars and Saturn", () => {
    expect(lordOf(Sc, { Ma: Ar, Ke: Sc })).toBe('Ma');
    expect(lordOf(Aq, { Sa: Ar, Ra: Aq })).toBe('Sa');
  });
  it('rule 0: one co-lord in the sign, the other elsewhere → the other', () => {
    expect(strongerCoLord(Sc, 'Ma', 'Ke', { Ma: Sc, Ke: Ta })).toBe('Ke');
    expect(strongerCoLord(Aq, 'Sa', 'Ra', { Sa: Ge, Ra: Aq })).toBe('Sa');
  });
  it('rule 1: more planets in its sign (the lagna does not count)', () => {
    const s: SignMap = { As: Ar, Sa: Ar, Ra: Ge, Su: Ge, Mo: Le, Ma: Le, Me: Cp, Ju: Cp, Ve: Sg, Ke: Sg };
    expect(strongerCoLord(Aq, 'Sa', 'Ra', s)).toBe('Ra');
  });
  it('rule 5: degrees break the final tie', () => {
    // everyone else in Gemini, which aspects neither Taurus nor Leo; both fixed, neither exalted
    const s: SignMap = { Ma: Ta, Ke: Le, Su: Ge, Mo: Ge, Me: Ge, Ju: Ge, Ve: Ge, Sa: Ge, Ra: Aq };
    expect(strongerCoLord(Sc, 'Ma', 'Ke', s, { Ma: Ta * SIGN + 3600, Ke: Le * SIGN + 7200 })).toBe('Ke');
    expect(strongerCoLord(Sc, 'Ma', 'Ke', s)).toBe('Ma');
  });
  it("'stronger' changes the pada when Ketu wins", () => {
    const s: SignMap = { As: Sc, Ma: Sc, Ke: Cp, Ra: Cn, Su: Ar, Mo: Ar, Me: Ar, Ju: Ar, Ve: Ar, Sa: Ar };
    expect(arudhaPadas(s, Sc).padas[0]).toBe(Le);                        // Mars in own → 10th
    expect(arudhaPadas(s, Sc, { coLords: 'stronger' }).padas[0]).toBe(Pi); // Ketu in Cp (3rd) → 3rd from Cp
  });
});

describe('rashi drishti', () => {
  it.each([
    [Ar, [Le, Sc, Aq]], [Ta, [Cn, Li, Cp]], [Ge, [Vi, Sg, Pi]], [Cn, [Ta, Sc, Aq]],
    [Le, [Ar, Li, Cp]], [Sc, [Ar, Cn, Cp]], [Pi, [Ge, Vi, Sg]],
  ])('sign %i aspects %j', (s, want) => expect(rashiDrishti(s)).toEqual(want));
  it('every sign aspects three signs and the relation is symmetric', () => {
    for (let a = 0; a < 12; a++) {
      expect(rashiDrishti(a)).toHaveLength(3);
      for (const b of rashiDrishti(a)) expect(rashiDrishti(b)).toContain(a);
    }
  });
  it('planet pairs: dual-sign aspects first, then fixed/movable', () => {
    const got = jaiminiAspects({ Su: Ar, Mo: Le, Ma: Ge, Me: Sg, Ju: Ta, Ve: Ar, Sa: Pi }, ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa']);
    expect(got.map((x) => `${x.a}-${x.b}`)).toEqual(['Ma-Me', 'Ma-Sa', 'Me-Sa', 'Su-Mo', 'Mo-Ve']);
  });
});

describe('argala', () => {
  const s: SignMap = { As: Ar, Su: Ta, Mo: Cn, Ma: Aq, Me: Pi, Ju: Le, Ve: Cp, Sa: Ge, Ra: Pi, Ke: Vi };
  const byPlace = (e: ReturnType<typeof argala>) => Object.fromEntries(e.map((x) => [x.place, [x.argala, x.virodha, x.outcome]]));
  it('from a sign: 2/4/11/5 against 12/10/3/9; nodes as causers counted forward by default', () => {
    expect(byPlace(argala(s, Ar))).toEqual({
      2: [['Su'], ['Me', 'Ra'], 'obstructed'],
      4: [['Mo'], ['Ve'], 'by-strength'],
      11: [['Ma'], ['Sa'], 'by-strength'],
      5: [['Ju'], [], 'unobstructed'],
    });
  });
  it("'reverse-causers': Rahu in the 12th (2nd counted backward) gives 2nd-house argala instead of obstructing it", () => {
    const r = byPlace(argala(s, Ar, { nodes: 'reverse-causers' }));
    expect(r[2]).toEqual([['Su', 'Ra'], ['Me'], 'prevails']);
    // Ketu in Virgo = 8th backward from Aries → neither an argala nor an obstruction place
    expect(Object.values(r).flatMap((x) => [...(x[0] as PlanetId[]), ...(x[1] as PlanetId[])])).not.toContain('Ke');
  });
  it("'reverse-reference' (default): counting from Rahu in Pisces runs backward (2nd = Aquarius)", () => {
    // backward from Pisces: 2nd Aq, 12th Ar, 4th Sg, 10th Ge, 11th Ta, 3rd Cp, 5th Sc, 9th Cn
    expect(byPlace(argala(s, 'Ra'))).toEqual({
      2: [['Ma'], [], 'unobstructed'],
      4: [[], ['Sa'], 'none'],
      11: [['Su'], ['Ve'], 'by-strength'],
      5: [[], ['Mo'], 'none'],
    });
    // forward from Pisces instead ('none'): 2nd Ar, 4th Ge, 11th Cp, 5th Cn
    expect(byPlace(argala(s, 'Ra', { nodes: 'none' }))[4]![0]).toEqual(['Sa']);
  });
  it('from a planet, the planet itself is not counted; empty places give none', () => {
    const r = argala({ Su: Ar, Mo: Ta }, 'Su');
    expect(r.map((x) => x.outcome)).toEqual(['unobstructed', 'none', 'none', 'none']);
    expect(r[0]!.argala).toEqual(['Mo']);
  });
});

describe('special lagnas (pure formulas)', () => {
  it('rates: one hour after sunrise Bhava +15°, Hora +30°, Ghatika +75°; Pranapada 5°/min', () => {
    expect(timeLagnaDeg(100, 60, LAGNA_RATE.bhava)).toBeCloseTo(115, 12);
    expect(timeLagnaDeg(100, 60, LAGNA_RATE.hora)).toBeCloseTo(130, 12);
    expect(timeLagnaDeg(100, 60, LAGNA_RATE.ghatika)).toBeCloseTo(175, 12);
    expect(timeLagnaDeg(350, 24, LAGNA_RATE.ghatika)).toBeCloseTo(20, 12); // one sign per ghati, wraps
    expect(pranapadaDeg(10, 6)).toBeCloseTo(40, 12);                        // 6 min = 1 sign
  });
  it("Pranapada 'bphs' adds 240° (fixed sign) or 120° (dual sign) to the PL tutorial rule", () => {
    expect(pranapadaDeg(5, 2, 'bphs')).toBeCloseTo(15, 12);         // Sun in Aries (movable)
    expect(pranapadaDeg(35, 2, 'bphs')).toBeCloseTo(285, 12);       // Taurus (fixed)
    expect(pranapadaDeg(65, 2, 'bphs')).toBeCloseTo(195, 12);       // Gemini (dual)
    expect(pranapadaDeg(35, 2, 'pl')).toBeCloseTo(45, 12);
  });
  it('Indu: kalas of the 9th lords from lagna and Moon, remainder by 12 counted from the Moon', () => {
    // Aries lagna → 9th Sg → Ju 10; Moon Cancer → 9th Pi → Ju 10; 20 mod 12 = 8 → 8th from Cancer = Aquarius
    expect(induLagnaSign(Ar, Cn)).toBe(Aq);
    // Leo lagna → 9th Ar → Ma 6; Moon Taurus → 9th Cp → Sa 1; 7 → 7th from Taurus = Scorpio
    expect(induLagnaSign(Le, Ta)).toBe(Sc);
    // Cp lagna → 9th Vi → Me 8; Moon Vi → 9th Ta → Ve 12; 20 mod 12 = 8 → 8th from Virgo = Aries
    expect(induLagnaSign(Cp, Vi)).toBe(Ar);
    // remainder 0 counts as 12: Vi lagna and Moon in Vi → 9th Ta → Ve 12 + 12 = 24 → 12th from Virgo = Leo
    expect(induLagnaSign(Vi, Vi)).toBe(Le);
  });
  it('Varnada: both methods on worked cases', () => {
    // Lagna Taurus (even: count 11 back from Pisces), HL Gemini (odd: 3) — BPHS: counts both odd → 14 → 2 → even → back from Pisces 2 = Aquarius
    expect(varnadaSign(Ta, Ge, 'bphs')).toBe(Aq);
    // Raman: signs differ in parity → |11 − 3| = 8; lagna even → 8 back from Pisces = Leo
    expect(varnadaSign(Ta, Ge, 'raman')).toBe(Le);
    // both odd: Aries (1) + Leo (5) = 6 → Raman forward from Aries = Virgo; BPHS even → back = Libra
    expect(varnadaSign(Ar, Le, 'raman')).toBe(Vi);
    expect(varnadaSign(Ar, Le, 'bphs')).toBe(Li);
    // a multiple of 12 counts as 12: Taurus (11) + Aries (1) = 12 → back 12 from Pisces = Aries
    expect(varnadaSign(Ta, Ar, 'bphs')).toBe(Ar);
    expect(varnadas(Ta, Ge)).toHaveLength(12);
    expect(varnadas(Ta, Ge)[0]).toBe(Aq);
  });
  it("under 'bphs' the Varnada is always an odd sign (literal reading of the bundled BPHS)", () => {
    for (let a = 0; a < 12; a++) for (let h = 0; h < 12; h++) expect(varnadaSign(a, h, 'bphs') % 2).toBe(0);
  });
  it('Sri lagna: lagna + 360° × elapsed fraction of the Moon’s nakshatra', () => {
    expect(sriLagnaDeg(10, 40 / 3 / 2)).toBeCloseTo(190, 9);
    expect(sriLagnaDeg(300, 40 / 3 * 5 + 40 / 3 * 0.25)).toBeCloseTo(30, 9);
  });
  it('specialLagnasFrom bundles everything (Varnada from the Hora lagna sign)', () => {
    const r = specialLagnasFrom({ sunAtSunriseDeg: 15, sunAtBirthDeg: 16, ishtaMinutes: 120, ascDeg: 40, moonDeg: 100 });
    // 120 min: Bhava 15 + 30 = 45°, Hora 15 + 60 = 75°, Ghatika 15 + 150 = 165°
    expect([r.bhava.sign, r.hora.sign, r.ghatika.sign]).toEqual([Ta, Ge, Vi]);
    expect(r.hora.lonDeg).toBeCloseTo(75, 9);
    expect(r.varnada).toBe(varnadaSign(Ta, Ge));
    expect(r.indu).toBe(induLagnaSign(Ta, Cn));
    expect(r.pranapada.lon).toBe(Math.round(((16 + 600) % 360) * 3600));
  });
  it('sunrise flags', () => {
    expect(sunriseFlags()).toBe(SE.CALC_RISE | SE.BIT_HINDU_RISING);
    expect(sunriseFlags({ sunrise: 'upper-limb', refraction: true })).toBe(SE.CALC_RISE);
    expect(sunriseFlags({ sunrise: 'centre', refraction: true })).toBe(SE.CALC_RISE | SE.BIT_DISC_CENTER);
    expect(sunriseFlags({ sunrise: 'upper-limb', refraction: false })).toBe(SE.CALC_RISE | SE.BIT_NO_REFRACTION);
  });
});

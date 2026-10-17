/** Pure rules of the strength engine (no ephemeris): spec §1.2, §3, §4 worked rules. */
import { describe, expect, it } from 'vitest';
import { PLANETS, type PlanetId } from '../../src/engine/types';
import { roundHalfEven, sgn, temp, type StrengthContext, type StrengthPoint } from '../../src/engine/strength/common';
import { d2, d3, d7, d9, d12, d30 } from '../../src/engine/strength/vargas';
import { aspectValue } from '../../src/engine/strength/drik';
import { dignity } from '../../src/engine/strength/dignity';
import { baladi, jagradadi } from '../../src/engine/strength/avastha';
import { karakas7 } from '../../src/engine/strength/karakas7';
import { functionalNature } from '../../src/engine/strength/functional';
import { ashtakavarga } from '../../src/engine/strength/ashtakavarga';

/** Synthetic context; unspecified grahas parked at distinct spots. */
function ctx(lons: Partial<Record<StrengthPoint, number>>): StrengthContext {
  const lon = {} as Record<StrengthPoint, number>;
  const speed = {} as Record<PlanetId, number>;
  PLANETS.forEach((p, i) => { lon[p] = lons[p] ?? 3 + 37 * i; speed[p] = 1; });
  lon.As = lons.As ?? 301.95;
  const sign = Object.fromEntries(Object.entries(lon).map(([k, v]) => [k, sgn(v)])) as Record<StrengthPoint, number>;
  return { lon, speed, sign, asc: lon.As, mc: 222.5 };
}

describe('local vargas (STD Parashari)', () => {
  it('hora: odd signs Leo then Cancer, even signs Cancer then Leo', () => {
    expect([d2(10), d2(20), d2(40), d2(50)]).toEqual([4, 3, 3, 4]);
  });
  it('drekkana 1/5/9, saptamsha, navamsha, dwadashamsha', () => {
    expect([d3(5), d3(15), d3(25)]).toEqual([0, 4, 8]);
    expect([d7(0), d7(30)]).toEqual([0, 7]); // Taurus (even) starts from the 7th, Scorpio
    expect([d9(0), d9(30), d9(359.9)]).toEqual([0, 9, 11]);
    expect([d12(0), d12(29.9)]).toEqual([0, 11]);
  });
  it('trimshamsha: odd Ar Aq Sg Ge Li, even Ta Vi Pi Cp Sc', () => {
    expect([3, 7, 15, 22, 27].map(d30)).toEqual([0, 10, 8, 2, 6]);
    expect([33, 40, 48, 54, 59].map(d30)).toEqual([1, 5, 11, 9, 7]);
  });
});

describe('aspect curve (BIN 0x404f64)', () => {
  it('full aspects are 60: standard 7th, Mars 4/7/8, Jupiter 5/7/9, Saturn 3/7/10', () => {
    expect(aspectValue(180, 1)).toBe(60);
    expect([aspectValue(90, 3), aspectValue(180, 3), aspectValue(210, 3)]).toEqual([60, 60, 60]);
    expect([aspectValue(120, 5), aspectValue(180, 5), aspectValue(240, 5)]).toEqual([60, 60, 60]);
    expect([aspectValue(60, 7), aspectValue(180, 7), aspectValue(270, 7)]).toEqual([60, 60, 60]);
  });
  it('sectors 0 and 10–11 are zero', () => {
    expect([aspectValue(10, 1), aspectValue(310, 1), aspectValue(350, 5)]).toEqual([0, 0, 0]);
  });
});

describe('dignity precedence (§3.1)', () => {
  it('Mercury in Virgo: Exalt. below 15°, Moolt. 15–20°, Own above 20°', () => {
    expect([dignity(ctx({ Me: 160 }), 'Me'), dignity(ctx({ Me: 167 }), 'Me'), dignity(ctx({ Me: 173.66 }), 'Me')])
      .toEqual(['EX', 'MT', 'OWN']);
  });
  it('Moon in Taurus: Exalt. up to 3°, Moolt. above', () => {
    expect([dignity(ctx({ Mo: 32 }), 'Mo'), dignity(ctx({ Mo: 40 }), 'Mo')]).toEqual(['EX', 'MT']);
  });
  it('debilitation before MT/own; Venus in Virgo is Debil.', () => {
    expect(dignity(ctx({ Ve: 165 }), 'Ve')).toBe('DB');
  });
  it('temporal relation: 2,3,4,10,11,12 from the planet are friends', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => temp(0, h - 1))).toEqual([-1, 1, 1, 1, -1, -1, -1, -1, -1, 1, 1, 1]);
  });
});

describe('avasthas, karakas, natures', () => {
  it('Baladi in PL label order: odd sign Infant→Dead, even sign Dead→Infant', () => {
    expect([1, 7, 13, 19, 25].map((d) => baladi(ctx({ Su: d }), 'Su'))).toEqual(['Infant', 'Youth.', 'Adoles.', 'Old', 'Dead']);
    expect([31, 37, 43, 49, 55].map((d) => baladi(ctx({ Su: d }), 'Su'))).toEqual(['Dead', 'Old', 'Adoles.', 'Youth.', 'Infant']);
  });
  it('Jagradadi uses the NATURAL relation: Sun in Virgo (Mercury neutral) is Dream', () => {
    expect(jagradadi(ctx({ Su: 174 }), 'Su')).toBe('Drm.');
    expect(jagradadi(ctx({ Su: 10 }), 'Su')).toBe('Alr.'); // exaltation sign
    expect(jagradadi(ctx({ Su: 190 }), 'Su')).toBe('Slp.'); // debilitation sign
  });
  it('K7 sorts Su–Sa by degree in sign, descending', () => {
    const k = karakas7(ctx({ Su: 29, Mo: 28, Ma: 27, Me: 26, Ju: 25, Ve: 24, Sa: 23 }));
    expect(['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa'].map((p) => k[p as 'Su'])).toEqual(['AK', 'AmK', 'BK', 'MK', 'PiK', 'GK', 'DK']);
  });
  it('nodes take the dispositor\'s functional nature (§3.9, OPEN candidate)', () => {
    const c = ctx({ As: 301.95, Ra: 130.4, Ke: 310.4 }); // Aquarius rising; Ra in Leo, Ke in Aquarius
    expect([functionalNature(c, 'Ra'), functionalNature(c, 'Ke')]).toEqual(['Neutral', 'Benefic']);
  });
  it('BAV totals are fixed (48 49 39 54 56 52 39, SAV 337) for any chart', () => {
    const a = ashtakavarga(ctx({}));
    expect((['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa'] as const).map((p) => a.bav[p].reduce((x, y) => x + y, 0))).toEqual([48, 49, 39, 54, 56, 52, 39]);
    expect(a.sav.reduce((x, y) => x + y, 0)).toBe(337);
  });
  it('VB display rounding follows the oracle (half to even)', () => {
    expect([roundHalfEven(12.5), roundHalfEven(13.5), roundHalfEven(11.05), roundHalfEven(12.75)]).toEqual([12, 14, 11, 13]);
  });
});

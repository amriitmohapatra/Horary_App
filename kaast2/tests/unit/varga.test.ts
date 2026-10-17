/**
 * Slice 3 — divisional charts. Evidence:
 *  (a) the PL7 report's decoded "first amsa per sign" tables (features.tex,
 *      table tab:vargas; scripts/pl7_vargas.py) and a literal float port of all
 *      31 PL7.exe varga routines (oracle/vargas_pl7_bin.py → varga_pl7_bin.json);
 *  (b) integer boundaries: first and last arcsecond of every amsa of every sign;
 *  (c) PL7 report §13 test 4 (Taurus 1°: D11 Pisces, D11-alt Aries);
 *  (d) PyJHora 4.8.7 as an independent implementation (oracle/vargas_pyjhora.py).
 */
import { describe, expect, it } from 'vitest';
import bin from '../fixtures/varga_pl7_bin.json';
import pyj from '../fixtures/varga_pyjhora.json';
import { navamshaSign } from '../../src/engine/varga/cyclic';
import { amsaIndex } from '../../src/engine/varga/signDependent';
import { VARGAS, vargaDef, vargaGroups, vargaSign, type VargaId } from '../../src/engine/varga/rules';
import { SIGN, SIGNS } from '../../src/engine/zodiac';

const S = (list: string): number[] => list.split(' ').map((s) => SIGNS.indexOf(s as (typeof SIGNS)[number]));
const DEG = 3600;
const PL_IDS = VARGAS.filter((v) => v.position > 0);

describe('registry', () => {
  it('has the 31 PL positions plus D11-iyer, unique ids', () => {
    expect(VARGAS).toHaveLength(32);
    expect(new Set(VARGAS.map((v) => v.id)).size).toBe(32);
    expect(PL_IDS.map((v) => v.position)).toEqual(Array.from({ length: 31 }, (_, i) => i + 1));
  });
  it('divisors equal the PL7 byte table at 0x5f47b8', () => {
    expect(PL_IDS.map((v) => v.divisor)).toEqual(
      [1, 2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60, 5, 6, 8, 11, 150, 2, 2, 3, 4, 10, 12, 30, 5, 16, 11]);
  });
  it('every PL position is BIN with a routine address; D11-iyer is an OPEN placeholder', () => {
    for (const v of PL_IDS) {
      expect(v.grade, v.id).toBe('BIN');
      expect(v.note, v.id).toMatch(/fcn\.0057d[0-9a-f]{3}/);
    }
    const iyer = vargaDef('D11-iyer');
    expect(iyer.grade).toBe('OPEN');
    expect(iyer.note).toMatch(/PLACEHOLDER/);
    for (let a = 0; a < 1_296_000; a += 997) expect(iyer.sign(a)).toBe(vargaSign('D11-alt', a));
  });
  it('the Page 1 navamsha is the registry D9', () => {
    for (let a = 0; a < 1_296_000; a += 541) expect(navamshaSign(a)).toBe(vargaSign('D9', a));
  });
  it('unknown id throws', () => expect(() => vargaDef('D99' as VargaId)).toThrow());
});

describe('(a) PL7 report tables, first amsa per sign (Ar … Pi)', () => {
  // features.tex, table tab:vargas, column "Start"
  const report: Partial<Record<VargaId, string>> = {
    D9: 'Ar Cp Li Cn Ar Cp Li Cn Ar Cp Li Cn',
    D10: 'Ar Cp Ge Pi Le Ta Li Cn Sg Vi Aq Sc',
    D24: 'Le Cn Le Cn Le Cn Le Cn Le Cn Le Cn',
    D6: 'Ar Li Ar Li Ar Li Ar Li Ar Li Ar Li',
    D8: 'Ar Sg Le Ar Sg Le Ar Sg Le Ar Sg Le',
    D11: 'Ar Pi Aq Cp Sg Sc Li Vi Le Cn Ge Ta',
    'D11-alt': 'Ar Ar Ar Ar Ar Ar Ar Ar Ar Ar Ar Ar',
  };
  const first = (id: VargaId) => Array.from({ length: 12 }, (_, s) => vargaSign(id, s * SIGN + 36)); // d = 0.01°
  it.each(Object.entries(report))('%s: %s', (id, want) => expect(first(id as VargaId)).toEqual(S(want)));
  it('D16-alt: Ar Le Ge Li Le Sg … (report prints six)', () => expect(first('D16-alt').slice(0, 6)).toEqual(S('Ar Le Ge Li Le Sg')));
  it('D11-alt: the 2nd amsa is Pisces for every sign', () => {
    for (let s = 0; s < 12; s++) expect(vargaSign('D11-alt', s * SIGN + Math.ceil(SIGN / 11) + 36)).toBe(11);
  });
  it.each(Object.entries(bin.reportFirstAmsa))('%s equals scripts/pl7_vargas.py', (id, want) =>
    expect(first(id as VargaId)).toEqual(want));
});

describe('(a) every PL position against the literal port of its PL7.exe routine', () => {
  it.each(bin.positions.map((p) => [p.id, p.routine, p] as const))('%s (%s): amsa table and 500 longitudes', (id, _r, p) => {
    const def = vargaDef(id as VargaId);
    expect(def.position).toBe(p.position);
    expect(def.divisor).toBe(p.divisor);
    for (let s = 0; s < 12; s++) {
      const got = Array.from({ length: p.divisor }, (_, k) => def.sign(s * SIGN + Math.floor(((2 * k + 1) * SIGN) / (2 * p.divisor))));
      expect(got, `${id} sign ${SIGNS[s]}`).toEqual(p.amsaTable[s]);
    }
    expect(bin.longitudes.map((a) => def.sign(a))).toEqual(p.signs);
  });
});

describe('(b) boundaries: first and last arcsecond of each amsa', () => {
  // Expected signs come from the routine port (amsa midpoints). D30 is sampled per degree,
  // which also covers its unequal parts (whole-degree limits).
  it.each(bin.positions.map((p) => [p.id, p] as const))('%s', (id, p) => {
    const def = vargaDef(id as VargaId);
    const n = p.divisor;
    for (let s = 0; s < 12; s++) {
      for (let k = 0; k < n; k++) {
        const from = s * SIGN + Math.ceil((k * SIGN) / n);
        const last = s * SIGN + Math.ceil(((k + 1) * SIGN) / n) - 1;
        const want = p.amsaTable[s]![k];
        expect(def.sign(from), `${id} ${SIGNS[s]} amsa ${k} first`).toBe(want);
        expect(def.sign(last), `${id} ${SIGNS[s]} amsa ${k} last`).toBe(want);
      }
    }
  });
  it('amsaIndex is half-open: k·30°/n belongs to amsa k', () => {
    expect(amsaIndex(6750, 16)).toBe(1);
    expect(amsaIndex(6749, 16)).toBe(0);
    expect(amsaIndex(9818, 11)).toBe(0); // 30°/11 = 9818.18″
    expect(amsaIndex(9819, 11)).toBe(1);
    expect(amsaIndex(SIGN - 1, 150)).toBe(149);
  });
  it('0° Aries: first amsa of Aries', () => {
    const want: Record<VargaId, number> = {
      D1: 0, D2: 4, D3: 0, D4: 0, D5: 0, D6: 0, D7: 0, D8: 0, D9: 0, D10: 0, D11: 0, D12: 0, D16: 0, D20: 0,
      D24: 4, D27: 0, D30: 0, D40: 0, D45: 0, D60: 0, D150: 0, 'D2-alt1': 0, 'D2-alt2': 6, 'D3-alt': 0,
      'D4-alt': 0, 'D10-alt': 0, 'D12-alt': 0, 'D30-alt': 0, 'D5-alt': 0, 'D16-alt': 0, 'D11-alt': 0, 'D11-iyer': 0,
    };
    for (const v of VARGAS) expect(v.sign(0), v.id).toBe(want[v.id]);
  });
  // Pisces is even and dual: D8 Le+7 = Pi, D10 Sc+9 = Le, D40 Li+39 = Cp, D45 Sg+44 = Le.
  it("359°59′59″: last amsa of Pisces", () => {
    const want: Record<VargaId, number> = {
      D1: 11, D2: 4, D3: 7, D4: 8, D5: 7, D6: 11, D7: 11, D8: 11, D9: 11, D10: 4, D11: 11, D12: 10, D16: 11,
      D20: 11, D24: 2, D27: 11, D30: 7, D40: 9, D45: 4, D60: 10, D150: 11, 'D2-alt1': 11, 'D2-alt2': 5,
      'D3-alt': 11, 'D4-alt': 11, 'D10-alt': 11, 'D12-alt': 11, 'D30-alt': 11, 'D5-alt': 11, 'D16-alt': 11,
      'D11-alt': 2, 'D11-iyer': 2,
    };
    for (const v of VARGAS) expect(v.sign(1_295_999), v.id).toBe(want[v.id]);
  });
  it('D30 unequal parts, exact limits (odd: 5 10 18 25; even: 5 12 20 25)', () => {
    const odd = [[0, 0], [5, 10], [10, 8], [18, 2], [25, 6]] as const;
    const even = [[0, 1], [5, 5], [12, 11], [20, 9], [25, 7]] as const;
    for (const [s, parts] of [[0, odd], [1, even], [10, odd], [11, even]] as const) {
      parts.forEach(([deg, sign], i) => {
        expect(vargaSign('D30', s * SIGN + deg * DEG)).toBe(sign);
        if (i > 0) expect(vargaSign('D30', s * SIGN + deg * DEG - 1)).toBe(parts[i - 1]![1]);
      });
    }
  });
  it('backward rules: the boundary arcsecond starts the next amsa (rasi-direction half-open)', () => {
    expect(vargaSign('D11-alt', SIGN)).toBe(0); // 0° Taurus: Aries (PL float formula would give 30.0° = Taurus)
    expect(vargaSign('D16-alt', SIGN)).toBe(4); // Taurus starts at Leo
    expect(vargaSign('D16-alt', SIGN + 6750)).toBe(3); // 1°52′30″ Taurus: 2nd amsa, Cancer
    expect(vargaSign('D16-alt', SIGN + 6749)).toBe(4);
  });
  it('D2 at exactly 15° of an odd sign is Cancer (PL7 float quirk would give Virgo; not reproduced)', () => {
    expect(vargaSign('D2', 15 * DEG)).toBe(3);
    expect(vargaSign('D2', 15 * DEG - 1)).toBe(4);
  });
});

describe('(c) PL7 report §13 test 4', () => {
  it('planet at Taurus 1°: D11 Pisces, D11-alt Aries', () => {
    expect(vargaSign('D11', SIGN + DEG)).toBe(11);
    expect(vargaSign('D11-alt', SIGN + DEG)).toBe(0);
  });
});

describe('(d) PyJHora cross-check (500 longitudes)', () => {
  it('both fixtures use the same longitudes', () => expect(pyj.longitudes).toEqual(bin.longitudes));
  const methods = pyj.methods as Record<string, { function: string; label: string; pyjhoraDefault: boolean; signs: number[] }>;
  /** KAAST varga → the PyJHora method it must equal (null: PyJHora has no such rule). */
  const MATCH: Record<Exclude<VargaId, 'D1' | 'D11-iyer'>, string | null> = {
    D2: 'D2/2', D3: 'D3/1', D4: 'D4/1', D7: 'D7/1', D9: 'D9/1', D10: 'D10/1', D12: 'D12/1', D16: 'D16/1',
    D20: 'D20/1', D24: 'D24/1', D27: 'D27/1', D30: 'D30/1', D40: 'D40/1', D45: 'D45/1', D60: 'D60/1',
    D5: 'D5/1', D6: 'D6/1', D8: 'D8/1', D11: 'D11/1', D150: 'D150/1',
    'D2-alt1': 'D2/4', 'D3-alt': 'D3/2', 'D4-alt': 'D4/2', 'D10-alt': 'D10/4', 'D12-alt': 'D12/3',
    'D30-alt': 'D30/2', 'D5-alt': 'D5/2',
    'D2-alt2': null, 'D16-alt': null, 'D11-alt': null,
  };
  const ours = (id: VargaId) => pyj.longitudes.map((a) => vargaSign(id, a));
  it.each(Object.entries(MATCH).filter(([, k]) => k))('%s = PyJHora %s', (id, key) => {
    expect(ours(id as VargaId)).toEqual(methods[key!]!.signs);
  });
  it.each(Object.entries(MATCH).filter(([, k]) => !k))('%s has no PyJHora equivalent (PL-specific rule)', (id) => {
    const n = vargaDef(id as VargaId).divisor;
    const mine = ours(id as VargaId);
    for (const [key, m] of Object.entries(methods)) {
      if (key.startsWith(`D${n}/`)) expect(m.signs, key).not.toEqual(mine);
    }
  });
  it('the cyclic alternates also equal PyJHora custom_divisional_chart (cyclic)', () => {
    for (const id of ['D2-alt1', 'D3-alt', 'D4-alt', 'D10-alt', 'D12-alt', 'D30-alt', 'D5-alt', 'D150'] as const) {
      expect(ours(id), id).toEqual(methods[`D${vargaDef(id).divisor}/custom-cyclic`]!.signs);
    }
  });
  it("D2: PyJHora's default method (1, Uma Shambhu parivritti) is NOT PL's Parashari hora", () => {
    expect(methods['D2/1']!.pyjhoraDefault).toBe(true);
    expect(ours('D2')).not.toEqual(methods['D2/1']!.signs);
  });
});

describe('vargaGroups', () => {
  it('groups by varga sign, ascendant first, planets in Su … Ke order, missing points skipped', () => {
    const g = vargaGroups('D9', { Mo: 0, As: 3 * DEG, Su: 2 * DEG, Ke: 3 * DEG + 19 * 60, Ma: 45 * DEG, Ju: 3 * DEG + 20 * 60 });
    expect(g[0]).toEqual(['As', 'Su', 'Mo', 'Ke']);
    expect(g[1]).toEqual(['Ma', 'Ju']); // 45° → 405° → Taurus; 3°20′ starts the 2nd navamsa (Taurus)
    expect(g.flat()).toHaveLength(6);
    expect(g).toHaveLength(12);
  });
});

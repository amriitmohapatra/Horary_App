/**
 * Jaimini artefacts on real charts:
 *  - the PL 9 Page 1 "K7" column (Amitabh Bachchan) — PL output, must match;
 *  - PL7 manual p. 130 export (Prince Charles): Pranapada printed by PL7,
 *    which pins the sunrise convention;
 *  - PyJHora 4.8.7 cross-check (fixtures/jaimini_pyjhora.json, written by
 *    oracle/jaimini_pyjhora.py) on PyJHora's own longitudes, so rules are
 *    compared, not ephemerides. Every disagreement is listed in KNOWN below.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import page1 from '../fixtures/pl9_page1_amitabh.json';
import pyj from '../fixtures/jaimini_pyjhora.json';
import { bootNode } from './boot';
import { cast, type ChartInput, type ChartResult, type PlanetId, type PointId } from '../../src/engine';
import type { SwissEph } from '../../src/engine/ephem/swisseph';
import { navamshaSign } from '../../src/engine/varga/cyclic';
import { SIGN, norm, toArcsec } from '../../src/engine/zodiac';
import { julianDay } from '../../src/engine/time/julian';
import {
  argala, arudhaPadas, charaKarakas, karakamsha, rashiDrishti, signMapOf, specialLagnas, specialLagnasFrom,
  sunriseBefore, varnadaSign, induLagnaSign, type SignMap,
} from '../../src/engine/jaimini';

const IDS = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'] as const;
const SIGNS = ['Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];
const sn = (s: number) => SIGNS[s]!;

/** D10 Dashamsha (BPHS; PL7 BIN per varga/signDependent.ts): odd signs from the sign, even from the 9th. */
const d10 = (a: number) => { const s = Math.floor(norm(a) / SIGN); const k = Math.floor(((norm(a) % SIGN) * 10) / SIGN); return (s + (s % 2 === 0 ? 0 : 8) + k) % 12; };

const amitabhInput: ChartInput = {
  name: 'Amitabh Bachchan', date: { y: 1942, m: 10, d: 11 }, time: { h: 16, mi: 0, s: 0 },
  tzHours: 6.5, dstHours: 0, place: { name: 'Allahabad', latDeg: 25.45, lonDeg: 81.85 }, profileId: 'pl9',
};
// PL7 manual p. 130: "Prince Charles ... 14:11:1948 21:15:00 ... 0 (timezone) ... 0.833333333333 (W) 51.51666666666"
const charlesInput: ChartInput = {
  name: 'Prince Charles', date: { y: 1948, m: 11, d: 14 }, time: { h: 21, mi: 15, s: 0 },
  tzHours: 0, dstHours: 0, place: { name: 'London', latDeg: 51.516666666666, lonDeg: -0.833333333333 }, profileId: 'pl7',
};
const PL7_EXPORT = { Su: 209.2833235376, Asc: 101.9591926519, pranapada: 35.68828913205 };

let swe: SwissEph;
let amitabh: ChartResult;
let charles: ChartResult;
beforeAll(async () => {
  swe = await bootNode();
  amitabh = cast(swe, amitabhInput);
  charles = cast(swe, charlesInput);
});

const d1Signs = (c: ChartResult): SignMap => signMapOf({ As: c.asc.lon, ...Object.fromEntries(IDS.map((p) => [p, c.bodies[p].lon])) });
const vargaSigns = (c: ChartResult, f: (a: number) => number): SignMap =>
  ({ As: f(c.asc.lon), ...Object.fromEntries(IDS.map((p) => [p, f(c.bodies[p].lon)])) });

describe('Chara karakas — PL 9 Page 1 (Amitabh Bachchan)', () => {
  it('7-karaka scheme reproduces the K7 column 7/7', () => {
    const st = page1.strength_table as unknown as Record<string, unknown[]>;
    const want = Object.fromEntries((['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa'] as const).map((p) => [p, st[p]![7]]));
    const got = Object.fromEntries(charaKarakas(amitabh.bodies, 7).map((e) => [e.planet, e.karaka]));
    expect(got).toEqual(want);
  });
  it('8-karaka scheme: Rahu (30° − 10°25′ = 19°35′) becomes MK', () => {
    expect(charaKarakas(amitabh.bodies, 8).map((e) => `${e.karaka}=${e.planet}`).join(' '))
      .toBe('AK=Su AmK=Me BK=Ma MK=Ra PiK=Sa PK=Ve GK=Mo DK=Ju');
  });
  it('karakamsha: AK Sun in navamsha Leo (the fixture shows Su in D9 sign 5)', () => {
    expect(karakamsha(amitabh.bodies, 7)).toEqual({ ak: 'Su', sign: 4 });
    expect(page1.navamsa_signs.Su).toBe(5);
  });
});

describe('Arudha padas — Amitabh Bachchan', () => {
  it('D1, BPHS variant (worked values)', () => {
    const r = arudhaPadas(d1Signs(amitabh), signMapOf({ As: amitabh.asc.lon }).As!);
    expect(r.padas.map(sn).join(' ')).toBe('Ta Sc Aq Cp Vi Li Li Ge Le Cn Aq Vi');
    expect(sn(r.upapada)).toBe('Vi');
  });
  it('the tutorial variant gives the same signs here: no house lord sits in the 7th from its house', () => {
    const s = d1Signs(amitabh);
    // lords from their houses (Aq…Cp): Sa 4th, Ju 5th, Ma 6th, Ve 5th, Me 4th, Mo 4th, Su 2nd, Me 1st, Ve 12th, Ma 11th, Ju 8th, Sa 5th
    expect(arudhaPadas(s, s.As!, { variant: 'tutorial' }).padas).toEqual(arudhaPadas(s, s.As!).padas);
    expect(arudhaPadas(s, s.As!, { coLords: 'stronger' }).padas).toEqual(arudhaPadas(s, s.As!).padas);
  });
  it('D9 and D10 padas (worked values)', () => {
    const n9 = vargaSigns(amitabh, navamshaSign), n10 = vargaSigns(amitabh, d10);
    expect(arudhaPadas(n9, n9.As!).padas.map(sn).join(' ')).toMatchInlineSnapshot(`"Sg Pi Aq Sc Li Sc Cn Aq Li Ar Ta Cn"`);
    expect(arudhaPadas(n10, n10.As!).padas.map(sn).join(' ')).toMatchInlineSnapshot(`"Sg Sg Le Pi Pi Ar Ge Sg Cn Cp Pi Li"`);
  });
});

describe('Special lagnas', () => {
  it('Prince Charles (PL7 export): our pl7 cast reproduces the exported Sun and Asc', () => {
    expect(Math.abs(charles.bodies.Su.lonDeg - PL7_EXPORT.Su) * 3600).toBeLessThan(2);
    expect(Math.abs(charles.asc.lonDeg - PL7_EXPORT.Asc) * 3600).toBeLessThan(30);
  });
  it('Pranapada = Sun + 5°/min of ishtakala with a disc-centre, no-refraction sunrise matches PL7 to 0.05°', () => {
    const sl = specialLagnas(swe, charles);
    expect(Math.abs(sl.pranapada.lonDeg - PL7_EXPORT.pranapada)).toBeLessThan(0.05);
  });
  it.each([
    ['upper-limb', true], ['upper-limb', false], ['centre', true],
  ] as const)('sunrise %s, refraction %s misses PL7 by more than 9°', (sunrise, refraction) => {
    const sl = specialLagnas(swe, charles, { sunrise, refraction });
    const d = Math.abs(((sl.pranapada.lonDeg - PL7_EXPORT.pranapada + 540) % 360) - 180);
    expect(d).toBeGreaterThan(9);
  });
  it('Amitabh Bachchan: worked values', () => {
    const sl = specialLagnas(swe, amitabh);
    const f = (p: { lon: number }) => { const a = p.lon; return `${sn(Math.floor(a / SIGN))} ${Math.floor((a % SIGN) / 3600)}°${String(Math.floor((a % 3600) / 60)).padStart(2, '0')}′`; };
    expect({
      ishtaMinutes: Math.round(sl.ishtaMinutes * 100) / 100,
      bhava: f(sl.bhava), hora: f(sl.hora), ghatika: f(sl.ghatika), pranapada: f(sl.pranapada), sri: f(sl.sri),
      varnada: sn(sl.varnada), indu: sn(sl.indu),
    }).toMatchInlineSnapshot(`
      {
        "bhava": "Aq 8°23′",
        "ghatika": "Le 5°55′",
        "hora": "Ge 22°46′",
        "indu": "Ta",
        "ishtaMinutes": 537.54,
        "pranapada": "Pi 12°03′",
        "sri": "Ta 10°30′",
        "varnada": "Aq",
      }
    `);
  });
  it('sunriseBefore: a birth before sunrise counts from the previous day', () => {
    const jd = amitabh.moment.jdUT;
    const today = sunriseBefore(swe, jd, 81.85, 25.45)!;
    expect(jd - today).toBeGreaterThan(0);
    expect(jd - today).toBeLessThan(1);
    const early = sunriseBefore(swe, today - 0.01, 81.85, 25.45)!;
    expect(today - early).toBeGreaterThan(0.99);
    expect(today - early).toBeLessThan(1.01);
  });
});

// ---------------------------------------------------------------- PyJHora cross-check
type PyChart = (typeof pyj.charts)[number];
const PTS: PointId[] = ['As', ...IDS];
const lonsOf = (pp: number[]) => Object.fromEntries(PTS.map((p, i) => [p, toArcsec(pp[i]!, 'round')])) as Record<PointId, number>;

function compareChart(name: string, r: Pick<PyChart, 'pp' | 'karakas8' | 'arudha_single' | 'arudha_stronger' | 'argala' | 'virodha'>): string[] {
  const out: string[] = [];
  const lons = lonsOf(r.pp);
  const signs = signMapOf(lons);
  const bodies = Object.fromEntries(IDS.map((p) => [p, { lon: lons[p] }])) as Record<PlanetId, { lon: number }>;
  const k8 = charaKarakas(bodies, 8, 'natural-order').map((e) => e.planet);
  if (k8.join() !== r.karakas8.join()) out.push(`${name}: karakas8 ${k8.join()} vs ${r.karakas8.join()}`);
  const single = arudhaPadas(signs, signs.As!).padas;
  if (single.join() !== r.arudha_single.join()) out.push(`${name}: arudha(single) ${single.map(sn)} vs ${r.arudha_single.map(sn)}`);
  const lonOf = Object.fromEntries(IDS.map((p) => [p, lons[p]]));
  const strong = arudhaPadas(signs, signs.As!, { coLords: 'stronger', lonOf }).padas;
  if (strong.join() !== r.arudha_stronger.join()) out.push(`${name}: arudha(stronger) ${strong.map(sn)} vs ${r.arudha_stronger.map(sn)}`);
  // PyJHora places [2, 4, 5, 11] / [12, 10, 9, 3]; ours [2, 4, 11, 5] / [12, 10, 3, 9]; no node reversal there.
  const reorder = [0, 1, 3, 2];
  for (let h = 0; h < 12; h++) {
    const ours = argala(signs, (signs.As! + h) % 12, { nodes: 'none' });
    reorder.forEach((oi, pi) => {
      const a = [...ours[oi]!.argala].sort().join(), b = [...r.argala[h]![pi]!].sort().join();
      const v = [...ours[oi]!.virodha].sort().join(), w = [...r.virodha[h]![pi]!].sort().join();
      if (a !== b || v !== w) out.push(`${name}: argala house ${h + 1} place ${ours[oi]!.place}: ${a}|${v} vs ${b}|${w}`);
    });
  }
  return out;
}

function compareSpecial(c: PyChart): string[] {
  const out: string[] = [];
  const s = c.special;
  const lons = lonsOf(c.pp);
  const name = c.input.name;
  const near = (a: number, b: number, tol: number) => Math.abs(((a - b + 540) % 360) - 180) <= tol;
  const base = { sunAtSunriseDeg: s.sun_at_sunrise, sunAtBirthDeg: c.pp[1]!, ascDeg: c.pp[0]!, moonDeg: c.pp[2]! };
  // Bhava/Hora/Ghati: PyJHora uses the same-day sunrise (negative ishtakala before sunrise).
  const t = specialLagnasFrom({ ...base, ishtaMinutes: s.time_diff_minutes });
  if (!near(t.bhava.lonDeg, s.bhava, 1e-6)) out.push(`${name}: bhava ${t.bhava.lonDeg} vs ${s.bhava}`);
  if (!near(t.hora.lonDeg, s.hora, 1e-6)) out.push(`${name}: hora ${t.hora.lonDeg} vs ${s.hora}`);
  if (!near(t.ghatika.lonDeg, s.ghati, 1e-6)) out.push(`${name}: ghati ${t.ghatika.lonDeg} vs ${s.ghati}`);
  // Pranapada: PyJHora's ishtakala in ghatis (whole seconds), previous sunrise if before sunrise.
  const p = specialLagnasFrom({ ...base, ishtaMinutes: s.udhayadhi_ghatis * 24 }, { pranapada: 'bphs' });
  if (!near(p.pranapada.lonDeg, s.pranapada, 1e-6)) out.push(`${name}: pranapada(bphs) ${p.pranapada.lonDeg.toFixed(4)} vs ${s.pranapada.toFixed(4)}`);
  if (!near(t.sri.lonDeg, s.sree, 1e-6)) out.push(`${name}: sree ${t.sri.lonDeg} vs ${s.sree}`);
  const asc = Math.floor(lons.As / SIGN), moon = Math.floor(lons.Mo / SIGN);
  if (induLagnaSign(asc, moon) !== s.indu_sign) out.push(`${name}: indu ${sn(induLagnaSign(asc, moon))} vs ${sn(s.indu_sign)}`);
  const hl = Math.floor(s.hora / 30);
  if (varnadaSign(asc, hl, 'raman') !== s.varnada_m1_sign) out.push(`${name}: varnada(raman) ${sn(varnadaSign(asc, hl, 'raman'))} vs ${sn(s.varnada_m1_sign)}`);
  if (varnadaSign(asc, hl, 'bphs') !== s.varnada_m2_sign) out.push(`${name}: varnada(bphs) ${sn(varnadaSign(asc, hl, 'bphs'))} vs ${sn(s.varnada_m2_sign)}`);
  return out;
}

/**
 * Every KAAST ↔ PyJHora disagreement on identical inputs. All three are in the
 * optional 'stronger' co-lord rule for Scorpio/Aquarius and come from PyJHora
 * quirks (arudha.ts header): synthetic-16 and karaka-tie — PyJHora counts the
 * lagna as a planet sharing Mars's (resp. Ketu's) sign in rule 1;
 * synthetic-26 — PyJHora's rule 2 compares the dispositor's planet id with a
 * sign index, so Saturn in its own Capricorn gets no dispositor credit and
 * Rahu wins on rule 4.
 */
const KNOWN: string[] = [
  'synthetic-16: arudha(stronger) Sg,Cn,Sg,Cn,Ar,Li,Sc,Cp,Aq,Pi,Li,Vi vs Sg,Cn,Sg,Cn,Ar,Li,Sc,Cp,Aq,Aq,Li,Vi',
  'synthetic-26: arudha(stronger) Ge,Ge,Aq,Ar,Li,Sg,Cp,Sg,Le,Vi,Pi,Li vs Ge,Ge,Aq,Ar,Li,Li,Cp,Sg,Le,Vi,Pi,Li',
  'karaka-tie: arudha(stronger) Pi,Sg,Ge,Aq,Cp,Le,Pi,Sg,Ta,Le,Cn,Vi vs Pi,Sg,Ge,Aq,Pi,Le,Pi,Sg,Ta,Le,Cn,Vi',
];

describe('PyJHora 4.8.7 cross-check (same longitudes)', () => {
  it('PyJHora takes the Sun at sunrise + the time zone (drik.special_ascendant: srise[2] + tz/24): its Bhava/Hora/Ghati lagnas are off by that Sun motion', () => {
    for (const c of pyj.charts) {
      const shift = ((c.special.sun_at_sunrise - c.special.sun_at_sunrise_unshifted + 540) % 360) - 180;
      // Sun ≈ 0.95…1.02°/day; zero zone → identical
      expect([c.input.name, Math.abs(shift - (c.input.tz / 24) * 0.985) < 0.04 * Math.abs(c.input.tz / 24) + 1e-9]).toEqual([c.input.name, true]);
    }
  });
  it('our sunrise (disc centre, no refraction) equals PyJHora\'s (BIT_HINDU_RISING too) within 2 s', () => {
    for (const c of pyj.charts) {
      const [y, m, d] = c.input.date as [number, number, number];
      const [h, mi, s] = c.input.time as [number, number, number];
      // PyJHora takes the sunrise of the civil date; ours is the last sunrise before an instant:
      // ask for the last one before the end of that civil day.
      const midnightLocal = Math.floor(julianDay(y, m, d, h + mi / 60 + s / 3600) + 0.5) - 0.5;
      const endOfDayUT = midnightLocal + 1 - c.input.tz / 24 - 1e-9;
      const sr = sunriseBefore(swe, endOfDayUT, c.input.lon, c.input.lat)!;
      const localHours = (sr + c.input.tz / 24 - midnightLocal) * 24;
      expect([c.input.name, Math.abs(localHours - c.special.sunrise_local_hours) * 3600 < 2]).toEqual([c.input.name, true]);
    }
  });
  it('rashi drishti table is identical', () => {
    for (let s = 0; s < 12; s++) expect(rashiDrishti(s)).toEqual((pyj.raasi_drishti as Record<string, number[]>)[String(s)]);
  });
  it(`${pyj.charts.length} charts + ${Object.keys(pyj.crafted).length} crafted sets: only the known disagreements`, () => {
    const found = [
      ...pyj.charts.flatMap((c) => [...compareChart(c.input.name, c), ...compareSpecial(c)]),
      ...Object.entries(pyj.crafted).flatMap(([n, r]) => compareChart(n, r)),
    ];
    expect(found).toEqual(KNOWN);
  });
});

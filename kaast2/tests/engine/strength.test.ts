/**
 * Strength engine (src/engine/strength) against
 *  1. the boss's PL9 Page 1 screenshot (fixtures/pl9_page1_amitabh.json): every strength
 *     field at the screenshot's display precision;
 *  2. the Python oracle (oracle/strengths_fixtures.py → fixtures/strengths_oracle.json) on
 *     the fixture chart and six synthetic day-birth charts: TS = Python, shadbala and
 *     bhava components ±0.05 virupa, discrete fields exactly.
 * OPEN items (Ketu VB §3.4, Rahu AV §3.5) are asserted as "equals the oracle's current
 * rule", not as PL truth.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import fixture from '../fixtures/pl9_page1_amitabh.json';
import oracle from '../fixtures/strengths_oracle.json';
import { bootNode } from './boot';
import { cast, PLANETS, type ChartInput, type ChartResult, type PlanetId } from '../../src/engine';
import type { SwissEph } from '../../src/engine/ephem/swisseph';
import { strengths, type Page1Strengths } from '../../src/engine/strength';
import type { Graha7 } from '../../src/engine/strength/common';

type Row = [string, number | null, number | null, number, number | null, string, string, string | null, string];
const table = fixture.strength_table as unknown as Record<PlanetId, Row>;
const G7: readonly Graha7[] = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa'];
const round2 = (x: number) => Math.round(x * 100) / 100;

interface OracleInput { date: string; time: string; tzHours: number; latDeg: number; lonDeg: number; place: string }
function toInput(i: OracleInput, name: string): ChartInput {
  const [y, m, d] = i.date.split('-').map(Number) as [number, number, number];
  const [h, mi, s] = i.time.split(':').map(Number) as [number, number, number];
  return { name, date: { y, m, d }, time: { h, mi, s }, tzHours: i.tzHours, dstHours: 0,
    place: { name: i.place, latDeg: i.latDeg, lonDeg: i.lonDeg }, profileId: 'pl9' };
}

let swe: SwissEph;
let chart: ChartResult;
let st: Page1Strengths;
beforeAll(async () => {
  swe = await bootNode();
  chart = cast(swe, toInput({ ...fixture.input, place: fixture.input.place }, fixture.input.name));
  st = strengths(swe, chart);
});

describe('PL9 Page 1 strength table — Amitabh Bachchan fixture', () => {
  it.each(PLANETS)('%s Dignity', (p) => expect(st.planets[p].dignityLabel).toBe(table[p][0]));
  it.each(G7)('%s SB% (2 decimals)', (p) => expect(round2(st.planets[p].sbRatio!)).toBe(table[p][1]));
  it.each(G7)('%s SB# (number of strong balas)', (p) => expect(st.planets[p].sbStrongCount).toBe(table[p][2]));
  it.each(G7)('%s Shadbala bar', (p) => expect(round2(st.planets[p].sbRatio!)).toBe((fixture.shadbala_bars as Record<string, number>)[p]));
  it('nodes have blank SB%, SB#, K7', () => {
    for (const p of ['Ra', 'Ke'] as const) {
      expect([st.planets[p].sbRatio, st.planets[p].sbStrongCount, st.planets[p].k7]).toEqual([null, null, null]);
    }
  });
  it.each(PLANETS.filter((p) => p !== 'Ke'))('%s VB', (p) => expect(st.planets[p].vimshopaka).toBe(table[p][3]));
  it('Ke VB — OPEN (§3.4): the oracle rule gives 9 (9.1) where PL9 shows 14', () => {
    // Not PL truth: asserts the current shadvarga rule only. PL9 = 14.
    expect(st.planets.Ke.vimshopakaScore).toBeCloseTo(9.1, 9);
    expect(st.planets.Ke.vimshopaka).toBe(9);
    expect(table.Ke[3]).toBe(14);
  });
  it.each(G7)('%s AV', (p) => expect(st.planets[p].av).toBe(table[p][4]));
  it('Ra AV — OPEN (§3.5): dispositor-BAV candidate reproduces PL9\'s 4; Ke blank', () => {
    expect(st.planets.Ra.av).toBe(table.Ra[4]);
    expect(st.planets.Ke.av).toBeNull();
  });
  it.each(PLANETS)('%s Av3', (p) => expect(st.planets[p].av3).toBe(table[p][5]));
  it.each(PLANETS)('%s Av5', (p) => expect(st.planets[p].av5).toBe(table[p][6]));
  it.each(G7)('%s K7', (p) => expect(st.planets[p].k7).toBe(table[p][7]));
  it.each(PLANETS)('%s Func.', (p) => expect(st.planets[p].functional).toBe(table[p][8]));
});

describe('PL9 Page 1 Rasi chart house labels', () => {
  const houses = fixture.rasi_houses as unknown as Record<string, [number, number]>;
  it.each(Array.from({ length: 12 }, (_, i) => i + 1))('house %i SAV', (h) => {
    expect(st.houses[h - 1]!.sav).toBe(houses[String(h)]![0]);
  });
  it.each(Array.from({ length: 12 }, (_, i) => i + 1))('house %i Bhava Bala within the spec residual (≤0.6 virupa)', (h) => {
    // §1.2: every bhava component is exact; the ≤0.51 residual is the lord's shadbala
    // (cheshta epochs from true events instead of PL7's series).
    expect(Math.abs(st.houses[h - 1]!.bhavaBala - houses[String(h)]![1])).toBeLessThanOrEqual(0.6);
  });
  it('SAV sums to 337', () => expect(st.ashtakavarga.sav.reduce((a, b) => a + b, 0)).toBe(337));
  it('BAV totals are the BPHS totals', () => {
    const tot = G7.map((p) => st.ashtakavarga.bav[p].reduce((a, b) => a + b, 0));
    expect(tot).toEqual([48, 49, 39, 54, 56, 52, 39]);
  });
});

describe('Kala context of the fixture (spec §4.3 worked values)', () => {
  it('sunrise 07:02:28 and sunset 18:36:20 zone time (Asc = Sun, no refraction)', () => {
    const hms = (jd: number) => {
      const s = Math.round((((jd + 0.5 + 6.5 / 24) % 1) + 1) % 1 * 86400);
      return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((x) => String(x).padStart(2, '0')).join(':');
    };
    expect(hms(st.breakdown.kala.sunrise)).toBe('07:02:28');
    expect(hms(st.breakdown.kala.sunset)).toBe('18:36:20');
  });
  it('year Ju, month Sa, vara Su, hora 9 = Ve; X = 227.158', () => {
    const k = st.breakdown.kala;
    expect([k.yearLord, k.monthLord, k.varaLord, k.horaNumber, k.horaLord]).toEqual(['Ju', 'Sa', 'Su', 9, 'Ve']);
    expect(k.natonnataX).toBeCloseTo(227.158, 3);
    expect(k.isDay).toBe(true);
  });
  it('no planetary war in the fixture', () => {
    for (const p of G7) expect(st.breakdown.shadbala[p].yuddha).toBeNull();
  });
});

type OracleChart = (typeof oracle.charts)[number];
const SB_KEYS = ['uchcha', 'saptavargaja', 'ojayugma', 'kendra', 'drekkana', 'sthana', 'dig', 'natonnata', 'paksha',
  'tribhaga', 'abda', 'masa', 'vara', 'hora', 'ayana', 'kala', 'cheshta', 'naisargika', 'drik', 'total'] as const;
const DIG: Record<string, string> = { EX: 'EX', MT: 'MT', OWN: 'OWN', GF: 'GF', F: 'F', N: 'N', E: 'E', GE: 'GE', DB: 'DB' };

describe.each(oracle.charts.map((c) => [c.name, c] as [string, OracleChart]))('TS = Python oracle — %s', (name, oc) => {
  let c: ChartResult;
  let s: Page1Strengths;
  beforeAll(() => {
    c = cast(swe, toInput(oc.input as OracleInput, name));
    s = strengths(swe, c);
  });
  it('same chart (positions ≤ 0.2″: WASM vs pyswisseph ephemeris files; Asc ≤ 1e-6°)', () => {
    for (const p of PLANETS) expect([p, Math.abs(c.bodies[p].lonDeg - (oc.planets as any)[p].lon) * 3600 < 0.2]).toEqual([p, true]);
    expect(Math.abs(c.asc.lonDeg - oc.asc)).toBeLessThan(1e-6);
  });
  it('kala context (sunrise/sunset ≤ 0.1 s, lords, hora number)', () => {
    const k = s.breakdown.kala;
    expect(Math.abs(k.sunrise - oc.meta.sunrise) * 86400).toBeLessThan(0.1);
    expect(Math.abs(k.sunset - oc.meta.sunset) * 86400).toBeLessThan(0.1);
    expect([k.yearLord, k.monthLord, k.varaLord, k.horaLord]).toEqual(oc.meta.lords);
    expect(k.horaNumber).toBe(oc.meta.hora_no);
    expect(k.isDay).toBe(oc.meta.day);
    expect(k.natonnataX).toBeCloseTo(oc.meta.X, 4);
  });
  it.each(G7)('%s shadbala components ±0.05 virupa, SB% and SB# equal', (p) => {
    const want = (oc.shadbala as any)[p];
    const got = s.breakdown.shadbala[p];
    for (const k of SB_KEYS) expect([p, k, Math.abs(got[k] - want[k]) <= 0.05]).toEqual([p, k, true]);
    expect(Math.abs(got.ratio - want['SB%'])).toBeLessThan(0.05 / 300);
    expect(got.strongCount).toBe(want['SB#']);
  });
  it('bhava bala components ±0.05 virupa', () => {
    oc.bhava.forEach((b, h) => {
      const g = s.breakdown.bhava[h]!;
      const pairs: [string, number, number][] = [['lord', g.fromLord, b.lord], ['dig', g.dig, b.dig], ['drishti', g.drishti, b.drishti],
        ['planets', g.planets, b.planets], ['day_night', g.dayNight, b.day_night], ['total', g.total, b.total]];
      for (const [k, x, y] of pairs) expect([h + 1, k, Math.abs(x - y) <= 0.05]).toEqual([h + 1, k, true]);
    });
  });
  it('BAV and SAV tables equal', () => {
    for (const p of G7) expect([p, s.ashtakavarga.bav[p]]).toEqual([p, (oc.bav as any)[p]]);
    expect(s.ashtakavarga.sav).toEqual(oc.sav);
  });
  it.each(PLANETS)('%s discrete columns equal (dignity, VB, AV, Av3, Av5, K7, Func.)', (p) => {
    const w = (oc.planets as any)[p];
    const r = s.planets[p];
    expect(DIG[r.dignity]).toBe(w.dignity);
    expect(r.vimshopakaScore).toBeCloseTo(w.vimshopaka, 9);
    expect(r.vimshopaka).toBe(w.vb);
    expect(r.av).toBe(w.av ?? null);
    expect(r.av3).toBe(w.av3);
    expect(r.av5).toBe(w.av5);
    expect(r.k7).toBe(w.k7 ?? null);
    expect(r.functional).toBe(w.func);
  });
});

describe('performance', () => {
  it('strengths() runs in < 30 ms after WASM boot (warm median)', () => {
    strengths(swe, chart); // warm the JIT
    const times: number[] = [];
    for (let i = 0; i < 9; i++) {
      const t0 = performance.now();
      strengths(swe, chart);
      times.push(performance.now() - t0);
    }
    times.sort((a, b) => a - b);
    const median = times[4]!;
    console.info(`strengths(): median ${median.toFixed(2)} ms, min ${times[0]!.toFixed(2)} ms, max ${times[8]!.toFixed(2)} ms, ${st.sweCalls} Swiss calls`);
    expect(median).toBeLessThan(30);
  });
  it('leaves the chart frame intact (re-casting gives the same houses)', () => {
    strengths(swe, chart);
    const again = cast(swe, chart.input);
    expect(again.cusps).toEqual(chart.cusps);
    expect(again.asc.lonDeg).toBe(chart.asc.lonDeg);
  });
});

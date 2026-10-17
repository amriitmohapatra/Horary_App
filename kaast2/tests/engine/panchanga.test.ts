/**
 * Panchanga, Yogi and bhava on real casts (Swiss WASM): the Amitabh Bachchan
 * PL9 fixture chart and the synthetic charts of
 * fixtures/bhava_yogi_panchanga_pyjhora.json (sunrises from pyswisseph and
 * PyJHora's own sunrise/vaara).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { bootNode } from './boot';
import { cast, type ChartInput, type ChartResult } from '../../src/engine';
import type { SwissEph } from '../../src/engine/ephem/swisseph';
import { lastSunrise, panchanga, vara, type SunriseConvention } from '../../src/engine/panchanga/panchanga';
import { yogiPoints } from '../../src/engine/yogi/yogi';
import { bhavaChart } from '../../src/engine/houses/bhava';
import { fromJulianDay } from '../../src/engine/time/julian';
import { dmsInSign, signIndex } from '../../src/engine/zodiac';

interface Case {
  input: { name: string; y: number; m: number; d: number; h: number; mi: number; s: number; tz: number; place: string; lat: number; lon: number };
  jdUT: number;
  ascDeg: number;
  deg: Record<string, number>;
  arcsec: Record<string, number>;
  sunriseSwe: Record<SunriseConvention, number | null> | null;
  pyjhora: { sunrise_pyjhora?: { jdUT: number }; vaara_pyjhora?: number };
}
const fixture = JSON.parse(readFileSync(resolve(import.meta.dirname, '../fixtures/bhava_yogi_panchanga_pyjhora.json'), 'utf8')) as { cases: Case[] };
const toInput = (c: Case): ChartInput => ({
  name: c.input.name, date: { y: c.input.y, m: c.input.m, d: c.input.d }, time: { h: c.input.h, mi: c.input.mi, s: c.input.s },
  tzHours: c.input.tz, dstHours: 0, place: { name: c.input.place, latDeg: c.input.lat, lonDeg: c.input.lon }, profileId: 'pl9',
});
const CONVENTIONS: SunriseConvention[] = ['upper-limb', 'disc-centre', 'hindu'];
const fmt = (a: number) => { const { d, m, s } = dmsInSign(a); return `${signIndex(a) + 1}:${[d, m, s].map((x) => String(x).padStart(2, '0')).join(':')}`; };
const local = (jdUT: number, tz: number) => { const t = fromJulianDay(jdUT + tz / 24); return `${t.y}-${t.m}-${t.d} ${t.h}:${String(t.mi).padStart(2, '0')}:${String(t.s).padStart(2, '0')}`; };

let swe: SwissEph;
let charts: ChartResult[];
beforeAll(async () => {
  swe = await bootNode();
  charts = fixture.cases.map((c) => cast(swe, toInput(c)));
});

describe('Amitabh Bachchan, 1942-10-11 16:00 (+6.5), Allahabad — worked values', () => {
  const amitabh = () => charts[0]!;
  it('is the first fixture case', () => expect(fixture.cases[0]!.input.name).toBe('Amitabh Bachchan'));

  it('panchanga: Shukla Dwitiya, Swati 2, Vishkambha, Balava, Sunday', () => {
    const p = panchanga(swe, amitabh());
    expect([p.tithi.num, p.tithi.name, p.tithi.paksha]).toEqual([2, 'Dwitiya', 'shukla']);
    expect([p.nakshatra.name, p.nakshatra.pada, p.nakshatra.lord]).toEqual(['Swati', 2, 'Ra']);
    expect([p.yoga.num, p.yoga.name]).toEqual([1, 'Vishkambha']);
    expect([p.karana.num, p.karana.name]).toEqual([3, 'Balava']);
    expect([p.vara.name, p.vara.lord, p.vara.beforeSunrise]).toEqual(['Sunday', 'Su', false]);
    // upper-limb sunrise 06:58:47 war time (IST+1h)
    expect(local(p.vara.sunriseJdUT!, 6.5)).toBe('1942-10-11 6:58:47');
  });

  it('Yogi point Cancer 8°01′55″ in Pushya: Yogi Saturn, Avayogi Moon (6th nakshatra) / Sun (opposite point), Duplicate Yogi Moon', () => {
    const c = amitabh();
    const six = yogiPoints(c.bodies.Su.lon, c.bodies.Mo.lon, { avayogi: 'sixth-nakshatra' });
    const opp = yogiPoints(c.bodies.Su.lon, c.bodies.Mo.lon, { avayogi: 'opposite-point' });
    expect(fmt(six.yogiPoint.lon)).toBe('4:08:01:55');
    expect([six.yogiPoint.nakshatra, six.yogi, six.duplicateYogi]).toEqual([7, 'Sa', 'Mo']);
    expect([fmt(six.avayogiPoint.lon), six.avayogiPoint.nakshatra, six.avayogi]).toEqual(['10:14:41:55', 21, 'Mo']);
    expect([fmt(opp.avayogiPoint.lon), opp.avayogiPoint.nakshatra, opp.avayogi]).toEqual(['10:08:01:55', 20, 'Su']);
  });

  it('Sripati madhyas and the planets re-housed', () => {
    const b = bhavaChart(amitabh(), 'sripati');
    expect(b.arcsec.madhya.map(fmt)).toEqual([
      '11:01:56:52', '12:05:28:48', '1:09:00:44', '2:12:32:40', '3:09:00:44', '4:05:28:48',
      '5:01:56:52', '6:05:28:48', '7:09:00:44', '8:12:32:40', '9:09:00:44', '10:05:28:48',
    ]);
    expect(b.houses).toEqual({ As: 1, Su: 7, Mo: 8, Ma: 7, Me: 7, Ju: 5, Ve: 7, Sa: 4, Ra: 6, Ke: 12 });
  });
});

describe('engine longitudes = oracle longitudes (so the PyJHora fixture compares rules, not ephemerides)', () => {
  it('Sun and Moon arcseconds identical on every chart; exact degrees within 0.01″', () => {
    const bad: string[] = [];
    charts.forEach((ch, i) => {
      const c = fixture.cases[i]!;
      for (const p of ['Su', 'Mo'] as const) {
        if (ch.bodies[p].lon !== c.arcsec[p]) bad.push(`${c.input.name} ${p} ${ch.bodies[p].lon} vs ${c.arcsec[p]}`);
        if (Math.abs(ch.bodies[p].lonDeg - c.deg[p]!) * 3600 > 0.01) bad.push(`${c.input.name} ${p} deg`);
      }
      if (Math.abs(ch.asc.lonDeg - c.ascDeg) * 3600 > 0.01) bad.push(`${c.input.name} Asc`);
    });
    expect(bad).toEqual([]);
  });
});

describe('sunrise conventions = pyswisseph swe_rise_trans (≤ 0.1 s)', () => {
  it.each(CONVENTIONS)('%s', (conv) => {
    let n = 0;
    const bad: string[] = [];
    fixture.cases.forEach((c, i) => {
      if (!c.sunriseSwe) return;
      n++;
      const ours = lastSunrise(swe, charts[i]!.moment.jdUT, c.input.lat, c.input.lon, conv);
      const want = c.sunriseSwe[conv];
      if (ours === null || want === null) { if (ours !== want) bad.push(`${c.input.name}: ${ours} vs ${want}`); return; }
      if (Math.abs(ours - want) * 86400 > 0.1) bad.push(`${c.input.name}: ${(ours - want) * 86400} s`);
    });
    expect(n).toBeGreaterThan(40);
    expect(bad).toEqual([]);
  });

  it('the conventions are ordered: upper limb first, then disc centre, then geometric (Hindu) rising', () => {
    const c = fixture.cases[0]!.sunriseSwe!;
    expect(c['upper-limb']!).toBeLessThan(c['disc-centre']!);
    expect(c['disc-centre']!).toBeLessThan(c.hindu!);
    // at 25° N the spread is a few minutes
    expect((c.hindu! - c['upper-limb']!) * 1440).toBeGreaterThan(2);
    expect((c.hindu! - c['upper-limb']!) * 1440).toBeLessThan(6);
  });
});

describe('vara vs PyJHora (drik.vaara, Hindu rising)', () => {
  it("'hindu' convention: same weekday as PyJHora on every chart with a sunrise; same sunrise to ≤ 1 s", () => {
    const bad: string[] = [];
    let n = 0, shifted = 0;
    fixture.cases.forEach((c, i) => {
      if (c.pyjhora.vaara_pyjhora === undefined) return;
      n++;
      const v = vara(swe, charts[i]!, { sunrise: 'hindu' });
      if (v.beforeSunrise) shifted++;
      if (v.num - 1 !== c.pyjhora.vaara_pyjhora) bad.push(`${c.input.name}: ours ${v.name}, PyJHora ${c.pyjhora.vaara_pyjhora}`);
      // PyJHora reports the civil date's sunrise; ours is the last one before the moment — equal unless before sunrise
      const jh = c.pyjhora.sunrise_pyjhora!.jdUT;
      if (!v.beforeSunrise && Math.abs(v.sunriseJdUT! - jh) * 86400 > 1) bad.push(`${c.input.name}: sunrise ${(v.sunriseJdUT! - jh) * 86400} s`);
    });
    expect(n).toBeGreaterThan(40);
    expect(shifted).toBeGreaterThan(3);
    expect(bad).toEqual([]);
  });

  it('a birth before sunrise takes the previous weekday', () => {
    // 2000-01-01 (Saturday) 05:00 IST at Delhi, sunrise ≈ 07:14 → Friday
    const ch = cast(swe, { date: { y: 2000, m: 1, d: 1 }, time: { h: 5, mi: 0, s: 0 }, tzHours: 5.5, dstHours: 0,
      place: { name: 'Synthetic Delhi', latDeg: 28.6139, lonDeg: 77.209 }, profileId: 'pl9' });
    const v = vara(swe, ch);
    expect([v.name, v.beforeSunrise]).toEqual(['Friday', true]);
    const after = vara(swe, cast(swe, { ...ch.input, time: { h: 7, mi: 30, s: 0 } }));
    expect([after.name, after.beforeSunrise]).toEqual(['Saturday', false]);
  });
});

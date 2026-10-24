/**
 * Horary charts from a number (src/engine/kp/horary.ts) against the cusps
 * printed in B6 (tests/fixtures/kp_b6_horary.json, 37 charts). The Readers
 * read the cusps from Raphael's tables of houses and interpolate by eye, so
 * intermediate cusps are compared as a distribution.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import fx from '../fixtures/kp_b6_horary.json';
import { bootNode } from './boot';
import { horaryChart } from '../../src/engine/kp/horary';
import { horaryUnit } from '../../src/engine/kp/subs';
import type { SwissEph } from '../../src/engine/ephem/swisseph';

let swe: SwissEph;
beforeAll(async () => { swe = await bootNode(); });
const wrap = (x: number) => ((x + 648000 + 1296000) % 1296000) - 648000;

/** Printed charts no latitude reproduces, or with a misprinted meridian (checked by fitting the latitude 0°–40°). */
const MC_OUT: Record<string, string> = {
  'b6-E04': 'no latitude fits (best median error 1½°): the printed cusps are not Placidus for this ascendant',
  'b6-E09': 'no latitude fits (best median error 3°); judged in a train near Sholapur',
  'b6-E43': 'X printed Can 24°50′ while IV is Cap 21°50′',
  'b6-E53': 'cusps II–III printed Lib 29°25′, Sag 0°25′ (a 61° house): misprints',
  'b6-E56': 'fits latitude 34° rather than Delhi’s 28°40′',
  'b6-E62': 'cusps III–IV misprinted (Tau 20°, Gem 26° with II Ari 29°)',
};

function chart(c: (typeof fx.cases)[number]) {
  return horaryChart(swe, {
    date: c.date, time: c.time, tzHours: 5.5, dstHours: 0, place: { name: c.id, latDeg: c.latDeg, lonDeg: 77 },
    profileId: 'pl9', overrides: { ayanamsa: 'pl_krishnamurti_new', node: 'mean' },
  }, c.number).chart;
}

describe('KP horary cusps against B6', () => {
  it('the ascendant is the start of the numbered unit, exactly', () => {
    for (const c of fx.cases) expect(chart(c).cusps[0]).toBe(horaryUnit(c.number).start);
  });
  it('the meridian (X) agrees within 10′ in every chart except six named book slips', () => {
    for (const c of fx.cases) {
      if (MC_OUT[c.id]) continue;
      const cusps = chart(c).cusps;
      const v = (c.cusps as Record<string, number>)['10']!;
      expect(Math.abs(wrap(cusps[9]! - v)), c.id).toBeLessThanOrEqual(600);
    }
  });
  it('intermediate cusps: median error under 20′, 90% within 40′ (a row of Raphael’s tables taken without interpolation)', () => {
    const errs: number[] = [];
    for (const c of fx.cases) {
      if (MC_OUT[c.id]) continue;
      const cusps = chart(c).cusps;
      for (const [k, v] of Object.entries(c.cusps as Record<string, number>)) {
        if ([1, 4, 7, 10].includes(+k)) continue;
        errs.push(Math.abs(wrap(cusps[+k - 1]! - v)) / 60);
      }
    }
    errs.sort((a, b) => a - b);
    expect(errs[errs.length >> 1]).toBeLessThan(20);
    expect(errs[Math.floor(errs.length * 0.9)]).toBeLessThanOrEqual(40);
  });
  it('planets are those of the judgement moment, untouched by the number', () => {
    const c = fx.cases[0]!;
    const a = horaryChart(swe, { date: c.date, time: c.time, tzHours: 5.5, dstHours: 0, place: { name: 'x', latDeg: c.latDeg, lonDeg: 77 }, profileId: 'pl9', overrides: { ayanamsa: 'pl_krishnamurti_new', node: 'mean' } }, 1);
    const b = horaryChart(swe, { date: c.date, time: c.time, tzHours: 5.5, dstHours: 0, place: { name: 'x', latDeg: c.latDeg, lonDeg: 77 }, profileId: 'pl9', overrides: { ayanamsa: 'pl_krishnamurti_new', node: 'mean' } }, 200);
    expect(a.chart.bodies).toEqual(b.chart.bodies);
    expect(a.chart.cusps[0]).not.toBe(b.chart.cusps[0]);
  });
});

import dfx from '../fixtures/kp_b6_horary_dasa.json';
import { cast } from '../../src/engine';
import { julianDay } from '../../src/engine/time/julian';
import { chainAt, mahadashas } from '../../src/engine/dasha/vimshottari';

/** Judgement data the book leaves doubtful (references/KP/notes/b6_examples.json). */
const DASA_OUT: Record<string, string> = {
  'b6-E57': 'text says the planets are "for 9-30 A.M. 9-8-1969", a day after the printed judgement',
  'b6-E59': 'place and zone of judgement not stated; the printed bhukti is 1½ years away from the date',
  'b6-E63': 'place not stated; the 1963 event lies before the Moon dasa the printed moment gives',
};

describe('horary dasa from the Moon at judgement (KP6-005)', () => {
  it('dasa and bhukti equal B6’s at every dated event (three named exceptions); the anthra in 3 of 4', () => {
    let anthra = 0, n = 0;
    for (const c of dfx.cases) {
      if (DASA_OUT[c.id]) continue;
      const ch = cast(swe, { date: c.date, time: c.time, tzHours: 5.5, dstHours: 0, place: { name: c.id, latDeg: 19, lonDeg: 73 }, profileId: 'pl9', overrides: { ayanamsa: 'pl_krishnamurti_new', node: 'mean', dashaYearDays: 365.25 } });
      const [y, m, d] = c.event.split('-').map(Number);
      const got = chainAt(mahadashas(ch.bodies.Mo.lonDeg, ch.moment.jdUT, 365.25), julianDay(y!, m!, d!, 6.5), 3).map((p) => p.lords.at(-1));
      expect(got.slice(0, 2), `${c.id} ${c.event}`).toEqual(c.lords.slice(0, 2));
      n++; if (got[2] === c.lords[2]) anthra++;
    }
    // The misses (b6-E20, E40, E45, E53, E58) are dates B6 fixes by transit next to an anthra boundary.
    expect(anthra / n).toBeGreaterThanOrEqual(0.75);
  });
});

import { kpModel } from '../../src/engine/kp/kp';
import { kpSignifications } from '../../src/engine/kp/significators';
import { cuspTest } from '../../src/engine/kp/matters';

/**
 * B6 judgements that state their judgement from a cusp's sub lord (KP6-061).
 * Not here: b6-E04 (its printed cusps fit no latitude: the book's Jupiter is
 * in 2, ours in 3); b6-E26 (Rahu sub: the node's set reaches nearly every
 * house; Krishnamurti denies because Rahu sits in the 12th, p. 209); the 11th
 * cusp of b6-E29 (on a sub boundary: Saturn sub here, Jupiter in the book).
 */
const VERDICTS: { id: string; date: string; time: string; lat: number; n: number; cusp: number; houses: number[]; want: 'promised' | 'denied'; cite: string }[] = [
  { id: 'b6-E18', date: '1969-07-30', time: '15:32', lat: 28.633, n: 21, cusp: 3, houses: [3, 9, 11], want: 'denied', cite: 'B6 pp. 181–182, rumour false' },
  { id: 'b6-E24', date: '1969-08-03', time: '17:30', lat: 18.917, n: 175, cusp: 5, houses: [2, 5, 11], want: 'denied', cite: 'B6 pp. 201–204, husband sterile' },
  { id: 'b6-E29', date: '1969-03-26', time: '18:30', lat: 18.917, n: 247, cusp: 5, houses: [2, 5, 11], want: 'denied', cite: 'B6 pp. 218–221, 5th sub lord retrograde Jupiter' },
  { id: 'b6-E41', date: '1969-02-19', time: '07:30', lat: 19, n: 156, cusp: 7, houses: [2, 7, 11], want: 'promised', cite: 'B6 pp. 260–264, partnership continues' },
  { id: 'b6-E46', date: '1969-10-10', time: '13:30', lat: 28.633, n: 147, cusp: 4, houses: [4, 7, 11], want: 'promised', cite: 'B6 pp. 276–277, medical examination passed' },
  { id: 'b6-E62', date: '1969-04-09', time: '09:30', lat: 13.067, n: 249, cusp: 11, houses: [1, 5, 11], want: 'denied', cite: 'B6 pp. 317–318, cure (11th cusp) denied' },
  { id: 'b6-E64', date: '1968-11-29', time: '17:30', lat: 18.917, n: 208, cusp: 12, houses: [2, 3, 8, 12], want: 'denied', cite: 'B6 pp. 321–324, imprisonment never: condition (ii) fails' },
];

describe('horary promise by the three-condition test (KP6-061)', () => {
  for (const v of VERDICTS) {
    it(`${v.id}: ${v.cite}`, () => {
      const [y, m, d] = v.date.split('-').map(Number);
      const [h, mi] = v.time.split(':').map(Number);
      const hc = horaryChart(swe, { date: { y: y!, m: m!, d: d! }, time: { h: h!, mi: mi!, s: 0 }, tzHours: 5.5, dstHours: 0, place: { name: v.id, latDeg: v.lat, lonDeg: 77 }, profileId: 'pl9', overrides: { ayanamsa: 'pl_krishnamurti_new', node: 'mean' } }, v.n);
      const km = kpModel(hc.chart);
      const r = cuspTest(km, kpSignifications(km), v.cusp, v.houses);
      expect(r.outcome === 'promised' ? 'promised' : 'denied').toBe(v.want);
      if (v.id === 'b6-E64') expect(r.starDirect).toBe(false);
    });
  }
});

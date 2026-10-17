/**
 * Slice 8 — transit search (src/engine/transit). Oracles:
 *  (a) every event is a real boundary crossing / speed sign change: the
 *      chart recipe (transitPositions = siderealFrame + bodiesIn) puts the
 *      body in `from` 1 s before and in `to` 1 s after;
 *  (b) completeness: a brute-force scan of the chart recipe at fine steps
 *      never sees a state the event list does not predict;
 *  (c) speed: a year of Moon nakshatra changes well under 100 ms;
 *  (d) PL 7's own transit cache (Moon every 7.5 days, 2020–2048) lies in the
 *      nakshatra our pl7 event list predicts;
 *  (e) one Sade Sati period checked against published ingress dates.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import cache from '../fixtures/pl7_cache_moon_rahu.json';
import { bootNode } from './boot';
import { bodiesIn, siderealFrame, PROFILES, PLANETS, type PlanetId, type ProfileId } from '../../src/engine';
import type { SwissEph } from '../../src/engine/ephem/swisseph';
import { julianDay } from '../../src/engine/time/julian';
import { evaluator } from '../../src/engine/transit/body';
import {
  TRANSIT_JD_MAX, TRANSIT_JD_MIN, cellOf, findEvents, returns, sadeSati, transitPositions,
  type EventKind, type TransitEvent,
} from '../../src/engine/transit';
import { nakshatraIndex, signIndex } from '../../src/engine/zodiac';

let swe: SwissEph;
beforeAll(async () => { swe = await bootNode(); });

const SEC = 1 / 86400;
const jd = (y: number, m = 1, d = 1, h = 0) => julianDay(y, m, d, h);

/** (a) — 1 s before / after each event (clusters closer than 2 s checked at their outer edges). */
function verifyEvents(profile: ProfileId, events: TransitEvent[]): number {
  const groups = new Map<string, TransitEvent[]>();
  for (const e of events) {
    const key = `${e.body}/${e.kind}`;
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(e);
  }
  let checked = 0;
  for (const list of groups.values()) {
    for (let i = 0; i < list.length;) {
      let j = i;
      while (j + 1 < list.length && list[j + 1]!.jdUT - list[j]!.jdUT < 2 * SEC) j++;
      const first = list[i]!, last = list[j]!;
      const before = transitPositions(swe, profile, first.jdUT - SEC)[first.body];
      const after = transitPositions(swe, profile, last.jdUT + SEC)[last.body];
      if (first.kind === 'station') {
        expect(before.speedDeg < 0, `${first.body} station ${first.jdUT}`).toBe(first.direction === 'direct');
        expect(after.speedDeg < 0, `${last.body} station ${last.jdUT}`).toBe(last.direction === 'retrograde');
      } else {
        expect(cellOf(first.kind, before.lon), `${first.body} ${first.kind} before ${first.jdUT}`).toBe(first.from);
        expect(cellOf(last.kind, after.lon), `${last.body} ${last.kind} after ${last.jdUT}`).toBe(last.to);
        const at = transitPositions(swe, profile, first.jdUT + SEC)[first.body];
        expect(Math.abs(((at.lon - first.lon + 1_296_000 + 648_000) % 1_296_000) - 648_000)).toBeLessThan(60);
      }
      checked += j - i + 1;
      i = j + 1;
    }
  }
  return checked;
}

/** (b) — brute force: chart-recipe state at every step equals the state the event list predicts. */
function bruteForce(profile: ProfileId, body: PlanetId, kind: EventKind, events: TransitEvent[],
  fromJd: number, toJd: number, step: number): { samples: number; changes: number } {
  const ev = events.filter((e) => e.body === body && e.kind === kind);
  for (let i = 1; i < ev.length; i++) {
    if (kind === 'station') expect(ev[i]!.direction, `alternation ${body} at ${ev[i]!.jdUT}`).not.toBe(ev[i - 1]!.direction);
    else expect(ev[i]!.from, `chain ${body} ${kind} at ${ev[i]!.jdUT}`).toBe(ev[i - 1]!.to);
  }
  const cell = (t: number) => {
    const p = transitPositions(swe, profile, t)[body];
    return kind === 'station' ? (p.speedDeg < 0 ? 1 : 0) : cellOf(kind, p.lon);
  };
  let state = cell(fromJd), k = 0, changes = 0, prev = state, samples = 0;
  for (let t = fromJd; t <= toJd; t += step) {
    while (k < ev.length && ev[k]!.jdUT <= t) { state = kind === 'station' ? (ev[k]!.direction === 'retrograde' ? 1 : 0) : ev[k]!.to; k++; }
    const near = (k < ev.length && ev[k]!.jdUT - t < 1e-5) || (k > 0 && t - ev[k - 1]!.jdUT < 1e-5);
    const c = cell(t);
    if (c !== prev) changes++;
    prev = c;
    if (!near) expect(c, `${body} ${kind} brute force at JD ${t}`).toBe(state);
    samples++;
  }
  return { samples, changes };
}

describe('single-body evaluator = bodiesIn (bit-identical)', () => {
  it('all bodies, three profiles, 300 instants 1800–2399', () => {
    let seed = 12345;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
    for (const pid of ['pl9', 'pl7', 'solarfire'] as const) {
      const p = PROFILES[pid];
      const evs = PLANETS.map((b) => evaluator(swe, p, b));
      for (let n = 0; n < 100; n++) {
        const t = TRANSIT_JD_MIN + rnd() * (TRANSIT_JD_MAX - TRANSIT_JD_MIN);
        const ref = bodiesIn(swe, siderealFrame(swe, p, t));
        PLANETS.forEach((b, i) => {
          const s = evs[i]!(t);
          expect(s.v).toBe(ref[b].speedDeg);
          if (b === 'Ke') expect(Math.abs(s.raw - ref.Ke.lonDeg * 3600)).toBeLessThan(1e-6);
          else expect(s.raw).toBe(ref[b].lonDeg * 3600);
        });
      }
    }
  });
});

describe('(a) events are real crossings, (b) brute force finds nothing missed', () => {
  it('Moon: 1 year of sign, nakshatra and pada changes (brute force every 30 min)', () => {
    const a = jd(2024), b = jd(2025);
    const ev = findEvents(swe, 'pl9', { bodies: ['Mo'], kinds: ['sign', 'nakshatra', 'pada'], fromJd: a, toJd: b });
    const nak = ev.filter((e) => e.kind === 'nakshatra');
    expect(nak.length).toBeGreaterThan(360 / (40 / 3) * 13);
    expect(verifyEvents('pl9', ev)).toBe(ev.length);
    const r = bruteForce('pl9', 'Mo', 'nakshatra', ev, a, b, 1 / 48);
    expect(r.changes).toBe(nak.length);
    bruteForce('pl9', 'Mo', 'pada', ev, a, b, 1 / 48);
  });

  it('Mercury: 5 years of sign ingresses incl. retrograde re-entries, and stations (brute force every 2 h)', () => {
    const a = jd(2020), b = jd(2025);
    const ev = findEvents(swe, 'pl9', { bodies: ['Me'], kinds: ['sign', 'station'], fromJd: a, toJd: b });
    const retroIngress = ev.filter((e) => e.kind === 'sign' && e.direction === 'retrograde');
    expect(retroIngress.length).toBeGreaterThan(3);
    expect(ev.filter((e) => e.kind === 'station').length).toBeGreaterThanOrEqual(30); // ~3 retrogrades a year
    expect(verifyEvents('pl9', ev)).toBe(ev.length);
    bruteForce('pl9', 'Me', 'sign', ev, a, b, 1 / 12);
    bruteForce('pl9', 'Me', 'station', ev, a, b, 1 / 12);
  });

  it('Rahu and Ketu (true node): 20 years of sign, nakshatra, pada and stations (brute force every 3 h)', () => {
    const a = jd(2010), b = jd(2030);
    const ev = findEvents(swe, 'pl9', { bodies: ['Ra', 'Ke'], kinds: ['sign', 'nakshatra', 'pada', 'station'], fromJd: a, toJd: b });
    // Ketu = Rahu + 180° = 6 signs = 54 padas = 13½ nakshatras: sign, pada and station
    // instants coincide; Ketu's nakshatra changes fall on Rahu's pada 2→3 boundaries.
    for (const kind of ['sign', 'pada', 'station'] as const) {
      const ra = ev.filter((e) => e.body === 'Ra' && e.kind === kind), ke = ev.filter((e) => e.body === 'Ke' && e.kind === kind);
      expect(ke.length).toBe(ra.length);
      ra.forEach((e, i) => { expect(ke[i]!.jdUT).toBe(e.jdUT); expect(ke[i]!.direction).toBe(e.direction); });
      if (kind === 'sign') ra.forEach((e, i) => expect(ke[i]!.to).toBe((e.to + 6) % 12));
    }
    const raPada = new Set(ev.filter((e) => e.body === 'Ra' && e.kind === 'pada' && (e.direction === 'direct' ? e.to : e.from) % 4 === 2).map((e) => e.jdUT));
    expect(ev.filter((e) => e.body === 'Ke' && e.kind === 'nakshatra').every((e) => raPada.has(e.jdUT))).toBe(true);
    expect(ev.some((e) => e.body === 'Ra' && e.kind === 'pada' && e.direction === 'direct')).toBe(true); // the true node does move direct
    expect(verifyEvents('pl9', ev)).toBe(ev.length);
    for (const body of ['Ra', 'Ke'] as const) for (const kind of ['sign', 'nakshatra', 'pada'] as const) bruteForce('pl9', body, kind, ev, a, b, 1 / 8);
  });

  it('all nine bodies, all kinds, 2 years, in each profile', () => {
    for (const pid of ['pl9', 'pl7', 'solarfire'] as const) {
      const a = jd(1947, 8, 15), b = jd(1949, 8, 15);
      const ev = findEvents(swe, pid, { bodies: PLANETS, kinds: ['sign', 'nakshatra', 'pada', 'station'], fromJd: a, toJd: b });
      for (let i = 1; i < ev.length; i++) expect(ev[i]!.jdUT).toBeGreaterThanOrEqual(ev[i - 1]!.jdUT);
      expect(new Set(ev.map((e) => e.body)).size).toBe(9);
      expect(verifyEvents(pid, ev)).toBeGreaterThan(0);
      for (const body of ['Su', 'Ma', 'Ve', 'Ju', 'Sa'] as const) bruteForce(pid, body, 'pada', ev, a, b, 1 / 4);
    }
  });

  it('mean node (custom profile): monotonic, retrograde only', () => {
    const p = { ...PROFILES.pl9, node: 'mean' as const };
    const ev = findEvents(swe, p, { bodies: ['Ra'], kinds: ['nakshatra', 'station'], fromJd: jd(2000), toJd: jd(2019) });
    expect(ev.length).toBeGreaterThan(20);
    expect(ev.every((e) => e.kind === 'nakshatra' && e.direction === 'retrograde')).toBe(true);
  });

  it('works at both ends of the ephemeris range and refuses outside it', () => {
    for (const [a, b] of [[TRANSIT_JD_MIN, TRANSIT_JD_MIN + 30], [TRANSIT_JD_MAX - 30, TRANSIT_JD_MAX]]) {
      const ev = findEvents(swe, 'pl7', { bodies: ['Mo', 'Me', 'Ra'], kinds: ['nakshatra', 'pada', 'station'], fromJd: a!, toJd: b! });
      expect(ev.length).toBeGreaterThan(20);
      verifyEvents('pl7', ev);
    }
    expect(() => findEvents(swe, 'pl9', { bodies: ['Mo'], kinds: ['sign'], fromJd: TRANSIT_JD_MIN - 1, toJd: TRANSIT_JD_MIN + 1 })).toThrow(RangeError);
    expect(() => findEvents(swe, 'pl9', { bodies: ['Mo'], kinds: ['sign'], fromJd: TRANSIT_JD_MAX - 1, toJd: TRANSIT_JD_MAX + 1 })).toThrow(RangeError);
  });
});

describe('(c) performance', () => {
  it('a year of Moon nakshatra changes in well under 100 ms (after WASM boot)', () => {
    const run = () => {
      const t0 = performance.now();
      const ev = findEvents(swe, 'pl7', { bodies: ['Mo'], kinds: ['nakshatra'], fromJd: jd(2026), toJd: jd(2027) });
      return { ms: performance.now() - t0, n: ev.length };
    };
    run();
    const runs = [run(), run(), run(), run(), run()].sort((x, y) => x.ms - y.ms);
    const med = runs[2]!;
    console.log(`Moon nakshatra 1 yr: ${med.n} events, median ${med.ms.toFixed(1)} ms`);
    expect(med.ms).toBeLessThan(50);
  });
});

describe('(d) PL 7 transit cache vs pl7 Moon nakshatra events 2020–2048', () => {
  it('every cached Moon lies in the nakshatra the event list predicts', () => {
    const rows = cache.rows as [number, number, number][];
    const a = rows[0]![0] - 1, b = rows[rows.length - 1]![0] + 1;
    const t0 = performance.now();
    const ev = findEvents(swe, 'pl7', { bodies: ['Mo'], kinds: ['nakshatra'], fromJd: a, toJd: b });
    const ms = performance.now() - t0;
    let state = nakshatraIndex(transitPositions(swe, 'pl7', a).Mo.lon), k = 0, skipped = 0, checked = 0;
    for (const [t, moonDeg] of rows) {
      while (k < ev.length && ev[k]!.jdUT <= t) state = ev[k++]!.to;
      const sec = moonDeg * 3600;
      const off = sec % 48_000;
      if (off < 3 || off > 48_000 - 3) { skipped++; continue; } // within 3″ of a boundary: cache and engine differ ≤ 1.5″
      expect(nakshatraIndex(Math.round(sec)), `JD ${t}`).toBe(state);
      checked++;
    }
    console.log(`PL7 cache: ${ev.length} Moon nakshatra changes in ${ms.toFixed(0)} ms; ${checked} samples agree, ${skipped} skipped (≤3″ from a boundary)`);
    expect(checked).toBeGreaterThan(rows.length - 5);
  });
});

describe('(e) Sade Sati', () => {
  // Natal Moon in Aquarius (sign 10): Saturn in Capricorn (12th), Aquarius (1st), Pisces (2nd).
  // Lahiri ingress dates as printed in Indian almanacs (to the day):
  //   Cp 2020-01-24 · Aq 2022-04-29 · back to Cp 2022-07-12 · Aq 2023-01-17 ·
  //   Pi 2025-03-29 · Ar 2027-06-03 · back to Pi 2027-10-20 · Ar 2028-02-23.
  it('Aquarius Moon, 2019–2030: one period of 8.1 years with both retrograde re-entries', () => {
    const per = sadeSati(swe, 'pl9', 10, jd(2019), jd(2030));
    expect(per.length).toBe(1);
    const s = per[0]!;
    expect(s.startClipped || s.endClipped).toBe(false);
    expect(s.phases.map((x) => x.phase)).toEqual(['12th', '1st', '12th', '1st', '2nd', '2nd']);
    expect(s.excursions.map((x) => x.sign)).toEqual([0]);
    const day = (y: number, m: number, d: number) => jd(y, m, d, 12);
    const near = (t: number, y: number, m: number, d: number) => expect(Math.abs(t - day(y, m, d)), `${y}-${m}-${d}`).toBeLessThan(1);
    near(s.start, 2020, 1, 24);
    near(s.phases[1]!.start, 2022, 4, 29);
    near(s.phases[2]!.start, 2022, 7, 12);
    near(s.phases[3]!.start, 2023, 1, 17);
    near(s.phases[4]!.start, 2025, 3, 29);
    near(s.excursions[0]!.start, 2027, 6, 3);
    near(s.excursions[0]!.end, 2027, 10, 20);
    near(s.end, 2028, 2, 23);
    // Hand check: Saturn in Sagittarius a minute before the start, Capricorn a minute after;
    // ~12.2°/yr mean motion → 3 signs ≈ 7.4 yr, plus the two retrograde loops ≈ 8.1 yr.
    expect(signIndex(transitPositions(swe, 'pl9', s.start - 60 * SEC).Sa.lon)).toBe(8);
    expect(signIndex(transitPositions(swe, 'pl9', s.start + 60 * SEC).Sa.lon)).toBe(9);
    expect((s.end - s.start) / 365.25).toBeGreaterThan(7.9);
    expect((s.end - s.start) / 365.25).toBeLessThan(8.3);
    // Phases tile the period except the excursion.
    const covered = s.phases.reduce((acc, x) => acc + x.end - x.start, 0) + s.excursions.reduce((acc, x) => acc + x.end - x.start, 0);
    expect(covered).toBeCloseTo(s.end - s.start, 9);
  });

  it('clips at the range and flags it', () => {
    const per = sadeSati(swe, 'pl9', 10, jd(2024), jd(2026));
    expect(per.length).toBe(1);
    expect(per[0]!.startClipped && per[0]!.endClipped).toBe(true);
    expect(per[0]!.phases.map((x) => x.phase)).toEqual(['1st', '2nd']);
  });
});

describe('planetary returns', () => {
  const check = (body: PlanetId, natal: number, list: { jdUT: number; direction: string }[]) => {
    const d = (t: number) => ((((transitPositions(swe, 'pl9', t)[body].lonDeg - natal) % 360) + 540) % 360) - 180;
    for (const r of list) {
      const [b, a] = [d(r.jdUT - SEC), d(r.jdUT + SEC)];
      if (r.direction === 'direct') { expect(b).toBeLessThan(0); expect(a).toBeGreaterThanOrEqual(0); }
      else { expect(b).toBeGreaterThanOrEqual(0); expect(a).toBeLessThan(0); }
    }
  };
  it('Sun: one return a year, ~365.256 days apart', () => {
    const natal = 123.456789;
    const r = returns(swe, 'pl9', 'Su', natal, jd(2000), jd(2010));
    expect(r.length).toBe(10);
    check('Su', natal, r);
    for (let i = 1; i < r.length; i++) expect(Math.abs(r[i]!.jdUT - r[i - 1]!.jdUT - 365.256)).toBeLessThan(0.05);
  });
  it('Mercury and Saturn: all passes, incl. triple passes from retrograde loops (brute force 6 h / 1 d)', () => {
    for (const [body, natal, a, b, step] of [['Me', 250.0, jd(2015), jd(2025), 0.25], ['Sa', 300.5, jd(1990), jd(2025), 1]] as const) {
      const r = returns(swe, 'pl9', body, natal, a, b);
      check(body, natal, r);
      expect(r.some((x) => x.direction === 'retrograde')).toBe(true);
      let n = 0, prev = Math.sign(((((transitPositions(swe, 'pl9', a)[body].lonDeg - natal) % 360) + 540) % 360) - 180);
      for (let t = a + step; t <= b; t += step) {
        const x = ((((transitPositions(swe, 'pl9', t)[body].lonDeg - natal) % 360) + 540) % 360) - 180;
        if (Math.abs(x) < 90 && Math.sign(x) !== prev) n++;
        prev = Math.sign(x);
      }
      expect(r.length).toBe(n);
    }
  });
});

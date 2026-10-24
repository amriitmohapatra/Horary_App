/**
 * KP natal timing on the Readers' own marriage examples
 * (tests/fixtures/kp_readers_natal.json; references/KP/notes). Charts cast in
 * "Readers mode": KP-New ayanamsa, mean node, 365.25-day dasa years.
 * Each check names the cases where the BOOK is inconsistent with itself.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import fx from '../fixtures/kp_readers_natal.json';
import { bootNode } from './boot';
import { cast, type ChartResult } from '../../src/engine';
import { julianDay } from '../../src/engine/time/julian';
import { chainAt, mahadashas, type DashaPeriod } from '../../src/engine/dasha/vimshottari';
import { VIM_ORDER, VIM_YEARS } from '../../src/engine/zodiac';
import { kpModel } from '../../src/engine/kp/kp';
import { kpSignifications } from '../../src/engine/kp/significators';
import { MATTERS, judgeMatter, levelFor, rankShare, timingWindows } from '../../src/engine/kp/matters';
import type { SwissEph } from '../../src/engine/ephem/swisseph';
import type { PlanetId } from '../../src/engine/types';

type Case = (typeof fx.cases)[number];
const NAMES: Record<string, PlanetId> = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };
const marriage = MATTERS.find((m) => m.id === 'marriage')!;

let swe: SwissEph;
const charts = new Map<string, ChartResult>();
beforeAll(async () => {
  swe = await bootNode();
  for (const c of fx.cases) {
    charts.set(c.id, cast(swe, {
      date: c.date, time: c.time, tzHours: c.tzHours, dstHours: 0,
      place: { name: c.id, latDeg: c.latDeg, lonDeg: c.lonDeg }, profileId: 'pl9',
      overrides: { ayanamsa: 'pl_krishnamurti_new', node: 'mean', dashaYearDays: 365.25 },
    }));
  }
});

/** Dasa periods from the balance printed in the book (lord and y/m/d left at birth). */
function fromBalance(c: Case, jdUT: number): DashaPeriod[] {
  const bal = c.printed.balance;
  const lord = NAMES[bal.split(' ')[0]!]!;
  const y = Number(/(\d+)y/.exec(bal)?.[1] ?? 0), mo = Number(/(\d+)\s*m/.exec(bal)?.[1] ?? 0), d = Number(/(\d+)d/.exec(bal)?.[1] ?? 0);
  const left = y + mo / 12 + d / 365.25;
  const nak = Math.floor(c.printed.moon / 48000);
  const star = VIM_ORDER[nak % 9] === lord ? nak : VIM_ORDER.indexOf(lord);
  return mahadashas(((star + 1 - left / VIM_YEARS[lord]) * 40) / 3, jdUT, 365.25);
}
const eventJd = (date: string) => { const [y, m, d] = date.split('-').map(Number); return julianDay(y!, m!, d!, 6.5); };
const lordsAt = (mahas: DashaPeriod[], jd: number, n: number) => chainAt(mahas, jd, n).map((p) => p.lords.at(-1)!);

describe('KP natal marriage examples (Readers mode)', () => {
  it('the dasa arithmetic: from the printed balance, the printed DBA at every wedding', () => {
    // b4-E36: the printed balance "Ketu 5y 9m 1d" contradicts the book's own Moon (Leo 2°51′ → 5y 6m 2d);
    //   the cast chart gives the printed Sun–Rahu (next test).
    // b1-E01: Rahu–Mercury–Jupiter agrees; the printed sookshma (Rahu) is the one after the computed (Mars).
    for (const c of fx.cases) {
      if (c.id === 'b4-E36') continue;
      for (const ev of c.events) {
        const n = c.id === 'b1-E01' ? 3 : ev.lords.length;
        expect(lordsAt(fromBalance(c, charts.get(c.id)!.moment.jdUT), eventJd(ev.date), n), c.id).toEqual(ev.lords.slice(0, n));
      }
    }
  });

  it('the cast chart: Moon within 10′ of the print, DBA equal to the bhukti everywhere, to the anthra in 9 of 11', () => {
    // b4-E20 (Colombo 1943): the printed lagna fits Ceylon war time +6:30, the printed Moon +5:30 (24′ apart).
    // b4-E37: the cast Moon is 3′ behind the print; the wedding is 10 days from the Saturn/Mercury anthra boundary.
    const anthraMiss = ['b4-E20', 'b4-E37'];
    for (const c of fx.cases) {
      const ch = charts.get(c.id)!;
      if (c.id !== 'b4-E20') expect(Math.abs(ch.bodies.Mo.lon - c.printed.moon), c.id).toBeLessThan(600);
      const mahas = mahadashas(ch.bodies.Mo.lonDeg, ch.moment.jdUT, 365.25);
      for (const ev of c.events) {
        const n = Math.min(3, ev.lords.length) - (anthraMiss.includes(c.id) ? 1 : 0);
        expect(lordsAt(mahas, eventJd(ev.date), n), c.id).toEqual(ev.lords.slice(0, n));
      }
    }
  });

  it('every married native: the 7th cusp sub lord signifies 2, 7 or 11 (promise)', () => {
    for (const c of fx.cases) {
      const m = kpModel(charts.get(c.id)!);
      const j = judgeMatter(marriage, m, kpSignifications(m));
      expect(['promised', 'mixed'], c.id).toContain(j.promise);
    }
  });

  it('every printed DBA lord is a significator of 2-7-11 (b4-E35 Venus only by aspect, as B4 p. 179 says)', () => {
    for (const c of fx.cases) {
      const m = kpModel(charts.get(c.id)!);
      const s = kpSignifications(m);
      for (const ev of c.events) for (const p of ev.lords as PlanetId[]) {
        const l = levelFor(marriage, s, p);
        expect(l, `${c.id} ${p}`).not.toBeNull();
        if (c.id === 'b4-E35' && p === 'Ve') expect(l).toBe(5);
      }
    }
  });

  it('every wedding anthra is a candidate window; the strength score alone ranks it only a little above chance', () => {
    // Research finding (docs/specs/kp_research.md §5): significators alone do not time a marriage. Over ages 18–45
    // the share of time in STRONGER windows than the wedding one averages 0.38 (0.5 = chance). Krishnamurti
    // narrows by ruling planets at judgement and by transit (KP6-062); the UI says so next to the list.
    const shares: number[] = [];
    for (const c of fx.cases) {
      const ch = charts.get(c.id)!;
      const m = kpModel(ch);
      const s = kpSignifications(m);
      const mahas = mahadashas(ch.bodies.Mo.lonDeg, ch.moment.jdUT, 365.25);
      const a = ch.moment.jdUT + 18 * 365.25, b = ch.moment.jdUT + 45 * 365.25;
      const ws = timingWindows(mahas, marriage, s, a, b);
      const jd = eventJd(c.events[0]!.date);
      const w = ws.find((x) => x.start <= jd && jd < x.end);
      expect(w, c.id).toBeDefined();
      shares.push(rankShare(ws, w!, a, b));
    }
    const mean = shares.reduce((t, x) => t + x, 0) / shares.length;
    expect(mean).toBeGreaterThan(0.3);
    expect(mean).toBeLessThan(0.45);
  });
});

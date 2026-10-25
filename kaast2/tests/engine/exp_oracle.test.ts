/**
 * Experimental worksheets against a private PL 7.0.1 oracle: one real chart's
 * worksheet values, kept OUTSIDE kaast2 (../private_oracles, never published,
 * PLAN §11). Skipped when the file is absent (CI, other machines).
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { bootNode } from './boot';
import { cast, PLANETS, type ChartResult, type PointId } from '../../src/engine';
import { aspectMatrix } from '../../src/engine/exp/aspects';
import { lordships } from '../../src/engine/exp/lordships';
import { dominance, ishtaKashta, type Lons } from '../../src/engine/exp/worksheet14';
import { strengths } from '../../src/engine/strength';
import { GRAHAS7 } from '../../src/engine/strength/common';
import type { SwissEph } from '../../src/engine/ephem/swisseph';

const FILE = resolve(import.meta.dirname, '../../../private_oracles/pl7_chart_A.json');
const have = existsSync(FILE);

interface Oracle {
  input: { date: number[]; time: number[]; tz: number; latDeg: number; lonDeg: number };
  positions: Record<PointId, string>;
  lordships: Record<string, Record<string, [number, string, string?]>>;
  aspects_ws21: Record<string, Record<string, [string, number] | null>>;
  aspects_ws21_colour: Record<string, Record<string, string>>;
  shadbala_ws14: { IshtaKashta: Record<string, [number, number]>; Dominance: Record<string, number>; Func: Record<string, string> };
}

const PL_SIGN = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

describe.skipIf(!have)('PL 7.0.1 worksheets of the private oracle chart', () => {
  let o: Oracle, chart: ChartResult, swe: SwissEph;
  beforeAll(async () => {
    swe = await bootNode();
    o = JSON.parse(readFileSync(FILE, 'utf8')) as Oracle;
    const [y, m, d] = o.input.date as [number, number, number];
    const [h, mi, s] = o.input.time as [number, number, number];
    chart = cast(swe, {
      date: { y, m, d }, time: { h, mi, s }, tzHours: o.input.tz, dstHours: 0,
      place: { name: 'oracle', latDeg: o.input.latDeg, lonDeg: o.input.lonDeg }, profileId: 'pl7',
    });
  });

  // PL 7 carries the Moon-vector planet error (PLAN §1 non-goals): its Sun … Saturn are off
  // (here Su 7′21″, Me 4′19″), so parity is judged on the Moon and the nodes only. The aspect
  // and lordship worksheets below still agree cell for cell.
  it('Moon and nodes agree with worksheet 1 to the arcsecond', () => {
    for (const id of ['Mo', 'Ra', 'Ke', 'As'] as const) {
      const [sg, dms] = o.positions[id].split(' ') as [string, string];
      const [dd, mm, ss] = dms.split(':').map(Number) as [number, number, number];
      const want = PL_SIGN.indexOf(sg) * 108000 + dd * 3600 + mm * 60 + ss;
      const got = id === 'As' ? chart.asc.lon : chart.bodies[id].lon;
      // The place is known to the arcminute only; 1′ of longitude moves the ascendant ≈ 1′.
      expect(Math.abs(got - want), id).toBeLessThanOrEqual(id === 'As' ? 60 : 1);
    }
  });

  it('aspect matrix (worksheet 21): all 72 fractions, virupas and cell colours', () => {
    const m = aspectMatrix(chart);
    for (const t of PLANETS) for (const a of PLANETS) {
      const want = o.aspects_ws21[t]![a];
      if (!want) { expect(m[t][a]).toBeNull(); continue; }
      expect(m[t][a], `${a} on ${t}`).toEqual({ fraction: want[0], virupas: want[1], relation: o.aspects_ws21_colour[t]![a] });
    }
  });

  it('Lordships worksheet: D1, D9, D10 lords, placements and exchanges', () => {
    for (const v of ['D1', 'D9', 'D10'] as const) {
      const l = lordships(chart, v);
      for (const r of l.rows) {
        const [placed, lord, ex] = o.lordships[v]![String(r.house)]!;
        expect([r.lordIn, r.lord, r.exchangeWith !== null], `${v} house ${r.house}`).toEqual([placed, lord, ex === 'exchange']);
      }
    }
  });

  const plLons = (): Lons => {
    const out = {} as Lons;
    for (const [id, txt] of Object.entries(o.positions)) {
      const [sg, dms] = txt.split(' ') as [string, string];
      const [dd, mm, ss] = dms.split(':').map(Number) as [number, number, number];
      out[id as keyof Lons] = PL_SIGN.indexOf(sg) * 30 + dd + mm / 60 + ss / 3600;
    }
    return out;
  };

  it("worksheet 14 Domin.: all nine planets to two decimals (PL's own positions)", () => {
    const d = dominance(plLons());
    for (const p of PLANETS) expect(d[p].toFixed(2), p).toBe(o.shadbala_ws14.Dominance[p]!.toFixed(2));
  });

  it('worksheet 14 Func.: all nine, nodes by the nearest planet in their sign or their house', () => {
    const s = strengths(swe, chart);
    const word: Record<string, string> = { Malefic: 'Malef', Benefic: 'Benef', Neutral: 'Neutr' };
    for (const p of PLANETS) expect(word[s.planets[p].functional], p).toBe(o.shadbala_ws14.Func[p]);
  });

  it('worksheet 14 IshKas: Su, Mo, Sa exact; Ma–Ve within 2 virupas (cheshta epochs)', () => {
    const s = strengths(swe, chart);
    const lon = { As: chart.asc.lonDeg } as Lons;
    for (const p of PLANETS) lon[p] = chart.bodies[p].lonDeg;
    const ik = ishtaKashta(lon, s.breakdown.shadbala, chart.moment.ayanamsaDeg);
    for (const p of GRAHAS7) {
      const [i, k] = o.shadbala_ws14.IshtaKashta[p]!;
      const tol = p === 'Su' || p === 'Mo' || p === 'Sa' ? 0 : 2;
      expect(Math.abs(ik[p].ishta - i), `${p} ishta ${ik[p].ishta} vs ${i}`).toBeLessThanOrEqual(tol);
      expect(Math.abs(ik[p].kashta - k), `${p} kashta ${ik[p].kashta} vs ${k}`).toBeLessThanOrEqual(tol);
    }
  });
});

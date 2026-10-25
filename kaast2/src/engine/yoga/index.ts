/** PL 7's 1001 yogas for a chart: which are present, absent or not evaluated. */
import type { ChartResult } from '../types';
import type { Page1Strengths } from '../strength';
import rules from './plYogaRules.json';
import { evaluateYoga, type Cond, type YogaOutcome } from './evaluate';

export interface YogaRule { id: number; name: string; category: string; polarity: 'positive' | 'negative' | 'mixed'; formula: string; cond: Cond; decodable: boolean }
export const PL_YOGAS = rules as unknown as YogaRule[];

export interface YogaResult { rule: YogaRule; outcome: YogaOutcome; reason?: string }

export function plYogas(chart: ChartResult, strength: Page1Strengths | null, female: boolean | null, weekday: number | null = null): YogaResult[] {
  return PL_YOGAS.map((rule) => ({ rule, ...evaluateYoga(rule.cond, { chart, strength, female, weekday }) }));
}

/** Textbook yogas the boss asked for that PL's database lacks (pl_yogas.md §5); conjunction = same sign, as in PL. */
export interface ExtraYoga { id: string; name: string; present: boolean; text: string; source: string }
export function textbookYogas(chart: ChartResult): ExtraYoga[] {
  const s = (p: 'Ma' | 'Ju' | 'Ra' | 'Ke') => Math.floor(chart.bodies[p].lonDeg / 30);
  return [
    { id: 'angaraka', name: 'Angaraka Yoga', present: s('Ma') === s('Ra') || s('Ma') === s('Ke'), text: 'Mars joined with Rahu (some texts also Ketu): anger, accidents, sudden events.', source: 'Textbook; not in PL 7’s database' },
    { id: 'guru-chandala', name: 'Guru-Chandala Yoga', present: s('Ju') === s('Ra') || s('Ju') === s('Ke'), text: 'Jupiter joined with Rahu (some texts also Ketu): unorthodox beliefs, trouble from teachers or advisers.', source: 'Textbook; not in PL 7’s database' },
  ];
}

/** A divisional chart as a chart (Astro-Amriit extension; PL evaluates yogas on the Rasi only): each body keeps its in-sign degree. */
export function vargaAsChart(chart: ChartResult, sign: (arcsec: number) => number): ChartResult {
  const move = <T extends { lon: number; lonDeg: number }>(b: T): T => {
    const deg = b.lonDeg % 30, s = sign(b.lon);
    return { ...b, lonDeg: s * 30 + deg, lon: Math.round((s * 30 + deg) * 3600) };
  };
  const bodies = Object.fromEntries(Object.entries(chart.bodies).map(([k, b]) => [k, move(b)])) as ChartResult['bodies'];
  return { ...chart, bodies, asc: move(chart.asc) };
}

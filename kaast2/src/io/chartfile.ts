/**
 * Astro-Amriit's own chart file (`*.astro-amriit.json`): the exact input, versioned,
 * so a chart reopens identically. Settings overrides are saved with it.
 */
import { PROFILES, type ChartInput } from '../engine';

export const CHART_FORMAT = 'astro-amriit-chart';
/** Format id written by v0.1 (when the app was called KAAST 2). */
const LEGACY_FORMATS = ['kaast2-chart'];
export const CHART_VERSION = 1;

export function toChartFile(input: ChartInput): string {
  return JSON.stringify({ format: CHART_FORMAT, version: CHART_VERSION, input }, null, 2);
}

export function parseChartFile(text: string): ChartInput {
  let doc: unknown;
  try { doc = JSON.parse(text); } catch { throw new Error('This file is not a Astro-Amriit chart (not JSON).'); }
  const d = doc as { format?: string; version?: number; input?: ChartInput };
  if (d?.format !== CHART_FORMAT && !LEGACY_FORMATS.includes(d?.format ?? '')) throw new Error('This file is not a Astro-Amriit chart.');
  if (d.version !== CHART_VERSION) throw new Error(`Chart file version ${d.version} is not supported by this app.`);
  const i = d.input!;
  const finite = (...xs: unknown[]) => xs.every((x) => typeof x === 'number' && Number.isFinite(x));
  if (!i || !finite(i.date?.y, i.date?.m, i.date?.d, i.time?.h, i.time?.mi, i.time?.s, i.tzHours, i.dstHours, i.place?.latDeg, i.place?.lonDeg)
    || !(i.profileId in PROFILES)) {
    throw new Error('The chart file is incomplete or damaged.');
  }
  return i;
}

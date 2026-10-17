/**
 * Delta-T (TT − UT) models, in seconds. Selected per profile.
 *   swiss     — Swiss Ephemeris 2.10.03 modern model (passed in by the caller).
 *   pl7       — PL7's DELTAT.ASC (1800–1993, half-yearly), then the transit-cache
 *               fit: linear to 83.0 s at 2020.0, +0.89 s/yr after (report §Delta-T, NUM).
 *   solarfire — Solar Fire v9 anchors recovered by Kala Chakra (knowledge/03).
 */
import { decimalYear } from './julian';
import pl7 from './deltat_pl7.json';

export type DeltaTModel = 'swiss' | 'pl7' | 'solarfire';

const PL7_TABLE = pl7.table as [number, number][];
const PL7_2020 = 83.0;
const PL7_RATE = 0.89;

function interpolate(table: readonly (readonly [number, number])[], y: number): number {
  for (let i = 0; i + 1 < table.length; i++) {
    const [y0, d0] = table[i]!, [y1, d1] = table[i + 1]!;
    if (y >= y0 && y <= y1) return d0 + ((d1 - d0) * (y - y0)) / (y1 - y0);
  }
  throw new RangeError(`year ${y} outside table`);
}

/** PL7 curve; returns null before 1800 (PL7 behaviour unknown there). */
export function deltaTpl7(jdUT: number): number | null {
  const y = decimalYear(jdUT);
  const first = PL7_TABLE[0]!, last = PL7_TABLE[PL7_TABLE.length - 1]!;
  if (y < first[0]) return null;
  if (y <= last[0]) return interpolate(PL7_TABLE, y);
  if (y <= 2020) return last[1] + ((PL7_2020 - last[1]) * (y - last[0])) / (2020 - last[0]);
  return PL7_2020 + PL7_RATE * (y - 2020);
}

const SF_ANCHORS: readonly (readonly [number, number])[] = [
  [2019.29, 76.28], [2021.37, 79.33], [2022.98, 80.86], [2023.2, 82.44],
  [2023.61, 82.4], [2024.0, 83.96], [2024.54, 83.98], [2026.51, 87.5],
];

/** Solar Fire v9 curve, ±1 s/yr outside the anchors (Kala Chakra ephemeris.js). */
export function deltaTsolarFire(jdUT: number): number {
  const y = decimalYear(jdUT);
  const a = SF_ANCHORS;
  const first = a[0]!, last = a[a.length - 1]!;
  if (y <= first[0]) return first[1] - (first[0] - y);
  if (y >= last[0]) return last[1] + (y - last[0]);
  return interpolate(a, y);
}

export function deltaTseconds(model: DeltaTModel, jdUT: number, swissSeconds: () => number): number {
  if (model === 'solarfire') return deltaTsolarFire(jdUT);
  if (model === 'pl7') return deltaTpl7(jdUT) ?? swissSeconds();
  return swissSeconds();
}

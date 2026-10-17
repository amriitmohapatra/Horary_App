/** Chart entries (what each sign region of an East Indian chart lists), shared by every page. */
import { houseOfSign, type PointRow } from '../engine/page1';
import type { PointId } from '../engine/types';
import { SIGNS } from '../engine/zodiac';
import type { ChartEntry } from './components/EastIndianChart';
import { dm } from './format';

export const signRow = (s: number, asc: number): ChartEntry => ({
  key: `sign${s}`,
  parts: [{ text: SIGNS[s]!, tone: 'sign' }, { text: ` ${houseOfSign(s, asc)}`, tone: 'house' }],
});

export function rasiEntries(rasi: PointRow[][], asc: number): ChartEntry[][] {
  return rasi.map((rows, s) => [
    signRow(s, asc),
    ...rows.map((r) => ({
      key: r.id,
      parts: [
        { text: r.id, tone: r.id, bold: true },
        ...(r.retrograde ? [{ text: 'R', tone: r.id }] : []),
        { text: ` ${dm(r.deg, r.min)} ` },
        { text: r.nakshatraAbbr, tone: 'muted' },
      ],
    })),
  ]);
}

export function vargaEntries(groups: PointId[][], rows: PointRow[], asc: number): ChartEntry[][] {
  const retro = new Set(rows.filter((r) => r.retrograde).map((r) => r.id));
  return groups.map((ids, s) => {
    const lines: ChartEntry[] = [signRow(s, asc)];
    for (let i = 0; i < ids.length; i += 3) {
      const chunk = ids.slice(i, i + 3);
      lines.push({
        key: chunk.join(''),
        parts: chunk.flatMap((id, j) => [
          { text: (j ? ' ' : '') + id, tone: id, bold: true },
          ...(retro.has(id) ? [{ text: 'R', tone: id }] : []),
        ]),
      });
    }
    return lines;
  });
}


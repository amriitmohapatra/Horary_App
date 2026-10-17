/**
 * The varga signs the strength rules need — local copies, STD Parashari
 * (PL7's own routines BIN 0x57d207, 0x57d2f3, 0x57d647, 0x57d6b1; spec §3.4, §4.1),
 * ported from oracle d2/d3/d7/d9/d12/d30. Input: exact sidereal degrees;
 * output: sign 0 = Aries … 11 = Pisces.
 *
 * TODO(slice 3): point these at the shared registry src/engine/varga/rules.ts
 * once it lands (being written in parallel); keep them bit-identical.
 */
import { sgn } from './common';

/** Parashari hora: odd signs Leo then Cancer, even signs Cancer then Leo. */
export function d2(l: number): number {
  const s = sgn(l), d = l % 30;
  const odd = s % 2 === 0;
  return (odd && d < 15) || (!odd && d >= 15) ? 4 : 3;
}
/** Drekkana 1/5/9. */
export const d3 = (l: number): number => (sgn(l) + 4 * Math.floor((l % 30) / 10)) % 12;
/** Saptamsha (cyclic, equals the odd/even Parashari rule). */
export const d7 = (l: number): number => sgn(7 * l);
/** Navamsha (cyclic). */
export const d9 = (l: number): number => sgn(9 * l);
/** Dwadashamsha, counted from the sign itself. */
export const d12 = (l: number): number => (sgn(l) + Math.floor((l % 30) / 2.5)) % 12;

const D30_ODD: readonly (readonly [number, number])[] = [[5, 0], [10, 10], [18, 8], [25, 2], [30, 6]];
const D30_EVEN: readonly (readonly [number, number])[] = [[5, 1], [12, 5], [20, 11], [25, 9], [30, 7]];
/** Parashari trimshamsha. */
export function d30(l: number): number {
  const d = l % 30;
  const tab = sgn(l) % 2 === 0 ? D30_ODD : D30_EVEN;
  for (const [lim, sign] of tab) if (d < lim) return sign;
  return tab[tab.length - 1]![1];
}

export type VargaName = 'D1' | 'D2' | 'D3' | 'D7' | 'D9' | 'D12' | 'D30';
/** Saptavarga (saptavargaja bala, varga codes 1, 2, 3, 5, 6, 8, 13). */
export const VARGA7: readonly (readonly [VargaName, (l: number) => number])[] = [
  ['D1', sgn], ['D2', d2], ['D3', d3], ['D7', d7], ['D9', d9], ['D12', d12], ['D30', d30],
];
/** Shadvarga with Vimshopaka weights (sum 20) — the scheme the PL9 fixture fits (§3.4, NUM). */
export const SHADVARGA: readonly (readonly [VargaName, (l: number) => number, number])[] = [
  ['D1', sgn, 6], ['D2', d2, 2], ['D3', d3, 4], ['D9', d9, 5], ['D12', d12, 2], ['D30', d30, 1],
];

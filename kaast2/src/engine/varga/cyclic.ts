/**
 * Cyclic varga rule — grade BIN.
 * Source: PL7.exe fcn.0057d1e1 (called from the varga dispatcher fcn.0057d9cf):
 * varga longitude = n·λ mod 360°, n from the divisor byte table at 0x5f47b8.
 * PL7 uses it for list positions 5, 6, 9, 10, 12, 21, 22, 24–29
 * (D7 D9 D16 D20 D27 D150 and the cyclic alternates of D2 D3 D4 D10 D12 D30 D5).
 *
 * sign of D-n = floor(n·λ / 30°) mod 12, exact on integer arcseconds; amsas are
 * half-open [from, to) in the rasi longitude (invariant 1).
 * D9 (Navamsha) is the Page 1 varga; the full registry is in rules.ts.
 */
import type { Arcsec } from '../types';
import { SIGN, norm } from '../zodiac';

export function cyclicVargaSign(a: Arcsec, n: number): number {
  return Math.floor((norm(a) * n) / SIGN) % 12;
}

export const navamshaSign = (a: Arcsec): number => cyclicVargaSign(a, 9);

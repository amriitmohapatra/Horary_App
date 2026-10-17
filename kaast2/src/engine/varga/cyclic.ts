/**
 * Cyclic varga rule: sign of D-n = floor(n·λ / 30°) mod 12 (PL7 report §vargas, BIN).
 * Exact on integer arcseconds. D9 (Navamsha) is the Page 1 varga; the
 * sign-dependent rules arrive in slice 3.
 */
import type { Arcsec } from '../types';
import { SIGN, norm } from '../zodiac';

export function cyclicVargaSign(a: Arcsec, n: number): number {
  return Math.floor((norm(a) * n) / SIGN) % 12;
}

export const navamshaSign = (a: Arcsec): number => cyclicVargaSign(a, 9);

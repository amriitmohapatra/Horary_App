/** Zodiac constants and integer-arcsecond helpers (invariant 1). */
import type { Arcsec, PlanetId } from './types';

export const ZODIAC: Arcsec = 1_296_000;
export const SIGN: Arcsec = 108_000;
export const NAKSHATRA: Arcsec = 48_000;
export const PADA: Arcsec = 12_000;

export const SIGNS = ['Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'] as const;
export type SignId = (typeof SIGNS)[number];

/** Lord of each sign, index 0 = Aries. */
export const SIGN_LORD: readonly PlanetId[] = ['Ma', 'Ve', 'Me', 'Mo', 'Su', 'Me', 'Ve', 'Ma', 'Ju', 'Sa', 'Sa', 'Ju'];

export const VIM_ORDER: readonly PlanetId[] = ['Ke', 'Ve', 'Su', 'Mo', 'Ma', 'Ra', 'Ju', 'Sa', 'Me'];
export const VIM_YEARS: Readonly<Record<PlanetId, number>> = { Ke: 7, Ve: 20, Su: 6, Mo: 10, Ma: 7, Ra: 18, Ju: 16, Sa: 19, Me: 17 };

export const norm = (a: Arcsec): Arcsec => ((a % ZODIAC) + ZODIAC) % ZODIAC;
export const normDeg = (d: number): number => ((d % 360) + 360) % 360;

/** 0 = Aries … 11 = Pisces. */
export const signIndex = (a: Arcsec): number => Math.floor(norm(a) / SIGN);
/** 0 = Ashwini … 26 = Revati. */
export const nakshatraIndex = (a: Arcsec): number => Math.floor(norm(a) / NAKSHATRA);
/** 1 … 4. */
export const pada = (a: Arcsec): number => Math.floor((norm(a) % NAKSHATRA) / PADA) + 1;

/** Degrees → integer arcseconds, by profile rule. */
export function toArcsec(deg: number, rounding: 'round' | 'truncate'): Arcsec {
  const s = normDeg(deg) * 3600;
  return norm(rounding === 'round' ? Math.round(s) : Math.floor(s));
}

/** Split an in-sign position into d, m, s. */
export function dmsInSign(a: Arcsec): { d: number; m: number; s: number } {
  const r = norm(a) % SIGN;
  return { d: Math.floor(r / 3600), m: Math.floor((r % 3600) / 60), s: r % 60 };
}

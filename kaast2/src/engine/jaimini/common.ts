/**
 * Sign arithmetic shared by the Jaimini modules (STD; no PL-specific rule
 * lives here). Signs are indices 0 = Aries … 11 = Pisces throughout, as in
 * zodiac.ts. "House n from s" counts inclusively: the 1st from s is s.
 */
import type { PlanetId, PointId } from '../types';

export const mod12 = (x: number): number => ((x % 12) + 12) % 12;

/** The n-th sign from `s`, counted forward (n = 1 is `s` itself). */
export const nthFrom = (s: number, n: number): number => mod12(s + n - 1);

/** The n-th sign from `s`, counted backward (the 2nd backward from Aries is Pisces). */
export const nthBackFrom = (s: number, n: number): number => mod12(s - (n - 1));

/** Inclusive forward count from `from` to `to` (same sign = 1, next sign = 2 … 12). */
export const countFrom = (from: number, to: number): number => mod12(to - from) + 1;

/** Odd sign in the 1-based sense (Aries, Gemini, …) ⇔ even index. */
export const isOddSign = (s: number): boolean => mod12(s) % 2 === 0;

/** 0 movable (chara), 1 fixed (sthira), 2 dual (dwiswabhava). */
export const modality = (s: number): 0 | 1 | 2 => (mod12(s) % 3) as 0 | 1 | 2;

/** Sign placements of a chart (any varga): point → sign index. */
export type SignMap = Partial<Record<PointId, number>>;

export const isNode = (p: PlanetId): boolean => p === 'Ra' || p === 'Ke';

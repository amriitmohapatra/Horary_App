/**
 * Sign-dependent varga rules — grade BIN for every rule in this file.
 *
 * Source: PL7.exe (sha256 e530a346…35f9), varga dispatcher fcn.0057d9cf, a
 * 31-way jump table at 0x57db65 indexed by PL list position. Each routine
 * receives (d = degrees in the sign, s = sign 1…12) and returns the varga
 * longitude in degrees; the caller takes its sign with fcn.0057d1b3.
 * Disassembled with capstone; literal float port and fixture:
 * kaast2/oracle/vargas_pl7_bin.py → tests/fixtures/varga_pl7_bin.json.
 * The PL7 report (Astro_Fork/PL7_Reverse_Engineering_Report, features.tex
 * §"Divisional charts", scripts/pl7_vargas.py) decoded D6 D8 D10 D11 D11-alt
 * D16-alt D24; the others (D2 D2-alt2 D3 D4 D5 D12 D30 D40 D45 D60) were
 * decoded for slice 3 from the same dispatcher.
 *
 * Integer form. With r = arcseconds within the sign and s0 = sign index
 * (0 = Aries), every routine is "start sign ± amsa index", where the amsa
 * index is k = floor(n·r / 108000″) — except D30, whose parts are unequal.
 * Amsas are half-open [from, to) in the RASI longitude (invariant 1): the
 * arcsecond on a boundary belongs to the amsa that begins there. This is what
 * PL computes for any longitude that is not exactly on a boundary, including
 * the backward-counting rules (D11-alt, D16-alt in even signs), where PL's own
 * float formula is half-open the other way round at the exact boundary.
 *
 * PL7 measure-zero quirks deliberately NOT reproduced (they need a longitude
 * exactly on a boundary as a double): D2 odd sign at exactly 15° gives Virgo
 * (test `d > 15`, then 2d+120 = 150°); D30 tests `d > 5, 10, 18, 25` (limits
 * go to the lower part); the normaliser fcn.0045b106 leaves 360° unfolded,
 * so fcn.0057d1b3 would return sign 13; D45 multiplies by 1.50000000015.
 * Also noted, not needed for signs: D5 and D30 return the degree within the
 * varga sign scaled by 0.2 instead of ×n (the D5/D30 degrees PL7 shows are
 * not n·d mod 30).
 */
import type { Arcsec } from '../types';
import { SIGN, norm } from '../zodiac';

const mod12 = (x: number): number => ((x % 12) + 12) % 12;
/** Sign index of the rasi, 0 = Aries. */
const s0of = (a: Arcsec): number => Math.floor(norm(a) / SIGN);
/** Arcseconds within the sign, 0 … 107 999. */
const inSign = (a: Arcsec): number => norm(a) % SIGN;
/** Odd sign in the 1-based sense (Aries, Gemini, …) ⇔ even index. */
const isOdd = (s0: number): boolean => s0 % 2 === 0;
/** 0 movable, 1 fixed, 2 dual. */
const modality = (s0: number): number => s0 % 3;

/** Amsa index 0 … n−1 of a longitude in a D-n varga (half-open, integer). */
export function amsaIndex(a: Arcsec, n: number): number {
  return Math.floor((inSign(a) * n) / SIGN);
}

type Rule = (s0: number, k: number) => number;
const byAmsa = (n: number, rule: Rule) => (a: Arcsec): number => mod12(rule(s0of(a), amsaIndex(a, n)));

/** D2 Hora, fcn.0057d207: odd signs Leo then Cancer, even signs Cancer then Leo (BPHS). */
export const horaSign = byAmsa(2, (s0, k) => (isOdd(s0) ? 4 - k : 3 + k));

/** D2 alternate, list position 23, fcn.0057d260: odd signs the 7th then the sign; even signs the sign then the 7th. */
export const horaAlt2Sign = byAmsa(2, (s0, k) => (isOdd(s0) ? s0 + 6 * (1 - k) : s0 + 6 * k));

/** D3 Drekkana, fcn.0057d2f3: the sign, the 5th, the 9th (BPHS). */
export const drekkanaSign = byAmsa(3, (s0, k) => s0 + 4 * k);

/** D4 Chaturthamsha, fcn.0057d350: the sign, the 4th, 7th, 10th (BPHS). */
export const chaturthamshaSign = byAmsa(4, (s0, k) => s0 + 3 * k);

const D5_ODD = [0, 10, 8, 2, 6] as const; // Ar Aq Sg Ge Li (Ma Sa Ju Me Ve)
const D5_EVEN = [1, 5, 11, 9, 7] as const; // Ta Vi Pi Cp Sc (Ve Me Ju Sa Ma)
/** D5 Panchamsha (Tajika), fcn.0057d397: odd Ar Aq Sg Ge Li, even Ta Vi Pi Cp Sc. */
export const panchamshaSign = byAmsa(5, (s0, k) => (isOdd(s0) ? D5_ODD[k]! : D5_EVEN[k]!));

/** D6 Shashtamsha (Tajika), fcn.0057d4dc: odd signs from Aries, even signs from Libra. */
export const shashtamshaSign = byAmsa(6, (s0, k) => (isOdd(s0) ? k : 6 + k));

/** D8 Ashtamsha (Tajika), fcn.0057d510: movable from Aries, fixed from Sagittarius, dual from Leo. */
export const ashtamshaSign = byAmsa(8, (s0, k) => [0, 8, 4][modality(s0)]! + k);

/** D10 Dashamsha, fcn.0057d55c: odd signs from the sign, even signs from the 9th (BPHS). */
export const dashamshaSign = byAmsa(10, (s0, k) => s0 + (isOdd(s0) ? 0 : 8) + k);

/** D11 Ekadashamsha (Tajika), fcn.0057d5a6: (11d/30 + 1 − s)·30, i.e. 11λ cyclic from Aries. */
export const ekadashamshaSign = byAmsa(11, (s0, k) => k - s0);

/** D11 alternate, list position 31, fcn.0057d5d6: (1 − 11d/30)·30 — every sign starts at Aries and counts backwards. */
export const ekadashamshaAltSign = byAmsa(11, (_s0, k) => -k);

/** D12 Dwadashamsha, fcn.0057d647: from the sign itself (BPHS). */
export const dwadashamshaSign = byAmsa(12, (s0, k) => s0 + k);

/** D16 alternate, list position 30, fcn.0057d5fb: odd signs forwards from the sign; even signs backwards from the 4th. */
export const shodashamshaAltSign = byAmsa(16, (s0, k) => (isOdd(s0) ? s0 + k : s0 + 3 - k));

/** D24 Chaturvimshamsha, fcn.0057d675: odd signs from Leo, even signs from Cancer (BPHS). */
export const chaturvimshamshaSign = byAmsa(24, (s0, k) => (isOdd(s0) ? 4 : 3) + k);

/** D30 parts in arcseconds within the sign: [upper limit, varga sign]. */
const D30_ODD: readonly (readonly [number, number])[] = [
  [5 * 3600, 0], [10 * 3600, 10], [18 * 3600, 8], [25 * 3600, 2], [30 * 3600, 6], // Ma Sa Ju Me Ve
];
const D30_EVEN: readonly (readonly [number, number])[] = [
  [5 * 3600, 1], [12 * 3600, 5], [20 * 3600, 11], [25 * 3600, 9], [30 * 3600, 7], // Ve Me Ju Sa Ma
];
/** D30 Trimshamsha, fcn.0057d6b1: odd 5°Ar 5°Aq 8°Sg 7°Ge 5°Li; even 5°Ta 7°Vi 8°Pi 5°Cp 5°Sc (BPHS). */
export function trimshamshaSign(a: Arcsec): number {
  const r = inSign(a);
  for (const [to, sign] of isOdd(s0of(a)) ? D30_ODD : D30_EVEN) if (r < to) return sign;
  throw new Error('unreachable: arcsec within sign ≥ 30°');
}

/** D40 Khavedamsha, fcn.0057d7ea: odd signs from Aries, even signs from Libra (BPHS). */
export const khavedamshaSign = byAmsa(40, (s0, k) => (isOdd(s0) ? 0 : 6) + k);

/** D45 Akshavedamsha, fcn.0057d81e: movable from Aries, fixed from Leo, dual from Sagittarius (BPHS). */
export const akshavedamshaSign = byAmsa(45, (s0, k) => [0, 4, 8][modality(s0)]! + k);

/** D60 Shashtiamsha, fcn.0057d86a: (2d + s − 1)·30 — from the sign itself (BPHS). */
export const shashtiamshaSign = byAmsa(60, (s0, k) => s0 + k);

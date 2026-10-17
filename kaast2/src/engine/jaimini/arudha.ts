/**
 * Arudha padas (bhava padas) A1 … A12 and the upapada, for the sign
 * placements of any varga (D1, D9, D10 …).
 *
 * Rules and grades
 *  - Count from the house to its lord, then as many signs again from the lord
 *    (DOC: PL7 manual p. 222 glossary "Padas"; BPHS ch. 29 v. 1-3).
 *  - Exceptions, two documented readings (variants):
 *    'bphs' (default) — BPHS ch. 29 v. 4-5 as bundled with PL7
 *      (CHAP/CHAP29.TXT): "The same bhava or the 7th from it does not become
 *      its Pad. When the Pad falls in the same bhava, the 10th there from be
 *      treated as its Pad ... when the 7th becomes the Pad of a bhava, the 4th
 *      from the original bhava". So lord in the 1st or 7th → 10th; lord in the
 *      4th or 10th → 4th. (PVR Narasimha Rao / PyJHora give the same signs:
 *      "10th from the pada" when it falls in the 1st or 7th.)
 *    'tutorial' — PL7 tutorial Extras1/pib11755: "when the Lord of the 1st is
 *      in the 4th or 7th ... the 4th house becomes the Arudha Lagna ... when the
 *      Lord of the 1st is in the 1st ... the 10th". Differs from 'bphs' only
 *      for the lord in the 7th (4th instead of 10th); the lord in the 10th is
 *      not mentioned and keeps the BPHS reading (4th).
 *    'none' — the bare count, no exception (reference only).
 *    Which one PL's engine applies is OPEN (features.tex §Jaimini).
 *  - Lord of Scorpio / Aquarius (co-lords Ketu / Rahu): 'single' (default:
 *    Mars, Saturn — the lordship used everywhere else in the engine) or
 *    'stronger' (BPHS 29.6-7 "if a rashi is owned by two grahas, consider the
 *    stronger"; strength rules after PVR Narasimha Rao as implemented by
 *    PyJHora house._stronger_planet_new — STD): (0) if one co-lord occupies
 *    the sign and the other does not, take the other; (1) more planets (not
 *    the lagna) in its sign; (2) more of Jupiter, Mercury and its dispositor
 *    (each counted once) conjoining or rashi-aspecting it; (3) exalted
 *    (Ma Cp, Sa Li, Ra Ta/Ge, Ke Sc/Sg); (4) dual > fixed > movable sign;
 *    (5) more degrees in its sign. PL's choice is OPEN. Known differences
 *    from PyJHora 4.8.7 (its quirks, not followed): it counts the lagna as a
 *    co-tenant in rule 1, and in rule 2 compares the dispositor's planet id
 *    with the sign index instead of the dispositor's sign.
 *  - Upapada = pada of the 12th house (DOC: glossary "Upapada", manual p. 230
 *    "generally considered as the pada of the 12th house, though there are
 *    different views"; BPHS ch. 30).
 */
import type { Arcsec, PlanetId, PointId } from '../types';
import { PLANETS } from '../types';
import { SIGN, SIGN_LORD, norm } from '../zodiac';
import { countFrom, modality, mod12, nthFrom, type SignMap } from './common';
import { aspectsSign } from './drishti';

export type ArudhaVariant = 'bphs' | 'tutorial' | 'none';
export type CoLordRule = 'single' | 'stronger';

export interface ArudhaOptions {
  variant?: ArudhaVariant;
  coLords?: CoLordRule;
  /** Longitudes (any varga, integer arcseconds) for rule 5 of 'stronger'. */
  lonOf?: Partial<Record<PlanetId, Arcsec>>;
}

/** Pada sign of a house sign whose lord sits in `lordSign`. */
export function padaOf(houseSign: number, lordSign: number, variant: ArudhaVariant = 'bphs'): number {
  const n = countFrom(houseSign, lordSign); // lord in the n-th from the house
  const raw = nthFrom(lordSign, n);
  if (variant === 'none') return raw;
  if (variant === 'tutorial' && n === 7) return nthFrom(houseSign, 4);
  const k = countFrom(houseSign, raw);
  if (k === 1) return nthFrom(houseSign, 10);
  if (k === 7) return nthFrom(houseSign, 4);
  return raw;
}

const EXALTED: Partial<Record<PlanetId, readonly number[]>> = { Ma: [9], Sa: [6], Ra: [1, 2], Ke: [7, 8] };

/** Stronger of two co-lords of `sign` (PVR rules 0-5, see header). */
export function strongerCoLord(sign: number, p1: PlanetId, p2: PlanetId, signOf: SignMap,
  lonOf?: Partial<Record<PlanetId, Arcsec>>): PlanetId {
  const s1 = signOf[p1], s2 = signOf[p2];
  if (s1 === undefined || s2 === undefined) return p1;
  if (s1 === sign && s2 !== sign) return p2;
  if (s2 === sign && s1 !== sign) return p1;
  const planetsIn = (s: number) => PLANETS.filter((p) => signOf[p] === s).length - 1;
  let d = planetsIn(s1) - planetsIn(s2);
  if (d) return d > 0 ? p1 : p2;
  const assoc = (s: number) => {
    const helpers = [...new Set<PlanetId>(['Ju', 'Me', SIGN_LORD[s]!])];
    return helpers.filter((h) => { const hs = signOf[h]; return hs !== undefined && (hs === s || aspectsSign(hs, s)); }).length;
  };
  d = assoc(s1) - assoc(s2);
  if (d) return d > 0 ? p1 : p2;
  const ex1 = EXALTED[p1]?.includes(s1) ?? false, ex2 = EXALTED[p2]?.includes(s2) ?? false;
  if (ex1 !== ex2) return ex1 ? p1 : p2;
  d = modality(s1) - modality(s2);
  if (d) return d > 0 ? p1 : p2;
  const l1 = lonOf?.[p1], l2 = lonOf?.[p2];
  if (l1 !== undefined && l2 !== undefined) return norm(l1) % SIGN >= norm(l2) % SIGN ? p1 : p2;
  return p1;
}

/** Lord of a sign under the co-lord rule. */
export function lordOf(sign: number, signOf: SignMap, opts: ArudhaOptions = {}): PlanetId {
  const s = mod12(sign);
  const classical = SIGN_LORD[s]!;
  if (opts.coLords !== 'stronger') return classical;
  if (s === 7) return strongerCoLord(s, 'Ma', 'Ke', signOf, opts.lonOf);
  if (s === 10) return strongerCoLord(s, 'Sa', 'Ra', signOf, opts.lonOf);
  return classical;
}

export interface ArudhaResult {
  /** A1 … A12 (index 0 = A1 = arudha lagna), sign indices. */
  padas: number[];
  /** Upapada = A12. */
  upapada: number;
  /** The lord used for each house. */
  lords: PlanetId[];
}

/**
 * Arudha padas of the 12 houses counted from `ascSign` in a chart given as
 * sign placements (any varga). `signOf` must hold the lords' signs.
 */
export function arudhaPadas(signOf: SignMap, ascSign: number, opts: ArudhaOptions = {}): ArudhaResult {
  const variant = opts.variant ?? 'bphs';
  const padas: number[] = [];
  const lords: PlanetId[] = [];
  for (let h = 1; h <= 12; h++) {
    const hs = nthFrom(ascSign, h);
    const lord = lordOf(hs, signOf, opts);
    const ls = signOf[lord];
    if (ls === undefined) throw new Error(`arudhaPadas: no sign for ${lord}`);
    padas.push(padaOf(hs, ls, variant));
    lords.push(lord);
  }
  return { padas, upapada: padas[11]!, lords };
}

/** Sign placements from integer-arcsecond longitudes (D1), for arudhaPadas. */
export function signMapOf(lons: Partial<Record<PointId, Arcsec>>): SignMap {
  const out: SignMap = {};
  for (const [p, a] of Object.entries(lons) as [PointId, Arcsec][]) out[p] = Math.floor(norm(a) / SIGN);
  return out;
}

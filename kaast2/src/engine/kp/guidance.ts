/**
 * KP Guidance: the Readers' natal rules that a chart can test, written in
 * the app's own words with the book and page (catalogue references/KP/notes,
 * rule ids KP1-…KP6-). Rules are data (guidance/*.json) in a small condition
 * language evaluated here, so every rule shown can be traced to the
 * condition that fired it. Left out on purpose, as on the NTP page: death,
 * longevity, accidents, danger and disease prognosis; traditional rules the
 * Readers quote only to reject are shown as "tradition" (tone info).
 *
 * "Signifies" = Krishnamurti's significator sets with node agency
 * (significators.ts). "Connected with" a planet (B3 p. 154) = is that planet,
 * is in its star or sub, is in the same sign, or is aspected by it.
 */
import type { PlanetId } from '../types';
import type { KpModel } from './kp';
import { signAspects, type kpSignifications } from './significators';
import B1 from './guidance/b1.json';
import B2 from './guidance/b2.json';
import B3 from './guidance/b3.json';
import B4 from './guidance/b4.json';
import B5 from './guidance/b5.json';

export type GuidanceTone = 'good' | 'bad' | 'mixed' | 'info';

/** Topic headings, in page order (by house, then general principles). */
export const TOPICS = [
  'Self and temperament', 'Wealth and speech', 'Siblings, travel and writing', 'Home, property, vehicles and education',
  'Children, romance and speculation', 'Service, loans and competition', 'Marriage and partnership', 'Legacies and insurance',
  'Father, fortune, higher learning and abroad', 'Profession and status', 'Gains and friends', 'Expenses, residence abroad and spiritual life',
  'Principles of judgement',
] as const;
export type Topic = (typeof TOPICS)[number];

export type Cond =
  /** The sub lord of cusp `csl` signifies every house in `all` / at least one in `any` / none in `none`. */
  | { csl: number; all?: number[]; any?: number[]; none?: number[] }
  /** The sub lord of cusp `cslIs` is one of `planets`. */
  | { cslIs: number; planets: PlanetId[] }
  /** The sub lord of cusp `cslLinked` is connected with one of `planets`. */
  | { cslLinked: number; planets: PlanetId[] }
  /** Planet facts (all given keys must hold): house, sign (0 = Aries), star lord, sub lord, retrograde. */
  | { planet: PlanetId; house?: number[]; sign?: number[]; star?: PlanetId[]; sub?: PlanetId[]; retro?: boolean }
  /** Planet `sig` signifies all / any / none of the houses. */
  | { sig: PlanetId; all?: number[]; any?: number[]; none?: number[] }
  /** The two planets in one sign. */
  | { conj: [PlanetId, PlanetId] }
  /** Planet `aspects` (Parashari sign aspect) planet `target`. */
  | { aspects: PlanetId; target: PlanetId }
  /** Cusp `cusp` in sign(s) / star of / sub of. */
  | { cusp: number; sign?: number[]; star?: PlanetId[]; sub?: PlanetId[] }
  /** House `occupied` has at least one planet (or none, with `empty: true`). */
  | { occupied: number; empty?: boolean }
  | { allOf: Cond[] }
  | { anyOf: Cond[] }
  | { not: Cond };

export interface GuidanceRule {
  /** Catalogue id(s), e.g. "KP3-039". */
  id: string;
  /** Topic heading on the page (one of TOPICS). */
  topic: Topic;
  when: Cond;
  /** One or two sentences, the app's own words. */
  text: string;
  tone: GuidanceTone;
  /** Book and page(s), e.g. "B3 p. 152". */
  cite: string;
}

export interface GuidanceFinding { rule: GuidanceRule; because: string }

export const GUIDANCE_RULES: readonly GuidanceRule[] = [B1, B2, B3, B4, B5].flatMap((b) => (b as unknown as { rules: GuidanceRule[] }).rules);

type Sig = ReturnType<typeof kpSignifications>;
const NAMES: Record<PlanetId, string> = { Su: 'Sun', Mo: 'Moon', Ma: 'Mars', Me: 'Mercury', Ju: 'Jupiter', Ve: 'Venus', Sa: 'Saturn', Ra: 'Rahu', Ke: 'Ketu' };

/** Evaluate one condition; returns a short reason when it holds, null otherwise. */
export function holds(c: Cond, m: KpModel, sig: Sig): string | null {
  const P = (p: PlanetId) => m.planets.find((x) => x.id === p)!;
  const sigOf = (p: PlanetId) => sig.planets[p].all;
  const houseTest = (hs: number[], c2: { all?: number[]; any?: number[]; none?: number[] }) =>
    (!c2.all || c2.all.every((h) => hs.includes(h))) && (!c2.any || c2.any.some((h) => hs.includes(h))) && (!c2.none || !c2.none.some((h) => hs.includes(h)));
  const connected = (p: PlanetId, q: PlanetId) => {
    const a = P(p), b = P(q);
    return p === q || a.lords[0] === q || a.lords[1] === q || a.sign === b.sign || signAspects(q, b.sign, a.sign);
  };
  if ('csl' in c) {
    const sl = m.cusps[c.csl - 1]!.lords[1];
    return houseTest(sigOf(sl), c) ? `cusp ${c.csl} sub lord ${NAMES[sl]} signifies ${sigOf(sl).join(', ')}` : null;
  }
  if ('cslIs' in c) {
    const sl = m.cusps[c.cslIs - 1]!.lords[1];
    return c.planets.includes(sl) ? `cusp ${c.cslIs} sub lord is ${NAMES[sl]}` : null;
  }
  if ('cslLinked' in c) {
    const sl = m.cusps[c.cslLinked - 1]!.lords[1];
    const q = c.planets.find((x) => connected(sl, x));
    return q ? `cusp ${c.cslLinked} sub lord ${NAMES[sl]} is connected with ${NAMES[q]}` : null;
  }
  if ('planet' in c) {
    const p = P(c.planet);
    const ok = (!c.house || c.house.includes(p.house)) && (!c.sign || c.sign.includes(p.sign))
      && (!c.star || c.star.includes(p.lords[0])) && (!c.sub || c.sub.includes(p.lords[1]))
      && (c.retro === undefined || c.retro === p.retrograde);
    return ok ? `${NAMES[c.planet]} in house ${p.house}, star of ${NAMES[p.lords[0]]}, sub of ${NAMES[p.lords[1]]}${p.retrograde ? ', retrograde' : ''}` : null;
  }
  if ('sig' in c) return houseTest(sigOf(c.sig), c) ? `${NAMES[c.sig]} signifies ${sigOf(c.sig).join(', ')}` : null;
  if ('conj' in c) return P(c.conj[0]).sign === P(c.conj[1]).sign ? `${NAMES[c.conj[0]]} and ${NAMES[c.conj[1]]} in one sign` : null;
  if ('aspects' in c) {
    const a = P(c.aspects), b = P(c.target);
    return signAspects(c.aspects, a.sign, b.sign) ? `${NAMES[c.aspects]} aspects ${NAMES[c.target]}` : null;
  }
  if ('cusp' in c) {
    const k = m.cusps[c.cusp - 1]!;
    const ok = (!c.sign || c.sign.includes(k.sign)) && (!c.star || c.star.includes(k.lords[0])) && (!c.sub || c.sub.includes(k.lords[1]));
    return ok ? `cusp ${c.cusp} in the star of ${NAMES[k.lords[0]]}, sub of ${NAMES[k.lords[1]]}` : null;
  }
  if ('occupied' in c) {
    const occ = m.houses[c.occupied - 1]!.occupants;
    return (c.empty ? occ.length === 0 : occ.length > 0) ? `house ${c.occupied} ${occ.length ? `holds ${occ.map((p) => NAMES[p]).join(', ')}` : 'is empty'}` : null;
  }
  if ('allOf' in c) {
    const rs = c.allOf.map((x) => holds(x, m, sig));
    return rs.every((r) => r !== null) ? rs.join('; ') : null;
  }
  if ('anyOf' in c) return c.anyOf.map((x) => holds(x, m, sig)).find((r) => r !== null) ?? null;
  if ('not' in c) return holds(c.not, m, sig) === null ? 'not: condition absent' : null;
  return null;
}

/** Rules that hold for a chart, in catalogue order. */
export function kpGuidance(m: KpModel, sig: Sig, rules: readonly GuidanceRule[] = GUIDANCE_RULES): GuidanceFinding[] {
  const out: GuidanceFinding[] = [];
  for (const rule of rules) {
    const because = holds(rule.when, m, sig);
    if (because !== null) out.push({ rule, because });
  }
  return out;
}

const KEYS: Record<string, string[]> = {
  csl: ['csl', 'all', 'any', 'none'], cslIs: ['cslIs', 'planets'], cslLinked: ['cslLinked', 'planets'],
  planet: ['planet', 'house', 'sign', 'star', 'sub', 'retro'], sig: ['sig', 'all', 'any', 'none'], conj: ['conj'],
  aspects: ['aspects', 'target'], cusp: ['cusp', 'sign', 'star', 'sub'], occupied: ['occupied', 'empty'],
  allOf: ['allOf'], anyOf: ['anyOf'], not: ['not'],
};
const PL = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'];

/** Schema check for rule files (used by the tests): returns the problems found. */
export function validateCond(c: unknown, path = 'when'): string[] {
  if (!c || typeof c !== 'object') return [`${path}: not an object`];
  const o = c as Record<string, unknown>;
  const kind = Object.keys(KEYS).find((k) => k in o);
  if (!kind) return [`${path}: unknown condition ${JSON.stringify(o).slice(0, 80)}`];
  const errs = Object.keys(o).filter((k) => !KEYS[kind]!.includes(k)).map((k) => `${path}: unexpected key "${k}" in ${kind}`);
  const houses = (v: unknown, k: string) => { if (v !== undefined && !(Array.isArray(v) && v.every((h) => Number.isInteger(h) && h >= 1 && h <= 12))) errs.push(`${path}.${k}: houses 1–12`); };
  const planets = (v: unknown, k: string) => { if (v !== undefined && !(Array.isArray(v) && v.every((p) => PL.includes(p as string)))) errs.push(`${path}.${k}: planet ids`); };
  const cuspNo = (v: unknown, k: string) => { if (!(Number.isInteger(v) && (v as number) >= 1 && (v as number) <= 12)) errs.push(`${path}.${k}: cusp 1–12`); };
  if (kind === 'csl' || kind === 'sig') { houses(o.all, 'all'); houses(o.any, 'any'); houses(o.none, 'none'); }
  if (kind === 'csl') cuspNo(o.csl, 'csl');
  if (kind === 'sig' && !PL.includes(o.sig as string)) errs.push(`${path}.sig: planet id`);
  if (kind === 'cslIs' || kind === 'cslLinked') { cuspNo(o[kind], kind); planets(o.planets, 'planets'); }
  if (kind === 'planet') {
    if (!PL.includes(o.planet as string)) errs.push(`${path}.planet: planet id`);
    houses(o.house, 'house'); planets(o.star, 'star'); planets(o.sub, 'sub');
    if (o.sign !== undefined && !(Array.isArray(o.sign) && o.sign.every((s) => Number.isInteger(s) && s >= 0 && s <= 11))) errs.push(`${path}.sign: 0–11`);
  }
  if (kind === 'cusp') { cuspNo(o.cusp, 'cusp'); planets(o.star, 'star'); planets(o.sub, 'sub'); }
  if (kind === 'conj' && !(Array.isArray(o.conj) && o.conj.length === 2)) errs.push(`${path}.conj: two planets`);
  if (kind === 'conj') planets(o.conj, 'conj');
  if (kind === 'aspects') { planets([o.aspects], 'aspects'); planets([o.target], 'target'); }
  if (kind === 'occupied') cuspNo(o.occupied, 'occupied');
  if (kind === 'allOf' || kind === 'anyOf') {
    if (!Array.isArray(o[kind]) || !(o[kind] as unknown[]).length) errs.push(`${path}.${kind}: non-empty list`);
    else (o[kind] as unknown[]).forEach((x, i) => errs.push(...validateCond(x, `${path}.${kind}[${i}]`)));
  }
  if (kind === 'not') errs.push(...validateCond(o.not, `${path}.not`));
  return errs;
}

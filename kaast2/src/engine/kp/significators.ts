/**
 * KP significators as Krishnamurti's Readers rank them (B6 pp. 94–100,
 * B3 pp. 354–355, 418; catalogue references/KP/notes, KP6-021…024,
 * KP3-066…069, KP3-501). For a house, strongest first:
 *   1 planets in the stars of the occupants,
 *   2 the occupants,
 *   3 planets in the stars of the owner (lord of the cusp sign),
 *   4 the owner,
 *   5 planets conjoined with (same sign) or aspected by (Parashari sign
 *     aspects, Ma 4/8, Ju 5/9, Sa 3/10 — the aspects B6's examples use,
 *     KP6-038) those significators.
 * A star holding no planet makes its lord a strong significator itself
 * ("the Secretary does the job", KP6-022).
 * Rahu and Ketu act as agents (KP6-023/024): a node signifies its own
 * house, the houses its star lord occupies and owns, and the full
 * significations of its sign lord, of planets conjoined with it and of
 * planets aspecting it; it is stronger than the planets it represents.
 * A planet in a node's star takes the node's whole set. This reproduces the
 * printed significator tables B6 Figs. 26 and 67 (tests/unit/kp_readers.test.ts).
 * Ownership is by cusp sign only (no "span rule").
 */
import type { PlanetId } from '../types';
import { PLANETS } from '../types';
import { SIGN_LORD } from '../zodiac';
import type { KpModel } from './kp';

const NODES: PlanetId[] = ['Ra', 'Ke'];
const isNode = (p: PlanetId) => p === 'Ra' || p === 'Ke';
const SPECIAL: Partial<Record<PlanetId, number[]>> = { Ma: [4, 8], Ju: [5, 9], Sa: [3, 10] };

/** Does planet `q` (in sign sq) aspect sign st? Parashari sign aspects; the nodes are not taken as aspecting. */
export function signAspects(q: PlanetId, sq: number, st: number): boolean {
  if (isNode(q)) return false;
  const n = ((st - sq + 12) % 12) + 1;
  return n === 7 || (SPECIAL[q] ?? []).includes(n);
}

export interface PlanetSignification {
  id: PlanetId;
  /** Houses occupied by its star lord (or the star-lord node's whole set). */
  a: number[];
  /** House it occupies. */
  b: number[];
  /** Houses its star lord owns. */
  c: number[];
  /** Houses it owns. */
  d: number[];
  /** For a node: the planets it represents, strongest reason first. */
  represents: { planet: PlanetId; why: 'conjoined' | 'star lord' | 'aspecting' | 'sign lord' }[];
  /** All houses signified, ascending. */
  all: number[];
}

export interface RankedHouse {
  house: number;
  /** Levels 1–4 (index 0–3) and 5 (index 4), planets in each. */
  levels: PlanetId[][];
  /** Nodes acting here for a planet of levels 1–4. */
  nodeAgents: { node: PlanetId; for: PlanetId; level: number }[];
  /** Planets whose stars are empty but who are significators at levels 2 or 4 (strong). */
  emptyStar: PlanetId[];
  /** Every significator, strongest first, without repeats. */
  ordered: PlanetId[];
}

const uniq = (xs: number[]) => [...new Set(xs)].sort((a, b) => a - b);

export function kpSignifications(m: KpModel): { planets: Record<PlanetId, PlanetSignification>; houses: RankedHouse[] } {
  const P = Object.fromEntries(m.planets.map((p) => [p.id, p])) as Record<PlanetId, KpModel['planets'][number]>;
  const owned = (p: PlanetId) => m.houses.filter((h) => h.owner === p).map((h) => h.house);
  const star = (p: PlanetId) => P[p].lords[0];
  /** A–D of a non-node planet, the star-lord part resolved one step (a node star lord gives its own house). */
  const basic = (p: PlanetId) => {
    const s = star(p);
    return { a: [P[s].house], b: [P[p].house], c: owned(s), d: owned(p) };
  };
  const full = (p: PlanetId): number[] => { const x = basic(p); return [...x.a, ...x.b, ...x.c, ...x.d]; };

  const represents = (n: PlanetId): PlanetSignification['represents'] => {
    const out: PlanetSignification['represents'] = [];
    const add = (planet: PlanetId, why: PlanetSignification['represents'][number]['why']) => {
      if (!isNode(planet) && !out.some((r) => r.planet === planet)) out.push({ planet, why });
    };
    for (const q of PLANETS) if (q !== n && !isNode(q) && P[q].sign === P[n].sign) add(q, 'conjoined');
    add(star(n), 'star lord');
    for (const q of PLANETS) if (!isNode(q) && signAspects(q, P[q].sign, P[n].sign)) add(q, 'aspecting');
    add(SIGN_LORD[P[n].sign]!, 'sign lord');
    return out;
  };
  /** Planets whose FULL significations a node carries: conjoined, aspecting, sign lord (even when also its star lord). */
  const fullReps = (n: PlanetId): PlanetId[] => {
    const out = new Set<PlanetId>();
    for (const q of PLANETS) if (q !== n && !isNode(q) && P[q].sign === P[n].sign) out.add(q);
    for (const q of PLANETS) if (!isNode(q) && signAspects(q, P[q].sign, P[n].sign)) out.add(q);
    out.add(SIGN_LORD[P[n].sign]!);
    return [...out];
  };
  const nodeSet = (n: PlanetId): number[] => {
    const s = star(n);
    const sl = isNode(s) ? [P[s].house] : [P[s].house, ...owned(s)];
    return uniq([P[n].house, ...sl, ...fullReps(n).flatMap(full)]);
  };

  const planets = {} as Record<PlanetId, PlanetSignification>;
  for (const p of PLANETS) {
    const s = star(p);
    if (isNode(p)) {
      const set = nodeSet(p);
      planets[p] = { id: p, a: isNode(s) ? [P[s].house] : [P[s].house], b: [P[p].house], c: isNode(s) ? [] : owned(s), d: [], represents: represents(p), all: set };
    } else {
      const a = isNode(s) ? nodeSet(s) : [P[s].house];
      const c = isNode(s) ? [] : owned(s);
      const d = owned(p);
      planets[p] = { id: p, a, b: [P[p].house], c, d, represents: [], all: uniq([...a, P[p].house, ...c, ...d]) };
    }
  }

  const tenants = (lords: PlanetId[]) => PLANETS.filter((q) => lords.includes(star(q)));
  const houses: RankedHouse[] = m.houses.map((h) => {
    const occ = h.occupants;
    const l1 = tenants(occ), l2 = [...occ], l3 = tenants([h.owner]), l4 = [h.owner];
    const core = [...new Set([...l1, ...l2, ...l3, ...l4])];
    const l5 = PLANETS.filter((q) => !core.includes(q) && core.some((c) =>
      (P[q].sign === P[c].sign) || signAspects(q, P[q].sign, P[c].sign)));
    const levels = [l1, l2, l3, l4, l5];
    const nodeAgents: RankedHouse['nodeAgents'] = [];
    for (const n of NODES) for (const r of represents(n)) {
      const lv = levels.slice(0, 4).findIndex((L) => L.includes(r.planet));
      if (lv >= 0 && !core.includes(n) && !nodeAgents.some((x) => x.node === n)) nodeAgents.push({ node: n, for: r.planet, level: lv + 1 });
    }
    const emptyStar = [...new Set([...l2, ...l4])].filter((q) => !PLANETS.some((x) => x !== q && star(x) === q));
    const ordered: PlanetId[] = [];
    levels.forEach((L, i) => {
      for (const a of nodeAgents) if (a.level === i + 1 && !ordered.includes(a.node)) ordered.push(a.node);
      for (const q of L) if (!ordered.includes(q)) ordered.push(q);
    });
    return { house: h.house, levels, nodeAgents, emptyStar, ordered };
  });
  return { planets, houses };
}

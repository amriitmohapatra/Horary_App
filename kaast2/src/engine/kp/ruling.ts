/**
 * Ruling planets (RP) of a moment — KP Readers B1 pp. 85–95, 159–169; B3
 * p. 295; B6 pp. 132–152, 194, 212, 275, 285 (KP1-090…098, KP3-159,
 * KP6-040…051). The RPs are the lords of the weekday (sunrise to sunrise),
 * of the Moon's sign and star, and of the rising sign and its star; the
 * lagna's and the Moon's sub lords are finer RPs (B5 p. 227 uses the Moon's
 * sub). A node joins when it is conjoined with or aspected by an RP, or sits
 * in a sign an RP owns; it gives "first of all" the results of the planets it
 * is conjoined with or aspected by (B6 p. 254), then those of its sign lord
 * (p. 132), and it replaces the RP it represents ("Reject Sun, take Kethu",
 * p. 254; B4 p. 211).
 * An RP in the star (or, from B6 p. 194 on, the sub) of a retrograde planet
 * is rejected ("tempter"); a retrograde RP counts only after it turns direct.
 * Strength: lagna lord > Moon's star lord > Moon's sign lord > day lord (B6
 * p. 194); a node representing the lagna lord is strongest (p. 285); a
 * repeated RP is stronger (B1 p. 159). The lagna star lord's place in that
 * order is not stated in the Readers: it is placed after the lagna lord.
 */
import type { ChartResult, PlanetId } from '../types';
import { SIGN_LORD, signIndex } from '../zodiac';
import { lordChain } from './lords';
import { signAspects } from './significators';

export type RpRole = 'lagna sign' | 'lagna star' | 'Moon star' | 'Moon sign' | 'day' | 'lagna sub' | 'Moon sub';
export type NodeWhy = 'conjoined' | 'aspected' | 'in its sign';
export interface RpSlot { role: RpRole; planet: PlanetId }
export interface RulingPlanets {
  slots: RpSlot[];
  /**
   * Nodes acting for RPs (whether or not the node is itself an RP): the RPs it
   * represents, conjoined first, then aspecting, then its sign lord; `for` = the first.
   */
  nodes: { node: PlanetId; for: PlanetId; why: NodeWhy; reps: { planet: PlanetId; why: NodeWhy }[] }[];
  /** RPs in the star (or sub) of a retrograde planet. */
  rejected: { planet: PlanetId; why: string }[];
  /** Retrograde RPs: effective only after they turn direct. */
  retrograde: PlanetId[];
  /** Accepted RPs (core five + nodes), strongest first. */
  ordered: PlanetId[];
}

const ROLE_RANK: Record<RpRole, number> = { 'lagna sign': 0, 'lagna star': 1, 'Moon star': 2, 'Moon sign': 3, day: 4, 'lagna sub': 5, 'Moon sub': 6 };
const isNode = (p: PlanetId) => p === 'Ra' || p === 'Ke';

export function rulingPlanets(chart: ChartResult, dayLord: PlanetId, opts: { rejectBySub?: boolean } = {}): RulingPlanets {
  const bySub = opts.rejectBySub ?? true;
  const asc = lordChain(chart.asc.lon, 2), moon = lordChain(chart.bodies.Mo.lon, 2);
  const slots: RpSlot[] = [
    { role: 'lagna sign', planet: SIGN_LORD[signIndex(chart.asc.lon)]! },
    { role: 'lagna star', planet: asc[0]! },
    { role: 'Moon star', planet: moon[0]! },
    { role: 'Moon sign', planet: SIGN_LORD[signIndex(chart.bodies.Mo.lon)]! },
    { role: 'day', planet: dayLord },
    { role: 'lagna sub', planet: asc[1]! },
    { role: 'Moon sub', planet: moon[1]! },
  ];
  const core = slots.filter((s) => ROLE_RANK[s.role] <= 4);
  const coreSet = [...new Set(core.map((s) => s.planet))];
  const allSet = [...new Set(slots.map((s) => s.planet))];
  const sign = (p: PlanetId) => signIndex(chart.bodies[p].lon);
  const nodes: RulingPlanets['nodes'] = [];
  for (const n of ['Ra', 'Ke'] as PlanetId[]) {
    const reps: { planet: PlanetId; why: NodeWhy }[] = [];
    const add = (planet: PlanetId, why: NodeWhy) => { if (!reps.some((r) => r.planet === planet)) reps.push({ planet, why }); };
    for (const q of allSet) if (!isNode(q) && sign(q) === sign(n)) add(q, 'conjoined');
    for (const q of allSet) if (!isNode(q) && signAspects(q, sign(q), sign(n))) add(q, 'aspected');
    const lord = SIGN_LORD[sign(n)]!;
    if (allSet.includes(lord)) add(lord, 'in its sign');
    // A finer RP (a sub lord) alone attaches a node only through its sign (B5 p. 227).
    const kept = reps.filter((r) => coreSet.includes(r.planet) || r.why === 'in its sign');
    if (kept.length) nodes.push({ node: n, for: kept[0]!.planet, why: kept[0]!.why, reps: kept });
  }
  const retro = (p: PlanetId) => !isNode(p) && chart.bodies[p].retrograde;
  const rejected: RulingPlanets['rejected'] = [];
  const agents = nodes.map((x) => x.node).filter((n) => !coreSet.includes(n));
  for (const p of [...coreSet, ...agents]) {
    const [st, sb] = lordChain(chart.bodies[p].lon, 2);
    if (retro(st!)) rejected.push({ planet: p, why: `in the star of retrograde ${st}` });
    else if (bySub && retro(sb!)) rejected.push({ planet: p, why: `in the sub of retrograde ${sb}` });
  }
  const accepted = [...coreSet, ...agents].filter((p) => !rejected.some((r) => r.planet === p));
  const score = (p: PlanetId) => {
    const ranks = core.filter((s) => s.planet === p).map((s) => ROLE_RANK[s.role]);
    // A node takes the place of the strongest RP it represents, just ahead of it (B6 p. 285).
    const repRanks = (nodes.find((x) => x.node === p)?.reps ?? []).flatMap((r) => core.filter((s) => s.planet === r.planet).map((s) => ROLE_RANK[s.role] - 0.5));
    const r = Math.min(9, ...ranks, ...repRanks);
    return r - 0.1 * Math.max(0, ranks.length - 1);
  };
  const ordered = accepted.sort((a, b) => score(a) - score(b));
  return { slots, nodes, rejected, retrograde: accepted.filter(retro), ordered };
}

/** Fortuna (Part of Fortune) = Ascendant + Moon − Sun, day and night alike (B1 p. 129; B2 KP2-210). */
export function fortuna(chart: ChartResult): number {
  const z = 1_296_000;
  return (((chart.asc.lon + chart.bodies.Mo.lon - chart.bodies.Su.lon) % z) + z) % z;
}


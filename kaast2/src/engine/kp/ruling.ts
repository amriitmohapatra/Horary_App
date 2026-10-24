/**
 * Ruling planets (RP) of a moment — KP Readers B1 pp. 85–95, 159–169; B3
 * p. 295; B6 pp. 132–152, 194, 212, 275, 285 (KP1-090…098, KP3-159,
 * KP6-040…051). The RPs are the lords of the weekday (sunrise to sunrise),
 * of the Moon's sign and star, and of the rising sign and its star; the
 * lagna's and the Moon's sub lords are shown as finer RPs. A node joins when
 * it sits in a sign an RP owns, or is conjoined with or aspected by an RP.
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
export interface RpSlot { role: RpRole; planet: PlanetId }
export interface RulingPlanets {
  slots: RpSlot[];
  /** Nodes added as agents of an RP. */
  nodes: { node: PlanetId; for: PlanetId; why: 'in its sign' | 'conjoined' | 'aspected' }[];
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
  const sign = (p: PlanetId) => signIndex(chart.bodies[p].lon);
  const nodes: RulingPlanets['nodes'] = [];
  for (const n of ['Ra', 'Ke'] as PlanetId[]) {
    if (coreSet.includes(n)) continue;
    const lord = SIGN_LORD[sign(n)]!;
    if (coreSet.includes(lord)) { nodes.push({ node: n, for: lord, why: 'in its sign' }); continue; }
    const c = coreSet.find((q) => !isNode(q) && sign(q) === sign(n));
    if (c) { nodes.push({ node: n, for: c, why: 'conjoined' }); continue; }
    const a = coreSet.find((q) => !isNode(q) && signAspects(q, sign(q), sign(n)));
    if (a) nodes.push({ node: n, for: a, why: 'aspected' });
  }
  const retro = (p: PlanetId) => !isNode(p) && chart.bodies[p].retrograde;
  const rejected: RulingPlanets['rejected'] = [];
  for (const p of [...coreSet, ...nodes.map((x) => x.node)]) {
    const [st, sb] = lordChain(chart.bodies[p].lon, 2);
    if (retro(st!)) rejected.push({ planet: p, why: `in the star of retrograde ${st}` });
    else if (bySub && retro(sb!)) rejected.push({ planet: p, why: `in the sub of retrograde ${sb}` });
  }
  const accepted = [...coreSet, ...nodes.map((x) => x.node)].filter((p) => !rejected.some((r) => r.planet === p));
  const score = (p: PlanetId) => {
    const ranks = core.filter((s) => s.planet === p).map((s) => ROLE_RANK[s.role]);
    const agentFor = nodes.find((x) => x.node === p)?.for;
    const r = ranks.length ? Math.min(...ranks) : agentFor ? Math.min(...core.filter((s) => s.planet === agentFor).map((s) => ROLE_RANK[s.role])) - 0.5 : 9;
    return r - 0.1 * (ranks.length - 1);
  };
  const ordered = accepted.sort((a, b) => score(a) - score(b));
  return { slots, nodes, rejected, retrograde: accepted.filter(retro), ordered };
}

/** Fortuna (Part of Fortune) = Ascendant + Moon − Sun, day and night alike (B1 p. 129; B2 KP2-210). */
export function fortuna(chart: ChartResult): number {
  const z = 1_296_000;
  return (((chart.asc.lon + chart.bodies.Mo.lon - chart.bodies.Su.lon) % z) + z) % z;
}


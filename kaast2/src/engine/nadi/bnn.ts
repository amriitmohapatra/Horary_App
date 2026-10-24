/**
 * Bhrigu Nandi Nadi (BNN, "Nandi Nadi" as KRS teaches it): sign links between
 * planets, Rao's retrograde rule, exchanges, karaka summaries and Jupiter /
 * Saturn transit activations. RESEARCH: rule ids and sources are those of
 * docs/specs/nandi_nadi.md (PRI = R. G. Rao, Bhrigu Nandi Nadi, 2008; SEC =
 * Jagadeesan & Jothimani 2022; PRAC = practitioners). Relations are listed,
 * never scored (L6 is contested). The Lagna is not used (N1).
 */
import type { SwissEph } from '../ephem/swisseph';
import type { Profile } from '../profiles';
import { findEvents, transitPositions } from '../transit/events';
import { DEBIL_SIGN, EXALT_SIGN, OWN } from '../strength/common';
import { PLANETS, type PlanetId } from '../types';
import { SIGN_LORD } from '../zodiac';

export type LinkKind = 'same' | 'ahead' | 'behind' | 'opposite' | 'trine' | 'weak';
export type RetroRule = 'also' | 'instead' | 'off';

export interface BnnOptions {
  /** L5: 3rd/11th links (contested; default off). */
  weakLinks: boolean;
  /** R1: a retrograde planet acts also from (or instead of) the previous sign. */
  retro: RetroRule;
  /** R5: apply R1 to Rahu and Ketu (OPEN; default off). */
  retroNodes: boolean;
}
export const DEFAULT_BNN: BnnOptions = { weakLinks: false, retro: 'also', retroNodes: false };

export interface NatalPoint { id: PlanetId; lonDeg: number; retrograde: boolean }

const KIND: Readonly<Record<number, LinkKind>> = { 1: 'same', 2: 'ahead', 12: 'behind', 7: 'opposite', 5: 'trine', 9: 'trine', 3: 'weak', 11: 'weak' };
const sgn = (deg: number): number => Math.floor((((deg % 360) + 360) % 360) / 30);
const m12 = (x: number): number => ((x % 12) + 12) % 12;
export const hFrom = (a: number, b: number): number => m12(b - a) + 1;

/** Signs a planet acts from (R1). */
export function actsFrom(p: NatalPoint, o: BnnOptions): number[] {
  const s = sgn(p.lonDeg);
  const node = p.id === 'Ra' || p.id === 'Ke';
  if (!p.retrograde || o.retro === 'off' || (node && !o.retroNodes)) return [s];
  return o.retro === 'instead' ? [m12(s - 1)] : [s, m12(s - 1)];
}

/** SEC 2022 friend/enemy table, A's view of B (OPEN: asymmetric, has slips). */
const FRIENDS: Readonly<Record<PlanetId, readonly PlanetId[]>> = {
  Su: ['Mo', 'Ma', 'Me', 'Ju'], Mo: ['Su', 'Ma', 'Ju', 'Me'], Ma: ['Mo', 'Ju', 'Ve', 'Su', 'Ke'],
  Me: ['Sa', 'Ve', 'Su', 'Ra'], Ju: ['Su', 'Ma', 'Sa', 'Ra', 'Ke', 'Mo'], Ve: ['Ma', 'Me', 'Sa', 'Ra'],
  Sa: ['Me', 'Ju', 'Ve', 'Ra'], Ra: ['Me', 'Sa', 'Ve', 'Ju'], Ke: ['Ma', 'Ju'],
};
const ENEMIES: Readonly<Record<PlanetId, readonly PlanetId[]>> = {
  Su: ['Ve', 'Sa', 'Ra', 'Ke'], Mo: ['Ve', 'Ke', 'Sa', 'Ra'], Ma: ['Me', 'Ra', 'Sa'],
  Me: ['Ma', 'Mo', 'Ju', 'Ke'], Ju: ['Me', 'Ve'], Ve: ['Su', 'Mo', 'Ke', 'Ju'],
  Sa: ['Su', 'Ma', 'Mo', 'Ke'], Ra: ['Mo', 'Ma', 'Su'], Ke: ['Ve', 'Sa', 'Me', 'Mo', 'Su'],
};
export type Friendship = 'friendly' | 'inimical' | 'none';
export const friendship = (a: PlanetId, b: PlanetId): Friendship =>
  FRIENDS[a].includes(b) ? 'friendly' : ENEMIES[a].includes(b) ? 'inimical' : 'none';

export interface Link {
  from: PlanetId;
  to: PlanetId;
  /** `to` is in the h-th sign from `from`. */
  h: number;
  kind: LinkKind;
  /** The link exists only through a retrograde planet's previous sign. */
  viaRetro: PlanetId[];
  friendship: Friendship;
}

export interface NatalRow {
  id: PlanetId;
  sign: number;
  degInSign: number;
  /** 1 = lowest degree in its sign ("leads", L1o, PRAC). */
  orderInSign: number;
  retrograde: boolean;
  alsoFrom: number | null;
  dignity: 'EX' | 'DB' | 'OWN' | null;
  exchangeWith: PlanetId | null;
  /** X3 (SEC): treated as retrograde through an exchange with a retrograde planet. */
  retroViaExchange: boolean;
  /** L8: on the Rahu → Ketu arc (side A) or the Ketu → Rahu arc (side B); nodes null. */
  side: 'A' | 'B' | null;
  /** L7: no planet in its 2nd, 12th, 7th, 5th or 9th (or same sign). */
  isolated: boolean;
  /** Within 1° of a sign boundary: sign-level rules may flip with the ayanamsa. */
  nearBoundary: boolean;
}

export interface BnnModel {
  rows: NatalRow[];
  /** Ordered pairs (A → B), one entry per kind found. */
  links: Link[];
  exchanges: [PlanetId, PlanetId][];
}

export function bnn(points: NatalPoint[], o: BnnOptions = DEFAULT_BNN): BnnModel {
  const by = new Map(points.map((p) => [p.id, p]));
  const sign = (id: PlanetId) => sgn(by.get(id)!.lonDeg);
  const links: Link[] = [];
  for (const a of points) {
    for (const b of points) {
      if (a.id === b.id) continue;
      const found = new Map<LinkKind, { h: number; via: Set<PlanetId>; real: boolean }>();
      const sa = sign(a.id), sb = sign(b.id);
      for (const x of actsFrom(a, o)) {
        for (const y of actsFrom(b, o)) {
          const h = hFrom(x, y);
          const kind = KIND[h];
          if (!kind || (kind === 'weak' && !o.weakLinks)) continue;
          if (kind === 'opposite' && ((a.id === 'Ra' && b.id === 'Ke') || (a.id === 'Ke' && b.id === 'Ra'))) continue; // L3n
          const real = x === sa && y === sb;
          const f = found.get(kind) ?? { h, via: new Set<PlanetId>(), real: false };
          if (real) { f.real = true; f.h = h; }
          else if (!f.real) { if (x !== sa) f.via.add(a.id); if (y !== sb) f.via.add(b.id); }
          found.set(kind, f);
        }
      }
      for (const [kind, f] of found) {
        links.push({ from: a.id, to: b.id, h: f.h, kind, viaRetro: f.real ? [] : [...f.via], friendship: friendship(a.id, b.id) });
      }
    }
  }
  const exchanges: [PlanetId, PlanetId][] = [];
  const ex = new Map<PlanetId, PlanetId>();
  for (const a of PLANETS) for (const b of PLANETS) {
    if (a < b && by.has(a) && by.has(b) && SIGN_LORD[sign(a)] === b && SIGN_LORD[sign(b)] === a) {
      exchanges.push([a, b]); ex.set(a, b); ex.set(b, a);
    }
  }
  const ra = by.get('Ra');
  const rows: NatalRow[] = points.map((p) => {
    const s = sign(p.id);
    const d = ((p.lonDeg % 30) + 30) % 30;
    const same = points.filter((q) => sign(q.id) === s).sort((x, y) => (x.lonDeg % 30) - (y.lonDeg % 30));
    const partner = ex.get(p.id) ?? null;
    const node = p.id === 'Ra' || p.id === 'Ke';
    const side = ra && !node ? ((((p.lonDeg - ra.lonDeg) % 360) + 360) % 360 < 180 ? 'A' : 'B') : null;
    const dignity = s === EXALT_SIGN[p.id] ? 'EX' : s === DEBIL_SIGN[p.id] ? 'DB' : OWN[p.id].includes(s) ? 'OWN' : null;
    const isolated = !links.some((l) => l.from === p.id && l.kind !== 'weak');
    return {
      id: p.id, sign: s, degInSign: d, orderInSign: same.findIndex((q) => q.id === p.id) + 1,
      retrograde: p.retrograde, alsoFrom: actsFrom(p, o).find((x) => x !== s) ?? null,
      dignity, exchangeWith: partner,
      retroViaExchange: !p.retrograde && partner !== null && by.get(partner)!.retrograde,
      side, isolated, nearBoundary: d < 1 || d > 29,
    };
  });
  return { rows, links, exchanges };
}

/* ---- karakas (§2.2, Table C) ---- */
export type Sex = 'male' | 'female' | 'unspecified';
export interface Theme { id: string; label: string; karakas: { id: PlanetId; note?: string }[] }
export function themes(sex: Sex): Theme[] {
  const f = sex === 'female', u = sex === 'unspecified';
  return [
    { id: 'self', label: 'Self (jeeva)', karakas: f ? [{ id: 'Ve', note: 'SEC' }, { id: 'Ju', note: 'Sithars (contested)' }] : [{ id: 'Ju', note: u ? 'for a man; for a woman contested (Ve or Ju)' : 'PRI p. 11' }] },
    { id: 'work', label: 'Profession (karma)', karakas: [{ id: 'Sa', note: 'both sexes, PRI p. iii' }] },
    { id: 'spouse', label: 'Spouse', karakas: f ? [{ id: 'Ma', note: 'Rao, pp. 176, 252' }, { id: 'Ju', note: 'AstroWord (contested)' }] : [{ id: 'Ve', note: u ? 'wife in a man’s chart; for a woman: Mars (Rao)' : 'PRI p. iii' }] },
    { id: 'father', label: 'Father', karakas: [{ id: 'Su' }] },
    { id: 'mother', label: 'Mother', karakas: [{ id: 'Mo' }] },
    { id: 'brothers', label: 'Brothers, land', karakas: [{ id: 'Ma' }] },
    { id: 'education', label: 'Education', karakas: [{ id: 'Me' }] },
    { id: 'religion', label: 'Religion, pilgrimage', karakas: [{ id: 'Ke' }] },
  ];
}

export const KARAKATVA: Readonly<Record<PlanetId, string>> = {
  Su: 'father, government, authority', Mo: 'mother, mind, travel, liquids', Ma: 'brothers, land, machinery, disputes (a woman’s husband, Rao)',
  Me: 'education, intellect, trade, writing', Ju: 'the native (jeeva), children', Ve: 'wife, marriage, money, comforts, arts, sisters',
  Sa: 'work and profession (karma)', Ra: 'obstruction, the foreign or unconventional', Ke: 'religion, salvation, pilgrimage',
};

/** §2.6 pair keywords (well attested only). */
const PAIRS: [PlanetId, PlanetId, string, string][] = [
  ['Ju', 'Sa', 'profession joined to dharma; an honourable profession', 'PRI pp. 130, 159, 162, 168'],
  ['Sa', 'Ke', 'religious institutions, detachment in work', 'PRI pp. 30, 130'],
  ['Ju', 'Ke', 'spirituality, pilgrimage', 'PRI p. 130'],
  ['Su', 'Ve', 'father’s wealth and lifestyle', 'PRI pp. 10, 12'],
  ['Ve', 'Sa', 'relationship with responsibility (not by itself delay)', 'PRAC'],
];
export function pairKeyword(a: PlanetId, b: PlanetId): { text: string; source: string } | null {
  const p = PAIRS.find(([x, y]) => (x === a && y === b) || (x === b && y === a));
  return p ? { text: p[2], source: p[3] } : null;
}

/* ---- transits (§2.5, Table D) ---- */
export interface Activation { by: 'Ju' | 'Sa'; natal: PlanetId; kind: 'contact' | 'opposite' | 'trine'; viaRetro: boolean; pilgrimage: boolean }

/** Jupiter and Saturn over the natal planets at one moment. */
export function activations(natal: NatalPoint[], transit: Record<'Ju' | 'Sa', { lonDeg: number; retrograde: boolean }>, o: BnnOptions = DEFAULT_BNN): Activation[] {
  const out: Activation[] = [];
  for (const by of ['Ju', 'Sa'] as const) {
    const t = transit[by];
    const xs = actsFrom({ id: by, lonDeg: t.lonDeg, retrograde: t.retrograde }, o);
    const x0 = sgn(t.lonDeg);
    for (const n of natal) {
      const n0 = sgn(n.lonDeg);
      const seen = new Map<Activation['kind'], boolean>();
      for (const x of xs) for (const y of actsFrom(n, o)) {
        const h = hFrom(x, y);
        const kind = h === 1 ? 'contact' : h === 7 ? 'opposite' : h === 5 || h === 9 ? 'trine' : null;
        if (!kind) continue;
        const via = x !== x0 || y !== n0;
        seen.set(kind, (seen.get(kind) ?? true) && via);
      }
      for (const [kind, via] of seen) out.push({ by, natal: n.id, kind, viaRetro: via, pilgrimage: by === 'Ju' && n.id === 'Ke' && kind === 'contact' });
    }
  }
  return out;
}

export interface RoundRow { body: 'Ju' | 'Sa'; round: number; sign: number; start: number; end: number; direction: 'direct' | 'retrograde'; contacts: PlanetId[]; isReturn: boolean }

/** T2/T3: Jupiter's and Saturn's sign stays from birth for `years`, with the natal planets met in each sign. */
export function rounds(swe: SwissEph, profile: Profile, natal: NatalPoint[], birthJd: number, years: number): RoundRow[] {
  const toJd = birthJd + years * 365.25;
  const start = transitPositions(swe, profile, birthJd);
  const out: RoundRow[] = [];
  for (const body of ['Ju', 'Sa'] as const) {
    const natalSign = sgn(natal.find((p) => p.id === body)!.lonDeg);
    // A new round starts on a direct entry into the natal sign, once per orbit (retrograde loops do not count).
    const minGap = (body === 'Ju' ? 8 : 25) * 365.25;
    let lastRound = birthJd;
    let sign = sgn(start[body].lonDeg), t0 = birthJd, round = 1, dir: 'direct' | 'retrograde' = start[body].retrograde ? 'retrograde' : 'direct';
    const push = (end: number) => {
      const contacts = natal.filter((p) => p.id !== body && sgn(p.lonDeg) === sign)
        .sort((a, b) => (a.lonDeg % 30) - (b.lonDeg % 30)).map((p) => p.id);
      out.push({ body, round, sign, start: t0, end, direction: dir, contacts, isReturn: sign === natalSign && t0 !== birthJd });
    };
    for (const e of findEvents(swe, profile, { bodies: [body], kinds: ['sign'], fromJd: birthJd, toJd })) {
      push(e.jdUT);
      if (e.direction === 'direct' && e.to === natalSign && e.jdUT - lastRound > minGap) { round++; lastRound = e.jdUT; }
      sign = e.to; t0 = e.jdUT; dir = e.direction;
    }
    push(toJd);
  }
  return out;
}

/** T7: the natal planets in the order a karaka moving forward meets them (sign, then degree). */
export function contactOrder(natal: NatalPoint[], from: PlanetId): PlanetId[] {
  const s0 = sgn(natal.find((p) => p.id === from)!.lonDeg);
  return natal.filter((p) => p.id !== from)
    .map((p) => ({ id: p.id, k: m12(sgn(p.lonDeg) - s0) * 30 + (((p.lonDeg % 30) + 30) % 30) }))
    .sort((a, b) => a.k - b.k).map((x) => x.id);
}

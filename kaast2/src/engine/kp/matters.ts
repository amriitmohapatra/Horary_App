/**
 * Life matters as Krishnamurti's Readers judge them (catalogue
 * references/KP/notes; ids KP3-xxx from B3, KP4- B4, KP5- B5, KP6- B6):
 *  - PROMISE: the sub lord of the matter's cusp must signify one of its houses
 *    (B4 p. 112; B6 KP6-061); signifying the denial group (the 12th from each
 *    "yes" house) obstructs or denies (B4 p. 154; B3 p. 444).
 *  - TIMING: the matter comes in the joint periods (dasa, bhukti, anthra) of
 *    planets that signify its houses (B3 KP3-026/065; B6 KP6-062), confirmed
 *    by transit (kp/transit.ts) and ruling planets (kp/ruling.ts).
 * "Signifies" = the planet's houses by Krishnamurti's levels with node agency
 * (kp/significators.ts). Natal retrogression is ignored (B6 p. 154); the
 * retrograde tests of horary (KP6-061) apply on the Horary sub-tab only.
 * Where the books disagree, every version is carried with its page.
 * Deliberately left out, as on the NTP page: longevity, death and danger.
 */
import type { PlanetId } from '../types';
import type { DashaPeriod } from '../dasha/vimshottari';
import { subperiods } from '../dasha/vimshottari';
import type { KpModel } from './kp';
import type { PlanetSignification } from './significators';

export interface Matter {
  id: string;
  label: string;
  /** Cusp whose sub lord decides the promise. */
  cusp: number;
  yes: number[];
  deny: number[];
  /** 'book' = the denial group is printed; 'derived' = the 12th from each "yes" house (B4 p. 154 principle). */
  denyFrom: 'book' | 'derived';
  /** Short notes on what the houses mean here, and variants in the books. */
  notes: string[];
  cite: string;
}

export const MATTERS: readonly Matter[] = [
  { id: 'marriage', label: 'Marriage', cusp: 7, yes: [2, 7, 11], deny: [1, 6, 10], denyFrom: 'book',
    notes: ['Denial group 1-6-10 (the 12th from 2, 7, 11); B4 p. 109 also writes 4-6-10.', 'Saturn as a significator delays, it does not deny (B4).'],
    cite: 'B4 pp. 112, 120, 154; B3 p. 444; B6 p. 282' },
  { id: 'children', label: 'Children', cusp: 5, yes: [2, 5, 11], deny: [1, 4, 10], denyFrom: 'derived',
    notes: ['B6 judges the 5th cusp for oneself; B4 uses the 11th cusp for a man and the 5th for a woman: both are shown.', 'Jupiter joins the significators (B4 p. 214).'],
    cite: 'B4 pp. 214–215; B6 pp. 201–206, 282' },
  { id: 'profession', label: 'Service and profession', cusp: 10, yes: [2, 6, 10, 11], deny: [1, 5, 9], denyFrom: 'book',
    notes: ['Promotion 2-6-10-11; end of service 1-5-9.', 'Service or business: the 2nd cusp’s sub lord signifying 1-2-6 (or 10 without 7) means service, 1-7-10 business (B3 p. 154).'],
    cite: 'B3 pp. 154, 352–360; B6 pp. 282–285, 293' },
  { id: 'business', label: 'Business', cusp: 7, yes: [2, 7, 10, 11], deny: [1, 6, 9], denyFrom: 'derived',
    notes: ['Business 2-7-10 (B3 p. 396); partnership through the 7th.'], cite: 'B3 pp. 154, 396' },
  { id: 'wealth', label: 'Wealth and finance', cusp: 2, yes: [2, 6, 10, 11], deny: [8, 12], denyFrom: 'book',
    notes: ['Loss through 8 and 12 (star or sub).', 'Borrowing 2 + 6; repayment 4-5-8-12 (B3 pp. 236–250).'], cite: 'B3 pp. 214–222' },
  { id: 'property', label: 'House and land', cusp: 4, yes: [4, 11, 12], deny: [3, 5, 10], denyFrom: 'book',
    notes: ['Acquiring 2-4-11; taking possession adds 6 or 9; a link with Mars.', 'Sale 3-5-10 (the 12th from 4, 6, 11).'], cite: 'B3 pp. 262–268; B6 pp. 183–187, 282' },
  { id: 'vehicle', label: 'Vehicle', cusp: 4, yes: [4, 9, 10, 11], deny: [3, 8], denyFrom: 'derived',
    notes: ['Venus joins the significators (B3 p. 271); B6 p. 282 gives 2-4-11.'], cite: 'B3 pp. 270–273; B6 pp. 193–195, 282' },
  { id: 'education', label: 'Education', cusp: 4, yes: [4, 9, 11], deny: [3, 5, 8], denyFrom: 'book',
    notes: ['Studies end through 3-5-8 (the 12th from 4, 6, 9).', 'Scholarship 4-6-11 (B3) or 6-9-11 abroad (B6); higher study abroad 9 + 12 with 11.'], cite: 'B3 pp. 274–280; B6 pp. 198–200, 282' },
  { id: 'abroad', label: 'Travel and residence abroad', cusp: 12, yes: [3, 9, 12], deny: [2, 8, 11], denyFrom: 'derived',
    notes: ['Promised only if the 12th cusp’s sub lord signifies 3, 9 or 12, preferably 9 (B3 p. 311).', 'B6 p. 282: overseas or higher studies 6-9-11-12.'], cite: 'B3 pp. 311–318; B6 pp. 272, 282, 311' },
  { id: 'health', label: 'Health (illness and cure)', cusp: 6, yes: [1, 5, 11], deny: [6, 8, 12], denyFrom: 'book',
    notes: ['Read reversed: the 6th is illness, so the "yes" group here is cure (1, 5, 11) and the "deny" group sickness (6, 8, 12). Illness comes in periods of significators of 6 that also signify 1; hospital 1-6-12 (B3).', 'Shown as research guidance only.'], cite: 'B3 pp. 290–300; B2 p. 300' },
  { id: 'litigation', label: 'Litigation and competition', cusp: 6, yes: [1, 2, 3, 6, 10, 11], deny: [4, 5, 7, 8, 9, 12], denyFrom: 'book',
    notes: ['Wins: 1-2-3-6-10-11; losses: 4-5-7-8-9-12 (B3 p. 228); B6 p. 283: 6-11.'], cite: 'B3 pp. 226–232; B6 p. 283' },
  { id: 'speculation', label: 'Speculation and lottery', cusp: 5, yes: [2, 6, 11], deny: [5, 8, 12], denyFrom: 'book',
    notes: ['Gain 2-6-11, loss 5-8-12 (B6 pp. 182, 222–225); the 5th is the urge to speculate (B3). B6 p. 282 also writes 2-5-6-11. B5 names the 3rd cusp for lottery but its example uses the 11th.'], cite: 'B3 pp. 223–233; B6 pp. 222–225, 282' },
  { id: 'jobchange', label: 'Change of job, transfer', cusp: 10, yes: [3, 9, 12], deny: [2, 8, 11], denyFrom: 'derived',
    notes: ['Change 3-9-12 (B3 p. 360) or 3-5-9 (B6 p. 306); transfer 3-10-12 (B6 p. 283).'], cite: 'B3 p. 360; B6 pp. 283, 306' },
  { id: 'spiritual', label: 'Spiritual life', cusp: 12, yes: [5, 10, 11], deny: [], denyFrom: 'book',
    notes: ['Sanyasa 3-10-12 with Saturn (B6 p. 317).'], cite: 'B6 p. 317; B3 pp. 412–418' },
];

export type Promise = 'promised' | 'mixed' | 'denied' | 'not shown';
export interface MatterJudgement {
  matter: Matter;
  cusp: number;
  subLord: PlanetId;
  /** Houses the sub lord signifies. */
  subHouses: number[];
  promise: Promise;
  /** Significators of the "yes" houses, strongest first (order of the first house that lists them). */
  significators: PlanetId[];
  /** Of those, the ones that also signify the denial group (KP4-009: to be pruned). */
  pruned: PlanetId[];
}

export function judgeMatter(
  matter: Matter, m: KpModel, sig: { planets: Record<PlanetId, PlanetSignification>; houses: { house: number; ordered: PlanetId[] }[] }, cusp = matter.cusp,
): MatterJudgement {
  const subLord = m.cusps[cusp - 1]!.lords[1];
  const subHouses = sig.planets[subLord].all;
  const y = subHouses.some((h) => matter.yes.includes(h)), d = subHouses.some((h) => matter.deny.includes(h));
  const promise: Promise = y && d ? 'mixed' : y ? 'promised' : d ? 'denied' : 'not shown';
  const significators: PlanetId[] = [];
  for (const h of matter.yes) for (const p of sig.houses[h - 1]!.ordered) if (!significators.includes(p)) significators.push(p);
  const pruned = significators.filter((p) => sig.planets[p].all.some((h) => matter.deny.includes(h)) && !sig.planets[p].all.some((h) => matter.yes.includes(h) && h !== cusp));
  return { matter, cusp, subLord, subHouses, promise, significators, pruned };
}

export interface TimingWindow { lords: PlanetId[]; start: number; end: number; strength: number }

/**
 * Periods whose lords all signify the matter's houses: bhuktis (dasa and
 * bhukti lords) and, inside them, anthras (all three). `strength` = how many
 * of the lords' houses fall in the "yes" group minus those in the denial group.
 */
export function timingWindows(
  mahas: DashaPeriod[], matter: Matter, planets: Record<PlanetId, PlanetSignification>, fromJd: number, toJd: number,
): TimingWindow[] {
  const ok = (p: PlanetId) => planets[p].all.some((h) => matter.yes.includes(h));
  const score = (ls: PlanetId[]) => ls.reduce((s, p) => s + planets[p].all.filter((h) => matter.yes.includes(h)).length - planets[p].all.filter((h) => matter.deny.includes(h)).length, 0);
  const out: TimingWindow[] = [];
  for (const md of mahas) {
    if (md.end < fromJd || md.start > toJd || !ok(md.lords[0]!)) continue;
    for (const bh of subperiods(md)) {
      if (bh.end < fromJd || bh.start > toJd || !ok(bh.lords[1]!)) continue;
      for (const an of subperiods(bh)) {
        if (an.end < fromJd || an.start > toJd || !ok(an.lords[2]!)) continue;
        out.push({ lords: an.lords, start: an.start, end: an.end, strength: score(an.lords) });
      }
    }
  }
  return out;
}


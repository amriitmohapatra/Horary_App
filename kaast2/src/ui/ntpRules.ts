/**
 * Wording and citations of the NTP rules the engine applies
 * (src/engine/iyer/ntp.ts). Paraphrased; citations are to the one-based
 * SOURCE PDF page of Iyer's New Techniques of Prediction (references/NTP).
 */
import type { Finding } from '../engine/iyer/ntp';
import { PLANET_NAMES } from '../engine/names';
import type { PlanetId } from '../engine/types';
import { SIGNS } from '../engine/zodiac';

type P = Record<string, string | number>;
const n = (p: unknown) => PLANET_NAMES[p as PlanetId] ?? String(p);
const role = (p: P) => (p.role === 'posRole' ? ' In its positive role (lordship of good houses or Yogi status):' : p.role === 'negRole' ? ' In its negative role (lordship of dusthanas or Zero Rasis, Avayogi, node):' : '');
const ord = (h: unknown) => {
  const x = Number(h);
  return `${x}${x === 1 ? 'st' : x === 2 ? 'nd' : x === 3 ? 'rd' : 'th'}`;
};

export interface RuleText { text: (p: P) => string; cite: string }

export const NTP_RULES: Record<string, RuleText> = {
  // --- Positive / negative planets (NTP-2 ch. I)
  T1: { cite: 'NTP-2 p. 9', text: (p) => `${role(p)} A positive planet in a positive bhava (the ${ord(p.bhava)}) and in its own sign — good.` },
  T1b: { cite: 'NTP-2 pp. 7–9', text: (p) => `${role(p)} A positive planet in a positive bhava (the ${ord(p.bhava)}) stays positive — favourable for the houses it rules.` },
  T2: { cite: 'NTP-2 p. 10', text: (p) => `${role(p)} Positive planet in a positive bhava but a negative sign (Zero Rasi or debilitation) — good, but reduced.` },
  T3: { cite: 'NTP-2 p. 10', text: (p) => `${role(p)} Positive planet in a negative bhava, a negative sign or eclipsed (combust), and not retrograde — bad for the houses it rules.` },
  T4: { cite: 'NTP-2 p. 10', text: (p) => `${role(p)} Positive planet negatively placed, but retrograde — a little better than plain bad.` },
  T5: { cite: 'NTP-2 p. 10', text: (p) => `${role(p)} Positive planet in a positive star (its star lord ${n(p.star)} is positive) — good.` },
  T6: { cite: 'NTP-2 p. 10', text: (p) => `${role(p)} Positive planet in a negative star (star lord ${n(p.star)} is negative) — bad.` },
  T7: { cite: 'NTP-2 p. 10', text: (p) => `${role(p)} Though negatively placed, it is in its own star — good after hurdles.` },
  T8: { cite: 'NTP-2 p. 11', text: (p) => `${role(p)} Negative planet in a positive bhava (the ${ord(p.bhava)}), not in a negative sign and not eclipsed — bad.` },
  T9: { cite: 'NTP-2 p. 11', text: (p) => `${role(p)} Negative planet in a positive bhava but in a negative sign or combust — good.` },
  T10: { cite: 'NTP-2 p. 11', text: (p) => `${role(p)} Negative planet in a negative bhava (the ${ord(p.bhava)}) — good (minus × minus).` },
  T11: { cite: 'NTP-2 p. 11', text: (p) => `${role(p)} Negative planet negative in every way and combust — excellent results.` },
  T12: { cite: 'NTP-2 p. 11', text: (p) => `${role(p)} Negative planet in a positive star (star lord ${n(p.star)} is positive) — bad.` },
  T13: { cite: 'NTP-2 p. 11', text: (p) => `${role(p)} Negative planet in a negative star (star lord ${n(p.star)} is negative) — very good.` },
  T15p: { cite: 'NTP-2 p. 13', text: (p) => `${role(p)} Positive planet in its enemy's star (${n(p.star)}) — bad.` },
  T15n: { cite: 'NTP-2 p. 13', text: (p) => `${role(p)} Negative planet in its enemy's star (${n(p.star)}) — good.` },
  O5: { cite: 'NTP-2 p. 8', text: () => 'A positive planet in a negative sign gives tolerably good results because it is retrograde.' },
  O6: { cite: 'NTP-2 p. 8', text: (p) => `${role(p)} A negative planet should not be retrograde: retrogression makes it more powerful to do evil.` },
  O9: { cite: 'NTP-2 p. 9', text: (p) => `${role(p)} A negative planet in a Zero Rasi or negative sign/bhava would be good, but retrogression turns it bad.` },
  T33: { cite: 'NTP-2 p. 20', text: () => 'It has both positive and negative roles: results vary — good for some of its matters, bad for others.' },
  ZR: { cite: 'NTP-2 pp. 6–7', text: (p) => `Placed in a Zero Rasi (${SIGNS[Number(p.sign)]}, burnt sign of the birth tithi): it loses power unless retrograde.` },
  T30: { cite: 'NTP-2 p. 18', text: () => 'In a Zero Rasi but retrograde: protected from falling down.' },
  // --- Yoga relations
  T14: { cite: 'NTP-2 p. 12', text: (p) => `In the star of the Birth Yogi (${n(p.yogi)}) — a "yoga star": gives good.` },
  T14d: { cite: 'NTP-2 pp. 12–14', text: (p) => `In the star of the Duplicate Yogi (${n(p.yogi)}), who acts as the Birth Yogi — good.` },
  O2a: { cite: 'NTP-2 p. 8', text: (p) => `In the star of the Avayogi (${n(p.avayogi)}) — tends to malefic results.` },
  T16y: { cite: 'NTP-2 pp. 6, 13', text: (p) => `Belongs to the Yogi's set of three (with ${n(p.yogi)}) — shares the yoga character, gives good.` },
  T16a: { cite: 'NTP-2 pp. 6, 13', text: (p) => `Belongs to the Avayogi's set of three (with ${n(p.avayogi)}) — tends to cause evil.` },
  T16s: { cite: 'NTP-2 p. 13', text: (p) => `Its star lord ${n(p.star)} belongs to the Yogi's set of three — Iyer's example shows this lifting the period.` },
  T17y: { cite: 'NTP-2 pp. 9, 13', text: (p) => `${p.how === 'with' ? 'Conjoined with' : 'Aspected by'} the Birth Yogi ${n(p.yogi)} — takes on yoga character, becomes good.` },
  T17a: { cite: 'NTP-2 pp. 9, 13–14', text: (p) => `${p.how === 'with' ? 'Conjoined with' : 'Aspected by'} the Avayogi ${n(p.avayogi)} — takes on its adverse character.` },
  O1: { cite: 'NTP-2 p. 8', text: () => 'A Yogi keeps its yoga character even where its placement makes it negative.' },
  T18: { cite: 'NTP-2 p. 14', text: () => 'A Yogi in a negative bhava or sign — not much good.' },
  T19: { cite: 'NTP-2 p. 14', text: () => 'A Yogi owning negative bhavas or Zero Rasis still gives at least some good.' },
  T19x: { cite: 'NTP-2 p. 14', text: () => 'An exalted Yogi retains high yoga effects in its Dasha (Iyer, Chart 16).' },
  T20: { cite: 'NTP-2 pp. 14–15', text: () => 'The Duplicate Yogi acts as the Birth Yogi.' },
  O12: { cite: 'NTP-2 p. 9', text: () => 'Duplicate Yogi in the star of the Birth Yogi (or the reverse) confers high yoga.' },
  T21: { cite: 'NTP-2 p. 15', text: () => 'The Avayogi in a positive star — bad.' },
  T22: { cite: 'NTP-2 pp. 15–16', text: () => 'The Avayogi negatively placed (negative bhava, sign or star, or combust) — becomes good.' },
  T23: { cite: 'NTP-2 p. 16', text: (p) => `The Avayogi in the star of a Yogi (${n(p.yogi)}) — yoga after hurdles.` },
  T24: { cite: 'NTP-2 pp. 16–17', text: () => 'The Avayogi as lord of a Zero Rasi — good.' },
  T26: { cite: 'NTP-2 pp. 9, 17', text: () => "The Avayogi in its enemy's star — good." },
  O7r: { cite: 'NTP-2 pp. 8, 17', text: () => 'Rahu in a Zero Rasi — exceptionally good (nodes are natural negatives).' },
  O7k: { cite: 'NTP-2 pp. 8, 17', text: () => 'Ketu in a Zero Rasi — extremely good (nodes are natural negatives).' },
  T27: { cite: 'NTP-2 p. 17', text: (p) => `In the star of a Zero Rasi lord (${n(p.star)}) — favourable for a node.` },
  T28: { cite: 'NTP-2 p. 18', text: (p) => `With the Avayogi ${n(p.avayogi)} or in its star — still good for a node (exception: nodes are natural negatives).` },
  T29r: { cite: 'NTP-2 p. 18', text: () => "Rahu in Ketu's star — good." },
  T29k: { cite: 'NTP-2 p. 18', text: () => "Ketu in Rahu's star — not good: it goes to its enemy's star." },
  O8: { cite: 'NTP-2 pp. 9, 19', text: (p) => `Weigh it through its star lord ${n(p.star)}: that planet's position and condition modify the result.` },
  T32: { cite: 'NTP-2 p. 19', text: (p) => `Its star lord and ${n(p.other)}'s are exchanged: the effect of one is felt during the period of the other.` },
  // --- Chart level
  T34y: { cite: 'NTP-2 p. 20', text: (p) => `The Lagna is in a star of the Birth Yogi (${n(p.star)}): prosperity from birth to death.` },
  T34a: { cite: 'NTP-2 p. 20', text: (p) => `The Lagna is in a star of the Avayogi (${n(p.star)}): the reverse of prosperity.` },
  L1: { cite: 'NTP-2 p. 36', text: (p) => `The Birth Yogi ${n(p.yogi)} and the yogi of the birth Dasha (${n(p.dasha)}) are in the Lagna: Raja yoga for life.` },
  L2: { cite: 'NTP-2 p. 36', text: (p) => `The Lagna lord ${n(p.lord)} or the Lagna's star lord ${n(p.star)} is the Birth Yogi: yoga from birth to death.` },
  L3: { cite: 'NTP-2 p. 37', text: (p) => `The Lagna's star lord ${n(p.star)} is in the Lagna or in its own star: counts as the Lagna lord in its own house.` },
  L3y: { cite: 'NTP-2 p. 37', text: () => 'That star lord is the Birth Yogi or in its star: yoga all through life.' },
  L4a: { cite: 'NTP-2 p. 37', text: (p) => `${n(p.planet)}, though negative, is in the Lagna's star — good.` },
  L4b: { cite: 'NTP-2 p. 37', text: (p) => `The Lagna lord ${n(p.lord)} is negative, yet as Lagna lord it is good.` },
  L4c: { cite: 'NTP-2 p. 37', text: (p) => `The Lagna is a Zero Rasi, yet its lord ${n(p.lord)} gives good.` },
  O4: { cite: 'NTP-2 p. 8', text: (p) => `Dusthana bhava(s) ${p.list} fall in Zero Rasis: good — no enemy, debt or loss from them.` },
  ZR0: { cite: 'NTP-1 p. 18', text: () => 'Born on a full or new moon tithi: there are no Zero Rasis.' },
  YD: { cite: 'NTP-2 pp. 5, 9', text: (p) => `The Birth Yogi ${n(p.yogi)} is also the Duplicate Yogi (lord of the sign of the Yoga point).` },
  // --- Dasha (NTP-2 ch. II)
  D5: { cite: 'NTP-2 p. 37', text: (p) => `Lagna column of this Dasha chart: Starter ${n(p.starter)} — read longevity, health and character for the Dasha from it.` },
  D8: { cite: 'NTP-2 p. 37', text: (p) => `The Birth Yogi ${n(p.yogi)} crosses the Dasha Yogi ${n(p.dashaYogi)}: a very powerful, affluent Dasha.` },
  D9: { cite: 'NTP-2 p. 38', text: () => 'The Birth Yogi crosses itself in this Dasha chart: a neutral Dasha.' },
  D10: { cite: 'NTP-2 p. 38', text: () => 'The Avayogi crosses the Birth Yogi: final success during the Dasha, under strain.' },
  D12: { cite: 'NTP-2 p. 38', text: () => 'The Birth Yogi is also the Dasha Yogi: an excellent Dasha.' },
  D13: { cite: 'NTP-2 p. 38', text: () => 'The Birth Yogi or the Dasha Yogi crosses the Dasha lord: a very good Dasha.' },
  D14: { cite: 'NTP-2 p. 38', text: (p) => `Among the Dasha lord, Birth Yogi, Dasha Yogi and Raja Yogi, one crosses another (${p.list}): very good results.` },
  D15: { cite: 'NTP-2 p. 38', text: () => 'The Birth Yogi and the Dasha Yogi are enemies: both good and bad in this Dasha.' },
  D17: { cite: 'NTP-2 p. 38', text: (p) => `The Birth Yogi is the enemy of the Dasha lord ${n(p.dasha)}: the good attained so far may vanish in this Dasha.` },
  D16: { cite: 'NTP-2 p. 38', text: (p) => `The ${p.which} ${n(p.crossed)} belongs to the Yogi's set of three — good.` },
  D6: { cite: 'NTP-2 p. 37', text: (p) => `The Bhukti lord crosses the enemy of the Dasha lord ${n(p.dasha)}, who is weak at birth: the bhavas of ${n(p.bhukti)} suffer.` },
  // --- Bhukti rules (NTP-2 pp. 34–36). X crosses Y = Y is X's Starter or Ruler.
  B1: { cite: 'NTP-2 p. 34', text: (p) => `Negative ${n(p.bhukti)} crosses a negative planet (${n(p.crossed)}, ${p.which}) — good.` },
  B2: { cite: 'NTP-2 p. 34', text: (p) => `Negative ${n(p.bhukti)} crosses a Yogi (${n(p.crossed)}, ${p.which}) — yoga in the end, after hurdles.` },
  B3: { cite: 'NTP-2 p. 34', text: (p) => `Positive ${n(p.bhukti)} crosses a positive planet or a Yogi (${n(p.crossed)}, ${p.which}) — good.` },
  B4: { cite: 'NTP-2 p. 35', text: (p) => `${n(p.bhukti)}, negative but itself a Yogi, crosses ${n(p.crossed)} — yoga, of a lower order.` },
  B5: { cite: 'NTP-2 p. 35', text: (p) => `A Yogi (${n(p.bhukti)}) crosses another Yogi (${n(p.crossed)}) — excellent.` },
  B6: { cite: 'NTP-2 p. 35', text: () => 'Positive Bhukti lord, negative Starter, positive or Yogi Ruler — first bad, then good.' },
  B7: { cite: 'NTP-2 p. 35', text: () => 'Negative Bhukti lord, negative Starter, positive Ruler — first good, later bad.' },
  B8: { cite: 'NTP-2 p. 35', text: () => 'Bhukti lord, Starter and Ruler all of the same character — the entire Bhukti is good.' },
  B9: { cite: 'NTP-2 p. 35', text: (p) => `Positive ${n(p.bhukti)} crosses a Yogi who is its enemy (${n(p.crossed)}) — both enmity and yoga happen.` },
  B10: { cite: 'NTP-2 p. 35', text: (p) => `Negative ${n(p.bhukti)} crosses a Yogi who is its enemy (${n(p.crossed)}) — excellent results.` },
  B11: { cite: 'NTP-2 p. 35', text: (p) => `The Birth Yogi crosses its negative enemy (${n(p.crossed)}) — good.` },
  B12: { cite: 'NTP-2 p. 35', text: (p) => `The Birth Avayogi crosses its negative enemy (${n(p.crossed)}) — excellent attainments through enemies.` },
  B13: { cite: 'NTP-2 p. 35', text: (p) => `Negative retrograde ${n(p.bhukti)} crosses a negative planet (${n(p.crossed)}) — good.` },
  B14: { cite: 'NTP-2 p. 35', text: (p) => `The Birth Avayogi crosses its enemy (${n(p.crossed)}) — good.` },
  B15: { cite: 'NTP-2 p. 35', text: (p) => `The Birth Yogi crosses its enemy (${n(p.crossed)}) — bad.` },
  B16: { cite: 'NTP-2 p. 35', text: () => 'Rahu crosses Rahu when Saturn is the Yogi — good (Rahu is like Saturn).' },
  B17: { cite: 'NTP-2 p. 35', text: () => 'Ketu crosses Ketu when Mars is the Yogi — good (Ketu is like Mars).' },
  B18: { cite: 'NTP-2 p. 35', text: (p) => `Positive ${n(p.bhukti)} crosses the Avayogi, a negative planet or its enemy (${n(p.crossed)}, ${p.which}) — bad.` },
  B19: { cite: 'NTP-2 p. 35', text: (p) => `The Birth Avayogi crosses a positive planet that is no Yogi (${n(p.crossed)}) — bad.` },
  B20: { cite: 'NTP-2 p. 36', text: (p) => `The Birth Yogi crosses a negative planet (${n(p.crossed)}) — bad.` },
  B21: { cite: 'NTP-2 p. 36', text: (p) => `The Raja Yogi or Dasha Yogi crosses the Birth Avayogi (${n(p.crossed)}) — bad.` },
  B22: { cite: 'NTP-2 p. 36', text: (p) => `Positive ${n(p.bhukti)} crosses the enemy of the Birth Avayogi (${n(p.crossed)}) — good.` },
};

export function ruleText(f: Finding): { text: string; cite: string } {
  const r = NTP_RULES[f.rule];
  if (!r) return { text: f.rule, cite: '' };
  return { text: r.text(f.params ?? {}).trim(), cite: r.cite };
}

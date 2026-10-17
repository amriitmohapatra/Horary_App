/**
 * Wording and citations of the NTP rules the engine applies
 * (src/engine/iyer/ntp.ts). Paraphrased; citations are to the one-based
 * SOURCE PDF page of Iyer's New Techniques of Prediction (references/NTP).
 */
import type { Finding } from '../engine/iyer/ntp';
import { NAKSHATRA_NAMES, PLANET_NAMES } from '../engine/names';
import type { PlanetId } from '../engine/types';
import { SIGNS } from '../engine/zodiac';

type P = Record<string, string | number>;
const pd = (x: unknown) => { const v = Number(x); return `${NAKSHATRA_NAMES[Math.floor((v - 1) / 4)]} ${((v - 1) % 4) + 1}`; };
const n = (p: unknown) => PLANET_NAMES[p as PlanetId] ?? String(p);
const role = (p: P) => (p.role === 'posRole' ? 'Positive side —' : p.role === 'negRole' ? 'Negative side —' : '');
const ord = (h: unknown) => {
  const x = Number(h);
  return `${x}${x === 1 ? 'st' : x === 2 ? 'nd' : x === 3 ? 'rd' : 'th'}`;
};

/** Bhavat bhava effects, NTP-1 pp. 138–140 (lord of the Nth in the Nth sign from its bhava). */
const BB: Record<number, string> = {
  2: 'capital grows (wealth from wealth)', 3: 'half-, step- or adopted younger siblings', 4: 'further education, a step-mother, happiness in succession',
  5: 'adopted or step children', 6: 'disease, debt or enemies leading to more of the same', 7: 'more than one partner',
  8: 'one death causing another', 9: 'added fortune; a step-father', 10: 'change of profession', 11: 'multiple profits', 12: 'over-spending',
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
  // --- NTP-1: planet states and bhava rules
  N1combust: { cite: 'NTP-1 p. 127', text: () => 'Combust ("eclipsed" by the Sun\'s rays): such a planet can never do good wherever it is.' },
  N1combustWorst: { cite: 'NTP-1 p. 127', text: () => 'Combust and in a bad position: Iyer says eclipsed planets cause the worst results there.' },
  N1combustHalf: { cite: 'NTP-1 p. 127', text: (p) => `Combust, but ${n(p.planet)} is the exception: Saturn and Venus still give half their effects when eclipsed.` },
  N1exalt: { cite: 'NTP-1 pp. 45, 134', text: () => 'Exalted: naturally strong, so its natural significations (karakatwas) prosper.' },
  N1exaltFM: { cite: 'NTP-1 p. 134', text: (p) => `Exalted but a functional malefic (lord of ${p.list}) in a good bhava: the exaltation increases the bad of those bhavas.` },
  N1exaltDust: { cite: 'NTP-1 p. 134', text: (p) => `Exalted but in a dusthana: bhava position outranks dignity, so for the bhavas it owns (${p.list}) the exaltation "will be of no avail".` },
  N1debil: { cite: 'NTP-1 pp. 117–118', text: () => 'Debilitated, with none of Iyer\'s cancellation (Neecha Bhanga) conditions met.' },
  N1debilGood: { cite: 'NTP-1 p. 134', text: (p) => `Debilitated, but in a good bhava: bhava position outranks dignity, so it still does good to the bhavas it owns (${p.list}), to a lesser degree.` },
  N1nb: { cite: 'NTP-1 pp. 117–118', text: (p) => `Debilitation cancelled (Neecha Bhanga Raja yoga — rise from low circumstances): ${String(p.by).split(',').map((b) => { const [q, w] = b.split(':'); return w === 'lordKT' ? `its sign lord ${n(q)} is in a kendra or trine from the Lagna` : w === 'exLordKT' ? `the lord of its exaltation sign, ${n(q)}, is in a kendra or trine` : w === 'retro' ? 'it is retrograde' : `its sign lord ${n(q)} aspects it`; }).join('; ')}. It shows from the Bhukti of ${String(p.timers).split(', ').map(n).join(' or ')} within its own Dasha.` },
  N1own: { cite: 'NTP-1 pp. 134, 136', text: (p) => `In its own sign: it always does good to the bhava whose cusp lies in that sign (bhava ${p.list}).` },
  N1fbGood: { cite: 'NTP-1 p. 133', text: (p) => `As lord of good bhavas (${p.list}) placed in a good bhava: does good to those bhavas.` },
  N1fbDust: { cite: 'NTP-1 p. 133', text: (p) => `As lord of good bhavas (${p.list}) placed in a dusthana: spoils those bhavas.` },
  N1fmGood: { cite: 'NTP-1 p. 133', text: (p) => `As lord of dusthana(s) ${p.list} placed in a good bhava: gains strength to increase the bad of those bhavas.` },
  N1viparita: { cite: 'NTP-1 pp. 116, 133', text: (p) => `As lord of dusthana(s) ${p.list} placed in a dusthana: weakened — Viparita Raja yoga, sudden unexpected good, possibly after hurdles.` },
  N1nbOcc: { cite: 'NTP-1 pp. 132–133', text: (p) => `A natural benefic: does good to the bhava it occupies (${p.bhava}) and the bhavas it aspects.` },
  N1nmOcc: { cite: 'NTP-1 pp. 132–133', text: (p) => `A natural malefic: spoils the bhava it occupies (${p.bhava}) and the bhavas it aspects.` },
  N1upachaya: { cite: 'NTP-1 p. 133', text: (p) => `In the ${ord(p.bhava)} (an upachaya): its own significations improve gradually.` },
  N1nbDust: { cite: 'NTP-1 p. 133', text: (p) => `A natural benefic in a dusthana (the ${ord(p.bhava)}): its own significations suffer.` },
  N1nmDust: { cite: 'NTP-1 p. 133', text: (p) => `A natural malefic in the ${ord(p.bhava)}: its own significations suffer.` },
  N1aroha: { cite: 'NTP-1 p. 128', text: (p) => `Before the middle of bhava ${p.bhava} (aroha), giving about ${p.pct}% of its effect: the bhava's results grow as its period runs.` },
  N1avaroha: { cite: 'NTP-1 p. 128', text: (p) => `Past the middle of bhava ${p.bhava} (avaroha), giving about ${p.pct}% of its effect: the bhava's results decline as its period runs.` },
  N1sandhi: { cite: 'NTP-1 p. 128', text: (p) => `Near the bhava junction (sandhi, ${p.pct}% effect): ineffective for bhavas ${p.bhava} and ${p.other}, though it still gives the effects of the bhavas it owns and aspects. (The app calls it a sandhi below 10%; Iyer gives no orb.)` },
  N1karaka: { cite: 'NTP-1 pp. 136–137', text: (p) => `Karaka of the ${ord(p.kb)} bhava placed in that bhava's cusp sign: it lessens the good of that bhava (not total destruction). Predict only if its Dasha comes at a fitting age.` },
  N1karakaYogi: { cite: 'NTP-1 pp. 137–138', text: (p) => `Karaka of the ${ord(p.kb)} bhava in that bhava's cusp sign, but it is the Birth Yogi or in its star: the karaka evil should not be predicted.` },
  N1sa8: { cite: 'NTP-1 p. 138', text: () => 'Saturn in the 8th bhava\'s cusp sign: extends longevity (an exception to the karaka rule).' },
  N1me8: { cite: 'NTP-1 p. 138', text: () => 'Mercury in the 8th bhava\'s cusp sign: unforeseen, hidden wealth.' },
  N1bb: { cite: 'NTP-1 pp. 138–140', text: (p) => `Bhavat bhava: as lord of the ${ord(p.n)} it sits ${p.n} signs from that bhava — ${BB[Number(p.n)] ?? 'a further, analogous event of that bhava'}.` },
  N1dig: { cite: 'NTP-1 pp. 108–109', text: () => 'Has Digbala (directional strength): in its period the native commands others.' },
  N1kendra: { cite: 'NTP-1 p. 21', text: () => 'In a kendra: during its Dasha the native has surplus wealth.' },
  N1relGood: { cite: 'NTP-1 p. 126', text: (p) => `In the ${ord(p.rh)} bhava (a kendra or trine from the Lagna): does good in its Dasha and Bhuktis.` },
  N1rel2: { cite: 'NTP-1 p. 126', text: () => 'In the 2nd bhava from the Lagna: neutral — neither good nor bad.' },
  N1relMa6: { cite: 'NTP-1 p. 126', text: () => 'Mars in the 6th bhava: good, as it aspects the Lagna with its 8th aspect.' },
  N1relBad: { cite: 'NTP-1 p. 126', text: (p) => `In the ${ord(p.rh)} bhava (3, 6, 8, 12 from the Lagna): "of no avail" for the native in its periods.` },
  N1fixed: { cite: 'NTP-1 pp. 70–71', text: () => 'In a fixed star: during its period the native stays in one place.' },
  N1movable: { cite: 'NTP-1 pp. 70–71', text: () => 'In a movable star: during its period the native keeps moving.' },
  N1sookshma: { cite: 'NTP-1 pp. 152–153', text: (p) => `Sookshma lord of bhava ${p.list} (that cusp lies in its star): it gives that bhava's effects in its periods, as much as the sign lord.` },
  // --- NTP-1: yogas (Ch. V), effective only in the Dashas of the planets forming them (p. 110)
  Y1maha: { cite: 'NTP-1 pp. 110–111', text: (p) => `${p.name} yoga: ${n(p.planets)} in a kendra in its own or exaltation sign — a powerful planet in an auspicious bhava gives good in its period.` },
  Y1kesari: { cite: 'NTP-1 pp. 113–114', text: () => 'Gaja-kesari: Jupiter in a kendra from the Moon — real effect only if Jupiter is strong, well placed, owns good bhavas and its Dasha comes in time.' },
  Y1sunapha: { cite: 'NTP-1 pp. 111–112', text: (p) => `Sunapha: powerful ${p.planets} in the 2nd from the Moon — its portfolios prosper in its periods.` },
  Y1anapha: { cite: 'NTP-1 pp. 111–112', text: (p) => `Anapha: powerful ${p.planets} in the 12th from the Moon — its portfolios prosper in its periods.` },
  Y1durudhara: { cite: 'NTP-1 pp. 111–112', text: (p) => `Durudhara: powerful ${p.planets} on both sides of the Moon — their portfolios prosper in their periods.` },
  Y1shubhaKartari: { cite: 'NTP-1 p. 112', text: (p) => `Shubha-kartari: benefics (${p.planets}) on both sides of the Lagna — good.` },
  Y1sushubha: { cite: 'NTP-1 p. 112', text: (p) => `Benefics only in the 2nd from the Lagna (${p.planets}) — "Sushubha", also good.` },
  Y1papaKartari: { cite: 'NTP-1 p. 112', text: (p) => `Papa-kartari: malefics (${p.planets}) on both sides of the Lagna — bad.` },
  Y1adhi: { cite: 'NTP-1 p. 113', text: (p) => `Adhi yoga: benefics (${p.planets}) in the 6th, 7th or 8th from the Moon — superior position.` },
  Y1vasumat: { cite: 'NTP-1 p. 114', text: () => 'Vasumat yoga: all benefics in upachayas (3, 6, 10, 11) from the Lagna.' },
  Y1amala: { cite: 'NTP-1 p. 115', text: (p) => `Amala yoga: benefic ${p.planets} in the 10th from the Lagna or the Moon.` },
  Y1raja: { cite: 'NTP-1 pp. 116–117', text: (p) => `Raja yoga (prosperity and position, not literal kingship): kendra and trine lords combined — ${p.list}. The 9th–10th combination is the prime one.` },
  Y1viparita: { cite: 'NTP-1 p. 116', text: (p) => `Viparita Raja yoga: dusthana lord(s) ${p.planets} placed in dusthanas — sudden, unexpected rise.` },
  Y1parivartana: { cite: 'NTP-1 p. 116', text: (p) => `Parivartana (exchange of signs) between ${p.planets}: ${p.kind === 'good' ? 'lords of good bhavas — good' : p.kind === 'viparita' ? 'lords of bad bhavas — Viparita yoga' : 'a good and a bad bhava lord — mixed'}.` },
  Y1lakshmi: { cite: 'NTP-1 p. 115', text: () => 'Lakshmi yoga: the 9th lord and Venus in own or exaltation signs in kendras or trines — all the good of the 9th bhava and of Venus.' },
  Y1lagnaNone: { cite: 'NTP-1 p. 143', text: () => 'No planet aspects the Lagna (by Iyer\'s aspects, including conjunction): Iyer reads a quiet, uneventful nature.' },
  Y1lagnaAsp: { cite: 'NTP-1 pp. 142–143', text: (p) => `Planets aspecting the Lagna (incl. conjunction): ${p.planets}. Benefics make the nature good — Jupiter best; malefics coarsen it, except Saturn (philosophic); Mars makes it rash. More planets, more varied activities.` },
  Y1luminaries: { cite: 'NTP-1 p. 113', text: () => 'The Sun and the Moon on either side of the Lagna: protectors, they do much good.' },
  // --- NTP-2 ch. IV: Mathematical Navamsha, three stars (pp. 83, 89)
  M9stars: { cite: 'NTP-2 pp. 83, 89', text: (p) => `Three stars (Mathematical Navamsha): it occupies ${pd(p.a)}, gives its amsha to ${pd(p.b)} (lord ${n(p.lb)}), and ${pd(p.c)} (lord ${n(p.lc)}) falls on its own place.` },
  M9gYogi: { cite: 'NTP-2 pp. 39, 89', text: (p) => `The star falling on its place belongs to the Birth Yogi ${n(p.lc)}: its Dasha takes on yoga character.` },
  M9gAva: { cite: 'NTP-2 pp. 39, 89', text: (p) => `The star falling on its place belongs to the Avayogi ${n(p.lc)}: its Dasha takes on that adverse character.` },
  M9f: { cite: 'NTP-2 p. 89', text: (p) => `It gives its amsha to the ${ord(p.dist)} sign from itself (a dusthana): bad, felt in its Dasha in the Bhukti of ${n(p.lb)}.` },
  M9fRect: { cite: 'NTP-2 pp. 89, 97', text: (p) => `It gives its amsha to the ${ord(p.dist)} sign from itself, but through an exchanging pada: the setback in its Dasha (Bhukti of ${n(p.lb)}) is rectified later.` },
  M9d: { cite: 'NTP-2 pp. 88, 96', text: () => 'In its own sign or own star (or its amsha goes to its own star): if its Dasha is a good one, the yoga starts in its own Bhukti and lasts to the end of the Dasha.' },
  N2node: { cite: 'NTP-2 p. 93', text: () => 'A node gives the results of the planets conjoined with or aspecting it, and of the lords of its star and sign.' },
  // --- NTP-2 ch. IV: classical Bhukti rules (pp. 86–89, 94–101)
  BE: { cite: 'NTP-2 p. 89', text: (p) => `${n(p.bhukti)} is ${ord(p.dist)} from the Dasha lord ${n(p.dasha)}: the period may not be congenial.` },
  BL: { cite: 'NTP-2 pp. 95, 101', text: (p) => `${n(p.bhukti)} is in the ${ord(p.h)} bhava from the Lagna: a bad position from the Lagna tends to dominate the Bhukti.` },
  BC1: { cite: 'NTP-2 p. 87', text: (p) => `${n(p.bhukti)} sits in the sign or star of the Dasha lord — its "guest": the Dasha lord's powers prevail.` },
  BC2: { cite: 'NTP-2 pp. 87–88', text: (p) => `The Dasha lord sits in the sign or star of ${n(p.bhukti)} — its "tenant": ${n(p.bhukti)} changes the Dasha lord's trait (bad results if ${n(p.bhukti)} is bad).` },
  BN: { cite: 'NTP-2 pp. 86, 98', text: (p) => `No mutual relation between ${n(p.dasha)} and ${n(p.bhukti)} (sign exchange, mutual aspect, mutual kendra/trine, Navamsha stars, star exchange): Iyer says "without such relationship no results happen".` },
  BA1: { cite: 'NTP-2 pp. 86–87', text: () => 'Good Dasha lord, good related Bhukti lord: the Bhukti adds its good.' },
  BA2: { cite: 'NTP-2 pp. 86–87', text: () => "Good Dasha lord, good but unrelated Bhukti lord: neutral — only the Dasha lord's good is felt." },
  BA3: { cite: 'NTP-2 pp. 86–87', text: () => "Good Dasha lord, bad related Bhukti lord: the Dasha lord's good is modified by their relative strength." },
  BA4: { cite: 'NTP-2 pp. 86–87', text: () => "Good Dasha lord, bad unrelated Bhukti lord: the Dasha lord's good with traces of the Bhukti lord's evil." },
  BB1: { cite: 'NTP-2 p. 87', text: () => 'Bad Dasha lord, good related Bhukti lord: the bad is modified by their relative strength.' },
  BB2: { cite: 'NTP-2 p. 87', text: () => 'Bad Dasha lord, good but unrelated Bhukti lord: worse results.' },
  BB3: { cite: 'NTP-2 p. 87', text: () => 'Bad Dasha lord and bad Bhukti lord: worse results.' },
};

export function ruleText(f: Finding): { text: string; cite: string } {
  const r = NTP_RULES[f.rule];
  if (!r) return { text: f.rule, cite: '' };
  return { text: r.text(f.params ?? {}).trim(), cite: r.cite };
}

/** Notes on an area (D-chart) reading (NTP-2 pp. 57–63). */
export const AREA_NOTES: Record<string, string> = {
  house2: '2nd from the D-Lagna: neutral (rule 15)',
  exaltedNoAvail: 'exaltation in a dusthana is of no avail (rule 7)',
  retirement: '3rd of D-10: retirement or leaving service in its period (rule 14)',
  severance: '3rd or 8th: closing or severance of this matter in its period (rule 14)',
  strain: 'a period of strain for longevity matters (rule 14; Iyer\'s death readings are not shown)',
  combust: 'combust in D-1: useless in every D-chart (rule 4)',
  combustWorst: 'combust in D-1 and badly placed: worst results (rule 4)',
  combustHalf: 'combust, but Venus and Saturn keep half their effects (NTP-1 p. 127)',
  debilNoNB: 'debilitated without Neecha Bhanga: bad even when well placed (rule 12)',
  debilYogi: 'debilitated, but a Yogi: still does good (rule 31)',
  yogiGood: 'Yogi well placed: yoga for this area (rule 10)',
  yogiLost: 'Yogi badly placed: "he is lost" (rule 10)',
  yogi: 'Yogi (rule 10)',
  avayogiGood: 'Avayogi well placed: good, with hindrances and ruptures (rule 10)',
  exalted: 'exalted here (rule 6)', vargottama: 'Vargottama: same sign as in D-1 (rule 6)', own: 'own sign here (rule 6)', dig: 'Digbala here (rule 6)',
  karakaLagna: 'karaka in its own D-Lagna spoils this area (rule 37)',
  lagnaLordDust: 'lord of this D-Lagna in a dusthana: the area turns bad on and after its Dasha (rule 36)',
  lagnaLordYogi: 'lord of this D-Lagna and a Yogi: yoga even from an ordinary position (rule 35)',
  guruRelief: 'a strong Jupiter aspects it: the harm is relieved (rules 9, 27)',
  exception6: 'Mars in the 6th: good in every D-chart (rule 1)', exception8: 'Mercury in the 8th of D-4: good (rule 1)',
};
export function areaNote(k: string): string {
  if (k.startsWith('house')) { const h = Number(k.slice(5)); return h === 2 ? AREA_NOTES.house2! : [3, 6, 8, 12].includes(h) ? `${ord(h)} from the D-Lagna: always bad for this area (rule 1)` : `${ord(h)} from the D-Lagna: good for this area (rule 1)`; }
  if (k.startsWith('gain')) return `${ord(Number(k.slice(4)))} of D-11: the gain comes through that bhava's matters (rule 32)`;
  return AREA_NOTES[k] ?? k;
}

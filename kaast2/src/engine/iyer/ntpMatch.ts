/**
 * Iyer's marriage matching (NTP-2, PDF pp. 147–151; catalogue NTP2-807 …
 * NTP2-812): the destiny of the tie judged from one chart, then mutual
 * verification of the two charts; the kootams are "very very secondary" and
 * only Ayur, Nadi and Rajju are looked at, at the very end.
 *
 * Conventions as in ntp1.ts: Sripati bhavas (cusp = madhya) for lordship,
 * sign aspects with conjunction, Mars 4/8, Jupiter 5/9, Saturn/Rahu/Ketu 3/10.
 * Readings that the text leaves open are stated in `note`.
 */
import type { ChartResult, PlanetId } from '../types';
import { bhavaChart } from '../houses/bhava';
import { nat } from '../strength/common';
import { yogiPoints, nakshatraLord } from '../yogi/yogi';
import { SIGN_LORD, nakshatraIndex, signIndex } from '../zodiac';
import { aspectsSign } from './ntp1';
import { nadiOf, rajjuOf, NADI_NAMES, RAJJU_NAMES } from '../match/nakshatra';

export type IyerTone = 'good' | 'bad' | 'mixed' | 'info';
export interface IyerCheck { id: string; rule: string; tone: IyerTone; text: string; cite: string }

const GUNA: Readonly<Record<PlanetId, 'Sattva' | 'Rajas' | 'Tamas'>> = {
  Su: 'Sattva', Mo: 'Sattva', Ju: 'Sattva', Me: 'Rajas', Ve: 'Rajas', Ma: 'Tamas', Sa: 'Tamas', Ra: 'Tamas', Ke: 'Tamas',
};
const h = (from: number, to: number) => ((to - from + 12) % 12) + 1;
const ord = (n: number) => `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`;
const sign = (c: ChartResult, p: PlanetId) => signIndex(c.bodies[p].lon);
const starLord = (c: ChartResult, p: PlanetId) => nakshatraLord(nakshatraIndex(c.bodies[p].lon));

interface Core { lords: PlanetId[]; lagnaSign: number; yogi: PlanetId; yogaStar: number; seventhStarLord: PlanetId }
function core(c: ChartResult): Core {
  const bc = bhavaChart(c, 'sripati');
  const y = yogiPoints(c.bodies.Su.lon, c.bodies.Mo.lon, { avayogi: 'sixth-nakshatra' });
  return {
    lords: bc.madhyaSign.map((s) => SIGN_LORD[s]!),
    lagnaSign: signIndex(c.asc.lon),
    yogi: y.yogi,
    yogaStar: y.yogiPoint.nakshatra,
    seventhStarLord: nakshatraLord(nakshatraIndex(bc.arcsec.madhya[6]!)),
  };
}
const joinedOrAspect = (c: ChartResult, a: PlanetId, b: PlanetId) =>
  sign(c, a) === sign(c, b) || aspectsSign(a, sign(c, a), sign(c, b)) || aspectsSign(b, sign(c, b), sign(c, a));

/** NTP2-811: what one chart says about the partner and the tie. */
export function singleSurvey(c: ChartResult): IyerCheck[] {
  const k = core(c);
  const l1 = k.lords[0]!, l7 = k.lords[6]!;
  const out: IyerCheck[] = [];
  const d = h(sign(c, l1), sign(c, l7));
  const bad = d === 6 || d === 8 || d === 12 || d === 2;
  const together = joinedOrAspect(c, l1, l7);
  out.push({ id: 'a', rule: 'Rasi / Graha maitram', cite: 'NTP-2 p. 150',
    tone: bad && !together ? 'bad' : together ? 'good' : 'info',
    text: `Lagna lord ${l1} and 7th lord ${l7} are ${d === 1 ? 'in the same sign' : `${d}/${14 - d === 13 ? 1 : (14 - d)} from each other`}`
      + (bad ? ' (mutually 6/8 or 2/12: the two differ, yet destiny brings such a partner)' : '')
      + (together ? '; joined or in aspect, so they live together even if enemies.' : '.') });
  const enemy = nat(l7, l1) < 0, back = nat(l1, l7) < 0;
  if (l1 !== l7 && (enemy || back)) {
    out.push({ id: 'a2', rule: 'Hostility', cite: 'NTP-2 p. 150', tone: enemy ? 'bad' : 'mixed',
      text: enemy ? `The 7th lord ${l7} is a natural enemy of the Lagna lord ${l1}: the partner may be hostile${back ? ', and it is mutual' : '; not reciprocated, so the native suffers more'}.`
        : `The Lagna lord ${l1} regards the 7th lord ${l7} as an enemy; the partner does not reciprocate.` });
  }
  out.push({ id: 'b', rule: 'Yoni', cite: 'NTP-2 p. 150', tone: 'info', text: 'Conjugal happiness: judge the 7th Bhava (its lord, occupants and aspects) instead of the Yoni kootam.' });
  out.push({ id: 'c', rule: 'Stree Deergham', cite: 'NTP-2 p. 150', tone: 'info', text: `Judge Venus (in ${['Ar','Ta','Ge','Cn','Le','Vi','Li','Sc','Sg','Cp','Aq','Pi'][sign(c, 'Ve')]}) and the 8th Bhava.` });
  const g1 = GUNA[l1], g7 = GUNA[l7];
  out.push({ id: 'd', rule: 'Gana', cite: 'NTP-2 p. 150', tone: g1 === g7 ? 'good' : 'info',
    text: `Gunas of the Lagna lord ${l1} (${g1}) and the 7th lord ${l7} (${g7})${g1 === g7 ? ': the same temperament.' : ': different temperaments.'}` });
  out.push({ id: 'e', rule: 'Other kootams', cite: 'NTP-2 p. 150', tone: 'info', text: 'For the rest, judge the 4th and the 7th Bhavas.' });
  const isYogi = l7 === k.yogi, inStar = starLord(c, l7) === k.yogi, withYogi = l7 !== k.yogi && sign(c, l7) === sign(c, k.yogi);
  out.push({ id: 'f', rule: '7th lord and the Birth Yogi', cite: 'NTP-2 p. 151',
    tone: isYogi || inStar || withYogi ? 'good' : 'info',
    text: isYogi ? `The 7th lord ${l7} is the Birth Yogi: general happiness and prosperity.`
      : inStar ? `The 7th lord ${l7} is in a star of the Birth Yogi ${k.yogi}: general happiness and prosperity.`
      : withYogi ? `The 7th lord ${l7} is with the Birth Yogi ${k.yogi}: general happiness and prosperity.`
      : `The 7th lord ${l7} is neither the Birth Yogi (${k.yogi}), nor in its star, nor with it.` });
  const asp = aspectsSign(l7, sign(c, l7), k.lagnaSign) && l7 !== l1, join = l7 !== l1 && sign(c, l7) === sign(c, l1);
  out.push({ id: 'g', rule: 'Amicability', cite: 'NTP-2 p. 151', tone: asp || join || l7 === l1 ? 'good' : 'info',
    text: l7 === l1 ? `The same planet rules the 1st and the 7th.` : asp || join ? `The 7th lord ${l7} ${asp ? 'aspects the Lagna' : ''}${asp && join ? ' and ' : ''}${join ? `joins the Lagna lord ${l1}` : ''}: amicability.` : `The 7th lord ${l7} neither aspects the Lagna nor joins the Lagna lord.` });
  out.push({ id: 'h', rule: 'Finally', cite: 'NTP-2 p. 151', tone: 'info', text: 'For definiteness judge from the effects of the Dasha lords in the Navamsha chart.' });
  return out;
}

/** NTP2-812: mutual verification, `a` the native and `b` the other. */
export function mutualChecks(a: ChartResult, b: ChartResult): IyerCheck[] {
  const A = core(a), B = core(b);
  const la = A.lords[0]!, lb = B.lords[0]!;
  const out: IyerCheck[] = [];
  const inA = la === lb || joinedOrAspect(a, la, lb), inB = la === lb || joinedOrAspect(b, la, lb);
  out.push({ id: 'a', rule: 'Lagna lords', cite: 'NTP-2 p. 151', tone: inA || inB ? 'good' : 'info',
    text: la === lb ? `Both Lagnas have the same lord ${la}.`
      : `The Lagna lords ${la} and ${lb} are ${inA || inB ? `joined or in aspect in ${inA && inB ? 'both charts' : inA ? 'the first chart' : 'the second chart'}: they live together, even if enemies.` : 'neither joined nor in aspect in either chart.'}` });
  for (const [x, X, Y, name] of [[a, A, B, 'first'], [b, B, A, 'second']] as const) {
    const l7 = X.lords[6]!;
    const hit = l7 === Y.yogi || X.seventhStarLord === Y.yogi || starLord(x, l7) === Y.yogi;
    out.push({ id: `b-${name}`, rule: `7th lord of the ${name} chart`, cite: 'NTP-2 p. 151', tone: hit ? 'good' : 'info',
      text: hit ? `The ${name} chart's 7th lord ${l7}${X.seventhStarLord === Y.yogi ? ` (7th cusp star lord ${X.seventhStarLord})` : ''} ${l7 === Y.yogi || X.seventhStarLord === Y.yogi ? 'is' : 'is in a star of'} the other's Birth Yogi ${Y.yogi}: a happy match.`
        : `The ${name} chart's 7th lord ${l7} (cusp star lord ${X.seventhStarLord}) is not the other's Birth Yogi ${Y.yogi} nor in its star.` });
    const yoga = nakshatraIndex(x.asc.lon) === Y.yogaStar;
    if (yoga) out.push({ id: `c-${name}`, rule: 'Lagna in the Yoga star', cite: 'NTP-2 p. 151', tone: 'good', text: `The ${name} chart's Lagna is in the other's Yoga star: yogaic.` });
  }
  const d = h(A.lagnaSign, B.lagnaSign);
  const bad = d === 6 || d === 8 || d === 2 || d === 12;
  out.push({ id: 'd', rule: 'Lagnas', cite: 'NTP-2 p. 151', tone: bad ? 'bad' : 'good',
    text: `The Lagnas are ${d === 1 ? 'in the same sign' : `${d}/${14 - d} from each other`}: ${bad ? 'a 6/8 or 2/12 relation.' : 'mutually in good positions.'}` });
  for (const [x, Y, name] of [[a, B, 'first'], [b, A, 'second']] as const) {
    const ok = aspectsSign(Y.yogi, sign(x, Y.yogi), signIndex(x.asc.lon));
    out.push({ id: `e-${name}`, rule: `Other's Yogi on the ${name} Lagna`, cite: 'NTP-2 p. 151', tone: ok ? 'good' : 'info',
      text: `The other's Birth Yogi ${Y.yogi}, as placed in the ${name} chart, ${ok ? 'aspects' : 'does not aspect'} its Lagna${ok ? ': good' : ''}. (Reading: Iyer does not say in which chart; the native's own chart is used.)` });
  }
  return out;
}

/** NTP2-810: the only kootams Iyer still looks at, last. */
export function iyerKootams(a: ChartResult, b: ChartResult): IyerCheck[] {
  const na = nakshatraIndex(a.bodies.Mo.lon), nb = nakshatraIndex(b.bodies.Mo.lon);
  const nadiSame = nadiOf(na) === nadiOf(nb), rajjuSame = rajjuOf(na) === rajjuOf(nb);
  return [
    { id: 'nadi', rule: 'Nadi kootam', cite: 'NTP-2 p. 151', tone: nadiSame ? 'bad' : 'good',
      text: `Moon stars in ${NADI_NAMES[nadiOf(na)]} and ${NADI_NAMES[nadiOf(nb)]} Nadi${nadiSame ? ': the same Nadi (dosha).' : ': different Nadis (agreeable).'}` },
    { id: 'rajju', rule: 'Rajju kootam', cite: 'NTP-2 p. 151', tone: rajjuSame ? 'bad' : 'good',
      text: `Moon stars in ${RAJJU_NAMES[rajjuOf(na)]} and ${RAJJU_NAMES[rajjuOf(nb)]} Rajju${rajjuSame ? ': the same Rajju (dosha).' : ': different Rajjus (agreeable).'}` },
    { id: 'ayur', rule: 'Ayur kootam', cite: 'NTP-2 pp. 147, 151', tone: 'info',
      text: 'Iyer names it but does not define it in NTP. His rule on longevity: judge each partner’s longevity from their own chart rather than matching doshas (NTP-2 p. 147).' },
  ];
}

/** NTP2-807: the traditional Kuja Dosha placement, labelled as Iyer reads it. */
export function kujaNote(c: ChartResult): IyerCheck {
  const k = core(c);
  const from = (s: number) => h(s, sign(c, 'Ma'));
  const pts = [['Lagna', k.lagnaSign], ['Moon', sign(c, 'Mo')], ['Venus', sign(c, 'Ve')]] as const;
  const hits = pts.filter(([, s]) => [1, 2, 4, 7, 8, 12].includes(from(s))).map(([n, s]) => `${ord(from(s))} from the ${n}`);
  const yogi = k.yogi === 'Ma';
  return { id: 'kuja', rule: 'Kuja Yoga, not Kuja Dosha', cite: 'NTP-2 pp. 147–148', tone: yogi ? 'good' : 'info',
    text: (hits.length ? `Mars is ${hits.join(', ')} (the traditional Kuja Dosha placement). ` : 'Mars is not in the traditional Kuja Dosha places. ')
      + (yogi ? 'Mars is the Birth Yogi, so he always does good wherever he is.' : 'Iyer rejects the dosha as a rule: judge what Mars owns and his yogic status, and check longevity directly.') };
}

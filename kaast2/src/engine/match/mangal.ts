/**
 * Mangala (Kuja) Dosha as PL 7's three Compatibility pages compute it
 * (docs/specs/compatibility.md §8). Consideration: Mars in the 1st, 2nd, 4th,
 * 7th, 8th or 12th sign from the Lagna and from the Moon (Venus and the 7th
 * lord are not used). Cancellation: PL's 25 rules (R1–R25), evaluated
 * literally from PL's formulas; houses are whole signs from the Lagna.
 * Operators PL does not document are INFERRED from the sentence beside them
 * (weak, strong, "inimical sign", the low-precedence "and"); such rules carry
 * `inferred: true`. The wording here is our own summary, not PL's text.
 */
import { isCombust } from '../combust';
import { DEBIL_SIGN, EXALT_SIGN, OWN, inMt, nat } from '../strength/common';
import type { ChartResult, PlanetId } from '../types';
import { SIGN_LORD, signIndex } from '../zodiac';
import { navamshaSign } from '../varga/cyclic';
import { ashtakoota, kootaPerson } from './kootas';

const DOSHA_HOUSES = [1, 2, 4, 7, 8, 12];
const SPECIAL: Partial<Record<PlanetId, number[]>> = { Ma: [4, 8], Ju: [5, 9], Sa: [3, 10] };

export interface MangalConsideration { fromLagna: number; fromMoon: number; lagnaDosha: boolean; moonDosha: boolean }
export interface Cancellation { id: string; who: 'pair' | 'groom' | 'bride'; text: string; inferred?: boolean }
export interface MangalReport {
  groom: MangalConsideration;
  bride: MangalConsideration;
  /** PL prints the cancellation list only when either has Mars in a dosha house from the Lagna. */
  gate: boolean;
  cancellations: Cancellation[];
}

class View {
  constructor(readonly c: ChartResult) {}
  sign(p: PlanetId): number { return signIndex(this.c.bodies[p].lon); }
  /** 1…12 from the Lagna, whole signs. */
  house(p: PlanetId): number { return ((this.sign(p) - signIndex(this.c.asc.lon) + 12) % 12) + 1; }
  lagnaSign(): number { return signIndex(this.c.asc.lon); }
  inH(p: PlanetId, hs: number[]): boolean { return hs.includes(this.house(p)); }
  /** PL sign numbers 1…12. */
  inSign(p: PlanetId, ss: number[]): boolean { return ss.includes(this.sign(p) + 1); }
  exalted(p: PlanetId, s = this.sign(p)): boolean { return s === EXALT_SIGN[p]; }
  debil(p: PlanetId, s = this.sign(p)): boolean { return s === DEBIL_SIGN[p]; }
  own(p: PlanetId, s = this.sign(p)): boolean { return OWN[p].includes(s); }
  conj(p: PlanetId, q: PlanetId): boolean { return this.sign(p) === this.sign(q); }
  /** p aspected by q (graha drishti by sign: 7th for all, Mars 4/8, Jupiter 5/9, Saturn 3/10). */
  aspectedBy(p: PlanetId, q: PlanetId): boolean {
    const n = ((this.sign(p) - this.sign(q) + 12) % 12) + 1;
    return n === 7 || (SPECIAL[q] ?? []).includes(n);
  }
  related(p: PlanetId, q: PlanetId): boolean { return this.conj(p, q) || this.aspectedBy(p, q); }
  combust(p: PlanetId): boolean { return isCombust(this.c.bodies[p], this.c.bodies.Su); }
  /** INFERRED "weak": debilitated, combust, or in a natural enemy's sign. */
  weak(p: PlanetId): boolean { return this.debil(p) || this.combust(p) || nat(p, SIGN_LORD[this.sign(p)]!) < 0; }
  /** INFERRED "strong": exalted, moolatrikona or own sign. */
  strong(p: PlanetId): boolean { return this.exalted(p) || this.own(p) || inMt(p, this.c.bodies[p].lonDeg); }
  mk(): boolean { return this.inH('Ma', DOSHA_HOUSES); }
}

function consideration(c: ChartResult): MangalConsideration {
  const v = new View(c);
  const fromLagna = v.house('Ma');
  const fromMoon = ((v.sign('Ma') - v.sign('Mo') + 12) % 12) + 1;
  return { fromLagna, fromMoon, lagnaDosha: DOSHA_HOUSES.includes(fromLagna), moonDosha: DOSHA_HOUSES.includes(fromMoon) };
}

const ORD = (n: number) => `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`;

/** R6–R25 for one person, evaluated in that person's own chart. */
function personRules(c: ChartResult, who: 'groom' | 'bride'): Cancellation[] {
  const v = new View(c);
  const out: Cancellation[] = [];
  const add = (id: string, ok: boolean, text: string, inferred?: boolean) => { if (ok) out.push({ id, who, text, ...(inferred ? { inferred } : {}) }); };
  const mk = v.mk();
  const h = v.house('Ma');
  const mars = `Mars in the ${ORD(h)} (${['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][v.sign('Ma')]})`;
  add('R6', mk && (v.weak('Ma') || v.related('Ma', 'Ve') || v.related('Ma', 'Ju') || v.combust('Ma')),
    `${mars} is weak, combust, or joined or aspected by Venus or Jupiter.`, true);
  add('R8', v.inH('Ma', [1, 2, 4, 8, 12]) && v.inSign('Ma', [1, 4, 7, 10]), `${mars} is in a movable sign.`);
  add('R9', mk && v.inH('Ma', [4, 7]) && v.inSign('Ma', [1, 4, 8, 10]), `${mars}: the 4th or 7th in Aries, Cancer, Scorpio or Capricorn.`);
  add('R10', v.inH('Ma', [1, 4, 7, 8, 12]) && (v.related('Ma', 'Mo') || v.related('Ma', 'Ju') || v.related('Ma', 'Me')),
    `${mars} is joined or aspected by the Moon, Jupiter or Mercury.`);
  const n9 = navamshaSign(c.bodies.Ma.lon);
  const cases = [v.exalted('Ma') && 'exalted', v.own('Ma') && 'in its own sign', v.exalted('Ma', n9) && 'exalted in the Navamsha',
    v.own('Ma', n9) && 'in its own sign in the Navamsha', v.inSign('Ma', [4]) && 'in Cancer', v.inSign('Ma', [5]) && 'in Leo'].filter(Boolean);
  add('R11', mk && cases.length > 0, `Mars is ${cases.join(', ')}.`);
  add('R12', v.inH('Ma', [1, 4, 7, 8, 12]) && v.inSign('Ma', [4, 5, 1, 8, 10]), `${mars}: in Leo, Cancer, Aries, Scorpio or Capricorn.`);
  add('R13', v.inH('Ma', [4]) && v.inSign('Ma', [1, 8, 2, 7]), `${mars}: the 4th in Aries, Scorpio, Taurus or Libra.`);
  add('R14', v.inH('Ma', [7]) && (v.debil('Ma') || v.exalted('Ma')), `${mars}: the 7th, debilitated or exalted.`);
  const lag = v.lagnaSign() + 1;
  add('R15', v.inH('Ma', [8]) && [2, 3, 5, 9].includes(lag), `${mars}: the 8th for a Taurus, Gemini, Leo or Sagittarius Lagna.`);
  add('R16', v.inH('Ma', [12]) && [3, 4, 7, 8].includes(lag), `${mars}: the 12th for a Gemini, Cancer, Libra or Scorpio Lagna.`);
  const disp = SIGN_LORD[v.sign('Ma')]!;
  add('R17', mk && v.inH(disp, [1, 4, 7, 5, 9, 10]), `The lord of Mars's sign (${disp}) is in a kendra or trikona from the Lagna.`, true);
  add('R18', mk && v.conj('Ma', 'Ju'), 'Mars is joined with Jupiter.');
  add('R19', mk && v.conj('Ma', 'Mo'), 'Mars is joined with the Moon.');
  add('R20', mk && v.related('Ma', 'Me'), 'Mars is joined or aspected by Mercury.');
  add('R21', mk && (v.conj('Ma', 'Ra') || v.inH('Mo', [2])) && (v.inH('Ve', [2]) || v.inH('Ra', [1, 4, 7, 10]) || v.aspectedBy('Ma', 'Ju')),
    'Mars with Rahu or the Moon in the 2nd, together with Venus in the 2nd, Rahu in a kendra or Jupiter aspecting Mars.', true);
  add('R22', mk && v.inH('Mo', [1, 4, 7, 10]), 'The Moon is in a kendra from the Lagna.');
  const r23 = (v.inH('Ma', [1]) && v.inSign('Ma', [1])) || (v.inH('Ma', [12]) && v.inSign('Ma', [9])) || (v.inH('Ma', [4]) && v.inSign('Ma', [8]))
    || (v.inH('Ma', [7]) && v.inSign('Ma', [2]));
  add('R23', r23 || (v.inH('Ma', [8]) && v.inSign('Ma', [11])), `${mars}: one of Aries 1st, Sagittarius 12th, Scorpio 4th, Taurus 7th, Aquarius 8th.`);
  add('R24', !r23 && v.inH('Ma', [8]) && v.inSign('Ma', [4]), `${mars}: Cancer in the 8th (PL's second list).`);
  const r25: string[] = [];
  if (v.strong('Ju') && v.inH('Ju', [1, 7])) r25.push('a strong Jupiter in the 1st or 7th');
  if (v.strong('Ve') && v.inH('Ve', [1, 7])) r25.push('a strong Venus in the 1st or 7th');
  if (c.bodies.Ma.retrograde) r25.push('Mars retrograde');
  if (nat('Ma', SIGN_LORD[v.sign('Ma')]!) < 0) r25.push('Mars in an enemy’s sign');
  if (v.debil('Ma')) r25.push('Mars debilitated');
  add('R25', mk && r25.length > 0, `${r25.join('; ').replace(/^./, (ch) => ch.toUpperCase())}.`, true);
  return out;
}

export function mangalReport(groomChart: ChartResult, brideChart: ChartResult): MangalReport {
  const G = new View(groomChart), B = new View(brideChart);
  const groom = consideration(groomChart), bride = consideration(brideChart);
  const gate = G.mk() || B.mk();
  const cancellations: Cancellation[] = [];
  if (gate) {
    const pair = (id: string, ok: boolean, text: string) => { if (ok) cancellations.push({ id, who: 'pair', text }); };
    pair('R1', G.mk() && B.mk(), 'Both have Mars in a dosha house: like doshas cancel.');
    pair('R2', G.mk() && B.inH('Sa', DOSHA_HOUSES), 'The groom’s Mars is matched by Saturn in a dosha house in the bride’s chart.');
    pair('R3', G.inH('Sa', DOSHA_HOUSES) && B.mk(), 'The bride’s Mars is matched by Saturn in a dosha house in the groom’s chart.');
    const malefics = (v: View) => (['Su', 'Ma', 'Sa', 'Ra', 'Ke'] as PlanetId[]).filter((p) => v.inH(p, DOSHA_HOUSES)).length;
    pair('R4', malefics(G) > malefics(B), `Malefics in dosha houses: groom ${malefics(G)}, bride ${malefics(B)} (counted from the Lagna, as PL's code does).`);
    const a = ashtakoota(kootaPerson(brideChart), kootaPerson(groomChart));
    const sc = (id: string) => a.rows.find((r) => r.id === id)!.score;
    pair('R5', sc('bhakoot') === 7 && sc('gana') >= 5 && a.total >= 27, `Bhakoot full, Gana ${sc('gana')} and ${a.total} of 36 gunas (PL requires all three).`);
    cancellations.push(...personRules(groomChart, 'groom'));
    if (B.mk() && B.inH('Ju', [1, 4, 5, 7, 9, 10])) cancellations.push({ id: 'R7', who: 'bride', text: 'Jupiter is in a kendra or trikona in the bride’s chart.' });
    cancellations.push(...personRules(brideChart, 'bride'));
  }
  return { groom, bride, gate, cancellations };
}

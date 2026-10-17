/**
 * Page 1 "Dignity" column — spec §3.1. Grade: BIN tables + STD precedence + NUM (9/9).
 * Labels: short ids 1989–1997, long ids 1979–1987 (UI string table Fn_60_1.enc).
 * Oracle: dignity().
 *
 * Precedence: exaltation sign (Moon > 3° → MT; Mercury ≥ 15° → MT 15–20 or Own 20–30),
 * debilitation sign, MT range, own sign, else the compound relation with the sign lord.
 */
import type { PlanetId } from '../types';
import { DEBIL_SIGN, EXALT_SIGN, OWN, SIGN_LORD, compound, inMt, sgn, type StrengthContext } from './common';

export type DignityCode = 'EX' | 'MT' | 'OWN' | 'GF' | 'F' | 'N' | 'E' | 'GE' | 'DB';

export const DIGNITY_SHORT: Readonly<Record<DignityCode, string>> = {
  EX: 'Exalt.', MT: 'Moolt.', OWN: 'Own', GF: 'Grt.Fr.', F: 'Frnd.', N: 'Neutr.', E: 'Enemy', GE: 'Grt.En.', DB: 'Debil.',
};
export const DIGNITY_LONG: Readonly<Record<DignityCode, string>> = {
  EX: 'Exalted', MT: 'Moolatrik.', OWN: 'Own', GF: 'Grt. Friend', F: 'Friend', N: 'Neutral', E: 'Enemy', GE: 'Grt. Enemy', DB: 'Debilitat.',
};

export function dignity(c: StrengthContext, p: PlanetId): DignityCode {
  const l = c.lon[p];
  const s = sgn(l);
  if (s === EXALT_SIGN[p]) {
    if (p === 'Mo' && l % 30 > 3) return 'MT';
    if (p === 'Me' && l % 30 >= 15) return inMt(p, l) ? 'MT' : 'OWN';
    return 'EX';
  }
  if (s === DEBIL_SIGN[p]) return 'DB';
  if (inMt(p, l)) return 'MT';
  if (OWN[p].includes(s)) return 'OWN';
  return compound(c, p, SIGN_LORD[s]!);
}

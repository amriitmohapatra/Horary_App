/**
 * Avasthas on Page 1.
 *  Av3 Jagradadi — spec §3.6, STD + NUM (9/9). Labels ids 2003–2005 (Alr./Drm./Slp.;
 *    long Alert/Dream/Sleep). Alert: exaltation sign, own sign or MT range; Sleep:
 *    debilitation sign or sign lord a NATURAL enemy; Dream otherwise. Oracle: jagradadi().
 *  Av5 Baladi — spec §3.7, NUM (9/9) + BIN label order (ids 2007–2011:
 *    Dead, Old, Adoles., Youth., Infant). k = ⌊deg/6⌋; even signs label[k], odd label[4−k].
 *    PL swaps Youth/Adolescent relative to BPHS. Oracle: baladi().
 */
import type { PlanetId } from '../types';
import { DEBIL_SIGN, EXALT_SIGN, OWN, SIGN_LORD, inMt, nat, type StrengthContext } from './common';

export type Av3Label = 'Alr.' | 'Drm.' | 'Slp.';
export const AV3_LONG: Readonly<Record<Av3Label, string>> = { 'Alr.': 'Alert', 'Drm.': 'Dream', 'Slp.': 'Sleep' };

export const AV5_LABELS = ['Dead', 'Old', 'Adoles.', 'Youth.', 'Infant'] as const;
export type Av5Label = (typeof AV5_LABELS)[number];

export function jagradadi(c: StrengthContext, p: PlanetId): Av3Label {
  const s = c.sign[p];
  if (s === EXALT_SIGN[p] || OWN[p].includes(s) || inMt(p, c.lon[p])) return 'Alr.';
  if (s === DEBIL_SIGN[p]) return 'Slp.';
  return nat(p, SIGN_LORD[s]!) < 0 ? 'Slp.' : 'Drm.';
}

export function baladi(c: StrengthContext, p: PlanetId): Av5Label {
  const k = Math.floor((c.lon[p] % 30) / 6);
  return c.sign[p] % 2 === 1 ? AV5_LABELS[k]! : AV5_LABELS[4 - k]!;
}

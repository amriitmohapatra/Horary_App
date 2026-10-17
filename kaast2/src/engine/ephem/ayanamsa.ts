/**
 * Ayanamsa options. The eight Parashara's Light options are decoded from
 * PL7.exe fcn.0055d3ea (report Table "PL7's eight ayanamsa options", BIN).
 * PL subtracts them from tropical longitudes of the MEAN equinox of date.
 */
export type AyanamsaId =
  | 'pl_lahiri' | 'pl_none' | 'pl_yukteshwar' | 'pl_raman' | 'pl_bhasin'
  | 'pl_fagan_bradley' | 'pl_krishnamurti' | 'pl_krishnamurti_new'
  | 'sf_lahiri';

/** Julian centuries from J1900.0 (report eq. 1). */
const T1900 = (jd: number) => (jd - 2451545) / 36525 + 1;
/** Centuries of 36 524 days from 1900 January 0.5 (report eq. 2). */
const tPrime = (jd: number) => (jd - 2415020.5) / 36524;

export function plLahiri(jd: number): number {
  const T = T1900(jd);
  return 22 + 27 / 60 + 37.65 / 3600 + (5026.87434 * T + 1.11113 * T * T) / 3600;
}

/** PL formulas, degrees. `sf_lahiri` is not here: it comes from Swiss SIDM_LAHIRI. */
export const PL_AYANAMSA: Record<Exclude<AyanamsaId, 'sf_lahiri'>, { label: string; at: (jd: number) => number }> = {
  pl_lahiri: { label: 'Lahiri', at: plLahiri },
  pl_none: { label: 'None (tropical)', at: () => 0 },
  pl_yukteshwar: { label: 'Yukteshwar', at: (jd) => 21.015 + 1.5 * tPrime(jd) },
  pl_raman: { label: 'Raman', at: (jd) => 21.013888889 + 1.398148148 * tPrime(jd) },
  pl_bhasin: { label: 'Bhasin', at: (jd) => 21.363888889 + 1.398148148 * tPrime(jd) },
  pl_fagan_bradley: { label: 'Fagan–Bradley', at: (jd) => 23.348888889 + 1.398148148 * tPrime(jd) },
  pl_krishnamurti: { label: 'Krishnamurti', at: (jd) => 22.453973785 + 1.3955235417 * tPrime(jd) },
  pl_krishnamurti_new: { label: 'Krishnamurti New', at: (jd) => plLahiri(jd) - 0.101388 + 0.0011118 * tPrime(jd) },
};

/** Kala Chakra / Solar Fire: Swiss SIDM_LAHIRI, longitudes +1.251″ (knowledge/03). */
export const SF_AYANAMSA_CAL_DEG = 1.251 / 3600;

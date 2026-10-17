/**
 * Chara (Jaimini) karakas, karakamsha and swamsha.
 *
 * Rules and grades
 *  - Ranking by degrees traversed in the sign, highest = Atma karaka (DOC: PL7
 *    manual p. 59; BPHS ch. 32 v. 3-8 as bundled with PL7, CHAP/CHAP32.TXT).
 *  - Order AK AmK BK MK PiK PK GK DK; the 7-karaka scheme merges MK and PK,
 *    i.e. the labels are AK AmK BK MK PiK GK DK (DOC: manual p. 59 "considers
 *    the Matru and Putra karakas to be the same"; NUM: the "K7" column of the
 *    PL 9 Page 1, tests/fixtures/pl9_page1_amitabh.json, 7/7).
 *  - 8-karaka scheme adds Rahu with 30° − its degree in the sign (DOC: manual
 *    p. 192 "Rahu too"; BPHS 32.3-8). Ketu never takes part (STD).
 *  - Which scheme PL uses by default (Options → Miscellaneous → Karakas) is
 *    OPEN; the PL 9 Page 1 column is labelled K7 and PL7's interpretation
 *    report (Extras1/pib10090) prints "Considering only 7 karakas".
 *  - Comparison on the profile-rounded integer arcseconds (BPHS: degrees,
 *    then minutes, then seconds). Rahu at exactly 0° counts as 30°00'00".
 *  - Ties (OPEN for PL): 'bphs' (default) — BPHS 32.13-17 "If two grahas have
 *    the same longitude, both become the same Karak in which case there will
 *    be a deficit of one Karak": tied planets share one label and the last
 *    label(s) are dropped. 'natural-order' — ties broken Su Mo Ma Me Ju Ve Sa
 *    Ra (what a stable sort such as PyJHora's yields; STD).
 *  - Karakamsha = navamsha sign of the AK (DOC: manual pp. 57, glossary
 *    "Karakamsha"; BPHS ch. 33). PL draws it as the lagna of the birth chart
 *    ("Karakamsha") or of the navamsha ("Karakamsha (Navamsha)"; "some ...
 *    call it the Swamsha chart", manual p. 57). Both use the same sign.
 */
import type { Arcsec, PlanetId } from '../types';
import { SIGN, norm } from '../zodiac';
import { navamshaSign } from '../varga/cyclic';
import { mod12, type SignMap } from './common';

export type KarakaId = 'AK' | 'AmK' | 'BK' | 'MK' | 'PiK' | 'PK' | 'GK' | 'DK';
export type KarakaScheme = 7 | 8;
export type KarakaTies = 'bphs' | 'natural-order';

export const KARAKA_LABELS: Readonly<Record<KarakaScheme, readonly KarakaId[]>> = {
  8: ['AK', 'AmK', 'BK', 'MK', 'PiK', 'PK', 'GK', 'DK'],
  7: ['AK', 'AmK', 'BK', 'MK', 'PiK', 'GK', 'DK'],
};

export const KARAKA_NAMES: Readonly<Record<KarakaId, string>> = {
  AK: 'Atma', AmK: 'Amatya', BK: 'Bhratru', MK: 'Matru', PiK: 'Pitru', PK: 'Putra', GK: 'Gnati', DK: 'Dara',
};

const CANDIDATES: readonly PlanetId[] = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra'];

export interface KarakaEntry {
  karaka: KarakaId;
  planet: PlanetId;
  /** The degree used for ranking, integer arcseconds 0 … 108 000 (Rahu: 30° − d). */
  degree: Arcsec;
}

/** Degrees traversed in the sign; Rahu counts backwards (30° − d). */
export function karakaDegree(planet: PlanetId, lon: Arcsec): Arcsec {
  const d = norm(lon) % SIGN;
  return planet === 'Ra' ? SIGN - d : d;
}

/**
 * Chara karakas, AK first. `bodies` needs Su…Sa (and Ra for the 8 scheme);
 * any `{ lon }` record works (Position does).
 */
export function charaKarakas(
  bodies: Partial<Record<PlanetId, { lon: Arcsec }>>,
  scheme: KarakaScheme,
  ties: KarakaTies = 'bphs',
): KarakaEntry[] {
  const pool = CANDIDATES.slice(0, scheme === 8 ? 8 : 7).map((planet, order) => {
    const b = bodies[planet];
    if (!b) throw new Error(`charaKarakas: missing ${planet}`);
    return { planet, order, degree: karakaDegree(planet, b.lon) };
  });
  pool.sort((a, b) => b.degree - a.degree || a.order - b.order);
  const labels = KARAKA_LABELS[scheme];
  const out: KarakaEntry[] = [];
  let rank = 0;
  pool.forEach((p, i) => {
    if (ties === 'natural-order') rank = i;
    else if (i > 0 && p.degree !== pool[i - 1]!.degree) rank += 1;
    const karaka = labels[rank];
    if (karaka) out.push({ karaka, planet: p.planet, degree: p.degree });
  });
  return out;
}

/** The planet holding a karaka (the first one, if a BPHS tie shares it). */
export function karakaPlanet(list: readonly KarakaEntry[], k: KarakaId): PlanetId | undefined {
  return list.find((e) => e.karaka === k)?.planet;
}

export interface Karakamsha {
  ak: PlanetId;
  /** Navamsha sign of the Atma karaka (0 = Aries). */
  sign: number;
}

/** Karakamsha: the navamsha sign of the AK (the lagna of the Karakamsha and Swamsha charts). */
export function karakamsha(
  bodies: Partial<Record<PlanetId, { lon: Arcsec }>>,
  scheme: KarakaScheme,
  ties: KarakaTies = 'bphs',
): Karakamsha {
  const ak = charaKarakas(bodies, scheme, ties)[0]!.planet;
  return { ak, sign: navamshaSign(bodies[ak]!.lon) };
}

/**
 * Houses of every point counted from a given lagna sign (1 … 12): the
 * Karakamsha chart is housesFrom(D1 signs, karakamsha.sign), the Swamsha
 * ("Karakamsha (Navamsha)") chart housesFrom(D9 signs, karakamsha.sign).
 */
export function housesFrom(signOf: SignMap, lagnaSign: number): SignMap {
  const out: SignMap = {};
  for (const [p, s] of Object.entries(signOf) as [keyof SignMap, number][]) out[p] = mod12(s - lagnaSign) + 1;
  return out;
}

/** Swamsha = the karakamsha sign read in the navamsha (alias kept for the UI's wording). */
export const swamsha = karakamsha;

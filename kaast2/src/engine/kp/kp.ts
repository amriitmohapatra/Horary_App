/**
 * Krishnamurti (KP) chart and significators — PL 7's "Krishnamurti" page
 * (manual pp. 56, 205): houses are the profile's cusps (Placidus in the PL
 * profiles) with the ascendant as the BEGINNING of house 1, every cusp and
 * planet gets its sign, star, sub and sub-sub lord, and each house lists
 *   Occupants          planets in the bhava (cusp h ≤ λ < cusp h+1)
 *   Tenants(Occupants) planets in the nakshatras of the occupants
 *   Owner              lord of the sign in which the cusp falls
 *   Tenants(Owner)     planets in the nakshatras of the owner
 * (manual p. 205, DOC). Planet-wise significators are the textbook A–D
 * levels read from the same table (STD): A houses occupied by its star lord,
 * B the house it occupies, C houses whose cusp its star lord owns, D houses
 * whose cusp it owns. Nodes own no sign. Pure, integer arcseconds.
 */
import { lordChain } from './lords';
import { PLANETS, type Arcsec, type ChartResult, type PlanetId } from '../types';
import { SIGN_LORD, ZODIAC, norm, signIndex } from '../zodiac';

export interface KpPoint {
  lon: Arcsec;
  sign: number;
  signLord: PlanetId;
  /** [star, sub, sub-sub] */
  lords: [PlanetId, PlanetId, PlanetId];
}
export interface KpPlanet extends KpPoint { id: PlanetId; house: number; retrograde: boolean }
export interface KpHouse {
  house: number;
  cusp: KpPoint;
  occupants: PlanetId[];
  tenantsOfOccupants: PlanetId[];
  owner: PlanetId;
  tenantsOfOwner: PlanetId[];
}
export interface KpPlanetSignificator {
  id: PlanetId;
  /** Houses occupied by the planet's star lord. */
  a: number[];
  /** The house the planet occupies. */
  b: number[];
  /** Houses whose cusp sign the star lord owns. */
  c: number[];
  /** Houses whose cusp sign the planet owns. */
  d: number[];
}
export interface KpModel {
  cusps: KpPoint[];
  planets: KpPlanet[];
  houses: KpHouse[];
  planetSignificators: KpPlanetSignificator[];
}

function point(lon: Arcsec): KpPoint {
  const l = lordChain(lon, 3);
  const sign = signIndex(lon);
  return { lon: norm(lon), sign, signLord: SIGN_LORD[sign]!, lords: [l[0]!, l[1]!, l[2]!] };
}

/** Bhava 1…12 of a longitude: cusp h ≤ λ < cusp h+1, zodiacally (a planet on a cusp is in that house). */
export function bhavaOf(lon: Arcsec, cusps: readonly Arcsec[]): number {
  const l = norm(lon);
  for (let h = 0; h < 12; h++) {
    const start = norm(cusps[h]!), end = norm(cusps[(h + 1) % 12]!);
    const span = (end - start + ZODIAC) % ZODIAC;
    if ((l - start + ZODIAC) % ZODIAC < span) return h + 1;
  }
  throw new Error('cusps do not cover the zodiac');
}

export function kpModel(chart: ChartResult): KpModel {
  const cusps = chart.cusps.map(point);
  const planets: KpPlanet[] = PLANETS.map((id) => {
    const b = chart.bodies[id];
    return { ...point(b.lon), id, house: bhavaOf(b.lon, chart.cusps), retrograde: b.retrograde };
  });
  const starOf = (p: PlanetId) => planets.find((x) => x.id === p)!.lords[0];
  const tenantsOf = (lords: readonly PlanetId[]) => planets.filter((p) => lords.includes(p.lords[0])).map((p) => p.id);
  const houses: KpHouse[] = cusps.map((cusp, i) => {
    const occupants = planets.filter((p) => p.house === i + 1).map((p) => p.id);
    return {
      house: i + 1, cusp, occupants,
      tenantsOfOccupants: tenantsOf(occupants),
      owner: cusp.signLord,
      tenantsOfOwner: tenantsOf([cusp.signLord]),
    };
  });
  const occupied = (p: PlanetId) => [planets.find((x) => x.id === p)!.house];
  const owned = (p: PlanetId) => houses.filter((h) => h.owner === p).map((h) => h.house);
  const planetSignificators = planets.map((p) => {
    const star = starOf(p.id);
    return { id: p.id, a: occupied(star), b: [p.house], c: owned(star), d: owned(p.id) };
  });
  return { cusps, planets, houses, planetSignificators };
}

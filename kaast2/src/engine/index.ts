/**
 * cast(swe, input) → ChartResult. The single entry point of the engine.
 * Sidereal recipe per profile (evidence in knowledge/06_decisions_log.md):
 *  PL profiles: tropical longitude of the MEAN equinox of date (SEFLG_NONUT)
 *    minus the PL ayanamsa formula; houses via Swiss sidereal mode with a
 *    user ayanamsa fixed to the same value at the chart moment.
 *  Solar Fire: Swiss SIDM_LAHIRI sidereal mode, +1.251″ (Kala Chakra 1.5).
 */
import { SE, type SwissEph } from './ephem/swisseph';
import { PL_AYANAMSA, SF_AYANAMSA_CAL_DEG } from './ephem/ayanamsa';
import { geocentricLatitude } from './houses/latitude';
import { resolveProfile, type Profile } from './profiles';
import { julianDay } from './time/julian';
import { deltaTseconds } from './time/deltaT';
import { PLANETS, type ChartInput, type ChartResult, type PlanetId, type Position } from './types';
import { ZODIAC, normDeg, toArcsec } from './zodiac';

export const ENGINE_VERSION = '0.1.0';

const SWE_BODY: Record<Exclude<PlanetId, 'Ra' | 'Ke'>, number> = {
  Su: SE.SUN, Mo: SE.MOON, Ma: SE.MARS, Me: SE.MERCURY, Ju: SE.JUPITER, Ve: SE.VENUS, Sa: SE.SATURN,
};

export function jdUTof(input: ChartInput): number {
  const { date, time } = input;
  const hours = time.h + time.mi / 60 + time.s / 3600 - input.tzHours - input.dstHours;
  return julianDay(date.y, date.m, date.d, hours);
}

export interface SiderealFrame {
  profile: Profile;
  jdUT: number;
  jdTT: number;
  deltaTsec: number;
  ayanamsaDeg: number;
  /** Added to every longitude Swiss returns in this frame (0 for houses in PL profiles). */
  offsetDeg: number;
  planetFlags: number;
  sf: boolean;
}

/**
 * Set up the sidereal frame of a profile at an instant: Delta-T, ayanamsa
 * and the Swiss sidereal mode used for houses. Shared by cast() and the
 * transit search, so both use exactly the same recipe.
 */
export function siderealFrame(swe: SwissEph, profile: Profile, jdUT: number): SiderealFrame {
  const deltaTsec = deltaTseconds(profile.deltaT, jdUT, () => swe.deltaTsec(jdUT));
  const jdTT = jdUT + deltaTsec / 86400;
  const ayan = profile.ayanamsa;
  if (ayan === 'sf_lahiri') {
    swe.setSidMode(SE.SIDM_LAHIRI);
    const offsetDeg = SF_AYANAMSA_CAL_DEG;
    return { profile, jdUT, jdTT, deltaTsec, ayanamsaDeg: swe.ayanamsa(jdTT) - offsetDeg, offsetDeg,
      planetFlags: SE.FLG_SWIEPH | SE.FLG_SPEED | SE.FLG_SIDEREAL, sf: true };
  }
  const ayanamsaDeg = PL_AYANAMSA[ayan].at(jdUT);
  swe.setSidMode(SE.SIDM_USER, jdTT, ayanamsaDeg);
  return { profile, jdUT, jdTT, deltaTsec, ayanamsaDeg, offsetDeg: -ayanamsaDeg,
    planetFlags: SE.FLG_SWIEPH | SE.FLG_SPEED | SE.FLG_NONUT, sf: false };
}

function makePosition(profile: Profile, id: Position['id'], lonDeg: number, latDeg: number, speedDeg: number, retro: boolean): Position {
  const exact = normDeg(lonDeg);
  return { id, lon: toArcsec(exact, profile.rounding), lonDeg: exact, latDeg, speedDeg, retrograde: retro };
}

/** Sidereal positions of the nine grahas in a frame (Ketu = Rahu + 180°). */
export function bodiesIn(swe: SwissEph, f: SiderealFrame): Record<PlanetId, Position> {
  const { profile } = f;
  const bodies = {} as Record<PlanetId, Position>;
  for (const id of PLANETS) {
    if (id === 'Ke') continue;
    const body = id === 'Ra' ? (profile.node === 'true' ? SE.TRUE_NODE : SE.MEAN_NODE) : SWE_BODY[id];
    const r = swe.calc(f.jdTT, body, f.planetFlags);
    // Nodes are not flagged retrograde in the display (PL shows no "R" for them).
    bodies[id] = makePosition(profile, id, r.lon + f.offsetDeg, r.lat, r.lonSpeed, id !== 'Ra' && r.lonSpeed < 0);
  }
  const ra = bodies.Ra;
  bodies.Ke = { ...makePosition(profile, 'Ke', ra.lonDeg + 180, -ra.latDeg, ra.speedDeg, false), lon: (ra.lon + ZODIAC / 2) % ZODIAC };
  return bodies;
}

/** Cast a chart. `jdUTOverride` casts at an exact instant (transits, oracle tests). */
export function cast(swe: SwissEph, input: ChartInput, jdUTOverride?: number): ChartResult {
  const profile = resolveProfile(input.profileId, input.overrides);
  const jdUT = jdUTOverride ?? jdUTof(input);
  const f = siderealFrame(swe, profile, jdUT);
  const { jdTT, deltaTsec, ayanamsaDeg, offsetDeg, sf } = f;
  const bodies = bodiesIn(swe, f);
  const position = (id: Position['id'], lonDeg: number, latDeg: number, speedDeg: number, retro: boolean) =>
    makePosition(profile, id, lonDeg, latDeg, speedDeg, retro);

  const houseLat = profile.houses.latitude === 'geocentric' ? geocentricLatitude(input.place.latDeg) : input.place.latDeg;
  const h = swe.houses(jdUT, SE.FLG_SIDEREAL, houseLat, input.place.lonDeg, profile.houses.system);
  const cusps = h.cusps.map((c) => toArcsec(c + (sf ? offsetDeg : 0), profile.rounding));
  const asc = position('As', h.asc + (sf ? offsetDeg : 0), 0, 0, false);
  const mcDeg = normDeg(h.mc + (sf ? offsetDeg : 0));
  const mc = toArcsec(mcDeg, profile.rounding);

  return {
    input, profile,
    moment: { jdUT, jdTT, deltaTsec, ayanamsaDeg },
    bodies, asc, mc, mcDeg, cusps,
    provenance: {
      engineVersion: ENGINE_VERSION,
      swissephVersion: swe.version(),
      profileId: profile.id,
      houseLatitudeDeg: houseLat,
    },
  };
}

export { PROFILES, DEFAULT_PROFILE, DASHA_YEARS, resolveProfile } from './profiles';
export type { Profile, ProfileId, ProfileOverrides } from './profiles';
export * from './types';

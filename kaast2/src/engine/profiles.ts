/**
 * Profiles are data, not code paths (ADR-2). One engine, several constant
 * bundles. Evidence for each constant is in knowledge/06_decisions_log.md.
 */
import type { AyanamsaId } from './ephem/ayanamsa';
import type { DeltaTModel } from './time/deltaT';

export type ProfileId = 'pl9' | 'pl7' | 'solarfire';

export interface Profile {
  id: ProfileId;
  label: string;
  ayanamsa: AyanamsaId;
  deltaT: DeltaTModel;
  houses: { system: 'P' | 'T'; latitude: 'geographic' | 'geocentric' };
  node: 'true' | 'mean';
  /** How exact longitudes become integer arcseconds. */
  rounding: 'round' | 'truncate';
  dashaYearDays: number;
  /** Moon used for the dasha balance: exact float or the rounded arcsecond. */
  dashaMoon: 'exact' | 'arcsec';
}

export const PROFILES: Record<ProfileId, Profile> = {
  /** Parashara's Light 9.0 — the boss's program. Verified on the Page 1
   *  screenshot (1942 chart): planets ≤0.5″, rounded seconds, 10/10 dasha dates. */
  pl9: {
    id: 'pl9', label: "Parashara's Light 9",
    ayanamsa: 'pl_lahiri', deltaT: 'swiss',
    houses: { system: 'P', latitude: 'geographic' },
    node: 'true', rounding: 'round',
    dashaYearDays: 365.2421875, dashaMoon: 'exact',
  },
  /** Parashara's Light 7 as decoded from the binary and its transit cache. */
  pl7: {
    id: 'pl7', label: "Parashara's Light 7",
    ayanamsa: 'pl_lahiri', deltaT: 'pl7',
    houses: { system: 'P', latitude: 'geographic' },
    node: 'true', rounding: 'round',
    dashaYearDays: 365.2421875, dashaMoon: 'exact',
  },
  /** Solar Fire Gold v9 / Kala Chakra 1.5 (validated: 80 planets ≤1″, 120 cusps ≤12″). */
  solarfire: {
    id: 'solarfire', label: 'Solar Fire / Kala Chakra',
    ayanamsa: 'sf_lahiri', deltaT: 'solarfire',
    houses: { system: 'T', latitude: 'geocentric' },
    node: 'true', rounding: 'truncate',
    dashaYearDays: 365.25, dashaMoon: 'arcsec',
  },
};

export const DEFAULT_PROFILE: ProfileId = 'pl9';

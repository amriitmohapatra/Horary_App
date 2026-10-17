/**
 * Core data model (ARCHITECTURE.md §3). The engine is pure: no DOM, no
 * fetch, no clock. Longitudes cross the engine boundary as integer
 * arcseconds (ADR-4); the exact float is kept alongside for the few rules
 * that need it (dasha balance).
 */
import type { Profile, ProfileId, ProfileOverrides } from './profiles';

/** Integer arcseconds, 0 … 1 295 999. */
export type Arcsec = number;

export const PLANETS = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'] as const;
export type PlanetId = (typeof PLANETS)[number];
export type PointId = PlanetId | 'As';

export interface ChartInput {
  name?: string;
  date: { y: number; m: number; d: number };
  time: { h: number; mi: number; s: number };
  /** Hours east of Greenwich of the civil zone (IST = 5.5; India war time 1942–45 = 6.5). */
  tzHours: number;
  /** Daylight-saving shift in hours (0 or 1). */
  dstHours: number;
  place: { name: string; latDeg: number; lonDeg: number };
  profileId: ProfileId;
  /** Settings that replace profile constants (ayanamsa, Delta-T, node, dasha year). */
  overrides?: ProfileOverrides;
}

export interface Moment {
  jdUT: number;
  jdTT: number;
  deltaTsec: number;
  /** Ayanamsa actually subtracted, degrees. */
  ayanamsaDeg: number;
}

export interface Position {
  id: PointId;
  /** Sidereal longitude, profile-rounded integer arcseconds. */
  lon: Arcsec;
  /** Sidereal longitude, exact degrees (before rounding). */
  lonDeg: number;
  latDeg: number;
  speedDeg: number;
  retrograde: boolean;
}

export interface ChartResult {
  input: ChartInput;
  profile: Profile;
  moment: Moment;
  bodies: Record<PlanetId, Position>;
  asc: Position;
  mc: Arcsec;
  /** House cusps 1…12 (index 0 = cusp 1), integer arcseconds. */
  cusps: Arcsec[];
  provenance: {
    engineVersion: string;
    swissephVersion: string;
    profileId: ProfileId;
    houseLatitudeDeg: number;
  };
}

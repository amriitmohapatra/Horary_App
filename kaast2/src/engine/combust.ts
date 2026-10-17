/**
 * Combustion (STD, BPHS orbs; matches the PL9 Page 1: Ma, Me, Ve combust,
 * Mo and Ju not). Orbs in degrees from the Sun; retrograde Mercury and Venus
 * take the smaller orbs. The Sun and the nodes are never combust.
 */
import type { PlanetId, Position } from './types';

const ORB: Partial<Record<PlanetId, { direct: number; retro: number }>> = {
  Mo: { direct: 12, retro: 12 },
  Ma: { direct: 17, retro: 17 },
  Me: { direct: 14, retro: 12 },
  Ju: { direct: 11, retro: 11 },
  Ve: { direct: 10, retro: 8 },
  Sa: { direct: 15, retro: 15 },
};

export function isCombust(p: Position, sun: Position): boolean {
  const orb = ORB[p.id as PlanetId];
  if (!orb) return false;
  const sep = Math.abs((((p.lonDeg - sun.lonDeg) % 360) + 540) % 360 - 180);
  return sep < (p.retrograde ? orb.retro : orb.direct);
}

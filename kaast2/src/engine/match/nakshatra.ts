/**
 * Moon-star groups used by the kootas (STD; all traditions agree):
 * Nadi — Adi, Madhya, Antya in the repeating pattern 0 1 2 2 1 0 from Ashwini;
 * Rajju — Pada, Kati, Nabhi, Kantha, Siro in the pattern 0 1 2 3 4 3 2 1 0 per
 * nine stars (South Indian Rajju porutham).
 */
export const NADI_NAMES = ['Adi', 'Madhya', 'Antya'] as const;
export const RAJJU_NAMES = ['Pada', 'Kati', 'Nabhi', 'Kantha', 'Siro'] as const;
const NADI = [0, 1, 2, 2, 1, 0];
const RAJJU = [0, 1, 2, 3, 4, 3, 2, 1, 0];
export const nadiOf = (nak: number): number => NADI[nak % 6]!;
export const rajjuOf = (nak: number): number => RAJJU[nak % 9]!;

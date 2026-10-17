/**
 * Display names. Grades: nakshatra names STD; PL's exact table spellings,
 * 3-letter chart abbreviations and pada syllables are being decoded from
 * PL (docs/spec/PAGE1_SPEC.md) — entries confirmed on the PL9 Page 1 are
 * marked NUM in the comment; the rest are textbook (STD) until then.
 */
import type { PlanetId } from './types';

export const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'P.Phalguni', 'U.Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'P.Ashadha', 'U.Ashadha', 'Shravana', 'Dhanishta', 'Satabhisha', 'P.Bhadrapada', 'U.Bhadrapada', 'Revati',
] as const;

/** 3-letter chart abbreviations (PL9 shows Dha Sat Roh Pun Mag Cht Has Swa — NUM). */
export const NAKSHATRA_ABBR = [
  'Asw', 'Bha', 'Kri', 'Roh', 'Mri', 'Ard', 'Pun', 'Pus', 'Asl',
  'Mag', 'PPh', 'UPh', 'Has', 'Cht', 'Swa', 'Vis', 'Anu', 'Jye',
  'Mul', 'PAs', 'UAs', 'Shr', 'Dha', 'Sat', 'PBh', 'UBh', 'Rev',
] as const;

/**
 * Pada syllables (Avakahada), 4 per nakshatra, in PL's English phonetic
 * spelling where seen on the PL9 Page 1 (Goo Pay Ray Tuh Hee Shah Vee May Sah — NUM).
 */
export const PADA_SYLLABLES: readonly (readonly [string, string, string, string])[] = [
  ['Chu', 'Chay', 'Cho', 'La'], ['Lee', 'Loo', 'Lay', 'Lo'], ['A', 'Ee', 'Oo', 'Ay'],
  ['O', 'Va', 'Vee', 'Voo'], ['Vay', 'Vo', 'Ka', 'Kee'], ['Koo', 'Gha', 'Ng', 'Chha'],
  ['Kay', 'Ko', 'Ha', 'Hee'], ['Hoo', 'Hay', 'Ho', 'Da'], ['Dee', 'Doo', 'Day', 'Do'],
  ['Ma', 'Mee', 'Moo', 'May'], ['Mo', 'Ta', 'Tee', 'Too'], ['Tay', 'To', 'Pa', 'Pee'],
  ['Poo', 'Shah', 'Na', 'Tuh'], ['Pay', 'Po', 'Ra', 'Ree'], ['Roo', 'Ray', 'Ro', 'Ta'],
  ['Tee', 'Too', 'Tay', 'To'], ['Na', 'Nee', 'Noo', 'Nay'], ['No', 'Ya', 'Yee', 'Yoo'],
  ['Yay', 'Yo', 'Bha', 'Bhee'], ['Bhoo', 'Dha', 'Pha', 'Dha'], ['Bhay', 'Bho', 'Ja', 'Jee'],
  ['Joo', 'Jay', 'Jo', 'Gha'], ['Ga', 'Gee', 'Goo', 'Gay'], ['Go', 'Sah', 'See', 'Soo'],
  ['Say', 'So', 'Da', 'Dee'], ['Doo', 'Tha', 'Jha', 'Na'], ['Day', 'Do', 'Cha', 'Chee'],
];

export const PLANET_NAMES: Readonly<Record<PlanetId | 'As', string>> = {
  As: 'Ascendant', Su: 'Sun', Mo: 'Moon', Ma: 'Mars', Me: 'Mercury', Ju: 'Jupiter',
  Ve: 'Venus', Sa: 'Saturn', Ra: 'Rahu', Ke: 'Ketu',
};

export const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

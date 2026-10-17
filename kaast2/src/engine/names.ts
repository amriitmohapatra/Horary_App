/**
 * Display names, as Parashara's Light spells them: decoded from PL7's UI
 * string table (BIN; tests/fixtures/nakshatra_names.json and
 * pada_syllables.json carry the string ids) and confirmed by every name on
 * the PL 9 Page 1 (NUM). PL spells a few padas identically (e.g. Pushya-4,
 * P.Shad-2/4 and P.Bhadra-3 are all "Dah") — kept verbatim.
 */
import type { PlanetId } from './types';

/** Full names (PL's long form). */
export const NAKSHATRA_NAMES = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigasira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Poorva Phalg.", "Uttara Phalg.", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "Poorvashadha", "Uttarashadha", "Shravana", "Dhanishta", "Shatabhishak", "Poorvabhadra", "Uttarabhadra", "Revati"] as const;

/** PL's short form, used in the Page 1 planet table ("Dhanish.", "Satabhi."). */
export const NAKSHATRA_SHORT = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashi", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "P.Phalg.", "U.Phalg.", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "P.Shad.", "U.Shad.", "Shravana", "Dhanish.", "Satabhi.", "P.Bhadra.", "U.Bhadra.", "Revati"] as const;

/** 3-letter forms shown after the degrees in the Rasi chart. */
export const NAKSHATRA_ABBR = ["Ash", "Bha", "Kri", "Roh", "Mrg", "Ard", "Pun", "Pus", "Asl", "Mag", "PPh", "UPh", "Has", "Cht", "Swa", "Vis", "Anu", "Jye", "Mul", "PSh", "USh", "Shr", "Dha", "Sat", "PBh", "UBh", "Rev"] as const;

/** Pada syllables (nama nakshatra), 4 per nakshatra. */
export const PADA_SYLLABLES: readonly (readonly [string, string, string, string])[] = [
  ["Chu", "Chay", "Cho", "Lah"],
  ["Lee", "Loo", "Lay", "Loh"],
  ["Ah", "Ee", "Oo", "Ay"],
  ["Oh", "Vah", "Vee", "Voo"],
  ["Vay", "Vo", "Kah", "Kee"],
  ["Koo", "Gha", "Nga", "Cha"],
  ["Kay", "Koh", "Hah", "Hee"],
  ["Hoo", "Hay", "Hoh", "Dah"],
  ["Dee", "Doo", "Day", "Doh"],
  ["Mah", "Mee", "Moo", "May"],
  ["Moh", "Tah", "Tee", "Too"],
  ["Tay", "Toh", "Pah", "Pee"],
  ["Poo", "Shah", "Nuh", "Tuh"],
  ["Pay", "Poh", "Rah", "Ree"],
  ["Roo", "Ray", "Roh", "Tah"],
  ["Tee", "Too", "Tay", "Toh"],
  ["Nah", "Nee", "Noo", "Nay"],
  ["Noh", "Yah", "Yee", "Yoo"],
  ["Yay", "Yoh", "Bha", "Bee"],
  ["Boo", "Dah", "Pah", "Dah"],
  ["Bay", "Boh", "Jah", "Jee"],
  ["Joo", "Jay", "Joh", "Guh"],
  ["Gah", "Gee", "Goo", "Gay"],
  ["Goh", "Sah", "See", "See"],
  ["Say", "Soh", "Dah", "Dee"],
  ["Doo", "Tu", "Jha", "Jya"],
  ["Day", "Doh", "Cha", "Chee"],
];

export const PLANET_NAMES: Readonly<Record<PlanetId | 'As', string>> = {
  As: 'Ascendant', Su: 'Sun', Mo: 'Moon', Ma: 'Mars', Me: 'Mercury', Ju: 'Jupiter',
  Ve: 'Venus', Sa: 'Saturn', Ra: 'Rahu', Ke: 'Ketu',
};

export const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

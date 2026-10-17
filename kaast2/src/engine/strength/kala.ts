/**
 * Time context of Kala bala — spec §4.3, BIN (sunrise iteration 0x58d9d4; ahargana and
 * lords BIN) + NUM. Oracle: the first block of shadbala().
 *
 *  Sunrise / sunset: Asc(t) = λSun(t) and Asc(t) = λSun(t) + 180 — geometric centre,
 *    no refraction (NUM: with refraction the fixture's hora would flip). Option ids 836/837
 *    ("Centre/Edge of Sun") default to centre.
 *  Day/night: fwd(Asc, Sun) ∈ (0, 180) means night.
 *  Natonnata X = ((jd − (noon + 0.5013689628737269))·360) mod 360, noon = (sunrise+sunset)/2;
 *    diurnal value 60 − |X − 180|/3.
 *  Ahargana A = ⌊jd + λgeo/360 − 2380557.5⌋ (local mean days), −1 after midnight but before
 *    sunrise; while A < 0 add 75600. n7(n) = ((n−1) mod 7) + 1 → 1 Su … 7 Sa.
 *    year lord n7(1 + 3⌊A/360⌋), month lord n7(1 + 2⌊A/30⌋), vara n7(A mod 7),
 *    hora h = 1 + ⌊24(jd − sunrise)⌋, hora lord n7(vara + 5(h − 1)).
 *  Tribhaga: day → Me, Su, Sa for the thirds of sunrise→sunset; night → Mo, Ve, Ma for the
 *    thirds of sunset→next sunrise.
 *
 * Day births reproduce the oracle exactly. Night births (OPEN, spec §7 item 7): the vedic
 * day is taken to start at the most recent sunrise before the birth; the oracle itself only
 * handles day births, so the night branch is the spec's text, not yet validated on PL.
 */
import { GRAHAS7, fwd, type Graha7 } from './common';
import type { StrengthEphem } from './ephem';

const ASC_RATE = 360.9856;

export interface KalaContext {
  /** Sunrise that starts the vedic day of the birth, sunset after it, next sunrise (JD UT). */
  sunrise: number; sunset: number; nextSunrise: number;
  isDay: boolean;
  noon: number;
  natonnataX: number;
  /** Natonnata value of the diurnal planets (Su, Ju, Ve); nocturnal = 60 − this. */
  diurnal: number;
  ahargana: number;
  yearLord: Graha7; monthLord: Graha7; varaLord: Graha7; horaLord: Graha7;
  horaNumber: number;
  /** 0, 1, 2: the third of the day (or night) the birth falls in. */
  tribhagaPart: number;
  tribhagaLord: Graha7;
}

const n7 = (n: number): number => ((((n - 1) % 7) + 7) % 7) + 1;
const lord = (n: number): Graha7 => GRAHAS7[n7(n) - 1]!;
const localDay = (jd: number, lonDeg: number): number => Math.floor(jd + lonDeg / 360 - 2380557.5);

export function kalaContext(e: StrengthEphem, jd: number, ascNow: number, sunNow: number, lonDeg: number): KalaContext {
  // Most recent sunrise: Asc has advanced fwd(Sun, Asc) degrees since it.
  let sunrise = e.solveAscSun(jd - fwd(sunNow, ascNow) / ASC_RATE, 0);
  if (sunrise > jd) sunrise = e.solveAscSun(sunrise - 1, 0);
  let sunset = e.solveAscSun(sunrise + 0.5, 180);
  let nextSunrise = e.solveAscSun(sunset + 0.5, 0);
  if (nextSunrise <= jd) {
    sunrise = nextSunrise;
    sunset = e.solveAscSun(sunrise + 0.5, 180);
    nextSunrise = e.solveAscSun(sunset + 0.5, 0);
  }
  const night = (() => { const f = fwd(ascNow, sunNow); return f > 0 && f < 180; })();
  const isDay = !night;

  const noon = (sunrise + sunset) / 2;
  const natonnataX = ((((jd - (noon + 0.5013689628737269)) * 360) % 360) + 360) % 360;
  const diurnal = 60 - Math.abs(natonnataX - 180) / 3;

  let ahargana = localDay(jd, lonDeg) - (localDay(jd, lonDeg) !== localDay(sunrise, lonDeg) ? 1 : 0);
  while (ahargana < 0) ahargana += 75600;
  const vara = n7(ahargana - 7 * Math.floor(ahargana / 7));
  const horaNumber = 1 + Math.floor((jd - sunrise) * 24);

  let tribhagaPart: number, tribhagaLord: Graha7;
  if (isDay) {
    tribhagaPart = Math.min(2, Math.max(0, Math.floor(((jd - sunrise) / (sunset - sunrise)) * 3)));
    tribhagaLord = (['Me', 'Su', 'Sa'] as const)[tribhagaPart]!;
  } else {
    tribhagaPart = Math.min(2, Math.max(0, Math.floor(((jd - sunset) / (nextSunrise - sunset)) * 3)));
    tribhagaLord = (['Mo', 'Ve', 'Ma'] as const)[tribhagaPart]!;
  }
  return {
    sunrise, sunset, nextSunrise, isDay, noon, natonnataX, diurnal, ahargana,
    yearLord: lord(1 + 3 * Math.floor(ahargana / 360)),
    monthLord: lord(1 + 2 * Math.floor(ahargana / 30)),
    varaLord: GRAHAS7[vara - 1]!,
    horaLord: lord(vara + 5 * (horaNumber - 1)),
    horaNumber, tribhagaPart, tribhagaLord,
  };
}

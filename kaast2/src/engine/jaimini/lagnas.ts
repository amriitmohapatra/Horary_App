/**
 * Special lagnas: Bhava, Hora, Ghatika (time lagnas from sunrise), Pranapada,
 * Varnada, Indu, and Sri (extra, see below).
 *
 * Rules and grades
 *  - Ishtakala = time from the last sunrise at or before birth (the Hindu day
 *    starts at sunrise; DOC: glossary "Ishta Kaala"; births before sunrise
 *    count from the previous day's sunrise — STD, PL's handling OPEN).
 *  - Bhava lagna = Sun at sunrise + 15° per hour (one sign per 5 ghatis);
 *    Hora lagna = Sun at sunrise + 30° per hour (one sign per 2½ ghatis);
 *    Ghatika lagna = Sun at sunrise + 30° per ghati of 24 min = 75° per hour
 *    (DOC: PL7 manual p. 192 and glossary; tutorial Extras1/pib11755; BPHS
 *    ch. 5 v. 2-8 as bundled, CHAP/CHAP05.TXT).
 *  - Pranapada, two variants:
 *    'pl' (default) — Sun at BIRTH + 5° of arc per minute of ishtakala (PL7
 *      tutorial Extras1/pib10095 "an addition ... of 5 degrees of arc for
 *      every minute of time that passed from sunrise to birth"). NUM: PL7
 *      manual p. 130 export of Prince Charles (14 Nov 1948 21:15 UT, London
 *      51°31'N 0°50'W) prints Pranapada 35.68829°; this rule with the
 *      'centre'/no-refraction sunrise gives 35.648° (Δ 0.04°, ≈0.5 s of time)
 *      while every other sunrise convention is ≥ 10° off
 *      (tests/engine/jaimini.test.ts). That Sun is in Libra (movable), so the
 *      chart does NOT separate 'pl' from 'bphs' — the variant is DOC (tutorial)
 *      and OPEN until a PL chart with the Sun in a fixed or dual sign.
 *    'bphs' — the same plus 240° when the Sun is in a fixed sign and 120° in
 *      a dual sign (BPHS ch. 3 v. 71-74, CHAP/CHAP03.TXT; PyJHora).
 *  - Sunrise (PL7 Options → Miscellaneous → Sunrise, manual p. 192: "the time
 *    when the Sun crosses the Ascendant. Some people use the edge of the Sun
 *    ..., and others use the exact, astronomical longitude of the Sun"):
 *    'centre' without refraction = Swiss BIT_HINDU_RISING (disc centre, no
 *    refraction, ecliptic latitude ignored — the instant the Sun's longitude
 *    equals the ascendant's; NUM via the Pranapada check above, so this is
 *    PL7's default). 'upper-limb' and refraction are offered as options; PL's
 *    refraction handling for the edge option is OPEN.
 *  - Indu lagna: kalas Su 30, Mo 16, Ma 6, Me 8, Ju 10, Ve 12, Sa 1; add the
 *    kalas of the 9th lords from the lagna and from the Moon, take the
 *    remainder by 12 (0 → 12) and count that many signs from the Moon (STD,
 *    B. V. Raman / PyJHora; DOC only: glossary "calculated by considering the
 *    lords of the 9th house from the Lagna and Moon"). Sign only.
 *  - Varnada lagna (BPHS ch. 5 v. 10-13): count from Aries to the lagna if it
 *    is odd, from Pisces backwards if even; the same for the hora lagna; add
 *    or subtract the two counts; count the result from Aries (odd) or Pisces
 *    backwards (even). Variants — PL's is OPEN:
 *    'bphs' (default) — literal reading of the bundled BPHS: the parity of the
 *      two COUNTS decides add/subtract and the parity of the result decides
 *      the direction (= PyJHora method 2, "Sharma/Santhanam");
 *    'raman' — the parity of the two SIGNS decides add/subtract, the lagna's
 *      parity the direction (= PyJHora method 1, B. V. Raman).
 *    Note: under 'bphs' both counts are always odd (an even sign counted
 *    back from Pisces is an odd count), so they are always added and the
 *    Varnada is always counted back from Pisces by an even number — it is
 *    always an odd sign.
 *  - Sri lagna = lagna + 360° × the fraction of its nakshatra the Moon has
 *    covered (STD, PVR Narasimha Rao / PyJHora). Not in the PL7 manual or
 *    tutorials — provided for PL 9 parity checks only.
 */
import type { SwissEph } from '../ephem/swisseph';
import { SE } from '../ephem/swisseph';
import { siderealFrame } from '../index';
import type { Arcsec, ChartResult, PlanetId } from '../types';
import { SIGN, SIGN_LORD, normDeg, toArcsec } from '../zodiac';
import { countFrom, isOddSign, modality, mod12, nthBackFrom, nthFrom } from './common';

/** Degrees of arc per minute of ishtakala. */
export const LAGNA_RATE = { bhava: 0.25, hora: 0.5, ghatika: 1.25, pranapada: 5 } as const;

/** Time lagna: Sun at sunrise + rate × ishtakala. */
export const timeLagnaDeg = (sunAtSunriseDeg: number, ishtaMinutes: number, ratePerMin: number): number =>
  normDeg(sunAtSunriseDeg + ratePerMin * ishtaMinutes);

export type PranapadaVariant = 'pl' | 'bphs';

export function pranapadaDeg(sunAtBirthDeg: number, ishtaMinutes: number, variant: PranapadaVariant = 'pl'): number {
  const base = sunAtBirthDeg + LAGNA_RATE.pranapada * ishtaMinutes;
  if (variant === 'pl') return normDeg(base);
  const m = modality(Math.floor(normDeg(sunAtBirthDeg) / 30));
  return normDeg(base + (m === 1 ? 240 : m === 2 ? 120 : 0));
}

export const INDU_KALAS: Readonly<Partial<Record<PlanetId, number>>> = { Su: 30, Mo: 16, Ma: 6, Me: 8, Ju: 10, Ve: 12, Sa: 1 };

export function induLagnaSign(ascSign: number, moonSign: number): number {
  const k = INDU_KALAS[SIGN_LORD[nthFrom(ascSign, 9)]!]! + INDU_KALAS[SIGN_LORD[nthFrom(moonSign, 9)]!]!;
  return nthFrom(moonSign, k % 12 || 12);
}

export type VarnadaMethod = 'bphs' | 'raman';

/** Count from Aries (odd sign) or backwards from Pisces (even sign), 1 … 12. */
const varnadaCount = (s: number): number => (isOddSign(s) ? countFrom(0, s) : mod12(11 - s) + 1);

/** Varnada of a house: `ascSign`/`horaSign` are the house's sign counted from the lagna and from the hora lagna. */
export function varnadaSign(ascSign: number, horaSign: number, method: VarnadaMethod = 'bphs'): number {
  const c1 = varnadaCount(ascSign), c2 = varnadaCount(horaSign);
  const same = method === 'bphs' ? c1 % 2 === c2 % 2 : isOddSign(ascSign) === isOddSign(horaSign);
  const n = (same ? c1 + c2 : Math.abs(c1 - c2)) % 12 || 12;
  const forward = method === 'bphs' ? n % 2 === 1 : isOddSign(ascSign);
  return forward ? nthFrom(0, n) : nthBackFrom(11, n);
}

/** Varnadas of the 12 houses (V1 = Varnada lagna). */
export const varnadas = (ascSign: number, horaSign: number, method: VarnadaMethod = 'bphs'): number[] =>
  Array.from({ length: 12 }, (_, i) => varnadaSign(ascSign + i, horaSign + i, method));

/** Sri lagna: lagna + 360° × the Moon's elapsed fraction of its nakshatra. */
export function sriLagnaDeg(ascDeg: number, moonDeg: number): number {
  const nak = 360 / 27;
  const frac = (normDeg(moonDeg) % nak) / nak;
  return normDeg(ascDeg + 360 * frac);
}

export interface SunriseOptions {
  /** 'centre' (PL7 default, NUM) or 'upper-limb'. */
  sunrise?: 'upper-limb' | 'centre';
  /** Atmospheric refraction at the horizon (PL7 default: none). */
  refraction?: boolean;
}

/** Swiss swe_rise_trans flags for a sunrise convention. */
export function sunriseFlags(o: SunriseOptions = {}): number {
  const centre = (o.sunrise ?? 'centre') === 'centre';
  const refr = o.refraction ?? false;
  if (centre && !refr) return SE.CALC_RISE | SE.BIT_HINDU_RISING;
  return SE.CALC_RISE | (centre ? SE.BIT_DISC_CENTER : 0) | (refr ? 0 : SE.BIT_NO_REFRACTION);
}

/** JD (UT) of the last sunrise at or before `jdUT`; null where the Sun does not rise. */
export function sunriseBefore(swe: SwissEph, jdUT: number, lonDeg: number, latDeg: number, o: SunriseOptions = {}): number | null {
  const flags = sunriseFlags(o);
  let r = swe.riseTrans(jdUT - 1.1, SE.SUN, flags, lonDeg, latDeg);
  if (r === null) return null;
  if (r > jdUT) { r = swe.riseTrans(jdUT - 2.1, SE.SUN, flags, lonDeg, latDeg); if (r === null) return null; }
  for (;;) {
    const next = swe.riseTrans(r + 0.01, SE.SUN, flags, lonDeg, latDeg);
    if (next === null || next > jdUT) return r;
    r = next;
  }
}

export interface LagnaPoint { lonDeg: number; lon: Arcsec; sign: number }

export interface SpecialLagnaOptions extends SunriseOptions {
  pranapada?: PranapadaVariant;
  varnada?: VarnadaMethod;
}

export interface SpecialLagnas {
  sunriseJdUT: number;
  /** Sidereal Sun at sunrise in the chart's profile frame, degrees. */
  sunAtSunriseDeg: number;
  ishtaMinutes: number;
  bhava: LagnaPoint;
  hora: LagnaPoint;
  ghatika: LagnaPoint;
  pranapada: LagnaPoint;
  /** Extra, not in PL7 (see header). */
  sri: LagnaPoint;
  /** Varnada lagna sign (V1). */
  varnada: number;
  indu: number;
}

/** Inputs of the pure special-lagna rules (everything that needs no ephemeris). */
export interface SpecialLagnaInputs {
  sunAtSunriseDeg: number;
  sunAtBirthDeg: number;
  ishtaMinutes: number;
  ascDeg: number;
  moonDeg: number;
}

/** All special lagnas from their inputs (pure). */
export function specialLagnasFrom(i: SpecialLagnaInputs, opts: { pranapada?: PranapadaVariant; varnada?: VarnadaMethod } = {},
  rounding: 'round' | 'truncate' = 'round'): Omit<SpecialLagnas, 'sunriseJdUT' | 'sunAtSunriseDeg' | 'ishtaMinutes'> {
  const pt = (d: number): LagnaPoint => { const lon = toArcsec(d, rounding); return { lonDeg: normDeg(d), lon, sign: Math.floor(lon / SIGN) }; };
  const hora = pt(timeLagnaDeg(i.sunAtSunriseDeg, i.ishtaMinutes, LAGNA_RATE.hora));
  const ascSign = Math.floor(normDeg(i.ascDeg) / 30), moonSign = Math.floor(normDeg(i.moonDeg) / 30);
  return {
    bhava: pt(timeLagnaDeg(i.sunAtSunriseDeg, i.ishtaMinutes, LAGNA_RATE.bhava)),
    hora,
    ghatika: pt(timeLagnaDeg(i.sunAtSunriseDeg, i.ishtaMinutes, LAGNA_RATE.ghatika)),
    pranapada: pt(pranapadaDeg(i.sunAtBirthDeg, i.ishtaMinutes, opts.pranapada)),
    sri: pt(sriLagnaDeg(i.ascDeg, i.moonDeg)),
    varnada: varnadaSign(ascSign, hora.sign, opts.varnada),
    indu: induLagnaSign(ascSign, moonSign),
  };
}

/** Sidereal Sun at an instant in a chart's profile frame (same recipe as cast()). */
export function siderealSunDeg(swe: SwissEph, chart: ChartResult, jdUT: number): number {
  const f = siderealFrame(swe, chart.profile, jdUT);
  return normDeg(swe.calc(f.jdTT, SE.SUN, f.planetFlags).lon + f.offsetDeg);
}

/** Special lagnas of a cast chart. Throws where the Sun does not rise (polar day/night). */
export function specialLagnas(swe: SwissEph, chart: ChartResult, opts: SpecialLagnaOptions = {}): SpecialLagnas {
  const { latDeg, lonDeg } = chart.input.place;
  const sr = sunriseBefore(swe, chart.moment.jdUT, lonDeg, latDeg, opts);
  if (sr === null) throw new Error('specialLagnas: no sunrise at this latitude');
  const sunAtSunriseDeg = siderealSunDeg(swe, chart, sr);
  const ishtaMinutes = (chart.moment.jdUT - sr) * 1440;
  const rest = specialLagnasFrom({
    sunAtSunriseDeg, sunAtBirthDeg: chart.bodies.Su.lonDeg, ishtaMinutes,
    ascDeg: chart.asc.lonDeg, moonDeg: chart.bodies.Mo.lonDeg,
  }, opts, chart.profile.rounding);
  return { sunriseJdUT: sr, sunAtSunriseDeg, ishtaMinutes, ...rest };
}

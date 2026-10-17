/**
 * Yogi point, Yogi, Avayogi, Duplicate Yogi and Dagdha rashis (PLAN.md §3.4). Pure.
 *
 * Rules, grades and sources:
 *  - Yogi point = Sun + Moon + 93°20′, sidereal, normalised (BIN: PL7
 *    fcn.0040841f, constant 93.333… at 0x5d1948; report engine.tex §Yogi point).
 *    Computed here in integer arcseconds: Sun″ + Moon″ + 336 000″ (invariant 1).
 *  - Yogi = lord of the Yogi point's nakshatra (DOC: report templates
 *    Extras1/pib337 print "Yogi Point!Yogi!Avayogi/Duplicate Yogi"; report
 *    features.tex §Yogi). Nakshatra = 1 + ⌊λ / 13°20′⌋ (BIN helper fcn.00566b15).
 *  - Avayogi — OPEN, two named variants:
 *      'sixth-nakshatra' (STD, default per PLAN decision D8): the lord of the
 *        6th nakshatra counted from the Yogi nakshatra (Yogi nakshatra + 5).
 *        Its point is the Yogi point + 186°40′ (= 14 nakshatras, so that point
 *        lies in the 15th nakshatra, whose Vimshottari lord equals the 6th's).
 *        Same as PyJHora (sphuta.avayogi_sphuta).
 *      'opposite-point' (DOC wording): PL7 manual p. 208, "Ava Yogi: The point
 *        opposite the Yogi point" — Yogi point + 180°, lord of its nakshatra.
 *  - Duplicate Yogi — OPEN (PL never defines it), one named variant:
 *      'sign-lord' (STD, default D8): lord of the sign holding the Yogi point
 *        (PyJHora calls it "sahayogi").
 *  - Dagdha rashis (STD): "Burnt signs, assigned according to the tithi"
 *    (DOC, PL7 manual p. 212 — the table itself is not in the manual). Table
 *    below is the common muhurta table (B. V. Raman, Muhurtha, ch. "Dagdha
 *    rasis"; Muhurta Chintamani), the same for both pakshas; Purnima and
 *    Amavasya have none. Not cross-checked: PyJHora has no Dagdha table.
 *  - Cross-check: PyJHora 4.8.7 (oracle/bhava_yogi_panchanga_pyjhora.py) agrees
 *    on Yogi point, Yogi, 'sixth-nakshatra' Avayogi (point and lord) and
 *    'sign-lord' Duplicate Yogi for every fixture chart.
 */
import type { Arcsec, PlanetId } from '../types';
import { NAKSHATRA, SIGN_LORD, VIM_ORDER, ZODIAC, nakshatraIndex, norm, signIndex } from '../zodiac';

/** 93°20′ in arcseconds. */
export const YOGI_OFFSET: Arcsec = 93 * 3600 + 20 * 60;
/** 186°40′ = 14 nakshatras. */
export const AVAYOGI_OFFSET: Arcsec = 14 * NAKSHATRA;

export type AvayogiVariant = 'sixth-nakshatra' | 'opposite-point';
export type DuplicateYogiVariant = 'sign-lord';
export const AVAYOGI_VARIANTS: readonly AvayogiVariant[] = ['sixth-nakshatra', 'opposite-point'];
export const DEFAULT_AVAYOGI: AvayogiVariant = 'sixth-nakshatra';
export const DEFAULT_DUPLICATE_YOGI: DuplicateYogiVariant = 'sign-lord';

/** Vimshottari lord of nakshatra 0 … 26. */
export const nakshatraLord = (nak: number): PlanetId => VIM_ORDER[(((nak % 27) + 27) % 27) % 9]!;

export interface SensitivePoint {
  /** Sidereal longitude, integer arcseconds. */
  lon: Arcsec;
  /** 0 = Ashwini … 26 = Revati. */
  nakshatra: number;
  /** 0 = Aries … 11 = Pisces. */
  sign: number;
  lord: PlanetId;
}

export interface YogiResult {
  yogiPoint: SensitivePoint;
  yogi: PlanetId;
  avayogiVariant: AvayogiVariant;
  avayogiPoint: SensitivePoint;
  avayogi: PlanetId;
  duplicateYogiVariant: DuplicateYogiVariant;
  duplicateYogi: PlanetId;
}

/** Yogi point from sidereal Sun and Moon (integer arcseconds). */
export const yogiPoint = (sun: Arcsec, moon: Arcsec): Arcsec => norm(sun + moon + YOGI_OFFSET);

const nakPoint = (lon: Arcsec): SensitivePoint => {
  const n = nakshatraIndex(lon);
  return { lon: norm(lon), nakshatra: n, sign: signIndex(lon), lord: nakshatraLord(n) };
};

/** Avayogi point of a variant. */
export function avayogiPoint(yogi: Arcsec, variant: AvayogiVariant = DEFAULT_AVAYOGI): Arcsec {
  return norm(yogi + (variant === 'sixth-nakshatra' ? AVAYOGI_OFFSET : ZODIAC / 2));
}

/** Duplicate Yogi of a variant (only 'sign-lord' so far). */
export function duplicateYogi(yogi: Arcsec, _variant: DuplicateYogiVariant = DEFAULT_DUPLICATE_YOGI): PlanetId {
  return SIGN_LORD[signIndex(yogi)]!;
}

/** Everything PL's "Yogi and Dagdha points" table shows except the Dagdha signs. */
export function yogiPoints(sun: Arcsec, moon: Arcsec, opts: { avayogi?: AvayogiVariant; duplicateYogi?: DuplicateYogiVariant } = {}): YogiResult {
  const av = opts.avayogi ?? DEFAULT_AVAYOGI;
  const dv = opts.duplicateYogi ?? DEFAULT_DUPLICATE_YOGI;
  const y = nakPoint(yogiPoint(sun, moon));
  const a = nakPoint(avayogiPoint(y.lon, av));
  return {
    yogiPoint: y, yogi: y.lord,
    avayogiVariant: av, avayogiPoint: a, avayogi: a.lord,
    duplicateYogiVariant: dv, duplicateYogi: duplicateYogi(y.lon, dv),
  };
}

/** Dagdha signs (0 = Aries) by tithi-within-paksha 1…14; 15 (Purnima/Amavasya) → none. STD. */
const DAGDHA_BY_TITHI: readonly (readonly number[])[] = [
  /* 1 Pratipada   */ [6, 9],
  /* 2 Dwitiya     */ [8, 11],
  /* 3 Tritiya     */ [4, 9],
  /* 4 Chaturthi   */ [1, 10],
  /* 5 Panchami    */ [2, 5],
  /* 6 Shashthi    */ [0, 4],
  /* 7 Saptami     */ [3, 8],
  /* 8 Ashtami     */ [2, 5],
  /* 9 Navami      */ [4, 7],
  /* 10 Dashami    */ [4, 7],
  /* 11 Ekadashi   */ [8, 11],
  /* 12 Dwadashi   */ [6, 9],
  /* 13 Trayodashi */ [1, 4],
  /* 14 Chaturdashi*/ [2, 5, 8, 11],
  /* 15 Purnima / Amavasya */ [],
];

/** Dagdha rashis for a tithi 1…30 (both pakshas share the table). */
export function dagdhaRashis(tithi: number): readonly number[] {
  if (!Number.isInteger(tithi) || tithi < 1 || tithi > 30) throw new RangeError(`tithi ${tithi}`);
  return DAGDHA_BY_TITHI[(tithi - 1) % 15]!;
}

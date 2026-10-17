/*
 * ephemeris.js — Browser/Node ephemeris engine for KAAST (Karar Ashram
 * Astrology Software). JavaScript twin of kala_chakra/ephemeris.py.
 *
 * Casts a KP horary chart from date/time/place using the Swiss Ephemeris
 * (WASM build — the same engine Solar Fire uses), configured to the family
 * profile: sidereal Lahiri, Topocentric houses, True Node, geocentric
 * latitude correction, truncated arcseconds.
 *
 * Modes: 'sf'     — replicate Solar Fire v9.0.19 (calibrated DeltaT curve
 *                   + +1.251" ayanamsa offset; validated on 10 ref charts)
 *        'modern' — current astronomical DeltaT (more accurate than SF).
 *
 * Usage:
 *   await KPEph.init({ wasmBinary, dataBuffer });   // ArrayBuffers
 *   const res = KPEph.castChart({ y,m,d, hh,mi,ss, tz, lat, lon, mode });
 *   res.cusps / res.planets are integer-arcsecond maps compatible with
 *   kp_logic.js's Chart.
 */
"use strict";

(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory();
  else root.KPEph = factory();
})(typeof self !== "undefined" ? self : this, function () {

  const AYAN_CAL_DEG = 1.251 / 3600;          // SF minus current swisseph
  const SIDM_LAHIRI = 1;
  const FLG = 2 | 65536;                       // SWIEPH | SIDEREAL
  const ZODIAC_ARCSEC = 1296000;

  // SF v9 DeltaT anchors (decimal year, seconds) recovered from ref charts
  const SF_DT = [[2019.29, 76.28], [2021.37, 79.33], [2022.98, 80.86],
                 [2023.20, 82.44], [2023.61, 82.40], [2024.00, 83.96],
                 [2024.54, 83.98], [2026.51, 87.50]];

  let swe = null, buf = {};

  async function init(opts) {
    if (swe) return;
    const factory = (typeof SwissephFactory !== "undefined")
      ? SwissephFactory : opts.factory;
    swe = await factory({
      wasmBinary: opts.wasmBinary,
      getPreloadedPackage: () => opts.dataBuffer,
      locateFile: f => f,
    });
    swe.ccall("swe_set_ephe_path", null, ["string"], ["/sweph"]);
    swe.ccall("swe_set_sid_mode", null,
              ["number", "number", "number"], [SIDM_LAHIRI, 0, 0]);
    buf.xx = swe._malloc(6 * 8);
    buf.serr = swe._malloc(256);
    buf.cusps = swe._malloc(13 * 8);
    buf.ascmc = swe._malloc(10 * 8);
  }

  function sfDeltat(jdUt) {
    const y = 2000.0 + (jdUt - 2451544.5) / 365.2425;
    const a = SF_DT;
    if (y <= a[0][0]) return a[0][1] - (a[0][0] - y);
    if (y >= a[a.length-1][0]) return a[a.length-1][1] + (y - a[a.length-1][0]);
    for (let i = 0; i + 1 < a.length; i++) {
      const [y0, d0] = a[i], [y1, d1] = a[i+1];
      if (y >= y0 && y <= y1) return d0 + (d1 - d0) * (y - y0) / (y1 - y0);
    }
  }

  function geocentricLatitude(latDeg) {
    const f = 1 / 298.257223563;
    return Math.atan(Math.tan(latDeg * Math.PI/180) * (1-f)*(1-f)) * 180/Math.PI;
  }

  const truncArcsec = deg => Math.floor(((deg % 360) + 360) % 360 * 3600);

  function julday(y, m, d, utHours) {
    return swe.ccall("swe_julday", "number",
      ["number","number","number","number","number"], [y, m, d, utHours, 1]);
  }

  function calcBody(jdTt, body, cal) {
    swe.ccall("swe_calc", "number",
      ["number","number","number","number","number"],
      [jdTt, body, FLG, buf.xx, buf.serr]);
    return truncArcsec(swe.HEAPF64[buf.xx/8] + cal);
  }

  const BODIES = { Su:0, Mo:1, Me:2, Ve:3, Ma:4, Ju:5, Sa:6, Ra:11 };

  function castChart({ y, m, d, hh, mi, ss, tz, lat, lon, mode }) {
    if (!swe) throw new Error("KPEph.init() not called");
    mode = mode || "sf";
    const utHours = hh + mi/60 + (ss||0)/3600 - tz;
    const jdUt = julday(y, m, d, utHours);
    const dt = (mode === "sf") ? sfDeltat(jdUt)
      : swe.ccall("swe_deltat", "number", ["number"], [jdUt]) * 86400;
    const jdTt = jdUt + dt / 86400;
    const cal = (mode === "sf") ? AYAN_CAL_DEG : 0;

    const planets = {};
    for (const [abbr, body] of Object.entries(BODIES))
      planets[abbr] = calcBody(jdTt, body, cal);
    planets.Ke = (planets.Ra + ZODIAC_ARCSEC/2) % ZODIAC_ARCSEC;

    const geoc = geocentricLatitude(lat);
    swe.ccall("swe_houses_ex", "number",
      ["number","number","number","number","number","number","number"],
      [jdUt, FLG, geoc, lon, "T".charCodeAt(0), buf.cusps, buf.ascmc]);
    const cusps = {};
    for (let h = 1; h <= 12; h++)
      cusps[h] = truncArcsec(swe.HEAPF64[buf.cusps/8 + h] + cal);

    const ayan = swe.ccall("swe_get_ayanamsa", "number", ["number"], [jdTt]) - cal;
    return { cusps, planets, jdUt, jdTt, deltat: dt, ayanamsa: ayan, mode };
  }

  function sidtime(jdUt) {
    return swe.ccall("swe_sidtime", "number", ["number"], [jdUt]);
  }

  return { init, castChart, sfDeltat, geocentricLatitude, sidtime, julday,
           AYAN_CAL_DEG };
});

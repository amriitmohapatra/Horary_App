/*
 * test_wasm_engine.mjs — Validate the browser ephemeris engine against the
 * 10 Solar Fire reference charts (tests/reference_charts.json).
 *
 *     node tests/test_wasm_engine.mjs
 *
 * Pass criteria (same as the Python suite):
 *   planets within 1'' of Solar Fire; cusps within 12''.
 */
import { readFileSync } from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
globalThis.__kaast_require = require;

// load vendor glue as CommonJS-ish (it sets module.exports)
const glue = require(join(here, "..", "web", "vendor", "swisseph_glue.js"));
const KPEph = require(join(here, "..", "web", "src", "ephemeris.js"));

const wasm = readFileSync(join(here, "..", "web", "vendor", "swisseph.wasm"));
const data = readFileSync(join(here, "..", "web", "vendor", "swisseph.data"));

const charts = JSON.parse(readFileSync(join(here, "reference_charts.json")));

const PL = { Mon: "Mo", Sun: "Su", Mer: "Me", Ven: "Ve", Mar: "Ma",
             Jup: "Ju", Sat: "Sa", Nod: "Ra" };

(async () => {
  await KPEph.init({
    factory: glue,
    wasmBinary: wasm.buffer.slice(wasm.byteOffset, wasm.byteOffset + wasm.byteLength),
    dataBuffer: data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength),
  });

  let fails = 0, np = 0, nc = 0;
  for (const c of charts) {
    // reconstruct civil time (whole second) + longitude from the header
    const jdUtApprox = c.jde - c.deltat / 86400;
    // revjul via julday inversion: derive calendar date from JD
    const z = Math.floor(jdUtApprox + 0.5);
    const f = jdUtApprox + 0.5 - z;
    let a = z;
    if (z >= 2299161) { const g = Math.floor((z - 1867216.25) / 36524.25); a = z + 1 + g - Math.floor(g / 4); }
    const b = a + 1524, cc = Math.floor((b - 122.1) / 365.25),
          dd = Math.floor(365.25 * cc), e = Math.floor((b - dd) / 30.6001);
    const day = b - dd - Math.floor(30.6001 * e);
    const month = e < 14 ? e - 1 : e - 13;
    const year = month > 2 ? cc - 4716 : cc - 4715;
    const hUt = f * 24;
    const tz = Math.abs(c.geoclat - 21.5839) < 0.01 ? 5.5 : 8.0;
    const secs = Math.round((hUt + tz) * 3600);
    const jdUt = KPEph.julday(year, month, day, secs / 3600 - tz);
    // derived longitude from printed LST
    const gmst = KPEph.sidtime(jdUt);
    let lon = ((c.lst - gmst) % 24 + 24) % 24 * 15;
    if (lon > 180) lon -= 360;
    // geographic latitude from printed geocentric
    let lat = c.geoclat;
    for (let i = 0; i < 6; i++) lat += c.geoclat - KPEph.geocentricLatitude(lat);

    const res = KPEph.castChart({ y: year, m: month, d: day,
      hh: Math.floor(secs / 3600), mi: Math.floor(secs / 60) % 60, ss: secs % 60,
      tz, lat, lon, mode: "sf" });

    for (const [sfName, kp] of Object.entries(PL)) {
      if (!(sfName in c.planets)) continue;
      np++;
      const want = Math.round(c.planets[sfName] * 3600);
      const diff = res.planets[kp] - want;
      if (Math.abs(diff) > 1) { fails++; console.log(`FAIL ${c.sheet} ${sfName}: ${diff}''`); }
    }
    for (let h = 1; h <= 12; h++) {
      nc++;
      const want = Math.round(c.cusps[h] * 3600);
      const diff = res.cusps[h] - want;
      if (Math.abs(diff) > 12) { fails++; console.log(`FAIL ${c.sheet} cusp ${h}: ${diff}''`); }
    }
  }
  console.log(`checked ${np} planets (tol 1'') and ${nc} cusps (tol 12''): ${fails} failures`);
  process.exit(fails ? 1 : 0);
})();

/*
 * kp_logic.js — KP horary engine, JavaScript port of kp_core.py/process.py.
 * Shared by the drag-and-drop HTML annotator (browser) and the Node test
 * harness. All arithmetic in integer arcseconds (exact).
 *
 * Validated against the same corpus as the Python engine.
 */
"use strict";

const ARCSEC_PER_SIGN = 30 * 3600;
const ARCSEC_PER_NAK = 48000;
const ZODIAC_ARCSEC = 1296000;

const VIM_ORDER = ["Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me"];
const VIM_YEARS = { Ke: 7, Ve: 20, Su: 6, Mo: 10, Ma: 7, Ra: 18, Ju: 16, Sa: 19, Me: 17 };

const SIGNS = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];
const SIGN_LORD = { Ar: "Ma", Ta: "Ve", Ge: "Me", Cn: "Mo", Le: "Su", Vi: "Me",
                    Li: "Ve", Sc: "Ma", Sg: "Ju", Cp: "Sa", Aq: "Sa", Pi: "Ju" };
const OWNED_SIGNS = { Su: ["Le"], Mo: ["Cn"], Ma: ["Ar", "Sc"], Me: ["Ge", "Vi"],
                      Ju: ["Sg", "Pi"], Ve: ["Ta", "Li"], Sa: ["Cp", "Aq"], Ra: [], Ke: [] };

const NAKSHATRAS = ["Aswini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Aslesha", "Magha", "P.Phalguni", "U.Phalguni", "Hasta",
  "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "P.Ashadha",
  "U.Ashadha", "Sravana", "Dhanishta", "Satabhisha", "P.Bhadrapada", "U.Bhadrapada", "Revati"];

const POINT_TO_PLANET = { Mon: "Mo", Sun: "Su", Mer: "Me", Ven: "Ve",
                          Mar: "Ma", Jup: "Ju", Sat: "Sa", Ra: "Ra", Ke: "Ke" };

const LON_RE = /(\d{1,2})\s*[°:]\s*([A-Za-z]{2})\s*(\d{1,2})\s*[':]\s*(\d{1,2})/;
const CUSP_RE = /^\s*(\d{1,2})\s+\d{1,2}\s*°/;

function parseLongitude(text) {
  if (typeof text !== "string") return null;
  const m = LON_RE.exec(text);
  if (!m) return null;
  const sign = m[2][0].toUpperCase() + m[2][1].toLowerCase();
  const idx = SIGNS.indexOf(sign);
  if (idx < 0) return null;
  return idx * ARCSEC_PER_SIGN + (+m[1]) * 3600 + (+m[3]) * 60 + (+m[4]);
}

function pad2(n) { return String(n).padStart(2, "0"); }

function formatLongitude(arcsec) {
  arcsec = ((arcsec % ZODIAC_ARCSEC) + ZODIAC_ARCSEC) % ZODIAC_ARCSEC;
  const signIdx = Math.floor(arcsec / ARCSEC_PER_SIGN);
  let rem = arcsec % ARCSEC_PER_SIGN;
  const deg = Math.floor(rem / 3600); rem %= 3600;
  const min = Math.floor(rem / 60), sec = rem % 60;
  return `${pad2(deg)}°${SIGNS[signIdx]}${pad2(min)}'${pad2(sec)}''`;
}

function signOf(arcsec) {
  return SIGNS[Math.floor((((arcsec % ZODIAC_ARCSEC) + ZODIAC_ARCSEC) % ZODIAC_ARCSEC) / ARCSEC_PER_SIGN)];
}

/* (nakshatra, starLord, subLord); boundaries are half-open [from, to). */
function starAndSub(arcsec) {
  arcsec = ((arcsec % ZODIAC_ARCSEC) + ZODIAC_ARCSEC) % ZODIAC_ARCSEC;
  const nakIdx = Math.floor(arcsec / ARCSEC_PER_NAK);
  const offset = arcsec % ARCSEC_PER_NAK;
  const starLord = VIM_ORDER[nakIdx % 9];
  const start = VIM_ORDER.indexOf(starLord);
  let cum = 0;
  for (let i = 0; i < 9; i++) {
    const lord = VIM_ORDER[(start + i) % 9];
    cum += VIM_YEARS[lord] * 400;
    if (offset < cum) return [NAKSHATRAS[nakIdx], starLord, lord];
  }
  throw new Error("sub-lord walk failed");
}

function slString(arcsec) {
  const [, star, sub] = starAndSub(arcsec);
  return `${star}/${sub}`;
}

function pointLabel(value) {
  if (typeof value !== "string") return null;
  const label = value.replace(/\[.*?\]/g, "").trim();
  return Object.prototype.hasOwnProperty.call(POINT_TO_PLANET, label) ? label : null;
}

/* ------------------------------------------------------------------ */
/* Chart: placement, ownership, node dispositors                       */
/* ------------------------------------------------------------------ */

class Chart {
  constructor(cusps, planets) {
    this.cusps = cusps;       // {1..12: arcsec}
    this.planets = planets;   // {Mo: arcsec, ...}
    this.warnings = [];
  }

  houseOf(arcsec) {
    arcsec = ((arcsec % ZODIAC_ARCSEC) + ZODIAC_ARCSEC) % ZODIAC_ARCSEC;
    for (let h = 1; h <= 12; h++) {
      const lo = this.cusps[h];
      const hi = this.cusps[(h % 12) + 1];
      const span = ((hi - lo) % ZODIAC_ARCSEC + ZODIAC_ARCSEC) % ZODIAC_ARCSEC;
      if (((arcsec - lo) % ZODIAC_ARCSEC + ZODIAC_ARCSEC) % ZODIAC_ARCSEC < span) return h;
    }
    throw new Error("placement failed");
  }

  signToHouses() {
    const map = {};
    SIGNS.forEach(s => { map[s] = []; });
    for (let h = 1; h <= 12; h++) map[signOf(this.cusps[h])].push(h);
    SIGNS.forEach(s => {
      map[s].sort((a, b) => a - b);
      if (map[s].length === 0) {
        const h = this.houseOf(SIGNS.indexOf(s) * ARCSEC_PER_SIGN);
        const msg = `Sign ${s} contains no cusp; it lies wholly inside house ${h}, ` +
                    `so its lord ${SIGN_LORD[s]} owns ${h} (span rule).`;
        if (!this.warnings.includes(msg)) this.warnings.push(msg);
      }
    });
    return map;
  }

  housesFromSign(sign) {
    const inSign = this.signToHouses()[sign];
    if (inSign.length) return inSign;
    return [this.houseOf(SIGNS.indexOf(sign) * ARCSEC_PER_SIGN)];
  }

  ownerships(planet) {
    const houses = [];
    for (const s of OWNED_SIGNS[planet]) houses.push(...this.housesFromSign(s));
    return houses.sort((a, b) => a - b);
  }

  numbersFor(planet) {
    const lon = this.planets[planet];
    if (planet === "Ra" || planet === "Ke") {
      const disp = SIGN_LORD[signOf(lon)];
      return [this.houseOf(this.planets[disp]), this.houseOf(lon), ...this.ownerships(disp)];
    }
    return [this.houseOf(lon), ...this.ownerships(planet)];
  }

  numbersString(planet) { return this.numbersFor(planet).join(","); }

  /* ---- power calculation (validated vs Python engine) ---- */

  _posOwnTerms(body, posPower, ownPower) {
    const terms = [];
    const pos = this.houseOf(this.planets[body]);
    if (body === "Ra" || body === "Ke") {
      const disp = SIGN_LORD[signOf(this.planets[body])];
      const dpos = this.houseOf(this.planets[disp]);
      terms.push([pos, posPower, `${body} position ${pos}`]);
      terms.push([dpos, posPower, `dispositor ${disp} position ${dpos}`]);
      for (const h of this.ownerships(disp))
        terms.push([h, ownPower, `dispositor ${disp} owns ${h}`]);
    } else {
      terms.push([pos, posPower, `${body} position ${pos}`]);
      for (const h of this.ownerships(body))
        terms.push([h, ownPower, `${body} owns ${h}`]);
    }
    return terms;
  }

  cuspLords() {
    const lords = {};
    for (let h = 1; h <= 12; h++) {
      const [, st, su] = starAndSub(this.cusps[h]);
      lords[h] = [st, su];
    }
    return lords;
  }

  powerTerms(planet) {
    const [, star, sub] = starAndSub(this.planets[planet]);
    const num = {};
    num[`Planet ${planet}`] = this._posOwnTerms(planet, 2, 1);
    num[`Star ${star}`] = this._posOwnTerms(star, 4, 3);
    num[`Sub ${sub}`] = this._posOwnTerms(sub, 6, 5);
    const lords = this.cuspLords();
    const den = {};
    for (const [label, body, pStar, pSub] of [["Planet", planet, 7, 10],
                                              ["Star", star, 8, 11],
                                              ["Sub", sub, 9, 12]]) {
      const terms = [];
      for (let h = 1; h <= 12; h++) {
        if (lords[h][0] === body) terms.push([h, pStar, `${body} is star lord of cusp ${h}`]);
        if (lords[h][1] === body) terms.push([h, pSub, `${body} is sub lord of cusp ${h}`]);
      }
      den[`${label} ${body}`] = terms;
    }
    return { planet, star, sub, numerator: num, denominator: den };
  }

  sideTotals(planet) {
    const t = this.powerTerms(planet);
    const out = [];
    for (const side of ["numerator", "denominator"]) {
      const totals = {};
      for (const terms of Object.values(t[side]))
        for (const [base, power] of terms)
          totals[base] = (totals[base] || 0) + power;
      out.push(Object.keys(totals).map(Number).sort((a, b) => a - b)
        .reduce((o, k) => { o[k] = totals[k]; return o; }, {}));
    }
    return out;   // [numerator, denominator]
  }

  powersFor(planet) {
    const totals = {};
    const t = this.powerTerms(planet);
    for (const part of [t.numerator, t.denominator])
      for (const terms of Object.values(part))
        for (const [base, power] of terms)
          totals[base] = (totals[base] || 0) + power;
    return Object.keys(totals).map(Number).sort((a, b) => a - b)
      .reduce((o, k) => { o[k] = totals[k]; return o; }, {});
  }

  powersString(planet) {
    const p = this.powersFor(planet);
    return Object.keys(p).map(b => `${b}${p[b]}`).join(", ");
  }
}

/* ------------------------------------------------------------------ */
/* Grid-level processing (mirrors process.py)                          */
/*                                                                     */
/* A "grid" is {maxRow, maxCol, get(r,c) -> value|null} with 1-based   */
/* row/col. Returns {chart, updates:[{row,col,text}], summary}.        */
/* ------------------------------------------------------------------ */

function parseGrid(grid) {
  const cusps = {}, planets = {}, warnings = [];
  for (let r = 1; r <= grid.maxRow; r++) {
    for (let c = 1; c <= grid.maxCol; c++) {
      const v = grid.get(r, c);
      const lon = parseLongitude(v);
      if (lon === null) continue;
      const m = CUSP_RE.exec(v);
      if (m) {
        const h = +m[1];
        if (h >= 1 && h <= 12) {
          if (h in cusps && cusps[h] !== lon)
            warnings.push(`cusp ${h} appears twice with different longitudes - check export.`);
          cusps[h] = lon;
        }
        continue;
      }
      const label = pointLabel(c > 1 ? grid.get(r, c - 1) : null);
      if (label !== null) {
        const pl = POINT_TO_PLANET[label];
        if (pl in planets && planets[pl] !== lon)
          warnings.push(`${label} appears twice with different longitudes - check export.`);
        planets[pl] = lon;
      }
    }
  }
  if (Object.keys(cusps).length !== 12 || Object.keys(planets).length !== 9) {
    return { chart: null,
             error: `incomplete chart (${Object.keys(cusps).length}/12 cusps, ` +
                    `${Object.keys(planets).length}/9 planets)` };
  }
  const chart = new Chart(cusps, planets);
  chart.warnings.push(...warnings);
  return { chart };
}

function inChartPointsBlock(grid, rownum) {
  for (let r = rownum; r >= 1; r--) {
    const v = grid.get(r, 1);
    if (typeof v === "string") {
      const u = v.toUpperCase();
      if (u.includes("CHART POINTS")) return true;
      if (u.includes("HOUSE CUSPS")) return false;
    }
  }
  return false;
}

function computeUpdates(grid, chart) {
  chart.signToHouses();                       // populate span-rule notes
  const updates = [];
  let n = 0;
  for (let r = 1; r <= grid.maxRow; r++) {
    for (let c = 1; c <= grid.maxCol; c++) {
      const v = grid.get(r, c);
      const lon = parseLongitude(v);
      if (lon === null) continue;
      const base = `${formatLongitude(lon)} ${slString(lon)}`;
      const m = CUSP_RE.exec(v);
      let newText;
      if (m) {
        const prefix = v.slice(0, LON_RE.exec(v).index);
        newText = `${prefix}${base}`;
      } else {
        const label = pointLabel(c > 1 ? grid.get(r, c - 1) : null);
        if (label !== null) {
          const pl = POINT_TO_PLANET[label];
          if (inChartPointsBlock(grid, r)) {
            newText = base;
            updates.push({ row: r, col: c + 2, text: chart.numbersString(pl) });
          } else {
            newText = `${base}-${chart.houseOf(lon)}`;
          }
        } else {
          newText = base;
        }
      }
      if (newText !== v) updates.push({ row: r, col: c, text: newText });
      n++;
    }
  }
  return { updates, cellsSeen: n };
}

/* ------------------------------------------------------------------ */
/* Solar Fire raw report parsing (Guide steps 1-3)                     */
/* ------------------------------------------------------------------ */

const SF_POINTS = { Mon: "Mo", Sun: "Su", Mer: "Me", Ven: "Ve",
                    Mar: "Ma", Jup: "Ju", Sat: "Sa", Nod: "Ra",
                    Ra: "Ra", Ke: "Ke" };
const LON_PAT = "\\d{1,2}\\s*°\\s*[A-Za-z]{2}\\s*\\d{1,2}\\s*'\\s*\\d{1,2}";
const CUSP_ENTRY = new RegExp(`(\\b\\d{1,2})\\s+(${LON_PAT})`, "g");
const POINT_LINE = new RegExp(`^\\s*([A-Za-z]{2,3})(?:\\[.*?\\])?\\s+(${LON_PAT})`);

function parseSfText(text) {
  const cusps = {}, planets = {};
  let inCusps = false, inPoints = false;
  for (const line of text.split(/\r?\n/)) {
    const u = line.toUpperCase();
    if (u.includes("HOUSE CUSPS")) { inCusps = true; inPoints = false; continue; }
    if (u.includes("CHART POINTS")) { inCusps = false; inPoints = true; continue; }
    const t = u.trim();
    if (t.startsWith("LUNAR PHASE") || t.startsWith("SIGN MODALITIES") ||
        t.startsWith("CHART ANGLES") || t.startsWith("*** END"))
      inCusps = inPoints = false;
    if (inCusps) {
      let m;
      CUSP_ENTRY.lastIndex = 0;
      while ((m = CUSP_ENTRY.exec(line)) !== null) {
        const h = +m[1];
        if (h >= 1 && h <= 12) cusps[h] = parseLongitude(m[2]);
      }
    } else if (inPoints) {
      const m = POINT_LINE.exec(line);
      if (m && m[1] in SF_POINTS) planets[SF_POINTS[m[1]]] = parseLongitude(m[2]);
    }
  }
  if ("Ra" in planets && !("Ke" in planets))
    planets.Ke = (planets.Ra + ZODIAC_ARCSEC / 2) % ZODIAC_ARCSEC;
  const missC = [], missP = [];
  for (let h = 1; h <= 12; h++) if (!(h in cusps)) missC.push(h);
  for (const p of ["Su","Mo","Ma","Me","Ju","Ve","Sa","Ra","Ke"])
    if (!(p in planets)) missP.push(p);
  if (missC.length || missP.length)
    throw new Error(`incomplete report: missing cusps [${missC}], missing points [${missP}]`);
  return new Chart(cusps, planets);
}

/* Turn a pasted-into-Excel report (grid) back into text lines. */
function gridToText(rows) {
  return rows.map(r => r.filter(v => v !== null && v !== undefined &&
                                     String(v).trim() !== "")
                       .map(String).join("  ")).join("\n");
}

/* ------------------------------------------------------------------ */
/* Finished-workbook cell updates (mirror of excel_builder.py)         */
/* ------------------------------------------------------------------ */

const PLANET_LABEL = {};
for (const [k, v] of Object.entries(POINT_TO_PLANET)) PLANET_LABEL[v] = k;
const PLANET_ORDER = ["Mo", "Su", "Me", "Ve", "Ma", "Ju", "Sa", "Ra", "Ke"];
const SIGN_SLOTS = {
  Ta: [5, 7, 8],   Ar: [5, 10, 11], Pi: [5, 14, 15],
  Ge: [7, 5, 6],   Aq: [8, 15, 16],
  Cn: [13, 5, 6],  Cp: [12, 14, 15],
  Le: [19, 5, 6],  Sg: [17, 16, 17],
  Vi: [24, 7, 8],  Li: [17, 10, 11], Sc: [21, 14, 15],
};
const CENTER = { date: [12, 11], time: [13, 11], location: [14, 11] };
const NOTE_CELLS = [[29, 4], [30, 4], [31, 4], [32, 4]];

function builderUpdates(chart, meta) {
  const u = [];
  const push = (row, col, text) => u.push({ row, col, text });
  push(1, 1, meta.question || "");
  push(2, 1, meta.name || "");
  for (const [key, [r, c]] of Object.entries(CENTER)) push(r, c, meta[key] || "");
  for (const [r, c] of NOTE_CELLS) push(r, c, "");

  for (const sign of SIGNS) {
    let [row, lc, vc] = SIGN_SLOTS[sign];
    for (let h = 1; h <= 12; h++)
      if (signOf(chart.cusps[h]) === sign) {
        push(row, vc, `${h} ${formatLongitude(chart.cusps[h])} ${slString(chart.cusps[h])}`);
        row += 1;
      }
    for (const p of PLANET_ORDER)
      if (signOf(chart.planets[p]) === sign) {
        const lon = chart.planets[p];
        push(row, lc, PLANET_LABEL[p]);
        push(row, vc, `${formatLongitude(lon)} ${slString(lon)}-${chart.houseOf(lon)}`);
        row += 1;
      }
  }

  push(30, 6, "HOUSE CUSPS (Topocentric)");
  for (let i = 0; i < 12; i++) {
    const h = i + 1, r = 31 + (i % 3), c = 6 + Math.floor(i / 3) * 3;
    push(r, c, `${String(h).padStart(2)} ${formatLongitude(chart.cusps[h])} ${slString(chart.cusps[h])}`);
  }
  push(35, 6, "CHART POINTS");
  push(36, 6, "Point"); push(36, 7, "Longitude");
  push(36, 9, "Cusp numbers"); push(36, 11, "Powers");
  PLANET_ORDER.forEach((p, i) => {
    const r = 37 + i, lon = chart.planets[p];
    push(r, 6, PLANET_LABEL[p]);
    push(r, 7, `${formatLongitude(lon)} ${slString(lon)}-${chart.houseOf(lon)}`);
    push(r, 9, chart.numbersString(p));
    push(r, 11, chart.powersString(p));
  });

  let r = 48;
  push(r, 6, "POWER CALCULATION (step-wise)"); r += 2;
  for (const p of PLANET_ORDER) {
    const t = chart.powerTerms(p);
    push(r, 6, `${PLANET_LABEL[p].trim()}  (Star ${t.star}, Sub ${t.sub})`); r += 1;
    const [numTot, denTot] = chart.sideTotals(p);
    for (const [side, tot] of [["numerator", numTot], ["denominator", denTot]]) {
      push(r, 7, side[0].toUpperCase() + side.slice(1)); r += 1;
      for (const [part, terms] of Object.entries(t[side])) {
        const text = terms.map(([b, pw, why]) => `${b}^${pw} (${why})`).join(", ");
        push(r, 8, `${part}: ${text || "-"}`); r += 1;
      }
      const collected = Object.keys(tot).map(b => `${b}^${tot[b]}`).join(", ");
      push(r, 8, `${side[0].toUpperCase() + side.slice(1)} collected: ${collected || "-"}`); r += 1;
    }
    push(r, 7, "Merged (base^total power, ascending):");
    push(r, 9, chart.powersString(p)); r += 2;
  }
  for (const w of chart.warnings) { push(r, 6, `NOTE: ${w}`); r += 1; }
  return u;
}

/* Node export / browser global */
const KP = { ARCSEC_PER_SIGN, ZODIAC_ARCSEC, SIGNS, SIGN_LORD, OWNED_SIGNS,
             POINT_TO_PLANET, PLANET_LABEL, PLANET_ORDER,
             parseLongitude, formatLongitude, signOf, starAndSub, slString,
             pointLabel, Chart, parseGrid, computeUpdates, inChartPointsBlock,
             parseSfText, gridToText, builderUpdates, LON_RE, CUSP_RE };
if (typeof module !== "undefined" && module.exports) module.exports = KP;
if (typeof window !== "undefined") window.KP = KP;

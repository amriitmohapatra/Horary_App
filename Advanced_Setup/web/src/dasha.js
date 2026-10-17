/*
 * dasha.js — Vimshottari dasha engine (Maha → Antar → Pratyantar →
 * Sookshma → Prana). JavaScript twin of kala_chakra/dasha.py, replicating
 * Parashara's Light 7.0 (validated: 40/40 PL table dates exact).
 *
 * Conventions: dasha year = 365.25 days; each level subdivides its parent
 * in Vimshottari proportions (years/120) starting from the parent's lord;
 * the Moon's nakshatra fraction fixes the balance of the first Maha.
 *
 * All times are naive local datetimes carried as UTC-milliseconds
 * (no timezone conversion anywhere — format with the getUTC* accessors).
 */
"use strict";

(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory();
  else root.KPDasha = factory();
})(typeof self !== "undefined" ? self : this, function () {

  const VIM_ORDER = ["Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me"];
  const VIM_YEARS = { Ke: 7, Ve: 20, Su: 6, Mo: 10, Ma: 7, Ra: 18, Ju: 16, Sa: 19, Me: 17 };
  const ARCSEC_PER_NAK = 48000;
  const MS_PER_YEAR = 365.25 * 86400000;
  const LEVEL_NAMES = ["Mahadasha", "Antardasha", "Pratyantar", "Sookshma", "Prana", "Deha"];

  /* split a period {lords:[], start:ms, end:ms} into its 9 sub-periods */
  function subperiods(parent) {
    const total = parent.end - parent.start;
    const startIdx = VIM_ORDER.indexOf(parent.lords[parent.lords.length - 1]);
    const out = [];
    let t = parent.start;
    for (let i = 0; i < 9; i++) {
      const lord = VIM_ORDER[(startIdx + i) % 9];
      const dt = total * VIM_YEARS[lord] / 120;
      out.push({ lords: [...parent.lords, lord], start: t, end: t + dt });
      t += dt;
    }
    out[8].end = parent.end;               // absorb float residue
    return out;
  }

  /* the nine Mahadashas of the cycle containing `momentMs` */
  function mahaTimeline(moonArcsec, momentMs) {
    const total = moonArcsec % (27 * ARCSEC_PER_NAK);
    const nakIdx = Math.floor(total / ARCSEC_PER_NAK);
    const lord = VIM_ORDER[nakIdx % 9];
    const frac = (total % ARCSEC_PER_NAK) / ARCSEC_PER_NAK;
    const start = momentMs - VIM_YEARS[lord] * frac * MS_PER_YEAR;
    const out = [];
    let t = start;
    const idx = VIM_ORDER.indexOf(lord);
    for (let i = 0; i < 9; i++) {
      const l = VIM_ORDER[(idx + i) % 9];
      const dt = VIM_YEARS[l] * MS_PER_YEAR;
      out.push({ lords: [l], start: t, end: t + dt });
      t += dt;
    }
    return out;
  }

  /* Maha..Prana chain running at momentMs */
  function currentChain(moonArcsec, momentMs, levels = 5) {
    let cur = mahaTimeline(moonArcsec, momentMs)
      .find(p => p.start <= momentMs && momentMs < p.end);
    const chain = [cur];
    for (let i = 1; i < levels; i++) {
      const subs = subperiods(cur);
      cur = subs.find(p => p.start <= momentMs && momentMs < p.end) || subs[8];
      chain.push(cur);
    }
    return chain;
  }

  function chainString(moonArcsec, momentMs, levels = 5) {
    return currentChain(moonArcsec, momentMs, levels)
      .map(p => p.lords[p.lords.length - 1]).join("-");
  }

  /* the 9 pratyantars of the antar containing momentMs (PL-style table) */
  function pratyantarTable(moonArcsec, momentMs) {
    const [, antar] = currentChain(moonArcsec, momentMs, 2);
    return subperiods(antar);
  }

  /* next `n` pratyantar periods from the chart moment (current one first).
   * IMPORTANT: the timeline is anchored ONCE at chartMs (the chart moment);
   * future periods are walked structurally, never re-anchored. */
  function upcomingPratyantars(moonArcsec, chartMs, n = 6) {
    const out = [];
    for (const maha of mahaTimeline(moonArcsec, chartMs)) {
      if (maha.end <= chartMs) continue;
      for (const antar of subperiods(maha)) {
        if (antar.end <= chartMs) continue;
        for (const prat of subperiods(antar)) {
          if (prat.end <= chartMs) continue;
          out.push({ chain: prat.lords.join("-"),
                     start: prat.start, end: prat.end });
          if (out.length >= n) return out;
        }
      }
    }
    return out;
  }

  /* next `n` periods at `depth` levels below Maha (depth 4 = Prana),
   * anchored ONCE at chartMs, walked structurally (lazy expansion). */
  function upcomingPeriods(moonArcsec, chartMs, depth, n) {
    const out = [];
    function walk(period, level) {
      if (out.length >= n || period.end <= chartMs) return;
      if (level === depth) {
        out.push({ chain: period.lords.join("-"),
                   start: period.start, end: period.end });
        return;
      }
      for (const sub of subperiods(period)) walk(sub, level + 1);
    }
    for (const maha of mahaTimeline(moonArcsec, chartMs)) walk(maha, 0);
    return out;
  }

  function upcomingPranas(moonArcsec, chartMs, n = 12) {
    return upcomingPeriods(moonArcsec, chartMs, 4, n);
  }

  /* all pratyantars overlapping [chartMs, chartMs + horizonDays]:
   * horizon-based rule — fast antars (Su/Mo/Ma) yield many rows, slow
   * ones few, but coverage is always at least the horizon. */
  function upcomingPratyantarsHorizon(moonArcsec, chartMs, horizonDays = 244) {
    const limit = chartMs + horizonDays * 86400000;
    const out = [];
    for (const maha of mahaTimeline(moonArcsec, chartMs)) {
      if (maha.end <= chartMs || maha.start >= limit) continue;
      for (const antar of subperiods(maha)) {
        if (antar.end <= chartMs || antar.start >= limit) continue;
        for (const prat of subperiods(antar)) {
          if (prat.end <= chartMs || prat.start >= limit) continue;
          out.push({ chain: prat.lords.join("-"),
                     start: prat.start, end: prat.end });
        }
      }
    }
    return out;
  }

  /* all prana periods overlapping [fromMs, toMs], anchored ONCE at
   * chartMs (the horary chart moment) and walked structurally. */
  function pranasInWindow(moonArcsec, chartMs, fromMs, toMs) {
    const out = [];
    function walk(period, level) {
      if (period.end <= fromMs || period.start >= toMs) return;
      if (level === 4) {
        out.push({ chain: period.lords.join("-"),
                   start: period.start, end: period.end });
        return;
      }
      for (const sub of subperiods(period)) walk(sub, level + 1);
    }
    for (const maha of mahaTimeline(moonArcsec, chartMs)) walk(maha, 0);
    return out;
  }

  /* generic: all periods at `depth` levels below Maha (5 = Deha)
   * overlapping [fromMs, toMs], anchored ONCE at chartMs. */
  function periodsInWindow(moonArcsec, chartMs, fromMs, toMs, depth) {
    const out = [];
    function walk(period, level) {
      if (period.end <= fromMs || period.start >= toMs) return;
      if (level === depth) {
        out.push({ chain: period.lords.join("-"),
                   start: period.start, end: period.end });
        return;
      }
      for (const sub of subperiods(period)) walk(sub, level + 1);
    }
    for (const maha of mahaTimeline(moonArcsec, chartMs)) walk(maha, 0);
    return out;
  }

  function fmtDateTime(ms) {
    const d = new Date(ms);
    return `${String(d.getUTCDate()).padStart(2, "0")}-` +
           `${String(d.getUTCMonth() + 1).padStart(2, "0")}-` +
           `${d.getUTCFullYear()} ` +
           `${String(d.getUTCHours()).padStart(2, "0")}:` +
           `${String(d.getUTCMinutes()).padStart(2, "0")}`;
  }

  function fmtDate(ms) {
    const d = new Date(ms);
    return `${String(d.getUTCDate()).padStart(2, "0")}-` +
           `${String(d.getUTCMonth() + 1).padStart(2, "0")}-` +
           `${d.getUTCFullYear()}`;
  }

  function momentMs(y, m, d, hh, mi, ss) {
    return Date.UTC(y, m - 1, d, hh || 0, mi || 0, ss || 0);
  }

  return { VIM_ORDER, VIM_YEARS, LEVEL_NAMES, subperiods, mahaTimeline,
           currentChain, chainString, pratyantarTable, upcomingPratyantars,
           upcomingPeriods, upcomingPranas, upcomingPratyantarsHorizon,
           pranasInWindow, periodsInWindow,
           fmtDate, fmtDateTime, momentMs };
});

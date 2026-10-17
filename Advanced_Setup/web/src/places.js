/*
 * places.js — Place gazetteer for KAAST: built-in places plus user-added
 * places persisted in the browser's localStorage. Each entry carries the
 * exact coordinates and UTC offset, so charts are reproducible across
 * machines (unlike per-computer manual atlas entries).
 */
"use strict";

(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory();
  else root.KPPlaces = factory();
})(typeof self !== "undefined" ? self : this, function () {

  // Canonical coordinates (decimal degrees, +N/+E) and UTC offsets.
  // Lapanga entry matches the most recent reference chart's machine.
  const BUILTIN = [
    { name: "Singapore, Singapore", lat: 1.28333,  lon: 103.85000, tz: 8.0 },
    { name: "Lapanga, India",       lat: 21.70330, lon: 84.03139,  tz: 5.5 },
    { name: "Puri (Karar Ashram), India", lat: 19.79440, lon: 85.81890, tz: 5.5 },
    { name: "Bhubaneswar, India",   lat: 20.27000, lon: 85.84000,  tz: 5.5 },
    { name: "Cuttack, India",       lat: 20.46500, lon: 85.87900,  tz: 5.5 },
    { name: "New Delhi, India",     lat: 28.61390, lon: 77.20900,  tz: 5.5 },
  ];
  const LS_KEY = "kaast_places";

  function custom() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
    catch (e) { return []; }
  }

  function all() {
    const seen = {}, out = [];
    for (const p of [...custom(), ...BUILTIN]) {
      if (!seen[p.name.toLowerCase()]) { seen[p.name.toLowerCase()] = 1; out.push(p); }
    }
    return out;
  }

  function find(name) {
    if (!name) return null;
    const n = name.trim().toLowerCase();
    return all().find(p => p.name.toLowerCase() === n)
        || all().find(p => p.name.toLowerCase().startsWith(n)) || null;
  }

  function save(name, lat, lon, tz) {
    if (!name || !isFinite(lat) || !isFinite(lon) || !isFinite(tz)) return false;
    const list = custom().filter(p => p.name.toLowerCase() !== name.trim().toLowerCase());
    list.unshift({ name: name.trim(), lat: +lat, lon: +lon, tz: +tz });
    try { localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 50))); }
    catch (e) { /* storage unavailable: non-fatal */ }
    return true;
  }

  function fmtCoord(lat, lon) {
    const f = (v, pos, neg) => {
      const h = v >= 0 ? pos : neg;
      let t = Math.round(Math.abs(v) * 3600);        // total arcseconds
      const d = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60;
      return `${d}°${h}${String(m).padStart(2, "0")}'${String(s).padStart(2, "0")}''`;
    };
    return `${f(lat, "N", "S")}  ${f(lon, "E", "W")}`;
  }

  return { BUILTIN, all, find, save, fmtCoord };
});

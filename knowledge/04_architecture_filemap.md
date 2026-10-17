# 04 · Architecture & file map

Two sibling engines, one specification, strict parity. Python drives the
CLI/Excel pipeline; JavaScript drives the offline single-file HTML apps.

## KP_Automation/ (the main repo, pip name `kala-chakra` v2.x)

```
src/kala_chakra/
  kp_core.py        engine: arcsecond longitudes, star/sub lords, Chart
                    (placement, ownership, node vectors, POWER CALC)
  sf_parser.py      raw Solar Fire report (text/xlsx) → Chart
  ephemeris.py      native casting (pyswisseph): sf/modern modes,
                    SF ΔT curve, ayanamsa cal, geocentric lat  [kp-cast]
  dasha.py          Vimshottari Maha→Prana, PL convention,
                    upcoming_pratyantars (anchor once!)
  excel_builder.py  chart → finished East-Indian workbook     [kp-build]
  process.py        annotate existing chart workbooks         [kp-annotate]
  validate_batch.py audit a folder of manual charts           [kp-validate]
  xlsx_surgical.py  style-safe cell writer (only changed cells rewritten)
  xlwings_run.py    annotate the workbook open in Excel
  data/chart_template.xlsx   East Indian template (12 line SHAPES —
                             fragile! see invariants)
  data/swefiles/    Swiss Ephemeris data 1800–2399
tests/run_tests.py         regression vs RA Job.xlsx ground truth
tests/test_ephemeris.py    casting vs "Solar Fire Gold Charts.xlsx"
web/  src/ (kp_logic.js, xlsx_surgical.js, shells) · vendor/jszip
      dist/ (Kala Chakra.html, KP Annotator.html — v0.95 originals)
      build.py
docs/ main.tex/pdf (LaTeX methodology doc) · reference/KP_249 table
```

`kp_logic.js` is the JS twin of kp_core + sf_parser + builder-updates.
The apps edit workbooks surgically (JSZip + DOM XML), preserving drawings.

## Advanced_Setup/ (KAAST — in-browser casting; originals untouched)

```
web/src/
  ephemeris.js      JS twin of ephemeris.py (WASM-backed)
  dasha.js          JS twin of dasha.py
  places.js         gazetteer: built-in canonical places + localStorage
  kp_logic.js, xlsx_surgical.js   verbatim copies from KP_Automation
  caster_shell.html / app_shell.html          v0.95 shells
  caster_shell_v096.html / app_shell_v096.html  v0.96 (adds dasha card)
web/vendor/
  swisseph.wasm, swisseph.data (trimmed 2.1 MB), swisseph_glue.js
  (patched: classic-script compatible, node shim `__kaast_require`),
  jszip.min.js
web/build.py → dist v0.95 · web/build_v096.py → dist v0.96
web/dist/     the four shipped single-file apps (~3.7 MB each)
tests/test_wasm_engine.mjs + reference_charts.json + VALIDATION_REPORT.md
```

## How a single-file app is assembled

build script inlines: shell HTML + `<script>` blocks (jszip, kp_logic,
xlsx_surgical, base64 chart template, base64 WASM + base64 ephemeris data,
patched glue, ephemeris.js, places.js, dasha.js). Browser boots the WASM
via `Module.getPreloadedPackage` (no fetch). Everything offline; nothing
uploaded.

## Version workflow

New app version = new shell files + new build script + new dist names
(`… v0.97.html`), previous dist files untouched. Branding: header
"କାଳ ଚକ୍ର · Kala Chakra vX", tag "KAAST — Karar Ashram Astrology
Software", liner "by Swami Yogeswarananda Giri".

## App UX details worth knowing

- Kala Chakra input modes: paste-SF-report OR built-in casting (leave the
  paste box empty). Date/time prefill from SF header (`ET = …` line).
- Chart SVG: fixed East-Indian layout; per-region adaptive font
  (width/vertical budgets per sign) prevents overflow.
- "Place" (not "Location") everywhere; centre shows place + exact lat/lon.
- Dasha card (v0.96+): 5-level chain, PL-style pratyantar table
  (current highlighted), upcoming pratyantar changes.

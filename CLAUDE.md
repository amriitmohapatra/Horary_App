# Horary_App — agent bootstrap

You are working on **Kala Chakra / KAAST**, a validated KP-horary-astrology
automation system (Python package + single-file HTML apps). Everything you
need to know — the astrological method, the decoded calculation rules, the
calibration constants, the architecture, and what is already validated —
is written down. **Do not ask the user to re-explain the domain.**

## Boot sequence (do this before anything else)

1. Read `knowledge/00_START_HERE.md` — the index. Follow its reading order
   (10 minutes of reading replaces this entire project's history).
2. Skim `knowledge/07_conventions_invariants.md` — the rules you must not
   break. They are enforced by test suites.
3. Then ask the user what change they want. Nothing more.

## Hard rules

- **Never** re-save `chart_template.xlsx` (or any chart workbook) with
  openpyxl/ExcelJS-style libraries: line drawings are silently destroyed.
  Cell writes go through the surgical XML writers
  (`kala_chakra/xlsx_surgical.py`, `web/src/xlsx_surgical.js`).
- Python and JavaScript engines are twins. Any rule change lands in BOTH,
  and parity is re-verified.
- After any change, run the validation suites listed in
  `knowledge/05_validation_ground_truth.md`. They compare against the
  family's manually calculated charts — the ground truth.
- New app versions are built as NEW files with a version suffix
  (v0.95 → v0.96 → …); never overwrite shipped dist files.

## Layout (one line each)

- `KP_Automation/` — the main repo: Python package `kala_chakra`
  (engine, ephemeris, dasha, Excel pipeline), web apps v0.95, docs, tests.
- `Advanced_Setup/` — KAAST v0.95/v0.96 web apps with the in-browser
  Swiss Ephemeris (WASM) and the dasha module; own build + tests.
- `knowledge/` — the project brain. Read it.
- Everything else (Testing/, *.xlsx, PDFs, screenshots) — source data and
  ground truth; treat as read-only.

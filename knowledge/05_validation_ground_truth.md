# 05 · Validation & ground truth

The family's manually calculated charts are the ground truth. Every rule in
the system was reverse-engineered and then proven against them. **Run these
after any change; a change that breaks them is wrong (or has found another
manual slip — investigate before trusting either).**

## Ground-truth files (read-only!)

- `RA Job.xlsx` — two fully worked charts (Sheet1 Dec-2022 job question;
  Sheet3 "SG" chart) incl. cusp-number vectors (col D) and power strings
  (col E). Sheet3's date label says 2022 but the chart was cast
  **2023-02-08** (verified).
- `Horary Artifacts.xlsx` — the 6 guide sheets (workflow spec), SF Gold
  raw-output example ("Test1"), Sheet2 power worked example.
- `Solar Fire Gold Charts.xlsx` — 10 SF reports WITH full headers
  (2019–2026, Singapore + Lapanga): the ephemeris calibration set.
- `Testing/` — ~64 chart workbooks; annotations + some PL dasha
  screenshots embedded as images.
- `KP Star Lord and Sub Lord Table.pdf` — father's scanned tables
  (his red handwritten Taurus rows are corrections and are correct).

## Validation suites & expected results

| Suite | Command (from its folder) | Expected |
|---|---|---|
| Core regression | `python KP_Automation/tests/run_tests.py "RA Job.xlsx"` | 130/130 |
| Corpus audit | `kp-validate Testing/` | only known manual slips (below) |
| Casting vs SF | `python KP_Automation/tests/test_ephemeris.py "Solar Fire Gold Charts.xlsx"` | 80 planets ≤1″, 120 cusps ≤12″, 0 fail |
| WASM engine | `node Advanced_Setup/tests/test_wasm_engine.mjs` | same, 0 fail |
| JS↔Py parity | node harnesses in the original sessions; rebuild if needed | identical outputs |

Headline numbers achieved: 3,300+ star/sub annotations exact; 27/27 power
strings exact; 404/405 planetary positions across the whole corpus within
1″ (the 405th is XVG's 9-second time-cell slip); 40/40 PL dasha dates
exact (RA Job 7, SG 4, MANTA 29 — MANTA's time cell is empty; ~16:00 fits).
(Caveat: PL7's "365.25" option really uses 365.2421875-day years; the
match holds only because these dates lie within ~2 years of the chart —
see [03_ephemeris_calibration.md](03_ephemeris_calibration.md).)

## Known errors in the ground-truth data (do NOT "fix" code against them)

Manual calculation slips (confirmed by the user):
- TRON Crypto cusp 10 annotated `Mo/Mo`; correct is `Su/Sa`.
- Economics PhD: Venus house tag −4; correct −5.
- NYU Stern: Mars house tag −8; correct −7 (13″ from the cusp).

Label (data-entry) errors — charts themselves are fine:
- RA Job Sheet3/4: year 2022 → actually 2023.
- D/M–M/D Excel swaps (2024 batch): Columbia 01-04→04-01, Cornell
  01-02→02-01, LSE Econ 01-03→03-01, LSE Stat 01-02→02-01, NYU GSAS
  01-12→12-01, Northwestern 01-02→02-01, Oxford S1 01-02→02-01, Princeton
  01-10→10-01, Stanford 01-10→10-01, UCLA S2 01-12→12-01, Yale
  01-02→02-01, Compound 01-03→03-01.
- Wharton: 2021-02-03 → actually 2021-03-03. XVG: 19:28:33 → :24.
(Full table: `Advanced_Setup/tests/VALIDATION_REPORT.md`.)

## Expected residuals (not bugs)

- ±1″ display flips: SF truncates arcseconds; our value is within 1″ of
  SF's underlying one.
- Cusp offsets of tens of arcseconds vs charts from other machines:
  per-machine atlas coordinate drift (see
  [03_ephemeris_calibration.md](03_ephemeris_calibration.md)).

# Corpus validation: KAAST engines vs Solar Fire Gold 9

**Scope:** all 45 charts in `Testing/` + `RA Job.xlsx` that carry place,
date and time labels (5 Singapore, 40 Lapanga). Both engines (Python
`kp-cast` and the browser WASM engine) were run in `sf` mode and compared
against the Solar Fire values stored in the workbooks.

## Verdict

**Planets: 404/405 positions match within 1 truncated arcsecond**
(Python: 331 exact + 73 off by 1''; JS: 257 exact + 147 off by 1'';
both engines agree with each other). The ±1'' cases are truncation-boundary
jitter: Solar Fire truncates display to whole arcseconds, and our value
differs from SF's underlying one by under 1'', which occasionally flips the
last digit. **Cusps** match to within each machine's entered-coordinate
difference (see below).

## Why some charts did NOT match at first — all label errors, not chart errors

The engine recovered the true cast moment for every mismatched chart:

| Workbook | Label says | Actually cast | Cause |
|---|---|---|---|
| RA Job (SG chart, Sheets 3/4) | 2022-02-08 | **2023**-02-08 | year typo |
| Columbia | 2024-04-01 | 2024-01-04 | D/M–M/D swap |
| Cornell | 2024-02-01 | 2024-01-02 | D/M–M/D swap |
| LSE Economics | 2024-03-01 | 2024-01-03 | D/M–M/D swap |
| LSE Statistics | 2024-02-01 | 2024-01-02 | D/M–M/D swap |
| NYU GSAS | 2024-12-01 | 2024-01-12 | D/M–M/D swap |
| Northwestern | 2024-02-01 | 2024-01-02 | D/M–M/D swap |
| Oxford (Sheet1) | 2024-02-01 | 2024-01-02 | D/M–M/D swap |
| Princeton | 2024-10-01 | 2024-01-10 | D/M–M/D swap |
| Stanford | 2024-10-01 | 2024-01-10 | D/M–M/D swap |
| UCLA (Sheet2) | 2024-12-01 | 2024-01-12 | D/M–M/D swap |
| Yale | 2024-02-01 | 2024-01-02 | D/M–M/D swap |
| Compound Crypto | 2024-03-01 | 2024-01-03 | D/M–M/D swap |
| Amrit Wharton PhD | 2021-02-03 | 2021-03-03 | month + day typo |
| XVG Crypto | 19:28:33 | 19:28:24 | 9-second time slip |

The 2024 batch: dates typed as D/M/YYYY were stored by Excel as M/D/YYYY.
With dates corrected, every one of these matches within 1''.

## Cusps and the per-machine atlas problem

Cusps depend on the coordinates each computer had entered:

- **Singapore charts:** offsets −2'' to −9'' vs the canonical 1.28333N,
  103.85E — the machines' entries differ by a few arcseconds of longitude.
- **Lapanga charts:** offsets +19'' to +215'' — each machine's manually
  added Lapanga differs by up to ~14 seconds of clock longitude, exactly
  as observed. Per-chart cusp spread stays ≤53''; with a machine's true
  coordinates the residual drops to the reference-chart level (±1–2'').

This is why the KAAST places gazetteer (fixed canonical coordinates,
shareable across machines) matters: it removes this source of drift
permanently.

## Reproducing

Python side: the analysis scripts in this session used
`kala_chakra.ephemeris.cast_chart(mode="sf")` per chart label.
JS side: `tests/test_wasm_engine.mjs` validates the engine against the
10-report reference set; the corpus run used the same `castChart` API.

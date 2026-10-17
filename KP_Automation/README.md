# କାଳ ଚକ୍ର · Kala Chakra

**KP horary chart automation** — from a raw astrology-software export to a
finished chart with star lords, sub lords, cusp numbers, and the complete
step-wise power calculation. What took 15–25 minutes by hand takes 2–3
minutes, with zero arithmetic slips.

The method is Krishnamurti Paddhati (KP) horary, East Indian chart style, as
practised in the author's family. Full methodology: [`docs/main.pdf`](docs/main.pdf).

---

## Highlights

- **No lookup tables.** The 249 KP star/sub subdivisions are *computed* from
  the nine Vimshottari dasha years using exact integer-arcsecond arithmetic,
  and were verified row-by-row against the scanned family reference tables.
- **Two engines, one spec.** A Python engine (CLI + Excel pipeline) and a
  JavaScript engine (zero-install browser apps), held together by parity
  tests over the full chart corpus.
- **Style-safe Excel.** Workbooks are edited surgically at the XML level —
  only changed cells are rewritten, so drawings, images and formatting
  (including the 12-line East Indian chart) survive byte-for-byte.
- **Validated against ground truth.** 3,300+ star/sub annotations, 640+
  house tags, and every stored cusp-number vector and power string from
  previously hand-calculated charts reproduce exactly. The only
  disagreements ever found were three confirmed slips in the manual charts.

---

## Repository layout

```
├── src/kala_chakra/          Python package (the engine)
│   ├── kp_core.py            longitudes, star/sub lords, placement,
│   │                         ownership, node rules, power calculation
│   ├── sf_parser.py          raw Solar Fire report → clean chart
│   ├── excel_builder.py      chart → finished workbook   (CLI: kp-build)
│   ├── process.py            annotate existing workbooks (CLI: kp-annotate)
│   ├── validate_batch.py     audit a folder of charts    (CLI: kp-validate)
│   ├── xlsx_surgical.py      style-safe .xlsx cell writer
│   ├── xlwings_run.py        annotate the workbook open in Excel
│   └── data/chart_template.xlsx   East Indian chart template (12 line shapes)
├── web/
│   ├── dist/Kala Chakra.html      ★ the app (single file, offline)
│   ├── dist/KP Annotator.html     drag-and-drop annotator
│   ├── src/                       kp_logic.js, xlsx_surgical.js, HTML shells
│   ├── vendor/jszip.min.js
│   └── build.py                   rebuilds dist/ from src/
├── tests/run_tests.py        regression suite (needs a ground-truth workbook)
├── docs/
│   ├── main.pdf / main.tex   full methodology & architecture documentation
│   └── reference/KP_249_Reference_Table.xlsx   generated KP table (4 series)
└── pyproject.toml
```

---

## For non-coders: the app

Open **`web/dist/Kala Chakra.html`** in any browser (double-click — no
install, no internet, nothing uploaded).

1. Enter the horary question, name, date, time, location.
2. Paste the Solar Fire *CHART ANALYSIS REPORT* (or drop the exported
   `.xlsx`). Date and time pre-fill from the report header.
3. Press **Calculate** — you get the East Indian chart, cusp/planet tables,
   the four-step power derivation for every planet, a downloadable finished
   Excel workbook, and print/PDF export.

`web/dist/KP Annotator.html` is the lighter sibling: drop an existing
chart workbook on it and receive an annotated copy.

---

## For coders: install & CLI

Requires Python ≥ 3.10.

```bash
git clone <this-repo>
cd kala-chakra
pip install .            # or:  pip install ".[excel]"  for the xlwings mode
```

```bash
# Cast a chart with the BUILT-IN ephemeris — no astrology software needed
# (needs: pip install ".[cast]")
kp-cast --date 2026-07-06 --time 17:01:56 --tz 8 --lat 1.28333 --lon 103.85 \
        --question "Will I get the job?" --name Amriit --location Singapore \
        -o chart.xlsx          # --mode sf (Solar Fire clone) | modern

# Raw export → finished workbook (all six workflow steps)
kp-build raw_export.xlsx --question "Will I get the job?" \
         --name Amriit --date "6 Jul 2026" --time "9:03 pm" --location Singapore

# Annotate one or many existing chart workbooks (idempotent)
kp-annotate "My Chart.xlsx"
kp-annotate charts/*.xlsx --in-place

# Audit a folder of manually calculated charts against the engine
kp-validate path/to/charts/
```

As a library:

```python
from kala_chakra.sf_parser import parse_sf_text
from kala_chakra.excel_builder import build

chart = parse_sf_text(raw_report_text)
chart.numbers_string("Mo")      # '4,9'
chart.powers_string("Mo")       # '23, 318, 422, ...'
build(chart, {"question": "…", "name": "…"}, "out.xlsx")
```

---

## How it works (one paragraph)

Longitudes are integers in arcseconds, so every boundary is exact. The star
lord of a point is the lord of its nakshatra (27 × 13°20′, cycling through
the Vimshottari order); the sub lord divides each nakshatra in proportion to
the dasha years (each year = 400″), starting from the star lord. House *h*
spans cusp *h* → cusp *h+1*; a planet owns the cusps falling in its signs
(span rule for cuspless signs); Rahu/Ketu act through their dispositor. The
power calculation assigns fixed powers 1–12 across a 3×2×2 grid of
(Planet/Star/Sub) × (own placement & ownership | lordship over cusps) ×
(primary | secondary), then merges identical bases by adding powers. See
`docs/main.pdf` for the precise rules, the node exception, and the worked
example.

---

## Development

```bash
# regression suite (point it at a ground-truth workbook, e.g. RA Job.xlsx)
python tests/run_tests.py "path/to/RA Job.xlsx"

# corpus audit — star/sub, house tags, numbers, powers
kp-validate path/to/Testing/

# rebuild the web apps after editing web/src/
python web/build.py

# JS ↔ Python parity harness
node web/src/test_node.js some_chart.xlsx

# documentation
cd docs && latexmk -pdf main.tex
```

**Invariants to preserve** (all enforced by the test suite):

- Boundary convention: half-open `[from, to)`; a planet exactly on a cusp
  belongs to that cusp's house.
- Ownership vectors: placement first, then ownerships ascending; nodes:
  `[dispositor placement, node placement, dispositor ownerships…]`.
- Power grid: numerator 2/1, 4/3, 6/5 (Planet, Star, Sub); denominator
  7/10, 8/11, 9/12. Node position powers go to node *and* dispositor.
- Excel writes must be surgical — never re-save a template workbook with a
  general-purpose library (line drawings will be lost silently).

## Built-in ephemeris (`kp-cast`)

`src/kala_chakra/ephemeris.py` casts charts directly with the Swiss
Ephemeris — the same engine Solar Fire uses internally — configured to the
family's exact SF profile: sidereal Lahiri, Topocentric houses, True Node,
geocentric-latitude correction, truncated arcseconds. Two modes:

- `--mode sf` replicates Solar Fire v9.0.19, including its obsolete DeltaT
  extrapolation (calibrated: +1.251'' ayanamsa offset, piecewise DeltaT
  anchors recovered from 10 reference charts, 2019–2026). Validated:
  **80/80 planetary positions within 1''**, all 120 cusps within the
  reference charts' own truncation tolerance.
- `--mode modern` uses current astronomical DeltaT — more accurate than
  Solar Fire itself, differing by a few arcseconds (mainly the Moon).

Planetary data files (1800–2399 CE) are bundled in
`src/kala_chakra/data/swefiles/`. Run `tests/test_ephemeris.py` against the
reference workbook after any change here.

## Roadmap

- Swiss Ephemeris WASM build inside the Kala Chakra web app (browser-side
  casting; `kp-cast` already covers Python).
- Optional native desktop wrapper (Tauri) around the web app.
- Parsers for additional astrology programs' report formats.

## Provenance & license

The astrological method is the family's traditional KP practice, transcribed
from working notes and handwritten tables; this software encodes it
faithfully and originates no doctrine. Developed with AI assistance
(Anthropic Claude); all rules validated against hand-calculated charts.

No license has been chosen yet — treat as all-rights-reserved. (For a private
family tool this is fine; add a LICENSE file if you ever open it up.)

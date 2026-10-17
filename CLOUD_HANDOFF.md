# Cloud hand-off (checkpoint 2026-10-17)

This repository was imported on 2026-10-17 from a local folder that is now archived.
From now on, make changes in this repository only.

Paste the prompt below into a new Claude Code cloud session to continue from the checkpoint.

---

You are continuing work on the Horary_App repository (Kala Chakra / KAAST, a validated KP horary astrology system).

Boot first:
1. Read `CLAUDE.md`.
2. Read `knowledge/00_START_HERE.md` and follow its reading order.
3. Skim `knowledge/07_conventions_invariants.md`.

The hard rules in `CLAUDE.md` still apply:
- Never re-save chart workbooks with openpyxl or ExcelJS.
- The Python and JS engines are twins.
- Run the validation suites after any change.
- New app versions are new files.

Checkpoint as of 2026-10-17:
- The latest apps are `Advanced_Setup/web/dist/Kala Chakra v1.5.html` and `KAAST Caster v1.5.html`.
  - Their casting engine is `Advanced_Setup/web/src/ephemeris.js`, `kp_logic.js` and `dasha.js`.
  - It is Swiss Ephemeris 2.10.03 (WASM), Lahiri (Swiss − 1.251″, Solar Fire clone), Topocentric cusps on geocentric latitude, True Node, truncated arcseconds and a Vimshottari dasha to 6 levels with 365.25-day years.
- The Parashara's Light 7 reverse-engineering study is complete. The report is `Astro_Fork/PL7_Reverse_Engineering_Report/main.pdf`.
  - The LaTeX source is in `main.tex` and `sections/`.
  - The scripts are in `scripts/`, the evidence in `evidence/` and the citation ledger in `citations/`.
  - The PL7 installation that was analysed is in `Astro_Fork/GeoVision/`.
- Key PL7 findings:
  - PL7 uses its own ephemeris, which is precise only to the end of 2048.
  - Its default Lahiri matches Kala Chakra's to 1.4″.
  - It offers 8 ayanamsas: Krishnamurti is the 291 AD straight line, and Krishnamurti New is Lahiri − 6′05″.
  - Its cusps are always Placidus, probably on geographic latitude.
  - It uses the true node and the mean equinox.
  - Its Delta-T is 83 s in 2020, rising 0.89 s per year.
  - Its Yogi point is Sun + Moon + 93°20′.
  - Varga rules for D6, D8, D9, D10, D11 (two variants), D16 (alternate) and D24 were decoded.
  - Its dasha option labelled "365.25" really uses 365.2421875-day years.
  - In the analysed installation, the planets other than the Moon and the nodes are displaced by about 0.97 × the Moon's geocentric vector, up to about 10′. This affects the transit viewer and probably natal charts too.
- The `knowledge/` files 00, 01, 03, 05 and 06 were updated with these findings. No engine code changed.

Still open:
- The user should run the four PL7 tests in section 13 of the report on a Windows machine with PL7. They settle these questions:
  - whether natal planets carry the Moon-vector error
  - which KP ayanamsa the KP printout uses
  - whether Rahu is true or mean
  - the D11 rule
- Avayogi and the Duplicate Yogi are not decoded.
- The engine applies the arudha exception for a lord in the 7th, but how it does so is unresolved.
- Possible Kala Chakra additions, only if the user asks:
  - a D11 or other varga module
  - an optional 365.2421875-day dasha year for parity with PL7
  - a KP ayanamsa option

Notes for the cloud environment:
- The report scripts were written on macOS. Some paths are absolute and must be re-pointed:
  - `scripts/rea.sh` points at a local scratchpad.
  - `scripts/make_figures.py` takes the paths as arguments.
- Python needs `pyswisseph`, `numpy` and `matplotlib`.
- Binary analysis used the REA CLI (`npx rea-agents`) with Rizin. On Linux, install Rizin with the package manager.
- `build.sh` calls citation-provenance scripts from the user's local `~/.claude/skills`, which may not exist here. If they are missing, build with `latexmk -pdf main.tex` (this needs texlive and biber).
- The family ground-truth workbooks (`RA Job.xlsx`, `Horary Artifacts.xlsx`, `Solar Fire Gold Charts.xlsx`, `Testing/`) are read-only.

When you have finished booting, ask me what I want to do next.

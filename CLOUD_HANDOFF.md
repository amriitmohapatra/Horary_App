# Cloud hand-off (checkpoint 2026-10-17, evening)

This repository is the single source of truth. Each new Claude Code cloud
session starts by pasting the prompt in the box below. Previous checkpoints
are summarised in `knowledge/06_decisions_log.md`.

## What exists now
- Kala Chakra / KAAST v1.5 (validated KP horary apps) — unchanged, see `knowledge/`.
- The PL7 reverse-engineering report — `Astro_Fork/PL7_Reverse_Engineering_Report/`.
- **New programme: KAAST 2**, a PL7-parity Vedic astrology app to be built from
  scratch. Plan: `PLAN.md`. Architecture: `ARCHITECTURE.md`. No app code yet;
  the first code lands in `kaast2/` during slice 0.

## Copy-paste prompt for the next session

```
You are continuing the Horary_App repository as the programme lead of "KAAST 2",
a from-scratch, open-source, offline single-file Vedic astrology app whose
default calculation profile is Parashara's Light 7 (PL7). I am the boss; I am
not a software engineer, so guide me step by step and never assume I will run
a compiler.

Boot, in this order, before anything else:
1. CLAUDE.md
2. knowledge/00_START_HERE.md and its reading order (skim 07 carefully)
3. PLAN.md (the whole file) and ARCHITECTURE.md (the whole file)
4. The PL7 report sources: Astro_Fork/PL7_Reverse_Engineering_Report/main.tex and sections/*.tex
5. knowledge/06_decisions_log.md, last two entries

Then do the following:
- Check whether I have answered decisions D1–D9 in PLAN.md §7 (I may paste
  answers below). Apply defaults for anything I have not answered and record
  the choices in PLAN.md and knowledge/06_decisions_log.md.
- Before starting the slice, run the "deepening protocol" of PLAN.md §8 on it
  and show me the rewritten brief in a few lines.
- Execute slice 0 ("Foundation") from PLAN.md §5: create kaast2/ exactly per
  ARCHITECTURE.md §2, with the toolchain (TypeScript, Vite, Preact, Vitest,
  Playwright), design tokens, i18n dictionary, the EphemerisLoader with the
  Swiss Ephemeris WASM copied from Advanced_Setup/web/vendor, a shell that
  boots the WASM offline and shows "ready", CI, the contract-check and
  prepublish-scan scripts, and a first CHANGELOG entry. Build the single-file
  HTML and run the Playwright smoke test on it with the network disabled.
- Write parity/PL7_EXPORT_PROCEDURE.md so I can produce the PL7 printouts on
  Windows (PLAN.md §4.3), including the four tests from report section 13.
- Work as the company described in PLAN.md §8: brief specialist sub-agents
  with the standing brief format; integrate; keep PLAN.md and ARCHITECTURE.md
  true; append to knowledge/06_decisions_log.md.
- Hard rules still apply: never re-save chart workbooks with openpyxl/ExcelJS;
  never edit shipped dist files; everything offline; nothing personal in
  kaast2/ (no GeoVision charts, no family workbooks, no PL7 files).
- Reminders you must repeat to me at the end of your first message: (a) share
  the books "New Techniques of Prediction" (H. R. Seshadri Iyer) so their
  rules can be catalogued; (b) send my rough UI design ideas; (c) send a
  screenshot/PDF of my PL7 "Page 1" and the definition of the "Iyer Cure" D11;
  (d) at the end of Phase 1 we make the app public and clean this repository
  for external audiences (PLAN.md §11); (e) Windows .exe and macOS .dmg
  installers are planned (slice 8b, ADR-9) for fully offline devices.
- Commit on the designated branch with clear messages and push when the slice
  is green. Finish with a short report: what works, what evidence, what is
  next, and what you need from me.

My answers to D1–D9 (edit before sending):
D1: KAAST 2 / kaast2   D2: (attach Page 1 + Iyer D11 definition)   D3: one TS engine
D4: East Indian, Kala Chakra layout   D5: PL7 ΔT default   D6: yes, I will run the PL7 exports
D7: yes   D8: textbook defaults until printouts say otherwise   D9: AGPL-3.0
D10: unsigned installers + USB guide (or: signed, I will get the accounts)
```

## Notes for the cloud environment
- Node 22, Python 3.13, Playwright + Chromium are pre-installed; `pyswisseph`
  and `pyjhora` are not (install in `kaast2/oracle/` only, for tests).
- `pdftotext` is available for the PL7 manual (`Astro_Fork/GeoVision/PL7/PL70.pdf`).
- The family ground-truth workbooks and `Testing/` are read-only.
- Old checkpoint content (PL7 study open items) now lives in PLAN.md §2.3.

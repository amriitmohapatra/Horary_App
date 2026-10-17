# PLAN — KAAST 2 (working name): a PL7-parity Vedic astrology app

Status: **v0.5 — every Phase 1 slice built; functional app shipped as `kaast2/dist/Astro-Amriit v0.5.html` (seconds entry on phones, saved places, KP chart and significators) (user guide in `kaast2/docs/user_guide/`). Next: PL 9 parity audit (slice 9) with the boss's exports.** Created 2026-10-17, updated 2026-10-17 (session 2).
Owner of this document: the programme lead (Claude). Approver: Amrit (the boss).
This file is updated at the end of every working session. ARCHITECTURE.md is its
technical twin; `knowledge/06_decisions_log.md` records why things changed.

---

## 0. How to read this if you are new to software

The guide you shared ("The Art of Building Software") gives the rhythm we will
follow, so the vocabulary below comes from it:

| Guide idea | What it means for us |
|---|---|
| Compact specification (ch. 27.2) | Section 3 below is our specification. Every feature is written as "input → rule → output". |
| Claim → mechanism → evidence (ch. 27.5) | Section 6 is the evidence table. A feature is not done because it looks right; it is done when its row has a passing check. |
| One usable slice at a time (ch. 27.6) | Section 5 breaks the work into slices. Each slice ends with an HTML file you can open and judge. |
| Release decision (ch. 27.7) | Each slice closes with a short note: what works, what evidence, what is out of scope. |
| Architecture decision record (ch. 23.1) | ARCHITECTURE.md §9 lists the decisions as context → options → decision → consequences. |
| Working with a coding assistant (ch. 27.8) | Section 8 is the standing brief format we will use for every task. |

Your job as boss: approve decisions (§7), supply the raw PL7 evidence (§4.3),
open each slice's HTML file and tell us what is wrong. You never need to run a
compiler. When a command is unavoidable, it will be one line, explained.

---

## 1. Vision and non-goals

**Vision.** An open-source, offline-capable, single-file web app for family and
friends that reproduces Parashara's Light 7 (PL7) at its default settings
(Placidus houses, Lahiri ayanamsa) 1:1 for the artefacts Amrit actually uses, with
a modern, careful UI. Built from scratch in TypeScript, using the PL7
reverse-engineering report as a guide and verification source only. Later it
becomes a public GitHub project and a Vercel deployment.

**Phase 1 goal (this plan):** full parity with PL7 on the agreed artefact list.
**Phase 2 (later, after parity):** Amrit removes PL7 features of no use, and we add
the family's own customisations (KP horary pipeline from Kala Chakra 1.5, power
calculation, Odia edition, etc.).

**Non-goals for Phase 1** (Ashtakavarga, Shad Bala, Bhava Bala and Vimshopaka moved INTO scope on 2026-10-17 because PL 9's Page 1 shows them): reproducing PL7 defects (the Moon-vector planet error
of the analysed copy; the silent post-2048 fallback); interpretation text; guna
matching; Varshaphala; muhurta; the 1–249 horary-number ascendant;
accounts, servers, databases; commercial anything.

---

## 2. What we start from (inventory, verified today)

### 2.1 Reusable, validated assets in this repository
- `Advanced_Setup/web/src/ephemeris.js` (122 lines): Swiss Ephemeris 2.10.03 WASM wrapper, Lahiri calibration, ΔT handling, truncation. Pattern to follow; constants differ for PL7.
- `Advanced_Setup/web/src/kp_logic.js` (489 lines): integer-arcsecond star/sub lord engine, 249-row KP table generated not stored, 5-level sub chain. **Reuse as is.**
- `Advanced_Setup/web/src/dasha.js` (205 lines): Vimshottari to six levels (Deha), anchor-once rule, window functions. Reuse; add the 365.2421875-day year as an option.
- `Advanced_Setup/web/vendor/`: `swisseph.wasm` (0.5 MB), `swisseph.data` (2.1 MB, 1800–2399), patched glue. Reuse.
- `Advanced_Setup/tests/test_wasm_engine.mjs` + `reference_charts.json`: 10 Solar Fire reference charts, 80 planets ≤1″, 120 cusps ≤12″. Keep as the regression gate for the Solar Fire profile.
- `knowledge/` (7 files): domain, invariants, calibration, validation. Read before any engine work.

### 2.2 The PL7 evidence base (Astro_Fork)
- Report: `Astro_Fork/PL7_Reverse_Engineering_Report/` (LaTeX, PDF, 25 Rizin evidence records, numeric evidence, scripts). Decoded with binary-level certainty: ayanamsa polynomial and all 8 options, Placidus-only cusps, true node, mean equinox, Yogi point, dasha-year constant, varga rules for D6/D8/D9/D10/D11/D11-alt/D16-alt/D24, transit-cache file format.
- `Astro_Fork/GeoVision/PL7/Temp/*.e31` (436 monthly files, 2020-01 → 2056-04): PL7's own computed Moon and Rahu every 12 h, accurate to <1″ until end-2048. **This is the only PL7 numerical output we hold today.** Planets in it carry the Moon-vector defect; usable only for ΔT and ayanamsa checks.
- `Astro_Fork/GeoVision/GeoVisionCharts/` : 1 559 saved charts (44 family/horary, 221 Indian celebrities, 1 293 US celebrities, 1 NTP). They hold **inputs only** (JD, lon, lat, tz) — no computed positions. They are the input side of the parity corpus; the output side must come from PL7 itself (§4.3).
- `Astro_Fork/GeoVision/PL7/PL70.pdf` (239 pages) + help/tutorial texts: layout and feature intent. Extracted text lives in the scratchpad; re-extract with `pdftotext -layout`.
- Family dasha screenshots (`Documentation/record/images/pl_dasha_*.png`): PL7's Antar table layout and the 40 validated dates.

### 2.3 What is still unknown (carried from the report's open items)
| Item | Why it matters | How we settle it |
|---|---|---|
| Natal planets carry the Moon-vector error in the analysed copy | Decides whether PL7 printouts of planets can be an oracle at all | Report §13 test 1 on Windows |
| Which KP ayanamsa the KP printout forces | Only for KP screens; not Phase 1 critical | Report §13 test 2 |
| Rahu true/mean option default | Cache says true; confirm in Options | Report §13 test 3 |
| D11 rule, and what "Iyer Cure" D11 is | Amrit wants two D11 versions; PL7 has "plain 11λ" and "backwards from Aries"; neither is named Iyer | Report §13 test 4 + Amrit's definition/source |
| Avayogi, Duplicate Yogi | Not decoded; textbook rules exist | PL7 printout for 3 charts + Amrit's convention |
| Arudha exception for lord in 7th | Two sources disagree | PL7 pada worksheet for 3 charts |
| Display rounding (truncate vs round; seconds vs minutes) | Affects every "1:1" comparison | Read it off the printouts |
| ~~Exact content of "Page 1"~~ | Settled 2026-10-17: PL 9.0 screenshot (6 panels) | — |
| ~~Display rounding~~ | Settled for PL 9: seconds are **rounded** (residuals −0.5…+0.3″ on the 1942 chart) | — |
| Which PL the family uses day to day | The Page 1 screenshot is **PL 9.0**, not 7; PL 9 shows no Moon-vector error | Export procedure Step 0 (Help → About) |
| PL 9 ΔT for modern dates (Swiss ≈69 s or PL7 curve ≈87 s in 2025) | Moon differs by ~10″ | Export procedure Test 5 |
| Strength fields of Page 1 (SB%, SB#, VB, AV, Av3, Av5, K7, Func., house-edge SAV + Bhava Bala) | Needed for Page 1 parity | Domain researcher spec `kaast2/docs/spec/PAGE1_SPEC.md` + PL exports |

---

## 3. Specification (what the app must do) — Phase 1

Each line is "input → rule → output". Rules marked **BIN** are decoded from the
PL7 binary; **STD** are standard textbook rules to be confirmed against PL7
printouts; **OPEN** need PL7 evidence or Amrit's ruling before coding.

### 3.1 Casting profile "PL7 default" (the default profile of the app)
- Input: civil date, time, place (lat, lon, tz, DST) → JD(UT), JD(TT).
- ΔT: **PL7 curve** = 83.0 s at 2020.0, +0.89 s/yr (fit, NUM), with a switch to
  Swiss modern ΔT. Default for parity = PL7 curve. *(Decision D5.)*
- Planets: Swiss Ephemeris geocentric apparent; sidereal via **PL7 Lahiri
  polynomial** (BIN): A = 22°27′37.65″ + 5026.87434″·T + 1.11113″·T², T = (JD − 2451545)/36525 + 1. Mean equinox of date (no nutation). True node; Ketu opposite.
- Houses: **Placidus on geographic latitude** (BIN/INF), 12 cusps; Asc = cusp 1, MC = cusp 10.
- Other ayanamsa options as in PL7's eight-way selector (BIN), selectable.
- Rounding/display: **OPEN** (read from printouts).
- Second profile "Solar Fire / Kala Chakra" (Lahiri+1.251″, Topocentric on geocentric latitude, SF ΔT) kept for continuity; shares the same engine with different constants.

### 3.2 Page 1 (default worksheet)
PL7 opens on a worksheet of fields (manual ch. 3: 4–25 fields; default "nine
fields with a large birth chart"). Amrit's Page 1 content is **OPEN** until a
screenshot arrives. Expected fields: Rasi chart drawn **in the East Indian style exactly as Kala
Chakra 1.5 draws it** (same fixed sign positions, diagonal corners, geometry-aware
text fitting, centre block with date/time/place; PL7's North Indian diamond is only
an optional view), Navamsa, planetary table (degree, sign,
nakshatra, pada, star lord/sub lord, retrograde/combust flags), cusp table,
Vimshottari Maha/Antar list, birth data header, panchanga line (tithi, vara,
nakshatra, yoga, karana — STD).

### 3.3 Divisional charts (vargas)
- Cyclic rule n·λ mod 360 (BIN): D1, D2, D3*, D4*, D7, D9, D16, D20, D27, D150.
  (*PL7 has sign-dependent D3/D4 routines not yet decoded — **OPEN**, default STD Parashari.)
- Sign-dependent (BIN): D6 (odd from Aries, even from Libra), D8 (movable Aries / fixed Sagittarius / dual Leo), D10 (odd from itself, even from 9th), D11 (= 11λ cyclic), D11-alt (backwards from Aries), D16-alt (odd forwards, even backwards), D24 (odd Leo, even Cancer).
- Remaining PL7 vargas (D12, D30, D40, D45, D60, D5, alternates): STD Parashari rules, confirmed by printouts; decode from binary if they differ.
- "Iyer Cure" D11: **OPEN** — Amrit supplies the rule or its source; implemented as a named variant.
- Output: each varga as an East Indian chart (Kala Chakra layout) and as a table; planets, Asc, optionally cusps.

### 3.4 Yogi, Avayogi, Duplicate Yogi
- Yogi point = Sun + Moon + 93°20′ (BIN). Yogi = lord of its nakshatra (DOC).
- Avayogi: STD = lord of the 6th nakshatra from the Yogi nakshatra (equivalently Yogi point + 186°40′); manual says only "the point opposite" — **OPEN**.
- Duplicate Yogi: STD = lord of the sign holding the Yogi point — **OPEN**.

### 3.5 Dashas
- Vimshottari from the Moon, balance by degree, six levels (Maha → Antar → Pratyantar → Sookshma → Prana → Deha).
- Year length selectable: **365.2421875 (PL7 default, BIN)**, 365.25 (Kala Chakra), 360, 327.85.
- Anchor once at the chart moment (invariant 7).
- UI: interactive tree with expand/collapse at every level, "jump to next planet period", today-highlight, date-at-cursor; PL7's Antar table layout (Maha-Antar header, Antar / Beginning / Ending columns, planet colours) available as a view.
- Other dasha systems (Ashtottari, Yogini, Chara …): Phase 2, only if wanted.

### 3.6 Bhava chalit artefacts
- Sripati bhava (DOC): Asc and MC as centres of houses 1 and 10, quadrants trisected, sandhis midway.
- Equal bhava (DOC): ±15° around madhyas from the Asc degree.
- KP Placidus cusps as house beginnings (BIN) — already in 3.1.
- Output: bhava chart, table of madhya/sandhi, planets re-housed.

### 3.7 Jaimini artefacts (DOC; all STD until printouts confirm)
- Chara karakas, 7 or 8 (Rahu degree = 30 − d); default **OPEN**.
- Arudha padas of all 12 houses for D1, D9, D10; exceptions (same house → 10th; 7th → 4th) with the lord-in-7th ambiguity **OPEN**.
- Upapada (pada of the 12th), Karakamsha, Swamsha.
- Rashi drishti; argala/obstruction (reversed for nodes).
- Special lagnas: Bhava, Hora, Ghatika (sunrise convention **OPEN**), Varnada, Indu, Pranapada.

### 3.8 Transit artefacts
- Transit chart for any instant (same engine), drawn around the natal chart.
- Step controls (1 s to 10 yr) and a date scrubber; no cache needed (WASM is fast).
- Upcoming transits list: sign ingress and nakshatra change dates for each body within a horizon; Sade Sati and planetary returns as simple derived lists.
- Animated circular viewer: nice-to-have, after parity.

### 3.9 Input and places
- Place gazetteer (reuse `places.js` canonical coordinates) + saved custom places in localStorage; manual lat/lon/tz entry; DST field.
- Import of GeoVision `*.xml` chart files (UTF-16 BirthData) so the 1 559 saved charts open directly; export of the same format and of a JSON chart file.

### 3.10 Quality requirements
- Runs from a single HTML file double-clicked from disk, offline, no uploads, no network calls (invariant 12).
- Loads in < 3 s on a 2020 laptop; a chart recalculates in < 100 ms after WASM boot.
- Works on phone width (16 px gutter, no horizontal scroll), keyboard-navigable, colour never the only cue, light and dark themes, Odia-ready text pipeline (Phase 2).
- Every number shown is reproducible: a "How was this computed?" panel per artefact (as the Kala Chakra power steps do today).
- **Installable on devices that never go online**: a Windows installer (`.exe`/`.msi`) and a macOS disk image (`.dmg`) that wrap the same offline build (Tauri, ADR-9). Install from a USB stick; no network at install or run time; no telemetry; no auto-update calls. The single HTML file remains the zero-install option.

---

## 4. Verification strategy ("what, other than us, shows the result is right")

### 4.1 Oracles, strongest first
1. **PL7 itself, run on Windows by Amrit** on an agreed parity set (§4.3). This is the only true oracle for display and for the undecoded rules.
2. **PL7 transit cache** (Moon, Rahu, 2020–2048, <1″): automatic test of ΔT and ayanamsa for 348 months; also proves our ephemeris window handling.
3. **Binary-decoded rules** (report §§3–5): unit tests derived from the report's own re-implementation `scripts/pl7_vargas.py`, with its "first amsa per sign" tables as fixtures.
4. **Independent open-source engine** as a second opinion for STD rules: PyJHora (Python, PVR Narasimha Rao's book; ~6 800 tests; Lahiri default), used in a Python test harness to generate fixture files — never shipped. Maitreya 8 (C++) for Jaimini cross-checks where PyJHora is silent.
5. **Solar Fire reference set** (existing 10 charts) for the second profile.
6. **Family ground truth** (`RA Job.xlsx`, `Testing/`, 40 PL dasha dates) for KP and dashas.

### 4.2 Test layers (mapped to the guide's unit / integration / system)
- Unit: pure functions (vargas, dasha arithmetic, Jaimini counting) on fixtures — Vitest, runs in CI on every push.
- Engine integration: WASM boot + full cast against cache/reference JSON — Node, nightly and on engine changes.
- UI functional: open the built single-file HTML in headless Chromium (Playwright is pre-installed here), cast a chart, assert every Page 1 field renders and matches the engine output — on every build (the v1.02 lesson: builds can silently drop code).
- Parity audit: a script that compares our output with the PL7 exports in `parity/pl7_exports/`, field by field, and writes `parity/REPORT.md` with pass/fail counts and max differences. The release gate for Phase 1.

### 4.3 The raw material we need from Amrit (one Windows afternoon)
Rawest possible: PL7's own printouts, not screenshots of screenshots. Procedure
to be written as `parity/PL7_EXPORT_PROCEDURE.md` (step by step, with the PL7
menus from the manual) once decisions are approved. The set:
- **Charts (16):** the 12 family/horary charts listed in §2.2 that have real
  times (Lapanga 2020–21 series, Amrit, Asmit, Radhanath), plus 4 celebrity
  charts spanning latitudes (Clinton 34.8°N, a southern-hemisphere one, an equatorial one, one pre-1900 for ephemeris range).
- **Per chart:** Page 1 as it opens; planetary table with seconds; all 16 Parashari + 4 Tajika vargas + alternates (the 16-field varga worksheet, manual fig. 3.5); Yogi/Avayogi/Duplicate Yogi line; Vimshottari to Pratyantar for the current Maha; Jaimini padas-and-lagnas worksheet; bhava chart (Sripati) table; one transit chart at a fixed instant.
- **Format:** print to PDF where PL7 allows ("Printouts from the Screen", manual p. 37); otherwise full-resolution screenshots. File names `<chart>__<artefact>.pdf`.
- **The four report §13 tests**, written down with the numbers read.
- A note of every option visible in Options → Calculation (so the profile is complete).

---

## 5. Work plan: slices

Each slice ends with (a) a dist HTML file you can open, (b) its evidence rows
green, (c) a release note in `CHANGELOG.md`, (d) PLAN/ARCHITECTURE updated.
Order can change after your review of the previous slice. No calendar dates:
one slice ≈ one focused session.

| # | Slice | Deliverable you can see | Evidence that closes it |
|---|---|---|---|
| 0 | Foundation | Repo folder `kaast2/` with toolchain, CI, design tokens, empty shell that boots WASM and shows "ready" | ✅ 2026-10-17: single file boots offline from `file://`, no requests, contract check, pre-publish scan |
| 1 | Engine core, PL profiles | Profiles PL 9 / PL 7 / Solar Fire; "How was this computed?" panel | ✅ 2026-10-17: PL7 cache 1392 samples, Moon ≤0.06″, Rahu ≤0.76″; Solar Fire 80 planets ≤1″, 120 cusps ≤12″; 8 ayanamsas ±0.1″. §13 test 1 moot for PL 9 |
| 2a | Page 1 (charts, tables, dasha) | East Indian Rasi + D9, planet table (flags, nakshatra, pada syllable, pada + star/sub/sub-sub), Vimshottari list with PL's controls, header, provenance | ✅ 2026-10-17: PL 9 screenshot reproduced (9/9 planets to the second, 10/10 lords, D9, flags, 10/10 dates); 16-chart export parity pending |
| 2b ✅ | Page 1 strengths | Strength table (dignity, SB%, SB#, VB, AV, Av3, Av5, K7, functional nature), Shad Bala bars, house-edge SAV + Bhava Bala labels | PL 9 screenshot values; PL exports of Shad Bala / Bhava Bala / Ashtakavarga / Vimshopaka detail pages |
| 3 | Vargas | Varga picker, all PL7 vargas incl. alternates and "Iyer" D11 | Unit fixtures from report; 16-chart printout parity; D11 §13 test 4 |
| 4 | Dashas | Interactive six-level tree + PL7 Antar view; year-length switch | 40/40 legacy dates; PL7 Pratyantar exports; 365.2421875 vs 365.25 drift test |
| 5 | Yogi points | Yogi/Avayogi/Duplicate Yogi card with derivation | ✅ built 2026-10-17 (Avayogi variants selectable); printout parity pending |
| 6 | Bhava chalit | Sripati + equal bhava tables and charts | ✅ built 2026-10-17; printout parity pending |
| 7 | Jaimini | Karakas, padas, upapada, karakamsha, drishti, argala, special lagnas | ✅ built 2026-10-17; K7 = PL 9; PyJHora cross-check on 34 charts; printout parity pending |
| 8 | Transits | Transit chart, scrubber, upcoming-transit list | ✅ built 2026-10-17; completeness proven by brute force; PL 7 cache consistent; export parity pending |
| 8b | Desktop installers | `Astro-Amriit Setup.exe` (Windows) and `Astro-Amriit.dmg` (macOS) built in CI from the same source; USB-stick install guide | ✅ config + CI + guide 2026-10-17; Linux build ran fully offline (`unshare -n`): boots, casts, saves. Pending: first CI run and offline Windows/macOS machines (checklist in reminders) |
| 9 | Parity audit and 1.0 | `parity/REPORT.md`, user guide, release note | All rows green or explicitly waived by you |
| 10 | Phase 2 kick-off | Your feature cull list; customisation backlog; Vercel; open-sourcing | — |

Parallel track (any time): import/export of GeoVision XML; places; themes; docs.

---

## 6. Evidence table (claim → mechanism → check) — living

| Claim | Mechanism | Check |
|---|---|---|
| Sidereal longitudes equal PL7 Lahiri to ≤1″ | PL7 polynomial, mean equinox, Swiss 2.10.03 | Cache test (Moon, Rahu); printouts |
| Cusps are PL7's | Placidus on geographic latitude | Printout cusp tables for 16 charts (Lapanga and Clinton stress the latitude convention) |
| Vargas match PL7 | Decoded routines as pure functions | Report fixtures; printouts |
| Dasha dates match PL7 | 365.2421875-day year, anchor once | 40 legacy dates; new Pratyantar exports; drift test at 60 yr |
| App works offline from one file | Vite single-file build, embedded WASM+data | Playwright opens `file://` with network disabled |
| No build silently drops code | Contract check + functional smoke | CI step on every build (v1.02 lesson) |
| UI usable without mouse, on a phone, in both themes | Semantic HTML, focus styles, tokens | Playwright a11y scan + manual walkthrough by Amrit |
| Nothing personal ships | Fixtures anonymised; no GeoVision data in `kaast2/` | Pre-publish scan script (§10) — ✅ clean; denylist derived at run time from the private chart collection |
| Page 1 matches PL 9 | PL 9 profile + Page 1 view-model | `tests/engine/pl9_page1.test.ts` (Amitabh Bachchan screenshot) ✅ |
| Dasha year is 365.2421875 in PL 9 too | 76-year walk to 2018 | 10/10 dates; 365.25 gives 5/10 ✅ |

---

## 7. Decisions needed from the boss (defaults applied if you say "go")

**Recorded 2026-10-17 (session 2):** the boss said "start with default slices", so every
default below is now in force, except D2 (Page 1 arrived: a PL **9.0** screenshot) and D5
(revised by evidence, see the D5 row). The Iyer D11 definition is still outstanding.

| ID | Question | Default if silent |
|---|---|---|
| D1 | App and folder name. Proposal: **KAAST 2** ("Karar Ashram Astrology Software"), folder `kaast2/` | **Decided 2026-10-17: the app is called "Astro-Amriit"** (boss). Folder `kaast2/` stays as the internal codename until publication |
| D2 | Send a screenshot/PDF of your PL7 "Page 1" and the definition (or source) of the "Iyer Cure" D11 | **Page 1 received** (PL 9.0 screenshot, transcribed in `kaast2/tests/fixtures/pl9_page1_amitabh.json`); Iyer D11 still open — placeholder = PL alternate until defined |
| D3 | One TypeScript engine (tests use Python only as an oracle) instead of Python+JS twins | One TS engine (ADR-1) |
| D4 | Chart style: **East Indian, exactly the Kala Chakra 1.5 layout** (decided by Amrit 2026-10-17); North/South Indian offered only as optional views | East Indian, Kala Chakra geometry |
| D5 | ΔT default: PL7 curve for parity, "modern" switch visible | **Revised:** the boss uses PL 9, so the default profile is *PL 9* (Swiss ΔT); the PL7 curve lives in the *PL 7* profile. PL 9's modern-date ΔT is settled by export-procedure Test 5 |
| D6 | You run the PL7 export afternoon (§4.3) before slice 2 | Yes |
| D7 | Replicate PL7's Krishnamurti ayanamsas as options | Yes (cheap, decoded) |
| D8 | Avayogi / Duplicate Yogi conventions if PL7 printouts stay ambiguous | Textbook: 6th nakshatra lord / sign lord |
| D9 | Licence of the public repo: AGPL-3.0 (forced by Swiss Ephemeris unless a commercial licence is bought) | AGPL-3.0 |
| D10 | Desktop installers: unsigned builds (free; one-time OS warning) or signed builds (Apple developer account ≈ US$99/yr, Windows certificate) | Unsigned, with a USB install guide |

---

## 8. How we work: the company

| Role | Who | Responsibility |
|---|---|---|
| Boss / product owner | Amrit | Approves decisions, supplies PL7 exports, judges every slice in the browser |
| Programme lead | Claude (main session) | Keeps PLAN/ARCHITECTURE true, briefs the specialists, integrates, reports |
| Domain researcher | sub-agent | Decodes remaining PL7 rules from binary/manual; writes fixtures; never guesses |
| Engine engineer | sub-agent | Pure TypeScript calculation modules + unit tests |
| UI/UX designer | sub-agent (design skills: `anti-ui-slop`, `frontend-design`, `ui-ux-pro-max`, `design-system`, `dataviz`) | Design contract, tokens, chart SVG system, states |
| Frontend engineer | sub-agent | Components, state, accessibility, single-file build |
| QA / parity engineer | sub-agent | Oracles, Playwright, parity report |
| Release / DevOps | sub-agent | CI, versioned builds, Vercel config, pre-publish scan |
| Technical writer | sub-agent | User guide (EN, later Odia), CHANGELOG, knowledge updates |

**Standing brief format** (guide ch. 27.8), used for every task handed to a
specialist: purpose · scope · files · constraints (invariants) · acceptance
examples (ordinary, empty/invalid, failure) · evidence to return · "do not
publish or deploy".

**Deepening protocol (run before every critical task).** Before starting any
slice, engine change, oracle design, or release, the lead answers these four
questions in the slice brief and rewrites the task accordingly:

> I want a deeper version of this task, not a bigger one. Before rewriting it:
> (1) say what a top professional in this field would do here that I'm not
> asking for; (2) name the rawest material they would start from instead of
> what has already been digested for me; (3) name the specific methods and tools
> they would use; (4) say what, other than you or me, would show the result is
> right. Then rewrite my prompt to ask for exactly that.

Applied to this plan itself, the answers were: (1) a professional would not trust
the report's inferred items and would build the oracle before the UI; (2) the
rawest material is PL7's own printouts and its transit cache, not the report;
(3) Swiss Ephemeris, PyJHora as independent oracle, Rizin for any remaining
decoding, Playwright for build verification, a field-by-field parity script;
(4) the parity report over 16 charts and the cache test over 348 months.

---

## 9. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| PL7 printouts carry the Moon-vector planet error | Planet parity impossible against that copy | §13 test 1 first; if present, planets are judged against Swiss and only Moon/nodes/cusps against PL7 — stated in the parity report |
| "Page 1" and "Iyer D11" undefined | Slices 2–3 stall | D2 asked now; placeholders clearly labelled |
| Scope creep (PL7 has 31 vargas, 20 dashas, Jaimini, matching…) | Never reaching parity | Phase 1 list is closed; everything else goes to the Phase 2 backlog |
| Single-file size (WASM + data ≈ 2.7 MB base64 ≈ 3.7 MB) | Slow load | Same as today's 1.5 apps; acceptable; Vercel build serves files separately |
| Licence: Swiss Ephemeris AGPL | Public repo must be AGPL | D9; non-commercial family use is fine |
| Personal data in the repo (1 559 charts incl. family births; proprietary PL7 installation) | Must never go public | §10 cleanup before any public push; fixtures anonymised |
| Build drops code silently (happened in v1.01) | Broken release | Contract check + Playwright smoke in CI |
| Odia text pipeline later | Rework | Keep all user-visible strings in one dictionary from slice 0 |
| Unsigned installers trigger OS warnings (Windows SmartScreen; macOS Gatekeeper "unidentified developer") | Internet-phobic acquaintance cannot install | Document the right-click → Open / "More info → Run anyway" steps in the USB guide; optional later: Apple notarisation (needs a paid developer account) and a Windows code-signing certificate — a boss decision (D10) |

---

## 10. Reminders from the boss (standing)

1. **Share the books "New Techniques of Prediction"** (H. R. Seshadri Iyer, vols. I–II) — not done yet.
   When shared, the technical writer lays down every rule in those books in one
   reference file (`kaast2/docs/iyer_rules.md`: rule → source page → inputs →
   outputs → worked example), so they can be added to the app in Phase 2. Very
   likely these books define the "Iyer" D11 (Rudramsa) and the Yogi / Avayogi /
   Duplicate Yogi conventions (§3.3, §3.4), so they also close two OPEN items.
2. **Amrit has rough UI design ideas** — collect them (sketches, photos of
   sketches, or words) before the UI/UX designer writes the design contract in
   slice 0/2. A `kaast2/docs/design/IDEAS_FROM_BOSS.md` file will hold them.
3. **Chart layout is East Indian, exactly as Kala Chakra 1.5** — carried into D4 and §3.2.
4. **Build Windows `.exe` and macOS `.dmg` installers** so the app can be installed on devices with no internet at all (an acquaintance uses no Wi-Fi and no mobile data). Carried into §3.10, slice 8b, D10 and ADR-9. Distribution: USB stick with the installer, a checksum file and a one-page install guide.

5. **Deferred by the boss until the build is complete (2026-10-17):** run
   `kaast2/parity/PL7_EXPORT_PROCEDURE.md` on Windows. Open items it settles,
   in priority order:
   - Step 0: exact PL version (Help → About); is PL 7 still used at all?
   - Test 5: PL 9's Delta-T for modern dates (Swiss vs PL7 curve; Moon 10″ apart).
   - Placidus for intermediate cusps in PL 9 (only the ascendant is confirmed).
   - Tests 2–4: KP ayanamsa on the KP printout; Rahu true/mean option; D11 rule.
   - Test 1 (Moon-vector planet error) only if PL 7 is still used.
   - 17-chart parity set (5 public + 12 family) — confirm 17 vs 16 and Clinton at 33°40′N.
   - Strength pages (Shad Bala, Bhava Bala, Ashtakavarga, Vimshopaka) for slice 2b parity.
   - Avayogi / Duplicate Yogi convention; arudha exception for the lord in the 7th.
   - PL's exact nakshatra spellings and pada syllables (unless decoded from the binary first).
6. **Installer proof (when the build is complete):** run the `kaast2-desktop` workflow by hand; try the Windows Setup on an offline Windows 10 VM without WebView2 and on Windows 11; the `.dmg` on an Apple Silicon and an Intel Mac (first-open flow); a 1366×768 laptop; checksums per the USB guide.
7. **GitHub Actions does not start jobs on this repository** (2026-10-17): the
   CI workflow now parses (an unquoted ": " had made every earlier run a
   parse failure), but its job ends in 2 s without a runner and without a log
   — an account-level block (typically Actions minutes or spending limit for
   private repositories, or Actions disabled). Local CI (`npm run ci`) is
   green. The boss checks GitHub → Settings → Billing / Actions; the desktop
   installers also need Actions.
8. **Still owed by the boss:** the "Iyer Cure" D11 definition (or its source);
   the "New Techniques of Prediction" books (reminder 1).

## 11. Reminder for the end of Phase 1: going public

When parity is reached and Phase 2 customisation is agreed, we will:
1. Create a **new public GitHub repository** containing only `kaast2/` (app, tests, docs, anonymised fixtures), the sanitised `knowledge/` files, PLAN.md, ARCHITECTURE.md, LICENSE (AGPL-3.0), README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY.md, issue templates, CI.
2. **Never publish**: `Astro_Fork/GeoVision/PL7/` (proprietary software and manual), `GeoVisionCharts/` (real people's birth data), the family workbooks (`RA Job.xlsx`, `Horary Artifacts.xlsx`, `Solar Fire Gold Charts.xlsx`, `Testing/`), the father's scanned tables, screenshots with personal data, `Documentation/record/`.
3. Run a pre-publish scan (script in `kaast2/scripts/prepublish_scan`) for names, coordinates, JDs from the private corpus, API keys, and absolute paths.
4. Archive this private repository as the family's research record; the public repo starts with a clean history (no rewriting of the private one).
5. Write the external-audience README: what the app is, who it is for, how to run the single HTML, how to deploy to Vercel, how to cite PL7 and Swiss Ephemeris, and what is intentionally not included.

---

## 12. Session log

- **2026-10-17** — Boot from CLAUDE.md/knowledge; absorbed the PL7 report and open items; inventoried GeoVision (1 559 input-only charts; 436 cache months); read the guide's method chapters; wrote PLAN v0.1 and ARCHITECTURE v0.1. Boss decided: East Indian chart layout as in Kala Chakra; share the Iyer books later; Windows and macOS installers for fully offline devices; next session starts from the prompt in CLOUD_HANDOFF.md. No app code yet. Next: boss answers D1–D9; slice 0.
- **2026-10-17 (session 2)** — Boss: "start with default slices", UI left to the team, Page 1 = PL 9.0 screenshot. Applied defaults D1–D10 (D5 revised). Found the boss's program is PL 9 and that PL 9 = Swiss Ephemeris + PL Lahiri polynomial + mean equinox + true node + geographic latitude for houses (Asc +4″ vs +198″ geocentric; Placidus still assumed from PL 7, needs a cusp printout), seconds rounded, dasha year 365.2421875, war-time zone honoured (Amitabh 1942 chart: 9/9 planets to the second). Shipped slices 0, 1, 2a as `kaast2/dist/KAAST 2 v0.1.html` (61 engine/unit tests, 5 e2e, contract check, scan). Specialists: domain researcher (Page 1 strengths spec), technical writer (`kaast2/parity/PL7_EXPORT_PROCEDURE.md`, 17 charts + Test 5 for ΔT). Next: slice 2b (strengths).

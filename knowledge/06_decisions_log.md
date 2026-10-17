# 06 · Decisions log (chronological, with rationale)

Append a dated entry whenever a session changes rules, constants, or
architecture.

## 2026-07-04 — Star/sub engine & annotator
- **Compute the KP table, don't store it**: the 249 subdivisions follow
  from the 9 Vimshottari years (each year = 400″ of a nakshatra). No
  lookup file to transcribe; the scanned PDF became a validator only.
- Integer-arcsecond arithmetic everywhere → exact boundaries.
- Excel writes must be surgical: openpyxl preserves images but **drops
  line/connector shapes** (the East Indian chart!). Built XML-level cell
  writers (Python + JS); only changed cells rewritten.
- Zero-install policy for non-coders → single-file HTML apps (JSZip +
  engine inlined). "KP Annotator" drag-and-drop shipped.
- Corpus audit found 3 manual slips (user confirmed); tool doubles as an
  error checker.

## 2026-07-05/06 — Full pipeline, powers, apps, repo
- Decoded the **power calculation** from Guide_Step6 + Sheet2 example;
  found the B44 typo (star ownership = power 3). Validated 27/27.
- Span rule for cuspless signs confirmed by user (Yale chart).
- Excel end-to-end (`kp-build`) uses the user's own Guide_Step2 sheet as
  template, extracted at zip level to keep its 12 line shapes.
- Kala Chakra app: SF-report paste → full results; East Indian SVG;
  superscript powers; 4-step power display per the father's fraction
  notation; Excel download via embedded template.
- Repo restructured to src-layout package `kala-chakra`; GitHub-ready;
  LaTeX methodology doc in docs/ (romanized title — no Odia font in TeX).

## 2026-07-07 — Ephemeris independence
- Solar Fire is closed-source BUT uses Swiss Ephemeris internally
  (settings screenshot) → replicate with pyswisseph/WASM.
- Calibrated from 10 SF reports: ayanamsa +1.251″; SF ΔT anchor curve
  (obsolete extrapolation, 87 s by 2026); geocentric-latitude correction;
  SF's displayed ayanamsa includes nutation (cosmetic only).
- `kp-cast` shipped (80/80 planets ≤1″). Two modes: `sf` clone vs
  `modern` (better ΔT). Decision: default `sf` for continuity.
- Per-machine atlas drift discovered → places gazetteer with canonical
  coordinates (+ localStorage custom places) in the apps.

## 2026-07-07/08 — KAAST (Advanced_Setup) & corpus validation
- Browser casting via `swisseph-wasm` npm package; its 12 MB data blob
  trimmed to 2.1 MB (dropped asteroid-name catalogue) by rewriting the
  emscripten package manifest; glue patched for classic scripts + node.
- Branding: KAAST — Karar Ashram Astrology Software, "by Swami
  Yogeswarananda Giri"; "Location"→"Place"; adaptive per-region SVG fonts
  fix overflow; centre shows exact lat/lon.
- Corpus validation (45 labeled charts): engine exposed 15 label errors
  (D/M swaps, a year typo, second-level slips) — charts themselves fine.
  404/405 planets ≤1″.
- Rule: new app versions are new files (v0.95 kept, v0.96 added).

## 2026-07-08 — Dasha + fixes
- Vimshottari dasha decoded to PL-7 convention (365.25-day years);
  40/40 PL dates exact; `dasha.py`/`dasha.js`; v0.96 apps add the dasha
  card (5-level chain, pratyantar table, upcoming changes).
- **Bug fixed**: upcoming-pratyantars must anchor the timeline once at
  the chart moment and walk periods structurally; re-anchoring at future
  moments repeats the same chain with drifting dates.
- PL engine research: PL7 in-house engine, PL9 Swiss Ephemeris; moot for
  dashas (Moon-only arithmetic).
- Security stance (father's concern): browser JS can't be truly secret;
  plan = private distribution + optional password-encrypted build (AES),
  optionally compile KP rules to WASM; server-side only if ever
  semi-public. Deepest secret (interpretation) was never in code.
- Knowledge base (this folder) created; AGENTS.md/CLAUDE.md bootstrap.

## 2026-07-08 (later) — v0.97: chart geometry + prana table
- **Chart layout is now geometry-aware** (app shell v0.97): each text row
  computes its safe x from the corner diagonal at that row's own height
  (`REGION` map + `xdTL/xdTR/xdBL/xdBR` in `app_shell_v097.html`), with a
  two-pass per-row font fit. Fixes entries crossing diagonals
  (Aq/Sg/Vi collisions seen by the user's father). Right-side triangles
  (Aq, Sg) are end-anchored at the box edge.
- **Prana table added** (both apps v0.97): `upcomingPeriods/upcomingPranas`
  in dasha.js + `upcoming_periods/upcoming_pranas` in dasha.py — next 12
  five-level periods (Maha-Antar-Pratyantar-Sookshma-Prana) with
  dd-mm-yyyy hh:mm boundaries; periods tile exactly; same anchor-once rule.
- Gotcha fixed: `H` identifier collision in chartSvg (renamed BH).
- Dasha regression still 40/40; layout verified overflow-free on the
  user's sample chart and a 7-entry crowded-triangle stress test.

## 2026-07-08 (later still) — v0.98: five-level lord chains
- Tables now show [Star / Sub / Sub² / Sub³ / Sub⁴] for every cusp and
  planet (father's request). New engine functions: `sub_lords`/`sl_chain`
  (kp_core.py) and `subLords`/`slChain` (kp_logic.js) — recursive
  Vimshottari subdivision, each level starting from its parent's lord.
- Precision: deeper spans are not whole arcseconds; offsets are rescaled
  x120 per level so boundaries stay exact integers (depth 5 ~8.3e10,
  inside 2^53). Validated: levels 1-2 identical to star_and_sub on 5,000
  random points; nakshatra-start invariant; JS-Py parity exact.
- Display change is tables-only: chart diagram, SF-report download and
  Excel outputs keep the classic Star/Sub annotation (per "no other
  edits").

## 2026-07-08 (v0.99) — lord colour highlighting
- Star lords render deep green (#1c7a4b, bold) and sub lords crimson
  (#b02748, bold) consistently across cusps and planets — in the tables
  (`slChainHtml` span classes .sl-star/.sl-sub) AND in the chart diagram
  (`svgSl` tspans). Sub²–Sub⁴ stay plain ink. Shell-level helpers only;
  no engine change.

## 2026-07-08 (v1.00) — horizon-based pratyantar outlook
- "Upcoming pratyantar changes" switched from a fixed 6 rows to a
  HORIZON rule: show every pratyantar beginning within 8 months
  (244 days) of the chart moment (`upcomingPratyantarsHorizon` /
  `upcoming_pratyantars_horizon`, default 244d). Fast antars (Su/Mo/Ma)
  now show ~9-13 rows, slow ones ~5, coverage always >= the horizon
  (horary astrologers need >= 6 months visibility; 8 chosen as buffer).
- Feature-complete milestone: version jumped to v1.00.

## 2026-07-09 (v1.01) — iOS seconds, event check, quote banner
- **iOS fix**: `<input type=time>` on iPhone/iPad never offers seconds
  (Safari limitation). Added a small "ss" box beside every time input;
  rule: seconds from the time value if present, else from the box
  (`timeParts` helper). Applies to chart time and event time.
- **Event check (optional card)**: user notes + approximate event
  date/time -> prana periods ±2 days around the event with hh:mm,
  running prana highlighted. Computed via `pranasInWindow` /
  `pranas_in_window` — anchored at the HORARY CHART moment, never at the
  event. GROUND-TRUTH VALIDATED: SG chart's real outcome (letter
  15-02-2023 08:47) reproduces dad's manually noted chain Ve-Ke-Ra-Ju-Ve
  in both engines. (A re-anchored chain gives the wrong Sookshma —
  the anchor-once invariant matters.)
- **Quote banner**: `quotes.js` array; random pick per open; italic
  banner under the header with length-adaptive font size and optional
  attribution. Only verified transcriptions included (1 Odia quote from
  the user + 1 clearly legible English line, Gurudev/Puri 20.06.2025);
  handwritten notebook pages NOT guessed — waiting on verified text.

## 2026-07-26 (v1.02) — build-defect fix + functional test gate
- v1.01's app shell was missing the `timeParts`/quote-banner script block:
  the patch anchor silently failed to match (double newline from an
  earlier version's insertion), so the CASTER worked but Kala Chakra
  threw "Can't find variable: timeParts" and showed no quote. Fixed in
  v1.02 by anchoring the insertion at the main script's "use strict".
- LESSON / new practice: string-patch builds now get (a) a CONTRACT
  check — every used helper symbol must be defined in the built file —
  and (b) a jsdom FUNCTIONAL smoke test that loads the real dist HTML,
  verifies the quote renders on open, helpers exist, and clicking
  Calculate yields a validation message rather than an exception.
  Syntax checks alone cannot catch a silently-missed insertion.

## 2026-07-26 (v1.5) — Deha dasha (sixth tier) + quote refresh
- **Six-tier hierarchy**: Deha = sub-Prana (same recursive Vimshottari
  rule; LEVEL_NAMES gained "Deha"). New generic engine fn
  `periodsInWindow` / `periods_in_window` (depth param; 5 = Deha);
  existing prana functions untouched.
- **End-of-page Deha section** (both apps, LAST card): 6-level running
  chain; deha table spanning EXACTLY the "Upcoming prana periods"
  window (~103 rows for 12 pranas); plus a deha view of the event-check
  window (same ±2 days, second click-listener on ev_show — the existing
  handler is unmodified). Same bold/highlight formatting.
- Validated: chain6 prefix = chain5; deha tables tile and share the
  prana window boundary exactly; every deha nests in its displayed
  prana; SG ground-truth event deha = Ve-Ke-Ra-Ju-Ve-Ve; JS-Py parity
  (103 rows both).
- **Quotes**: English quote corrected to "(That) which is lotted cannot
  be blotted"; attributions/dates removed (plain quotes only); three
  verified Odia quotes added (5 total).

## 2026-07-26 (v1.5, addendum) — max-power highlight
- In every FINAL merged power line (results table, step 4, summaries),
  the base(s) with the highest total power are highlighted — ties all
  marked. Colour-blind-friendly: Okabe-Ito-style orange (#b25000) PLUS
  bold and a pill background, so the cue is never colour alone
  (.pw-max class; powersHtml computes the max). Intermediate collect
  steps stay plain.

## 2026-07-28 — Odia edition + full documentation bundle
- **Kala Chakra v1.5 (Odia)**: complete UI translation (labels, tables,
  dasha level names, sign/planet display names in Odia; lord codes and
  KP notation kept in Latin as family convention); built from
  `app_shell_v15_od.html` via `build_v15_od.py`; jsdom-verified.
- Quote store: karma/dharma quote replaced with the user's exact wording
  (near-duplicate variant removed).
- **Documentation/** created: conversation record (verbatim prompts +
  32 archived images + reconstructed reasoning), bilingual Doc 1
  (journey + from-scratch KP guide + methods incl. SF-vs-modern and
  deha trust argument), bilingual Doc 2 (luddite guide with drawn
  annotated figures + shot list for real screenshots), APP_DOCUMENTATION
  spine per app-documentation-audit skill, six audit CSVs + unresolved
  items. Coverage declared complete for accessible artifacts.
- Screenshot capability: headless Chromium not installable in sandbox;
  figures are honest drawn diagrams (PIL), swap-in shot list provided.

## 2026-07-29 — v1.5 final polish: Puri + full-Odia rendering
- Gazetteer: **Puri (Karar Ashram)** added (19.7944N 85.8189E, tz 5.5)
  in places.js — appears in ALL v1.5 apps (EN, Odia, Caster; rebuilt).
- Odia app now renders **everything** in Odia per the user's vocabulary
  workbook ('Odia Text Sample.xlsx' — authoritative spellings):
  Odia numerals everywhere (results only; inputs untouched), planet
  SHORT forms in chains (ର ଚ ମ ବୃ ବୁ ଶୁ ଶ ରା କେ — unique set), FULL sign
  names everywhere incl. inside longitudes (signs never abbreviated —
  user rule: sign shorts collide with planet shorts, e.g. ମ, ବୃ).
  Implemented as a post-render text-node transformer `odiaify` (results
  container + event/deha cards via a third ev_show listener); Excel
  download keeps Latin notation.
- Vocabulary fix: Jupiter ଗୁରୁ → **ବୃହସ୍ପତି** per the workbook.
- Regex gotcha: sign codes followed by digits (26°Le13') have no \b —
  solved with a °-anchored pattern; lookbehind avoided deliberately
  (older iPad Safari cannot parse it). 7/7 unit cases + DOM-level check.

## 2026-10-17 — Parashara's Light 7 reverse-engineering study
- Binary analysis (REA + Rizin) of PL7 plus numerical checks of its
  transit cache against the Swiss Ephemeris; LaTeX report at
  `Astro_Fork/PL7_Reverse_Engineering_Report/main.pdf`.
- Findings: own ephemeris precise to end 2048 (silent fallback after);
  default Lahiri = Swiss Lahiri ±0.3″ (1.4″ from KC `sf`); Placidus
  houses, probably on geographic latitude; true node, mean equinox;
  ΔT ≈ 83 s in 2020, +0.89 s/yr.
- **Correction**: the PL7 dasha option labelled "365.25" uses
  365.2421875-day years (`fcn.00464743`). The 2026-07-08 entry's
  "365.25-day years" describes KC's rule, not PL7's. The 40/40 match
  stands because the validated dates lie within ~2 years of the chart.
- This installation's planets carry a Moon-vector reduction error of up
  to ~10′ (measured in the transit cache; natal inferred); Moon, nodes,
  cusps and dashas unaffected.
- **No code changed**; KC keeps 365.25-day years. Knowledge files 00,
  01, 03 and 05 updated.

## Open threads / roadmap
- Optional: password-encrypted app build (~1 h of work, agreed approach).
- Optional: auto-correct the label errors in Testing/ as `_corrected`
  copies (user hasn't asked yet).
- Optional: Tauri desktop wrapper; parsers for other astrology programs.
- Pending: verified transcriptions of the remaining handwritten Odia
  quotes (notebook photos) to extend quotes.js.
- Dasha in Python Excel pipeline (`kp-build` doesn't print dasha yet —
  only the apps show it; Python dasha.py has full API incl. pranas).

## 2026-10-17 (later) — KAAST 2 planned: a PL7-parity app built from scratch
- New project decided by the user: an open-source, offline single-file app
  whose DEFAULT profile is Parashara's Light 7 (Placidus on geographic
  latitude, PL7 Lahiri polynomial, true node, mean equinox, PL7 ΔT curve,
  365.2421875-day dasha year), with the Solar Fire profile kept as a second
  constant bundle. Scope Phase 1 = parity on: Page 1, vargas (D6 D8 D9 D10
  D11×2 D24 + all others), Yogi/Avayogi/Duplicate Yogi, Vimshottari to Deha
  with an interactive tree, Jaimini, bhava chalit, transits.
- Plan and architecture written at repo root: `PLAN.md`, `ARCHITECTURE.md`.
  Target folder `kaast2/` (working name KAAST 2), TypeScript + Vite + Preact,
  ONE engine (ADR-1: Python only as a test oracle — a deliberate departure
  from invariant 9 for the new app; Kala Chakra 1.5 itself is unchanged).
- User rulings: chart layout = East Indian exactly as Kala Chakra 1.5
  (ported geometry); the Iyer books "New Techniques of Prediction" will be
  shared later and their rules catalogued for Phase 2.
- Oracle strategy: PL7 printouts to be produced by the user on Windows for a
  16-chart parity set (GeoVision XMLs hold inputs only); PL7 transit cache
  (Moon/Rahu, 348 months) as automatic ΔT/ayanamsa test; decoded rules as
  fixtures; PyJHora as independent cross-check.
- No engine code changed in this session.

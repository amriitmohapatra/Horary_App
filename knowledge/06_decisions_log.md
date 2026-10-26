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
- Addendum: the user also wants Windows (.exe) and macOS (.dmg) installers
  for devices that never connect to the internet → Tauri 2 wrapper around the
  same web build (ADR-9), slice 8b, decision D10 on code signing.

## 2026-10-17 (session 2) — KAAST 2 slices 0, 1, 2a; the boss's program is PL 9
- Boss: "start with default slices"; UI left to the team; Page 1 reference =
  a **Parashara's Light 9.0** "Birth chart I" screenshot (Amitabh Bachchan,
  11 Oct 1942 16:00, Allahabad). Defaults D1–D10 applied; D5 revised (below).
- **PL 9 decoded from that one screen (NUM):** Swiss Ephemeris positions,
  PL Lahiri polynomial, mean equinox, true node → all 9 planets equal to the
  displayed second; residuals −0.5…+0.3″, so PL 9 **rounds** seconds (KC
  truncates). PL's atlas applied **India war time UTC+6:30** (1942-09-01 –
  1945-10-15); with +5:30 the Moon is off by 35′. Ascendant +4″ with
  geographic latitude vs +198″ with geocentric → **geographic** latitude for
  houses. Placidus is not testable from the ascendant (still BIN from PL 7).
  Dasha: **365.2421875-day years 10/10** dates 76 years out; 365.25 gives 5/10.
  No Moon-vector planet error in PL 9 (at least for 1942).
- Open for PL 9: ΔT for modern dates (Swiss 69 s vs PL7 curve 87.5 s in
  2025 → Moon 26″ vs 36″ in Sg 29°42′ on 2025-01-01 0h UT) — Test 5 of
  `kaast2/parity/PL7_EXPORT_PROCEDURE.md`.
- **PL 7 profile reproduces PL 7's own transit cache**: 1392 samples
  2020–2048, Moon ≤0.06″, Rahu ≤0.76″, using DELTAT.ASC (1800–1993) then a
  line to 83.0 s at 2020.0 and +0.89 s/yr. (Cache files from 2049 on hold the
  approx.dat fallback and are excluded; JD cut-off 2469442.5.)
- KAAST 2 profiles: `pl9` (default; ADR-10), `pl7`, `solarfire` (KC 1.5,
  still 80 planets ≤1″ / 120 cusps ≤12″ on the 10 SF charts).
- East Indian geometry ported from KC 1.5 with three refinements needed at
  Page 1 font sizes: bisection font fit (KC's two-pass estimate oscillates),
  baseline + cap-height row check, vertical budget per region.
- Scope change: Shad Bala, Bhava Bala, Ashtakavarga, Vimshopaka, avasthas,
  karakas and functional nature are IN Phase 1 because PL 9's Page 1 shows
  them → slice 2b. The house-edge numbers on PL's Rasi chart are SAV bindus
  (sum 337) and Bhava Bala.
- Fixture hygiene: the Solar Fire reference fixture copied into kaast2 had
  private chart titles → anonymised to SF01–SF10 (JDs kept). The pre-publish
  scan derives its name denylist at run time from the private GeoVision
  collection, so no list of names is stored in kaast2/.
- Shipped `kaast2/dist/KAAST 2 v0.1.html` (4.0 MB, offline). Kala Chakra 1.5
  and its engines are unchanged.

## 2026-10-17 (session 2, later) — Astro-Amriit; vargas decoded; comfort design
- **Name:** the boss renamed the app **Astro-Amriit**. The folder `kaast2/`
  stays as the internal codename while slices are in flight (and becomes the
  root of the public repository at publication anyway). Chart file format id
  `astro-amriit-chart`; files saved as `kaast2-chart` still open.
- **Vargas (slice 3):** all 31 PL varga positions decoded from PL7.exe
  (dispatcher `fcn.0057d9cf`, jump table 0x57db65, divisors at 0x5f47b8).
  Corrections to the PL7 report: D2 (Leo/Cancer hora) and D2-alt2 have their
  own routines; seven alternates are plain cyclic; D150 is plain cyclic, not
  the Chandra Kala Nadi rule. PL-only rules (no PyJHora equivalent): D2-alt2,
  D16-alt, D11-alt. **Boundary convention (lead decision):** every amsa is
  half-open [from, to) on the rasi longitude (invariant 1); PL's float code
  differs only for points exactly on a boundary (D2 at 15°, D30 limits,
  exact 360°, D45's 1.50000000015 factor) — not reproduced, documented.
  Still to confirm on PL 9 printouts; the labels of positions 22–31 are
  descriptive stand-ins.
- **Page 1 strengths decoded** (docs/spec/PAGE1_SPEC.md): 145 PL 9 fields
  reproduced by the Python oracle with 0 mismatches. PL-specific conventions
  required by the fixture: shadbala sunrise = instant Asc = Sun (centre, no
  refraction); PL's own cheshta rule; Raman's saptavargaja values and
  required totals; Equal-house bhava centres for Bhava Bala; Av5 label order
  Dead/Old/Adoles./Youth./Infant; Vimshopaka fits shadvarga. OPEN: Ketu VB
  (9.1 vs 14), Rahu AV rule, nodes' functional nature rule.
- **PL chart files:** BirthDate is the local-clock JD; west-positive
  longitude and zone; war time stored as DST = 1; ASCII or UTF-16 BOM. All
  1560 files of the private collection parse.
- **Comfort design:** Light / Dark / Warm night themes, all pairs ≥4.5:1
  (body 12–15:1, no pure white/black), text size setting, SVG icons, 44 px
  touch targets; chart labels measured with the real font; an e2e geometry
  test guarantees no label crosses a chart line.

## 2026-10-17 (session 2, end) — Astro-Amriit v0.2: every Phase 1 slice built
- Shipped `kaast2/dist/Astro-Amriit v0.2.html`; 616 unit/engine tests, 24 e2e
  on the shipped file (geometry, axe WCAG 2.1 AA in three themes, offline).
- **Sunrise convention of PL = the Sun's centre with no refraction** (the
  instant the Sun's sidereal longitude equals the ascendant; Swiss
  BIT_HINDU_RISING). Established independently twice: the PL 9 strength
  fixture (hora lord) and PL 7's own Pranapada export (manual p. 130). Used
  for Shad Bala, special lagnas and the panchanga vara.
- Transits: search proven complete (bounded motion + brute force); events
  defined on the profile's integer arcsecond; stations follow the chart's R
  flag (tropical speed) — the sidereal turning point differs by up to ~32 min
  for Saturn (OPEN whether PL users expect the sidereal definition). Swiss
  true node has joints every 27.55 d (handled). Range 1800-01-02 … 2400-01-01.
- Yogi: Yogi point + 186°40′ lies in the 15th nakshatra from the Yogi's,
  whose lord equals the 6th's — the "6th nakshatra" textbook rule gives the
  same planet. Sripati: PyJHora's chart method 3 uses madhyas as house
  beginnings; Astro-Amriit follows PL's tutorial (madhya = centre).
- Desktop: the Swiss glue is an ES module; the Tauri CSP forbids eval.
- ChartResult gained `mcDeg` (exact MC) for Sripati.
- v0.3 (same day): fixes from the user-guide pass (PL-file events kept in a
  store signal; war time for saved Indian places via coordinates; plain
  varga rules; readable provenance). CI workflow YAML fixed; GitHub refuses
  to start the job (account-level; see PLAN §10 item 7).

## 2026-10-17 (session 2, later) — seconds on iPhone; saved places
- **iOS drops seconds.** Safari's native `<input type=time>` offers only
  hh:mm on iPhone. Kala Chakra already had a separate seconds box, but the
  result line, chart centre, Excel time cell and event lines printed only
  the time input's hh:mm. Fixed in NEW files Kala Chakra v1.6 (app, Odia,
  Caster): every displayed time is hh:mm:ss built from both boxes. v1.5 is
  untouched. Engine unchanged (seconds were always used in the calculation);
  wasm suite 0 failures, RA Job 130 passed.
- **Astro-Amriit v0.4:** no native time picker at all — three numeric boxes
  (Hours/Minutes/Seconds) that auto-advance, so `160037` typed on a phone
  keypad gives 16:00:37. Latitude/longitude accept degrees-minutes-seconds
  (`20 15 30 N`, `85°50′E`). Saved places get a manager in Settings
  (add/edit/delete, export/import JSON) because browser storage is per
  device; war time applies to saved places inside India. Phone overflow at
  320/390 px fixed on all pages and locked by an e2e test.

## 2026-10-17 (session 2, later) — Astro-Amriit v0.5: KP page
- PL's "Krishnamurti" (manual pp. 56, 205): Placidus cusps, ascendant =
  beginning of house 1, no house numbers on signs; significator table =
  Occupants, Tenants(Occupants) (planets in the occupants' nakshatras),
  Owner (lord of the cusp's sign — NOT Kala Chakra's span rule),
  Tenants(Owner). Planet-wise A–D levels are textbook KP (STD).
- KP pages use the Krishnamurti ayanamsa regardless of the default (manual
  pp. 218–219, DOC); app default 'auto' = pl_krishnamurti for PL profiles,
  the profile's own Lahiri for Solar Fire / Kala Chakra (family practice).
  Which of PL's two KP ayanamsas PL 9 uses on screen: OPEN (Test 2).
- Kala Chakra's power calculation is untouched and stays in Kala Chakra;
  the two significator notions are deliberately separate.
- Transit step gained 1 week.

## 2026-10-17 (session 2, later) — Astro-Amriit v0.6: NTP (Iyer) page
- Source: Iyer, New Techniques of Prediction I–III, in `references/NTP/`
  (private; text, OCR, page PDFs). Rule catalogues with PDF-page citations:
  `references/NTP/notes/ntp1_rules.md`, `ntp2b_rules.md`, `ntp3_rules.md`;
  NTP-2 ch. I–II read by the lead directly.
- Settled by Iyer (DOC, page images checked): Duplicate Yogi = lord of the
  sign of the Yoga point (NTP-2 p. 5); Avayogi = the Yogi's one enemy, table
  NTP-2 p. 6 — identical to the app's 'sixth-nakshatra' variant; the sets of
  three are {Ke Mo Ju}, {Ve Ma Sa}, {Su Ra Me} (Vimshottari positions 1-4-7,
  2-5-8, 3-6-9). Iyer's Dagdha table (NTP-1 pp. 17–18) = the app's.
- Iyer's conventions used on the NTP page only: Sripati bhavas with cusp =
  madhya; mean node (NTP-1 p. 101; switchable); aspects 7th + Ma 4/8, Ju 5/9,
  Sa/Ra/Ke 3/10, including conjunction; week day sunrise to sunrise.
- Oracles: Dasha chart "easy method" reproduces Chart 1 Guru Dasha exactly;
  Iyer's D-charts (his own D-11, D-16, D-30, D-45) match his Chart 1 table
  167/170 (3 book misprints, OQ-3/4); Mathematical Navamsha reproduces all 7
  worked examples.
- Deliberately not shown: death, widowhood, chastity and ganda readings.
- OPEN: Graha Samayam counting (inclusive assumed); the birth weekday
  convention for the Dasha chart; combustion orbs (Iyer gives none).

## 2026-10-17 (session 2, later) — Astro-Amriit v0.7: chart text fix
- Chromium snaps the font size of scaled SVG text to whole pixels unless
  `text-rendering: geometricPrecision`; label widths then varied with the
  chart's on-screen scale and the machine's font settings (5.280–5.301
  font-sizes measured locally; constant 5.2508 with geometricPrecision) and
  broke the canvas-based font fit on GitHub's runner. Chart text now uses
  geometricPrecision (invariant: chart layout must not depend on scale).
- Text-width cache entries are stored only once every font weight they use
  has loaded. v0.7 = v0.6 features + these fixes; CI green.

## 2026-10-24 — Astro-Amriit v0.8: Experimental, Matching, yogas
- Specs (research agents, binary + help files): `kaast2/docs/specs/`
  compatibility.md (PL 7 kootas, Mangala), pl_yogas.md/.json (1001 yogas,
  formula grammar), pl_worksheets.md (worksheet 14 columns, aspect graphs,
  conjunction, war), nandi_nadi.md (BNN research).
- Conjunction = same sign, no orb (PL-BIN); the app adds a "close" mark with
  an adjustable orb (default 3°, the boss's rule of thumb).
- Aspect matrix colour = compound relation of the aspected planet towards the
  aspecting one (sampled from the boss's PL 7 screenshot: 72/72).
- Node Func.: nearest planet in the node's sign, else the house (PL-BIN);
  replaces the dispositor rule; PL 9 fixture still 145/145.
- Kootas: A = bride, B = groom; PL's Tara one-way (3 for Janma/Sampat, else
  1.5) and Graha Maitri neutral–neutral = 1 are PL-BIN quirks, kept; one
  real PL 7.0.1 printout reproduced row for row (does not exercise them).
- PL 7 printouts carry the Moon-vector planet error (Sun 7'21" off for the
  boss's chart): worksheet parity is judged with PL's own positions where
  positions matter (Dominance).
- Yogas: PL evaluates on the Rasi only; other vargas are our labelled
  extension. Tokens without a settled meaning → "not evaluated", never guessed.
- Privacy: the boss's PL 7 worksheet values live in `private_oracles/`
  (git-ignored, never pushed; the oracle test skips without it). PL's own
  text (yoga definitions/results, compatibility quotations) is kept in
  separable files for the PLAN §11 review.

## 2026-10-24 (evening) — Astro-Amriit v0.9: KP (Research)
- Sources: Krishnamurti's six KP Readers (`references/KP/`, private, never
  published). Notes, rule catalogue (ids KP1-…KP6-) and example oracles in
  `references/KP/notes/`; synthesis `kaast2/docs/specs/kp_research.md`.
- "Readers mode" is the tab's default: KP New ayanamsa, mean node, 365¼-day
  dasa years — what recasting the Readers' charts shows they used. PL's
  Krishnamurti ("Automatic") and the chart's settings remain.
- Significators: Krishnamurti's five levels; level 5 = planets conjoined with
  or ASPECTED BY a significator (the aspected one gains; B4 p. 179). Node
  agency as in B6 (own house, star lord's houses, full sets of conjoined,
  aspecting and sign-lord planets); a planet in a node's star takes the node's
  set. Ownership by cusp sign only (no span rule). Reproduces B6's tables.
- Ruling planets: day lord sunrise to sunrise; reject in the star OR sub of a
  retrograde planet (B6 from p. 194); for rectification only the star
  (B6 p. 147). Nodes represent conjoined/aspecting RPs first, then the sign
  lord (B6 p. 254), and outrank them (p. 285).
- Horary: ascendant = start of the numbered unit; other cusps from the RAMC at
  which it rises at the judgement latitude (exact, where the Readers read
  Raphael's tables); planets, RPs and dasa of the judgement moment.
- Natal timing is presented as candidates: on 11 printed marriages the
  significator strength rank alone is only slightly better than chance.
- Guidance rules are data (`kaast2/src/engine/kp/guidance/*.json`) in a small
  condition language; policy test forbids death/longevity/accident/danger/
  disease words; a rate test removes rules holding for > 80 % of charts.
- Pre-publish scan stop words extended with generic English words that occur
  in private chart file names (election, interview, circus, verdict).

## 2026-10-26 — Astro-Amriit v0.10: world atlas
- Embedded atlas, no network: `kaast2/src/io/atlas/atlas.txt` (2.5 MB, 86 441
  places, 371 zones), generated by `kaast2/scripts/build_atlas.mjs` from
  GeoNames (CC BY 4.0, credited on Settings and in the footer). Selection:
  cities5000 worldwide + every Indian place with a population + every
  populated place in Odisha (GeoNames has population 0 for 546 000 Indian
  villages, so "towns down to 1 000" would have added almost nothing). Indian
  places carry English/historic names (Bombay, Allahabad, Calcutta …) plus a
  short hand list (Poona, Baroda, Cawnpore, Berhampur …). Single file 5.6 → 8.1 MB.
- Zones: outside India, offset and DST for the local date and time come from
  the browser's IANA database (Intl); DST = a whole hour over the year's
  smaller Jan/Jul offset, anything else folded into the zone. India keeps the
  PL-verified rule (IST; war time 1942-09-01 … 1945-10-14) because IANA's
  Asia/Kolkata follows Calcutta clocks (LMT before 1906, +6:30 Oct 1941 – May
  1942). OPEN for the user: pre-1906 Indian births — PL's own atlas (ACS)
  stored local mean time for some old charts (Agra 1861: 5:21; Nadia 1486:
  5:53); the app keeps 5.5 unless the zone is typed.
- No engine rule changed; the Python twin (kala_chakra) is unaffected.
- `scripts/pl_to_json.ts` converts a folder of PL `.xml` charts to app chart
  files with the app's own importer (personal output never committed).
- Pre-publish scan: the atlas is exempt from the private-name rule only
  (public place names such as Behera, Rath, Harvard collide with it).

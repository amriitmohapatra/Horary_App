# Changelog

Release-note style (what works · evidence · out of scope). One entry per shipped file.

## v0.11 — 2026-10-26 · `dist/Astro-Amriit v0.11.html`

Two fixes to the v0.10 place field, found while recording the video guide.

- **Typing is never rewritten.** When the text matched a saved or built-in
  place exactly, v0.10 filled its coordinates and rewrote the field with the
  trimmed name, which swallowed the next space: "New York City" became
  "New YorkCity". The coordinates are still filled in; the text stays as typed.
- **Built-in places outside India follow their zone.** London, New York and
  Singapore now carry their time-zone names, so daylight saving and historical
  clocks apply as for atlas places (London, July 1960 → zone 0 + DST).
  Places saved earlier keep the fixed zone they were saved with.

**Evidence** 816 unit/engine tests (+1: built-in zones); e2e +1 (typing
"New York City" key by key; fails on v0.10 with "New YorkCity", passes now);
contract check; pre-publish scan.

## v0.10 — 2026-10-26 · `dist/Astro-Amriit v0.10.html`

- **World atlas, offline.** The Place field now suggests places as you type:
  your saved and the built-in places first, then about 86 000 places from
  GeoNames (CC BY 4.0): every town of 5 000+ worldwide, every Indian place
  with a known population, and every populated place in Odisha. Each
  suggestion shows its state, country and coordinates; larger places first;
  accents ignored; a comma narrows by state or country (`Puri, Odisha`).
  Former names find renamed Indian cities (Bombay, Calcutta, Madras,
  Allahabad, Benares, Poona, Baroda, Trivandrum …). Keyboard: ↓/↑, Enter,
  Escape (ARIA combobox).
- **Zone for the date.** Outside India the zone and daylight saving come from
  the browser's world time-zone database for the date and time in the form
  (New York 1950 summer → −5 + DST; Britain's double summer time; Tokyo time
  in occupied Singapore), and follow date or time changes; a note names the
  zone and asks for a check before 1970. Indian places keep the PL rule (IST,
  war time 1942-09-01 … 1945-10-14).
- Saved atlas places keep their time zone. Credit for GeoNames on Settings
  and in the footer.
- `scripts/build_atlas.mjs` rebuilds the atlas from GeoNames files;
  `scripts/pl_to_json.ts` converts a folder of PL chart files to app chart
  files with the app's own importer.

**Evidence** 815 unit/engine tests (6 new: atlas contents, former names,
search order and filters, historical zones and DST changes, India rule
unchanged); 42 e2e incl. 7 new (keyboard choice, former names, DST following
the date, war time on atlas places, axe with the list open in all three
themes); contract check; pre-publish scan; core regression 130/130 and WASM
engine 0 failures (unchanged engines). Atlas load ~0.3 s on first use (begun
when the Place field gets focus), ~7 ms per keystroke. Single file 5.6 → 8.1 MB.

**Out of scope / open** Pre-1906 Indian births: PL's own atlas stored local
mean time for some old charts (Agra 1861 → 5:21); the app keeps 5.5 unless the
zone is typed (decision for the user). Villages outside Odisha with no
population in GeoNames are not included.

## v0.9 — 2026-10-24 · `dist/Astro-Amriit v0.9.html`

The boss's brief: label the KP tab **KP (Research)** and bring in the
knowledge of Krishnamurti's six KP Readers, adding only what the app lacks,
judged book by book and chapter by chapter (spec:
`docs/specs/kp_research.md`).

- **KP (Research)** (renamed tab), seven sub-tabs:
  - *Chart and tables:* PL's Krishnamurti chart and significator tables, plus
    Fortuna.
  - *Significators:* each house's significators in Krishnamurti's five-level
    order, with nodes acting as agents, planets in a node's star, empty stars;
    each planet's full set.
  - *Life matters:* promise of 14 matters by the cuspal sub lord with the
    Readers' house groups; candidate dasa–bhukti–anthra periods ranked by
    strength, filtered by the ruling planets of the moment, linked to transit
    days — with a plain note that the rank alone does not time an event.
  - *Ruling planets:* of now or a set moment, with node agents, retrograde
    rejections and strength order; the **rectification assistant**.
  - *Transit timing:* when the Sun, Moon, Jupiter … pass through units whose
    sign, star and sub lords are the period lords.
  - *Horary 1–249:* the number method (ascendant from the unit, cusps for the
    latitude of judgement), B6's question table, the three-condition test,
    dasa from the Moon at judgement, periods of significators that are ruling
    planets.
  - *KP Guidance:* 435 chart rules and 88 principles from the six books, in
    our own words with book and page; the condition that fired is shown.
- **Readers mode** (new default on the tab): KP New ayanamsa, mean node,
  365¼-day years — what the Readers' charts use. PL's choices stay.
- **Matching:** new *Krishnamurti (KP)* sub-tab — his test (partner's birth
  ruling planets among the native's 2-7-11 significators) and 57 notes on
  the kootas and Mars dosha.

**Evidence** 809 unit/engine tests (61 KP tests, most on the Readers' worked
charts: significator tables, 45 horary ascendants, 37 horary charts, 32
dated horary dasas, 7 horary judgements, 15 ruling-planet moments, 11 natal
marriage charts, 5 transit dates, 2 rectifications; every book slip named);
35 e2e tests on the shipped file, axe clean on every KP and Matching
sub-tab; contract and pre-publish scan clean.

**Out of scope** Death, longevity, accidents, danger and disease prognosis
(policy, as on the NTP page); Western degree aspects, Uranus/Neptune,
mundane and electional chapters; traditional transit rules Krishnamurti
rejects (shown only as tradition). The books themselves stay private.

## v0.8 — 2026-10-24 · `dist/Astro-Amriit v0.8.html`

The boss's v0.8 brief: an experimental Page 1, PL 7's Compatibility reports,
Iyer's marriage matching, PL's yogas and worksheets, and Nandi Nadi.

- **NTP (Research):** the tab is renamed, and gains **Marriage matching
  (Iyer)** (NTP-2 pp. 147–151): what one chart says about the partner, the
  mutual verification of two charts, the Nadi and Rajju kootams, and Iyer's
  "Kuja Yoga, not Kuja Dosha".
- **Matching (new tab):** PL 7's Reports → Compatibility for the current
  chart and a prospective match (or two other charts), boy/girl roles:
  overview, basic birth details, charts and planets, Moon chart/Navamsha/
  Dashas, **Ashtakoot** (36, PL's bands and Maha Doshas), **Mangala Dosha**
  (from the Lagna and the Moon, PL's 25 cancellations) and **Dash-Koota**
  (Kalaprakasika 44, BV Raman 36). Rules read from PL 7's program
  (`docs/specs/compatibility.md`). The second chart is never stored.
- **Page 1 (Experimental) (new tab), five sub-tabs:**
  - *Highlights:* dignity, vargottama, dig bala, retrograde, combust and the
    3rd/6th/8th/12th for the Rasi or any varga; conjunctions with their
    definition (same sign; "close" within an adjustable orb, default 3°;
    planetary war within 1°); dignity across the 16 Parashari charts.
  - *Lordships & yogas:* PL's Lordships worksheet for any chart (exchanges
    marked); PL's **1001 yogas** evaluated with PL's own formulas, with
    filters; Angaraka and Guru-Chandala added as textbook yogas (not in PL).
  - *Aspects:* PL's worksheets 21–26 — the aspect matrix (fraction, virupas,
    friend/neutral/enemy colour), aspects from/on each planet, and aspects
    on the nth house and on the nth house + lord.
  - *Strength worksheet:* PL's worksheet 14 — SB%, SB#, War, Ishta/Kashta,
    Dominance, Func., Shad Bala bars, Bhava Bala by component.
  - *Nandi Nadi (research):* Bhrigu Nandi Nadi sign links, Rao's retrograde
    rule, karaka cards, Jupiter/Saturn transit activations and rounds.
- **Changed:** Page 1 **Func.** of Rahu and Ketu now follows PL's code (the
  nearest planet in the node's sign, else the node's house); the PL 9 Page 1
  fixture still matches 145/145.

**Evidence** 754 unit/engine tests. Kootas: 80 synthetic pairs equal the
spec, Bhakoot/Nadi/Mahendra/Stree-Deergha equal PyJHora 4.8.7, and a real
PL 7.0.1 Ashtakoot + Dash-Koota printout is reproduced row for row. A PL
7.0.1 worksheet set for one private chart (kept outside the repository):
aspect matrix 72/72 cells and colours, Lordships D1/D9/D10, Dominance 9/9,
Func. 9/9, Ishta/Kashta Su/Mo/Sa exact. BNN rules on R. G. Rao's Chart 1.
34 e2e on the shipped file (axe on every new sub-tab, three themes),
contract check, pre-publish scan.

**Out of scope / open:** a PL printout with a non-Sampat Tara and two neutral
Moon-sign lords (settles PL's Tara and Graha Maitri quirks); which house
point PL's default house-aspect graphs use; 18 rare yoga tokens; new
screenshots for the user guide.

## v0.7 — 2026-10-17 · `dist/Astro-Amriit v0.7.html`

A fix release: same features as v0.6.

- **Fixed:** chart labels could cross a chart line on small charts (the
  Vargas page at desktop width) on some machines. Chromium rounded the font
  size of scaled-down chart text to whole pixels, so a label's width
  depended on the chart's on-screen size and the machine's font settings.
  Chart text now uses `text-rendering: geometricPrecision`, so its layout is
  the same everywhere. This was the failing GitHub CI check.
- **Fixed:** a label width measured before the bold font finished loading
  could be cached and reused; widths are now cached only once both font
  weights have loaded, and charts redraw when they have.
- CI uploads Playwright failure reports.
- Tests: the browser tests now wait for a tab switch to finish before acting
  (helper `openTab`). Before, a slow runner could act on the previous page —
  the saved-places test failed on `main` (CI run 21) by finding two "Place"
  fields. Reproduced by delaying route changes 300 ms; the whole e2e suite
  now passes under that delay.

**Evidence** 645 unit/engine tests; 32 e2e on the shipped file; the
label-crossing check also at 360, 768, 1280, 1412 and 1920 px; contract
check; pre-publish scan; GitHub CI green on the fix commit.

## v0.6 — 2026-10-17 · `dist/Astro-Amriit v0.6.html`

**What works**
- **NTP page** (new tab after KP): H. R. Seshadri Iyer's *New Techniques of
  Prediction* applied to the chart, every point cited to volume and PDF page.
  - **NTP Guidance**: only the points that apply to this chart.
  - **Yoga, Avayoga and the sets of three**: Birth Yogi, Duplicate Yogi,
    Avayogi (Iyer's one-enemy table), the three friendship sets with the
    Yogi's and Avayogi's highlighted, the birth-yoga effect, Zero Rasis.
  - **Planet cards**: states (exalted, debilitated, own, Zero Rasi, combust,
    retrograde, Yogi roles), positive/negative character with reasons,
    Theories 1–34 (NTP-2 ch. I), NTP-1 planet-state, bhava and yoga rules,
    Graha Samayam, three Navamsha stars, areas its Dasha favours or harms.
  - **Dasha and Bhukti**: Iyer's Dasha chart (Starter, Ruler, Dasha Yogi,
    Raja Yogi), Dasha rules, the area-by-area reading through Iyer's own
    division charts, and every Bhukti's start/end tone with its Dasha-chart
    and classical (A–E) rules.
  - Mean node, as Iyer (switchable).

**Evidence** 645 unit/engine tests. The Dasha chart reproduces Iyer's worked
Chart 1: 10/10 Starters and Rulers, the Raja Yogi and 3 Dasha Yogis. The
division charts match his Chart 1 table in 167/170 cells (3 book misprints).
The Mathematical Navamsha matches all 7 worked examples and his 12/24/72 pada
count. 32 e2e on the shipped file (new: NTP page; NTP in the phone and axe
runs), contract check, pre-publish scan.

**Sources** `references/NTP/` (private; never published — PLAN §11) with rule
catalogues in `references/NTP/notes/`.

## v0.5 — 2026-10-17 · `dist/Astro-Amriit v0.5.html`

**What works**
- **KP page** (new tab after Dashas) — PL's *Krishnamurti Chart* and *KP –
  Significators*: East Indian chart on Placidus cusps (ascendant = beginning
  of house 1) listing cusps and planets with star/sub lords and KP house;
  cusp and planet tables with sign, star, sub and sub-sub lords;
  significators of the houses (occupants, tenants of occupants, owner,
  tenants of owner — PL 7 manual p. 205) and of the planets (A–D levels).
- **KP ayanamsa** as PL: the KP page uses the Krishnamurti ayanamsa
  whatever the other pages use (manual pp. 218–219); Krishnamurti New or
  the chart's own ayanamsa are selectable. The Solar Fire / Kala Chakra
  profile keeps its Lahiri on "Automatic".
- **1 week** transit step.

**Evidence** 626 unit/engine tests (new: KP placement equal to Kala
Chakra's `houseOf` on 2 000 random charts, lords equal to Kala Chakra's
`subLords`, hand-worked significators); 31 e2e on the shipped file (new: KP
page vs Page 1 through the Krishnamurti–Lahiri difference, week step; KP in
the phone-overflow and axe runs); contract check; pre-publish scan.

**Open** not yet compared with a PL KP printout; which Krishnamurti
ayanamsa PL 9's KP screen uses (export procedure Test 2).

## v0.4 — 2026-10-17 · `dist/Astro-Amriit v0.4.html`

**What works**
- **Seconds on every phone.** Birth time is three boxes — Hours, Minutes,
  Seconds — with a number keypad; typing moves to the next box after two
  digits (`160037` → 16:00:37), and a whole time pasted into Hours is spread
  over the boxes. iPhone's time picker (no seconds) is no longer used. Same
  on the Transits page.
- **Saved places manager** (Settings): add, edit, delete (with confirm),
  built-in list for reference, **Export places** / **Import places…** to
  move your list between devices (each browser keeps its own).
- Latitude and longitude accept decimal or degrees-minutes-seconds
  (`20 15 30 N`, `85°50′E`, `-73.5`).
- No sideways scrolling on any page at 320 px and 390 px phone widths.

**Evidence** 620 unit/engine tests; 29 e2e on the shipped file (new: phone
digit-by-digit seconds, DMS coordinates, places add/use/edit/export/delete/
import, phone overflow on all 8 pages); contract check; pre-publish scan.

**Companion fix** Kala Chakra v1.6 (`Advanced_Setup/web/dist/`) shows the
seconds next to hh:mm in the result, chart, Excel and event lines.

## v0.3 — 2026-10-17 · `dist/Astro-Amriit v0.3.html`

Fixes found while writing the user guide (docs/user_guide/USER_GUIDE.md).

- **Fixed:** the extra charts (events) of an opened PL file now appear under
  "This file also holds:" (they were lost when the form folded away). The
  end-to-end test that should have caught this was passing for the wrong
  reason and now checks the right button.
- India war time is also applied to saved places inside India (before, only
  built-in places).
- Date in words under the Dashas and Transits dates; plain-language varga
  rules (program routine under "Source"); readable "How was this computed?";
  left/right step arrows; "Lagna (ascendant)" wording; Sade Sati phases
  listed once with a re-entry note; "Untitled chart" when no name is given;
  wider Calculation box; ayanamsa labels "PL: …".
- Nakshatra names and pada syllables are PL's own spellings (since v0.2).
- User guide (≈7 000 words, 33 screenshots).

## v0.2 — 2026-10-17 · `dist/Astro-Amriit v0.2.html`

The first functional build: every Phase 1 slice is in. The app is now called
**Astro-Amriit** (v0.1 shipped as "KAAST 2").

**What works**
- **Page 1** exactly as PL 9's "Birth chart I": Rasi chart (East Indian) with
  PL's house-edge labels (SAV bindus, Bhava Bala), D9, Vimshottari, planet
  table, strength table (Dignity, SB%, SB#, VB, AV, Av3, Av5, K7, Func.),
  Shad Bala bars, panchanga line.
- **Strengths**: Shad Bala and Bhava Bala by component, Ashtakavarga BAV/SAV.
- **Vargas**: all 31 PL divisional charts (decoded from PL's program) plus an
  "Iyer" D11 placeholder; "signs in all vargas" with vargottama.
- **Dashas**: six-level tree, PL's sub-period table, jump, running chain,
  dasha-year switch.
- **Yogi & Bhava**: Yogi/Avayogi/Duplicate Yogi, Dagdha rashis, Sripati and
  equal bhava chalit.
- **Jaimini**: karakas (7, 8), special lagnas, arudha padas (D1/D9/D10),
  Karakamsha, argala, rashi drishti.
- **Transits**: transit chart around the natal chart, steps from 1 s to 10 y,
  coming sign/nakshatra/pada changes and stations, Sade Sati, returns.
- Open and save Parashara's Light chart files (all 1560 of the private
  collection open) and Astro-Amriit chart files.
- Settings: PL's 8 ayanamsas, Delta-T model, node, dasha year; Light / Dark /
  Warm night themes; text size.
- Desktop installers configured (Windows, macOS) — first CI build pending.

**Evidence** — 616 unit/engine tests; 24 end-to-end tests on the shipped file
(offline, file://), including a geometry test that no chart label crosses a
line and an axe WCAG 2.1 AA scan of every page in every theme; contract check;
pre-publish scan. PL 9 Page 1 reproduced field by field except two open
items (Ketu's VB: 9 vs 14; Rahu's AV rule).

**Open (need PL printouts — see PLAN §10)** — Avayogi / Duplicate Yogi
convention, arudha exception, argala node rule, karaka scheme default, PL 9
Delta-T for modern dates, Placidus check for intermediate cusps, Iyer D11.

## v0.1 — 2026-10-17 · `dist/KAAST 2 v0.1.html`

Slices 0 (foundation), 1 (engine core) and 2a (Page 1 without strengths).

**What works**
- Single offline HTML file (4.0 MB) with the Swiss Ephemeris 2.10.03 WASM
  embedded; boots in about a second and shows *ready*.
- Chart input with a place list, saved places, war-time zone suggestion,
  date echoed in words (guards against day/month swaps), inline errors that
  keep what was typed.
- Three calculation profiles: PL 9 (default), PL 7, Solar Fire / Kala Chakra.
- Page 1 after PL 9's "Birth chart I": East Indian Rasi chart (Kala Chakra
  1.5 geometry, ported), D9 Navamsha chart, Vimshottari list with PL's four
  controls (shallower/deeper level to Deha, earlier/later) and *Today*,
  planet table (longitude, retrograde/combust flags, nakshatra, pada syllable,
  pada and star/sub/sub-sub lords), and "How was this computed?".
- Light and dark themes; phone layout (compact chart labels); keyboard focus.

**Evidence** — 60 unit/engine tests, 5 end-to-end tests, contract check,
pre-publish scan; see README *Evidence*.

**Out of scope (next: slice 2b)** — the Strengths panel (Shad Bala, Bhava
Bala, Ashtakavarga, Vimshopaka, avasthas, karakas, functional nature) and the
house-edge labels of the Rasi chart. Nakshatra spellings and pada syllables
not seen on the PL 9 screen are textbook values until PL's own table is decoded.

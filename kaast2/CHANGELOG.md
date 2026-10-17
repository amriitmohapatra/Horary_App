# Changelog

Release-note style (what works · evidence · out of scope). One entry per shipped file.

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

# Changelog

Release-note style (what works · evidence · out of scope). One entry per shipped file.

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

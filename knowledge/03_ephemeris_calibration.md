# 03 · Ephemeris & Solar Fire replication

Goal achieved: charts are cast natively (no Solar Fire needed) with the
Swiss Ephemeris — the same engine Solar Fire itself uses (confirmed from
its Ephemerides settings screen: `…\Esoteric Technologies\SwissEph\`).
Solar Fire is closed-source; Swiss Ephemeris is AGPL/dual-licensed.

## The exact Solar Fire Gold v9.0.19 profile (from settings screenshots)

- Zodiac: **Sidereal (Vedic), Lahiri** ayanamsa (SVP 1900 = 07°Pi32′22″)
- Houses: **Topocentric** (= Polich/Page; swisseph house code `'T'`)
- Node: **True Node**
- "Apply Geocentric Correction to Latitude": **ON** → houses computed with
  the geocentric latitude (WGS84: tan φ′ = (1−f)² tan φ, f = 1/298.257223563)
- Moon parallax: OFF; angles **truncated** (not rounded) to arcseconds
- Atlas: ACS built-in (per-machine coordinate entries differ! see below)

## Calibration constants (recovered from 10 reference charts, 2019–2026)

Implemented in `kala_chakra/ephemeris.py` and
`Advanced_Setup/web/src/ephemeris.js` — keep in sync.

- **Ayanamsa offset: SF = swisseph SIDM_LAHIRI + 1.251″** (constant;
  SF's 2014-era Lahiri vs current SE). Applied in `sf` mode only.
- **SF ΔT curve** (SF's obsolete extrapolation; real ΔT is ~69–73 s):
  piecewise-linear anchors (decimal year, seconds):
  (2019.29, 76.28), (2021.37, 79.33), (2022.98, 80.86), (2023.20, 82.44),
  (2023.61, 82.40), (2024.00, 83.96), (2024.54, 83.98), (2026.51, 87.50);
  ±1 s/yr extrapolation outside.
- Two modes: `sf` (clone Solar Fire; default) and `modern` (current ΔT —
  astronomically more accurate, Moon may differ a few arcsec from SF).
- Ephemeris data: `sepl_18/semo_18/seas_18.se1` (1800–2399), bundled in
  `KP_Automation/src/kala_chakra/data/swefiles/` and (repackaged, 12 MB →
  2.1 MB by dropping the asteroid-name catalogue) inside the WASM data
  file in `Advanced_Setup/web/vendor/`.

## Non-obvious facts that will save you hours

- SF's displayed "Ayanamsa of date" is measured from the **true equinox**
  (includes nutation, ±17″ over the 18.6-yr node cycle). Cosmetic only —
  never calibrate positions against it.
- Every SF report header is self-calibrating: DeltaT, JDE (TT), LST,
  obliquity, geocentric latitude are printed. Longitude can be derived
  via `lon = LST − GMST(UT)`; civil time via `UT = JDE − ΔT` snapped to
  whole seconds.
- **Per-machine atlas drift**: each computer's Singapore/Lapanga entries
  differ (Singapore by ~5–15″, Lapanga by up to arcminutes). Cusps from
  different machines therefore differ by tens of arcseconds; planets never
  do. The KAAST places gazetteer (canonical coordinates + localStorage
  custom places) exists to end this. Canonical: Singapore 1.28333N
  103.85E tz 8; Lapanga 21.70330N 84.03139E tz 5.5.
- Validation tolerances: planets ≤1″ of SF; cusps ≤12″ when reconstructing
  from report headers (the headers' own LST truncation dominates).

## Parashara's Light 7 (dasha source, now optional)

Reverse-engineered from the binary (REA + Rizin) and checked numerically
against the Swiss Ephemeris; study dated 2026-10-17 (PL7 was never run;
numbers come from its transit cache, 2020–2056). Full evidence:
`Astro_Fork/PL7_Reverse_Engineering_Report/main.pdf`.

- **Own ephemeris**, not Swiss: `Bin/ephemdat.bin` + `topos*.dat`
  (J2000 equatorial series). Precise to the **end of 2048**; from
  2049-01-01 it silently falls back to a coarse approximation
  (`approx.dat`, errors up to ±5000″) with no warning. Lower bound unknown.
- **Ayanamsa**: default Lahiri = Swiss `SIDM_LAHIRI` to 0.3″, i.e. 1.4″
  from KC `sf` mode (whose +1.251″ longitude offset makes its
  effective ayanamsa SIDM_LAHIRI − 1.251″). PL7 also offers two
  KP ayanamsas KC does not have.
- **Houses: Placidus** (not Topocentric), probably from the geographic
  latitude — inferred from the absence of the WGS84 constants in the code.
- **True node; mean equinox** (no nutation), as in KC.
- **ΔT**: about 83 s in 2020, rising 0.89 s/yr (≈109 s by end 2048);
  1–5 s larger than SF's curve above over 2020–2026.
- **Dasha year**: the option labelled "365.25" actually uses
  **365.2421875-day years** (`fcn.00464743`; 360 and 327.85 are the other
  options). That is 11.25 min shorter per dasha year. The 40/40 match
  still holds because the validated PL screenshots show periods within
  about 2 years of the chart, where the shift is well under an hour and
  every validated date stays on the same calendar day. For long-range
  natal dashas the drift grows (~1.9 h at 10 years, ~11 h at 60
  years); KC itself uses 365.25.
- **Planet error in this installation**: Sun, Mercury, Venus, Mars,
  Jupiter and Saturn are displaced by ≈0.97 × the Moon's geocentric vector
  (Earth–Moon reduction, `fcn.0055e125`, run-time factor probably tied to
  licence state), up to about 10′. Measured in the transit cache; the
  natal planets are inferred to carry it via shared code, not measured.
  The Moon (hence the Vimshottari dasha), nodes and cusps are unaffected.
- Vimshottari needs only the Moon, so PL7 remains a valid dasha
  cross-check for horary dates (see
  [05_validation_ground_truth.md](05_validation_ground_truth.md)).
  PL 9 advertises Swiss Ephemeris/True Chitra (not examined).

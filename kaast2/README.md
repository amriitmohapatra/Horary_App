# Astro-Amriit

**Karar Ashram Astrology Software, version 2** — an offline Vedic astrology
app that reproduces Parashara's Light (PL) at its default settings, drawn in
the East Indian chart style.

- **One file, no internet.** Download `dist/Astro-Amriit v0.2.html` and double-click
  it. Nothing is uploaded and nothing is fetched; the Swiss Ephemeris runs
  inside the page.
- **Checked against PL itself.** Every number is tested against PL's own output
  (see *Evidence* below), not against our own expectations.
- **Profiles.** *Parashara's Light 9* (default), *Parashara's Light 7*, and
  *Solar Fire / Kala Chakra* (the family's validated KP horary profile).

## Using it

1. Open the HTML file in Chrome, Edge, Firefox or Safari.
2. Wait for the green **ready** at the top right (under a second).
3. Enter the date, time and place, then **Cast chart**. **Now** casts the
   present moment (for horary questions).
4. The zone fills in from the place, including India's war time (UTC+6:30,
   1 Sep 1942 – 15 Oct 1945). Check it for any chart before 1955.
5. Open **How was this computed?** under Page 1 to see Delta-T, ayanamsa,
   house system and dasha year used.

## Evidence (what shows the numbers are right)

| Check | Oracle | Result |
|---|---|---|
| Planets, KP lords, D9, flags, pada syllables | PL 9 Page 1 screenshot (Amitabh Bachchan) | 9/9 planets to the displayed second; 10/10 pada,star/sub/sub-sub |
| Vimshottari dates | same screenshot | 10/10 (365.2421875-day years; 365.25 would give 5/10) |
| PL 7 profile: Delta-T + ayanamsa | PL 7's own transit cache, 1392 samples 2020–2048 | Moon ≤0.06″, Rahu ≤0.76″ |
| Solar Fire profile | 10 Solar Fire Gold reference charts | 80 planets ≤1″, 120 cusps ≤12″ |
| Ayanamsa options | PL7 binary decoding (8 formulas) | 7/7 values ±0.1″ |
| Strength fields (SB%, SB#, VB, AV, Av3, Av5, K7, Func., SAV, Bhava Bala) | PL 9 Page 1 screenshot | all except Ketu VB and Rahu AV (open); Bhava Bala ≤0.6 virupa |
| Vargas | PL7.exe decoded (31 routines) + PyJHora | 124 tests |
| Jaimini, Yogi, bhava, panchanga | PL docs/binary + PyJHora (34–181 charts) | all differences documented |
| Transits | brute-force completeness + PL 7 cache (10 461 Moon nakshatra changes) | no event missed |
| Offline single file | Playwright, `file://`, network disabled | boots, casts, no requests |
| Accessibility | axe WCAG 2.1 AA, every page, 3 themes | 0 violations |

## For developers

```
npm ci
npm test            # unit + engine oracles (Vitest)
npm run build       # dist-site/ (Vercel, Tauri)
npm run build:single  # dist/Astro-Amriit v<version>.html (refuses to overwrite a shipped file)
npm run contract    # build contract check
npm run test:e2e    # Playwright against the single file, offline
npm run scan        # pre-publish personal-data and secrets scan
```

Layout: `src/engine` (pure TypeScript, no DOM), `src/ui` (Preact), `src/boot`
(ephemeris loader), `tests/` (fixtures, unit, engine, e2e), `oracle/` (Python
used only to make fixtures), `parity/` (PL export procedure and comparisons).
Architecture and plan: `../ARCHITECTURE.md`, `../PLAN.md`.

## Licence

AGPL-3.0 (required by the Swiss Ephemeris, © Astrodienst AG). Parashara's
Light is a product of GeoVision Software; Astro-Amriit contains none of its code or
data files, only rules re-derived and tested against its output.

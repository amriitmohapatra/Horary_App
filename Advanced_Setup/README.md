# Advanced Setup — KAAST with built-in ephemeris

**KAAST — Karar Ashram Astrology Software** · by Swami Yogeswarananda Giri

This folder upgrades Kala Chakra with a **built-in Swiss Ephemeris (WASM)**:
charts are cast entirely in the browser from date, time and place — no
Solar Fire, no Python, no internet. The original `KP_Automation/` folder is
untouched; everything here is self-contained.

## The two apps (in `web/dist/`)

| File | What it is |
|---|---|
| `Kala Chakra.html` | **The full app.** Enter question, date, time, place → it casts the chart itself and runs the whole KP pipeline (chart, star/sub lords, cusp numbers, step-by-step powers, Excel download). Pasting a Solar Fire report still works — leave the paste box empty to use the built-in engine. |
| `KAAST Caster.html` | **Standalone caster.** Date/time/place in → cusps + planets with KP annotations out, plus a downloadable Solar-Fire-style report (feedable into the classic Kala Chakra paste box). |

Both are single files (~3.7 MB, ephemeris data embedded), work offline,
and upload nothing.

## What changed vs the original app

- **Built-in casting** — Swiss Ephemeris WASM, configured to the family SF
  profile (sidereal Lahiri · Topocentric houses · True Node · geocentric
  latitude correction · truncated arcseconds), with both `Solar Fire
  compatible` and `Modern` DeltaT modes.
- **Places** — built-in gazetteer (Singapore, Lapanga, Bhubaneswar, Cuttack,
  New Delhi) with exact coordinates and UTC offsets; type a name and
  lat/lon/tz auto-fill. "Save this place" stores your own places in the
  browser (localStorage), ending the per-computer atlas drift.
- **Chart centre** shows the exact latitude/longitude used.
- Branding: KAAST — Karar Ashram Astrology Software, "by Swami
  Yogeswarananda Giri"; "Location" → "Place".
- **No text overflow**: per-region adaptive font sizing keeps cusps,
  planets and sign names inside the chart lines.

## Validation

`node tests/test_wasm_engine.mjs` replays the 10 Solar Fire reference
charts through the browser engine: **80/80 planetary positions within 1''**,
all 120 cusps within tolerance — identical to the Python `kp-cast` suite.
An end-to-end check reproduces the manually calculated RA Job chart
(star/sub lords, cusp numbers, and power strings) from just the civil time
and place.

## Layout

```
├── web/
│   ├── dist/            ★ the two built apps (share these)
│   ├── src/             editable sources
│   │   ├── app_shell.html      integrated app UI
│   │   ├── caster_shell.html   standalone caster UI
│   │   ├── ephemeris.js        engine wrapper + SF calibration (JS twin
│   │   │                       of kala_chakra/ephemeris.py)
│   │   ├── places.js           gazetteer + localStorage persistence
│   │   ├── kp_logic.js         KP pipeline (copy from KP_Automation)
│   │   └── xlsx_surgical.js    style-safe Excel writer (copy)
│   ├── vendor/          jszip, Swiss Ephemeris wasm + glue + data
│   │                    (data repackaged: 12 MB → 2.1 MB, asteroid
│   │                    names removed; planets/moon/asteroids 1800–2399)
│   └── build.py         rebuild dist/ after editing src/
└── tests/
    ├── test_wasm_engine.mjs    validation vs the reference charts
    └── reference_charts.json   extracted Solar Fire reference data
```

## Rebuilding

```bash
python web/build.py            # rebuild both dist files
node tests/test_wasm_engine.mjs  # re-validate the engine
```

Keep `kp_logic.js`/`xlsx_surgical.js` in sync with `KP_Automation/web/src/`
if the KP rules ever change (they are verbatim copies).

## Licensing note

The Swiss Ephemeris (WASM build via the `swisseph-wasm` npm package) is
AGPL-licensed with a commercial alternative; private family use is fine.

# ARCHITECTURE — KAAST 2 (working name)

Status: **v0.1, design only, no code yet.** Created 2026-10-17. Twin of PLAN.md.
Updated whenever a module boundary, data shape, build step or decision changes.

---

## 1. One-paragraph picture

A browser application with **no server**. One TypeScript *engine* (pure
functions, no DOM) computes everything from a `ChartInput`; one *UI* layer renders
the results; one *build* produces two artefacts from the same source: a
single HTML file that runs offline from disk (the family's way of using
software), and a static multi-file site for Vercel. Evidence lives beside the
code: unit fixtures decoded from PL7, the PL7 transit cache, PL7 printouts, and
an independent Python oracle used only in tests.

```
 ChartInput ─▶ Engine (TS) ─▶ ChartResult ─▶ UI (components, SVG) ─▶ screen / export
                 ▲                                   ▲
      Swiss Ephemeris WASM               design tokens, i18n dictionary
                 ▲
      profiles: PL7-default | SolarFire
```

Guide reference: this is the "interface collects input → rules decide → output"
model of ch. 1, with persistence limited to localStorage (ch. 27.3 trade-off:
single user, offline, no accounts).

---

## 2. Repository layout (new folder, future repo root)

```
kaast2/
  README.md                 what it is, how to run the single file, how to deploy
  CHANGELOG.md              one entry per slice (release note style, guide ch. 27.7)
  package.json              scripts: dev, build, build:single, test, test:e2e, parity
  vite.config.ts            two build modes (see §6)
  tsconfig.json             strict
  src/
    engine/                 PURE. No DOM, no fetch, no Date.now().
      time/        julian.ts, deltaT.ts (PL7 curve, SF anchors, Swiss modern), calendar.ts
      ephem/       swisseph.ts (WASM adapter), bodies.ts, ayanamsa.ts (8 PL7 options + SF)
      houses/      placidus.ts, topocentric.ts, bhava.ts (Sripati, equal), latitude.ts
      kp/          lords.ts (port of kp_logic.js: arcsecond star/sub chains), vectors.ts
      varga/       cyclic.ts, signDependent.ts (D6 D8 D10 D11 D11alt D16alt D24), rules.ts (registry)
      dasha/       vimshottari.ts (6 levels, year-length option), windows.ts
      yogi/        yogi.ts (Yogi, Avayogi, Duplicate Yogi — conventions as named variants)
      jaimini/     karakas.ts, arudha.ts, drishti.ts, argala.ts, lagnas.ts
      transit/     transit.ts (instant), ingress.ts (sign/nakshatra change search)
      panchanga/   tithi.ts, vara.ts, yoga.ts, karana.ts
      profiles.ts  PL7_DEFAULT, SOLAR_FIRE — the constant bundles
      types.ts     ChartInput, ChartResult, Longitude (integer arcseconds), etc.
      index.ts     cast(input, profile) → ChartResult
    ui/
      app.tsx                 shell, routing between pages/cards
      state/                  chart store (signals), settings store, places store
      components/             Chart (East Indian SVG), tables, dasha tree, pickers, cards
      pages/                  Page1, Vargas, Dashas, Yogi, Bhava, Jaimini, Transits, Settings
      design/tokens.css       colour, type, space, radius, shadow as CSS variables (light/dark)
      i18n/en.json            every user-visible string (Odia later as od.json)
    io/
      geovision.ts            import/export PL7 BirthData XML (UTF-16)
      chartfile.ts            JSON chart file, versioned
      places.ts               gazetteer + localStorage
    boot/
      wasmLoader.ts           EphemerisLoader interface; EmbeddedLoader (base64) | FetchLoader (Vercel)
  vendor/
    swisseph.wasm, swisseph.data, swisseph_glue.js   (copied from Advanced_Setup; licence note)
  tests/
    unit/                     Vitest: vargas, dasha, jaimini, lords, deltaT, ayanamsa
    fixtures/                 JSON fixtures: report tables, PyJHora outputs, anonymised charts
    engine/                   WASM integration: cache test, Solar Fire reference test
    e2e/                      Playwright: open dist single file offline, cast, assert fields
  parity/
    PL7_EXPORT_PROCEDURE.md   what the boss does in PL7 on Windows
    pl7_exports/              PDFs/PNGs from PL7 (private until anonymised)
    extract/                  scripts turning exports into JSON (manual transcription allowed, logged)
    compare.ts                field-by-field comparison → REPORT.md
    REPORT.md                 the Phase 1 release gate
  oracle/                     Python, tests only, never shipped
    requirements.txt          pyswisseph, pyjhora, numpy
    gen_fixtures.py           writes tests/fixtures/*.json
    cache_moon_rahu.py        reads Astro_Fork/GeoVision/PL7/Temp/*.e31 → fixture
  scripts/
    prepublish_scan.*         personal-data and secret scan before any public push
    build_contract_check.*    every helper symbol used in dist is defined (v1.02 lesson)
  docs/
    design/DESIGN_CONTRACT.md, IDEAS_FROM_BOSS.md
    iyer_rules.md             (Phase 2; from "New Techniques of Prediction")
    user_guide/
  .github/workflows/ci.yml    lint, typecheck, unit, engine, build both modes, e2e, contract check
  vercel.json                 static output dir, headers (wasm MIME, COOP/COEP not needed)
  src-tauri/                  Tauri 2 shell for the desktop installers (Rust toolchain in CI only)
    tauri.conf.json           window, bundle targets (nsis, msi, dmg), updater DISABLED, no network allowlist
    icons/
```

The folder is self-contained so that, at publication time, it can become the
root of the public repository without edits (PLAN.md §11).

---

## 3. Core data model (engine/types.ts)

- **Longitude**: integer arcseconds 0…1 295 999 (invariant 1 from Kala Chakra). All
  boundary logic (sign, nakshatra, pada, sub lords, varga amsa) is integer; the
  only floats are inside the Swiss Ephemeris call and the Placidus iteration,
  truncated (profile-defined) at the boundary into the integer world.
- **ChartInput** `{ name?, date: {y,m,d}, time: {h,mi,s}, tz: hours, dst: hours, place: {name, latDeg, lonDeg, eastPositive: true}, profileId }`.
  GeoVision XML uses west-positive longitude and negative tz for east; the importer normalises (ADR-6).
- **Moment** `{ jdUT, jdTT, deltaT, lst, obliquity }`.
- **Body** `{ id: Su|Mo|Ma|Me|Ju|Ve|Sa|Ra|Ke (Ur/Ne/Pl optional, off by default), lon: Longitude, lat, speed, retrograde, combust }`.
- **Cusps** `Longitude[12]` (Placidus or Topocentric) plus `bhava: { sripati: {madhya[12], sandhi[12]}, equal: {...} }`.
- **KP** per point: `{ star, sub, chain: [sub, sub², sub³, sub⁴] }`, house placement, ownership vector.
- **Varga** `{ id: 'D9', variant?: 'alt'|'iyer', positions: Record<BodyId|'Asc', Longitude> }`.
- **DashaNode** `{ lord, level: 0..5, start: jd, end: jd, children?: DashaNode[] }` computed lazily per expand; year length from profile/settings.
- **ChartResult** bundles all of the above plus `provenance: { profile, engineVersion, swissephVersion, ayanamsaValue, deltaT }` so every screen can show "how was this computed".

---

## 4. Profiles (engine/profiles.ts)

| Constant | PL7_DEFAULT | SOLAR_FIRE (Kala Chakra 1.5) |
|---|---|---|
| Ayanamsa | PL7 Lahiri polynomial (report eq. 1); options 2–8 selectable | Swiss SIDM_LAHIRI + 1.251″ |
| Equinox | mean (SEFLG_NONUT) | mean |
| Node | true | true |
| Houses | Placidus, geographic latitude | Topocentric, geocentric (WGS84) latitude |
| ΔT | 83.0 s at 2020.0 + 0.89 s/yr (PL7 fit); "modern" switch | SF anchor curve; "modern" switch |
| Dasha year | 365.2421875 d | 365.25 d |
| Rounding | OPEN (from printouts) | truncate to arcsecond |
| Ephemeris range | warn outside 1800–2399 (ours); flag dates after 2048 as "PL7 would be approximate" | same files |

Profiles are data, not code paths: one engine, one set of tests, two constant
bundles. Adding "PL9" or "JHora" later is a third bundle.

---

## 5. Engine ↔ Swiss Ephemeris boundary

- `EphemerisLoader` (boot/wasmLoader.ts) is the one interface with two
  implementations (guide ch. 5.1: "an interface is a shared promise"):
  `EmbeddedLoader` reads base64 blobs inlined by the single-file build and feeds
  `Module.getPreloadedPackage` (as today's apps do); `FetchLoader` fetches
  `/vendor/swisseph.{wasm,data}` on Vercel. The engine never knows which.
- The WASM module is initialised once; `cast()` is synchronous after boot.
- The glue remains the patched classic-script glue from Advanced_Setup so the
  existing WASM test harness still applies; wrapped in a typed adapter.

---

## 6. Build and delivery (two verbs, guide ch. 21.1)

- **Dev**: `npm run dev` (Vite). Hot reload; FetchLoader.
- **Single-file build**: `npm run build:single` → `dist/KAAST 2 vX.Y.html`, via
  `vite-plugin-singlefile` + a post-step that inlines the WASM, data and glue as
  base64 and switches the loader to Embedded. New version = new file name; shipped
  files are never overwritten (invariant 11).
- **Site build**: `npm run build` → `dist-site/` for Vercel (static, no functions).
- **Desktop build**: `npm run build:desktop` → Tauri 2 wraps `dist-site/` in a native window (system WebView2 on Windows, WKWebView on macOS); outputs `KAAST 2 Setup.exe` (NSIS) / `.msi` and `KAAST 2.dmg`, plus `SHA256SUMS.txt`. Built in CI on `windows-latest` and `macos-latest` runners; no network access is needed by the app at install or run time. The WASM and data files ship inside the bundle via the FetchLoader reading from the app's own asset protocol (no Embedded base64 needed).
- **Contract check** after every build: parse the dist, ensure every referenced
  helper exists and the embedded blobs decode to the expected byte lengths.
- **CI** (GitHub Actions): typecheck → lint → unit → engine (Node + WASM) →
  both builds → contract check → Playwright e2e on the single file with network
  disabled → upload dist as artefact. Green CI is required before a slice is shown to the boss.

---

## 7. UI architecture

- **Framework**: Preact + TypeScript + signals (small, React-like, fits a
  single file). Components are presentational; all numbers come from
  `ChartResult`. No business rules in components.
- **Chart drawing**: one `EastIndianChart` SVG component that ports the
  Kala Chakra 1.5 geometry exactly (`REGION` map, corner diagonals `xdTL/xdTR/xdBL/xdBR`, two-pass per-row font fit, right-side end-anchoring — see `app_shell_v15.html`). It takes `{ positions, cusps?, centreLines[] }` so the same component draws D1, every varga, bhava and transit charts. North/South Indian are later optional components behind the same props.
- **Design system**: tokens in `tokens.css` (primitive → semantic → component,
  per the `design-system` skill); light and dark via `prefers-color-scheme` and
  `data-theme`; lord colours (star green #1c7a4b, sub crimson #b02748) and the
  max-power orange kept from Kala Chakra for continuity; PL7 planet colours
  available as an optional palette for the dasha view.
- **Pages/cards**: Page 1 · Vargas · Dashas · Yogi · Bhava · Jaimini · Transits ·
  Settings/Places · "How was this computed". Keyboard reachable; every table has a
  caption; errors are inline, next to the field, and preserve the user's input
  (guide ch. 17.3).
- **Dasha tree**: virtualised list of `DashaNode`s with expand/collapse to Deha,
  "next period of planet X" jump, today marker, and the PL7-style Antar table as
  a secondary view.
- **State**: three signal stores (chart, settings, places). Settings and places
  persist in localStorage with try/catch and versioned keys; the chart never
  auto-persists (explicit Save/Export only).
- **i18n**: all strings via `t('key')` from `en.json`; number/degree formatting
  centralised so the Odia edition later is a dictionary plus a numeral mapper.

---

## 8. Test and evidence architecture

| Layer | Tool | Runs | Oracle |
|---|---|---|---|
| Unit (pure engine) | Vitest | every push | report fixtures (varga tables, ayanamsa values), PyJHora fixtures, legacy 40 dasha dates |
| Engine integration | Node + WASM | every push | Moon/Rahu vs 348 cache months (<1.5″); Solar Fire reference (80 planets ≤1″, 120 cusps ≤12″) |
| Build integrity | contract check script | every build | symbol table of dist |
| UI functional | Playwright, headless Chromium, `file://`, offline | every build | engine output rendered field by field |
| Parity audit | `parity/compare.ts` | per slice, release | PL7 exports (16 charts) |
| Accessibility | Playwright + axe | per slice | WCAG AA checks |

Fixtures from private charts are anonymised (name removed, JD kept) and only
celebrity or synthetic charts are committed to the public repo.

---

## 9. Architecture decision records

**ADR-1 One TypeScript engine, Python as oracle only.**
Context: Kala Chakra keeps Python and JS twins (invariant 9), doubling every change.
Options: twins; TS only; Python only with a server.
Decision: TS only in the product; Python (`oracle/`) generates fixtures and cross-checks in tests.
Consequences: half the maintenance; the Python CLI of Kala Chakra is not carried into KAAST 2 (Phase 2 may re-add Excel output via the surgical writer in TS).

**ADR-2 Profiles as data.**
Context: PL7 default must be the default, Solar Fire parity must survive.
Decision: constant bundles selected at cast time; identical code path.
Consequences: every profile shares every test; a new program is a bundle, not a fork.

**ADR-3 Single-file and Vercel from one source.**
Decision: Vite with two outputs and an `EphemerisLoader` interface.
Consequences: offline family use preserved; deployment later is configuration, not rework.

**ADR-4 Integer arcseconds at the engine boundary.**
Decision: keep Kala Chakra's invariant; floats only inside ephemeris and house iteration.
Consequences: exact KP boundaries; display rounding is a profile setting, applied once.

**ADR-5 Do not reproduce PL7 defects.**
Decision: no Moon-vector displacement; no silent post-2048 fallback (we warn instead); 365.2421875 is reproduced because it is a convention, not a defect.
Consequences: planet parity against the analysed PL7 copy may show ~1′–10′ differences by design; the parity report states this per field.

**ADR-6 GeoVision XML as a first-class import.**
Decision: parse UTF-16 BirthData; convert west-positive longitude and negative-east tz to the engine convention; keep events.
Consequences: all 1 559 saved charts open directly; the parity set is reproducible from files, not retyped.

**ADR-7 Preact + signals, no heavier framework.**
Context: single file, offline, non-developer maintainer. Decision as stated.
Consequences: small bundle; React knowledge transfers; no SSR.

**ADR-8 East Indian chart geometry ported, not redrawn.**
Context: the boss requires the exact Kala Chakra layout. Decision: port the v1.5 geometry functions into one typed component with a pixel-regression test against renders of the v1.5 app for three charts.
Consequences: visual continuity guaranteed; other styles are additive.

---

**ADR-9 Desktop installers with Tauri, not Electron.**
Context: an acquaintance of the boss uses devices with no internet at all; a double-clickable installer on a USB stick is the only acceptable delivery. Options: Electron (bundles Chromium, ~150 MB, heavy), Tauri 2 (uses the OS WebView, ~10 MB, Rust toolchain only in CI), PWA (needs a first online visit — rejected), plain HTML file (already offered; some users want "a real app").
Decision: Tauri 2, same `dist-site/` output, updater disabled, no permissions beyond file dialogs for import/export, installers built in CI for Windows x64 and macOS (Intel + Apple Silicon universal).
Consequences: one more CI job and a Rust toolchain in CI; unsigned builds show a one-time OS warning (documented; signing is decision D10); the single HTML file stays the primary artefact for everyone else.

## 10. Open architectural questions

- Rounding of displayed longitudes in PL7 (truncate/round; seconds/minutes) → profile constant after printouts.
- Whether to compute Placidus with Swiss `swe_houses_ex` (fast, well tested) or our own semi-arc trisection to mirror PL7's routine; start with Swiss, add our own only if printouts show a systematic difference.
- Placement of Uranus/Neptune/Pluto (PL7 shows them optionally) — off by default.
- Export formats beyond JSON/XML (PDF print stylesheet is planned; Excel via surgical writer is Phase 2).
- Desktop: minimum OS versions (WebView2 is preinstalled on Windows 10 20H2+/11; older Windows needs the offline WebView2 bootstrapper bundled in the installer — to be verified in slice 8b); macOS 11+.

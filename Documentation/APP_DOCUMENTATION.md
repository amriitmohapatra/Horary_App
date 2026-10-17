# APP_DOCUMENTATION — Kala Chakra / KAAST

*Structured per the app-documentation-audit skill (`OUTPUT_SCHEMA.md`).
Deep narrative lives in the linked files; this document is the numbered
spine with evidence status. All claims Verified unless labelled.*

## 1. Document control
- **Application:** Kala Chakra / KAAST — KP horary chart automation (apps v0.95–v1.5 incl. Odia edition; Python package `kala-chakra` 2.x)
- **Repositories:** `Horary_App/KP_Automation` (main), `Horary_App/Advanced_Setup` (KAAST web)
- **State examined:** working tree as of 2026-07-28 (no git history yet — user plans first commit; **Excluded:** commit archaeology, reason: not initialised)
- **Environments:** macOS/Windows/Linux browsers (apps), Python ≥3.10 (CLI), sandbox Linux (verification)
- **Artifacts examined:** all source, builds, tests, ground-truth workbooks, settings screenshots, PL screenshots, scanned tables
- **Artifacts unavailable:** Solar Fire/PL internals (closed source); per-machine historic atlas entries; some inline chat images (described in record)
- **Audience:** the family (users), future maintainers/agents
- **Coverage status:** see §22

## 2. Executive orientation
Single-file offline web apps + a Python CLI that automate the family's KP
horary workflow end-to-end: native chart casting (Swiss Ephemeris; Solar
Fire-compatible and modern modes), star/sub lords to Sub⁴, placement/
ownership/node vectors, the family's power calculation, six-tier
Vimshottari dashas (to Deha), event verification, Excel output in the
family's own East-Indian template. Everything validated against
hand-calculated charts. See `01_Journey_and_Method_Guide_EN.md`.

## 3. Scope and evidence method
Labels Verified/Inferred/Unresolved/Excluded per the skill; evidence
priority: code+tests > ground-truth workbooks > session record >
external docs. Commands and expected numbers:
`knowledge/05_validation_ground_truth.md`. External lookups performed:
Solar Fire/PL product pages (provenance CSV). Verification executed in
this session: 130/130 core regression; 80/80+120 casting (both engines);
40/40 dasha; 5,000-pt sub-chain parity; jsdom functional gates.

## 4. Repository and artifact map
`knowledge/04_architecture_filemap.md` (prose) + `audit/file_inventory.csv`
(30 material entries; vendored/minified/built artifacts inventoried with
exclusion reasons).

## 5. Architecture
5.1 Two sibling engines (Python, JS) held to one spec by parity tests.
5.2 Deployables: pip package + console scripts; self-contained HTML apps
(~3.7 MB) embedding WASM ephemeris, data, template. 5.3 Components: see
§7/traceability CSV. 5.4–5.5 Control/data flow: input (form/paste/xlsx) →
Chart (integer arcseconds) → lords/vectors/powers/dashas → DOM/SVG/Excel
(surgical writes). 5.6 Trust boundaries: none crossed — fully offline,
no network calls, no uploads (verified: no fetch in shells; WASM loaded
from embedded base64). 5.7 Runtime: browser main thread; WASM module;
localStorage only for user places.

## 6. Application lifecycle
6.1 Install: none (apps) / `pip install .` (CLI). 6.2 Config: constants
in code (`audit/configuration_registry.csv`); no env vars, no secrets.
6.3 Startup: WASM boot (~1–3 s) gates the Cast button; quote renders
immediately (independent). 6.4 Input+validation: friendly messages;
seconds merge rule (`timeParts`) for iOS. 6.5 Core processing: CALC-01…12
(`audit/calculation_ledger.csv`). 6.6 Persistence: none beyond
localStorage places. 6.7 External integrations: none at runtime.
6.8 Async: WASM init only. 6.9 Rendering: geometry-aware SVG chart,
tables, dasha/deha sections; Excel via surgical writer + template.
6.10 Errors: try/catch → inline messages; engine-failure fallback keeps
paste mode alive. 6.11 Shutdown: stateless.

## 7. Component reference
`audit/traceability_matrix.csv` C-01…C-10; prose per component in
`knowledge/04_architecture_filemap.md`. Invariants per component:
`knowledge/07_conventions_invariants.md`.

## 8. User-interface reference
Screens/actions/states documented visually in `02_User_Guide_EN.html`
(+Odia) with annotated figures; states: loading (engine), validation
errors, results (cards), print stylesheet. Accessibility: colour cues
always paired with weight/shape (v0.99 lords; v1.5 max-power pill);
responsive single-column ≤720 px. Telemetry: none.

## 9. API, event, and job catalog
No network APIs. CLI commands: `kp-cast`, `kp-build`, `kp-annotate`,
`kp-validate` (arguments in module docstrings; examples in README).
DOM events: cast/click handlers; second listener pattern for deha event
view (documented in decisions log).

## 10. Data reference
Model: `Chart {cusps 1–12, planets 9}` in integer arcseconds; `Period
{lords[], start, end}`. Storage: xlsx artifacts; localStorage `kaast_places`
(non-sensitive). Serialization: inline-string cells (surgical writer);
base64-embedded binaries in apps. Retention/privacy: all local; no PII
leaves the machine.

## 11. Calculations and algorithms
Full ledger `audit/calculation_ledger.csv` (CALC-01…12) with standard
method vs implemented variant, worked examples in
`01_Journey_and_Method_Guide_EN.md` Part I and `knowledge/02…`; code+test
pointers included. Highlights: computed KP table (no lookup), exact
integer subdivision ×120/level to Sub⁴; SF-compat casting (+1.251″, ΔT
anchors); 6-tier dasha with anchor-once law; horizon rule; max-power
highlight.

## 12. External-source provenance
`audit/source_provenance.csv` SRC-001…010 (family method; Swiss
Ephemeris; pyswisseph; swisseph-wasm incl. our data-trim transformation;
Solar Fire & PL as observed calibration targets; JSZip; flatlib data;
openpyxl; Gurudev quotes).

## 13. Dependency reference
`audit/dependency_registry.csv`. Runtime browser deps fully vendored;
Python: openpyxl (runtime), pyswisseph/xlwings (optional extras); dev:
node, jsdom, texlive.

## 14. Configuration reference
`audit/configuration_registry.csv`. No secrets exist in this project.

## 15. Security, privacy, and permissions
Offline by construction; no credentials; no uploads; localStorage only.
Threat posture and source-secrecy strategy (obfuscation limits, AES
password build option, WASM compilation, private distribution) recorded
in decisions log 2026-07-08. Quotes/personal chart data stay local.

## 16. Build, packaging, and deployment
Reproducible: `python web/build_v15.py` (+`_od`, per-version scripts) —
verified this session; `pip install .` — verified; LaTeX docs via
latexmk — verified. Release = copy `dist/*.html`. Rollback = use prior
versioned file (all preserved). Smoke gates: node syntax check on every
inline script; symbol contract check; jsdom functional test (quote
renders, helpers defined, friendly validation).

## 17. Testing and verification
Suites and expected results: `knowledge/05_validation_ground_truth.md`;
corpus audit `kp-validate`; casting suites (py+mjs); dasha regressions;
parity harnesses; known ground-truth data errors listed (do not "fix"
code against them). Coverage gap: no automated UI-interaction tests
beyond jsdom smoke (manual eye-tests by the family fill this; noted).

## 18. Observability and operations
Console logging only; failure recovery = reopen file; backup = copy the
single files; no servers.

## 19. Decision log and alternatives
`knowledge/06_decisions_log.md` (11 dated entries, each with rationale
and alternatives where they existed).

## 20. Limitations, discrepancies, unresolved
`audit/unresolved_items.md` U-01…U-06.

## 21. Reproduction guide
Clean room: install Python ≥3.10 → `pip install .[cast]` in
`KP_Automation` → `python tests/run_tests.py "RA Job.xlsx"` (130/130) →
`python tests/test_ephemeris.py "Solar Fire Gold Charts.xlsx"` (0 fail) →
`node Advanced_Setup/tests/test_wasm_engine.mjs` (0 fail) →
`python Advanced_Setup/web/build_v15.py` → open dist file, cast the
RA Job moment (2022-12-23 19:43:50, Singapore) and compare Moon
`08°Sg17'23'' Ke/Ju-6`, numbers `6,2`, powers `213, 411, …`.

## 22. Coverage audit
Inventory reconciled against report sections; every external source in
the provenance ledger; every derived value class in the calculation
ledger; components in the traceability matrix; no secrets present.

> **Coverage status: complete for all accessible, in-scope artifacts.**
> Unresolved/inaccessible items (6) are listed in the audit.

# Unresolved items

## [U-01] Guide_Step6 cell B44 wording vs implementation
- **Status:** Contradictory (resolved in practice, documented)
- **Evidence:** Guide_Step6!B44 repeats the position rule ("power 4"); Sheet2 worked example and 27/27 validation prove star-lord ownership carries power 3.
- **Affected locations:** kp_core.power_terms; kp_logic.js
- **Why it matters:** a future maintainer reading only the sheet would "fix" correct code.
- **What is known:** implementation follows the worked example and all manual charts.
- **What remains unknown:** nothing material.
- **Safe next verification step:** none needed; keep the note in knowledge/02.
- **Related report section:** §11 (CALC-07)

## [U-02] Solar Fire internal ΔT formula
- **Status:** Unresolved (approximated)
- **Evidence:** 8 recovered anchors (2019–2026) from report headers; exact in-app formula/table not accessible (closed source).
- **Affected locations:** ephemeris.* SF_DELTAT_ANCHORS
- **Why it matters:** sf-mode fidelity between anchors is interpolation (<~0.5 s ⇒ Moon <0.3″).
- **Safe next verification step:** print more SF report headers for other years if ever needed.
- **Related report section:** §11 (CALC-08)

## [U-03] Per-machine atlas coordinates of historic charts
- **Status:** Inaccessible
- **Evidence:** derived longitudes differ per machine (Singapore ±15″, Lapanga up to arc-minutes); original atlas entries not exportable.
- **Affected locations:** cusp comparisons for legacy charts
- **Why it matters:** cusp-level exactness against a legacy chart requires that machine's exact entry.
- **What is known:** planets unaffected; gazetteer eliminates the drift going forward.
- **Related report section:** §17

## [U-04] Deha-level external ground truth
- **Status:** Unresolved (no external reference exists)
- **Evidence:** PL 7 output shown only to Pratyantar in available screenshots; deha validated structurally (nesting, tiling, window equality, parity) and by prefix against the prana ground truth.
- **Affected locations:** dasha.* depth-5 outputs
- **Safe next verification step:** compare against any future software that prints deha, if the family adopts one.
- **Related report section:** §11 (CALC-10)

## [U-05] Handwritten notebook pages (quotes) not fully transcribed
- **Status:** Inaccessible (by policy: no guessing)
- **Evidence:** record/images/*PHOTO*; only user-verified transcriptions entered quotes.js.
- **Safe next verification step:** user supplies further verified text; add to quotes.js and rebuild.
- **Related report section:** §8

## [U-06] Inline chat screenshots not archivable as files
- **Status:** Inaccessible
- **Evidence:** several user screenshots existed only inline in chat (first-turn worksheet shots; v0.96 dasha bug; v0.97 chart overflow); described in record/RECORD.md at their turns.
- **Related report section:** record/RECORD.md

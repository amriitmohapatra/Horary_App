# 07 · Conventions & invariants (do not break)

These are enforced by the validation suites in
[05_validation_ground_truth.md](05_validation_ground_truth.md). If a change
violates one, the suites will catch it — but read them first and save the
round trip.

## Calculation invariants

1. All longitudes are **integer arcseconds**; boundaries half-open
   `[from, to)`; a planet exactly on a cusp belongs to that cusp's house.
2. Star/sub lords are **computed** from Vimshottari proportions
   (year = 400″ of a nakshatra) — never from a lookup table.
3. Cusp-number vectors: placement first, ownerships ascending, duplicates
   kept. Nodes: `[dispositor placement, node placement, dispositor
   ownerships…]`.
4. Span rule: a cuspless sign's lord owns the house whose span contains
   the sign.
5. Power grid: numerator 2/1, 4/3, 6/5 (Planet, Star, Sub); denominator
   7/10, 8/11, 9/12. Node position powers go to node AND dispositor;
   ownership powers to the dispositor's cusps. Guide_Step6 B44 is a typo —
   ownership of the star lord carries power 3.
6. Ephemeris `sf` mode: swisseph SIDM_LAHIRI + 1.251″, SF ΔT anchors,
   Topocentric houses on **geocentric** latitude, True Node, truncated
   arcseconds. Don't recalibrate against SF's displayed ayanamsa
   (it includes nutation).
7. Dasha: 365.25-day years; each level starts from its parent's lord;
   anchor the timeline ONCE at the chart moment — never re-anchor when
   walking into the future.

## Engineering invariants

8. **Never re-save chart workbooks/templates with openpyxl/ExcelJS-class
   libraries** — line shapes (the East Indian chart) are silently
   destroyed. Use the surgical writers (`xlsx_surgical.py` / `.js`),
   which rewrite only changed cells as inline strings.
9. Python and JS engines are **twins**: any rule/constant change lands in
   both, then parity is re-verified. Shared constants live in
   kp_core.py ↔ kp_logic.js and ephemeris.py ↔ ephemeris.js.
10. Worksheet annotation formats are byte-stable (see
    [01_domain_horary_kp.md](01_domain_horary_kp.md)); `process.py` is
    idempotent — running it twice changes nothing.
11. App versioning: new shells + new build script + new dist filenames
    (`v0.96 → v0.97`); shipped dist files are never edited.
12. Single-file apps stay **offline** — no fetches, no uploads, assets
    embedded base64. localStorage only for user places.
13. Ground-truth workbooks (`RA Job.xlsx`, `Horary Artifacts.xlsx`,
    `Solar Fire Gold Charts.xlsx`, `Testing/`) are read-only. Known manual
    slips and label errors are documented — never "fix" code to match
    them.
14. The knowledge base must be updated at the end of any session that
    changes rules, constants, or architecture
    (append to [06_decisions_log.md](06_decisions_log.md)).

## Working style the user expects

- Work in loops; validate after each block; ask when a domain convention
  is ambiguous (the user is the authority on the method).
- Flag interesting patterns proactively — pattern recognition is part of
  the job here.
- Deliverables must be accessible to non-coders (single-file apps,
  drag-and-drop, no installs).

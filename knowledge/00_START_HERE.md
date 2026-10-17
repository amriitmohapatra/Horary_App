# 00 · Start here

This knowledge base lets a fresh AI session (Codex, Claude, anything)
reconstruct the full context of the Kala Chakra / KAAST project without the
user re-explaining anything. It was distilled from the original build
sessions (July 2026, built with Claude).

## Reading order

| File | What it gives you | Read when |
|---|---|---|
| [01_domain_horary_kp.md](01_domain_horary_kp.md) | The astrology: KP horary method exactly as implemented | Always |
| [02_power_calculation.md](02_power_calculation.md) | The power model (the crux of the system) | Always |
| [07_conventions_invariants.md](07_conventions_invariants.md) | Rules that must never break | Always |
| [04_architecture_filemap.md](04_architecture_filemap.md) | Every file, what it does, how apps build | When touching code |
| [03_ephemeris_calibration.md](03_ephemeris_calibration.md) | Solar Fire replication: constants & why | When touching casting/ephemeris |
| [05_validation_ground_truth.md](05_validation_ground_truth.md) | What validates against what; how to re-run | Before AND after changes |
| [06_decisions_log.md](06_decisions_log.md) | Chronological decisions + rationale | When wondering "why is it like this?" |

## The system in five sentences

Horary astrology answers a specific question from a chart cast at the moment
of asking. This project automates the family's KP (Krishnamurti Paddhati)
horary workflow end-to-end: chart casting (built-in Swiss Ephemeris,
replicating Solar Fire Gold 9 to ≤1″), star/sub lord assignment (computed,
not looked up), house placement and ownership numbers, a proprietary
"power calculation", Vimshottari dasha periods (matching Parashara's
Light 7 for horary-range dates), and Excel/HTML rendering in East Indian chart style. There are two
sibling engines — Python (`KP_Automation/src/kala_chakra/`) and JavaScript
(`web/src/kp_logic.js` + `Advanced_Setup/web/src/`) — kept in strict parity.
Deliverables are a pip-installable CLI suite and single-file offline HTML
apps (Kala Chakra = full app; KAAST Caster = casting only). Every rule was
validated against the family's manually calculated charts; the validation
suites are the project's safety net.

## Maintenance contract (for every future session)

At the end of any session that changes rules, constants, or architecture,
append a dated entry to [06_decisions_log.md](06_decisions_log.md) and
update the affected knowledge file. The knowledge base is only useful if it
stays true.

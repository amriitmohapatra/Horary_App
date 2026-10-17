# Advanced_Setup — agent bootstrap (pointer)

This folder is part of the Kala Chakra / KAAST project. The project brain
lives one level up: read `../AGENTS.md` and then `../knowledge/00_START_HERE.md`
(follow its reading order) BEFORE changing anything here.

Absolute minimum if you read nothing else:
- Star/sub lords, powers, and dashas are decoded, validated rules — see
  `../knowledge/` for the spec and `../knowledge/07_conventions_invariants.md`
  for what must not break.
- Never re-save chart workbooks with openpyxl/ExcelJS-class libraries
  (line drawings are destroyed); use the surgical XML writers.
- Python and JS engines are twins — change both, re-verify parity, and
  run the validation suites in `../knowledge/05_validation_ground_truth.md`.

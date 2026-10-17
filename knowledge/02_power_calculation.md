# 02 · The power calculation (the crux)

Decoded from the user's Guide_Step6 sheet, his Sheet2 worked example, and
his father's handwritten fraction notation; validated 27/27 against every
manually calculated power string in existence. Implemented identically in
`kala_chakra/kp_core.py` (`power_terms`, `powers_for`, `powers_string`,
`side_totals`) and `web/src/kp_logic.js`.

## The model

For each planet, identify the triplet (Planet, Star, Sub) where Star/Sub
are the star lord and sub lord **of the planet** (not of any cusp). Build a
conceptual fraction; every term is a cusp number (base) raised to a fixed
power. Dashes separate the three groups (structural, not subtraction):

```
(Planet)²(own)¹ − (Star)⁴(own)³ − (Sub)⁶(own)⁵        ← numerator
──────────────────────────────────────────────────
(Star)⁷(Sub)¹⁰ − (Star)⁸(Sub)¹¹ − (Star)⁹(Sub)¹²      ← denominator
```

**Numerator** (position/ownership of each triplet member):

| Role | its placement cusp gets | each cusp it owns gets |
|---|---|---|
| Planet | power 2 | power 1 |
| Star lord | power 4 | power 3 |
| Sub lord | power 6 | power 5 |

**Denominator** (lordship over the 12 cusps — scan all cusps' star/sub
lords):

| Role | cusps where it is star lord | cusps where it is sub lord |
|---|---|---|
| Planet | power 7 | power 10 |
| Star lord | power 8 | power 11 |
| Sub lord | power 9 | power 12 |

The twelve powers form one symmetric 3×2×2 grid (role × aspect ×
sub-aspect) — they are not arbitrary.

## Node exception (Ra/Ke as Planet, Star, or Sub)

The **position power goes to BOTH the node's placement and its
dispositor's placement**; the **ownership power goes to the dispositor's
owned cusps**. (In the denominator the node is matched directly as a
cusp star/sub lord — no substitution there.)

## Merging

Add powers of identical bases: within the numerator, within the
denominator, then across both. Output one line of `base^power` terms in
ascending base order (worksheet notation concatenates them: `214` = base 2,
power 14). Planet=Star or Star=Sub cases just accumulate (e.g. Ve with
Ju/Ju star=sub works mechanically).

## Known source-document trap

Guide_Step6 cell **B44 contains a typo** (repeats "cuspal position …
power 4"). The correct rule — star-lord **ownership carries power 3** —
is proven by the Sheet2 worked example and by the 27/27 validation.
Do not "fix" the code to match the sheet.

## Display (apps)

Powers render as **superscripts**. The step-by-step section shows:
1) substituted fraction (numerator over rule over denominator, groups
dash-separated), 2) collect numerator, 3) collect denominator,
4) merge-and-sort. An "every term explained" section lists each term with
its reason.

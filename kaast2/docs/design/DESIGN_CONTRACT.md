# Design contract — Astro-Amriit

Status: v0.1 (2026-10-17). Tokens: `src/ui/design/tokens.css`. Every colour,
size and font in the UI comes from there.

## Subject, audience, job
- **Subject:** a working instrument for a family of KP/Parashari astrologers,
  replacing Parashara's Light screens they know by heart.
- **Audience:** practitioners of all ages, some elderly; reading dense numbers
  for minutes at a time; desktop first, phone second; offline.
- **Job of Page 1:** read a whole chart at a glance, where PL users expect to
  find each panel.

## Decisions
| Area | Decision | Why |
|---|---|---|
| Signature | The chart is an **engraved plate**: indigo night ground, brass line-work, light text, in both themes | The chart is the one thing people look at most; a kala-chakra plate is the subject's own object. All boldness is spent here |
| Ground | Cool chalk paper (`#f6f7f4`), white panels, hairline slate rules | Quiet, so the plate and the numbers carry the page; avoids the cream/terracotta default |
| Accent | One brass (`#8a6420` light, `#d9b86e` dark) for the primary action, running period, war-time note | Ties UI to the plate |
| Body type | Atkinson Hyperlegible | Designed for low vision: distinct 0/O, 1/l/I — matters for elders reading degrees |
| Data type | IBM Plex Mono (tables of degrees, dates) | Tabular alignment |
| Display type | Marcellus, only for the wordmark, the chart name and the centre of the plate | Inscription feel; used with restraint |
| Lord colours | star green `#1c7a4b`, sub crimson `#b02748`, sub-sub blue | Continuity with Kala Chakra 1.5 |
| Planet colours | PL-like hues, retuned for contrast on paper and on the plate (two sets) | PL users recognise them; never the only cue (labels always shown) |
| Layout | Two columns: Rasi + planet table (left), D9 + Vimshottari + strengths (right); one column under 900 px | Mirrors PL Page 1; no ragged gaps |
| Panel titles | Small caps, letter-spaced, a brass dash | Structure without decoration |
| Phone | Rasi shows planet labels only (the table has the degrees) | Full labels would be 5 px |

## Chart drawing rules (EastIndianChart)
- Geometry ported from Kala Chakra 1.5 (`REGION` map, corner diagonals,
  Aries top centre, counter-clockwise).
- One font size per sign region: the largest that fits, found by bisection;
  each row is checked at baseline **and cap height** against the diagonals;
  lower triangles start higher when crowded. Nothing may cross a line.
- Ascendant region tinted (`--plate-bg-lagna`); each region begins with the
  sign abbreviation (brass) and the house number from the ascendant (muted).

## States and copy
- Errors next to the field, never clearing input; the date is echoed in words
  under the date field (ground truth has 12 day/month swaps).
- Empty state invites the action ("Enter a date, time and place, then cast the chart").
- Engine status: "Loading the ephemeris…" → green dot "ready"; failure says what failed.
- Sentence case; "Place", never "Location" (Kala Chakra convention).

## Quality floor
- Keyboard: every control reachable, visible focus ring (`--focus`).
- Tables have captions (screen-reader only) and row headers.
- Reduced motion respected (no animation is used yet).
- 390 px wide: no horizontal page scroll (tested in e2e).

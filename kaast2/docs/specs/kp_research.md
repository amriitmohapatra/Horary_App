# KP (Research) — synthesis of Krishnamurti's six Readers

Status: v0.9 programme (PLAN.md §14). Sources: K. S. Krishnamurti, *KP Reader*
1–6 (B1 Casting the Horoscope, B2 Fundamental Principles of Astrology, B3
Predictive Stellar Astrology, B4 Marriage, Married Life and Children, B5
Transits, B6 Horary Astrology), transcribed to an Obsidian vault (429 chapter
files, 280 figures). The vault and our notes on it live in `references/KP/`,
which is private: the books are copyrighted and are never published. This
spec, the code and the tests cite book and PDF page only.

## 1. Brief, deepened

The boss asked for the tab to be labelled **KP (Research)** and for the
Readers' knowledge to be added "in the same manner as NTP", after filtering out
what the app already computes, judging book by book and chapter by chapter, and
deciding whether horary belongs. PLAN §14 records the deeper version: work the
way a senior KP astrologer works (promise by the cuspal sub lord → timing by
Dasa–Bhukti–Anthra → confirmation by ruling planets and transit → rectify
first), start from the raw material (chapters, figures, the worked example
charts), and let the books' own worked examples — not us — show the result is
right.

## 2. How the books were read

Seven readers (one per book, B3 split in two) wrote, for every chapter, a
relevance grade and a rule catalogue with citations and a status
(`references/KP/notes/b*_chapters.md`, `b*_rules.md`; 1 170 rules) and
extracted every worked chart (`b*_examples.json`). Chapter tags:

| Book | Chapters | EXISTS | NEW-COMPUTABLE | NEW-GUIDANCE | HORARY | NOT-RELEVANT | REJECTED-TRADITION |
|---|---|---|---|---|---|---|---|
| B1 | 26 | 10 | 8 | 4 | 4 | 13 | 2 |
| B2 | 51 | 1 | 32 | 40 | 4 | 12 | 4 |
| B3 (41–76 incl.) | 93 | 7 | 63 | 30 | 18 | 15 | 24 |
| B4 | 86 | 12 | 44 | 17 | 12 | 12 | 2 |
| B5 | 44 | 3 | 27 | 15 | 4 | 6 | 0 |
| B6 | 44 | 3 | 13 | 9 | 16 | 13 | 11 |

(A chapter can carry several tags.) "EXISTS" = the app already has it: the KP
chart on Placidus cusps, sign/star/sub/sub-sub lords, the A–D significator
levels, Vimshottari to six levels, Krishnamurti ayanamsas, the transit engine,
the Panchanga's sunrise weekday. Those were not rebuilt.

## 3. Settings: "Readers mode"

Recasting the Readers' charts shows what they used (b1-E01, b1-E02, b5-E03 and
the 11 natal marriage charts of §6): the **KP-New** ayanamsa (PL's
"Krishnamurti New": 23°18′ in 1967, B5 p. 227), the **mean node**, Placidus
cusps from Raphael's tables, and **365¼-day** dasa years (B3 p. 161 dates
reproduced). The KP (Research) tab therefore defaults to *Readers mode* =
KP-New + mean node + 365.25-day years. The previous choices stay available:
PL "Krishnamurti" (what PL 7's KP page uses), PL "Krishnamurti New" with the
chart's node, or the main chart's settings.

## 4. What was added (new engine modules, `src/engine/kp/`)

| Module | What | Books |
|---|---|---|
| `significators.ts` | Krishnamurti's five-level order for each house (occupants' tenants > occupants > owner's tenants > owner > conjoined/aspected), node agency (a node gives its own house, its star lord's houses and the full sets of the planets it is conjoined with, aspected by, and its sign lord), planets in a node's star taking the node's set, empty stars | B6 pp. 94–100, 254; B3 pp. 354–355, 418 |
| `ruling.ts` | Ruling planets of a moment (day lord sunrise to sunrise, lagna sign and star, Moon star and sign; lagna and Moon sub as finer RPs), nodes as agents, rejection in a retrograde planet's star or sub, strength order; Fortuna | B1 pp. 85–95, 159–169; B6 pp. 132–152, 194, 254, 285; B5 p. 227 |
| `matters.ts` | 14 life matters: cusp, "yes" and denial house groups with variants and pages; promise by the cuspal sub lord; candidate Dasa–Bhukti–Anthra windows ranked by Krishnamurti's order of strength; the horary three-condition cusp test | B3, B4, B6 (see the table in the file) |
| `subs.ts` | The 249 sign–star–sub units, the horary number | B6 pp. 108–113, 239–241 |
| `horary.ts` | Horary chart from a number: ascendant = start of the unit, other cusps from the RAMC at which it rises at the judgement latitude, planets of the judgement moment | B6 pp. 108–113 |
| `transit.ts` | Stretches of time a body spends in units of chosen sign/star/sub lords | B5 pp. 226–229, 362–365; B6 p. 334 |
| `rectify.ts` | Birth-time candidates whose rising sign, star, sub and sub-sub lords are all RPs | B6 pp. 146–152 |
| `guidance.ts` + `guidance/*.json` | The Readers' natal rules that a chart can test, in our words with book and page, in a small condition language | all six |

## 5. Sub-tabs of KP (Research)

1. **Chart and tables** — the existing KP chart, cusps, planets, house-wise and
   planet-wise significators (PL 7 layout), plus Fortuna.
2. **Significators** — for each house the planets in Krishnamurti's order,
   level by level, nodes acting for planets, planets in a node's star, empty
   stars; for each planet its full set with node representation.
3. **Life matters** — per matter: cusp → sub lord → its star lord → houses
   signified → promise (promised / mixed / denied / not shown), the denial
   group and its source (printed or derived), the significators strongest
   first; candidate periods ranked by strength with a plain warning (below).
4. **Ruling planets** — RPs now (or at a chosen moment) at the chart's place:
   roles, nodes, rejections, order; filter of the matter's candidate periods by
   the RPs (KP6-046); the rectification assistant.
5. **Transit timing** — for a chosen period, the days the Sun (and Moon,
   Jupiter) pass through units ruled by the period lords (KP5-060).
6. **Horary (1–249)** — number, moment and place of judgement; the horary
   chart, its significators, the three-condition test for the matter's cusp
   (B6's master table of house groups, KP6-060), the dasa from the Moon at
   judgement, the RPs.
7. **KP Guidance** — the rules that hold for the chart, by topic, each with
   the condition that fired it and the page.

The Matching tab gains Krishnamurti's notes on the kootas (B4).

### Horary: why it is in

The family practises KP horary (`knowledge/01_domain_horary_kp.md`); B6 is
the largest and best-documented Reader; and once a horary chart is a
`ChartResult`, every other module (significators, RPs, dasa, matters) works on
it unchanged. It is a separate sub-tab so that natal and horary readings are
never mixed: the books apply the retrograde tests and the number method only
to horary charts.

## 6. Validation (the books' own examples)

| What | Oracle | Result | Test |
|---|---|---|---|
| Significator tables | B6 Figs. 20, 26, 67 | every row equals the book except rows where the book contradicts its own rule (named) | `tests/unit/kp_readers.test.ts` |
| 249 units, horary ascendant | 45 printed horary ascendants | all within the print's 1′ | `tests/unit/kp_units.test.ts` |
| Horary cusps | 37 charts with printed cusps | meridian within 10′ in 31; six book slips named; intermediate cusps median 16′ (a row of Raphael's tables read without interpolation) | `tests/engine/kp_horary.test.ts` |
| Horary dasa | 32 dated events in B6 | dasa–bhukti equal in all 29 with sound judgement data; anthra in ≥ 3 of 4 (the others sit at an anthra boundary, the date fixed by transit) | same |
| Horary promise | 7 stated judgements | all 7 equal; 3 others not equal, cause named (book cusp slips; a node sub lord judged by placement) | same |
| Ruling planets | 15 judgement moments (B1, B3, B4, B5, B6) | every printed role, node and representation; 4 book inconsistencies named | `tests/engine/kp_rp.test.ts` |
| Natal marriage timing | 11 natal charts with the wedding DBA | DBA from the printed balance equals the print (2 book slips named); cast chart equal to the bhukti everywhere, the anthra in 9; every printed lord signifies 2-7-11 (one only by aspect, as the book says); 7th sub lord promises in all | `tests/engine/kp_natal.test.ts` |
| Transit dates | 5 dated predictions | all found; 2 book dates 2–3 days off named | `tests/engine/kp_transit.test.ts` |
| Rectification | B6's 2 worked cases | both printed times inside the found candidate | `tests/engine/kp_rectify.test.ts` |

### A research finding the page states

Significators alone do not time an event. Over ages 18–45 every one of the 11
printed wedding anthras is a candidate window, but when the windows are ranked
by Krishnamurti's order of strength, the share of time in stronger windows
averages 0.38 (chance 0.5). The Readers narrow the candidates with the ruling
planets of the moment of judgement and then fix the day by transit (KP6-062).
The Life matters sub-tab therefore lists candidate periods as candidates, says
so, and offers the RP filter and the transit search as the next steps.

(While testing, one exploratory comparison was itself wrong — sookshma
periods compared with anthras — and gave a spuriously strong result; it is
recorded in the commit history and corrected here.)

## 7. Conflicts between the books, and the choice made

- **Denial groups.** B4 p. 154 prints marriage denial 1-6-10; B4 p. 109 also
  writes 4-6-10. The 12th-from rule (B2 KP2-009, B4 p. 154) is the principle;
  where a book prints no denial group the app derives it and marks it
  "derived".
- **Rejecting RPs.** B6 before p. 194 rejects RPs in a retrograde planet's
  star only; from p. 194 also in its sub. The app uses star or sub, and says so.
- **Node representation order.** B6 p. 254: conjoined and aspecting planets
  first, then the sign lord; B6 p. 197 lists conjoined, star lord, aspecting,
  sign lord. The RP code follows p. 254 (the stated rule); the significator
  sets include all four.
- **Children.** B6 judges the 5th cusp; B4 the 11th for a man, the 5th for a
  woman. Both are shown.
- **Lagna star lord's rank among RPs** is never stated; placed after the lagna
  lord and marked as such.
- **Level 5 direction.** "Conjoined with or aspected by those significators":
  the aspected planet gains (B3 pp. 332–335; B4 p. 179 — Venus aspected by Mars and
  Saturn gives their matters). An earlier version of the code had it reversed;
  fixed and covered by the natal test.

## 8. Left out, and why

- Death, longevity, accidents, danger, disease prognosis (policy, as on the
  NTP page). The guidance tests reject such words.
- Traditional rules Krishnamurti quotes to reject (Sade Sati, Ashtama Sani,
  transit-from-Moon tables, Vighati rectification, the prenatal epoch) — shown
  only as "tradition", never as a reading.
- Western degree aspects with orbs, Uranus and Neptune, progressions,
  mundane, medical and electional chapters, appearance by sign.
- Natal retrogression (irrelevant for natal judgement, B6 p. 154); the
  retrograde tests stay on the Horary sub-tab.

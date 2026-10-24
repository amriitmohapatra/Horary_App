# B6 "Horary Astrology": rule catalogue (b6)

IDs `KP6-nnn`. Citation "B6 p. N" is the **source-PDF page** (vault `p. N` anchors). Grade:
VERIFIED-ON-FIGURE / CLEAR / UNCLEAR. Status: EXISTS / COMPUTABLE / GUIDANCE / HORARY /
REJECTED-TRADITION. "Signifies house h" means "is a significator of h" by the four-level rule
KP6-021 unless a note says otherwise. Paraphrased. Short quotes are in quotation marks.

Cross-book checks were done with `rg` over `references/KP/vault/` and are noted as "B3:", "B5:"
and so on.

---

## A. Erecting the horary chart from a number (1–249)

- **KP6-001** · **Number → ascendant.** The querist gives a number from 1 to 249. Number n is the
  n-th row of the 249-row sign/star/sub table counted from Aries 0°. The ascendant is placed at
  the **exact start (first arc-second) of that sub**, and in the examples it is never moved
  inside the sub. Examples: 48 = Gemini, Rahu star, Jupiter sub, 8°40' Gemini (p. 108);
  74 = Cancer, Pushya, Jupiter sub, 14°53'20" (p. 111); 237 = Pisces 11°00' (p. 240);
  9 = Aries 11°26'40" (p. 145). · (B6 pp. 83, 108, 111, 239) · VERIFIED-ON-FIGURE · HORARY ·
  I regenerated the 249 table and checked the printed lagna of every numbered example (40
  numbers: 1, 3, 5, 9, 17, 19, 20, 21, 29, 37, 43, 47, 48, 49, 57, 63, 69, 71, 72, 74, 78, 87,
  90, 100, 108, 109, 114, 125, 127, 132, 137, 139, 144, 147, 156, 171, 175, 184, 188, 203, 208,
  217, 237, 245, 246, 247, 248, 249). All charts match. **Book text errors:** no. 69 is called
  "Saturn sub" (p. 314), but the table and the printed lagna 8°06'40" Cancer give the *Venus*
  sub. No. 184 "Kethu sub commences at 28°53'23"" (p. 302) should be 25°53'20", which is what
  the chart prints. The app's 249 table is the same as the book's (figs. B6.4–B6.10, rows
  75–83, 204–234 compared): EXISTS. Only "number → longitude" is new.
- **KP6-002** · **Other cusps for a numbered ascendant.** (1) Take the start of the sub (KP6-001).
  (2) Add the Krishnamurti ayanamsa *of the date of judgement* to get the Sayana ascendant.
  (3) In Raphael's Table of Houses (Placidus) for the **latitude of the place of judgement**,
  find the sidereal time at which that Sayana ascendant rises, and read the 10th, 11th, 12th,
  2nd and 3rd cusps (interpolating). (4) Add 180° for the opposite cusps. (5) Subtract the
  ayanamsa. The 1st cusp stays at the exact sub start. "All places in the same latitude will
  have the same cusps even though their longitude may be different" (p. 111). The querist's
  own place is ignored ("Do not bother about this place i.e., from where the querist wrote",
  p. 239). · (B6 pp. 83, 108–110, 111–112, 177–178, 239–241, 279–280, 302, 305) ·
  VERIFIED-ON-FIGURE (no. 48 fig. B6.11, no. 74 fig. B6.12, no. 203 figs. B6.57/58, no. 237
  fig. B6.44) · HORARY (computable) · **Engine note:** with the app's Placidus routine this is
  "solve for the RAMC whose ascendant equals the target at latitude φ, then compute all
  Placidus cusps". The clock time is not needed. The longitude matters only for the planets.
  Precision: Krishnamurti interpolated a printed table, so expect cusp differences of a few
  arc-minutes against an exact solution (Raphael's tables use a fixed obliquity).
  Krishnamurti also says to use *his* forthcoming table instead of Raphael's (p. 111), and
  (p. 239) to "note the latitude of the place of judgment".
- **KP6-003** · **Planets and time standard.** Cast the planets for the moment the astrologer
  *starts* casting and judging, in standard time (IST). LMT is used only to get the cusps of a
  moment-based chart (p. 113). If the astrologer stops and resumes at another sitting, the 12
  cusps stay the same and the planets are recast for the new sitting (p. 110, p. 322). If he
  moves to another latitude, he recomputes the cusps for the same ascendant there (p. 110,
  p. 322). · (B6 pp. 110, 112–113, 252, 322) · CLEAR · HORARY · Example: no. 208 was asked on
  24-11-1968 and judged on 29-11-1968. Same cusps, new planets (figs. B6.76/B6.77).
- **KP6-004** · **Which moment: judgement, not query.** "We must take only the time of
  judgment" (p. 104), not the moment the letter was written, posted or received. A chart for
  the querist's urge shows whether and when the astrologer will answer. A chart for the
  postman's delivery shows when the letter will be taken up. Only the judgement chart answers
  the question. · (B6 pp. 104, 269–270) · CLEAR · HORARY · Contrasts with the Western views
  quoted on pp. 71–72 (moment of anxiety, moment of the question, moment of reading). B6
  ch. 13 records those only to set them aside.
- **KP6-005** · **Dasa from the horary moment.** The Vimshottari dasa balance is computed from
  the Moon at the moment of judgement. Events are then timed in that dasa sequence, from that
  moment ("Calculate from the horoscope erected for the number (Horary)", p. 164). · (B6
  pp. 110, 164, 166 and every example) · CLEAR · EXISTS (dasa engine) + HORARY (anchoring) ·
  Same rule as the family's Kala Chakra practice (dasa anchored once at the chart moment).
- **KP6-006** · **Number out of range → "no".** If the number is above 249, the matter will not
  materialise: "I never divided by 249" (p. 114). If someone gives 203 when asked for a
  number within 108, the answer is negative without calculation (p. 279). · (B6 pp. 114, 279)
  · CLEAR · HORARY · Anecdotal, but the book states it as a rule.
- **KP6-007** · **The older 1–108 number.** Tradition (Uthrakalamritha): divide the number by 9.
  The quotient counts signs from Aries and the remainder gives the navamsa (3°20') in the next
  sign (pp. 53, 82). Krishnamurti also used the 108-number as the n-th pada of the
  nakshatras, i.e. a 3°20' arc: 28 → Cancer 0°–3°20' (p. 204); 96 → Shatabhisha pada 4
  (p. 149); 78 → Sagittarius 16°40'–20° (p. 240); 80 → Purvashadha pada 4, Sagittarius
  23°20'–26°40' (p. 245). He dropped it because "the subs are ruled by 3 planets; the
  astrologer is to make a selection … if a number is given within 249, nothing is left to the
  choice of the astrologer" (p. 248). The rule "divide by 12 → whole-sign lagna" is rejected
  as unscientific (p. 82). · (B6 pp. 34, 53, 82, 149, 204, 240, 245, 248) · CLEAR ·
  REJECTED-TRADITION (÷12, ÷9) + HORARY (pada method, superseded)
- **KP6-008** · **Nodes are never retrograde.** "Treat Rahu and Kethu as never retrograde"
  (p. 114). Their steady reverse motion is not a reversal, so a planet in a node's star is
  *not* "in the star of a retrograde planet". Only Mars, Mercury, Jupiter, Venus and Saturn
  can be retrograde. Sun and Moon never are. · (B6 pp. 114, 155, 223, 229–230) · CLEAR ·
  COMPUTABLE · This matters for every "retrograde star lord" test (KP6-029, KP6-043, KP6-061).
  B3 agrees (not contradicted).
- **KP6-009** · **Why a number instead of the bare moment.** Two querists minutes apart would get
  the same moment chart. The number gives each a different ascendant, cusps, occupations and
  significators (p. 83). · (B6 p. 83) · CLEAR · GUIDANCE (UI explanation)

## B. Significators, sub lords and strength (natal and horary)

- **KP6-020** · **A planet gives the results of its star lord's houses.** "A planet 'A' often gives
  the results of the house occupied by the lord of the star 'B' wherein this planet 'A' is
  deposited" (p. 96). "The constellation ruled by a planet indicates the matters signified by
  the bhava occupied and owned by it" (p. 99). "The planet in a constellation will offer the
  results of the Bhava-house occupied by the lord of the constellation" (p. 95). · (B6 pp. 95–97,
  99, 257) · CLEAR · EXISTS (app levels A and C) · B3-07 agrees.
- **KP6-021** · **Order of strength of significators (THE KP rule).** For house h, from strongest:
  (1) planets in the stars of the occupants of h; (2) the occupants of h; (3) planets in the
  stars of the owner of h; (4) the owner of h (owner = "lord of the sign where the cusp of a
  house falls"); (5) planets conjoined with or aspected by those significators. "The tenant in a
  sign is stronger than the lord of the sign and the tenant in a constellation is stronger
  than the lord of the constellation" (p. 94). · (B6 pp. 94–95, restated pp. 165 [death],
  206 [childbirth, (a)–(f)], 253 ["Occupant of the constellation of a planet is stronger than
  the occupant"], 255–256, 284, 286, 325) · CLEAR · EXISTS as levels, COMPUTABLE as ranking ·
  **Comparison with the app:** the app's planet levels are A = houses occupied by its star lord,
  B = house it occupies, C = houses whose cusp sign its star lord owns, D = houses whose cusp
  sign it owns. Reading the book's list from the house side gives level (1) = A, (2) = B,
  (3) = C, (4) = D. **The order A > B > C > D is exactly Krishnamurti's.** What the app lacks:
  (i) showing the ranking; (ii) level (5), conjunction or aspect (B6 gives no orb; the examples
  use same-sign conjunction and Parashari sign aspects, see KP6-038); (iii) node agency
  (KP6-023); (iv) the "vacant star" emphasis (KP6-022). Ownership in all four printed tables
  is by the **cusp sign only**. The book never uses the family's "span rule" (a sign with no
  cusp gives its lord the house): in fig. B6.20 the Sun owns Leo, which has no cusp, and gets
  no house for it. Keep the span rule out of a "KP (Research)" view or make it switchable. B3
  agrees (B3-14, B3 p. 178, gives the same order for badhaka significators; B3-39 the same).
- **KP6-022** · **Empty star → its lord is a strong significator ("Secretary" rule).** If no planet
  is in the stars of the owner (or occupant), the owner (or occupant) itself gives the result
  strongly: "If all 3 rooms are vacant, if no Deputy is found, Secretary does the job"
  (p. 100). Used throughout: "No planet is in Venus constellation. Take Venus" (p. 171);
  "Jupiter star is not occupied by any planet and so Jupiter is very strong" (p. 296). ·
  (B6 pp. 100, 171, 204, 226, 296) · CLEAR · COMPUTABLE (flag)
- **KP6-023** · **Nodes as agents (representation).** A node gives the results of: (a) the
  planet(s) it is conjoined with; (b) its star lord; (c) the planet(s) aspecting it; (d) the
  lord of the sign it occupies, in that order (pp. 196, 221, 222, 286, 284, 325). A node is
  *stronger* than the planet(s) it represents (pp. 166 "Rahu (a node) is therefore more strong",
  246 "the node is stronger than the lord of sign", 260, 278, 284 "always stronger than the
  planets represented by them"). Planets in a node's star then carry what the node represents
  (pp. 172, 188 "planets in the constellation of Jupiter, Rahu and Kethu will be strong
  significators of 3rd house … (Tenant stronger)"). · (B6 pp. 132, 166, 187–188, 196, 216,
  221–223, 232, 243, 246, 284, 286, 307, 322, 325) · CLEAR as a principle, UNCLEAR in detail ·
  COMPUTABLE · **The order varies between passages:** p. 216 "firstly conjoined, secondly the
  lord of the sign" (no star lord, no aspect); p. 232 "conjoined, aspect, sign lord"; p. 322
  "conjoined, aspecting, owner of the sign"; p. 241 "conjoined (Jupiter), then the star lord
  (Sun), then the sign lord (Mercury)". B3-06 (agent b3a) has "conjunct/aspecting planet, then
  their star and sign lords"; B3-19 (B3 p. 213) "Rahu or Kethu will ever be stronger than the lord of
  the house in which they are posited and also the planets with which they are conjoined".
  Treat (a) conjunction and (d) sign lord as certain, (b) star lord and (c) aspect as likely.
- **KP6-024** · **The printed significator tables, checked (validation oracle).** Four tables
  list "house → significators" and "planet → houses": fig. B6.20 (no. 29), B6.26 (no. 217),
  B6.30 (no. 175), B6.67 (no. 247, 1-7-1969). I recomputed them from the printed positions
  (`scratchpad/b6tools/sig.py`). **Result:** (i) for every planet whose star lord is not a
  node, the four-level rule with cusp-sign ownership (= app A–D) reproduces the book exactly in
  F020, F026 and F067 (Sun, Moon, Mars, Mercury, Jupiter, Saturn where applicable). (ii) Three
  "planet" rows drop a house that the matching "house" row of the same figure includes. These
  are print omissions: Venus in F026 (9 missing; house IX lists Venus), Venus in F067 (2
  missing; house II lists Venus), Venus in F020 (shows 3, 4 instead of 2; unexplained).
  (iii) F030 (no. 175) leaves out level C altogether (Sun = 8, 9; Moon = 4, 8; Mars = 4, 5,
  11, 12; Saturn = 2, 3, 4, 6). It counts only the star lord's *occupation*. This is
  inconsistent with KP6-021 and with the book's other tables. Also, F029 does not print
  Mercury at all. (iv) Node rows: a node = its own house + the *full* significations
  (levels A–D) of its sign lord + of planets conjoined with it + of planets aspecting it + its
  star lord's basic houses. This reproduces Rahu and Ketu exactly in F026 ("all houses except
  the 4th") and F067 (Ketu 1, 2, 3, 4, 6, 7, 8, 9, 10, which also resolves the "[?2]" and
  "[?9]" of the transcription), and Ketu in F020. Planets that sit in a node's star get a
  *smaller* node set in F020 (Saturn) and F026 (Moon) than in F067 (Sun). The depth of the
  node agency was not applied the same way across examples. · (B6 pp. 175, 193, 202, 298) ·
  VERIFIED-ON-FIGURE · COMPUTABLE (test fixtures) · Use F026 and F067 as golden fixtures for
  an optional "node agency" mode. Use the non-node rows of all four as fixtures for the
  existing A–D.
- **KP6-025** · **Star lord = matter; sub lord = success or failure.** "Constellation lord shows whom
  or which matter it refers. But the deciding factor, good or bad, success or failure is shown
  by the sub occupied by the significator" (p. 97). A planet signifying a house "is not capable
  of doing good, but it does harm to that bhava … if the sub lord is detrimental" (p. 97). ·
  (B6 pp. 90, 97–99) · CLEAR · COMPUTABLE · The same as B3-07 (KP3-017…021).
- **KP6-026** · **Sub-lord combinations for a significator (examples).** A significator of the lagna
  in a sub of a 6th-house significator → illness; of 8 → danger; of 12 → runs away,
  imprisonment, hospital (p. 97). A significator of 2 in a sub of 6 → borrows; of 1 or 12 →
  lends or repays; of 11 → gain (money, son- or daughter-in-law, child); of 3 → gain or loss
  through a brother; of 4 → car or house in their conjoined period; a 4th-house sub lord that
  also signifies 11 → buys; also 12 → sells; signifies 10 and 12 → lets land or house on rent
  (p. 98). A significator of 7: sub of 2 or 11 → gain, reunion, marriage; sub of 12 →
  separation or ill-health to the wife; sub of 1 and 2 → danger to the partner; sub of 6 →
  the wife goes away; sub of 4 or 5 → the partner gains; sub of 8 → income or danger, and if
  8 is joined with 1 and 7 → death of the partner (pp. 98–99). · (B6 pp. 97–99) · CLEAR ·
  GUIDANCE (show when a D-B-A lord's sub lord meets the condition)
- **KP6-027** · **Container and content: dignity comes from the star lord.** An exalted planet in the
  star of a debilitated planet does limited good ("cotton bundle"). A debilitated planet in the
  star of an exalted planet is "diamond in a small packet" (p. 154). Applied to dowry: the size
  is read from the dignity of the star lord of the 11th cusp's sub lord (p. 265). · (B6 pp. 154,
  265) · CLEAR · COMPUTABLE (dignity of the star lord; the app has exaltation and debilitation
  data)
- **KP6-028** · **Natal chart: retrogression does not matter.** "In a Natal chart, do not worry
  whether a planet is in direct motion or retrograde … Retrograde planets neither loses strength
  nor they are harmful" (p. 154). The 1922 cohort (Rahu, Jupiter and Saturn retrograde in
  Virgo) lived normal lives. · (B6 p. 154) · CLEAR · COMPUTABLE (negative rule: do not show
  horary retrograde verdicts on natal charts)
- **KP6-029** · **Horary chart: retrograde rules.** (a) A retrograde planet in the star of a
  *direct* planet → success after delay, once it turns direct "and passes beyond the point
  wherefrom retrograde motion started". (b) A retrograde planet in the star of another
  retrograde planet, or in its own star while retrograde → "only failure. Never success".
  (c) A direct planet in the star of a retrograde planet → no success (p. 155). Applications:
  a 7th sub lord that is direct but whose star lord is retrograde → he cannot marry *that*
  girl; a sub lord and star lord both retrograde → never marries. A significator of 2, 7 or 11
  in a retrograde planet's star "cannot give marriage in its period" ("His vote is invalid");
  divorce (significators of 1, 6, 10); arrest (significators of 3, 12); winning (significators
  of 6, 11) (pp. 155–156). Later chapters widen this to the star **or sub** of a retrograde
  planet: "appear to give results but will ultimately fall through" (pp. 194, 211, 221, 233,
  298, 312). · (B6 pp. 155–156, 194, 211, 221, 233, 298) · CLEAR · HORARY · **Conflict:**
  pp. 132, 139, 147 reject only planets in the *star* of a retrograde planet. From p. 194 on the
  *sub* is added. A retrograde planet itself is not rejected: it gives results after it turns
  direct (pp. 176, 185, 196, 261, 285).
- **KP6-030** · **House = cusp to cusp.** "You have to take cusp to cusp as a house and not like the
  traditional astrologers" (p. 254). A planet before the cusp belongs to the previous house. ·
  (B6 pp. 11, 254) · CLEAR · EXISTS (app placement)
- **KP6-031** · **Owner of a house = lord of the sign on its cusp** (two cusps in one sign → that
  lord owns both). · (B6 pp. 95, 284, 286, 325) · CLEAR · EXISTS · No span rule (see KP6-021).
- **KP6-032** · **A planet in the 12th can bring gain.** Natal 28-12-1900 (fig. B6.2): Saturn, Sun and
  Jupiter in the 12th gave fame and fortune because of their star lords and subs. Venus and
  Mercury "Dharma-Karmadhipathi yoga" and Rahu in 4 gave bad results (pp. 95–96). ·
  (B6 pp. 95–96) · VERIFIED-ON-FIGURE (fig. B6.2) · GUIDANCE (shows why bhava-only reading fails)
- **KP6-033** · **Natal timing, worked (1928 chart).** Father's death: the Dasa/Bhukti/Anthra lords
  in stars and subs of planets that are badhaka or maraka to the 9th (Saturn is
  "Bhadhakasthana Adhipathi to 9", 2nd and 7th from the 9th are maraka, p. 101). Mother's
  death: maraka to the 4th = 5th and 10th (2nd and 7th from the 4th), D-B-A-S Ve-Me-Sa-Ra on
  27-4-1947. Marriage: houses 2, 7, 11. Ketu is stronger than Saturn, the lord of the vacant
  7th, and gave the marriage in Ve-Ke-Ve-Mo on 6-7-1947 (Moon-star day). Education: "if the
  dasanatha is connected with houses 4 and 9, they will give education". Studies ended in the
  period of a planet whose star lord signifies 12 (pp. 99–103). · (B6 pp. 99–103) ·
  VERIFIED-ON-FIGURE (fig. B6.3) · COMPUTABLE (relative maraka/badhaka = 2nd and 7th from the
  relative's house; badhaka counted from the relative's house sign) · UNCLEAR: p. 101 "To the
  longevity of father houses 2 and 3 counted from 9th is evil" (expected 2 and 7; the scan
  text is garbled here).
- **KP6-034** · **Eclipsed (combust) planets, KP reading.** If a cusp's sub lord sits in the star of an
  eclipsed planet, that cusp gets the evil list, delivered in the sub lord's dasa, bhukti or
  anthra: lagna → imprisonment, incognito life, fear, funerals, loss; 2nd → foolish speech,
  eye trouble, heavy spending, royal displeasure; 3rd → brother's demise, humiliation;
  4th → distress to mother, danger to building, cattle, water and vehicles; 5th → loss of a
  child, stomach trouble; 6th → thieves, defeat, servile work; 7th → separation, trouble
  through the other sex, diseases of private parts; 8th → sorrow, poverty, death; 9th → wrath
  of deity, guru or father; 10th → loss of honour, leaves the permanent place; 11th → bad
  news, trouble to elder brother; 12th → disease, detention (pp. 160–161). Yet KP research
  found that eclipsed planets give both good and bad results in their dasas: "the planet when
  eclipsed does not become a malefic" (p. 163). · (B6 pp. 158–163) · CLEAR · GUIDANCE ·
  **No orb in B6.** Elsewhere: B3-76 (B3 p. 542) "within 8°30' of the Sun"; B1-13 5° (eclipsed), 10°
  (ordinary combustion), beyond 15° none. The traditional views (Kalidas, Prithuyasas,
  Mantreswara, Varahamihira: eclipsed planets lose strength, except Venus and Saturn) are
  recorded as REJECTED-TRADITION (pp. 158–159).
- **KP6-035** · **Eclipses in transit and election.** A planet transiting favourable houses or stars
  while eclipsed gives no effect; in unfavourable ones its bad effects are aggravated. For
  elections avoid the star of a recent eclipse (6 months before or after) and the "moodam" of
  Jupiter or Venus (pp. 161–162). · (B6 pp. 161–162) · CLEAR · GUIDANCE (muhurta)
- **KP6-036** · **"Poonaraphoo": Saturn and Moon in one sign → success only on a later attempt.**
  "Whenever Saturn and Moon are together in one sign … the event will materialise on
  subsequent attempts" (p. 188). In the example the sale fails in Sun-Rahu and happens in
  Sun-Saturn. · (B6 pp. 188–189) · CLEAR · COMPUTABLE (one-line check; useful in natal timing
  too)
- **KP6-037** · **Speed of fulfilment: planets in and owning the 11th.** Saturn there delays. Fast
  planets (Moon, Mercury, Sun, Venus) fulfil the desire early. Others take a medium time. An
  occupant of the 11th outranks its owner for this (pp. 224, 287, 312). Saturn as the
  "mother-in-law in the bath room": it delays but finally gives more (p. 189). · (B6 pp. 189,
  224, 264, 287, 312) · CLEAR · GUIDANCE
- **KP6-038** · **Aspects actually used in the KP examples.** Sign-based Parashari aspects with the
  special aspects: Saturn 3rd and 10th, Jupiter 5th and 9th, Mars 4th and 8th (pp. 192, 212,
  274–275, 297). Same-sign conjunction for node agency. Western aspects with orbs are only
  described (pp. 13, 78–79) and not used in KP judgement. The introduction calls the Western
  degree-based aspects "calculated correctly" (p. 13), but no B6 example uses them. · (B6
  pp. 13, 78–79, 192, 212, 274–275, 297) · CLEAR · EXISTS (the app has Parashari aspects) ·
  B3-39 has a similar level-(5) rule ("Planets conjoined with or aspected by a planet gains the
  strength to offer those results").
- **KP6-039** · **D-B-A co-operation.** A dasa lord that signifies both a good house and a bad house
  (Ketu: 8 and 9) gives the good result only if the bhukti *and* anthra lords also signify the
  wanted group (4, 9, 11 for an exam). If either does not co-operate, the dasa lord gives the
  bad result (p. 199). Also: "Planets posited favourably with the major lord will … co-operate
  … Planets inharmoniously disposed … bring obstacles" (pp. 142, 258; judged by "longitudinal
  distance", i.e. 11th vs 8th from the major lord). · (B6 pp. 142, 199, 258) · CLEAR (first
  part), UNCLEAR (second, no rule for "favourable distance") · COMPUTABLE (first part)

## C. Ruling Planets (RPs)

- **KP6-040** · **Definition.** At the moment and place of judgement: (1) the lord of the weekday;
  (2) the star lord of the rising degree (lagna star lord); (3) the sign lord of the lagna;
  (4) the star lord of the Moon; (5) the sign lord of the Moon (p. 132; procedure p. 147: "these
  five planets happen to be the ruling planets"). Many examples list only four (day, Moon sign,
  Moon star, lagna sign) (pp. 176, 193, 211, 312: "The ruling planets are the lords of the day,
  Moon sign, star and lagna"). The five-part form, including the lagna star, appears on pp. 132,
  135, 147, 203, 217, 326. · (B6 pp. 132, 135, 136, 147, 176, 203, 211, 217, 312, 326) ·
  CLEAR · COMPUTABLE (a moment and a place are enough; uses the *real* rising lagna, not the
  numbered one) · B5-18 (p. 227) adds the **sub lord of the Moon** as an RP. B1-11 uses lagna
  lord, Moon star lord, Moon sign lord and Jupiter's aspect in a birth chart.
- **KP6-041** · **Weekday lord: sunrise to sunrise.** "You should, for astrological purposes, take
  that sunrise to next sunrise is a Day" (p. 147). A query before local sunrise takes the
  previous day's lord. · (B6 pp. 12, 147) · CLEAR · COMPUTABLE (the app has sunrise in its
  Panchanga)
- **KP6-042** · **Nodes among the RPs.** A node in a sign owned by an RP is added ("Rahu is in
  Aquarius or Capricorn then Rahu also should be taken as a ruling planet for Saturday …";
  "Kethu in Gemini represents Virgo also", p. 132). This holds even when the RP rules the
  *other* sign it owns (p. 132). A node conjoined with or aspected by an RP is added (pp. 176,
  185, 196, 286, 312, 326). · (B6 pp. 132, 143, 176, 185, 196, 230, 286, 312, 326) · CLEAR ·
  COMPUTABLE
- **KP6-043** · **Reject RPs in a retrograde planet's star (later: or sub).** "Among these, those
  deposited in the constellation of a retrograde planet should be rejected" (p. 132). From
  p. 194: the constellation **or sub** of a retrograde planet → reject; they are "tempters"
  (pp. 194, 211, 221, 233, 286, 298, 312). · (B6 pp. 132, 139, 147, 194, 211, 221, 233, 286)
  · CLEAR · COMPUTABLE · Nodes do not count as retrograde (KP6-008).
- **KP6-044** · **A retrograde RP.** A retrograde RP "will cause delay till it is retrograde and they
  will be fruitful after they in direct motion reach a particular sub" (p. 132). It is not
  rejected, but it gives results only after its station direct (pp. 176, 185, 196, 285). ·
  (B6 pp. 132, 176, 185, 196, 285) · CLEAR · COMPUTABLE (the app's transit engine has
  stations)
- **KP6-045** · **Strength order among RPs.** "In ruling planets, always the lord of lagna is
  stronger than the lord of the star, the lord of star is stronger than the lord of Moon sign
  and the lord of Moon sign is stronger than the lord of the day" (p. 194). In the example,
  "the lord of the star" = the Moon's star lord. Repeated on p. 212 and p. 275. A node that
  represents the lagna lord is the strongest of all (p. 285: "lord of lagna is the strongest,
  if no node is representing it. In case a node represents, then the node is the strongest").
  Earlier: "the lord of the lagna is stronger than lord of the rasi" (p. 138). · (B6 pp. 138,
  194, 212, 230, 275, 285) · CLEAR · COMPUTABLE · **Gap:** the place of the *lagna star lord*
  in this ranking is never stated. B3-31 (B3 p. 295) has "lord of the star is stronger than the
  lord of the rasi which is stronger than the lord of the day" (agrees). Suggested order for
  display: node-representing-lagna-lord > lagna sign lord > (lagna star lord) > Moon star lord
  > Moon sign lord > day lord, with the bracketed place marked "not stated in B6".
- **KP6-046** · **RPs filter the significators.** When many planets signify a matter, keep those that
  are also RPs; the rest are "tempters" (pp. 175–176, 193, 211, 224, 286, 299, 311, 326). The
  dasa, bhukti and anthra lords that give the event are drawn from this intersection
  (pp. 176, 194, 204, 225, 287, 300, 313). · (B6 pp. 175–176, 193–194, 203–204, 224–225, 286–287,
  299, 311–313, 326) · CLEAR · COMPUTABLE
- **KP6-047** · **Same RPs at judgement and at fruition.** "The ruling planets at the time of
  judgment and those at the time of fructification of the event are same" (p. 210; p. 258).
  So the event happens when the day, star, sign and lagna are again ruled by them. · (B6
  pp. 210, 258) · CLEAR · COMPUTABLE (search for future moments whose RPs match)
- **KP6-048** · **Timing a same-day event by the rising lagna.** Find the next zodiac point to rise
  whose sign lord, star lord and sub lord (and sub-sub lord) are all RPs (or RP ∩ significators).
  The event happens when that point rises at the place where it will happen. Examples: trunk
  call, Venus sign / Jupiter star / Sun sub / Venus sub-sub = 29°20' Libra → 9:41 AM (p. 135);
  friend's arrival, Venus / Moon / Sun sub → about 1:48 PM, Rahu sub-sub (pp. 136–137);
  servant, Taurus / Sun star / Saturn sub / Mercury sub-sub = 3°30' Taurus → 4 PM (p. 138);
  child from school (p. 139). Choose the sub from the stronger RP: "since the lord of the lagna
  is stronger than lord of the rasi, take the sub of Saturn and sub sub of Mercury" (p. 138).
  Use common sense about feasibility: a train cannot cover the distance in 4 hours, so the
  next day; a visitor will not come after 10 PM (pp. 136, 146). · (B6 pp. 133–139, 144–146,
  151–152, 247–248) · CLEAR · COMPUTABLE (the app has a transit-chart engine; the needed search
  is "next time the ascendant enters an RP-ruled sign/star/sub") · B5-18 gives the same method
  (electricity restored at 6:53 PM).
- **KP6-049** · **Which body to move by time scale.** Within hours: the lagna. Days up to a month:
  the Moon. More than a month: the Sun. Years: Jupiter. "If one asks which month I can celebrate
  the marriage … Sun must reach the position governed by the Ruling planets … in which year one
  will build a house, move Jupiter … when his fever will subside move Moon" (p. 140). The
  examples time the day by Sun transit through the sign/star/sub of the D-B-A lords and check it
  with the Moon (pp. 176, 186, 194, 204, 212, 221, 225, 233, 287, 298, 313, 328). · (B6
  pp. 139–140 and examples) · CLEAR · COMPUTABLE (the transit engine has sign and nakshatra
  ingresses; sub ingresses need adding)
- **KP6-050** · **Birth-time rectification by RPs.** Take the RPs at the moment the question is
  judged. Reject those in a retrograde planet's star. The birth lagna's sign, star, sub and
  sub-sub lords "must agree with the ruling planets". If two or three positions qualify, use
  day/night information and the date to pick the sign, then the star and sub ruled by the RPs
  (pp. 146–147). Worked: (i) born 16-10-1919 between 4:30 and 5:30 AM, 21°07'N 73°40'E, judged
  8:30 AM 21-1-1968 (RPs Rahu, Moon, Mercury, Sun, Saturn) → Virgo / Moon star / Rahu sub /
  Saturn sub-sub, Nirayana 162°37' → **5:23:50 AM IST**. The 108-number 96 (Rahu star) confirmed
  the Rahu sub. Saturn and Sun were "weaker" because the query did not come on a Saturday or in
  a Sun star (pp. 148–149). (ii) Chart with four disputed lagnas, Virgo 13°/18°/22°/25°, born
  13-11-1948, 17°44'N 83°23'E; RPs at 6:45 PM 24-12-1967 (Sun, Moon, Mercury) → Mercury sign /
  Moon star / Sun sub / Mercury sub-sub = **23°10' Virgo**, birth 3:36:45 AM IST
  (pp. 150–151). · (B6 pp. 146–152) · VERIFIED-ON-FIGURE (fig. B6.15; I recomputed: the Sun
  sub of Hasta is 22°40'–23°20' and its Mercury sub-sub is 23°05'20"–23°11', so 23°10' is
  inside; for case (i) the Rahu sub of Hasta is 161°53'20"–163°53'20" and the Saturn sub-sub is
  162°27'20"–162°46'20", whose midpoint 162°37' is the value used) · COMPUTABLE (natal: a
  rectification assistant) · Traditional rectification rules (Vighati ×4 ÷9, ÷225 for sex,
  prenatal epoch) rejected: they give 16 or 5 candidates, "no method to fix the exact time
  without any alternative" (pp. 149–150; also B3-74). The "1919 Ayanamsa 22°38'" and the
  printed "0°[?2]'" (should be 0°11') Virgo come from the scan.
- **KP6-051** · **Other uses of RPs.** RPs at judgement also give the Moon's position (birth star),
  "any cusp", the 7th cusp, Fortuna, the date of birth through the Sun's position (p. 150,
  p. 210). Politician: Sun in Venus sign / Moon star / Mars sub = 11°07' Taurus → **26-5-1913**;
  lagna Mars sign / Jupiter star / Rahu sub / Venus sub-sub → about 3° Scorpio → 6:10:14 PM IST
  (pp. 151–152). Two students named a visitor's birth star (Ardra) from the RPs (p. 320).
  · (B6 pp. 150–152, 210, 320) · CLEAR (procedure) / UNCLEAR (politician: Mars as sub lord is
  justified only through Rahu in Aries as Mars's agent) · COMPUTABLE
- **KP6-052** · **Moon shows the querist's mind ("Mathi").** The nature of the query is read from
  the Moon's star lord (houses it occupies and owns) and sub lord at the moment of judgement
  (pp. 178–179, 204–205, 209, 246, 297, 307). Moon in a barren sign in Ketu's star → childbirth
  query (p. 209). · (B6 pp. 178–179, 204–205, 209, 246, 297, 307) · CLEAR · HORARY

## D. General horary judgement

- **KP6-060** · **Matter → houses to judge (master table compiled from B6).** Marriage 2-7-11
  (pp. 102, 173, 253, 282); 2nd marriage 2-11 + 7th sub lord test (p. 173); reunion/husband
  joins 2-7-11 / 11-7-6, separation 12-7-6 (pp. 255, 259); child birth 2-5-11 (pp. 202, 206, 282);
  speculation/gain 2-5-6-11 (p. 282); lottery 2-6-11 (+5; opponent 5-8-12) (pp. 222–225);
  promotion 2-6-10-11 (pp. 282, 293, 297); job 2-6-10 (p. 285); overdraft 2-6-10 (p. 228);
  reinstatement 2-6-10 (p. 309); change of job/leave 3-5-9 (p. 306); transfer 3-10-12, leave/tour
  3-9-12 (p. 283); overseas/higher studies 6-9-11-12 (p. 282), going abroad 3-9-12 (pp. 272, 311);
  scholarship for studies abroad 6-9-11 (p. 282); house 2-4-11 (p. 282); house construction
  4-11-12 (+6, 9 if buying a built house) (pp. 183–184); car 2-4-11 (p. 282) or 4-9-10-11
  (pp. 193, 195); sale of property 3-5-10 (possession 3-12) (pp. 186–187); sale of vehicle
  3-4-5-10 (p. 195); pet animals 6-11; help from younger brother 2-11; thesis/research 9-11;
  education 4-11; litigation/election 6-11 (pp. 282–283); competitive exam 4-9-11 (p. 198);
  admission 4-11 (p. 200); medical exam 4-7-11 (p. 276); purchase of a fridge 4-11-12 + Saturn
  (p. 170); bank position by sales 3-11 (loss 3-12) (p. 172); trunk call 3-9-11 (p. 133);
  interview 3-9-11 (p. 180); negotiation 3-9 (+7 marriage, +5 adoption, 10-6-3-9 business
  take-over) (p. 177); exchange 2-6-11 gain, 5-8-12 loss (p. 182); receipt of drugs 4-11 (p. 142);
  reaching home 4-11 (p. 145); servant returning with cash 2-6-11 (p. 138); child returning
  5-11 (p. 139); news 3-11 (p. 169); death: badhaka + maraka (p. 163); imprisonment 2-3-8-12
  (p. 323); raid 12 (p. 325); recovery of lost property 2-6-11 (loss 5-8-12) (p. 244); donation
  2-6-11 (p. 266); scholarship 2-6-11, not 8-12 (p. 266); father leaving 3-9-12 from the 9th, return
  2-8-11 from the 9th (p. 270); spiritual life 5-10-11 (p. 317); sanyasa 3-10-12 + Saturn (p. 317);
  missing person leaving 3-12 (+7) from the relative's house, return 2-8-11 (pp. 319–320). ·
  (pages as listed) · CLEAR · COMPUTABLE (data table; natal-usable for D-B-A timing)
- **KP6-061** · **The standard three-condition promise test.** For the cusp of the matter: (i) its sub
  lord is not retrograde; (ii) the sub lord's star lord is not retrograde; (iii) the sub lord
  signifies one of the matter's houses. All three → promised. Any one failing → denied
  (pp. 184, 187, 201–202, 219, 222, 274, 297, 311, 323). "If the sub-lord is retrograde wait"
  (p. 187, sale: a retrograde sub lord delays, a retrograde star lord denies). · (B6 pp. 184,
  187, 201–202, 219, 222, 274, 297, 311, 323) · CLEAR · HORARY (and natal-usable as research)
- **KP6-062** · **Timing pipeline.** (1) Significators of the matter's houses (KP6-021, 023);
  (2) intersect with the RPs (KP6-046); (3) find the dasa, bhukti, anthra (sookshma) run by these
  lords, from the horary moment (KP6-005); (4) fix the date by Sun transit through the
  sign / star / sub of the selected lords, checked by the Moon's transit and the weekday
  (pp. 176, 186, 189, 194, 204, 212, 221, 225, 233, 287, 298, 313, 328). · CLEAR · COMPUTABLE
- **KP6-063** · **Relatives by derived houses.** Count the relative's house as its lagna: younger
  sibling 3rd, mother 4th, child 5th (2nd child 7th, 3rd child 9th, p. 183), spouse 7th, father 9th,
  elder sibling 11th (pp. 222, 225). Wife's 2-5-11 from the husband's chart = 5-8-11 (p. 203).
  Father's elder brother = 11th from the 9th (p. 267). A friend's first child = 5th from the 11th
  = 3rd (p. 220). · (B6 pp. 183, 203, 220, 222, 225, 267) · CLEAR · COMPUTABLE (generic
  rotation)
- **KP6-064** · **Manner by the sub lord's planet.** Sun → through Government; Moon → quickly;
  Mars → tension, threat, violence; Mercury → letters, agents, instalments, repeated;
  Jupiter → lawfully, with honour, court or compromise; Venus → friendly, by compromise and sweet
  words; Saturn → delay, obstacles; Saturn aspecting the sub lord → only part of the amount or
  part by part (pp. 229, 231–232, 239, 263). · (B6 pp. 229, 231–232, 239, 263) · CLEAR · GUIDANCE
- **KP6-065** · **The horary lagna must not be "spoiled".** Natural malefics, or lords of 6, 8 or 12, in
  the lagna → the native cannot act (sit an exam, p. 198). Saturn as lord of 12 in the lagna →
  long obstacles (p. 299). · (B6 pp. 198, 299) · CLEAR · HORARY
- **KP6-066** · **Mercury or a dual sign → plurality and repetition.** Sub lord Mercury, or sub lord in a
  dual sign (or in the star of a planet in or owning a dual sign) → second marriage (p. 174),
  repeated sales (p. 172), more than one child at a time (p. 213), several moves (p. 315),
  recovery from more than one person (p. 243). · (B6 pp. 172, 174, 213, 243, 315) · CLEAR ·
  COMPUTABLE

## E. Natal-usable pointers (B6-16, B6-18, B6-19)

- **KP6-104** · **Badhaka and maraka houses.** Movable lagna → badhaka 11th; fixed → 9th;
  common → 7th. Maraka 2nd and 7th for every lagna (p. 163). For a common lagna the 7th is badhaka,
  maraka and kendra: "trebly evil" (p. 165). For a relative, count from the relative's house: the
  9th's badhaka lord (p. 100), the 2nd and 7th from the 4th (5th and 10th) as maraka to the mother
  (p. 102). Significators of death, in order: (a) planets in the stars of the occupants of the
  badhaka and maraka houses; (b) the occupants; (c) planets in the stars of their lords; (d) the
  lords; (e) planets conjoined with or aspected by them (p. 165). · (B6 pp. 100–102, 163, 165,
  264) · CLEAR · COMPUTABLE · B3-14 (B3 p. 178) gives the same order.
- **KP6-105** · **Sign classifications.** Odd signs positive, even signs negative; northern Aries–Virgo;
  movable Ar/Cn/Li/Cp, fixed Ta/Le/Sc/Aq, common Ge/Vi/Sg/Pi; **fruitful Cn, Sc, Pi;
  semi-fruitful Ta, Li, Cp, Sg; barren Ar, Ge, Le, Vi**; mute Cn, Sc, Pi; violent Ar, Sc; human
  Ge, Vi, Aq, first half of Sg; voice Ge, Li, Aq; **bestial (four-legged) Ar, Ta, Le, Cp, second half
  of Sg**; **dual Ge, Sg, Pi** (bicorporeal Ge, first half of Sg, Pi); short ascension Cp→Ge, long
  ascension Cn→Sg (pp. 116–118). · (B6 pp. 116–118) · CLEAR · COMPUTABLE (lookup) · Note "dual"
  here = Ge, Sg, Pi (not Virgo), used by the twins rule (KP6-152). The second-marriage and
  adoption rules say "dual sign" without listing them; the second-marriage example uses Pisces.
- **KP6-110** · **Appearance and character from the lagna.** Find the ascendant's sub lord, then its
  star lord, then the **sign occupied by that star lord** → the appearance and character text for
  that sign (12 entries) (pp. 118–121). · (B6 pp. 118–121) · CLEAR · COMPUTABLE (pointer) +
  GUIDANCE (texts) · Natal-usable.
- **KP6-111** · **Disease from the 6th cusp.** Find the 6th cusp's sub lord, then its star lord, then
  the sign that star lord occupies → disease list (12 entries, e.g. Aries: headaches, burns,
  inflammations, brain; Libra: kidneys, loins, appendicitis, hernia) (pp. 121–122). · (B6
  pp. 121–122) · CLEAR · COMPUTABLE + GUIDANCE · B3-31 uses the same pointer ("find the sign
  where the lord of the star was … and also the sub-lord of the sixth").
- **KP6-112** · **Finance style from the 2nd cusp.** The 2nd cusp's sub lord → its star lord → that star
  lord's sign → finance text (e.g. Taurus: hoards, invests in land; Leo: spendthrift, speculates)
  (pp. 122–123). · (B6 pp. 122–123) · CLEAR · COMPUTABLE + GUIDANCE
- **KP6-113** · **Romance from the 5th (and 7th) cusp.** The 5th cusp's sub lord → its star lord (which
  must signify the 5th) → that star lord's sign → romance text. The same texts apply to the 7th
  cusp's sub lord (pp. 123–124). · (B6 pp. 123–124) · CLEAR · COMPUTABLE + GUIDANCE
- **KP6-114** · **House keyword lists.** Long lists per house, including derived meanings (p. 125 ff.:
  the 2nd = loss to the younger brother, mother's gains, profession of the children …). ·
  (B6 pp. 125–132) · CLEAR · GUIDANCE

## F. Question rules by house (horary; many reusable as natal research)

### I house
- **KP6-120** · **Longevity.** The ascendant's sub lord in the star of significators of badhaka and
  maraka → life is short after the judgement. In the star of a significator of 6 → illness, does
  not succumb; of 8 → accident; of 12 → long confinement or hospital. Fix the years by the
  conjoined periods of those significators and confirm with the RPs (p. 164). Example no. 246:
  the sub lord Mars is in the star of Ketu in the 7th (common lagna → 7th = badhaka + maraka) →
  death in Ra-Ke-Ra-Ju, May 1969 (it came true) (pp. 165–166). · (B6 pp. 163–166) ·
  VERIFIED-ON-FIGURE (fig. B6.16) · HORARY
- **KP6-121** · **Health and disease.** Health is good if the ascendant's sub lord is in the star of an
  occupant of 1 or 11. In the star of a significator of 1 and 6 → disease in its periods. If the
  6th cusp's sub lord is in the star of a significator of 6 and 1 (not 11) → disease in its sub
  period. Connected with Saturn → chronic; with Mars → acute; Mercury → complications (p. 167). ·
  (B6 p. 167) · CLEAR · HORARY (natal-usable)
- **KP6-122** · **Cure.** Illness comes in the conjoined period of significators of 6 and 1. Cure comes
  when a significator of 5 or 11 follows, provided longevity is promised (p. 167). 3-6-11-12 →
  successful hospital treatment; 4-6-12 → treatment at home (p. 318). · (B6 pp. 167, 318) ·
  CLEAR · HORARY (natal-usable)
- **KP6-123** · **Accident.** The 8th cusp's sub lord in the star of a significator of 8. If it also
  signifies 6 → fever after the accident; 12 → hospital; badhaka/maraka → succumbs unless longevity
  is promised (p. 168). "In Astrology, there is nothing as 'Accident'" (p. 167). · (B6
  pp. 167–168) · CLEAR · HORARY
- **KP6-124** · **Absent person: alive or dead.** Use the house of the relation (father and strangers →
  9th). If the cusp's sub lord is in the star of a significator of badhaka and maraka → dead. If
  that significator is in a watery sign → drowned; fiery → injuries; earthy → natural end. In the
  star of the lord or significators of that house → alive. If that lord also signifies the 6th from
  that house → ill (p. 169). · (B6 p. 169) · CLEAR · HORARY · Krishnamurti rejects the Western
  rule of judging an unrelated person from the 1st house: strangers are judged from the 9th
  (p. 168).
- **KP6-125** · **News of the absent.** The 3rd cusp's sub lord in the star of a significator of 3 and 11
  → news arrives when the Moon transits a point ruled by the significators of 3 (from the lagna),
  of the 3rd from the relative's house, and of 11; the hour is when that point rises where the
  querist then is. A Saturn connection → count in months by the Sun (p. 169). · (B6 p. 169) ·
  CLEAR · HORARY

### II house
- **KP6-126** · **Purchase (fridge).** Houses 4 (pleasure), 11 (desire), 12 (investment) and Saturn (cold).
  Significators Venus, Rahu, Saturn, Ketu → Ra-Ve-Sa-Ke, third week of September 1969 (bought
  22-9-69) (pp. 170–171). · (B6 pp. 170–171) · VERIFIED-ON-FIGURE (fig. B6.17) · HORARY
- **KP6-127** · **Money from sales.** 3 = parting with possessions, 11 = profit, 12 = loss. 3 + 11 → profit;
  3 + 12 → loss; 3 + 11 + 12 → money by parting with possessions. A 3rd cusp sub lord that is
  Mercury, or in a dual sign, or in the star of a planet in a dual sign → sells many times
  (p. 172). · (B6 pp. 171–173) · CLEAR · HORARY
- **KP6-128** · **First marriage 2-7-11; second marriage 2-11.** (p. 173) · CLEAR · COMPUTABLE
- **KP6-129** · **Second marriage test.** Both must hold: (i) the 7th cusp's sub lord is in a dual sign, or
  in the star of a planet in or owning a dual sign, or is Mercury; (ii) that sub lord signifies 2 or
  11. Otherwise it is denied (p. 174). Example no. 29: 7th cusp 10°00' Scorpio, Saturn star,
  Venus sub; Venus in Pisces (dual) and a significator of 11 → promised; Rahu anthra (Rahu
  represents Jupiter and Venus) → 13-11-1969 by Venus transit (pp. 174–176). · (B6 pp. 173–176)
  · VERIFIED-ON-FIGURE (figs. B6.19, B6.20) · HORARY + COMPUTABLE (natal-usable; B4 has the
  same theme)

### III house
- **KP6-130** · **Appeal.** The 3rd cusp's sub lord in the star of a significator of 6 and 11 → success;
  of 5 and 12 → failure (p. 177). · CLEAR · HORARY
- **KP6-131** · **Negotiation.** The 3rd sub lord decides whether it is promised; the significators of
  3 decide the timing. The 9th = the 3rd from the 7th (the other party concludes). The houses
  depend on the subject (p. 177). Example no. 63: 3rd sub lord Jupiter in Venus's star, both
  direct, occupying 3 and 11 → success; four dates (17-12-1969 … 26-4-1970) (pp. 177–179). ·
  (B6 pp. 177–179) · VERIFIED-ON-FIGURE (fig. B6.21) · HORARY
- **KP6-132** · **Interview.** Houses 3, 9, 11. The 11th sub lord in the star of a direct planet → interview
  will happen; in the star of a retrograde planet → denied. The RP method gives the same answer
  (p. 180). · CLEAR · HORARY
- **KP6-133** · **True or false report.** The 3rd cusp's sub lord → its star lord: Saturn → false; Mars →
  "mischievous and false"; Jupiter → true; any planet connected with Saturn → false; connected
  with Jupiter → true (pp. 180–181). Example no. 21: 3rd cusp 19°14' Gemini → Mars sub; Mars in
  Saturn's star (Anuradha) → false rumour (p. 181). · (B6 pp. 180–181) · VERIFIED-ON-FIGURE
  (fig. B6.22; the chart's date "30-7-1963" and the text's "1919" are both misprints, see b6-E17)
  · HORARY
- **KP6-134** · **Exchange of articles.** The 6th cusp's sub lord in the star of a significator of 6 or 11
  → gain; of 5 or 12 → loss. The same test on the 12th cusp's sub lord (6 and 11 gain; 5 and 12
  loss) (p. 182). · CLEAR · HORARY
- **KP6-135** · **Journalism.** The 11th sub lord in the star of a significator of 3 and 9, connected
  with Jupiter or Mercury. A Venus sub lord → writes about marriage, sex, love; Jupiter → sensible
  and useful books (pp. 182–183). · CLEAR · HORARY

### IV house
- **KP6-136** · **Building a house.** Houses 4, 11, 12. Promise: the 4th cusp's sub lord and its star lord
  are direct, and the sub lord signifies 4, 11 or 12 (p. 184). For a relative, use the relative's 4th
  (third son → the 12th from the lagna). Same dwelling: both 4th cusps share star and sub lords
  (p. 184). Example no. 114 → Jupiter anthra (16-12-1973 … 10-5-1974); move on 28-12-1973 by the
  Sun entering the Venus sub (pp. 183–186). · VERIFIED-ON-FIGURE (fig. B6.23) · HORARY
- **KP6-137** · **Buying an already built house:** add 6 and 9 (the 12th from the seller's 7th and 4th).
  3 and 9 = vacating and entering (p. 183). · CLEAR · HORARY
- **KP6-138** · **Selling property.** Houses 3, 5, 10 (sale); 3, 12 (handing over possession). Promise: the
  10th cusp's sub lord (= the buyer's 4th) — retrograde → wait; star lord retrograde → no sale;
  both direct and the sub lord signifies 3 or 10 → sale (pp. 186–187). Example no. 188: agreement
  20-1-1972, possession 11-3-1972. The dasa lord Sun signifies 8 and 12 → the buyer gains (a low
  price is implied) (pp. 186–189). · VERIFIED-ON-FIGURE (fig. B6.24) · HORARY
- **KP6-139** · **What a 4th-house matter refers to (by the 4th sub lord).** Venus (a significator of 4), or
  the sub lord in the star of a 4th significator connected with Venus → vehicle or furniture.
  The sign of the sub lord or of its star lord: movable → vehicle; common → vehicle or
  cradle-like furniture; fixed → furniture only. Mars → land or building; Moon → mother;
  Jupiter or Mercury → education; Saturn → mine, excavation, treasure (pp. 190–191). · (B6
  pp. 190–191) · CLEAR · HORARY (natal-usable as guidance)
- **KP6-140** · **Kind of vehicle.** Saturn connection → bicycle (manual labour). Mars + Venus + Moon →
  motor vehicle (Mars = machinery, Venus/Moon = petrol). The sub lord's sign Gemini, Virgo, first
  half of Sagittarius or Aquarius → two wheels; bestial sign → four wheels. Saturn → self-drive;
  Jupiter → driver; both → both. Also signifies 2, 6, 10 → taxi or tourist car; a node and 10 →
  office car. Watery sign → boat (Saturn → hand-driven; Mars + Venus + Moon → motor boat; Mars +
  Moon → steamship; Saturn → submarine). Airy sign + Mars, Venus, Moon → aeroplane or
  helicopter. Mercury or a dual sign → several (pp. 191–192). Example no. 217: the 4th sub lord
  Venus is in the second half of Sagittarius and aspected by Mars (4th aspect) → four-wheeler;
  car on 18-10-1974 (pp. 192–194). · VERIFIED-ON-FIGURE (figs. B6.25, B6.26) · HORARY
- **KP6-141** · **Disposing of a vehicle.** Houses 3, 4, 5, 10 (4-9-10-11 counted from the buyer's 7th)
  (p. 195). Example no. 37 → Su-Ve-Ra-Mo, handed over 23-6-1969 at 3:30 PM, lagna 18° Libra
  (Venus / Rahu / Sun) (pp. 195–197). · VERIFIED-ON-FIGURE (fig. B6.27) · HORARY
- **KP6-142** · **Courage to compete (3rd cusp's sub lord).** Moon → adjusts and avoids bold decisions;
  Saturn → over-cautious; Mercury → in two minds; Sun, Mars, Jupiter, Venus → courage and
  confidence (p. 197). · CLEAR · HORARY (natal-usable as guidance)
- **KP6-143** · **Able to sit the exam?** The horary lagna is not spoiled (KP6-065) (p. 198). · CLEAR ·
  HORARY
- **KP6-144** · **Passing a competitive exam.** Houses 4, 9, 11, for every attempt (not shifted per
  attempt, unlike children). Success only if the D-B-A running at the exam all signify 4, 9 or 11
  (pp. 198–199). Example no. 171: Ke-Ve-Ma; Mars signifies none → fails this time (p. 199). ·
  VERIFIED-ON-FIGURE (fig. B6.28) · HORARY (the D-B-A test is natal-usable)
- **KP6-145** · **Treasure.** The 4th sub lord in the star of a significator of 2, 11 or 6, and that star lord
  connected with a direct Saturn (p. 200). Traditional rules (lord of 2 in 8; lords of 2, 4, 9, 11
  conjoined) are mentioned as tradition (p. 200). · CLEAR · HORARY
- **KP6-146** · **College admission.** The 4th sub lord in the star of a significator of 4 and 11 (p. 200).
  · CLEAR · HORARY

### V house
- **KP6-147** · **Love affair.** The 5th sub lord in the star of a significator of 7 and 11 → it
  materialises; of 6 or 12 → never (6: the other party drops out; 12: the querist drops the idea)
  (p. 200). · CLEAR · HORARY (natal-usable)
- **KP6-148** · **Invalid child.** The 5th sub lord in the star of a significator of 3 and 5 → recovers;
  star lord signifies 10 and is connected with Saturn → ever sickly (p. 200). · CLEAR · HORARY
- **KP6-149** · **Progeny promise.** All three must hold: the 5th sub lord (i) not retrograde, (ii) not in a
  retrograde planet's star, (iii) a significator of 2, 5 or 11. The 11th cusp = the spouse's 5th:
  the same test shows the spouse's fertility. 5 yes / 11 no → children elsewhere; 5 no / 11 yes →
  the wife has "natural children"; both no → both sterile → adoption (pp. 201–203, 219–220).
  Example no. 175: the husband's 5th sub lord Jupiter signifies none of 2/5/11 → sterile; the
  11th sub lord Jupiter signifies the 8th (the wife's 2nd) → she can conceive; her 2-5-11 =
  5-8-11; RPs → Ke-Ve-Ju; Sun transit 22-10-1971 (pp. 201–204). Example no. 247 (26-3-1969): the
  5th and 11th sub lords are both retrograde Jupiter → both sterile (p. 220). · (B6 pp. 201–204,
  219–220) · VERIFIED-ON-FIGURE (figs. B6.29, B6.30, B6.36) · HORARY + COMPUTABLE (natal-usable
  on the natal 5th/11th) · B3-63 (B3 p. 438): the 5th sub lord signifying 1, 4 or 10 (12th to 2, 5, 11)
  → never a child (a complementary denial test).
- **KP6-150** · **Child-birth query, traditional-style reading (1965).** A number within 108 (28 →
  Cancer 0°–3°20'). The lagna lord Moon aspects the lagna → the lagna is strong; Moon in
  Uttarashadha, Jupiter sub → a child query. Order of strength (a)–(f) as in KP6-021, applied to
  2, 5, 11 → Sun, Venus, Saturn. RPs Venus, Sun, Saturn → Su-Ve-Sa (17-3-68 … 14-5-68), a Krittika
  day. Western progressions "coincide" (pp. 204–208). · VERIFIED-ON-FIGURE (fig. B6.31) · HORARY
  · Mixed method: lagna and aspects in the traditional manner plus KP significators; the
  outcome is not reported.
- **KP6-151** · **"Any child at all?" (no. 247, 31-8-1969).** The Moon in a barren sign in Ketu's star →
  child query. Male querist: judge the 11th first, then the 5th. The 11th cusp's sub lord is an
  occupant of the 12th → denied; the 5th cusp is in barren Leo, Sun's sign, in the star of a
  planet in the 12th from the 5th → denied; the lord of 2 is spoiled → no child (pp. 209–210). ·
  VERIFIED-ON-FIGURE (fig. B6.32) · HORARY
- **KP6-152** · **Twins.** The 11th sub lord in the star of Mercury, or of a planet in a dual sign (Gemini,
  Sagittarius, Pisces) → more than one child. Use the house of that conception (1st child 5th,
  2nd 7th, 3rd 9th …) (p. 213). · CLEAR · HORARY · Odd: here the 11th cusp, but the 5th elsewhere.
  Recorded as printed.
- **KP6-153** · **Pregnancy.** The 5th sub lord in the star of a significator of 2, 5 or 11 that sits in a
  fruitful sign → pregnant. Sub lord and star lord both in barren signs → not pregnant (p. 213).
  · CLEAR · HORARY
- **KP6-154** · **Date of delivery (RPs only).** Query lagna Sagittarius, Moon in Dhanishta (Mars) in
  Capricorn, a Wednesday → RPs Jupiter, Mars, Saturn, Mercury; Mercury is rejected (in the star of
  retrograde Mars); retrograde Mars kept because it is direct by November. The Sun enters Scorpio
  (Mars) → Jupiter star (the lagna lord is the strongest RP) → Mars sub on 18-11-1969, a Tuesday;
  the Moon in Jupiter's star confirms (pp. 211–212). Same query as no. 100 (2-7-1969, Bombay):
  Ketu in the lagna and Mars aspecting → caesarean; Jupiter in the lagna → no danger to life
  (p. 212). · VERIFIED-ON-FIGURE (fig. B6.33) · HORARY
- **KP6-155** · **Hour of birth (no. 245, Calcutta, 9-9-1969).** The RPs and significators give Mercury,
  Moon, Saturn → the Sun in Mercury sign / Moon star (Hasta) → 4/5-10-1969; the Moon at Cancer /
  Pushya / Saturn sub / Mercury sub-sub = 3°41' Cancer → 2:50 AM IST (a son was born at 2:50 AM,
  26 days after the prediction; the doctors had said 27-9-1969) (pp. 214–218). The note on
  p. 216: "nodes, firstly, give the results of the planets with which they are conjoined and,
  secondly, the results of the lord of the sign". · VERIFIED-ON-FIGURE (figs. B6.34, B6.35) ·
  HORARY
- **KP6-156** · **Adoption.** A child goes in adoption if the sub lord of the *child's* 4th cusp is in a dual
  sign (or is Mercury) and signifies the 8th (legacy; 12th from the father). The 4th, not the 9th,
  because "maternity is sure and paternity is not" (pp. 220–221). Example no. 247 (26-3-1969): the
  friend's first child → lagna = 3rd; its 4th and 8th = 6th and 10th; the 6th sub lord Moon is in
  Gemini and signifies 10 → adoption; Ra-Mo-Ke; Sun transit 22-8-1970 (pp. 220–221). ·
  VERIFIED-ON-FIGURE (fig. B6.36; the text's "6th cusp 11°17' Leo" should be 17°17', as the
  chart prints) · HORARY
- **KP6-157** · **Lottery.** The 11th sub lord and its star lord are direct, and the sub lord signifies 2, 6
  or 11 → wins. Remove the significators of 5, 8, 12 (the opponent's 2, 6, 11); intersect the rest
  with the RPs → Mercury, Jupiter, Ketu → Me-Ju-Ke; Sun at 19° Pisces (Jupiter / Mercury / Ketu)
  on 5-4-1971 (pp. 222–225). · VERIFIED-ON-FIGURE (fig. B6.37) · HORARY
- **KP6-158** · **Which relative will gain.** Use the relative's derived house. Choose the relative whose
  *birth* ruling planets match the lords of the sign, star and sub of that relative's cusp (the 7th
  cusp: Mars / Venus / Rahu → wife, partner or second child, whichever was born under those RPs)
  (pp. 225–227). · CLEAR · HORARY · Introduces "birth RPs of a person" = the lords of their birth
  day, star, sign and lagna.

### VI house
- **KP6-159** · **Overdraft and borrowing.** Houses 2, 6, 10. Promise: the 6th cusp's sub lord and its star
  lord are direct (a node star lord is not retrograde) (pp. 228–230). The manner comes from the sub
  lord's planet (KP6-064). The lender comes from the house the sub lord occupies: younger sibling
  2 & 6; mother 3 & 6; children 4 & 6; wife, partner or dealer 6; father 8 & 6; elder sibling or
  friend 10 & 6 (pp. 231, 240). Within a month → time by the Moon's transit through the strongest
  RP's star (borrowed on 20-7-1969, Moon in Magha) (pp. 230–231). · VERIFIED-ON-FIGURE (figs.
  B6.39, B6.40) · HORARY
- **KP6-160** · **Repaying loans or investing.** Promise: the 12th cusp's sub lord and its star lord are
  direct. Manner by the sub lord's planet; Saturn aspecting → partial or in instalments
  (pp. 231–232). Example no. 20: instalments in Me-Mo-(Sa, Me, Ke), dates by Sun transit
  (22-1-1970 … 25-7-1970) (pp. 232–233). · VERIFIED-ON-FIGURE (fig. B6.41) · HORARY
- **KP6-161** · **Recovering money lent or entangled.** Use the 6th cusp (the giver is the 7th; giving is
  the 12th from the giver, i.e. the 6th). The same direct-motion test and manners (Jupiter
  ill-placed → court; Mars → threats, "even Goondas"; Venus → compromise) (pp. 238–239).
  Example no. 237 (+ 78 within 108): the 6th cusp is in Ketu's star, Mars sub; Ketu = Jupiter
  (conjoined) → Sun (star) → Mercury (sign) → law suit, Government, instalments; Mo-Ra-Sa-Mo
  24-9-1969 and Mo-Ra-Ke-Mo 30-12-1969 (pp. 240–242). · VERIFIED-ON-FIGURE (fig. B6.44) · HORARY
- **KP6-162** · **Theft: what each cusp shows.** The ascendant's sub lord shows what the querist wants to
  know; the 7th = the thief; the 2nd = the article; the 11th sub lord = recovery; timing =
  significators of 2 and 11. Recovery time by the Moon transiting the RP-ruled point; the hour by
  the rising sign (p. 234–235). Example no. 132: the 11th sub lord Ketu is in the star of the Sun
  (10th, owning 11) → recovery on 24-8-1969 afternoon (p. 235). · VERIFIED-ON-FIGURE (fig. B6.42)
  · HORARY
- **KP6-163** · **Profile of the thief.** The 7th cusp's sub lord gives age and sex (Saturn in a masculine
  sign, Sun sub → elderly male servant). If a significator of 7 also signifies: 1 → a familiar
  person "with an impression for honesty"; 2 → a family member; 3 → a neighbour, younger brother or
  messenger; 4 → someone living in the same house or compound; 5 → own children, a visiting
  musician, a lover; 6 → a servant, sick person or open enemy; 8 → a stranger or occasional worker;
  9 → an absolute stranger from elsewhere, possibly a religious man in disguise; 10 → a
  respectable person or businessman; 11 → a friend, elder brother or trusted helper; 12 → a
  professional thief or beggar (pp. 235–236). Bonatus's Western age rules are quoted (p. 235). ·
  (B6 pp. 235–237) · CLEAR · HORARY
- **KP6-164** · **Where is the thief.** A significator in the sub of a planet in a kendra → in the same
  place; in the 3rd → nearby; in the 9th → far away. Significators of 1 and 7 under the same sub
  lord → the person who accompanied the querist is the thief (the buffalo story) (p. 237). The
  houses of the thief for other owners (wife → from the lagna; brother → 9th; mother → 10th; son →
  11th; maternal uncle → 12th; father → 3rd) and a Western-style whereabouts list are given on
  pp. 243–244. · (B6 pp. 237, 243–244) · CLEAR (first part), UNCLEAR (p. 244 whereabouts mix
  "lord" language from tradition) · HORARY
- **KP6-165** · **Recovery of lost property.** Significators of 2, 6, 11 (counted from the owner's house)
  agree with the RPs → recovered; RPs tied to 5, 8, 12 → lost for good. Recovery comes in the
  conjoined period of the 2-6-11 significators. Working backwards: the period of the theft
  belongs to significators of 5, 8, 12; the dasa lord is usually the same at loss and recovery
  and then signifies a mixed pair (5 & 2, 5 & 6, 8 & 11, 11 & 12) (p. 244). · CLEAR · HORARY
- **KP6-166** · **Settlement of a strike (Air India, 1966).** A number within 108 (80 → Purvashadha pada
  4). The Moon in Venus's star, Saturn sub → strike; Venus rules 6 and 11 → dispute then
  compromise. Rahu in Taurus represents Venus. Timing by the Moon's star/sub transit: agreement on
  Wednesday 6-4-1966 between 8:14 and 11:14 PM, Venus sub-sub at 9:44 PM; work resumed on
  Thursday (pp. 245–249). · VERIFIED-ON-FIGURE (fig. B6.46) · HORARY · Shows minute-level timing
  by the Moon's sub: duration in a sub = (years/120) × the Moon's time in the star.

### VII house
- **KP6-167** · **Can I "buy" (bribe) him?** The 7th sub lord in the star of a significator of 11 → yes; of
  5, 8, 12 → takes the money but does not oblige (p. 250). · CLEAR · HORARY
- **KP6-168** · **Marriage, no. 74 (Delhi, 13-8-1969).** The 7th cusp 14°53'20" Capricorn, Moon star,
  Jupiter sub; Jupiter in the 2nd → marriage promised. Significators of 2, 7, 11 by the order of
  strength; RPs (Wednesday, Ashlesha, Cancer, lagna Leo; Ketu conjoined with Mercury, Rahu aspected
  by Mercury) → Me-Ra-Mo; Rahu's transit through its own star / Venus and Ketu subs; Sun at Venus
  sign / Moon star / Rahu sub → 25-5-1970 (pp. 250–254). · VERIFIED-ON-FIGURE (figs. B6.12,
  B6.47) · HORARY
- **KP6-169** · **Reunion with husband (9-6-1966, 12:05 AM).** Houses 2, 7, 11; significators by the five
  levels → Saturn, Mercury, Jupiter, Rahu. The Mars dasa (Mars in the Moon's star, Jupiter sub;
  the Moon rules 12) is not helpful. Rahu (Sun's star = lord of 1; Jupiter sub = lord of 5 and 8)
  → Rahu dasa; RPs Jupiter, Sun, Mars, Saturn; Rahu "reflects" Sun, Mars (conjoined) and Saturn
  (aspect) → Ra-Ra-Ra-Ju; Sun in Purvabhadra on Thursday 15-3-1968 (they lived together after)
  (pp. 255–259). · VERIFIED-ON-FIGURE (fig. B6.48) · HORARY
- **KP6-170** · **"Will my husband join me?" (no. 1, Delhi, 4-8-1969).** Join = 11-7-6; separation =
  12-7-6. The 11th cusp's sub lord Venus is in the star of Rahu (12th) but also signifies 2, 3, 7
  → separation and reunion both; Ke-Me-Mo-Ve, July 1970 (pp. 259–260). · VERIFIED-ON-FIGURE (fig.
  B6.49) · HORARY
- **KP6-171** · **Partnership: continue or break.** The 7th sub lord connected with 6 and 12 → break; with
  5 and 11 → permanent. A significator of 6 → the partner breaks it; of 12 → the querist leaves. A
  retrograde sub lord → attempts at separation that do not succeed. Manner: Venus smooth and
  friendly; Mars violent; Jupiter by compromise or court; Mercury by notice and instalments
  (pp. 262–264). Example no. 156 (19-2-1969): the 7th sub lord Rahu is in Saturn's star (5th) in a
  direct Venus sub (5th) → it continues. The partnership ends with life in Me-Ke-Ju (badhaka 9th
  for the fixed lagna) (pp. 260–264). · VERIFIED-ON-FIGURE (fig. B6.50) · HORARY · The text also
  works out the alternative numbers 137 and 7 (p. 263); both checked against the table.
- **KP6-172** · **Separation and death of relatives (derived house pairs).** Separation from mother 3 & 12,
  her death 3-5-10-12; from children 4 & 12, death 4-6-11-12; from partners 6 & 12, death
  1-6-8-12; from father 8 & 12, death 8-10-3-12; from elder brother 10 & 12, death 5-12-10; from
  family 1 & 12; leaving the residence for a nearby place 3 & 12; a distant place 9 & 12 (p. 264).
  · (B6 p. 264) · CLEAR as printed · GUIDANCE (natal-usable; derived as "12th and marakas from
  the relative's house") · Several of these sets do not follow the "2nd/7th from the relative =
  maraka" logic exactly (e.g. mother's death 3-5-10-12 adds the 3rd = 12th from the 4th). Show them
  as printed.

### VIII house
- **KP6-173** · **Dowry.** The 8th sub lord in the star of a significator of 6 and 11 → receives; a
  significator of 5 and 12 → the querist gives. The amount follows the dignity of the star lord of
  the 11th sub lord (KP6-027) (p. 265). · CLEAR · HORARY
- **KP6-174** · **Chastity.** Neither the 7th sub lord nor its star lord is Mercury or in a dual sign, and the
  11th sub lord is in the star of a significator of 7 → chaste. The 11th sub lord in the star of a
  significator of 6 → the other sex stops him (p. 266). · CLEAR · HORARY
- **KP6-175** · **Scholarship and donation.** The 11th sub lord in the star of a significator of 2, 6, 11
  and not of 8 or 12 → keeps the scholarship; with 8 or 12 → has to repay. Donation: 2-6-11; the 8th
  sub lord in the star of a significator of 6, and the 6th sub lord a significator of 2, 6 or 11
  (pp. 266–267). · CLEAR · HORARY
- **KP6-176** · **Legacy by will (no. 43).** The uncle = the 11th from the 9th = the 7th. The 8th cusp's sub
  lord Moon is in the star of Mars, owner of the 6th → he must give (p. 267). · VERIFIED-ON-FIGURE
  (fig. B6.51) · HORARY · Date of judgement not printed (planets match late December 1967).
- **KP6-177** · **Suicide and murder.** Suicide: the 8th sub lord in the star of a significator of badhaka or
  maraka and of 8, and that star lord connected with Mars. Murder: the querist's ascendant sub lord
  in the star of a significator of the *victim's* badhaka or maraka (counted from the 7th) and of the
  querist's 2nd; the sign, star and sub lords of the 7th cusp = the victim's ruling planets
  (pp. 268–269). · CLEAR · HORARY

### IX house
- **KP6-178** · **Whereabouts of father (no. 139, 24-7-1969).** He left in a period of significators of 3, 9,
  12 counted from the 9th (= 11, 5, 8): Ju-Sa-Ke-Ra in April/May 1963 (he left on 9-5-1963). Return:
  2, 8, 11 from the 9th (= 10, 4, 7) → Ju-Su-Ve-Ma, 4th week of July 1971; RPs (Leo lagna in
  Purvaphalguni, Moon in a Venus sign, Jupiter star) select the Sun bhukti (pp. 269–271). "For any
  action … the 12th house therefrom is to undo it" (p. 270). · VERIFIED-ON-FIGURE (fig. B6.52;
  "Mer. 7°29'" in Virgo is Uranus) · HORARY
- **KP6-179** · **Going overseas (no. 57, Delhi, 7-8-1969).** The 12th sub lord (Ketu) and the 9th sub lord
  (Jupiter) both occupy the 3rd → long journey and life abroad promised. Significators of 3, 9, 12
  not in a sub of a 3/9/12 significator are "not useful to make the journey". RPs → Mo-Me-Ve-Ju,
  1-11-1971 (pp. 271–273). · VERIFIED-ON-FIGURE (fig. B6.53; the text's "12th cusp 10-20 of
  Taurus" should be 20°20', as printed in the chart) · HORARY

## G. Traditional rules quoted only to be rejected

- **KP6-180** · **Prasna Gnana (Bhattotpala).** The ten planetary states (Deeptha, Swastha, Pramudhita,
  Santha, Saktha, Prapeeditha, Dheena, Kala, Vikala, Bheedhi), each with Krishnamurti's caveat "(not
  always)" or "it depends on the lord of the constellation and the lord of the sub" (pp. 40–43).
  Seating directions; sincerity tests from the lagna; several questions asked at once (1st from
  the lagna, 2nd from the Moon, 3rd from the Sun …); fixed/movable/common lagna effects; war and
  litigation slokas; marriage by the Moon aspected by Jupiter in 3/6/7/10/11; sex of the child;
  taste, dreams, rain, theft stature; the shadow and gunakara timing; first-syllable lagna
  (pp. 39–52). · (B6 pp. 39–52) · CLEAR · REJECTED-TRADITION · The caveats are explicit for the ten
  states. The rest is presented as "the translation" before "my discovery" (p. 39).
- **KP6-181** · **Uthrakalamritha horary.** Natal and horary give the same result; number ÷9 → sign and
  navamsa; a birth chart rebuilt from the flowers or money brought × the number ÷12 → Jupiter's sign,
  and Jupiter cycles → age; the query's subject from the lagna sign; exalted significator →
  immediate, own sign → days, friend's sign → months; Aruda lagna; Sthula and Sukshma Moon;
  number ÷5, ÷60 … → time (pp. 53–58). · (B6 pp. 53–58) · CLEAR · REJECTED-TRADITION (method
  replaced; p. 82 calls the Hindu horary "unscientific")
- **KP6-182** · **Shatpanchasika (Prithuyasas).** Fixed lagna → gains position, no journey; movable → the
  opposite; dual → mixed. The enemy's arrival from the lagna and the Moon's sign quality; return in
  as many months as the house number of the strongest planet; return when the 7th lord turns
  retrograde; lost article at the gate/middle/backyard by the lagna decanate; Saturn in odd houses
  → a male child (pp. 58–66). · (B6 pp. 58–66) · CLEAR · REJECTED-TRADITION
- **KP6-183** · **Jinendramala and Padmaprabhusuri.** Planet and sign keyword lists (places, crops, animals,
  colours, timings: Saturn/nodes 1 year, Sun 6 months …). Rejected outright: "lord of lagna or lord
  of 11 in the 11th → gain. Stellar Astrology disproves this rule"; lord of 5 in 8 → difficult
  delivery (in practice: lord of 5 in 5 in the star of the lagna lord caused a caesarean);
  "Constellation theory alone will prove to be successful"; "the whole thing is general" (pp. 67–70).
  · (B6 pp. 67–70) · CLEAR · REJECTED-TRADITION
- **KP6-184** · **Western horary (Simmonite, Hone, Zadkiel, Lilly).** The time to erect the figure (moment of
  anxiety, question or reading); the ruler of the 1st and the ruler of the quesited house judged by
  aspects; orbs (Sun and Moon 15°, Saturn and Jupiter 9°, others 7°; half the sum); timing by the
  degrees between significators; distance by latitude and the sign quality (pp. 71–81). "However
  much one may master their system, one cannot give such a clear and precise answer" (p. 81). ·
  (B6 pp. 71–81, 153, 163–164, 168, 172, 181) · CLEAR · REJECTED-TRADITION
- **KP6-185** · **Strength doctrines and remedies.** "Hindus are of opinion that strong planets will offer
  invariably advantageous results … In practice, it is found to be ABSURD" (p. 154): an exalted
  Jupiter in a Cancer lagna can harm in its dasa. Exaltation is not auspicious in itself and
  debilitation is not inauspicious (p. 154). Wearing the gem of the *malefic* planet to appease it is
  "wrong and actually doing harm" (p. 328). The prenatal epoch "is not reliable" (pp. 150, 269).
  Traditional rectification by Vighati arithmetic gives many candidates (pp. 149–150). The shadow
  measurement for the query time does not work at many latitudes (p. 69). · (B6 pp. 69, 149–150,
  153–154, 269, 328) · CLEAR · REJECTED-TRADITION

## H. More question rules (IX–XII houses, electional)

- **KP6-190** · **Study abroad (no. 87, Bombay, 17-7-1969).** Going abroad: the 12th sub lord and its star
  lord are direct and the sub lord signifies 3, 9 or 12 (p. 274). Success in higher studies: the 11th
  is connected with the 9th and the 11th sub lord is not retrograde (pp. 273, 275). Saturn in the 9th
  aspecting 11 (3rd aspect) and 6 (10th aspect) → scholarship (p. 274). RPs → Ke-Ra-Sa, 25-3-1970
  (Saturn is stronger than the Sun as an RP) (pp. 273–275). · VERIFIED-ON-FIGURE (fig. B6.54) ·
  HORARY
- **KP6-191** · **Medical examination (no. 147).** Houses 4 (being examined = 10th from the 7th), 7 (the
  doctor), 11 (a good certificate). The 4th sub lord Rahu, aspected by Venus (a significator of 11,
  7, 12) → he will appear. Rahu in Saturn's sign → more than one appearance. A defect is shown by
  the 12th (Venus, in the Sun's star, Moon sub → left eye), but the significators in the 11th → he
  passes (pp. 276–277). · VERIFIED-ON-FIGURE (fig. B6.55) · HORARY
- **KP6-192** · **Overseas (no. 127, same moment as no. 147).** The 12th cusp is in the Sun's star, Venus sub;
  Venus is in the Sun's star, Moon sub; the Sun and Moon are in the 12th → must go. Passport and
  visa in Mo-Mo-Me; travel in Mo-Mo-Ke (Ketu in a Sun sign, Venus star, conjoined with Venus,
  stronger than Venus); leaves on 28-12-1969 (pp. 277–279). · VERIFIED-ON-FIGURE (fig. B6.56) ·
  HORARY
- **KP6-193** · **Research (no. 203).** The 11th cusp 29°05' Scorpio, Mercury star, Saturn sub, none
  retrograde. The star lord of a planet in the 12th placed in 1, 2, 3, 6, 10 or 11 → success
  abroad, otherwise loss. Significators of 9 and 11 → Ra-Ve-Su-Ma; success in mid-February 1973
  (pp. 279–283). The working shows the Sayana chart (fig. B6.57) and the Nirayana chart (fig. B6.58)
  side by side. · VERIFIED-ON-FIGURE (fig. B6.58; the text's "Latitude 8°55'" and "ayanamsa 25°20'"
  are misprints for 18°55' and 23°20') · HORARY
- **KP6-194** · **Transfer (no. 47).** Houses 3, 10, 12; leave or tour 3, 9, 12. RPs (Wednesday, Moon sign Mars,
  Moon star Ketu, lagna Libra + Rahu with Venus) → Ke-Me-Ra (Rahu represents the lagna lord, so it
  is the strongest); the Sun in Ketu star / Rahu sub on 24-4-1971 (pp. 283–285). · VERIFIED-ON-FIGURE
  (fig. B6.59) · HORARY
- **KP6-195** · **Overseas from the same chart as a promotion (no. 125).** Judge 3, 9, 12. A node gives the
  result only if it is not "in the sub of the planet in a fixed sign" (Rahu rejected). Mo-Ju-Mo,
  October/November 1974 (p. 294). · VERIFIED-ON-FIGURE (fig. B6.64) · HORARY
- **KP6-196** · **Foreign assignment, mode of travel, settling.** If a significator of going abroad also
  signifies 6 → abroad on a service assignment (p. 311). The 9th sub lord fast-moving → short
  journey, by air; slow-moving in a watery sign → by sea (p. 313). The 12th sub lord in a common
  sign → goes and comes back; movable → settles permanently abroad; fixed → will not move
  (p. 313). Example no. 17 → Ke-Ra-Sa, 28-4-1971 (pp. 310–313). · VERIFIED-ON-FIGURE (fig. B6.72) ·
  HORARY (natal-usable as guidance)
- **KP6-197** · **Passport, settling abroad, premier.** The 11th sub lord in the star of a significator of
  3, 9, 11 → passport; of 11 and 2 → will live abroad; of 3, 9, 12 → will go abroad; of 9, 10, 11 and
  connected with Mars and Jupiter → premier, "applicable to get any position" (pp. 330–331). ·
  CLEAR · HORARY

### X house
- **KP6-198** · **Job.** Houses 2, 6, 10; significators by the four levels plus node agency; intersect with the
  RPs (Mars, Venus, Jupiter + nodes). Desire fulfilled quickly because fast planets occupy and own
  the 11th; Ra-Ra-Ra → the Sun in Shatabhisha / Ketu sub on 1-3-1970 (pp. 285–287). ·
  VERIFIED-ON-FIGURE (fig. B6.60) · HORARY · **Inconsistency:** the chart is dated 27-7-1969 (a
  Sunday) but the RPs use "Tuesday" and the dasa is counted "from 22-7-1969" (a Tuesday). The
  judgement was probably on 22-7-1969.
- **KP6-199** · **Nature of the job from the 10th cusp.** The sign, star and sub lords of the 10th cusp (5°09'
  Gemini → Mercury / Mars / Sun), all in watery signs → quick understanding. Sun = Government; Mars +
  Mercury = mechanical engineering → "a Mechanical Engineer in Government" (alternatives: a Government
  printing press; a surgeon) (pp. 287–288). · CLEAR · COMPUTABLE (pointer: the 10th cusp's
  sign/star/sub lords; natal-usable; B3 has the same method) + GUIDANCE
- **KP6-200** · **Will I earn at all?** A retrograde 10th sub lord → never earns. Example no. 71: the 10th sub
  lord Moon (never retrograde) → will earn. Significators of 10 + RPs → Sun transits the Moon's
  position on 9-3-1970; takes charge at 12:10 PM. Business: paints, petrol or pump-sets (Moon =
  liquids, Saturn = mine products, Mars sign) (pp. 288–290). "Urge comes to one at the time when
  Moon touches the most sensitive point of the zodiac" (p. 289). · VERIFIED-ON-FIGURE (figs. B6.61,
  B6.62) · HORARY
- **KP6-201** · **Politics/statesman (no. 1, Delhi, 10-5-1969).** The 5th = the desire. The 5th cusp's sub lord
  and star lord are both Mercury, in the 2nd, in the star of the lord of 5 in 11 → success after
  success. A Saturn dasa in a retrograde-Jupiter sub tempts but does not fulfil. Mercury dasa in
  38 years. Saturn in the lagna → patience is needed (pp. 290–293). · VERIFIED-ON-FIGURE (fig.
  B6.63) · HORARY
- **KP6-202** · **Promotion (no. 125, 10-7-1969).** Houses 2, 6, 10, 11 → Su-Ke-Ju or Su-Ve-Ju; transit favours
  the first week of June 1970. The significators of the profession (Venus, Moon, Jupiter, Mercury) →
  finance adviser, auditor or accountant; next rise Mo-Ju-Ve, July 1974 (pp. 293–294). ·
  VERIFIED-ON-FIGURE (fig. B6.64) · HORARY
- **KP6-203** · **Prosperity of an institution (no. 5, 21-9-1968).** Judge an institution like a person. The
  11th sub lord Venus is in the 6th → success. The 6th = donations received. Saturn-Ketu periods →
  organisational change; deaths of organisers predicted in Ve-Sa-Ke (September 1971) and Ve-Ke-Sa
  (July 1977) (pp. 294–296). · VERIFIED-ON-FIGURE (fig. B6.65) · HORARY
- **KP6-204** · **Promotion test (no. 247, 1-7-1969).** The 11th sub lord and its star lord are direct, and the
  sub lord signifies 2, 6, 10 or 11 → promised; all three conditions are a must (p. 297). Significator
  table F067; RPs Mars, Saturn, Sun → Mars dasa, Sa bhukti, Su antara, July 1982; Saturn as lord of 12
  in the lagna → frustrating delays (pp. 297–300). "Anything in life which is promised … will be
  experienced when dasa-bhukti of the common planets between significators and ruling planets
  operates" (p. 299). · VERIFIED-ON-FIGURE (figs. B6.66, B6.67) · HORARY
- **KP6-205** · **Higher status (no. 248, Delhi, 6-10-1969).** The 11th cusp's sub lord Rahu (in the 12th, in
  the star of Jupiter in the 6th, representing the vacant 11th's lord) signifies 6, 11, 12 →
  selected against competition (6) with a change in the nature of the work (12); no 3rd → the same
  place. Me-Me-Ma-Ju → 28-1-1970 (pp. 300–301). · VERIFIED-ON-FIGURE (fig. B6.68) · HORARY
- **KP6-206** · **Seniority (nos. 184 and 75, 8-8-1969, Delhi).** The 11th cusp 8°36' Scorpio, Saturn star,
  Venus sub; Venus is in the star of Rahu (in 2) and rules 10 → redressed. 184 → Ma-Ra-Ve-Sa
  21-11-1969; 75 → Ma-Ra-Sa-Sa 10-1-1970 (pp. 302–303). · VERIFIED-ON-FIGURE (fig. B6.69) · HORARY
  · Text misprints: "28°53'23"" for 25°53'20"; "9-8-1969" for 8-8-1969.
- **KP6-207** · **Change of occupation: houses 3, 5, 9 = the 6th, 8th, 12th from the 10th** (negation of the
  10th) → change of job, leave, temporary absence (p. 306). Example no. 144: lord of 10 in 11 with
  the lords of 5 and 9 → change; Mars and Rahu (the Sun's star and sub lords) signify 2, 6, 10, 12, 1
  and 3, 4, 5, 6 → gain; Mo-Su-Ju, 12-1-1970 (pp. 303–308). The table of significators by level
  (a)–(d) printed on p. 307 uses the four-level layout of KP6-021. · VERIFIED-ON-FIGURE (fig.
  B6.70) · HORARY + COMPUTABLE (the "12th from a house negates it" principle is general)
- **KP6-208** · **Reinstatement.** The star lord of the 10th sub lord signifies 2, 6 or 10 → reinstated; if it
  signifies 1, 5, 9 or 12 and not 2, 6, 10 → never (p. 309). Example no. 49 → Ma-Ra-Ke-Ra, third week
  of September 1969 (pp. 309–310). · VERIFIED-ON-FIGURE (fig. B6.71) · HORARY
- **KP6-209** · **Change of business place (no. 69).** The 4th sub lord (the present residence) with its star
  lord in 10 and the sub lord in 12 → will move, for professional reasons. The 3rd cusp's sub lord a
  significator of 2, 10 or 11 → gain after the move; of 8 and 12 → losses. "Applicable both to the
  natal and Horary chart". The 12th cusp's sign → place (Gemini, Rahu star, Jupiter sub → a twin city:
  Hyderabad–Secunderabad). Mercury → more than one move (pp. 313–316). · VERIFIED-ON-FIGURE (fig.
  B6.73) · HORARY (natal rule explicitly stated) · The text's "Saturn sub" for no. 69 is wrong
  (Venus sub). The date of judgement is not printed (the Mercury bhukti starts after 7-6-1968).
- **KP6-210** · **Own press.** The 10th sub lord in the star of a significator of 2, 6 or 10, connected with Mars
  and Mercury (p. 316). · CLEAR · HORARY
- **KP6-211** · **Spiritual life.** The 11th sub lord in the star of a significator of 5 (initiation) and 10
  (practice) → siddhi (p. 317). · CLEAR · HORARY (natal-usable)
- **KP6-212** · **Sanyasa.** The ascendant's sub lord connected with 3, 10, 12 and with Saturn (p. 317). ·
  CLEAR · HORARY (natal-usable)
- **KP6-213** · **Re-appointment.** As a new appointment: the 6th sub lord in the star of a significator of 6, 10
  or 2 → yes; of 1, 5, 9, 12 → no (p. 317). · CLEAR · HORARY
- **KP6-214** · **Cure? (no. 249, 13°04'N, 9-4-1969).** The 6th cusp is in a Sun sign, Venus star, Jupiter sub →
  the disease from Mercury, Rahu, Venus = "nervous type of leprosy". The 11th sub lord Ketu is in the 6th
  → no cure, treated at home (pp. 317–318). · VERIFIED-ON-FIGURE (fig. B6.74) · HORARY

### XI–XII houses
- **KP6-215** · **Missing son (no. 19, 25-12-1967).** Leaving = 3 and 12 from the relative's house (+7 for
  aimless wandering); worked backwards → Mo-Sa-Ra when he ran away (7-5-1963). Return = 2 (family), 8
  (4th from the 5th), 11 (reunion) → Ma-Ra-Me (3-11-1968 … 25-12-1968). RPs → Moon sookshma, lagna in
  Ardra (pp. 319–320). · VERIFIED-ON-FIGURE (fig. B6.75) · HORARY · The text's return date "6-12-61"
  must be 6-12-1968 (inside the Ma-Ra-Me window).
- **KP6-216** · **When will the astrologer answer?** The querist's 7th = the astrologer. The 7th sub lord
  fast-moving → judged at once; slow → delayed; Mercury involved → the querist comes again (p. 322).
  · CLEAR · HORARY
- **KP6-217** · **Imprisonment.** Houses 2, 3, 8, 12; Rahu is the karaka for jail. All three must hold: the 12th
  cusp's sub lord (i) **is Rahu**, (ii) is not in a retrograde planet's star, (iii) signifies 2, 3, 8 or
  12 (p. 323). Example no. 208: the 12th sub lord Rahu is in retrograde Saturn's star → never
  imprisoned (pp. 321–324). · VERIFIED-ON-FIGURE (figs. B6.76, B6.77; the second chart is printed
  "29-11-1969", but the judgement was on 29-11-1968, p. 321) · HORARY (natal-usable as research)
- **KP6-218** · **Income-tax prosecution.** The sub lord of the relevant house ("[illegible] house") signifies
  7, 8, 12 → prosecuted (p. 324). · UNCLEAR (house number illegible) · HORARY
- **KP6-219** · **Raid.** The 12th cusp's sub lord a strong significator of 12 → loss of reputation and money.
  The informant comes from the sub lord's house pair: 3 & 6 brother/neighbour, openly; 3 & 12 the same,
  secretly; 6 & 12 servants; 11 & 12 a friend or elder brother; 9 & 12 the father or a stranger;
  4 & 12 someone in the same house, street or town; 7 & 12 a partner or estranged wife (p. 325).
  Example no. 90 → Ke-Ke-Su/Mo, Sun transit 10-9-1984 (pp. 324–328). · VERIFIED-ON-FIGURE (fig.
  B6.78; the lagna is printed "7-32-20", but no. 90 starts at 7°33'20" Leo) · HORARY
- **KP6-220** · **Longevity (quick check, raid example).** No planet in the 8th, its lord aspects the 8th →
  long life (p. 327). · CLEAR · GUIDANCE (traditional-style check; weak)
- **KP6-221** · **RPs and a presented chart.** When someone presents a chart while you judge, its birth star
  agrees with the RPs at that moment (the "Ardra" demonstration) (p. 320). · CLEAR · COMPUTABLE
  (birth-star suggestion)
- **KP6-222** · **Premier / any high position (cross-ref).** Same test as KP6-197: the 11th sub lord in the star of a significator of 9, 10, 11, connected with Mars and Jupiter; the 9th = the kingdom (p. 331). · CLEAR · HORARY
- **KP6-223** · **Gems.** Do not prescribe the gem of a malefic. If the 11th sub lord is in the star of a
  significator of 1, 2 or 11, use the colour or gem of that star lord (Sun orange/gold; Moon
  pearl/pushparagam; Mars coral/ruby; Mercury emerald; Jupiter yellow sapphire/gold; Venus
  diamond/silver; Saturn blue sapphire), bought on that planet's weekday. The gem's star lord must not
  signify 8 or 12. "It is not necessary that the Gems should touch your body" (pp. 328–330). Sayana
  birth-month and Rasi colour tables are given (p. 329). · (B6 pp. 328–330) · CLEAR · GUIDANCE
  (natal-usable)

### Electional (B6-35)
- **KP6-224** · **Employing a servant.** The ascendant not afflicted by significators of 8 and 12; best when the
  ascendant's sub lord signifies 6 and 11 (p. 331). · CLEAR · COMPUTABLE (electional moment chart)
- **KP6-225** · **Buying an article.** The 2nd sub lord in the star of a significator of 6 and 11 (p. 331). · CLEAR ·
  COMPUTABLE
- **KP6-226** · **Selling an article.** The 12th sub lord in the star of a significator of 6 and 11 (p. 331). ·
  CLEAR · COMPUTABLE
- **KP6-227** · **Entering service.** The 6th sub lord in the star of a significator of 10 and 11 (p. 331). · CLEAR ·
  COMPUTABLE
- **KP6-228** · **Signing an agreement.** The 3rd sub lord in the star of a significator of 6 and 11 (p. 332). ·
  CLEAR · COMPUTABLE
- **KP6-229** · **Starting a business; releasing a film.** The 7th sub lord in the star of a significator of 6 and
  11 (p. 332). · CLEAR · COMPUTABLE
- **KP6-230** · **Laying a foundation.** The 4th sub lord in the star of a significator of 11 and not of 5 and 12
  (p. 332). · CLEAR · COMPUTABLE
- **KP6-231** · **Abroad for probation vs promotion.** The 6th sub lord in the star of a significator of 9 and 12 →
  probation, training or education only; of 11 and 6 or 10 → promotion (p. 332). · CLEAR · HORARY
- **KP6-232** · **Choice of deity.** Planets in the stars of significators of 10 and 11, not of 8 and 12 (p. 333). ·
  CLEAR · GUIDANCE

---

### Notes for the engine and UI (summary)

1. **Already in the app:** the 249 table, star and sub lords, Placidus cusps, KP ayanamsa, dasa to 5
   levels, transit ingresses, the significator levels A–D (= KP6-021 levels 1–4, same order).
2. **Smallest new engine pieces, in order of payoff:** (a) rank A > B > C > D in the UI and add the
   "vacant star" flag (KP6-021/022); (b) RPs for any moment and place, with node inclusion,
   retrograde filtering and strength order (KP6-040…045); (c) node agency as a switchable layer, tested
   against F026 and F067 (KP6-023/024); (d) number → ascendant → Placidus cusps by RAMC solve
   (KP6-001/002); (e) the RP-point search on the rising lagna and on Sun and Moon sub ingresses
   (KP6-047…049); (f) the three-condition cusp test with the house-group table (KP6-060/061);
   (g) the rectification assistant (KP6-050).
3. **Do not port:** the B6 "span rule" absence vs the family's span rule must be a visible switch, not
   a silent change. The F030 table (no level C) is an author inconsistency, not a rule.

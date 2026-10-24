# B3 "Predictive Stellar Astrology" (ch. B3-00 … B3-40): rule catalogue (b3a)

Source: `references/KP/vault/B3 Predictive Stellar Astrology/`, PDF pp. 1–360. Every rule
below is paraphrased; short quotes are marked. Citation "B3 p. N" = source-PDF page.
Worked charts mentioned as `b3a-Exx` are in `b3a_examples.json`.

Format: `- **ID** · **Title.** Condition → meaning/procedure · (cite) · grade · status · notes`

- grade: VERIFIED-ON-FIGURE (checked against a page image or by computation from a printed
  chart) / CLEAR / UNCLEAR (why).
- status: EXISTS / COMPUTABLE / GUIDANCE / HORARY / REJECTED-TRADITION.

**ID range.** This file uses KP3-001 … KP3-193 and KP3-200 … KP3-219 (194–199 unused: 213
rules). Agent b3b (B3-41 onward) should not reuse these numbers.

### Quick reference: house groups per matter in B3-00 … B3-40

| Matter | "Yes" houses to be signified | Denial / adverse | Timing procedure in B3 | Rules |
|---|---|---|---|---|
| Health, vitality | 1 (ascendant CSL and its star free of 6, 8, 12) | 6 disease, 8 danger, 12 hospital/isolation | illness: conjoined periods of significators of 1 + 6; cure: sub-period of significators of 11 (and 5) | KP3-035, 063, 091–093, 162–163, 168 |
| Longevity | 1, 8, 3 | maraka 2, 7; 12; badhaka (11th movable, 9th fixed, 7th common lagna) | conjoined periods of the strongest badhaka/maraka significators, then transit | KP3-077–080, 085–087 |
| Wealth | 2, 6, 10, 11 (sub lord a significator of 2, 6 or 11) | 8, 12 (star or sub) | conjoined periods of planet and its sub lord | KP3-095–097 |
| Lottery, competition, litigation | 1, 2, 3, 6, 10, 11 (5 = urge to speculate) | 4, 5, 7, 8, 9, 12 | period lords' transits by star/sub; weekday and Moon-star ruled by them | KP3-104–106 |
| Races / speculation | dasa lord linked with 5 and 2; 6 = opponent's loss | — | Jupiter transiting the dasa lord's sign (and sub) | KP3-107, 120 |
| Borrowing | 2 + 6 (also 10, 11 = receipts) | — | conjoined periods of significators of 2 and 6 | KP3-108, 111–112, 115 |
| Repayment, free from debts | 4, 5, 8, 12 (8th CSL sig of 2, 10, 11 = repays with ease) | 8th CSL sig of 5, 6, 8, 12 = mounting debts; planets in 4/5/8/12 with such subs block repayment | conjoined periods; day/star of the significators | KP3-108–110, 115–116 |
| Contract / agreement | 3, 9 | — | conjoined periods | KP3-116 |
| Theft: recovery (horary) | 2, 4, 11 (11th lord's strength; retrograde 11th lord = temporary loss) | 11th lord direct in 12 with 11 vacant = never | after the 11th lord's station direct, when it transits the star of the 6th lord (12th from 7) in a sub of a 2nd/11th significator | KP3-156–157 |
| Siblings: plurality | 3rd CSL in a dual sign or a dual-sign planet's star | — | — | KP3-127 |
| Siblings: harmony / danger | 3 + 11 + 1 (harmony); 3 + 2 + 11 (co-borns) | 1 + 3, 6, 8 (enmity); 3rd CSL sig of 8 or 10 (danger) | dasa of the sibling's own ruling planets | KP3-129–130 |
| Mother | 4th as her lagna | 4th cusp and Moon in star of sig of 9, 11, 3 with sub of the 4th's badhaka/maraka lord | dasa remains the native's | KP3-132–133 |
| House purchase | 4, 11, 12 (+ 6 or 9 to take possession); acquisition 2, 4, 11; link with Mars | sale 3, 5, 10; lords 4 + 8 = sells; 4 + 12 + Sun = fire/auction | conjoined periods; query-moment ruling planets; Sun/Venus over the query Moon's degree | KP3-134–138, 160, 123 |
| Vehicle | 4, 9, 10, 11 + Venus (4th CSL in star of a 4th significator, linked to Venus) | lords of 6, 8, 12 or Rahu in 4 = hired or others' vehicles | conjoined periods of lords 4 and 6 (loan purchase) + favourable transit aspects | KP3-142–143 |
| Education | 4, 9, 11 (lords of 4 and 9 in sub of an 11th significator) | ends: 3, 5, 8 | dasa lord linked with 4 and 9 | KP3-145–147 |
| Scholarship / paid study | scholarship 4, 6, 11 | paid study 4, 8, 12 | — | KP3-148 |
| Higher study abroad | 9 + 12 with an 11th significator | — | — | KP3-149 |
| Marriage | 2, 7, 11 | 6 (12th from 7) shown in B3; full denial group 1, 6, 10 only in B4 | conjoined dasa/bhukti/anthra of significators, day ruled by them | KP3-151, 026, 065 |
| Partnership ends (horary) | badhaka and maraka of the 7th | — | RP-filtered significators down to sookshma + transit | KP3-153 |
| Overseas | 12th CSL a significator of 3, 9 or 12 (preferably 9) | 12th CSL in 8 (12th from 9) | conjoined periods of significators of 3, 9, 12 | KP3-170–172 |
| Service / profession | 2, 6, 10 | end of service 1, 5, 9 | strongest (node) significators; Moon in their stars on the day | KP3-175, 103 |
| Business vs service | 2nd CSL sig of 1, 7, 10 = business; 1, 2, 6 or 10 without 7 = service | planets in 7 in the star of lords of 8, 12 = bad | — | KP3-051, 177 |
| Farming | 2, 6, 10 with Mars, Venus, Moon, Jupiter | — | conjoined periods of those planets | KP3-150 |
| Retirement | 1, 5, 9 | — | Sun transiting sign of dasa lord / star of bhukti lord / sub of anthra lord | KP3-103, 118 |
| Disease nature | 6th CSL + sign of its star lord + sub | — | — | KP3-165 |
| Blindness | 2 (right eye), 12 (left eye) with Sun, Moon, Venus | — | conjoined periods | KP3-167 |
| Speech | 2nd CSL (planet nature) | node as 2nd CSL or in 2 = defect | — | KP3-169 |
| Place of death | 8th CSL sig 1, 4, 10 = home; 3 = short journey; 9 = far away; 6, 8, 12 = hospital/jail | — | 8th-cusp lords' conjoined periods | KP3-085–087 |
| Change of job | **not stated** in B3-00…40 (only the vault chapter title says "9th house explains"; see B6-33) | — | — | — |

**What "significator of house H" means in B3** (used by every rule below). It means any of:
(1) a planet in the star of an occupant of H; (2) an occupant of H; (3) a planet in the star
of the owner of H; (4) the owner of H (the lord of the sign holding the cusp, B3 p. 354–355;
B3 p. 162). Add (5) planets conjoined with, and (6) planets aspected by, these
(B3 p. 355). Nodes join the list as agents (see KP3-066…069). This matches the app's
existing significator columns A–D plus the extra conjunction/aspect/node steps. "Connected
with H" in B3 is looser: it means any of these, or occupying H's lord's sign, star or sub
(B3 p. 248–249).

**House counting.** B3-06 and B3-10 count lordship by **sign from the lagna sign** (Aries
lagna → Venus = lord of 2 and 7). B3-40 (p. 355) and every chart with cusps use **cusp-based
lordship**: the owner of a house is the lord of the sign holding its cusp, and one planet can
own two houses even when the second cusp barely enters the sign. The app should use the
cusp-based form for natal KP and show the sign-based form only where B3-06 is quoted.

---

## 1. Zodiac, stars, subs (B3-04, B3-13)

- **KP3-001** · **27 stars of 13°20', lords in Vimshottari order.** Aswini (Ketu), Bharani
  (Venus), Krittika (Sun), Rohini (Moon), Mrigasira (Mars), Ardra (Rahu), Punarvasu
  (Jupiter), Pushya (Saturn), Aslesha (Mercury), then the cycle repeats from Makha and Moola.
  Each lord rules 3 stars 120° apart. · (B3 p. 16–21) · VERIFIED-ON-FIGURE (Fig. B3.3,
  B3.10) · EXISTS · App's nakshatra lord = VIM[⌊λ/48000″⌋ mod 9].
- **KP3-002** · **Sign lord modifies, star lord indicates.** "the results of the planets are
  modified by the lord of the sign and indicated by the lord of the Nakshathra." Sign = the
  reflector (strength: exalted, debilitated…). Star = the coloured slide (nature of the
  result). · (B3 p. 21–22) · CLEAR · GUIDANCE · Basis for KP3-017.
- **KP3-003** · **Sub = 9 unequal parts of each star in dasa-year proportion.** Width = years
  × 6⅔′ (800′/120): Sun 40′, Moon 1°06′40″, Mars and Ketu 46′40″, Rahu 2°00′, Jupiter
  1°46′40″, Saturn 2°06′40″, Mercury 1°53′20″, Venus 2°13′20″. The first sub belongs to the
  star lord, then Vimshottari order. · (B3 p. 26–28) · VERIFIED-ON-FIGURE (Fig. B3.6–B3.9) ·
  EXISTS · Text prints Mercury "1°-53'-40"" (should be 1°53′20″). Fig. B3.8 prints Rahu
  "16/120" (should be 18/120). Both are printing errors; the app's table is right.
- **KP3-004** · **249 sign/star/sub units.** 27×9 = 243 subs, but 6 subs straddle a sign
  boundary, so the sign/star/sub triples number 249. "One can sub divide [further] … for
  research students" (sub-sub). · (B3 p. 28) · CLEAR · EXISTS · App's 249-row table and
  sub-sub lord already exist.
- **KP3-005** · **Stars per sign (2¼).** Aries: Aswini, Bharani, Krittika ¼ … Pisces: PBh ¼,
  UBh, Revati. Each sign has 3 star lords. · (B3 p. 30, 156) · VERIFIED-ON-FIGURE (Fig.
  B3.10) · EXISTS.
- **KP3-006** · **Ascendant moves through a star in ~50–58 min; cusps change fastest.**
  Events minutes apart (twins, letters read one after another) differ only by cusp
  sub. · (B3 p. 24) · CLEAR · GUIDANCE · Justifies cusp sub lords as the decisive factor.
- **KP3-007** · **Constellation over sign.** "The sign is not very important. The house
  occupied by a planet should be judged, taking in which constellation the planet is
  posited." · (B3 p. 157) · CLEAR · GUIDANCE.
- **KP3-008** · **Transit through a star: star lord = what, sub lord = good or bad.** A
  transiting planet brings the matters signified by the lord of the star it is in, through
  the source the transiting planet signifies (nature, lordship, occupation). The sub lord
  decides favourable or not. The star lord is like the dasa lord, the sub like the bhukti.
  · (B3 p. 25) · CLEAR · COMPUTABLE · App's transit engine has star ingresses. Sub ingresses
  are needed (sub boundaries already exist).
- **KP3-009** · **Saturn in 11 is not good for everyone.** What a transit in the 11th gives
  depends on its star and sub lords. Some suffer throughout and benefit only in the 12th.
  · (B3 p. 25) · CLEAR · REJECTED-TRADITION · Rejects the blanket gochara rule.
- **KP3-010** · **Dasa periods also need sub-division.** A 20-year dasa has good and bad
  bhuktis. Likewise each star must be divided to time events within a day (2–4 p.m.
  example). · (B3 p. 23–24) · CLEAR · GUIDANCE.

## 2. Star-lord doctrine (B3-06, B3-09, B3-10, B3-13)

- **KP3-011** · **A planet gives the results of its star lord, more than its own.** "a planet
  offers the result of the lord of the constellation more predominantly than those
  indicated by the sign or house which it occupies." In its dasa or bhukti the planet gives
  (a) its own occupation, ownership and nature, and **predominantly** (b) the houses its
  star lord rules and occupies. · (B3 p. 55–56, 125) · CLEAR · COMPUTABLE · Examples: Libra
  lagna, Mars in Jyeshta (Mercury = lord of 9 and 12) gives an overseas stay; Aquarius
  lagna, Saturn in Chitra (Mars = lord of 10) gives military service.
- **KP3-012** · **Per-lagna star table (B3-06).** For each lagna sign, a planet occupying or
  transiting any of the three stars of lord L gives the matters of the houses L owns
  (counted by sign from the lagna sign), "and not the results of the sign" it sits in.
  Example: Aries lagna, Venus stars → houses 2 and 7; Sun stars → 5; Moon stars → 4; Mars
  stars → 1 and 8; Jupiter stars → 9 and 12; Saturn stars → 10 and 11; Mercury stars → 3
  and 6. The same for all 12 lagnas. · (B3 p. 57–77) · CLEAR · COMPUTABLE · Fully derivable
  from ownership. Not a lookup table to transcribe. The text lists Moon's stars as
  "Hastham, Sravanam" for Gemini and Pisces (Rohini dropped; it is meant). It writes
  "Punarpushyam, Visakam, Uthrattathi" for Sagittarius Jupiter stars (should be
  Poorattathi).
- **KP3-013** · **Star lord's occupation outweighs its ownership.** "the occupants are much
  stronger": a planet in Sun's star, with the Sun occupying the 3rd for an Aquarius lagna,
  gives 3rd-house matters predominantly and 7th-house (Sun's lordship) matters
  secondarily. Short form: "Lord of the constellation in house (occupant). Lord of the
  constellation owning houses (lordship)." Both operate; occupation first. · (B3 p. 130–131)
  · CLEAR · COMPUTABLE · Order for the "nature" of a planet's results: (i) house occupied by
  its star lord, (ii) houses owned by its star lord, (iii) its own house, (iv) its own
  ownership. Same as the app's A > C > B > D reading of significator columns.
- **KP3-014** · **If no planet occupies a lord's star, the lord gives its own houses.** "If
  there is no planet [in Sun's stars], Sun gives lagna bhava results." · (B3 p. 162, 165)
  · CLEAR · COMPUTABLE · Same rule in B6-30 (significator order 1–4).
- **KP3-015** · **Planet = source, star lord = matter, sub lord = success.** In the transit
  example (B3 p. 58), the lord of 5 transiting Jupiter's stars for an Aries lagna (9 and
  12): a daughter's child (9 = 5th from 5) and expenses (12). · (B3 p. 58) · CLEAR ·
  GUIDANCE · Derived-house reading (5th from 5th…).
- **KP3-016** · **Per-lagna special remarks from B3-06.** (a) Gemini lagna: Jupiter (lord of
  7 and 10) is badhaka lord. With no planet in Sagittarius, Rahu in a Jupiter star is "the
  strongest evil to affect one's longevity" though good for marriage and business. (b)
  Cancer lagna: planets in 5 or 9 seldom do well (star lords there rule 6, 8, 12). Planets
  in Mars's stars do well even in 3, 8 or 12. (c) Aries lagna: slow planets transiting
  Anuradha give gains ("threatening Ashtama Sani gives pleasant shock"). (d) Capricorn
  lagna: Moon transiting Pooram (8th sign, Venus = 5 + 10) brings money on a
  "Chandrashtama" day. (e) Libra lagna: Saturn "the only benefic". (f) Scorpio lagna:
  planets in Mercury's stars (8 + 11) "very bad in the ascendant". (g) Virgo lagna: planets
  in Mercury's stars "very good". · (B3 p. 57–77) · CLEAR · GUIDANCE · Show as notes when
  the lagna matches.

## 3. Sub doctrine (B3-07, B3-09, B3-11, B3-13)

- **KP3-017** · **The KP triad.** "Planet is the source, constellation indicates nature of
  the result and the SUB is a deciding factor whether the matter is favourable or not."
  Sign = extent/strength. · (B3 p. 83, 151) · CLEAR · COMPUTABLE · The central sentence of
  the book.
- **KP3-018** · **Sub lord decides favourable or not.** A planet in the sub of an "evil"
  planet (for the matter) brings loss, difficulty, failure. In the sub of a benefic (for
  the matter) it brings success, gain, pleasure. With the star lord showing the 7th: a
  malefic sub gives enmity or loss in litigation, a benefic sub harmony or victory. Business
  star + good sub = profit, evil sub = loss. · (B3 p. 84) · CLEAR · COMPUTABLE · "Benefic"
  here = significator of the favourable houses for that matter (see KP3-032).
- **KP3-019** · **Timing = conjoined period of planet, star lord and sub lord.** The result
  comes "during the conjoined period of the planet, star lord and sub-lord". · (B3 p. 84) ·
  CLEAR · COMPUTABLE · Dasa/bhukti/anthra drawn from {planet, its star lord, its sub lord}.
- **KP3-020** · **Twins differ only by sub.** MC in Taurus/Rohini: Saturn sub = deals in
  petrol, Mercury sub = cotton and silk. MC Leo 21° (Venus star, Jupiter sub) = advocate
  and educationist; MC Leo 27° (Sun star, Sun sub) = medical. Lagna Cancer 7°41′ (Pushya,
  Ketu sub) died at birth; 12°20′ (Pushya, Mars sub) lived long. · (B3 p. 78–80) · CLEAR ·
  GUIDANCE · Examples, no birth data.
- **KP3-021** · **Profession at a point = sign + star + sub lords.** MC in Mars sign, Venus
  star: Jupiter sub = animal husbandry, Saturn sub = slaughter house, Sun sub (Aries
  5°50′, Ketu star) = veterinary surgeon. Surgeon = Sun sub in Aries stars, butcher =
  Saturn sub, barber = Venus sub. · (B3 p. 78–80, 341–343) · CLEAR · GUIDANCE · Feeds the
  profession table KP3-199.
- **KP3-022** · **Sagittarius profession table by star/sub.** E.g. Jupiter–Ketu–Ketu:
  physician; Jupiter–Ketu–Saturn: gallows/slaughter; Jupiter–Venus–Jupiter: banker/company
  law/advocate; Jupiter–Sun–Mars: mayor, minister, orator, judge, foreign embassy;
  Jupiter–Sun–Rahu: jail department. · (B3 p. 81) · CLEAR · GUIDANCE · 34 rows. Only for
  Sagittarius.
- **KP3-023** · **Planets in the same star give opposite results by sub.** Two planets in one
  star: the one in a benefic sub gives success in its period, the other harm in the same
  affair. · (B3 p. 127, 158) · CLEAR · COMPUTABLE.
- **KP3-024** · **Transit through successive subs = stages of a matter.** A marriage
  significator (Mars) transiting the star of the other significator (Venus, Pooram) passes
  sub by sub: Venus sub = talks start, Sun = decided, Moon = terms, Mars = preparations,
  Rahu = invitations, Jupiter = wedding, Saturn = guests leave, Mercury = honeymoon trips,
  Ketu = temple visit. Litigation: notice → rejoinder → compromise attempt → suit filed →
  summons → hearing → compromise. · (B3 p. 126–127) · CLEAR · GUIDANCE · Illustrative.
  Computable as "transit of significator A through the subs of a star ruled by significator
  B".
- **KP3-025** · **Sub decides yes/no examples.** (a) Pisces lagna, Rahu and Jupiter in
  Hasta (Moon = lord 5): Rahu in Moon sub gives a child in Rahu bhukti; Jupiter in Saturn
  sub gives none. (b) Virgo lagna, Jupiter and Saturn both in Pooram (Venus = 2, 9) in the
  12th: Jupiter in Sun sub (lord 12) = long journey abroad; Saturn in Moon sub (lord 11) =
  return home. (c) Aquarius lagna: a planet in Pooram (Venus = 4) with Jupiter sub (lord
  11) buys a car; with Mars sub (lord 3 = 12th from 4) sells it. · (B3 p. 128) · CLEAR ·
  COMPUTABLE · Acquire = sub sig 11; dispose = sub sig 12th-from-the-house.
- **KP3-026** · **Lordship is not final; sub decides.** Virgo lagna: Moon in Poorvashada
  (Venus = 2) but Saturn sub (lord 6 = 12th from 7) "cannot give marriage". Mars, lord of
  8, in Pooram (Venus) with Jupiter sub gives marriage. · (B3 p. 128) · CLEAR · COMPUTABLE ·
  Shows the 12th-from-the-house negation used for marriage denial (6 = 12th from 7). B4
  gives the full marriage-denial group 1, 6, 10 (B4-37, B4-44), which is not stated in B3.
- **KP3-027** · **Constellation lord shows the object; sub shows acquire or dispose.** "The
  constellation lord refers to an object. Acquiring it or disposing it depends on the sub."
  · (B3 p. 128) · CLEAR · COMPUTABLE.

## 4. Reading a planet through its star lord (B3-10)

- **KP3-028** · **Judgement checklist for a planet.** Strength by sign. Favourable or
  unfavourable sub. Conjunctions. Natural benefic/malefic. Sign element, quality, fruitful
  or barren, human or bestial, voice or mute. Then the houses of the star lord. · (B3 p. 129)
  · CLEAR · GUIDANCE.
- **KP3-029** · **Star-lord house tables.** Under "Sun as constellation lord in/of 1…12",
  "Moon …" etc., B3-10 lists what any planet in that lord's stars gives (see KP3-192…198).
  When the star lord occupies house X and owns Y and Z, read X predominantly, then Y and Z.
  Example: Scorpio lagna, Mars in Hasta, Moon in 11 owning 9 → 11th-house matters first,
  9th second, through Mars (lord 1 and 6) as source, timed in Moon's period. · (B3 p. 130,
  136) · CLEAR · COMPUTABLE (select entry) + GUIDANCE (text).
- **KP3-030** · **Rahu/Ketu proxy order.** A node gives the results of (1) the planet
  conjoined with it, else (2) the planet aspecting it, else (3) its star lord, and lastly
  (4) its sign lord. Read as if the star lord sat in the node's house, "to a greater extent".
  Benefic star lord or conjunct/aspecting planet → good. Malefic → undesirable. Example:
  Aquarius lagna, Rahu in 10 in Anuradha, unaspected = agent of Saturn (lords 1, 12), as if
  Saturn were in Anuradha. In Jyeshta it represents Mercury (5, 8). · (B3 p. 145; also p. 53,
  58, 65) · CLEAR · COMPUTABLE · B3 p. 53 (Aries section) gives conjunct → aspecting → sign
  lord (star lord omitted). B3 p. 145 includes the star lord before the sign lord. Use the
  p. 145 order. See KP3-066…069 for "node stronger than the planet it represents".
- **KP3-031** · **Ketu/Rahu-ruled stars per lagna.** A planet in a node's star gives what the
  node gives (by KP3-030), so "the results of Rahu will operate when a planet was posited in
  these stars". · (B3 p. 57–77) · CLEAR · COMPUTABLE.

## 5. Benefic and malefic, per matter (B3-11)

- **KP3-032** · **Benefic/malefic is per matter and per relative.** The lord of 2 can raise
  income and also kill the wife (2 = 8th from 7). The 4th significator can give a house and,
  on the same day, the loss of a son (4 = 12th from 5). "No planet is wholly a benefic nor in
  full a malefic." · (B3 p. 146–151) · CLEAR · COMPUTABLE · Implies every judgement must name
  the matter and count houses from the relative's house.
- **KP3-033** · **Procedure.** For each planet: its star lord → houses the star lord owns (and
  occupies). Then its sub lord: is the sub lord a significator of houses favourable to that
  matter? Example: Mars owns 4 and 11. A planet in Chitra (Mars star) with Saturn sub gains
  without delay. A planet just before it in Jupiter sub (Jupiter = 12th significator) brings
  loss, partition, separation. · (B3 p. 148–149) · CLEAR · COMPUTABLE · Note: this passage
  says "never take into judgement where [the star lord] is posited". That contradicts KP3-013
  (occupation predominates). Treat p. 148 as a simplification.
- **KP3-034** · **Good star, bad sub → no fruit; bad star, good sub → temporary relief.** A
  planet in a star of the lord of 6, 8 or 12 but in a benefic sub gives "a little relief" in
  that sub lord's period (camp-clerk example). · (B3 p. 149) · CLEAR · COMPUTABLE.
- **KP3-035** · **Health test.** The ascendant's significator should not be a significator of
  6, 8 or 12. Significators of beneficial houses, in the ascendant and in a good sub, give
  health and long life. · (B3 p. 150) · CLEAR · COMPUTABLE · Expanded in KP3-081…085.
- **KP3-036** · **General test for any house H.** A significator of H is adverse for H if it
  is in the star and sub of significators of the 6th, 8th or 12th **counted from H**, or
  conjoined with their lords. · (B3 p. 150) · CLEAR · COMPUTABLE · Relative-house rule.
  Needs a "houses counted from H" helper.
- **KP3-037** · **Childbirth example.** Scorpio lagna, Jupiter = lord 2 + 5 and karaka. A
  planet in a Jupiter star gives a child if its sub lord is lord of 11, but not if the sub
  lord is lord of 12. "a planet occupying Punarvasu Nakshathra and Mercury sub will give a
  child" (Mercury = lord 11 for Scorpio). · (B3 p. 150) · CLEAR · COMPUTABLE.

## 6. Cuspal sub lord: ascendant and second cusp (B3-12)

Form of every rule here: "If the sub lord of cusp C is a significator of houses C and X,
then …". "Significator" as defined in the header.

- **KP3-038** · **Ascendant CSL signifies 1 alone (own house).** Shows whether one keeps
  health, resists infection, succeeds in efforts. Also, by derived houses: younger brother's
  gains, mother's esteem, children's higher studies/journeys, partner's or competitor's
  danger. · (B3 p. 152) · CLEAR · COMPUTABLE.
- **KP3-039** · **Asc CSL sig 1 + 2.** Gains money, enters service, bank balance grows,
  benefit through industry. · (B3 p. 152) · CLEAR · COMPUTABLE.
- **KP3-040** · **Asc CSL sig 1 + 3.** Good mental development, knowledge through short
  journeys, helpful brothers, neighbours, relatives. · (B3 p. 152) · CLEAR · COMPUTABLE.
- **KP3-041** · **Asc CSL sig 1 + 4.** Good education, studious, gains from estates and mines,
  ancestral property, occult interest. · (B3 p. 152) · CLEAR · COMPUTABLE.
- **KP3-042** · **Asc CSL sig 1 + 5.** Delight in sports, speculation, pleasures. Attached to
  children. · (B3 p. 152) · CLEAR · COMPUTABLE.
- **KP3-043** · **Asc CSL sig 1 + 6.** Sickness, poor resistance, slow recovery. Pets, maternal
  uncle, servants. Wins litigation and elections. · (B3 p. 152) · CLEAR · COMPUTABLE.
- **KP3-044** · **Asc CSL sig 1 + 7.** Public enemies disappear. Union, partnership, benefit
  through spouse or partner, marital happiness. · (B3 p. 153) · CLEAR · COMPUTABLE.
- **KP3-045** · **Asc CSL sig 1 + 8.** Danger, accident, injury. Also legacy, gratuity,
  insurance, arrears, accumulates money, works for others, occult/mediumistic. · (B3 p. 153)
  · CLEAR · COMPUTABLE.
- **KP3-046** · **Asc CSL sig 1 + 9.** Likes father and long journeys. Psychic, religious,
  philosophical. Doctorate, research, prophetic dreams. Gains through brother-in-law or
  wife's relatives. · (B3 p. 153) · CLEAR · COMPUTABLE.
- **KP3-047** · **Asc CSL sig 1 + 10.** Meritorious deeds, honour, awards, prestige,
  popularity, high social/professional position, statesman, business. · (B3 p. 153) · CLEAR ·
  COMPUTABLE.
- **KP3-048** · **Asc CSL sig 1 + 11.** Large profits, benefactors, hopes fulfilled, "failure
  out of question". Quick cure, children's marriages, prosperity. · (B3 p. 153) · CLEAR ·
  COMPUTABLE.
- **KP3-049** · **Asc CSL sig 1 + 12.** Troubles, jealousy, secret enemies, hindrances. Yoga,
  isolation, hospitalisation even for minor illness, danger of imprisonment. Cheated, own
  undoing. Prefers investing to banking. · (B3 p. 153) · CLEAR · COMPUTABLE.
- **KP3-050** · **2nd CSL sig 1 + 2.** Makes money easily by own effort (service or business),
  improves bank position. · (B3 p. 154) · CLEAR · COMPUTABLE.
- **KP3-051** · **2nd CSL sig 1, 2, 6 → service.** "If the sub-lord of 2 is the significator
  of the houses 1, 2 and 6 one enters into service". Also service if sig of 10 without
  being sig of 7. **2nd CSL sig 1, 7, 10 → business.** · (B3 p. 154) · CLEAR · COMPUTABLE ·
  Service-vs-business discriminator.
- **KP3-052** · **2nd CSL sig 1, 2, 12 + Sun/Moon/Venus → loss of vision.** With Saturn →
  toothache. With Saturn and Moon → foul mouth, pyorrhoea. · (B3 p. 154) · CLEAR ·
  COMPUTABLE · "Connected with" = conjoined, star, sub or aspect.
- **KP3-053** · **2nd CSL sig 2 + 3.** Gains through education, writing, publicity,
  publication, journalism, brothers, colleagues, agencies, commission, touring sales. Loss to
  younger brother. Very lucky to children. · (B3 p. 154) · CLEAR · COMPUTABLE.
- **KP3-054** · **2nd CSL sig 2 + 4.** Inherits estates and money, keen to own buildings,
  land, mines. Gains by such investment. Success in own place. Automobile, transport. · (B3
  p. 154) · CLEAR · COMPUTABLE.
- **KP3-055** · **2nd CSL sig 2 + 5.** Gains through music, cinema, sport, entertainment,
  young people, children. Lucky to children and mother. · (B3 p. 154) · CLEAR · COMPUTABLE.
- **KP3-056** · **2nd CSL sig 2 + 6.** Profit in any transaction, overdraft facility, election
  gains, pets, poultry, public health, medicine, humanitarian service, labour. Good to
  children. · (B3 p. 155) · CLEAR · COMPUTABLE.
- **KP3-057** · **2nd CSL sig 2 + 7.** Gains through partner or marriage, contract business,
  dealings, litigation success, seniority retained, enemies meet danger. · (B3 p. 155) ·
  CLEAR · COMPUTABLE.
- **KP3-058** · **2nd CSL sig 2 + 8.** Gains by legacy, insurance, bonus, gratuity, will. If
  also sig 9 → loss by bank failure. If also sig 11 → gain certain. · (B3 p. 155) · CLEAR ·
  COMPUTABLE.
- **KP3-059** · **2nd CSL sig 2 + 9.** Money by export/import, books, long journeys,
  foreigners, patents, religion, science, partner's relatives. Speculative gains to
  children. · (B3 p. 155) · CLEAR · COMPUTABLE.
- **KP3-060** · **2nd CSL sig 2 + 10.** Steady progress, Government service or business,
  honours. Children succeed in exams, elections, litigation. · (B3 p. 155) · CLEAR ·
  COMPUTABLE.
- **KP3-061** · **2nd CSL sig 2 + 11 / 2 + 12.** 2 + 11: money without effort, speculation,
  lottery-type windfalls, friends oblige. 2 + 12: money from serving in sanatorium, asylum,
  hospital, occult, circus, jails. Not good to children. · (B3 p. 156) · CLEAR · COMPUTABLE.

## 7. Significators, strength order, nodes, aspects (B3-13, 14, 16, 19, 22, 35, 36, 39, 40)

- **KP3-062** · **Definition of significator.** "planets occupying any one constellation, has
  connection with the Bhava occupied by the lord of the constellation. These planets … are
  termed as the 'Significators' of the bhava." Each planet then signifies a few houses. ·
  (B3 p. 159) · CLEAR · EXISTS · = app's column A.
- **KP3-063** · **Then judge each significator's sub.** A planet signifying lagna gives long
  life and success if its sub lord is not a significator of 6, 8 or 12. Sub sig 6 = falls
  ill. Sub sig 8 = danger. Sub sig 12 = "runs away, or one is imprisoned, or
  hospitalized". · (B3 p. 159) · CLEAR · COMPUTABLE.
- **KP3-064** · **Significator of 2, judged by its sub.** Sub sig 6 = borrows. Sub sig 8 or
  12 = lends or repays. Sub sig 11 = gain (money, son/daughter-in-law, childbirth). Sub sig
  3 = through brother. Sub sig 4 = car or house in the conjoined period. A 4th-house sub
  lord that is also sig 11 = purchase. Also sig 12 (not 4) = sells, bank position improves.
  Sub lord sig 10 and 12 = lets land or house on rent. · (B3 p. 159) · CLEAR · COMPUTABLE.
- **KP3-065** · **Significator of 7, judged by its sub.** Sub sig 2 or 11 = gain, reunion,
  marriage. 12 = separation or illness to wife. 1 and 2 = danger to partner's life. 6 = wife
  goes away. 4 = partner earns. 5 = partner's pleasure and gain. 8 = income or danger. 8 +
  5 = partner gains. 8 + 1 + 7 = death of partner (8 and 1 are maraka to the 7th). ·
  (B3 p. 160) · CLEAR · COMPUTABLE · Marriage group 2, 7, 11 (B3 p. 164, 313). Agrees with
  B6-30 and B4.
- **KP3-066** · **Six-step significator order (strongest first).** (1) planets in the star of
  the occupants; (2) the occupants; (3) planets in the star of the lords; (4) the lords;
  (5) planets conjoined with significators; (6) planets aspected by significators. ·
  (B3 p. 354–355) · CLEAR · COMPUTABLE · Same order in B3 p. 194–195 (finance), p. 178
  (badhaka), p. 254 (house). Matches B6-30. App has the four levels but no ordering. Add
  ordering and steps 5–6.
- **KP3-067** · **Strength sentences.** "Occupant is stronger than owner … occupant of a
  constellation is stronger than the lord of the constellation. Constellation is stronger
  than the sign. Occupant of a sign is stronger than the lord of the sign. Planets
  conjoined with or aspected by a planet gains the strength to offer those results." ·
  (B3 p. 332) · CLEAR · COMPUTABLE.
- **KP3-068** · **Nodes are stronger than planets.** "Rahu or Kethu will ever be stronger
  than the lord of the house in which they are posited and also the planets with which they
  are conjoined." A node in a sign owned by significator X becomes a significator stronger
  than X. A node conjoined with or aspected by X represents X. · (B3 p. 213, 237, 256, 328,
  357) · CLEAR · COMPUTABLE · Examples: Ketu in Jupiter's sign stronger than Jupiter
  (b3a-E21, E25). Rahu aspected by Jupiter gains Jupiter's strength (b3a-E04). "Ketu
  conjoined with Sun and Venus and in Jupiter's sign can be substituted for Venus, Sun and
  Jupiter" (b3a-E43).
- **KP3-069** · **Node in a lord's sign is preferred over the lord.** "As Venus owns it, find
  out whether Rahu or Kethu occupies either Taurus or Libra. Then the node is stronger than
  Venus." · (B3 p. 207, 237) · CLEAR · COMPUTABLE · App's node rule (dispositor) is the
  family's own. This is KSK's: the node can stand in for its sign lord.
- **KP3-070** · **Cusp star/sub route to significators.** Note the cusp's star lord. If any
  planet is in that star lord's star, it is a significator; if none, the star lord itself.
  Likewise the cusp's **sub lord**: planets in the sub lord's star are "very strong"
  significators, "because … it is the sub and sub alone which decides". Used when the bhava
  analysis gives no clear significator. · (B3 p. 326, 329) · VERIFIED-ON-FIGURE (b3a-E43:
  Saturn is sub lord of cusps 3 and 9 and ran dasa and sookshma at departure) · COMPUTABLE ·
  Contributor (Overseas article), not KSK.
- **KP3-071** · **Many planets in one star → choose by sub.** "When the majority of the
  planets are in the same star find out in which sub … they are. Those planets in the star
  of [X] and the sub of the other significators … are definitely EVILS [for longevity]." ·
  (B3 p. 179) · CLEAR · COMPUTABLE.
- **KP3-072** · **Aspects KSK uses.** Hindu full aspects (Mars 4/7/8, Jupiter 5/7/9, Saturn
  3/7/10; e.g. "Rahu receives the beneficial 5th aspect from Jupiter", "Mars aspecting
  Scorpio") and Western angular aspects in degrees. 108° = favourable: Venus "108° away from
  the ascendant … favourable"; Saturn–Mercury 108° apart "form good aspect. If it were to be
  90°, Mercury cannot give the wedding". 22½° = affliction (Moon–Saturn). · (B3 p. 235, 317,
  320, 357) · CLEAR · COMPUTABLE · Both schemes mixed. Where they conflict (Saturn's 10th
  aspect at 108°), the degree aspect wins. App has Parashari aspects. KP degree aspects
  (0, 30, 36, 45, 60, 72, 90, 108, 120, 135, 144, 150, 180 and others) would be new. Orbs
  are not given in B3-00…40.
- **KP3-073** · **Retrograde.** "A planet, in direct motion, gives a result and confirms it. A
  planet, in retrograde, will produce a result which will fall through when it takes direct
  motion." Retrograde 11th lord in 12 = loss only temporary. Recovery after the station
  direct. Retrograde lords (borrowing direction) = success in all directions. · (B3 p. 236,
  238, 227) · CLEAR · COMPUTABLE · App's transit engine finds stations. B6-29 and B6-33 add:
  12th CSL (or its star lord) retrograde = no investment, repayment or travel abroad.
- **KP3-074** · **Above/below horizon (accident side).** Dasa and bhukti lords above the
  horizon (10th, 11th) → fell to the left. Jupiter aspecting the dasa lord from below the
  horizon → help came from the right. Jupiter in lagna → vehicle stops in front. · (B3 p. 187)
  · UNCLEAR (anecdotal, no general statement) · GUIDANCE.

## 8. Longevity, badhaka, maraka, physical features (B3-14)

- **KP3-075** · **Build and height.** Sign of the star lord of the ascendant sub lord: tall =
  Gemini, Leo, Sagittarius, Aquarius; average = Aries, Virgo, Libra, Scorpio; short = Taurus,
  Cancer, Capricorn, Pisces. "The sign denotes the physical feature in general. The
  constellation modifies it. The lord of the sub decides." Aspects to the ascendant cusp:
  Jupiter overweight, Saturn thin, Mercury plump and pale, Moon prominent features, Rahu
  tall, Ketu short, Saturn/Sun bushy hair. Traditional: lagna lord early in a sign = tall,
  late = short. · (B3 p. 166) · CLEAR · COMPUTABLE.
- **KP3-076** · **Moles and marks.** Body part = sign of the lagna, the lagna lord, the Moon,
  an afflicted Saturn/Mars/Uranus, and the 6th cusp (Aries head … Pisces feet). Side for a
  male: both lagna and its lord masculine → right; both feminine → left; mixed → part by
  lagna sign on the right and part by the lord's sign on the left. Reversed for females. 0–10°
  = upper third, 10–20° = middle, 20–30° = lower part. Scars: from disease significators'
  sign at their conjoined period. · (B3 p. 167–168) · CLEAR · GUIDANCE.
- **KP3-077** · **Longevity from the ascendant's star and sub.** Ascendant star lord = dasa,
  sub lord = bhukti "If any person has to run the conjoined periods of these three planets":
  sub of a benefic → long life, malefic → short (twins). Benefics = lords of 1, 5, 9, 10.
  Malefics = lords of 6, 8, 12. · (B3 p. 171–172) · CLEAR · COMPUTABLE · Text: "If lords of
  1, 5, 9 and 10 also rule 5 [sic] or 8 or 12 consider the planet as mostly a benefic".
  Probably "6 or 8 or 12".
- **KP3-078** · **Longevity houses 1, 8, 3; maraka 12, 7, 2.** 12th from any house negates it.
  So 12, 7, 2 (12th from 1, 8, 3) are evil for longevity. 2 and 7 = maraka, 12 = moksha. ·
  (B3 p. 174, 178) · CLEAR · COMPUTABLE.
- **KP3-079** · **Badhaka sthana by lagna modality.** Movable lagna (Ar, Cn, Li, Cp) → 11th;
  fixed (Ta, Le, Sc, Aq) → 9th; common (Ge, Vi, Sg, Pi) → 7th. Its lord = badhaka lord. ·
  (B3 p. 174–175) · CLEAR · COMPUTABLE · Apply also from any derived lagna (7th for the
  partner or the partnership, 4th for the mother, 9th for the father; b3a-E02, E42).
- **KP3-080** · **Order of evil for badhaka and maraka.** Most evil: planets in the star of
  the badhaka occupants; then badhaka occupants; then planets in the star of the badhaka
  lord; then the badhaka lord; plus planets conjoined with or aspected by them. Then the
  maraka houses 2 and 7 the same way. Tenant stronger than owner. Choose the strongest
  evils and find when they run conjointly. · (B3 p. 175–176, 178) · CLEAR · COMPUTABLE.
- **KP3-081** · **Health and disease significators.** 6th cusp, 6th house, planets in the star
  of 6th occupants, occupants, planets in the star of the 6th lord, the lord, their
  conjunctions/aspects cause disease in their dasa/bhukti/anthra, with progression and
  transit. "Significators of 6th house ruling the Sub period in [lagna lord] dasa will cause
  disease and significators of 11 give cure." · (B3 p. 173) · CLEAR · COMPUTABLE.
- **KP3-082** · **8th house = danger, cause and place of death.** Planets in the star of evil
  8th occupants (except Saturn), occupants of 8, planets in the star or sub of the 8th lord,
  the 8th lord, and planets connected with them. · (B3 p. 173) · CLEAR · COMPUTABLE ·
  "except Saturn" is unexplained (Saturn as ayushkaraka?).
- **KP3-083** · **Final checks.** After the natal judgement: progression (evil aspects to
  lagna, its lord, Saturn/Uranus/Neptune), transit of significators over sensitive points,
  the chart for the moment the astrologer feels the urge to judge (ruling planets), and a
  number 1–249 from the person "for confirmation". · (B3 p. 174) · CLEAR · HORARY ·
  Progression is Western. Not in app.
- **KP3-084** · **Kendradhipatya is not a reliable maraka indicator.** Virgo-lagna natives of
  1909/1923 with Jupiter (lord 4, 7) in 2 survived 16 years of Jupiter dasa. · (B3 p. 175) ·
  CLEAR · REJECTED-TRADITION.

## 9. Mode and place of death, accidents (B3-15)

- **KP3-085** · **Danger periods from the 8th cusp.** Danger arrives in conjoined periods of
  (a) the sign, star and sub lords of the 8th cusp and the star lord of that sub lord, or
  (b) the sign, star, sub lords and star-lord-of-sub-lord of the 8th **lord's** position. ·
  (B3 p. 182) · CLEAR · COMPUTABLE.
- **KP3-086** · **Escape or succumb, and manner.** Benefic sub (promising long life or cure) →
  escapes. Malefic sub that is a significator of death → succumbs. Jupiter sub = pleasant
  end, Mars sub = sudden, Saturn sub = chronic and lingering. · (B3 p. 182) · CLEAR ·
  COMPUTABLE.
- **KP3-087** · **Place of death from the 8th CSL.** Sig of 1, 4, 10 → own place. Sig of 3 →
  during a short journey, mostly the return. Sig of 6, 8 or 12 → jail, hospital or an unknown
  place. Sig of 9 → long journey or far-off place. · (B3 p. 182) · CLEAR · COMPUTABLE.
- **KP3-088** · **Overseas journey and air crash (husband).** Long journey = 9th
  significators. A node in a significator's sign = strong significator. Departure in Mercury
  dasa – Rahu bhukti – Venus anthra – Saturn sookshma, all connected with 3, 9, 12. Death far
  away because the 8th CSL (Jupiter, lord 3 in 9, in star of the 9th lord Mercury) points to
  travel. · (B3 p. 183–184) · VERIFIED-ON-FIGURE (Fig. B3.15, dasa checked) · COMPUTABLE ·
  b3a-E05.
- **KP3-089** · **Widowhood from the wife's chart.** Take the 7th cusp as the husband's
  lagna. Wife's Venus dasa: Venus in the star of the lord of 6 (from her lagna) which is in
  the star of the lord of 8 → danger to husband. Her 8th house = mangalya (husband's life).
  Aspects from Mercury (travel), Sun (fire), Mars (sudden) on her 8th describe his
  death. · (B3 p. 185) · CLEAR · COMPUTABLE · b3a-E06.
- **KP3-090** · **Mercury-ruled lagnas are accident-prone.** Gemini: Mars = 6, Saturn = 8;
  Virgo: Saturn = 6, Mars = 8 ("Virgo is the worst"). Accident in Sun–Mars–Saturn (lords 12,
  8, 6). · (B3 p. 186–187) · CLEAR · GUIDANCE · b3a-E07.
- **KP3-091** · **Health (KP).** (a) Ascendant cusp in the star of the lord of 6 or 8 → poor
  immunity, catches epidemics. (b) Ascendant sub lord in the star of a significator of 6 →
  sickly. If ascendant, its lord and its sub are in stars of significators of houses other
  than 6, 8, 12 → long life, good health. "Of the ascendant and the lord of the ascendant,
  the cusp is more vital." · (B3 p. 188) · CLEAR · COMPUTABLE.
- **KP3-092** · **Cause and cure of disease.** Planets in the star or sub of the 6th lord
  cause disease. Planets connected with 11 cure it (11 = 6th from 6th). Illness comes in the
  period of a planet connected with 6. Cure comes only in the sub-period of a planet
  connected with the ascendant or 11. · (B3 p. 188) · CLEAR · COMPUTABLE · B3 p. 293 and 310
  add the 5th (see KP3-152). B6-24 agrees (5 or 11).
- **KP3-093** · **No cure for chronic disease.** No cure if no planet is in 11, none is in the
  star of the 11th owner/occupant, and the 11th cusp and 11th lord are in subs of evil
  planets. Lifelong illness: every dasa lord after onset is in the sub of the 6th lord, and
  11, 11th lord and lagna lord are spoiled. · (B3 p. 189) · CLEAR · COMPUTABLE.
- **KP3-094** · **Nature and duration of disease.** Sign, star and sub of the disease
  significator: e.g. Scorpio (genitals) as the 4th for a Leo lagna (breast/lungs) + Saturn
  star (chronic) + Moon sub (pus); Venus sub = fibroid tumour, Jupiter sub = cancer, Mars
  sub = surgery. Movable sign = short illness, common = relapses, fixed = prolonged or
  chronic. · (B3 p. 189–190) · CLEAR · GUIDANCE.

## 10. Finance and fortune (B3-16 … B3-21, B3-30)

- **KP3-095** · **Wealth significators (strongest first).** (a) Planets in the star of the
  occupants of 2, 6, 10 or 11 (even if debilitated), **provided they are in the sub of
  significators of 2, 6 or 11**. (b) Occupants of these houses in such subs, not afflicted by
  their star lord. (c) Planets in the star of the lords of 2, 6, 10, 11 in such subs. (d) The
  lords in such subs. (e) Planets conjoined with or aspected by them. Riches need the sub
  ruled by a significator of 2, 6 or 11 and no adverse aspect. · (B3 p. 194–195) · CLEAR ·
  COMPUTABLE · **Yes group 2, 6, 10, 11** (subs: 2, 6, 11).
- **KP3-096** · **Loss group.** If the sub lord is evil → loss in the conjoined period of the
  planet and sub lord. An adversely aspecting planet "robs away" the gain in their joint
  period. A majority of planets in the star of the lord of 8 or 12, or in their subs →
  loss, poverty, cheques issued to repay or share profit. · (B3 p. 195) · CLEAR ·
  COMPUTABLE · **Denial group 8, 12.**
- **KP3-097** · **Mixed lordship is not neutral.** A planet owning 8 + 11 or 12 + 11 gives
  gains in the sub-periods of benefic significators of 2, 6, 11 and losses in others. "The
  ownership of an evil house and that of a favorable one by the same planet does not cancel
  one another" — both ledger entries occur. Same in B3 p. 252 (do not split a dasa into good
  and bad halves). · (B3 p. 195, 252) · CLEAR · COMPUTABLE.
- **KP3-098** · **Fortunate chart overall.** Majority of planets strong, in beneficial stars,
  in movable signs, in angles, with harmonious mutual aspects. · (B3 p. 196) · CLEAR ·
  GUIDANCE.
- **KP3-099** · **Fortuna.** Fortuna gives fortune in the period of the lord of the star it
  occupies and represents that star lord. Its sub lord also counts: Fortuna at Taurus 9°06′
  (Sun star, Venus sub) → fortunate in Sun dasa – Venus bhukti (took service then). Western:
  Fortuna's house shows the source; good aspect to the lord of Fortuna's sign brings riches;
  planets aspecting Fortuna show the means. · (B3 p. 191, 204) · VERIFIED-ON-FIGURE
  (Fig. B3.22: Taurus 9°06′ is Krittika, Venus sub) · COMPUTABLE · b3a-E12. App has no
  Fortuna point. Formula not given in B3-00…40.
- **KP3-100** · **Finance houses.** 2 = bank balance, self-acquisition. 6 = personal exertion,
  labour, loan. 10 = profession, inheritance. 11 = net profit (sum of 1…10 minus 12). Sun =
  karaka for profession, Jupiter for bank balance. "Always take the Bhava [house] and not the
  signs". · (B3 p. 203, 215) · CLEAR · COMPUTABLE.
- **KP3-101** · **Recovery of lost wealth.** Lord of 7 in the 2nd (Hindu); "If lord of 7 is in
  sub of lord of 2, the same result – K.P." · (B3 p. 199) · CLEAR · COMPUTABLE.
- **KP3-102** · **Inheritance-type 10th (PF, gratuity).** Saturn or Jupiter ruling 4 or 10
  give "inheritance", read today as provident fund or gratuity. 8th with Uranus gives gifts
  and legacies. · (B3 p. 192) · CLEAR · GUIDANCE · Western.
- **KP3-103** · **Retirement / end of service = 1, 5, 9.** 2, 6, 10 = service, so their
  12ths, 1, 5, 9, end it. All significators of 1, 5, 9. "Nodes are stronger than planets".
  The strongest (a node) gives the anthra. · (B3 p. 208–209) · CLEAR · COMPUTABLE · b3a-E12.
  Date by Sun transit (KP3-115).
- **KP3-104** · **Lottery, competition, litigation.** Houses 1, 2, 3, 6, 10, 11 favourably
  connected → victory, litigation win, lottery/game gains. Planets in 4, 5, 7, 8, 9, 12 →
  loss. The 5th gives the mind to speculate. 6th = 12th from the 7th (competitors) = their
  loss, your gain. · (B3 p. 210–211) · UNCLEAR (the printed sentence "Houses 4, 5, 7, 8, 9 and
  12 receiving good aspects are adverse, promise gain" is garbled. The following example
  treats 4, 5, 7, 8, 9, 12 as loss houses) · COMPUTABLE · **Yes group 1, 2, 3, 6, 10, 11
  (+5 for urge); loss group 4, 5, 7, 8, 9, 12.** b3a-E13.
- **KP3-105** · **Lottery example timing.** The win came in Rahu dasa – Moon bhukti (Moon
  in its own star, lord of 5, in 11) – Sun anthra (lord of 6 in own star, in 11), on a Monday
  with Moon in Rahu's star Swati. Saturn was transiting Rahu's star Sathabhisha. · (B3
  p. 210–211) · CLEAR · COMPUTABLE · Day lord and transit star ruled by the period lords.
- **KP3-106** · **Transit of the dasa lord by star and sub.** "it is necessary to note
  primarily the transit of the Dasanatha, Bhuktinadha, etc. and then, of all other planets."
  Transiting Rahu (dasa lord) in Mars star (lord 2 + 9), Saturn sub (lord 11 + 12) → gains,
  holy journey, purchases. · (B3 p. 211) · CLEAR · COMPUTABLE.
- **KP3-107** · **Races (speculation through sub).** The source of income is shown by the
  sub-portion of the star. Moon in Pushya (Saturn = lord 5, in the 2nd bhava) and Rahu sub
  (Rahu in 2, stronger than the 2nd's lord and planets) → Moon dasa gives speculative gain.
  Planets in the star or sub of the dasa lord share its results. The 6th lord (Jupiter) and 6th
  occupants bring the opponent's loss, provided the dasa lord connects with 5 and 2. ·
  (B3 p. 213–214) · CLEAR · COMPUTABLE · **Race win: 5 + 2 (+ 6 = opponent's loss).**
  b3a-E14/E15.
- **KP3-108** · **Raising money vs repaying.** Receipt: 2, 6, 10, 11. Discharge of debt: 4,
  5, 8, 12 (12 = repayment; 8 = 2nd from 7th; 4 = 10th from 7th; 5 = 11th from 7th). Lender
  = 7th. · (B3 p. 216–217) · CLEAR · COMPUTABLE · **Borrow yes 2, 6 (+10, 11); repay 4, 5, 8,
  12.**
- **KP3-109** · **8th CSL and debts.** 8th CSL sig of 5, 6, 8, 12 → difficulties "as a
  battalion", borrows from everyone. 8th CSL sig of 2, 10 or 11 → returns the money with
  pleasure in its period. Benefic in 8 → regains money. Malefic in 8 → the counter-party
  loses. · (B3 p. 217, 230–231) · CLEAR · COMPUTABLE.
- **KP3-110** · **Planets cutting income or blocking repayment.** Planets in 2, 10, 11 in the
  sub of significators of 4, 5, 8 or 12 reduce income. Planets in 4, 5, 8, 12 with subs
  signifying 4, 5, 8, 12 raise expenses and block repayment, with mental agony and
  humiliation. · (B3 p. 218) · CLEAR · COMPUTABLE.
- **KP3-111** · **Cause of debt by house association.** "Association" = occupied or aspected,
  or its lord in, conjoined with or aspected by 6, 8, 12. 6th CSL also sig 12 and associated
  with 6/8/12 → own or partner's illness, loss, investment. 2nd lord sig 6/8/12 → family,
  eye/throat bills, partner, younger brother, mother, children, father. 3rd CSL/lord sig 6/12
  → brother (male sign) or sister (female sign), surety, journeys, press; with 6 → pledging
  documents and jewels; with 8/12 → their sale. Sig 4 + Moon → mother or cattle. Sig 4 + Mars
  → land or building, mortgage. Lord 4 with 3/8/12 → disposal of property. Lord 6 in 9, no
  benefic → auction in the 4th lord's period. Sig 5 + Jupiter → children or speculation. Sig
  6 + Saturn → enemies, theft, disease; + Jupiter → litigation; + Jupiter, Mars, Sun →
  election. Sig 7 + lords 2, 10 → partner; + Venus → wife; + Jupiter → litigation or second
  son. Sig 8 → enemies, dispute. Sig 9 → father, wife's younger sibling, partner's journey,
  third child, studies abroad. Sig 10 + Sun → father's debts or business. Sig 11 with 8/12 →
  surety for a friend; + Mars → elder brother; + Sun → father's younger brother; + Jupiter +
  Venus → son-in-law. Lord 12 + Saturn → theft, fraud, secret enemies. Saturn in 12 with Mars
  or Ketu in 2 → caught by authorities in their joint period. · (B3 p. 218–222) · CLEAR ·
  COMPUTABLE · "(8) associated with the houses 1 [sic], 8 or 12": probably 6, 8 or 12.
- **KP3-112** · **When debts are incurred.** In the dasa/bhukti of the indicating planets, and
  on days, stars, lagnas and Moon signs ruled by them. The significators also form favourable
  aspects to their own natal places in transit. · (B3 p. 222) · CLEAR · COMPUTABLE ·
  b3a-E17 (surety for elder brother in Saturn–Mars–Jupiter, Dec 1953; dasa checked).
- **KP3-113** · **Pledges and redemption; where to borrow.** Planet in 6 = loan by pledging.
  Redeem via 4, 10, 11. 8 or 12 = pledged item lost. Direction = sign of the 2nd lord, the
  11th lord, or the bhukti lord. If retrograde at birth → any direction works. Lender by
  house of lagna lord, 2nd lord, bhukti lord: 3 = brother/neighbour/bond; 4 = relative or
  same locality; 9 = stranger far away; 11 = elder sibling, friend, paternal uncle; 10 =
  office/officer; 6 = subordinates. · (B3 p. 227–228) · CLEAR · GUIDANCE.
- **KP3-114** · **Disgrace over unpaid debt.** Malefics in 2, 5, 9, 12 threaten loss of
  reputation or imprisonment. Saturn in Scorpio as the 5th, 9th or 12th → manhandled and
  taken to court. · (B3 p. 226–227) · CLEAR · GUIDANCE.
- **KP3-115** · **Free from debts (natal).** Borrow in the conjoined period of significators
  of 2 and 6. The 8th gives risk, or a windfall if its significator is also of 6 and 11. The
  12th gives repayment. The 12th lord in 8 (Vipareeta) lets one repay easily (Capricorn
  lagna, Jupiter). Planets in the star or sub of the 6th occupant/lord show necessity and
  time of borrowing. Example: Rahu in 11, in the 11th lord's star, Moon sub → "no debts in
  the conjoined period of Moon and Rahu". · (B3 p. 230–232) · VERIFIED-ON-FIGURE (Fig.
  B3.29; dasa dates match the printed balance) · COMPUTABLE · b3a-E20. Text "Mars in Aries
  is in the 8th [sic] house. Jupiter owns the 8th [sic]" should read 6th (Mars 11°29′ Aries
  < 7th cusp ≈ 18°13′ Aries; Jupiter owns 3 and 6 for Libra).
- **KP3-116** · **Agreement and instalments.** A contract = houses 3 and 9 (3rd from lagna
  and 3rd from the 7th). Payments = 8 and 12 (vs 2 and 6 for borrowing). Saturn owning 11
  and 12, alone in 11, with no planet in its star → receives and pays, but only in
  instalments ("a delaying planet … not denying"). Full clearance in the conjoined period of
  planets in the star of the planet in 8. · (B3 p. 289–290) · VERIFIED-ON-FIGURE (Fig.
  B3.40; agreement 14-10-67 and payments 29-6-68, 14-10-68, 21-12-68 checked against the
  printed Venus balance) · COMPUTABLE · b3a-E33. "29-6-61 [sic]" is 29-6-68 (only 1968 fits
  Moon–Sun).

## 11. Timing: dasa–bhukti–anthra and transit (collected)

- **KP3-117** · **Zone transit for a dasa–bhukti pair.** The results of A dasa – B bhukti
  (or B–A) materialise when A, B, or a luminary transits: sign of A + star of B; sign of B +
  star of A; star of A + sub of B; star of B + sub of A. "Important events indicated by these
  two planets cannot happen on other dates." · (B3 p. 31–34) · CLEAR · COMPUTABLE · Sun's
  dates are listed per star. Refers to "Udu-Dasa" book. Strong, testable transit rule.
- **KP3-118** · **Sun's sign–star–sub = dasa–bhukti–anthra.** Event date: the Sun transits the
  sign of the dasa lord, the star of the bhukti lord, the sub of the anthra lord. Example
  (retirement): Jupiter dasa – Saturn bhukti – Ketu anthra → Sun in Pisces/Uttarabhadra/Ketu
  sub ≈ 21-3-1980. Variants: Sun in Moon's star in Saturn's sign (cinema); Sun in Venus sign,
  Rahu star (stammering); Sun in Punarvasu (heart cure); Sun in Aquarius/Dhanishta/Mercury sub
  (health failure, B3 p. 179). · (B3 p. 209, 286, 312, 310, 179) · CLEAR · COMPUTABLE ·
  Directly testable.
- **KP3-119** · **Rahu-dasa transit rule (editor's ruling).** In Rahu dasa – X bhukti, results
  come when birth-chart planets transit Rahu's star inside X's sign: Saturn → Sathabhisha;
  Mercury → Ardra; Venus → Swati. · (B3 p. 206) · CLEAR · COMPUTABLE · Generalises to "star
  of the dasa lord in the sign of the bhukti lord" (KP3-117 form 2).
- **KP3-120** · **Jupiter transiting the dasa lord's sign.** "during the time when Jupiter
  transits the sign ruled by the lord of dasa, the dasanatha will confer favourable results"
  — and in KP the sub should also be ruled by the dasa lord (Moon dasa: Jupiter at Cancer
  3°25′–30′, a Moon sub). The gain is not repeated in later Moon–Jupiter periods because
  Jupiter will not be in that sign again. · (B3 p. 214–215) · CLEAR · COMPUTABLE · Check:
  Cancer 3°20′–5°26′40″ is Pushya–Saturn sub. A Moon sub in Cancer is 0°00′–0°33′20″ or
  11°00′–12°06′40″. So "3°25′" is not a Moon sub. UNCLEAR on the sub detail; the sign part
  is CLEAR.
- **KP3-121** · **Event days ruled by the period lords.** Events fall on weekdays and Moon
  stars ruled by the dasa/bhukti/anthra lords: house occupied "a Saturday ruled by Saturn
  (bhukti lord), Rohini star day governed by Moon, whose dasa was running"; lottery on Monday
  in Swati; job on a Swati day in Rahu dasa. · (B3 p. 210, 257, 358, 290) · CLEAR ·
  COMPUTABLE.
- **KP3-122** · **Anthra choice.** Within the bhukti, the anthra of the strongest significator
  (nodes first) fires. "As 'A' dasa, 'B' Bhukti, [A] Anthra will offer the result to the full
  extent". · (B3 p. 209, 232) · UNCLEAR (the A-B-A sentence is garbled) · COMPUTABLE.
- **KP3-123** · **Query-moment Moon degree.** Another school: when significators transit the
  degree the Moon held when the question was put, the matter fructifies. Moon ≈ Aquarius 22°
  on 21-2-1966 → Sun/Venus at 22° Aquarius ≈ 5-3-1967 (bought 4-3-1967). · (B3 p. 256) ·
  CLEAR · HORARY.
- **KP3-124** · **Transit check for a horary forecast.** After choosing dasa → sookshma, verify
  each period lord's transit sign/star/sub on the predicted day (example 26-8-1970). A
  significator turning retrograde before the window gives its result before the station. ·
  (B3 p. 322–323) · CLEAR · HORARY.
- **KP3-125** · **Dasa lords in sequence predict the course of a profession.** If the next dasa
  lord has no connection with the present line of work, it ends and changes to the nature
  of the new dasa lord. · (B3 p. 284) · CLEAR · COMPUTABLE.

## 12. Brothers, mother, relatives by derived houses (B3-13, B3-23, B3-24)

- **KP3-126** · **Relatives = houses counted from the relative's house.** Mother 4, father 9,
  child 5, younger sibling 3, partner 7. Health, finance and longevity of the relative are
  judged by taking their house as lagna. Badhaka/maraka of the relative are counted from it.
  "The dasa, Bhukti, and anthra ever remain the same." · (B3 p. 161, 243) · CLEAR ·
  COMPUTABLE · b3a-E02: father dies in Sun–Mercury–Venus because the Sun (in the star of the
  9th occupant) has a Jupiter sub, and Jupiter is in the star of the badhaka lord of the 9th.
- **KP3-127** · **Plurality of siblings from the 3rd CSL.** Several brothers/sisters only if
  the 3rd CSL is in the star of a planet in a dual sign, or is itself in a dual sign, or the
  3rd cusp is aspected by a planet in a dual sign. Sex and exact number: no KP rule yet. ·
  (B3 p. 239) · CLEAR · COMPUTABLE.
- **KP3-128** · **3rd cusp as the next sibling's lagna.** For a younger sibling's longevity,
  take the 3rd cusp as their ascendant and recompute the other cusps for that latitude
  (otherwise the 9th would mean both father and the sibling's spouse). · (B3 p. 239) ·
  CLEAR · COMPUTABLE · Needs a "derived chart" function (houses for an arbitrary ascendant at
  the birth latitude).
- **KP3-129** · **Siblings (KP lines).** Co-borns exist if the 3rd significator is connected
  with 2 and 11. Danger to brother if the 3rd CSL signifies 8 or 10 (2nd/maraka and 8th
  from 3). Enmity if the 1st significator also signifies 3, 6, 8. Harmony if the 3rd
  significator also signifies 11 and 1. Brother lucky if the 4th significator is also of 12
  and 1 [sic, unclear]. Partition in conjoined periods of significators of 3, 9, 12 and 4 or
  10. Property trouble in lords of 2, 4, 6, 8, 12. · (B3 p. 240–242) · CLEAR (except "brother
  lucky" line: UNCLEAR, "[sic]" in text) · COMPUTABLE.
- **KP3-130** · **Sibling death by ruling planets.** The brother born with the dying-period
  planets as his ruling planets (e.g. Saturn + Rahu: Sathabhisha, or a Saturday with Rahu in
  lagna) dies in the native's Saturn–Rahu period. Others live. · (B3 p. 242) · CLEAR ·
  COMPUTABLE (needs sibling's ruling planets).
- **KP3-131** · **Sorrow / gains / expenses via siblings.** Sorrow: 3rd CSL in the star of
  Jupiter in 11; Mars in 11 aspected by Saturn; Mars hemmed in by malefics. Acquires
  brother's [property?]: 3rd lord strong and in the star of a 2nd significator. Expenses
  through younger siblings: 3rd lord, planets in 3 or in their star connected with the 12th
  lord. · (B3 p. 242–243) · CLEAR · COMPUTABLE.
- **KP3-132** · **Mother = 4th only.** The 4th (not the 10th) represents mother; checked
  against ruling planets of mothers. Her possessions/income = 5, 1, 2 from lagna (2, 10, 11
  from the 4th). Her disease = 9 (6th from 4). · (B3 p. 243) · CLEAR · COMPUTABLE.
- **KP3-133** · **Short-lived mother.** If the 4th cusp and Moon are in the star of
  significators of 9, 11 or 3 (6th, 8th, 12th from 4) and the sub belongs to the 4th's badhaka
  or maraka lord → mother unhealthy and short-lived after the birth. · (B3 p. 245) · CLEAR ·
  COMPUTABLE · b3a-E02: mother dies in Venus–Mercury–Saturn.

## 13. House, building, vehicle (B3-25, B3-26, B3-29)

- **KP3-134** · **4th + karaka chooses the object.** 4th + Mars = building; 4th + Venus =
  vehicle; 4th + Moon = mother; 4th + Mercury = education; Mars + Moon = land. "Connection
  with Mars" = occupying Mars's sign, star or sub. Building significators: 4th occupants in a
  Mars star or Mars sub; planets in their star; the 4th lord in a Mars star/sub; planets in
  its star; favourable Mars to the 4th. · (B3 p. 248–249) · CLEAR · COMPUTABLE.
- **KP3-135** · **How the house comes.** 4th aspected well by the 10th lord → inheritance.
  4th with lords 1 and 12 → buys from own money. 4th with lords 1, 6, 12 → borrows (or
  co-op society). Lagna lord sig 2 and 6, no Mars link → mortgage. Lords 4 and 8 linked
  (lord 1 not) → sells. Lord 4 + lord 12 + Sun → fire or public auction. · (B3 p. 249–250)
  · CLEAR · COMPUTABLE.
- **KP3-136** · **Purchase = 4, 11, 12; possession needs 6 or 9.** 4 = property, 11 = gain,
  12 = cheque to the seller. "unless the 9th or 6th house also operates, it is not possible
  … to take possession" (6 = 12th from the seller's 7th; 9 = 12th from the 10th, which is the
  seller's 4th). Purchase in the conjoined periods of the strong significators. · (B3
  p. 254–255) · CLEAR · COMPUTABLE · Agrees with B6-27 (construction 4, 11, 12).
- **KP3-137** · **Acquisition 2, 4, 11; disposal 3, 5, 10.** A natal example uses 2, 4, 11 to
  acquire and 3, 5, 10 to dispose (3 = 12th from 4; 5 and 10 = the buyer's 11th and 4th). ·
  (B3 p. 256, 258) · VERIFIED-ON-FIGURE (Fig. B3.33; the 6-2-1960 house matches Moon–Saturn,
  with the antara ~2–3 months off the printed balance) · COMPUTABLE · **Sale group 3, 5, 10**
  agrees with B6-27. B3 uses both 4, 11, 12 (purchase) and 2, 4, 11 (acquisition).
- **KP3-138** · **Evil in 4 = losing an owned house.** Rahu in 4 (in its own star, Mars sub)
  → father's house sold in Rahu–Rahu–Mars. Saturn dasa (lord 11 + 12): houses sold in an
  evil sub-period and bought in a good one. · (B3 p. 251–252) · VERIFIED-ON-FIGURE
  (Fig. B3.31) · COMPUTABLE · b3a-E22.
- **KP3-139** · **Lagna, not Moon sign (post-1967).** "In the research after 1967 it was found
  that we have to take always the Lagna alone … What we had been following in KP printed in
  1966, is to be given up." Reason: twins share the Moon but not the cusps. · (B3 p. 256) ·
  CLEAR · REJECTED-TRADITION (rejects Moon-sign houses) · **Conflict:** B3-35 (p. 316) and
  B3-23 (p. 238) still pick "the stronger of lagna and Moon sign". Follow p. 256 (later
  ruling).
- **KP3-140** · **Building purpose from the 4th CSL.** "It is the sub lord of the 4th cusp, by
  the nature, denotes the purpose for which the building will be used" (Venus = cinema,
  music). Ownership needs 4, 11, 12. · (B3 p. 286) · VERIFIED-ON-FIGURE (Fig. B3.39; IV =
  Gemini 15°25′ is Ardra, Venus sub) · COMPUTABLE · b3a-E32.
- **KP3-141** · **Building details and tenants.** Planet giving the house + Jupiter = wood;
  Ketu/Mars = burnt bricks; Saturn/Venus = cement; Saturn + Venus + Mars = RCC; Sun =
  thatch; Moon = good water; Mercury = twin houses/outhouse; Venus + Moon = lime/marble;
  Mars + Venus = mosaic. Rooms: Mars kitchen, Venus bedroom, Jupiter treasury, Mercury
  reading room, Saturn cellar/locker. Tenants: Sun Government; Moon nurses, navy, water
  works; Mars surgeon, industry, police; Mercury business, post office; Jupiter bank,
  school; Venus hotel, silk/silver shop, ladies; Saturn labourers. · (B3 p. 250) · CLEAR ·
  GUIDANCE.
- **KP3-142** · **Vehicle (KP).** Vahana houses 4, 9, 10, 11 + Venus, Moon, Jupiter. "The
  sublord of the 4th Cusp shows whether one can have vehicle in his life time or not. If the
  Sub is in the constellation of a planet who is significator of 4, and is connected with
  Venus one must have." · (B3 p. 261–262, 272) · CLEAR · COMPUTABLE · **Yes group 4, 9, 10,
  11** (agrees with B6-27). Disposal of a vehicle: 3, 4, 5, 10 (B6-27; not in B3).
- **KP3-143** · **Vehicle routes.** Via brother: 4th CSL associated with Mars, or a sig of 3
  and 11. Via partner: Venus in 4, 4th lord in 7, lords 4 and 7 friends. Via family: lords 4
  and 7 in 2. On loan: 4th and 6th lords connected. Timing in their conjoined periods plus
  their transits aspecting natal positions. Hire purchase: Jupiter + 6th lord. Office loan:
  Sun + 6th lord. Office car or pass: Rahu + Sun or lord 2/10. Others'/hired vehicles: lords
  6, 8, 12 involved, Rahu in 4 or with the 4th lord. Owns only if lagna or its lord is
  connected. Driver: Saturn + 6th lord. Direction of purchase: bhukti lord's direction. ·
  (B3 p. 264–272) · CLEAR · GUIDANCE (traditional yogas mixed with KP).
- **KP3-144** · **Evils cannot be averted.** "Evils threatened by the malefics are bound to
  happen. They cannot be averted, dodged or prevented by doing Shanthi". · (B3 p. 271) ·
  CLEAR · REJECTED-TRADITION (rejects remedial propitiation).

## 14. Education, scholarship, farming (B3-13, B3-27, B3-28, B3-37, B3-39)

- **KP3-145** · **Education houses.** 4th significator = regular schooling. 3rd = inclination
  to specialise. 9th = taste and chance for further study. 3 and 5 = native intelligence; 4
  = study habits. Ascendant CSL = studious or lazy. Mercury and Jupiter give the mind;
  Saturn as sig of 3 obstructs exams. If the dasa lord connects with 4 and 9 → education. ·
  (B3 p. 165, 272–273) · CLEAR · COMPUTABLE.
- **KP3-146** · **Success and break.** Successful if the 4th and 9th lords are in the sub of
  an 11th significator. Planets connected with the lords of 4 and 11 give education. After a
  break, the 11th occupant/lord, or planets in its star aspecting the 4th/9th lords, resume
  it. Ends in periods of planets in the star of the occupants of 3, 5 or 8, the occupants, the
  planets in the star of the lords of 3, 5, 8, and the lords. Malefic Saturn detrimental.
  Rahu gives education when in the star of planets connected with 4 and 9. · (B3 p. 278) ·
  CLEAR · COMPUTABLE · **Yes 4, 9, 11; end 3, 5, 8** (3 = 12th from 4; 8 = 12th from 9; 5 =
  2nd from 4 / maraka?). Agrees with B6-27 and B5-22 (4, 9, 11).
- **KP3-147** · **Competitive examinations.** Mars, Mercury, Jupiter connected with 4, 9, 11
  → success. · (B3 p. 279) · CLEAR · COMPUTABLE · Agrees with B6-27.
- **KP3-148** · **Scholarship and fees.** Schooling 4; institution 8; teacher 9; the
  institution as counter-party = 7. Pays fees: 4 linked with 8 and 12 (benefic in 8 → pays).
  Scholarship: 4 linked with 6 and 11 (planet in 4 in the star of the 6th occupant/lord).
  12 with Jupiter/Mercury = pays fees; 12 + Venus or 3rd lord = pays conveyance; 12 + Mars +
  3 = hostel. · (B3 p. 279–280) · VERIFIED-ON-FIGURE (Fig. B3.36, B3.37; KSK's own
  scholarship in Rahu–Rahu–Mars, Aug 1926, matches his Moon balance) · COMPUTABLE · **Yes 4,
  6, 11 (scholarship); 4, 8, 12 (paid study).**
- **KP3-149** · **Higher studies abroad.** Classroom study = 4 + 11. Research, thesis,
  hostel, abroad = 9 + 12, and "11th house significator should also be the significator of
  either 9th or 12th house or both". 9th CSL's star lord = inclination; 9th CSL in 11 =
  fulfilment. Foreign stay = 12; job abroad = 6 and 10; scholarship = 6 and 11. · (B3 p. 330,
  332) · VERIFIED-ON-FIGURE (Fig. B3.51: 9th cusp Cp 20°39′ is Sravana, Venus sub) ·
  COMPUTABLE.
- **KP3-150** · **Farming.** Mars (land), Venus (production), Moon (irrigation), Jupiter
  (produce) connected with 2, 6, 10 → farming, in their conjoined periods. Favourable when in
  subs of Mars, Venus, Moon or Jupiter. Land purchase: Mars and Saturn connected with 2, 4,
  11. Saturn sub: profit but never satisfied. Jupiter sub: providential yield and price. ·
  (B3 p. 282–284) · VERIFIED-ON-FIGURE (Fig. B3.38) · COMPUTABLE · b3a-E31.

## 15. Marriage and partnership (B3-13, B3-35)

- **KP3-151** · **Marriage = 2, 7, 11.** 2 = a member added to the family; 7 = the agreement;
  11 = lasting friendship. Significators by the six-step order, nodes included (Ketu
  stronger than the lord of a vacant 7th when in the 7th lord's sign). Marriage in Venus
  dasa – Ketu bhukti – Venus anthra – Moon sookshma on a Sravana day (Moon's star in Saturn's
  sign; Saturn = 7th lord). · (B3 p. 164–165, 313) · VERIFIED-ON-FIGURE (Fig. B3.12; dasa
  checked) · COMPUTABLE · **Yes 2, 7, 11.** Denial not stated in B3 beyond KP3-026 (6 = 12th
  from 7). B4 gives 1, 6, 10.
- **KP3-152** · **Early marriage example.** A girl married at 12 in Rahu–Mercury–Moon. Rahu
  conjoined with the 7th lord Sun, in the star of the 2nd and 11th lord (Jupiter). Mercury
  108° from Saturn (good). · (B3 p. 316–317) · CLEAR · COMPUTABLE · Uses the Moon sign as
  stronger than lagna (conflicts with KP3-139). b3a-E39.
- **KP3-153** · **Partnership longevity (horary 34).** Take the 7th as the partnership's lagna.
  Its badhaka by the 7th cusp's modality (fixed Scorpio → 9th from 7th = 3rd). Its marakas =
  2nd and 7th from the 7th (8th and 1st). Grade the significators of those houses, then select
  by ruling planets (KP3-159). Dissolution in Venus–Rahu–Mercury–Saturn (13-8-70 to 8-9-70,
  before Mercury's station retrograde on 31-8-70).
  Mercury (sub lord of 1, 2, 5, 6, 7, 8, 11, 12) "chief among the Karaka Planets of Business".
  Partnership re-formed under the same name. · (B3 p. 320–323) · VERIFIED-ON-FIGURE (Fig.
  B3.49; lagna 17°46′40″ Taurus = start of sub #34) · HORARY · b3a-E42.

## 16. Horary procedures (B3-22, B3-25, B3-30, B3-31, B3-35, B3-39)

- **KP3-154** · **Number 1–108 → lagna pada (older scheme).** Theft query: number 16 → divide
  by 4 so as to leave a remainder 1–4 (16 = 3 full quarters ×4 + 4) → Rohini pada 4 = Taurus
  20°00′–23°20′. Navamsa lagna Cancer. · (B3 p. 235) · VERIFIED-ON-FIGURE (Fig. B3.30) ·
  HORARY · **The 1–108 scheme, not 1–249.** Number 34 in B3-35 is from the 1–249 scheme
  (lagna = start of sub 34).
- **KP3-155** · **Number 1–249 → lagna at the start of that sub.** Number 34 → Taurus
  17°46′40″ (Venus–Moon–Mercury); other cusps from the table of houses for the place. ·
  (B3 p. 321) · VERIFIED-ON-FIGURE (Fig. B3.49; our parsed 249-table puts sub #34 at Taurus
  17°46′40″) · HORARY · Same in B6-33 (number 144).
- **KP3-156** · **Theft: will the property return?** Possessions = 2 (movable), 4
  (immovable), 11 (savings). A node in a sign acts for that sign's lord. 4th lord in 6 (12th
  from 7) = thief gains nothing permanent. 11th lord in 12 = loss; retrograde = temporary;
  direct with a vacant 11th = never recovered. A node (always retrograde) in a sign of the
  11th lord, in the thief's 7th → thief cannot keep it. 11th from 7th (thief's gain) lord in
  12th from 7th → thief loses it. · (B3 p. 236–237) · VERIFIED-ON-FIGURE (Fig. B3.30) ·
  HORARY.
- **KP3-157** · **Theft: description and timing.** Thief from the 7th: lord's nature (Mars →
  male, young, bold), aspect from Saturn → dark. Occupants of 7: Moon (feminine) + Ketu →
  two women involved, Ketu (agent of the 2nd from 7th lord) shows they disposed of part.
  Recovery after the 11th lord's station direct (10-1-1965), when it transits the star of
  the lord of the 12th from 7 (= 6th lord, Venus/Bharani) in a sub of a 2nd/11th significator
  (Mercury sub) → 5–19 Feb 1965. Recovered then. Moon in 7 = litigation or theft; Moon with
  Ketu in Ketu's star = confused querent. Lagna lord 108° from the ascendant = favourable
  answer. · (B3 p. 235–238) · VERIFIED-ON-FIGURE (Fig. B3.30) · HORARY · Bharani 24°00′–
  25°53′20″ Aries is the Venus-star–Mercury sub (#17); text "24° and 25°31′" matches.
- **KP3-158** · **Successful theft (from the thief's chart).** Conjoined period of
  significators of 2, 6 and 11, not connected with 5, 8 or 12. · (B3 p. 238) · CLEAR ·
  COMPUTABLE.
- **KP3-159** · **Ruling planets (RP).** Lords of the day, Moon's sign, Moon's star, lagna's
  sign, lagna's star at the moment of judgement (B3 p. 321–322 lists these five). Strength:
  "The lord of the star is stronger than the lord of the rasi which is stronger than the
  lord of the day" (B3 p. 295). A node occupying an RP's sign may replace that RP (Thursday →
  Jupiter → Rahu in Jupiter's sign → Rahu dasa, B3 p. 335). Uses: (a) select the few strong
  significators out of many (B3 p. 321); (b) fix the sub of a cusp when the birth time is
  doubtful ("God will help you by eliminating the previous and the next sub", B3 p. 294);
  (c) confirm the chart: one consults only when consultation RPs agree with natal RPs
  (B3 p. 288–289); (d) time the event: query-moment Moon sign lord, star lord and lagna lord
  give dasa, bhukti, anthra (B3 p. 255). · CLEAR · HORARY · B6-28 adds lagna lord >
  star lord. App has no RPs. Easy to add (all inputs exist).
- **KP3-160** · **Query-moment chart for the purchase date.** 21-2-1966: Moon in Aquarius
  (Saturn), Poorvabhadra (Jupiter); lagna Libra (Venus) → Venus–Venus–Jupiter (an earlier
  line says Venus–Sun–Jupiter: conflict in text). Bought 4-3-1967. · (B3 p. 255–256) ·
  UNCLEAR (two different bhuktis printed) · HORARY · b3a-E23/E24.
- **KP3-161** · **Disease from the query moment.** Saturday, Moon in Poorvashada (Venus) in
  Sagittarius (Jupiter) → "body emaciated due to sugar in urine" → diabetes. Confirmed by the
  6th CSL (Venus in a Moon star in Taurus). · (B3 p. 294–295) · CLEAR · HORARY · b3a-E34.

## 17. Disease, blindness, heart, speech (B3-31 … B3-34)

- **KP3-162** · **Disease needs 6 + 1.** A 6th significator causes disease only if also a 1st
  significator. 6 + 2 (not 1) = entering service or borrowing. 6 + 2 + 12 = loan lost or
  repaid. 6 + 1 + 12 = bedridden or hospitalised. Timing: when significators of 1 and 6
  operate. · (B3 p. 292–293) · CLEAR · COMPUTABLE.
- **KP3-163** · **Cure = 11 (and 5).** If the 11th significator is also a 5th significator,
  cure is sure. Immediate cure is denied unless the sub-sub period of an 11th significator
  follows the disease period; wait for significators of 5 and 11. · (B3 p. 292) · CLEAR ·
  COMPUTABLE · Same in B3 p. 310 (5 and 11), B6-24.
- **KP3-164** · **Fatal disease = 8th CSL.** "that which would be the last disease … is
  indicated by the sub-lord of the 8th cusp" (twins die differently). · (B3 p. 293) · CLEAR ·
  COMPUTABLE.
- **KP3-165** · **Nature of disease = 6th CSL + its star lord's sign.** Find the 6th CSL, the
  star it is in, and the sign of that star lord (at birth or query). Combine sign-part,
  planet-part, sub. Example: 6th cusp Taurus 22°10′ (Venus sign, Moon star, Venus sub). Venus
  in Scorpio (8th sign, watery, sexual/excretory) in Jupiter's star in Libra (kidney,
  bladder) → diabetes. · (B3 p. 294–295) · VERIFIED-ON-FIGURE (Fig. B3.41; cusp
  sign/star/sub recomputed) · COMPUTABLE · b3a-E34.
- **KP3-166** · **Disease tables by planet in sign.** When planet P is the 6th CSL and a sig of
  6 and 1 — or the 6+1 significator is in P's star — P's sign gives the disease (Sun, Moon,
  Mars, Mercury listed; "similarly for Jupiter, Venus and Saturn"). See KP3-197. · (B3
  p. 297–301) · CLEAR · GUIDANCE.
- **KP3-167** · **Blindness (KP).** Vision planets: Sun, Moon, Venus. Blindness in the period
  of the Sun, Moon or Venus, or planets in their stars, or any planet in the star of the 2nd
  occupant/owner and in the sub of a 12th significator connected with Sun/Moon/Venus. 2 =
  right eye, 12 = left eye; 6 disease, 8 danger, 12 defect. If the 12th CSL is in 6, and in
  the star of an occupant/owner of 6, 8 or 12 → defect from the conjoined periods. Planets in
  the star of the 12th occupant show the defect only when the 12th CSL shows disease. · (B3
  p. 301, 306–307) · VERIFIED-ON-FIGURE (Fig. B3.42: 12th cusp Leo 27°32′ = Uttaraphalguni,
  Moon sub; Moon in the 6th) · COMPUTABLE · b3a-E35. No cure if all coming dasa lords are in
  the star of the 12th occupant.
- **KP3-168** · **Health via ascendant CSL (heart chapter).** "If the sub-lord of the
  Ascendant is in the constellation of the significator of 6 or 8 or 12 then one suffers
  from disease or faces danger or is hospitalised." Lagna Leo 25°06′ → Venus star, Mercury
  sub. Mercury sig of 12, 1, 2, 11 → bedridden, heart (Leo), nervous type. Saturn aspect =
  chronic. Cure from 5 and 11 lords and conjunctions → Venus–Mercury–Jupiter, July 1976 (Sun
  in Punarvasu). Sun + Mars + Mercury together → surgeon. · (B3 p. 309–310) ·
  VERIFIED-ON-FIGURE (Fig. B3.43; Leo 25°06′ is Pooram, Mercury sub) · COMPUTABLE · b3a-E36.
- **KP3-169** · **Speech from the 2nd CSL.** Mercury = talks a lot (agent, salesman); Mars =
  blunt; Saturn = speaks little, drags; Jupiter = wise; Venus = talk of the other sex; Rahu
  or Ketu = speech defect. Node in 2 = speech defect; node in 12 = vision defect. Watery
  (mute) vs airy (voice) signs matter. Mars afflicting = struggles to speak; Jupiter
  aspecting = cure "by Divine Grace". · (B3 p. 311–313) · VERIFIED-ON-FIGURE (Fig. B3.45: 2nd
  cusp Aq 26°30′ = PBh, Ketu sub) / UNCLEAR for Fig. B3.44 (printed 2nd cusp Taurus 29°34′ is
  Mrigasira–Saturn sub, but the text says "constellation of a watery planet and sub of
  Kethu". Likely 19°34′-ish, Rohini; see b3a-E37) · COMPUTABLE.

## 18. Overseas, profession, service (B3-36, B3-37, B3-39, B3-40)

- **KP3-170** · **Overseas promise = 12th CSL.** "One will have the opportunity to go overseas
  only when the 12th Cusp sublord is a significator of house 3 or 9 or 12 and the event would
  take place during the conjoined periods of the significators of houses 3, 9 & 12." · (B3
  p. 327) · VERIFIED-ON-FIGURE (Fig. B3.50: 12th cusp Virgo 14°51′ = Hasta, Jupiter sub;
  Jupiter owns 3) · COMPUTABLE · **Yes 3, 9, 12.** Agrees with B6-33. B6 adds the retrograde
  test and sign type for return.
- **KP3-171** · **12th CSL must connect with 3 or 9, preferably 9.** "One can go only when the
  sub lord of the 12th cusp is connected in any manner with 3rd or 9th house; preferably 9th
  house." Everyone has 3/9/12 significators, so they alone don't prove travel. Boundary case:
  12th cusp at Libra 8°40′ "constellation is ruled by Rahu; the sub is also governed by
  Rahu … one minute later, the sub lord will be Jupiter" (in 8 = 12th from 9 → no travel). ·
  (B3 p. 333–334) · VERIFIED-ON-FIGURE (Fig. B3.52) · COMPUTABLE · **Boundary warning:**
  Swati Rahu sub = Libra 6°40′–8°40′ (half-open). At exactly 8°40′00″ the app returns
  Jupiter. The printed cusp is rounded; KSK means just under 8°40′.
- **KP3-172** · **Overseas timing example.** Strong significators Ketu, Rahu, Mars (nodes
  replacing the planets they represent). Left for the UK in Saturn–Rahu–Mars–Saturn.
  Saturn qualifies because it is the sub lord of the 3rd and 9th cusps (cusp route,
  KP3-070). · (B3 p. 328–329) · VERIFIED-ON-FIGURE (Fig. B3.50; III Sg 10°51′ and IX Ge
  10°51′ both Saturn sub; dasa checked) · COMPUTABLE · b3a-E43.
- **KP3-173** · **Profession from the meridian.** "one should note where exactly the meridian
  falls: (b) the lord of the sign the star and sub. Also take into account the planet very
  close to the meridian. The profession is indicated by the combination of these planets and
  the dasa lord in progress." MC Gemini 5° → Mercury–Mars–Sun → surgeon (or mechanical
  engineer, Government press). 10th occupant Moon in a Mars star aspected by Mars and Jupiter
  → surgery. · (B3 p. 352–353) · VERIFIED-ON-FIGURE (Fig. B3.54) · COMPUTABLE · b3a-E46.
  Mars-star sub boundaries: Gemini 4°53′20″–5°33′20″ = Sun sub ✓.
- **KP3-174** · **Profession significator in sign/star/sub.** Judge (a) which planet signifies
  the profession, (b) its sign, star, sub, (c) conjunctions, (d) aspects, above all the dasa
  and bhukti lords. Professions change by sub-period (teacher in Jupiter bhukti → legal
  adviser in Saturn/Mercury/Ketu → public prosecutor in Venus). · (B3 p. 342) · CLEAR ·
  COMPUTABLE.
- **KP3-175** · **Service significators and length of service.** Self-acquisition / service =
  2, 6, 10 in the six-step order. Nodes in their lords' signs or aspected by them are
  stronger. Significators in 3 in a common sign = transferable post. First appointment:
  examine the dasa running between ages 16 and 30. The strongest significators (nodes) give
  bhukti and anthra, on a day with Moon in one of their stars (joined 6-9-1921, Rahu–Ketu–
  Ketu, Swati day). · (B3 p. 354–358) · VERIFIED-ON-FIGURE (Fig. B3.55; dasa dates for the
  1964–1970 bhuktis match the printed Moon balance) · COMPUTABLE · **Service yes 2, 6, 10.**
  b3a-E04.
- **KP3-176** · **Cusp-based house lordship (worked).** "A house commences from the cusp of a
  house and ends with the succeeding cusp." Lagna 1°00′ Cancer, 2nd cusp 26°56′ Cancer →
  Moon owns both 1 and 2. The 2nd house's 25°56′ in Leo does not make the Sun its lord. The
  tabular layout (bhava, planets, sign, sign lord, star lord, sub lord) is preferred over the
  Bhava Chalit chart. · (B3 p. 355–356) · VERIFIED-ON-FIGURE (Fig. B3.55, B3.56) · EXISTS
  (app's cusp-sign ownership) · Text "23°56′ [sic]" should be 26°56′.
- **KP3-177** · **Business vs service; planets in 7.** Business income is unsteady; service
  steady. Plural/dishonest income = connection with Saturn, Mercury and a dual sign. Planets in
  7: Sun steady; Moon changeable; Mars rash; Mercury quick turnover; Jupiter thrives; Venus
  luck; Saturn very bad; Uranus/Neptune unfavourable. KP: planets in 7 in the star of the
  lords of 2, 10, 11 → success; in the star of the lord of 8 or 12 → bad. · (B3 p. 358–359) ·
  CLEAR · COMPUTABLE (KP line) / GUIDANCE (planet list).
- **KP3-178** · **Promotion and parents' death together.** The 10th is 2nd from 9 (father)
  and 7th from 4 (mother), both maraka. So promotions in the 10th lord's period often coincide
  with a parent's death (father died just after Saturn bhukti started, Saturn in a 10th-lord
  star and badhaka lord for Aries = the 9th). · (B3 p. 206) · CLEAR · COMPUTABLE.
- **KP3-179** · **Service character from 12th/movable signs.** Sun in the 12th in a Mercury star
  (lord of 2) in a movable sign → secure Government service far from home, changes of
  department. Saturn (lord 6) in lagna in a Venus star (lord 10), Rahu sub → a position of
  trust, confidential work. · (B3 p. 204–205) · CLEAR · GUIDANCE · b3a-E12.
- **KP3-180** · **Saturn in 10.** Rapid rise, then a fall deeper than the height climbed
  (actors, politicians). Holy places, life abroad, may become a sanyasi. · (B3 p. 144, 222) ·
  CLEAR · GUIDANCE.

## 19. Guidance tables (lookup text keyed by chart points)

- **KP3-181** · **Star-segment table (B3-05).** For each of the 36 sign×star segments: body
  parts, diseases, mental qualities (KSK, then the traditional list in parentheses),
  professions. Use for: lagna, a cusp, or any planet's segment. Key facts per segment, short
  form:
  Aswini (Ar 0–13°20′): head, brain; epilepsy, stroke, meningitis; police, military, surgery,
  machinery; "does not contribute to child birth" unless Ketu benefic.
  Bharani (Ar 13°20′–26°40′): head, eyes; venereal, eye injury; pleasure trades, cinema,
  hotels, leather, veterinary, judge.
  Krittika-a (Ar 26°40′–30°): eyes, brain; fevers, burns, accidents; military, explosives,
  land; Mars at 28°26′40″–29°13′20″ "will not hesitate to fight".
  Krittika-b (Ta 0–10°): face, throat; throat troubles, pimples; Government benefit, arts,
  jewels, foreign trade, recovers bad debts.
  Rohini (Ta 10–23°20′): mouth, neck; sore throat, menstrual; public caterers, dairy, oils,
  perfumes, navy, judge.
  Mrigasira-a (Ta 23°20′–30°): chin, throat; goitre, diphtheria; land, cinema, tailoring,
  taxis, jewellery.
  Mrigasira-b (Ge 0–6°40′): arms, shoulders; fractures, sciatica; machinery, electricals,
  surgeons, brokers.
  Ardra (Ge 6°40′–20°): throat, ears; asthma, septic throat; communications, research, atomic
  energy; "this zone … is barren".
  Punarvasu-a (Ge 20–30°): ears, lungs; pleurisy, pneumonia; journalism, law, teaching,
  astrology; good for pregnancy significators.
  Punarvasu-b (Cn 0–3°20′): lungs, stomach; TB, jaundice; banking, medicine, religion,
  nursing.
  Pushya (Cn 3°20′–16°40′): lungs, stomach; TB, ulcer, cancer; mines, petroleum, wells,
  night work.
  Aslesha (Cn 16°40′–30°): stomach, liver; gas, B-deficiency; agents, writers, water-supply
  engineers, nurses.
  Makha (Le 0–13°20′): heart, spine; shock, palpitation; Government service, defence,
  surgeons, chemicals.
  Pooram (Le 13°20′–26°40′): heart, spine; heart from grief, blood pressure; arts, cinema,
  transport, hotels, women's colleges, jails.
  Uttaraphalguni-a (Le 26°40′–30°): spine; blood pressure, fevers; Government service,
  medical, shipping, heart specialist.
  Uttaraphalguni-b (Vi 0–10°): bowels, liver; tumours; maths, engineering, astrology,
  communications, publication, public health.
  Hasta (Vi 10–23°20′): bowels; dysentery, typhoid, gas; commerce, shipping, textiles,
  engineering, ink, export.
  Chitra-a (Vi 23°20′–30°): lower belly; ulcers, worms; mechanical engineering, press, tax
  and finance, police.
  Chitra-b (Li 0–6°40′): kidneys, loins; renal stones, lumbago; law, surgery, partnership,
  decorators, perfumes.
  Swati (Li 6°40′–20°): skin, kidneys, bladder; urinary, eczema, leprosy; transport, music,
  fancy goods, X-ray.
  Visakha-a (Li 20–30°): lower abdomen, pancreas; diabetes, renal abscess; partnerships,
  travel, banking, speculation.
  Visakha-b (Sc 0–3°20′): bladder, genitals; womb disease, prostate; bank, criminal law,
  insurance, share jobbing.
  Anuradha (Sc 3°20′–16°40′): bladder, rectum, bones; suppressed menses, sterility, piles;
  mines, surgery, leather, oil, jail.
  Jyeshta (Sc 16°40′–30°): colon, ovaries; leucorrhoea, bleeding piles; chemical
  engineering, press, insurance, military accounts.
  Moola (Sg 0–13°20′): hips, thighs; rheumatism, sciatica; religion, law, teaching,
  medicine, horse racing.
  Poorvashada (Sg 13°20′–26°40′): thighs; diabetes, sciatica, lung cancer; judge, banking,
  food, transport, foreign trade, women's hospitals.
  Uttarashada-a (Sg 26°40′–30°): thighs; paralysis of limbs; arbitrator, banking, shipping,
  education, customs.
  Uttarashada-b (Cp 0–10°): skin, knees; eczema, heart thrombosis; positions of trust,
  estate/income tax, archaeology, homeopathy.
  Sravana (Cp 10–23°20′): lymph, knees, skin; filaria, eczema; mines, oil, wet lands,
  plumbing, night work, pearls.
  Dhanishta-a (Cp 23°20′–30°): kneecap; leg injury, amputation; mine engineering, death and
  estate duty, surgery of fractures.
  Dhanishta-b (Aq 0–6°40′): ankles; fractures, varicose, heart failure; agriculture, steel,
  police, research, electricity.
  Sathabhisha (Aq 6°40′–20°): calves; rheumatic heart, palpitation; science, occult, air
  travel, statistics, jail.
  Poorvabhadra-a (Aq 20–30°): ankles; dropsy, palpitation; teaching, astrology, stock
  exchange, insurance, intelligence.
  Poorvabhadra-b (Pi 0–3°20′): feet; swelling, liver; politics, law, finance, jails,
  hospitals.
  Uttarabhadra (Pi 3°20′–16°40′): feet; rheumatism, hernia; prisons, asylums, mines,
  shipping, insurance.
  Revati (Pi 16°40′–30°): feet, toes; deformities, deafness; publishing, law, diplomacy,
  trade, banking, astrology.
  · (B3 p. 31–54) · CLEAR · GUIDANCE · Numbering in the text skips (Makha "11"/"10th star",
  "21. Sravana"); spans are standard. "26°43' [sic]" for Pooram = 26°40′.
- **KP3-182** · **249-sub keyword table (B3-08).** Each sub has 6–20 keywords (body/disease,
  character, profession). Entries are formatted `**N. SignLord, StarLord, SubLord:** (from)-(to)`
  and are machine-extractable. Our script compared every printed range with the app's
  construction: all 233 printed entries agree except **#29** (Venus–Moon–Moon printed end
  11-53-20, correct 11-06-40; marked [sic]). Subs 131–138 (Libra/Swati) and 213–221
  (Aquarius/Sathabhisha) are not listed: "As it is done for Arudra … predict for each sub in
  Rahu star". · (B3 p. 85–125) · VERIFIED-ON-FIGURE (by computation; no figure) · GUIDANCE ·
  Extract programmatically from the vault file; don't hand-copy.
- **KP3-183** · **Node sub rule inside B3-08.** When Rahu or Ketu is the sub lord, first find
  which planet the node represents in the chart; read the sub as that planet's sub. E.g.
  Mercury–Mars–Rahu: if Rahu represents Venus, read as the Venus sub (Gemini meaning); if
  Saturn, read as Saturn (Virgo meaning). · (B3 p. 89, 113 [#31, #122]) · CLEAR ·
  COMPUTABLE.
- **KP3-184** · **Cancer via Jupiter sub on the 6th.** "JUPITER when sublord and a
  significator of 6th cusp, it gives CANCER" (#157 Mars–Saturn–Jupiter → genitals; #190
  Saturn–Sun–Jupiter → breast/lung/knee). Cusp-specific readings in #190 (asc, 2nd, 4th, 5th,
  6th, 8th cusp falling there). #124: ascendant there = thief/forger; with 6/10 → CID/CBI.
  #191: chronic disease only when the 6th cusp falls there. · (B3 p. 115–118) · CLEAR ·
  GUIDANCE · These long entries (Scorpio onward) read like a later editor's additions.
- **KP3-185** · **Rahu/Ketu sub and children.** Venus + Rahu "not productive and barren hence
  birth control". Jupiter + Rahu = birth control. Rahu + Mars = surgery to stop births (#130).
  Many Ketu subs read "barren, no issue". · (B3 p. 86, 105) · CLEAR · GUIDANCE.
- **KP3-186** · **Sign pathology (B3-31).** Aries head, brain … Pisces feet and intestines;
  each sign also rules the opposite sign's parts (Taurus also venereal and piles via
  Scorpio). · (B3 p. 295–297, 310) · CLEAR · GUIDANCE.
- **KP3-187** · **Disease by planet in sign (B3-31).** 12 signs × Sun, Moon, Mars, Mercury
  (e.g. Sun in Leo: palpitation, back, eyes; Moon in Cancer: chronic stomach leading to
  cancer, obesity, epilepsy; Mars in Scorpio: profuse menses, renal gravel, prostate; Mercury
  in Taurus: stuttering, hoarseness, deafness). Jupiter, Venus, Saturn: "similarly". · (B3
  p. 297–301) · CLEAR · GUIDANCE · Mostly Heindel (Message of the Stars).
- **KP3-188** · **Planets and body (B3-31).** Sun: vital fluid, heart. Moon: stomach, uterus,
  lymph. Mars: red marrow, haemoglobin, genitals, burns, surgery. Mercury: lungs, nerves,
  speech. Jupiter: liver, adrenals, tumours, cancer, sugar. Venus: throat, kidneys,
  venereal. Saturn: bones, teeth, chronic disease, obstruction. · (B3 p. 291–292) · CLEAR ·
  GUIDANCE.
- **KP3-189** · **Star-lord result lists (B3-10).** Short keywords for "a planet in the star of
  X, where X is in or owns house H":
  **Sun** 1 dignity, promotion; 2 gain via Government/industry; 3 courage, agency; 4
  property; 5 speculation, children (difficult delivery); 6 service gain but weak health; 7
  success after marriage, arbitration; 8 long life, legacy; 9 colleges, law, overseas; 10
  status, promotion; 11 ambitions fulfilled; 12 medicine, hospital, seclusion.
  **Moon** 1 changeful, weak build; 2 more income; 3 journeys, social; 4 change of residence,
  property, vehicle; 5 pleasure, daughters; 6 ill health, debts, changes job; 7 early
  marriage, travel; 8 danger to mother, but profitable deals; 9 voyages, foreign life; 10
  change of business, public life; 11 friends, politics; 12 loss, hospitals, voyages.
  **Mars** 1 bold, scar on head; 2 income = expenses; 3 courage, danger to brother; 4 loss,
  mother's ill health, property dispute; 5 surgery at delivery, speculative loss; 6 lands,
  victory; 7 unhealthy wife, litigation; 8 short life, losses; 9 export, power; 10 business,
  promotion, estate; 11 income rises, property; 12 danger, scandal, jail visits.
  **Mercury** 1 learned, astrology/maths; 2 gains by writing/teaching; 3 short journeys,
  reading; 4 education, changes residence; 5 worry yet adviser; 6 labour trouble, nervous;
  7 unsettled marriage, litigation; 8 disputes yet long life; 9 higher studies abroad; 10
  business success, promotion; 11 property, wealth; 12 occultism, scandal.
  **Jupiter** 1 health, children, career; 2 income, banking; 3 brothers, publicity; 4 home,
  estates, education; 5 children, speculation; 6 well cared for when ill, election win; 7
  good partner, wealth, wins cases; 8 loss of property but legacy; 9 religion, luck to father;
  10 promotion, political life; 11 friends, ambitions; 12 law, medicine, foreigners, moksha.
  **Venus** 1 arts, fortune; 2 fortune, happy marriage; 3 prosperous brothers; 4 home,
  vehicles, cattle; 5 beautiful children, speculation; 6 health maintained, election win;
  7 social and business success; 8 income, legacy, insurance; 9 higher studies, foreign
  success; 10 popularity, success in litigation; 11 very rich, comforts; 12 secret pleasures.
  **Saturn** 1 lazy, losses; 2 hard labour low pay; 3 income, victory, death of brother; 4
  loses ancestral property, voyages; 5 abortions, speculation loss; 6 victory, chronic
  disease; 7 late marriage, poor business; 8 losses, chronic disease, slow death; 9
  philosophy, science; 10 rapid rise and fall; 11 hopes fulfilled, property; 12 seclusion,
  imprisonment risk.
  · (B3 p. 132–144) · CLEAR · GUIDANCE · Keyed by star lord + house (occupation predominant,
  KP3-013).
- **KP3-190** · **Education subject combinations (B3-27).** Astrology: Mercury sig of angles +
  Venus sig of 5/9/2 + 2nd lord linked. Maths: Mercury strong and sig of 2, 4 or 9. Law:
  Jupiter (law), Mercury (fluency), Mars (logic), 4th/9th CSL Mars/Mercury. Engineering:
  Mars + Mercury (mechanical/civil), Venus + Mercury (sanitary/chemical/electrical/auto), Sun
  + Mercury (chemical, drugs), Moon + Mercury (textile), Moon + Mars + Mercury (marine), Moon
  + Saturn + Mercury (mining). Philosophy: Sun + Mercury as sig 5 with Saturn, or Jupiter +
  Saturn as sig 4/9. Music: 5 music, 2 vocal, 3 instrumental; Venus taste, Mercury rhythm.
  Journalism: Jupiter, Mercury, Moon signifying 3 and 9. Accounts: Mercury, Moon, airy signs,
  Virgo. Geology: Saturn/Capricorn/Saturn sub. Geography: Sun. Chemistry: Venus and Sun.
  Physics: Mercury, Venus. History: Moon, Mercury, Jupiter. Medicine branches: Sun with
  Jupiter (physician), Mars (surgeon), Venus + Jupiter (maternity) etc. · (B3 p. 273–278) ·
  UNCLEAR for the medicine-branch table (OCR lost the row pairing: 19 branches vs 20
  combinations) · GUIDANCE.
- **KP3-191** · **Profession = planet combinations (B3-40).** ~250 rows (Abrasives = Saturn,
  Mars, Mercury … ministries with houses, e.g. Finance = Jupiter, Mercury, Mars, 2nd and
  11th?). · (B3 p. 343–351) · UNCLEAR: on pp. 344, 346, 348–351 the OCR separated names from
  combinations, so the pairing is unverified. No figure. Pp. 343, 345, 347 are proper tables
  (CLEAR). · GUIDANCE · Use only the clean pages until the scans are checked.
- **KP3-192** · **Wealth karakas by planet.** Mercury: liquid cash, shares, documents. Jupiter:
  all property, buildings, gold. Venus: jewels, vehicles, furniture, garden. Saturn: land,
  mines, antiques. Mars: land and buildings. Sun: authority, gold. Moon: cash, wet lands.
  Benefics in movable signs → sudden wealth; fixed → steady; common → hard to save. · (B3
  p. 191) · CLEAR · GUIDANCE.
- **KP3-193** · **Decanate body map (heart chapter).** Counting from the lagna sign, the first
  decanate of signs 1…12 maps head, right eye … left eye. The second maps neck, right
  shoulder … left shoulder. The third maps pelvis … anus. · (B3 p. 308) · CLEAR · GUIDANCE ·
  Traditional (Jatakadesa Marga); not used further by KSK.

## 20. Traditions quoted only to reject (REJECTED-TRADITION)

- **KP3-200** · **Natural and lordship benefics.** Hindu (Jupiter, Venus, waxing Moon,
  unafflicted Mercury benefic; lords of 3, 6, 8, 11 malefic; lords of 1, 5, 9, 10 benefic)
  and Western (aspect-based) classifications. KSK: benefic/malefic only per matter, via star
  and sub (KP3-032). · (B3 p. 146) · CLEAR · REJECTED-TRADITION · He keeps "lords of 1, 5, 9,
  10 benefic; 6, 8, 12 malefic" for longevity only (KP3-077).
- **KP3-201** · **Longevity yogas.** Short/middle/long-life combinations ("284 such rules"),
  laborious ayur calculations, Western progression afflictions. "They fail miserably in case
  of Twins." · (B3 p. 168–171) · CLEAR · REJECTED-TRADITION.
- **KP3-202** · **Kendradhipatya dosha.** See KP3-084. · (B3 p. 175) · CLEAR ·
  REJECTED-TRADITION.
- **KP3-203** · **Death yogas.** Lion, cobra, dog bite, fire, drowning combinations; the 22nd
  decanate; the 8th lord's decanate. "fails in the case of births with a short interval". ·
  (B3 p. 180–181) · CLEAR · REJECTED-TRADITION.
- **KP3-204** · **Raja yogas and wealth/poverty yogas.** Gajakesari, Lakshmi, Chandra-Mangala,
  Sunapha, Adhi, Nipuna, Vesi; Mahadeva's and Jataka Tatva's wealth and poverty lists;
  avasthas. "Existence of Rajayoga … is not a guarantee … it fails miserably and hence it is
  meaningless." · (B3 p. 192–200, 185, 273) · CLEAR · REJECTED-TRADITION · App's 1001 PL
  yogas: KP would mark them "not used for prediction".
- **KP3-205** · **Sade Sati.** "an excuse for the astrologer with half-baked knowledge … a
  meaningless 'Slogan'." · (B3 p. 210) · CLEAR · REJECTED-TRADITION · App shows Sade Sati.
  KP tab could add this note.
- **KP3-206** · **Chandrashtama and blanket transit rules.** Planets in the 8th from Moon,
  Saturn in 11, "planet in 11 does only good", kona houses always good: all overruled by the
  star lord. · (B3 p. 25, 59, 73, 131) · CLEAR · REJECTED-TRADITION.
- **KP3-207** · **"Karako bhava nasaya".** Mars in 3 does not deny brothers ("fails
  miserably"). Hindu brother rules (number from the navamsa of the 3rd, male/female planets in
  9). · (B3 p. 238–239) · CLEAR · REJECTED-TRADITION.
- **KP3-208** · **Hindu house rules.** Movable/fixed 4th for changing residence, the number of
  houses from benefics in kendras, haunted houses, Moon in Cancer/Virgo owns houses, Meena
  navamsa lives in others' houses: "general"; KP judges star and sub. · (B3 p. 246–248) ·
  CLEAR · REJECTED-TRADITION.
- **KP3-209** · **Guru balam and vehicle yogas.** KSK no longer uses "Guru balam" (Jupiter
  transit strength). Vehicle-type yogas (palanquin, cart, motor, accident) quoted at length
  but not KP. · (B3 p. 259–271) · CLEAR · REJECTED-TRADITION.
- **KP3-210** · **Blindness rules.** 23 Hindu rules ("we should be blind and deaf according to
  these rules"); Western nebulous degrees (Pleiades Ta 29°, Aselli Le 6°, Antares Sg 8°). None
  fits the blind child's chart. · (B3 p. 301–306) · CLEAR · REJECTED-TRADITION.
- **KP3-211** · **Heart rules.** Moon in Aquarius, 5th house/Sun (Western), 4th/Cancer
  compromise: "before one takes a decision to follow any, his next birth will approach." ·
  (B3 p. 308) · CLEAR · REJECTED-TRADITION.
- **KP3-212** · **Marriage-timing yogas.** Lists for "marriage promised", "late marriage"
  (fruitful signs, Saturn in 1/3/5/7/10, Mars in 8, etc.) quoted, then used loosely. ·
  (B3 p. 314–318) · CLEAR · REJECTED-TRADITION (KSK points to the 2-7-11 method and Reader
  IV).
- **KP3-213** · **Profession from the navamsa lord of the 10th lord.** Jataka Parijata and
  Phala Deepika method: twins prove it wrong; KP uses the MC sign/star/sub (KP3-173). ·
  (B3 p. 335–340, 353) · CLEAR · REJECTED-TRADITION.
- **KP3-214** · **Bhava Chalit (Chaleeth) chart.** "misleading"; use a cusp table instead. ·
  (B3 p. 355) · CLEAR · REJECTED-TRADITION.
- **KP3-215** · **Debt and Dharidra yogas; navamsa lending rules.** Quoted lists (Hindu).
  · (B3 p. 222–226) · CLEAR · REJECTED-TRADITION.
- **KP3-216** · **"Swabhukti is bad".** "That Swabhukti will be indifferent or bad, is
  generally predicted by astrologers who simply reproduce the slokas" — Moon–Moon gave a
  race win. · (B3 p. 214) · CLEAR · REJECTED-TRADITION.

## 21. Practice notes

- **KP3-217** · **Never predict death to the patient.** Quoting Heindel: "Never tell a patient
  a discouraging fact … Never, never predict death … If you cannot say any thing
  encouraging, be silent." · (B3 p. 291) · CLEAR · GUIDANCE · Relevant to how the app words
  8th-cusp and maraka results (several B3 examples do predict death dates: present them as
  research, not advice).
- **KP3-218** · **Astrologer's wording.** Never use "likely", "may", "I think". First tell the
  querent the number promises good luck if the lagna lord aspects the lagna favourably. ·
  (B3 p. 235) · CLEAR · GUIDANCE.
- **KP3-219** · **Twin test is the yardstick.** Every KP rule is justified by twins: whatever
  differs for twins (cusps, their subs) must carry the difference in results; whatever is
  shared (planets' signs, yogas, Moon sign, dasa) cannot. · (B3 p. 3, 78, 166, 188, 256,
  293, 311, 334) · CLEAR · GUIDANCE · The reason the cusp sub lord is the decisive factor.

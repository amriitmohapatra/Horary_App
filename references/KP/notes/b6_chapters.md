# B6 "Horary Astrology": relevance verdicts for each chapter (b6)

Reader: agent b6. Scope: all 36 vault notes `B6-00` … `B6-35` (PDF pp. 1–333, 78 figures).
Rule IDs in `b6_rules.md` are `KP6-001` … ; worked charts are in `b6_examples.json`
(`b6-E01` … `b6-E65`).

Verdict legend (from the brief): **EXISTS** · **NEW-COMPUTABLE** · **NEW-GUIDANCE** · **HORARY** ·
**NOT-RELEVANT**. "REJECTED-TRADITION" marks parts where Krishnamurti quotes traditional
Hindu or Western rules only to reject them (recorded as a rule status in `b6_rules.md`).

> **Reading notes that matter for citations and for any engine work**
>
> 1. **Two kinds of lagna in one chart.** In every B6 horary example the *chart* lagna comes
>    from the querist's number (1–249). The *Ruling Planets* use the lagna that is really rising
>    at the place and moment of judgement. Example: number 217 puts the horary lagna at
>    Aquarius 14°26'40", but the RPs use "the lagna is Rishaba" (p. 193). An engine must keep
>    the two apart.
> 2. **From B6-25 onward the vault text is a lightly cleaned OCR.** Chart callouts are
>    labelled "OCR (unverified)", and many figure labels are misprinted (cusp numerals
>    swapped, "Mer" printed for Mars or Uranus, wrong years). I opened every chart and table
>    image except F001, F005–F008, F010, F011, F043 and F057. Each misprint I found is listed
>    in that example's `notes` field.
> 3. **The printed significator tables are not uniform** (F020, F026, F030, F067). I
>    recomputed them from the printed positions with
>    a throw-away script (session scratchpad, not kept in the repo). The non-node rows match the app's A–D levels exactly in
>    three of the four tables. The fourth (F030, no. 175) leaves out level C. The node rows
>    use an agency rule that changes from example to example. See KP6-021…KP6-024.
> 4. **The B6 249-sub table (figs. B6.4–B6.10) is identical to the app's generated table.**
>    I checked 40 horary numbers that the examples use against a regenerated table. All
>    match. The book's own text is wrong for nos. 69 and 184 (see rules KP6-001 and
>    KP6-002).

| Ch. | Title (vault) | PDF pp. | Content in one line | Verdict(s) | Reason |
|---|---|---|---|---|---|
| B6-00 | Front Matter | 1–2 | Cover, title page | NOT-RELEVANT | No doctrine |
| B6-01 | Contents | 3–8 | Printed table of contents (112 items, page numbers of the original edition) | NOT-RELEVANT | Only useful to map the old page numbers |
| B6-02 | Introduction | 9–17 | Twin-birth research. Hindu and Western systems compared on 12 points (zodiac, mansions, day from sunrise, bhava vs cusp-to-cusp houses, dasa, progression, transit from Moon vs Sun, aspects, strength, Ashtakavarga) | NOT-RELEVANT (+ one definition: day = sunrise to sunrise, KP6-041) | Background and polemics. The sunrise-day rule is needed for the RP day lord |
| B6-03 | About the Author by Various People | 18–20 | Testimonial letter (B. Prasad, 1965); Jaipur study-circle speech | NOT-RELEVANT | Testimonials |
| B6-04 | Astrology – An Occult Science | 21–22 | Astrology as a science; critics have afflicted Mars–Mercury | NOT-RELEVANT | Polemic |
| B6-05 | History of Astrology | 22–29 | History (Chaldea, Egypt, Greece, India); Nadi readers | NOT-RELEVANT | History |
| B6-06 | Available Data Incomplete | 29–30 | Surviving literature is partial | NOT-RELEVANT | Essay |
| B6-07 | Its Use and Limitations | 30–31 | Astrology gives solace and readiness | NOT-RELEVANT | Essay |
| B6-08 | Branches; Horary, Why Preferred | 31–38 | Natal vs horary. Why birth times are unreliable (no standard time before 1-1-1906). Fortuna and cusps explain differences between twins. Horary "number within 108", "not numerology". Nine reasons to prefer horary | NOT-RELEVANT (+ KP6-007 context: number method) + NEW-GUIDANCE (Fortuna for transit, one line, p. 32) | Argument for horary. Fortuna is only mentioned (no rule in B6) |
| B6-09 | Prasna Gnana (Bhattotpala), translation | 39–52 | 10 planetary states (Deeptha … Bheedhi), seating, sincerity tests, sloka rules for bhavas, war, marriage, sex of child, taste, dreams, rain, theft, gunakara timing, shadow method | REJECTED-TRADITION (catalogued in KP6-180) | Krishnamurti adds "(not always)" or "not in all cases" to most of them. The shadow and syllable lagna methods are obsolete |
| B6-10 | Uthrakalamritha horary, translation | 53–58 | Number 1–108 ÷ 9 gives sign and navamsa; Jupiter-cycle birth-time reconstruction; Sthula and Sukshma Moon; Aruda lagna; timing by dividing the number | REJECTED-TRADITION (KP6-181) + background to KP6-007 | Source of the 1–108 method that KP replaced with 1–249 |
| B6-11 | Shatpanchasika (Prithuyasas), translation | 58–66 | Fixed, movable and dual lagna; return of a traveller; war; lost property (decanates); sex of child | REJECTED-TRADITION (KP6-182) | Quoted tradition, not KP |
| B6-12 | Jinendramala and Bhuvana Dipakam, extracts | 67–70 | Planet and sign keywords (places, crops, animals, colours, times); Padmaprabhusuri | REJECTED-TRADITION (KP6-183) | Krishnamurti: "general … not at all helpful"; "constellation theory alone will prove to be successful" (p. 70) |
| B6-13 | Western horary (Simmonite, Hone, Zadkiel) | 71–75 | Time of erecting a horary figure (Western views); what each planet signifies | REJECTED-TRADITION (KP6-184) + NOT-RELEVANT | Western; KP takes the *time of judgement* instead (KP6-004) |
| B6-14 | Signs and Places | 75–76 | Places for each sign (theft, lost articles) | NEW-GUIDANCE (low priority) | Keyword table that could be shown for the sign of a significator in theft questions |
| B6-15 | Signs – Countries and Cities; How Westerners Judge | 76–82 | Countries and cities per sign; Western aspects, orbs, timing and distance rules | NOT-RELEVANT + REJECTED-TRADITION (KP6-184) | "One cannot give such a clear and precise answer as one who follows KP" (p. 81) |
| B6-16 | Krishnamurti Padhdhati – Advanced Stellar Astrology | 82–103 | Why the number gives sign, star and sub. Star lords, the 9 unequal subs in dasa proportion, 249 units. **Significator order of strength** (p. 95). Planet gives results of its star lord's house; sub lord decides good or bad (pp. 96–99). Two natal examples (1900, 1928) with deaths, marriage and education timed by Dasa/Bhukti/Anthra | EXISTS (star/sub table) + NEW-COMPUTABLE (KP6-020…039, KP6-104) + NEW-GUIDANCE | The core doctrine of the book. The p. 95 order of strength is exactly the app's A–D levels, ranked |
| B6-17 | Erection of Horary Horoscope; Ready Reference Table | 103–115 | Time of judgement, not time of query. Number → start of the sub → +KP ayanamsa → Raphael's (Placidus) table at the **latitude of the place of judgement** → other cusps → −ayanamsa. Planets for the moment of judgement (IST). 249-sub table (figs. 4–10). Nodes never retrograde. A number above 249 means "no" | HORARY (KP6-001…009) + EXISTS (249 table) | The number method in full. It can be computed with the existing Placidus engine (solve RAMC for the given ascendant) |
| B6-18 | Twelve Signs – Classification | 116–118 | Positive/negative, movable/fixed/common, fruitful/barren, mute, violent, human, voice, bestial, dual, bicorporeal, short/long ascension signs | NEW-COMPUTABLE (lookup tables used by later rules: KP6-105) | Needed by the children, twins, vehicle and second-marriage rules |
| B6-19 | How to Judge – Appearance, Health, Finance, Love | 118–125 | Appearance and character from the sign that holds the star lord of the ascendant's sub lord. Disease from the sign that holds the star lord of the 6th cusp's sub lord. Finance from the 2nd cusp's sub lord; romance from the 5th and 7th | NEW-COMPUTABLE (the pointer, KP6-110…113) + NEW-GUIDANCE (12-sign texts) | Works on any chart, natal included. A clear pointer plus a keyword table |
| B6-20 | What the Twelve Houses Signify | 125–132 | Long keyword lists per house, including derived relations (e.g. 6th = loss to the partner) | NEW-GUIDANCE | House keyword reference for the UI |
| B6-21 | Ruling Planets – Worked Examples | 132–153 | **Definition of RPs**, nodes as agents, rejection through retrograde stars. Timing short events by the rising lagna (trunk call, friend, servant, train). Moon, Sun or Jupiter transit for days, months or years. **Birth-time rectification by RPs** (3 cases: 1919, 1948, 1913 with date of birth) | NEW-COMPUTABLE (KP6-040…052) + HORARY (examples) | RPs need only a moment and a place, so they are computable for "now" and for natal rectification |
| B6-22 | Strength of Planets – Retrograde | 153–156 | Western and Hindu strength rejected. **Natal: retrogression does not matter.** Container/content rule (exaltation of the star lord). **Horary retrograde rules** | REJECTED-TRADITION (strength) + NEW-COMPUTABLE (KP6-027, KP6-028) + HORARY (KP6-029) | Clear and computable |
| B6-23 | Eclipsed (combust) Planets | 156–163 | Traditional views (Kalidas, Prithuyasas, Mantreswara). KP: a cusp sub lord placed in the star of an eclipsed planet → evil list per cusp. Transit and electional notes. Western Sun conjunctions. KP research: eclipsed planets still give results | REJECTED-TRADITION + NEW-GUIDANCE (KP6-034, 035) | No orb is given in B6. B3-76 gives 8°30', B1-13 gives 5°/10°/15° |
| B6-24 | I House – Longevity, Absent Person | 163–170 | Badhaka (movable 11, fixed 9, common 7) and maraka (2, 7). Ascendant sub lord in the star of badhaka/maraka significators → death; of 6 → illness; 8 → accident; 12 → hospital. Disease, cure, accident. Absent person alive or dead. News | HORARY (KP6-120…125) + NEW-COMPUTABLE (badhaka/maraka houses, KP6-104) | Example no. 246 with death timed by D-B-A-S |
| B6-25 | II House – Buying, Finance, Second Marriage | 170–177 | Fridge purchase (4, 11, 12 + Saturn); sales (3, 11 vs 12). **Second marriage**: 7th sub lord in a dual sign or Mercury, and a significator of 2 or 11. Significator table F020. RP selection, Venus transit | HORARY (KP6-126…129) + NEW-COMPUTABLE (second-marriage test, also usable natally, KP6-129) | F020 is an oracle for the significator engine |
| B6-26 | III House – Appeals, Interviews, Reports, Journalism | 177–183 | Appeal (3rd sub lord, 6 & 11 vs 5 & 12); negotiation; interview (3, 9, 11); true or false report (star lord of the 3rd sub lord: Saturn false, Mars mischief, Jupiter true); exchange (2, 6, 11 vs 5, 8, 12); journalism | HORARY (KP6-130…135) | Question-only rules |
| B6-27 | IV House – House, Property, Vehicle, Exams, Admission | 183–200 | House construction (4, 11, 12); buying a built house (+6, 9). Sale (3, 5, 10). Vehicle type from the 4th sub lord, wheels from sign classes. Disposal (3, 4, 5, 10). Exam courage (3rd sub lord), sitting (lagna), success (4, 9, 11). Treasure; admission. **RP order of strength** (p. 194) | HORARY (KP6-136…146) + NEW-COMPUTABLE (RP strength, KP6-045; "Poonaraphoo" Saturn–Moon, KP6-036) | Significator table F026 is an oracle |
| B6-28 | V House – Love, Children, Childbirth, Lottery | 200–227 | Love; invalid child; business partner; actor. **Progeny test** (5th sub lord: not retrograde, not in a retrograde star, signifies 2/5/11; 11th cusp = partner). Childbirth timing. Twins; pregnancy; adoption; lottery; which relative gains. Explicit significator order (a)–(f), p. 206 | HORARY (KP6-147…158) + NEW-COMPUTABLE (progeny promise on the natal 5th/11th cusp, KP6-149) | F030 significator table: level C missing (author inconsistency) |
| B6-29 | VI House – Loans, Recovery, Theft, Strikes | 227–249 | Overdraft (2, 6, 10); borrowing (6th sub lord, planet → manner, Saturn aspect → partial, lender by derived house); repaying (12th); recovering dues (6th); theft (7th = thief, thief profile by the houses the 7th's significators also signify, place); full number-to-cusps procedure (p. 239); Air India strike (number within 108) | HORARY (KP6-159…166) + HORARY procedure (KP6-002) | Includes the clearest statement of the cusp procedure |
| B6-30 | VII House – Purchase, Marriage, Reunion, Partnership | 249–265 | "Buying" a person; marriage (no. 74 again: promise from the 7th sub lord, 2-7-11 significators, Rahu transit, Sun transit); reunion with husband (1966); "Will my husband join me?" (no. 1); partnership continuation/break (6 & 12 vs 5 & 11); separation and demise house groups for each relative (p. 264) | HORARY (KP6-167…171) + NEW-GUIDANCE (relative house groups, KP6-172) | The relative tables are derived-house arithmetic |
| B6-31 | VIII House – Dowry, Legacy, Suicide | 265–269 | Dowry (8th sub lord, 6 & 11 vs 5 & 12, amount by the star lord's dignity); chastity; scholarship; donation; will/legacy (no. 43); suicide; murder; epoch experiments rejected | HORARY (KP6-173…177) + REJECTED-TRADITION (prenatal epoch) | Question-only |
| B6-32 | IX House – Father, Overseas, Research, Transfer | 269–285 | Whereabouts of father (3, 9, 12 from the 9th to leave; 2, 8, 11 from the 9th to return); overseas (12th sub lord promise, 9th sub lord journey, 3-9-12 significators); study abroad (4, 9, 11); medical exam; research (no. 203 with the Sayana→Nirayana working shown); **house-group list** (p. 282); transfer (3, 10, 12); RP order of strength repeated | HORARY (KP6-178…179, KP6-190…197) + NEW-COMPUTABLE (matter→house-group table, KP6-060) | The p. 282 list is the backbone of a matter-wise promise table |
| B6-33 | X House – Job, Promotion, Politics, Business, Spiritual | 285–319 | Job (2, 6, 10); nature of the job from the 10th cusp's sign/star/sub lords; earning; politics; promotion (11th sub lord test); institute; higher status; seniority (no. 184 with the Sayana working); change of job (3, 5, 9 = 6/8/12 from the 10th); reinstatement; foreign assignment (+6); air or sea journey; settling abroad (12th sub lord's sign quality); change of business place; press; spiritual life; sanyasa; reappointment; cure (no. 249). Significator table F067 | HORARY (KP6-198…214) + NEW-COMPUTABLE (job-nature pointer; change-of-job group 3-5-9) | F067 is an oracle |
| B6-34 | XI & XII House – Return, Imprisonment, Raids, Gems, Passport | 319–331 | Missing son (no. 19); RPs agree with a presented chart's birth star; imprisonment (12th sub lord must be Rahu + tests); astrologer's delay (7th sub lord); IT prosecution; raid (12th sub lord, informant by house pairs); gems (KP: wear the gem of the benefic signifying 1/2/11; never the malefic's); passport; premier | HORARY (KP6-215…222) + NEW-GUIDANCE (gem rule, KP6-223) + REJECTED-TRADITION (remedial gem of the malefic, KP6-185) | Gem rule is natal-usable |
| B6-35 | Which Time Is Good – Electional; Whom to Pray | 331–333 | Electional sub-lord tests (servant, buy, sell, service, agreement, business, film release, foundation, probation/promotion); deity selection | NEW-COMPUTABLE (electional: KP6-224…232, needs a moment chart only) + NOT-RELEVANT (prayer advice) | Electional = a chart for a proposed moment; the app's transit chart can supply it |

## Counts

| Verdict | Chapters (a chapter can carry two) |
|---|---|
| EXISTS | 2: B6-16 (star/sub doctrine), B6-17 (249 table) |
| NEW-COMPUTABLE | 12: B6-16, 18, 19, 21, 22, 24, 25, 27, 28, 32, 33, 35 |
| NEW-GUIDANCE | 8: B6-08, 14, 16, 19, 20, 23, 30, 34 |
| HORARY | 13: B6-17, 21, 24–34 |
| REJECTED-TRADITION | 10: B6-09, 10, 11, 12, 13, 15, 22, 23, 31, 34 (parts) |
| NOT-RELEVANT | 12: B6-00…08, 13, 15 (lists), 35 (prayer part) |

Rule catalogue: 165 entries (KP6-001…232, with gaps). Examples: 65 charts, 60 checked against
the page image, 52 with a horary number.

## Judgement for the app owner: what B6 offers a NATAL tool

B6 is a horary book, but about half of its machinery does not depend on the question
moment. Ranked by usefulness to Astro-Amriit (natal-first):

1. **Significator order of strength (p. 95, repeated pp. 165, 206, 253, 255, 284, 286, 325).**
   Directly natal. The app already computes A–D, so only the ranking, the "vacant star → its lord
   is strong" rule and the node-agent rule need adding (KP6-020…026).
2. **Ruling Planets (B6-21).** They depend only on a moment and a place, so the app can show
   "RPs now" (and at any chosen moment) without any horary number. Natal uses: **birth-time
   rectification** (the sign, star, sub and sub-sub of the birth lagna must be ruled by the RPs
   at the moment of judgement), confirming the birth star, and filtering timing candidates
   (dasa lords that are also RPs). KP6-040…052.
3. **Cuspal sub-lord promise tests.** The tests are written for horary cusps, but the same
   sub-lord logic is how B3/B4 judge natal cusps. Clean tests usable on natal cusps: progeny
   (5th/11th), second marriage (7th), promotion (11th), imprisonment (12th = Rahu), going abroad
   (12th), settling abroad (12th sub lord's sign quality), reinstatement (10th), job nature (10th
   cusp lords), disease pointer (6th), appearance (lagna sub lord's star lord's sign). Mark them
   "horary rule applied to natal: research" in the UI.
4. **Matter → house-group table (p. 282 + every chapter).** The same groups serve natal
   timing (D-B-A lords that signify the group).
5. **Retrograde:** the natal rule is "ignore it" (p. 154). The retrograde rules are horary only.
   This is an important negative rule for the UI: do not flag natal retrograde planets as
   denials.
6. **Combust (eclipsed):** guidance only. KP says they still give results (p. 163).
7. **Horary-only:** the 1–249 number method, all question answers, short-event timing by the
   rising lagna, Moon as "mind of the querist", the electional tests (these need a proposed
   moment, so they could live in a muhurta tool, not in a natal chart).

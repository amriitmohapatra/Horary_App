# B3 "Predictive Stellar Astrology", chapters B3-00 … B3-40: relevance verdicts (b3a)

Reader: agent b3a. Scope: vault notes `B3-00` … `B3-40` (PDF pp. 1–360). Agent b3b covers
B3-41 onward. Rules: `b3a_rules.md` (KP3-001 … KP3-193, KP3-200 … KP3-219). Worked charts:
`b3a_examples.json` (b3a-E01 … b3a-E47).

Verdicts (from the brief): **EXISTS** · **NEW-COMPUTABLE** · **NEW-GUIDANCE** · **HORARY** ·
**NOT-RELEVANT**. "REJECTED-TRADITION" marks the parts where Krishnamurti quotes traditional
Hindu or Western rules only to dismiss them. Those are catalogued as rules with that status
(KP3-200 … 216).

> **Chapter-split warning (matters for citations).** The vault's chapter boundaries near
> the end of this range don't match the content.
> - **B3-38** ("Higher Studies and Foreign Country", p. 331) holds only one line: "Moon Dasa
>   balance 7 years 4 months 20 days". That line belongs to the chart printed under
>   **B3-39**.
> - **B3-39** (pp. 332–335) is titled "Profession – Nature and Length of Service", but its
>   text is the higher-studies/overseas example.
> - The "Nature of Service" and "Length of Service" sections are inside **B3-40**
>   (pp. 352–359).
> - B3-40's title ("Change in Job – 9th House Explains") comes from a reader's letter and the
>   book's contents list. The transcribed text states **no** 9th-house job-change rule (for
>   one, see B6-33).
>
> Cite by PDF page, not by vault chapter title. The last lines of B3-40 (p. 359) introduce a
> 15-11-1933 chart whose figure and analysis are in B3-41 (b3b).

| Ch. | Title (vault) | PDF pp. | Content in one line | Verdict(s) | Reason / rule IDs |
|---|---|---|---|---|---|
| B3-00 | Front Matter | 1–2 | Cover and title page | NOT-RELEVANT | No doctrine |
| B3-01 | About the Author | 3–5 | Biography of K. S. Krishnamurti (b. 1-11-1908, Thiruvaiyaru) | NOT-RELEVANT | Biography. His own chart reappears as b3a-E30 |
| B3-02 | Contents | 6–10 | Printed contents list (89 items, older page numbers) | NOT-RELEVANT | Only explains the chapter-split mismatch |
| B3-03 | Letters and Testimonials | 10–15 | Praise from Ceylon, Malaya, Australia | NOT-RELEVANT | Testimonials |
| B3-04 | Krishnamurti System | 16–29 | 27 stars ruled by 9 lords in Vimshottari order. Each star split into 9 subs in dasa-year proportion, starting from the star lord (249 sign-star-sub units). Transit: star lord = what happens, sub lord = good or bad | EXISTS (star/sub table, KP3-001, 003–005) + NEW-COMPUTABLE (transit by star and sub, KP3-008) + REJECTED-TRADITION (Saturn-in-11 rule, KP3-009) | App already builds the 249-sub table exactly as described. Two printing errors in the sub-width text and Fig. B3.8 (KP3-003) |
| B3-05 | Constellations and Their Significance | 30–54 | For 36 sign×star segments: body parts, diseases, mental traits, professions. Results of a dasa–bhukti pair come when either lord or a luminary transits the zone that combines them | NEW-GUIDANCE (KP3-181) + NEW-COMPUTABLE (zone-transit timing, KP3-117) | A text table keyed by the segment of any point. The timing rule can be computed with the transit engine |
| B3-06 | What Each Star Signifies to Each Lagna | 55–77 | For each lagna sign: a planet in (or transiting) a star gives the matters of the houses its star lord owns, "not the results of the sign". Nodes act through their conjunct/aspecting planet, then their star and sign lords | NEW-COMPUTABLE (KP3-011, 012, 031) + NEW-GUIDANCE (per-lagna remarks, KP3-015, 016) + REJECTED-TRADITION (Chandrashtama and "planet in 11 is good", KP3-206) | Ownership arithmetic from the lagna sign plus node proxy rules |
| B3-07 | Role of Sub | 77–85 | Sign = strength/extent. Star lord = nature of result. Sub lord = favourable or not. Planet = source. Twins differ by sub. Sagittarius profession table by star/sub | NEW-COMPUTABLE (KP3-017–021) + NEW-GUIDANCE (KP3-022) | The core KP triad, computable from existing star and sub lords |
| B3-08 | Significance of Each Sub | 85–125 | Keywords (body, disease, character, profession) for each of the 249 units, with arc ranges. Node-sub rule. Jupiter sub on the 6th = cancer | NEW-GUIDANCE (KP3-182–185) | Lookup table keyed by sub number. Our script matched all 233 printed ranges to the app's construction; one misprint (#29) |
| B3-09 | Sub Useful for Detailed Reading | 125–129 | Planets in one star give opposite results by sub. Stages of a matter as a significator transits the subs of another significator's star (marriage, litigation). Child, travel/return, car bought/sold examples | NEW-COMPUTABLE (KP3-023, 025–027) + NEW-GUIDANCE (KP3-024) | Sub decides the outcome; sub-by-sub transit reading |
| B3-10 | Behaviour of Planets | 129–145 | Result lists for "star lord X in or owning house H" (Sun…Saturn, 12 houses each). Star lord's occupation predominates over ownership. Node proxy order | NEW-COMPUTABLE (KP3-013, 028–030) + NEW-GUIDANCE (KP3-189) | Lookup keyed by star lord and house |
| B3-11 | How to Judge Benefic or Malefic | 146–151 | Benefic/malefic is per matter and per relative. A planet is good for a matter when it is in the star of that matter's lord and in the sub of a favourable significator. 6, 8, 12 counted from the house in question are adverse | NEW-COMPUTABLE (KP3-032–037) + REJECTED-TRADITION (natural/lordship benefics, KP3-200) | Replaces natural benefic/malefic with a per-matter test |
| B3-12 | Cusps and Subs – How to Judge | 152–156 | Ascendant sub lord signifying 1 + X (X = 1…12); second-cusp sub lord signifying 2 + X; service vs business | NEW-COMPUTABLE (KP3-038–061) | Core cuspal-sub-lord rules, fully computable |
| B3-13 | Constellation and Sub | 156–165 | Definition of significator. Sub decides. Significators of 2 and 7 read by their subs. Relatives from derived houses (9 father, 4 mother, 5 child). Worked chart: deaths of father, mother and child; marriage; education; first job | EXISTS (significator definition ≈ app columns A–D, KP3-062) + NEW-COMPUTABLE (KP3-007, 014, 063–065, 126, 145, 151) | Significator base exists. Sub judgement and derived houses are new. Charts b3a-E01, E02 |
| B3-14 | Physical Features | 166–180 | Build from the sign of the star lord of the ascendant sub lord. Moles. Longevity houses 1, 8, 3 vs 12, 7, 2. Badhaka by lagna modality. Order of evil significators. Two dated death charts | NEW-COMPUTABLE (KP3-071, 075, 077–080) + NEW-GUIDANCE (moles, KP3-076) + HORARY (number for confirmation, KP3-083) + REJECTED-TRADITION (longevity yogas, Kendradhipatya, KP3-084, 201, 202) | Badhaka/maraka lists and the ascendant-sub test are computable. Charts b3a-E03, E04 |
| B3-15 | Mode of Death | 180–190 | Danger periods from the 8th cusp's lords and the 8th lord's position. Manner by sub (Jupiter, Mars, Saturn). Place of death from the 8th CSL. Air-crash couple. Accident escape. KP health rules (immunity, cure via 11) | NEW-COMPUTABLE (KP3-085–093) + NEW-GUIDANCE (KP3-074, 094) + REJECTED-TRADITION (death yogas, 22nd decanate, KP3-203) | Computable. Present death results with care (KP3-217). Charts b3a-E05–E07 |
| B3-16 | Finance and Fortune | 190–208 | KP wealth significators (2, 6, 10, 11 with subs of 2, 6, 11) vs 8, 12. Mixed lordship. Fortuna via its star lord. Rahu-dasa transit rule. Long Hindu/Western wealth and poverty lists. Leo chart with a career forecast to 1976 | NEW-COMPUTABLE (KP3-095–101, 119, 178) + NEW-GUIDANCE (KP3-102, 179, 192) + REJECTED-TRADITION (Raja/wealth/poverty yogas, KP3-204) | Charts b3a-E08–E12 |
| B3-17 | Retirement – When | 208–209 | End of service = 1, 5, 9. Date from the Sun in sign of dasa lord, star of bhukti lord, sub of anthra lord | NEW-COMPUTABLE (KP3-103, 118) | Continues b3a-E12 |
| B3-18 | Gain by Lottery – Luck | 209–212 | Houses 1, 2, 3, 6, 10, 11 win; 4, 5, 7, 8, 9, 12 lose; 5 = urge; 6 = competitor's loss. Dasa lord's transit by star/sub. Sade Sati dismissed | NEW-COMPUTABLE (KP3-104–106) + REJECTED-TRADITION (Sade Sati, KP3-205) | Chart b3a-E13 |
| B3-19 | Luck by Races | 212–215 | Speculative gain through the sub (5 and 2) and the 6th (opponent's loss). Jupiter transiting the dasa lord's sign. Natal list plus event-moment chart | NEW-COMPUTABLE (KP3-107, 120) + REJECTED-TRADITION ("Swabhukti bad", KP3-216) | Charts b3a-E14, E15 |
| B3-20 | Finance by Borrowing | 215–229 | Receipt 2, 6, 10, 11 vs repayment 4, 5, 8, 12. 8th CSL and debts. Cause of debt by house association. Pledges, direction and source of a loan. Dharidra yogas. Repayment-timing tips (Aswini/Anuradha day, Gulika) | NEW-COMPUTABLE (KP3-108–112) + NEW-GUIDANCE (KP3-113, 114) + REJECTED-TRADITION (Dharidra and debt yogas, KP3-215) + NOT-RELEVANT (repayment muhurta tips) | Charts b3a-E16–E19 |
| B3-21 | Free from Debts | 229–232 | Borrow in joint periods of significators of 2 and 6. Repay via 12 (and 8). Benefic or 12th lord in 8 eases repayment. Dated forecast | NEW-COMPUTABLE (KP3-115) | Chart b3a-E20 |
| B3-22 | Theft and Recovery | 232–238 | Number 16 of **108** gives the lagna pada. Recovery via the 11th lord (retrograde = temporary loss). Thief from the 7th. Timing by Jupiter's station and transit. "Successful theft" = 2, 6, 11 not linked to 5, 8, 12 | HORARY (KP3-154, 156, 157) + NEW-COMPUTABLE (retrograde doctrine KP3-073; theft from the thief's chart KP3-158) | Question chart b3a-E21 |
| B3-23 | Brothers and Sisters | 238–243 | 3rd CSL in a dual sign = several siblings. 3rd cusp as the younger sibling's lagna. Danger, enmity, harmony, partition house sets. Sorrow/expense via siblings | NEW-COMPUTABLE (KP3-127–131) + REJECTED-TRADITION (Hindu sibling rules, "Karako bhava nasaya", KP3-207) | Computable |
| B3-24 | Mother | 243–245 | 4th house (not the 10th) is mother. 4th as her lagna. Short-lived mother test. List of traditional mother/abandonment combinations | NEW-COMPUTABLE (KP3-132, 133) + NEW-GUIDANCE (traditional list, uncatalogued) | Computable |
| B3-25 | House to Dwell In | 246–258 | Building = 4th + Mars. Purchase 4, 11, 12 (+6/9 to take possession). Acquisition 2, 4, 11. Sale 3, 5, 10. Inheritance, loan, mortgage, fire/auction. Building materials and tenants. Query-moment ruling planets. "Always … the Lagna alone" (post-1967) | NEW-COMPUTABLE (KP3-134–139) + HORARY (KP3-123, 160) + NEW-GUIDANCE (KP3-141) + REJECTED-TRADITION (Hindu house rules, Moon-sign judgement, KP3-139, 208) | Charts b3a-E22–E25 |
| B3-26 | Conveyance | 259–272 | Vehicle = 4, 9, 10, 11 + Venus/Moon/Jupiter. 4th CSL in the star of a 4th significator linked to Venus. Via brother/partner/family/loan. Long lists of Hindu vehicle and accident yogas. "Guru balam" essay. "Evils cannot be averted" | NEW-COMPUTABLE (KP3-142) + NEW-GUIDANCE (KP3-143) + REJECTED-TRADITION (KP3-144, 209) + NOT-RELEVANT (Jupiter/Venus social essay) | Charts b3a-E26–E28 |
| B3-27 | Education | 272–282 | 4 = schooling, 3 = inclination, 9 = higher study. Success via 11. Ends via 3, 5, 8. Competitive exams. Subject combinations. Scholarship = 4 + 6 + 11; paid study = 4 + 8 + 12 | NEW-COMPUTABLE (KP3-145–148) + NEW-GUIDANCE (KP3-190) | Charts b3a-E29, E30 (KSK's own) |
| B3-28 | Farm and Future | 282–285 | Farming = Mars, Venus, Moon, Jupiter linked with 2, 6, 10. Sub quality. Future dasa lords decide the course of a profession | NEW-COMPUTABLE (KP3-125, 150) | Chart b3a-E31 |
| B3-29 | Shall I Own a Cinema Theatre | 285–286 | The nature of the 4th-cusp sub lord gives the building's use (Venus = cinema). Timing with Sun transit | NEW-COMPUTABLE (KP3-140) | Chart b3a-E32 |
| B3-30 | When Can I Clear Off Loan | 286–291 | Agreement = 3 and 9. Payments = 8 and 12. Saturn owning 11 and 12 brings instalments. Consulting moment must agree with the natal ruling planets | NEW-COMPUTABLE (KP3-116) + HORARY (KP3-159c) | Chart b3a-E33, all dates checked |
| B3-31 | Disease | 291–301 | Disease needs significators of 6 and 1; hospital with 12. Fatal disease from the 8th CSL. Nature from the 6th CSL and its star lord's sign. Cure from 11 (and 5). Ruling planets fix the 6th sub. Sign and planet disease tables. "Never predict death" | NEW-COMPUTABLE (KP3-162–165) + NEW-GUIDANCE (KP3-166, 186–188, 217) + HORARY (KP3-159, 161) | Chart b3a-E34 |
| B3-32 | On Blindness | 301–307 | Sun, Moon, Venus give vision. 2 = right eye, 12 = left. 12th CSL in 6. 23 Hindu rules and Western nebulous degrees quoted and shown not to fit | NEW-COMPUTABLE (KP3-167) + REJECTED-TRADITION (KP3-210) | Chart b3a-E35 |
| B3-33 | Health and Heart | 307–310 | Ascendant CSL in the star of a 6/8/12 significator. Cure from 5 and 11. Decanate body map. Traditional heart rules | NEW-COMPUTABLE (KP3-168) + NEW-GUIDANCE (KP3-193) + REJECTED-TRADITION (KP3-211) | Chart b3a-E36 |
| B3-34 | Will Stammering Disappear | 310–313 | Speech from the 2nd CSL (planet type). Node in 2 = speech defect, in 12 = vision defect | NEW-COMPUTABLE (KP3-169) | Charts b3a-E37, E38 (E37 has a cusp misprint) |
| B3-35 | Time of Marriage | 313–325 | Houses 2, 7, 11. Hindu "marriage promised" and "late marriage" lists. Three marriage charts with dates. Horary number 34: partnership longevity via the 7th's badhaka/maraka, ruling planets and transit. Letters | NEW-COMPUTABLE (KP3-151, 152) + HORARY (KP3-124, 153, 155) + REJECTED-TRADITION (KP3-212) + NOT-RELEVANT (letters) | Charts b3a-E39–E42 |
| B3-36 | Overseas | 326–329 | Overseas only if the 12th CSL signifies 3, 9 or 12. Timing by joint significators of 3, 9, 12. Nodes stronger. Cusp star/sub lords as extra significators | NEW-COMPUTABLE (KP3-070, 170, 172) | Chart b3a-E43 (contributor's article) |
| B3-37 | Scholarship for Higher Studies | 330–331 | Higher study = 9, foreign stay = 12, job abroad = 6 + 10, scholarship = 6 + 11. 9th CSL's star and sub | NEW-COMPUTABLE (KP3-149) | Chart b3a-E44 |
| B3-38 | Higher Studies and Foreign Country | 331 | One-line stub (dasa balance of the next chart) | NOT-RELEVANT (as a unit) | Content is in B3-39 |
| B3-39 | Profession – Nature and Length of Service (vault title; content = higher studies abroad) | 332–335 | Classes 4 + 11 vs research/abroad 9 + 12 with 11. Strength order. 12th CSL must link to 3/9 (preferably 9). Sub-boundary twin case. Ruling-planet timing | NEW-COMPUTABLE (KP3-067, 149, 171) + HORARY (ruling planets at judgement, KP3-159) | Chart b3a-E45 |
| B3-40 | Change in Job – 9th House Explains (vault title; content = profession and service) | 335–360 | Traditional 10th-lord-navamsa method (rejected). KP: MC sign/star/sub lords + planet near MC + dasa lord. Large profession-to-planets table. Surgeon case (Fig. B3.53 is actually the navamsa). Length of service: six-step significator order, cusp-based lordship, first appointment. Planets in 7 for business | NEW-COMPUTABLE (KP3-066, 173–177) + EXISTS (cusp-based lordship, KP3-176) + NEW-GUIDANCE (KP3-180, 191) + REJECTED-TRADITION (KP3-213, 214) | Charts b3a-E04, E46. The profession table is partly UNCLEAR (OCR column split) |

## Verdict counts

**Main verdict per chapter (41 chapters):**

| Verdict | Count | Chapters |
|---|---|---|
| NEW-COMPUTABLE | 33 | 05, 06, 07, 09–21, 23–37, 39, 40 |
| NOT-RELEVANT | 5 | 00, 01, 02, 03, 38 |
| EXISTS | 1 | 04 |
| NEW-GUIDANCE | 1 | 08 |
| HORARY | 1 | 22 |

**Chapters that carry each verdict for some part (multi-verdict):**

| Verdict | Count |
|---|---|
| NEW-COMPUTABLE | 35 |
| NEW-GUIDANCE | 17 |
| HORARY | 7 (14, 22, 25, 30, 31, 35, 39) |
| EXISTS | 3 (04, 13, 40) |
| NOT-RELEVANT | 8 (00, 01, 02, 03, 38, plus parts of 20, 26, 35) |
| REJECTED-TRADITION parts | 17 (04, 06, 11, 14, 15, 16, 18, 19, 20, 23, 25, 26, 32, 33, 35, 40, and 13's Nadi remark) |

**Rules:** 213 (KP3-001 … 193, 200 … 219). By primary status: COMPUTABLE 136, GUIDANCE 39,
REJECTED-TRADITION 21, HORARY 11, EXISTS 6. By grade: CLEAR 176, VERIFIED-ON-FIGURE 31,
UNCLEAR 6. **Examples:** 47 entries (41 natal, 5
horary/event, 1 placeholder for b3b).

# NTP-2 (PDF pp. 40–182): rule catalogue

Source book: H.R. Seshadri Iyer, *New Techniques of Prediction*, Part II (NTP-2). Second edition, with the
2000 editor's notes by Dr T.S. Vasan.
Library: `references/NTP/ntp-2/` (182 PDF pages). This file covers **PDF pp. 40–182**. The lead developer
covers PDF pp. 1–45 (Ch. I *Thithi and Yoga*; Ch. II *Novel method of Dasha Bhukti reading*). Pages 40–45
overlap on purpose.

**Citation format.** (NTP-2, PDF p. N). N is the one-based source PDF page shown in the
`=== NTP-2 | SOURCE PDF PAGE NNNN ===` delimiters. It is not the printed folio. In this part of the book
the printed folio is usually the PDF page + 2 (e.g. PDF p. 42 = printed p. 44).

**How this was read.** I read every `text/` page from PDF p. 40 to p. 182. Where the text layer was
garbled, I used the `ocr/` file (e.g. pp. 47, 111, 127, 150). For tables, numbers, formulas, diagrams and
key rules, I opened the page image. Page images I read: **41, 46, 48, 49, 50, 51, 52, 53, 54, 55
(re-rendered at 220 dpi), 56, 57, 58, 59, 60, 61, 62, 63, 86, 87, 88, 89, 90 (220 dpi), 91, 93, 94, 95, 98,
99, 100, 102, 104, 105, 107, 108, 119, 120, 121 (220 dpi), 122 (220 dpi), 129, 130, 131, 132, 134, 135,
136, 141, 142, 144, 146, 147, 151, 152, 154, 155, 156, 157, 158, 159 (250 dpi)**.

**Cross-checks run (scripts in the session scratchpad, not shipped).**
1. I coded my reading of the Ch. III division-chart rules and compared it with the book's own D-chart
   table for Appendix Chart 1 (PDF p. 159). All 17 divisions match, with 3 exceptions out of 170 cells:
   D-30 Kuja and D-40 Sun/Shani. All 3 are explained under Open questions (OQ-3, OQ-4).
2. I coded the "Mathematical Navamsha" algorithm (NTP2-402) and checked it against every worked example in
   the book (pp. 39, 97, 99, 100, 101, 115, 116). All 7 match. It also reproduces Iyer's 12/24/72 counts of
   vargottama, exchanging and moving padas (p. 85).

**Labels.**
- Confidence: **VERIFIED-ON-PDF** = read from the page image. **CLEAR** = text layer (and OCR where
  checked) agree, image not opened. **UNCERTAIN** (reason given).
- **COMPUTABLE** = derivable from a chart (longitudes, Lagna, Bhava cusps, dasha periods, the Yogi/Avayogi
  set-up of Ch. I–II). **NOT-COMPUTABLE** = needs judgement, life events, or data an app lacks.
- **implied** = my inference from Iyer's worked example or wording, not a rule he states.
- Wording: rules are paraphrased. Quotes are ≤ ~15 words.
- Hand-written annotations in the scan (e.g. "equal", "No symmetry" on p. 46; numbers on pp. 90–91) are a
  previous reader's marginalia. They are **not** Iyer's text and are ignored.

---

## 1. Overview: chapters and PDF page ranges

| PDF pp. | Printed pp. | Content |
|---|---|---|
| 40–41 | 42–43 | End of **Ch. II** *Novel Method of Dasha Bhukti Reading*: Bhukti examples (Chart 7, Guru Dasha), the positive/negative/mixed planet classification, editor's note "further research is needed". |
| 42–79 | 44–81 | **Ch. III** *Phala Kundali or Division Charts*. Preface (42–44); theory and the 20 divisions (44–45); 5 construction groups (45–47); portfolios and construction of each D-chart (48–54); **Table of Amsha parts** (55); how to use the table (56); 37 rules to judge D-charts (56–63); 31 illustrations (63–79). |
| 80–102 | 82–104 | **Ch. IV** *Dasha Bhukti (classical)*. Preamble (80–82); Dasha reading (82); Mathematical D-charts and the **Mathematical Navamsha Chart** (82–91, chart on 90–91); **Bhukti reading rules (A)–(G)** (86–89); full illustration on Chart 1 (89–98); short illustrations (99–101); Graha Samayam (102). |
| 103–116 | 105–118 | **Ch. V** *Gochara (transit)*. Critique of transit from Moon, the Moon-based table (103–105); Iyer's 15-step method (105–110); other theories: Tharabala, Pada/foot (110–111); illustrations (111–116). |
| 117–139 | 119–141 | **Ch. VI** *Varshapravesh (Solar birthday map)*. Panchavargi Bala (118–124, tables 119–122); Varshapravesh (124–126); Panchadhikaris and Year Lord (126–128); Muntha (127); Harsha Bala (119–120, 127); Bhava and Dasha Phalam (128–129); **Sahamas** (129–133); Shodasha Yogas, skipped (133–134); illustration (134–139). |
| 140–153 | 142–155 | **Ch. VII** *Daily and Hourly Readings; Misconceptions*. Day reading (140–142); hour of event (142); illustrations (143–144); **Misconceptions**: Rahu Kalam (144–146), New/Full Moon (146), **Kaalasarpa** (146–147), **Kuja Dosha** (147–148), Kalachakra Dasha (148), **Nakshatra Dosha** (148–149), **Marriage tests** (149–151), **Muhurtham** (152–153). |
| 153–157 | 155–159 | **Appendix 1a**: ready-made tables to erect D-3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 24. |
| 158–177 | 160–179 | **Appendix 1b**: 40 illustrative horoscopes in tabular form (Thithi, weekday, star, birth Yoga with Yoga star, Birth Yogi, Avayogi, Duplicate Yogi, Zero Rasis, running Dasha chart with Starter and Ruler, D-chart signs). |
| 178–181 | 180–183 | **Appendix 2** *Fundamental Elements*: glossary, sign/lord table. |
| 182 | — | Editor's note (2000). |

**Iyer's terms used below.** They are defined in PDF pp. 1–41, the lead developer's range. I give only
pointers.
- **Birth Yogi / Avayogi / Duplicate Yogi**: from the birth Yoga point (Ch. I). Every appendix chart
  prints the birth Yoga with its *Yoga star* in brackets. The Yoga star's lord is always the Birth Yogi,
  e.g. "Vyatipatha (Sathabhisha) … Yogi = Rahu" (PDF pp. 158–177).
- **Dasha Yogi, Dasha Raja Yogi, Starter, Ruler, "crossing"**: from the Dasha Chart (Ch. II, approx. PDF
  pp. 23–38). The crosser is the Bhukti lord. The crossed planets are its Starter and Ruler (p. 36).
- **Zero Rasis** (Dagdha rasis of the birth thithi) and **positive/negative planets/signs**: Ch. I
  (from PDF p. 6).

---

## 2. Planet groups ("sets of three"), enemies, Yogi status: what pp. 40–182 add

- **NTP2-001** · The 9 planets fall into three friendship trios: **(a) Ketu–Moon–Guru, (b) Shani–Shukra–Kuja,
  (c) Rahu–Budha–Sun**. Iyer says this is visible when the Mathematical Navamsha chart is worked out,
  "group planets being sets of friends as stated in previous chapters". · Conditions: none (fixed
  membership). · Effect: used for "group planet" tests below. · (NTP-2, PDF p. 86). The same trios are
  defined in Ch. I and II: (NTP-2, PDF p. 6) and (NTP-2, PDF pp. 27–28), lead developer's range. ·
  VERIFIED-ON-PDF (p. 86) · COMPUTABLE.
- **NTP2-002** · **How the trios are formed (Iyer's stated basis).** In the Mathematical Navamsha chart,
  Mesha–Kataka hold only padas of stars of Ketu, Moon and Guru (1st padas in Mesha, 2nd in Vrishabha, 3rd
  in Mithuna, 4th in Kataka). Simha–Vrischika hold padas of Shani, Shukra and Kuja stars. Dhanus–Meena hold
  padas of Rahu, Budha and Sun stars. · Effect: these three blocks *are* the three groups. · (NTP-2, PDF
  p. 85) · CLEAR (and checked by script: navamsa of pada n = sign ((n−1) mod 12)+1, so sign blocks 1–4,
  5–8 and 9–12 collect exactly those star lords) · COMPUTABLE.
  - *implied* (my derivation, not Iyer's words): in Udu-Dasha order (Ke, Sk, Su, Mo, Ma, Ra, Gu, Sa, Bu) the
    trios are positions {1,4,7}, {2,5,8}, {3,6,9}. In other words, star lords three apart in the Vimshottari
    cycle form one group.
- **NTP2-003** · **"One Yogi lights its whole group."** If one member of a trio is a Yogi, the other two
  "automatically imbibe yoga character", and this is "specially noticed" with Rahu (Rahu becomes yoga-like
  when Sun or Budha is the Yogi). · (NTP-2, PDF p. 6), lead's range, quoted here because pp. 40–182 rely on
  it: p. 40 ("This Guru is of the group of Dasha Yogi Ketu and Raja Yogi Moon" → good Bhukti); p. 40
  ("Sun … belonging to Birth Yogi Rahu group" → good for finance); p. 109 (transit through stars of "any of
  the Yogi group" → good). · CLEAR · COMPUTABLE.
- **NTP2-004** · A Starter or Ruler of the "Yogi group" gives good results, one of the Avayogi group gives
  evil. Applied in transit (p. 109) and in day reading (p. 141). · (NTP-2, PDF p. 109; p. 141) ·
  VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-005** · **Kith pairs (a second, different pairing).** "Rahu and Shani are kiths and so Ketu and
  Kuja." Rahu gives effects like Shani (p. 143: Rahu crossing Shani as Ruler, event in Shani hora). ·
  Effect: in hora timing, a Rahu indication can fire in Shani hora or Rahu Kalam. A Ketu indication is
  treated like Kuja (implied). · (NTP-2, PDF p. 142; p. 143) · VERIFIED-ON-PDF (p. 142) · COMPUTABLE.
  Note: kith pairs cross the trios (Rahu is in group c, Shani in group b). Keep the two relations apart.
- **NTP2-006** · **Enemy (Avayogi) map.** Each planet has exactly one "enemy": Sun→Shani, Moon→Budha,
  Kuja→Ketu, Budha→Kuja, Guru→Sun, Shukra→Guru, Shani→Moon, Rahu→Shukra, Ketu→Rahu. · Defined at (NTP-2,
  PDF p. 27), lead's range. Every Yogi/Avayogi pair printed in Appendix 1 (pp. 158–177) follows this map
  (I checked all charts that print both). · CLEAR · COMPUTABLE.
  - *implied*: in Udu order the enemy is the star lord 5 steps later (Ke→Ra, Sk→Gu, Su→Sa, Mo→Bu, Ma→Ke,
    Ra→Sk, Gu→Su, Sa→Mo, Bu→Ma). Group (a)'s enemies lie in (c), (c)'s in (b), and (b)'s in (a).
- **NTP2-007** · **Positive / negative status can flip (examples, Chart 7 Guru Dasha).**
  (i) Moon, lord of 8 (negative lordship), placed in a Zero-Rasi "thus assuming the character positive".
  (ii) Shukra = Birth Avayogi *and* lord of 6 in 6 → "has become positive planet".
  (iii) Budha, lord of 7 and 10 (both Zero-Rasis), placed in a Zero-Rasi → "also become positive".
  · Effect: Bhuktis of these planets were good. · (NTP-2, PDF p. 40) · CLEAR · COMPUTABLE once Ch. I's
  positive/negative rules are coded. *implied general form*: two negatives make a positive. Confirm against
  Ch. I (OQ-1).
- **NTP2-008** · **Two-fold negative helps a negative Dasha lord.** Guru was negative (lord of 3 and 6 and
  lord of a Zero-Rasi). The pada falling on Guru's radix pada in the Math-D-9 was a Ketu star, and Ketu was
  a natural negative *and* Birth Avayogi ("two-fold negative"). Iyer reports a yoga "of a far higher order"
  in Guru Dasha. · (NTP-2, PDF pp. 39–40) · CLEAR · COMPUTABLE (with NTP2-402).
- **NTP2-009** · **Net classification of a native's planets.** After reading every Bhukti, classify each
  planet as positive, negative or mixed. Then judge its merit from its stellar lord or Ruler: a positive
  planet in a positive planet's star gives good to the Bhavas both own. A star lord that is negative by
  one lordship (e.g. 12th) also afflicts the related Bhava. · (NTP-2, PDF p. 41) · VERIFIED-ON-PDF ·
  UNCERTAIN: the editor adds "Further research is needed" on the same page · COMPUTABLE in part.
- **NTP2-010** · **Rahu/Ketu as remedy for a negative Birth Yogi.** When Guru or Moon is a negative Birth
  Yogi, its Bhava effects are remedied if its group planet Ketu is associated with it (as stellar lord,
  Starter or Ruler). The same holds for Rahu with Sun or Budha. · (NTP-2, PDF pp. 38–39), lead's range,
  listed for completeness · CLEAR · COMPUTABLE.

> **For the app:** pp. 40–182 never define a *new* way of forming the trios. They restate the trios
> (p. 86), show their basis in the Mathematical Navamsha (p. 85), and use "group planet" membership as a
> condition in Bhukti (p. 40), transit (p. 109), day reading (p. 141) and hour of event (p. 142).

---

## 3. Division charts (Phala Kundali), Ch. III

### 3.1 Principles

- **NTP2-101** · Iyer uses each D-chart to read **one portfolio of life and its magnitude**, not only as a
  strength component (Shadvarga). · (NTP-2, PDF p. 42; p. 44) · CLEAR · NOT-COMPUTABLE (principle).
- **NTP2-102** · Classical yogas (exaltation, Gajakesari, Nabhasa etc.) "do not act in many cases if Rasi
  Chart alone is considered". Read them in the D-charts. · (NTP-2, PDF p. 43) · CLEAR · COMPUTABLE
  (detect yogas per D-chart).
- **NTP2-103** · Iyer works with **20 divisions: D-1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 20, 24, 27,
  30, 40, 45, 60**. He omits D-2 and D-60 from reading, which leaves **18**. · (NTP-2, PDF p. 44) · CLEAR ·
  COMPUTABLE.
- **NTP2-104** · **Construction principle.** All parts of a division must be distributed "equitably and
  wholly and symmetrically or consecutively" over the 12 signs. Five groups: (a) D-1; (b) D-2, D-30, D-60;
  (c) D-3, D-4, D-12 (equal distances; D-12 completes one cycle); (d) D-11, D-24, D-40, D-45, D-10 (cannot be
  spread evenly, so special rules); (e) D-5, D-6, D-7, D-8, D-9, D-16, D-20, D-27 (start from Mesha and keep
  sign order continuous across signs). · (NTP-2, PDF p. 46) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-105** · Worked derivations of group (e). D-6: odd signs start Mesha, even start Thula. D-7: odd
  signs start from the sign itself, even from its 7th. D-8: movable signs start Mesha, fixed start Dhanus,
  dual start Simha. · (NTP-2, PDF p. 47) · CLEAR (text and OCR agree) · COMPUTABLE.

### 3.2 How to erect each D-chart (all reproduced against the book's own table, p. 159)

Notation: *k* = 0-based part index = floor(degree-in-sign × N / 30). "Start X, regular order" = sign
X + k. Movable = Mesha, Kataka, Thula, Makara. Fixed = Vrishabha, Simha, Vrischika, Kumbha. Dual = the rest.

| ID | Division (span) | Iyer's name / portfolio | Rule as Iyer gives it | Page |
|---|---|---|---|---|
| NTP2-110 | D-1 (30°) | Rasi: **all effects** | Natal chart. Read it first, with the Bhava chart. | p. 48 |
| NTP2-111 | D-2 (15°) | Hora: **wealth** | Odd sign 0–15° Sun hora, 15–30° Moon hora; reversed in even signs. Iyer rejects the 2-sign chart (all planets in Simha/Kataka). He gives **Satyachariar's chart**: a planet in the **1st hora stays in its own sign; in the 2nd hora it goes to the 11th sign from it**. He is "not fully impressed" and leaves D-2 to research. | pp. 48–49 |
| NTP2-112 | D-3 (10°) | Drekkana: **co-borns** (brothers and sisters; their prospects, longevity) | Signs 1st, 5th, 9th from the sign (Varahamihira). | p. 49 |
| NTP2-113 | D-4 (7½°) | Chaturamsha: **net assets** (cash, gold, deposits, investments, property) | Kendras 1st, 4th, 7th, 10th from the sign. | p. 49 |
| NTP2-114 | D-5 (6°) | Panchamsha: **spiritualism**, godliness, saintliness | Movable: from itself. Fixed: from its 5th. Dual: from its 9th. Regular order. | pp. 49–50 |
| NTP2-115 | D-6 (5°) | Iyer calls it "Shastyamsha": **health** | Odd: Mesha→Kanya. Even: Thula→Meena. | p. 50 |
| NTP2-116 | D-7 (4 2/7°) | Sapthamsha: **issues** (children). In female charts it "sometimes" shows the husband's prosperity, esp. when childless (his latest observation; "research on this point"). | Odd: from itself. Even: from its 7th. | p. 50 |
| NTP2-117 | D-8 (3¾°) | Astamsha: **longevity** | Movable: from Mesha. Fixed: from Dhanus. Dual: from Simha. | p. 50 |
| NTP2-118 | D-9 (3⅓°) | Navamsha: **partner in life** | Movable: from itself. Fixed: from its 9th. Dual: from its 5th. See also the Mathematical Navamsha (§4.2). | p. 50 |
| NTP2-119 | D-10 (3°) | Dashamsha: **profession and status quo**. Attainments by personal effort, professional status and earned income, promotions or demotions in the same profession "not affecting emoluments", **fresh posts**. | Odd: from itself. Even: from its 9th. | p. 51 |
| NTP2-120 | D-11 (2 8/11°) | Labhamsha: **profit and loss**. Unearned income: patrimony, easy money, windfalls, lottery, gambling, side income; elevation "without one's trial"; promotions in the same post that raise emoluments; accession, election and other conferred positions (rule 24). | **All signs: start Mesha and go in reverse order** (Mesha, Meena, Kumbha … Mithuna). Vrishabha never receives an amsha. | p. 51; p. 61 |
| NTP2-121 | D-12 (2½°) | Dwadashamsha: **parents**. Separate father from mother using D-1 and the karakas. | From the same sign, regular order. | p. 52 |
| NTP2-122 | D-16 (1⅞°) | Shodasamsha: **happiness and vehicles** | Iyer rejects the BPHS version (movable/fixed/dual from Mesha/Simha/Dhanus) and adopts **Mantreswara**. Odd sign: amshas 1–12 from the sign itself in regular order; amshas 13–16 (Brahma, Vishnu, Iswara, Sun) are "brought inside" and fall in the 1st–4th signs from itself. Even sign: amshas 1–4 are Sun, Iswara, Vishnu, Brahma; amsha 5 onward starts at the 12th sign from it and runs in reverse. Brought inside: amsha 4 → the sign itself, amsha 1 → its 4th sign. Formula that reproduces the book's tables: odd = sign + k; even = sign + 3 − k (mod 12). | p. 52 (rule); p. 157 (table) |
| NTP2-123 | D-20 (1½°) | Vimshamsha: **upasana** (worship of a deity, its blessings) | "Just like D-8": movable from Mesha, fixed from Dhanus, dual from Simha. | p. 53 |
| NTP2-124 | D-24 (1¼°) | Siddhamsha: **education** of all types (general, Vedic, psychic, mantric, scientific, cultural, physical) | Odd: from Simha. Even: from Kataka. Regular order, continuing past the first cycle. | p. 53 |
| NTP2-125 | D-27 (1 1/9°) | Nakshatramsha: **physical strength and stamina** | Mesha and its trines start Mesha. Vrishabha and trines start Kataka. Mithuna and trines start Thula. Kataka and trines start Makara. Regular order, round the zodiac as often as needed. | p. 53 |
| NTP2-126 | D-30 (1°) | Trimshamsha: **happiness and misery** | Odd sign: Kuja 0–5°, Shani 5–10°, Guru 10–18°, Budha 18–25°, Shukra 25–30°. Even sign: reversed (Shukra 0–5°, Budha 5–12°, Guru 12–20°, Shani 20–25°, Kuja 25–30°). Iyer's own placement: in an odd sign go to the **odd** sign of the part lord (Kuja→Mesha, Shani→Kumbha, Guru→Dhanus, Budha→Mithuna, Shukra→Thula); in an even sign go to its **even** sign (Kuja→Vrischika, Shani→Makara, Guru→Meena, Budha→Kanya, Shukra→Vrishabha). | p. 54 |
| NTP2-127 | D-40 (¾°) | "Swavedamsha": **auspicious or inauspicious effects** | Odd: from Mesha. Even: from Thula. "Akin to Division-6." | p. 54 |
| NTP2-128 | D-45 (⅔°) | **Character and conduct** | "Just like Division-16": movable from Mesha, fixed from Simha, dual from Dhanus. *Note:* this matches the **BPHS** D-16 rule, not the Mantreswara rule Iyer adopts for D-16. | p. 54 |
| NTP2-129 | D-60 (½°) | Shastyamsha | Only names (good/bad) are given. Infer effects from the name. No place in the zodiac is assigned. Iyer omits it from reading. | p. 54; p. 44 |

All rows: VERIFIED-ON-PDF · COMPUTABLE. D-3 through D-40 are confirmed against the book's Chart 1 table
(p. 159), except D-30 Kuja and D-40 Sun/Shani (OQ-3, OQ-4). D-2 was checked against the book's Chart 1
Hora chart (p. 49) and all 10 bodies match. D-45 and D-60 have no worked example.

- **NTP2-130** · **Table of Amsha parts** (end-degree of each part within a sign; D° minutes, fractions of a
  minute as printed). · (NTP-2, PDF p. 55, rotated table) · VERIFIED-ON-PDF (read at 220 dpi) · COMPUTABLE.

  | Part | D-7 | D-8 | D-9 | D-11 | D-16 | D-24 | D-27 | D-40 | D-45 |
  |---|---|---|---|---|---|---|---|---|---|
  | 1 | 4-17 1/7 | 3-45 | 3-20 | 2-43 7/11 | 1-52 ½ | 1-15 | 1-06 ⅔ | 0-45 | 0-40 |
  | 2 | 8-34 2/7 | 7-30 | 6-40 | 5-27 3/11 | 3-45 | 2-30 | 2-13 ⅓ | **1-50** (sic; uniform = 1-30) | 1-20 |
  | 3 | 12-51 3/7 | 11-15 | 10-00 | 8-10 10/11 | 5-37 ½ | 3-45 | 3-20 | 2-15 | 2-00 |
  | 4 | 17-08 4/7 | 15-00 | 13-20 | 10-54 6/11 | 7-30 | 5-00 | 4-26 ⅔ | 3-00 | 2-40 |
  | 5 | 21-25 5/7 | 18-45 | 16-40 | 13-38 2/11 | 9-22 ½ | 6-15 | 5-33 ⅓ | 3-45 | 3-20 |
  | 6 | 25-42 6/7 | 22-30 | 20-00 | 16-21 9/11 | 11-15 | 7-30 | 6-40 | **4-50** (sic; uniform = 4-30) | 4-00 |
  | 7 | 30-00 | 26-15 | 23-20 | 19-05 5/11 | 13-07 ½ | 8-45 | 7-46 ⅔ | 5-15 | 4-40 |
  | 8 | | 30-00 | 26-40 | 21-49 1/11 | 15-00 | 10-00 | 8-53 ⅓ | 6-00 | 5-20 |
  | 9 | | | 30-00 | 24-32 8/11 | 16-52 ½ | 11-15 | 10-00 | 6-45 | 6-00 |
  | 10 | | | | 27-16 4/11 | 18-45 | 12-30 | | 7-30 | 6-40 |
  | 11 | | | | 30-00 | 20-37 ½ | 13-45 | | 8-15 | 7-20 |
  | 12 | | | | | **22-20** (sic; uniform = 22-30) | 15-00 | | 9-00 | 8-00 |
  | 13–16 | | | | | 24-22 ½, 26-15, 28-07 ½, 30-00 | | | | |

  Footnote in the table: "Trimshamsha: Kj Sn Gr Bd Sk 5 5 8 7 5 in odd Rasi; reverse order in even Rasi."
- **NTP2-131** · **Using the table for repeating divisions** (D-24, D-27, D-40, D-45 are tabulated only for
  their first block). D-24: above 15°, subtract 15° and look up the remainder (the part count repeats).
  D-40: divide the degree by 9 and look up the remainder. D-45: divide by 8 and look up the remainder.
  D-27: up to 10° read directly; 10–20°, take the remainder after 10° and add 9; above 20°, take the excess
  over 20° and add 18 ("or say 6", i.e. 18 − 12). Iyer says D-2, 3, 4, 5, 6, 10, 12, 20, 60 are untabulated
  because their parts are whole numbers. · (NTP-2, PDF p. 56) · VERIFIED-ON-PDF · COMPUTABLE. *Note:* the
  text says D-7, 8, 9, 11, 16 are "worked to 12 stages", which does not match the table (7, 8, 9, 11, 16
  rows). Treat that phrase as a misprint.
- **NTP2-132** · **Ready-made sign tables** (Appendix 1a): D-9, D-10, D-11, D-12, D-24, D-3, D-4, D-5, D-6,
  D-7, D-8, D-16. Rows = part end-degree; columns = Mesha…Meena; cell = resulting sign number. Example: a
  planet at 13°50′ Mithuna → D-9 row 5 → 11 (Kumbha). I spot-checked them against the rules in
  NTP2-110…129: D-9, D-10, D-11, D-12, D-24, D-3, D-4, D-5, D-6, D-7, D-8 and D-16 (Vrishabha, Mithuna and
  Meena columns all match the rule as stated above). · (NTP-2, PDF pp. 153–157) · VERIFIED-ON-PDF ·
  COMPUTABLE (use as unit-test oracle).

### 3.3 Rules for judging a D-chart (Iyer's numbered rules 1–37)

General: treat each D-chart as the principal chart for its portfolio and apply all general rules. Effects
of a D-chart are felt **only during the Dasha/Bhukti of the planets concerned**. (NTP-2, PDF p. 57)
VERIFIED-ON-PDF.

- **NTP2-140** (rule 1) · **The primary factor is the planet's house from the D-Lagna.** In any house other
  than 3, 6, 8, 12 it gives good to that portfolio (magnitude from other factors). In 3, 6, 8, 12 it
  "always give[s] bad results whatever their other positions be", even if exalted, in an inimical sign, or
  in conjunction/aspect. · (NTP-2, PDF p. 57) · VERIFIED-ON-PDF · COMPUTABLE.
  - **Exceptions** (only these three): (a) **Kuja in 6th does good in all D-charts** (he aspects Lagna from
    the 6th). (b) **Budha in 8th does good only in D-4.** (c) "Shani in 8 does not kill" holds **only in D-8
    when Shani is in the D-8 Lagna** (rule 14 restates this as "Shani in 1 in D-8"). · (NTP-2, PDF p. 57;
    p. 60) · VERIFIED-ON-PDF · COMPUTABLE · (c) is UNCERTAIN in wording: see OQ-6.
- **NTP2-141** (rule 2) · **The D-chart position outweighs D-1.** A planet badly placed in D-1 still gives
  the portfolio's good if well placed from the D-Lagna. A planet strong in D-1 gives bad to the portfolio if
  in a dusthana of the D-chart. · (NTP-2, PDF p. 58) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-142** (rule 3) · **Magnitude.** (a) Any Shadbala-type strength *in the D-chart* (Kalaja, Chesta,
  Uccha, Dig, Ayana, Sthana) plus a good house from the D-Lagna gives higher magnitude: the more strengths
  at once, the more. If the planet is also strong in D-1, results are "of a superior degree". (b) An ordinary
  good D-position plus strength in D-1 (even from a D-1 dusthana) gives effects of higher order. (c) Any
  D-chart dusthana means bad for the portfolio even if exalted or own sign in that D-chart. · (NTP-2, PDF
  p. 58) · VERIFIED-ON-PDF · COMPUTABLE (strength scoring needs a Shadbala implementation).
- **NTP2-143** (rule 4) · **A planet combust or defeated in planetary war in D-1 is useless in every
  D-chart**, even if powerfully placed there. If it is also badly placed in the D-chart it gives the
  **worst** results ("dealing with a dead object"). Also: a combust planet is "always an eclipsed planet in
  all the charts" (p. 48). · (NTP-2, PDF pp. 58–59; p. 48) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-144** (rule 5) · A debilitated planet well placed in a D-chart gives good **if it attains Neecha
  Bhanga** (tests in Part I). · (NTP-2, PDF p. 59) · VERIFIED-ON-PDF · COMPUTABLE (needs the NTP-1 Neecha
  Bhanga tests).
- **NTP2-145** (rule 6) · **The four most important strengths**, to be tested in every D-chart: exaltation,
  Vargottama, own house, Digbala. **Generalised Vargottama:** a planet in the same sign in D-1 and in *any*
  D-chart is Vargottama for that D-chart, not only for D-9. · (NTP-2, PDF p. 59) · VERIFIED-ON-PDF ·
  COMPUTABLE.
- **NTP2-146** (rule 7) · Exaltation in the 3rd, 6th, 8th or 12th of a D-chart is of no avail. · (NTP-2,
  PDF p. 59) · VERIFIED-ON-PDF · COMPUTABLE. Illustrated at p. 76 (D-11 full of exalted planets in
  dusthanas → only a clerk).
- **NTP2-147** (rule 8) · Look for general yogas inside each D-chart and gauge them by the strengths above.
  · (NTP-2, PDF p. 59) · VERIFIED-ON-PDF · COMPUTABLE (subset of yogas).
- **NTP2-148** (rule 9) · Conjunction or aspect modifies D-chart effects. Use **natural**
  benefics/malefics, not functional ones. **Only Guru alleviates** the evil of a badly placed planet, and
  only if Guru is strong in that D-chart. A debilitated Guru "cannot be banked upon". · (NTP-2, PDF p. 59)
  · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-149** (rule 10) · **Birth Yogi in a D-chart:** in a good house it gives yoga to that portfolio;
  in a bad house "he is lost". **Birth Avayogi** in a favourable house gives good but with "hindrances,
  anxieties and ruptures hand in hand". · (NTP-2, PDF p. 60) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-150** (rule 11) · **Bhava lordship is read only from D-1**, never from D-charts, except the
  **lord of the D-Lagna**. Also p. 48: lordship only in D-1; results due to the nature of signs and stars
  only from D-1; friendly/enemy/own/exaltation sign, conjunctions, aspects, position from Lagna and from
  other planets, and yogas from all charts. · (NTP-2, PDF p. 60; p. 48) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-151** (rule 12) · A debilitated planet in a good D-position still gives bad **without Neecha
  Bhanga**. · (NTP-2, PDF p. 60) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-152** (rule 13) · **Vargottama D-Lagna** (same sign as D-1 Lagna) indicates the portfolio going
  very high, **provided its lord is well placed**. If the lord is in a dusthana, only "dreamy effects". If
  the lord is also Vargottama or otherwise strong and favourable: excellent. · (NTP-2, PDF p. 60) ·
  VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-153** (rule 14) · **The 3rd and 8th are death-like houses.** A planet in the 3rd or 8th of a D-chart
  causes "death" (also read as **severance**) of that portfolio in its period: in D-9 to the wife, in D-10
  to the profession. **A planet in the 3rd of D-10 means retirement from service.** Exceptions: Shani in 1
  of D-8, Budha in 8 of D-4. · (NTP-2, PDF p. 60) · VERIFIED-ON-PDF · COMPUTABLE. Illustrations: p. 64
  (Shukra in 3 of D-10 → retirement); p. 70; p. 72 (Rahu in 3 of D-10 → retirement in Rahu Dasha); p. 66
  (Shani in 3 of D-9 → lost husband in Shani Dasha).
- **NTP2-154** (rule 15) · The 2nd house of a D-chart is **neutral**. · (NTP-2, PDF p. 60) ·
  VERIFIED-ON-PDF · COMPUTABLE. Used at p. 77 ("Shukra in 2 – Neutral"), p. 79, p. 92. *But* in D-8 and
  D-12 the 2nd is treated as a **maraka** house (see NTP2-182).
- **NTP2-155** (rule 16) · A planet in the 6th of a D-chart **in a powerful sign** gives good first, bad
  later. · (NTP-2, PDF p. 60) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-156** (rule 17) · The more planets aspecting the D-Lagna, the more powerful that portfolio. ·
  (NTP-2, PDF p. 60) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-157** (rule 18) · **Benefics on both sides of the D-Lagna** (2nd and 12th) confer yoga. A malefic
  joining such a benefic mars it. **Malefics on both sides** spoil first, but improve if a benefic joins
  them. The same holds around the 7th house. Malefics that are Birth Yogi or in their own sign in the
  D-chart give "modified good". · (NTP-2, PDF p. 61) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-158** (rule 19) · **Sankhya yoga (Jaimini):** planets equidistant from the D-Lagna (2–12, 3–11,
  4–10, 5–9, 6–8, 1–7) act like rule 18 according to their natural benefic/malefic nature. · (NTP-2, PDF
  p. 61) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-159** (rule 20) · **D-12: Moon with Ketu → "invariably" the native's mother becomes a widow.** ·
  (NTP-2, PDF p. 61) · VERIFIED-ON-PDF · COMPUTABLE. Timing example: Moon and Ketu in the 8th of D-12 →
  in Ketu Bhukti (p. 65); Shukra–Ketu–Moon period (p. 101).
- **NTP2-160** (rule 21) · A planet or the D-Lagna **hemmed between malefics** becomes bad. · (NTP-2, PDF
  p. 61) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-161** (rule 22) · Malefics in the 12th, 1st and 2nd of a D-chart: bad. Benefics there: good. ·
  (NTP-2, PDF p. 61) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-162** (rule 23) · An event (marriage day, start of profession, fresh undertaking, birth of a child)
  **begun in the period of a planet badly placed in the relevant D-chart** "may not end happily". Restated
  at p. 93: "anything starting at a badly placed planet's period will not be finally good". · (NTP-2, PDF
  p. 61; p. 93) · VERIFIED-ON-PDF · COMPUTABLE (flag only).
- **NTP2-163** (rule 24) · Accession, election and other conferred positions are read from **D-11**. ·
  (NTP-2, PDF p. 61) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-164** (rule 25) · An exalted planet together with a debilitated one, or a planet with its enemy:
  not good. · (NTP-2, PDF p. 61) · VERIFIED-ON-PDF · COMPUTABLE. (UNCERTAIN whether "enemy" means natural
  enmity or Iyer's one-enemy map, NTP2-006.)
- **NTP2-165** (rule 26) · If the two planets on either side of the D-Lagna (or equidistant from it) are one
  benefic and one malefic, bad results come **only in the malefic's period**. · (NTP-2, PDF p. 62) ·
  VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-166** (rule 27) · A planet in the 8th of a D-chart does no harm if aspected by a **powerful Guru**.
  · (NTP-2, PDF p. 62) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-167** (rule 28) · **Female charts: D-9 is the key chart.** "If this Navamsha Chart is good, all the
  rest are good." · (NTP-2, PDF p. 62) · VERIFIED-ON-PDF · COMPUTABLE (weighting). (Iyer frames this in
  1960s social terms. The app need only apply the weighting rule.)
- **NTP2-168** (rule 29) · **A karaka badly placed in D-8 kills the relative it signifies**: Sun in 8 of D-8
  → father, Moon → mother, Shukra → wife, "and so on". · (NTP-2, PDF p. 62) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-169** (rule 30, rule 34) · Any yoga in a D-chart operates for life but is **felt especially in the
  periods of the planets forming it**. "What are all said of the planets in D-charts will be felt during
  their periods." · (NTP-2, PDF p. 62) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-170** (rule 31) · Even a **debilitated planet well placed in a D-chart does good if it is a Yoga
  planet** (Yogi). · (NTP-2, PDF p. 62) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-171** (rule 32) · **In D-11, the planet's house from the D-11 Lagna names the gain**: in the 7th →
  marriage, in the 4th → property, etc. · (NTP-2, PDF p. 62) · VERIFIED-ON-PDF · COMPUTABLE. Example p. 66:
  Shukra in 9 of D-11, Vargottama → father's easy money in Shukra Dasha.
- **NTP2-172** (rule 33) · Parivarthana (mutual sign exchange) inside a D-chart "has its due effect". ·
  (NTP-2, PDF p. 62) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-173** (rule 35) · If the **lord of the D-Lagna is Birth Yogi or Duplicate Yogi**, it gives yoga
  effects "even in ordinary position". Illustrated pp. 72–73 (Duplicate Yogi Budha in an ordinary 9th of
  D-10 → good salary in Budha Dasha; Guru Duplicate Yogi in 10 → a decent job to start with). · (NTP-2, PDF
  p. 62; pp. 72–73) · VERIFIED-ON-PDF (p. 62) · COMPUTABLE.
- **NTP2-174** (rule 36) · **Lord of the D-Lagna in a dusthana → the portfolio turns bad "on and after its
  Dasha"**. Restated at pp. 78–79: if the D-Lagna lord is badly placed, the D-chart's effect is bad from
  the Dasha of that lord onward. · (NTP-2, PDF p. 63; pp. 78–79) · VERIFIED-ON-PDF (p. 63) · COMPUTABLE.
- **NTP2-175** (rule 37) · **Karaka in its own D-Lagna is bad** (D-chart form of "karaka in bhava"): Budha in
  the D-24 Lagna spoils education; Guru in the D-7 Lagna affects issues; Shukra in the D-9 Lagna affects the
  wife; Sun or Moon in the D-12 Lagna affects father or mother; Kuja or Guru in the D-3 Lagna affects the
  younger or elder co-borns; "and so on". · (NTP-2, PDF p. 63) · VERIFIED-ON-PDF · COMPUTABLE. (The "and so
  on" for other D-charts is not specified. Do not extend without a source.)

### 3.4 Lessons from the D-chart illustrations (generalisable only)

- **NTP2-180** · **A D-chart matters only through Dashas that run at the right age.** "We are chiefly
  concerned with planets whose Dashas intervene at proper age." A bad planet in D-10 whose Dasha never
  comes in time does no harm. "It is enough if in one's life a long period Dasha is good." · (NTP-2, PDF
  pp. 69–72) · CLEAR · COMPUTABLE (weight by whether and when the Dasha falls in a normal lifespan).
- **NTP2-181** · **When D-10 looks ordinary but the native's status is high, read D-11** (past karma).
  Professional income is from D-10; "free and voluntary opportunities" are from D-11. · (NTP-2, PDF
  pp. 67–68; p. 70) · CLEAR · NOT-COMPUTABLE (judgement), but the app can show D-10 and D-11 side by side.
- **NTP2-182** · **Death / maraka indicators in D-8** (illustrations): a planet in the **8th of D-8** →
  death in its Dasha (pp. 65, 68, 71). A planet in the **7th or 2nd of D-8 ("maraka house")** → death in
  its Dasha (Shani in 7 with Avayogi Sun, p. 67; Shani in 2, p. 70). The **D-8 Lagna hemmed between two
  malefics** → death in the Dasha-Bhukti of those malefics (Rahu–Kuja, pp. 77, 101). A planet in the **10th
  of D-8 ("Karma Sthana")** → death in its Dasha (p. 74; p. 99). · CLEAR (p. 99 VERIFIED-ON-PDF) ·
  COMPUTABLE · UNCERTAIN for the 10th-house case: two examples only, no rule stated.
- **NTP2-183** · **D-12 parents' death indicators:** Birth Avayogi Budha in the 8th of D-12 (own sign;
  also lord of that D-12 Lagna on p. 67) → father's death in Budha Dasha (pp. 67, 101). A planet in the 7th of D-12 (maraka) → father died in
  Shani Dasha (p. 73). Rahu and Shani in the 2nd of D-12 (maraka) → mother died in Rahu–Shani, mother
  because Shani is lord of 4 in D-1 (p. 101). Guru in the 12th of D-12 → both parents died in Guru Dasha,
  Shukra Bhukti (Shukra debilitated and in the 6th), in the "latter portion" because Guru is in the 12th
  (p. 98). · CLEAR / VERIFIED-ON-PDF (p. 98) · COMPUTABLE · UNCERTAIN as a general rule
  (illustrations only).
- **NTP2-184** · **D-10 career patterns:** exaltation or Digbala in D-10 → rise in that planet's Dasha
  (pp. 63–69). A planet in the 12th of D-10 → loss of service or profession in its Dasha (pp. 65, 74). The
  3rd of D-10 → retirement (NTP2-153). **Vargottama Neecha is no good** (Kuja Neecha in D-10 and D-1 →
  unhappy retirement in Kuja Dasha). · (NTP-2, PDF pp. 63–76; p. 68) · CLEAR · COMPUTABLE.
- **NTP2-185** · **D-9 marriage patterns:** a Vargottama planet in the D-9 Lagna (or Vargottama D-9 Lagna
  with a strong lord) → marriage into a higher family in its Dasha (pp. 63, 65, 99). The D-9 Lagna lord
  "submerged" in the 3rd during the marriageable age → no marriage (p. 78). Malefics (Kuja, Rahu, Shani) in
  the 12th, 1st and 2nd of D-9 → marriage "permanently marred"; Iyer calls this a condition of a true
  sanyasi (p. 78). A **planet in the 6th from the Dasha lord can still give marriage** if the Dasha lord
  sits in the Bhukti lord's sign and the Bhukti lord is the stronger, but with lasting friction (p. 100). ·
  CLEAR / VERIFIED-ON-PDF (p. 100) · COMPUTABLE.
- **NTP2-186** · **D-4 asset patterns:** malefics (Kuja and Rahu) on both sides of the D-4 Lagna → a
  "permanent Avayoga": cannot save, whatever the income (p. 66). Guru in the 8th of D-4 → sold his house
  (p. 70). Vargottama Shani in the D-4 Lagna → a big house in Shani Dasha (p. 70). · CLEAR · COMPUTABLE.
- **NTP2-187** · **D-7 children:** D-7 Lagna hemmed between Rahu and Kuja → no issues (p. 74). Putrakaraka
  Guru exalted but in the 12th with Ketu and the Avayogi, and the Dashas of planets in the 6th and 12th of
  D-7 at the relevant age → childless (p. 74). · CLEAR · COMPUTABLE.
- **NTP2-188** · **D-5 / D-9 / D-60 for renunciates:** for a saint, D-9 "should go bad" and D-5 shows the
  spiritual rise. D-60 amsha names (e.g. "Devamsha") are read literally (p. 78). D-16 Lagna in the
  "Eswara" amsha → conveyance by Eswara's grace (p. 68). · (NTP-2, PDF pp. 76–79; p. 68) · CLEAR ·
  COMPUTABLE (amsha names for D-16; D-60 names are not listed in NTP-2) · see OQ-7.
- **NTP2-189** · **Dispositor rescue:** a planet badly placed in a D-chart does little harm if the lord of the
  sign it occupies is exalted (D-6: Guru in the 3rd but lord Sun exalted in the 11th → nothing serious,
  p. 98; D-7: survival of children because the dispositor Shani is exalted, p. 95). · VERIFIED-ON-PDF ·
  COMPUTABLE · UNCERTAIN as a general rule (two examples).
- **NTP2-190** · **Birth-time rectification by D-charts.** A minute's error moves high D-chart Lagnas (D-11
  example: about 3 minutes would move the D-11 Lagna from Kumbha to Meena). Iyer's method: verify the Lagna
  of every D-chart against past events, fix the Lagna point, then back-calculate the birth time; "the
  correct way and the only way". · (NTP-2, PDF pp. 75–76) · CLEAR · NOT-COMPUTABLE (needs life events).
  *implied app feature:* flag any D-chart whose Lagna is within a few arc-minutes of an amsha boundary.

---

## 4. Dasha and Bhukti (classical), Ch. IV

### 4.1 Dasha reading

- **NTP2-201** · **Udu Dasha (Vimshottari) is the only guiding dasha.** A poor horoscope with good Dashas
  outweighs a powerful horoscope with poor Dashas. · (NTP-2, PDF p. 80) · CLEAR · NOT-COMPUTABLE
  (principle).
- **NTP2-202** · **At any period, life areas differ** (some good, some bad, some middling). The differences
  are read **only from the D-charts**. "All planets give all effects"; the portfolio planets just show
  theirs more strikingly. · (NTP-2, PDF pp. 81–82) · CLEAR · COMPUTABLE (show per-portfolio verdicts, not
  one verdict per period).
- **NTP2-203** · **Dasha effect of a planet = how that planet is disposed in every D-chart** (by the
  Ch. III rules). Read those portfolio effects during its Dasha. · (NTP-2, PDF p. 82) · CLEAR · COMPUTABLE.
  This is the core recipe for an in-app "what this Dasha gives" panel.
- **NTP2-204** · **D-1 lordship and placement set the base tone**, then the D-charts tell what is good and
  what bad. Example: Moon, lord of 8, in the 10th but in a Zero-Rasi → "mixed effects"; the D-charts then
  separate the areas (pp. 91–92). Guru, lord of 1 and 4, in the 7th with lords of 9, 7 and 10, aspected by
  the lord of 5 and 12, but in a Zero-Rasi → "all his good Yoga is reduced" (p. 95). · (NTP-2, PDF
  pp. 91–92; p. 95) · VERIFIED-ON-PDF (p. 95) · COMPUTABLE.
- **NTP2-205** · **Rahu and Ketu give the results of** (1) the planets conjunct with them, (2) the planets
  aspecting them, and (3) the lords of the **star and of the sign** they occupy. · (NTP-2, PDF p. 93) ·
  VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-206** · **Timing inside a Dasha by pada (implied):** Guru in the 2nd pada of his own star
  (Punarvasu 2): "what little attainment he had was obtained in the **second quarter** of Guru Dasha". ·
  (NTP-2, PDF p. 95) · VERIFIED-ON-PDF · COMPUTABLE · UNCERTAIN as a general rule (one example). *Possible
  rule:* the pada number (1–4) of the Dasha lord's star names the quarter of its Dasha that fructifies.
- **NTP2-207** · **Graha Samayam (planetary state) during its Dasha.** Iyer's working: count Mesha → Lagna
  inclusive (A), Lagna → the planet's sign inclusive (B); (A + B) × 2 × (the planet's Udu-Dasha years);
  divide by 27; the remainder is the Samayam number (1–27, list in Part I). Its trait shows **during that
  planet's Dasha only**. Example: Lagna Dhanus (9), Guru in Mithuna (7): (9+7) × 2 × 16 = 512; 512 mod 27 =
  26 → Athinidra (excessive sleep), seen in Guru Dasha and gone in Shani Dasha. · (NTP-2, PDF p. 102) ·
  VERIFIED-ON-PDF · COMPUTABLE (the 27 names must come from NTP-1). UNCERTAIN: what remainder 0 means is
  not stated (OQ-8).

### 4.2 The Mathematical Navamsha Chart (Math-D-9) and the three stars

- **NTP2-401** · **General principle of "mathematical" D-charts.** Inside each sign, first fix the
  **Vargottama amsha** (the part that stays in the same sign in D-1 and in the division). Then fill the
  following parts, in order, with the amshas given by the **next "bestowing" signs** (signs that actually
  feed an amsha to this sign; skip non-feeding signs), following the same order used to build that division.
  · (NTP-2, PDF pp. 82–83) · CLEAR · COMPUTABLE for D-9. Iyer works out only D-9 and leaves the others "to
  my friends to labour".
- **NTP2-402** · **Math-D-9: exact algorithm** (my formalisation; it reproduces Iyer's printed chart on
  pp. 90–91 and every worked example). Number star-padas globally n = 1…108 (Ashwini 1 = 1). Sign S
  (1…12) holds D-1 slots p = 9(S−1)+1 … 9(S−1)+9. The padas whose navamsa is S are n_k = S + 12k
  (k = 0…8). Exactly one of them lies inside S's own slots: the **Vargottama pada**. Put it on its own slot.
  Then place the remaining n_k in increasing k order (cyclically) on the following slots (cyclically within
  the sign). · (NTP-2, PDF pp. 84–85, worked example for Vrishabha; chart pp. 90–91) · VERIFIED-ON-PDF ·
  COMPUTABLE.
  - Check examples (all reproduced by the algorithm): on Rahu's radix U.Bhadra 3 falls **Uttara 4** (p. 39).
    Punarvasu 2 ↔ Rohini 3 are exchanging padas (p. 97). Swathi 1 gives amsha to **P.Shada 3** (p. 99).
    Shathabhisha 4 → Revathi 3, an exchange (p. 99). U.Bhadra 3 → Swathi 3 (p. 99). On Aslesha 3 falls
    Ashwini 4 (p. 100). Krittika 1 → Moola 3 (p. 101).
- **NTP2-403** · **Three kinds of pada:** 12 **Vargottama** padas (one per sign); 24 **exchanging
  (Parivarthana) padas** (2 per sign, swapping places in pairs); 72 **moving padas** (6 per sign; they cycle
  through six positions before returning). The chart prints Vargottama in bold and exchanging in italics;
  "the Vargottam and Exchanging Padas are consecutively situated". · (NTP-2, PDF p. 85; pp. 90–91 legend)
  · VERIFIED-ON-PDF · COMPUTABLE (my script reproduces 12/24/72).
- **NTP2-404** · **The three stars of a planet** (they shape its Dasha and the Bhuktis linked to it):
  **(a)** the star-pada the planet occupies in D-1 (its radix); **(b)** the star-pada **to which it gives
  its amsha**, i.e. the D-1 slot where its pada is placed in Math-D-9; **(c)** the star-pada that **falls on
  its radix slot** in Math-D-9. "These three stars and their lords play a very important role." · (NTP-2,
  PDF p. 83; p. 89; also p. 39, lead's range) · VERIFIED-ON-PDF (p. 89) · COMPUTABLE.
- **NTP2-405** · **Rule (G): the Dasha lord takes on the qualities of the lord of star (c).** If star (c)
  belongs to the **Birth Yogi**, the Dasha becomes yogaic. If it belongs to the **Birth Avayogi**, the
  reverse. · (NTP-2, PDF p. 89) · VERIFIED-ON-PDF · COMPUTABLE. Examples: Rahu takes on the "death
  inflicting trait" of Avayogi Sun → died in Rahu Dasha (p. 39). Sun takes on Avayogi Ketu's malefic
  character → died in Sun Dasha, Sun–Ketu (pp. 100–101).
- **NTP2-406** · **Rule (F): amsha into a dusthana.** If in Math-D-9 a planet **gives its amsha to a sign
  that is 3rd, 6th, 8th or 12th from itself** (i.e. star (b) lies in a dusthana counted from the planet's
  D-1 sign), the result is bad, otherwise good. It is felt in **the planet's Dasha and the Bhukti of the
  lord of star (b)**. If the two are exchanging (Parivarthana) padas, **the effect felt first is rectified
  later**. · (NTP-2, PDF p. 89) · VERIFIED-ON-PDF · COMPUTABLE. Examples: Rahu's amsha in the 3rd from
  itself (death house), lord Shukra → died in Rahu–Shukra (p. 99). Sun's amsha in the 8th → bad for life in
  Sun Dasha (p. 100). Guru's amsha in the 12th via an exchanging pair → setback in Guru–Moon later rectified
  (p. 97).
  - *Sub-rule (p. 100):* the expected Bhukti (lord of star b) may be **pre-empted by a planet conjunct with
    that lord whose Bhukti comes first**: Guru was with Moon, so death came in Sun–Moon, not Sun–Guru. ·
    VERIFIED-ON-PDF · COMPUTABLE · UNCERTAIN (one example).
- **NTP2-407** · **Rule (D): yoga starting in the Dasha lord's own Bhukti.** The common belief is that a
  Dasha lord's good does not start in its own Bhukti, and if it does, the rest of the Dasha goes bad. Iyer's
  exception: the yoga **"will surely start in its own Bhukti"** (and last to the end of the Dasha) if the
  Dasha lord is in **its own sign**, or more decisively **its own star in D-1**, or its **star-pada moves to
  one of its own stars in Math-D-9**. · (NTP-2, PDF p. 88; illustrated p. 96) · VERIFIED-ON-PDF ·
  COMPUTABLE. *Note:* Iyer does not say whether he accepts the general belief when the exception fails.
  Treat it as reported belief, UNCERTAIN.

### 4.3 Bhukti reading rules (apply per D-chart; read that D-chart's portfolio in the Bhukti)

First judge the planet as Dasha lord, then as Bhukti lord. (NTP-2, PDF p. 86) VERIFIED-ON-PDF.

- **NTP2-410** · **Mutual relation** between Dasha lord and Bhukti lord (per Phaladeepika XV.30) exists if
  **any** of these hold: (a) each in the other's sign; (b) mutual aspect or conjunction; (c) mutual kendra
  or kona; (d) **one is placed in any star-pada of the other in Math-D-9**; (e) each in the other's star in
  D-1. · (NTP-2, PDF p. 86) · VERIFIED-ON-PDF · COMPUTABLE. *implied operationalisation of (d), from Iyer's
  examples:* the relation holds when star (b) or star (c) of one planet is owned by the other (pp. 97, 99,
  101).
- **NTP2-411** · **Relationship is required for anything to happen.** "I trace the relationship between the
  Dasha Lord and Bhukti Lord either in D-1, Math. D-9 or in the particular Chart as **without such
  relationship no results happen**." · (NTP-2, PDF p. 98) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-412** · **(A) Good Dasha lord (in that D-chart):** (1) a good Bhukti lord, if related, **adds** its
  good. (2) A good Bhukti lord, not related, stays **neutral**: only the Dasha lord's good is felt. (3) A bad
  Bhukti lord, related, **modifies** the Dasha lord's good by relative strength in that chart. (4) A bad
  Bhukti lord, not related, stays neutral: the Dasha lord's good is felt "with traces of evil" of the Bhukti
  lord. · (NTP-2, PDF pp. 86–87) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-413** · **(B) Bad Dasha lord (in that D-chart):** (1) a good Bhukti lord, related, **modifies** the
  bad by relative strength. (2) A good Bhukti lord, not related, gives **worse** results. (3) A bad Bhukti
  lord, related or not, does **worse**. · (NTP-2, PDF p. 87) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-414** · **(C) One-sided relations in a D-chart.**
  1. **Bhukti lord in the Dasha lord's sign (or in its star in D-1)** = the Dasha lord's "guest": only the
     Dasha lord's powers prevail.
  2. **Dasha lord in the Bhukti lord's sign (or star in D-1)** = the Bhukti lord's tenant: the Dasha lord's
     trait is changed by the Bhukti lord. A good Bhukti lord is fine. A bad Bhukti lord forces bad results
     even from a good Dasha lord. If both are bad: "worst results". If the malefic Bhukti lord is weaker than
     a good Dasha lord, the result is tolerable. If stronger: worst, even though the Dasha lord is good.
  3. **One-way aspect**: add the aspector's character to the aspectee's. If the aspector is the Dasha lord,
     only its effects are felt. If the Bhukti lord aspects the Dasha lord, the effects mix.
  4. **Conjunction**: the more powerful planet predominates.
  · (NTP-2, PDF pp. 87–88) · VERIFIED-ON-PDF · COMPUTABLE. Illustrations: Bhukti lord in the Dasha lord's
  sign and star → "a total subject of Guru", excellent Bhukti (p. 96). Shani in the 8th from the Dasha lord
  but in its sign → "controlled", Bhukti good enough (p. 97). The Dasha lord in a stronger Bhukti lord's
  sign → the Bhukti lord's effect predominated (p. 100).
- **NTP2-415** · **(E) Mutual distance of the two lords.** Even if both are good on their own, if the Bhukti
  lord is **3rd, 6th, 8th or 12th** from the Dasha lord, "the period may not be congenial". · (NTP-2, PDF
  p. 89) · VERIFIED-ON-PDF · COMPUTABLE. Illustrated: Sun 6th from the Dasha lord → an enemy campaigned
  against the native (p. 96). Guru 8th → heavy expenses (p. 97). Avayogi Shukra 6th → money spent away
  (p. 98). Shani 3rd from the Dasha lord → poor result (p. 95).
- **NTP2-416** · **Position from Lagna also counts, and can dominate.** "For best effects the Bhukti lord
  should be in auspicious positions **both from Lagna and Dasha Lord**." (p. 95.) When the mutual position is
  good but both are badly placed from Lagna, "their bad positions from lagna predominated" (p. 101). Kuja
  debilitated in the 8th gave money trouble in its Bhukti even though it was in the 4th from the Dasha lord
  and Rahu sat in Kuja's sign (p. 94). Moon in the 7th from the Dasha lord (Gajakesari) still hurt because it
  was 6th from Lagna (p. 97). · (NTP-2, PDF pp. 94–97; p. 101) · VERIFIED-ON-PDF (pp. 94, 95); CLEAR (pp. 97, 101) ·
  COMPUTABLE.
- **NTP2-417** · **A Bhukti lord in the 3rd (death house) of a D-chart closes that matter in its Bhukti**
  (education closed in Budha Bhukti, Budha in the 3rd of D-24). · (NTP-2, PDF p. 95) · VERIFIED-ON-PDF ·
  COMPUTABLE (consistent with NTP2-153).
- **NTP2-418** · **Trine and yoga link → good Bhuktis.** Planets in mutual trines and well placed from
  Lagna give good Bhuktis/Antaras of each other in the Dasha (pp. 93–94, 97). Planets forming a
  Shubhakarthari yoga in a D-chart give good Dashas and Bhuktis for that portfolio (p. 96). · VERIFIED-ON-PDF
  (pp. 93–94) / CLEAR (pp. 96–97) · COMPUTABLE.
- **NTP2-419** · **Mixed: Yogi plus a debilitated companion.** Rahu as Yogi but conjunct a debilitated
  Budha → its Bhukti was "both yogaic and disruptive" (p. 97). A job started in the Bhukti of a debilitated
  planet ended in the same Bhukti (p. 93). · VERIFIED-ON-PDF (p. 93) · COMPUTABLE.
- **NTP2-420** · **Relatives born in the native's Yogi or Avayogi star.** People whose **Moon or Lagna is in
  the star of the native's Birth Yogi** prove helpful to the native; those in the **Birth Avayogi's star**
  cause distress. If born in the native's exact Yoga star, this is "certain". · (NTP-2, PDF p. 94) ·
  VERIFIED-ON-PDF · COMPUTABLE (needs the other person's chart).

### 4.4 Rahu / Ketu special rules (collected)

- NTP2-205 (Rahu/Ketu give the results of conjunct and aspecting planets and of their star and sign lords),
  p. 93.
- NTP2-005 (Rahu ~ Shani, Ketu ~ Kuja kith pairs), p. 142.
- NTP2-010 (Rahu or Ketu as group-planet remedy for a negative Birth Yogi), pp. 38–39.
- NTP2-509(c) (Rahu and Ketu transiting Zero-Rasis give good), p. 108.
- NTP2-806 (Kaalasarpa: only Iyer's directional definition; harmful only in Rahu/Ketu Dashas, or Dashas of
  planets in their stars, and only if the nodes are not yogaic), pp. 146–147.
- NTP2-802 (Rahu Kalam is good for those whose Rahu is a well-placed yogakaraka running its Dasha),
  p. 145.
- NTP2-703 (a day where Birth Yogi Rahu or Ketu, as natural negatives, crosses the day's Avayogi →
  brilliant, unless that Avayogi is the Birth Yogi's enemy), pp. 142–144.

### 4.5 Maraka / death timing (collected; see also §3.4)

- **NTP2-430** · Death comes in the Dasha of a planet in a **death-like house (3rd, 8th) or maraka house
  (2nd, 7th) of D-8**, or of a karaka badly placed in D-8 for that relative (NTP2-153, 168, 182). The Bhukti
  is often the lord of **star (b)** (NTP2-406), the lord of **star (c)** (p. 100: died in Sun–Ketu "as Ketu
  star falls on its Radix position"), or a planet related by the malefic flanking of the D-8 Lagna. ·
  (NTP-2, PDF pp. 60, 62, 67, 70, 99–101) · VERIFIED-ON-PDF (pp. 60, 62, 99–100) · COMPUTABLE (as a risk
  flag only). *App caution:* Iyer states these as predictions. An app should not show death predictions
  to users. Present them, if at all, as "period of strain for longevity matters (D-8)" (OQ-10).
- **NTP2-431** · **Transit trigger for death:** the Dasha lord transiting the star of the planet whose pada
  falls on its radix (star c, when that planet is the Avayogi), in the 8th Bhava (p. 115). The Dasha lord on
  the exact cusp of the 3rd Bhava ("House of Death", p. 115). The Dasha lord in the Birth Avayogi's star on
  the Dasha lord's weekday, in the Bhukti lord's star (p. 115). · (NTP-2, PDF p. 115) · CLEAR · COMPUTABLE ·
  same caution.

---

## 5. Gochara (transit), Ch. V

- **NTP2-501** · **Iyer rejects transit counted from the natal Moon or Sun** as general and fallacious
  (there are too many people per Moon sign, and it ignores the Lagna and the other planets). The only
  Moon-based transit he finds reliable is **Sade-Sati Shani**, and even that has exceptions "explained later"
  (not found in NTP-2: OQ-9). · (NTP-2, PDF pp. 103–105) · VERIFIED-ON-PDF (pp. 104–105) · COMPUTABLE.
  *App note:* if the app shows a Moon-based transit table, label it "traditional (Iyer does not rely on
  this)".
- **NTP2-502** · **The traditional Moon-based favourable houses** are only 1/8th of Ashtakavarga (each
  planet's bindu places from the Moon in its own Bhinnashtakavarga): Sun 3, 6, 10, 11; Moon 1, 3, 6, 7, 10,
  11; Kuja and Shani 3, 6, 11; Budha 2, 4, 6, 8, 10, 11; Guru 2, 5, 7, 9, 11; Shukra 1, 2, 3, 4, 5, 8, 9, 11,
  12. · (NTP-2, PDF pp. 104–105) · VERIFIED-ON-PDF · COMPUTABLE. *Discrepancy:* the prose on p. 104 lists
  Moon's places as "1, 3, 6, 7 and 11"; the table on p. 105 adds 10. The table agrees with standard Moon BAV
  from the Moon.
- **NTP2-503** · **Iyer's method: transit counted from the Lagna, applied chiefly to the current Dasha
  lord** ("by planet I mean Dasha Lord"), citing Phaladeepika XX.34–38. · (NTP-2, PDF p. 105) ·
  VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-504** (step 01) · **Birth trait comes first.** A planet bad at birth cannot give good even in
  favourable transit. One good at birth may hold back its good in bad transit "but never does harm". ·
  (NTP-2, PDF p. 105) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-505** (step 02) · **Use the Bhava (not the sign) being transited.** Bhava = the span from its start
  to its end. One sign may hold parts of 2–3 Bhavas; Iyer gives a worked example. (a) A planet good at birth
  transiting good Bhavas gives the good of the Bhavas it **owns at birth** and of the Bhava it **transits or
  aspects**. Ownership includes Sthoola and Sookshma lordship (Part I). (b) The same planet in dusthana
  Bhavas stays neutral. **Cusp rule:** approaching a cusp = formative, developing; receding = fading,
  diminishing; exactly on the cusp = maximum, at birth and in transit. · (NTP-2, PDF p. 106) · CLEAR ·
  COMPUTABLE (needs Bhava cusps; KAAST already computes them).
- **NTP2-506** (step 03) · **Sign transited.** (a) Good at birth: own, exaltation or friendly sign → good;
  debilitation or enemy sign → neutral. (b) Bad at birth: debilitation, enemy sign or a Zero-Rasi →
  neutral at best ("never good"); other signs → bad. · (NTP-2, PDF p. 107) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-507** (step 04) · **Star transited.** (a) A good planet transiting the star of a good (functional)
  planet, the Birth Yogi, the Dasha Yogi or the Dasha Raja Yogi → good; the contrary → bad. (b) **Sensitive
  points:** the planet's three Math-D-9 stars (NTP2-404) **and their trikona stars**. Transit there gives
  effects by the nature of their lords: Yogi group good, Avayogi group bad. · (NTP-2, PDF p. 107) ·
  VERIFIED-ON-PDF · COMPUTABLE. ("Trikona stars" = presumably the stars of the same lord, 9 stars apart.
  UNCERTAIN, OQ-11.)
- **NTP2-508** (step 05) · **Transit state:** (a) combust → totally ineffective if good at birth, worst if
  bad at birth; (b) **retrograde → very powerful** for good or bad according to birth trait; (c) fast
  (Athichara) → "likely to give very dangerous effect"; (d) slow (Manda) → slow action; (e) stationary
  (Sthambana) → neutral. · (NTP-2, PDF pp. 107–108) · VERIFIED-ON-PDF · COMPUTABLE (needs thresholds for
  fast/slow; none given, OQ-12).
- **NTP2-509** (step 06) · **Zero-Rasis in transit:** (a) planets **positive at birth** give good in
  non-Zero signs; in Zero-Rasis they are submerged **unless retrograde**. (b) **Negative planets and the
  Avayogi** give good **in** Zero-Rasis unless retrograde. (c) **Rahu and Ketu in Zero-Rasis give good.** ·
  (NTP-2, PDF p. 108) · VERIFIED-ON-PDF · COMPUTABLE. Illustrations: "retrogression even in Zero-Rasi is
  good"; Guru's transit in a Zero-Rasi neutralised his good (pp. 112–113).
- **NTP2-510** (step 07) · Conjunction with, or aspect from, a friendly and benefic planet during transit →
  happy; otherwise bad. · (NTP-2, PDF p. 108) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-511** (step 08) · Treat the **Birth Yogi's transit** like the Dasha lord's, but as subsidiary. ·
  (NTP-2, PDF p. 108) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-512** (step 09) · **Transit over exact Bhava cusps times events.** Order of importance: **10th
  cusp**, then Lagna, then the 4th, then the 7th; other cusps matter little. · (NTP-2, PDF p. 108) ·
  VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-513** (step 10) · Optionally consider the transit of the Bhukti lord too. · (NTP-2, PDF p. 108) ·
  VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-514** (step 11) · **Day of the event:** it should fall on the **Thithi, weekday, star, Yoga or
  Lagna of the Dasha lord or Bhukti lord** (sometimes the Antara lord). Also: find the **Ruler of the Dasha
  lord**; good comes on the day the (day's) Yoga planet coincides with this Ruler, and when the Dasha lord
  passes through this Ruler's star. When two or more of these coincide, "that day is certain". · (NTP-2, PDF
  pp. 108–109) · VERIFIED-ON-PDF (p. 108) · COMPUTABLE (Thithi lords and Yoga lords from NTP-1).
- **NTP2-515** (step 12) · **Secondary progression of the Moon** (Western "day for a year") refines timing
  for fast planets (Sun, Budha, Shukra: they circle the zodiac many times in a Dasha) and slow ones (Guru,
  Shani, Rahu, Ketu: they sit too long). The progressed Moon gives the effect of the **Bhava and star it
  transits**, like the Dasha lord. On the **Yogi's star → yoga**; vice versa. · (NTP-2, PDF p. 109) · CLEAR
  · COMPUTABLE. Illustrations: progressed Moon on the 7th cusp at marriage; on the Raja Yogi's star / exact
  Birth Yoga star at gains; conjunct radix Shani (a Duplicate Yogi) was good, because functional traits
  outweigh natural ones (pp. 112–113).
- **NTP2-516** (step 13) · Of Western primary and secondary directions, the only "candid" rule Iyer keeps
  is **meridian progressed to planets and planets progressed to the meridian**; allow about a year's
  margin. · (NTP-2, PDF p. 109) · CLEAR · COMPUTABLE (low priority).
- **NTP2-517** (steps 14–15) · For annual readings use the Solar map (Ch. VI); for daily and hourly, Ch. VII.
  · (NTP-2, PDF p. 110) · CLEAR.
- **NTP2-518** · **Other theories** (Iyer is "not interested", given "for academic interest"): (a) Tharabala;
  (b) **Pada (foot) of entry**: count from the natal Moon sign to the transit Moon sign when a planet enters
  a sign: **1, 6, 11 = golden; 2, 5, 9 = silver; 3, 7, 10 = copper; 4, 8, 12 = iron**. Common view: golden
  and silver good, copper mixed, iron bad. **Iyer's guru's version, which Iyer finds logical "by
  research"**: natural benefics as above, but **natural malefics reversed** (iron good, copper neutral,
  golden and silver bad). Apply to the Dasha lord (and Bhukti lord). Example: Shani entering with an iron
  foot was good. · (NTP-2, PDF pp. 110–111) · CLEAR (p. 111 text and OCR agree) · COMPUTABLE.
- **NTP2-519** · **Transit lessons from the illustrations:** the Dasha lord transiting its **Starter's star
  in the 7th Bhava** → marriage. The Dasha lord transiting the **exact Dasha Yogi star** → promotion; the
  **exact Birth Avayogi star** → suffering. The Dasha lord transiting the **Birth Yogi's star** → government
  job, coronation. The Dasha lord **exactly on its star (b)** (Math-D-9) in the 7th Bhava → marriage. ·
  (NTP-2, PDF pp. 111–116) · CLEAR · COMPUTABLE.

---

## 6. Varshapravesh (solar return), Ch. VI

- **NTP2-601** · **Use only what "stood the test"** from Tajaka Neelakanti. Skip the Tajaka sign/planet
  characteristics chapter (Varahamihira and Parasara suffice). · (NTP-2, PDF pp. 117–118) · CLEAR.
- **NTP2-602** · **Do not mix strength systems.** Panchavargi Bala is for Tajaka work (to find the year
  lord); Shadbala for other systems. · (NTP-2, PDF p. 118) · CLEAR · COMPUTABLE.
- **NTP2-610** · **Panchavargi Bala (5-fold strength, max 20 Rupas, "Vimshopaka").** Strength from the
  planet's **Rasi, Hadda, Thrirasi, Navamsha** (by own / friend / neutral / enemy status) plus **Uccha
  bala**. Table 6: · (NTP-2, PDF pp. 118–120, 124) · VERIFIED-ON-PDF · COMPUTABLE.

  | Varga | Own | Friend | Neutral | Enemy |
  |---|---|---|---|---|
  | Rasi | 30 | 22½ | 15 | 7½ |
  | Hadda | 15 | 11¼ | 7½ | 3¾ |
  | Thrirasi | 10 | 7½ | 5 | 2½ |
  | Navamsha | 5 | 3¾ | 2½ | 1¼ |

  **Uccha bala** = (arc distance from the debilitation point) / 9, in Rupas: 20 at exact exaltation, 0 at
  debilitation. **Vimshopaka = (sum of the five) / 4**, max 20. · (NTP-2, PDF p. 124) · CLEAR. Exaltation
  degrees printed: **Sun 10, Moon 3, Kuja 28, Budha 15, Guru 5, Shukra 27, Shani 20** (signs not printed on
  that page). · (NTP-2, PDF p. 119) · VERIFIED-ON-PDF. Worked example: Kuja 30 + 15 + 1¼ + 2½ + 10¾ = 59½ →
  about 15 Rupas = 75% (p. 135, VERIFIED-ON-PDF). *Note:* 95° from Neecha / 9 = 10.56, printed 10¾.
- **NTP2-611** · **Tajaka friendship (for Panchavargi only; by the planets' positions in the annual
  chart):** planets 3rd, 5th, 9th or 11th from another are friends (3, 11 secret; 5, 9 open). 1st, 4th,
  7th, 10th = enemies (1, 7 open; 4, 10 secret). 2nd, 12th, 6th, 8th = neutral. · (NTP-2, PDF pp. 123–124)
  · CLEAR · COMPUTABLE. Example p. 135: Shukra 4th from Kuja → enemy.
- **NTP2-612** · **Hadda table** (lord-degrees in order within each sign; Sun, Moon, Rahu and Ketu have no
  Hadda). · (NTP-2, PDF p. 121, rotated) · VERIFIED-ON-PDF (each row sums to 30) · COMPUTABLE.

  | Sign | Haddas (lord-span°) |
  |---|---|
  | Mesha | Gr 6, Sk 6, Bd 8, Kj 5, Sn 5 |
  | Vrishabha | Sk 8, Bd 6, Gr 8, Sn 5, Kj 3 |
  | Mithuna | Bd 6, Sk 6, Gr 5, Kj 7, Sn 6 |
  | Kataka | Kj 7, Sk 6, Bd 6, Gr 7, Sn 4 |
  | Simha | Gr 6, Sk 5, Sn 7, Bd 6, Kj 6 |
  | Kanya | Bd 7, Sk 10, Gr 4, Kj 7, Sn 2 |
  | Thula | Sn 6, Bd 8, Gr 7, Sk 7, Kj 2 |
  | Vrischika | Kj 7, Sk 4, Bd 8, Gr 5, Sn 6 |
  | Dhanus | Gr 12, Sk 5, Bd 4, Kj 5, Sn 4 |
  | Makara | Bd 7, Gr 7, Sk 8, Sn 4, Kj 4 |
  | Kumbha | Sk 7, Bd 6, Gr 7, Kj 5, Sn 5 |
  | Meena | Sk 12, Gr 4, Bd 3, Kj 9, Sn 2 |

  Iyer stresses Hadda: a planet **in its own Hadda** gains superior strength and gives good during its
  (annual) Dasha in the year. · (NTP-2, PDF p. 124) · CLEAR.
- **NTP2-613** · **Thrirasi table for strength** (three 10° parts per sign; "starting with Kuja it runs in
  continuous weekday order", Kj→Bd→Gr→Sk→Sn→Rv→Ch, row by row across the signs). · (NTP-2, PDF p. 122) ·
  VERIFIED-ON-PDF · COMPUTABLE.

  | | Me | Vr | Mi | Ka | Si | Kn | Th | Vs | Dh | Mk | Ku | Mn |
  |---|---|---|---|---|---|---|---|---|---|---|---|---|
  | 0–10° | Kj | Bd | Gr | Sk | Sn | Rv | Ch | Kj | Bd | Gr | Sk | Sn |
  | 10–20° | Rv | Ch | Kj | Bd | Gr | Sk | Sn | Rv | Ch | Kj | Bd | Gr |
  | 20–30° | Sk | Sn | Rv | Ch | Kj | Bd | Gr | Sk | Sn | Rv | Ch | Kj |
- **NTP2-614** · **Tri-Rasi table for the year lord** (by the Varsha Lagna sign, day or night revolution;
  distinct from the strength Thrirasi). · (NTP-2, PDF p. 122) · VERIFIED-ON-PDF · COMPUTABLE.

  | | Me | Vr | Mi | Ka | Si | Kn | Th | Vs | Dh | Mk | Ku | Mn |
  |---|---|---|---|---|---|---|---|---|---|---|---|---|
  | Day | Rv | Sk | Sn | Sk | Gr | Ch | Bd | Kj | Sn | Kj | Gr | Ch |
  | Night | Gr | Ch | Bd | Kj | Rv | Sk | Sn | Kj | Sn | Kj | Gr | Ch |
- **NTP2-615** · **Harsha Bala** (4 kinds × 5 Rupas = max 20), applied **only to the Panchadhikaris**:
  (1) **Sthana**: Sun in the 9th, Moon 3rd, Kuja 6th, Budha 1st, Guru 11th, Shukra 5th, Shani 12th from the
  Varsha Lagna. (2) **Swochadi**: in its own or exaltation sign. (3) **Diva-Ratri**: male planets when the
  revolution is by day, female planets at night. (4) **Pum-Stree (sex)**: female planets in houses 1–3 and
  7–9 from the Varsha Lagna, male planets in 4–6 and 10–12. In Tajaka **Sun, Kuja, Guru are male; all
  others female**; no neutrals. Strong in both Varga and Harsha bala → very happy results. · (NTP-2, PDF
  pp. 119–120, 127, 136) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-620** · **Varshapravesh moment** = when the transiting Sun returns to its exact **Nirayana** natal
  longitude. Do not use printed "Solar Return" tables. Cast for the **birth place**, not the residence.
  **Sayana is rejected.** The natal Sun must be very accurate: 1′ of Sun ≈ 24 minutes of clock time ≈ 6–7°
  of Lagna. · (NTP-2, PDF pp. 124–126) · CLEAR · COMPUTABLE.
- **NTP2-621** · **Panchadhikaris (five office-bearers):** (1) lord of the birth Lagna; (2) lord of the
  Varsha Lagna; (3) **Muntha lord**; (4) Tri-Rasi lord (NTP2-614); (5) lord of the sign holding the **Sun
  (day revolution) or Moon (night revolution)**. One planet may hold several posts; count them as five. ·
  (NTP-2, PDF p. 126; example p. 135) · VERIFIED-ON-PDF (p. 135) · COMPUTABLE.
- **NTP2-622** · **Muntha** = progressed Ascendant: natal Lagna longitude + 30° × (completed years); the
  lord of the resulting sign. Compute exactly, not by counting signs. Example: 56th year → 10° Dhanus + 55
  signs = 10° Kataka → Moon. · (NTP-2, PDF p. 127; p. 135) · CLEAR / VERIFIED-ON-PDF (p. 135) ·
  COMPUTABLE.
- **NTP2-623** · **Year lord (Varshapa):** (1) must be a Panchadhikari, (2) must aspect the Lagna (**sign
  aspect**), (3) the strongest (Panchavargi) such planet. If none of the five aspects the Lagna → the
  strongest **other** planet that aspects it. If none at all → the strongest of the 7. Iyer **prefers the
  general (Varahamihira) aspects** over Tajaka aspects, using Tajaka aspects only when there is no such
  aspect. In the example he finally prefers Shani (aspects the Lagna per Varahamihira, Harsha bala 75%)
  over the Tajaka winner Kuja. · (NTP-2, PDF pp. 127–128; pp. 135–136) · VERIFIED-ON-PDF (pp. 135–136) ·
  COMPUTABLE. UNCERTAIN: the priority between Panchavargi and Harsha bala is not stated as a rule (OQ-13).
- **NTP2-624** · **Year lord in the 6th, 8th or 12th** (the classical "bad year") means 6/8/12 in the
  **Bhava** chart. A sign-aspecting planet can still fall in a dusthana Bhava. · (NTP-2, PDF p. 128) ·
  CLEAR · COMPUTABLE.
- **NTP2-625** · **Annual Dasha = Udu Dasha compressed into the year.** Spans ∝ 6, 10, 7, 18, 16, 19, 17,
  7, 20 (Sun, Moon, Kuja, Rahu, Guru, Shani, Budha, Ketu, Shukra), measured by the transiting Sun: **18°,
  30°, 21°, 54°, 48°, 57°, 51°, 21°, 60°** (3° per Dasha-year; total 360°). Starting balance from the
  **Moon at the revolution**, like the natal balance. 1° of Sun ≈ 1 day (exactly 365/360 day). Iyer rejects
  Tajaka's Mudda/Patyamsha Dashas. · (NTP-2, PDF pp. 128–129; p. 137) · VERIFIED-ON-PDF (p. 129) ·
  COMPUTABLE.
- **NTP2-626** · **Reading a planet's annual Dasha:** combine (1) the Bhavas it owns, (2) the Bhava it
  occupies or aspects, (3) the Sahamas of which it is Sthoola or Sookshma lord, (4) planets conjunct or
  aspecting with similar traits. If two or three coincide, "dead-cert". The Bhava effects of the
  Panchadhikaris will definitely be felt. · (NTP-2, PDF pp. 136–137; p. 139) · CLEAR · COMPUTABLE.
- **NTP2-630** · **Sahama formula convention (Saikatham).** Sahama = (A − B) + C. If C is **not** within the
  arc from B to A counted in the zodiacal ("clockwise") direction, **add one sign (30°)**; otherwise not.
  Iyer is in the add-one school "by research". **Night revolutions: swap A and B** (C unchanged), unless the
  table marks the formula D&N. · (NTP-2, PDF pp. 129–130; p. 133) · VERIFIED-ON-PDF · COMPUTABLE.
  ("Clockwise" = increasing longitude on his South-Indian chart; the Vivaha example (Shukra − Shani) + Lagna
  tests whether the Lagna lies from Shani to Shukra.)
- **NTP2-631** · **Sahama table** (Day formula unless noted; N = night variant printed). · (NTP-2, PDF
  pp. 131–132) · VERIFIED-ON-PDF · COMPUTABLE.

  | # | Sahama | D/N | Formula as printed |
  |---|---|---|---|
  | 1 | Punya (virtue) | D | (Moon − Sun) + Asc |
  | 2 | Guru (preceptor) | D | (Sun − Moon) + Asc |
  | 3 | Vidya (learning) | D | (Sun − Moon) + Asc |
  | 4 | Yasha (fame) | D | (Guru − Punya) + Asc |
  | 5 | Bala (strength) | D | (Guru − Punya) + Asc |
  | 6 | Deha (body) | D | (Guru − Punya) + Asc |
  | 7 | Asha (ambition) | D | (Shani − Shukra) + Asc |
  | 8 | Brathru (brother) | D&N | (Guru − Shani) + Asc |
  | 9 | Gowrava (respect) | D | (Guru − Moon) + Sun |
  | 9 | Gowrava (respect) | N | (Guru − Sun) + Moon |
  | 10 | Raja (king) | D | (Shani − Sun) + Asc |
  | 11 | Thatha (father) | D | (Shani − Sun) + Asc |
  | 12 | Matru (mother) | D | (Moon − Shukra) + Asc |
  | 13 | Putra (son) | D&N | (Guru − Moon) + Asc |
  | 14 | Jeevitha (living) | D | (Shani − Guru) + Asc |
  | 15 | Karma (vocation) | D | (Kuja − Budha) + Asc |
  | 16 | Roga (disease) | D&N | (Asc − Moon) + Asc |
  | 17 | Manmatha (cupidity) | D | (Moon − Lord of Asc) + Asc; if Moon is the Lagna lord, use the D&N formula |
  | 17 | Manmatha | D&N | (Sun − Lord of Asc) + Asc |
  | 18 | Sastra (science, Vedic) | D | (Guru − Shani) + Budha |
  | 19 | Mritha (death) | D&N | (VIII Bhava cusp − Moon) + Shani |
  | 20 | Artha (money) | D&N | (II cusp − Lord of II Bhava) + Asc |
  | 21 | Anyadara (other's wife) | D&N | (Shukra − Sun) + Asc |
  | 22 | Vanic (trade) | D&N | (Moon − Budha) + Asc |
  | 23 | Vivaha (marriage) | D&N | (Shukra − Shani) + Asc |
  | 24 | Vyapara (business) | D&N | (Kuja − Budha) + Asc |
  | 25 | Bandhu (relative) | D&N | (Budha − Moon) + Asc |
  | 26 | Deshantara (foreign land) | D&N | (IX cusp − Lord of IX) + Asc |
  | 27 | Kanya (unmarried girl) | D&N | (Shukra − Moon) + Asc |
  | 28 | Karyasiddhi (success) | D | (Shani − Sun) + lord of the sign occupied by the Sun |
  | 28 | Karyasiddhi | N | (Shani − Moon) + lord of the sign occupied by the Moon |
  | 29 | Paniyapatha (watery grave) | D | (Shani − Moon) + Asc |
  | 30 | Ripu (enemy) | D | (Kuja − Shani) + Asc |
  | 31 | Daridra (poverty) | D | (Punya Sahama − Budha) + Asc |
  | 32 | Jaladva (journey on water) | D | (3 signs 15° − Shani) + Asc |
  | 33 | Ashva (horse) | D | (Punya Sahama − Sun) + X cusp |

  Special notes (pp. 132–133): the Moon→Ascendant arc is counted clockwise, and since the Ascendant is one
  constituent, no Saikatham is needed. The book labels this note "Item 16 (Raja Sahama)", but in the table
  item 16 is **Roga** (Asc − Moon) and Raja is item 10 (OQ-14). **Mritha**: add a sign if Shani is not
  between the Moon and the 8th cusp. **Jaladva**: arc from Shani to 15° Kataka; add a sign if the Lagna is
  not in it. **Ashva**: arc from the Sun to the Punya Sahama; add a sign if the 10th cusp is not in it.
  Night form of Ashva = (Sun − Punya) + X cusp.
- **NTP2-632** · **Sahama timing:** a Sahama's effect comes in the Dasha of its **Sthoola lord** (lord of its
  sign) or **Sookshma lord** (lord of its star). Tajaka Neelakanti's timing "all failed". · (NTP-2, PDF
  p. 130; p. 138) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-633** · **Sahama judgement:** judge in the **birth chart first**; "unless a Sahama is good at birth
  it does not become good in any year". Good if it falls in a good house from the Lagna and its Sthoola and
  Sookshma lords are well placed; bad if badly placed; mixed if mixed. · (NTP-2, PDF p. 130) ·
  VERIFIED-ON-PDF · COMPUTABLE. (This makes natal Sahamas usable in the natal app.)
- **NTP2-634** · **Shodasha (16) Tajaka yogas** (Ithasala/"Muthusila", Isarapha, etc.): Iyer finds them more
  useful in horary and **does not deal with them**. · (NTP-2, PDF pp. 133–134) · VERIFIED-ON-PDF (p. 134).

---

## 7. Daily and hourly reading, Ch. VII

- **NTP2-701** · **Day chart:** cast a Dasha chart for the day (no Lagna), treating the **day's Moon-star
  lord as the Dasha lord**, with Starters and Rulers as in Ch. II. Note planetary changes during the day.
  Find the **day's Yoga and Avayoga planets** and the day's **Zero-Rasis**. Then judge the **Birth Yogi**
  in the day chart from its Starter and Ruler, as for a Bhukti lord: "the result indicates the Day's
  value". **Males: Rulers matter more; females: Starters.** · (NTP-2, PDF pp. 140–141; p. 142 rule 11) ·
  VERIFIED-ON-PDF (p. 141) · COMPUTABLE.
- **NTP2-702** · Striking points 1–8 (p. 141–142, VERIFIED-ON-PDF, COMPUTABLE):
  1. The day's Yogi is the **Ruler of the Birth Yogi** → good day.
  2. The day's Yogi is a **group planet** of that Ruler → good.
  3. The day's **Avayogi** is the Ruler (or its group planet) → bad day, **except when the Birth Yogi is a
     negative planet**: then excellent.
  4. If that Ruler or the day's Yoga planet falls in a **Zero-Rasi, a negative sign, or is set**, good is
     nullified and bad is submerged.
  5. If the Ruler belongs to a group different from both the day's Yogi and Avayogi → normal, per its birth
     traits.
  6. The Birth Yogi or its Ruler transiting the **star of the day's Yoga lord in a good natal Bhava** → good
     day; the star of the day's Avayogi in a bad Bhava → bad.
  7. The same for the day's Yogi transiting the Birth Yogi's star in a good Bhava.
  8. The **natal Bhava** (from the birth Lagna) in which the day's Yoga point and Yoga lord transit is the
     Bhava whose effect is felt that day.
- **NTP2-703** (point 9) · If the **Birth Yogi is a negative planet at birth, or is Rahu or Ketu**: crossing
  the day's **Yogi** → yoga after rubbing; crossing the day's **Avayogi** as Ruler → unexpected brilliant
  results (Vipareetha Raja Yoga), **except when the day's Avayogi is the Birth Yogi's enemy** (then evil
  prevails; example p. 144: Rahu's enemy Shukra). · (NTP-2, PDF p. 142; pp. 143–144) · VERIFIED-ON-PDF ·
  COMPUTABLE.
- **NTP2-704** (point 10) · Reading other planets the same way did not satisfy Iyer; he **confines day
  reading to the Birth Yogi**. · (NTP-2, PDF p. 142) · VERIFIED-ON-PDF.
- **NTP2-705** · **Hour of the event:** in the **hora** of (1) the day's Yoga or Avayoga planet (as the
  case is), (2) the Ruler of the Birth Yogi, or (3) their group planets. If Rahu is the indicator →
  **Rahu Kalam**. Rahu ≈ Shani, Ketu ≈ Kuja (kith). Example: marriage in Shani hora because the indicators
  were Rahu and Shani. · (NTP-2, PDF p. 142; p. 143) · VERIFIED-ON-PDF · COMPUTABLE (hora sequence from
  NTP-1).

---

## 8. Misconceptions Iyer rejects or redefines (the app must not contradict him silently)

- **NTP2-801** · **Rahu Kalam timing.** The fixed table (Mon 7:30–9:00, Tue 15:00–16:30, Wed 12:00–13:30,
  Thu 13:30–15:00, Fri 10:30–12:00, Sat 9:00–10:30, Sun 16:30–18:00; i.e. parts 2, 7, 5, 6, 4, 3, 8 of the
  day) assumes sunrise 6:00 and sunset 18:00. **Correct method: divide the actual sunrise-to-sunset span of
  the place into 8 equal parts and take the part for the weekday.** · (NTP-2, PDF pp. 144–145) ·
  VERIFIED-ON-PDF (p. 144) · COMPUTABLE.
- **NTP2-802** · **Rahu Kalam is not bad for everyone.** No weekday, thithi, star or period (Rahu Kalam,
  Gulika Kalam) is good or bad in general; that applies to world events, not individuals. **If Rahu is well
  placed and a yogakaraka at birth and its Dasha is running, good events happen precisely in Rahu Kalam.**
  It is bad only when Rahu is badly placed at birth. The same applies to every planet's hora. · (NTP-2,
  PDF pp. 145–146) · CLEAR · COMPUTABLE. *App:* if Rahu Kalam is shown, add a personal note per Rahu's natal
  status.
- **NTP2-803** · **New Moon / Full Moon days.** A New Moon (Sun–Moon conjunction) is the **best** day for a
  native whose Sun and Moon are yogakarakas, who runs their Dashas, when it falls in a good Bhava. A Full
  Moon can be bad if either luminary is badly placed at birth (they are in opposition that day). Judge from
  the birth chart, never by blanket rule. · (NTP-2, PDF p. 146) · VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-806** · **Kaalasarpa Dosha: Iyer's strict definition.** "Hemmed between Rahu and Ketu in any
  order" is wrong. Rahu (cobra) carries poison in the mouth, Ketu (scorpion) in the tail. Both move
  anticlockwise, so only planets **between Rahu's mouth and Ketu's tail** are hurt: the Dosha exists **only
  if all planets lie from Ketu to Rahu in clockwise order**, not in the other half. A planet sharing a sign
  with Rahu or Ketu counts only if **by degree** it falls inside that arc. Example (p. 147): all planets lay
  in the other half, and Guru was ahead of Ketu by degree in Ketu's own sign → no Dosha. · (NTP-2, PDF
  pp. 146–147) · VERIFIED-ON-PDF · COMPUTABLE.
  - **Direction, as implemented (my reading, checked on the p. 147 example chart):** in Iyer's
    South-Indian chart, clockwise = increasing longitude. So the Dosha exists iff every one of Sun…Shani has
    longitude strictly inside the arc going **forward (zodiacally) from Ketu to Rahu**. The p. 147 chart
    (Rahu in Mithuna, Ketu with Guru in Dhanus, all others in Kataka–Dhanus) is the opposite half → no
    Dosha, as Iyer says.
  - **Even when present it is not always bad:** effects come **only in the Dasha of Rahu, of Ketu, or of a
    planet in their stars**, and **no harm if Rahu and Ketu are yogaic and well placed at birth**. "Unless
    all these conditions are satisfied you should not pronounce its bad effects." · (NTP-2, PDF p. 147) ·
    VERIFIED-ON-PDF · COMPUTABLE.
- **NTP2-807** · **Kuja (Angaraka) Dosha rejected as a rule.** Kuja in 1, 2, 4, 7, 8, 12 from the Lagna,
  Moon or Shukra is "supposed" to cause widowhood. Iyer calls matching dosha with dosha illogical (by that
  logic both partners die). If the fear is real, **check the partner's longevity, not a matching dosha**.
  Kuja's real effect depends on what he owns and his yogic status (for Simha Lagna Kuja in the 4th is
  yogakaraka): "there is **Kuja Yoga and not Kuja Dosha**". **If Kuja is the Birth Yogi he always does good
  wherever he is.** · (NTP-2, PDF pp. 147–148) · VERIFIED-ON-PDF (p. 147) / CLEAR (p. 148) · COMPUTABLE
  (the app may detect the traditional placement but must label it per Iyer).
- **NTP2-808** · **Kalachakra Dasha** is not a full reading system. Use it only to time **changes** at its
  jumps (Mandooka/frog, Ashwa/horse, Simhavalokana at the ends of Kataka, Vrischika and Meena). Jumps are
  not always bad: good if the destination sign is a good Bhava, otherwise bad. Udu Dasha remains primary.
  · (NTP-2, PDF p. 148) · CLEAR · COMPUTABLE (low priority).
- **NTP2-809** · **Nakshatra Dosha rejected.** Births in Moola, Rohini, Aslesha etc. do not harm as a whole
  star (not even by pada). Any affliction lies in the "minutest division". Judge the Bhava and its karaka
  first, then add the star's effect. Example: Rohini birth harms the maternal uncle only if the 6th Bhava
  and Budha (karaka) are badly placed. · (NTP-2, PDF pp. 148–149) · CLEAR · COMPUTABLE (the app should not
  emit star-dosha warnings on the star alone).
- **NTP2-810** · **Marriage matching: kootam marks are "very very secondary".** They are a last resort
  where no astrologer is available. Iyer checks only the Ayur, Nadi and Rajju kootams at the very
  end ("Ayur Kootam, Nadi Kootam and Rajju Kootam"). · (NTP-2, PDF pp. 149, 151) · VERIFIED-ON-PDF (p. 151)
  · COMPUTABLE.
- **NTP2-811** · **Single-chart survey (destiny of the tie from one chart):** (a) Rasi/Graha maitram:
  lords of the 1st and 7th mutually 6/8/12 → they differ, and destiny brings such a partner anyway. Even
  mutual enemies live together if conjunct or in mutual aspect. If the 7th lord is the enemy of the Lagna
  lord, the partner is hostile; if not reciprocated, only the native suffers. One-way aspect = one-sided
  affinity; the stronger rules. (b) Yoni → 7th house. (c) Stree Deergham → Shukra and the 8th house.
  (d) Gana → compare the gunas of the 1st and 7th lords. (e) Other kootams → 4th and 7th Bhavas. (f) **7th
  lord = Birth Yogi, or in the Birth Yogi's star, or with the Birth Yogi → general happiness and
  prosperity; vice versa.** (g) 7th lord aspects the Lagna or joins the Lagna lord → amicability.
  (h) Finally judge from the Dasha lords in the Navamsha chart. · (NTP-2, PDF pp. 150–151) · VERIFIED-ON-PDF
  (p. 151) / CLEAR (p. 150, OCR checked) · COMPUTABLE.
- **NTP2-812** · **Mutual verification of two charts:** (a) the Lagna lords of both, even if enemies, joined
  or in aspect in either chart → they live together; (b) the **7th lord (or its cuspal star lord) is the
  other's Birth Yogi, or in the other's Birth Yogi's star → happy match**; (c) one's **Lagna in the other's
  Yoga star → yogaic**; (d) the two Lagnas mutually in good positions **other than 6/8/12 → good**; (e) the
  other's **Birth Yogi aspects the native's Lagna → good**. · (NTP-2, PDF p. 151) · VERIFIED-ON-PDF ·
  COMPUTABLE.
- **NTP2-813** · **Muhurtham: individual, not general.** Every day has auspicious moments. Cast the moment
  chart: (a) the current natal Dasha lord (from the birth Lagna) and the muhurtha's Dasha lord (from the
  moment Lagna) in happy positions, ideally from both Lagnas; the muhurtha's Bhukti lord happy from the
  moment Lagna and from its Dasha lord. (b) The functional and natural karaka of the matter happy from both
  Lagnas (at least the muhurtha Lagna). (c) The moment chart's current and succeeding Dasha lords well
  placed; if the current is good and the next bad, the matter holds only during the current Dasha.
  (d) Relate the muhurtha Lagna and its Dasha lord to the moment's Yoga and Avayoga planets. (e) Check the
  moment Lagna lord's placement. · (NTP-2, PDF pp. 152–153) · VERIFIED-ON-PDF (p. 152) · COMPUTABLE.

---

## 9. Appendix 2: definitions worth keeping

- **NTP2-901** · Thithi = Moon − Sun ("subtraction"); Yoga = Sun + Moon ("addition"). · (NTP-2, PDF p. 180)
  · CLEAR · COMPUTABLE.
- **NTP2-902** · "Cusp" here means a ±1° zone at a **sign** boundary (Appendix 2 glossary, likely the
  editor's). Do not confuse it with Iyer's Bhava-cusp usage in Ch. V. · (NTP-2, PDF p. 180) · CLEAR ·
  UNCERTAIN (authorship).
- **NTP2-903** · Houses are numbered counter-clockwise (in the glossary's chart convention; contrast
  Iyer's South-Indian "clockwise" usage in NTP2-806 and NTP2-630). · (NTP-2, PDF p. 179) · CLEAR ·
  UNCERTAIN (convention mismatch with the body text, OQ-15).

**Test fixtures (no personal data copied here).** Appendix 1 (PDF pp. 158–177) prints, for 40 charts:
thithi, weekday, star, birth Yoga **with its Yoga star**, Birth Yogi, Avayogi, Duplicate Yogi, Zero Rasis,
Dasha balance, longitudes, and D-chart signs. I checked the Yogi = lord of the Yoga star and Avayogi =
enemy map (NTP2-006) on every chart printing both. Chart 1's Yoga point (17°49′ Kumbha) and Chart 2's
(15°48′ Mesha) both equal Sun + Moon + 93°20′ (pp. 158–159). The Chart 1 D-chart table (p. 159) is a ready
regression oracle for NTP2-110…129.

---

## 10. Open questions / pages needing review

- **OQ-1** · Positive/negative planet rules (the "two negatives make a positive" pattern in NTP2-007/008) are
  defined in Ch. I (PDF pp. 1–22). Confirm against the lead's notes before coding.
- **OQ-2** · The yoga-point constant (93°20′) is inferred from Appendix Charts 1 and 2 (pp. 158–159); the
  rule itself is in Ch. I / NTP-1. Confirm there.
- **OQ-3** · **D-30, Appendix Chart 1 Kuja (p. 159):** the book puts retrograde Kuja at 25°04′ Dhanus in
  sign 3 (Budha's odd sign = the 18–25° part), but by Iyer's own rule 25°04′ is in Shukra's part → Thula
  (7). Either the true longitude was < 25° or the book erred. Review p. 159.
- **OQ-4** · **D-40 table misprints (p. 55):** rows 2 and 6 read 1-50 and 4-50; uniform ¾° parts give 1-30
  and 4-30. Iyer's own Chart 1 D-40 (p. 159) used the **4-50** boundary (Sun and Shani at 4°34′ placed in
  part 6, not 7). The D-16 row 12 "22-20" should be 22-30 by the uniform 1⅞° span. Decide whether to follow
  the uniform rule (recommended, mathematically consistent) or the printed table. Review p. 55 and p. 159.
- **OQ-5** · **D-16 even-sign text (p. 52)** says "3rd amsha falls in 3rd from the sign". The ready-made
  table (p. 157) and the arithmetic require amsha 3 → **2nd** sign (amsha 2 → 3rd, amsha 1 → 4th). The
  table is followed in NTP2-122.
- **OQ-6** · **Shani exception (p. 57 vs p. 60):** p. 57 says "Shani though in 8 does not kill … holds good
  only in D-8 chart when Shani is in D-8-Lagna"; p. 60 says "the exception of Shani in 1 in D-8". Is the
  exception "Shani in the 8th of D-8 is harmless" or "Shani in the D-8 Lagna is harmless"? p. 77 uses "Shani
  in 8 [of D-5] does not kill". Needs the lead's or another reader's judgement.
- **OQ-7** · **Amsha names** for D-16 (Brahma/Vishnu/Iswara/Sun are given) and D-60 (names "cited", but not
  listed in NTP-2) are needed for NTP2-188. Source them from NTP-1 or classics before use.
- **OQ-8** · **Graha Samayam (p. 102):** the list of 27 states is in Part I. What a remainder of 0 means (27th
  or none) is not stated.
- **OQ-9** · **Sade-Sati exceptions** are promised "later" (p. 105) but I did not find them in pp. 105–182.
- **OQ-10** · **Death/maraka rules** (NTP2-153, 168, 182, 183, 406, 430, 431) are stated as predictions.
  Product decision: show only as "strain on longevity/relative portfolio", or omit.
- **OQ-11** · **"Trikona stars"** of the three Math-D-9 stars in transit (p. 107): presumably the other two
  stars of the same lord (±9 stars). Not defined. Pada-level or star-level?
- **OQ-12** · **Fast/slow/stationary** transit thresholds (p. 108) are not given.
- **OQ-13** · **Year lord (pp. 135–136):** Iyer computes Kuja as the Tajaka year lord, then "prefers" Shani
  (Varahamihira aspect plus higher Harsha bala). It is unclear whether Harsha bala is a tie-breaker in
  general.
- **OQ-14** · **Sahama notes (p. 132):** the note "Item 16 (Raja Sahama)" fits the table's item 16 **Roga**,
  not Raja (item 10). Also Yasha, Bala and Deha share one printed formula, and Guru and Vidya share
  another, and Raja and Thatha share (Shani − Sun) + Asc. These may be printing duplications. **Do not
  correct them from other books without the user's decision.** Review pp. 131–132.
- **OQ-15** · **Direction words:** "clockwise" (pp. 129, 133, 146–147) is read as zodiacal order (South-Indian
  chart), and this fits the p. 147 Kaalasarpa example. Appendix 2 (p. 179) says houses run counter-clockwise
  (North-Indian/Western drawing). The engine should use longitude arithmetic, not the word.
- **OQ-16** · **Rule (D) (p. 88):** Iyer reports the belief "yoga in own Bhukti ⇒ rest of Dasha bad" and gives
  the exception. He does not say whether he endorses the belief otherwise.
- **OQ-17** · **Mutual relation (d) (p. 86)**, "being situated in any of the star padas of major Lord in
  mathematical Navamsha Chart", is operationalised from examples (NTP2-410). An exact reading needs the
  lead's agreement.
- **OQ-18** · **D-45 (p. 54)** is told to follow "Division-16", but the rule given (Mesha/Simha/Dhanus for
  movable/fixed/dual) is the **BPHS D-16** that Iyer rejected for D-16. No worked D-45 example exists to
  confirm.
- **OQ-19** · **Positive/negative/mixed classification on p. 41** carries an editor's note "Further research
  is needed". Treat NTP2-009 as provisional.
- **Pages read only as text, not as images,** that hold rules here: 42–45, 47, 64–79, 80–85, 92, 96–97, 101,
  103, 106, 109–118, 123–128, 133, 137–140, 143, 145, 148–150, 153, 160–182. The text was clean for the
  rules taken (OCR cross-checked on pp. 47, 111, 127, 150). Opening pp. 106 (Bhava-range example numbers),
  109 (step 11 continuation) and 148 (Kuja-dosha end and Kalachakra) would raise those to VERIFIED.

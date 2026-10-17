# NTP-3 — rule catalogue (H.R. Seshadri Iyer, *New Techniques of Prediction*, Part III)

Source: `references/NTP/ntp-3/` (40 PDF pages; this is the Chistabo 2013 re-typeset edition).
Citation format: (NTP-3, PDF p. N), where N is the one-based **source PDF page** given in the
`=== NTP-3 | SOURCE PDF PAGE NNNN ===` delimiters. This is not the printed page number. The
printed folio is roughly the PDF page minus 2.

Reading done: all 40 pages in `text/`, plus all 40 pages in `ocr/` as a second reading. I opened
these page images from `pdf-sections/`: pp. 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 19, 21, 24, 25, 26,
28, 34, 38, 39, 40. A rule marked **VERIFIED-ON-PDF** was read from the page image. **CLEAR** means
the text and OCR agree word for word on the substance, but I did not open the image.

Confidence labels: VERIFIED-ON-PDF / CLEAR / UNCERTAIN (reason given).
Computability labels: COMPUTABLE = can be derived from a chart (planet longitudes, Lagna).
NOT-COMPUTABLE = needs judgement or data a chart does not contain.

---

## 0. Headline: Yogi / Avayogi / Yoga point — NOT IN NTP-3

I searched both transcriptions of all 40 pages and read every page. **NTP-3 contains no
mention of** Yoga point, Yogi, Avayogi, Duplicate Yogi, positive/negative planets, or Yogi
planets forming sets or groups of three. NTP-3 has **no rule of any kind** for forming Yogi
sets.

Three things in NTP-3 could be confused with that theory. None of them is Yogi theory:

1. **"Duplicate" means node-proxy, not Duplicate Yogi.** Iyer calls Sani the duplicate of Rahu,
   and Mangal the duplicate of Ketu ("Mangal the duplicate of Ketu", "his duplicate Sani")
   (NTP-3, PDF p. 26; p. 28). See NTP3-011. Do not wire this into a Duplicate-Yogi feature.
2. **Groups of three nakshatras.** The nakshatra-lord table lists three nakshatras per lord
   (Aswini/Magha/Moola → Ke, etc.) (NTP-3, PDF p. 7). That is the ordinary Vimshottari
   (Udu Dasha) assignment, not a Yogi set.
3. **Three letters of a rasi.** The Drekkana race method uses the 1st, 5th and 9th "letters"
   (padas) of a rasi (NTP-3, PDF p. 32). "Rule-of-Three" on p. 6 is plain arithmetic
   (27 nakshatras / 12 rasis).

Pointer only, not used here: Yogi/Avayogi terms occur in NTP-1 (heaviest in PDF pp. 21–30) and
throughout NTP-2 (heaviest in PDF pp. 1–40, 61–80, 91–120, 141–180). That theory must be
catalogued from those volumes.

---

## 1. Overview — chapters and PDF page ranges

| PDF pp. | Content |
|---|---|
| 1 | Cover (title, "Vol. III", "H.R. Seshadri Iyer" per OCR) |
| 2 | Contents. It lists the "Alphabets of Nakshatra Padas Table" and the "Significators (indicators) Table". In this edition they appear on pp. 9 and 12. |
| 3–5 | **Ch. 1 "New Techniques of Prediction Part III"**: the three bases of race astrology (astrology, alphabetology, numerology); English glossary; Lagna by LMT from Lahiri tables; planets by IST; Mean Rahu; worked chart for 04.10.1970 14:30 IST Hyderabad |
| 6–8 | **Ch. 2 "Nakshatra positions of Grahas"**: nakshatra distribution and spans (p. 6); Nakshatra Lord table, Aspects, Rasi Lords (p. 7); Drekkana and Navamsa ready-reckoners (p. 8); Numerology (p. 8) |
| 8–10 | **Ch. 3 "Akshara Shastra (Alphabetology)"**: alphabet of nakshatra padas (table p. 9); Abhijit note and peculiarities of name-sound reading (p. 10) |
| 10–12 | **Ch. 4 "Theories of spotting the Winners"**: card number and name; Varga letter-groups (p. 10); Theory A (Deha), Theory B (Jeeva), Theory C (Nadi significator table) (p. 11–12); Theory D (Lagna lord) (p. 12) |
| 12–13 | **Ch. 5 "Order of preference of tests A to D"** (p. 12); warning about Dasha-Bhukti and luck (p. 13) |
| 13–30 | **Illustrations**: Hyderabad 04.10.1970 (pp. 13–17; p. 17 notes that original pp. 50–51 are missing); Poona 04.10.1970 (pp. 18–20); Poona 18.10.1970 (pp. 21–25); Calcutta 30.09.1970 (pp. 25–28); Madras 25.10.1970 (pp. 28–30) |
| 30–37 | **Ch. 6 "Winner by Navamsa"**: Navamsa method (pp. 30–32); Drekkana method (pp. 32–34); dead-cert illustrations (pp. 34–36); tie-break by hemisphere (p. 36); plate/cup name vs horse name (p. 37) |
| 38–39 | **Ch. 7 "Dead certs"**: Rules 1–7, including the "day's Ududasa Lord" (p. 38); "Latest research": Rahu/Ketu aspects 3/7/11 and node "over-powering strength" (p. 38); illustration (p. 39) |
| 40 | Original scan of the Devanagari pada letters (editor's appendix) |

Editorial layer: the 2013 editor ("Chistabo") added the Devanagari and IAST columns (footnote,
p. 9). The editor also added bracketed glosses ("[Vimshottari]", "[co-Lord; more common info is
Vrischika]", "[By authors calculation Chandr is in 7 Tula.]") and the software chart images
("From SJS 6", "Graha Nakshatras + Pushkar Navamshas"). These are **not Iyer's text**.

---

## 2. Rules that apply to natal charts or define Iyer's general method

NTP-3 is a race book. **None of its rules is stated for birth charts.** The items below are the
definitions, conventions and planet-behaviour rules that Iyer states in general terms ("In the
case of a Graha or horse…", "When Rahu and Ketu are with other Grahas…"). The app could reuse
them. Each entry says whether natal use is explicit in NTP-3 or only implied.

### 2.1 Zodiac and position conventions

- **NTP3-001** · Positions are sidereal ("Nirayana"). A Sayana ephemeris (e.g. Raphael) must be
  converted "by subtracting the correct Ayanamsa of the year as followed by Lahiri". On p. 5 the
  wording is the "correct Ayanamsa formulated by Government of India".
  Conditions: always. Effect: Lahiri sidereal positions are used.
  (NTP-3, PDF p. 3; p. 5) · VERIFIED-ON-PDF (p. 5) · COMPUTABLE.

- **NTP3-002** · Use the **Mean** node: "What we want is Mean Rahu position". Iyer takes Rahu's
  motion as always retrograde and Ketu as exactly 180° from Rahu.
  Effect: the app should use mean Rahu and Ketu, not the true nodes.
  (NTP-3, PDF p. 4; p. 5) · CLEAR (p. 4 text = OCR); p. 5 VERIFIED-ON-PDF · COMPUTABLE.

- **NTP3-003** · Nakshatra geometry. 27 nakshatras run from Aswini to Revati, starting at 0°
  Mesha. Each has 4 padas, so 108 padas in all. A pada is 3°20' and a nakshatra 13°20'. Each
  rasi holds 2¼ nakshatras, i.e. 9 padas. Span table: §3.1.
  (NTP-3, PDF p. 6) · VERIFIED-ON-PDF · COMPUTABLE.

- **NTP3-004** · A graha's **Nakshatra Lord** is the ruler of the nakshatra it occupies, under
  "Udu Dasha", i.e. the Vimshottari order Ke, Sk, Sy, Ch, Ma, Ra, Gu, Sa, Bu, repeated three
  times. Table: §3.2. Iyer: the "crux" of judgement "depends mainly on Nakshatra Lords" (p. 6).
  (NTP-3, PDF p. 7; p. 6) · VERIFIED-ON-PDF · COMPUTABLE.

- **NTP3-005** · The planets keep the same positions worldwide at a given instant; only Lagna
  depends on place. The **nakshatra pada** of each graha is the datum that matters
  ("noting Nakshatra Padas of each Graha as that is of importance to us").
  (NTP-3, PDF p. 4) · CLEAR · COMPUTABLE.

### 2.2 Deha / Jeeva (Iyer's two-level nakshatra-lord chain)

- **NTP3-006** · **Definition.** "In the case of a Graha or horse its Nakshatra Lord is Deha
  and Nakshatra Lord of this Deha is Jeeva." Deha is the "outer body"; Jeeva is the "internal
  Soul", "more important than the outer body".
  Conditions: any graha. Effect, for planet X:
  - Deha(X) = the nakshatra lord of X.
  - Jeeva(X) = the nakshatra lord of Deha(X), i.e. the star lord of the star lord.

  Natal use: the definition is stated for any graha, but NTP-3 applies it only to race horses.
  (NTP-3, PDF p. 11) · VERIFIED-ON-PDF · COMPUTABLE.

- **NTP3-007** · **Jeeva outranks Deha.** "Jeeva works more powerfully than Deha" (p. 11). "In
  our experience Theory B is more powerful than A … Jeeva is more valuable than Deha" (p. 14).
  Effect: when the Deha-level and Jeeva-level indications disagree, prefer the Jeeva level
  (race rule: "If they differ prefer the latter one", p. 12).
  (NTP-3, PDF p. 11; p. 12; p. 14) · VERIFIED-ON-PDF (pp. 11, 12); p. 14 CLEAR · COMPUTABLE
  (the ranking); NOT-COMPUTABLE as a natal interpretation (NTP-3 gives none).

- **NTP3-008** · **"Sookshma Lord" is a synonym for Jeeva.** In the Theory B (Jeeva) slot, Iyer
  writes "Chandr Sookshma Lord does not act" (p. 21). He also writes "Guru Deha Lord and again
  Guru Sookshma Lord" for a horse in Purvabhadra (Guru's star), with Guru on Vishakha
  (p. 34 chart: Gu 1°54' in sign 8 = Vishakha 4).
  (NTP-3, PDF p. 21; p. 34) · UNCERTAIN (no explicit definition; inferred from usage, VERIFIED-ON-PDF
  for the wording) · COMPUTABLE if adopted.

- **NTP3-009** · **"Sthoola Lord"** occurs once: Ardra 4 in Mithuna, "Its Sthoola Lord Budh".
  Budh is the rasi lord of Mithuna; Ardra's nakshatra lord is Rahu. The term probably means the
  rasi (sign) lord, as against the nakshatra (sookshma) level.
  (NTP-3, PDF p. 34) · UNCERTAIN (single occurrence, no definition) · COMPUTABLE if adopted.

### 2.3 Aspects

- **NTP3-010** · Every graha aspects the 7th rasi from its own. Special aspects:
  - Mangal: 4th and 8th.
  - Guru: 5th and 9th.
  - Sani, Rahu and Ketu: 3rd and 10th.

  Aspects are counted by whole rasi ("aspect 7th Rasi from the one occupied"). Iyer's example:
  Mangal aspects Mesha "with 8th aspect" (p. 30).
  (NTP-3, PDF p. 7) · VERIFIED-ON-PDF · COMPUTABLE.

- **NTP3-011** · **Rahu/Ketu aspects revised ("Latest research").** "Nadi principles stress on
  3rd, 7th and 11th aspect". Latest observation confirms this, "So we prefer it" over 3/7/10.
  Optionally use 3rd, 7th, 10th and 11th together. Sani keeps 3/10; the revision covers only the
  nodes. The p. 39 illustration uses Ketu's 11th aspect and Ketu's 3rd aspect.
  Effect: Iyer's final position is **Rahu/Ketu → 3, 7, 11** (with 10 optional). This overrides
  NTP3-010 for the nodes.
  (NTP-3, PDF p. 38; p. 39) · VERIFIED-ON-PDF · COMPUTABLE (configurable).

- **NTP3-012** · **Aspect includes conjunction** "and not vice versa", and the "conjunctive
  effect is more powerful than aspective effect". The race rule also says "More certain when
  Nakshatra Lord conjoins than aspects" (same page).
  Effect: every "X aspects Y" test also fires when X occupies Y's rasi; conjunction weighs more.
  (NTP-3, PDF p. 11) · VERIFIED-ON-PDF · COMPUTABLE.

### 2.4 Rasi lords and node proxies

- **NTP3-013** · Rasi lords:
  - Mesha & Vrischika → Mangal; Vrishabha & Tula → Sukr; Mithuna & Kanya → Budh.
  - Dhanus & Meena → Guru; Makara & Kumbha → Sani; Karkataka → Chandr; Simha → Surya.
  - **Rahu is co-lord of Kumbha. Ketu is co-lord of Mesha.** The bracket "[co-Lord; more common
    info is Vrischika]" is in the editor's style.

  In use: for Kumbha Lagna, Iyer names **both** Sani and Rahu as "Lord of Lagna" ("the other
  Lord Rahu", "Rahu Lord of Lagna": pp. 16, 17, 20, 22, 23, 24, 27, 28). For Mesha Lagna he names
  only Mangal (p. 35).
  (NTP-3, PDF p. 7; usage pp. 16–28, 35) · VERIFIED-ON-PDF for the table (p. 7); Rahu-Kumbha
  co-lordship CLEAR from usage; Ketu-Mesha co-lordship UNCERTAIN (never used in examples;
  editor's note disputes it) · COMPUTABLE.

- **NTP3-014** · **Rahu is like Sani; Ketu is like Mangal ("duplicate").** "Please remember
  always that Rahu is like Sani and Ketu like Mangal" (p. 8); repeated on p. 20 and p. 30. The
  transfer works in both directions:
  - Sani's aspect is credited to Rahu ("it gets transferred to Rahu by reason of Rahu like
    Sani", p. 24; also p. 23).
  - Mangal's action is credited to Ketu ("Ketu being like Mangal the good of Ketu is seen even
    here", p. 19; also pp. 24, 26).
  - Wording: "Mangal the duplicate of Ketu" (p. 26); "his duplicate Sani" (of Rahu, p. 28).

  Effect: when testing whether Rahu (or Ketu) aspects or occupies a point, Sani's (or Mangal's)
  aspect or occupation counts as the node's, and vice versa.
  (NTP-3, PDF p. 8; p. 19; p. 20; p. 23; p. 24; p. 26; p. 28; p. 30) · VERIFIED-ON-PDF
  (pp. 8, 19, 24, 26, 28) · COMPUTABLE.

- **NTP3-015** · **Rahu/Ketu "over-powering strength".** "When Rahu and Ketu are with other
  Grahas or aspect other Grahas it is only the power of Rahu and Ketu that predominates."
  Illustration: Ketu aspects Mangal (the lord of a rival horse) by 3rd aspect, so Ketu's horse
  beats Mangal's horse, which had met more tests (p. 39).
  Conditions: a node conjoins, or aspects (3/7/11 per NTP3-011), planet X. Effect: the node's
  signification dominates X's. Natal use: stated as a general planetary rule, applied only to
  races.
  (NTP-3, PDF p. 38; p. 39) · VERIFIED-ON-PDF · COMPUTABLE (as a flag).

### 2.5 Dasha and timing statements

- **NTP3-016** · **Running Dasha-Bhukti conditions success.** The method "will certainly work
  well with one who is passing good period as seen from then running Dasha Bhukti". For "the
  unlucky punter" something misleads him. See also "you must also be lucky at that time" (p. 35).
  Natal relevance: the native's own running Dasha/Bhukti decides whether correct judgements bear
  fruit for him. **NTP-3 gives no test for what makes a period "good".**
  (NTP-3, PDF p. 13; p. 35) · VERIFIED-ON-PDF (p. 13); p. 35 CLEAR · NOT-COMPUTABLE
  (no criterion given in NTP-3).

- **NTP3-017** · **The "day's Ududasa Lord" is the Moon's nakshatra lord at the moment.** Rule 7
  (a): "Nakshatra Lord of Chandr at the time of race, i.e. the day's Ududasa [Vimshottari]
  Lord." "[Vimshottari]" is an editor gloss. This lord is then a strong indicator:
  - (a) A horse whose Nakshatra Lord **or Rasi Lord** equals this lord is picked.
  - (b) It wins if this Dasa Lord sits in the card-number rasi from Lagna or horse, "more so if
    it also aspects Lagna".
  - (c) "Sometimes" it wins if the Dasa Lord is in, or aspects, the horse's rasi.

  General principle: the Dasa lord of any moment is the Moon's star lord, and things it rules or
  touches are favoured. NTP-3 does not apply this to birth charts. It agrees with the ordinary
  Vimshottari start lord, but that link is mine, not Iyer's.
  (NTP-3, PDF p. 38) · VERIFIED-ON-PDF · COMPUTABLE.

### 2.6 Planet natures, numbers and significators

- **NTP3-018** · **Malefic vs benefic.** "Malefics raising the horse pay high dividends while
  benefics low" (p. 15). Ketu is "the great malefic" (p. 22). In the race context: malefic
  agency goes with large, unexpected outcomes; benefic agency with small ones. No natal
  statement.
  (NTP-3, PDF p. 15; p. 22) · VERIFIED-ON-PDF (p. 15); p. 22 CLEAR · NOT-COMPUTABLE for natal use
  (magnitude only; no benefic/malefic list given beyond Ketu).

- **NTP3-019** · **Single-graha predominance.** "When a single Graha predominates in all tests
  that horse wins even when [only] one solid test is satisfied" (p. 15). Also "one single Graha
  Rahu predominates in all tests" (p. 16).
  General principle: one planet recurring across all of a factor's significator chains is
  decisive.
  (NTP-3, PDF p. 15; p. 16) · VERIFIED-ON-PDF (p. 15) · COMPUTABLE (count the recurrence of a
  graha across the Deha/Jeeva/significator/Lagna-lord chains).

- **NTP3-020** · **Numbers of the grahas ("western system").** Sy 1 & 4; Ch 2 & 7; Ma [Ke] 9;
  Bu 5; Gu 3; Sk 6; Sa [Ra] 8. Rahu's number is 8, Ketu's is 9. A two-digit number may be
  reduced: "12 is also 3 (1 + 2 = 3)" (p. 36). Natal use not stated.
  (NTP-3, PDF p. 8; p. 36) · VERIFIED-ON-PDF (p. 8); p. 36 CLEAR · COMPUTABLE.

- **NTP3-021** · **Significators (indicators) — the "Nadi table".** Each nakshatra lord has two
  fixed significators (§3.3). To use it, take the **nakshatra lords of the two significators**.
  Those lords are the active points; it is "more certain if the horse Nakshatra Lord is one of
  them". The table rests on a "definite principle" that Iyer was "ordained not to reveal".
  Iyer calls it "a very important test that none knows of". Natal use is not stated: the table
  is keyed by graha and could be applied to any planet's nakshatra lord, but NTP-3 does not do so.
  (NTP-3, PDF p. 11; p. 12) · VERIFIED-ON-PDF · COMPUTABLE (lookup + nakshatra lords).

### 2.7 Divisional charts, house counting, relations

- **NTP3-022** · **Navamsa and Drekkana** follow the standard ready-reckoner tables (§3.6).
  - Navamsa: movable signs start from themselves (Mesha → 1), fixed signs from the 9th
    (Vrishabha → 10), dual signs from the 5th (Mithuna → 7).
  - Drekkana: 1st, 5th and 9th from the sign.
  - Navamsa of a nakshatra pada, as used in the examples: Punarvasu 3 → Mithuna; Mrigashira 3 →
    Tula; Magha 1 → Mesha; Sravana 1 → Mesha; Sravana 3 → Mithuna; Rohini 2 → Vrishabha;
    Swati 2 → Makara; Anuradha 4 → Vrischika; Punarvasu 4 → Karkataka.
  (NTP-3, PDF p. 8; p. 31; p. 32) · VERIFIED-ON-PDF (p. 8); pp. 31–32 CLEAR · COMPUTABLE.

- **NTP3-023** · **House counting is inclusive and wraps past 12.** Count "as many Rasis as its
  card number, reckoning from Lagna Rasi or Rasi occupied". The 13th rasi from Lagna is "Lagna
  itself" (p. 22). The 14th from Meena is Mesha: "add another cycle of 12 Rasis" (p. 29).
  (NTP-3, PDF p. 11; p. 22; p. 29) · VERIFIED-ON-PDF (p. 11) · COMPUTABLE.

- **NTP3-024** · **Hemisphere preference (tie-break).** Among equal candidates, prefer the one
  in the visible hemisphere (7th–12th rasi from Lagna) over the invisible one (1st–6th). If all
  are in one hemisphere, prefer the one "nearer Lagna Rasi". Example: a horse in the 11th beats
  one in Lagna (p. 37). Natal use not stated.
  (NTP-3, PDF p. 36; p. 37) · CLEAR · COMPUTABLE.

- **NTP3-025** · **"Mutual relation" between two named things** (horse name vs plate name).
  A relation exists if any of these holds:
  - (01) The lord of A aspects B's rasi.
  - (02) The lord of B aspects A's rasi.
  - (03) The two lords aspect each other.
  - (04) The two lords are the same graha.

  "Lord" means the **nakshatra lord** of the name's pada; aspect includes conjunction. A general
  relational test; natal use not stated.
  (NTP-3, PDF p. 37) · CLEAR · COMPUTABLE.

- **NTP3-026** · **Lagna lord is the strongest single agent.** Of the tests, "Lord of Lagna
  aspecting both the horse Rasi and card No. Rasi … is most powerful" (Rule 2). Also, "Lord of
  Lagna aspecting both the horse Rasi and the card No. Rasi" is the one theory most winners
  answered (p. 34). Race context; general weighting.
  (NTP-3, PDF p. 38; p. 34) · VERIFIED-ON-PDF · COMPUTABLE (race only; natal analogue not
  stated).

### 2.8 Name alphabet (Nama Nakshatra)

- **NTP3-027** · **Name → nakshatra pada.** The first sound (Uchharana) of a name, not its
  spelling, gives the pada (table §3.4). "Episode" → 'A' = Krittika 4.
  - If both the initial and the stressed sound occur, take both.
  - With several syllables "take all … paying more value to the first". The second syllable is
    weaker: "first syllable is of greatest importance" (p. 19).
  - Ignore minor prefixes ('The', 'Mr.', 'No').

  Natal use not stated: NTP-3 applies it to horses, plates and cups only. It is relevant if the
  app ever maps a native's name to a pada.
  (NTP-3, PDF p. 10; p. 19; p. 25; p. 33) · VERIFIED-ON-PDF (pp. 10, 19, 25) · NOT-COMPUTABLE
  automatically (needs phonetic judgement); table lookup itself COMPUTABLE.

- **NTP3-028** · **Abhijit letters fold into Sravana.** "Letters of Abhijit Nakshatra are
  included under Sravana Nakshatra" (p. 10). In the examples, Sravana pada *n* carries both
  Abhijit letter *n* (Ju/Jay/Jo/Sha) and Sravana letter *n* (She/Shoe/Shay/Show):
  - 'She' = Sravana 1 (p. 32).
  - 'J' = Sravana 2 (p. 26); 'Jay' is the 5th letter of Makara, i.e. Sravana 2 (p. 32).
  - 'Jo' = Sravana 3 (p. 29).
  - 'Sha' = "Sravana [Abhijit 4]" (p. 21).

  (NTP-3, PDF p. 10; p. 21; p. 26; p. 29; p. 32) · p. 10 VERIFIED-ON-PDF; the per-pada mapping is
  UNCERTAIN (inferred from four examples, never stated) · COMPUTABLE.

- **NTP3-029** · **Varga letter-groups** (alternative alphabetology, table §3.5). Iyer gives it
  "only for the sake of knowledge"; it "ha[s] not given full satisfaction" and he does not use
  it.
  (NTP-3, PDF p. 10) · VERIFIED-ON-PDF · COMPUTABLE (lookup); low priority.

---

## 3. Verified table transcriptions

### 3.1 Nakshatra spans per rasi (NTP-3, PDF p. 6) — VERIFIED-ON-PDF

F = all 4 padas; (2/3/4) = those padas only.

| # | Rasi | Nakshatra (padas) | Span |
|---|---|---|---|
| 1 | Mes | Aswini (F) / Bharani (F) / Krittika (1) | 00-00–13-20 / 13-20–26-40 / 26-40–30-00 |
| 2 | Vrb | Krittika (2/3/4) / Rohini (F) / Mrigashira (1/2) | 00-00–10-00 / 10-00–23-20 / 23-20–30-00 |
| 3 | Mit | Mrigashira (3/4) / Ardra (F) / Punarvasu (1/2/3) | 00-00–06-40 / 06-40–20-00 / 20-00–30-00 |
| 4 | Kar | Punarvasu (4) / Pushya (F) / Aslesha (F) | 00-00–03-20 / 03-20–16-40 / 16-40–30-00 |
| 5 | Sim | Magha (F) / P. Phalguni (F) / U. Phalguni (1) | 00-00–13-20 / 13-20–26-40 / 26-40–30-00 |
| 6 | Kan | U. Phalguni (2/3/4) / Hasta (F) / Chitra (1/2) | 00-00–10-00 / 10-00–23-20 / 23-20–30-00 |
| 7 | Tul | Chitra (3/4) / Swati (F) / Vishaka (1/2/3) | 00-00–06-40 / 06-40–20-00 / 20-00–30-00 |
| 8 | Vrk | Vishaka (4) / Anuradha (F) / Jyesta (F) | 00-00–03-20 / 03-20–16-40 / 16-40–30-00 |
| 9 | Dha | Moola (F) / P. Ashada (F) / U. Ashada (1) | 00-00–13-20 / 13-20–26-40 / 26-40–30-00 |
| 10 | Mak | U. Ashada (2/3/4) / Sravana (F) / Dhanista (1/2) | 00-00–10-00 / 10-00–23-20 / 23-20–30-00 |
| 11 | Kum | Dhanista (3/4) / Shatabisha (F) / P. Bhadra (1/2/3) | 00-00–06-40 / 06-40–20-00 / 20-00–30-00 |
| 12 | Min | P. Bhadra (4) / U. Bhadra (F) / Revati (F) | 00-00–03-20 / 03-20–16-40 / 16-40–30-00 |

### 3.2 Nakshatra Lord (Udu Dasha) (NTP-3, PDF p. 7) — VERIFIED-ON-PDF

| Nakshatras | Lord |
|---|---|
| Aswini, Magha, Moola | Ke |
| Bharani, Purvaphalguni, Purvashadha | Sk |
| Krittika, Uttaraphalguni, Uttarashadha | Sy |
| Rohini, Hasta, Sravana | Ch |
| Mrigashira, Chitra, Dhanista | Ma |
| Ardra, Swati, Satabisha | Ra |
| Punarvasu, Vishaka, Purvabhadra | Gu |
| Pushya, Anuradha, Uttarabhadra | Sa |
| Aslesha, Jyesta, Revati | Bu |

Abbreviations used throughout NTP-3: Sy = Surya (Sun), Ch = Chandr (Moon), Ma = Mangal/Kuja
(Mars), Bu = Budh (Mercury), Gu = Guru (Jupiter), Sk = Sukr (Venus), Sa = Sani (Saturn),
Ra = Rahu, Ke = Ketu (glossary, PDF p. 3).

### 3.3 Significators (indicators) — "Nadi table" (NTP-3, PDF p. 12) — VERIFIED-ON-PDF

| # | If Nakshatra Lord (of horse) is | Then its 2 significators (indicators) are |
|---|---|---|
| 01 | Sy | Mangal – Guru |
| 02 | Ch | Chandr – Budh |
| 03 | Ma | Surya – Ketu |
| 04 | Bu | Guru – Budh |
| 05 | Gu | Ketu – Sani |
| 06 | Sk | Ketu – Sani |
| 07 | Sa | Surya – Mangal |
| 08 | Ra | Mangal – Surya |
| 09 | Ke | Sukr – Ketu |

Mode of use (p. 12): find the **nakshatra lords of the two significators**. If they (one or
both) aspect the card-number rasi counted from Lagna and from the horse's rasi, the horse wins;
"more certain if the horse Nakshatra Lord is one of them".
Note: the table is keyed by the horse's nakshatra lord, i.e. its **Deha**. All the illustrations
use it that way (e.g. "Indicators of Budh, Deha of this horse, are Guru and Budh", p. 13).
Some illustrations misquote the table; see §5.

### 3.4 Alphabets of Nakshatra Padas (NTP-3, PDF p. 9; original scan PDF p. 40) — VERIFIED-ON-PDF

Columns: the "Sound of Padas" columns (padas 1–4) are Iyer's English. The **Devanagari and
IAST columns are the editor's additions** (footnote, p. 9). Iyer's English writes the dental
t/d as "Th" (e.g. Visakha Thi/Thu = ति/तु; Purvabhadra Tha/The = द/दि) and the retroflex
ṭ/ḍ as "T"/"D".

| No. | Nakshatra | Lord | Pada 1 | Pada 2 | Pada 3 | Pada 4 | Devanagari (editor) | IAST (editor) |
|---|---|---|---|---|---|---|---|---|
| 01 | Aswini | Ke | Chu | Chay | Cho | Law | चु चे चो ल | cu ce co la |
| 02 | Bharani | Sk | Lee | Loo | Lay | Low | लि लु ले लो | li lu le lo |
| 03 | Krittika | Sy | Awe | E | Oo | A | आ इ उ ए | ā i u e |
| 04 | Rohini | Ch | O | Va | We | Vu | ओ व वि वु | o va vi vu |
| 05 | Mrigashira | Ma | Way | Woe | Ka | Ki | वे वो का कि | ve vo kā ki |
| 06 | Ardra | Ra | Ku | Gha | Gna | Chha | कु ग [ग्न]* छ | ku ga [gna] cha |
| 07 | Punarvasu | Gu | K | Ko | Ha | He | के को ह हि | ke ko ha hi |
| 08 | Pushya | Sa | Who | Hay | Ho | Da | हु हे हो ड | hu he ho ḍa |
| 09 | Aslesha | Bu | D | Do | Day | Doe | डि डु डे डो | ḍi ḍu ḍe ḍo |
| 10 | Magha | Ke | Ma | Me | Mu | May | म मि मु मे | ma mi mu me |
| 11 | Purvaphalguni | Sk | Mo | Ta | Ti | To | मो ट टि टु | mo ṭa ṭi ṭu |
| 12 | Uttaraphalguni | Sy | Tay | Toe | Pa | P | टे टो प पि | ṭe ṭo pa pi |
| 13 | Hasta | Ch | Pu | Sha | Na | Dha | पु ष ण ढ | pu pa (sic; Devanagari ष = ṣa) ṇa ḍha |
| 14 | Chitra | Ma | Pay | Po | Ra | Ri | पे पो र रि | pe po ra ri |
| 15 | Swati | Ra | Ru | Ray | Ro | Tha | रु रे रो त | ru re ro ta |
| 16 | Visakha | Gu | Thi | Thu | Thay | Tho | ति तु ते तो | ti tu te to |
| 17 | Anuradha | Sa | Na | Ni | Nu | Nay | न नि नु ने | na ni nu ne |
| 18 | Jyesta | Bu | No | Ya | Yi | You | नो य यि यु | no ya yi yu |
| 19 | Moola | Ke | Ye | Yo | Ba | B | ये यो ब बि | ye yo ba bi |
| 20 | Purvashadha | Sk | Bu | Ddha | Bha | Da | बु ध भ ड | bu dha bha ḍa |
| 21 | Uttarashadha | Sy | Bay | Bo | Ja | Ji | बे भो ज जि | be bho ja ji |
| 00 | Abhijit | Sy | Ju | Jay | Jo | Sha | जु जे जो श* | ju je jo śa |
| 22 | Sravana | Ch | She | Shoe | Shay | Show | शि शु शे शो | śi śu śe śo |
| 23 | Dhanista | Ma | Ga | Gi | Gu | Gay | ग गि गु गे | ga gi gu ge |
| 24 | Satabisha | Ra | Go | Sa | See | Sue | गो स सि सु | go sa si su |
| 25 | Purvabhadra | Gu | Say | So | Tha | The | से सो द दि | se so da di |
| 26 | Uttarabhadra | Sa | Thu | Kha | Jha | Thha | दु ख झ थ | du kha jha tha |
| 27 | Revati | Bu | They | Though | Cha | Chi | दे दो च चि | de do ca ci |

Footnote (editor, p. 9): "*This is closest match I could find (Sravana 4th Pada) … [Ardra 3rd
Pada] is missing from original pdf". On the original scan (p. 40), the Ardra row's 3rd slot is
blank apart from a stray mark.
Footnote on use (p. 10): Abhijit letters are counted under Sravana (NTP3-028).
"Letters" in the Drekkana method (§4) are these padas counted in zodiacal order inside a rasi,
9 per rasi. Example: the 5th letter of Makara is Sravana 2 = 'Jay' (p. 32).

### 3.5 Varga letter-groups (NTP-3, PDF p. 10) — VERIFIED-ON-PDF

| Group | Governed by |
|---|---|
| Vowels from AA to Aou | Sy |
| Kavarga (Ka to Gyna) | Ma |
| Chavarga (Cha to Engna) | Sk |
| Tavarga (Ta to NNa) [retroflex] | Bu |
| Thavarga (Tha to Na) [dental] | Gu |
| Pavarga (Pa to Ma) | Sa |
| Consonants from Ya to LLa | Ch |

(The bracketed retroflex/dental glosses are mine, from Iyer's spelling convention; the rest is
verbatim.) Iyer does not use this method.

### 3.6 Numerology, Drekkana and Navamsa ready-reckoners (NTP-3, PDF p. 8) — VERIFIED-ON-PDF

Numbers governed: Sy 1 & 4 · Ch 2 & 7 · Ma [Ke] 9 · Bu 5 · Gu 3 · Sk 6 · Sa [Ra] 8.

The column headers 1–12 are the rasi of the planet (1 = Mesha). Each cell is the rasi (from
Mesha) where the amsa falls.

Drekkana:

| Till | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 10-00 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
| 20-00 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 1 | 2 | 3 | 4 |
| 30-00 | 9 | 10 | 11 | 12 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |

Navamsa:

| Till | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 03-20 | 1 | 10 | 7 | 4 | 1 | 10 | 7 | 4 | 1 | 10 | 7 | 4 |
| 06-40 | 2 | 11 | 8 | 5 | 2 | 11 | 8 | 5 | 2 | 11 | 8 | 5 |
| 10-00 | 3 | 12 | 9 | 6 | 3 | 12 | 9 | 6 | 3 | 12 | 9 | 6 |
| 13-20 | 4 | 1 | 10 | 7 | 4 | 1 | 10 | 7 | 4 | 1 | 10 | 7 |
| 16-40 | 5 | 2 | 11 | 8 | 5 | 2 | 11 | 8 | 5 | 2 | 11 | 8 |
| 20-00 | 6 | 3 | 12 | 9 | 6 | 3 | 12 | 9 | 6 | 3 | 12 | 9 |
| 23-20 | 7 | 4 | 1 | 10 | 7 | 4 | 1 | 10 | 7 | 4 | 1 | 10 |
| 26-40 | 8 | 5 | 2 | 11 | 8 | 5 | 2 | 11 | 8 | 5 | 2 | 11 |
| 30-00 | 9 | 6 | 3 | 12 | 9 | 6 | 3 | 12 | 9 | 6 | 3 | 12 |

---

## 4. Race-only rules (brief; not for natal use)

Terms: "horse" = the nakshatra pada of the horse's name-sound. "Horse lord" = the nakshatra lord
of that pada. "Card No. rasi" = the rasi at the card number, counted from Lagna and/or from the
horse's rasi.

- **R-01 Theory A (Deha)**: Rule 1 needs one of three: Deha aspects the horse; Deha aspects
  Lagna; or Lagna lord aspects the horse. Rule 2: Deha aspects or occupies the card-No. rasi.
  Conjunction counts more, and more again if Deha's number equals the card number.
  (NTP-3, PDF p. 11) · VERIFIED-ON-PDF.
- **R-02 Theory B (Jeeva)**: same as A with Jeeva in place of Deha. (p. 11) · VERIFIED-ON-PDF.
- **R-03 Theory C (Nadi significators)**: see §3.3. (p. 11–12) · VERIFIED-ON-PDF.
- **R-04 Theory D (Lagna lord)**: Lagna lord aspects the horse, or the horse lord aspects
  Lagna; plus Lagna lord aspects the card-No. rasi. (p. 12) · VERIFIED-ON-PDF.
- **R-05 Preference order**: A and B paramount, and if they differ prefer B. Then C, then D last.
  If several horses qualify, skip the race. If two qualify, play a quinella. The horse in its
  card-No. rasi from Lagna can win alone. (p. 12) · VERIFIED-ON-PDF.
  Summary rules: all four tests pass → sure; two of the first three → wins; B and C "most
  powerful"; a horse in Lagna sometimes wins. (p. 15) · VERIFIED-ON-PDF.
- **R-06 Lagna for race time** from LMT and Lahiri's Table of Ascendants; planets for IST
  (p. 3–4). If Lagna is doubtful (on the cusp), omit the race (p. 29).
- **R-07 Card number beats aspect on the horse**: a horse won with all tests on the card number
  and none on the horse. (p. 30) · CLEAR.
- **R-08 Navamsa method**: Rule 1, the horse pada's navamsa rasi equals the card No. counted
  from Lagna or horse rasi in D-1. Rule 2, that navamsa rasi is aspected by the Lagna lord, the
  horse lord, or the lord of that amsa rasi ("considering both Rasi Lord and Nakshatra Lord").
  Both → dead cert. (p. 30–31) · CLEAR.
- **R-09 Drekkana method**: take the Sun's drekkana rasi and the lord of the 8th rasi from it
  (the "indicator"). Note the indicator's drekkana rasi. The horses whose sounds are the 1st,
  5th or 9th letter (pada) of that rasi win; likewise for the rasis the indicator aspects. Name
  only, no card number. Joining the horse's rasi is stronger than aspect.
  (p. 32–34, 36) · CLEAR.
- **R-10 Dead certs (Ch. 7)**:
  - Rule 1: horses sitting in their card-No. rasi from Lagna.
  - Rule 2: any one theory that satisfies both alphabetology and numerology; Lagna lord
    aspecting horse rasi and card-No. rasi is most powerful.
  - Rule 3: a Drekkana test plus A or B.
  - Rule 4: Navamsa plus A or B.
  - Rule 5: check with plate vs horse.
  - Rule 6: majority of rules.
  - Rule 7: the day's Ududasa lord (NTP3-017).
  - "First select the dead certs in a day" (p. 39).
  (p. 38–39) · VERIFIED-ON-PDF.
- **R-11 Plate/cup vs horse name**: the mutual relation NTP3-025. (p. 37) · CLEAR.
- **R-12 Multi-syllable names**: the first syllable dominates; a second syllable only supports.
  (p. 19–20) · VERIFIED-ON-PDF (p. 19).

---

## 5. Open questions / pages needing review

1. **Original book pp. 50–51 are missing.** The PDF notes "Missing page No. 50, 51" (PDF
   p. 17). The rest of Hyderabad 04.10.1970 race 4 is lost, from Theory C on. That text cannot
   be recovered from this library.
2. **Significator table vs illustrations (internal misprints in the source).** Treat the p. 12
   table as authoritative.
   - p. 15 (VERIFIED-ON-PDF): "Indicators of Surya are Ketu and Guru". The table says Mangal –
     Guru, and the nakshatra lords quoted (Sukr, Rahu) fit Mangal and Guru, so "Ketu" is a
     misprint.
   - p. 19 (VERIFIED-ON-PDF): "Indicators of Chandr are Mangal and Guru". The table says
     Chandr – Budh, which pp. 20, 21, 22 and 26 use.
   - p. 26 (VERIFIED-ON-PDF): the nakshatra lords of Surya's indicators are given as "Chandr
     and Sukr". The same day's table (p. 25) gives Ma → Sk and Gu → Ra, and p. 28 for the same
     day says "Sukr and Rahu".
3. **Jeeva wording on p. 11.** The Theory B introduction says "consider Nakshatra Lord of the
   horse called Jeeva". The definition on the same page, and every illustration, make Jeeva the
   nakshatra lord of the Deha. Use the definition (NTP3-006).
4. **"Sookshma Lord" and "Sthoola Lord"** (pp. 21, 34) are used without definition
   (NTP3-008, NTP3-009). Check whether NTP-1 or NTP-2 defines them.
5. **Ketu's co-lordship.** p. 7 says Ketu is co-lord of Mesha, with a bracketed note "more
   common info is Vrischika". The note is probably the editor's. No illustration uses Ketu as a
   Lagna lord.
6. **Abhijit row in the original scan (p. 40, VERIFIED-ON-PDF).** In the scan, the "Abh" label
   sits beside the शि शु शे शो row. The row above it (जु जे जो श) is unlabelled. The editor's
   table (p. 9) assigns जु… to Abhijit and शि… to Sravana. This matches the illustrations
   (NTP3-028) but not the visual label position. Low impact for natal use.
7. **Ardra pada 3 letter** is missing from the original Devanagari scan (p. 40). Iyer's English
   sound column has "Gna". The editor's Devanagari [ग्न] is a guess.
8. **Hasta pada 2 IAST** is printed "pa" while the Devanagari is ष (ṣa) (p. 9, VERIFIED-ON-PDF).
   This is an editor transcription slip. Iyer's English says "Sha".
9. **Rahu/Ketu aspects.** p. 7 gives 3 and 10; p. 38 revises the nodes to 3, 7 and 11
   (optionally 3, 7, 10 and 11). The app needs a configuration decision. Iyer's latest stated
   preference is 3, 7, 11 (NTP3-011).
10. **Typo on p. 4.** Hyderabad longitude is given as "78 E 27" and then multiplied as
    "70° 27'". The result, 314', fits 78°27'. Race-only; no impact.
11. **Editor's bracketed notes** ("[Vimshottari]" on p. 38; "[By authors calculation Chandr is
    in 7 Tula.]" on p. 15; "[Mr. Iyer is using IST time, not LMT]" on p. 19) are not Iyer's
    text.
12. **The embedded text layer drops the "Theory C" heading and the "General method or Deha
    method" subheading on p. 11.** The OCR and the page image (VERIFIED-ON-PDF) show both.
13. **Pages not opened as images:** 1–4, 14, 16–18, 20, 22, 23, 27, 29–33, 35–37. On these the
    rule text in `text/` and `ocr/` agrees. The race chart diagrams and the per-day nakshatra-lord
    tables on those pages (race data only) were not checked against the image. Rules taken from
    them are marked CLEAR, not VERIFIED-ON-PDF.
14. **No natal-chart, Yogi, Avayogi, Yoga-point, positive/negative-planet, or Yogi-set material
    exists in NTP-3** (see §0). The caller's Yogi questions must be answered from NTP-1 and
    NTP-2.

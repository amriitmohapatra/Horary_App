# NTP-1 rule catalogue — H.R. Seshadri Iyer, *New Techniques of Prediction*, Part I

Source: `references/NTP/ntp-1/` (159 PDF pages, 4th edition, Janapriya Prakashana, 2000; author's preface dated 1.6.1963).
Purpose: input for Astro-Amriit (offline natal app) — notes on planet positions/states and on running dasha periods.

## How to read this file

- Every rule has an ID `NTP1-nnn`, a plain-words paraphrase (short quotes only where wording matters), the exact conditions, the stated effect, a citation `(NTP-1, PDF p. N)` and two tags:
  - Confidence: **CLEAR** (embedded text and OCR agree, wording plain) · **VERIFIED-ON-PDF** (page image inspected) · **UNCERTAIN** (reason given).
  - Computability: **COMPUTABLE** (derivable from longitudes, signs, houses, nakshatras, panchanga, dasha) · **NOT-COMPUTABLE** (needs judgement, life data, palmistry, or data the app lacks). "PARTLY" = the trigger is computable but the effect needs judgement.
- **Citation = one-based source PDF page.** Printed page number = PDF page + 1 throughout this volume (e.g. printed p. 35 = PDF p. 34).
- Sign numbers: 1 Mesha/Aries … 12 Meena/Pisces. Positions written `S-D-M` = sign index from Mesha (0-based) - degrees - minutes, exactly as Iyer writes them (e.g. `2-4-34` = Mithuna 4°34′). Periods written `Y-M-D`.
- Planet abbreviations (Iyer's own, PDF p. 10): Rv Sun, Ch Moon, Kj Mars, Bd Mercury, Gr Jupiter, Sk Venus, Sn Saturn, Rh Rahu, Kt Ketu.
- "Implied" marks something Iyer does not state but which his example or wording entails. Nothing here is filled in from general astrology.

---

## 0. Overview of the volume

| Part | PDF pages | Content |
|---|---|---|
| Front matter | 1–9 | Cover (1), Preface 1963 (2–6), Preface to 3rd ed. (7), Editor's note by Dr T.S. Vasan (8), Contents (9) |
| Ch I — Definitions and Nomenclatures | 10–33 | Planets, Rasis & solar months (10–11), 60-year cycle mapped to the zodiac (11–13), Ayana (13–14), Ritu, lunar months, Paksha (14–15), Vara, Hora (15–16), Thithi + Zero Rasis (16–18), Yoga + **Yoga point / Birth Yogi** + 27 yoga effects (18–25), Karana (25–26), Nakshatras & Udu (Vimshottari) dasha (26–27), **Graha Samayam** (27 planetary states) (28–30), **Rectification of birth dasha** (31–33) |
| Ch II — Karakatwas | 34–81 | Rasis (34–40), Bhavas (40–46), Planets incl. exaltation & moolatrikona (45–67), Stars (67–77), Nakshatra gandas (78–81) |
| Ch III — Preliminaries to cast the birth chart | 81–105 | Ayanamsa (82), Ephemeris (83–84), Lagna (84), Birth time (84–85), Tatwa theory (85–89), Panchanga & Ephemeris methods (90–93), **Bhava cusps, Bhava chart vs Cuspal chart** (92–98), Udu dasha & bhukti arithmetic (98–102), Horoscope "epigraph" checklist incl. Birth Yogi / Avayogi / Duplicate Yogi (103–105) |
| Ch IV — Shadbala (short) | 106–109 | Kala, Chesta, Uccha, Dig, Ayana bala; when a planet gives effects |
| Ch V — Yogadhyaya | 110–119 | Pancha-mahapurusha, Sunapha…, Vasi/Vesi, Kartari, Sankhya, Adhi, Kesari, Mahabhagya, Vasumat, Amala, Pushkala, Shubha/Ashubha-mala, Lakshmi, Raja, Mishra, Viparitha, Parivartana, Kemadruma (rejected), **Neecha Bhanga** |
| Ch VI — Female Horoscopy | 119–124 | Benefactor rule, Mangalyam, **Kuja (Angaraka) dosha**, chastity, who pre-deceases |
| Ch VII — Bhava Phalams | 124–159 | Positional effects, **eclipsed/defeated planets**, planets on either side of a bhava, **bhava sandhi**, **measurement of degree of effects**, planets in bhavas, **natural vs functional benefics/malefics**, **karaka in bhava**, **bhavat bhava**, **karakat bhava** (ashtakavarga counts), specialised bhava effects (character, wealth/Indu Lagna, issues, marriages, women, immorality, mangalyam), **Sthoola vs Sookshma bhava lords**, 8-step mode of judging, Appendix: worked bhava readings of Chart No. 1 (156–159) |

Iyer repeatedly defers to **Part II** (NTP-2) for Division Charts, the "mathematical Navamsha diagram", **positive/negative planets**, and (implicitly) Avayogi / Duplicate Yogi. NTP-1 itself is mostly classical material filtered by Iyer, plus his own rules flagged below.

---

## 1. Iyer's calculation choices (compare with the app)

- **NTP1-001** · Ayanamsa: use the Government-of-India (calendar-reform committee) ayanamsa; its value on 1-1-1962 is **23°19′23″**. Iyer says anyone deviating "is sure to blunder". · This is the Lahiri/Chitrapaksha family (he recommends Lahiri's ephemeris, p. 83). If the app uses the KP (Krishnamurti) ayanamsa, it differs by a few arc-minutes. · (NTP-1, PDF p. 82; ephemeris choice p. 83) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-002** · Ephemeris: only Drig-ganita (observational) positions; Vakya/Siddhanta panchangas rejected. Recommends Raphael's ephemeris + tables of houses with the GoI ayanamsa, or Lahiri's ephemeris. · (NTP-1, PDF p. 83) · CLEAR · COMPUTABLE
- **NTP1-003** · Use **mean Rahu**, never true Rahu ("Take always Mean Rahu position … and not True Rahu"). Ketu = Rahu + 180°. · App note: if the app uses true node, it differs from Iyer. · (NTP-1, PDF p. 101) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-004** · Moment of birth = *bhoopathana* (complete severance from the mother's womb), not rupture of membranes or appearance of the head. · (NTP-1, PDF p. 84) · CLEAR · NOT-COMPUTABLE (data-entry convention)
- **NTP1-005** · Lagna: compute from sidereal time + table of houses for the birth latitude (varying latitudinal rising spans; equatorial or fixed spans are wrong). Final lagna to be settled by rectification against past events (division charts, Part II) and Tatwa theory. · (NTP-1, PDF pp. 84–85, 92) · CLEAR · COMPUTABLE (calculation) / NOT-COMPUTABLE (rectification)
- **NTP1-006** · **House system — Sripati**: take Lagna and 10th cusp from the table of houses; 7th and 4th are opposite. "Divide the span of each quarter into 3 equal parts" to get the other cusps. · Implied: quadrant trisection of ecliptic arcs between Asc–IC–Desc–MC (Porphyry-type cusps), as the example table on p. 96 shows (e.g. cusps 2 and 3 at equal steps). · App note: differs from Placidus (KP). · (NTP-1, PDF pp. 92–93; example p. 96) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-007** · **Cusp = bhava middle (bhava madhya)**, not bhava start. Bhava span runs from the midpoint between the previous cusp and this cusp (start "A") to the midpoint between this cusp and the next cusp (end "B"). A span can fall in 1, 2 or 3 signs. Editor's note confirms: "Correct nomenclature 'Bhava Madhya'". · App note: in KP the cusp is the *start* of the house — Iyer's houses are shifted by about half a house relative to KP. · (NTP-1, PDF pp. 93–94; worked table p. 96 "Bhava Start / Bhava Middle") · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-008** · **Lordship comes from the cusp**: the lord of the sign containing a bhava's cusp (madhya) is that bhava's lord. So a planet can own 0, 1, 2, 3 or more bhavas; a sign may contain 0–3 cusps. · (NTP-1, PDF pp. 94–95, 97) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-009** · **Occupation comes from the span**: a planet anywhere between bhava start and bhava end is in that bhava (Bhava chart). Iyer: judging lordships or bhava positions just by counting signs from the lagna sign "will not always be correct". · (NTP-1, PDF pp. 94–96) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-010** · Three charts are required: **Rasi chart** (signs: use for aspects, dignity, shadbala, friend/enemy relations), **Cuspal chart** (cusps placed in signs: use for lordship and for "karaka in bhava"), **Bhava chart** (planet placed in the Nth sign from lagna sign when it is in the Nth bhava: use only for bhava occupation — "do not touch up any other point in this chart"; e.g. a planet shown in Kataka in the bhava chart is *not* thereby exalted). · (NTP-1, PDF pp. 95–97) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-011** · Transits (gochara) must also be read against bhava spans, not signs: a transiting planet may be in the bhava one less or one more than the sign count suggests. · (NTP-1, PDF pp. 96–97) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-012** · Lagna and Moon: for yogas and judgements Iyer always prefers **Lagna** as the reference point over Moon (Lagna is the "minutest point"; double reckoning creates too many yogas). · (NTP-1, PDF p. 111; repeated p. 114) · CLEAR · COMPUTABLE
- **NTP1-013** · Dasha system: only **Udu dasha = Vimshottari** (120 years, Moon's nakshatra), for all horoscopes in Kali yuga. Lords/years: Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17; stars Ashwini/Makha/Moola → Ketu, Bharani/Pubba/P.Ashada → Venus, Krittika/Uttara/U.Ashada → Sun, Rohini/Hasta/Sravana → Moon, Mrigasira/Chitta/Dhanista → Mars, Aridra/Swati/Shatabhisha → Rahu, Punarvasu/Vishaka/P.Bhadra → Jupiter, Pushya/Anuradha/U.Bhadra → Saturn, Aslesha/Jyesta/Revati → Mercury. Starting dasha always from **Moon** (not Lagna or Sun); choosing dasha systems by planetary strength is rejected. · (NTP-1, PDF pp. 27, 31, 98) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-014** · Dasha year = solar year: strictly, the time for the Sun to move 360° (month = Sun moves 30°, day = Sun moves 1°); the English year (≈365 days) is the practical substitute. 360-day years are wrong. · (NTP-1, PDF pp. 31–32) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-015** · Birth dasha balance = dasha years × (unelapsed part of the birth star) — rule of three. · (NTP-1, PDF p. 98) · CLEAR · COMPUTABLE
- **NTP1-016** · Bhukti shortcut: multiply dasha-lord years × bhukti-lord years; drop the units digit → months; units digit × 3 → days (e.g. Jupiter–Saturn 16×19 = 304 → 30 months 12 days = 2-8-12). Same proportional method for antara, etc. "Stage up to Anthara is enough." · (NTP-1, PDF pp. 98–99) · CLEAR · COMPUTABLE
- **NTP1-017** · **Rectification of birth dasha** (only when dasha–bhukti readings do not tally): take the larger of (expired portion, balance) of the birth dasha in years; add **41 days per year** of that larger figure (plus proportional days for months) to the balance. Only the birth dasha is altered; all later dashas keep their normal lengths. Reason: solar year 365 − stellar year 324 (12 × 27 days) = 41 days. Example: birth 11-9-1899 23:08 Mysore, Moon 7-11-52, Saturn balance 6-10-6, expired 12-1-24 → 12×41 + 3 = 495 days = 1-4-10 → rectified balance 8-2-16; Sun dasha from 27-11-1951. · App note: this is an optional manual correction, not a default. · (NTP-1, PDF pp. 31–33) · VERIFIED-ON-PDF · COMPUTABLE (as an optional toggle; deciding *when* to apply it is NOT-COMPUTABLE)
- **NTP1-018** · Week day for all astrological purposes runs **sunrise to sunrise**; the day is named after the hora at sunrise. Hora order: Sun–Venus–Mercury–Moon–Saturn–Jupiter–Mars, repeating; Rahu and Ketu have no hora. · (NTP-1, PDF pp. 15–16, 103, 105) · CLEAR · COMPUTABLE
- **NTP1-019** · Aspects are always judged from the **Rasi** chart; "aspect" in Iyer always **includes conjunction**. Strength of aspect depends on the longitudinal difference between aspecting and aspected points (no formula given). · (NTP-1, PDF p. 125) · CLEAR · COMPUTABLE (whether aspect exists) / UNCERTAIN (strength formula not given)
- **NTP1-020** · Digbala is judged from Rasi positions (whole-sign houses from the lagna sign), not bhavas. · (NTP-1, PDF p. 108) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-021** · Required horoscope data ("epigraph", items 1–23): date, time (IST or GMT-referenced, with the 1942–45 war-time IST note), place (lat/long), sunrise, weekday (sunrise-based), **thithi, yoga, Birth Yoga Point, Birth Yoga Planet (Yogi), Birth Avayogi, Duplicate Yogi, birth star, karana, Zero Rasis, birth tatwa**, lagna, 10th cusp, Graha Samayam (at least of the running dasha lord), planetary degrees with retrograde/eclipse/stationary/fast notes, nakshatra padas of planets and lagna, one dasha chart, all division charts, progressed Moon. · (NTP-1, PDF pp. 103–105) · VERIFIED-ON-PDF (p. 105) · COMPUTABLE (except division-chart rectification)
- **NTP1-022** · Local mean time: longitude × 4 minutes gives offset from GMT; IST = GMT + 5:30 (82.5° E). · (NTP-1, PDF p. 104) · CLEAR · COMPUTABLE

---

## 2. Yoga point, Birth Yogi, Avayogi, Duplicate Yogi, positive/negative planets, "sets of three"

### 2a. What NTP-1 defines

- **NTP1-023** · **Yoga point** = Sun longitude + Moon longitude + **3-3-20** (= 93°20′), reduced mod 360°. The constant is added because the first yoga, Vishkambha, starts with the star **Pushyami**, which begins at 3-3-20. Worked example: Sun 2-4-34 + Moon 1-9-54 + 3-3-20 = 6-17-48 = Thula 17°48′. · (NTP-1, PDF p. 20; reason p. 18) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-024** · **Birth Yogi** (Birth Yoga Planet) = the Vimshottari ("Udu-dasha") lord of the nakshatra containing the Yoga point. Example: 6-17-48 is in Swati → **Rahu is Birth Yogi**. · (NTP-1, PDF p. 20) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-025** · Yoga ↔ star ↔ Yogi table (Iyer's own; "Hitherto none attempted correlating yoga with star"). Yoga *n* (1 = Vishkambha) rules star *n*+7 counted from Ashwini (1 Vishkambha–Pushyami … 27 Vaidhriti–Punarvasu). The yoga names are the ordinary panchanga yogas; Editor: "Generally Yogas are calculated from Ashwini … The author shows … it should be started from Pushya." · Developer note (derived, not stated): the *yoga name* is the same as the standard panchanga yoga floor((Sun+Moon)/13°20′); only the star/lord attached to it is shifted by 7 stars. · (NTP-1, PDF pp. 18–20, 24) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-026** · Iyer: of all panchanga elements, the birth yoga is "of paramount importance in shaping one's life"; ignoring it causes failed predictions. · (NTP-1, PDF pp. 18–19) · VERIFIED-ON-PDF · NOT-COMPUTABLE (general statement)
- **NTP1-027** · **Avayogi** and **Duplicate Yogi** are listed as required items in the horoscope (alongside Birth Yoga Point and Birth Yoga Planet) but are **not defined anywhere in NTP-1**. Definitions must come from NTP-2. · (NTP-1, PDF p. 105; Avayogi also named p. 122) · VERIFIED-ON-PDF · NOT-COMPUTABLE from NTP-1 alone
- **NTP1-028** · **Positive / negative planets** are referred to "under the definitions of our New Techniques as explained in part II" — not defined in NTP-1. · (NTP-1, PDF p. 118; also p. 122) · VERIFIED-ON-PDF · NOT-COMPUTABLE from NTP-1 alone

### 2b. Effects of the 27 birth yogas (Iyer: "may be relied upon to a certain extent")

All: (NTP-1, PDF pp. 22–24) · VERIFIED-ON-PDF · COMPUTABLE (trigger = yoga at birth). Rule IDs NTP1-029 … NTP1-055 in order:

| ID | # | Yoga | Star | Yogi | Stated effect |
|---|---|---|---|---|---|
| NTP1-029 | 1 | Vishkambha | Pushyami | Saturn | Overcomes others; wealthy; cattle and wealth |
| NTP1-030 | 2 | Prithi | Aslesha | Mercury | Loved by all; attracted by women |
| NTP1-031 | 3 | Ayushman | Makha | Ketu | Good longevity and health |
| NTP1-032 | 4 | Sowbhagya | Pubba | Venus | Happiness and comforts |
| NTP1-033 | 5 | Shobhana | Uttara | Sun | Lascivious, sex-minded |
| NTP1-034 | 6 | Athiganda | Hasta | Moon | Murderous temperament; many obstacles and accidents |
| NTP1-035 | 7 | Sukarma | Chitta | Mars | Good and noble acts; wealthy |
| NTP1-036 | 8 | Dhriti | Swathi | Rahu | Indulges in others' money and women |
| NTP1-037 | 9 | Shoola | Vishaka | Jupiter | Angry, quarrelsome |
| NTP1-038 | 10 | Ganda | Anuradha | Saturn | Bad character |
| NTP1-039 | 11 | Vriddhi | Jyesta | Mercury | Improving day by day; intelligent |
| NTP1-040 | 12 | Dhruva | Moola | Ketu | Fixity of mind; wealthy |
| NTP1-041 | 13 | Vyaghata | Poorvashada | Venus | Cruel-minded |
| NTP1-042 | 14 | Harshana | Uttarashada | Sun | Always merry; intelligent |
| NTP1-043 | 15 | Vajra | Sravana | Moon | Wealthy and lascivious |
| NTP1-044 | 16 | Siddhi | Dhanista | Mars | Several attainments; protector of others |
| NTP1-045 | 17 | Vyathipatha | Shathabhisha | Rahu | Unreliable |
| NTP1-046 | 18 | Variyan | Poorva Bhadra | Jupiter | Bad character, lascivious |
| NTP1-047 | 19 | Parigha | Uttara Bhadra | Saturn | Wealthy, quarrelsome |
| NTP1-048 | 20 | Shiva | Revathi | Mercury | Revered by kings; calm; learned in shastras; wealthy |
| NTP1-049 | 21 | Siddha | Ashwini | Ketu | Good natured; religious |
| NTP1-050 | 22 | Sadhya | Bharani | Venus | Good manners |
| NTP1-051 | 23 | Shubha | Krittika | Sun | Wealthy, lustrous, fair, unhealthy |
| NTP1-052 | 24 | Shukla ("Shubhram") | Rohini | Moon | Wavering mind, good mannered, talkative, impulsive |
| NTP1-053 | 25 | Brahma | Mrigasira | Mars | Highly confidential, high aspirations, sound judgement |
| NTP1-054 | 26 | Indra ("Mahendram") | Aridra | Rahu | Wealthy, learned, helpful |
| NTP1-055 | 27 | Vaidhriti | Punarvasu | Jupiter | Cunning, blaming nature, wealthy, strong |

### 2c. Rules in NTP-1 that use the Birth Yogi / Avayogi / positive–negative status

- **NTP1-056** · Malefics in own or exaltation signs placed on either side of Sun, Moon, Lagna or the 7th (i.e. in the Kartari / Vasi–Vesi / Sunapha-type positions) "tend to do good — more definitely if they become Birth Yogis." · (NTP-1, PDF p. 113) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-057** · Kuja dosha is cancelled into "Angaraka **Yoga**" when Kuja is a first-rate yogakaraka (example: Simha lagna, Kuja in the 4th = Ruchaka) and "if he also becomes birth yogi". Before judging Kuja ask: houses owned? "Is he Birth Yogi or Avayogi? Is he a positive or negative planet?" nature of rasi/star/bhava? is his dasha running? · (NTP-1, PDF pp. 121–122) · VERIFIED-ON-PDF · PARTLY (Yogi part computable; Avayogi/positive-negative need NTP-2)
- **NTP1-058** · Karaka-in-bhava evil (see §7) "should not be predicted" if the karaka planet **is the Birth Yogi or is in the star of the Birth Yogi**. · (NTP-1, PDF p. 137) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-059** · Multiple-marriage indication (navamsa pairs, §8) is remedied — do not predict multiple marriages — if either planet of the pair is the Birth Yogi. · (NTP-1, PDF p. 150) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-060** · Neecha Bhanga condition 6: a debilitated planet that is a **negative planet** (NTP-2 definition) gets neecha bhanga. · (NTP-1, PDF p. 118) · VERIFIED-ON-PDF · NOT-COMPUTABLE from NTP-1 (needs NTP-2 definition)

### 2d. "Yogi planets come in sets/groups of three" — finding

- **NTP1-061** · **NTP-1 contains no statement that Yogi planets (or Avayogi / Duplicate Yogi) come in sets or groups of three.** I searched the text and OCR layers for "three", "set(s)", "group(s)", "Yogi", "Avayogi", "Duplicate" and read every chapter; the only "sets" in NTP-1 are the four sets of natural/functional planets (p. 132), navamsa pairs for marriage (p. 150), the Srishti/Sthithi/Laya grouping of stars in threes (p. 68) and the triplets of stars per Udu-dasha lord (p. 27). · Derived (not stated): because each Vimshottari lord rules three stars, each planet is Birth Yogi for exactly three of the 27 yoga positions (table in §2b). Do not present this as an Iyer rule. · (NTP-1, PDF pp. 20, 27, 105) · VERIFIED-ON-PDF (absence checked by full read + search) · n/a

---

## 3. Planet states and dignities

### 3a. Exaltation, debilitation, moolatrikona, own signs

- **NTP1-062** · Deep exaltation degrees, Sun→Saturn: **10, 3, 28, 15, 5, 27, 20**. Signs (from the karakatwa lists): Sun Mesha 10°, Moon Vrishabha 3°, Mars Makara 28°, Mercury Kanya 15°, Jupiter Kataka 5°, Venus Meena 27°, Saturn Thula 20°. · (NTP-1, PDF p. 45; signs pp. 59–65) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-063** · Rahu and Ketu are **both** stated "exalted in Vrischika" (no degree). Rahu owns Kumbha; Ketu owns Mesha. · Note: Iyer elsewhere (p. 118) says "no planet has Vrischika … as its exaltation sign" — evidently counting only the seven planets. · (NTP-1, PDF pp. 66–67) · VERIFIED-ON-PDF · COMPUTABLE · UNCERTAIN (both nodes in the same sign is as printed; contradiction with p. 118)
- **NTP1-064** · Debilitation: not tabulated. Implied: the point/sign opposite exaltation (Uccha bala is "Zero at its opposite point"; Moon's neecha rasi is named as Vrischika). · (NTP-1, PDF pp. 108, 118) · VERIFIED-ON-PDF · COMPUTABLE (implied)
- **NTP1-065** · Moolatrikona ranges: **Sun Simha 0–20°**; **Moon Vrishabha 4–30°**; **Mars Mesha 0–12°**; **Mercury Kanya 16–20°**; **Jupiter Dhanus 0–10°**; **Venus Thula 0–5°**; **Saturn Kumbha 0–20°**. None given for Rahu/Ketu. · (NTP-1, PDF pp. 59, 60, 61, 62, 63, 64, 65) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-066** · Own signs: Sun Simha; Moon Kataka; Mars Mesha & Vrischika; Mercury Mithuna & Kanya; Jupiter Dhanus & Meena; Venus Vrishabha & Thula; Saturn Makara & Kumbha; **Rahu Kumbha; Ketu Mesha**. · (NTP-1, PDF pp. 59–67) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-067** · Friend/enemy/neutral signs and planetary friendships: Iyer uses "own house, friend's house, enemy's house, neutral house, exaltation or depression" and "natural friendship" in the bhava-judging steps but **gives no friendship table** in NTP-1. · (NTP-1, PDF pp. 155–156) · VERIFIED-ON-PDF · NOT-COMPUTABLE from NTP-1 (app must supply a table; flag source)

### 3b. Effects of dignity

- **NTP1-068** · Any planet in exaltation is naturally strong, so its **natural karakatwas** prosper. Functional result: a functional benefic exalted does good to the bhava it owns; a **functional malefic exalted increases the bad effects** of the bad bhava it owns. · (NTP-1, PDF p. 134) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-069** · A planet (benefic or malefic, natural or functional) in its **own sign always does good to the bhava it owns**. Example: Venus lord of 6 and 11 in own sign in the 6th — "any malefic effect emanating will finally end in happiness"; own-house protection applies to the 6th (the occupied own sign), not the 11th. · (NTP-1, PDF pp. 134, 136) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-070** · **Bhava position outranks sign dignity**: a functional benefic in a good bhava keeps its good for the bhava it owns even if debilitated (to a lesser degree); the same planet exalted but in a dusthana "will be of no avail". · (NTP-1, PDF p. 134) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-071** · Shadbala / strength only measures the **quantity** of effect, never whether it is good or bad. · (NTP-1, PDF pp. 106, 109) · VERIFIED-ON-PDF · COMPUTABLE (as a rule for how to present strength)

### 3c. Neecha Bhanga (cancellation of debilitation) — Iyer's canons

Neecha Bhanga Raja Yoga = rising from low status/circumstances to prosperity (not literally kingship or government). Any one condition suffices ("OR"). · (NTP-1, PDF pp. 117–118) · VERIFIED-ON-PDF

- **NTP1-072** · (1) Lord of the sign occupied by the debilitated planet is in a **kendra from Lagna** (Iyer prefers Lagna only, and also accepts **trines** from Lagna; the classical "from Moon or from itself" is mentioned but not preferred). · COMPUTABLE
- **NTP1-073** · (2) Lord of the debilitated planet's **exaltation sign** is in a kendra (or trine) from Lagna. · COMPUTABLE
- **NTP1-074** · (3) The debilitated planet is **retrograde**. · COMPUTABLE
- **NTP1-075** · (4) Lord of the sign occupied by the debilitated planet is otherwise strong: "exalted with Digbala and in good Bhava". · UNCERTAIN (wording: whether all three — exalted, digbala, good bhava — are required jointly; "good bhava" undefined, probably kendra/trine per §6) · COMPUTABLE once interpreted
- **NTP1-076** · (5) Lord of the sign occupied by the debilitated planet **aspects** it (aspect includes conjunction, NTP1-019). · COMPUTABLE
- **NTP1-077** · (6) The debilitated planet is a **negative planet** (NTP-2). · NOT-COMPUTABLE from NTP-1
- **NTP1-078** · Timing: the cancellation shows from the **bhukti of the planet causing the neecha bhanga, within the dasha of the debilitated planet**; until then the bad effect of the debilitation may run. · COMPUTABLE
- **NTP1-079** · Rejected rule: "the planet whose exaltation sign is the neecha sign, in a kendra" — Iyer rejects it (fails for Moon). · NOT a rule; record so the app does not show it as Iyer's.

### 3d. Retrogression

- **NTP1-080** · Retrograde planets get **Chesta bala** (motional strength); Moon gets it in Shukla paksha, Sun in Uttarayana, the others when retrograde. · (NTP-1, PDF p. 108) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-081** · Retrogression multiplies a planet's quantity of effect: ×3 (retrograde, or exalted) in ashtakavarga counts and in the wealth/issue ray methods; ×6 with own sign/amsha; ×9 with exaltation. · (NTP-1, PDF pp. 140, 145, 149) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-082** · Retrograde debilitated planet → neecha bhanga (NTP1-074). · (NTP-1, PDF p. 117) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-083** · Karaka in its own karaka-bhava that is exalted **or retrograde** "will do worse" for that bhava's matters (example Mercury in 4th for education). · (NTP-1, PDF p. 138) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-084** · Retrograde, stationary (*sthambana*), eclipsed/set (*astha*) and fast (*athichara*) conditions "upset the normal effects" and must be noted for every planet. No separate effect is given for stationary or fast motion. · (NTP-1, PDF pp. 90, 105, 156) · CLEAR · COMPUTABLE (flagging) / NOT-COMPUTABLE (effect)

### 3e. Combustion ("eclipsed", "set", "obscured by Solar rays") and planetary war

- **NTP1-085** · Planets obscured by the Sun's rays (eclipsed/combust) or **defeated in planetary war (graha yuddha)** "can never do good where-ever they be and cause worst results when they happen to be in bad position." **Exception: Saturn and Venus give half ("moiety") of their effects though eclipsed.** · (NTP-1, PDF p. 127) · VERIFIED-ON-PDF · COMPUTABLE once combustion/war are defined
- **NTP1-086** · **No combustion orbs are given in NTP-1.** Iyer takes "Asta" status from the panchanga/ephemeris (example: 1-2-1962 — Mercury retrograde and set, Venus, Jupiter, Saturn set). · (NTP-1, PDF pp. 90, 99, 101) · VERIFIED-ON-PDF (p. 101) · NOT-COMPUTABLE from NTP-1 (app must choose orbs and say so)
- **NTP1-087** · Planetary war: the planet in **northern declination** wins. No orb for war is given. · (NTP-1, PDF p. 108) · VERIFIED-ON-PDF · COMPUTABLE (winner rule; contact threshold not given)
- **NTP1-088** · Eclipsed planet as rays/issues giver: ray count becomes **zero**, except Venus and Saturn which lose only half. · (NTP-1, PDF p. 149) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-089** · Karaka in its karaka-bhava that is eclipsed: total failure of that matter (Mercury in 4th eclipsed → "will not be educated at all"). · (NTP-1, PDF p. 138) · VERIFIED-ON-PDF · COMPUTABLE

### 3f. Vargottama

- **NTP1-090** · Vargottama is mentioned only for **stars** in the disease-spread method: if the planet's nakshatra position is vargottama, the disease stays in the same body part throughout; otherwise it moves through the body parts of the successive navamsa stars and settles at the last. (Full method: "Mathematical Navamsha Diagram", NTP-2.) No general vargottama strength rule is given. · (NTP-1, PDF p. 72) · VERIFIED-ON-PDF · NOT-COMPUTABLE (method in NTP-2)

### 3g. Other state notes

- **NTP1-091** · Declination: a planet in **northern declination gives its effects in Uttarayana** (Sun in Makara→Mithuna), one in southern declination in Dakshinayana. · (NTP-1, PDF pp. 13–14) · CLEAR · COMPUTABLE
- **NTP1-092** · Planet in a star of its **own tatwa** gives its effects unmodified; in a star of an inimical tatwa it gives untoward effects. Planet tatwas: Sun & Mars fire (tejas), Moon & Venus water (jala), Mercury earth (prithvi), Jupiter ether (akasha), Saturn air (vayu). Star tatwas (Prasna Marga): Ashwini–Mrigasira prithvi; Aridra–Pubba jala; Uttara–Anuradha tejas; Jyesta–Sravana vayu; Dhanista–Revati akasha. Only two enmities are named: earth vs ether (Mercury as 5th lord in an akasha star → children "as distant as the Earth is from Akasha") and water vs fire (Venus as 7th lord in a tejo star → poor conjugal happiness). · (NTP-1, PDF pp. 55–56, 69) · VERIFIED-ON-PDF (p. 69) · PARTLY (full enmity table and Rahu/Ketu tatwa not given)
- **NTP1-093** · Among planet, its sign and its star, the **strongest** decides the result; sign strength = strength of its lord; star strength = strength of its Vimshottari lord. (Example: Mars 5th lord in a male sign but in Poorvashada, a female star → 2 sons, 6 daughters; Venus strongest.) · (NTP-1, PDF pp. 67–68) · VERIFIED-ON-PDF · COMPUTABLE (given a strength measure)
- **NTP1-094** · Planet in a **fixed star** during its period: native stays in one place; in a **movable star**: constantly moving; soft/ferocious character likewise. Fixed: Rohini, Uttara, Uttarashada, Uttarabhadra. Movable: Sravana, Dhanista, Shathabisha, Hasta, Swati. Heaty (teekshna): Aridra, Aslesha, Jyesta, Moola. Ferocious: Bharani, Pubba, Poorvashada, Poorvabhadra, Makha. Light: Ashwini, Pushya, Hasta. Soft: Mrigasira, Chitta, Anuradha, Revati. Soft-and-heaty: Krittika, Vishaka. (Punarvasu unassigned; Hasta listed twice.) · (NTP-1, PDF pp. 70–71) · VERIFIED-ON-PDF · COMPUTABLE

---

## 4. Shadbala (Ch IV) and timing of a planet's effects

- **NTP1-095** · Six strengths used: Kala, Chesta, Uccha, Dik, Ayana, Sthana. Sthana bala is named but **not explained**. Saptavargaja bala / Ishta-Kashta (Sripati) rejected as too cumbersome. · (NTP-1, PDF pp. 106–107) · VERIFIED-ON-PDF · PARTLY
- **NTP1-096** · Kala bala (a) day/night: Moon, Mars, Venus strong at night; Sun, Jupiter, Saturn by day; Mercury always. (b) Paksha: benefics strong in Shukla, malefics in Krishna paksha. (c) Lords of birth **year, month, day, hora** get ¼, ½, ¾, 1 rupa respectively (comparative only); hora lord is the strongest of the four. Year lord = weekday lord of the day the lunar year began; month lord = lord of the Sun's sign; day lord = weekday lord; hora lord = birth hora. · (NTP-1, PDF pp. 107–108) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-097** · Uccha bala: maximum at deep exaltation, zero at the opposite point, proportional in between. · (NTP-1, PDF p. 108) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-098** · Digbala: Sun & Mars strong in the 10th sign, Moon & Venus in the 4th, Mercury & Jupiter in the lagna sign, Saturn in the 7th; zero in the opposite sign. Effect in its period: "One with Digbala will always command others." · (NTP-1, PDF pp. 108–109) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-099** · Ayana bala: Sun, Moon, Jupiter, Venus strong in **northern** declination; Moon, Mercury, Saturn in **southern** declination; Sripati says Mercury always has it. · UNCERTAIN: Moon appears in both lists and Mars in neither (as printed). · (NTP-1, PDF p. 108) · VERIFIED-ON-PDF · COMPUTABLE except Moon/Mars
- **NTP1-100** · Kind of success by strength type during the planet's period: Kala bala → matters where timing matters; Chesta bala → matters of motion/movement; Uccha bala → all matters; Digbala → command over others; Sthana bala → position, status. · (NTP-1, PDF p. 109) · VERIFIED-ON-PDF · COMPUTABLE (trigger) / text output
- **NTP1-101** · A planet gives its effects during: (i) its dasha/bhukti; (ii) the year it rules; (iii) the ayana matching its birth declination; (iv) its month (Sun transiting its signs); (v) its paksha; (vi) its weekday; (vii) its thithis (see §10 planet table); (viii) its hora; (ix) its lagna; (x) its star. · (NTP-1, PDF pp. 108–109) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-102** · Rising type and strength time: Mercury, Jupiter, Venus, Rahu are *shirodaya* (strong by day); Sun, Mars, Mercury, Saturn are *prishtodaya* (strong by night); Moon and Ketu *ubhayodaya* (strong day and night). · UNCERTAIN: Mercury is in both lists, and Sun "strong at night" contradicts Kala bala (Sun strong by day, p. 107). · (NTP-1, PDF pp. 53–54) · CLEAR (transcription) · COMPUTABLE but conflicting

---

## 5. Aspects and positional (relative) effects

- **NTP1-103** · All planets aspect the 7th; special aspects: **Mars 4th & 8th; Jupiter 5th & 9th; Saturn, Rahu, Ketu 3rd & 10th.** · (NTP-1, PDF pp. 46, 126) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-104** · Tajika/Western/Parasari partial rasi aspects (3,4,5,7,9,10,11) are only for computing drishti-bala, not for judging; Iyer instead treats these as **relative positions** in dasha-bhukti judgement: planets in **trines and quadrants** (from the reference point) **do good**; the **2nd** is neutral (neither good nor bad); planets in **3, 6, 8, 12 are "of no avail"**, except **Mars in the 6th**, which is good because it aspects the reference point with its 8th aspect. Applies counting from Lagna and from the bhava in question. · (NTP-1, PDF p. 126) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-105** · Two angles of judgement: a lord's position **from Lagna** gives direct effects to the native; its position **from its own bhava** gives effects to that bhava's portfolio and relatives. Example: Mesha lagna, Moon (4th lord) in Kumbha = 11th from lagna → good professional income to native; but 8th from the 4th → mother may die, education may suffer. · (NTP-1, PDF p. 126) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-106** · A bhava prospers when its **lord aspects it** ("the master of a house being present at Head-Quarters"). · (NTP-1, PDF p. 125) · CLEAR · COMPUTABLE
- **NTP1-107** · Classical rule "a bhava suffers whose lord is in the 8th, combust, debilitated or in an enemy sign without benefic aspect" — Iyer: not always true; only some portfolios of the bhava suffer, discernible only through division charts (NTP-2). · (NTP-1, PDF p. 127) · VERIFIED-ON-PDF · NOT-COMPUTABLE (which portfolio)

---

## 6. Natural vs functional benefics/malefics; bhava-placement effects

### 6a. Definitions (Iyer's "four sets of planets")

- **NTP1-108** · **Natural benefics (N.B.)**: Jupiter, Venus, Mercury *not conjoined with natural malefics*, **waxing Moon** (Shukla paksha), and — "as per our N.T.P. and Western Astrology" — **the Sun "mostly"**. · (NTP-1, PDF p. 132) · VERIFIED-ON-PDF · COMPUTABLE (Sun's "mostly" is UNCERTAIN in degree)
- **NTP1-109** · **Natural malefics (N.M.)**: Mercury conjoined with natural malefics, **waning Moon** (Krishna paksha), Mars, Saturn, Rahu, Ketu. · (NTP-1, PDF p. 132) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-110** · **Functional benefics (F.B.)**: any planet owning bhavas **other than 3, 6, 8, 12**. **Functional malefics (F.M.)**: any planet owning 3, 6, 8 or 12. Ownership by cusp (NTP1-008). · UNCERTAIN: a planet owning both a good and a dusthana bhava is not explicitly classified; Iyer elsewhere says read each lordship separately (NTP1-118, NTP1-128). · (NTP-1, PDF p. 132) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-111** · Kendra/trine/other house groups: kendras 1-4-7-10; panaphara 2-5-8-11; apoklima 3-6-9-12; trikonas 5-9; dusthanas 3-6-8-12; upachayas 3-6-10-11; dharma 1-5-9, artha 2-6-10, kama 3-7-11, moksha 4-8-12. 2nd and 4th = paternal property; 10th = self-earned with exertion; 11th = self-earned without exertion. · (NTP-1, PDF pp. 40–41) · VERIFIED-ON-PDF · COMPUTABLE

### 6b. Effects

- **NTP1-112** · N.B. do good to the bhavas they occupy or aspect. Their own karakatwas prosper when they are in good bhavas and suffer in dusthanas, except **3rd and 6th (upachaya) where gradual good** comes. · (NTP-1, PDF p. 133) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-113** · N.M. spoil all bhavas they occupy or aspect. Their own karakatwas prosper in good bhavas, suffer in the **8th and 12th**, and give gradual good in **3rd and 6th**. · (NTP-1, PDF p. 133) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-114** · F.B. in a good bhava does good to the bhavas it owns; in a dusthana it spoils the bhavas it owns. · (NTP-1, PDF p. 133) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-115** · F.M. in a good bhava gains strength to **increase** the bad of the bhava it owns; in a dusthana it is weakened, producing **Viparitha Raja Yoga** — sudden, unexpected good, possibly after hurdles, disappointment or someone's death. · (NTP-1, PDF p. 133) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-116** · Scope: rules (c)/(d) concern only the **bhavas owned**; the bhavas a planet occupies or aspects are judged by (a)/(b) (natural nature) only. · (NTP-1, PDF p. 133) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-117** · Combining natural and functional: read both separately and narrate both; contradictory effects are experienced at different times within its periods. "Adhipathya (functional) is more important than karakatwa (natural)." · (NTP-1, PDF pp. 133–134) · VERIFIED-ON-PDF · COMPUTABLE (as two separate notes)
- **NTP1-118** · F.B. should not be related (conjunction/aspect) with F.M.; natural enemies should not be related even if both are F.B. (counter-action lessens good). · (NTP-1, PDF p. 134) · VERIFIED-ON-PDF · COMPUTABLE (enmity table not given — see NTP1-067)
- **NTP1-119** · **8th-lordship exception for Sun and Moon** (classical: Sun/Moon owning the 8th are not malefic): Iyer accepts it **only for maraka (death-inflicting)** effect, not for prosperity; even then other planets may kill in their bhuktis within a Sun or Moon dasha. · (NTP-1, PDF p. 134) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-120** · Example: Vrishabha lagna, Jupiter (8th lord) in lagna gives "miserable and disastrous results in his Dasha"; as natural benefic it still gives knowledge, piety, name, ordinary earning where not repugnant to its function. · (NTP-1, PDF pp. 134–135) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-121** · Chart with functional malefics weak in 3/6/8/12 and functional benefics in or aspecting lagna/kendras/trines → very good yoga results in their periods, but if those functional malefics are natural benefics the native lacks their natural virtues (conduct, spirituality, charity). Conversely functional malefics in 1/5/9 with natural benefics → pious, learned, charitable but suffering. · (NTP-1, PDF pp. 130–131) · CLEAR · PARTLY
- **NTP1-122** · **Benefics in auspicious bhavas give good, malefics there do worse**; for benefics in dusthanas both classical opinions are "true" — reconcile via natural vs functional traits (above). · (NTP-1, PDF pp. 128–129) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-123** · Body parts: **outward/superficial** afflictions from the **sign** (Kalapurusha, Mesha = head … Meena = feet); **inward/deep-rooted** diseases from the **bhava** (lagna = head … 12th = feet); confirm by the karaka planet of that limb. Example: malefic (Rahu) in Meena → outer feet affected (Rahu: eczema/skin); if lagna is Mesha, Meena is also 12th bhava → inner part too. · (NTP-1, PDF p. 135) · CLEAR · COMPUTABLE (trigger) / NOT-COMPUTABLE (diagnosis)
- **NTP1-124** · Houses 1–6 = right-side limbs of Kalapurusha; 12 back to 7 = left-side limbs. · (NTP-1, PDF p. 40) · VERIFIED-ON-PDF · COMPUTABLE

---

## 7. Ch VII bhava rules: either side, sandhi, degree of effect, karaka in bhava, bhavat bhava, karakat bhava

- **NTP1-125** · **Planets on either side of a bhava**: benefics on both sides *without malefic aspect* promote the bhava; malefics on both sides *without benefic aspect* spoil it. Iyer's reading: an extension of Kartari yoga to every bhava, so the planets should be in **different signs on either side** (the signs adjacent to the sign holding the cusp) for the full effect; protection of the cusp within the same sign is the "common sense" minimum. · (NTP-1, PDF p. 127) · VERIFIED-ON-PDF · COMPUTABLE · UNCERTAIN (whether adjacent signs only, or any distance; wording "different Rasis on either side")
- **NTP1-126** · **Bhava sandhi**: a planet at a bhava junction is ineffective **only for the two bhavas it straddles**; it still gives the effects of the bhavas it **owns**, of those it **aspects**, and of its natural karakatwa. No orb for "at the sandhi" given. · (NTP-1, PDF p. 128) · VERIFIED-ON-PDF · COMPUTABLE (orb must be chosen by app)
- **NTP1-127** · **Measurement of degree of effect**: a planet exactly on the cusp (bhava madhya) gives **100%** of that bhava's effect, **0%** at either end (sandhi), linearly proportional in between. · Formula (implied): effect% = 1 − |λ − cusp| / (distance from cusp to the relevant sandhi). · (NTP-1, PDF p. 128) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-128** · **Aroha / Avaroha in a bhava**: planet between bhava start and cusp = *Aroha* → in its period the bhava's effects **increase progressively**; between cusp and bhava end = *Avaroha* → effects **decline** as time goes on. · (NTP-1, PDF p. 128) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-129** · **Karaka in bhava**: Iyer rejects "karako bhava nashaya" (total destruction) and accepts the moderate view: a karaka in its own karaka-bhava **lessens the good** of that bhava. Karakas: **Sun–9 (father), Moon–4 (mother), Mars–3 (younger siblings), Mercury–4 (education), Jupiter–5 (children), Venus–7 (wife), Saturn–8 (longevity)**. Judge from the **cuspal chart** (karaka in the sign that contains that bhava's cusp). If the karaka there is powerful, the bad increases somewhat. Predict only if its dasha runs at the fitting age (finance: youth onward; education: teens; marriage: youth; children: after marriage). Editor: applies only to bhavas like 3–9. · (NTP-1, PDF pp. 136–137) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-130** · Mercury in the 4th (education) graded: ordinary strength → education up to SSLC; **eclipsed → none**; **exalted or retrograde → worse**; **weak → good**; own sign → success after hurdles. · (NTP-1, PDF p. 138) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-131** · Exceptions: **Saturn in the 8th extends longevity**; **Mercury in the 8th gives unforeseen, hidden wealth**; and no karaka evil if the karaka is the Birth Yogi or in the Birth Yogi's star (NTP1-058). · (NTP-1, PDF p. 138) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-132** · **Bhavat bhava** (count in whole signs): the lord of bhava *N* placed in the *N*th sign **from that bhava's sign** (i.e. in house 2N−1 from lagna sign) → "change from the previous position … or a further analogous event". Listed: 2nd lord in 3rd: capital grows (Dhanat dhanam); 3rd lord in 5th: half/step/adopted younger siblings; 4th lord in 7th: higher/further education, step-mother, happiness in succession; 5th lord in 9th: adopted or step children; 6th lord in 11th: disease → further disease, debt → more debt, enemy → more enemies; 7th lord in 1st: multiple wives/concubines; 8th lord in 3rd: one death causing another; 9th lord in 5th: added fortune / step-father; 10th lord in 7th: change of profession; 11th lord in 9th: multiple profits; 12th lord in 11th: over-spending. Read only when present; absence does not negate the effect. · (NTP-1, PDF pp. 138–140) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-133** · **Karakat bhava**: the sign that is *N* signs from the karaka planet, where *N* = the bhava number it signifies. Used **only** to measure **how many** (siblings, children, wives) via ashtakavarga. · (NTP-1, PDF p. 140) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-134** · Count = bindus in the karaka's **Bhinnashtakavarga** in the karakat-bhava sign, each contributor's bindu weighted: own sign or own navamsa ×2; retrograde, or exalted in rasi or navamsa ×3; retrograde + own sign/amsha ×6; retrograde + exalted ×9; lagna aspected by its lord → lagna's bindu ×2; set/debilitated/zero-rasi → "to be guessed by the readers"; simple (none of these) ×1. Totals = total births, not survivors. · (NTP-1, PDF pp. 140–141) · VERIFIED-ON-PDF · COMPUTABLE (except the reducing cases)
- **NTP1-135** · Applications: **younger siblings** = 3rd from Mars in Mars's BAV; **children** = 5th from Jupiter in Jupiter's BAV; **wives / women joined** = 7th from Venus in Venus's BAV; **elder siblings** = 11th from Jupiter in Jupiter's BAV. Children count works better for male charts; for females Iyer suggests (untested) the 9th instead of the 5th. Sex of children by sex of contributors: rejected. · (NTP-1, PDF pp. 140–141) · VERIFIED-ON-PDF · COMPUTABLE

---

## 8. Specialised bhava effects (Ch VII §X)

### Character (lagna)

- **NTP1-136** · Benefic aspect (incl. conjunction) on lagna → good-natured, satwic, well-mannered. **Jupiter's** aspect best (religious, reverent, pure, straightforward); **Venus** → pompous, showy, sensual, worldly, artful; benefic **Mercury** → intelligent; **Full Moon** → good but inconsistent. · (NTP-1, PDF pp. 142–143) · CLEAR (p. 143 VERIFIED-ON-PDF) · COMPUTABLE
- **NTP1-137** · Malefic aspect on lagna → bad character, base, low morals; **Saturn** is the exception → philosophic; **Mars** → rash, hot-tempered, martial. · (NTP-1, PDF p. 143) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-138** · More planets aspecting lagna → more varied nature and activities; **no planet aspecting lagna → dull, vegetative life**. · (NTP-1, PDF p. 143) · VERIFIED-ON-PDF · COMPUTABLE

### Wealth

- **NTP1-139** · **Indu Lagna**: planetary rays Sun 30, Moon 16, Mars 6, Mercury 8, Jupiter 10, Venus 12, Saturn 1. Add rays of the 9th lord from Lagna and the 9th lord from Moon; divide by 12; count the remainder from the Moon sign (inclusive: remainder 4 from Kanya = Dhanus). The planet occupying or aspecting Indu Lagna, or its lord, gives wealth in its periods in proportion to its strength. · Remainder 0 not addressed (implied 12th). · (NTP-1, PDF pp. 143, 145) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-140** · The same method for any bhava: use the lords of that bhava from Lagna and from Moon (10th → salary "Indu Lagna of tenth Bhava"; 2nd/4th → paternal wealth; 11th → easy money; 9th → final wealth). Lagna = Jeeva, Moon = Deha; both must be served for full effect. · (NTP-1, PDF p. 145) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-141** · Classical scale (Iyer doubtful, "let readers test"): powerful benefic in/aspecting Indu Lagna → millions; powerful benefic + malefic → lakhs; powerful malefic → lakhs; weak benefic conjoined → thousands; weak malefic → hundreds. · (NTP-1, PDF p. 144) · VERIFIED-ON-PDF · COMPUTABLE · (Iyer marks it untested)
- **NTP1-142** · Iyer's preferred scale (value at deep exaltation, zero at deep debilitation, proportional; apply the multipliers of NTP1-134): Sun thousands; Moon lakhs; Mars hundreds; Mercury crores; Jupiter "high (Sarvadi raja)"; Venus "far higher (Shanka)"; Saturn little. Worked example: Mars retrograde in Dhanus 26° ≈ 30° short of 28° Makara → 300 × (1 − 30/180) = Rs 250 (actual highest pay Rs 250). Very powerful planet → proportionately high effect in its dasha. · (NTP-1, PDF pp. 144–145) · VERIFIED-ON-PDF · COMPUTABLE (output units are period-specific; present only relatively)

### Children

- **NTP1-143** · Fecundity (female): Moon + Mars + Jupiter longitudes summed: even sign & even navamsa → fertile; mixed → children after great effort; odd sign & odd navamsa → no issues. Virility (male): Sun + Venus + Jupiter: odd & odd → strong; mixed → issues after effort; even & even → no issues. (From Phaladeepika XII.14–16.) · (NTP-1, PDF pp. 146–148) · VERIFIED-ON-PDF (pp. 147–148) · COMPUTABLE
- **NTP1-144** · **Santhana Ravi** = 5×Moon − 5×Sun (mod 360°); its thithi (÷12°): auspicious Shukla thithi → progeny without exertion; Krishna paksha → no possibility; New Moon, **chidra thithis 4, 6, 8, 9, 12, 14**, **Visti (Bhadra) karana** or a **Sthira karana** (Chatushpada, Nagava, Kimstughna, Shakuni) → no issues. Remedies: chidra/Visti/Sthira → Purusha Sukta worship of Krishna; 6th → Subrahmanya; 4th → Nagaraja; 9th → Ramayana recital; 8th → Sravana vrata; 14th → Rudra puja; 12th → feeding the poor; Full/New Moon → worship of manes. · (NTP-1, PDF pp. 146–148) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-145** · Number of issues (Jataka Desha Marga XVI.18–20): take the **stronger of Jupiter and the 5th lord**; its rays at deep exaltation Sun→Saturn **10, 9, 5, 5, 7, 8, 5**, zero at deep debilitation, proportional; then in the **D-12 (dwadasamsa)**: retrograde or exalted amsha ×3; friendly or own amsha ×2; debilitated or inimical amsha "reduce by 1/6"; eclipsed → 0 (Venus, Saturn lose half). Drop fractions. · (NTP-1, PDF pp. 148–149) · VERIFIED-ON-PDF · COMPUTABLE · UNCERTAIN ("reduce by 1/6" = subtract 1/6 or keep 1/6; and Mars's ray value in the worked example, see §13)

### Marriage, women, morality

- **NTP1-146** · Number of marriages: take the **navamsa-sign lords** of (a) the 7th bhava's lord and (b) the 7th cusp. Pairs **Mercury–Saturn** or **Mars–Saturn** → one marriage (Sanketa Nidhi; Iyer confirms). Iyer's tentative list for **more than one marriage**: Sun–Sun, Sun–Jupiter, Sun–Saturn, Sun–Venus, Mars–Mercury, Mars–Jupiter, Mercury–Jupiter, **Venus–Saturn (surest)**. Either planet Birth Yogi → do not predict multiple marriages. Other pairs: not covered. · (NTP-1, PDF pp. 149–150) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-147** · Number of women joined (if not a life of purity): sign rays Mesha→Meena **7, 8, 5, 3, 7, 11, 2, 4, 6, 8, 8, 27**; planet rays Sun→Rahu **5, 21, 7, 9, 10, 16, 4, 4** (Ketu none). The **strongest planet in the 7th sign** gives the number by its rays; if the 7th is empty, the 7th sign's rays. Adjust with the karakat-bhava multipliers. · (NTP-1, PDF p. 151) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-148** · Male chart: **Moon and Saturn together in the 7th or 9th** → wife becomes immoral, even at the husband's instigation. · (NTP-1, PDF p. 151) · VERIFIED-ON-PDF · COMPUTABLE (sensitive — consider not displaying)
- **NTP1-149** · Mangalyam (who dies first) — Iyer says astrology cannot answer reliably; uses palmistry (marriage line bending to heart line → partner dies first). · (NTP-1, PDF pp. 124, 151) · CLEAR · NOT-COMPUTABLE

### Sthoola and Sookshma bhava lords

- **NTP1-150** · Each bhava has **two functional lords**: **Sthoola** = lord of the sign holding the cusp; **Sookshma** = **Vimshottari lord of the nakshatra holding the cusp** ("the lord of the star occupied by the Bhava cusp is also functional planet of the Bhava"). Both give the bhava's effects in their periods; the star lord is "as important as the Rasi lord & even more important" with Udu dasha. Rahu/Ketu thereby become bhava lords. · App note: this is the star-lord-of-cusp principle (KP's cusp star lord, without sub-lords). · (NTP-1, PDF pp. 152–153) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-151** · Worked example (Chart No. 1, 19-6-1907, 19:09): cusp stars Moola, Sravana, Shatabhisha, Revati, Bharani, Rohini, Aridra, Pushyami, Pubba, Hasta, Swati, Anuradha → Sookshma lords Ketu, Moon, Rahu, Mercury, Venus, Moon, Rahu, Saturn, Venus, Moon, Rahu, Saturn. Marriage in Rahu dasha (Rahu = Sookshma 7th lord) – Jupiter bhukti; father died in Venus bhukti (Sookshma 9th lord, in a star of Moon = 8th lord); more daughters (5th cusp in a female star; its lord Venus in a female sign and star). · (NTP-1, PDF pp. 153–155) · VERIFIED-ON-PDF · COMPUTABLE (illustration)

### Mode of judging a bhava (recap, 8 steps)

- **NTP1-152** · (1) Planets conjoining/aspecting the sign that holds the cusp (Rasi chart), by natural nature only: benefics good, malefics spoil. (2) Sthoola and Sookshma lords: in which **bhava** they sit (Bhava chart). (3) Their **sign dignity** — own, friend, enemy, neutral, exalted, debilitated (Rasi chart). (4) Quantity via **shadbala** (Rasi chart). (5) Natural and functional nature of planets conjoining/aspecting the lords; no relation with their enemies. (6) How many signs the lord is from its bhava's cusp sign. (7) Lord's condition: combust, retrograde, fast, stationary, planetary war. (8) Modify by the **nature of the star** the lord occupies. Judge each bhava separately; do not merge two bhavas owned by one planet. All effects are read **during their periods**. · (NTP-1, PDF pp. 155–156, 159) · VERIFIED-ON-PDF (pp. 155) / CLEAR (p. 156) · COMPUTABLE (steps 1–8 data) / PARTLY (synthesis)
- **NTP1-153** · Appendix example readings (Chart No. 1), useful as templates: Ketu in 2nd afflicts family members and gives harsh speech but as Sookshma lord of 5 helps finance; lord of 3 in 2nd from the 3rd in own star → good to younger siblings; Rahu (other lord of 3) 6th from 3rd and 8th from lagna → some younger siblings died; Saturn in 4th aspected by enemies Mars and Moon → disturbed comforts; Jupiter lord of 4 in 4th from 4th in own star → education rising degree by degree; Mars lord of 5 in lagna → good by poorva punya but in Venus's (6th lord) star → not wholly good to children; Venus lord of 6 in 6 → Viparitha yoga, free from debt/disease/enemies, but in Moon's star (8th lord in 10th aspected by Saturn) → professional enemies; Mercury lord of 7 in 8th bhava killed the wife early in its own bhukti; Rahu in 8th → chronic disease (eczema) but in Jupiter's star → protection; Sun lord of 9 in 7 → wealth via wife's side, and in 11th from 9th → long-lived father; Moon lord of 8 in 10 → sudden transfers but in own star → no harm; Venus lord of 11 in 6th → expenses, 8th from 11th → harms elder siblings, own sign → later protection; Mars lord of 12 in lagna → expenses. · (NTP-1, PDF pp. 156–159) · CLEAR · COMPUTABLE (patterns)

---

## 9. Yogas (Ch V)

General principles:
- **NTP1-154** · A yoga gives its full effect **only during the dashas of the planets forming it**, and only if those dashas fall at a useful age (not childhood, teens or old age). Outside those dashas its effect is small. Exceptions: **Nabhasa yogas and Malika yoga** act throughout life. · (NTP-1, PDF p. 110) · CLEAR · COMPUTABLE
- **NTP1-155** · Yogas read from Lagna, not Moon (NTP1-012). Rahu and Ketu are excluded when testing yoga existence; their modifying effect is read afterwards. · (NTP-1, PDF pp. 111–112) · VERIFIED-ON-PDF (p. 112) · COMPUTABLE
- **NTP1-156** · Rasi-chart yogas often deceive; Iyer says they work "cent-percent" in **division charts** (NTP-2). · (NTP-1, PDF p. 119) · CLEAR · NOT-COMPUTABLE from NTP-1

Individual yogas:
- **NTP1-157** · **Ruchaka, Bhadra, Hamsa, Malavya, Sasa**: Mars, Mercury, Jupiter, Venus, Saturn respectively in a **kendra** that is its **own or exaltation sign**. Iyer: classical effect lists unnecessary — it is the general principle that a powerful planet in an auspicious bhava gives good results according to its natural and functional character, felt in its period. · (NTP-1, PDF pp. 110–111) · CLEAR · COMPUTABLE
- **NTP1-158** · **Sunapha / Anapha / Duradhura**: planets other than Sun in the 2nd / 12th / both from **Moon** (any of the seven, benefic or malefic). Iyer: effective only if those planets are powerful (own or exaltation sign); then their natural and functional portfolios prosper in their periods. · (NTP-1, PDF pp. 111–112) · CLEAR · COMPUTABLE
- **NTP1-159** · **Vesi / Vasi / Ubhayachari**: benefics (other than Moon) in the 2nd / 12th / both from **Sun** → Shubha-vesi/vasi/ubhayachari, good per their traits; malefics → Ashubha versions, all bad. · (NTP-1, PDF p. 112) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-160** · **Kartari**: benefics in 2nd and 12th from lagna → Shubha-kartari (good); benefics only in the 2nd → "Sushubha", also good; malefics on both sides → Papa-kartari (bad). · (NTP-1, PDF p. 112) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-161** · **Sankhya** (Jaimini extension of Kartari): planets on either side of lagna at equal sign distances (2–12, 3–11, 4–10, 5–9, 6–8, 1–7) — benefics good, malefics bad; quantity by shadbala. · (NTP-1, PDF p. 112) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-162** · **Adhi yoga**: benefics in 6, 7, 8 from Moon → commander / head of a town / superior position; same from Lagna also works (= Shubha-kartari of the partner, i.e. of the 7th); malefics there → bad. · (NTP-1, PDF p. 113) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-163** · Generalisation (Iyer): benefics on either side of **Sun, Moon, Lagna or the 7th house** do good, malefics bad (hemming). Strong placements differ from ordinary; conjunction/aspect of other planets modifies. **Sun and Moon on either side of Lagna are protectors and do much good.** Malefics in own/exaltation there tend to do good, more so if Birth Yogi. · (NTP-1, PDF p. 113) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-164** · **Kesari (Gaja-kesari)**: Jupiter in a kendra from Moon. Real effect only if Jupiter is strong, well placed, owns auspicious houses and its dasha comes in time; works better in division charts. · (NTP-1, PDF pp. 113–114) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-165** · **Mahabhagya**: male born by day with Sun, Moon, Lagna in odd signs; female born by night with all three in even signs. Iyer adds: they must be in happy mutual positions and their dashas must run; stronger = greater. · (NTP-1, PDF p. 114) · VERIFIED-ON-PDF · COMPUTABLE ("happy relative positions" = kendra/trine per NTP1-104, implied)
- **NTP1-166** · **Vasumat**: all benefics in upachayas (3, 6, 10, 11) from Lagna (Iyer prefers Lagna to Moon). · (NTP-1, PDF p. 114) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-167** · **Amala**: benefics in the 10th from Lagna or Moon (general rule: benefics in any bhava do good). · (NTP-1, PDF p. 115) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-168** · **Pushkala**: lagna lord conjoined with the lord of the Moon-sign, in a kendra (Iyer: any auspicious bhava), aspecting lagna, and a strong planet in lagna. · (NTP-1, PDF p. 115) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-169** · **Shubhamala**: all seven planets in the 5th, 6th and 7th from Lagna → controller of people, praised by kin, liberal, helps others, loves relatives, good children and wife, courageous. **Ashubhamala**: all seven in 6th, 8th, 12th → all bad. · (NTP-1, PDF p. 115) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-170** · **Lakshmi**: 9th lord ("house of wealth") and Venus (wealth karaka) both in own or exaltation signs that are kendras or trines → all good of the 9th bhava and of Venus. · (NTP-1, PDF p. 115) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-171** · **Raja yoga**: lords of a kendra and a trine combine and are in a happy position → status, happiness, wealth. Strongest kendra = 10th, strongest trine = 9th; 9th–10th lords combination is the prime Raja yoga. "Raja" means prosperity/position, not literal kingship or government service. · (NTP-1, PDF pp. 116–117) · VERIFIED-ON-PDF · COMPUTABLE ("combine" = conjunction/aspect, implied)
- **NTP1-172** · **Mishra yoga**: lords of good bhavas combined with lords of bad bhavas → mixed effects. · (NTP-1, PDF p. 116) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-173** · **Viparitha Raja yoga**: lords of **3, 6, 8, 12** placed in dusthanas (3-6-8-12) → sudden, unexpected, meteoric rise ("a bolt from the blue"). Note Iyer counts the **3rd** as a dusthana here. · (NTP-1, PDF p. 116) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-174** · **Parivartana**: exchange between kendra and trine lords → good; between a good and a bad bhava lord → mixed; between bad bhava lords → Viparitha yoga. · (NTP-1, PDF p. 116) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-175** · **Kemadruma**: omitted — "its efficacy has not impressed me". (Do not show as Iyer's.) · (NTP-1, PDF p. 117) · VERIFIED-ON-PDF · n/a
- **NTP1-176** · **Neecha Bhanga Raja yoga**: see NTP1-072…079. · (NTP-1, PDF pp. 117–118) · VERIFIED-ON-PDF · COMPUTABLE (except cond. 6)
- **NTP1-177** · **Planet in a kendra**: "during the Dasha of a planet in Kendra the native will have surplus wealth" (basis: Chaturthamsha). · (NTP-1, PDF p. 21) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-178** · **Tejas combination**: Aroha tejo tatwa birth + Simha or Mesha lagna + powerful, well-placed Sun and Mars + their dashas at the proper age → very high, brilliant opportunities; a commanding personality. · (NTP-1, PDF p. 89) · CLEAR · COMPUTABLE (tatwa from NTP1-196)

---

## 10. Female horoscopy (Ch VI)

- **NTP1-179** · Results of a dependent's chart (unmarried girl, wife, child, live-in family servant — not a wage-earner living separately) other than those touching her own person (health etc.) accrue to whoever **supports** her during that dasha–bhukti ("Benefactor"/*ashraya datha*), not automatically to husband or parents. · (NTP-1, PDF pp. 119–120) · CLEAR · NOT-COMPUTABLE (needs life data) — useful as a display caveat
- **NTP1-180** · Female chart: **mangalyam (husband's survival) from the 8th**; children from the **9th**; her association and chastity from the **4th**; husband from the **7th**. Benefics there do good, malefics harm. **A strong benefic in the 2nd → she dies before her husband.** · Wording "though there is a malefic in the eighth house" is unclear. · (NTP-1, PDF p. 120) · VERIFIED-ON-PDF · COMPUTABLE · UNCERTAIN (the "though…" clause)
- **NTP1-181** · **Kuja (Angaraka) dosha**: traditional positions **1, 2, 4, 7, 8, 12** from lagna (Mars afflicting the 7th = husband's welfare and the 8th = mangalyam by situation or aspect). Iyer adds the **5th** (4th aspect on the 8th). For **mangalyam itself only 1, 2, 5, 8, 12** count; affliction of the 7th harms the husband's health, happiness, prosperity, not his life. · Internal inconsistency: from the 12th Mars aspects the 7th, not the 8th, yet 12 stays in the mangalyam list (as printed). · (NTP-1, PDF pp. 120–122) · VERIFIED-ON-PDF · COMPUTABLE · UNCERTAIN (12th)
- **NTP1-182** · Dosha **does not apply** when Mars is a first-rate yogakaraka (e.g. Simha lagna, Mars in 4th in Ruchaka), and especially if Birth Yogi → "Angaraka Yoga". Also check what Mars really signifies there (8th could be about younger siblings, land, or the houses it owns). Dosha manifests only if Mars's dasha runs at the relevant age (not before marriage, not after 70). Matching dosha in both charts is not a remedy — examine the other partner's longevity instead. Any malefic can harm any house; Mars is singled out because he is *Mangala-karaka*. · (NTP-1, PDF pp. 121–122) · VERIFIED-ON-PDF · PARTLY
- **NTP1-183** · **Chastity**: indicators are houses **4, 6, 7, 11, 12** and **Venus** (chief); any relationship of **Venus with Mars** may affect morals. 6th = venereal disease; 7th = partner/outsider; 11th = gain/second partner; 12th = bed comforts elsewhere; Iyer found the 4th the least reliable. Predict only when the afflicting planet's dasha/bhukti runs, and never from periods before puberty. · (NTP-1, PDF pp. 123–124) · CLEAR · PARTLY (sensitive — consider not displaying)
- **NTP1-184** · Who pre-deceases: palmistry, not astrology (NTP1-149). · (NTP-1, PDF p. 124) · CLEAR · NOT-COMPUTABLE

---

## 11. Rules for judging dasha / bhukti results (collected)

(Cross-references; the rule text is in the section cited.)

- **NTP1-185** · Read a yoga only in the dashas of its planets at a useful age — NTP1-154. Kesari/Mahabhagya likewise — NTP1-164, -165.
- **NTP1-186** · Planet in a **kendra** → surplus wealth in its dasha — NTP1-177.
- **NTP1-187** · Dasha-bhukti results from **relative positions**: trines/kendras good, 2nd neutral, 3/6/8/12 of no avail (except Mars in 6th) — counted from Lagna and from the bhava concerned — NTP1-104, -105.
- **NTP1-188** · Planet in **Aroha** half of a bhava → its bhava results grow through its period; **Avaroha** → decline — NTP1-128. Similarly a person born in **aroha tatwa** rises with age, **avaroha** declines — NTP1-197.
- **NTP1-189** · **Neecha bhanga** starts in the bhukti of the cancelling planet inside the debilitated planet's dasha — NTP1-078.
- **NTP1-190** · **Karaka in bhava**, **Kuja dosha**, **chastity** effects only if the dasha falls at the fitting age — NTP1-129, -182, -183.
- **NTP1-191** · **Sun/Moon dasha** as 8th lords: still maraka; other planets may kill in their bhuktis inside a Sun or Moon dasha — NTP1-119.
- **NTP1-192** · Both **Sthoola and Sookshma lords** give a bhava's effects in their periods — NTP1-150.
- **NTP1-193** · **Graha Samayam** of the dasha lord adds a "state" flavour to its period (§12a, NTP1-198–225).
- **NTP1-194** · Combined natural + functional effects show at different times within the same period — NTP1-117.
- **NTP1-195** · Places of events in a period: the geographical region of the planet's star (stronger of planet and star lord decides); malefics transiting a region's stars harm it (unless they rule that region), benefics help (NTP-1, PDF pp. 69–70) · VERIFIED-ON-PDF · COMPUTABLE (region table in §14d)

---

## 12. Panchanga-derived natal factors

### 12a. Graha Samayam (planetary state of the dasha lord)

(IDs NTP1-196 and NTP1-197 are the Tatwa rules in §12c.)

- **NTP1-198** · Method: (signs from Mesha to Lagna) + (signs from Lagna to the planet in the Rasi chart); multiply the sum by **twice** the planet's Vimshottari years; divide by 27; the **remainder** is the state number (1–27). Apply to the **dasha lord**; Iyer: "Do not take the literal meanings … interpret to suit one's environments." · UNCERTAIN: whether the sign counts are inclusive (Mesha lagna = 1) and what a remainder of 0 means (27th state implied); no worked example. Rahu/Ketu included implicitly (they have dasha years). · (NTP-1, PDF p. 28) · VERIFIED-ON-PDF · COMPUTABLE (with stated assumptions)
- **NTP1-199 … NTP1-225** · The 27 states and effects (NTP-1, PDF pp. 28–30) · VERIFIED-ON-PDF · COMPUTABLE:

| ID | # | State | Effect |
|---|---|---|---|
| NTP1-199 | 1 | Snanam (bathing) | Good children, conjugal happiness, respected by kin, success |
| NTP1-200 | 2 | Vastra dharanam (wearing clothes) | Honoured by government, money, clothes, precious metals, scents, ornaments, strength |
| NTP1-201 | 3 | Vibhuti / Gandhalankaram | State honours, happiness, mirth, ability in work |
| NTP1-202 | 4 | Shivalingam / Pooja-yathnam | Money through lands, vehicles, happy living, revered by kin |
| NTP1-203 | 5 | Panchakshari japam | Lands and money; trouble from government; loss of money |
| NTP1-204 | 6 | Shiva pooja | Association even with wicked men; popularity; monetary gains |
| NTP1-205 | 7 | Upasana / Yagna-yathnam | Heart disease; educational discourses; professorship; liver complaint |
| NTP1-206 | 8 | Vishnu pooja | Felicity; gains through relatives and lands; victory over enemies |
| NTP1-207 | 9 | Namaskar | Pleasing talk; good vehicle; deceitful |
| NTP1-208 | 10 | Giripradakshinam | Spleen disease; diarrhoeic fever; trouble from government; Durga worship |
| NTP1-209 | 11 | Rudra pooja | Head of village/town/city; prosperity of wife and children; finance and happiness |
| NTP1-210 | 12 | Athithi pooja | Showy rajasic nature; treasure trove; mantra knowledge |
| NTP1-211 | 13 | Bhojanam | Abandons caste rituals; teases/hates others; always sickly; unhappy |
| NTP1-212 | 14 | Udakapadam | Eats prohibited food; enmity with relatives and friends |
| NTP1-213 | 15 | Kopam | Poverty; teasing, envious |
| NTP1-214 | 16 | Thamboolam | Clothes, vehicles, money, good conduct, acquaintance with rulers; good speech and management |
| NTP1-215 | 17 | Aasthana / Devasabha | Good heart, balanced, indolent; mantra siddhi; helpful; good morals |
| NTP1-216 | 18 | Kirita dharanam | Army commander; gains; educated, renowned |
| NTP1-217 | 19 | Rahasyam | Good words; secretive; lazy |
| NTP1-218 | 20 | Alasyam | Lazy, dull, idiotic yet knows shastras |
| NTP1-219 | 21 | Nidra / Seshashayana | Does others' work; lustrous and irritable; troubles mother, wife |
| NTP1-220 | 22 | Jalapana | Enmity with kin, elders, preceptor; sickly |
| NTP1-221 | 23 | Amrithapanam | Healthy; happy wife and children; good food; honoured by government |
| NTP1-222 | 24 | Dhanarjana | Respectable, wealthy, successful, many profits |
| NTP1-223 | 25 | Kirita visarjana | Loss of profession and status; unhappy; rebuked, discarded |
| NTP1-224 | 26 | Athi nidra | Tamasic; rheumatism and liver diseases; conflict with government |
| NTP1-225 | 27 | Stree sambhogam | Lustful and irritable; blames others; sorrowful |

### 12b. Thithi, Zero Rasis, Karana

- **NTP1-226** · Thithi = (Moon − Sun) ÷ 12°, Moon − Sun taken mod 360° (add 12 signs if negative); quotient + 1 = thithi number 1–30 (1–15 Shukla, 16–30 Krishna). Example 335°20′ → 28th = Krishna Trayodashi. · (NTP-1, PDF pp. 16–17) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-227** · **Zero Rasis (Dagdha / "burnt" signs)**: for one born on a thithi, these signs "become useless" (Iyer's research version). By thithi name (same for both pakshas, implied): 1 Padyami Thula–Makara; 2 Dwitiya Dhanus–Meena; 3 Thritiya Simha–Makara; 4 Chaturthi Vrishabha–Kumbha; 5 Panchami Mithuna–Kanya; 6 Shasti Mesha–Simha; 7 Saptami Kataka–Dhanus; 8 Ashtami Mithuna–Kanya; 9 Navami Simha–Vrischika; 10 Dashami Simha–Vrischika; 11 Ekadasi Dhanus–Meena; 12 Dwadasi Thula–Makara; 13 Trayodashi Vrishabha–Simha; 14 Chaturdasi Meena–Mithuna–Kanya–Dhanus (four); Full Moon and New Moon: none. · Effect of a planet/bhava in a Zero Rasi is not spelled out in NTP-1 ("please read my chapter on Thithi" — not in this volume); the ashtakavarga rule (NTP1-134) lists Zero-rasi as a reducing condition "to be guessed". · (NTP-1, PDF pp. 17–18) · VERIFIED-ON-PDF · COMPUTABLE (which signs) / UNCERTAIN (effect)
- **NTP1-228** · Chaturthi, Navami, Chaturdasi are *Riktha* thithis (not for auspicious functions; general, not individual). · (NTP-1, PDF p. 18) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-229** · Karana table: each thithi has two karanas (first half, second half); Kimstughna = first half of Shukla Padyami; Shakuni = second half of Krishna Chaturdasi; Chatushpada and Nagava = Amavasya; these four are **Sthira** karanas, the other seven (Bava, Balava, Kaulava, Taitila, Garaja/"Kharaji", Vanija, Bhadra/Visti) are **Chara**, repeating in order. **Visti and Sthira karanas are unfavourable.** Undertakings begun in one's **birth karana** succeed whatever its nature. · (NTP-1, PDF pp. 25–26) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-230** · Iyer: published effects of birth year, month, weekday, star, thithi, yoga, karana, lagna mostly fail; only the yoga effects (§2b) "may be relied upon to a certain extent". · (NTP-1, PDF pp. 21–22) · VERIFIED-ON-PDF · n/a (display guidance)

### 12c. Tatwa (birth tatwa)

- **NTP1-196** · Tatwa cycle from local sunrise: durations **Prithvi 6, Appu 12, Tejas 18, Vayu 24, Akasha 30 min**; aroha order Prithvi→Appu→Tejas→Vayu→Akasha (cyclic), then avaroha in reverse; one aroha+avaroha cycle = 3 h, 8 cycles/day. First tatwa at sunrise by weekday: **Wednesday Prithvi; Monday & Friday Appu; Sunday & Tuesday Tejas; Saturday Vayu; Thursday Akasha.** Sexes: Prithvi, Tejas, Akasha male; Appu, Vayu female. Antara/antarantara tatwas split like dasha-bhuktis over the 3-hour cycle. · (NTP-1, PDF pp. 85–89) · VERIFIED-ON-PDF (p. 86) · COMPUTABLE
- **NTP1-197** · Use and effects: a male is born in a male tatwa, a female in a female tatwa (used to check birth time); at a turning point the opposite sex may be born with mixed traits ("womanish" male / "malish" female); sometimes female at Akasha midpoint, male at Vayu midpoint. Born in **aroha** tatwa → gradual rise with age; **avaroha** → declining. **Prithvi** → earthly, materialistic; **Tejas** → impressive, powerful (statesmen, politicians, engineers); **Akasha** → deep thinkers, philosophers, scientists, inventors, little attachment to material things. · (NTP-1, PDF pp. 87–89) · CLEAR · COMPUTABLE (tatwa) / NOT-COMPUTABLE (birth-time correction)

### 12d. Years, Ayana, Hora mapping

- **NTP1-231** · 60-year cycle mapped onto the zodiac: 5 years per sign, 6° each, starting with **Pramadi (Pramathi, #13) at Mesha 0–6°** (Kali yuga began in Pramadi), Vikrama 6–12°, Vishu 12–18°, Chitrabhanu 18–24°, Swabhanu 24–30°, Tharana from Vrishabha 0°, … Bahudhanya at Meena 24–30°. "A planet situated at a position gives out its effects during the year etc., appropriate to that point." Iyer's own research note, unfinished. Year names ↔ Gregorian start years given (Prabhava 1987 … Kshaya 2046). · (NTP-1, PDF pp. 11–13) · VERIFIED-ON-PDF (p. 12) · COMPUTABLE (mapping) / UNCERTAIN (how to apply)

### 12e. Nakshatra gandas and special stars (birth)

Iyer's warning: secondary tests for the non-expert, "not always gospel truths"; thithi and nakshatra gandas affect parents; lagna ganda affects the native **unless Jupiter is in or aspects the lagna**. · (NTP-1, PDF p. 78) · CLEAR

- **NTP1-232** · Gandantha stars: Ashwini-1, Makha-1, Moola-1, Aslesha-4, Jyesta-4, Revati-4 (padas at sign/star junctions). 2 ghatis around Aslesha/Makha, Jyesta/Moola, Revati/Ashwini junctions are bad; navagraha shanti advised. · (NTP-1, PDF pp. 68, 79) · VERIFIED-ON-PDF (p. 68) · COMPUTABLE
- **NTP1-233** · Abhukta Moola: last ghati (24 min) of Jyesta + first 2 ghatis (48 min) of Moola — traditional advice not to see the child for 8 years. Antharala (12 min around Jyesta/Moola junction): bad for a male child, no dosha for a female. · (NTP-1, PDF pp. 68, 80) · VERIFIED-ON-PDF (p. 68) · COMPUTABLE (sensitive — consider not displaying)
- **NTP1-234** · Srishti / Sthithi / Laya: stars from Ashwini in threes = creative, sustaining, destructive; padas 3–4 of a Laya star = **Durithamsha**, "very bad". · (NTP-1, PDF p. 68) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-235** · Adhomukha (downward-looking) stars: Bharani, Krittika, Aslesha, Makha, Pubba, Vishaka, Moola, Poorvashada, Poorvabhadra. Vainashika star = 22nd from birth star (avoid for muhurtha). · (NTP-1, PDF p. 68) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-236** · Pada gandas (traditional): Ashwini-1 bad to father 3 months; Bharani-3 bad to child 27 days; Rohini-1 maternal uncle, -2 father, -3 mother, -4 good; Pushyami + Kataka lagna male by day → father, female by night → mother; Pushyami first part → maternal uncle; Aslesha-1 auspicious, -2 child, -3 mother, -4 father (some say mother-in-law); Makha-1 father 5 months; Uttara-1 & -4 parents/siblings 3 months; Chitra-1/2/3 parents/siblings 6 months; girl in Vishaka-4 afflicts husband's siblings; Jyesta in 10 parts (grandmother, grandfather, parents & mother's siblings, siblings, native, all good, wife, native, father, mother); Jyesta-4 father 9 months; Moola in 12 parts (father, mother, brother, sister, father-in-law, father's siblings, mother's siblings, money loss, livelihood loss, poverty/servants, native, native) for 3 months; Moola-1 father, -2 mother, -3 money, -4 good; Poorvashada + Dhanus lagna by day → father; at sunrise/sunset/midnight in Poorvashada+Dhanus or Pushyami+Kataka → bad to himself; Revati-4 father 3 months. Shantis listed. · (NTP-1, PDF pp. 78–81) · CLEAR · COMPUTABLE (sensitive; Iyer himself discounts them)

---

## 13. Karakatwa tables (compact)

### 13a. Signs (Rasis)

Rules: castes in fours from Meena (Brahmin, Kshatriya, Vaisya, Shudra); directions in fours from Mesha (E, S, W, N); Mesha–Kataka night signs, Simha–Vrischika day, Dhanus–Makara night, Kumbha–Meena day; movable/fixed/dual in threes; Dwaita/Adwaita/Vishishtadwaita in threes; male/female, odd/even, fierce/gentle alternate; Dwara/Bahya/Garbha and Dhatu/Moola/Jeeva in threes; **childless signs: Vrishabha, Simha, Kanya, Vrischika**. Gochara commodity rules: a sign's articles perish when Jupiter transits 2,4,5,7,9,10,11 from it, Mercury 2,5,8,10,11, Venus 6,7; malefics in 3,6,10,11 make them flourish. · **NTP1-237** · (NTP-1, PDF pp. 34–36) · VERIFIED-ON-PDF · COMPUTABLE

**NTP1-238** · Per-sign details (NTP-1, PDF pp. 36–40) · VERIFIED-ON-PDF · COMPUTABLE:

| Sign | Rising | Nature | Sex/temper | Dir. | Day/Night | Caste | Tatwa | Body part | Colour | Other |
|---|---|---|---|---|---|---|---|---|---|---|
| Mesha | Prishtodaya | Movable, odd, Dwara, mineral | Male, fierce | E | Night | Kshatriya | Tejas | Head | Red | Forest, quadruped, goat; bilious fever, liver |
| Vrishabha | Prishtodaya | Fixed, even, Bahya, vegetable | Female, soft | S | Night | Vaisya | Prithvi | Face | White | Meadows; bullock; dairy |
| Mithuna | Ubhayodaya | Dual, odd, Garbha, human | Male, fierce | W | Night | Shudra | Vayu | Neck | Green | Bedroom; biped; catarrh, asthma, colic |
| Kataka | Prishtodaya | Movable, even, Dwara, mineral | Female, soft | N | Night | Brahmin | Jala | Heart | White | Watery; insanity, wind disease |
| Simha | Shirodaya | Fixed, odd, Bahya, vegetable | Male, fierce | E | Day | Kshatriya | Tejas | Stomach | — | Mountain; lion; fever, boils |
| Kanya | Shirodaya | Dual, even, Garbha, human | Female, soft | S | Day | Vaisya | Prithvi | Waist | Variegated | Maiden; venereal disease |
| Thula | Shirodaya | Movable, odd, Dwara, mineral | Male, fierce | W | Day | Shudra | Vayu | Lower abdomen | Dark | Human sign; trade; brain fever, typhoid |
| Vrischika | Shirodaya | Fixed, even, Bahya, vegetable | Female, soft | N | Day | Brahmin | Jala | Sex organs | Brown | Reptile; spleen, jaundice, sprue |
| Dhanus | Prishtodaya | Dual, odd, Garbha | Male, fierce | E | Night | (not given) | Tejas | Thighs | Brown | First half biped, latter quadruped |
| Makara | Prishtodaya | Movable, even, Dwara, mineral | Female, soft | S | Night | Vaisya | Prithvi | Knees | Mixed | First half quadruped, latter watery; stomach-ache, aberration of mind |
| Kumbha | Shirodaya | Fixed, odd, Bahya, vegetable | Male, fierce | W | (not given) | Shudra | Vayu | Buttocks | — | Pot; cough, fever, consumption |
| Meena | Ubhayodaya | Dual, even, Garbha, human | Female, soft | N | **Night** (detail) vs **Day** (rule) | Brahmin | Jala | Feet | Blue | Fish; dropsy (jalodara) |

Conflict: Meena is "Night" in its detail entry but a Day sign in rule 3 (p. 34). Countries per sign are also listed (pp. 36–40) — omitted here.

### 13b. Bhavas

**NTP1-239** · Significations (NTP-1, PDF pp. 41–45) · CLEAR (p. 45 VERIFIED-ON-PDF) · COMPUTABLE (lookup):

| Bhava | Main significations (Iyer's list, abridged) |
|---|---|
| 1 Thanu | Body, strength, complexion, head, appearance, fame, conduct, perception, happiness, current birth, birthplace, longevity |
| 2 Dhana | Family (changes with age — mother, then parents, household, spouse, children), money, right eye, speech, authorship, hands, food, face, traditional learning (scripture, astrology, Ayurveda), documents |
| 3 Bhratru | Younger siblings, valour, ear, servants, minor debts, chest, partition of property |
| 4 Mathru | Mother, relations, friends, **higher education** (2nd = classic/family education), houses, lands, vehicles, comfort, treasure, trade, water, conjugal life (esp. female chart), heart, cows, clothes, ornaments, happiness |
| 5 Putra | Children, intelligence, spiritual knowledge, past karma, mantras, intuition, superiors, royal favour, brain, lower abdomen/uterus, minister, Atman, knowledge of future, Sruti/Smriti, pregnancy |
| 6 Shatru | Enemies, debt, disease (temporary/curable), theft, quarrels among relations, venereal disease, litigation, imprisonment, wounds, domestic misery, transfers, hip |
| 7 Kalatra | Spouse, sexual desire, sex organs, son-in-law, issues by second wife, trade, death, marriage, travel, passion, gambling, public, open opponent, litigation, kidneys |
| 8 Ayur | Longevity and death, sudden death, chronic/hereditary/incurable disease, failures, persecution, imprisonment, suicide, defeat, emigration, sudden distant transfer, widowhood, will, legacy. Powerful 8th lord lengthens life; malefic in the 8th shortens; 8th events come suddenly |
| 9 Bhagya | Virtue, dharma, **father**, preceptor, wealth, paternal property, charity, yoga, renunciation, medicine, holy sacrifices, faith, fame, luck, grandson, distant travel / sea voyage |
| 10 Karma | Profession, fame, knees, trade, service rank, honour, livelihood, command, superior officer; also obsequies |
| 11 Labha | Gains, elder siblings, many women, honours, treasure, fulfilment, left ear, good news, friends, second wife |
| 12 Vyaya | Loss, expenditure, distant travel, sleep and bed comforts, litigation, imprisonment, salvation (mukti), feet, left eye, secret enemies, hospital, suicide. **Ketu powerful and auspicious in the 12th + death in Ketu dasha → no more births** |

- **NTP1-240** · Travel by house: 3rd and 6th not good; 8th sudden, mostly bad; 12th far-distant; 7th short happy trips (pleasure/business); 9th best — name, fame, prosperity, foreign tour. · (NTP-1, PDF p. 44) · CLEAR · COMPUTABLE
- **NTP1-241** · 6th-house sickness = temporary, curable; 8th-house sickness = long-standing, incurable, hereditary. · (NTP-1, PDF p. 43) · CLEAR · COMPUTABLE

### 13c. Planets

**NTP1-242** · General planet statements (NTP-1, PDF pp. 45–46) · VERIFIED-ON-PDF · COMPUTABLE (as karaka hints):
- Sun, Rahu, Jupiter cause multiple sons; Moon one son (maybe more daughters); Mars, Mercury, Saturn cause adoptive sons. Sun, Rahu, Jupiter good for progeny. Sun good for partner's welfare. Saturn good for longevity and younger siblings. Jupiter, Saturn, Ketu good for ethics. Rahu → bereft of rituals. Moon and Venus → showy.
- Sexual partners: Sun family ladies; Moon, Jupiter, Venus wife; Mars woman with deformity; Mercury artisan; Saturn older, sickly or ascetic woman; Rahu widow/divorcee.
- Buildings: Sun thatched hut; Moon, Venus terraced; Mars, Ketu mud & brick; Mercury artistic; Jupiter wooden; Saturn, Rahu stone.
- Religions (combinations): Rahu+Venus Christianity; Venus+Saturn Islam; Jupiter+Venus Buddhism; Sun+Venus Zoroastrianism; Mercury+Mars or Mercury+Saturn Hanuman; Rahu+Mars+Saturn stone-worship/fetish (pp. 47, 55).
- Worshipping the deity of an afflicted planet during its period mitigates evil (p. 55).

**NTP1-243** · Compact planet table (NTP-1, PDF pp. 46–67) · VERIFIED-ON-PDF (pp. 46–47, 58–67) / CLEAR (pp. 48–57) · COMPUTABLE (lookup):

| | Sun | Moon | Mars | Mercury | Jupiter | Venus | Saturn | Rahu | Ketu |
|---|---|---|---|---|---|---|---|---|---|
| Principle | Soul | Mind | Force/strength | Speech, worldly knowledge | Spiritual knowledge | Desire, worldliness | Sorrow, labour | — | — |
| Royal role | King | Queen | Commander | Prince | Minister | Minister | Servant | — | — |
| Key relatives | Father | Mother | Younger siblings | Maternal uncle | Children | Wife | (longevity) | Grandparents | Maternal grandmother |
| Caste (Sarvartha, preferred) | Kshatriya | Vaisya | Kshatriya | Vaisya | Brahmin | Brahmin | Shudra | Pariah | lower castes |
| Guna | Sattva | Sattva | Rajas | Rajas | Sattva | Rajas | Tamas | Tamas | Tamas |
| Element | Fire | Water | Fire | Earth | Ether | Water | Air | — | — |
| Direction | E | NW | S | N | NE | SE | W | SW | SW |
| Body (limb) | Head | Face | Chest | Hips | Belly | Pelvis/sex organs | Thighs | Two hands | Two legs |
| Dhatu | Bones | Blood | Marrow | Skin | Brain | Semen | Muscles/nerves | — | — |
| Gem | Ruby | Pearl | Coral | Emerald | Topaz | Diamond | Sapphire | Agate (Gomedha) | Lapis/turquoise (Vaidurya) |
| Grain | Wheat | Rice | Tur dal | Green gram | Bengal gram | Cow gram | Sesame | Black gram | Horse gram |
| Metal | Copper | Gems/pearl/coral | Gold | Brass | Gold | Silver | Iron | — | — |
| Colour | Dark red-brown | White | Blood red | Green | Yellow | Variegated/light blue | Black | Black | Dark red |
| Taste | Pungent | Salt | Bitter | All | Sweet | Sour | Astringent | Sour | Sour |
| Number | 1, 4 | 2, 7 | 9 | 5 | 3 | 6 | 8 | — | — |
| Thithis | 1, 11 | 2, 12 | 6 | 7 | 3, 8, 13 | 4, 9, 14 | 5, 10, 15, 30 | — | — |
| Letters | A-varga | Ya-varga | Ka-varga | Ta-varga | Tha-varga | Cha-varga | Pa-varga | — | — |
| Season | Grishma | Varsha | Grishma | Sharad | Hemantha | Vasantha | Shishira | — | — |
| Period (horary) | 6 months | 48 min | 1 day | 2 months | 1 month | 15 days | 1 year | 1 year | — |
| "Years" in karaka list | 50 | 70 | 16 | 20 | 30 | 7 | 100 | 100 | — |
| Distance | 72 mi | 2 mi | 63 mi | 72 mi | 81 mi | 144 mi | 180 mi | 80 mi | — |
| Natural diseases | Liver/heat fever, eye, teeth, neuralgia | Sleep disorders, lungs, diarrhoea, lunacy, phlegm, jaundice, water dangers | Bilious fever, marrow injury, heat, smallpox, ulcers | Mental, skin, anaemia, liver, intestines | Appendicitis, phlegm, anaemia, liver, ear | Anaemia, liver, jaundice, seminal, urinary, genital | Wind & phlegm, paralysis, rheumatism, indigestion, deformity | Epidemics, hysteria, poison, epilepsy, cancer, skin, leprosy, heart palpitation | Poison, consumption, scorpion bite, typhoid |

Notes: Iyer prefers Sarvartha Chintamani's castes over Varahamihira's (p. 47). The "years" column is printed in each karaka list without explanation (p. 59 Sun "50 years" confirmed on PDF; meaning not stated — do not label it as an age of maturity). Strength-time entries conflict (see NTP1-102). Mercury's own-sign ownership and moolatrikona are in Kanya; Mercury's direction North.

### 13d. Stars (Nakshatras)

**NTP1-244** · Star table (NTP-1, PDF pp. 27, 67–77) · VERIFIED-ON-PDF (pp. 67–73) / CLEAR (pp. 74–77) · COMPUTABLE (lookup):

| # | Star | Lord | Deity | Sex | Caste (p. 70) | Tatwa | Body part (p. 71) | Region |
|---|---|---|---|---|---|---|---|---|
| 1 | Ashwini | Ketu | Ashwini Devas | M | Vaisya | Prithvi | Upper foot (table) / bottom of foot (p. 73) | NE |
| 2 | Bharani | Venus | Yama | F | Chandala | Prithvi | Bottom of foot | NE |
| 3 | Krittika | Sun | Agni | F | Brahmin | Prithvi | Head | Central |
| 4 | Rohini | Moon | Brahma | F | Shudra | Prithvi | Forehead | Central |
| 5 | Mrigasira | Mars | Soma | Eunuch | Serving | Prithvi | Eyebrows | Central |
| 6 | Aridra | Rahu | Rudra | F | Butcher | Jala | Eyes | East |
| 7 | Punarvasu | Jupiter | Aditi | M | Vaisya | Jala | Nose | East |
| 8 | Pushyami | Saturn | Brihaspati | M | Kshatriya | Jala | Face | East |
| 9 | Aslesha | Mercury | Sarpa | F | Chandala | Jala | Ears | SE |
| 10 | Makha | Ketu | Pitru | F | Shudra | Jala | Lips & chin | SE |
| 11 | Pubba | Venus | Aryama | F | Brahmin | Jala | Right hand | SE |
| 12 | Uttara | Sun | Bhaga | F | Kshatriya | Tejas | Left hand | South |
| 13 | Hasta | Moon | Savitha | M | Vaisya | Tejas | Fingers | South |
| 14 | Chitta | Mars | Twashta | F (p. 75) | Serving | Tejas | Neck, chest | South |
| 15 | Swati | Rahu | Vayu | F (p. 75) | Butcher | Tejas | (absent in table; chest p. 75) | SW |
| 16 | Vishaka | Jupiter | Indragni | F (p. 75) | Chandala | Tejas | Breasts | SW |
| 17 | Anuradha | Saturn | Mitra | M | Shudra | Tejas | Stomach | SW |
| 18 | Jyesta | Mercury | Indra | F (p. 76) | Serving | Vayu | Right side of trunk | West |
| 19 | Moola | Ketu | Nirruti | Eunuch | Butcher | Vayu | Left side of trunk | West |
| 20 | Poorvashada | Venus | Apa | F | Brahmin | Vayu | Back of trunk | West |
| 21 | Uttarashada | Sun | Vishwe Devas | F | Kshatriya | Vayu | Waist | NW |
| 22 | Sravana | Moon | Vishnu | M | Chandala | Vayu | Sex organs | NW |
| 23 | Dhanista | Mars | Ashtavasu | F | Serving | Akasha | Anus | NW |
| 24 | Shatabhisha | Rahu | Varuna | Eunuch | Butcher | Akasha | Right thigh | North |
| 25 | Poorvabhadra | Jupiter | Ajaikapada | M | Brahmin | Akasha | Left thigh | North |
| 26 | Uttarabhadra | Saturn | Ahirbudhnya | M | Kshatriya | Akasha | "Chin" (prob. shins) | North |
| 27 | Revati | Mercury | Pusha | F | Shudra | Akasha | Ankles | NE |

- **NTP1-245** · Star sex decides child sex together with planet and sign; strongest of the three predominates (NTP1-093). · (NTP-1, PDF pp. 67–68) · VERIFIED-ON-PDF · COMPUTABLE
- **NTP1-246** · Disease location: lord of 6 (house of disease) — its star's body part, and the navamsa star chain, shows where disease starts and settles (example: Venus 6th lord in Rohini-1 → face to upper foot). Full method in NTP-2. · (NTP-1, PDF pp. 71–72) · VERIFIED-ON-PDF · PARTLY
- **NTP1-247** · Star positions in signs: whole stars, equal-split stars, unequal-split stars, commencing stars, ending stars — "each has its own characteristic" (not described in NTP-1). · (NTP-1, PDF p. 91) · CLEAR · COMPUTABLE (classification) / NOT-COMPUTABLE (effect)

---

## 14. Miscellaneous computable notes

- **NTP1-248** · Lunar months take the name of the full-moon star (Chitra→Chaitra … Uttara Phalguni→Phalguna); Paksha: Shukla from conjunction to opposition, Krishna from opposition to conjunction. · (NTP-1, PDF pp. 14–15) · CLEAR · COMPUTABLE
- **NTP1-249** · A planet in Lagna, or the lord of the lagna drekkana, shows the season at birth. · (NTP-1, PDF p. 57) · CLEAR · COMPUTABLE
- **NTP1-250** · Brahmin's Veda-shakha from the strongest planet (Jupiter Rig, Venus Yajur, Mars Sama, Mercury Atharva; Sun+Mercury Vedic literature generally). · (NTP-1, PDF p. 49) · CLEAR · COMPUTABLE (cultural; low priority)

---

## 15. Open questions / pages needing review

### Not found in NTP-1 (look in NTP-2 / NTP-3)
1. **Avayogi** and **Duplicate Yogi** — named (PDF pp. 105, 122) but never defined. No Avayogi formula (e.g. a fixed offset from the Yoga point) appears in this volume.
2. **Positive / negative planets** — referred to Part II (PDF pp. 118, 122).
3. **"Yogi planets in sets/groups of three"** — no such statement anywhere in NTP-1 (see NTP1-061).
4. **Combustion orbs** and **graha-yuddha orb** — not given (NTP1-086, -087).
5. **Planetary friendship table / friendly & enemy signs** — used but not given (NTP1-067).
6. **Sthana bala** — named, not explained (PDF p. 107).
7. **Effect of a planet in a Zero Rasi** — the "chapter on Thithi" Iyer refers to is not in this volume (PDF p. 17).
8. Division charts, Mathematical Navamsha Diagram, birth-time rectification by past events — NTP-2 (PDF pp. 72, 85, 96, 105, 119).

### Internal inconsistencies / ambiguous wording (as printed)
9. **PDF p. 66–67**: Rahu *and* Ketu both "exalted in Vrischika"; p. 118 says no planet is exalted in Vrischika (counts only seven planets). Verified on PDF — a source inconsistency, not OCR.
10. **PDF p. 108**: Ayana bala lists Moon under both northern and southern declination; Mars in neither.
11. **PDF pp. 53–54 vs p. 107**: Mercury listed as both shirodaya and prishtodaya; Sun "powerful during night" (p. 54) vs Sun strong by day (Kala bala, p. 107).
12. **PDF p. 34 vs p. 40**: Meena is a Day sign by the rule but "Night" in its own description.
13. **PDF p. 70–71**: Hasta is both "movable" and "light"; Punarvasu has no nature class.
14. **PDF p. 71 vs pp. 73, 75**: star body-part table omits Swati and gives Ashwini as "upper part of foot" while the detailed list gives "bottom of foot"; Uttarabhadra "chin" probably means shins.
15. **PDF p. 122**: Kuja-dosha positions for mangalyam "1, 2, 5, 8 and 12" — from the 12th Mars does not aspect the 8th by Iyer's own aspect rules.
16. **PDF p. 120**: "though there is a malefic in the eighth house" — meaning unclear.
17. **PDF p. 28**: Graha Samayam — inclusive or exclusive sign counts; meaning of remainder 0; no worked example.
18. **PDF p. 149**: in the worked example Mars at 8-25-4 is given 4⅚ net rays (max 5). Iyer's own proportional rule (zero at debilitation) gives about 4.1 for Mars ~33° from 28° Makara, while Jupiter's 6 5/9 does match the rule. Either a misprint of Mars's longitude or a different measure — review before coding the ray method.
19. **PDF p. 149**: "Reduce by 1/6" for debilitated/inimical amsha — subtract one-sixth, or reduce to one-sixth?
20. **PDF p. 140**: ashtakavarga reductions for set / debilitated / Zero-rasi contributors are "to be guessed by the readers" — no values.
21. **PDF p. 132**: classification of a planet owning one good and one dusthana bhava (F.B. or F.M.?) is not stated.
22. **PDF p. 118** (cond. 4): "exalted with Digbala and in good Bhava" — joint or alternative conditions.
23. **PDF p. 127**: "planets on either side" — adjacent signs only, or any equal distance?
24. **PDF pp. 140 vs 153**: embedded text gives Chart No. 1 as 19-6-**1902**; the page image (pp. 141, 154) reads **1907**. Use 1907.
25. **PDF p. 153 (Chart I)**: the rasi diagram shows Sun at Mithuna 4°37′, but the fecundity example (p. 148) uses Sun = 2-4-34 — minor discrepancy in the example data.
26. **PDF p. 12**: "every Rasi has 60 years, 12 months and 30 thithis" (embedded text reads "72 months"; image reads 12) — the zodiacal-year theory is unfinished research; do not implement beyond the mapping.

### Pages not inspected as images (text and OCR agreed; transcription considered CLEAR)
PDF pp. 10–11, 13–16, 41–44, 48–57, 74–81, 83–85, 87–91, 98–100, 102–104, 106, 110–111, 119, 123–125, 129–131, 142, 146, 156–159. All other pages from 12 to 155 that carry rules were inspected as images. Highest-value pages to spot-check if the developer codes from them: **p. 99** (bhukti arithmetic), **pp. 110–111** (pancha-mahapurusha and Sunapha wording), **pp. 156–159** (appendix templates).

### Notes for the developer (app differences)
- Iyer: **Lahiri/GoI ayanamsa**, **Sripati (quadrant-trisection) cusps used as bhava *middles***, **mean node**, **Vimshottari from Moon with 365-day (solar) years**, optional **+41 days/yr birth-dasha rectification**. If the app follows KP (Placidus cusps as house *starts*, KP ayanamsa, often true node), Iyer's bhava placements and lordships will differ for planets near cusps — show Iyer notes with that caveat or compute Iyer's bhavas separately.
- Iyer's **Sookshma lord = star lord of the cusp** is directly compatible with KP cusp star lords.

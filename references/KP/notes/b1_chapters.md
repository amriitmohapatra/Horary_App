# B1 "Casting the Horoscope" (Stellar Astrological Reader No. 1): relevance verdicts (b1)

Reader: agent b1. Scope: all 18 vault notes `B1-00` … `B1-17` (PDF pp. 1–169) and the 30
figures in `vault/B1 Casting the Horoscope/Figures/`. Rule IDs in `b1_rules.md` are
`KP1-001` … `KP1-103` (plus `KP1-079a`). Worked charts are in `b1_examples.json` (`b1-E01` … `b1-E26`).

Verdict legend (from the brief): **EXISTS** · **NEW-COMPUTABLE** · **NEW-GUIDANCE** · **HORARY** ·
**NOT-RELEVANT**. "REJECTED-TRADITION" marks the parts where Krishnamurti quotes traditional
rules only to dismiss them (catalogued as rule status in `b1_rules.md`).

**What this book is.** B1 is the casting manual: time standards, sidereal time, Raphael's
Placidus tables of houses, the Krishnamurti ayanamsa, Vimshottari arithmetic, Fortuna, and a
Western-aspect chapter. Most of the procedure already EXISTS in the app, which computes it
exactly with the Swiss Ephemeris. The book is still valuable for two reasons:

1. **Validation fixtures.** Every number in the worked charts was re-computed for this report
   with the app's own Swiss Ephemeris WASM (`kaast2/tests/engine/boot.ts`, scratch scripts only;
   no app code touched). The book's planets agree to about 1′ with the Swiss Ephemeris when
   three conditions hold: the ayanamsa is PL's "Krishnamurti New" (≈ Swiss `SIDM_KRISHNAMURTI`),
   the node is the **mean** node, and the cusps are Placidus.
2. **Two decisions it settles for the app.** See `b1_rules.md` KP1-003/004 for the ayanamsa
   and KP1-031 for the mean node.

> **Chapter-split and caption warnings (matter for citations).**
> - Fig. B1.29 (p. 168) is captioned in the vault as the corrected chart of the Tenkasi
>   native (15-5-1943). The image actually holds the same planets as Fig. B1.28: it is the
>   **corrected chart of the Palghat native** (case 1), with Lagna Virgo 28°57′. The Tenkasi
>   case (case 2) has no chart, only the two small tables on p. 169.
> - Fig. B1.25 (p. 159) prints "Birth at 2-30 P.M. on 7-3-1943". The text says the native
>   gave "about 3-45 a.m. on 7-3-1944" and concludes "2-40 a.m.". The printed planets match
>   **7-3-1944** in the early morning (Saturn Tau 26°56′, mean Rahu Can 11°43′; checked).
> - Fig. B1.28 prints "27-1-1937". The planets (Sun in Aries, Venus R in Pisces, Mars R in
>   Scorpio) only fit **27-4-1937**, which also gives the corrected Lagna Virgo 28°5x′ at 5-30 p.m.

| Ch. | Title (vault) | PDF pp. | Content in one line | Verdict(s) | Reason |
|---|---|---|---|---|---|
| B1-00 | Front Matter | 1–2 | Cover (Fig. B1.1) and title page | NOT-RELEVANT | No doctrine |
| B1-01 | Preface | 3–4 | Almanacs disagree. A chart must be exact to the minute. KP predictions need the KP ayanamsa only (KP1-001) | NOT-RELEVANT (+ one rule that EXISTS) | Polemic. The KP page already uses a Krishnamurti ayanamsa |
| B1-02 | Introduction | 5–9 | Drik (observed) vs Vakya almanacs; use a modern ephemeris | NOT-RELEVANT (+ KP1-101 REJECTED-TRADITION: Vakya) | The app uses the Swiss Ephemeris (Drik) |
| B1-03 | About the Author and the Banjar Visit | 9–16 | Visit to Banjar, May 1969. Speeches. Sub = 9 parts of a star in Vimshottari proportion. Use Raphael or the Krishnamurti Ephemeris | NOT-RELEVANT | Anecdote. Sub theory EXISTS |
| B1-04 | What Shri M. Kittur Says | 16–18 | Praise. The sub explains twins | NOT-RELEVANT | Testimonial |
| B1-05 | What Shri V.K. Srinivasan Says | 18–21 | Praise. KSK born 1-11-1908 at Tanjore. Horary number 1–249 and ruling planets (RPs) mentioned; rectification by RPs | NOT-RELEVANT | Testimonial. RP doctrine is catalogued from B1-11/15/17 |
| B1-06 | The Mother Earth | 22–31 | Earth's shape, poles, latitude and longitude, the date line (Figs. B1.2–3) | NOT-RELEVANT | School geography |
| B1-07 | The Heavens | 31–36 | Celestial sphere, equator, RA and declination, ecliptic, zodiac belt ±7½°. Definition of a **parallel** of declination (p. 36) | NOT-RELEVANT (+ parallel definition → NEW-COMPUTABLE via KP1-068) | Astronomy primer |
| B1-08 | Different Kinds of Time | 36–53 | Sidereal day; mean vs apparent sun; table of national standard times and adoption dates (India 1-1-1906, GMT+5:30, 82°30′E); LMT conversions (Madras, Calcutta, Mangalore, New York); the manual sidereal-time recipe | EXISTS (time conversion is in the app) + NOT-RELEVANT (manual recipe) | The worked LMT examples are kept as fixtures (b1-E17) |
| B1-09 | The Ephemeris | 53–61 | How to read Raphael's Ephemeris. Five worked sidereal-time calculations for 15-5-1963 (Agra, Allahabad, Ahmedabad, Boston, San Francisco) | NOT-RELEVANT (procedure) + EXISTS | Raphael's noon sidereal times re-computed exactly with Swiss GMST (KP1-013). Fixtures b1-E06…E10 |
| B1-10 | Signs and Houses | 62–82 | Sign symbols (Fig. B1.4). Eight house systems; KP uses Raphael's Placidus tables. Four worked cusp interpolations; planets for Agra 15-5-1963; **the Krishnamurti ayanamsa** (291 AD, 50.2388475″/yr) and **the year table 1840–2001**; sayana → nirayana (Fig. B1.5) | EXISTS (Placidus, sayana→nirayana) + NEW-COMPUTABLE (ayanamsa table and variant choice KP1-002…004; mean node KP1-031) | The most important chapter for the app's KP ayanamsa decision |
| B1-11 | Ayanamsa – Verification | 83–114 | "Proof" of the KP ayanamsa through dasa timing of marriage and childbirth (wife and husband charts) and through ruling planets (birth star, an exalted Jupiter, Saturn's ingress, a lagna, an interview time). Map forms A/B/C and the Western wheel; navamsa table; Vimshottari arithmetic and the bhukti table (Figs. B1.6–16) | HORARY (RP verification and rectification, KP1-090…099) + NEW-GUIDANCE (marriage 2-7-11, child 2-5, KP1-084/085; transit confirmation KP1-087) + EXISTS (navamsa, dasa) + NEW-COMPUTABLE (ruling planets of a moment, KP1-090) | Rules sit inside the examples. Ch. 11 dasa dates re-checked: they reproduce with 365.25-day years (KP1-045) |
| B1-12 | How to Make Use of Krishnamurti Ephemeris | 115–130 | KP Ephemeris (sidereal time at 5-30 p.m. IST for 82°30′E); 1918 examples; which year to use for dasa (Soura 365¼ d); dasa balance; **Fortuna = Asc + Moon − Sun**; ghati/vighati → IST; sunrise/sunset LMT tables 10–35°N; worked Tiruvarur chart 13-6-1934 (Figs. B1.17–21) | EXISTS (casting, dasa) + NEW-COMPUTABLE (Fortuna KP1-050; ghati→clock KP1-017) + NOT-RELEVANT (sunrise tables) | Fortuna is new to the app. Tiruvarur's printed Fortuna contains an arithmetic error (KP1-050 notes) |
| B1-13 | Aspects and Their Significance | 131–148 | Hindu sign aspects quoted and set aside. **Western aspects**: 18 angles and their quality, **orb tables** (per aspect, applying/separating; per planet Sun/Moon/others; 6° to cusps), applying/separating, mutual application, speeds, retrogradation, combustion, translation of light; tabulation of aspects to planets, cusps and Fortuna; judgment principles; KSK's own rule that the bhukti lord's aspect to the dasa lord colours the bhukti (Fig. B1.22) | NEW-COMPUTABLE (KP1-061…073) + NEW-GUIDANCE (KP1-072, 074…079) + REJECTED-TRADITION (KP1-060, 078) | The only KP aspect doctrine in the Readers with numeric orbs. The app has Parashari and PL aspects only |
| B1-14 | Casting a Horoscope Using Krishnamurti Ephemeris | 149–159 | Full worked chart, Guna 12-9-1935 (by a student): LMT, ST, cusps, planets, Fortuna, dasa balance, ready-reckoner, star/sub lords of planets and cusps, **4-column house significators**, planet→houses, **node rule** (Figs. B1.23–24) | EXISTS (cast, star/sub, A–D significators, which match the app's convention exactly) + NEW-COMPUTABLE (Fortuna; node significance order KP1-082) | Excellent fixture (b1-E12). One printed error: Moon's star |
| B1-15 | War Time or Civil Time | 159–161 | Rectifying a 1944 birth (war time or civil time?) with ruling planets; job event in Venus–Venus–Venus–Jupiter; service houses 2-6-10-11 (Fig. B1.25) | HORARY (KP1-096, 098) + NEW-GUIDANCE (service houses KP1-086) + EXISTS (India war time in the app) | Figure date/time misprinted (see warning above) |
| B1-16 | Erection of Horoscope – Worked Example | 161–166 | Full worked chart, Belgaum 11-6-1930 7-37 a.m.: LMT, ST, cusps, planets, Fortuna, dasa balance (Figs. B1.26–27) | EXISTS + NEW-COMPUTABLE (Fortuna) | Cleanest fixture in the book (b1-E14). All numbers reproduced to ≤2′ |
| B1-17 | Appreciation by Mr. K.C.S. – Correct Birth Time | 166–169 | Two rectifications by ruling planets: the Palghat chart (lagna Libra → Virgo 28°57′) and Tenkasi 15-5-1943 (time was war time → Leo lagna) (Figs. B1.28–30) | HORARY (KP1-096, 098) + NOT-RELEVANT (closing illustration) | Fixtures b1-E15/E16, E25/E26. Figure caption and date problems noted above |

## Counts

| Verdict | Chapters (a chapter can carry two) |
|---|---|
| NOT-RELEVANT | 00, 01, 02, 03, 04, 05, 06, 07, 08 (recipe), 09 (recipe), 12 (sunrise tables), 17 (closing figure): 12 |
| EXISTS | 01, 08, 09, 10, 11, 12, 14, 15, 16: 9 |
| NEW-COMPUTABLE | 07 (parallel), 10, 11, 12, 13, 14, 16: 7 |
| NEW-GUIDANCE | 11, 13, 15: 3 |
| HORARY | 11, 15, 17: 3 |
| (REJECTED-TRADITION parts) | 02, 11, 13 |

Chapters that are *only* NOT-RELEVANT: 00, 02, 03, 04, 05, 06 (6 of 18). Chapter 01 is
NOT-RELEVANT except for one rule that already EXISTS. Chapter 07 is NOT-RELEVANT except for
one definition.

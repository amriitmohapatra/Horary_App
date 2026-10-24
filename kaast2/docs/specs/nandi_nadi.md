# Nandi Nadi (Bhrigu Nandi Nadi): research notes and a proposed feature

Status: **RESEARCH / EXPERIMENTAL.** Written 2026-10-24. Nothing here is validated against the
family's ground truth, and nothing here changes the KP engine, the PL parity pages or any shipped
file. The feature in §3 is a proposal. It is not built.

Scope: what "Nandi Nadi" means in current practice, which of its rules are stated clearly enough to
compute, and a feature that Astro-Amriit could compute offline from a birth chart. The chart inputs
are sidereal longitudes, signs and retrograde flags, plus a native-sex setting. The Lagna is not used.

## 0. Conventions used in this document

**Source grades.**

| Grade | Meaning |
|---|---|
| **PRI** | R. G. Rao, *Bhrigu Nandi Nadi*. This is the root English text of the modern school. Page numbers come from a 327-page scanned copy and may be ±1 from the printed edition (Ranjan Publications, New Delhi, 2008, ISBN 978-81-88230-61-7, 332 pp.). Roman pages iii–iv are the Introduction. |
| **SEC** | A. Jagadeesan & K. Jothimani, "A Study of the Basic Rules in Bhrigu Nandi Nadi", *Int. J. Current Research and Modern Education* 7(2):23–31, 2022 (Vels University, School of Vedic Astrology). Open access: <https://zenodo.org/records/7489854>. It is the only scholarly-format summary found. Its English is rough and its example charts are images that were lost in the text extraction, so only the rule statements are usable. |
| **PRAC** | Practitioner articles and course pages (2025–2026). Each is useful for what is taught today, but none is authoritative. The individual sources are listed in §5. |
| **KRS** | Kapiel Raaj's own material: his "KRSchannel – Learn Astrology" YouTube channel and his "Nandi Nadi Astrology Course" (Magha Vedic Astrology Academy). Only titles, descriptions and the course outline could be read. The video transcripts were not reachable from this session. |
| **OPEN** | Not settled. The sources disagree, or no source states the rule. |

**Agreement.** *Strong* means PRI, SEC and most PRAC sources agree. *Moderate* means the
sources agree on the idea but not on the details. *Contested* means they conflict. *Single* means
only one source states it.

**Notation.**
- `s(P)` is the sidereal sign of planet P, 0 = Aries … 11 = Pisces. `deg(P)` is its degree within the sign.
- `h(A→B) = ((s(B) − s(A)) mod 12) + 1` is "B is in the h-th sign from A" (1 = same sign).
- Planet ids: Su Mo Ma Me Ju Ve Sa Ra Ke (as in `ARCHITECTURE.md` `Body.id`).
- All relations are **sign-to-sign (whole-sign)**. No orbs and no degree aspects are used.

---

## 1. What the term refers to

### 1.1 The name

- **Nandi Nadi** is one of the Nadi *granthas*, the texts said to be revealed by a sage. It is
  framed as a dialogue in which Nandikeswara, Shiva's bull, explains charts to a disciple. Rao's
  Chart 1 opens with "so said Nandikeswara to Markandeya" (PRI p. 9).
- **Bhrigu Nandi Nadi (BNN)** is the title of R. G. Rao's English compilation: "I have taken some
  portions from Nandi Nadi and some from Bhrigu Nadi. I have tried my best to explain the final
  band given in the Nadi for various planetary combinations" (PRI p. iv). The book analyses more
  than 500 example charts. SEC calls Rao the "founder of the Bhrigu Nandi Nadi system".
- **KRS usage.** The "KRS Astrologer" is **Kapiel Raaj** (YouTube *@KRSchannel*, sites
  krsastrology.com and astrologykrs.com). He sells a "Nandi Nadi Astrology Course" and makes
  videos titled "Nandi Nadi Astrology revealed", "How to make Combinations in Nandi Nadi Astrology
  for career", "Transit Lesson of Nandi Nadi in Astrology", "Nadi rule of 5th from your planet" and
  "What Saturn gives in career and Mahadasha in BNN Astrology". That last video links to the same
  course. KRS therefore uses "Nandi Nadi" and "BNN" for one school, the R. G. Rao line.
  **Conclusion: in the user's context, "Nandi Nadi" = Bhrigu Nandi Nadi (BNN).**
- **Not to be confused with** palm-leaf Nadi reading, as practised at Vaitheeswaran Koil in
  Tamil Nadu. There a reader finds a pre-written leaf by the native's thumb impression
  (Wikipedia, *Nadi astrology*). BNN needs no leaf. It is a method applied to an ordinary rasi
  chart. It is also distinct from the 150-part *nadiamsa* division used by Chandra Kala Nadi, which
  the project already met as D150 (`knowledge/06_decisions_log.md`).

### 1.2 How BNN differs from Parashari reading

| Aspect | Parashari | BNN (as taught from Rao) | Sources |
|---|---|---|---|
| Reference point | Lagna and the houses counted from it | **Planets.** Each karaka is its own "lagna". Lagna is "not considered as of primary importance" | PRI p. iii; SEC; PRAC (Sithars: Jupiter's sign = house 1) |
| Unit of reading | Houses, house lords, yogas | **Karakatva** (the fixed significations of each planet) and the **chain of planets linked to a karaka** | PRI p. iv, p. 10 ("mostly it is the 'Karakatwa' that holds the key") |
| Relations | Graha drishti (special aspects), degree aspects | **Sign relations**: same sign, adjacent signs (2nd/12th), 7th, trines (5th/9th), sign exchange | PRI p. iii–iv; SEC rules 1–4; PRAC |
| Timing | Vimshottari dasha | **Transits of slow planets**, mainly Jupiter (12-year "rounds") and Saturn (≈30-year rounds) over natal planets | PRI p. iii–iv, pp. 11–13; PRAC |
| Birth time | Critical (lagna, cusps, dasha balance) | Hardly needed. The slow planets fix the reading, and Rao calls Moon/Mercury variations "negligible" | PRI p. iv |
| People | Houses (3rd = siblings, 7th = spouse) | **Planets as people** (Sun = father, Moon = mother, Mars = brothers or a woman's husband, Venus = wife) | PRI passim |

Rao argues against Lagna and dasha from twins and same-day events: "When two deaths occur on the
same day, both of them may not have maraka dasa operating for them" (PRI p. iii).

**Caveat on "current practice".** Modern teachers mix BNN with Parashari tools. KRS's course has
"Dasha system", "Nadi Navamsa" and nakshatra-pada modules. One PRAC site (Dr. Mandeep Saini)
says the birth time "matters most" because it sets the rising sign. Another (AstroWord) times
careers from the 10th house and the Amatyakaraka. These are blends, not Rao.

---

## 2. Rule catalogue

Each rule gives the condition, the meaning, the sources and how far the sources agree.
Computability: **C** = can be computed from the chart as it stands. **C\*** = computable, but a
setting or convention must be chosen. **I** = interpretive only, so the app can show inputs but
not the band.

### 2.1 Frame

| ID | Condition | Meaning | Sources | Agreement | Comp. |
|---|---|---|---|---|---|
| N1 | Ignore the Lagna and the houses counted from it | The reading starts from planets | PRI p. iii; SEC (whole paper is lagna-free); Sithars Rule 1; Shatabhisha ("static lagna", Parashari aspects not used); KRS ("no math") | Strong among BNN sources. Mandeep Saini and AstroWord dissent | C |
| N2 | Take the karaka of the matter, look at "the adjacent houses of that planet and the seventh house therefrom", then at the exchange of signs and the transit of Jupiter | The core procedure | PRI p. iii–iv (verbatim instruction); SEC rule 1; Vedicgrace ("especially adjacent positions and the seventh") | Strong | C |
| N3 | Read in the order of the question: start from the karaka the question is about | The same pair reads differently from different subjects (Ju+Sa: from Jupiter, "the native's responsibility"; from Saturn, "wisdom brought into work") | Vedicgrace (Bhatt, 2026); PRI p. 13 (Jupiter versus Saturn on livelihood) | Moderate | I |

### 2.2 Karakas (the significations)

| ID | Planet | Signification | Sources | Agreement |
|---|---|---|---|---|
| K1 | Jupiter | **The native**: jeeva, soul, "sustainer", the enjoyment of results. Also children | PRI p. 11 ("Jupiter represents the native"), p. 13 ("Jupiter who represents the soul"), p. iii (births of children); SEC p. 28; Sithars | Strong for a male native |
| K1f | Jeeva for a **female** native | SEC p. 28 and a Scribd study guide: **Venus** is jeevakaraka in a female chart. Sithars: **Jupiter** for both sexes | — | **Contested.** Rao's female charts read the husband from Mars, and the woman herself mostly from Venus (pp. 176, 252, 256–257). Rao states no explicit jeeva rule |
| K2 | Saturn | **Karma**: work and profession, for both sexes. "He is neither good nor bad"; his transit "indicates the changes" | PRI p. iii; SEC p. 28; Mandeep Saini; AstroWord | Strong |
| K3 | Venus | Wife, in a male chart; marriage, money, comforts, arts; also sisters | PRI p. iii ("Venus for marriages"), p. 11 (younger sister); SEC; PRAC | Strong |
| K4 | Mars | Brothers, land, engineering and machinery, disputes; **the husband in a female chart** | PRI p. 10 (brothers), p. 12 (engineering), pp. 176, 252, 256, 296 ("Mars representing husband"); Mandeep Saini | Strong for brothers and land. **Husband: Rao says Mars**, Mandeep Saini says Mars (and Jupiter as the second husband), AstroWord says Jupiter. Contested outside Rao |
| K5 | Sun | Father, government, authority | PRI p. 10; all PRAC | Strong |
| K6 | Moon | Mother, the mind; also travel and liquids | PRI pp. 12, 15; SEC rule 3; PRAC | Strong |
| K7 | Mercury | Education, intellect, trade, writing; a paternal uncle | PRI p. iii ("Mercury for education"), p. 23, p. 265; PRAC adds friends and younger siblings | Strong for education. Friends and younger siblings are PRAC only |
| K8 | Ketu | Religion, salvation, pilgrimage; "tail" | PRI p. iii (Jupiter over Ketu = pilgrimage), p. 130; PRAC | Strong |
| K9 | Rahu | "Mouth", obstruction, the foreign or unconventional; "always retrograde" | PRI p. 9, p. 12; PRAC | Moderate |

The paired professions for each planet, each sign, and Saturn in each sign are listed in SEC
pp. 28–31. They are long keyword lists of uneven quality, so use them as data, not rules.

### 2.3 Connections between planets

| ID | Condition (`h` = h(A→B)) | Meaning | Sources | Agreement | Comp. |
|---|---|---|---|---|---|
| L1 | `h = 1` (same sign) | Conjunction. Practitioners call it the strongest link | PRI passim; Sithars ("strongest"); Shatabhisha; Vedicgrace; Mandeep Saini | Strong | C |
| L1o | Within one sign, sort by degree | "The planet with the lower degree leads / initiates" | dev.to calculator; AstroWord; Shatabhisha | Moderate (PRAC only, not found stated in PRI) | C |
| L2 | `h = 2` (B in the next sign, "ahead") or `h = 12` (B in the previous sign, "behind") | Adjacent planets colour the karaka. Friendly planets on both sides help; inimical ones hurt; a mix gives mixed results | PRI p. iii–iv ("adjacent houses"), p. 10 (Saturn 2nd to Sun = lands); SEC rules 1, 4, 5; Sithars ("next-house combination") | Strong | C |
| L2d | Direction of the 2nd and 12th | Two framings. (a) **PRI**: planets *behind* Jupiter = elder siblings and the past; planets *ahead* = younger siblings and what the karaka "meets" next as it moves forward (p. 11, p. 15, p. 176). (b) **SEC** rules 19–20: the 12th planet is "moving towards" the karaka; the 2nd planet "has crossed" it | — | Consistent geometry, different wording. Present both and assert neither | I |
| L3 | `h = 7` | Opposition, "direct aspect". A friendly planet gives auspicious results, an inimical one hostile results | PRI p. iii, p. 10 ("aspected directly by Mars"); SEC rules 1, 3, 7; Sithars; Shatabhisha | Strong | C |
| L3n | Rahu–Ketu | They do not form a 7th combination with each other, because they are always 7th apart | Sithars | Single, but self-evident | C |
| L4 | `h = 5` or `h = 9` (trine, "same direction") | Planets in trine work together "as if in the same house" | SEC rules 1, 2, 8, 9; Sithars Rule 2; Mandeep Saini; Shatabhisha; Vedicgrace; a Nadi rule cited on Goodreads (Mercury–Ketu "same sign or 5th, 7th or 9th") | **Moderate.** Widely taught today. Rao's own instruction names only the adjacent signs and the 7th; he uses 5th and 9th occasionally (pp. 32, 112, 166) and calls the term "trine" only once (p. 112) | C |
| L5 | `h = 3` or `h = 11` | A weaker link | Vedicgrace; Mandeep Saini ("half aspect two houses either side"); Rao occasionally ("Mars in the 3rd", p. 23) | Contested. **Off by default** | C\* |
| L6 | Strength order of L1–L5 | Sithars: same > trine > next sign > 7th. SEC rule 7: the **7th affects most**, then 2nd and 12th. Mandeep Saini: conjunction and trine 100 %, ±2 signs 50 %, ±1 sign 25 % | — | **Contested.** The app should show the relation type and **must not score it** | — |
| L7 | A karaka with no planet in its 2nd, 12th, 7th, 5th or 9th sign | Even if exalted, it "will be neutral without exalted benefits" (isolation). Conversely, a debilitated karaka with friendly planets in those signs does well | SEC rules 8, 9 | Single | C |
| L8 | Rahu–Ketu axis | The nodes divide the chart into two halves. Jupiter on one side and Saturn on the other is read, for example, as profession "set outside" | SEC rule 10; KRS video "Jupiter Hemmed between Ketu and Mars" | Single plus KRS | C |

**Friend and enemy table** (SEC p. 28, "Friendly and Inimical Planets in Nadi Astrology"), read
as "A's view of B":

| A | Friendly | Inimical |
|---|---|---|
| Su | Mo Ma Me Ju | Ve Sa Ra Ke |
| Mo | Su Ma Ju Me | Ve Ke Sa Ra |
| Ma | Mo Ju Ve Su Ke | Me Ra Sa |
| Me | Sa Ve Su Ra | Ma Mo Ju Ke |
| Ju | Su Ma Sa Ra Ke Mo | Me Ve |
| Ve | Ma Me Sa Ra (the source also lists Ve itself) | Su Mo Ke Ju |
| Sa | Me Ju Ve Ra | Su Ma Mo Ke |
| Ra | Me Sa Ve Ju | Mo Ma Su |
| Ke | Ma ("Tuesday" in the source) Ju | Ve Sa Me Mo Su |

The table is asymmetric (Moon calls Mercury a friend, Mercury calls the Moon an enemy). It has
transcription slips ("Tuesday"), and Rahu–Ketu are missing from each other's lists. Rao speaks
of "enemy camp" (pp. 23, 257) and names enmities chart by chart (Jupiter–Venus p. 15,
Venus and Saturn "both enemies of the Sun" p. 67, Mercury "an enemy of Mars" p. 144) but prints no table. **The table is OPEN**: ship it as
data with a "source: SEC 2022" label.

### 2.4 Retrogression and exchange

| ID | Condition | Meaning | Sources | Agreement | Comp. |
|---|---|---|---|---|---|
| R1 | Planet P is retrograde | P **also acts from the previous sign** `s(P) − 1`, so its connections (L1–L4) are formed from there too | PRI p. 128 ("Jupiter in Aquarius is retrograde and getting the amsa of previous sign"), p. 219 ("Venus is retrograde in Gemini and looks back at the Sun and the Moon in Taurus"), p. 257 ("Mars retrograde aspects Venus by moving to Capricorn"), p. 11 (transiting Jupiter in Pisces meets the retrograde Mars of Aries); SEC rule 14 ("will move towards the Twelfth house"); a Scribd note ("looks behind… two combinations"); AstroWord | **Strong on the previous sign.** "Also" (PRI, SEC) versus "instead" (AstroWord) is contested; Mandeep Saini adds the next sign too. **Default: also** | C |
| R2 | Retrograde planet in the **12th** from a karaka | It moves away, so it does not hurt the karaka (example: retrograde Saturn 12th to Mars) | SEC rule 19 | Single | C |
| R3 | Retrograde planet in the **2nd** from a karaka | It moves back onto the karaka and affects it, adversely if inimical | SEC rules 6, 20 | Single | C |
| R4 | Retrograde Jupiter or Saturn | A change of place for the native (Jupiter); repeated changes of profession (Saturn) | PRI p. 109 (born in one place, works in another), p. 168, p. 175; KRS course module "Retrograde Jupiter quick results" | Moderate | I |
| R5 | Rahu and Ketu | "Rahu, who is always retrograde" | PRI p. 12 | PRI states it. **Whether R1 applies to the nodes is OPEN** (§4) | C\* |
| X1 | Sign exchange (parivartana): lord(s(A)) = B and lord(s(B)) = A | Must be considered. Each planet gains "the power of his own house". Rao reads Venus in Virgo exchanging with Mercury in Libra as Venus getting "his own ansa in Libra" | PRI p. iv, pp. 10, 103, 130, 138 (about 140 mentions of "exchange") | Strong | C |
| X2 | Exchange cancels debilitation or combustion and gives own-sign or exalted strength | — | SEC rules 11–16 | Single | C |
| X3 | Exchange with a retrograde planet | The other planet is treated as retrograde as well | SEC rule 18 | Single | C |

### 2.5 Timing by transit

| ID | Condition | Meaning | Sources | Agreement | Comp. |
|---|---|---|---|---|---|
| T1 | Transiting **Jupiter** enters the sign of a natal planet ("contacts" it) | The natal planet's karakatva is activated. Jupiter "gives the results of the sign he transits" | PRI p. iv, pp. 11–13 (a full life story told from Jupiter's rounds); Astro Saurabh; Naik's *Transit Secrets* (outline) | Strong | C |
| T2 | Jupiter "rounds": one zodiac ≈ 11.86 y (Rao: 12 y, "one year in each sign") | Events repeat per round. The Jupiter return at 12, 24, 36… marks peaks; in Chart 1 the return at 36 gives "name and fame" and a son | PRI pp. 11, 13 | Strong (PRI) | C |
| T3 | Transiting **Saturn** contacts natal planets in order ("Saturn contacts Rahu at first, then Venus and the Moon…") | Changes in work. The order of contacts is the order of the career story. Rounds ≈ 29.5 y ("second round") | PRI p. iii, pp. 17, 43, 104, 112 | Strong | C |
| T4 | Transit over a natal planet, judged by the planets in the **7th** from the transit sign and by natal retrograde planets acting from the previous sign | Supports or opposes the activation | PRI p. 11 (retrograde Mars), p. 12 ("Jupiter's transit of Aries and Taurus is opposed by Saturn and Mercury in Libra") | Moderate. Rao applies it loosely: Libra is 7th to Aries but not to Taurus | C |
| T5 | Transit in **trine** to a natal planet | Activation, weaker | Rao mentions the "9th aspect of natal Jupiter" once (p. 11); PRAC commonly; KRS course module "Transits" | **Contested.** **Show it, labelled "trine (contested)"** | C |
| T6 | Transiting Jupiter over the sign of natal **Ketu** | Pilgrimages, religious travel | PRI p. iii | Single (PRI) | C |
| T7 | Contact order from the natal position. The signs ahead of natal Jupiter, taken in order, hold younger siblings; the signs behind hold elder ones | The sibling count and order of Chart 1 ("crosses Mars, Rahu, the Sun, Saturn and Mercury… five younger brothers… Venus… one younger sister") | PRI p. 11, p. 15 | Single (PRI). Experimental | C |
| T8 | **Progression** (a symbolic motion, not the real transit), for example Jupiter one sign per year from its natal sign | Timing in modern courses | KRS course modules "Planetary progression" and "Progression in Nandi Nadi"; dev.to calculator (Jupiter, Saturn, Rahu/Ketu progress, a retrograde planet "progresses backwards"); Edmingle outlines ("Progression of Jupiter") | **OPEN.** The rates and start points are not published in any source read. PRI uses real transits | C\* |

### 2.6 Pair meanings (keywords only)

Well attested meanings only. They are keyword hints, not predictions.

| Pair (any L1–L4 link) | Keywords | Sources | Agreement |
|---|---|---|---|
| Jupiter + Saturn | **Profession joined to dharma**: an "honourable" or "gentle" profession, "religion and profession", work "based on moral principles" (in exchange), an independent life | PRI p. 159, p. 162, p. 168, p. 130, p. 138; Shatabhisha ("expansion + consolidation"); KRS lesson "Jupiter + Saturn" | Strong |
| Saturn + Ketu | Religious institutions, detachment in work | PRI p. 30, p. 130; AstroWord | Moderate |
| Jupiter + Ketu | Spirituality, pilgrimage | PRI p. iii (via T6), p. 130; PRAC | Moderate |
| Sun + Venus | Father's wealth and lifestyle | PRI pp. 10, 12 | Single |
| Saturn with Sun and Mars on both sides | Job transfers, losses, restless workplace | SEC rule 4 | Single |
| Moon with Jupiter in the 7th | "Life force for the mother", gain through travel | SEC rule 3 | Single |
| Venus + Saturn | Relationship with responsibility. Not, by itself, marriage delay | Shatabhisha; Vedicgrace | Moderate (PRAC) |

The 36-row pair table on AstroWord is Parashari-flavoured, cites no source and is **not**
recommended as app data.

---

## 3. Proposed computable feature: "Nadi links (experimental)"

### 3.1 Placement and labelling

- A new card or page **"Nadi (experimental)"**, off by default behind a Settings toggle. It needs
  no change to Page 1, the KP pages or any PL-parity output.
- A permanent banner: *"Research / experimental. Bhrigu Nandi Nadi sign relations as taught from
  R. G. Rao. Not validated against reference charts. Relations are shown, not scored."*
- Every row carries a source tag (PRI / SEC / PRAC) and, where §2 marks it, "contested".
- Engine: a pure module, for example `src/engine/nadi/`, that consumes the existing `Body`
  (`lon`, `retrograde`) and the transit engine (`src/engine/transit/events.ts` for sign ingresses
  and stations; `sadesati.ts` is the nearest existing pattern). If it is built, it follows
  `knowledge/07_conventions_invariants.md`: new dist filename, offline, a Python oracle twin in
  `kaast2/oracle/`, and fixtures (§3.6).

### 3.2 Inputs and settings

| Input | Source | Note |
|---|---|---|
| Sidereal longitude and retrograde flag for Su…Ke | The existing chart | Signs only, using the profile's ayanamsa |
| Native sex | **New per-chart field** (M / F / unspecified) | Drives K1f and K4 |
| Female jeeva | Setting: *Venus (SEC)* / *Jupiter (Sithars)*; default **show both** | K1f is contested |
| Female spouse karaka | Setting: *Mars (Rao)* / *Jupiter*; default **Mars** | K4 |
| Include 3rd/11th links | Default **off** | L5 |
| Retrograde rule | *also from previous sign* (default) / *instead* / *previous and next* | R1 |
| Apply R1 to Rahu/Ketu | Default **off** | R5 is OPEN |
| Transit date | Default: today | §3.5 |

### 3.3 Table A: natal positions (one row per planet)

| Column | Rule |
|---|---|
| Sign, degree, order within the sign (lower degree = leader) | L1o |
| R flag; "acts also from <previous sign>" | R1 |
| Stationary warning if \|speed\| < 10 % of the mean speed | R1 is unclear near a station |
| Within 1° of a sign boundary (ayanamsa-sensitive) | Sign-level rules flip at a boundary |
| Exalted / debilitated / own sign; exchange partner (X1); "treated as retrograde via exchange" (X3) | X1–X3 |
| Side of the Rahu→Ketu axis (zodiacal arc from Rahu to Ketu = side A) | L8 |
| Isolated (nothing in its 2/12/7/5/9) | L7 |

### 3.4 Table B: connections

For each ordered pair (A, B), A ≠ B, compute from the real positions and from the virtual
positions:

```
positions(P) = { s(P) }  ∪  { s(P) − 1  if P.retrograde and R1 applies to P }   // mod 12
for each a in positions(A), b in positions(B):
    h = ((b − a) mod 12) + 1
    kind = { 1: 'same', 2: 'ahead', 12: 'behind', 7: 'opposite', 5: 'trine', 9: 'trine',
             3: 'weak', 11: 'weak' (only if the setting is on) }[h]
    tag  = (a ≠ s(A) ? 'via A retro' : '') + (b ≠ s(B) ? 'via B retro' : '')
skip the pair (Ra, Ke) for kind 'opposite'                                     // L3n
add 'exchange' if X1(A, B)
friendship = SEC table [A][B]  →  'friendly' | 'inimical' | '—'
```

Views of the same data:
1. **A 9×9 matrix.** Each cell holds codes such as `1`, `2`, `12`, `7`, `5`, `9`, with a `ʀ`
   suffix for links that exist only via the retrograde rule and `⇄` for an exchange. Friendly
   cells are tinted one way and inimical cells another, using design tokens.
2. **A per-planet list** ("Saturn: same sign —; ahead (2nd) Mars ✕inimical; behind (12th)
   Ketu; opposite (7th) Sun ✕; trine Jupiter ✓, Mercury ✓"), plus R2 and R3 annotations: "Saturn
   (R) in the 12th from Mars: moving away, effect reduced [SEC r19]".

### 3.5 Table C: karaka-centred summaries

One block per theme. Each block lists the karaka's Table-B links with the partner's karakatva
keywords and any §2.6 pair keyword. Contested karakas show both choices.

| Theme | Karaka (male) | Karaka (female) |
|---|---|---|
| Self / jeeva | Ju | Ve and/or Ju (setting) |
| Profession | Sa | Sa |
| Spouse | Ve | Ma (Rao) or Ju (setting) |
| Father | Su | Su |
| Mother | Mo | Mo |
| Brothers / land | Ma | Ma |
| Education | Me | Me |
| Religion / moksha | Ke | Ke |

Extras, all marked "experimental":
- **Siblings by order** (T7): planets in the signs behind Jupiter = elder; planets ahead in
  contact order = younger, with Venus and Moon read as sisters. Show it as a list only, with no count claim.
- **Saturn sign keywords**: SEC pp. 30–31 "Saturn in Aries…Pisces" profession lists, shown as
  reference text.

### 3.6 Table D: transit activations (Jupiter and Saturn; Rahu/Ketu optional)

For the chosen date `t`:

```
for X in [Ju, Sa]:
    x  = s_transit(X, t);  xs = { x } ∪ { x − 1 if X is retrograde at t }       // R1 on transits
    for natal planet N:  for n in positions(N):                                 // includes natal retro-previous
        h = ((n − x') mod 12) + 1  for each x' in xs
        'contact'  if h = 1                                                     // T1 / T3
        'opposite' if h = 7                                                     // T4
        'trine (contested)' if h ∈ {5, 9}                                       // T5
    flag T6 if X = Ju and the contact is with Ke
```

Plus a **rounds timeline** (T2, T3). From the birth date to +90 years, use the transit engine's
sign-ingress events for Jupiter and Saturn, including retrograde re-entries as sub-rows. Each row
shows: round number, age at entry and exit, sign, the natal planets contacted in that sign (in
degree order), and "return" rows at the natal sign. The ages come from the real ephemeris.
Rao's "one year per sign" is only the narrative approximation.

Progression (T8) is **not** part of the first build. If added later it gets its own table, its own
"OPEN parameters" label and settings for rate, start point and the backward-if-retrograde rule.

### 3.7 Test fixture (sign-level; from PRI Chart 1, pp. 9–13)

Chart 1 positions: Mars (retrograde) in Aries; Rahu in Gemini; Sun and Venus in Virgo; Saturn and
Mercury in Libra; Moon and Ketu in Sagittarius; Jupiter in Capricorn. Expected outputs:
- **X1**: exchange Mercury (in Libra) ⇄ Venus (in Virgo). Rao: "Mercury and Venus have exchanged signs".
- **L2**: Saturn is `ahead` (2nd) of the Sun ("Saturn in the second house to the Sun").
  **L3**: Mars is `opposite` Saturn ("aspected directly by Mars").
- **L2**: the Moon is `behind` (12th) Jupiter, so the Moon is an elder sister.
- **T7**: the contact order of the signs ahead of Jupiter is Mars → Rahu → Sun, Venus → Saturn,
  Mercury → Moon, Ketu. Rao: "crosses (1) Mars, (2) Rahu, (3) the Sun, (4) Saturn and
  (5) Mercury… and… Venus".
- **R1 + T1**: transiting Jupiter in **Pisces** activates natal Mars "via retro" (Pisces = Aries − 1).
  Rao: "when he enters Pisces, has the aspects of retrograde Mars in Aries".

Because no family ground-truth charts exist for BNN, these fixtures check that the rules are
implemented as Rao applies them. They do not check that the predictions are true.

---

## 4. Open questions

1. **Female jeeva**: Venus (SEC) or Jupiter (Sithars)? Ask the user which teacher they follow.
   Showing both is the safe default.
2. **A woman's husband**: Mars (Rao, many charts) or Jupiter (AstroWord)? Default Mars, per Rao.
3. **Trines.** Is the 5th/9th a full BNN link (SEC, KRS, most PRAC) or secondary (Rao's own
   instruction)? Is a trine to a *transiting* planet an activation?
4. **Retrograde: "also" or "instead"?** PRI and SEC read as "also". Do Rahu and Ketu (always
   retrograde) get the previous-sign rule? If they do, "previous" means the sign *ahead* in the
   zodiac (the direction they came from) or *behind*? No source settles this.
5. **Strength order** of same / trine / adjacent / 7th: the three sources conflict (L6). Should
   the app ever score, or only list? This spec proposes listing only.
6. **Friend and enemy table**: SEC's table is asymmetric and has slips. Should Rao's "enemy
   camp" be reconstructed from his charts instead, and does the Deva/Asura grouping (a module in
   the KRS course) replace it?
7. **KRS specifics**: his course outline lists "Nadi aspects including the cardinal cross", "3rd
   from a planet", "Jupiter Bha Chakra", "Deva and Asura planet groups" and "Progression". Their
   rules were not readable from this session (paid course; YouTube transcripts blocked). If the
   user can share notes or a video, the rule set can be checked against what KRS actually teaches.
8. **Progression rates** (T8): which rate (Jupiter one sign per year?), which start point
   (natal sign at birth?), and does a retrograde planet run backwards?
9. **Ayanamsa**: BNN sources assume Lahiri. Should the feature force Lahiri or follow the
   profile? Sign-boundary flags (Table A) make the choice visible either way.
10. **Within-sign degree order** (L1o): PRAC only. Should it be shown?

---

## 5. Sources

Most reliable first.

| # | Source | Grade | Used for |
|---|---|---|---|
| 1 | R. G. Rao, *Bhrigu Nandi Nadi* (Ranjan Publications, 2008, ISBN 978-81-88230-61-7; listings: <https://www.goodreads.com/work/editions/28019975>, <https://www.exoticindia.com/book/details/bhrigu-nandi-nadi-astrology-simplified-hcb658>). Read from a scanned copy, pp. iii–iv, 9–15, 17, 23, 30, 32, 43, 67, 103–112, 128–138, 144, 159–176, 219, 252–265, 296 | PRI | §1, every PRI cell |
| 2 | Jagadeesan & Jothimani (2022), "A Study of the Basic Rules in Bhrigu Nandi Nadi", IJCRME 7(2):23–31, CC BY. <https://zenodo.org/records/7489854> | SEC | Rules 1–20, friend table, Saturn/profession lists |
| 3 | S. Naik, *Naadi Astrology: Transit Secrets* (Sagar; an extension of Rao's transit results). Only the outline was read: <https://www.exoticindiaart.com/book/details/naadi-astrology-transit-secrets-rao-s-system-of-naadi-astrology-transits-results-expanded-naq696> | PRAC (outline) | T1–T3 context |
| 4 | Kapiel Raaj: course outline <https://krschannel.thinkific.com/courses/nadi-astrology-course>; academy <https://krschannel.thinkific.com/>; channel <https://www.youtube.com/@KRSchannel> (video titles via the channel search; for example <https://www.youtube.com/watch?v=XZdeWODURvE>, <https://www.youtube.com/watch?v=FuV7Vjfb-J8>, <https://www.youtube.com/watch?v=4e_pnhCAnJk>, <https://www.youtube.com/watch?v=9Jf-fAZNP0w>, <https://www.youtube.com/watch?v=yOkwDNpcFZg>) | KRS | §1.1, open question 7 |
| 5 | D. Shanmuga Sundaram, Sithars Astrology, BNN Rule One and Rule Two (2026). <https://sitharsastrology.com/blog/bhrigu-nandi-nadi-rule-one-why-jupiter-becomes-your-first-house>, <https://sitharsastrology.com/blog/bhrigu-nandi-nadi-rule-two-planets-in-trinal-rashis-are-always-in-combination> | PRAC | N1, K1f, L1–L4, L3n, L6 |
| 6 | V. Bhatt, Vedicgrace (2026). <https://vedicgrace.com/articles/in-bhrigu-nandi-nadi-two-planets-do-not-make-a-yoga/> | PRAC | N2, N3, L4, L5, pairs |
| 7 | N. Verma, Shatabhisha Astrology: principles and combinations (2025–26). <https://shatabhishaastrology.com/fundamental-principles-of-nadi-astrology/>, <https://shatabhishaastrology.com/bhrigu-nandi-nadi-combinations-of-planets-part-7/> | PRAC | N1, L1, L4, pairs |
| 8 | Dr. Mandeep C. Saini, BNN page. <https://mandeepsaini.com/bnn-astrology> | PRAC (dissents on Lagna) | K4, L5, L6, R1 variant |
| 9 | AstroWord, "Complete BNN Prediction Guide" (2026). <https://www.astroword.in/blog/bhrigu-nandi-nadi-astrology-prediction> | PRAC (low: Parashari blend) | R1 "instead", K4 dissent |
| 10 | Astro Saurabh, "Secrets of Bhrigu Nandi Nadi". <https://astrosaurab.com/secrets-of-bhrigu-nandi-nadi-astrology/> | PRAC | T1 |
| 11 | dev.to, "How I shipped a Nadi (BNN) astrology calculator…". <https://dev.to/sahilyadavy251tech/how-i-shipped-a-nadi-bnn-astrology-calculator-as-one-200-kb-html-file-flm> | PRAC (prior art) | L1o, T8 |
| 12 | Wikipedia, *Nadi astrology*. <https://en.wikipedia.org/wiki/Nadi_astrology> | Background | §1.1 (palm-leaf distinction) |

Not readable from this session: Scribd uploads (client challenge), YouTube transcripts (blocked),
Naik's *Roots of Nadi Astrology* (403), and N. Srinivasan Shastry's *Brighu Naadi Sangraha*
(connection reset). Web content was treated as reference data only.

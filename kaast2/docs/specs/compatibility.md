# Compatibility (marriage matching): PL 7 parity specification

> **Not for publication.** This spec quotes short passages of PL 7's report text for parity work. Keep it out of any public copy of the repository (PLAN §11); the app itself shows its own wording.

Status: draft 1 (2026-10-24). Scope: Parashara's Light 7 **Reports → Compatibility**
(9 pages) for Astro-Amriit (`kaast2`). Oracle and fixture:
`oracle/compat_pyjhora.py` → `tests/fixtures/compat_pyjhora.json`.

Source tags used on every rule:

* **PL-HELP** – PL 7's report templates and help pages in `PL7/Extras1/pib*.txt` and
  `PL7/Lang1/COMPAT1.TXT` (both encoded; decoder notes in §11). The 9 report pages are
  `pib500.txt` … `pib508.txt`; the menu is `pib1995.txt`; the tutorial is `pib12025.txt`.
* **PL-MAN** – PL 7 manual (`PL70.pdf`, pp. 104–107, 136–138).
* **PL-BIN** – read from `PL7.exe` (image base 0x400000). Addresses are virtual addresses.
* **PYJHORA** – PyJHora 4.8.7, `jhora/horoscope/match/compatibility.py`, class `Ashtakoota`
  (and `jhora/horoscope/chart/dosha.py` for Manglik).
* **STD** – textbook rule (named where used). Used only where PL gives nothing.

PL 7's report templates do **not** contain the scores. They call fields (`H220`–`H229`,
`H620`) that the binary computes. The scoring rules below therefore come from the binary,
and the printed words and thresholds come from the templates. Where the binary does
something that looks like a bug, the spec reproduces it. These places are marked **QUIRK**.

---

## 1. Conventions

### 1.1 Numbering
Nakshatra 1..27 (Ashwini = 1 … Revati = 27), sign 1..12 (Aries = 1), planets
1 Sun, 2 Moon, 3 Mars, 4 Mercury, 5 Jupiter, 6 Venus, 7 Saturn, 8 Rahu, 9 Ketu
(PL-MAN p. 137, PL-BIN everywhere).

### 1.2 Counting
`count27(from, to) = ((to − from + 27) mod 27) + 1` (1..27, "to" counted from "from",
inclusive). `count12` likewise. PL templates call this `fromto27` / `fromto12` (PL-HELP).
PyJHora's `utils.count_stars` / `count_rasis` are the same function.

### 1.3 Bride and groom (who is A and who is B)
PL-BIN builds one "koota" object per pair (constructor 0x45242c, fill 0x4524a6).
It holds, for **A** and **B**: sign `rasi` (+0x14 / +0x18), nakshatra `nak` (+0x1c / +0x20),
degree of the Moon inside its sign `deg` (+0x30 / +0x38), and the planet used (+0x24 / +0x28,
default 2 = Moon; the "Compatibility – Kutas" worksheet can use other planets).

* **A = the bride (girl), B = the groom (boy).** Evidence: Mahendra and Stree-Deergha count B
  from A, and their texts say "the bridegroom's nakshatra … from that of the bride";
  Varna scores 1 when varna(A) ≤ varna(B); the Mangala flags use A for "her horoscope"
  (PL-BIN 0x453754, 0x4537cc, 0x45270b, 0x45690d + PL-HELP pib506/pib508).
* The order is chosen by a flag byte at chart+0x153 (0x574571 / 0x5748b6). The current
  chart becomes A when that byte is 0, else the partner chart does. This is very probably the
  sex field. If both charts have the same sex, the current chart is A.
* The templates refer to chart 1 as `K31` and chart 2 as `K32`. Every text treats
  **K31 = groom** and **K32 = bride** (PL-HELP pib506, pib508).
  **Astro-Amriit rule:** ask for the groom and the bride explicitly. Put the groom in the
  K31 column and the bride in the K32 column, and pass A = bride, B = groom to the scorers.
* PyJHora: `Ashtakoota(boy_nak, boy_pada, girl_nak, girl_pada)`, and its tables are
  indexed `[girl][boy]`.

### 1.4 Modes
Each koota field takes a mode parameter `X` (template `X0`/`X1`), and the totals take `M`
and `S`. **X0 = Ashtakoota (North) rules, X1 = Dashakoota/Kalaprakasika (South) rules.**
Gana, Yoni, Dina, Rasi, Rajju, Vedha and Varna change with the mode (§3, §7).

### 1.5 The "lords friendly" test `LF(A,B)` (PL-BIN 0x452565)
`LF` is true when:
* lord(rasiA) == lord(rasiB), or
* rasiA == rasiB ± 6 (the Moon signs are 1/7 from each other), or
* rel(lordB→lordA) + rel(lordA→lordB) == 2 (mutual natural friends).

The sign lords are Ar Ma, Ta Ve, Ge Me, Cn Mo, Le Su, Vi Me, Li Ve, Sc Ma, Sg Ju, Cp Sa,
Aq Sa, Pi Ju (PL-BIN 0x5f47a8). `rel` is the natural (naisargika) relationship table at
PL-BIN 0x613600: friend +1, neutral 0, enemy −1. The row is the planet that looks, the
column is the planet looked at:

| a→b | Su | Mo | Ma | Me | Ju | Ve | Sa |
|---|---|---|---|---|---|---|---|
| Su | 0 | +1 | +1 | 0 | +1 | −1 | −1 |
| Mo | +1 | 0 | 0 | +1 | 0 | 0 | 0 |
| Ma | +1 | +1 | 0 | −1 | +1 | 0 | 0 |
| Me | +1 | −1 | 0 | 0 | 0 | +1 | 0 |
| Ju | +1 | +1 | +1 | −1 | 0 | −1 | 0 |
| Ve | −1 | −1 | 0 | +1 | 0 | 0 | +1 |
| Sa | −1 | −1 | −1 | +1 | 0 | +1 | 0 |

This is BPHS naisargika maitri (STD). The table also has Rahu and Ketu rows; matching
does not use them.

---

## 2. Attribute tables

### 2.1 Nakshatra attributes (PL-BIN; all match STD unless noted)
Gana: 0x566e71 (Deva) / 0x566eac (Rakshasa) / else Manushya.
Nadi: 0x566f3d (1 Adi, 2 Madhya, 3 Antya). Yoni: 0x566cfd (mode 0 → animal 1..14;
mode 1 → a "bit code" used by Dashakoota). Rajju: 0x566fca. Gender: 0x56710c (M),
0x56709b (F), 0x5670ef (H). The gender list is also printed verbatim in pib507.

| # | Nakshatra | Gana | Nadi | Yoni (mode 0 idx) | Yoni bit code (mode 1) | Rajju | Gender |
|---|---|---|---|---|---|---|---|
| 1 | Ashwini | Deva | Adi | Horse (1) | -4 | Padha | M |
| 2 | Bharani | Manushya | Madhya | Elephant (2) | 2 | Kati (Ooru) | F |
| 3 | Krittika | Rakshasa | Antya | Sheep (3) | 1 | Nabhi | M |
| 4 | Rohini | Manushya | Antya | Serpent (4) | 32 | Kanta | M |
| 5 | Mrigashira | Deva | Madhya | Serpent (4) | 32 | Siro | H |
| 6 | Ardra | Manushya | Adi | Dog (5) | -128 | Kanta | F |
| 7 | Punarvasu | Deva | Adi | Cat (6) | 16 | Nabhi | M |
| 8 | Pushya | Deva | Madhya | Sheep (3) | 1 | Kati (Ooru) | M |
| 9 | Ashlesha | Rakshasa | Antya | Cat (6) | 16 | Padha | F |
| 10 | Magha | Rakshasa | Antya | Rat (7) | -16 | Padha | F |
| 11 | P.Phalguni | Manushya | Madhya | Rat (7) | -16 | Kati (Ooru) | F |
| 12 | U.Phalguni | Manushya | Adi | Cow (8) | -8 | Nabhi | F |
| 13 | Hasta | Deva | Adi | Buffalo (9) | 4 | Kanta | M |
| 14 | Chitra | Rakshasa | Madhya | Tiger (10) | 8 | Siro | F |
| 15 | Swati | Deva | Antya | Buffalo (9) | 4 | Kanta | F |
| 16 | Vishakha | Rakshasa | Antya | Tiger (10) | 8 | Nabhi | F |
| 17 | Anuradha | Deva | Madhya | Deer (11) | -2 | Kati (Ooru) | M |
| 18 | Jyeshtha | Rakshasa | Adi | Deer (11) | -2 | Padha | F |
| 19 | Mula | Rakshasa | Adi | Dog (5) | -128 | Padha | H |
| 20 | P.Ashadha | Manushya | Madhya | Monkey (12) | -1 | Kati (Ooru) | F |
| 21 | U.Ashadha | Manushya | Antya | Mongoose (13) | 64 | Nabhi | F |
| 22 | Shravana | Deva | Antya | Monkey (12) | -1 | Kanta | F |
| 23 | Dhanishta | Rakshasa | Madhya | Lion (14) | 256 | Siro | F |
| 24 | Shatabhisha | Rakshasa | Adi | Horse (1) | -4 | Kanta | H |
| 25 | P.Bhadrapada | Manushya | Adi | Lion (14) | 256 | Nabhi | M |
| 26 | U.Bhadrapada | Manushya | Madhya | Cow (8) | -8 | Kati (Ooru) | M |
| 27 | Revati | Deva | Antya | Elephant (2) | 2 | Padha | M |

The rajju names are printed by the templates as Padha, Kati, Nabhi, Kanta, Siro, and by the
results text as Padha, Ooroo, Nabhi, Kanta, Siro. **QUIRK (PL-HELP pib507):** the name list
in the Dash-Koota table has "Chitra" for nakshatra 14, where it should say "Siro".
Reproduce the label exactly; the rajju value used for scoring is 5 (Siro).

The names of the yoni, gana, nadi, varna and vashya classes come from string IDs
(yoni 0xacf–0xadc, gana 0xadd–0xadf, nadi 0xae0–0xae2, varna 0xac6–0xac9,
vashya 0xaca–0xace). The string table itself was not located. The ID order matches the
standard name order used here.

### 2.2 Sign attributes (PL-BIN)

| Sign | Lord | Varna X0 (0x4525cc) | Varna X1 | Vashya class (0x452774) | `VASYA_OF` set (0x45396d) |
|---|---|---|---|---|---|
| 1 Ar | Ma | 3 Kshatriya | 3 | 1 Chatushpada | {10, 11} |
| 2 Ta | Ve | 2 Vaishya | 1 Shudra | 1 Chatushpada | {} |
| 3 Ge | Me | 1 Shudra | 2 Vaishya | 2 Manava | {6} |
| 4 Cn | Mo | 4 Brahmin | 4 | 3 Jalachara | {8, 2} |
| 5 Le | Su | 3 | 3 | 4 Vanachara | {1, 2} |
| 6 Vi | Me | 2 | 1 | 2 Manava | {3, 8} |
| 7 Li | Ve | 1 | 2 | 2 Manava | {5} |
| 8 Sc | Ma | 4 | 4 | 5 Keeta | {1, 4} |
| 9 Sg | Ju | 3 | 3 | deg ≤ 15.0 → 2 Manava, else 1 Chatushpada | {4} |
| 10 Cp | Sa | 2 | 1 | deg ≤ 15.0 → 1 Chatushpada, else 3 Jalachara | {7, 12} |
| 11 Aq | Sa | 1 | 2 | 2 Manava | {10} |
| 12 Pi | Ju | 4 | 4 | 3 Jalachara | {9, 6} |

* Varna is a rank: 4 Brahmin > 3 Kshatriya > 2 Vaishya > 1 Shudra. X0 (Ashtakoota) puts
  earth signs in Vaishya and air signs in Shudra. X1 (the Dashakoota "Caste" row) swaps them.
  The Caste row prints the **X0** name but scores with **X1** (pib507 calls
  `H221;X0;F1` for the name). **QUIRK.**
* `deg` is the Moon's degree inside its sign (planet record +8). That it is the in-sign degree
  is confirmed by 0x4271a3, which builds the absolute longitude as (rasi−1)·30 + record[+8].
  Exactly 15.0° counts as the first half.
* `VASYA_OF[r]` lists the signs that have `r` as their vashya. For most signs it is the
  inverse of the STD Kalaprakasika vashya list. It differs from STD at Leo (adds 2 Taurus),
  Virgo (8 Scorpio where STD has 7 Libra) and Libra (lacks 2 Taurus). **QUIRK**, reproduce it.

---

## 3. Ashtakoota (North, 36 points): page "Ashtakoot Guna Matching" (pib503)

The page prints a table with these columns: Koot | groom value | bride value | Max. marks |
Marks gained | Dosha | Area of life. Below the names it prints each person's
(Nakshatra–Pada) in brackets.

| Row | Max | Field | Value shown per person | Area of life |
|---|---|---|---|---|
| Varna | 1.0 | H221 X0 | varna name (X0) | Work |
| Vashya | 2.0 | H222 X0 | vashya class name | Dominance |
| Tara | 3.0 | H223 | tara name of the other's star counted from own (see 3.3) | Destiny |
| Yoni | 4.0 | H224 X0 | yoni animal | Mentality |
| Grahamaitri | 5.0 | H225 | Moon-sign lord | Compatibility |
| Gana | 6.0 | H226 X0 | gana name | Guna Level |
| Bhakoot | 7.0 | H227 | Moon sign | Love |
| Nadi | 8.0 | H228 X0 | nadi name | Health |

The total `H220 X0 M0 S2` is printed against 36.0. Every score is a float with 0.5 steps.

### 3.1 Varna (1) — PL-BIN 0x45270b
`score = 1 if varnaX0(rasiA) ≤ varnaX0(rasiB) else 0` (the groom's varna is at least the
bride's). STD rule. Table §2.2.

### 3.2 Vashya (2) — PL-BIN 0x452937
`a = vashya(rasiA, degA)`, `b = vashya(rasiB, degB)` (classes 1..5 from §2.2). The binary
evaluates these tests in order:

```
if a == b            -> 2
if a == 4            -> 0          # bride Vanachara (Leo)
if b == 1            -> 1          # groom Chatushpada
if a + b == 5        -> 0.5
if a + b == 9        -> 0
if b == 5 or a == 5  -> 1
if a == 2            -> 0
else                 -> 1
```
The resulting matrix (rows = bride, columns = groom):

| girl \ boy | Chatushpada | Manava | Jalachara | Vanachara | Keeta |
|---|---|---|---|---|---|
| **Chatushpada** | 2 | 1 | 1 | 0.5 | 1 |
| **Manava** | 1 | 2 | 0.5 | 0 | 1 |
| **Jalachara** | 1 | 0.5 | 2 | 1 | 1 |
| **Vanachara** | 0 | 0 | 0 | 2 | 0 |
| **Keeta** | 1 | 1 | 1 | 0 | 2 |

### 3.3 Tara (3) — PL-BIN 0x452a0e (H223 dispatch at 0x45617e)
```
t = ((nakB − nakA + 27) mod 9) + 1        # groom's star from the bride's star, reduced to 1..9
score = 3.0 if t < 3 else 1.5             # t = 1 Janma or 2 Sampat -> 3, else 1.5
```
**QUIRK, high importance.** The binary counts in one direction only. It gives 3 points only
for Janma and Sampat, and 1.5 for every other tara, including the auspicious ones. This does
not match STD (count both ways, 1.5 each way unless the remainder is 3, 5 or 7). The
disassembly is unambiguous: `fild t; fcomp qword[0x5d1868]=3.0; jae → 1.5`. Confirm it
against one real PL 7 printout before shipping (§10).

Displayed tara names (pib500/pib503): in the groom's column,
`TARA27[count27(nak_groom, nak_bride)]`; in the bride's column, the reverse direction.
`TARA27` repeats Janma, Sampat, Vipat, Kshema, Pratyari, Sadhaka, Vadha, Mitra, Pramamitra
three times.

### 3.4 Yoni (4) — PL-BIN 0x452f0c, mode 0; matrix 0x452d0a
* Same animal (equal mode-1 codes) → 4.
* Otherwise `YONI[animalA][animalB]` from the symmetric matrix below. The binary stores only
  the upper triangle (91 bytes) on the stack, and the lookup orders the two indices first.

| girl \ boy | Hors | Elep | Shee | Serp | Dog | Cat | Rat | Cow | Buff | Tige | Deer | Monk | Mong | Lion |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Horse** | 4 | 2 | 3 | 2 | 2 | 3 | 3 | 2 | 0 | 1 | 3 | 2 | 2 | 1 |
| **Elephant** | 2 | 4 | 3 | 2 | 2 | 3 | 2 | 3 | 3 | 1 | 3 | 2 | 2 | 0 |
| **Sheep** | 3 | 3 | 4 | 2 | 2 | 3 | 2 | 3 | 3 | 1 | 3 | 0 | 2 | 1 |
| **Serpent** | 2 | 2 | 2 | 4 | 2 | 1 | 1 | 2 | 2 | 2 | 2 | 1 | 0 | 2 |
| **Dog** | 2 | 2 | 2 | 2 | 4 | 1 | 1 | 2 | 2 | 2 | 0 | 2 | 2 | 2 |
| **Cat** | 3 | 3 | 3 | 1 | 1 | 4 | 0 | 3 | 3 | 2 | 3 | 2 | 2 | 2 |
| **Rat** | 3 | 2 | 2 | 1 | 1 | 0 | 4 | 3 | 3 | 2 | 3 | 2 | 1 | 2 |
| **Cow** | 2 | 3 | 3 | 2 | 2 | 3 | 3 | 4 | 3 | 0 | 3 | 2 | 2 | 1 |
| **Buffalo** | 0 | 3 | 3 | 2 | 2 | 3 | 3 | 3 | 4 | 1 | 3 | 2 | 2 | 1 |
| **Tiger** | 1 | 1 | 1 | 2 | 2 | 2 | 2 | 0 | 1 | 4 | 1 | 2 | 2 | 3 |
| **Deer** | 3 | 3 | 3 | 2 | 0 | 3 | 3 | 3 | 3 | 1 | 4 | 2 | 2 | 1 |
| **Monkey** | 2 | 2 | 0 | 1 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 4 | 2 | 2 |
| **Mongoose** | 2 | 2 | 2 | 0 | 2 | 2 | 1 | 2 | 2 | 2 | 2 | 2 | 4 | 2 |
| **Lion** | 1 | 0 | 1 | 2 | 2 | 2 | 2 | 1 | 1 | 3 | 1 | 2 | 2 | 4 |

The matrix has the 7 STD enemy pairs at 0: Horse–Buffalo, Elephant–Lion, Sheep–Monkey,
Serpent–Mongoose, Dog–Deer, Cat–Rat, Cow–Tiger. The other values differ from PyJHora in
72 of the 182 off-diagonal cells (§9).

### 3.5 Graha Maitri (5) — PL-BIN 0x453000
```
la = lord(rasiA), lb = lord(rasiB)
s  = 2 if la == lb else rel(lb→la) + rel(la→lb)
score = {2: 5, 1: 4, 0: 1, −1: 0.5, −2: 0}[s]
```
**QUIRK:** neutral–neutral (s = 0, for example Mars–Venus or Jupiter–Saturn) scores **1**,
the same as friend–enemy. STD and PyJHora give 3 for neutral–neutral. Score 3 is never
produced, although the Dash-Koota text has a "neutral" sentence for 3.0.

### 3.6 Gana (6) — PL-BIN 0x453176, X0
`code = 10·gana(nakA) + gana(nakB)` (1 Deva, 2 Manushya, 3 Rakshasa):

| bride \ groom | Deva | Manushya | Rakshasa |
|---|---|---|---|
| **Deva** | 6 | 5 | 1 |
| **Manushya** | 6 | 6 | 0 |
| **Rakshasa** | 0 | 0 | 6 |

This is the transpose of PyJHora's `gana_array` (§9). X1 adds an exception, see §7.2.

### 3.7 Bhakoot (7) — PL-BIN 0x453226
`c = count12(rasiA, rasiB)` (the groom's sign from the bride's sign).
`score = 7 if c ∈ {1, 3, 4, 7, 10, 11} else 0`. So 2/12, 5/9 and 6/8 score 0. The binary
applies no friendship or other exception (STD exceptions are not used). Same as PyJHora.

### 3.8 Nadi (8) — PL-BIN 0x453363
`score = 8 if nadi(nakA) ≠ nadi(nakB) else 0`. The binary applies no exception to the score.
When the nadis are the same it sets an internal text code: 2/1/0 for Adi/Madhya/Antya,
6 for "same sign, different star", 7 for "same star, different sign". No report page uses
these codes.

### 3.9 Total, doshas and verdict (PL-HELP pib503)
`total = varna + vashya + tara + yoni + maitri + gana + bhakoot + nadi`
(PL-BIN 0x455c46 with S = 2 sums exactly these eight).

**Dosha column:** prints "yes" when that koota scores 0.0, else "-". It is shown only for
Gana, Bhakoot and Nadi. For each one that scores 0 the page adds a sentence:
* "In the matching of horoscopes, the Gana Maha Dosha is present." followed by
  "‹groom› belongs to ‹gana› gana and ‹bride› belongs to ‹gana› gana."
* "… the Bhakoot Maha Dosha is present." followed by "The Moon sign of ‹groom› is ‹sign› and
  the Moon sign of ‹bride› is ‹sign›."
* "… the Nadi Maha Dosha is present." followed by "The Nadi of ‹groom› is ‹nadi› and Nadi of
  ‹bride› is ‹nadi›. Both are mutually inimical."

**Verdict line:** "Ashtkoot matching between ‹groom› and ‹bride› …"

| Total T | Text |
|---|---|
| T ≤ 16 | "should be avoided." |
| 16 < T ≤ 21 | "is medium." |
| 21 < T ≤ 30 | "is good." |
| T > 30 | "is excellent." |

The template writes these as `notbigger 16 and different 16.5`, and so on. The extra
"different" tests change nothing, so the table above is exact.

---

## 4. Page "Basic Birth Details" (pib500)
The page is titled "Matching of Horoscopes" and has two columns (groom K31, bride K32) with
these rows:
* Sex, Date of birth, Day of birth, Time of birth, Ishtkaal (ghatis), Place of birth,
  Country, Latitude, Longitude, Time zone, War/daylight corr., Lahiri Ayanamsha,
  Sunrise time, Sunset time.
* Lagna, Lagnesh, Rashi (Moon sign), Rashish, Nakshatra, Nakshatra lord, Pada, Yoga, Tithi,
  Karana.
* Varna (H221 X0 name), Vashya (H222 name), Tara (§3.3 name), Yoni (H224 name),
  Gana (H226 name), Nadi (H228 name), Varga (H85).
* Naamakshar, Paya (Rashi), Paya (Nakshatra), Sunsign (western).
* Balance of dasha (y m d).

All values except the koota names come from the ordinary chart engine.

## 5. Page "Birth Chart and Planetary Details" (pib501)
For each person: a Rasi chart ("Birth Chart"), then a planet table with the columns Planet,
R/C (retrograde/combust flags), Sign, Degree, Nakshatra, Pada. The rows are Lagna (N0),
Sun..Ketu (N1–N9) and three more rows, N17–N19, which are probably PL's outer planets
(check against a printout).

## 6. Page "Moon Chart, Navamsha and Dashas" (pib502)
For each person: a Moon chart (the Rasi chart rotated to the Moon sign, `I<Moon sign>`),
the Navamsha (D-9) chart, and a "Vimshottari Dasha" table with the columns Maha-Antar,
Beginning and Ending. It has 9 rows and is built from the template dasha functions
`$dasha,49/50/53/56`. The exact row set is probably the current Mahadasha's antardashas;
confirm it against a printout. Reuse the existing Vimshottari engine.

---

## 7. Dashakoota (South, Kalaprakasika): pages "Dash-Koota Table" (pib507) and "Dash-Koota Compatibility" (pib508)

PL-MAN p. 106: "based on the text of Kalaprakasika". Every row uses mode **X1**.
Field map (dispatcher 0x455e68 → H229 table 0x45686c):

| # | Koota (area) | Field | Max | Scorer (PL-BIN) | Text codes (COMPAT1.TXT line = code) |
|---|---|---|---|---|---|
| 1 | Dhinam (luck) | H229 P1 | 3 | 0x4533fe | 1–28 |
| 2 | Ganam (wealth) | H226 X1 | 6 | 0x453176 | Gana pair texts 29–33 (by gana, not code) |
| 3 | Mahendhram (attachment/well-being) | H229 P3 | 2 | 0x453754 | 34 / 35 |
| 4 | Stree-Dheergham (general welfare) | H229 P4 | 2 | 0x4537cc | 36 / 37 |
| 5 | Yoni (sexual) | H224 X1 | 4 | 0x452f0c mode 1 | by score |
| 6 | Rasi (growth of family) | H229 P6 | 7 | 0x453807 | by sign count |
| 7 | Rasyadhipati (food) | H225 | 5 | 0x453000 | by score |
| 8 | Vasyam (posterity) | H229 P8 | 2 | 0x453a14 | 59 / 60 |
| 9 | Rajju (felicity in marriage) | H229 P9 | 8 | 0x453b14 | 61–66 |
| 10 | Vedhai (sons) | H229 P10 | 2 | 0x453c67 | 67 / 68 |
| – | Gender (Male/Female) | H229 P11 | 1 | 0x453ccb | 69–76 |
| – | Gothram | H229 P12 | 1 | 0x453f6a | 78 / 79 |
| – | Caste | H221 X1 | 1 | 0x45270b (X1) | by score |

The ten kootas add up to 41 and the three "Other Considerations" bring this to **44**.
"Total Points (Kalaprakashika method)" = `H220 X1 M1 S1` "of 44" is the sum of all 13 rows
(0x455c46, S = 1).

The table page prints two more totals:
* **"BV Raman method" of 36** (`S3`) = Rasi(X0) + Dina(X0) + Gana(X0) + Varna(X0) +
  Yoni(X0 matrix) + Vasya + Nadi + Maitri. The maxima are 7+3+6+1+4+2+8+5.
* **"AshtKoot method" of 36** (`S2`) = §3.9.

### 7.1 Dhinam — PL-BIN 0x4533fe (X1). `a = nakA` (bride), `b = nakB` (groom)
```
t = ((b − a + 27) mod 9) + 1                       # 1..9
X0:  score = 3 if t ∈ {2,4,6,8} else 0; code = 1 if 3 else 2;  return
X1:
  t == 1               -> 1.5, code 26
  t ∈ {2,4,6,8,9}      -> 3,   code 1
  t ∈ {3,5,7}          -> 0,   code 2        # "third paryaya" branch (code 3, 1.5) never fires:
                                             #  the paryaya is computed as (t−1) div 9 + 1 = 1 always (QUIRK)
  t == 5               -> 0,   code 7        # "bride 22nd from groom" text, fires for t = 5 (QUIRK)
  # the 27th and 22nd checks compare t with 27 and 22, so they never fire (QUIRK); codes 4, 5, 6, 8 are never set
  (b,a) ∈ {(3,9),(9,15),(14,20),(17,23),(23,2),(24,3)}   -> 0, code 9
  (b,a) ∈ {(6,12),(11,17),(14,8),(7,13)}                 -> 3, code 10
  (b,a) == (7,13)                                        -> 3, code 11
  (b,a) == (18,24) -> 0, code 12;  (12,5) -> 0, code 13;  (13,19) -> 0, code 14
  code only (score unchanged):
    (4,10),(25,4) ->15   (1,7),(15,21) ->16   (27,6),(18,12) ->17   (16,10) ->18
    (16,22) ->19   (1,22) ->20   (26,5) ->21   (21,27) ->22   (19,25) ->23   (20,26) ->24   (2,8) ->25
  if b == a:  1.5, code 26
       b ∈ {4,6,10,13,16,22,26,27} -> 3, code 27
       b ∈ {2,9,15,18,19,23,24,25} -> 0, code 28
```
The steps run top to bottom, and a later step overwrites the score and code of an earlier
one. Page thresholds (pib507): 3.0 → "Auspicious", 0.0 → "Inauspicious"; 1.5 shows no word.

### 7.2 Ganam — X1 = §3.6 plus one exception (PL-BIN 0x4531f5)
If X1 and `LF(A,B)` and score < 3, then score = 3.
Page words: 6 → Auspicious; 1 < s < 6 → Average; s ≤ 1 → Inauspicious.

Results text (pib508), chosen by the two ganas (groom first):
* Same gana: line 32.
* Deva + Manushya (either order): line 29, middling.
* Deva + Rakshasa (either order): line 30, very bad.
* Manushya + Rakshasa (either order): line 31, fatal.
* Line 33 ("adverse effects of Rakshasa Gana is less because the asterism of the bride is
  beyond the 14th…") is guarded by `fromto27` applied to the two **gana numbers**.
  **QUIRK:** the template counts gana indices, not nakshatras, and its tags are unbalanced.
  Literally, the line prints when one gana is Rakshasa and
  count27(gana_bride, gana_groom) ≥ 14. With gana numbers 1..3 that means the groom's gana
  number is lower than the bride's. Reproduce it literally and flag it in the UI as PL's
  wording.

### 7.3 Mahendhram — PL-BIN 0x453754
`count27(nakA, nakB) ∈ {4,7,10,13,16,19,22,25}` → 2 (code 34), else 0 (code 35).
Same as STD and PyJHora.

### 7.4 Stree-Dheergham — PL-BIN 0x4537cc
`count27(nakA, nakB) > 13` → 2 (code 36), else 0 (code 37).

### 7.5 Yoni (X1) — PL-BIN 0x452f0c mode 1, using the bit codes from §2.1
```
ca = bit(nakA), cb = bit(nakB)
if cb == −ca or ca + cb ∈ {16, 96, −126} -> 0  ("mutually hostile")
elif ca == cb                             -> 4  ("same")
else                                      -> 2  ("different but not hostile")
```
Hostile pairs that result: Horse–Buffalo, Sheep–Monkey, Cat–Rat, Cow–Tiger, Elephant–Deer,
Serpent–Rat (16), Serpent–Mongoose (96), Dog–Elephant (−126).
**QUIRK:** the STD pairs Elephant–Lion and Dog–Deer are replaced by Elephant–Deer and
Dog–Elephant, so Lion has no enemy in X1. Page words: 4 Auspicious, 0 Inauspicious, else
Average.

### 7.6 Rasi — PL-BIN 0x453807
```
k = (rasiB − rasiA + 12) mod 12           # 0 = same sign; groom's sign = (k+1)th from the bride's
k == 0           -> 7, code 41 ("1st")
k == 1  (2nd)    -> 0, code 42; X1 and rasiA even -> 3.5
k ∈ 2..5         -> 0, codes 43..46 (3rd..6th)
k ∈ 6..11        -> 7, codes 47..52 (7th..12th)
X1 only:
  (rasiA, rasiB) ∈ {(1,6),(9,2),(7,12),(11,4),(5,10),(3,8)}  -> 3.5   (code 0x9a, which has no text)
  if score < 3.5 and LF(A,B)                                  -> 3.5
```
Page words: 7 Auspicious; 0 < s < 7 Average; 0 Inauspicious. The results text is
"The moon sign of the bridegroom is in the ‹n›th from that of the bride which …" with the 12
sentences of COMPAT1 lines 41–52, chosen by `count12(rasiA, rasiB)`. It does not depend
on the score. **QUIRK:** for n = 2 the template also emits a stray " aaaaaa".

### 7.7 Rasyadhipati — the same scorer as §3.5 (H225; X is ignored)
Page: 5 Auspicious; 2 < s < 5 Average; s < 2 Inauspicious.
Text: 5.0 "mutual friends", 4.0 "friends", 3.0 "neutral" (never produced), 1.0 "enemies",
< 1.0 "mutual enemies".

### 7.8 Vasyam — PL-BIN 0x453a14
`rasiA ∈ VASYA_OF[rasiB] or rasiB ∈ VASYA_OF[rasiA]` → 2 (code 59, "concordant"), else
0 (code 60). It is two-way, and uses the table in §2.2.

### 7.9 Rajju — PL-BIN 0x453b14
```
same rajju -> 0, code 60 + rajju (61 Padha, 62 Ooroo/Kati, 63 Nabhi, 64 Kanta, 65 Siro)
else       -> 8, code 66
X1 and LF(A,B) -> score = 4   (QUIRK: this overrides an 8 as well as a 0)
```
Page: 8 Auspicious; 0 < s < 8 Average; 0 Inauspicious. The text comes from the code, so a
pair with different rajjus still prints "different … enhances the compatibility" even when
the score was forced to 4.

### 7.10 Vedhai — PL-BIN 0x453c67 / pair list 0x453bc1
Vedha pairs (unordered): 1–18, 2–17, 3–16, 4–15, 6–22, 7–21, 8–20, 9–19, 10–27, 11–26,
12–25, 13–24, 5–14, 5–23, 14–23 (STD).
`vedha → 0 (code 67) else 2 (code 68)`; **X1 and LF → score = 1** (QUIRK: it overrides
both values). Page: 2 Auspicious; 0 < s < 2 Average; 0 Inauspicious.

### 7.11 Other considerations
* **Gender** (0x453ccb), with groom = B and bride = A. The binary runs the tests in this
  order and the last match wins:
  M/F → 1 (69); M/M → 0.5 (70); F/F → 0.5 (71); H/H → 0.5 (code 71, "female and female",
  QUIRK); groom H/bride F → 0.5 (72); bride H/groom F → 0.5 (73); groom H/bride M → 0.5 (74);
  bride H/groom M → 0.5 (75); groom F/bride M → 0 (76).
  Page: 1 Auspicious, 0.5 Average, 0 Inauspicious.
* **Gothram** (0x453f6a/0x453ef4): the gothra comes from each Moon's **absolute** sidereal
  longitude λ. It is 1 Mareechi for λ < 53.333…; 2 Vasishta < 106.666…; 3 Angiras < 160;
  4 Athri < 213.333…; 5 Pulastya < 266.666…; 6 Pulaha < 306.666…; else 7 Kratu
  ("Grutha"). Bounds are at PL-BIN 0x5e2e78–0x5e2ea0, and strings at 0x614fd8 onward are
  plain ASCII. Different gothra → 1 (78), same → 0 (79).
* **Caste**: the §3.1 rule with **X1** varnas → 1 or 0.

### 7.12 Results page text (pib508)
The page opens with "There are ten considerations necessary to judge the suitability of a
proposed marriage. Out of these ten considerations at least five must be favorable for the
couple to be compatible." Then, for each koota, the heading (e.g. "1. Dhinam (luck)") and
the COMPAT1 sentence for its code. Then "Other Considerations" with Male/Female, Gothram
and Caste. Last comes "Total Points : ‹S1 total›". The page prints no computed verdict.
PL-MAN p. 106 adds: "A number below 18 is questionable, between 18 and 24 is good and above
24 is excellent". The manual does not say which total this applies to. Show it as PL's
guidance next to the 36-point totals.

### 7.13 COMPAT1.TXT (PL-HELP, decoded)
Line n (1-based) is text code n. Lines 1–28 are Dhinam, 29–33 Ganam, 34–35 Mahendhram,
36–37 Stree-Dheergham, 38–40 Yoni, 41–53 Rasi ("The Moon sign of the bridegroom is in the" +
the 1st..12th sentences), 54–58 Rasyadhipati, 59–60 Vasyam, 61–66 Rajju, 67–68 Vedhai,
69–77 gender ("The asterisms of the man and the woman are respectively" + 8 endings),
78–79 Gothram, 80–81 Caste, 82–97 headings. The decoded file is in the session scratchpad
(`compat/COMPAT1.dec.txt`, §11). **The sentences are PL's proprietary text.** Before
publishing, keep them out of the public repository, or paraphrase them.

---

## 8. Mangala (Kuja) Dosha

### 8.1 "Mangala Dosha – Consideration" (pib504)
* Header: five Sanskrit verses (Agastya Samhita, Maanasagari, Brihat Jyotishasara,
  Bhava Deepika, BPHS). They are in a Devanagari font encoding; render them as images or
  skip them.
* Fixed prose: Mangala Dosha is Mars in the 1st, 2nd, 4th, 7th, 8th or 12th from the birth
  Lagna. "Some rishis" also count from the Moon, Venus and the 7th lord. "In general
  practice Mangala Dosha is considered from the Lagna and the Moon."
* Computed, for each person (groom first): "In the birth chart of ‹name› Mars is placed in the
  ‹ordinal› house from the lagna while in the Moon chart Mars is placed in ‹ordinal› house
  from the Moon. Hence ‹name› is …" followed by one of:

| from Lagna | from Moon | text |
|---|---|---|
| yes | yes | "Mangalik from the Birth Chart and also Chandra Mangalik from the Moon Chart." |
| yes | no | "Mangalik from the Birth Chart but not from the Moon Chart." |
| no | yes | "not Mangalik from the Birth Chart but Chandra Mangalik from the Moon Chart." |
| no | no | "not a Mangalik from the Birth Chart as well as from the Moon Chart." |

  "yes" means Mars is in house ∈ {1, 2, 4, 7, 8, 12}. Template conditions are
  `~3I1+3I2+3I4+3I7+3I8+3I12~` and `~(3I1)2+…~`, where `(…)2` evaluates the formula in the
  Moon chart. The ordinal houses are counted sign to sign: Lagna sign → Mars sign, and
  Moon sign → Mars sign (`H301` `fromto12`). Venus and the 7th lord are **not** used.
  Severity is not graded.

### 8.2 "Mangala Dosha – Results" (pib505)
Static text: the effects of the dosha, "when the dosha is similar, it gets nullified", the
verse "if a girl with Mangala dosha marries a boy with Mangala dosha, the dosha is
cancelled", and remedies (Tuesday fasting, the Mangala Chandika Stotra 21× for 108 days,
and Sanskrit verses). Nothing on the page is computed.

### 8.3 "Mangala Dosha – Cancellation" (pib506)
The page is headed "Cancellation of Mangala Dosha between ‹groom› and ‹bride›", followed by
the fixed sentence "As per astrological classics, the Mangala Dosha cannot be cancelled
entirely, only its intensity can be reduced…".

Notation (PL-MAN pp. 136–138): `pIh` = planet p in house h (from the Lagna); `pIRs` = planet
p in sign s; `RsIh` = sign s in house h (`R2I1` means Taurus Lagna); `pE` exalted; `pd`
debilitated; `pO` own sign; `Np…` = in Navamsha; `pYq` = p conjoined with q;
`pDq` = p aspected by q; `pRq` = p conjoined with or aspected by q (the template prints
"conjoined with" or "aspected by" via `3Y4` and `3D4`); `pc` combust; `pv` weak; `pX` strong;
`+` = or; `*` = and (binds tighter than `+`). `**` is an "and" with the lowest precedence:
that reading makes every formula match its sentence except R21, so this spec treats it as
**inferred**. `ã3` = the dispositor of Mars, inferred from the sentence. `3Qr` is undecoded;
the sentence says "retrograde … or in an inimical sign".

`Mk(p)` = Mars ∈ houses {1,2,4,7,8,12} from the Lagna in person p.

**Gate:** the whole list prints only when `H620 Y3` = Mk(groom) or Mk(bride). It starts with
"In the charts of ‹groom› and ‹bride› the Mangala Dosha gets cancelled because of following
reasons". Each rule below prints an explanation (shown in italics on the page) and a
personalised line.

Pair rules, computed in PL-BIN 0x45690d (flags via H620):

| ID | Flag | Condition (literal) | Meaning as printed |
|---|---|---|---|
| R1 | Y4 | Mk(groom) and Mk(bride) | "Mars in 1/4/7/8/12 of both …" (the text omits the 2nd; the code includes it) |
| R2 | Y8 | Mk(groom) and bride's Saturn ∈ {1,2,4,7,8,12} | Mars of one, Saturn of the other |
| R3 | Y9 | groom's Saturn ∈ {1,2,4,7,8,12} and Mk(bride) | the same, with the roles reversed |
| R4 | Y10 | N(groom) > N(bride), where N = number of {Sun, Mars, Saturn, Rahu, Ketu} in houses {1,2,4,7,8,12} from the Lagna (0x45689c / 0x42f4b6) | "malefics in groom's chart exceed bride's → excellent". **QUIRK:** the text says from the Lagna **and** the Moon; the code counts from the Lagna twice and ignores its sign argument |
| R5 | Y13 ∧ Y3 | Bhakoot = 7 **and** Gana (X0) ≥ 5 **and** Ashtakoota total ≥ 27 | "Bhakoota friendly; or Gana friendship; or high guna → no dosha". **QUIRK:** the code requires all three (AND); the text says "or". The personalised line prints the groom's name twice ("‹K31› and ‹K31›") |

Per-person rules. Each is printed for the groom (K31) and then for the bride (K32), and each
is evaluated in that person's own chart:

| ID | Formula (literal) | Extra guard | Meaning |
|---|---|---|---|
| R6 | `3v+3R6+3R5+3c` | Mk | Mars weak, related to a benefic (Venus or Jupiter), or combust |
| R7 | H620 Y14: Mk(bride) and bride's Jupiter ∈ {1,4,5,7,9,10} | bride only | Jupiter in a kendra or trikona of the girl |
| R8 | `3I1+3I2+3I4+3I8+3I12 ** 3IR1+3IR4+3IR7+3IR10` | – | Mars in 1/2/4/8/12 in a movable sign (the 7th is not included) |
| R9 | `3I4+3I7 ** 3IR1+3IR4+3IR8+3IR10` | Mk | Mars in the 4th/7th in Aries, Cancer, Scorpio or Capricorn |
| R10 | `3I4+3I7+3I1+3I8+3I12 ** 3R2+3R5+3R4` | – | Mars in 1/4/7/8/12 and related to the Moon, Jupiter or Mercury |
| R11 | `3E+3O+N3E+N3O+3IR4+3IR5` | Mk | Exalted or own sign in D-1 or D-9, or in Cancer or Leo (the text lists each matching case) |
| R12 | `3IR4+3IR5+3IR1+3IR8+3IR10` | Mars ∈ {1,4,7,8,12} | Mars in Leo, Cancer, Aries, Scorpio or Capricorn |
| R13 | `3IR1+3IR8+3IR2+3IR7 ** 3I4` | – | Mars in the 4th in Aries, Scorpio, Taurus or Libra |
| R14 | `3I7 ** 3d+3E` | – | Mars in the 7th, debilitated or exalted |
| R15 | `3I8 ** R2I1+R3I1+R5I1+R9I1` | – | Mars in the 8th for Taurus, Gemini, Leo or Sagittarius Lagna |
| R16 | `3I12 ** R3I1+R4I1+R7I1+R8I1` | – | Mars in the 12th for Gemini, Cancer, Libra or Scorpio Lagna |
| R17 | `ã3I1+ã3I4+ã3I7+ã3I5+ã3I9+ã3I10` | Mk | The dispositor of Mars is in a kendra or trikona (the code counts from the Lagna only; the text also says the Moon) |
| R18 | `3Y5` | Mk | Mars conjoined with Jupiter |
| R19 | `3Y2` | Mk | Mars conjoined with the Moon |
| R20 | `3R4` | Mk | Mars conjoined with or aspected by Mercury |
| R21 | `3Y8+2I2 ** 6I2+8I1+8I4+8I7+8I10+3D5` | Mk | Text: Mars–Rahu conjunction, or the Moon and Venus in the 2nd, or Rahu in a kendra, or Jupiter aspecting Mars. Literal, if `**` has the lowest precedence: (3Y8 ∨ 2I2) ∧ (6I2 ∨ 8 in a kendra ∨ 3D5). **QUIRK/UNCERTAIN** |
| R22 | `2I1+2I4+2I7+2I10` | Mk | The Moon in a kendra from the Lagna |
| R23 | `3I1*3IR1+3I12*3IR9+3I4*3IR8+3I7*3IR2+3I8*3IR11` | – | Aries in the 1st, Sagittarius in the 12th, Scorpio in the 4th, Taurus in the 7th, Aquarius in the 8th |
| R24 | `3I1*3IR1+3I12*3IR9+3I4*3IR8+3I7*3IR2+3I8*3IR4` | – | The same explanation is printed again. The personalised line tests (7th, Capricorn) and (8th, Cancer) instead. **QUIRK:** the guard tests Taurus in the 7th but the line prints Capricorn |
| R25 | `5XI1+5XI7+6XI1+6XI7+3Qr+3d` | Mk | A strong Jupiter or Venus in the 1st/7th, or Mars retrograde/debilitated/in an inimical sign |

**Final line** (outside the gate): if neither person has Mk, print "In the Horoscope of ‹groom›
and ‹bride›, there is no Mangala Dosha."

Mars's house is the whole-sign house from the Lagna: the Consideration page counts it that
way (Lagna sign → Mars sign), and so do PL's yoga formulas, which are evaluated on the
rasi chart. The flag code reads a planet "house" field (+0x24), and this spec has not
confirmed that it is whole-sign (§10).

---

## 9. PL 7 versus PyJHora 4.8.7: explicit differences

Counts are over the 80 fixture pairs (`_pl_vs_pyjhora_north_disagreements`): tara 30,
gana 34, yoni 35, vashya 42, varna 10, maitri 8, total 69. Bhakoot and nadi: 0.

| Koota | PL 7 | PyJHora | Note |
|---|---|---|---|
| Varna | earth = Vaishya, air = Shudra (X0) | `vasiya_raasi_list` puts Taurus/Virgo/Capricorn in Shudra and Gemini/Libra/Aquarius in Vaishya | same "boy ≥ girl" rule |
| Vashya | if-chain matrix §3.2; Sagittarius/Capricorn split at 15° of the Moon | `VasiyaArray` (Saravali) `[girl][boy]`; splits Sagittarius/Capricorn by **pada** (an approximation it notes itself) | different matrix |
| Tara | one direction (groom from bride); 3 if t ∈ {1,2}, else 1.5 | both directions; **+1.5 for each direction whose remainder is 3, 5 or 7** (the malefic taras: an inverted v3.1.1 regression), else 0 | both differ from STD; PL's is PL-BIN |
| Yoni | symmetric matrix §3.4 (PL-BIN) | asymmetric `YoniArray[girl][boy]` | 72 cells differ; the enemy pairs agree |
| Graha Maitri | relationship sum; neutral–neutral = 1 | lord matrix; neutral–neutral = 3 | |
| Gana | bride D/groom M = 5, bride M/groom D = 6, bride D/groom R = 1, bride R/groom D = 0 | `gana_array[girl][boy]` = the transpose (6, 5, 0, 1) | |
| Bhakoot | 2/12, 5/9, 6/8 = 0, no exceptions | same | |
| Nadi | same nadi = 0, no exceptions | same | |
| Total thresholds | ≤16 avoid, ≤21 medium, ≤30 good, >30 excellent | `Match` filter minimum 18 | |
| Dina | (groom from bride) mod 9 ∈ {2,4,6,8,9} plus the Kalaprakasika pair tables §7.1 | `count_stars(boy, girl)` ∈ {2,4,6,8,9,11,13,15,17,18,20,21,24,25,26} plus its own exceptions | different base and direction |
| Gana (S) | 6/5/1/0 matrix, raised to 3 if LF | boolean: D-D, M-M, D-M, M-D, or R-R with the girl's star > 14 | |
| Mahendra | {4,7,…,25} from bride to groom | same | |
| Stree-Deergha | > 13 | > 7 (South) / > 13 (North) | PyJHora South is looser |
| Yoni (S) | 4/2/0 with PL's hostile pairs §7.5 | boolean; `yoni_enemies_south` includes Serpent–Rat; Elephant–Lion and Dog–Deer are enemies | PL lacks Elephant–Lion and Dog–Deer and adds Elephant–Deer and Elephant–Dog |
| Rasi (S) | 7 for the 1st and 7th–12th; 3.5 for special cases; LF raises to 3.5 | boolean: count from girl to boy > 6 | PyJHora fails the 1st (same sign) |
| Rasyadhipati (S) | 5/4/1/0.5/0 | boolean `raasi_adhipathi_array_south[girl lord][boy lord]` | |
| Vasya (S) | two-way, PL's `VASYA_OF` table | one-way: boy ∈ `vasiya_list[girl]` (STD list) | |
| Rajju | 0/8, forced to 4 under LF | North: same body part = fail; South: an ascending/descending (aaroga/avaroga) rule first | |
| Vedha | 15 STD pairs, forced to 1 under LF | `nak_boy + nak_girl ∈ {19, 28, 37}` flags many non-STD pairs (e.g. 1–27, 6–13, 15–22) | |
| Gender, Gothra, Caste | computed (44-point total) | not implemented | |
| "Minimum porutham" | – | Rajju and (Dina, Gana, Rasi, Yoni) | PyJHora only |
| Manglik | houses {1,2,4,7,8,12} from the Lagna and from the Moon, with the cancellation list §8.3 | `dosha.manglik`: default {2,4,7,8,12} (**no 1st house**), reference = Lagna (the Moon or Venus are optional), 17 BV Raman exceptions | different house set and exception list |

---

## 10. Open questions and how to close them
1. **Tara (§3.3)** and **Graha Maitri neutral–neutral = 1 (§3.5)** are read from the code but
   are surprising. One real PL 7 printout of the "Ashtkoot Guna Matching" page settles both:
   for a pair whose taras are not Janma or Sampat, the Tara row must show 1.5. The PLAN.md
   §13 printout requested from the boss is the right oracle.
2. **A/B selection by the sex byte (§1.3).** Confirm with that printout which person PL puts in
   the K31 column, and whether PL swaps the charts when the bride's chart is the current one.
3. **The planet "house" field +0x24** used by the Mangala flags (Y1, Y2, Y8, Y9, Y10, Y14):
   whole-sign is assumed. Check it with a chart whose Mars lies near a bhava cusp.
4. **Yoga-formula operators** `**`, `v`, `X`, `R`, `Q`, `ã` (§8.3) are inferred from the
   sentences next to them. The formula lines were decoded with a uniform −2 shift correction,
   which is reliable because the key alternates; the letters themselves are certain.
5. **Dasha table rows (§6)** and the **N17–N19 planet rows (§5)** need one printout.
6. **The scale of the manual's 18/24 thresholds** (§7.12).
7. **Names:** the string table for koota class names was not located. The standard names in
   ID order are assumed.

## 11. How the sources were decoded (reproducibility)
* `Lang1/COMPAT1.TXT` and `Extras1/pib*.txt`: each line is `##` + a type character in clear
  + a body. Byte i of the body decodes as `chr((k + (i mod 2) − c) & 0xff)` with one key k per
  line. k is found by brute force, maximising readable characters plus template tokens
  (`<&`, `C1;`, `<pa,` …). Scripts: scratchpad `compat/dec4.py` and `compat/dec5.py`. Only
  the formula lines need a manual −2 shift (see §10.4).
* The binary was disassembled with capstone 5 from PyJHora's venv
  (`compat/fdis.py`, `compat/all.txt`). The tables were confirmed by emulating the jump
  tables (`compat/yoni_emu.py`) and by reading the stack-built yoni triangle at 0x452d0a.

## 12. Fixture contract (`tests/fixtures/compat_pyjhora.json`)
80 synthetic pairs: 14 chosen edge cases plus 66 random ones (seed 20261024). Each case has
`boy`/`girl` {nak, pada, sign, lon, deg_in_sign}, `pyjhora.north` (8 kootas, total, mahendra,
vedha_ok, rajju_ok, sthree_dheerga), `pyjhora.south` (10 booleans, count_of_10,
minimum_porutham) and `pl_model` (this spec restated in Python: Ashtakoota X0, Dashakoota
X1 with dina_text_code, Kalaprakasika total of 44, BV Raman total of 36).
**`pl_model` is not an oracle.** Use it to diff a TypeScript port against this spec, and
regenerate it whenever the spec changes. PyJHora is the independent check. Every
PL-vs-PyJHora difference is expected and listed in §9.

# PL Page 1 — strength fields: implementable specification

Status: research spec for the KAAST 2 engine team. Oracle: `kaast2/oracle/page1_strengths.py`
(runs in under 1 s; 145 fields checked against `kaast2/tests/fixtures/pl9_page1_amitabh.json`;
0 mismatches; 2 rows reported OPEN).

## 0. Conventions used in this document

**Grades.** BIN = read from `PL7.exe` (function or table address given); DOC = PL manual/help;
NUM = reproduces the PL9 fixture numbers; STD = textbook rule, not yet confirmed; OPEN = not settled.
A rule may carry two grades, for example BIN+NUM: the PL7 code and the PL9 numbers agree.

**PL7 versus PL9.** The binary is PL 7.0. The fixture is PL 9.0. Where they disagree, the fixture
wins, and the difference is stated.

**Notation.**
- Longitudes λ are sidereal (PL Lahiri polynomial, PLAN §3.1), in degrees [0, 360).
- `sign(λ)` = ⌊λ/30⌋ (0 = Aries). `deg(λ)` = λ mod 30.
- `dist(a,b)` = shortest arc, 0..180 (BIN `0x5b1f1e`).
- `fwd(a,b)` = (b − a) mod 360 (BIN `0x45b0be`; the first argument is the one pushed last).
- Planet ids are those PL uses: Su 1, Mo 2, Ma 3, Me 4, Ju 5, Ve 6, Sa 7, Ra 8, Ke 9.
- Virupas: 60 virupas = 1 rupa.

**Fixture chart.** 11 Oct 1942, 16:00, zone +6.5 h, Allahabad (25.45 N, 81.85 E). The Ascendant is
Aquarius 1°56′. Casting follows the recipe in the brief.

**Source material decoded for this work.** PL's text resources are lightly obfuscated, and the method
is described below so the work can be repeated:
- Help, tutorial and BPHS texts: each CRLF line is shifted by a key that alternates between a and a±1.
- Lines starting `##X` keep X in clear text and encode the rest by reflection, p = K − c (K alternating).
- The UI string table `Bin/Fn_60_1.enc` uses `###` lines, reflected, with plaintext starting `define`.
  Every label quoted below comes from it as `id//text`.
- Machine code was read with `objdump -d -M intel`. VA = file offset + 0x400000.

## 1. Rasi chart edge labels (per house)

### 1.1 First number: Sarvashtakavarga bindus of the house's sign — BIN/STD + NUM (12/12)
- Houses are **whole-sign**: house h = sign(Asc) + h − 1.
- Bhinnashtakavarga uses the standard Parashari (BPHS) contributor tables for Su…Sa, with the Ascendant
  as the eighth contributor. The tables are in the oracle `BAV` dict. Totals: Su 48, Mo 49, Ma 39,
  Me 54, Ju 56, Ve 52, Sa 39, sum 337.
- SAV(sign) = Σ over the 7 planets of BAV_p(sign). The display shows SAV(sign of house h).
- Worked example: SAV by sign Ar..Pi = 26 33 29 42 23 20 21 29 32 24 31 27, sum 337.
  By house from Aquarius: 31 27 26 33 29 42 23 20 21 29 32 24. This equals the fixture exactly.

### 1.2 Second number: Bhava Bala in virupas — BIN (`0x58ee8b`) + NUM (12/12, residual ≤ 0.46)
The printout labels (ids 2657–2665) are: Bhava Bala, Rashi, Degree, From Lord, Dig Bala, Drishti,
Planets in, Day-Night, Total. For house h:

1. **Bhava madhya m_h.** It comes from the "Bhava bala house cusps" option (ids 841–843:
   Sri Pati / Equal). The fixture fits **Equal**: m_h = Asc + 30(h−1). Sripati misses by up to 65
   virupas (NUM). Note that PL9's default may be a user setting (see §7).
2. **From Lord** = total shadbala (virupas) of the lord of sign(m_h), from §4.
3. **Dig bala** = dist(m_h, m_w)/3, where w is the house in which the madhya's sign type is weakest.
   Classification is by the sign and degree of m_h (BIN `0x57e204`, `0x57e263`, `0x57e2a2`, `0x57e320`):

   | Type | Signs | Weakest at house (w) |
   |---|---|---|
   | nara | Ge, Vi, Li, Aq, Sg below 15° | 7 |
   | jalachara | Pi, Cp above 15° | 10 |
   | chatushpada | Ar, Ta, Le, Sg above 15°, Cp below 15° | 4 |
   | keeta | **Cn and Sc** | 1 |

   Cancer is *keeta* here, not water. This is required by house 6 (NUM).
4. **Drishti** = the same function as planetary drik bala (§4.6), evaluated at m_h, with all 7 planets
   aspecting.
5. **Planets in.** Occupancy is by whole sign. Start at n = 0.
   - Sun in the house: n = −1 (an assignment, not a subtraction).
   - Then add: Ma −1, Me +1, Ju +1, Sa −1.
   - The value is 60·n. Moon, Venus and the nodes are ignored.
6. **Day-Night** = +15 when:
   - it is a day birth and sign(m_h) is a śīrṣodaya sign (Ge, Le, Vi, Li, Sc, Aq); or
   - it is a night birth and the sign is pṛṣṭhodaya (Ar, Ta, Cn, Sg, Cp).

   Pisces gets 15 only in the "twilight" branch (`0x58ee5a`, condition not decoded; OPEN, it does not
   apply to the fixture).
7. **Total** = sum of the five parts.

Worked example, house 6:
- m = 91.95 (Cancer).
- From Lord: Moon 298.65.
- Dig: 120/3 = 40 if water; as keeta, dist to m₁ = 150°, so 50.
- Drishti −16.15.
- Planets: Jupiter, +60.
- Day-night 0.
- Total 392.50 against 392.83.

Residual (fixture − oracle): the 12 residuals come in identical pairs for houses with the same lord:
H1/H12 (Sa) +0.13, H2/H11 (Ju) +0.33, H3/H10 (Ma) +0.32, H4/H9 (Ve) +0.50/+0.51,
H5/H8 (Me) −0.01, H6 (Mo) +0.33, H7 (Su) −0.46. Every bhava component is therefore exact. The error
is entirely in the lord's shadbala total, at 0.5 virupa or less. Closing it needs the PL Shadbala
table printout (§7).

## 2. Planet table

### 2.1 Nakshatra, pada, syllable — BIN + NUM (10/10)
- n = ⌊λ/(40/3)⌋ and pada = ⌊(λ − n·40/3)/(10/3)⌋ + 1.
- Planet-table name: the `short` list (ids 1614–1640), for example "Dhanish.", "Satabhi.", "P.Phalg.".
  The full names (ids 1642–1668) are used elsewhere.
- Chart label: `dd:mm` of deg(λ), truncated, plus the 3-letter `tiny` list (ids 3553–3579).
- Pada syllable: the `nama_*` list (ids 2860–2967).
- All three lists, with ids, are in `kaast2/tests/fixtures/nakshatra_names.json` and `pada_syllables.json`.
  All 9 syllables and 10 names or abbreviations visible in PL9 equal PL7.
- PL7 quirks kept verbatim (OPEN whether PL9 changed them):
  - Pushya-4, P.Shad-2, P.Shad-4 and P.Bhadra-3 are all "Dah".
  - Satabhisha-3 and -4 are both "See".
  - Swati-4 is "Tah".

### 2.2 Retrograde/combust flags — BIN (`0x405340`, caller `0x4272f9`) + NUM
- `R` if the longitude speed is below 0.
- `c` if dist(λ_Sun, λ_p) < orb, a strict inequality on ecliptic longitude only.
- Orbs: Mo 12, Ma 17, Me 14, Ju 11, Ve 10, Sa 15. When the planet is retrograde: **Me 12, Ve 8**.
- The Sun and nodes are never combust. PL also returns "Combustion%" = 100·dist/orb.
- Fixture: Ma 1.78° gives c; Me 0.72° (retrograde, orb 12) gives Rc; Ve 9.19° (direct, 10) gives c.
  Mo 15.9° is not combust (orb 12), and Ju and Sa are far. All match.

### 2.3 Pada, star/sub/sub-sub
Already reproduced by the engine (KP rules); not in this spec.

## 3. Strength table columns

### 3.1 Dignity — BIN tables + STD precedence + NUM (9/9)

**Labels**, short form (ids 1989–1997) and long form (ids 1979–1987):

| Short | Long |
|---|---|
| `Exalt.` | Exalted |
| `Moolt.` | Moolatrik. |
| `Own` | Own |
| `Grt.Fr.` | Grt. Friend |
| `Frnd.` | Friend |
| `Neutr.` | Neutral |
| `Enemy` | Enemy |
| `Grt.En.` | Grt. Enemy |
| `Debil.` | Debilitat. |

**Tables (BIN)**, 1-based signs, indexed by planet 1..9:
- MT sign `0x5f1c58`: 5 2 1 6 9 7 11 3 9.
- MT degree range `0x621aea`, as open intervals:
  Su 0–20, Mo 3–30, Ma 0–12, Me 15–20, Ju 0–10, Ve 0–15, Sa 0–20, Ra 0–30, Ke 0–30.
- Own signs: `0x5f1cbc`/`0x5f1ce0`. Rahu owns Ge and Aq; Ketu owns Sg and Sc.
- Debilitation sign `0x5f1c7c`: 7 8 4 12 10 6 1 8 2. Exaltation sign = debilitation sign + 6.
- Deep debilitation degrees `0x5f1ca4`: 190 213 118 345 275 177 20.
- **Natural relationship table** `0x613628`, a 9×9 int32 array, row = planet's view; 2 friend,
  1 neutral, 0 enemy. Su–Sa follow BPHS. The node rows and columns are PL's:

  | View of → | Su | Mo | Ma | Me | Ju | Ve | Sa | Ra | Ke |
  |---|---|---|---|---|---|---|---|---|---|
  | Ra | E | E | E | N | F | F | F | – | E |
  | Ke | E | E | F | N | N | F | E | E | – |

**Precedence (STD, consistent with NUM):**
1. Exaltation sign, except Moon above 3° is MT, and Mercury at 15° or more is MT (15–20) or Own (20–30).
2. Debilitation sign.
3. MT range.
4. Own sign.
5. Otherwise the compound relationship with the sign lord. Compound = natural (−1/0/+1) + temporal,
   where temporal is +1 if the lord sits 2, 3, 4, 10, 11 or 12 signs from the planet (by rasi), else −1.
   Result: +2 GF, +1 F, 0 N, −1 E, −2 GE.

Fixture: Me Vi 23°39′ gives Own (not Exalt). This is the evidence that Virgo exaltation is degree-limited.
Ra in Le: E + F = Neutr. Ke in Aq: E + F = Neutr.

### 3.2 SB% — BIN (`0x58cdb1`) + NUM (7/7)
SB% = total shadbala (§4) ÷ required total in virupas: Su 390, Mo 360, Ma 300, Me 420, Ju 390,
Ve 330, Sa 300 (BIN `0x58cfd2`, immediates). Displayed to 2 decimals. The nodes are blank (Su–Sa only).

| | Su | Mo | Ma | Me | Ju | Ve | Sa |
|---|---|---|---|---|---|---|---|
| Computed | 1.2166 | 0.8296 | 0.9374 | 1.1507 | 1.2284 | 1.1409 | 1.2998 |
| Fixture | 1.22 | 0.83 | 0.94 | 1.15 | 1.23 | 1.14 | 1.30 |

### 3.3 SB# — "Number of strong Balas" (ids 3643, 3700) — BIN + NUM (7/7)
SB# is the count of the five groups whose value is at least the minimum. The comparison is ≥ (BIN).
Minima table (BIN `0x58cf30`, group×7 byte table), columns Su Mo Ma Me Ju Ve Sa:

| Group | Su | Mo | Ma | Me | Ju | Ve | Sa |
|---|---|---|---|---|---|---|---|
| sthana | 165 | 133 | 96 | 165 | 165 | 133 | 96 |
| dig | 35 | 50 | 30 | 35 | 35 | 50 | 30 |
| kala | 112 | 100 | 67 | 112 | 112 | 100 | 67 |
| cheshta | 50 | 30 | 40 | 50 | 50 | 30 | 40 |
| ayana | 30 | 40 | 20 | 30 | 30 | 40 | 20 |

Fixture results: Su 2 (dig, kala), Mo 1 (ayana), Ma 4, Me 4, Ju 3, Ve 2 (sthana, kala),
Sa 4. All equal.

### 3.4 VB (Vimshopaka) — NUM (8/9); Ketu OPEN
- PL7's manual says the planetary table uses 10 vargas (DOC). The PL9 fixture instead fits the
  **shadvarga** scheme with weights D1 6, D2 2, D3 4, D9 5, D12 2, D30 1 (sum 20).
- Varga rules: Parashari hora, drekkana (1/5/9), D9 = 9λ, D12 from the sign itself, Parashari D30.
  These are PL7's own routines (BIN `0x57d207`, `0x57d2f3`, `0x57d647`, `0x57d6b1`).
- Points per varga:
  - 20 if the varga sign is the planet's own sign (node own signs as in §3.1).
  - Otherwise by compound relationship with the varga lord, with the temporal part from the rasi:
    GF 18, F 15, N 10, E 7, GE 5.
  - Exaltation does **not** score 20. With it, Jupiter would be 19.5 against the fixture's 18.
- VB = Σ weight × points / 20, **rounded**. Truncation fails for Mo, Ju and Ve.
- Computed: Su 11.05, Mo 10.9, Ma 9.25, Me 13.85, Ju 17.6, Ve 12.75, Sa 10.25, Ra 12.8, Ke 9.1.
  Fixture: 11 11 9 14 18 13 10 13 **14**.
- Other schemes tried and rejected: saptavarga, dashavarga and shodashavarga, each under natural or
  compound relations and with or without exaltation (oracle-side search; the next-best scheme gets 10 or more integer errors across the 9 planets).
- **Ketu (OPEN):** 9.1 against 14. No consistent standard rule gives 14. Fits that would round to 14:
  - Ketu evaluated with Rahu's relationship row and Aquarius as own: 13.6.
  - Ketu's varga signs taken as Rahu's sign + 6, with Rahu's row: 14.15.

  The fixture notes that the Ra/Ke column alignment is uncertain. Evidence that would settle it: the PL9
  "Vimshopaka Bala" printout for this chart, or any chart's planet table with Ketu in a different
  varga pattern.

### 3.5 AV — NUM (7/7); Rahu OPEN
- AV = BAV_p(sign of p). Fixture: Su 2, Mo 4, Ma 1, Me 4, Ju 7, Ve 4, Sa 3 (Jupiter = 7 is the
  acceptance example).
- Rahu shows 4 and Ketu is blank. Candidates that give 4 for Rahu in Leo: the dispositor Sun's BAV
  in Leo (4), Saturn's (4), Mercury's (4), Venus's (4). Not decidable from one chart (OPEN).

### 3.6 Av3 (Jagradadi) — STD + NUM (9/9)
Labels Alr. / Drm. / Slp. (ids 2003–2005); long forms Alert / Dream / Sleep.
- **Alert** if the planet is in its exaltation sign, own sign or MT range.
- **Sleep** if it is in its debilitation sign, or the sign lord is a *natural* enemy (§3.1 table).
- **Dream** otherwise (natural friend or neutral).

Nodes use their PL rows. For example, Su in Vi has Me as a natural neutral, so Dream, although the
compound relationship is Enemy.

### 3.7 Av5 (Baladi) — NUM (9/9) + BIN (label order)
- k = ⌊deg/6⌋ (0..4).
- Labels in PL's index order (ids 2007–2011): `Dead, Old, Adoles., Youth., Infant`.
- **Even signs** take label[k]. **Odd signs** take label[4−k].
- So odd signs run 0–6 Infant, 6–12 Youth., 12–18 Adoles., 18–24 Old, 24–30 Dead. This swaps
  Youth and Adolescent relative to BPHS (BPHS: Bala, Kumara, Yuva, Vriddha, Mrita). The fixture
  requires PL's order: Mo Li 10° is Youth., Ve Vi 15° is Adoles.
- Acceptance example: Ju Cn 0°32′, even sign, k=0, gives Dead.

### 3.8 K7 — DOC + NUM (7/7)
Sort Su–Sa by deg(λ), descending. Labels in order: AK, AmK, BK, MK, PiK, GK, DK. PL7's string is
`AK,AmK,BK,MK,PK,GK,DK` (id 3691); PL9 prints `PiK`. Rahu is excluded and its row is blank.

### 3.9 Func. — BIN (PL7 default table, constructor `0x568339`) + NUM (9/9)
- 12 ascendant rows by 9 planets (Su..Ke). Codes: M = malefic, B = benefic, N = neutral. The user can
  edit these in PL's "Planetary Natures" dialog (ids 844–860).

  | Asc | Su Mo Ma Me Ju Ve Sa Ra Ke |
  |---|---|
  | Ar | B N B M B M M M M |
  | Ta | B M N B M M B M M |
  | Ge | M N M N M B B M M |
  | Cn | N B B M B M N M M |
  | Le | B N B M B M M M M |
  | Vi | N M M B M B M M M |
  | Li | M N M B M N B M M |
  | Sc | N B N M B M M M M |
  | Sg | B N B M N M M M M |
  | Cp | N M M B M B N M M |
  | Aq | N M M N M B B M M |
  | Pi | M B B M B M M M M |

  A 13th row, "independent of asc.", reads M ? M ? B B M M M. The `?` (code 4) marks the
  conditional Moon and Mercury.
- **Nodes, PL9 (NUM):** the fixture shows Ra Neutral and Ke Benefic, where PL7's table has M M. The
  rule that fits is **the dispositor's functional nature**: Rahu in Leo takes the Sun's N, Ketu in
  Aquarius takes Saturn's B. "Nature of the house occupied" also fits (7th is neutral, 1st is benefic),
  so this is OPEN until a chart separates the two.
- Note: PL7 also has a separate `Func.Mal.`/`Func.Ben.` flag (`0x428d9d`, Systems-Approach style:
  lord of 6, 8 or 12 counted from MT signs; nodes always malefic). Page 1 does not use it.

## 4. Shadbala (PL7 `0x58c342` → `0x58c3b2`, init `0x58d9d4`) — BIN + NUM

Total = sthana + dig + kala + cheshta + naisargika + drik. Yuddha (`0x58ce59`, war within 1°)
is computed for display but **not** added (BIN). Values are in virupas for Su–Sa only.

### 4.1 Sthana bala
- **Uchcha** = dist(λ, deep-debilitation degree)/3.
- **Saptavargaja**, over D1, D2, D3, D7, D9, D12, D30 (varga codes 1, 2, 3, 5, 6, 8, 13):
  - The planet is in its own sign: in D1 it scores 45 if inside the MT degree range, else 30. In the
    other vargas it scores 30.
  - Moon in Taurus in D1 is checked against MT.
  - Otherwise the score is Raman's value at index 6 − nat − temp, using rasi positions:
    GF 22.5, F 15, N 7.5, E 3.75, GE 1.875 (BIN float table in `0x58d6c8`).
  - Exaltation is not scored.
- **Ojayugma**: 15 for each of rasi and navamsa that is even for Mo/Ve, or odd for the others.
- **Kendra**: by whole sign from the Ascendant. 60 for houses 1, 4, 7, 10; 30 for 2, 5, 8, 11;
  15 for 3, 6, 9, 12.
- **Drekkana**: 15 if the decanate (1 + ⌊deg/10⌋) is 1 for Su/Ma/Ju, 2 for Me/Sa, or 3 for Mo/Ve.
  A PL option (`[cfg+0x6a5]`) swaps the decanates of neuter and female planets; the default is the
  standard rule (NUM).

### 4.2 Dig bala
dist(λ, weak point)/3. Weak points: IC = MC+180 for Su and Ma; MC for Mo and Ve; Asc+180 for Me
and Ju; Asc for Sa. The option "4th/10th house in Dig bala" (id 3043) is set to *cusps*. The
alternative *kendras* (Asc±90) is off by 3.5 virupas (NUM).

### 4.3 Kala bala (eight parts)
- **Sunrise and sunset** are the instants when Asc(t) = λ_Sun(t), and Asc(t) = λ_Sun(t)+180
  (BIN iteration in `0x58d9d4`). This is the geometric centre with no refraction. Option ids 836/837
  ("Centre of Sun" / "Edge of Sun") add an offset when set to edge.
  Fixture: sunrise 07:02:28, sunset 18:36:20 (zone time). With refraction, sunrise would fall at
  06:59:58 and the hora would flip, so the no-refraction rule is NUM-proven.
- **Day/night** is decided by the Sun's longitude against the Ascendant: fwd(Asc, Sun) ∈ (0,180)
  means night. Night is then split before and after midnight (`[0x60]` ∈ {1,2,3,4}).
- **Natonnata:**
  - noon = (sunrise+sunset)/2.
  - X = ((jd − (noon + 0.5013689628737269))·360) mod 360. The constant is half a sidereal day
    ratio (BIN).
  - Diurnal value = 60 − |X−180|/3, used for Su, Ju, Ve.
  - Nocturnal value = 60 − diurnal, used for Mo, Ma, Sa.
  - Mercury = 60.
  - Fixture: X = 227.158, diurnal 44.28.
- **Paksha:**
  - e = dist(Su, Mo)/3.
  - Benefics (Mo, Ju, Ve, and Me unless Mercury shares its sign with Su, Ma, Sa, Ra or Ke) get e.
  - Malefics get 60 − e.
  - The Moon's value is **not** doubled; the Moon's paksha re-appears as its cheshta.
  - Option id 3042 controls Mercury; the default is "Mal. if with mal." (NUM: Me is with Su and Ma,
    so 54.69).
- **Tribhaga:**
  - Jupiter always gets 60.
  - A day birth gives 60 to Me, Su or Sa for the 1st, 2nd or 3rd third of sunrise→sunset.
  - A night birth gives 60 to Mo, Ve or Ma for the thirds of sunset→next sunrise.
- **Abda, Masa, Vara, Hora** (BIN):
  - A = ⌊jd + λ_geo/360 − 2380557.5⌋, local mean days. Subtract 1 when the birth falls after
    midnight but before sunrise. While A < 0, add 75600.
  - n7(n) = ((n−1) mod 7)+1, mapped to 1 Su, 2 Mo, … 7 Sa.
  - year lord = n7(1 + 3⌊A/360⌋), giving 15 virupas.
  - month lord = n7(1 + 2⌊A/30⌋), giving 30.
  - vara = n7(A mod 7), giving 45.
  - hora number h = 1 + ⌊24·(jd − sunrise)⌋, with 1-hour horas. hora lord = n7(vara + 5(h−1)),
    giving 60.
  - This is Raman's ahargana method; the epoch weekday is aligned so A mod 7 = 0 is Saturday.
  - Fixture: year Ju, month Sa, vara Su, hora 9 = Ve. The Venus hora is NUM-proven: it is the only
    way Venus reaches SB# 2 and 1.14.
- **Ayana** = (s·δ + 23.45)/46.9 × 60 (BIN constants 23.45 and 1/46.9).
  - s = +1 for Su, Ma, Ju, Ve; −1 for Mo, Sa; sign(δ) for Me.
  - δ is the **declination of the ecliptic point** (latitude ignored): δ = asin(sin ε · sin λ_tropical).
    This is NUM: using the true equatorial declination instead leaves residuals (fixture − computed) of
    Mo +5.5, Ve −2.6 and Sa −2.6 virupas, which breaks Mo, Ve and Sa at 2 decimals.
  - ε choice (23.44, 23.45 or true) changes nothing at 2 decimals.
  - The Sun is not doubled here, but its cheshta = its ayana (§4.5).

### 4.4 Required numerical details
- Lahiri, cusps and casting: PLAN §3.1.
- The Ascendant and MC used in dig and kendra bala are the chart's Asc/MC; the 4″ residual in the
  fixture Ascendant is harmless.

### 4.5 Cheshta bala (PL's own geometric rule, BIN `0x58c0f2`, `0x55525c`, `0x58bfe5`)
- **Sun:** cheshta = Sun's ayana bala. **Moon:** cheshta = Moon's paksha bala.
- **Ma–Sa, inputs:**
  - A-events: conjunction with the Sun, with the planet direct (superior conjunction for Me and Ve).
  - B-events: opposition (Ma, Ju, Sa) or inferior conjunction (Me, Ve), with the planet retrograde.
  - x3 = the B-event between the previous and next A-events.
  - x2 = the previous A if jd < x3, else the next A.
- **Station longitude Lst:** start at t = x3 − s·D, where s = +1 if jd < x3, else −1, and
  D = Ma 30, Me 10, Ju 55, Ve 21, Sa 60 days. Step one day toward the station (direction set by the
  sign of s·speed) until the speed sign flips, or 12 steps. Lst = the longitude at the last evaluated
  day. Note: if the station is more than 12 days from the start, PL stops early.
- **Formula:**
  - With L2 = λ(x2), L3 = λ(x3), Ln = λ(now):
    - If x3 < x2: a = fwd(Lst, L2), v = fwd(Ln, L2).
    - Else: a = fwd(L2, Lst), v = fwd(L2, Ln).
  - If v > 300, then v = 360 − v.
  - tot = dist(L3, Lst) + a.
  - w = v if the planet is direct, else dist(Lst, Ln) + a.
  - cheshta = 60·min(w, tot)/tot. This is 0 at conjunction and 60 at opposition.
- **PL7 epoch source:** PL7 takes x2/x3 from its own analytic series (A: `0x554dd9`,
  B: `0x55500c`; per-planet periods 779.93, 115.8775, 398.88, 583.92, 378.10 d; coefficients at
  `0x5f2960`–`0x5f2b30`). They are deliberately **not** copied into kaast2.
- The oracle uses true Swiss events. Values: Ma 0.82, Me 59.63, Ju 45.02, Ve 9.18, Sa 46.14.
  PL7-series emulation gives 1.35, 59.40, 45.21, 9.81, 46.36. Both reproduce the fixture SB%. The
  series version fits the bhava residuals slightly better for Ma, Ju and Ve (≤0.21 against ≤0.50).
- An option at `[0xe2a]` replaces cheshta with 30 − 20·speed; the default is off.
- Rejected models (NUM): classical mean-longitude cheshta (residual up to 11 virupas on Jupiter) and
  speed-class cheshta.

### 4.6 Drik bala (BIN `0x58d8ad`, aspect curve `0x404f64`)
- Drik bala = Σ over the other planets of a weighted aspect value.
- d = fwd(λ_aspecting, λ_target). The aspect value comes from the 30° sector k = ⌊d/30⌋:

  | k | Standard | Mars | Jupiter (and nodes) | Saturn |
  |---|---|---|---|---|
  | 1 | (d−30)/2 | | | 2(d−30) |
  | 2 | d−45 | 1.5(d−60)+15 | | 90−d/2 |
  | 3 | (120−d)/2+30 | 150−d | d/2 | 90−d/2 |
  | 4 | 150−d | | 180−d | |
  | 5 | 2(d−150) | | | |
  | 6 | (300−d)/2 | 60 | | |
  | 7 | (300−d)/2 | 270−d | (d−210)/2+45 | |
  | 8 | (300−d)/2 | | 300−d | d−210 |
  | 9 | (300−d)/2 | | | 2(300−d) |

  Sectors 0 and 10–11 are 0.
- Weights:
  - Su, Ma, Sa: −¼.
  - Moon: +¼ if fwd(Su, Mo) ≤ 180, else −¼.
  - Venus: +¼.
  - Jupiter: ×1. Option id 3045 "Jup & Merc in Drig bala" is set to *full weight*.
  - Mercury: ×1, negated if it shares its sign with Su, Ma, Sa, Ra or Ke (option id 3044 = "Mal. if
    with mal.").
- Planets aspect from all signs (degree-based); there is no sign-drishti filter.

### 4.7 Naisargika
60 × {Su 1, Mo .857, Ma .286, Me .429, Ju .571, Ve .714, Sa .143}. These are 3-decimal factors
(BIN `0x5f4900`).

### 4.8 Worked fixture breakdown (oracle `--verbose`)

| | sthana | dig | kala | cheshta | nais | drik | total | SB% |
|---|---|---|---|---|---|---|---|---|
| Su | 151.46 | 43.95 | 165.21 | 21.24 | 60.00 | 32.63 | 474.48 | 1.2166 |
| Mo | 116.31 | 10.74 | 67.21 | 5.31 | 51.42 | 47.66 | 298.65 | 0.8296 |
| Ma | 96.95 | 43.35 | 92.52 | 0.82 | 17.16 | 30.41 | 281.21 | 0.9374 |
| Me | 195.86 | 17.24 | 153.09 | 59.63 | 25.74 | 31.73 | 483.29 | 1.1507 |
| Ju | 223.51 | 10.47 | 181.95 | 45.02 | 34.26 | −16.15 | 479.07 | 1.2284 |
| Ve | 148.31 | 19.12 | 135.41 | 9.18 | 42.84 | 21.65 | 376.51 | 1.1409 |
| Sa | 169.12 | 35.76 | 161.91 | 46.14 | 8.58 | −31.57 | 389.95 | 1.2998 |

Residual against PL, inferred from the paired bhava-bala residuals: ≤0.5 virupa per planet.

## 5. Nodes on Page 1 (edge example)
- SB%, SB# and K7 are blank: shadbala and K7 loop over Su–Sa only (BIN).
- Dignity, Av3 and Av5 use the node rows and tables of §3.1. Ra and Ke are Neutr., Slp., Youth. — all
  match.
- VB: Ra 13 matches; Ke is OPEN (§3.4).
- AV: Ra 4 is OPEN (§3.5); Ke is blank.
- Func.: dispositor rule (§3.9).

## 6. Status table

| Field | Status | Residual |
|---|---|---|
| SAV per house | NUM-matched 12/12 | 0 |
| Bhava bala per house | NUM-matched 12/12 (≤0.6 tolerance) | ≤0.51 virupa (true events), ≤0.46 (PL7 series) |
| Nakshatra name, tiny abbreviation, pada syllable | NUM-matched (BIN tables) | 0 |
| Combust/retro flags | NUM-matched (BIN orbs) | 0 |
| Dignity | NUM-matched 9/9 | 0 |
| SB% | NUM-matched 7/7 | ≤0.0016 in ratio |
| SB# | NUM-matched 7/7 | 0 |
| VB | NUM 8/9 | Ke 9.1 against 14 (OPEN) |
| AV | NUM 7/7 | Ra rule OPEN (value 4 reproduced by candidates) |
| Av3, Av5, K7 | NUM-matched | 0 |
| Func. | NUM 9/9 | node rule OPEN between 2 candidates |

## 7. PL printouts or screens that would close every OPEN item
1. **Shadbala table** (Print menu "Shadbala tabel", id 2412) for this chart. This settles the last
   ≤0.5 virupa (cheshta epoch source PL7-series against true events, paksha and natonnata details)
   and shows yuddha handling.
2. **Bhavabala table** (id 2413) for this chart. Confirms Equal against Sripati as PL9's default,
   and the twilight/Pisces branch.
3. **Calculation Options dialog** screenshot from the boss's PL9 (Sunrise centre/edge; Bhava bala
   cusps; Karakas; Mercury nature options ids 3042/3044; Jup & Merc weight id 3045; 4th/10th in dig
   bala id 3043; drekkana option). This tells us which values are user settings rather than defaults.
4. **Vimshopaka Bala printout** (id 439) or "Dignities in the 16 divisions" (id 1905) for this chart,
   with the scheme selector visible. Settles VB scheme (shadvarga), Ketu's 14, and node own signs.
5. **Ashtakavarga – Bhinnashtakavarga screen** for this chart. Shows whether PL9 has a Rahu BAV
   (the AV 4).
6. **Planetary Natures dialog** (Aquarius tab) from PL9, plus one chart where a node's dispositor
   and its house give different natures (for example Rahu in a trine owned by a malefic). Settles the
   node rule in Func.
7. **One night birth** Page 1 with the shadbala table. Validates the night branches: before/after
   midnight day flag, tribhaga thirds of the night, vara adjustment before sunrise, and the hora count.
8. **PL9 "Nama nakshatra" table** (id 2751), or charts with planets in Pushya-4, P.Shad-2/4,
   P.Bhadra-3, Satabhisha-4 and Swati-4. Confirms PL9 kept PL7's duplicate syllables.
9. Meaning of the **red sign numbers** (12 and 9 in houses 2 and 11): ask the boss, or take a PL9
   help screenshot. Unknown (OPEN). Not tied to SAV ≥ 28, the strongest bhava or the lagna lord.

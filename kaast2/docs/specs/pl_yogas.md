# PL "1001 Yogas": database format, condition grammar and classical yogas

Status: research spec for the Astro-Amriit engine team. Source program: Parashara's Light 7.0.1
(`PL7.exe`, its `Lang1/Yogas_1.dat` and the `Useryoga/USER*.TXT` files).
Machine-readable companion: `pl_yogas.json` (all 1001 yogas, parsed).

## 0. Source tags

| Tag | Meaning |
| --- | --- |
| PL-DAT | Read from `Lang1/Yogas_1.dat` (record and byte offset given). |
| PL-BIN | Read from the `PL7.exe` disassembly (virtual address given). |
| PL-DOC | PL's own token dictionary in `Useryoga/USER11.TXT`, or the PL 7 manual. |
| STD | Textbook rule, given only for comparison. Not used by PL. |
| UNCERTAIN | Not settled. The reason is stated. |

Planet ids are PL's: Su 1, Mo 2, Ma 3, Me 4, Ju 5, Ve 6, Sa 7, Ra 8, Ke 9.
Houses are whole-sign houses, counted from the reference (§3.4).

## 1. Record layout (PL-DAT)

`Yogas_1.dat` holds 1001 fixed records of 1340 bytes each. There is no header.
Record *i* starts at `i × 1340`.

| Offset | Size | Content |
| --- | --- | --- |
| +0 | ≤ 813 | Description text, NUL-terminated. The first paragraph is the definition (the rule in words). The text after the first blank line is the results text. |
| +813 | u16 LE | Sequence number = the yoga id (1…1001). |
| +819 | ≤ 300 | Condition formula, NUL-terminated. |
| +1119 | ≤ 221 | Yoga name, NUL-terminated. |

Bytes after each NUL are uninitialised memory. Ignore them.

**Polarity.** A suffix on the formula sets the polarity (PL-BIN, the Yoga Options filter):

| Suffix | Polarity |
| --- | --- |
| `~m` | mixed ("partly positive") |
| `~n` | negative |
| none | positive |

PL's option "all / positive or partly positive / only positive" filters on this value.
Strip the suffix before parsing.

**Results text.** PL shows the whole description: the definition paragraph, then the results
paragraph(s). `pl_yogas.json` keeps the definition in full (`definition`). It keeps only the first
sentence of the results text (`result_summary`). The full text stays in PL's file.

## 2. Formula grammar (PL-BIN 0x5bf1df → 0x5bee9d → 0x5c22ed)

### 2.1 Operators and precedence

```
formula  := part [ '**' rest ]          split at the FIRST '**' only (0x5bf1df)
part     := term { '+' term }           '+' = OR (0x5bee9d)
term     := atom { '*' atom }           '*' = AND, binds tighter than '+'
```

- `**` is an AND with the lowest precedence: `A+B**C+D` means `(A or B) and (C or D)`.
- PL splits only at the first `**`. The right side is parsed as a `part`. If it contains another
  `**`, the `*` splitter makes empty atoms, and an empty atom is False. Yoga 509 has two `**`.
- Parentheses do not group. `(` … `)` is part of an atom and sets the reference (§2.2).
- Sets are existential. `%I!K` is true if any of Su…Sa is in a kendra.

### 2.2 Atom (PL-BIN 0x5c22ed)

```
atom := [ '-' ] [ varga ] [ '(' inner ')' REF [ 'D' | 'N' ] ] subject relation object
```

1. **Varga reset.** At the start of every atom, the varga is set to D1.
2. **`-`** negates the whole atom.
3. **Varga prefix** (0x5b9e61). This is one letter. The letter is always consumed, even when it
   starts a token (for example `K` in `Ka`).

   | Letter | Varga | | Letter | Varga |
   | --- | --- | --- | --- | --- |
   | A | D45 | | P | D30 |
   | C | D10 | | S | D9 |
   | D | D4 | | T | D7 |
   | H | D3 | | U | D27 |
   | K | D40 | | V | D24 |
   | M | D12 | | W | D16 |
   | N | D9 | | Y | D60 |
   | O | D20 | | | |

   PL's internal varga codes come from the divisor table at 0x5f47b8: 1 D1, 2 D2, 3 D3, 4 D4,
   5 D7, 6 D9, 7 D10, 8 D12, 9 D16, 10 D20, 11 D24, 12 D27, 13 D30, 14 D40, 15 D45, 16 D60.

   **Quirk.** The database authors use D, T and S to mean Drekkana, Trimshamsha and Saptamsha.
   The binary evaluates them as D4, D7 and D9. Counts in the data: N 144, D 43, S 3, T 1, K 1.
   To match PL's output, use the binary's mapping.
4. **Reference** (0x5b9b1e). `(inner)REF` evaluates `inner` with houses counted from REF.
   REF is a graha (houses are counted from that planet's sign) or a rashi.
   `(5I!K)2` = "Jupiter in a kendra from the Moon".
   After the `)`, an optional `D` or `N` sets the varga for the reference: D = D4, N = D9
   (0x5b9e23).
5. **Subject.** PL tries these in order: graha set (0x5b9f4e), rashi (0x5bb59e), bhava (0x5bbc0b),
   special (0x5bc60f).
6. **Errors.** An atom PL cannot decode evaluates False. With `-` it is True.
   Characters left over after a complete atom are ignored. `pl_yogas.json` keeps them as
   `ignored_tail`.

### 2.3 Graha-set tokens (PL-BIN 0x5b9f4e; checked against PL-DOC)

| Token | Set |
| --- | --- |
| `1`…`9` | one planet |
| `10`…`16` | special points (`15` = Gulika) |
| `%` | Su…Sa (the 7 grahas) |
| `&` | all 9 |
| `$` | Atmakaraka |
| `º` (0xBA) | Amatyakaraka |
| `°` (0xB0) | not decodable (only in yoga 874) |
| `ï` | planets with dignity 1 or 3 |
| `á` | Me, Sa |
| `ã[N]g` | dispositor of g. With `N`, the dispositor in D9 (0x5b98a8). |
| `B` | benefics. Optional suffix: `BE` dignity 1, `BO` dignity 2 or 3, `BS` Shadbala ratio ≥ 1, `BU` dignity 1…5 |
| `m` | malefics. `mS` = Shadbala ratio > 1 |
| `O` | dignity 3 (own sign) |
| `E` / `EE` | exalted / in deep exaltation (0x4273ab) |
| `F` / `e` | natural friends / enemies of the atom's first set (table 0x404bfd) |
| `ee` | dignity 7 |
| `t` | debilitated (dignity 9) |
| `b` | combust (planet flag +0x2f) |
| `X` / `XX` | Su…Sa with Shadbala ratio ≥ 1 / the strongest planet (0x58d58e) |
| `Ka` | marakas (0x5b9958) |
| `.D` `.N` `.M` `.F` `.l` | Ma…Sa / Ra, Ke / Su, Ma, Ju / Mo, Ve / Su, Mo |
| `.A` | lords of 6, 8 and 12 |
| `.E` `.t` `.r` | D9-exalted / D9-debilitated / retrograde |
| `.p` | Putrakaraka (karaka 6) |
| `.C` `.R` `.L` | stronger of (L1, Moon) / stronger of (L1, L8) / stronger luminary |
| `.Y` `.y` | graha-war winners / losers. Always empty in PL 7.0.1 (see pl_worksheets.md §5). |
| `.G` | Gulika |
| `L<n>` | lord of the nth house from the reference (0x5b9610). Inside parens this is relative to REF. |
| `LL<n>` | lord of the nth house from the Lagna, even inside parens |
| `LK` / `LT` | lords of 1, 4, 7, 10 / lords of 5, 9 |
| `Lm` | lords of 2, 7, 5, 9. Fall-through bug: it consumes extra characters. |
| `La` | lords of 6, 8, 12, 2, 7, 5, 9 (fall-through) |
| `LN` | lord of the D9 sign of the 10th lord |
| `LE<g>` | the planet exalted in g's sign (0x5b98d6) |
| `LD<n>` | current dasha lords |

Dignity codes (PL-DOC): 1 Exalted, 2 Moolatrikona, 3 Own, 4 Great friend, 5 Friend, 6 Neutral,
7 Enemy, 8 Great enemy, 9 Debilitated.

**Natural benefic/malefic** (chart setup PL-BIN 0x426ca2…0x426ee5):
- The Moon is a benefic when waxing.
- Mercury is a benefic unless it shares its sign with a natural malefic.
- Rahu and Ketu are natural malefics.

If the 1001-Yogas option "Use functional mal/ben" is on, `B` and `m` use the functional nature
instead (planet +0x20). See pl_worksheets.md §3.1.

### 2.4 Rashi tokens (PL-BIN 0x5bb59e)

| Token | Signs |
| --- | --- |
| `R<n>` | sign n (1 = Aries) |
| `RB` `RZ` `Z` | even signs |
| `Ra` `Rz` | odd signs |
| `RF`/`Rf`, `RM`/`Rm`, `Rd` | fixed, movable, dual |
| `RP` | prishtodaya (Ar, Ta, Cn, Sg, Cp) |
| `RS` | shirshodaya (Ge, Le, Vi, Li, Sc, Aq) |
| `RTa` `RTe` `RTf` `RTw` | air, earth, fire, water |
| `Ln` | Lagna sign of the current chart |
| `Ls` | D9 Lagna |
| `La`/`Lp`, `Ld` | Arudha lagna (A1), A7 |
| `Lu`, `LU` | Upapada, 12th from Upapada |
| `Lk` | Karakamsa |
| `Lh` `Lg` `Lb` | Hora, Ghati, Bhava lagna |

### 2.5 Bhava tokens (PL-BIN 0x5bbc0b)

| Token | Houses (from the reference) |
| --- | --- |
| `n` (bare digits) | house n |
| `a` | 6, 8, 12 |
| `!n` | house n |
| `!K` | 1, 4, 7, 10 |
| `!T` | 5, 9. House 1 is not included. |
| `!D` | 2, 5, 8, 11 |
| `!A` | 3, 6, 9, 12 |
| `!U` | 3, 6, 10, 11 |
| `!C` | 4, 8 |

`!q`, `!a`, `!H`, `!R`, `!O` and `!M` occur in the data but have no handler. They make the atom
undecodable (False).

### 2.6 Relations

**Graha subject, graha object** (PL-BIN 0x5be516 / 0x5c20d6):

| Rel | True when |
| --- | --- |
| `A` | a is conjunct b, or fully sign-aspected by b, or placed in b's sign |
| `D` | a is fully sign-aspected by b (0x5be881: quarter value 0x427120(b, a) = 4) |
| `i` | a and b are the same planet |
| `Y` | same sign, a ≠ b ("conjunct") |
| `l` | sign exchange |
| `r` | b aspects a by degree with more than 50 virupas, or conjunct, or exchange |
| `R` | conjunct, or full sign aspect |
| `y`, `L` | no evaluator (False) |

"Conjunct" in PL is always the same sign. There is no orb.

**Graha subject, other objects:**
- `I` + bhava set: the planet's house (+0x24) is in the set.
- `I` + rashi set: the planet's sign is in the set.
- `I` + `S…`: state. `SB<n>` = vaisheshikamsa count (0x46af09(21, p)) equals n (`SB13` compares
  to 10). The other `S` codes are avasthas (0x46af09(7, p)). `ISC` has no evaluator.
- `I` + `N<n>`: the planet is in nakshatra n.

**Rashi subject** (`Ln`, `R<n>` …):
- `i` + rashi: the sign is in the set (`LniRM` = movable Lagna).
- `I` + bhava: the sign is that house.
- `A` + graha: the sign is occupied or aspected by the graha.
- `D` + graha: the sign is aspected by the graha.
- `R` + graha: the sign is **occupied** by the graha. `LnRL1` = "L1 in the Lagna sign", although the
  definition text says "aspects".
- `i`/`r` + bhava and `I` + rashi are errors.

**Bhava subject** (`!n` …):
- `A` / `R` + graha: the house is occupied or fully aspected by the graha.
- `D` + graha: the house is aspected by the graha.
- `r` + graha: the house is occupied by the graha.
- `i` is an error (18 atoms).
- `BR!1` is undecodable because a graha must follow `R` (yogas 153–164).

### 2.7 Qualities after a graha (PL-BIN 0x5bfbb9 / 0x5c0039; checked against PL-DOC)

| Code | True when |
| --- | --- |
| `1`…`9` | dignity equals the code |
| `ï` | dignity 1…3 |
| `E` / `EE` | exalted / deep exaltation |
| `M` | moolatrikona |
| `O` | own sign or moolatrikona (dignity 2 or 3) |
| `G` `F` `n` | great friend / friend / neutral |
| `e` / `g` | dignity 7 or 8 / dignity 8 |
| `U` / `u` | dignity < 6 / dignity > 6 |
| `d` / `dd` | debilitated / deep debilitation (0x42736e) |
| `S` `P` `p` | Shadbala ratio ≥ 1.0. Nodes are always true (default ratio 1.0). |
| `v` `x` | Shadbala ratio < 1 |
| `c` | combust. `cm` = combust only (the second character is overwritten). |
| `K` / `T` | in a kendra / in the 5th or 9th from the reference |
| `h` / `H` | hemmed between malefics / benefics. The neighbours are the nearest planets by longitude among the 9 (0x42a18e). |
| `W` / `w` | waxing (Moon − Sun ≤ 180°) / waning (0x4275e0) |
| `=` `è` | vargottama |
| `ð` | afflicted: dignity 7, 8 or 9, or combust |
| `V` | vimshopaka ≥ 15 (0x46acec(12, p)) |
| `Qr` `Qw` | retrograde / in Cancer or Pisces. `Qh` `Qq` `Qd` `Qj` `QT` also exist. `QJ` is unsupported. |
| `º<n>` | longitude in [n − 1, n) |
| `·`, `ë` | no handler (always False) |

Quirk: an `N` before a quality selects varga code 2 (D2), not D9.

### 2.8 Specials (PL-BIN 0x5bc60f)

| Token | True when |
| --- | --- |
| `Re<n>` | exactly n signs hold none of Su…Sa |
| `@W` | the native is female (birth record byte +0x153 = 1) |
| `@bN` / `@bD` | night birth (fwd(Asc, Sun) < 180°) / day birth |
| `@bK` / `@bS` | Krishna / Shukla paksha |
| `@sun` … `@sat` | weekday |

Other `@` tokens are only partly decoded. See the `tokens` table in `pl_yogas.json`.

## 3. Does PL evaluate yogas in divisional charts?

**No, not as whole charts** (PL-BIN 0x5c22ed). Every atom starts on the Rashi (D1) chart. A
divisional chart is used only where one atom says so, with a varga prefix (`N2D5` = "in D9, the
Moon is aspected by Jupiter") or a `D`/`N` after a reference.
Because the varga is reset to D1 at every atom, no chart-level varga setting can reach the
evaluation. The yoga list is computed for the D1 chart.

## 4. User yogas (`Useryoga/`) (PL-DOC, manual "User yogas")

- A user yoga file is plain text. Each yoga starts with a line `~formula~`. The text lines that
  follow, up to the next `~…~` line, are the text PL shows for it.
- The formula grammar is the same as in the database (§2). PL uses the same evaluator.
- `USER11.TXT` is PL's own token dictionary. This spec checks the decoded tokens against it.

## 5. Statistics

- 1001 yogas in 22 categories. The categories in `pl_yogas.json` are this spec's grouping by name
  and definition. PL has no category field.
- **60 yogas contain atoms that PL 7.0.1 cannot decode.** In PL these atoms are False (True with
  `-`). So some of these yogas can never fire, and some fire in the wrong charts. Examples:
  - Saraswati (200): `!q` is not handled.
  - Nicha-Bhanga Raja (202): `t|` is not handled.
  - Chamara … Musala (153–164): `BR!n`.
  - Khala Parivartana (640): `L3IlL1`.
  - Akirti Danda (28).

  `pl_decodable` in the JSON flags all 60.
- **Not in the database:** Angaraka (Mars + Rahu) and Guru-Chandala (Jupiter + Rahu).
  "Chandala Yoga" (629) is a different combination: Mo, Me and Ve conjunct in a kendra, with
  Rahu in the Lagna.
- The two-planet "Graha conjunction" yogas (124 entries) cover the 7 grahas only. They use `Y`
  (same sign).

## 6. Classical yogas: PL's exact conditions

`L<n>` = lord of the nth house. Houses are counted from the Lagna unless a reference is given.
"In a kendra" = `I!K`. All conditions are as PL evaluates them (§2), not as the definition text
words them.

### 6.1 Pancha Mahapurusha (50–64)

For each of Ma 3, Me 4, Ju 5, Ve 6, Sa 7 (shown for Mars):

| Id | Name | PL formula | Meaning |
| --- | --- | --- | --- |
| 50 | Ruchaka Mahapurusha | `3I!K**3O+3E` | Mars in a kendra from the Lagna, and in own sign/MT or exalted |
| 51 | Ruchaka | `3I!K*3Y2+3I!K*3Y1**3O+3E` | the same, with Mars conjunct the Moon or the Sun |
| 52 | Ruchaka | `1v*2v*3I!K**3O+3E` | the same, with the Sun and Moon both weak (Shadbala ratio < 1) |

Bhadra = 53–55, Hamsa = 56–58, Malavya = 59–61, Shasha = 62–64, with the same three forms.
PL checks only the kendra from the Lagna, not from the Moon.

### 6.2 Moon yogas

| Id | Name | PL formula | Meaning |
| --- | --- | --- | --- |
| 65 | Gaja-Kesari | `(5I!K)2` | Jupiter in a kendra from the Moon |
| 66 | Gaja-Kesari | `5Y2` | Jupiter conjunct the Moon |
| 67–69 | Gaja-Kesari | `(5I4)2`, `(5I7)2`, `(5I10)2` | Jupiter 4th / 7th / 10th from the Moon (67, 68 mixed) |
| 70–74 | Gaja-Kesari | `2Y5**2I1` … `2I10` | Moon and Jupiter conjunct in house 1, 4, 7, 9 or 10 |
| 75 | Chandra Adhi | `(BI6)2*(BI7)2*(BI8)2` | benefics in all of the 6th, 7th and 8th from the Moon |
| 76 | Sunapha | `(.DI2)2*-(.DI12)2` | one of Ma…Sa in the 2nd from the Moon, none in the 12th |
| 77–81 | Sunapha (planet) | `(3I2)2*-(.DI12)2` … | the same, for one named planet |
| 82 | Anapha | `(.DI12)2*-(.DI2)2` | one of Ma…Sa in the 12th from the Moon, none in the 2nd |
| 88 | Durudhara | `(.DI2)2**(.DI12)2` | Ma…Sa in both the 2nd and the 12th from the Moon |
| 89–101 | Durudhara (pair) | `(3I2)2*(4I12)2+(4I2)2*(3I12)2` … | named pairs. Some depend on `@W` (gender). |
| 102 | Kemadruma | `-(.DI2)2*-(.DI12)2` | none of Ma…Sa in the 2nd or the 12th from the Moon |
| 104–112 | Kemadruma-Bhanga | `-(%I2)2*-(%I12)2**…` | no Su…Sa in the 2nd/12th from the Moon, and a cancelling condition |
| 120–122 | Shakata | `(5I6)2*-5I!K` (also 8, 12) | Jupiter 6th, 8th or 12th from the Moon, and not in a kendra from the Lagna |
| 123 | Shakata-Bhanga | `(5I12)2*-5I!K*!6D5` | as 122, and the 6th house is aspected by Jupiter |
| 750–753 | Kemadruma (other texts) | `L9I12*L12I2*L12v*mI3` … | other versions |

`.D` (Ma…Sa) leaves out the Sun, Rahu and Ketu, as in the classical rule (STD agrees).
Kemadruma-Bhanga uses `%` (Su…Sa), so it also counts the Sun.

### 6.3 Sun yogas (124–141, 869)

| Id | Name | PL formula | Meaning |
| --- | --- | --- | --- |
| 124 | Veshi (Vesi) | `(.DI2)1*-(.DI12)1` | Ma…Sa in the 2nd from the Sun, none in the 12th |
| 125 | Veshi (benefics) | `-(2I2)1*(BI2)1+(2I2)1*2YB**-(.DI12)1*-(mI2)1` | a benefic other than the Moon in the 2nd from the Sun, no Ma…Sa in the 12th, no malefic in the 2nd |
| 126–131 | Veshi (malefics; each planet) | `(mI2)1*-(.DI12)1**-(BI2)1`, `(3I2)1*-(.DI12)1` … | the same, for malefics or one named planet |
| 132 | Voshi (Vasi) | `(.DI12)1*-(.DI2)1` | Ma…Sa in the 12th from the Sun, none in the 2nd |
| 133–140 | Voshi (variants) | mirror of 125–131 | 139/140 depend on `@W` |
| 141 | Ubhayachari | `(.DI2)1*(.DI12)1` | Ma…Sa in both the 2nd and 12th from the Sun |
| 869 | Ubhayachari (malefic) | `(mI2)1*(mI12)1**-(BI2)1*-(BI12)1` | negative version |

### 6.4 Other named yogas

| Id | Name | PL formula | Meaning (as PL evaluates it) |
| --- | --- | --- | --- |
| 75 / 146 | Adhi (Chandra / Lagna) | see 6.2 / `BI6*BI7*BI8*-!6Rm*-!7Rm*-!8Rm` | 146: benefics in 6, 7, 8 from the Lagna, and no malefic occupies or fully aspects those houses |
| 142 / 143 | Amala | `BI10` / `(BI10)2` | a benefic in the 10th from the Lagna / from the Moon |
| 144 | Subha-Kartari | `BI2*BI12` | benefics in the 2nd and the 12th |
| 145 | Papa-Kartari | `mI2*mI12` | malefics in the 2nd and the 12th |
| 180 | Lakshmi | `L1P*L9ï**L9K+L9T` | L1 strong (Shadbala ratio ≥ 1), L9 in dignity 1–3, and L9 in a kendra or trine |
| 200 | Saraswati | `4I!q*5I!q*6I!q**5S*5E+5O+5F` | **undecodable** (`!q`), never true |
| 742 | Saraswati (other) | `-@sun*-@sat*5EE` | Jupiter in deep exaltation, birth not on Sunday or Saturday |
| 877 | Budha-Aditya ("Surya-Buddh") | `1Y4` | Sun and Mercury in the same sign |
| 186 | Chandra-Mangala | `2Y3+2D3*3D2` | Moon and Mars conjunct, or in mutual full aspect |
| 881 | Chandra-Mangal (conjunction) | `2Y3` | Moon and Mars in the same sign |
| 629 | Chandala | `2Y4*4Y6*2I!K*8I1` | Mo, Me and Ve conjunct in a kendra, Rahu in the Lagna |
| — | Angaraka, Guru-Chandala | — | **not in the database** |

### 6.5 Neecha Bhanga (202–209)

| Id | PL formula | Meaning |
| --- | --- | --- |
| 202 | `t|I!K+(t|I!K)2` | **undecodable** (`t|`), never true |
| 203 | `1d*3I!K+2d*6I!K+…` | debilitated planet, and the lord of its exaltation sign in a kendra from the Lagna. The pairs are written out: Su–Ma, Mo–Ve, Ma–Sa, Me–Me, Ju–Mo, Ve–Ju, Sa–Ve. |
| 204 | the same with `(…)2` | the same, kendra from the Moon (no Jupiter pair) |
| 205 | `1d*1R6+2d*2R3+…` | the debilitated planet is conjunct or in full sign aspect with its dispositor (the lord of its debilitation sign) |
| 206 | `1d*1R3+2d*2R6+…` | the same, with the lord of its exaltation sign |
| 207 | `1d*1l6+…` | the debilitated planet is in sign exchange with its dispositor |
| 208 | `1IR7*7IR1+3IR4*5IR10+6IR6*4IR12` | two planets debilitated together: Su in Li with Sa in Ar, Ma in Cn with Ju in Cp, Ve in Vi with Me in Pi |
| 209 | `tYE` | a debilitated planet conjunct an exalted planet |

### 6.6 Parivartana (630–640)

`L<a>lL<b>` = the lords of a and b exchange signs.
- 630–636: Maha-Parivartana. Any exchange between two lords of 1, 2, 4, 5, 7, 9, 10, 11.
- 637, 638: Dainya. The 6th lord (637) or the 8th lord (638) exchanges with any other lord.
- 639: Dainya. The 12th lord exchanges with one of 1, 2, 3, 4, 5, 7, 9, 10, 11 (6 and 8 are
  covered by 637 and 638).
- 640: Khala. The 3rd lord exchanges. The first atom `L3IlL1` is undecodable, so the L3–L1
  exchange is never detected.

### 6.7 Viparita Raja (275–277)

- 275 Harsha: `L6Ia` (L6 in 6, 8 or 12).
- 276 Sarala: `L8Ia`.
- 277 Vimala: `L12Ia`.

PL does not require the other two conditions some texts add.

### 6.8 Raja (257–274 and others) and Dhana (311–330 and others)

- 257: `L1RL4*L4RL1+…` = the Lagna lord and a kendra or trine lord are mutually conjunct or in
  full aspect.
- PL has 62 Raja-type and 46 Dhana-type entries. Each one is a fixed pattern, for example
  311 `LniR3*3I11*2I11*7I9`. Use the formulas in `pl_yogas.json`. There is no generic
  "kendra lord + trine lord" rule beyond these patterns.
- 283, 297 and 300 contain undecodable atoms.

### 6.9 Nabhasa (1–49)

These are the Ashraya, Dala, Akriti and Sankhya families, over Su…Sa (`%`).

Examples:
- 1 Rajju: `-%IRF*-%IRd` (no planet in a fixed or dual sign).
- 10 Shankha.
- 30 Kuta: `%I4*%I5*…*%I10`.
- 20 Vapi: `-%I!K*-%I!D`.
- 28 Danda is undecodable.

`%IR…` tests signs, and `%I…` tests houses. Each formula only requires the houses or signs to be
occupied: `%I4*%I5*…` means "at least one planet in each of these". An empty-house condition is
written with `-`.

## 7. Implementation notes for Astro-Amriit

1. Parse with the grammar in §2. Keep PL's quirks: first-`**` split, empty atoms False,
   undecodable atoms False, trailing characters ignored, binary varga letters.
   `pl_yogas.json` → `condition` is the parsed tree that PL 7.0.1 evaluates.
2. Natural benefic/malefic as in §2.3. Shadbala ratio = Shadbala total / required minimum
   (Page 1 spec).
3. Show the yoga name, the polarity, the definition and the results text.
4. **UNCERTAIN.**
   - The exact meaning of some rare tokens (`.a`, `.2e`, `.6`, some `@`, `Q` and `S` state codes).
     The JSON flags them in `tokens`.
   - Whether PL 9 fixed the D/T/S varga letters or the undecodable atoms. No PL 9 yoga output
     exists to test against.

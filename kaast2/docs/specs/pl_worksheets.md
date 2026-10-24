# PL worksheets: Lordships, worksheet 14 columns, Bhava Bala, aspect graphs, conjunction and war

Status: research spec for the Astro-Amriit engine team. Source program: Parashara's Light 7.0.1
(`PL7.exe`, worksheet list `Ws_lst1.l2`, worksheet help `wrkhlp1.txt`, manual `pl70.txt`).
Companion documents: `docs/spec/PAGE1_SPEC.md` (Page 1 strengths, Shadbala) and `pl_yogas.md`.

## 0. Source tags and notation

| Tag | Meaning |
| --- | --- |
| PL-HELP | PL's manual or worksheet help text. |
| PL-BIN | Read from the `PL7.exe` disassembly (virtual address given). |
| PL-DAT | Read from a PL data file (file and offset given). |
| ORACLE-VERIFIED | Reproduces a PL 7.0.1 printout of a private test chart. The match count is given. The chart data stays outside this repo. |
| STD | Textbook rule. Not confirmed in PL. |
| UNCERTAIN | Not settled. The reason is stated. |

Notation is as in `PAGE1_SPEC.md` §0:
- λ = sidereal longitude.
- `sign(λ)` = ⌊λ/30⌋.
- `dist(a,b)` = shortest arc, 0…180 (PL-BIN 0x5b1f1e).
- `fwd(a,b)` = (b − a) mod 360 (PL-BIN 0x45b0be).
- `curve(d, p)` = PL's aspect-strength curve in virupas, 0…60, for planet p at forward distance d
  (PL-BIN 0x404f64; `src/engine/strength/drik.ts` `aspectValue`). Rahu and Ketu use Jupiter's
  curve.
- Planet ids: Su 1 … Ke 9.

Worksheet numbers (PL-DAT `Ws_lst1.l2`):

| Number | Worksheet |
| --- | --- |
| 13 | Lordships |
| 14 | Shadbala, with the extra columns |
| 21 | Aspects on planets |
| 22 | Aspects from planets |
| 23–26 | Aspects on houses (graphs) |

## 1. Lordships worksheet (worksheet 13)

**Rule** (PL-HELP manual, "Lordships"; PL-BIN; ORACLE-VERIFIED D1, D9, D10, all 12 rows each):
1. Each varga is a chart of its own. Its Lagna is the varga sign of the Ascendant. Houses are
   whole signs from that Lagna.
2. For house N (1…12): the sign of N; its lord (the classical 7-planet lordship; the nodes rule no
   sign); and the house M in which the lord sits, in **that varga**.
3. The text is "Lord of N in M - <planet>", for example "Lord of 1 in 10 - Mo".
4. An asterisk (`*`) marks an exchange. The lord of N is in M and the lord of M is in N, with
   M ≠ N. Both rows get the mark.
5. Varga signs: the PL 7 varga rules (`src/engine/varga/rules.ts`). D9 is cyclic. D10 is "odd signs
   from the sign itself, even signs from the 9th" (PL-BIN 0x57d55c).

Implemented in `src/engine/exp/lordships.ts`. The oracle test `tests/engine/exp_oracle.test.ts`
passes for D1, D9 and D10 (lord, placement and exchange flag per house).

## 2. Worksheet 14 extra columns

Worksheet 14 shows, for each planet, the Shadbala rows (`PAGE1_SPEC.md` §4) and these columns.

### 2.1 Func. (functional nature) (PL-BIN; ORACLE-VERIFIED 9/9)

- **Value for Su…Sa.** Planet field +0x20 = the user-editable nature table
  `[0x59a + 9·ascSign + p]`, filled by the table constructor 0x568339. Codes: 1 Malefic,
  2 Benefic, 3 Neutral (string ids 858–860). The default table is printed in `PAGE1_SPEC.md` §3.9.
- **Rahu and Ketu** (PL-BIN 0x426ee5…0x426fba). This replaces the table's M for the nodes:
  1. If another planet is in the node's sign (0x42a651 = same sign), the node takes the nature of
     the nearest such planet. Nearest = smallest `dist` (0x42a67d).
  2. Otherwise the nature comes from the node's house counted from the Lagna:
     1, 5, 9 = Benefic; 6, 8, 12 = Malefic; the other houses = Neutral.

  This rule also fits the PL 9 Page 1 fixture. It replaces both candidate rules in
  `PAGE1_SPEC.md` §3.9 (dispositor nature, house nature): the house rule applies only when the
  node's sign holds no other planet.

### 2.2 Domin. (dominance) (PL-BIN case 25 → 0x42cc9f(p, 1, 1, 1, 1, 4); ORACLE-VERIFIED 9/9, 2 decimals)

Definitions:
- LL = lord of the Ascendant sign.
- dispMo, dispSu = the lords of the Moon's sign and the Sun's sign.
- FD = final dispositor of LL (0x427631). Start at LL and follow "lord of the sign it occupies"
  until a planet repeats. FD is the first repeated planet.
- "Same sign" = whole-sign conjunction.

For planet p (all 9):

```
D =  [house(p) = 1] · (1 − dist(λp, λAsc)/30)
   + [p ≠ Mo and sign(p) = sign(Mo)] · 0.75
   + [p ≠ Su and sign(p) = sign(Su)] · 0.50
   + (p = LL     ? 1.00 : sign(p) = sign(LL)     ? 0.75 : 0)
   + (p = dispMo ? 0.75 : sign(p) = sign(dispMo) ? 0.50 : 0)
   + (p = dispSu ? 0.50 : sign(p) = sign(dispSu) ? 0.30 : 0)
   + (p = FD     ? 0.25 : 0)
   + A · (p ∈ {Ra, Ke} ? 0.8 : 1)

A =  asp(p, dispSu)·0.30 + asp(p, dispMo)·0.50 + asp(p, LL)·0.75
   + asp(p, Asc)·1.00   + asp(p, Su)·0.50     + asp(p, Mo)·0.75

asp(p, t) = curve(fwd(λp, λt), p) / 60          (PL-BIN 0x42cb24)
```

- For a node p, `asp(p, t) = 0` when t is in the same whole-sign house as the other node.
- `asp(p, p) = 0`, because fwd = 0.
- Display: two decimals.

### 2.3 IshKas (Ishta / Kashta phala, D1) (PL-BIN 0x46f80f → 0x58e1d4, 0x58e6ea)

The column shows "Ishta/Kashta" of varga 1. Values are in virupas, truncated.

1. **Ishta phala y.**
   - u = dist(λp, deep-debilitation point) (`DEBIL_DEG`, `strength/common.ts`).
   - c = the cheshta angle:
     - Sun: x = (sayana λSun + 90) mod 360. If x > 180, x = 360 − x.
     - Moon: c = 3 × paksha bala (the Moon's cheshta value).
     - Ma…Sa: c = 3 × cheshta bala.
   - SR (the subha ray value) = ((2u + 60) + (2c + 60))/120.
   - y = (SR − 1)·10 = (u + c)/6. Range 0…60.
2. **Pos = TotalSB · y/60** and **Neg = TotalSB · (60 − y)/60**. TotalSB = the Shadbala total in
   virupas.
3. **Planet points S.** Saptavargaja points of the planet itself (0x58d6c8, flag 0), over D1, D2, D3,
   D7, D9, D12 and D30:
   - Own sign = 30. In D1, moolatrikona = 45.
   - Otherwise the compound-relation points: great friend 22.5, friend 15, neutral 7.5,
     enemy 3.75, great enemy 1.875.

   S = v(D1) + 0.5 · Σ v(D2…D30).
   G = max(0, 60 − S/2).
4. **Dispositor points w_i** (0x58d6c8, flag 1). These are the same points, computed for the lord of
   p's sign in varga i, at that lord's own varga position. The temporal relation still uses **p's**
   rashi sign.
5. **D1 values** (shown):
   - Ishta = trunc( √(S · w1) · Pos / 60 )
   - Kashta = trunc( √((60 − w1) · G) · Pos / 60 )

   Kashta uses Pos for D1. For the other vargas PL uses (30 − w_i) and Neg; these are not shown in
   worksheet 14.

ORACLE-VERIFIED: Su, Mo and Sa are exact. Ma, Me, Ju and Ve are within 1–2 virupas.
UNCERTAIN: the residual comes from the cheshta input c. The engine's cheshta epochs come from
true astronomical events. PL computes them with its own series (`PAGE1_SPEC.md` §4.5). A
difference of a few virupas in cheshta moves Pos enough to change the truncated values by 1–2.

### 2.4 War column (PL-BIN case 19, planet fields +0x31 / +0x32, strings 3779 "W" / 3780 "L")

- **In PL 7.0.1 the column is always blank.** The war flags are set at 0x4260c3…0x426160.
  Chart setup then always clears them (0x42723f; reset at 0x427353 / 0x42735c), before the
  worksheet reads them. To match PL 7.0.1, leave the column blank.
- The setting code is also faulty. Its comparison is `dist(λq, (lon(p) < 1.0))`, so in practice only
  Venus with the greater latitude can be marked a winner.
- **Shadbala yuddha bala** (0x58ce59; PL-HELP glossary: "within one degree of longitude"):
  - Only Ma, Me, Ju, Ve and Sa take part (ids 3…7). The opponent q is also one of these, with
    dist(λp, λq) < 1.0°.
  - Winner flag = 1 only when q is Venus and q has the greater ecliptic latitude (planet array
    +0x168).
  - Value = |TotalSB(p) − TotalSB(q)|, made negative when the flag is 0.
  - It is shown but **not added** to the Shadbala total (`PAGE1_SPEC.md` §4).
- **If Astro-Amriit wants a working war column** (STD, not PL output):
  - Ma…Sa only, |Δλ| < 1°.
  - The winner is the planet with the greater (northern) latitude.
  - Mark W/L on both planets.
  - Label this as an Astro-Amriit rule, because PL 7.0.1 never shows it.
- The yoga tokens `.Y` / `.y` (war winners / losers) read the same cleared flags. They are always
  empty (see `pl_yogas.md`).

## 3. Bhava Bala (worksheet 14 page; PL-BIN 0x58ee8b; ORACLE-VERIFIED all 12 houses)

The rules are in `PAGE1_SPEC.md` §1.2 and are implemented in `src/engine/strength/bhavabala.ts`.
The worksheet rows are Bhava Bala (house), Rashi, Degree, From Lord, Dig Bala, Drishti,
Planets In, Day-Night and Total (string ids 2657–2665). Additions from the worksheet:

- **Madhya.** In the default "Equal" mode, m_h = λAsc + 30(h − 1).
- **Rashi row** = sign(m_h).
- **Degree row** = ⌊deg(m_h)⌋, the whole degrees of the madhya. In Equal mode this is the
  Ascendant degree in every column.
- **Component rows** (From Lord, Dig Bala, Drishti, Planets In, Day-Night) are shown in virupas,
  **truncated toward zero**, not rounded. Two checks show it: the SB% rounding test, and Saturn's
  From Lord value (307) rule out rounding.
- **Total row** = the sum of the unrounded parts, in virupas. The rupa line is round(total/60).
- UNCERTAIN: Sripati mode (the stored cusps) is not checked against a PL printout.

## 4. Aspect worksheets and graphs

### 4.1 Worksheets 21 and 22 (PL-BIN 0x405118, 0x404f64; ORACLE-VERIFIED 72/72 cells)

- Each cell shows a fraction and virupas.
- **Fraction** = the sign-count aspect (PL-BIN table 0x405118). Houses counted from the aspecting
  planet:
  - 3rd/10th = 1/4, 5th/9th = 1/2, 4th/8th = 3/4, 7th = 4/4.
  - Special aspects are full: Mars 4/8, Jupiter and the nodes 5/9, Saturn 3/10.
  - The same sign (count 1) and the 2nd/6th/11th/12th give no aspect ("–").
- **Virupas** = trunc(curve(fwd(λaspecting, λaspected), aspecting)).
- **Colour.** PL prints each cell green, blue or red, by the compound relation of the aspected
  planet towards the aspecting one: natural plus temporal (from rashi signs). Friend, neutral and
  enemy map to the three colours as in `aspects.ts`.
- Worksheet 21 is "aspects on planets" (rows = aspected planet). Worksheet 22 is "aspects from
  planets" (the transpose).
- Implemented in `src/engine/exp/aspects.ts`.

### 4.2 Aspect graphs (PL-BIN graph builder 0x5b6468)

Each graph is a bar chart with one bar per aspecting planet i. The value is a percentage of a full
aspect (60 virupas = 100).

| Graph type | Title | Bar value for planet i |
| --- | --- | --- |
| 1 | Aspects on planet t | trunc( curve(fwd(λi, λt), i) · 100/60 ). The Ra↔Ke pair is skipped. |
| 2 | Aspects on nth house | trunc( curve(fwd(λi, H_n), i) · 100/60 ) |
| 3 | Aspects on nth house + lord | trunc( trunc(curve(fwd(λi, H_n), i) · 50/60) + curve(fwd(λi, λlord(n)), i) · 50/60 ) |
| 4–6 | Aspects **from** planet t on each planet / house / house + lord | the same formulas with t as the aspecting planet and the bars over the targets |

- In type 3 the house and its lord each count for half. The house part is truncated first, then
  the total.
- lord(n) = the lord of the sign of house n. When i is the lord itself, fwd = 0 gives 0.
- **House point H_n** = the chart's house longitude (chart virtual function +0x30):
  - Rashi and varga chart classes: H_n = λAsc + 30(n − 1) (0x434538 / 0x42d585). This is the
    Equal-house point, at the Ascendant degree in each sign.
  - Bhava chart classes: the stored cusp array (0x58faac), which is the Sripati / bhava cusp.
- UNCERTAIN: which chart class the default worksheets 23–26 use. If they use the Rashi chart,
  H_n is the Equal point. To settle it, compare one PL printout where the bhava cusps differ from
  the Equal points before shipping.
- The separate table "Aspects from planets to Sri Pati House cusps" (string 1882, 0x513f17) always
  uses the Bhava-chart cusp (0x427039).
- In the planet details, "Aspect on house + lord" (0x4305f8) lists planet i when both its sign
  aspect on house n and its sign aspect on the lord of n are partial (1/4…3/4, not 0, not 4/4)
  and their quarter values add up to 4 or more. The manual describes this as "more than a full
  aspect" (PL-HELP).

## 5. Conjunction and graha yuddha

- **Conjunction** (PL-BIN 0x430a5c "Conjunct with"; the yoga relation `Y`; node Func.; dominance)
  = the same rashi sign. There is **no degree orb**. Two planets at 29° Aries and 1° Taurus are not
  conjunct. Two planets at 0° and 29° Aries are.
- **Graha yuddha:** see §2.4. The orb is < 1.0° of longitude, between Ma, Me, Ju, Ve and Sa only.
  PL 7.0.1 never shows a winner (column blank, flags cleared). The only winner its code can produce
  is Venus with the greater latitude.

## 6. PL 9 traces in this repo

- The only PL 9 material is the Page 1 fixture in `tests/fixtures/` (PL 9.0 Page 1 strengths) and
  its test. There is no PL 9 manual, binary or yoga output.
- Rules here that the fixture supports:
  - Func. for the nodes (§2.1): fits.
  - Shadbala and Bhava Bala (`PAGE1_SPEC.md`).
- PL 9 behaviour for these is UNCERTAIN until a PL 9 printout exists:
  - yogas;
  - the War column;
  - IshKas;
  - dominance;
  - the aspect graphs.

## 7. Summary of uncertain points

1. The house point for worksheets 23–26: Equal (rashi chart) or bhava cusp (§4.2).
2. The IshKas residual of 1–2 virupas for Ma–Ve, from the cheshta epoch source (§2.3).
3. Whether PL 9 fills the War column, and with which rule (§2.4).
4. Sripati-mode Bhava Bala degree rows (§3).

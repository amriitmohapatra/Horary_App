# Kala Chakra / KAAST — The Journey, the Method, and a Guide for Newcomers

**Document 1 of 2 · English** (ଓଡ଼ିଆ ସଂସ୍କରଣ: `01_Journey_and_Method_Guide_OD.md`)
Companion evidence bundle: `audit/` (six CSV ledgers + unresolved items),
`record/RECORD.md` (full conversation record), `knowledge/` (maintainer's
second brain). Everything stated here is **Verified** against the code and
the family's manually calculated charts unless labelled otherwise.

---

## Part I — Horary astrology from scratch

### 1. What a horary chart is

Horary astrology answers one specific question — *"Will I get this job?"*,
*"When will the letter arrive?"* — from a horoscope cast not for a birth,
but for **the moment the question is sincerely asked**, at the place it is
asked. That moment's sky becomes the map of the matter.

A chart consists of:

- **Twelve house cusps.** The sky is divided into twelve "houses" (life
  departments — self, wealth, siblings, …). Each house begins at a cusp,
  a precise ecliptic degree such as `06°Vi06'33''` (6 degrees, 6 minutes,
  33 seconds into Virgo).
- **Nine planets (KP points).** Sun (Su), Moon (Mo), Mars (Ma), Mercury
  (Me), Jupiter (Ju), Venus (Ve), Saturn (Sa), and the two lunar nodes
  Rahu (Ra) and Ketu (Ke). Ketu is always exactly opposite Rahu.

The chart is drawn in **East Indian style**: a rectangle cut into a 3×3
grid whose corner boxes are split by diagonals, giving twelve fixed sign
compartments (Aries always top-middle-left region, etc.). Cusps and
planets are written into the compartment of the sign they occupy; the
question, querist, date, time and place sit in the centre.

### 2. The zodiac used: sidereal, Lahiri

Western software often uses the *tropical* zodiac (tied to the seasons).
KP uses the *sidereal* zodiac (tied to the stars). The difference between
the two is the **ayanamsa** — about 24°13′ in the 2020s, growing ~50″ per
year. This system uses the **Lahiri** ayanamsa, the Indian official one.

### 3. Nakshatras, star lords, and sub lords (the heart of KP)

The 360° zodiac also divides into **27 nakshatras** (lunar mansions) of
13°20′ each. Each nakshatra is ruled by one of nine lords in the fixed
**Vimshottari order**:

> Ketu 7 · Venus 20 · Sun 6 · Moon 10 · Mars 7 · Rahu 18 · Jupiter 16 ·
> Saturn 19 · Mercury 17   (the numbers are dasha-years; total 120)

Krishnamurti Paddhati (KP) then splits every nakshatra into nine **subs**,
each proportional to its lord's dasha-years, starting from the
nakshatra's own lord. So any point in the zodiac has a **star lord** (its
nakshatra's ruler) and a **sub lord** (its sub's ruler) — written like
`Ve/Ke`. These two lords, not the sign, carry KP's meaning.

**The insight that shaped this whole project:** the classic printed
"249-row KP table" is not information — it is *arithmetic*. One
dasha-year corresponds to exactly 400 arc-seconds of a nakshatra
(13°20′ = 48 000″; 48 000⁄120 = 400). Given any longitude you can
*compute* the star and sub lord exactly; no table lookup is ever needed.
The family's scanned tables (with the father's red-ink corrections, which
proved arithmetically correct) became a validator, not a source.

And the four printed series (fire/earth/air/water) exist because each
element's three signs span exactly 120° = 9 nakshatras — the pattern
repeats three times around the wheel.

### 4. Going deeper: Sub², Sub³, Sub⁴ — and how we got there

The sub subdivides exactly as the nakshatra did — proportionally, in
Vimshottari order, starting from the sub's own lord. Nothing stops the
recursion: **sub-sub (Sub²), sub-sub-sub (Sub³), Sub⁴**. Version 0.98
added these three layers to every cusp and planet at the father's
request, displayed as a chain like `Ke/Ju/Me/Sa/Sa`.

The one real obstacle was precision. Level-1 subs are whole arc-seconds
(years × 400″); Sub² spans are *not* (years₁ × years₂ × 10⁄3 ″). Floating
point would eventually misplace a boundary. The implementation therefore
**rescales the offset ×120 at every level**, so every boundary stays an
exact integer (the deepest intermediate ≈ 8.3 × 10¹⁰, comfortably inside
the 2⁵³ exact-integer range of doubles). Two invariants prove the
recursion: levels 1–2 are bit-identical to the independently validated
star/sub engine at 5 000 random points, and at the exact start of any
span the entire deeper chain repeats the parent lord (each level starts
from its parent). Code: `kp_core.sub_lords` / `kp_logic.subLords`.

A beautiful consequence, worth teaching: **the Moon's five spatial lords
are the same five lords as the running dasha chain at that moment** —
Vimshottari read as position instead of time.

### 5. Houses: placement, ownership, and the nodes

- **Placement.** House *h* runs from cusp *h* to cusp *h+1*. A planet on
  a cusp belongs to that cusp's house. All arithmetic is modular, so the
  wrap at 0° Aries and "two cusps in one sign" need no special cases.
- **Ownership.** Each planet rules signs (Sun–Leo, Moon–Cancer,
  Mars–Aries+Scorpio, Mercury–Gemini+Virgo, Jupiter–Sagittarius+Pisces,
  Venus–Taurus+Libra, Saturn–Capricorn+Aquarius). A planet owns the cusp
  numbers falling in its signs; if a sign holds two cusps its lord owns
  both; if a sign holds **no** cusp, the whole sign lies inside one house
  and its lord owns that house (**span rule**, confirmed by the family on
  the Yale chart: Mars = `10,2,9,10`).
- **Cusp-number vector.** Written placement first, then ownerships
  ascending, duplicates kept: Mercury `4,1,10`; Jupiter in its own sign
  `7,4,7`.
- **Rahu/Ketu** own nothing; they act through their **dispositor** (the
  lord of the sign they occupy): vector = `[dispositor's placement,
  node's placement, dispositor's ownerships…]`, e.g. `9,8,3,8`.

### 6. The power calculation (the crux)

For each planet, take the triplet **(Planet, its Star lord, its Sub
lord)** and build the family's fraction (the father's own notation):

```
(Planet)²(own)¹ − (Star)⁴(own)³ − (Sub)⁶(own)⁵      ← numerator
─────────────────────────────────────────────────
(Star)⁷(Sub)¹⁰ − (Star)⁸(Sub)¹¹ − (Star)⁹(Sub)¹²    ← denominator
```

Every term is a **cusp number raised to a fixed power**. Numerator: each
triplet member contributes its placement (powers 2/4/6) and its owned
cusps (powers 1/3/5). Denominator: scan all twelve cusps — cusps whose
*star* lord is the Planet/Star/Sub get powers 7/8/9; cusps whose *sub*
lord is, get 10/11/12. When a node appears in the triplet, the position
power goes to both the node **and** its dispositor, the ownership power
to the dispositor's cusps. Finally all identical bases merge by adding
powers, sorted ascending: `2¹⁴ 3¹² 4⁹ …`. The twelve powers are one
symmetric 3×2×2 grid — role × aspect × sub-aspect.

Two things a newcomer must know: the guide sheet's cell B44 contains a
**typo** (star-lord ownership truly carries power 3 — proven by the
worked example and by 27/27 agreement with every hand-calculated power
string in the family's records); and since v1.5 the app highlights the
**highest-power base(s)** in each final line (ties included) in a
colour-blind-safe orange pill.

### 7. Timing: the Vimshottari dashas down to Deha

Timing uses only the **Moon's longitude** and the chart moment.

1. The Moon's nakshatra lord starts the **Mahadasha** sequence; the
   fraction of the nakshatra already traversed fixes how much of that
   Maha remains (balance).
2. Each period subdivides into nine sub-periods in Vimshottari
   proportions, **starting from its own lord**: Maha → Antar → Pratyantar
   → Sookshma → Prana — and, since v1.5, one tier further: **Deha**
   (sub-Prana), giving a six-tier chain like `Me-Ra-Ke-Ke-Ma-Sa`.
3. Convention (decoded from Parashara's Light 7 and validated 40/40
   against its printed tables): one dasha-year = **365.25 days**.
4. **The anchor-once law.** The timeline is anchored at the chart moment
   *once*; every past or future period is found by walking the structure.
   Re-anchoring at another moment silently shifts the whole cycle — this
   exact bug appeared once (v0.96's upcoming list) and its fix became a
   written invariant. The proof of the law is empirical: for the SG
   chart, the real-world event (appointment letter, 15-02-2023 08:47)
   falls in `Ve-Ke-Ra-Ju-Ve` — precisely what the father had noted by
   hand — only when anchored at the chart moment.

**How Deha granularity was made trustworthy** (no software the family
uses prints deha, so external ground truth does not exist — labelled
Unresolved in the audit): the generic window-walker (`periodsInWindow`,
depth = 5) was checked structurally — deha periods tile edge-to-edge,
their union equals the displayed prana window exactly, every deha's
five-lord prefix is a displayed prana, both engines (Python/JS) emit
identical rows — and by prefix against the prana-level ground truth
(the event's deha `Ve-Ke-Ra-Ju-Ve-Ve` nests inside the noted prana).

### 8. Casting the chart: where positions come from

**Historically:** Solar Fire Gold 9 (Windows), configured: sidereal
Lahiri (SVP 1900 = 07°Pi32′22″), **Topocentric** houses, **True Node**,
*apply geocentric correction to latitude* ON, Moon parallax OFF, angles
truncated to whole arc-seconds. Its report was pasted into Excel and the
manual work began.

**Now:** the app casts natively. The pivotal discovery (from the user's
settings screenshots) was that Solar Fire's own planetary engine **is the
Swiss Ephemeris** — open-source. Replication was therefore adoption:

1. **Time.** Local date-time − UTC offset → JD(UT); JD(TT) = JD(UT) + ΔT.
2. **Planets.** Swiss Ephemeris, sidereal Lahiri, at JD(TT); True Node;
   Ketu = Rahu + 180°.
3. **Houses.** Topocentric ('T') at JD(UT) on the **geocentric** latitude
   (WGS84 reduction: tan φ′ = (1−f)² tan φ).
4. **Display.** Truncate to whole arc-seconds (Solar Fire's rule).

### 9. Solar Fire–compatible mode vs Modern mode — and accuracy

Two switchable modes exist because Solar Fire v9 (2014-era) uses an
**obsolete ΔT extrapolation** — it believes ΔT ≈ 87 s in 2026, while the
measured value is ~69–73 s (Earth's rotation sped up after 2016).

- **`sf` mode (default)** clones Solar Fire: ΔT from an anchor curve
  recovered to sub-second precision from ten of the family's own SF
  report headers (76.28 s @2019 → 87.5 s @2026), plus a constant
  **+1.251″** ayanamsa offset (SF's 2014 Lahiri vs today's Swiss
  Ephemeris). Validated: **80/80 planetary positions within 1″ of Solar
  Fire, all 120 cusps within tolerance**; across the whole 45-chart
  corpus, 404/405 planets within 1″ (the one exception was a 9-second
  slip in a worksheet's time cell, not the engine).
- **`modern` mode** uses the current astronomical ΔT — *more accurate
  than Solar Fire itself*, differing from it by a few arc-seconds
  (mainly the Moon, ~0.55″ per second of ΔT error). Continuity chose
  `sf` as default; correctness is one dropdown away.

Two caveats every user should know: SF's displayed "Ayanamsa of date"
includes nutation (it oscillates ±17″ over 18.6 years) — cosmetic only,
never calibrate on it; and each computer's manually-entered atlas
coordinates differ (Singapore machines by seconds, Lapanga by
arc-minutes), which shifts *cusps* between machines — planets never.
The app's canonical place gazetteer ends that drift.

---

## Part II — The journey (how the app came to be)

A short chronology; the complete turn-by-turn record with verbatim
prompts and reconstructed reasoning is `record/RECORD.md`, and every
decision's rationale is `knowledge/06_decisions_log.md`.

- **Day 1 (4 July 2026).** The user described the manual workflow and
  shared the family's tables and worked charts. The first pattern
  changed everything: the KP table is computable, not stored. A Python
  engine reproduced both fully-worked charts 60/60, then audited 64 old
  workbooks — finding three human slips the family confirmed. The tool
  became an error-checker as well as an automator. A discovery about
  Excel (libraries silently destroy the chart's line drawings) forced
  the invention of *surgical* XML cell-writing, later reused everywhere.
- **Days 2–3.** The six guide sheets arrived; the power calculation was
  decoded (including a typo in the guide itself, provable against the
  worked example), validated 27/27, and two products emerged: a
  command-line Excel pipeline and the single-file **Kala Chakra** web
  app, with the father's fraction notation rendered step by step.
- **Day 4.** Independence day: settings screenshots revealed Solar
  Fire's engine is the open Swiss Ephemeris. Ten reference reports let
  every convention be calibrated (ΔT curve, +1.251″, geocentric
  latitude, truncation), yielding `kp-cast` and then the in-browser
  WASM engine — **KAAST** — validated to ≤1″ against Solar Fire. A
  corpus sweep then *dated* fifteen mis-labelled worksheets from their
  planets alone (Excel day/month swaps, a year typo), turning the
  engine into an audit instrument.
- **Days 4–5.** Timing: Parashara's Light conventions decoded (40/40
  dates), the dasha card added (v0.96), a re-anchoring bug found by the
  user's testing and fixed into an invariant, chart geometry made
  diagonal-aware (v0.97), five-level lord chains (v0.98), colour-coded
  lords (v0.99), the 8-month horizon rule (v1.00), iOS seconds + the
  event-check + the quote banner (v1.01→v1.02, including a build defect
  that taught us to add contract + functional test gates).
- **Day 5 (26 July).** v1.5: the sixth tier (Deha) in an end-of-page
  section mirroring the prana windows; verified against the family's
  real-world event; quotes finalised; max-power highlighting.
- **Day 6 (28 July).** The Odia edition of the app, this documentation
  set, and the complete conversation record.

Throughout, one working style held: **decode → implement → validate
against the family's hand calculations → only then trust.** Every
disagreement ever found was adjudicated openly; three were human slips,
fifteen were spreadsheet label errors, and the rest were bugs fixed with
new tests. Final tallies: 3 300+ star/sub annotations, 646 house tags,
27/27 cusp-number vectors, 27/27 power strings, 80/80 SF planetary
positions, 40/40 PL dasha dates — all exact within their stated
tolerances, in both engines.

---

## Part III — Pointers for the technically curious

- Architecture, file map, build system: `knowledge/04_architecture_filemap.md`
- Full rule specification: `knowledge/01_domain_horary_kp.md`, `knowledge/02_power_calculation.md`
- Calibration constants and why: `knowledge/03_ephemeris_calibration.md`
- Validation commands and expected numbers: `knowledge/05_validation_ground_truth.md`
- Machine-readable ledgers (inventory, provenance, calculations,
  dependencies, configuration, traceability): `Documentation/audit/*.csv`
- Open questions, honestly listed: `Documentation/audit/unresolved_items.md`

**Coverage status: complete for all accessible, in-scope artifacts** —
with the six unresolved items recorded in the audit (notably: Solar
Fire's exact internal ΔT table, per-machine historic atlas entries, and
the absence of any external deha-level reference).

# 01 · The domain: KP horary astrology as implemented

The method is the family's traditional Krishnamurti Paddhati (KP) horary
practice (taught by the user's father; tables handwritten by him; app
credited "by Swami Yogeswarananda Giri"). The software encodes it
faithfully and originates no doctrine. Interpretation stays human.

## The question → answer pipeline (the "6 guide steps")

1. A querist asks a specific question ("Will I get X?"). A chart is cast
   for that exact moment and place.
2. Chart data = 12 house cusps + 9 KP points (Sun Su, Moon Mo, Mars Ma,
   Mercury Me, Jupiter Ju, Venus Ve, Saturn Sa, Rahu Ra, Ketu Ke).
   Historically from Solar Fire Gold 9 ("CHART ANALYSIS REPORT" export);
   now cast natively. Cleaning rules: node `Nod` → `Ra`; `Ke` added at the
   same degree/min/sec in the opposite sign; retrograde `R` markers
   ignored; Ura/Nep/Plu/Chi/Asc/MC dropped.
3. Chart drawn in **East Indian style**: fixed sign positions (3×3 grid,
   corners split by diagonals), cusps/planets written into their sign's
   box, date/time/place (+ lat/lon) in the centre.
4. Every cusp and planet gets **star lord / sub lord** annotation
   (`Ve/Ke` style) and every planet a house tag (`-9`).
5. Every planet gets a **cusp-number vector** (see below).
6. The **power calculation** produces the final per-planet number line
   (see [02_power_calculation.md](02_power_calculation.md)).

Then dasha periods (Vimshottari) time the outcome, and the astrologer
interprets. Time saved by automation: 15–25 min/chart → 2–3 min.

## Star lord & sub lord (computed, never looked up)

- Longitudes are integer **arcseconds** (0…1,295,999). All boundaries are
  exact; no floats in the chain. 1 sign = 108,000″; 1 nakshatra = 13°20′ =
  48,000″; 27 nakshatras.
- Vimshottari order & years: Ke 7, Ve 20, Su 6, Mo 10, Ma 7, Ra 18, Ju 16,
  Sa 19, Me 17 (total 120). Nakshatra lords cycle in this order from
  Aswini = Ketu.
- **Star lord** of λ = lord of its nakshatra = `VIM[⌊λ/48000⌋ mod 9]`.
- **Sub lord**: each nakshatra subdivides in dasha-year proportions
  (width = years × 400″), running in Vimshottari order **starting from the
  star lord**. This generates the classic 249-row KP table exactly —
  verified row-by-row against the father's scanned handwritten tables
  (including his red-ink corrections, which were arithmetically correct).
- Only 4 distinct sign-tables exist because a triplicity spans exactly
  120° = 9 nakshatras (fire=Ar/Le/Sg, earth=Ta/Vi/Cp, air=Ge/Li/Aq,
  water=Cn/Sc/Pi).
- Boundaries are half-open `[from, to)`.

## Placement, ownership, nodes

- **Placement**: house h spans cusp h → cusp h+1 (zodiacal, modular).
  A planet exactly on a cusp belongs to that cusp's house.
- **Ownership** (sign lordship: Su-Le, Mo-Cn, Ma-Ar/Sc, Me-Ge/Vi,
  Ju-Sg/Pi, Ve-Ta/Li, Sa-Cp/Aq; nodes own nothing): a planet owns the cusp
  numbers falling in its signs. Two cusps in one sign → lord owns both.
  A sign with NO cusp lies wholly inside one house span → its lord owns
  that house (**span rule**, confirmed by the user on the Yale chart:
  Mars = `10,2,9,10`).
- **Cusp-number vector** (column D in worksheets): placement first, then
  ownerships ascending. Duplicates kept (Ju in own sign → `7,4,7`).
- **Nodes (Ra/Ke)**: act through their **dispositor** (lord of occupied
  sign). Vector = `[dispositor placement, node placement, dispositor
  ownerships…]` (e.g. `9,8,3,8`).

## Dasha (Vimshottari, validated against Parashara's Light 7)

- Needs only the Moon's sidereal longitude + the chart moment.
- Balance of first Maha from the Moon's elapsed nakshatra fraction.
- Every level (Maha → Antar → Pratyantar → Sookshma → Prana) subdivides
  its parent in years/120 proportions, starting from the parent's own lord.
- **Dasha year = 365.25 days** (KC's rule). Validated 40/40 against PL
  screenshots; PL7 itself uses 365.2421875-day years, which give the same
  dates within ~2 years of the chart (see
  [03_ephemeris_calibration.md](03_ephemeris_calibration.md)).
- The 5-level chain at the chart moment is written like `Ke-Ju-Me-Sa-Sa`.
- CRITICAL: the timeline is anchored ONCE at the chart moment. Never
  re-anchor at a future time (that was the v0.96 upcoming-pratyantar bug).

## Worksheet annotation formats (must stay byte-compatible)

- Longitude: `26°Le13'36''` (two apostrophes; truncated arcseconds).
- Cusp cell: `" 1 06°Vi06'33'' Su/Me"` (leading spacing preserved).
- Planet diagram cell: `02°Pi28'13'' Ju/Ra-4`; label (`Mon`, `Jup[R]`)
  sits in the cell immediately LEFT of the value.
- Powers string: `214, 312, 49, …` = base then summed power, ascending.

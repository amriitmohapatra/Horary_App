# PL export procedure: getting the raw evidence out of Parashara's Light

Version 1.0, 2026-10-17. Written for the boss. Owner: technical writer, Astro-Amriit programme.
Related: PLAN.md §2.3 (unknowns) and §4.3 (what we need); ARCHITECTURE.md §2 (`parity/`).

The file name still says "PL7". Your Page 1 screenshot came from **Parashara's Light 9.0**,
so this procedure is written for **PL 9 first**. Where PL 7 is different, a note says so.

---

## How to read this document

- **Bold text** is what you click or type. An arrow means "then": **File → Open** means
  "click the File menu, then click Open".
- "(PL7 manual p. 37)" means the PL 7 manual names this menu on page 37. We do not have a
  PL 9 manual, so every menu name comes from the PL 7 manual or from the PL 7 program files.
- **[GUESS]** means the manual does not name this item. Look for something with a
  similar name. If you cannot find it, write "not found" and carry on. Do not stop.
- "(PL 9 may label this differently — look for …)" means the PL 7 name is known, but PL 9
  may have renamed or moved it.
- Do one numbered step at a time. Each step is one action.
- If anything goes wrong, write down what you saw, take a screenshot, and carry on with the
  next step. We can fix gaps later. A missing item is better than a guessed item.

## What you will produce

1. A **settings snapshot**: screenshots of every Options tab, plus a short table of values.
2. **Five test results** (Test 5 first, then Tests 1 to 4), written into the tables below.
3. For each of **17 charts** (5 public charts plus the 12 family charts on the private
   list): about 12 files of evidence, mostly PDFs.

## Time needed

| Part | What | Time |
|---|---|---|
| A | Step 0 (version) and Test 5 (Delta-T) | 15 min |
| B | Prepare the folder, the PDF printer and screenshots | 10 min |
| C | Settings snapshot | 25 min |
| D | One-time set-up: three helper worksheets and one print model | 40 min |
| E | Enter or open the 5 public charts and 4 test charts | 25 min |
| F | Per-chart exports: about 10 min × 17 charts | 3 h |
| G | Tests 1 to 4 | 30 min |
| H | Dasha change-times pass | 25 min |
| I | Check, zip and send | 15 min |
| | **Total** | **about 6 h. Split it over two sittings: Parts A–E, then Parts F–I.** |

---

# Part A — Before you start

## What we already know (so you know why each step matters)

- Astro-Amriit already reproduces your PL 9 Page 1 for Amitabh Bachchan. All 9 planets match to
  the displayed second. The Ascendant matches within 5″. All 10 dasha dates on Page 1 match.
- From that one chart we learned three things about PL 9:
  1. PL 9 **rounds** seconds (it does not cut them off).
  2. PL 9's dasha year is **365.2421875 days**, not 365.25.
  3. PL's atlas applied **India's war time** (UTC+6:30, 1942–45) to that chart. War time
     and old local time zones (before about 1955) are a classic cause of mismatches. So for
     **every** chart you will photograph the Birth Data screen, which shows the zone PL used.
- The PL 7 copy we analysed had a planet error (the "Moon-vector error"). The 1942 chart
  shows **no** such error in PL 9. So Test 1 only matters if a PL 7 installation is still
  in use.
- One question is still open for PL 9, and it matters most: which Delta-T (the clock
  correction between Earth time and atomic time) PL 9 uses for modern dates. Test 5 settles it.

## Step 0 — Write down the exact version

1. Start Parashara's Light.
2. Click **Help → About** (PL7 manual p. 203).
3. Write down every number you see (version, build, date, edition) in the table below.
4. Close the About window.
5. Check whether PL 7 is also installed on this computer: click the Windows **Start**
   button, type `Parashara`, and look at the list. Write down every Parashara's Light
   program you see.
6. If PL 9 shows a second version line under **Reports → Miscellaneous** (PL7 manual
   p. 156 says this section "contains the version information"), write that down too.

| Item | Write here |
|---|---|
| PL version and build (Help → About) | ______________________ |
| Any other version line (Reports → Miscellaneous) | ______________________ |
| Is PL 7 also installed? (yes / no) | ______ |
| If yes: PL 7 version and build | ______________________ |
| Windows version (Start → Settings → System → About) | ______________________ |

## Step 1 — Test 5: which Delta-T does PL 9 use? (most important test)

Why: Delta-T moves the Moon by about 0.5″ per second of Delta-T. A 10″ difference in the
Moon tells us which clock correction PL 9 uses. Everything else depends on it.

You will cast one chart for **1 January 2025, 00:00:00 UT**. In India that is 05:30:00 IST.

1. Click **File → New** (PL7 manual p. 24). The Birth Data screen opens.
2. In **Name**, type `KAAST T25`.
3. In **Date**, type `1 Jan 2025`.
4. In **Time**, type `05:30:00`.
5. In **Country**, choose `India`. In **City**, type `New Delhi`.
6. Tick **Manual Lookup** (PL7 manual p. 27–28). A small dialog opens.
7. Set **Time Zone** to `5:30`, with no plus or minus sign (PL7 manual p. 28).
8. Set **DST** (daylight saving / war time) to `0` (PL7 manual p. 30).
9. Set **Longitude** to `77:12:00`, **East** (PL7 manual p. 30).
10. Set **Latitude** to `28:36:00`, **North**.
11. Click **OK**, then **OK** on the Birth Data screen. The chart opens on the worksheet.
12. Check that the ayanamsa is **Lahiri** (the default; you will confirm it in Part C).
13. Find the planet table on Page 1. Read the **Moon** to the second. Write it below.
14. Read the **Sun** to the second. Write it below.
15. Click **File → Save** (PL7 manual p. 36). Keep the name `KAAST T25`. You will use this
    chart again in Test 2.

| | You read in PL 9 | If Swiss Delta-T (69 s) | If PL 7 Delta-T curve (87.5 s) |
|---|---|---|---|
| Moon | Sg ____°____′____″ | Sg 29°42′26″ | Sg 29°42′36″ |
| Sun | Sg ____°____′____″ | Sg 16°36′26″ | Sg 16°36′27″ |
| Which column matches? | ______________ | | |

How to decide: look at the Moon's seconds. Near **26″** means Swiss. Near **36″** means the
PL 7 curve. Anything else: write it down; that is also an answer. (The Sun moves too slowly
to decide this; it is only a cross-check.)

If PL 7 is also installed, repeat steps 1–14 in PL 7 and add a second row.

---

# Part B — Prepare the folder, the PDF printer and screenshots

These steps use Windows, not PL.

## B1. Make one private folder

1. On the Desktop, right-click an empty space → **New → Folder**.
2. Name it `KAAST_PL_exports`.
3. Every file you make goes into this one folder. Do not make sub-folders.

This folder contains family birth data. It is **private**. Do not upload it to any public
site, shared drive or GitHub. In Part I you send it to me directly. It will be stored in
`kaast2/parity/pl7_exports/`, which stays private and is never published.

## B2. Make PL print to PDF files

1. In PL, click **File → Printer Setup** (PL7 manual p. 153 and p. 173).
2. In the printer list, choose **Microsoft Print to PDF** (a printer that comes with
   Windows 10 and 11).
3. Click **OK**.
4. From now on, every time PL prints, Windows asks **"Save Print Output As"**. Go to the
   `KAAST_PL_exports` folder, type the file name this document gives you, and click **Save**.

Note: the PL 7 manual warns that printing with no printer installed can crash PL
(p. 153). "Microsoft Print to PDF" counts as a printer, so this is safe.

## B3. How to take a screenshot (PNG, full resolution)

Use this whenever a step says **screenshot**.

1. Maximise the PL window (double-click its title bar).
2. Press **Windows key + Print Screen** together. The screen dims for a moment.
3. Windows saves a PNG file in **Pictures → Screenshots**.
4. Move that file into `KAAST_PL_exports` and rename it as the step says.

Rules: PNG only, not JPEG. No phone photos of the screen. Do not crop. Do not resize.

For a single worksheet cell, PL has its own copy command: right-click the cell → **Copy**
(PL7 manual p. 69). Then open **Paint**, press **Ctrl+V**, and **File → Save as → PNG**.

## B4. File names

Every file is named `<chart>__<artefact>.<ext>`, with **two** underscores in the middle.
Examples: `P1-amitabh__page1.png`, `F03__dasha-antar.pdf`, `T25__test5.png`.
The chart codes are in Part E. The artefact codes are in Part F.

---

# Part C — Settings snapshot

Why: the same chart gives different numbers under different options. We must know every
option PL used. **Do not change any option in this part.** Only look and photograph.
**Do not** click **Reset all options settings now** (PL7 manual p. 198).

## C1. Screenshot every Options tab

The PL 7 Options menu opens one dialog with many tabs (PL7 manual p. 184). The PL 7 tabs
are: Chart Style, Display Options, Fonts, Color Coding, Nature of Planets, Calculation
Options, Printing Options, Dasha Options, Yoga Options, Panchang Options, System Options
(PL7 manual pp. 184–198). PL 9 may have more tabs. Photograph all of them.

1. Click the **Options** menu.
2. Click the first item in the menu. The Options dialog opens.
3. Make the dialog as large as possible (drag its corner; PL7 manual p. 184).
4. Screenshot it. Name it `SETTINGS__01-<tab name>.png`.
5. Click the next tab. Screenshot it. Name it `SETTINGS__02-<tab name>.png`.
6. Repeat step 5 for every tab.
7. If a tab has a scroll bar, scroll down and take another screenshot (`…-b.png`).
8. Close the dialog with **Cancel** (not OK), so nothing changes.

## C2. The Calculation Options tab, item by item

The "Miscellaneous" area is a list. Each item shows its choices only when you click it
(PL7 manual pp. 191–192).

1. Open **Options → Calculation Options** (PL7 manual p. 35 and p. 190).
2. In the Miscellaneous list, click the first item.
3. Screenshot. Name it `SETTINGS__calc-misc-01.png`.
4. Click the next item. Screenshot. Number it `-02`, `-03`, …
5. Repeat for every item. PL 7 lists: Mercury's nature for Paksha bala; 4th/10th house in
   Dig bala; Mercury's nature in Drig bala; Jupiter and Mercury in Drig bala; Ekadhipatya
   reductions; Varshaphala; Rashi multiplier for Virgo; method of calculation of Gulik;
   Muhurta dates; Chara Dasha; Drekkana bala method; Ashtakavarga; Sunrise; Karakas;
   Rahu & Ketu (PL7 manual pp. 191–192).
6. Click **Cancel**.

## C3. The Astrologer Specific Settings

PL can store an ayanamsa and a Rahu setting per astrologer. PL 7 uses these when it prints
models (PL7 manual p. 165 and p. 176). We will print models in Part F, so we must see them.

1. Click **Edit → Astrologer Specific Settings** (PL7 manual p. 176).
   (PL 9 may label this differently — look for "Astrologer" in the Edit menu.)
2. Click the astrologer entry that is selected (or the first one).
3. Screenshot. Name it `SETTINGS__astrologer.png`.
4. If its ayanamsa is **not Lahiri**, stop and message me before Part F.
5. Click **Cancel**.

## C4. Fill in the key values

Copy these values from your screenshots.

| Option | Where (PL 7) | Value you see |
|---|---|---|
| Ayanamsha | Calculation Options, left side (p. 35, p. 190) | ______________ |
| Ayanamsha offset | Calculation Options (p. 191) | ______________ |
| List of ayanamsas offered | Calculation Options | ______________ |
| Rahu & Ketu: True or Mean | Calculation Options → Miscellaneous (p. 192) | ______________ |
| Karakas: Rahu too (8) or No Rahu (7) | Calculation Options → Miscellaneous (p. 192) | ______________ |
| Sunrise: edge or centre of Sun | Calculation Options → Miscellaneous (p. 192) | ______________ |
| Ashtakavarga: Parashara or Brihat Jataka | Calculation Options → Miscellaneous (p. 191) | ______________ |
| House system (if any choice exists) | [GUESS] PL 7 has no house-system option; look in Calculation Options | ______________ |
| Delta-T or "Ephemeris" choice (if any) | [GUESS] not in PL 7; look in Calculation Options | ______________ |
| Dasha Year: 360 / 365.25 / 327.85 | Dasha Options (p. 193) | ______________ |
| Dasha Balance Method: by degree / by time | Dasha Options (p. 193) | ______________ |
| Dasha Change: Date only / Date+time | Dasha Options (p. 193) | ______________ |
| Write / Read Transit Cache | System Options (p. 198) | ______________ |
| Date format | System Options (p. 198) | ______________ |
| Astrologer settings: ayanamsa / Rahu | Edit → Astrologer Specific Settings (p. 165) | ______________ |
| Have you ever changed any option from the factory value? Which? | your memory | ______________ |

Note: the PL 7 dialog says "365.25", but the program really uses 365.2421875 days. Write
what the dialog **says**; we already know what it does.

---

# Part D — One-time set-up (do this once, before the first chart)

PL worksheets are layouts. A layout stays the same when you open another chart, so you set
these up once and reuse them for all 17 charts.

## D1. Learn the worksheet tools (no action yet)

- **Select a worksheet:** press **F5** ("Select a different Worksheet", PL7 manual p. 205),
  or use the **Charts** menu (p. 39). (Page 39 of the PL 7 manual says F9, but page 205
  says F9 is the Change Time Tool. Try F5 first.)
- **Back to Page 1:** press **Home** (PL7 manual p. 205).
- **Change the number of fields:** click the worksheet title in the top-right corner and
  choose from the **Dimension** list (PL7 manual p. 39).
- **Change what a field shows:** click a blank part of the field. The **Charts & Tables**
  dialog opens with four columns: **Tables, Context, Special charts, Vargas**. Click one
  item in each column you need, then **OK** (PL7 manual pp. 39–40).
- **Change a table's columns:** right-click the table → **Advanced options** (p. 69).

Your Page 1 is titled "1. Birth chart I". PL 7's worksheet number 1 has the same name
(PL 7 worksheet list, file `Lang1/Ws_lst1.l2`). So PL 9 probably kept PL 7's worksheet
names. The names below come from that list.

## D2. Pick three spare worksheets

1. Press **F5**. The Select Worksheet screen opens.
2. Scroll to the end of the list. In PL 7, unused slots are named like `#31`, `#104`,
   `#106` [GUESS for PL 9: look for slots with a number and no name].
3. Pick three unused slots. Write their numbers here:
   **Alternates** worksheet: #____  **Tables** worksheet: #____  **Transit** worksheet: #____
4. Screenshot the Select Worksheet screen. Name it `SETTINGS__worksheet-list.png`.
   This records PL 9's worksheet names. Scroll and take more screenshots if needed.

## D3. Build the "Alternates" worksheet (all extra vargas)

PL 7 has 16 Parashari vargas, 4 Tajika vargas (D5, D6, D8, D11), the Nadiamsha (D150) and
10 "alternate" vargas. The alternates are two versions of D2, and one each of D3, D4,
D10, D12, D30, D5, D16 and D11 (from the PL 7 program code, not the manual). The PL 7
documentation marks alternates with "II" or "III". PL 9 may have more.

1. Open any chart (for example **File → Open → KAAST T25**).
2. Press **F5** and open your Alternates slot.
3. Click the worksheet title → **Dimension** → choose **16** fields (4 × 4).
4. Click the blank part of the first field. The Charts & Tables dialog opens.
5. Screenshot the dialog. Scroll the **Vargas** column and screenshot again until you have
   the whole list. Name them `SETTINGS__varga-list-1.png`, `-2.png`, … This records PL 9's
   varga names exactly.
6. In **Tables**, click **Chart** (or the first chart entry) [GUESS: the exact label of
   the "chart" entry is not in the manual; PL7 p. 46 says "Chart, Gochara (Transits) in the
   Tables and context column"].
7. In **Context**, click **Birth** (p. 42).
8. In **Vargas**, click the first alternate varga (marked II or III).
9. Click **OK**.
10. Repeat steps 4 and 6–9 for the next field with the next alternate, until every
    alternate has a field.
11. Fill the remaining fields with: Panchamsha D5, Shashtamsha D6, Ashtamsha D8,
    Ekadashamsha D11 (the 4 Tajika vargas, PL7 manual pp. 52–53) and Nadiamsha D150.
12. If PL 9 has more alternates than fit, set up a second spare worksheet the same way.
13. Also look for any D11 named **Rudramsha** or **Iyer** [GUESS]. If you find one, add it
    and tell me its exact name. (PL 7 has none.)

## D4. Build the "Tables" worksheet

1. Press **F5** and open your Tables slot.
2. Set the **Dimension** to **9** fields.
3. Fill the fields as follows (click field → choose → OK):

| Field | Tables column | Context | Special charts | Source |
|---|---|---|---|---|
| 1 | Planetary info | Birth | — | p. 49 |
| 2 | Chart | Birth | Bhava (Sripati) | p. 56 |
| 3 | Chart | Birth | Bhava (equal) | p. 56 |
| 4 | Chart | Birth | Krishnamurti Chart | p. 56 |
| 5 | Karakas(8) | Birth | — | p. 59 |
| 6 | Karakas(7) | Birth | — | p. 59 |
| 7 | the Yogi entry [GUESS: PL 7 p. 59 lists "Yogi and Dagdha points"; look for "Yogi"] | Birth | — | p. 59 |
| 8 | Shadbala | Birth | — | p. 61 |
| 9 | Dashas | Birth | — | p. 42 |

4. Right-click field 1 (Planetary info) → **Advanced options** (p. 69). Tick **every**
   column offered (PL 7 has 15: degrees, retro/combust, sign, nakshatra, pada, nakshatra
   lord/sub, dignity, shad bala, vimshopaka bala, varga classification, avasthas 3, 5, 9,
   12, lordships; p. 145). If seconds can be switched on, switch them on. Click **OK**.
5. Click the title line of field 9 (Dashas). The **Dashas** dialog opens (p. 43).
   Set **Begin date** to `01:01:2026`, **Dasha System** to **Vimshottari**, **Levels** to
   **3**, **Dashas based on** to **Moon**. Click **OK**.
6. If the Bhava (Sripati) field can show a table of madhya and sandhi degrees [GUESS:
   right-click it and look for a table or "degrees" option], switch it on.

## D5. Build the "Transit" worksheet

1. Press **F5** and open your Transit slot.
2. Set the **Dimension** to **4** fields.
3. Field 1: **Tables: Chart**, **Context: Gochara (Transits)** (PL7 manual p. 46).
4. Field 2: **Tables: Chart**, **Context: Gochara (Transits) – Asc** (p. 46).
5. Field 3: **Tables: Planetary info**, **Context: Gochara (Transits)** (p. 49).
6. Field 4: **Tables: Chart**, **Context: Gochara (Transits) – Moon** (p. 46).
7. Right-click each of the 4 fields → **Advanced options** → tick
   **Synchronize dates** → **OK** (p. 49). Now all four follow the same event.

## D6. Build the "KAAST parity" print model (one PDF per chart)

A model prints many pages in one go (PL7 manual pp. 157–163). A model can also include
worksheets (p. 153, p. 163). With one model, each chart needs one print instead of thirty.

1. Click **Print → Select Model** (p. 37, p. 161). (F7 also opens it, p. 205.)
2. In **Group**, choose **Horoscope**.
3. In **Model**, choose **New Model**, then click **Edit** (p. 162).
4. In **Change name**, type `KAAST parity`.
5. In **Available printouts**, click these printouts, in this order (names from the PL 7
   model lists, pp. 158–160; PL 9 may label them differently — look for the same words):
   1. Basic Birth Calculations
   2. Birth Chart and Planetary Details
   3. Rashi, Navamsha and Bhava Details
   4. Shodashvarga Summary
   5. Divisional Charts #1
   6. Divisional Charts #2
   7. Shad Bala and Bhava Bala
   8. Ashtakavarga – Bhinnashtaka #1
   9. Ashtakavarga – Bhinnashtaka #2
   10. Ashtakavarga – Sarva and Chancha Chakra
   11. Ashtakavarga – Reductions
   12. Krishnamurti – Chart and Bhava Details
   13. Jaimini System
   14. Vimshottari Dasha – MD and AD
6. Then click these **worksheets** (worksheet names from the PL 7 worksheet list; untick
   "List only worksheets marked favorite", p. 163, so that all worksheets show):
   1. Birth chart I
   2. Vargas I
   3. Vargas II
   4. Vargas III
   5. Vargas IV
   6. Signs in all vargas
   7. Vargavimshopaka
   8. Shadbala
   9. Bhava bala
   10. Jaimini karakas and aspects
   11. Jaimini padas and lagnas
   12. Special Lagnas
   13. Alternate Lagnas
   14. Ashtakavarga - Samudaya
   15. Binnashtakavarga for planets (PL 7 spells it "Binnashtakavarga")
   16. Prastarashtakavarga
   17. your Alternates worksheet (#____)
   18. your Tables worksheet (#____)
7. Click **Save** (p. 163).
8. Screenshot the model screen showing the selected list. Name it
   `SETTINGS__model-kaast.png`.

If you cannot build the model (for example, PL 9 will not add worksheets), do not worry.
Use the one-by-one route in Part F, step F7.

---

# Part E — The parity chart set (17 charts)

## E1. The list

| Code | Chart | Why it is in the set |
|---|---|---|
| P1-amitabh | Amitabh Bachchan | Your Page 1 chart; war-time zone |
| P2-clinton | Bill Clinton | Northern mid-latitude, western longitude, USA zone |
| P3-currie | Alannah Currie (musician) | Southern hemisphere, longitude near 180° |
| P4-berry | Francis Berry (poet) | Near the equator |
| P5-gandhi | Mohandas K. Gandhi | Before 1900; old local zone |
| F01 … F12 | the 12 family charts on the private list | The real use; KP horary charts |
| T20, T25, T11 | test charts (Part G and Test 5) | Settle the open questions |

The family list (codes F01–F12, which chart is which) comes to you privately. It is never
written into this file or any public file.

## E2. The 5 public charts: open them, or type them in

PL ships celebrity charts. Your computer probably has them in `C:\GeoVision\GeoVisionCharts`
(PL7 manual p. 24), in folders such as `Indian Celebrities` and `USA Celebrities`.

For each public chart:

1. Click **File → Open** (PL7 manual p. 24).
2. Look for the saved file in the table below. If it is there, double-click it.
3. If it is not there, click **File → New** and type the data from the table. Use
   **Manual Lookup** (p. 28) so that the zone and DST are exactly as written.
4. Click **Edit → Birth Data** (p. 36) and compare every field with the table.
5. Write down any field that differs. **Use the saved PL file's values** if they differ;
   just tell me.
6. If you typed it in, click **File → Save** and name it with the chart code.

| Code | Saved PL file (look for) | Date | Time | Place | Latitude | Longitude | Time zone | DST / war time |
|---|---|---|---|---|---|---|---|---|
| P1-amitabh | `Indian Celebrities\Actors\BACHHANA.xml` (named "Amitabh Bachhan") | 11 Oct 1942 | 16:00:00 | Allahabad, India | 25:27:00 N | 81:51:00 E | 5:30 (East) | 1 (war time) |
| P2-clinton | `clintonb.xml` (the PL 7 manual uses it as an example, p. 24) | 19 Aug 1946 | 08:51:00 | Hope, Arkansas, USA | 33:40:00 N | 93:35:00 W | 6:00 (West, CST) | 0 |
| P3-currie | `USA Celebrities\Musicians\CURRIE_A.xml` | 20 Sep 1957 | 05:00:00 | Auckland, New Zealand | 36:52:00 S | 174:46:00 E | 12:00 (East) | 0 |
| P4-berry | `USA Celebrities\Poets\BERRY_F.xml` | 23 Mar 1915 | 08:20:00 | Ipoh, Malaysia | 4:35:00 N | 101:05:00 E | 7:00 (East) | 0 |
| P5-gandhi | `Indian Celebrities\Miscellaneous\gandhi_m.xml` | 2 Oct 1869 | 07:11:00 | Porbandar, India | 21:38:00 N | 69:36:00 E | 5:21 (East) | 0 |

Notes:
- PL's saved files store these values; the table copies them from PL 7's own files.
- Gandhi's zone 5:21 is what PL's file holds (an old Indian railway time), not the local
  mean time of Porbandar. Keep it as PL has it.
- The time zone is typed **without** a plus or minus sign. East or West follows the
  longitude you choose (p. 28).

## E3. The 12 family charts

1. Click **File → File Manager** (p. 23) or **File → Open** (p. 24).
2. Open each family chart on the private list from your saved charts.
3. Do not change their birth data.
4. When PL asks to save on closing, click **No** unless this document says to save.

## E4. The test charts

Make these now with **File → New** and **Manual Lookup**, all at New Delhi:
latitude `28:36:00 N`, longitude `77:12:00 E`, time zone `5:30`, DST `0`.
Save each one (**File → Save**).

| Code | Name to type | Date | Time (IST) | Same moment in UT |
|---|---|---|---|---|
| T20 | `KAAST T20` | 1 Jan 2020 | 05:30:00 | 1 Jan 2020 00:00:00 |
| T25 | `KAAST T25` (already made in Test 5) | 1 Jan 2025 | 05:30:00 | 1 Jan 2025 00:00:00 |
| T11 | `KAAST T11` | 16 May 2025 | 13:30:00 | 16 May 2025 08:00:00 |

---

# Part F — The per-chart exports (repeat for each of the 17 charts)

Do the 5 public charts first, then the family charts. Tick each box in the checklist at
the end as you go.

## Artefact codes

| Artefact code | What | How (step) | Format |
|---|---|---|---|
| `birthdata` | Birth Data screen (zone, DST, lat, lon) | F1 | PNG |
| `page1` | Page 1 exactly as it opens | F2 | PNG and PDF |
| `export` | Planet longitudes to 10 decimals | F3 | CSV/TXT |
| `model` | The "KAAST parity" model: planets, vargas, Yogi, bhava, shadbala, bhava bala, ashtakavarga, vimshopaka, Jaimini | F4 | PDF |
| `tables` | Your Tables worksheet | F5 | PDF and PNG |
| `alternates` | Your Alternates worksheet | F5 | PDF and PNG |
| `dasha-maha` | Maha and Antar dashas, lifetime | F6 | PDF |
| `dasha-antar` | Antar and Pratyantar for the current Maha | F6 | PDF |
| `kp` | Krishnamurti chart and cusp table | F6 | PDF |
| `transit` | Transit chart at the fixed instant | F8 | PDF and PNG |

## F1. Birth data

1. Open the chart.
2. Click **Edit → Birth Data** (PL7 manual p. 36).
3. If the zone and DST are in a separate Manual Lookup dialog, open it so they show.
4. Screenshot. Name it `<chart>__birthdata.png`.
5. Write the time zone and DST into the checklist row for this chart.
6. Click **Cancel**.

## F2. Page 1

1. Press **Home** to return to the default worksheet (p. 205). This is your Page 1.
2. Screenshot. Name it `<chart>__page1.png`.
3. Click **File → Print screen** (p. 37, p. 173). (PL 9 may label this differently —
   look for "Print screen" or "Print worksheet" in the File menu.)
4. Save as `<chart>__page1.pdf`.

## F3. Planet longitudes to 10 decimals (the rawest numbers)

PL 7 can write the birth data and every planet's longitude to a text file, with about ten
decimals (PL7 manual pp. 130–131). This is better than any printout, because nothing is
rounded.

1. Click **Research → Export Birth Chart** (p. 202).
2. Follow the dialog. If it asks for a file name, use `<chart>__export.csv` in your folder.
3. If it does not ask, PL writes the file itself. Look in the `export` folder inside the
   PL program folder (PL 7 writes its ephemeris export there, p. 132) [GUESS for the exact
   place]. Copy the newest file to your folder and rename it `<chart>__export.csv`.
4. If you cannot find this menu, write "no export" and carry on.

## F4. The model PDF

1. Click **Print → Select Model** (p. 161).
2. Choose **Group: Horoscope**, **Model: KAAST parity**.
3. Click **OK**.
4. Save as `<chart>__model.pdf`. It is a long file; that is expected.

## F5. The two helper worksheets

1. Press **F5**, open your **Tables** worksheet.
2. Screenshot. Name it `<chart>__tables.png`.
3. **File → Print screen**. Save as `<chart>__tables.pdf`.
4. Press **F5**, open your **Alternates** worksheet.
5. Screenshot. Name it `<chart>__alternates.png`.
6. **File → Print screen**. Save as `<chart>__alternates.pdf`.

(If these worksheets are already in your model, steps 3 and 6 are optional.)

## F6. Dashas and the KP chart

1. Click **Print → Dashas → Maha Dashas** (p. 199–200). It prints all Maha and Antar
   dashas for a lifetime on one page.
2. Save as `<chart>__dasha-maha.pdf`.
3. On that page, find the **Maha dasha running on 1 January 2026**. Write its planet in
   the checklist.
4. Click **Print → Dashas → Antar Dashas** (p. 200). Two dialogs ask for a Maha and an Antar.
5. For **Maha**, choose the planet from step 3.
6. For **Antar**, choose the **same** planet. (The first Antar of a Maha is its own
   planet. PL then prints that Antar and the 8 that follow, each with its Pratyantars:
   the whole Maha.)
7. Save as `<chart>__dasha-antar.pdf`.
8. Click **Print → Krishnamurti** (p. 200).
9. Save as `<chart>__kp.pdf`.

## F7. Only if the model in D6 did not work: print one by one

For each line below, open the item and print it (**File → Print screen** for worksheets;
the **Print** button for Reports pages, p. 154). Save as `<chart>__<code>.pdf`.

| Code | What | Where in PL 7 |
|---|---|---|
| `planets` | Planetary table with seconds | worksheet **Birth chart & degrees** (PL 7 worksheet list) |
| `basic` | Basic Birth Calculations (look for Yogi Point, Yogi, Avayogi/Duplicate Yogi lines) | **Reports → Horoscope** or **Reports → Calculations** [GUESS which] |
| `vargas1` … `vargas4` | The 16 Parashari vargas | worksheets **Vargas I**, **II**, **III**, **IV** (worksheet list; p. 41 fig. 3.5) |
| `varga-signs` | Signs in all vargas | worksheet **Signs in all vargas** |
| `vimshopaka` | Vimshopaka table | worksheet **Vargavimshopaka**; report **Shodashvarga Summary** (p. 158) |
| `jaimini-padas` | Padas and special lagnas | worksheet **Jaimini padas and lagnas** |
| `jaimini-karakas` | Karakas and Jaimini aspects | worksheet **Jaimini karakas and aspects** |
| `special-lagnas` | Bhava, Hora, Ghatika lagnas | worksheets **Special Lagnas** and **Alternate Lagnas** |
| `bhava` | Sripati bhava table | report **Rashi, Navamsha and Bhava Details** (p. 158) |
| `shadbala` | Shadbala and Bhava Bala, all components | report **Shad Bala and Bhava Bala** (p. 158; p. 60 calls it "the Shad Bala printout … under the Calculations section"); worksheets **Shadbala** and **Bhava bala** |
| `ashtakavarga` | BAV for all planets, SAV | worksheets **Ashtakavarga - Samudaya**, **Binnashtakavarga for planets**, **Prastarashtakavarga** (Charts menu, p. 95); reports **Ashtakavarga – Bhinnashtaka #1/#2**, **Sarva and Chancha Chakra** (p. 158) |

Shadbala and Bhava Bala: we need **every component** (Sthana, Dig, Kala, Chesta,
Naisargika, Drik and their sub-parts), not only totals. If a page shows only totals, look
for a more detailed page [GUESS: right-click the Shadbala field or look under
**Reports → Calculations**] and print that too.

## F8. The transit chart at a fixed instant

The instant is **1 January 2026, 00:00:00 UT** (05:30:00 IST), at New Delhi.

1. Click **Edit → Events** (p. 47, p. 175).
2. Click **Add event**.
3. **Name:** `KAAST transit`.
4. **Date:** `1 Jan 2026`. **Time:** `05:30:00`.
5. **Place:** New Delhi with **Manual Lookup**: 28:36:00 N, 77:12:00 E, zone 5:30, DST 0.
6. Click **OK**.
7. Press **F5** and open your **Transit** worksheet.
8. Click the word **Today** in the title of field 1 and choose **KAAST transit** (p. 48).
   The other three fields follow (you set "Synchronize dates" in D5).
9. Check that all four fields show 1 Jan 2026.
10. Screenshot. Name it `<chart>__transit.png`.
11. **File → Print screen**. Save as `<chart>__transit.pdf`.
12. For family charts: when you close the chart and PL asks to save, click **No**. (The
    event then disappears again, and your family file stays as it was.)

---

# Part G — The four report tests (Tests 1 to 4)

## Test 1 — Is the planet error present? (only matters for PL 7)

Background: the PL 7 copy we analysed had the Sun and other planets shifted by up to
about 10′ (the "Moon-vector error"). PL 9 showed no such error for the 1942 chart. Run
this test in PL 9 as a quick control. Run it in PL 7 only if PL 7 is still installed and
might be used.

1. Open chart **KAAST T20** (1 Jan 2020, 05:30:00 IST, New Delhi).
2. Read the **Sun** to the second from the planet table. Write it below.
3. Read the **Moon** to the second. Write it below.
4. Screenshot the planet table. Name it `T20__test1.png`.
5. If PL 7 is installed: open the same chart in PL 7 and repeat steps 2–4
   (name the screenshot `T20__test1-pl7.png`).

| | PL 9 reads | PL 7 reads (if installed) | Expected, no error | PL 7 transit-cache value (error present) |
|---|---|---|---|---|
| Sun | Sg ___°___′___″ | Sg ___°___′___″ | Sg 15°52′40″ | Sg 16°01′09″ |
| Moon | Aq ___°___′___″ | Aq ___°___′___″ | Aq 22°00′24″ (± 10″ depending on Delta-T) | — |

How to decide: if the Sun reads near **15°52′40″**, there is no error. If it reads near
**16°01′09″** (8′29″ more), the error is present in that program's charts.

## Test 2 — Which ayanamsa does the KP printout use?

1. Check that **Options → Calculation Options → Ayanamsha** is **Lahiri** (p. 35). Do not
   change anything else.
2. Open chart **KAAST T25** (1 Jan 2025, 05:30:00 IST).
3. Click **Print → Krishnamurti** (p. 200). Save as `T25__test2-kp.pdf`.
4. Find the ayanamsa line on that page (the report expects a line such as
   "KP Ayanamsha" [GUESS for the exact label]). Write the value below.
5. Also print **Krishnamurti – Chart and Bhava Details** if you can find it (a page in the
   PL 7 models, p. 159). Save as `T25__test2-kpdetails.pdf`. Write its ayanamsa line too.
6. Find the ayanamsa on an ordinary (non-KP) page, for example **Basic Birth
   Calculations**. Write it below.

| Page | Ayanamsa you read |
|---|---|
| Print → Krishnamurti | ___°___′___″ |
| Krishnamurti – Chart and Bhava Details | ___°___′___″ |
| Ordinary page (Lahiri) | ___°___′___″ |

Expected values at 1 Jan 2025 (from the PL 7 program code):

| Ayanamsa | Value |
|---|---|
| Lahiri (PL default) | 24°12′23″ |
| Krishnamurti | 24°11′54″ |
| Krishnamurti New | 24°06′23″ |

How to decide: the KP page's value tells us which one PL uses for KP. The PL 7 dictionary
says KP printouts use the Krishnamurti ayanamsa "regardless of the default set"
(pp. 218–219). We want to see it.

## Test 3 — Rahu true or mean?

1. Open **Options → Calculation Options**. In **Miscellaneous**, click **Rahu & Ketu**
   (p. 192).
2. Write down whether **True** or **Mean** is selected.
3. Click **Cancel**.
4. Open chart **KAAST T20**. Read **Rahu** to the second from the planet table.

| | You read | If True node | If Mean node |
|---|---|---|---|
| Option shown | __________ | | |
| Rahu in T20 | Ge ___°___′___″ | Ge 14°15′21″ | Ge 14°06′26″ |

How to decide: the two differ by about 9′. The PL 7 transit cache says **True**.

## Test 4 — The two D11 charts

1. Open chart **KAAST T11** (16 May 2025, 13:30:00 IST). The Sun is at about Taurus 1°30′.
2. Check the Sun in the planet table. Write its position below. (Anything from Taurus
   1°00′ to 2°00′ is fine.)
3. Press **F5** and open your **Alternates** worksheet. It has the main D11 (Ekadashamsha)
   and the alternate D11.
4. Read which **sign** the Sun is in, in the main D11. Write it below.
5. Read which sign the Sun is in, in the alternate D11. Write it below, with the exact
   name PL gives that varga.
6. If PL 9 has a third D11 (for example "Rudramsha" or "Iyer"), read the Sun's sign there too.
7. Screenshot. Name it `T11__test4.png`.

| | You read | Expected |
|---|---|---|
| Sun in birth chart | Ta ___°___′ | about Ta 1°30′ |
| Sun's sign in main D11 (Ekadashamsha) | __________ | Pisces |
| Sun's sign in alternate D11; its exact name: ________ | __________ | Aries |
| Any third D11; its exact name: ________ | __________ | (unknown; this is new evidence) |

How to decide: if both match, PL 9 uses PL 7's two D11 rules.

---

# Part H — Dasha change-times pass (one extra pass, all charts)

Why: dasha dates alone hide small errors. Times of change prove the 365.2421875-day year.

1. Click **Options → Dasha Options** (p. 193).
2. Set **Dasha Change** to **Date+time** (p. 193). Click **OK**.
3. For each of the 17 charts: open it, repeat **F6 steps 4–7**, and save as
   `<chart>__dasha-antar-time.pdf`.
4. When you have done all 17, go back to **Options → Dasha Options** and set
   **Dasha Change** back to what it was in Part C (probably **Date only**). Click **OK**.
5. Check it: Page 1 dasha list should look as before.

---

# Part I — Check, zip and send

1. Open the `KAAST_PL_exports` folder.
2. Check the checklist below: every box ticked, or "not found" written.
3. Put your filled-in tables (Step 0, Test 5, Part C, Tests 1–4, checklist) into one file:
   either type them into a text file `RESULTS.txt`, or scan the paper pages as PDF
   (`RESULTS.pdf`, scanner only, not a phone photo).
4. Right-click the folder → **Send to → Compressed (zipped) folder**.
5. Send me the zip file directly. Do **not** post it in any public place. It lands in
   `kaast2/parity/pl7_exports/`, which stays private and is never published.

---

# Checklist

## Once

- [ ] Step 0: version written down; PL 7 installed? ______
- [ ] Test 5 table filled; `T25` saved
- [ ] PDF printer set (B2)
- [ ] All Options tabs photographed (`SETTINGS__…`)
- [ ] Calculation Options Miscellaneous items photographed one by one
- [ ] Astrologer Specific Settings photographed
- [ ] Part C value table filled
- [ ] Worksheet list photographed; three spare slots chosen
- [ ] Varga list (Charts & Tables, Vargas column) photographed
- [ ] Alternates, Tables, Transit worksheets built
- [ ] "KAAST parity" model built and photographed (or "model not possible")
- [ ] Tests 1, 2, 3, 4 tables filled; `T20`, `T11` saved
- [ ] Part H done and Dasha Change set back
- [ ] RESULTS file made; folder zipped and sent

## Per chart (tick each box: b = birthdata, p = page1, e = export, m = model, t = tables, a = alternates, dm = dasha-maha, da = dasha-antar, kp, tr = transit, dt = dasha-antar-time)

| Chart | Zone / DST shown | Maha on 1 Jan 2026 | b | p | e | m | t | a | dm | da | kp | tr | dt |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P1-amitabh | | | | | | | | | | | | | |
| P2-clinton | | | | | | | | | | | | | |
| P3-currie | | | | | | | | | | | | | |
| P4-berry | | | | | | | | | | | | | |
| P5-gandhi | | | | | | | | | | | | | |
| F01 | | | | | | | | | | | | | |
| F02 | | | | | | | | | | | | | |
| F03 | | | | | | | | | | | | | |
| F04 | | | | | | | | | | | | | |
| F05 | | | | | | | | | | | | | |
| F06 | | | | | | | | | | | | | |
| F07 | | | | | | | | | | | | | |
| F08 | | | | | | | | | | | | | |
| F09 | | | | | | | | | | | | | |
| F10 | | | | | | | | | | | | | |
| F11 | | | | | | | | | | | | | |
| F12 | | | | | | | | | | | | | |

---

# Appendix — Where each menu name comes from

## Sourced from the PL 7 manual (`Astro_Fork/GeoVision/PL7/PL70.pdf`; printed page = PDF page)

| Name | Page |
|---|---|
| File → File Manager; File → Open; default folder C:/Geovision/Geovision Charts | 23–24, 171 |
| File → New; Birth Data fields; Manual Lookup; Time Zone without sign; DST/war time; East/West | 24–30 |
| Time-zone codes incl. IST and "IND … Indian War Time" | 29 |
| Options → Calculation Options → Ayanamsha (Lahiri default) | 35, 190 |
| File → Save; Edit → Birth Data | 35–36 |
| Print menu; print preview with Print button | 36, 153–154 |
| Reports menu groups (Horoscope, Calculations, … Miscellaneous) | 37, 180–182 |
| Print → Select Model; New Model; Edit; Available printouts | 37, 161–163 |
| File → Print screen ("Printouts from the Screen") | 37, 153, 173 |
| Worksheet; Charts & Tables dialog (Tables, Context, Special charts, Vargas); Dimension list | 38–40 |
| 16-field worksheet with all Shodasha vargas (fig. 3.5); Nadiamshas | 41 |
| Dashas field; Dashas dialog (Begin date, Dasha System, Levels, Dashas based on) | 42–44 |
| Chart + Gochara (Transits), – Asc, – Moon | 46 |
| Edit → Events; Add event; "Today" selection; Synchronize dates | 47–49, 175 |
| Planetary info table + Gochara context | 49 |
| Tajika vargas D5, D6, D8, D11 in the Vargas column | 52–53 |
| Ashtakavarga in Tables column; "Show Ashtakavarga scores" | 55 |
| Special charts: Bhava (Sripati), Bhava (equal), Krishnamurti Chart | 56 |
| Bhava, Hora, Ghatika lagna charts; Karakamsha | 57 |
| Tables: Karakas(7), Karakas(8), Shadbala, Yogi and Dagdha points, Lordships | 59–61 |
| Shad Bala printout "under the Calculations section of the Plug-Ins" | 60 |
| Right-click → Copy; Advanced options | 69 |
| Bhava Bala (right-click house number) | 76 |
| Charts → Ashtakavarga – Samudaya and the 5 Ashtakavarga worksheets | 95–97 |
| Research → Export Birth Chart (CSV with planet longitudes); file layout | 130–131, 202 |
| Research → Export ephemeris; `export` folder | 131–132 |
| Model contents: Basic Birth Calculations, Birth Chart and Planetary Details, Rashi Navamsha and Bhava Details, Shodashvarga Summary, Divisional Charts #1/#2, Shad Bala and Bhava Bala, Ashtakavarga pages, Krishnamurti – Chart and Bhava Details, Jaimini System, Vimshottari pages | 157–160 |
| Planetary details: the 15 columns | 144–145 |
| Edit → Astrologer Specific Settings (ayanamsa, Rahu per astrologer, used for models) | 164–165, 176 |
| File → Printer Setup; Copy Screen to Clipboard | 153, 173 |
| Options dialog tabs: Chart Style … System Options | 184–198 |
| Calculation Options → Miscellaneous items incl. Ashtakavarga, Sunrise, Karakas, Rahu & Ketu | 191–192 |
| Dasha Options: Dasha Year, Dasha Balance Method, Dasha Change | 193 |
| System Options: Write/Read Transit Cache; Reset all options settings now | 198 |
| Print → Dashas → Maha Dashas, Antar Dashas, 1-5 levels Dashas | 199–200 |
| Print → Krishnamurti | 200 |
| Help → About | 203 |
| Keys: Home, F5 (select worksheet), F7 (select model), F9 (change time tool) | 205 |
| Krishnamurti ayanamsa used by KP printouts "regardless of the default set" | 218–219 |

## Sourced from the PL 7 program files (not the manual)

- Worksheet names (`Astro_Fork/GeoVision/PL7/Lang1/Ws_lst1.l2`): Birth chart I, Vargas I–IV,
  Alternate Lagnas, Signs in all vargas, Vargavimshopaka, Shadbala, Bhava bala, Jaimini
  karakas and aspects, Jaimini padas and lagnas, Special Lagnas, Ashtakavarga - Samudaya,
  Binnashtakavarga for planets, Prastarashtakavarga, Krishnamurti, Birth chart & degrees,
  and the unused slots named `#31`, `#104` and so on.
- The 10 alternate vargas and their divisors (PL 7 program code, via the reverse-engineering report §4).
- The saved celebrity chart files and their data (`Astro_Fork/GeoVision/GeoVisionCharts/…`).

## Guesses (marked [GUESS] in the text)

- PL 9 names and positions of every menu (no PL 9 manual).
- The exact label of the "Chart" entry in the Tables column.
- The exact label of the Yogi table entry (manual says "Yogi and Dagdha points").
- Whether a house-system or Delta-T option exists in PL 9.
- Where Export Birth Chart saves its file.
- Which Reports sub-menu holds Basic Birth Calculations and the detailed Shadbala page.
- The exact "KP Ayanamsha" label on the KP printout.
- How unused worksheet slots look in PL 9, and that custom worksheets are remembered.
- Whether a Bhava (Sripati) field can show madhya/sandhi degrees.
- Whether PL 9 has a D11 named Rudramsha or Iyer.

## Windows features used (not PL)

Microsoft Print to PDF; Windows key + Print Screen (saves PNG to Pictures → Screenshots);
Paint; Send to → Compressed (zipped) folder.

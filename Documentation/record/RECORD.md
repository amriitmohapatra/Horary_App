# Kala Chakra / KAAST — Complete Conversation Record

**Sessions:** 2026-07-04 → 2026-07-28 (one continuous chat thread)
**Participants:** Amriit Mohapatra (user) · Claude (AI, Anthropic)
**Nature of this record:** the user's prompts are reproduced **verbatim**.
Claude's responses are recorded faithfully but condensed (long tables and
file listings summarised; all decisions, numbers and conclusions kept).
The "Reasoning" sections are Claude's own account of its thought process,
written by the same Claude instance within the same session with full
context — labelled *reconstructed* because internal deliberation is not
mechanically logged, but this is as close to the actual thought process
as can be externalised. HTML artefacts are not embedded (per request);
they live in `Advanced_Setup/web/dist/`.

Images: files referenced as `images/…` are archived in this folder.
Screenshots pasted inline into the chat (marked *inline*) could not be
extracted as files afterwards; each is described where it occurred.
Two inline app screenshots from 25–26 July were recovered from the
uploads store (`images/Screenshot 2026-07-25 …`).

---

## Turn 1 — 2026-07-04 · The beginning: automate the manual KP workflow

**User said (verbatim):**

> I need your help in automatic sections of the horary chart creation and
> automation of calculations of star lords and sub lords, as well as
> assigning cusp numbers. Until now this part has been going on manually
> and I want to automate the whole process but in different blocks that
> later get integrated together. Introduction: Horary Astrology is a
> branch of astrology which is intended to seek answers to specific
> queries of a querist "Will I get XYZ job?" or "Will I get admission to
> ABC college?", etc. Based on these question, the astrologer/researcher
> then creates a horoscope at that point in time using astrological
> software and obtains the information of the cusps in different signs as
> well their degrees and also the planets with certain degrees in certain
> signs. Both of these data are collected at a specific date, place and
> time (kind of like a birth chart) but mapped to the timing of the
> posing of the question by the querist. Once this information is made
> available, the next step then is for the astrologer to refer to the KP
> Star Lord and Sub Lord tables (4 different seris- one each for the
> fire, earth, air and water signs) [see the pdf file for more context].
> And then assign the star lord and sub lord to each of the 12 cusps and
> the planets of interest [Usually, Su-Sun, Mo-Moon, Ma-Mars, Ju-Jupiter,
> Sa-Saturn, Me-Mercury, Ve-Venus, Ra-Rahu and Ke-Ketu]. Until now what
> people had been doing is to manually refer to the document and edit the
> excel sheet by adding [starlord/sublord] next to the degrees assigned.
> E.g. Mon 26°Le13'36'' [Ve/Ke]. After the completion of this task, the
> next task is to manually assign the cusps and planets to the signs
> based on the east Indian method. While usually 1 cusp gets assigned to
> each sign, there could also be situations when there are 2 cusps in 1
> sign. E.g. cusp 1 is in taurus starting at 2 degrees but cusp 2 is also
> in taurus which starts at 28.5 degrees. Once these are assigned, the
> next step is to assign the cusp numbers to the 9 planets of interest.
> Usually this is done by taking a look at the degree in the sign and
> then giving the number -1 to it (E.g. if Cusp 4 is in Libra which
> starts at 3 degrees, Cusp 5 is in Scorpio which starts at 4 deg scorpio
> and Sun is placed at 25 degree Libra, then Sun gets assigned number 4,
> meaning it is in the 4th cusp. For situations involving cases where
> there are 2 cusps in one sign, we see the degrees of both cusps and
> then compare with the degree of the planet ). Once this is done, we
> have partial information about the planets already, i.e. we know the
> exact position. The next step is to see which cusps they actually
> influence i.e. placement [already accounted for] + ownership. If Cusp 1
> is Virgo (assumed to be the ascendant) then cancer sign falls in the
> 11th house. Moon is placed in Leo which means it is in 12th cusp and
> rules 11, therefore we write 12 and 11. The cusp placement is always
> written first, followed by the ownership. Rahu and Ketu are special,
> will get to them in a bit. For Rahu and Ketu, they are assumed to carry
> the qualities of their dispositor i.e. the lord of the sign they are
> placed in. E.g. If Rahu is placed in Aries [8th] which is ruled by Mars
> and Mars is placed in the 9th cusp and Mars rules [8th and 3rd
> cusp-scorpio], the numbers are assigned like this [Dispositor current
> placement, Rahu current placement, Dispositor own cusp number(s)]. This
> section gets a bit tricky when there are two cusps in one sign. There
> are also cases where some dispositors own 2 cusp numbers but some may
> own only 1. e.g. sun and moon rule only 1 sign each. Once these numbers
> are obtained, the next step is to put the cusp star/sub lord for each
> cusp and planet star sub lord in the astro for siddhartha app [I doubt
> if you can access and understand how the maths + code works there]
> which renders the rest of the numbers with powers that are then
> interpreted by the astrologer to give a response to the question
> originally asked by the querist. For now, let us focus on automating
> the tasks without errors up until the point of putting the numbers in
> the app itself because it is already a major thing to do. I need your
> help in creating an outline/plan and suggesting how we go about it. I'd
> prefer we create some form of a plugin or app that can make it easy to
> work in MS Excel itself and save time. Ask me question if you have any
> related to the entire description I gave about how horary astrology
> works and I will be happy to clarify. Note: In the KP Star Lord and Sub
> Lord pdf, some texts are written in odia [my dad wrote them] so if you
> have any issues understanding and decoding the ink based text, ask me
> right away. Lastly, the most important thing: Pattern recognition, if
> you keep finding interesting patterns as you learn, inform and ask me
> about them. Let's go.

**Images provided:** three inline screenshots — (a) the HOUSE CUSPS /
CHART POINTS blocks of a worksheet, (b) the annotated East-Indian chart
of the "SG" 8-Feb chart, (c) the CHART POINTS block with cusp-number
vectors. Same content preserved inside `RA Job.xlsx` (Sheet3).
Also in the folder: `KP Star Lord and Sub Lord Table.pdf` — archived
page renders at `images/kp_page-1..4.png`.

**Reasoning (reconstructed):** Read the folder before answering. The
scanned PDF had no text layer → rendered pages as images. On seeing page
1, recognised the table as the classic KP 249-subdivision scheme and
realised it is **fully computable from the nine Vimshottari dasha years**
(each year = 400″ of a nakshatra) — meaning no OCR and no lookup file, and
the PDF becomes a validator instead of a source. Verified the user's
worked examples by hand (Moon 12,11; Ra 9,8,3,8 …) before trusting my
model of the rules. Chose Python+xlwings after asking; designed six
blocks (parser, engine, placement, ownership, writer, validation).

**What was done / rendered:** Read `RA Job.xlsx` and the PDF; asked four
scoping questions (tooling; input layout; two-cusps-in-one-sign
convention; whether positions are always pre-computed). Reported the
first patterns: computability of the table; the four series existing
because a triplicity = 120° = 9 nakshatras; the red handwritten Taurus
rows in the PDF being the user's father's **correct** fix of a printed
omission (Rahu's sub spilling 29°13′20″ Ar → 1°13′20″ Ta). Built
`kp_core.py` + `process.py` + `xlwings_run.py` + generated
`KP_249_Reference_Table.xlsx`; validation: 60/60 exact vs both manual
charts; idempotent round-trip; raw-export reconstruction 0 diffs; PDF
page-1 22/22 rows. Shipped drag-and-drop `KP Annotator.html` after
discovering openpyxl preserves images but **drops line shapes** →
invented the surgical XML cell-writer (only changed cells rewritten).
Corpus audit of `Testing/` (64 files): 3,072 star/sub + 574 house tags
compared; found 3 manual slips + the `Jup[R]` retrograde-label parser
bug (fixed); span rule for cuspless signs confirmed by the user on the
Yale chart and encoded.

---

## Turn 2 — «Note: I have added many horary charts for validation…»

**User said (verbatim):**

> Note: I have added many horary charts for validation and testing of
> our work here. You can test with all of those charts and find out bugs
> if any.

**Reasoning:** Ground truth had just multiplied — run everything against
everything; disagreements are either my bug or a manual slip, and each
must be adjudicated, never auto-trusted.

**What was done:** `validate_batch.py` swept 64 workbooks / 74 charts:
only 4 disagreements, all shown to be manual slips (TRON cusp-10
`Mo/Mo`→`Su/Sa` table-row misread; Economics-PhD Venus house −4→−5;
NYU-Stern Mars −8→−7 by 13″). Retrograde labels fixed. 112-point
regression suite created.

---

## Turn 3 — TRON pushback and resolution

**User said (verbatim):**

> 1. TRON Crypto- As i said, ignore the nakshatra names. Moon is in
> capricorn, not Taurus. Just check degree from and degree to and if the
> sign name {element}. If see carefully, Moon degree is 6 deg 45 min....
> and the kp table is between 5 deg 06 min to 7 deg and it has Su/Me, not
> Su/Sa. 2. Yes you are right, I had made a mistake (problems of doing it
> manually) 3. Yes, that is also an honest mistake i made manually.

**Reasoning:** The user believed the flag was about the Moon; it was
about **cusp 10** (04°Ta32′16″). Rather than argue, dump every longitude
cell of the file with computed values so the specific cell is
unambiguous; also note the Moon (06°Cp45′49″ = Su/Me) was never flagged
and my computation agrees with his table row.

**What was done:** Cell-by-cell listing proving cusp 10's `Mo/Mo`
annotation belongs to the 10°00′–11°06′40″ row, not 4°32′; opposite cusp
4 (`Sa/Sa`) correct — introduced the opposite-cusp cross-check pattern.
User accepted; corpus stood at 3 manual slips, 0 code bugs.

---

## Turn 4 — Portability

**User said (verbatim):**

> Yes you are right. Your flagging is also correct. Wow! Okay. Now that
> everything is ready, how do I use this new innovation we've built,
> across systems and machines?

**What was done:** Packaged as pip-installable `kp-horary` (later
`kala-chakra`): `kp-annotate`, `kp-validate` console commands; three
deployment tiers explained (folder+pip today; private GitHub; PyInstaller
/ Streamlit for non-technical users).

---

## Turn 5 — The luddite version

**User said (verbatim):**

> Can you also create a more painless version of this tech for someone
> technologically luddite (e.g. they only know how to open and work on
> excel, but don't know a thing about python or coding.)? Just want to
> make it more accessible.

**Reasoning:** A single offline HTML file beats installers on every
axis for this audience. Discovered the source workbooks carry *drawing
shapes* (the chart lines) which JS spreadsheet libraries destroy → wrote
`xlsx_surgical.js` (JSZip + DOM XML; only changed cells rewritten) and
ported the whole engine to `kp_logic.js`.

**What was done:** `KP Annotator.html` (117 KB single file). JS↔Python
parity proven: 74 charts, 3,807 comparisons, 0 mismatches; byte-level
diff showed only the two sheet XMLs change.

---

## Turn 6 — 2026-07-06 · Horary Artifacts: the six guide steps & powers

**User said (verbatim, abridged only of pleasantries):**

> Good start. I am quite impressed. However this is only one step. I
> have added an excel file called horary artefacts where I have created
> sheets called Guide_Step(*) with steps from 1 through 6 that explain
> how horary astrological calculations work. Essentially there are 3
> major blocks of work that need to be automated. So far you managed to
> partially automate a significant part of one of the blocks […] My
> desired outcome is two things (a) A mechanism where an excel file is
> added with the raw info from the astrological app which when either
> done with python or html is able to do all 6 steps and finish the
> calculations entirely in excel itself […] (b) A dedicated application
> with a user friendly interfact that asks for the horary question,
> time, date and location and then also asks for the raw astrological
> data as per Guide Step 1 and then does the computations and
> calculations till the power calculation section and renders the final
> output in a "great" UI/UX based format […] You may proceed. Feel free
> to ask me any questions […] Work in loops and ask me if you face any
> confusion or doubt during the process. Good Luck, Fable ! :)

**Reasoning:** Guide_Step6 described the power calculation in prose with
one ambiguity (cell B44 repeats the position rule). The Sheet2 worked
example disambiguated it: star-lord **ownership carries power 3**.
Cross-validated my decoded model against the manual E-column power
strings *before* reading Sheet2's example — they matched, which made the
B44 line a provable typo. Node exception decoded from the Ra/Ke rows.
The twelve powers form a symmetric 3×2×2 grid — reported as a pattern.

**What was done:** Power engine (`power_terms/powers_for/powers_string`)
validated 27/27 vs every manual power string; SF raw-report parser
(steps 1–3; Nod→Ra, Ke opposite); `kp-build` end-to-end Excel builder
using the user's own Guide_Step2 sheet as template (zip-surgery to keep
its 12 line shapes; openpyxl would drop them); East-Indian slot map
decoded from the drawing XML geometry; JS ports + browser app **Kala
Chakra** (question/date/time/place + paste box → chart SVG, tables,
step-wise powers, Excel download). All shipped with parity tests.

---

## Turn 7 — Superscripts, full power validation, dad's fraction layout

**User said (verbatim):**

> All right, the app interface seems to work. For the fonts, a bit of an
> overflow is okay, not a big issue. For the power calculation however,
> I would prefer the powers are shown as superscripts rather than as
> subscripts. Validate the power calculations against all the horary
> charts done. In the app, I want you to add a couple of sections more
> that precisely show the calculations step by step. I can share the
> prototype rough display that my dad drew on paper while explaining the
> method to me. Show the calculations step by step and we are good to go.

**Images provided:** `images/dad_power_notation_IMG_8788.jpg` — the
father's handwritten fraction notation (numerator (Planet)²(own)¹ −
(Star)⁴(own)³ − (Sub)⁶(own)⁵ over denominator (Star)⁷(Sub)¹⁰ − … ).

**What was done:** Superscripts everywhere; corpus-wide power
validation (27/27 — the complete set that exists); four-step display in
dad's exact fraction notation (substitute → collect numerator → collect
denominator → merge & sort) plus per-side collected lines in Excel.

---

## Turn 8 — Source-code home, LaTeX documentation, naming, HTML vs exe

**User said (verbatim):**

> Excellent stuff, Fable 5! I have one last thing to ask of you.
> [where is the source]; Next, create a detailed latex pdf documentation
> detailing the entire process I have described. Lastly, name this app
> as "କାଳ ଚକ୍ର" or "Kala Chakra" [anglicized]. One question: Is the HTML
> the best option or do you think we should have done for the .exe
> executable version for windows and another version for mac ?

**What was done:** App renamed କାଳ ଚକ୍ର · Kala Chakra; 8-page LaTeX
methodology PDF (`docs/main.pdf`, house style, dual-output source+PDF);
honest HTML-vs-exe analysis (HTML wins for this use; Tauri if a native
shell is ever wanted).

---

## Turn 9 — README + repo restructure

**User said (verbatim):**

> Last thing, create a README.md file that can work as a good reference.
> Follow best practices for coders and re-arrange all relevant files
> with proper structuring so that I can create a github repository for it.

**What was done:** src-layout package `kala-chakra` v2.0.0
(`src/kala_chakra/…`, `tests/`, `web/{src,dist,vendor}`, `docs/`),
`.gitignore`, full reference README, template as package data; all
suites re-run green after the move.

---

## Turn 10 — 2026-07-07 · Ephemeris independence

**User said (verbatim, key part):**

> Everything we have co-created so far is dependent on what is produced
> via Solar Fire Gold with its specific settings. I need you to have a
> look at those settings I screenshotted from the desktop app and
> understand it. Secondly […] find out if Solar Fire Gold's source code
> exists or, if not, search if the source code is open source that is
> the key element of the chart creation and generation. Basically the
> aim is to replicate what Solar Fire Gold's Horary chart configuration
> creates so that in future we do not have to rely on it […] Target
> should be to understand and build the calculation framework using open
> sources and methods (Topocentric, Lahiri, Geocentric, True Node) etc.
> so that the Guide_Step1 artefacts are also generated by the app. Let
> me know if you can do this.

**Images provided:** 18 settings screenshots —
`images/Screenshot (21).png … (38).png`. Decisive finds: Zodiac tab
(Sidereal/Lahiri, SVP 1900 = 07°Pi32′22″), Houses tab (Topocentric),
Calculations tab (True Node, geocentric-latitude correction ON),
Ephemerides tab (**Swiss Ephemeris path** — SF's engine is the open
Swiss Ephemeris).

**Reasoning:** SF itself is closed-source, but its computational heart
is open — so replication is *adoption*, not approximation. Proof before
promise: installed pyswisseph, reproduced the Test1 chart same-day.
Residual diagnosis separated three causes: Moshier fallback vs real data
files; SF's obsolete ΔT (87 s in 2026 vs true ~73 s); ~1″ ayanamsa epoch
offset; plus LST/atlas bookkeeping. Asked for reference charts with full
headers to calibrate.

**What was done:** Feasibility proven (ayanamsa exact; planets ≤1–2″);
requested 8–10 SF reports with headers.

---

## Turn 11 — Reference charts & calibration; `kp-cast`

**User said (verbatim):**

> Okay, I have added the charts you want in an .xlsx file based on some
> horary charts I already did in the past. Note: Lapanga location has to
> be added manually and it was a bit different (minutes) for different
> computers, hence you may see differences in cusp positions while the
> planetary positions should not be different.

**Reasoning:** Every SF header is self-calibrating (ΔT, JDE, LST,
obliquity, geocentric latitude). Recovered civil times by snapping to
whole seconds; recovered each machine's entered longitude from LST;
recognised the "Ayanamsa of date" display swings with the 18.6-year
nutation cycle (true-equinox display — cosmetic; never calibrate on it).
Fit one constant (+1.251″) and an ΔT anchor curve.

**What was done:** `ephemeris.py` + `kp-cast` (modes `sf` | `modern`),
Swiss data files bundled; validation **80/80 planets ≤1″, 120/120 cusps
in tolerance**; per-machine atlas drift documented.

---

## Turn 12 — KAAST browser casting + formatting round

**User said (verbatim, key parts):**

> …(1) Create an html version as well of this which is standalone and
> (2) Create an html version that is integrated with kala chakra. (3)
> Formatting checks of Kala chakra app - (a) Add a brief liner "by Swami
> Yogeswarananda Giri" (b) Rename the describer as KAAST instead of KP -
> Karar Ashram Astrology Software (c) For a few signs and houses, there
> is next overflow of cusps, planets and sign names […] (d) In the
> integrated version - […] also display the exact latitude and longitude
> (I think we may have to do something about the location thing […] (e)
> Replace "Location" with "Place". Note: Do all of these tasks in a
> separate folder without editing the original files. Create a folder
> called "Advanced_Setup" and follow best folder/file naming and
> organization practices and do your thing.

**What was done:** `Advanced_Setup/` created; `swisseph-wasm` npm build
adopted, its 12 MB data trimmed to 2.1 MB by rewriting the emscripten
package manifest (asteroid-name catalogue dropped); glue patched for
classic scripts; `ephemeris.js`, `places.js` (gazetteer + localStorage);
two apps built (`KAAST Caster.html`, integrated `Kala Chakra.html`) with
all five formatting items; WASM engine validated 80/80 planets, and an
end-to-end cast of the RA Job moment reproduced the manual chart's Moon,
numbers and power string exactly.

---

## Turn 13 — Corpus validation of the caster

**User said (verbatim):**

> Okay, now I need your help with another thing… you already have the
> charts for which Singapore was set as the location. Run both of these
> against all the existing charts and validate if the degrees, minutes
> and seconds match with the values found in those excel files (obtained
> via Solar Fire Gold 9). See if they match exactly and if not, then why
> not match exactly.

**Reasoning:** Planets are place-independent → validate all 45 labelled
charts regardless of atlas drift; big mismatch clusters looked like a
**time** problem per-chart, and the per-body inconsistency (Sun vs Moon
shifts) proved *labels* wrong, not charts: Excel D/M–M/D swaps, a year
typo, second-level slips. Solved each chart's true moment from its own
planets (Sun→day, Moon→minute).

**What was done:** With corrected labels: **404/405 planetary positions
within 1″** (the 405th = XVG's 9-second time-cell slip); cusps offset
per machine exactly as the user predicted; JS engine matched Python;
`VALIDATION_REPORT.md` written with the full label-error table.

---

## Turn 14 — Dasha requirement; PL engine; security question

**User said (verbatim, key parts):**

> One more thing: Once everything is done, we use Parashara's Light 7.0
> to create a horoscope with the same time and place. We do so in order
> to obtain the Mahadasha - Antardasha - Pratyantar Dasha - Sookshmadasha
> - Pranadasha as well as when the pratyantar periods change (E.g
> Me-Ve-Ra-Mo-Su). Have a look at the specific charts where I added the
> screenshots of what is needed. Can you also find out which Engine is
> used in Parashara's Light app. Secondly, my dad was asking about
> cybersecurity issues - he does not want anyone to crack the html
> source code and wants to preserve the workflow secret. What advice
> would you give regarding this?

**Images provided:** PL dasha screenshots embedded in workbooks —
archived: `images/pl_dasha_rajob_image2.png` (Ketu-Jupiter table),
`images/pl_dasha_rajob_image4.png` (Venus-Ketu), and
`images/pl_dasha_manta_image10.png` (Sun-maha multi-panel, MANTA).

**Reasoning:** Vimshottari is arithmetic on the Moon's longitude — PL
becomes optional. Decoded conventions by fitting the screenshots:
365.25-day year; each level subdivides from its parent's lord; balance
from the Moon's nakshatra fraction. MANTA's blank time cell recovered
(~16:00) *from* the dasha table itself. Security: honest triage —
distribution control first, optional AES password build, WASM
compilation for the rules, server only if ever public; the deepest
secret (interpretation) was never in code.

**What was done:** `dasha.py` validated **40/40** PL dates (RA Job 7,
SG 4, MANTA 29); PL research (PL7 in-house engine; PL9 advertises Swiss
Ephemeris); security advice delivered.

---

## Turn 15 — Dasha into both apps (v0.96)

**User said (verbatim):**

> Can you incorporate this in the KAAST caster and the new Kala Chakra
> HTML documents too? (Do it without editing existing files. Label it as
> KAAST caster v 0.96 and Kala Chakra v 0.96)

**What was done:** `dasha.js` (40/40 parity), v0.96 shells + builds:
dasha card (5-level chain, PL-style pratyantar table with the running
row highlighted, upcoming changes). Versioning-as-new-files became the
standing rule.

---

## Turn 16 — The upcoming-pratyantar bug (v0.96 fix)

**User said (verbatim):**

> I tested against a sample horoscope and I found some error here :
> Upcoming Pratyantar changes does not show any changes in the "Chains"
> column. Cross check the calculation methods and validate again against
> the existing manually done horoscope charts.

**Images provided:** inline screenshot of the dasha card showing six
identical "Me-Ke-Ju" rows with drifting dates.

**Reasoning:** Re-anchoring: `mahaTimeline` derives the timeline from
the Moon fraction *at the moment passed in*; calling it at future
moments re-anchors the whole cycle → same relative chain, drifting
dates. Correct design: anchor once at the chart moment, walk the period
structure forward. This became a written invariant.

**What was done:** Fix in JS + Python (`upcoming_pratyantars`); 40/40
regression held; the user's own sample reconstructed to show the correct
progression Me-Ke-Ju → Me-Ke-Sa → Me-Ke-Me → Me-Ve-Ve.

---

## Turn 17 — The second brain

**User said (verbatim, key part):**

> …I want to ask you, what is the best way to document everything I
> said, you said, what patterns you learned, what files you referred to
> so that this knowledge is stored somewhere (perhaps second brain-like
> .md files with linkages?) and later accessed again? [What I am
> expecting is, if I open codex and start a new conversation, with
> minimal words and sentences I should be able to guide it enough to
> read the code files and understand the whole context…]

**What was done:** `AGENTS.md`/`CLAUDE.md` bootstrap files (root + per
project folder) + `knowledge/` (8 cross-linked notes: start-here,
domain, powers, calibration, architecture, validation ground truth,
decisions log, invariants) with a maintenance contract every future
session must honour.

---

## Turn 18 — v0.97: chart geometry + prana table

**User said (verbatim, key parts):**

> He said there is one more thing missing: 1) The sign and degree
> placements are way off for some of the houses/cusps. They need to be
> aligned in their signs (e.g. sagittarius, virgo, aquarius in this
> specific case) 2) I need one more box that shows everything upto Prana
> Dasha E.g. Me-Ve-Ke-Su-Mo, … (atleast 10 such prana dasha periods)
> with the dates on which they are happening. Can you do it for me?

**Images provided:** inline screenshot of the chart with Aquarius text
crossing its diagonal and Sagittarius/Scorpio labels colliding.

**Reasoning:** Fixed anchors can't respect diagonals; made every text
row compute its safe x from the corner diagonal at its own height
(geometry-aware regions + two-pass per-row font fit); prana list is the
generic `upcomingPeriods(depth=4)`.

**What was done:** v0.97 (both apps): overflow-free layout (verified
numerically on the user's chart + a 7-entry stress case) and the
12-row prana table with hh:mm boundaries.

---

## Turn 19 — v0.98 five-level lord chains; v0.99 colours; v1.00 horizon

**User said (verbatim, three consecutive requests):**

> Let's now proceed to v 0.98 for both. And I guess this should be a
> cosmetic change. Until now, for Cusps and Planets, we only show
> [Planet/Cusp | Star Lord | Sub Lord]. My dad said without any other
> edits, he just wants three more layers to be displayed i.e. for each
> of [Planet/Cusp | Star Lord | Sub Lord | Sub-Sub Lord | Sub-Sub-Sub
> Lord | Sub-Sub-Sub-Sub Lord]. Can this be done?

> I saw, the interface is quite good. One more cosmetic change needed
> though. I want to highlight the star and sub lords of the planets and
> cusps by using different text colour for them. […]

> Okay, now I need your help with another thing. In the Upcoming
> pratyantar changes, set a generalized rule that shows changes for
> atleast 8 months […]

**Reasoning:** Sub² spans stop being whole arcseconds → rescale offsets
×120 per level to keep every boundary an exact integer (peak ~8.3×10¹⁰,
inside 2⁵³). The Moon's five spatial lords equal its running dasha chain
— same subdivision read spatially vs temporally (reported as a pattern).
Horizon rule replaces fixed row-counts (fast antars need many rows).

**What was done:** v0.98 chains validated (5,000-point parity, level-1/2
≡ star/sub); v0.99 colour-coding (green star / crimson sub, tables +
chart tspans); v1.00 horizon rule (≥244 days coverage, 5–13 rows,
verified across fast/slow regimes).

---

## Turn 20 — v1.01 iOS seconds, event check, quotes; v1.02 fix

**User said (verbatim, key parts):**

> …(1) Currently the html has options of adding date and time in the
> format of the local pc/macbook […] I found a bug which did not allow
> seconds information to be input (only hour and minute can) […] extend
> this functionality to iOS devices. 2) […] add a section which will be
> optional for the user […] ask the user to add notes regarding the
> horary question itself […] enter the approximate date and time of that
> event and then what the engine does is render the running periods of
> the prana dasha from 2 days before and 2 days after the event […] 3)
> […] these quotes will be stored somewhere and everytime I open the
> app, a quote will be displayed at the top banner randomly […]

Then, after testing (with inline screenshot of the error — archived as
`images/Screenshot 2026-07-25 at 11.35.21 PM.png` /
`…11.55.29 PM.png`):

> Needs a correction: I could not run this on my macbook. Also the
> quotes should appear right after I open the html.

**Images provided:** four notebook photos of Gurudev's handwritten
quotes — `images/*PHOTO-2026-07-13-18-05-21*.jpg` (transcription
deliberately not guessed; only clearly legible text used until the user
supplied verified transcriptions in Turn 21).

**Reasoning:** iOS `<input type=time>` never offers seconds (Safari) →
merge rule with an ss box. Event check must anchor at the chart moment —
and the SG chart's real outcome (letter 15-02-2023 08:47, dad's note
`Ve-Ke-Ra-Ju-Ve`) became a ground-truth test that *proved* the anchoring
design. The v1.01 defect: a patch anchor silently missed in the app
shell (caster fine) → the block with `timeParts` + quote code was absent.
Lesson institutionalised: contract check (used symbols must be defined)
+ jsdom functional smoke test on the real built file.

**What was done:** v1.01 shipped, bug found by user, v1.02 shipped with
the two new test gates; functional test proved quote-on-open and
friendly validation errors.

---

## Turn 21 — 2026-07-26 · v1.5: Deha dasha, quotes, max-power highlight

**User said (verbatim, key parts):**

> We can now officially move towards working on a v 1.5 of Kala Chakra
> app. […] (1) […] adding the sub Prana Dasha which is also called the
> Deha Dasha. This means that the complete calculation goes one step
> further into a six-tier temporal hierarchy. For this, I would prefer
> the calculations are shown separately in a separate section, perhaps
> after the current html document ends […] I want the deha dasha to be
> displayed for that too, again in the section at the end of the page.
> (I repeat: Do not alter existing frameworks). (2) […] while ensuring
> that the time lengths for which the deha dasha times are displayed
> follows the same time length as was decided before […] (3) The quotes
> […] replace this with "(That) which is lotted cannot be blotted". Also
> add a few more sentences […] Note: Remove the parts that showed where
> the date and time of when these quotes were said.- just plain quotes
> will do.

Mid-turn addition (verbatim):

> I forgot to mention one more thing: For the power calculations, one
> formatting change needed (in v 1.5). For each Planet \ Star \ Sub
> \...\Sub^4 series, once the final calculations are done and being
> displayed, highlight with a different colour the bases that have the
> highest powers with a different colour. (colour blind friendly). If
> two or more bases share the same powers, highlight all.

**Reasoning:** Deha = one more recursive subdivision; generic
`periodsInWindow(depth)` covers both the main table (window = the
displayed prana span) and the event window (±2 days). Ground truth again:
event deha `Ve-Ke-Ra-Ju-Ve-Ve` nests inside dad's noted prana. Max-power
highlight must not rely on colour alone → orange + bold + pill.

**What was done:** v1.5 (both apps): end-of-page Deha section (6-level
chain; ~103-row deha table sharing the prana window boundary exactly;
event-window deha via a second listener so the existing handler is
untouched); five plain quotes (verified transcriptions supplied by the
user); max-power highlight with tie handling; all gates green.

---

## Turn 22 — 2026-07-28 · This request

**User said (verbatim, key parts):**

> (0) Create an Odia language version of the app […] (1) save everything
> in this conversation not as a durable insight but as a detailed
> record […] (2) Refer to the skill.md file attached […] Create 2
> documents- One that explains the entire journey of the app's creation
> […] along with a guide for someone new to horary astrology […] (3)
> Create a technophobe/luddite friendly detailed documentation on how to
> use the app […] Both documents need to be in English, as well as Odia.
> Refer to the attached docs for guidance and use-skill
> /app-documentation-audit

**Outcome:** this record; `Kala Chakra v1.5 (Odia).html`; the two
bilingual documents and the audit bundle in `Documentation/`.

---

*End of record. Everything above is traceable to files in this folder
tree; where an image existed only inline in the chat, it is described at
its turn and, where a copy also reached the uploads store or a workbook,
the archived filename is given.*

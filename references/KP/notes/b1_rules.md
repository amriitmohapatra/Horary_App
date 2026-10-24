# B1 "Casting the Horoscope": rule catalogue (KP1-xxx)

Reader: agent b1. Source: `references/KP/vault/B1 Casting the Horoscope/` (all 18 notes, all 30
figures opened). Cite as "B1 p. N" (source-PDF page). Worked charts: `b1_examples.json`.

Format: `- **ID** · **Title.** Condition → meaning/procedure · (cite) · grade · status · notes`.
Grades: VERIFIED-ON-FIGURE (checked against the page image), CLEAR, UNCLEAR. Status: EXISTS,
COMPUTABLE, GUIDANCE, HORARY, REJECTED-TRADITION.

**Re-computation method (applies to every "checked" note below).** I re-cast the book's charts
with the app's own Swiss Ephemeris 2.10.03 WASM (`kaast2/vendor`, booted through
`kaast2/tests/engine/boot.ts`) and the app's `PL_AYANAMSA` formulas. The scripts were throwaway
scratch files; no app code was changed. "KP-New" below means PL's `pl_krishnamurti_new`.
"KP-291" means PL's `pl_krishnamurti` (22.453973785° at 1900 + 1.3955235417°/century).

---

## 1. Ayanamsa

- **KP1-001** · **Only the Krishnamurti ayanamsa for KP.** To predict by KP, take only the KP ayanamsa. Other values, especially widely varying ones, make KP useless. · (B1 p. 4; p. 79; p. 95) · CLEAR · EXISTS · The KP page already casts with a Krishnamurti ayanamsa regardless of the chart default (decisions log 2026-10-17). Which of the two variants is right: see KP1-003/004.
- **KP1-002** · **Definition: three parameters.** An ayanamsa is fixed by (1) the date the fixed and moving zodiacs coincided, (2) the annual precession rate, and (3) the reference point of nirayana Aries 0°. Printed values: coincidence **Krishnamurti 291 A.D.** (Cheiro 388 B.C., Davidson 317 B.C., Massey 250 B.C., Thierens 125 B.C., Councel 0 A.D., Fagan 213 A.D., Lahiri 285 A.D., P. S. Ray 319 A.D., Sepharial illegible). Rate: **"Krishnamurti follows the figure given by Newcomb, 50.2388475″"** a year (Aryabhata 46.3″, Parasara 46.5″, Varahamihira 50.0″, Surya Siddhanta 54.0″, Bhaskara 59.9″). Reference point: some take the Aswini group, others the point 180° from Spica, with Spica at the end of Virgo, i.e. 6°40′ into Chitra. · (B1 p. 78–79) · CLEAR (text tables, no figure) · EXISTS · **These two numbers are exactly PL's "Krishnamurti" (KP-291).** 1.3955235417°/century × 3600/100 = 50.23884750″/yr, and 22.453973785° at 1900.0 ÷ 50.2388475″ = 1609.0 years before 1900, i.e. 291 A.D. So PL built its "Krishnamurti" option from this paragraph. But see KP1-003: the book's own table and worked charts do **not** use it.
- **KP1-003** · **The Krishnamurti ayanamsa year table, 1840–2001.** "Ayanamsa Longitude" for each English year. Deduct it from sayana longitudes. Beyond 2001, "for each year add at the rate of 50.2388475 secs". · (B1 p. 80–81) · CLEAR (text table; no figure. Successive values step by 0′ or 1′ only, so no gross misprint) · COMPUTABLE (as a validation table) · Full table:
  ```
  1840 21°31'  1841 21°32'  1842 21°33'  1843 21°34'  1844 21°35'  1845 21°36'  1846 21°37'  1847 21°37'  1848 21°38'
  1849 21°39'  1850 21°40'  1851 21°41'  1852 21°42'  1853 21°42'  1854 21°43'  1855 21°44'  1856 21°45'  1857 21°46'
  1858 21°47'  1859 21°47'  1860 21°48'  1861 21°49'  1862 21°50'  1863 21°51'  1864 21°52'  1865 21°52'  1866 21°53'
  1867 21°54'  1868 21°55'  1869 21°56'  1870 21°57'  1871 21°57'  1872 21°58'  1873 21°59'  1874 22°00'  1875 22°01'
  1876 22°02'  1877 22°02'  1878 22°03'  1879 22°04'  1880 22°05'  1881 22°06'  1882 22°07'  1883 22°08'  1884 22°08'
  1885 22°09'  1886 22°10'  1887 22°11'  1888 22°12'  1889 22°13'  1890 22°13'  1891 22°14'  1892 22°15'  1893 22°16'
  1894 22°17'  1895 22°18'  1896 22°18'  1897 22°19'  1898 22°20'  1899 22°21'  1900 22°22'  1901 22°23'  1902 22°23'
  1903 22°24'  1904 22°25'  1905 22°26'  1906 22°27'  1907 22°28'  1908 22°29'  1909 22°30'  1910 22°31'  1911 22°32'
  1912 22°33'  1913 22°33'  1914 22°34'  1915 22°35'  1916 22°36'  1917 22°37'  1918 22°38'  1919 22°38'  1920 22°39'
  1921 22°39'  1922 22°40'  1923 22°41'  1924 22°42'  1925 22°43'  1926 22°44'  1927 22°44'  1928 22°45'  1929 22°46'
  1930 22°47'  1931 22°48'  1932 22°49'  1933 22°49'  1934 22°50'  1935 22°51'  1936 22°52'  1937 22°53'  1938 22°54'
  1939 22°54'  1940 22°55'  1941 22°56'  1942 22°57'  1943 22°58'  1944 22°59'  1945 22°59'  1946 23°00'  1947 23°01'
  1948 23°02'  1949 23°03'  1950 23°04'  1951 23°04'  1952 23°05'  1953 23°06'  1954 23°07'  1955 23°08'  1956 23°09'
  1957 23°10'  1958 23°10'  1959 23°11'  1960 23°12'  1961 23°13'  1962 23°14'  1963 23°15'  1964 23°15'  1965 23°16'
  1966 23°17'  1967 23°18'  1968 23°19'  1969 23°20'  1970 23°20'  1971 23°21'  1972 23°22'  1973 23°23'  1974 23°24'
  1975 23°25'  1976 23°25'  1977 23°26'  1978 23°27'  1979 23°28'  1980 23°29'  1981 23°30'  1982 23°30'  1983 23°31'
  1984 23°32'  1985 23°33'  1986 23°34'  1987 23°35'  1988 23°35'  1989 23°36'  1990 23°37'  1991 23°38'  1992 23°39'
  1993 23°40'  1994 23°41'  1995 23°41'  1996 23°42'  1997 23°43'  1998 23°44'  1999 23°45'  2000 23°46'  2001 23°47'
  ```
  **Checked (all 162 years):**
  - Least-squares slope 50.28″/yr, which is the Lahiri/IAU rate, not 50.2388″.
  - Against **KP-New** at 1 July: mean −0.16′, range −0.76′…+0.97′; 123 of 162 entries equal the rounded value.
  - Against **Swiss `SIDM_KRISHNAMURTI`** (mode 5): 1840 21°31.6′/32.0′ (1 Jan/1 Jul), 1900 22°21.8′/22.2′, 1930 22°47.0′/47.4′, 1963 23°14.6′/15.0′, 2000 23°45.6′/46.0′, 2001 23°46.5′/46.9′. These match the table to the minute.
  - Against **KP-291**: the table is **4.3′–6.0′ lower** (Jan 1), e.g. 1963 KP-291 = 23°20.0′ vs table 23°15′.
  - Conclusion: the table is ≈ Lahiri − 5′46″…6′05″, i.e. KP-New ≈ Swiss Krishnamurti, and it **contradicts the 291 A.D. / 50.2388475″ statement of KP1-002**.
  - Other Readers agree with the table: 1919 22°38′ (B6-21), 1967 23°18′ (B5-18, B6-21), 1968 23°19′ (B6-33), 1969 23°20′ (B3-53/54, B6 passim). Outliers to check by their own readers: B4-67 "22°32′" for 1936 (table 22°52′), B3-48 "22°40′".
- **KP1-004** · **The worked charts use the table value (KP-New), not KP-291.** The book subtracts the table value of the birth year (Agra 1963: 23°15′; Tiruvarur 1934: 22°50′; Guna 1935: 22°51′ "as given in [KP] Ephemeris p. xviii"; Belgaum 1930: 22°47′). · (B1 p. 76, 81, 127, 129, 152, 164) · VERIFIED-ON-FIGURE (Figs. B1.5, B1.6, B1.7, B1.8, B1.10, B1.20, B1.24, B1.27) · EXISTS (`pl_krishnamurti_new`) · **Implied ayanamsa = Swiss tropical longitude − printed nirayana longitude:**
  - wife 1938: Sun 22°54.6′, Moon 22°53.8′ (KP-New 22°53.6′, KP-291 22°59.2′);
  - husband 1933: 22°48.8′/22°48.7′ (KP-New 22°49.4′);
  - 26-12-1931: 22°47.4′/22°48.0′ (KP-New 22°48.4′);
  - Salem 1948: Sun 23°01.2′ (KP-New 23°02.5′);
  - 1929: Moon 22°46.5′ (KP-New 22°46.3′);
  - Agra 1963: 23°15.9′/23°15.1′ (KP-New 23°14.7′);
  - Tiruvarur 1934: 22°49.4′/22°50.4′ (KP-New 22°50.4′);
  - Guna 1935: 22°51.5′/22°51.6′ (KP-New 22°51.5′);
  - Belgaum 1930: 22°46.7′/22°48.1′ (KP-New 22°47.1′);
  - 1937 Palghat corrected lagna: 22°46.6′.

  **No chart fits KP-291** (≈ +5.4′). **Decision input for the app:** the decisions log leaves open which PL KP ayanamsa to use (Test 2), and the app's `auto` default is currently `pl_krishnamurti` (KP-291). B1's own numbers support `pl_krishnamurti_new`. A 5.4′ shift moves a sub boundary for roughly 1 cusp in 8 (sub widths are 40′–2°13′).
- **KP1-005** · **Lahiri, C. G. Rajan and KSK differ negligibly.** "The difference between what I follow, what Lahiri and C.G. Rajan follow is negligible." · (B1 p. 79) · CLEAR · GUIDANCE · In numbers: the table is ≈ Lahiri − 6′. B5-35 (B5 p. 360) repeats it: "I follow only Newcomb… Lahiri, C G Rajan… more or less the same."
- **KP1-006** · **Ayanamsa cannot be proved from planet–cusp relations.** The relative position of a planet and a cusp is the same under any ayanamsa. Proof must be "stellar": the dasa timing of known events and the ruling planets. · (B1 p. 77) · CLEAR · GUIDANCE · Rationale for KP1-007/008.
- **KP1-007** · **Dasa test of the ayanamsa (wife's chart).**
  - The rule: if the ayanamsa used for 1938 is less than 22°44′, the marriage (19-11-1961) would fall in Rahu–Ketu, not Rahu–Mercury. "Hence reject outright if the ayanamsa is less than 22°44′ for 1938."
  - Supporting events: wife, marriage Rahu–Mercury–Jupiter–Rahu (sookshma), daughter 12-12-1962 in Rahu–Ketu–Jupiter. Husband, marriage Mercury–Moon–Jupiter–Venus, daughter Mercury–Mars–Rahu.

  · (B1 p. 84–88) · VERIFIED-ON-FIGURE (Figs. B1.6, B1.7) · GUIDANCE (natal verification), COMPUTABLE (the dates) · **Checked with Swiss Moon + KP-New:**
  - All four printed antaras reproduce with **365.2425-day** years: wife Ra–Me–Ju 7-8-1961…9-12-1961 and Ra–Ke–Ju 9-12-1962…29-1-1963; husband Me–Mo–Ju 17-10-1961…25-12-1961 and Me–Ma–Ra 8-11-1962…2-1-1963.
  - With **360-day** years three of the four antaras fail.
  - However, the "22°44′" threshold itself reproduces only with 360-day years (computed 22°44.8′). With 365.25-day years the bhukti flips only below 22°17′. So KSK's threshold was probably estimated in 360-day arithmetic, the convenience of KP1-045.
- **KP1-008** · **Ruling planets reveal the truth only with the KP ayanamsa.** "If one uses a less value, the prediction must miserably fail." · (B1 p. 95) · CLEAR · HORARY · See §9.

## 2. Time standards and sidereal time

- **KP1-010** · **Standard time.** Each country keeps the time of one chosen meridian. India's meridian is 82°30′E, chosen in 1906; IST = GMT + 5h30m. The book prints a table of adoption dates (United States/Canada 18-11-1883, Japan 12-7-1886, … **India 1-1-1906**, Peru 28-7-1908, Chile 1-1-1910, France 10-3-1911). It also prints a table of offsets from GMT (e.g. Ireland 0h25m21s, France/Algeria/Tunis 0h9m21s [Paris time], Portugal 0h36m5s, Singapore 6h55m25s, Shanghai 8h5m43s, India 5h30m). East of Greenwich add the offset to GMT; west, subtract. US zones: 75°/90°/105°/120°W meridians, borders at 67½°, 82½°, 97½°, 112½°, from 18-11-1883. · (B1 p. 42–45, 48) · CLEAR · EXISTS (zone handling in places/time) · The historic offsets (pre-standard local times) can serve as a cross-check for old non-Indian births. Two entries are doubtful in the transcript: "Prussia [?1893]" and "Austria Hungary 1 [?0]".
- **KP1-011** · **LMT.** LMT = GMT + 4 min per degree of east longitude (west: subtract). Equivalently, LMT = IST + 4 min × (longitude − 82°30′). Worked examples: Madras 80°15′E, 12-15 p.m. IST → 12-06 p.m. LMT. Calcutta 88°24′E → 12-38-36 p.m. Mangalore 74°53′E → 11-44-32 a.m. New York 74°01′W, 3 p.m. EST → 3-03-56 p.m. LMT. Agra 78°05′E, 6-30 p.m. → 6-12-20 p.m. Allahabad 81°54′E, 3-30 a.m. → 3-27-36 a.m. Ahmedabad 72°38′E, 12-05 p.m. → 11-25-32 a.m. Boston 71°02′W, 9 p.m. → 9-15-52 p.m. San Francisco 122°25′W, 7 a.m. PST → 6-50-20 a.m. Tiruvarur 79°40′E, 2-34 p.m. → 2-22-40 p.m. Guna 77°20′E, 9-08 p.m. → 8-47-20 p.m. Belgaum 74°34′E, 7-37 a.m. → 7-05-16 a.m. · (B1 p. 46–49, 56–61, 126, 150, 161) · CLEAR · EXISTS · Fixture b1-E17. Allahabad's longitude is printed **81°54′** on p. 56 but **81°34′** on p. 66 (typo); 81°54′ reproduces the LMT.
- **KP1-012** · **LMT is needed only for the cusps.** Planet positions need only GMT (or IST). LMT is needed to get the local sidereal time for the ascendant and MC. · (B1 p. 49, p. 117) · CLEAR · EXISTS.
- **KP1-013** · **Sidereal time, manual recipe (Raphael's Ephemeris).**
  - The sidereal day is shorter than the solar day by 3m56.555s; a sidereal clock gains 3m55.909s a day (p. 39, 41).
  - Recipe (p. 52):
    1. Take the ST at the previous Greenwich noon: for an LMT birth after noon, the same date; for one before noon, the previous date.
    2. Subtract 2/3 s per degree of east longitude (add for west).
    3. Add the interval from that noon to the birth LMT.
    4. Add 10 s per hour of that interval.
    5. Reduce mod 24h.

  · (B1 p. 50–61) · CLEAR · EXISTS (Swiss sidereal time) · Not a rule to implement, but fixtures. **Checked:** Swiss GMST at 12h UT gives 14-5-1963 3h26m02s and 15-5-1963 3h29m59s (book: 3h26m2s, 3h29m59s), and 13-6-1934 5h24m26s (book p. 126: 5-24-26). All exact. Book results: Agra 9h42m29s, Allahabad 18h55m18s, Ahmedabad 2h54m40s, Boston 12h48m11s, San Francisco 22h20m52s, Tiruvarur 7h46m37s.
- **KP1-014** · **Sidereal time, Krishnamurti Ephemeris variant.** The KP Ephemeris tabulates ST for 5-30 p.m. IST (= 5-30 p.m. LMT at 82°30′E, = 12h GMT). Take the same date if the birth LMT is after 5-30 p.m., otherwise the previous date. Add the interval since that 5-30 p.m. plus 10 s/h. For any Indian birth, omit the longitude correction (≤ 8 s). · (B1 p. 115–117, 150, 162) · CLEAR · EXISTS · **Checked** (Swiss GMST(12h UT) + 5h30m):
  - 1-11-1918 20h09m51s ✓, 9-11-1918 20h41m24s ✓, 7-11-1918 20h33m30s ✓, 12-9-1935 16h52m16s ✓, 10-6-1930 10h42m28s ✓ (printed "10° 42′ 28″").
  - **5-11-1918 is misprinted 20h23m37s; correct 20h25m37s.** The book's result 22h45m01s should therefore be 22h47m01s.
  - Book results: Calcutta 1-11-1918 22h → 1h04m16s; Calcutta 10-11-1918 9h → 12h37m39s; Bombay 8-11-1918 17h → 19h28m55s; Guna 20h10m09s; Belgaum 0h20m00s.
- **KP1-015** · **Civil vs astronomical day.** Before 1-1-1925 the astronomical (ephemeris) day began at noon; since 1925 both begin at midnight. · (B1 p. 40) · CLEAR · EXISTS (Swiss works in UT) · Relevant only to someone reading a pre-1925 printed ephemeris.
- **KP1-016** · **War time.** During the war Indian clocks were one hour ahead of IST. A recorded birth time from those years may be war time; Krishnamurti decides which by ruling planets (KP1-098). · (B1 p. 159–160, 169) · VERIFIED-ON-FIGURE (Fig. B1.25) · EXISTS (`places.ts`: IST+1h from 1942-09-01 to 1945-10-15, the same dates as B3-76 "Dictionary": 1-9-1942 to 15-10-1945) + HORARY (the RP decision).
- **KP1-017** · **Ghati/vighati to clock time.** The Hindu day runs sunrise to sunrise, taken as 60 ghatis. 1 ghati = 24 min, 1 vighati = 24 s. Birth time = sunrise + ghatis. Sunrise tables (LMT, 10°–35°N, every 10 days) are given. IST = LMT − 4 min × longitude + 5h30m. For births between midnight and sunrise the astrologer writes the previous civil date; write both ("3 a.m. on 31-12-65/1-1-66, Friday/Saturday"). Example: 3 a.m. IST, 1-1-1966, 30°N 80°E, sunrise 7-06 a.m. IST → 49 ghatis 45 vighatis after sunrise of Friday 31-12-1965. · (B1 p. 122–125) · CLEAR · COMPUTABLE (small: convert a ghati time from an old chart using the app's own sunrise) · Sunrise/sunset tables themselves NOT-RELEVANT. Transcript doubts: "Oct 1, 35°: 6 54 [?]" (should be 5 54) and "Aug 1, 35°: 6 04 [?]" (should be 7 04).
- **KP1-018** · **Required birth data.** Place (latitude/longitude), time and date; sex and name preferred. For a village, measure from the nearest town (1° ≈ 71 miles). "Without knowing the place of birth, never start working." The Moon's star needs no place, only the time and date. · (B1 p. 52, 88, 122) · CLEAR · EXISTS.

## 3. Houses and cusps

- **KP1-020** · **House = cusp to next cusp.** The cusp is the exact beginning of a house (and the end of the previous one). The ascendant is the beginning of house 1. Signs are always 30° from Aries 0°; houses are unequal and together make 360°. · (B1 p. 66, 103–104, 131) · CLEAR · EXISTS.
- **KP1-021** · **Placidus (semi-arc) via Raphael's Tables of Houses.** House systems listed: Ptolemy's equal, Porphyry, Morinus, an "Australian, Zariel" equal division of the equator from the meridian, Alcabitius, Campanus, Placidus "Semi Arc System" ("the method in common use"), and Regiomontanus. KP uses Raphael's Tables of Houses for Northern Latitudes (covering roughly 2°–60°N), which are Placidus. "Krishnamurti's Universal Table of Houses are not published" (p. 151). · (B1 p. 64–66, 151) · CLEAR · EXISTS · The book never gives the semi-arc formula. **Checked:** printed sayana ascendants against Swiss Placidus:
  - Allahabad −1.4′, Ahmedabad +3.2′, Tiruvarur +0.5′, Belgaum +2.2′, Agra −0.6′ (Agra latitude assumed 27°10′; not printed).
  - Guna −6′ (book used the 24°27′ "Amoy" page for 24°40′N), San Francisco +8′ (37°58′ page for 37°48′), Boston −16′ (book used the "42°42′" page; Boston is 42°21′N).
  - MC within 1′ in all cases.
- **KP1-022** · **Interpolating the table of houses.** Interpolate linearly between the two table rows that bracket the birth ST (the ascendant by its own difference, the other cusps by their 1° steps). Cusps 4–9 = cusps 10, 11, 12, 1, 2, 3 + 180°. · (B1 p. 66–74, 126–127, 151–152, 162–163) · CLEAR · EXISTS · **Tolerance warning for tests.** Raphael lists cusps 11, 12, 2 and 3 in whole degrees, so the book's intermediate cusps differ from exact Placidus by up to ~30′. Examples: Guna 3rd cusp Can 5°20′ vs 5°50′; Belgaum 3rd Vir 4°27′ vs 4°05′, 12th Gem 11°27′ vs 11°00′; Tiruvarur 2nd Sco 26°43′ vs 26°25′. Their **sub lords** can therefore differ from the app's. The ascendant and MC are reliable to a few minutes.
- **KP1-023** · **Sayana → nirayana.** Nirayana = sayana − ayanamsa. If the sayana degree is smaller than the ayanamsa, add 30° and step back one sign. · (B1 p. 81, 127, 153) · VERIFIED-ON-FIGURE (Fig. B1.5) · EXISTS.
- **KP1-024** · **Rising times.** Aries rises in ≈112 min and Gemini in 129 min at the equator; at 34°N, 80 min and 118 min. The ascendant moves ~1° per 4 min on average. · (B1 p. 63–64, 115) · CLEAR · EXISTS (implicit) · Info only.

## 4. Planet positions and nodes

- **KP1-030** · **Interpolating a daily ephemeris.** Interpolate linearly between two daily values (Raphael: 12h GMT = 5-30 p.m. IST; KP Ephemeris: 5-30 p.m. IST). Add the proportional motion for direct planets, subtract it for retrograde ones; always add for Sun and Moon, always subtract for Rahu/Ketu. · (B1 p. 74–76, 117, 128, 154, 165) · VERIFIED-ON-FIGURE (Fig. B1.19) · EXISTS (Swiss) · p. 128 says "12 noon Greenwich time which means 5-30 **a.m.** IST": a misprint for p.m. (the interval used, 21h04m, proves p.m.).
- **KP1-031** · **Rahu is the MEAN node.** Rahu = Raphael's "Moon's Node" column; Ketu = Rahu + 180°. Raphael's ephemeris tabulates the mean node. · (B1 p. 55, 75, 108) · VERIFIED-ON-FIGURE (Figs. B1.5, 1.6, 1.7, 1.8, 1.10, 1.19, 1.24, 1.25, 1.27) · COMPUTABLE (the app supports `profile.node` true/mean; KP page currently follows the PL profile's **true** node) · **Checked, Swiss mean node vs printed:**
  - wife 1938 Sco 7°48′ vs 7°47′ (true 6°48′);
  - husband 1933 Aqu 14°08′ vs 14°09′ (true 14°50′);
  - 1931 Pis 7°46′ vs 7°47′;
  - Salem 1948 Ari 12°13′ vs 12°14′;
  - Agra 1963 Can 23°34′ (sayana) vs 23°34′ (true 22°05′);
  - Tiruvarur 1934 Aqu 12°56′ vs 12°55′ (true 11°10′);
  - Guna 1935 Cap 18°46′ vs 18°46′ (true 20°20′);
  - Belgaum 1930 Tau 0°24′ vs 0°24′ (true 1°57′);
  - 1944 war-time chart Can 11°43′ vs 11°44′.

  Every B1 chart uses the mean node. Iyer (NTP) also says "always mean Rahu"; the app already uses the mean node on the NTP page.
- **KP1-032** · **Retrogradation.** A planet whose longitude is decreasing is retrograde. Sun and Moon never are; Rahu and Ketu always are. Durations: Mercury ≈24 days (stationary ~1 day either side), Venus 42 days (~2 days), Jupiter ≈120 days (~5 days). Ephemerides mark R and D. · (B1 p. 142–143) · CLEAR · EXISTS (stations in the transit engine).
- **KP1-033** · **Daily motions (to decide which planet applies).** Moon 12–15°/day. Mercury 66′–100′ (mean printed as 59′08″, which is really the Sun's mean). Venus 62′–82′. Sun 57′10″–61′10″ (mean 59′08″). Mars 31′–44′ (mean 33′29″). Jupiter 5′–15′ (mean "5′"). Saturn mean 2′. Uranus 42″. Neptune 24″. Elongation limits: Mercury 28°, Venus 48°, so Mercury–Venus ≤ 76°. Use the actual daily motions of the day, because Sun, Mercury and Venus overtake each other. · (B1 p. 140–141) · CLEAR · COMPUTABLE (use Swiss speeds) · Typical figures; the app should use real speeds.
- **KP1-034** · **Uranus, Neptune (Pluto) are shown but not used.** They are listed (Fig. B1.4) and inserted in the charts. They are excluded from Vimshottari, from star-lordship, and from the significator tables (B1-14). · (B1 p. 63, 132, 157–158) · VERIFIED-ON-FIGURE (Fig. B1.4) · EXISTS (implicitly: the app's KP significators use the 9 grahas).

## 5. Nakshatras, subs and Vimshottari

- **KP1-040** · **Star lords and spans.** 27 stars of 13°20′, lords in the order Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury; years 7, 20, 6, 10, 7, 18, 16, 19, 17 (total 120). · (B1 p. 104–105, Fig. B1.15) · VERIFIED-ON-FIGURE · EXISTS.
- **KP1-041** · **Subs.** Each star is divided in Vimshottari proportion, beginning with the star lord. Rohini example: Moon 10°00′00″–11°06′40″, Mars –11°53′20″, Rahu –13°53′20″, Jupiter –15°40′00″, Saturn –17°46′40″, Mercury –19°40′00″, Ketu –20°26′40″, Venus –22°40′00″, Sun –23°20′00″ Taurus. · (B1 p. 13, 17, 110) · CLEAR · EXISTS (249-sub table).
- **KP1-042** · **Dasa balance.** Balance = (arc still to run in the Moon's star, in minutes) / 800′ × dasa years. Book examples:
  - Moon 3°20′ Aries: Ketu 5y3m.
  - Moon 26° Gemini: Jupiter 8.8 y.
  - Moon 8° Capricorn: Sun 0y10m24d.
  - Moon 12° Libra: Rahu 10y9m18d.
  - Moon 16° Taurus: Moon 5y6m.

  A per-degree/per-minute ready reckoner is printed: Ketu/Mars 6m9d per degree (3.15 d per minute), Venus 1y6m (9 d), Sun 5m12d (2.70 d), Moon 9m (4.50 d), Rahu 1y4m6d (8.10 d), Jupiter 1y2m12d (7.20 d), Saturn 1y5m3d (8.55 d), Mercury 1y3m9d (7.65 d). · (B1 p. 106–109, 120, 130, 156, 166) · CLEAR · EXISTS.
- **KP1-043** · **The sub the Moon occupies at birth = the bhukti running at birth.** "Moon was transiting in the sub of Saturn, in Rohini… Hence, at the time of birth, Moon dasa, Saturn Bhukti was running." Do not spread the balance over all nine bhuktis. The running bhukti's balance is in proportion to the arc left in that sub (16 of 19 months in the example). · (B1 p. 110–111) · CLEAR · EXISTS (a consequence of Vimshottari).
- **KP1-044** · **Bhukti/antara/sookshma arithmetic.** Bhukti of B in A's dasa = A years × B years / 10 months (or × 3 days). Antara = bhukti × C years / 120, and so on down to sookshma and prana. Each sub-sequence starts with its own lord. Bhukti table: Fig. B1.16. · (B1 p. 111–114) · VERIFIED-ON-FIGURE (Fig. B1.16; last column partly cut off in the scan) · EXISTS.
- **KP1-045** · **Dasa year = Soura year (365¼ days); 360 only for convenience.**
  - Five "manams": Soura (Sun's return, ≈365¼ d), Chandra (≈354 d), Savana (360 sunrises), Nakshatra (≈324 d), Barhaspatya (Jupiter's sign transit, ≈361 d).
  - "For calculating the Udu Dasa system, one has to follow only Soura Manam", citing Mantreswara (Phaladeepika).
  - "For convenience and for easy calculation of sub sub periods 360 days are taken… But 365¼ days must be taken."

  · (B1 p. 118–119) · CLEAR · EXISTS (year-length option) · **Checked:** the four antaras of ch. 11 reproduce with 365.2425-day years only (KP1-007), so 365.25 is the right default for KP pages. Nakshatra-mana "324" is a transcription doubt ("[?324]"; the true value is ≈327.8 d, the "327.85" option in PL).
- **KP1-046** · **Printed fractions use 12 × 30-day months.** 10.8 y = 10y 9m 18d; 0.9 y = 10m 24d; 12.6 months = 1y 0m 18d. · (B1 p. 107–108, 113) · CLEAR · EXISTS · Expect ±1-day rounding differences from the app's calendar arithmetic when comparing printed balances.
- **KP1-047** · **Only Vimshottari.** Vimshottari, Ashtottari and Kalachakra dasas are named. Vimshottari is "very simple, most accurate and scientific", the "only dasa in Kaliyuga". · (B1 p. 13, 104) · CLEAR · EXISTS.

## 6. Fortuna

- **KP1-050** · **Fortuna = Ascendant + Moon − Sun** (mod 360°). The same formula is used day and night (the examples include day and night births). It can be computed on sayana longitudes and the ayanamsa deducted once (p. 120), or on nirayana longitudes directly (p. 129, 155, 166); the results are identical. · (B1 p. 120–121, 129, 155, 166) · VERIFIED-ON-FIGURE (Figs. B1.6, B1.17, B1.24, B1.27) · **COMPUTABLE (new to the app)** · Checks:
  - Wife 1938 (night): Vir 13°27′ + Tau 14°27′ − Aqu 24°27′ = Sag 3°27′ ✓ (Fig. B1.6).
  - Agra: 228°48′ + 311°23′ − 53°50′ = 126°21′ sayana → Can 13°06′ nirayana ✓. The Sun here is taken as Tau 23°50′, not the 23°58′ of p. 76; the book is inconsistent.
  - Guna: 19°23′ + 323°17′ − 146°04′43″ = Lib 16°35′57″ ✓. Fig. B1.24 prints 16°35′37″.
  - Belgaum: 78°14′ + 234°40′ − 56°39′ = Sag 16°15′ ✓.
  - **Error, Tiruvarur (p. 129):** the Moon is taken as 103°04′ instead of 73°04′ (Gemini 13°04′), giving "Scorpio 18°01′". The correct value is **Libra 18°01′**. Fig. B1.20 also prints the Asc as 8°47′ (text 3°47′; the navamsa in Scorpio confirms 3°47′).
  - Cross-ref: B3 charts print Fortuna (e.g. Fig. B3.57). B3-69 uses Fortuna as a progression target.
- **KP1-051** · **Fortuna is a sensitive point for aspects.** Tabulate the aspects of planets to the 12 cusps "and mainly to Fortuna". · (B1 p. 145) · CLEAR · COMPUTABLE.

## 7. Chart forms and navamsa

- **KP1-055** · **Chart layouts.**
  - Map A, South Indian: fixed signs, Aries second from the left in the top row, clockwise.
  - Map B, Bengal/Andhra/Orissa: Aries fixed top-middle, signs counter-clockwise, cusps not marked.
  - Map C, North Indian: lagna sign in the top square, counter-clockwise.
  - The Western wheel: ascendant horizontal left, MC up; houses 12–7 above the horizon.
  - KP students erect nirayana charts in Map A with the cusps written in. · (B1 p. 96–104, Figs. B1.11–14) · VERIFIED-ON-FIGURE · EXISTS (chart drawing) · Map B (Bengal) may not exist in the app; low priority.
- **KP1-056** · **Navamsa and vargottama.** Table of the 108 navamsas (3°20′ each, fire signs from Aries, earth from Capricorn, air from Libra, water from Cancer). Vargottama = the same sign in rasi and navamsa. · (B1 p. 98–102) · CLEAR · EXISTS.

## 8. Aspects (Western, as Krishnamurti adopts them)

- **KP1-060** · **Hindu sign-to-sign aspects are quoted and set aside.**
  - What is quoted: all planets aspect the 7th sign (150°–180° apart in reality). A quarter glance on the 3rd/10th, with Saturn full there. Jupiter full on the 5th/9th. Mars full on the 4th/8th, others ¾. Others view the 5th. No aspect on the 2nd, 11th and 6th (Uttara Kalamrita II.17). Conjunction only within 12° (Uttara Kalamrita IV.32). Mantreswara: only the 7th is fully effective.
  - KSK's verdict: in the Hindu theory "the correct method of ascertaining the aspects is not included… The Western system of aspects must be studied and used."

  · (B1 p. 132–134) · VERIFIED-ON-FIGURE (Fig. B1.22) · REJECTED-TRADITION · The app's Parashari/PL aspects stay as they are for the other pages; the KP page should use KP1-061ff.
- **KP1-061** · **Use the exact angular distance.** An aspect is the longitudinal distance between two points. Mars in Kanya 1° and Ketu in Dhanus 29° are 118° apart, a trine, although the Hindu count calls it a 4th-house relation. Mars ruling an Aries 29° ascendant and placed in Virgo 2° is 123° away, a trine, not "6th from lagna". · (B1 p. 131, 134, 146–147) · CLEAR · COMPUTABLE.
- **KP1-062** · **The aspect set and its quality.**
  - Conjunction: good or bad by the nature and lordship of the two planets. Benefic + benefic = immense good; malefic + malefic = malignant; mixed = both moderated, "like mixing hot and cold water".
  - Parallel of declination: like a conjunction.
  - Opposition 180°: adverse ("tension") if the planets are malefic by nature or lordship.
  - Trine 120°: very powerful for good.
  - Square 90°: evil.
  - Sextile 60°: like the trine.
  - Semi-square 45°: moderately evil. Semi-sextile 30°: slightly good.
  - Quincunx 150°: adverse.
  - Quintile 72°: good. Biquintile 144°: as good as a trine.
  - Sesquiquadrate 135°: like the semi-square.
  - Vigintile 18°: slightly favourable. Quindecile 24°: slightly good. Decile 36°: moderately good. Tredecile 108°: favourable. 54° and 162°: slightly good. 126°: benign like a trine.
  - General rule: all multiples of 22½° are evil (22½, 45, 67½, 90, 112½, 135, 157½, 180). Multiples of 18° and of 30° are good (18, 30, 36, 54, 60, 72, 108, 120, 126, 144, 162), except 90° and 150°.
  - Strength: conjunction and parallel strongest. Next: opposition, trine, quincunx, biquintile, sesquiquadrate, square, sextile, quintile. The rest are moderate.

  · (B1 p. 136–138, 142) · CLEAR · COMPUTABLE · B3-70 (annual chart) uses tighter orbs: 5° Sun/Moon, 2° major planets, 1° for conjunction/opposition/trine.
- **KP1-063** · **Orb table per aspect (applying / exact / separating).**
  - Opposition 172–180–188.
  - Trine 114–120–126.
  - "126 degrees" — / 126 / 126–130.
  - Square 84–90–96.
  - Sextile 54–60–66.
  - Biquintile 141–144–147.
  - Quincunx 148–150–153.
  - Sesquiquadrate 132–135–138.
  - Tredecile 105–108–110.
  - 54° 52–54–56.
  - Semi-square 43–45–47.
  - Decile 34–36–38.
  - Semi-sextile 28–30–32.
  - Vigintile 16–18–20.
  - Must be **exact**: 22½, 67½, 112½, 157½ and 162°.

  · (B1 p. 141–142) · CLEAR · COMPUTABLE · UNCLEAR gaps: no row for the conjunction (see KP1-064), the quintile (72°) or the quindecile (24°). The orbs are asymmetric (quincunx 2/3, tredecile 3/2). The 162° aspect is "slightly good" in the list but "should be exact" here.
- **KP1-064** · **Planet orbs and conjunction.**
  - Orb table (applying / separating): **Sun 12° / 17°, Moon 8° / 12°, other planets 6° / 8°**.
  - A conjunction holds while the distance is less than half the sum of the two planets' orbs. "Rapt" or "partile" = exact; "platic" = wide.
  - For conjunctions of planets with a **cusp**, use 6° uniformly.

  · (B1 p. 138–139) · CLEAR (table) / UNCLEAR (text) · COMPUTABLE · Conflict: the text says the Sun's influence reaches "12 degrees when separating"; the table says 12 applying / 17 separating. Follow the table, but flag it.
- **KP1-065** · **Applying vs separating.** The faster planet behind the slower one is applying, unless the slower one is retrograde. The influence peaks at exactness and fades to the edge of the orb. An applying (forming) aspect is stronger than a separating one and "connotes new experience". The closer the aspect, the stronger. Example: Mars Tau 9°, Jupiter Vir 17°. Mars applies to the trine until Tau 17° and separates until Tau 25°; past that the aspect is dissolved. · (B1 p. 139, 142, 144) · CLEAR · COMPUTABLE.
- **KP1-066** · **Mutual application.** When one of two planets within orb is retrograde so that both move toward the exact aspect, the aspect forms quickly. Mutual application is stronger than ordinary application. Example: Mars Can 8° direct and Jupiter Sco 14° retrograde form a trine. · (B1 p. 142) · CLEAR · COMPUTABLE.
- **KP1-067** · **Speed order for application.** Moon > Mercury > Venus > Sun > Mars > Jupiter > Saturn > Uranus > Neptune. Check the actual daily motions for Mercury, Venus and Sun on the day. · (B1 p. 140–141) · CLEAR · COMPUTABLE (use Swiss speeds).
- **KP1-068** · **Parallel of declination.** Two bodies at the same declination, on the same side of the celestial equator or on opposite sides, are "parallel". It is a position rather than an aspect, but it acts like a conjunction. · (B1 p. 36, 137) · CLEAR · COMPUTABLE (needs equatorial declination from Swiss) · No orb is given (UNCLEAR). Western practice uses about 1°.
- **KP1-069** · **Translation of light.** Two planets without a mutual aspect are linked by a third (faster) planet that aspects both within orb. Example: Mars Tau 5° and Jupiter Sco 17° are out of opposition orb (it ends at Sco 13°). The Moon at Leo 11° squares both and "transmutes the influence of the malefic Mars towards that of the benefic Jupiter". · (B1 p. 144–145) · CLEAR · COMPUTABLE.
- **KP1-070** · **Combustion (KP values).**
  - Within 5° of the Sun: combust/eclipsed. At the exact degree and minute: "utterly powerless".
  - Within 10°: "ordinary" combustion.
  - Beyond 15°: none. Mercury is an exception (not combust).

  · (B1 p. 144) · CLEAR (10°–15° band unspecified) · COMPUTABLE · The app's `combust.ts` uses PL/Parashari degrees; these KP thresholds differ.
- **KP1-071** · **Retrograde planets: both views quoted, no KP verdict here.** Western view (Llewellyn George): retrograde benefics lose power, retrograde malefics are doubly evil, retrograde planets in good aspect disappoint. Hindu view: Varahamihira says retrograde benefics give happy results for long and malefics augment evil. Kalidasa (Uttara Kalamrita) says retrograde = exaltation strength, but retrograde in exaltation = debility strength. Mantreswara says retrograde planets are strong even in debility. · (B1 p. 143) · CLEAR · GUIDANCE (show both, attributed) · Krishnamurti's own retrograde rule is in other Readers (search "retrograde" in B3/B6).
- **KP1-072** · **KSK's rule: the bhukti lord's aspect to the dasa lord.** A planet in favourable aspect to the dasa lord co-operates during its own bhukti and helps the dasa lord give its results. A planet in adverse aspect obstructs during its bhukti, even when the dasa lord promises good. Example: planet A is 40° from dasa lord C and planet B is 60° from C. C–A bhukti is evil; C–B bhukti is good. · (B1 p. 136) · CLEAR · COMPUTABLE (aspect between dasa lord and each bhukti lord) + GUIDANCE · UNCLEAR detail: 40° is not in his aspect list (the semi-square 45° has a 2° orb). Either he counts any non-harmonic distance as adverse, or it is a loose example.
- **KP1-073** · **Aspect tabulation procedure.** Start with the Moon, then take each planet in turn. Note the exact distance to every planet in every sign, to the 12 cusps, and to Fortuna. Then mark the distances that fall within the orbs. · (B1 p. 145) · CLEAR · COMPUTABLE (an aspect grid: planets × planets/cusps/Fortuna).
- **KP1-074** · **Principles of judging an aspect.**
  1. Its strength (a decile is weaker than a trine; a semi-square is less harmful than a square).
  2. Its quality, benefic or evil.
  3. Exact or wide; if wide, forming or dissolving.
  4. The house of the aspected planet and its conjunctions. A connection with lords of 6, 8 or 12, by conjunction or by occupying their nakshatras, "portends evil". **"The nakshatra occupied by a planet is the most important as the results denoted by the nakshatra lord (by its ownership) will mostly predominate."**
  5. Lordship outweighs nature: "Jupiter and Venus… prove to be the worst evils for a number of people… as they occupy the constellation of the planets owning and occupying" bad houses, and vice versa.
  6. The aspect to the planet's own cusp matters more than the sign count of 6/8/12.
  7. Dignity.
  8. Sign quality (movable/fixed/common, element, fruitful/barren), and whether the aspecting planet is angular, succeedent or cadent and whose star it occupies.

  · (B1 p. 131, 146–147) · CLEAR · GUIDANCE.
- **KP1-075** · **Twins.** "The diametrically opposite results enjoyed by the twins can be scientifically explained by the aspect between the cusp and the significator." · (B1 p. 146) · CLEAR · GUIDANCE · Elsewhere the sub explains twins (p. 17), which EXISTS.
- **KP1-076** · **Dignity order (quoted, not rejected).** Exaltation > vargottama > moolatrikona > own sign > friend's sign. Debilitation, an enemy's sign, or any connection with malefics = weak or afflicted. · (B1 p. 147) · CLEAR · GUIDANCE · EXISTS in part (PL strengths).
- **KP1-077** · **Kendra / panaphara / apoklima.** Houses 1, 4, 7, 10 are angular and give full strength ("accidentally dignified"). Houses 2, 5, 8, 11 are succeedent and give moderate strength. Houses 3, 6, 9, 12 are cadent: weak, with little opportunity for expression. · (B1 p. 147) · CLEAR · GUIDANCE.
- **KP1-078** · **"A bhava is destroyed if its lord is 6/8/12 from it": rejected in favour of the exact distance.** The Hindu belief is that a house is ruined if its lord sits 6, 8 or 12 signs from it, or if the lords of the 6th, 8th or 12th from it occupy it. A lord of two houses spoils only the one to which it is 6 or 12. KSK: "It is advisable, therefore, to follow the method of finding out the exact distance. This is the proper and correct method." · (B1 p. 147) · CLEAR · REJECTED-TRADITION.
- **KP1-079** · **Natural benefics and malefics.** Benefics: Jupiter, Venus, unafflicted Mercury, waxing Moon. Malefics: Sun, Mars, Saturn, Uranus, Neptune, Rahu, Ketu. Westerners count the Sun a benefic. "Too much importance should not be attached to the natural tendency… whether the planet is a benefic or malefic by Adhipathya [lordship]" counts more. · (B1 p. 136) · CLEAR · GUIDANCE.
- **KP1-079a** · **Container and content.** The sign and the star are the containers; the planet is the content (milk in a red glass looks red). The aspecting planet decides the change in the result and its source; the aspected planet produces the result. · (B1 p. 131) · CLEAR · GUIDANCE.

## 9. Significators, house groups, timing

- **KP1-080** · **What a planet signifies (A–D levels).** Planet → houses, listed in the order:
  - A: the house occupied by the planet's star lord;
  - B: the house the planet occupies;
  - C: the houses whose cusps fall in signs owned by the star lord;
  - D: the houses whose cusps fall in its own signs.

  · (B1 p. 158, Guna "Planets Signifying Houses") · CLEAR · EXISTS · **Checked:** all nine Guna rows reproduce exactly with the app's A–D convention and Placidus bhavas, e.g. Moon "7, 11, 9, 12, 4", Mars "11, 7, 10, 1, 8". The ch. 11 tables (wife, husband) list the same ingredients in an irregular order, and one item is missing (wife's Mercury lacks its own 6th; Jupiter lacks C). They are less reliable fixtures.
- **KP1-081** · **House significators in four columns.** Per house, printed left to right:
  - (1) planets in the constellation of the occupants;
  - (2) occupants of the bhava;
  - (3) planets in the constellation of the cusp-sign lord;
  - (4) the cusp-sign lord.

  · (B1 p. 158) · VERIFIED (text table; checked against the chart) · EXISTS (the app prints the same four columns, PL style) · B1 does not say in words that the order is the order of strength; the column order implies it. Fixture: the Guna table (b1-E12).
- **KP1-082** · **Node rule (order).** "A node signifies firstly the results of the planet or planets with which it is conjoined, then the results of lord of the constellation in which it is deposited, then the planet or planets aspecting it and lastly of the owner of the sign in which it is deposited." · (B1 p. 158) · CLEAR · COMPUTABLE ("conjoined" and "aspecting" need KP1-061/064 orbs or a sign rule; B1 doesn't say which) · Cross-refs:
  - B3-06 gives a different order for star-transit purposes: conjoined/aspected first, then star lord and sign lord.
  - B3-35, B3-68 and B4-40: a node conjoined with a planet gives that planet's results and weakens it.
  - B3-36 and B3-51: "the nodes are stronger than the planets".
  - B3-22: a node in a sign becomes the "agent" of the sign lord.
  - In the ch. 11 tables the nodes get their star lord's occupation and ownership plus their sign lord's houses (wife's Rahu in Scorpio: 6 [Saturn's], 2 [own], 3, 8, 7 [Mars's]).
- **KP1-083** · **A node acts for its star lord (example).** Ketu cannot give marriage in the wife's chart: "Ketu has to offer the results of Sun in 6", its star lord, and also the 9th and 2nd. The day of marriage would have been Friday and the husband's star one of Ketu's. "Nothing agrees." · (B1 p. 85) · CLEAR · GUIDANCE.
- **KP1-084** · **Marriage = houses 2, 7, 11.** Collect the significators of 2, 7 and 11. The dasa, bhukti, antara and sookshma lords at the wedding are all among them. · (B1 p. 84–85, 87) · VERIFIED-ON-FIGURE (Figs. B1.6/7 + tables) · GUIDANCE (house group) + COMPUTABLE (check DBA lords ∈ significators) · Consistent with B4's marriage chapters.
- **KP1-085** · **Childbirth = houses 2 and 5 for a lady; "11th is important for gents".** The wife's daughter came in Rahu–Ketu–Jupiter, "these three planets are the significators of the houses 2 and 5". Mercury, in Jupiter's star in the 5th and in Mercury's sub, gave the birth on a Wednesday with the Moon in a Mercury sign and Mars star. · (B1 p. 86) · CLEAR · GUIDANCE · B4 states the full KP rule (2-5-11). B1's sentence is a compressed variant, so record it as "2, 5 (+11)".
- **KP1-086** · **Service/job = houses 2, 6, 10, 11.**
  - Pick the strongest significator: the one that signifies all four houses strongly and is the only strong significator of the 10th (Venus).
  - The event comes in its dasa–bhukti–antara (Venus–Venus–Venus, 21-11-1964 to 9-6-1965).
  - The sookshma lord is the strongest ruling planet that also receives a beneficial natal aspect from the dasa lord (Jupiter).
  - Job on 12-3-1965.

  · (B1 p. 160) · CLEAR · GUIDANCE + COMPUTABLE (DBA search) · Uses RPs and aspects together.
- **KP1-087** · **Event-day confirmation by transit.** On the event day the following are connected with the significators: the weekday lord, the Moon's star and sign, the lagna at the moment, and the transit sign/star/sub of Sun, Moon, Jupiter, Saturn and the dasa lords. Examples:
  - Wedding 19-11-1961: Sunday, Moon in Revati (Mercury) in Pisces (Jupiter), lagna Scorpio in Jyeshta (Mercury). Rahu in Ashlesha (Mercury), Mercury in Swati (Rahu), Jupiter in a Sun star and Venus sub, Saturn in a Sun star and Jupiter sub.
  - Job 12-3-1965: Friday, Moon in Punarvasu (Jupiter), Sun in a Jupiter star and Venus sub, Venus in a Jupiter star and Jupiter sub.

  · (B1 p. 85, 87, 160) · CLEAR · COMPUTABLE (the transit engine plus star/sub lords) · On p. 160 the transcript reads "Sun was in Poorvashada belonging to Jupiter". Poorvashada is Venus's star; on 12-3-1965 the Sun was in Aquarius, i.e. **Poorvabhadra** (Jupiter). Transcription error.
- **KP1-088** · **Traditional "dangers" rejected.** In the husband's chart Jupiter is 3rd to him and Saturn (lord of 6) is conjoined with Mars (lord of 8), "considered to be dangerous by Hindus and Westerners", yet the marriage happened on time. "K.P. proves that the traditional system is incorrect." · (B1 p. 87) · CLEAR · REJECTED-TRADITION.
- **KP1-089** · **Sade-sati and Gochara generalisations rejected.** Not all Taurus-Moon natives fail exams during sade-sati. Benefic Gochara "useless"; "only hereafter you enter into a better… period". · (B1 p. 94, 92) · CLEAR · REJECTED-TRADITION.

## 10. Ruling planets (RPs) and rectification

- **KP1-090** · **Ruling planets of a moment.** The RPs are:
  - the lord of the weekday;
  - the lord of the sign the Moon occupies;
  - the lord of the Moon's star;
  - the lord of the rising sign (lagna);
  - the lord of the lagna's star (p. 167–168);
  - the lagna's sub lord, used when fixing finer levels (p. 89, 91).

  · (B1 p. 10, 85, 89, 91, 93–95, 159, 167–169) · VERIFIED (re-computed, see b1-E19…E24) · **COMPUTABLE** (the app has all the ingredients: weekday, Moon and lagna sign/star/sub for "now" or any moment) · Order of listing: p. 159 gives day, Moon sign, Moon star, lagna sign. p. 167 gives day, Moon rasi, Moon star, lagna sign, lagna star. The weekday is the civil weekday at the moment (all checked moments are daytime or evening).
- **KP1-091** · **A node stands in for its sign lord.** On 17-2-1969: "Rahu represents Jupiter", because Rahu was in Pisces (checked: mean Rahu Pis 8°47′). · (B1 p. 91–92) · CLEAR · HORARY (the RP list) · Cross: B3-22 "agent".
- **KP1-092** · **A repeated RP is stronger.** "Jupiter is repeated as the Moon sign lord and also as lagna lord. The Jupiter is doubly stronger to rule the lagna sub." The RP left over (Mars) takes the sub-sub. · (B1 p. 159) · CLEAR · HORARY.
- **KP1-093** · **Birth star by RPs.** The question was "Uttarabhadra or Revati?" for a birth on 27-7-1929 at 5-36 p.m. At judgment (Saturday, Moon in Pushya in Cancer, lagna Pisces 5° in a Saturn star and Saturn sub, Bombay 9-45 a.m.) the RPs were Saturn, Moon and Jupiter. So the Moon is in Jupiter's sign, Saturn's star, Jupiter's sub and Moon's sub-sub. The dasa balance must therefore lie between 6m10d and 8m26d. "If Revathi is to be your star, then Mercury should be one of the ruling planets." · (B1 p. 88–89) · CLEAR · HORARY · Checked: Swiss + KP-New Moon = Pis 16°15′ ✓. The bounds 6m10d/8m26d are exactly the Moon sub-sub of the Jupiter sub of Uttarabhadra ✓. Printed balance 0y6m19d vs 7m4d computed from 16°15′ (corresponds to 16°16.7′): a small inconsistency in the book.
- **KP1-094** · **Planet position by RPs.** "Is my Jupiter exalted?" (birth 26-12-1931). RPs at 3-58 p.m., 17-2-1969, Bombay: Mercury (lagna at the end of Gemini), Rahu (Moon in Satabhisha), Saturn (Moon in Aquarius), Moon (Monday). The Sun is not an RP, so Jupiter is not in Leo. It is in Cancer: Moon sign, Mercury star, Saturn sub, Rahu sub-sub, between 29°24′ and 29°43′. · (B1 p. 91) · VERIFIED-ON-FIGURE (Figs. B1.8–9) · HORARY · Checked: lagna Gem 29°39′, Moon Aqu 15°12′ Satabhisha, Monday ✓. Natal Jupiter (KP-New) Can 29°22′, 2′ below the printed window.
- **KP1-095** · **Transit fact by RPs.** Has Saturn entered Aries? The same RPs apply. Rahu represents Jupiter, so Saturn is still in Jupiter's sign Pisces, in Revati (Mercury) and Saturn's sub. "If Saturn's position is in Aries, Mars will be a ruling planet." · (B1 p. 92) · CLEAR · HORARY · Checked: Saturn Pis 28°16′, Revati, Saturn sub ✓ (exactly as stated).
- **KP1-096** · **Lagna rectification by RPs.**
  1. The lagna sign lord must be an RP.
  2. Then the lagna star lord must be an RP.
  3. Then the sub lord must be an RP; prefer the repeated, stronger RP.
  4. Then the sub-sub lord (the remaining RP).
  5. The resulting degree fixes the birth time.

  Examples:
  - 7-3-1944: Sag 21°36′ = Jupiter sign, Venus star, Jupiter sub, Mars sub-sub → 2-40 a.m.
  - A Salem birth confirmed: Sun sign, Venus star, Venus sub, Sun sub-sub.
  - Palghat: Libra lagna rejected (Venus is not an RP); Virgo, in a Mars star.

  · (B1 p. 93–94, 159, 168) · VERIFIED-ON-FIGURE (Figs. B1.10, B1.25, B1.28/29) · HORARY + COMPUTABLE (search the birth-time window for lagna positions whose sign/star/sub lords all belong to the RP set) · Checked: Sag 21°36′ → Ju-Ve-Ju-Ma ✓; Leo 13°44′ → Su-Ve-Ve-Su ✓.
- **KP1-097** · **Timing a meeting by the rising star/sub.** Meet a person when the lagna is in the star/sub of their birth-star lords. Example: the officer's star was Jyeshta, so KSK waited until the lagna was in a Mercury star and Mars sub, at 4-20 p.m., 11-3-1969, Bombay. That the 3 p.m. lagna was in Pushya (Saturn) and the officer did not come then shows his star is Jyeshta, not Anuradha. · (B1 p. 94–95) · CLEAR · HORARY · Checked: 15:00 Bombay lagna Can 6°00′ Pushya ✓; 16:20 lagna Can 23°59′ Ashlesha (Mercury) Mars sub ✓; Moon in Jyeshta ✓.
- **KP1-098** · **War time vs civil time by RPs.**
  - 1944 case: the RPs (Mars, Jupiter, Venus, Jupiter) exclude a Capricorn lagna (Saturn), so the reported 3-45 a.m. was war time; true birth 2-40 a.m. (p. 159).
  - Tenkasi 15-5-1943, 2-45 p.m.: as war time (= 1-45 p.m. IST) the Asc is Leo 20°3′ in Pooram; as IST it is Virgo 5°3′ in Uttiram. The RPs at judgment were Mercury, Sun, Sun, Mercury, Sun. "Surya is the most powerful… Its sign should be the Ascendant", so the time was war time (p. 169).

  · (B1 p. 159, 169) · VERIFIED-ON-FIGURE (Fig. B1.25) · HORARY · Checked Tenkasi: KP-New Asc Leo 20°00′ at 13:45 IST and Vir 5°17′ at 14:45 IST; Moon Vir 3°36′–4°08′ in Uttiram ✓.
- **KP1-099** · **Cancer or Leo lagna by RPs.** At 12 noon, Sunday 23-3-1969, Madras, the RPs were Sun (day), Venus (lagna Taurus 7°07′ in a Sun star, Ketu sub; Moon in Krittika, Venus sub) and Ketu. Birth 7-10 p.m., 29-1-1928, Madras: Cancer would need Moon/Mercury/Saturn/Jupiter, so the lagna is Leo. · (B1 p. 95) · CLEAR · HORARY · Checked: natal Asc Leo 0°58′ in Magha (Ketu) ✓, near the Cancer border (hence the doubt). The judgment lagna "Taurus 7°07′" corresponds to ≈10-50 a.m. Madras, not 12-00 (at 12-00 the lagna is Gem 10°25′), so the printed time or lagna is approximate. The Moon (Tau 8°51′, Krittika, Venus sub) ✓.

## 11. General / tradition

- **KP1-100** · **Use an observed (Drik) ephemeris; Vakya is wrong.** Raphael's or the Krishnamurti Ephemeris. The Vakya almanac's Moon can be off by up to 17 ghatis (6h48m) in tithi and nakshatra; Mars and Mercury differ greatly. Fig. B1.8 compares Drik and Vakya for 26-12-1931: the Vakya chart puts Jupiter in Leo and Saturn in Sagittarius. · (B1 p. 6–9, 90) · VERIFIED-ON-FIGURE (Fig. B1.8) · EXISTS (Swiss) / REJECTED-TRADITION (Vakya).
- **KP1-101** · **Ayanamsa table of other authorities (rejected).** See KP1-002: widely varying ayanamsas "will be useless if you want to follow K.P." · (B1 p. 4, 78–79) · CLEAR · REJECTED-TRADITION.
- **KP1-102** · **Writing ambiguous dates.** For births between midnight and sunrise write both civil dates and both weekdays. · (B1 p. 125) · CLEAR · GUIDANCE (UI hint when a birth time is 00:00–sunrise).
- **KP1-103** · **The sub divides a constellation in nine parts, first in history** (attributed to KSK; "only Dasa in Kaliyuga", Vimshottari). · (B1 p. 13, 17) · CLEAR · EXISTS.

---

## Open questions raised by B1

1. **Which KP ayanamsa?** The B1 text (291 A.D., 50.2388475″) = PL "Krishnamurti". The B1 table and every worked chart = PL "Krishnamurti New" ≈ Swiss `SIDM_KRISHNAMURTI`. Recommendation from B1: KP-New. Final decision is the owner's (decisions log "Test 2").
2. **Mean or true node on the KP page?** All B1 charts use the mean node (KP1-031).
3. **Aspect orbs:** the Sun's separating orb (12° in the text vs 17° in the table), and the missing rows for conjunction/quintile/quindecile (KP1-063/064). The orb of a parallel is not given.
4. **Node "aspecting it"** (KP1-082): degree aspects with B1 orbs, or the Hindu 7th? B1 leaves this open.
5. **Combustion 10°–15°** is unspecified (KP1-070).

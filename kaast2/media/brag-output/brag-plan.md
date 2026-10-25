# Astro-Amriit launch video — plan

**What it is:** an offline, single-file Vedic astrology app that calculates the way
Parashara's Light 9 does, drawn in the family's East Indian style.
**For:** astrologers who use PL and Kala Chakra. **Sets it apart:** PL-level numbers
checked to the second, one HTML file with no install and no internet, and research
tabs (Iyer's NTP, Krishnamurti's six KP Readers) with the book and page for every rule.
**Hook:** "Every planet, to the second." over the gold East Indian chart drawing itself.
**Tone:** polished — calm, warm, Indian-English voice (Kokoro hm_psi), tanpura drone.
**Share caption:** see share-copy.txt.

| # | Scene | Voice | Visual |
|---|---|---|---|
| 1 | Hook (0–4.8 s) | "Every planet, to the second. In one file that never goes online." | Chart plate lines draw in; Marcellus headline |
| 2 | Reveal (4.8–9.9 s) | "This is Astro-Amriit, the Karar Ashram astrology software." | Title + subtitle, bell |
| 3 | Cast (9.9–19 s) | "Type a birth chart, and it casts the way Parashara's Light 9 does…" | Real app: typing the example chart, Cast, zoom on the planet table; chip "9 of 9 planets equal to PL 9, to the second" |
| 4 | Depth (19–32.4 s) | "Vargas, dashas, Jaimini, transits and matching. And research tabs…" | Real app tour at 1.5×, tab names light up in step; ends on KP Guidance; chip "Every rule with its book and page" |
| 5 | One file (32.4–37.1 s) | "No installation. No internet. Nothing leaves your computer." | .html file card, three lines appear |
| 6 | Outro (37.1–42.4 s) | "Astro-Amriit. Cast once. Read every page." | Title, tagline, version line, bell |

Claims used are the app's own (user guide §1, §6): 9/9 planets to the displayed second on the
PL 9 example; works offline; one file; KP and NTP rules cited by book and page.

**Rebuild:** `node record_clips.mjs` → `python3 ../lib/frames2video.py work/clipA work/clipA.webm 30 --intra`
(same for clipB) → `python3 ../tts.py narration.json work/voice` → `node render.mjs` →
soundtrack (`../lib/soundtrack.py`) → ffmpeg mux (see README in media/).

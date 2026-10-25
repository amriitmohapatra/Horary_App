# Media: launch video, video guide, illustrated PDF

Everything here is generated from the shipped app (`../dist/Astro-Amriit v0.9.html`) with the
public example chart of the user guide (Amitabh Bachchan, 11 Oct 1942, 16:00, Allahabad). Only
the sources are in git; rendered video, audio and images go to ignored `work/`, `out/` folders.

## Setup (once)

```bash
cd kaast2
npm ci                 # Playwright + the app's fonts (node_modules/@fontsource)
npx playwright install chromium   # on a Mac; the cloud container already has it
bash media/setup.sh    # Python: kokoro-onnx (voice), soundfile, scipy; voice model → media/.models/
```

Also needed: `ffmpeg`, and for the PDF a TeX distribution with `latexmk` (MacTeX or TeX Live).

## The voice

`tts.py` speaks with Kokoro-82M's Indian voice **hm_psi** (Apache-2.0), British-English
pronunciation. Sanskrit and astrology terms are respelled for speech in `RESPELL`
(screen text keeps the proper spelling). To change the narrator, set `"voice"` in the
narration JSON (other Indian voices: `hm_omega` male, `hf_alpha`, `hf_beta` female).

## 1. Launch video (`brag-output/`)

```bash
node media/brag-output/record_clips.mjs                     # real-app clips
python3 media/lib/frames2video.py media/brag-output/work/clipA media/brag-output/work/clipA.webm 30 --intra
python3 media/lib/frames2video.py media/brag-output/work/clipB media/brag-output/work/clipB.webm 30 --intra
python3 media/tts.py media/brag-output/narration.json media/brag-output/work/voice
node media/brag-output/render.mjs                           # frames from compositor.html
# soundtrack (spec from work/timing.json) and mux: see brag-plan.md
```

## 2. Video guide (`guide/`)

```bash
node media/guide/narration.mjs > media/guide/work/narration.json
python3 media/tts.py media/guide/work/narration.json media/guide/work/voice
node media/guide/cards.mjs                                  # chapter title cards
node media/guide/record.mjs [c00 c07 …]                     # all chapters, or some
python3 media/guide/assemble.py                             # → guide/out/astro-amriit-guide.mp4 + .srt
```

`guide/chapters.mjs` holds each chapter's narration and on-screen actions side by side; the
recording waits for each narration segment, so voice and picture stay in step.
`lib/director.mjs` draws the cursor, the click ripple, the spotlight and the zoom "camera"
(it measures where the target lands, so zooms are always centred).

## 3. Illustrated PDF (`pdf/`)

```bash
node media/pdf/shots.mjs            # screenshots (2.5× pixel density) + figure files with callouts
cd media/pdf && latexmk guide.tex   # → pdf/out/guide.pdf
```

Callout badges are placed from the live element positions, so re-running after an app change
re-aligns them.

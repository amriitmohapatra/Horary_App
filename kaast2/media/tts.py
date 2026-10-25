"""
Narration for the Astro-Amriit videos: text -> WAV with an Indian-accented
English voice (Kokoro-82M, voice hm_psi, via kokoro-onnx; model files fetched by media/setup.sh into
media/.models/).

Usage:  python3 media/tts.py <script.json> <out_dir>
  script.json = {"voice": "hm_psi", "speed": 1.0, "segments": [{"id": "...", "text": "..."}, ...]}
Writes <out_dir>/<id>.wav (24 kHz mono) and <out_dir>/durations.json.

Sanskrit and astrology terms are respelled so the English phonemiser says
them as an Indian speaker would (RESPELL). Text shown on screen keeps the
proper spelling; only the spoken text is changed.
"""
import json
import os
import re
import sys

import soundfile as sf
from kokoro_onnx import Kokoro

MODEL_DIR = os.environ.get("KOKORO_DIR", os.path.join(os.path.dirname(os.path.abspath(__file__)), ".models"))

RESPELL = {
    "Astro-Amriit": "Astro Amrit",  # the app's own name  prepublish-ok
    "Karar Ashram": "Kuh-rar Aashram",
    "Parashara's": "Pa-ra-sha-ra's",
    "Parashara": "Pa-ra-sha-ra",
    "Krishnamurti's": "Krishna-moorthy's",
    "Krishnamurti": "Krishna-moorthy",
    "Vimshottari": "Vim-shot-taree",
    "Navamsha": "Nuh-vaam-sha",
    "Ashtakavarga": "Ashtaka-varga",
    "Ashtakoot": "Ashta-koot",
    "Dash-Koota": "Dush-koota",
    "Shad Bala": "Shud Bala",
    "Bhava Bala": "Bhaava Bala",
    "Bhava": "Bhaava",
    "bhava": "bhaava",
    "Panchanga": "Pun-chaang",
    "ayanamsa": "ayan-amsha",
    "Ayanamsa": "Ayan-amsha",
    "virupas": "vi-roopas",
    "Jaimini": "Jai-mini",
    "Iyer's": "Eye-yer's",
    "Iyer": "Eye-yer",
    "Sade Sati": "Saa-day Saa-tee",
    "Mangala Dosha": "Mungal Doe-sha",
    "Dosha": "Doe-sha",
    "Arudha": "Aa-roodha",
    "Karakamsha": "Kaaraka-amsha",
    "Argala": "Ur-gala",
    "Sripati": "Shree-pathi",
    "Avayogi": "Ava-yogi",
    "nakshatra": "nuk-shuttra",
    "nakshatras": "nuk-shuttras",
    "Nakshatra": "Nuk-shuttra",
    "Kala Chakra": "Kaala Chukra",
    "dasha": "dusha",
    "dashas": "dushas",
    "Dasha": "Dusha",
    "Dashas": "Dushas",
    "bhukti": "bhookti",
    "Bhukti": "Bhookti",
    "anthra": "unthra",
    "Rasi": "Raashi",
    "Rahu": "Raahu",
    "Ketu": "Kaytu",
    "KP": "K P",
    "NTP": "N T P",
    "PL": "P L",
    "D9": "D nine",
    "1–249": "one to two forty-nine",
    "249": "two hundred and forty-nine",
}


def spoken(text: str) -> str:
    out = text
    for k in sorted(RESPELL, key=len, reverse=True):
        out = re.sub(rf"(?<![\w-]){re.escape(k)}(?![\w-])", RESPELL[k], out)
    return out


def main() -> None:
    script = json.load(open(sys.argv[1]))
    out = sys.argv[2]
    os.makedirs(out, exist_ok=True)
    k = Kokoro(os.path.join(MODEL_DIR, "kokoro-v1.0.onnx"), os.path.join(MODEL_DIR, "voices-v1.0.bin"))
    voice = script.get("voice", "hm_psi")
    speed = script.get("speed", 1.0)
    lang = script.get("lang", "en-gb")
    durations = {}
    for seg in script["segments"]:
        audio, sr = k.create(spoken(seg["text"]), voice=voice, speed=seg.get("speed", speed), lang=lang)
        sf.write(os.path.join(out, f"{seg['id']}.wav"), audio, sr)
        durations[seg["id"]] = round(len(audio) / sr, 3)
        print(f"{seg['id']}: {durations[seg['id']]:.2f}s", flush=True)
    json.dump(durations, open(os.path.join(out, "durations.json"), "w"), indent=1)


if __name__ == "__main__":
    main()

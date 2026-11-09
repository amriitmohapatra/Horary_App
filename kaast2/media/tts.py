"""
Narration for the Astro-Amriit videos: text -> WAV (Kokoro-82M via kokoro-onnx; model files
fetched by media/setup.sh into media/.models/). Default voice: af_heart, American English.

Usage:  python3 media/tts.py <script.json> <out_dir>
  script.json = {"voice": "af_heart", "lang": "en-us", "speed": 1.0, "segments": [{"id": "...", "text": "..."}, ...]}
Writes <out_dir>/<id>.wav (24 kHz mono) and <out_dir>/durations.json.

Pronunciation: the English phonemiser guesses Sanskrit names badly, so every Sanskrit or Indian
term in LEXICON is spoken from hand-written phonemes (IPA in the phonemiser's own en-us style);
the rest of the text is phonemised normally. SPOKEN rewrites abbreviations and numbers first.
Text shown on screen keeps the proper spelling; only the spoken form changes.
"""
import json
import os
import re
import sys

import soundfile as sf
from kokoro_onnx import Kokoro

MODEL_DIR = os.environ.get("KOKORO_DIR", os.path.join(os.path.dirname(os.path.abspath(__file__)), ".models"))

# abbreviations and numbers, rewritten as words before phonemising
SPOKEN = {
    "KP": "K P",
    "NTP": "N T P",
    "PL": "P L",
    "D9": "D nine",
    "1–249": "one to two forty-nine",
    "249": "two hundred and forty-nine",
}

# term -> phonemes (stress marks as the phonemiser writes them). Possessives add z automatically.
LEXICON = {
    "Astro-Amriit": "ˈæstɹoʊ ˈʌmɹɪt",  # the app's own name  prepublish-ok
    "Allahabad": "ˈʌlɑːhɑːbˌɑːd",
    "Prayagraj": "pɹˈaɪɑːɡɹˌɑːdʒ",
    "Amitabh": "ʌmɪtˈɑːb",
    "Bachchan": "bˈʌtʃən",
    "Karar": "kəɹˈɑːɹ",
    "Ashram": "ˈɑːʃɹəm",
    "Parashara": "pəɹˈɑːʃəɹə",
    "Parashari": "pəɹˈɑːʃəɹi",
    "Krishnamurti": "kɹˌɪʃnəmˈuːɹti",
    "Iyer": "ˈaɪjəɹ",
    "Seshadri": "ʃˈeɪʃɑːdɹi",
    "Raman": "ɹˈɑːmən",
    "Jaimini": "dʒˈaɪmɪni",
    "Vimshottari": "vˌɪmʃˈoʊtəɹi",
    "Vimshopaka": "vˌɪmʃˈoʊpəkə",
    "Navamsha": "nəvˈɑːmʃə",
    "Dashamsha": "dəʃˈɑːmʃə",
    "dasha": "dˈʌʃɑː",
    "dashas": "dˈʌʃɑːz",
    "dasa": "dˈʌʃɑː",
    "mahadasha": "məhˈɑːdʌʃɑː",
    "maha": "məhˈɑː",
    "antar": "ˈʌntəɹ",
    "anthra": "ˈʌntɹə",
    "bhukti": "bˈʊkti",
    "pratyantar": "pɹətjˈʌntəɹ",
    "sookshma": "sˈuːkʃmə",
    "prana": "pɹˈɑːnə",
    "deha": "dˈeɪhə",
    "ayanamsa": "ˌʌjənˈɑːmʃə",
    "virupas": "vɪɹˈuːpəz",
    "bala": "bˈʌlə",
    "shad": "ʃˈʌd",
    "bhava": "bˈɑːvə",
    "chalit": "tʃˈʌlɪt",
    "rasi": "ɹˈɑːʃi",
    "rashi": "ɹˈɑːʃi",
    "varga": "vˈɑːɹɡə",
    "vargas": "vˈɑːɹɡəz",
    "vargottama": "vˌɑːɹɡˈoʊtəmə",
    "ashtakavarga": "ˌʌʃtəkəvˈɑːɹɡə",
    "Sarvashtakavarga": "sˌɑːɹvˌʌʃtəkəvˈɑːɹɡə",
    "Ashtakoot": "ˈʌʃtəkˌuːt",
    "Dash-Koota": "dˈʌʃkˌuːtə",
    "koota": "kˈuːtə",
    "kootas": "kˈuːtəz",
    "atma": "ˈɑːtmə",
    "karaka": "kˈɑːɹəkə",
    "karakas": "kˈɑːɹəkəz",
    "chara": "tʃˈʌɹə",
    "Karakamsha": "kˌɑːɹəkˈɑːmʃə",
    "Arudha": "ˈɑːɹuːdə",
    "Argala": "ˈʌɹɡələ",
    "Avayogi": "ˈʌvəjˌoʊɡi",
    "yogi": "jˈoʊɡi",
    "yoga": "jˈoʊɡə",
    "yogas": "jˈoʊɡəz",
    "Indu": "ˈɪnduː",
    "lagna": "lˈʌɡnə",
    "lagnas": "lˈʌɡnəz",
    "nakshatra": "nˈʌkʃətɹə",
    "nakshatras": "nˈʌkʃətɹəz",
    "pada": "pˈɑːdə",
    "padas": "pˈɑːdəz",
    "panchanga": "pʌntʃˈɑːŋɡə",
    "tithi": "tˈɪθi",
    "karana": "kˈʌɹənə",
    "sthana": "stˈɑːnə",
    "drik": "dɹˈɪk",
    "drishti": "dɹˈɪʃti",
    "cheshta": "tʃˈeɪʃtə",
    "naisargika": "naɪsˈɑːɹɡɪkə",
    "ishta": "ˈɪʃtə",
    "kashta": "kˈʌʃtə",
    "avasthas": "əvˈʌstɑːz",
    "Sade": "sˈɑːdeɪ",
    "Sati": "sˈɑːti",
    "Mangala": "mˈʌŋɡələ",
    "Dosha": "dˈoʊʃə",
    "Kala": "kˈɑːlə",
    "Chakra": "tʃˈʌkɹə",
    "Nandi": "nˈʌndi",
    "Nadi": "nˈɑːdi",
    "Tajika": "tˈɑːdʒɪkə",
    "Sripati": "ʃɹˈiːpəti",
    "Rahu": "ɹˈɑːhuː",
    "Ketu": "kˈeɪtuː",
    "bindus": "bˈɪnduːz",
    "horary": "hˈɔːɹəɹi",  # English, but the phonemiser says "her-AIR-ee"
}
_KEYS = sorted(LEXICON, key=len, reverse=True)
_TERM = re.compile(r"(?<![\w-])(" + "|".join(re.escape(k) for k in _KEYS) + r")(['’]s)?(?![\w-])", re.IGNORECASE)
_LOWER = {k.lower(): v for k, v in LEXICON.items()}


def spoken(text: str) -> str:
    for k in sorted(SPOKEN, key=len, reverse=True):
        text = re.sub(rf"(?<![\w-]){re.escape(k)}(?![\w-])", SPOKEN[k], text)
    return text


def phonemes(k: Kokoro, text: str, lang: str) -> str:
    """Phonemise `text`, taking LEXICON terms from the lexicon and the rest from the phonemiser."""
    text, out, pos = spoken(text), [], 0
    for m in _TERM.finditer(text):
        plain = text[pos:m.start()]
        if plain.strip():
            out.append(k.tokenizer.phonemize(plain, lang))
        out.append(_LOWER[m.group(1).lower()] + ("z" if m.group(2) else ""))
        pos = m.end()
        # keep punctuation that follows a term (it carries the pause)
        p = re.match(r"\s*[,.;:!?]+", text[pos:])
        if p:
            out[-1] += p.group(0).strip(); pos += p.end()
    if text[pos:].strip():
        out.append(k.tokenizer.phonemize(text[pos:], lang))
    return re.sub(r"\s+", " ", " ".join(out)).strip()


def main() -> None:
    script = json.load(open(sys.argv[1]))
    out = sys.argv[2]
    os.makedirs(out, exist_ok=True)
    k = Kokoro(os.path.join(MODEL_DIR, "kokoro-v1.0.onnx"), os.path.join(MODEL_DIR, "voices-v1.0.bin"))
    voice = script.get("voice", "af_heart")
    speed = script.get("speed", 1.0)
    lang = script.get("lang", "en-us")
    durations = {}
    for seg in script["segments"]:
        ph = phonemes(k, seg["text"], lang)
        audio, sr = k.create(ph, voice=voice, speed=seg.get("speed", speed), lang=lang, is_phonemes=True)
        sf.write(os.path.join(out, f"{seg['id']}.wav"), audio, sr)
        durations[seg["id"]] = round(len(audio) / sr, 3)
        print(f"{seg['id']}: {durations[seg['id']]:.2f}s", flush=True)
    json.dump(durations, open(os.path.join(out, "durations.json"), "w"), indent=1)


if __name__ == "__main__":
    main()

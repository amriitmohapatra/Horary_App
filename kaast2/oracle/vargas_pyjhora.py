#!/usr/bin/env python3
"""KAAST 2 oracle: PyJHora's divisional charts as an independent cross-check.

PyJHora (pip install PyJHora; tested with 4.8.7) implements every varga as
rules on (sign, degrees in sign), with several "chart_method" variants per
varga. This script evaluates EVERY method PyJHora offers for each divisor PL
uses, on the same 500 pseudo-random longitudes, and writes the varga sign of
each (0 = Aries) to kaast2/tests/fixtures/varga_pyjhora.json. The unit test
(tests/unit/varga.test.ts) then states, per KAAST varga, which PyJHora method
it must equal, and for rules PyJHora does not have, that NO method equals it.

Longitudes are integer arcseconds; each is passed to PyJHora at arcsec + 0.5
(the middle of the arcsecond), so no sample sits on an amsa boundary and
PyJHora's floating-point boundary handling cannot cause a spurious mismatch.
Boundaries are tested exactly, in integers, in the TypeScript suite.

Run (from the repo root):
  <venv>/bin/python -I kaast2/oracle/vargas_pyjhora.py
"""
import json
import os
import random
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(ROOT, "kaast2", "tests", "fixtures", "varga_pyjhora.json")

from jhora import const  # noqa: E402
from jhora.horoscope.chart import charts  # noqa: E402

try:
    from importlib.metadata import version
    PYJHORA_VERSION = version("PyJHora")
except Exception:  # pragma: no cover
    PYJHORA_VERSION = "unknown"

# PyJHora function and chart_method docstrings, paraphrased for the fixture (author names
# dropped so the pre-publish personal-name scan stays clean)
METHODS = {
    2: ("hora_chart", {1: "Parasara hora with parivritti & even-sign reversal (Uma Shambhu / PVR)",
                       2: "Traditional Parasara (Leo & Cancer only)", 3: "Raman (1st/11th, day/night)",
                       4: "Parivritti Dwaya (cyclic)", 6: "Somanatha (parivritti alternate)"}),
    # D2 method 5 (Kashinatha) is left out: it depends on the strength of the co-lords in the
    # whole chart (house.house_owner_from_planet_positions), so it is not a function of one longitude.
    3: ("drekkana_chart", {1: "Traditional Parasara (1st/5th/9th)", 2: "Parivritti Traya (cyclic)",
                           3: "Somanatha (parivritti alternate)", 4: "Jagannatha", 5: "Parivritti even reverse"}),
    4: ("chaturthamsa_chart", {1: "Traditional Parasara (1st/4th/7th/10th)", 2: "Parivritti cyclic",
                               3: "Parivritti even reverse", 4: "Somanatha (parivritti alternate)"}),
    5: ("panchamsa_chart", {1: "Traditional Parasara", 2: "Parivritti cyclic", 3: "Parivritti even reverse",
                            4: "Somanatha (parivritti alternate)"}),
    6: ("shashthamsa_chart", {1: "Traditional Parasara (odd from Ar, even from Li)", 2: "Parivritti cyclic",
                              3: "Parivritti even reverse", 4: "Somanatha (parivritti alternate)"}),
    7: ("saptamsa_chart", {1: "Traditional Parasara (even from 7th, forward)", 2: "Parasara, even from 7th backward",
                           3: "Parasara, even reverse ending in 7th", 4: "Parivritti cyclic",
                           5: "Parivritti even reverse", 6: "Somanatha (parivritti alternate)"}),
    8: ("ashtamsa_chart", {1: "Traditional Parasara", 2: "Parivritti cyclic", 3: "Parivritti even reverse",
                           4: "Somanatha (parivritti alternate)"}),
    9: ("navamsa_chart", {1: "Traditional Parasara", 2: "Parasara with even-sign reversal (uniform navamsa)",
                          3: "Kalachakra navamsa", 4: "Nadi navamsa (water and earth signs counted backwards)",
                          5: "Parivritti cyclic", 6: "Somanatha (parivritti alternate)"}),
    10: ("dasamsa_chart", {1: "Traditional Parasara (even from 9th, forward)", 2: "Parasara, even from 9th backward",
                           3: "Parasara, even from reverse 9th backward", 4: "Parivritti cyclic (Ojha)",
                           5: "Parivritti even reverse", 6: "Somanatha (parivritti alternate)"}),
    11: ("rudramsa_chart", {1: "Traditional Parasara (PyJHora; 11 lambda cyclic)", 2: "BV Raman (anti-zodiacal ekadashamsha)",
                            3: "Parivritti cyclic", 4: "Parivritti even reverse", 5: "Somanatha (parivritti alternate)"}),
    12: ("dwadasamsa_chart", {1: "Traditional Parasara", 2: "Parasara with even-sign reversal", 3: "Parivritti cyclic",
                              4: "Parivritti even reverse", 5: "Somanatha (parivritti alternate)"}),
    16: ("shodasamsa_chart", {1: "Traditional Parasara", 2: "Parasara with even-sign reversal",
                              3: "Parivritti cyclic", 4: "Somanatha (parivritti alternate)"}),
    20: ("vimsamsa_chart", {1: "Traditional Parasara", 2: "Parasara with even-sign reversal", 3: "Parivritti cyclic",
                            4: "Somanatha (parivritti alternate)"}),
    24: ("chaturvimsamsa_chart", {1: "Traditional Parasara siddhamsa (odd Le->, even Cn->)",
                                  2: "Parasara with even-sign reversal", 3: "Parasara with even double reversal"}),
    27: ("nakshatramsa_chart", {1: "Traditional Parasara", 2: "Parasara with even-sign reversal",
                                3: "Somanatha (parivritti alternate)"}),
    30: ("trimsamsa_chart", {1: "Traditional Parasara", 2: "Parivritti cyclic", 3: "Shashtyamsa-like trimsamsa",
                             4: "Parivritti even reverse", 5: "Somanatha (parivritti alternate)"}),
    40: ("khavedamsa_chart", {1: "Traditional Parasara (odd Ar, even Li)", 2: "Parivritti cyclic",
                              3: "Parivritti even reverse", 4: "Somanatha (parivritti alternate)"}),
    45: ("akshavedamsa_chart", {1: "Traditional Parasara", 2: "Parivritti cyclic", 3: "Parivritti even reverse",
                                4: "Somanatha (parivritti alternate)"}),
    60: ("shashtyamsa_chart", {1: "Traditional Parasara (from the sign)", 2: "Parasara from Aries (= cyclic)",
                               3: "Parasara even reversal from Aries", 4: "Parasara even reversal from the sign"}),
}


def sample_longitudes():
    rng = random.Random(20261017)
    return sorted(rng.randrange(0, 1_296_000) for _ in range(498)) + [0, 1_295_999]


def run(func, lons, method):
    pp = [[i, (a // 108_000, ((a % 108_000) + 0.5) / 3600.0)] for i, a in enumerate(lons)]
    res = func(pp, chart_method=method) if method is not None else func(pp)
    return [int(r[1][0]) % 12 for r in res]


def main():
    lons = sample_longitudes()
    out = {
        "source": "kaast2/oracle/vargas_pyjhora.py",
        "pyjhora": PYJHORA_VERSION,
        "python": sys.version.split()[0],
        "sampling": "integer arcsec longitudes, evaluated at arcsec + 0.5",
        "longitudes": lons,
        "methods": {},
    }
    for n, (fname, methods) in METHODS.items():
        func = getattr(charts, fname)
        default = const.varga_option_dict.get(n, (None, None))[1]
        for m, label in methods.items():
            key = f"D{n}/{m}"
            out["methods"][key] = {"function": f"{fname}(chart_method={m})", "label": label,
                                   "pyjhoraDefault": m == default, "signs": run(func, lons, m)}
    # D150: PyJHora has no dedicated rule; nadiamsa_chart() falls through to the custom
    # cyclic (parivritti) divisional chart.
    out["methods"]["D150/1"] = {"function": "nadiamsa_chart(chart_method=1)",
                                "label": "falls through to custom_divisional_chart (parivritti cyclic)",
                                "pyjhoraDefault": True, "signs": run(charts.nadiamsa_chart, lons, 1)}
    # Generic cyclic (parivritti) chart for each divisor PL uses cyclically, for the alternates.
    for n in (2, 3, 4, 5, 10, 12, 30, 150):
        out["methods"][f"D{n}/custom-cyclic"] = {
            "function": f"custom_divisional_chart(divisional_chart_factor={n}, base_rasi=None)",
            "label": "Parivritti cyclic (custom chart)", "pyjhoraDefault": False,
            "signs": [int(r[1][0]) % 12 for r in charts.custom_divisional_chart(
                [[i, (a // 108_000, ((a % 108_000) + 0.5) / 3600.0)] for i, a in enumerate(lons)], n)]}
    with open(OUT, "w") as fh:
        json.dump(out, fh, separators=(",", ":"))
        fh.write("\n")
    print(f"wrote {OUT}: {len(out['methods'])} PyJHora methods x {len(lons)} longitudes (PyJHora {PYJHORA_VERSION})")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""KAAST 2: parity fixtures for the TypeScript strength engine (src/engine/strength).

Runs the verified Page-1 oracle (page1_strengths.py, imported, never modified) on the PL9
fixture chart plus synthetic day-birth charts (no real persons) and writes every strength
value at full float precision to kaast2/tests/fixtures/strengths_oracle.json.

The oracle handles day births only (its own note in shadbala()), so each synthetic chart is
checked to be a day birth with the sunrise of the same day before it is written.

Run:  python kaast2/oracle/strengths_fixtures.py [--ephe PATH]
"""
import argparse
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import page1_strengths as o  # noqa: E402

FIXTURE = os.path.join(o.FIXDIR, "pl9_page1_amitabh.json")
OUT = os.path.join(o.FIXDIR, "strengths_oracle.json")

# Synthetic inputs: round dates, city coordinates, chosen to spread the rules
# (waxing/waning Moon, Mercury alone or with a malefic, both cheshta branches, high latitude).
SYNTHETIC = [
    {"name": "synthetic-delhi-1990", "date": "1990-06-21", "time": "10:30:00", "tzHours": 5.5,
     "latDeg": 28.6139, "lonDeg": 77.2090, "place": "New Delhi"},
    {"name": "synthetic-london-2000", "date": "2000-01-01", "time": "12:00:00", "tzHours": 0.0,
     "latDeg": 51.5074, "lonDeg": -0.1278, "place": "London"},
    {"name": "synthetic-newyork-1975", "date": "1975-03-15", "time": "14:20:00", "tzHours": -5.0,
     "latDeg": 40.7128, "lonDeg": -74.0060, "place": "New York"},
    {"name": "synthetic-chennai-2015", "date": "2015-11-08", "time": "08:15:00", "tzHours": 5.5,
     "latDeg": 13.0827, "lonDeg": 80.2707, "place": "Chennai"},
    {"name": "synthetic-mumbai-2020", "date": "2020-05-25", "time": "11:00:00", "tzHours": 5.5,
     "latDeg": 19.0760, "lonDeg": 72.8777, "place": "Mumbai"},
    {"name": "synthetic-sydney-2020", "date": "2020-10-01", "time": "15:00:00", "tzHours": 10.0,
     "latDeg": -33.8688, "lonDeg": 151.2093, "place": "Sydney"},
]

SB_KEYS = ["uchcha", "saptavargaja", "ojayugma", "kendra", "drekkana", "sthana", "dig", "natonnata",
           "paksha", "tribhaga", "abda", "masa", "vara", "hora", "ayana", "kala", "cheshta", "naisargika",
           "drik", "total", "SB%", "SB#"]


def run(inp, ephe):
    ch = o.Chart(inp, ephe)
    sb, meta = o.shadbala(ch)
    day = meta["sunrise"] <= ch.jd < meta["sunset"]
    if not (day and meta["sunrise"] < ch.jd):
        raise SystemExit(f"{inp.get('name')}: not a day birth after the same day's sunrise; the oracle covers day births only")
    bb = o.bhava_bala(ch, sb, day)
    bav, sav = o.ashtakavarga(ch)
    k7 = o.karakas7(ch)
    planets = {}
    for p in o.P9:
        row = {
            "lon": ch.pos[p], "speed": ch.spd[p],
            "dignity": o.dignity(ch, p),
            "vimshopaka": o.vimshopaka(ch, p),
            "vb": round(o.vimshopaka(ch, p)),
            "av3": o.jagradadi(ch, p), "av5": o.baladi(ch, p),
            "func": o.functional(ch, p),
        }
        if p in o.PL:
            row["av"] = bav[p][ch.sign[p]]
            row["k7"] = k7[p]
        elif p == "Ra":
            row["av"] = bav[o.SIGN_LORD[ch.sign[p]]][ch.sign[p]]   # OPEN candidate (spec 3.5)
        planets[p] = row
    return {
        "name": inp.get("name"),
        "input": {k: inp[k] for k in ("date", "time", "tzHours", "latDeg", "lonDeg")} | {"place": inp.get("place", "")},
        "jd": ch.jd, "asc": ch.asc, "mc": ch.mc,
        "meta": {"sunrise": meta["sunrise"], "sunset": meta["sunset"], "X": meta["X"],
                 "lords": list(meta["lords"]), "hora_no": meta["hora_no"], "day": day},
        "planets": planets,
        "shadbala": {p: {k: sb[p][k] for k in SB_KEYS} for p in o.PL},
        "bhava": bb,
        "bav": bav, "sav": sav,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ephe", default=os.environ.get("SE_EPHE_PATH", o.DEFAULT_EPHE))
    a = ap.parse_args()
    fx = json.load(open(FIXTURE))
    pl9 = dict(fx["input"], name="pl9-page1-fixture")
    charts = [run(pl9, a.ephe)] + [run(c, a.ephe) for c in SYNTHETIC]
    doc = {
        "_source": "oracle/strengths_fixtures.py running oracle/page1_strengths.py (pyswisseph "
                   + o.swe.version + "). Regenerate after any oracle change.",
        "_note": "Full float precision. Charts after the first are synthetic (no persons). "
                 "Ke VB and Ra AV are the oracle's current OPEN rules, not PL truth.",
        "charts": charts,
    }
    with open(OUT, "w") as f:
        json.dump(doc, f, indent=1)
        f.write("\n")
    print(f"wrote {OUT}: {len(charts)} charts")


if __name__ == "__main__":
    main()

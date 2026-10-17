#!/usr/bin/env python3
"""KAAST 2 oracle: PyJHora's Jaimini rules as an independent cross-check.

PyJHora (pip install PyJHora; tested with 4.8.7; follows PVR Narasimha Rao)
is run on public and synthetic charts. To compare RULES, not ephemerides,
the fixture records PyJHora's own inputs (its Lahiri longitudes, its sunrise,
its Sun at sunrise, its ishtakala) next to its outputs; the TypeScript test
(tests/engine/jaimini.test.ts) feeds those same inputs into the KAAST pure
functions and lists every disagreement explicitly.

Recorded per chart:
  pp            longitudes 0..360 of As Su Mo Ma Me Ju Ve Sa Ra Ke (Lahiri)
  karakas8      house.chara_karakas (8 karakas incl. Rahu), AK first
  arudha_stronger  arudhas.bhava_arudhas_from_planet_positions (PyJHora default:
                stronger co-lord of Scorpio/Aquarius)
  arudha_single the same with the co-lords forced to Mars/Saturn
  argala        house.get_argala: for each house from the lagna, planets in the
                2nd/4th/5th/11th and 12th/10th/9th/3rd (no node reversal)
  special       sunrise, ishtakala, Sun at sunrise/birth and Bhava, Hora,
                Ghati, Pranapada, Indu, Sree, Varnada (methods 1 and 2)
Synthetic "pp only" sets (no ephemeris) exercise co-lords, ties and the
lord-in-1/4/7/10 cases for the rules that take positions only.

Run (from the repo root):
  <venv>/bin/python -I kaast2/oracle/jaimini_pyjhora.py
"""
import contextlib
import io
import json
import os
import random

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(ROOT, "kaast2", "tests", "fixtures", "jaimini_pyjhora.json")

with contextlib.redirect_stdout(io.StringIO()):  # PyJHora prints sys.path notes on import
    from jhora import const, utils  # noqa: E402
    from jhora.panchanga import drik  # noqa: E402
    from jhora.horoscope.chart import arudhas, charts, house  # noqa: E402

IDS = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"]

# Public charts (published birth data) — no private data in kaast2.
PUBLIC = [
    # PL 9 Page 1 fixture; India war time = UT+6.5, i.e. 15:00 at UT+5.5.
    {"name": "Amitabh Bachchan", "date": [1942, 10, 11], "time": [15, 0, 0], "tz": 5.5, "lat": 25.45, "lon": 81.85},
    # PL7 manual p. 130 export example (Pranapada 35.68828913205 printed by PL7).
    {"name": "Prince Charles", "date": [1948, 11, 14], "time": [21, 15, 0], "tz": 0.0, "lat": 51.516667, "lon": -0.833333},
    {"name": "Mahatma Gandhi", "date": [1869, 10, 2], "time": [7, 11, 0], "tz": 4.642, "lat": 21.6417, "lon": 69.6293},
    {"name": "Jawaharlal Nehru", "date": [1889, 11, 14], "time": [23, 6, 0], "tz": 5.4567, "lat": 25.45, "lon": 81.85},
]


def synthetic(n, seed=7):
    rnd = random.Random(seed)
    out = []
    for i in range(n):
        lon = round(rnd.uniform(-125, 150), 4)
        lat = round(rnd.uniform(-45, 60), 4)
        tz = round(lon / 15)
        y = rnd.randint(1900, 2030)
        out.append({"name": f"synthetic-{i:02d}", "date": [y, rnd.randint(1, 12), rnd.randint(1, 28)],
                    "time": [rnd.randint(0, 23), rnd.randint(0, 59), rnd.randint(0, 59)],
                    "tz": float(tz), "lat": lat, "lon": lon})
    return out


def full(pp_entry):
    s, d = pp_entry[1]
    return s * 30.0 + d


def pids(text):
    return sorted(IDS[int(x)] for x in text.split("/") if x.strip().isdigit() and int(x) < 9)


def arudha_with(pp, scorpio, aquarius):
    const.scorpio_owner_for_dhasa_calculations = scorpio
    const.aquarius_owner_for_dhasa_calculations = aquarius
    try:
        return arudhas.bhava_arudhas_from_planet_positions(pp)
    finally:
        const.scorpio_owner_for_dhasa_calculations = None
        const.aquarius_owner_for_dhasa_calculations = None


def position_rules(pp):
    h_to_p = utils.get_house_planet_list_from_planet_positions(pp[:10])
    arg, vir = house.get_argala(h_to_p)
    return {
        "pp": [round(full(e), 9) for e in pp[:10]],
        "karakas8": [IDS[p] for p in house.chara_karakas(pp[:10])],
        "arudha_stronger": arudhas.bhava_arudhas_from_planet_positions(pp[:10]),
        "arudha_single": arudha_with(pp[:10], const.MARS_ID, const.SATURN_ID),
        # argala[r]: house r+1 from the lagna; places [2, 4, 5, 11] / obstructions [12, 10, 9, 3]
        "argala": [[pids(t) for t in row] for row in arg],
        "virodha": [[pids(t) for t in row] for row in vir],
    }


def chart_record(c):
    place = drik.Place(c["name"], c["lat"], c["lon"], c["tz"])
    dob, tob = tuple(c["date"]), tuple(c["time"])
    jd = utils.julian_day_number(dob, tob)
    pp = charts.rasi_chart(jd, place)
    rec = {"input": c, **position_rules(pp)}
    srise = drik.sunrise(jd, place)
    sun_sr = charts.divisional_chart(srise[2] + place.timezone / 24, place)[1]
    tob_h = tob[0] + tob[1] / 60 + tob[2] / 3600
    ghatis = utils.udhayadhi_nazhikai(jd, place)[1]
    full_sp = lambda v: v[0] * 30.0 + v[1]  # noqa: E731
    rec["special"] = {
        "sunrise_local_hours": srise[0],
        "sun_at_sunrise": full(sun_sr),                     # as PyJHora uses it (srise[2] + tz/24)
        "sun_at_sunrise_unshifted": full(charts.divisional_chart(srise[2], place)[1]),
        "time_diff_minutes": (tob_h - srise[0]) * 60,      # Bhava/Hora/Ghati: same-day sunrise, may be < 0
        "udhayadhi_ghatis": ghatis,                         # Pranapada: previous sunrise if before sunrise
        "bhava": full_sp(drik.bhava_lagna(jd, place)),
        "hora": full_sp(drik.hora_lagna(jd, place)),
        "ghati": full_sp(drik.ghati_lagna(jd, place)),
        "pranapada": full_sp(drik.pranapada_lagna(jd, place)),
        "indu_sign": drik.indu_lagna(jd, place)[0],
        "sree": full_sp(drik.sree_lagna(jd, place)),
        "varnada_m1_sign": charts.varnada_lagna(dob, tob, place, varnada_method=1)[0],
        "varnada_m2_sign": charts.varnada_lagna(dob, tob, place, varnada_method=2)[0],
    }
    return rec


def crafted():
    """Position-only cases (signs, degrees) built to hit the edge rules."""
    sets = {
        # Scorpio lagna, Mars in Scorpio, Ketu elsewhere -> stronger co-lord = Ketu
        "colord-scorpio-mars-in-own": {"L": (7, 10), "Su": (0, 5), "Mo": (3, 12), "Ma": (7, 20), "Me": (1, 3),
                                        "Ju": (8, 8), "Ve": (11, 25), "Sa": (5, 14), "Ra": (4, 2)},
        # Aquarius lagna, Saturn and Rahu both elsewhere, Rahu with more planets
        "colord-aquarius-conj": {"L": (10, 1), "Su": (2, 15), "Mo": (2, 27), "Ma": (6, 9), "Me": (2, 4),
                                  "Ju": (9, 21), "Ve": (1, 18), "Sa": (5, 11), "Ra": (2, 6)},
        # lords in the 1st, 4th, 7th, 10th of various houses
        "lords-kendras": {"L": (0, 15), "Su": (4, 10), "Mo": (9, 20), "Ma": (6, 5), "Me": (8, 12),
                          "Ju": (11, 3), "Ve": (1, 28), "Sa": (3, 16), "Ra": (5, 22)},
        # karaka tie at the arcsecond: Mars and Venus both at 17°17'17"
        "karaka-tie": {"L": (3, 1), "Su": (0, 5), "Mo": (1, 9), "Ma": (2, 17 + 17 / 60 + 17 / 3600),
                       "Me": (11, 2), "Ju": (6, 25), "Ve": (8, 17 + 17 / 60 + 17 / 3600), "Sa": (10, 11), "Ra": (9, 29)},
    }
    out = {}
    for name, s in sets.items():
        pp = [["L", s["L"]]] + [[i, s[p]] for i, p in enumerate(IDS[:8])]
        ra = s["Ra"]
        pp.append([8, ((ra[0] + 6) % 12, ra[1])])
        out[name] = position_rules(pp)
    return out


def main():
    drik.set_ayanamsa_mode("LAHIRI")
    charts_in = PUBLIC + synthetic(30)
    data = {
        "_source": "PyJHora 4.8.7 (Lahiri) via kaast2/oracle/jaimini_pyjhora.py; inputs recorded so rules can be compared on identical longitudes.",
        "_ids": IDS,
        "raasi_drishti": {str(k): v for k, v in house._get_raasi_drishti().items()},
        "charts": [chart_record(c) for c in charts_in],
        "crafted": crafted(),
    }
    with open(OUT, "w") as f:
        json.dump(data, f, indent=1)
    print(f"wrote {OUT}: {len(data['charts'])} charts, {len(data['crafted'])} crafted sets")


if __name__ == "__main__":
    with contextlib.redirect_stdout(io.StringIO()) as buf:
        main()
    print(buf.getvalue().strip().splitlines()[-1])

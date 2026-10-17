#!/usr/bin/env python3
"""KAAST 2 oracle: bhava chalit, Yogi points and panchanga from PyJHora.

PyJHora (https://github.com/naturalstupid/PyJHora, pip "PyJHora") is an
independent open-source implementation of Jagannatha Hora's rules. To compare
RULES rather than ephemerides, this script computes the sidereal longitudes
with the KAAST 2 "pl9" recipe (pyswisseph 2.10.03, mean equinox, PL Lahiri
polynomial, Placidus on geographic latitude, Swiss Delta-T) and INJECTS them
into PyJHora's code paths by monkeypatching its ephemeris accessors:

  bhava    drik.bhaava_madhya_kp / drik.ascendant / drik.dhasavarga
           -> drik.bhaava_madhya_sripathi, drik._bhaava_madhya_new(method 1, 3)
  yogi     charts.divisional_chart (as seen by sphuta)
           -> sphuta.yogi_sphuta / avayogi_sphuta, main.py's lord logic
  limbs    drik.sidereal_longitude (linear in time around the chart moment)
           -> drik.tithi / yogam / karana, drik.nakshatra_pada
  sunrise  PyJHora native (drik.sunrise / drik.vaara; ephemeris-only, no
           ayanamsa), plus pyswisseph swe.rise_trans for KAAST's three
           sunrise conventions.

The panchanga limbs are fed the profile-ROUNDED arcsecond longitudes (as
degrees) so both engines see identical inputs.

Charts: Amitabh Bachchan (public, PL9 Page 1 fixture) plus deterministic
synthetic instants (no personal data).

Run:  <venv>/bin/python -I kaast2/oracle/bhava_yogi_panchanga_pyjhora.py [--ephe PATH] [--n 180]
Writes kaast2/tests/fixtures/bhava_yogi_panchanga_pyjhora.json
"""
import argparse
import json
import math
import os
import sys

import swisseph as swe

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(ROOT, "kaast2", "tests", "fixtures", "bhava_yogi_panchanga_pyjhora.json")
DEFAULT_EPHE = os.path.join(ROOT, "KP_Automation", "src", "kala_chakra", "data", "swefiles")

IDS = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"]
JH_INDEX = {p: i for i, p in enumerate(IDS)}            # PyJHora 0 Sun … 8 Ketu
BODY = {"Su": swe.SUN, "Mo": swe.MOON, "Ma": swe.MARS, "Me": swe.MERCURY,
        "Ju": swe.JUPITER, "Ve": swe.VENUS, "Sa": swe.SATURN, "Ra": swe.TRUE_NODE}

# Public chart + synthetic places (name, lat, lon east+, tz hours).
AMITABH = dict(name="Amitabh Bachchan", y=1942, m=10, d=11, h=16, mi=0, s=0, tz=6.5,
               place="Allahabad, India", lat=25.45, lon=81.85)
PLACES = [
    ("Synthetic Delhi", 28.6139, 77.209, 5.5), ("Synthetic Chennai", 13.0827, 80.2707, 5.5),
    ("Synthetic London", 51.5074, -0.1278, 0.0), ("Synthetic New York", 40.7128, -74.006, -5.0),
    ("Synthetic Sydney", -33.8688, 151.2093, 10.0), ("Synthetic Quito", -0.1807, -78.4678, -5.0),
    ("Synthetic Oslo", 59.9139, 10.7522, 1.0), ("Synthetic Reykjavik", 64.1466, -21.9426, 0.0),
    ("Synthetic Cape Town", -33.9249, 18.4241, 2.0), ("Synthetic Tokyo", 35.6762, 139.6503, 9.0),
]


def pl_lahiri(jd):
    """PL Lahiri polynomial (report eq. 1), degrees; kaast2/src/engine/ephem/ayanamsa.ts."""
    T = (jd - 2451545.0) / 36525.0 + 1.0
    return 22 + 27 / 60 + 37.65 / 3600 + (5026.87434 * T + 1.11113 * T * T) / 3600


def to_arcsec(deg):
    """Profile 'round' (pl9): degrees -> integer arcseconds 0..1295999."""
    return int(math.floor((deg % 360.0) * 3600 + 0.5)) % 1296000


def cast_pl9(c):
    """Sidereal longitudes with the KAAST 2 pl9 recipe (kaast2/src/engine/index.ts)."""
    hours_ut = c["h"] + c["mi"] / 60 + c["s"] / 3600 - c["tz"]
    jd_ut = swe.julday(c["y"], c["m"], c["d"], hours_ut, swe.GREG_CAL)
    jd_tt = jd_ut + swe.deltat(jd_ut)
    ayan = pl_lahiri(jd_ut)
    bodies = {}
    for p in IDS[:-1]:
        x, _ = swe.calc(jd_tt, BODY[p], swe.FLG_SWIEPH | swe.FLG_SPEED | swe.FLG_NONUT)
        bodies[p] = {"deg": (x[0] - ayan) % 360.0, "speed": x[3]}
    bodies["Ke"] = {"deg": (bodies["Ra"]["deg"] + 180) % 360.0, "speed": bodies["Ra"]["speed"]}
    for b in bodies.values():
        b["arcsec"] = to_arcsec(b["deg"])
    swe.set_sid_mode(swe.SIDM_USER, jd_tt, ayan)
    cusps, ascmc = swe.houses_ex(jd_ut, c["lat"], c["lon"], b"P", swe.FLG_SIDEREAL)
    return {"jdUT": jd_ut, "jdTT": jd_tt, "ayanamsa": ayan, "bodies": bodies,
            "ascDeg": ascmc[0] % 360.0, "mcDeg": ascmc[1] % 360.0, "cusps": [x % 360.0 for x in cusps]}


def synthetic_cases(n):
    """Deterministic instants 1900-2100 across PLACES (LCG, seed fixed)."""
    state = 20261017
    def rnd():
        nonlocal state
        state = (1103515245 * state + 12345) % 2 ** 31
        return state / 2 ** 31
    cases = []
    for i in range(n):
        name, lat, lon, tz = PLACES[i % len(PLACES)]
        jd = 2415020.5 + rnd() * 73049.0                     # 1900-01-01 … 2100-01-01
        y, m, d, _ = swe.revjul(jd, swe.GREG_CAL)
        # every 6th case is a pre-dawn birth (02:00-06:30 local) to exercise the vara shift
        hours = 2 + rnd() * 4.5 if i % 6 == 0 else rnd() * 24
        h = int(hours); mi = int((hours - h) * 60); s = int(round(((hours - h) * 60 - mi) * 60)) % 60
        cases.append(dict(name=f"{name} #{i}", y=y, m=m, d=d, h=h, mi=mi, s=s, tz=tz,
                          place=name, lat=lat, lon=lon))
    return cases


def run_pyjhora(c, ch, with_sunrise):
    from jhora import const
    from jhora.panchanga import drik
    from jhora.horoscope.chart import sphuta

    place = drik.Place(c["place"], c["lat"], c["lon"], c["tz"], elevation=0.0)
    jd_local = swe.julday(c["y"], c["m"], c["d"], c["h"] + c["mi"] / 60 + c["s"] / 3600, swe.GREG_CAL)
    dob = drik.Date(c["y"], c["m"], c["d"]); tob = (c["h"], c["mi"], c["s"])
    b = ch["bodies"]
    exact = {p: b[p]["deg"] for p in IDS}
    rounded = {p: b[p]["arcsec"] / 3600.0 for p in IDS}
    asc = ch["ascDeg"]; mc = ch["mcDeg"]
    out = {}

    # ---------------- bhava (exact floats on both sides)
    cusps = list(ch["cusps"])
    cusps[0] = asc; cusps[3] = (mc + 180) % 360; cusps[6] = (asc + 180) % 360; cusps[9] = mc
    pp = [[const._ascendant_symbol, (int(asc // 30), asc % 30)]] + \
         [[JH_INDEX[p], (int(exact[p] // 30), exact[p] % 30)] for p in IDS]
    saved = (drik.bhaava_madhya_kp, drik.ascendant, drik.dhasavarga)
    drik.bhaava_madhya_kp = lambda jd, pl: list(cusps)
    drik.ascendant = lambda jd, pl, *a, **k: [int(asc // 30), asc % 30, 0, 0]
    drik.dhasavarga = lambda jd, pl, *a, **k: [x for x in pp[1:]]
    try:
        out["sripati_madhya"] = [x % 360 for x in drik.bhaava_madhya_sripathi(jd_local, place)]
        def houses(method):
            res = drik._bhaava_madhya_new(jd_local, place, method)
            rows = []
            for _rasi, (st, mid, en), planets in res:
                rows.append({"start": st % 360, "mid": mid % 360, "end": en % 360,
                             "planets": ["As" if q == const._ascendant_symbol else IDS[q] for q in planets]})
            return rows
        out["equal"] = houses(1)
        out["sripati_method3"] = houses(3)
    finally:
        drik.bhaava_madhya_kp, drik.ascendant, drik.dhasavarga = saved

    # ---------------- yogi (rounded arcseconds, as KAAST does)
    ypp = [[const._ascendant_symbol, (int(asc // 30), asc % 30)]] + \
          [[JH_INDEX[p], (int(rounded[p] // 30), rounded[p] % 30)] for p in IDS]
    saved_dc = sphuta.charts.divisional_chart
    sphuta.charts.divisional_chart = lambda *a, **k: [list(x) for x in ypp]
    try:
        def lord_of(lon):
            nak = drik.nakshatra_pada(lon)[0] - 1
            return IDS[[l for l, naks in const.nakshathra_lords.items() if nak in naks][0]], nak
        yh, yl = sphuta.yogi_sphuta(dob, tob, place)
        ylon = yh * 30 + yl
        ylord, ynak = lord_of(ylon)
        ah, al = sphuta.avayogi_sphuta(dob, tob, place)
        alon = ah * 30 + al
        alord, anak = lord_of(alon)
        out["yogi"] = {"pointDeg": ylon, "nakshatra": ynak, "yogi": ylord,
                       "sahayogi": IDS[const._house_owners_list[yh]],
                       "avayogiPointDeg": alon, "avayogiNakshatra": anak, "avayogi": alord}
    finally:
        sphuta.charts.divisional_chart = saved_dc

    # ---------------- panchanga limbs (rounded arcseconds, linear motion around the moment)
    jd0 = ch["jdUT"]
    lin = {const._SUN: (rounded["Su"], b["Su"]["speed"]), const._MOON: (rounded["Mo"], b["Mo"]["speed"])}
    saved_sl = drik.sidereal_longitude
    def fake_sl(jd_utc, planet):
        if planet in lin:
            l0, v = lin[planet]
            return (l0 + v * (jd_utc - jd0)) % 360
        return saved_sl(jd_utc, planet)
    drik.sidereal_longitude = fake_sl
    try:
        nak, pada_, _ = drik.nakshatra_pada(rounded["Mo"])
        out["limbs"] = {"tithi": int(drik.tithi(jd_local, place)[0]), "yoga": int(drik.yogam(jd_local, place)[0]),
                        "karana": int(drik.karana(jd_local, place)[0]), "nakshatra": int(nak), "pada": int(pada_)}
    finally:
        drik.sidereal_longitude = saved_sl

    # ---------------- sunrise and vara (PyJHora native; Hindu rising = centre, no refraction)
    if with_sunrise:
        sr = drik.sunrise(jd_local, place)
        out["sunrise_pyjhora"] = {"localHours": sr[0], "jdLocal": sr[2], "jdUT": sr[2] - c["tz"] / 24}
        out["vaara_pyjhora"] = int(drik.vaara(jd_local, place))           # 0 = Sunday
    return out


def swe_sunrises(c, ch):
    """Sunrise opening the Hindu day of the moment, per KAAST convention (pyswisseph).

    Searches start at local civil midnight (zone c["tz"]): the civil date's sunrise if the
    moment is at/after it, else the previous date's. (Starting rise_trans just after an
    earlier sunrise can return a wrong root at high latitude.)
    """
    flags = {"upper-limb": swe.CALC_RISE, "disc-centre": swe.CALC_RISE | swe.BIT_DISC_CENTER,
             "hindu": swe.CALC_RISE | swe.BIT_HINDU_RISING}
    jd = ch["jdUT"]
    midnight = math.floor(jd + c["tz"] / 24 + 0.5) - 0.5 - c["tz"] / 24
    def day_sunrise(m0, rsmi):
        rc, tret = swe.rise_trans(m0, swe.SUN, rsmi, (c["lon"], c["lat"], 0.0), 1013.25, 15.0, swe.FLG_SWIEPH)
        return tret[0] if rc == 0 and tret[0] < m0 + 1 else None
    res = {}
    for k, rsmi in flags.items():
        sr = day_sunrise(midnight, rsmi)
        res[k] = sr if sr is not None and sr <= jd else day_sunrise(midnight - 1, rsmi)
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ephe", default=DEFAULT_EPHE)
    ap.add_argument("--n", type=int, default=180)
    ap.add_argument("--sunrise-every", type=int, default=4)
    args = ap.parse_args()

    import jhora  # noqa: F401 (imported for its version)
    from jhora import const
    const.get_place_elevation_from_internet = False

    cases = [AMITABH] + synthetic_cases(args.n)
    rows = []
    for i, c in enumerate(cases):
        swe.set_ephe_path(args.ephe)          # PyJHora resets the path on import; set ours per case
        ch = cast_pl9(c)
        with_sr = (i % args.sunrise_every == 0)
        sr = swe_sunrises(c, ch) if with_sr else None
        jh = run_pyjhora(c, ch, with_sr)
        rows.append({
            "input": {k: c[k] for k in ("name", "y", "m", "d", "h", "mi", "s", "tz", "place", "lat", "lon")},
            "jdUT": ch["jdUT"], "ayanamsaDeg": ch["ayanamsa"],
            "ascDeg": ch["ascDeg"], "mcDeg": ch["mcDeg"],
            "deg": {p: ch["bodies"][p]["deg"] for p in IDS},
            "arcsec": {p: ch["bodies"][p]["arcsec"] for p in IDS},
            "sunriseSwe": sr,
            "pyjhora": jh,
        })
    from jhora import _package_info as info
    doc = {
        "_source": "kaast2/oracle/bhava_yogi_panchanga_pyjhora.py — PyJHora rules fed KAAST pl9 longitudes",
        "_versions": {"pyjhora": getattr(info, "version", "?"), "pyswisseph": swe.version},
        "_conventions": {
            "deg/arcsec": "sidereal, pl9 recipe; arcsec = round(deg*3600)",
            "sripati_madhya": "PyJHora drik.bhaava_madhya_sripathi (exact floats)",
            "equal / sripati_method3": "PyJHora drik._bhaava_madhya_new methods 1 and 3: (start, mid, end, planets)",
            "yogi": "PyJHora sphuta.yogi_sphuta/avayogi_sphuta on rounded longitudes; nakshatra 0-based",
            "limbs": "tithi 1-30, yoga 1-27, karana 1-60, nakshatra 1-27, pada 1-4 (PyJHora numbering)",
            "sunriseSwe": "JD UT of the last sunrise <= moment per KAAST convention (pyswisseph rise_trans)",
            "sunrise_pyjhora": "PyJHora drik.sunrise of the civil date (Hindu rising); vaara 0 = Sunday",
        },
        "cases": rows,
    }
    with open(OUT, "w") as f:                 # one case per line: compact and diffable
        head = {k: v for k, v in doc.items() if k != "cases"}
        f.write(json.dumps(head, indent=1)[:-2] + ',\n "cases": [\n')
        f.write(",\n".join(json.dumps(r, separators=(",", ":")) for r in rows))
        f.write("\n ]\n}\n")
    print(f"wrote {OUT}: {len(rows)} cases", file=sys.stderr)


if __name__ == "__main__":
    main()

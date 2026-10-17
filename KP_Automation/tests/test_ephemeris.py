"""
test_ephemeris.py — Validate the built-in ephemeris against the Solar Fire
reference charts.

    python tests/test_ephemeris.py "path/to/Solar Fire Gold Charts.xlsx"

Pass criteria (matching the calibration study):
  * every planetary position within 1'' of Solar Fire (truncated arcsec)
  * every cusp within 12'' (the reference charts' own LST/coordinate
    truncation contributes ~10'')
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

import openpyxl
import swisseph as swe

from kala_chakra.ephemeris import (AYANAMSA_CAL_DEG, cast_chart,
                                   geocentric_latitude, sf_deltat)
from kala_chakra.kp_core import parse_longitude

POINTS = {"Mon": "Mo", "Sun": "Su", "Mer": "Me", "Ven": "Ve", "Mar": "Ma",
          "Jup": "Ju", "Sat": "Sa", "Nod": "Ra"}


def sheet_text(ws) -> str:
    return "\n".join(
        "  ".join(str(c.value) for c in row if c.value is not None)
        for row in ws.iter_rows())


def parse_reference(t: str) -> dict | None:
    m = re.search(r"DeltaT = \+(\d+)s;.*JDE = ([\d.]+)", t)
    if not m:
        return None
    ref = {"deltat": int(m.group(1)), "jde": float(m.group(2))}
    m = re.search(r"Geocentric latitude used:\s*(\d+)°([NS])(\d+)'(\d+)", t)
    ref["geoclat"] = ((int(m.group(1)) + int(m.group(3))/60
                       + int(m.group(4))/3600)
                      * (1 if m.group(2) == "N" else -1))
    m = re.search(r"LST = (\d+):(\d+):(\d+)", t)
    ref["lst"] = int(m.group(1)) + int(m.group(2))/60 + int(m.group(3))/3600
    ref["cusps"], ref["planets"] = {}, {}
    in_c = in_p = False
    for line in t.splitlines():
        if "HOUSE CUSPS" in line:
            in_c, in_p = True, False
        elif "CHART POINTS" in line:
            in_c, in_p = False, True
        elif "LUNAR PHASE" in line:
            in_c = in_p = False
        if in_c:
            for mm in re.finditer(
                    r"\b(\d{1,2})\s+(\d{1,2}°\w\w\d{1,2}'\d{1,2})", line):
                if 1 <= int(mm.group(1)) <= 12:
                    ref["cusps"][int(mm.group(1))] = \
                        parse_longitude(mm.group(2))
        elif in_p:
            mm = re.match(r"\s*(\w{3})\s+(\d{1,2}°\w\w\d{1,2}'\d{1,2})", line)
            if mm and mm.group(1) in POINTS:
                ref["planets"][POINTS[mm.group(1)]] = \
                    parse_longitude(mm.group(2))
    return ref if len(ref["cusps"]) == 12 else None


def main(path: str) -> int:
    wb = openpyxl.load_workbook(path, data_only=True)
    fails = n_p = n_c = 0
    for ws in wb.worksheets:
        ref = parse_reference(sheet_text(ws))
        if ref is None:
            continue
        # reconstruct civil time (whole second) and location from the header
        jd_ut = ref["jde"] - ref["deltat"]/86400
        y, m, d, h = swe.revjul(jd_ut)
        tz = 5.5 if abs(ref["geoclat"] - 21.5839) < 0.01 else 8.0
        secs = round((h + tz) * 3600)
        gmst = swe.sidtime(swe.julday(y, m, d, secs/3600 - tz))
        lon = ((ref["lst"] - gmst) % 24) * 15
        if lon > 180:
            lon -= 360
        # geographic latitude that yields the printed geocentric latitude
        lat = ref["geoclat"]
        for _ in range(6):
            lat += ref["geoclat"] - geocentric_latitude(lat)

        res = cast_chart(y, m, d, secs//3600, (secs//60) % 60, secs % 60,
                         tz_hours=tz, latitude=lat, longitude=lon, mode="sf")
        for p, want in ref["planets"].items():
            n_p += 1
            diff = res.chart.planets[p] - want
            if abs(diff) > 1:
                fails += 1
                print(f"FAIL {ws.title} {p}: {diff:+d}''")
        for hh, want in ref["cusps"].items():
            n_c += 1
            diff = res.chart.cusps[hh] - want
            if abs(diff) > 12:
                fails += 1
                print(f"FAIL {ws.title} cusp {hh}: {diff:+d}''")
    print(f"checked {n_p} planetary positions (tol 1'') and {n_c} cusps "
          f"(tol 12''): {fails} failures")
    return 1 if fails else 0


if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 \
        else "../Solar Fire Gold Charts.xlsx"
    raise SystemExit(main(src))

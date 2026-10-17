"""
ephemeris.py — Cast a horary chart from date/time/place, replicating the
Solar Fire Gold configuration used for all existing charts:

    Sidereal (Lahiri) · Topocentric houses · True Node
    Geocentric latitude correction ON · Moon parallax OFF · truncated arcsec

Engine: Swiss Ephemeris (the same engine Solar Fire itself uses), via
pyswisseph, with the planetary data files bundled in data/swefiles/
(valid 1800--2399 CE).

Two modes:
  * ``sf``      — replicates Solar Fire v9.0.19 output: its (obsolete) DeltaT
                  extrapolation, calibrated against 10 reference charts
                  (2019--2026; 120/120 planetary positions within 1'').
  * ``modern``  — current astronomical DeltaT (positions are *more* accurate
                  than Solar Fire's, but may differ from it by a few arcsec,
                  mainly for the Moon).

Calibration notes (derived from the reference charts, July 2026):
  * Constant ayanamsa offset +1.251'' (SF's 2014-era Lahiri vs current
    Swiss Ephemeris SIDM_LAHIRI).
  * SF DeltaT anchor points recovered by assuming whole-second civil input
    times; piecewise-linear interpolation between anchors.
  * SF's displayed 'Ayanamsa of date' is measured from the true equinox
    (includes nutation) — cosmetic only; positions use the mean-based value.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from pathlib import Path

import swisseph as swe

from .kp_core import Chart, ZODIAC_ARCSEC

# --- engine setup ----------------------------------------------------------

_EPHE_PATH = Path(__file__).parent / "data" / "swefiles"
swe.set_ephe_path(str(_EPHE_PATH))
swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)

_FLAGS = swe.FLG_SWIEPH | swe.FLG_SIDEREAL

#: constant calibration: SF sidereal longitude - swisseph sidereal longitude
AYANAMSA_CAL_DEG = 1.251 / 3600

#: SF v9.0.19 DeltaT anchors (decimal year, seconds), recovered from the
#: reference charts. Extended linearly at +1.0 s/yr outside the range.
_SF_DELTAT_ANCHORS = [
    (2019.29, 76.28), (2021.37, 79.33), (2022.98, 80.86), (2023.20, 82.44),
    (2023.61, 82.40), (2024.00, 83.96), (2024.54, 83.98), (2026.51, 87.50),
]

_BODIES = {"Su": swe.SUN, "Mo": swe.MOON, "Me": swe.MERCURY, "Ve": swe.VENUS,
           "Ma": swe.MARS, "Ju": swe.JUPITER, "Sa": swe.SATURN,
           "Ra": swe.TRUE_NODE}


def sf_deltat(jd_ut: float) -> float:
    """Solar Fire v9's DeltaT (seconds) — piecewise linear on the anchors."""
    y = 2000.0 + (jd_ut - 2451544.5) / 365.2425
    a = _SF_DELTAT_ANCHORS
    if y <= a[0][0]:
        return a[0][1] - (a[0][0] - y) * 1.0
    if y >= a[-1][0]:
        return a[-1][1] + (y - a[-1][0]) * 1.0
    for (y0, d0), (y1, d1) in zip(a, a[1:]):
        if y0 <= y <= y1:
            return d0 + (d1 - d0) * (y - y0) / (y1 - y0)
    raise AssertionError


def geocentric_latitude(geographic_lat_deg: float) -> float:
    """WGS84 geocentric latitude (SF: 'Apply Geocentric Correction')."""
    phi = math.radians(geographic_lat_deg)
    return math.degrees(math.atan(math.tan(phi) * (1 - 1/298.257223563) ** 2))


def _trunc_arcsec(deg: float) -> int:
    """Longitude in degrees -> truncated integer arcseconds (SF display)."""
    return int((deg % 360) * 3600)


@dataclass
class CastResult:
    chart: Chart                   # kp_core Chart (integer arcseconds)
    jd_ut: float
    jd_tt: float
    deltat: float                  # seconds actually used
    ayanamsa_deg: float            # effective (calibrated) ayanamsa
    mode: str


def cast_chart(year: int, month: int, day: int,
               hour: int, minute: int, second: int,
               tz_hours: float, latitude: float, longitude: float,
               mode: str = "sf") -> CastResult:
    """Cast a KP horary chart.

    latitude/longitude: geographic, decimal degrees (E and N positive).
    tz_hours: offset from UTC (e.g. Singapore 8.0, India 5.5).
    mode: 'sf' (replicate Solar Fire) or 'modern' (current DeltaT).
    """
    ut_hours = hour + minute/60 + second/3600 - tz_hours
    jd_ut = swe.julday(year, month, day, ut_hours)
    dt = sf_deltat(jd_ut) if mode == "sf" else swe.deltat(jd_ut) * 86400
    jd_tt = jd_ut + dt / 86400

    cal = AYANAMSA_CAL_DEG if mode == "sf" else 0.0

    planets: dict[str, int] = {}
    for abbr, body in _BODIES.items():
        pos, _ = swe.calc(jd_tt, body, _FLAGS)
        planets[abbr] = _trunc_arcsec(pos[0] + cal)
    planets["Ke"] = (planets["Ra"] + ZODIAC_ARCSEC // 2) % ZODIAC_ARCSEC

    geoc = geocentric_latitude(latitude)
    cusps, _ascmc = swe.houses_ex(jd_ut, geoc, longitude, b'T',
                                  swe.FLG_SIDEREAL)
    chart_cusps = {h: _trunc_arcsec(cusps[h-1] + cal) for h in range(1, 13)}

    ay = swe.get_ayanamsa(jd_tt) - cal
    return CastResult(chart=Chart(cusps=chart_cusps, planets=planets),
                      jd_ut=jd_ut, jd_tt=jd_tt, deltat=dt,
                      ayanamsa_deg=ay, mode=mode)


def main() -> None:
    """CLI: kp-cast — date/time/place in, finished horary workbook out."""
    import argparse
    from .excel_builder import build

    ap = argparse.ArgumentParser(
        description="Cast a KP horary chart (no astrology software needed)")
    ap.add_argument("--date", required=True, help="YYYY-MM-DD")
    ap.add_argument("--time", required=True, help="HH:MM[:SS] (24h, local)")
    ap.add_argument("--tz", type=float, required=True,
                    help="UTC offset hours (Singapore 8, India 5.5)")
    ap.add_argument("--lat", type=float, required=True,
                    help="geographic latitude, +N decimal degrees")
    ap.add_argument("--lon", type=float, required=True,
                    help="geographic longitude, +E decimal degrees")
    ap.add_argument("--mode", choices=["sf", "modern"], default="sf")
    ap.add_argument("--question", default="")
    ap.add_argument("--name", default="")
    ap.add_argument("--location", default="")
    ap.add_argument("-o", "--out", help="output .xlsx (omit to just print)")
    args = ap.parse_args()

    y, m, d = (int(x) for x in args.date.split("-"))
    parts = [int(x) for x in args.time.split(":")]
    while len(parts) < 3:
        parts.append(0)

    res = cast_chart(y, m, d, *parts, tz_hours=args.tz,
                     latitude=args.lat, longitude=args.lon, mode=args.mode)
    ch = res.chart

    from .kp_core import format_longitude, star_and_sub, POINT_TO_PLANET
    label = {v: k for k, v in POINT_TO_PLANET.items()}
    print(f"KP horary chart — {args.date} {args.time} (UTC{args.tz:+.1f}) "
          f"at {args.lat:.4f}N {args.lon:.4f}E [{res.mode} mode, "
          f"DeltaT {res.deltat:.1f}s]")
    for h in range(1, 13):
        _, st, su = star_and_sub(ch.cusps[h])
        print(f"  cusp {h:2d}  {format_longitude(ch.cusps[h])} {st}/{su}")
    for p in ("Mo", "Su", "Me", "Ve", "Ma", "Ju", "Sa", "Ra", "Ke"):
        _, st, su = star_and_sub(ch.planets[p])
        print(f"  {label[p]:4s}    {format_longitude(ch.planets[p])} {st}/{su}"
              f"-{ch.house_of(ch.planets[p])}  nums={ch.numbers_string(p)}")

    if args.out:
        meta = {"question": args.question, "name": args.name,
                "date": args.date, "time": args.time,
                "location": args.location or f"{args.lat}, {args.lon}"}
        build(ch, meta, args.out)
        print(f"Saved workbook: {args.out}")


if __name__ == "__main__":
    main()

"""
sf_parser.py — Guide steps 1-3: turn a raw Solar Fire 'CHART ANALYSIS
REPORT' into a clean Chart (12 cusps + 9 KP points).

Accepts either:
  * plain text (pasted report), or
  * an .xlsx into which the report was pasted (any sheet, any position).

Cleaning rules (Guide_Step3 notes):
  * keep only the HOUSE CUSPS block and the 9 KP points
  * 'Nod' (north node) becomes Ra
  * Ke is added at the same degree/min/sec in the opposite sign
  * retrograde markers ('R') and extra columns (Travel, Decl, ...) ignored
  * Ura/Nep/Plu/Chi/Asc/MC are dropped
"""

from __future__ import annotations

import re
from pathlib import Path

from .kp_core import Chart, ZODIAC_ARCSEC, parse_longitude

# SF point labels we keep (SF name -> KP abbreviation)
SF_POINTS = {"Mon": "Mo", "Sun": "Su", "Mer": "Me", "Ven": "Ve",
             "Mar": "Ma", "Jup": "Ju", "Sat": "Sa", "Nod": "Ra", "Ra": "Ra",
             "Ke": "Ke"}

_LON = r"\d{1,2}\s*°\s*[A-Za-z]{2}\s*\d{1,2}\s*'\s*\d{1,2}"
CUSP_ENTRY = re.compile(rf"(\b\d{{1,2}})\s+({_LON})")
POINT_LINE = re.compile(rf"^\s*([A-Za-z]{{2,3}})(?:\[.*?\])?\s+({_LON})")


def parse_sf_text(text: str) -> Chart:
    """Parse a pasted Solar Fire report (plain text)."""
    cusps: dict[int, int] = {}
    planets: dict[str, int] = {}
    in_cusps = in_points = False
    for line in text.splitlines():
        u = line.upper()
        if "HOUSE CUSPS" in u:
            in_cusps, in_points = True, False
            continue
        if "CHART POINTS" in u:
            in_cusps, in_points = False, True
            continue
        if u.strip().startswith(("LUNAR PHASE", "SIGN MODALITIES",
                                 "CHART ANGLES", "*** END")):
            in_cusps = in_points = False
        if in_cusps:
            for num, lon in CUSP_ENTRY.findall(line):
                h = int(num)
                if 1 <= h <= 12:
                    cusps[h] = parse_longitude(lon)
        elif in_points:
            m = POINT_LINE.match(line)
            if m and m.group(1) in SF_POINTS:
                planets[SF_POINTS[m.group(1)]] = parse_longitude(m.group(2))
    return _finish(cusps, planets)


def parse_sf_grid(rows: list[list]) -> Chart:
    """Parse a report pasted into a spreadsheet (list of row-value lists).

    Rebuilds each row as a text line and reuses the text parser, so both
    input shapes follow identical rules.
    """
    lines = []
    for row in rows:
        cells = [str(v) for v in row if v is not None and str(v).strip()]
        lines.append("  ".join(cells))
    return parse_sf_text("\n".join(lines))


def parse_sf_xlsx(path: str | Path, sheet: str | None = None) -> Chart:
    import openpyxl
    wb = openpyxl.load_workbook(path, data_only=True)
    errors = []
    for ws in wb.worksheets:
        if sheet and ws.title != sheet:
            continue
        rows = [[c.value for c in row] for row in ws.iter_rows()]
        try:
            return parse_sf_grid(rows)
        except ValueError as e:
            errors.append(f"{ws.title}: {e}")
    raise ValueError("No parseable chart found. " + "; ".join(errors))


def _finish(cusps: dict[int, int], planets: dict[str, int]) -> Chart:
    if "Ra" in planets and "Ke" not in planets:
        planets["Ke"] = (planets["Ra"] + ZODIAC_ARCSEC // 2) % ZODIAC_ARCSEC
    missing_c = [h for h in range(1, 13) if h not in cusps]
    missing_p = [p for p in ("Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa",
                             "Ra", "Ke") if p not in planets]
    if missing_c or missing_p:
        raise ValueError(
            f"incomplete report: missing cusps {missing_c or 'none'}, "
            f"missing points {missing_p or 'none'}")
    return Chart(cusps=cusps, planets=planets)

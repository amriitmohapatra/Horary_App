"""
process.py — Read a horary chart workbook (Astro-for-Siddhartha export layout),
compute KP star/sub lords, cusp placements and ownership numbers, and write
the annotations back in exactly the manual format.

Usage:
    python process.py "RA Job.xlsx"                 # -> RA Job_KP.xlsx
    python process.py "RA Job.xlsx" --in-place      # overwrite original
    python process.py "RA Job.xlsx" --sheet Sheet3  # only one sheet

The processor is idempotent: cells that were already annotated manually are
re-derived from the raw longitude, so running it twice changes nothing.
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

import openpyxl

from .kp_core import (Chart, POINT_TO_PLANET, parse_longitude,
                     format_longitude, star_and_sub, _LON_RE)

CUSP_RE = re.compile(r"^\s*(\d{1,2})\s+\d{1,2}\s*°")


def _point_label(value) -> str | None:
    """Normalize a point-label cell: ' Jup[R]' -> 'Jup'. None if not a label."""
    if not isinstance(value, str):
        return None
    label = re.sub(r"\[.*?\]", "", value).strip()
    return label if label in POINT_TO_PLANET else None


# ---------------------------------------------------------------------------
# Parsing a sheet into a Chart
# ---------------------------------------------------------------------------

def parse_sheet(ws) -> Chart | None:
    """Extract cusps and planets from a sheet. Returns None if no chart."""
    cusps: dict[int, int] = {}
    planets: dict[str, int] = {}
    warnings: list[str] = []

    for row in ws.iter_rows():
        for cell in row:
            v = cell.value
            if not isinstance(v, str):
                continue
            lon = parse_longitude(v)
            if lon is None:
                continue
            m = CUSP_RE.match(v)
            if m:                                   # cusp cell
                h = int(m.group(1))
                if 1 <= h <= 12:
                    if h in cusps and cusps[h] != lon:
                        warnings.append(
                            f"{ws.title}!{cell.coordinate}: cusp {h} appears "
                            f"twice with different longitudes - check export.")
                    cusps[h] = lon
                continue
            # planet cell: label sits in the cell immediately to the left
            left = ws.cell(row=cell.row, column=cell.column - 1).value \
                if cell.column > 1 else None
            label = _point_label(left)
            if label is not None:
                pl = POINT_TO_PLANET[label]
                if pl in planets and planets[pl] != lon:
                    warnings.append(
                        f"{ws.title}!{cell.coordinate}: {label} appears twice "
                        f"with different longitudes - check export.")
                planets[pl] = lon

    if len(cusps) != 12 or len(planets) != 9:
        if cusps or planets:
            warnings.append(
                f"{ws.title}: incomplete chart "
                f"({len(cusps)}/12 cusps, {len(planets)}/9 planets) - skipped.")
            print("\n".join(warnings))
        return None
    return Chart(cusps=cusps, planets=planets, warnings=warnings)


# ---------------------------------------------------------------------------
# Writing annotations back
# ---------------------------------------------------------------------------

def annotate_sheet(ws, chart: Chart) -> int:
    """Rewrite every longitude cell with computed annotations. Returns count."""
    chart.sign_to_houses()          # populate interception warnings up front
    n = 0
    for row in ws.iter_rows():
        for cell in row:
            v = cell.value
            if not isinstance(v, str):
                continue
            lon = parse_longitude(v)
            if lon is None:
                continue
            base = f"{format_longitude(lon)} {_sl(lon)}"
            m = CUSP_RE.match(v)
            if m:                                   # cusp cell
                # keep the original 'house number + spacing' prefix verbatim
                prefix = v[:_LON_RE.search(v).start()]
                cell.value = f"{prefix}{base}"
            else:                                   # planet cell
                left = ws.cell(row=cell.row, column=cell.column - 1).value \
                    if cell.column > 1 else None
                label = _point_label(left)
                if label is not None:
                    pl = POINT_TO_PLANET[label]
                    in_points_block = _in_chart_points_block(ws, cell.row)
                    if in_points_block:
                        cell.value = base
                        # numbers go two columns to the right (col D for B)
                        ws.cell(row=cell.row, column=cell.column + 2,
                                value=chart.numbers_string(pl))
                    else:                           # diagram cell: -house tag
                        cell.value = f"{base}-{chart.house_of(lon)}"
                else:
                    cell.value = base               # bare longitude
            n += 1
    return n


def _sl(lon: int) -> str:
    _, star, sub = star_and_sub(lon)
    return f"{star}/{sub}"


def _in_chart_points_block(ws, rownum: int) -> bool:
    """True if a 'CHART POINTS' header appears above this row in column A."""
    for r in range(rownum, 0, -1):
        v = ws.cell(row=r, column=1).value
        if isinstance(v, str):
            if "CHART POINTS" in v.upper():
                return True
            if "HOUSE CUSPS" in v.upper():
                return False
    return False


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def process_workbook(path: str | Path, sheet: str | None = None,
                     in_place: bool = False) -> Path:
    path = Path(path)
    wb = openpyxl.load_workbook(path)
    all_warnings: list[str] = []

    for ws in wb.worksheets:
        if sheet and ws.title != sheet:
            continue
        chart = parse_sheet(ws)
        if chart is None:
            continue
        n = annotate_sheet(ws, chart)
        print(f"[{ws.title}] annotated {n} cells; "
              f"planet numbers written to CHART POINTS block.")
        all_warnings.extend(chart.warnings)

    out = path if in_place else path.with_name(path.stem + "_KP" + path.suffix)
    wb.save(out)
    if all_warnings:
        print("\nWARNINGS (review manually):")
        for w in all_warnings:
            print("  *", w)
    print(f"\nSaved: {out}")
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description="KP horary chart annotator")
    ap.add_argument("workbook", nargs="+",
                    help="path(s) to exported .xlsx file(s)")
    ap.add_argument("--sheet", help="process only this sheet")
    ap.add_argument("--in-place", action="store_true",
                    help="overwrite the original file")
    args = ap.parse_args()
    for wbpath in args.workbook:
        process_workbook(wbpath, sheet=args.sheet, in_place=args.in_place)


if __name__ == "__main__":
    main()

"""
excel_builder.py — Guide steps 1-6 end to end: raw Solar Fire export in,
finished horary workbook out.

    kp-build raw.xlsx -o "My Question.xlsx" \
        --question "Will I ...?" --name "Amriit" \
        --date 6/7/2026 --time "9:03 pm" --location Singapore

The output workbook is built on the East-Indian chart template extracted
from 'Horary Artifacts.xlsx' (Guide_Step2), so the 12 chart lines are the
real drawing. It contains:
  * the chart, with every cusp and planet placed in its sign's box
  * date / time / location in the centre
  * HOUSE CUSPS + CHART POINTS blocks with star/sub lords, cusp numbers
    and final power strings
  * a step-wise POWER CALCULATION section (every term shown, then merged)
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

from .kp_core import (Chart, POINT_TO_PLANET, SIGNS, format_longitude,
                     sign_of, star_and_sub)
from .sf_parser import parse_sf_text, parse_sf_xlsx
from .xlsx_surgical import Workbook

TEMPLATE = Path(__file__).parent / "data" / "chart_template.xlsx"
PLANET_LABEL = {v: k for k, v in POINT_TO_PLANET.items()}   # Mo -> Mon
PLANET_ORDER = ["Mo", "Su", "Me", "Ve", "Ma", "Ju", "Sa", "Ra", "Ke"]

# Sign -> (first entry row, label col, value col) inside its box on the
# template ('Chart' sheet). Entries stack downward one row per item.
SIGN_SLOTS = {
    "Ta": (5, 7, 8),    "Ar": (5, 10, 11),  "Pi": (5, 14, 15),
    "Ge": (7, 5, 6),    "Aq": (8, 15, 16),
    "Cn": (13, 5, 6),   "Cp": (12, 14, 15),
    "Le": (19, 5, 6),   "Sg": (17, 16, 17),
    "Vi": (24, 7, 8),   "Li": (17, 10, 11), "Sc": (21, 14, 15),
}
CENTER = {"date": (12, 11), "time": (13, 11), "location": (14, 11)}
NOTE_CELLS = [(29, 4), (30, 4), (31, 4), (32, 4)]


def _sl(lon: int) -> str:
    _, st, su = star_and_sub(lon)
    return f"{st}/{su}"


def build(chart: Chart, meta: dict, out_path: str | Path) -> Path:
    wb = Workbook(TEMPLATE)
    sheet_path = wb.sheets[0][1]
    updates: list[tuple[int, int, str | None]] = []

    # header + centre
    updates.append((1, 1, meta.get("question", "")))
    updates.append((2, 1, meta.get("name", "")))
    for key, (r, c) in CENTER.items():
        updates.append((r, c, meta.get(key, "")))
    updates.extend((r, c, None) for r, c in NOTE_CELLS)

    # chart boxes: cusps first, then planets, per sign
    for sign in SIGNS:
        row, lc, vc = SIGN_SLOTS[sign]
        for h in sorted(chart.cusps):
            if sign_of(chart.cusps[h]) == sign:
                lon = chart.cusps[h]
                updates.append((row, vc,
                                f"{h} {format_longitude(lon)} {_sl(lon)}"))
                row += 1
        for p in PLANET_ORDER:
            if sign_of(chart.planets[p]) == sign:
                updates.append((row, lc, PLANET_LABEL[p]))
                updates.append((row, vc, chart.annotate_planet(p, True)))
                row += 1

    # HOUSE CUSPS block (rows 30-33, cols F/I/L/O like the guide)
    updates.append((30, 6, "HOUSE CUSPS (Topocentric)"))
    for i, h in enumerate(range(1, 13)):
        r, c = 31 + i % 3, 6 + (i // 3) * 3
        lon = chart.cusps[h]
        updates.append((r, c, f"{str(h).rjust(2)} {format_longitude(lon)} "
                              f"{_sl(lon)}"))

    # CHART POINTS block with numbers + final power strings
    updates.append((35, 6, "CHART POINTS"))
    updates.append((36, 6, "Point"))
    updates.append((36, 7, "Longitude"))
    updates.append((36, 9, "Cusp numbers"))
    updates.append((36, 11, "Powers"))
    for i, p in enumerate(PLANET_ORDER):
        r = 37 + i
        updates.append((r, 6, PLANET_LABEL[p]))
        updates.append((r, 7, chart.annotate_planet(p, True)))
        updates.append((r, 9, chart.numbers_string(p)))
        updates.append((r, 11, chart.powers_string(p)))

    # step-wise power calculation
    r = 48
    updates.append((r, 6, "POWER CALCULATION (step-wise)")); r += 2
    for p in PLANET_ORDER:
        t = chart.power_terms(p)
        updates.append((r, 6, f"{PLANET_LABEL[p].strip()}  "
                              f"(Star {t['star']}, Sub {t['sub']})")); r += 1
        num_tot, den_tot = chart.side_totals(p)
        for side, tot in (("numerator", num_tot), ("denominator", den_tot)):
            updates.append((r, 7, side.capitalize())); r += 1
            for part, terms in t[side].items():
                text = ", ".join(f"{b}^{pw} ({why})" for b, pw, why in terms)
                updates.append((r, 8, f"{part}: {text or '-'}")); r += 1
            collected = ", ".join(f"{b}^{pw}" for b, pw in tot.items())
            updates.append((r, 8, f"{side.capitalize()} collected: "
                                  f"{collected or '-'}")); r += 1
        updates.append((r, 7, "Merged (base^total power, ascending):"))
        updates.append((r, 9, chart.powers_string(p))); r += 2

    for w in chart.warnings:
        updates.append((r, 6, f"NOTE: {w}")); r += 1

    wb.apply_updates(sheet_path, updates)
    return wb.save(out_path)


def _meta_from_report(text: str) -> dict:
    """Best-effort date/time extraction from the SF header (ET line)."""
    meta = {}
    m = re.search(r"ET\s*=\s*(\d{1,2}:\d{2}(?::\d{2})?\s*[ap]m)\s+"
                  r"([A-Za-z]{3}\s+\d{1,2}\s+\d{4})", text)
    if m:
        meta["time"], meta["date"] = m.group(1), m.group(2)
    m = re.search(r"^\s*(.+?)\s*-\s*Horary Chart\s*$", text, re.M)
    if m:
        meta.setdefault("name", m.group(1))
    return meta


def main() -> None:
    ap = argparse.ArgumentParser(description="raw SF export -> finished "
                                             "horary workbook")
    ap.add_argument("raw", help=".xlsx or .txt containing the raw SF report")
    ap.add_argument("-o", "--out", help="output .xlsx path")
    ap.add_argument("--question", default="")
    ap.add_argument("--name", default="")
    ap.add_argument("--date", default="")
    ap.add_argument("--time", default="")
    ap.add_argument("--location", default="")
    args = ap.parse_args()

    raw = Path(args.raw)
    if raw.suffix.lower() == ".xlsx":
        chart = parse_sf_xlsx(raw)
        text = ""
    else:
        text = raw.read_text()
        chart = parse_sf_text(text)

    meta = _meta_from_report(text)
    for k in ("question", "name", "date", "time", "location"):
        if getattr(args, k):
            meta[k] = getattr(args, k)

    out = Path(args.out) if args.out else raw.with_name(raw.stem + "_horary.xlsx")
    build(chart, meta, out)
    print(f"Saved: {out}")
    for w in chart.warnings:
        print("  NOTE:", w)


if __name__ == "__main__":
    main()

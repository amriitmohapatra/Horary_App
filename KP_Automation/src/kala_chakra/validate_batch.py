"""
validate_batch.py — Run the engine against a folder of manually-annotated
horary charts and report every disagreement.

    python validate_batch.py "../Testing"

Each disagreement is either a bug in the code or a slip in the manual chart;
the report gives enough detail to adjudicate each one.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

import openpyxl

from .kp_core import POINT_TO_PLANET, parse_longitude, star_and_sub
from .process import parse_sheet, _in_chart_points_block, _point_label

ANN_RE = re.compile(r"\b([A-Z][a-z])/([A-Z][a-z])\b")
TAG_RE = re.compile(r"/[A-Z][a-z]-(\d{1,2})\b")


def validate_sheet(ws, fname: str, issues: list, counts: dict):
    chart = parse_sheet(ws)
    if chart is None:
        return False
    chart.sign_to_houses()
    for w in chart.warnings:
        issues.append((fname, ws.title, "PARSE-WARNING", w))

    for row in ws.iter_rows():
        for cell in row:
            v = cell.value
            if not isinstance(v, str):
                continue
            lon = parse_longitude(v)
            if lon is None:
                continue
            m = ANN_RE.search(v)
            if m:                                    # manual star/sub present
                _, st, su = star_and_sub(lon)
                counts["starsub"] += 1
                if (st, su) != m.groups():
                    issues.append((fname, ws.title, "STAR/SUB",
                                   f"{cell.coordinate}: manual {m.group(0)} "
                                   f"vs computed {st}/{su}  [{v.strip()}]"))
            t = TAG_RE.search(v)
            if t:                                    # manual house tag present
                counts["housetag"] += 1
                h = chart.house_of(lon)
                if int(t.group(1)) != h:
                    issues.append((fname, ws.title, "HOUSE-TAG",
                                   f"{cell.coordinate}: manual -{t.group(1)} "
                                   f"vs computed -{h}  [{v.strip()}]"))
            # numbers column: label in col A, longitude in col B, numbers in D
            if cell.column == 2 and _in_chart_points_block(ws, cell.row):
                label = _point_label(ws.cell(row=cell.row, column=1).value)
                if label is not None:
                    manual = ws.cell(row=cell.row, column=4).value
                    if manual is None:
                        continue
                    manual = str(manual).replace(" ", "").rstrip(",")
                    calc = chart.numbers_string(POINT_TO_PLANET[label])
                    counts["numbers"] += 1
                    if manual != calc:
                        issues.append((fname, ws.title, "NUMBERS",
                                       f"{label}: manual {manual} "
                                       f"vs computed {calc}"))
                    manual_pow = ws.cell(row=cell.row, column=5).value
                    if manual_pow is not None:
                        manual_pow = str(manual_pow).replace(" ", "")\
                            .rstrip(",")
                        calc_pow = chart.powers_string(
                            POINT_TO_PLANET[label]).replace(" ", "")
                        counts["powers"] += 1
                        if manual_pow != calc_pow:
                            issues.append((fname, ws.title, "POWERS",
                                           f"{label}: manual {manual_pow} "
                                           f"vs computed {calc_pow}"))
    return True


def main(folder: Path) -> None:
    files = sorted(p for p in folder.rglob("*.xlsx")
                   if not p.name.startswith("~$"))
    issues: list = []
    counts = {"starsub": 0, "housetag": 0, "numbers": 0, "powers": 0}
    n_sheets = n_files = 0
    for f in files:
        try:
            wb = openpyxl.load_workbook(f, data_only=True)
        except Exception as e:
            issues.append((f.name, "-", "LOAD-ERROR", str(e)))
            continue
        found = False
        for ws in wb.worksheets:
            try:
                if validate_sheet(ws, f.name, issues, counts):
                    n_sheets += 1
                    found = True
            except Exception as e:
                issues.append((f.name, ws.title, "CRASH", repr(e)))
        n_files += found

    print(f"\nScanned {len(files)} files; complete charts on {n_sheets} "
          f"sheets in {n_files} files.")
    print(f"Comparisons: {counts['starsub']} star/sub, "
          f"{counts['housetag']} house tags, {counts['numbers']} number "
          f"strings, {counts['powers']} power strings.")
    if not issues:
        print("NO DISAGREEMENTS FOUND.")
        return
    print(f"\n{len(issues)} disagreements/warnings:\n")
    for fname, sheet, kind, detail in issues:
        print(f"[{kind}] {fname} ({sheet}): {detail}")


def cli() -> None:
    main(Path(sys.argv[1]) if len(sys.argv) > 1 else Path("."))


if __name__ == "__main__":
    cli()

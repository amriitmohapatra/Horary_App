"""
xlwings_run.py — Annotate the chart in the CURRENTLY OPEN Excel workbook.

Workflow:
  1. Open the exported horary workbook in Excel, select the sheet with the chart.
  2. Run:  python xlwings_run.py
  3. The active sheet is annotated in place (star/sub lords, house tags,
     cusp-number strings). Save from Excel when you're happy.

Reuses the exact same (validated) logic as process.py via a small adapter
that makes an xlwings sheet look like an openpyxl worksheet.
"""

from __future__ import annotations

from .process import parse_sheet, annotate_sheet


class _Cell:
    __slots__ = ("row", "column", "value")

    def __init__(self, row: int, column: int, value):
        self.row, self.column, self.value = row, column, value

    @property
    def coordinate(self) -> str:
        col, letters = self.column, ""
        while col:
            col, r = divmod(col - 1, 26)
            letters = chr(65 + r) + letters
        return f"{letters}{self.row}"


class _SheetAdapter:
    """Minimal openpyxl-like view over a 2D value grid."""

    def __init__(self, values, title: str):
        self.title = title
        self._grid = [[_Cell(r + 1, c + 1, v) for c, v in enumerate(rowvals)]
                      for r, rowvals in enumerate(values)]

    def iter_rows(self):
        return iter(self._grid)

    def cell(self, row: int, column: int, value=None):
        # grow grid if a write lands outside the current used range
        while len(self._grid) < row:
            self._grid.append([])
        rowlist = self._grid[row - 1]
        while len(rowlist) < column:
            rowlist.append(_Cell(row, len(rowlist) + 1, None))
        c = rowlist[column - 1]
        if value is not None:
            c.value = value
        return c

    def to_values(self):
        width = max((len(r) for r in self._grid), default=0)
        return [[ (r[c].value if c < len(r) else None) for c in range(width)]
                for r in self._grid]


def main() -> None:
    import xlwings as xw          # imported here so tests run without Excel
    sht = xw.books.active.sheets.active
    used = sht.used_range
    values = used.value
    if values is None:
        print("Active sheet is empty.")
        return
    if not isinstance(values[0], list):        # single row edge case
        values = [values]

    adapter = _SheetAdapter(values, sht.name)
    chart = parse_sheet(adapter)
    if chart is None:
        print(f"[{sht.name}] no complete chart found "
              "(need 12 cusps + 9 planets). Nothing changed.")
        return
    n = annotate_sheet(adapter, chart)
    out = adapter.to_values()
    # write back, anchored at the used range's top-left cell
    sht.range((used.row, used.column)).value = out

    print(f"[{sht.name}] annotated {n} cells in the open workbook.")
    for w in chart.warnings:
        print("  WARNING:", w)
    print("Review in Excel, then save.")


if __name__ == "__main__":
    main()

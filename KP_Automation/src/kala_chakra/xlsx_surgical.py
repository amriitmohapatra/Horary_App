"""
xlsx_surgical.py — Style-safe cell writing for .xlsx (Python twin of
web/xlsx_surgical.js).

Rewrites ONLY the cells you change (as inline strings); every other byte of
the workbook — including line-shape drawings that openpyxl would silently
drop — survives untouched.
"""

from __future__ import annotations

import re
import shutil
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = ("http://schemas.openxmlformats.org/officeDocument/2006/"
          "relationships")
ET.register_namespace("", NS)


def col_letter(n: int) -> str:
    s = ""
    while n > 0:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s


def col_number(ref: str) -> int:
    n = 0
    for ch in ref:
        if "A" <= ch <= "Z":
            n = n * 26 + ord(ch) - 64
        else:
            break
    return n


class Workbook:
    def __init__(self, path: str | Path):
        self.path = Path(path)
        self.zip = zipfile.ZipFile(self.path)
        wb = ET.fromstring(self.zip.read("xl/workbook.xml"))
        rels = ET.fromstring(self.zip.read("xl/_rels/workbook.xml.rels"))
        relmap = {}
        for r in rels:
            target = r.get("Target").lstrip("/")
            if not target.startswith("xl/"):
                target = "xl/" + target
            relmap[r.get("Id")] = target
        self.sheets = [(s.get("name"), relmap[s.get(f"{{{REL_NS}}}id")])
                       for s in wb.iter(f"{{{NS}}}sheet")]
        self.shared: list[str] = []
        try:
            ss = ET.fromstring(self.zip.read("xl/sharedStrings.xml"))
            for si in ss:
                self.shared.append("".join(t.text or ""
                                           for t in si.iter(f"{{{NS}}}t")))
        except KeyError:
            pass
        self._edited: dict[str, ET.Element] = {}

    # -- reading -------------------------------------------------------------
    def read_grid(self, sheet_path: str):
        tree = self._tree(sheet_path)
        cells = {}
        max_row = max_col = 0
        for c in tree.iter(f"{{{NS}}}c"):
            text = self._cell_text(c)
            if text is None:
                continue
            ref = c.get("r")
            r, col = int(re.sub(r"[A-Z]+", "", ref)), col_number(ref)
            cells[(r, col)] = text
            max_row, max_col = max(max_row, r), max(max_col, col)
        return _Grid(cells, max_row, max_col + 2)

    def _cell_text(self, c) -> str | None:
        t = c.get("t")
        v = c.find(f"{{{NS}}}v")
        if t == "s" and v is not None:
            return self.shared[int(v.text)]
        if t == "inlineStr":
            return "".join(el.text or "" for el in c.iter(f"{{{NS}}}t"))
        if t == "str" and v is not None:
            return v.text
        return None

    # -- writing -------------------------------------------------------------
    def apply_updates(self, sheet_path: str, updates) -> None:
        """updates: iterable of (row, col, text). text=None clears the cell."""
        tree = self._tree(sheet_path)
        sheet_data = tree.find(f"{{{NS}}}sheetData")
        rows = {int(r.get("r")): r for r in sheet_data}
        for row, col, text in updates:
            ref = f"{col_letter(col)}{row}"
            row_el = rows.get(row)
            if row_el is None:
                row_el = ET.Element(f"{{{NS}}}row", {"r": str(row)})
                idx = sum(1 for r in sheet_data if int(r.get("r")) < row)
                sheet_data.insert(idx, row_el)
                rows[row] = row_el
            cell = None
            for c in row_el:
                if c.get("r") == ref:
                    cell = c
                    break
            if cell is None:
                cell = ET.Element(f"{{{NS}}}c", {"r": ref})
                idx = sum(1 for c in row_el
                          if col_number(c.get("r")) < col)
                row_el.insert(idx, cell)
            # clear children/typing, then set inline string (or leave empty)
            for child in list(cell):
                cell.remove(child)
            cell.attrib.pop("t", None)
            if text is not None and text != "":
                cell.set("t", "inlineStr")
                is_el = ET.SubElement(cell, f"{{{NS}}}is")
                t_el = ET.SubElement(is_el, f"{{{NS}}}t")
                if text != text.strip():
                    t_el.set("{http://www.w3.org/XML/1998/namespace}space",
                             "preserve")
                t_el.text = text

    def save(self, out_path: str | Path) -> Path:
        out_path = Path(out_path)
        with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as zout:
            for item in self.zip.namelist():
                if item in self._edited:
                    xml = ET.tostring(self._edited[item],
                                      xml_declaration=True,
                                      encoding="UTF-8")
                    zout.writestr(item, xml)
                else:
                    zout.writestr(item, self.zip.read(item))
        return out_path

    def _tree(self, sheet_path: str) -> ET.Element:
        if sheet_path not in self._edited:
            self._edited[sheet_path] = ET.fromstring(self.zip.read(sheet_path))
        return self._edited[sheet_path]


class _Grid:
    def __init__(self, cells, max_row, max_col):
        self._cells = cells
        self.maxRow, self.maxCol = max_row, max_col

    def get(self, r, c):
        return self._cells.get((r, c))

    def rows(self):
        return sorted({r for r, _ in self._cells})

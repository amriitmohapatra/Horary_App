/*
 * xlsx_surgical.js — Minimal, style-safe .xlsx editing.
 *
 * Reads cell TEXT from a workbook and writes back ONLY the changed cells
 * (as inline strings), leaving every other byte of the file untouched:
 * drawings, images, borders, merged cells, formulas elsewhere — all intact.
 *
 * Works in the browser (native DOMParser) and Node (@xmldom/xmldom).
 * Requires JSZip.
 */
"use strict";

(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(require("jszip"), require("@xmldom/xmldom"));
  } else {
    root.XlsxSurgical = factory(root.JSZip, { DOMParser: root.DOMParser, XMLSerializer: root.XMLSerializer });
  }
})(typeof self !== "undefined" ? self : this, function (JSZip, xmldom) {

  const parser = () => new xmldom.DOMParser();
  const serializer = () => new xmldom.XMLSerializer();

  function colLetter(n) {           // 1 -> A
    let s = "";
    while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
    return s;
  }
  function colNumber(ref) {         // "AB12" -> 28
    let n = 0;
    for (const ch of ref) {
      if (ch >= "A" && ch <= "Z") n = n * 26 + (ch.charCodeAt(0) - 64);
      else break;
    }
    return n;
  }
  function rowNumber(ref) { return parseInt(ref.replace(/^[A-Z]+/, ""), 10); }

  async function openWorkbook(arrayBuffer) {
    const zip = await JSZip.loadAsync(arrayBuffer);

    // sheet name -> path, in workbook order
    const wbXml = parser().parseFromString(await zip.file("xl/workbook.xml").async("string"), "text/xml");
    const relsXml = parser().parseFromString(await zip.file("xl/_rels/workbook.xml.rels").async("string"), "text/xml");
    const relMap = {};
    const rels = relsXml.getElementsByTagName("Relationship");
    for (let i = 0; i < rels.length; i++) {
      let target = rels[i].getAttribute("Target").replace(/^\//, "");
      if (!target.startsWith("xl/")) target = "xl/" + target;
      relMap[rels[i].getAttribute("Id")] = target;
    }
    const sheets = [];
    const sheetEls = wbXml.getElementsByTagName("sheet");
    for (let i = 0; i < sheetEls.length; i++) {
      const rid = sheetEls[i].getAttribute("r:id") || sheetEls[i].getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
      sheets.push({ name: sheetEls[i].getAttribute("name"), path: relMap[rid] });
    }

    // shared strings (concatenate all <t> runs per <si>)
    const shared = [];
    const ssFile = zip.file("xl/sharedStrings.xml");
    if (ssFile) {
      const ssXml = parser().parseFromString(await ssFile.async("string"), "text/xml");
      const sis = ssXml.getElementsByTagName("si");
      for (let i = 0; i < sis.length; i++) {
        const ts = sis[i].getElementsByTagName("t");
        let text = "";
        for (let j = 0; j < ts.length; j++) text += ts[j].textContent;
        shared.push(text);
      }
    }
    return { zip, sheets, shared };
  }

  function cellText(cell, shared) {
    const t = cell.getAttribute("t");
    if (t === "s") {
      const v = cell.getElementsByTagName("v")[0];
      return v ? shared[parseInt(v.textContent, 10)] : null;
    }
    if (t === "inlineStr") {
      const ts = cell.getElementsByTagName("t");
      let text = "";
      for (let j = 0; j < ts.length; j++) text += ts[j].textContent;
      return text;
    }
    if (t === "str") {
      const v = cell.getElementsByTagName("v")[0];
      return v ? v.textContent : null;
    }
    return null;                    // numbers, dates, booleans: not text
  }

  /* Build a {maxRow, maxCol, get(r,c)} grid of the sheet's text cells. */
  async function readGrid(wb, sheetPath) {
    const xml = parser().parseFromString(await wb.zip.file(sheetPath).async("string"), "text/xml");
    const cellsByRef = {};
    let maxRow = 0, maxCol = 0;
    const cells = xml.getElementsByTagName("c");
    for (let i = 0; i < cells.length; i++) {
      const ref = cells[i].getAttribute("r");
      const text = cellText(cells[i], wb.shared);
      if (text === null) continue;
      const r = rowNumber(ref), c = colNumber(ref);
      cellsByRef[`${r},${c}`] = text;
      if (r > maxRow) maxRow = r;
      if (c > maxCol) maxCol = c;
    }
    return { xmlDoc: xml,
             maxRow, maxCol: maxCol + 2,          // slack for numbers column
             get: (r, c) => (`${r},${c}` in cellsByRef ? cellsByRef[`${r},${c}`] : null) };
  }

  function escapeXml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* Apply updates [{row, col, text}] to the parsed sheet DOM. */
  function applyUpdates(xmlDoc, updates) {
    const doc = xmlDoc;
    const ns = doc.documentElement.namespaceURI;
    const sheetData = doc.getElementsByTagName("sheetData")[0];
    const rowsByNum = {};
    const rowEls = sheetData.getElementsByTagName("row");
    for (let i = 0; i < rowEls.length; i++) rowsByNum[rowEls[i].getAttribute("r")] = rowEls[i];

    function makeInline(cell, text) {
      cell.setAttribute("t", "inlineStr");
      // remove any <v>/<is>/<f> children
      while (cell.firstChild) cell.removeChild(cell.firstChild);
      const is = doc.createElementNS(ns, "is");
      const t = doc.createElementNS(ns, "t");
      if (/^\s|\s$/.test(text)) t.setAttribute("xml:space", "preserve");
      t.appendChild(doc.createTextNode(text));
      is.appendChild(t);
      cell.appendChild(is);
    }

    for (const u of updates) {
      const ref = colLetter(u.col) + u.row;
      let rowEl = rowsByNum[String(u.row)];
      if (!rowEl) {                              // create missing row in order
        rowEl = doc.createElementNS(ns, "row");
        rowEl.setAttribute("r", String(u.row));
        let inserted = false;
        for (let i = 0; i < rowEls.length; i++) {
          if (parseInt(rowEls[i].getAttribute("r"), 10) > u.row) {
            sheetData.insertBefore(rowEl, rowEls[i]); inserted = true; break;
          }
        }
        if (!inserted) sheetData.appendChild(rowEl);
        rowsByNum[String(u.row)] = rowEl;
      }
      let cell = null;
      const rowCells = rowEl.getElementsByTagName("c");
      for (let i = 0; i < rowCells.length; i++)
        if (rowCells[i].getAttribute("r") === ref) { cell = rowCells[i]; break; }
      if (!cell) {                               // create missing cell in order
        cell = doc.createElementNS(ns, "c");
        cell.setAttribute("r", ref);
        let inserted = false;
        for (let i = 0; i < rowCells.length; i++) {
          if (colNumber(rowCells[i].getAttribute("r")) > u.col) {
            rowEl.insertBefore(cell, rowCells[i]); inserted = true; break;
          }
        }
        if (!inserted) rowEl.appendChild(cell);
      }
      makeInline(cell, u.text);
    }
  }

  async function saveSheet(wb, sheetPath, xmlDoc) {
    wb.zip.file(sheetPath, serializer().serializeToString(xmlDoc));
  }

  async function toArrayBuffer(wb) {
    return wb.zip.generateAsync({ type: "arraybuffer",
                                  compression: "DEFLATE",
                                  compressionOptions: { level: 6 } });
  }

  return { openWorkbook, readGrid, applyUpdates, saveSheet, toArrayBuffer,
           colLetter, colNumber, escapeXml };
});

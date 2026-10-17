/* Node harness: run the JS engine on a workbook exactly like the HTML page
 * does, writing <name>_KPJS.xlsx. Usage: node test_node.js file.xlsx */
"use strict";
const fs = require("fs");
const path = require("path");
const KP = require("./kp_logic.js");
const XS = require("./xlsx_surgical.js");

async function processFile(file) {
  const buf = fs.readFileSync(file);
  const wb = await XS.openWorkbook(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  for (const sheet of wb.sheets) {
    const grid = await XS.readGrid(wb, sheet.path);
    const { chart, error } = KP.parseGrid(grid);
    if (!chart) { console.log(`[${sheet.name}] skipped: ${error}`); continue; }
    const { updates, cellsSeen } = KP.computeUpdates(grid, chart);
    XS.applyUpdates(grid.xmlDoc, updates);
    await XS.saveSheet(wb, sheet.path, grid.xmlDoc);
    console.log(`[${sheet.name}] ${cellsSeen} longitude cells, ${updates.length} cells written.`);
    chart.warnings.forEach(w => console.log("  NOTE:", w));
  }
  const out = file.replace(/\.xlsx$/i, "_KPJS.xlsx");
  fs.writeFileSync(out, Buffer.from(await XS.toArrayBuffer(wb)));
  console.log("Saved:", out);
}

processFile(process.argv[2]).catch(e => { console.error(e); process.exit(1); });

"""Rebuild the single-file apps in web/dist/ after editing web/src/.
Usage (from repo root or web/): python web/build_annotator.py"""
import base64
from pathlib import Path

here = Path(__file__).parent
src, vendor, dist = here / "src", here / "vendor", here / "dist"
template = here.parent / "src" / "kala_chakra" / "data" / "chart_template.xlsx"

def libs(*files):
    out = []
    for f in files:
        p = vendor / f if (vendor / f).exists() else src / f
        out.append(f"<script>\n{p.read_text()}\n</script>")
    return "\n".join(out)

# 1) annotator (drag-and-drop for template-style workbooks)
shell = (src / "annotator_shell.html").read_text()
(dist / "KP Annotator.html").write_text(
    shell.replace("<!--LIBS-->", libs("jszip.min.js", "kp_logic.js", "xlsx_surgical.js")))
print("rebuilt dist/KP Annotator.html")

# 2) Kala Chakra (raw SF report -> chart + powers + Excel download)
tpl = base64.b64encode(template.read_bytes()).decode()
shell = (src / "app_shell.html").read_text()
(dist / "Kala Chakra.html").write_text(
    shell.replace("<!--LIBS-->",
        libs("jszip.min.js", "kp_logic.js", "xlsx_surgical.js") +
        f"\n<script>const TEMPLATE_B64 = \"{tpl}\";</script>"))
print("rebuilt dist/Kala Chakra.html")

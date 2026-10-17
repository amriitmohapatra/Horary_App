"""Build the v1.5 KAAST apps (with Vimshottari dasha) into web/dist/.

    python web/build_v15.py

New files only — the v0.95 shells, build script and dist files are untouched.
Outputs: dist/KAAST Caster v1.5.html
         dist/Kala Chakra v1.5.html
"""
import base64
from pathlib import Path

here = Path(__file__).parent
src, vendor, dist = here / "src", here / "vendor", here / "dist"
template = (here.parent.parent / "KP_Automation" / "src" / "kala_chakra"
            / "data" / "chart_template.xlsx")

def js(path):
    return f"<script>\n{path.read_text()}\n</script>"

def b64(path, name):
    return (f"<script>const {name} = "
            f"\"{base64.b64encode(path.read_bytes()).decode()}\";</script>")

engine = "\n".join([
    b64(vendor / "swisseph.wasm", "WASM_B64"),
    b64(vendor / "swisseph.data", "EPHE_B64"),
    js(vendor / "swisseph_glue.js"),
    js(src / "ephemeris.js"),
    js(src / "places.js"),
    js(src / "dasha.js"),
    js(src / "quotes.js"),
])


tpl = base64.b64encode(template.read_bytes()).decode()
shell = (src / "app_shell_v15_od.html").read_text()
out = shell.replace("<!--LIBS-->", "\n".join([
    js(vendor / "jszip.min.js"),
    js(src / "kp_logic.js"),
    js(src / "xlsx_surgical.js"),
    f"<script>const TEMPLATE_B64 = \"{tpl}\";</script>",
    engine,
]))
(dist / "Kala Chakra v1.5 (Odia).html").write_text(out)
print(f"built dist/Kala Chakra v1.5 (Odia).html ({len(out)//1024} KB)")

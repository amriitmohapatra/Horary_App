"""Build the two KAAST single-file apps into web/dist/.

    python web/build.py

Inputs:  web/src/ (shells + JS), web/vendor/ (jszip, swisseph wasm/data/glue),
         and the chart template from ../KP_Automation.
Outputs: dist/KAAST Caster.html      (standalone chart caster)
         dist/Kala Chakra.html       (full app with built-in casting)
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
])

# 1) standalone caster: engine + kp_logic (for KP annotations in the tables)
shell = (src / "caster_shell.html").read_text()
out = shell.replace("<!--LIBS-->", js(src / "kp_logic.js") + "\n" + engine)
(dist / "KAAST Caster.html").write_text(out)
print(f"built dist/KAAST Caster.html ({len(out)//1024} KB)")

# 2) integrated app: everything
tpl = base64.b64encode(template.read_bytes()).decode()
shell = (src / "app_shell.html").read_text()
out = shell.replace("<!--LIBS-->", "\n".join([
    js(vendor / "jszip.min.js"),
    js(src / "kp_logic.js"),
    js(src / "xlsx_surgical.js"),
    f"<script>const TEMPLATE_B64 = \"{tpl}\";</script>",
    engine,
]))
(dist / "Kala Chakra.html").write_text(out)
print(f"built dist/Kala Chakra.html ({len(out)//1024} KB)")

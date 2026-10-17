#!/bin/zsh
# Rebuild: citation gate -> provenance appendix -> PDF
set -e
export PATH="/opt/homebrew/bin:/Library/TeX/texbin:${PATH}"
S=~/.claude/skills/citation-provenance/scripts
python3 $S/verify_refs.py references.bib || true          # MISSING_DOI is expected (manual, software)
python3 $S/check_citations.py --tex main.tex "sections/*.tex" --bib references.bib --ledger citations/provenance.csv
python3 $S/render_provenance.py citations/provenance.csv --tex citations/provenance.tex --md citations/provenance.md
# narrow the landscape ledger so 9 columns plus padding fit the page
python3 - <<'PY'
import re
p='citations/provenance.tex'; s=open(p).read()
s=re.sub(r'p\{(0\.\d+)\\linewidth\}', lambda m: 'p{%.4f\\linewidth}' % (float(m.group(1))*0.92), s)
open(p,'w').write(s)
PY
latexmk -pdf -interaction=nonstopmode main.tex

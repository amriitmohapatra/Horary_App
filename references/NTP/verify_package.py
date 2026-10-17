"""Verify file integrity; optionally repeat all source/split page comparisons."""
from pathlib import Path
import argparse
import hashlib
import json

root = Path(__file__).resolve().parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--render', action='store_true')
args = parser.parse_args()
expected = json.loads((root/'SHA256SUMS.json').read_text())
for name, digest in expected.items():
    actual = hashlib.sha256((root/name).read_bytes()).hexdigest()
    if actual != digest:
        raise SystemExit(f'FAILED file integrity: {name}')
print(f'PASS: {len(expected)} file hashes')
if args.render:
    import pymupdf as fitz
    manifest = json.loads((root/'verification-pages.json').read_text())
    report = json.loads((root/'verification.json').read_text())
    count = 0
    for book in report['books']:
        pages = [r for r in manifest if r['book'] == book['book']]
        assert [r['pdf_page'] for r in pages] == list(range(1, book['pages']+1))
        with fitz.open(root/book['book']/'original'/book['source_filename']) as source:
            assert len(source) == book['pages']
            for row in pages:
                with fitz.open(root/row['section']) as section:
                    a, b = source[row['pdf_page']-1], section[row['section_page']-1]
                    assert a.rect == b.rect
                    assert a.get_text(sort=False) == b.get_text(sort=False)
                    matrix = fitz.Matrix(1.5, 1.5)
                    assert a.get_pixmap(matrix=matrix, alpha=False).samples == b.get_pixmap(matrix=matrix, alpha=False).samples
                    count += 1
        print(f"PASS: {book['book']} - {book['pages']} pages")
    assert count == report['total_pages']
    print(f'PASS: all {count} source/split pages match')

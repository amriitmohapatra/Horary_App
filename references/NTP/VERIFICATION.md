# Verification result

**PASS: all 381 supplied PDF pages are preserved.**

| Volume | Source pages | PDF sections | Missing / duplicated pages | Original copy hash |
| --- | ---: | ---: | --- | --- |
| ntp-1 | 159 | 16 | 0 / 0 | Identical |
| ntp-2 | 182 | 19 | 0 / 0 | Identical |
| ntp-3 | 40 | 4 | 0 / 0 | Identical |

All 381 source/split comparisons passed: rendered RGB pixels at 108 dpi, extracted embedded text, and page dimensions. The split operation copied original PDF page content without rasterizing or replacing it. All three supplied originals were copied byte-for-byte and checked by SHA-256, and the source files were unchanged after processing. Original copies retain document-level information that may not carry over to split sections.

All 381 pages were also processed with English Tesseract OCR at 216 dpi. There are 39 embedded-text sections and 39 fresh-OCR sections. Every section has explicit source-page delimiters. The saved strings were checked against extraction/OCR outputs for each page.

Native text was empty on: ntp-1:1. Fresh OCR had no recognized words on: no pages. These pages are still present in both text versions with a page marker, as well as in the PDFs. There are 9 pages with mean OCR confidence below 70 or no recognized words; confidence is a screening signal, not a measured accuracy rate. All page-level metrics are in `page-manifest.csv`.

Representative source and final split pages were visually inspected, including a table and an illustrated page. Every page received the automated render/text comparison. **No manual word-by-word proofreading of all pages was performed.**

## What this result does and does not establish

No page or visual information from the supplied PDFs was discarded from the package: the originals are unchanged, and every page is additionally available in a verified small PDF section. The rendered comparison is a check at the stated resolution; byte-identical original copies provide the archival preservation guarantee.

Neither text version is a lossless semantic transcription. Observed OCR errors include misspelled words, decorative symbols read as letters, and table reading-order problems. Some table entries can disappear from one OCR reading while remaining visible on the PDF page. Numbers, non-English scripts, charts, and formulas require checking the visual page. The new OCR is supplied as an alternative reading, not certified ground truth.

Completeness is measured against the three files supplied by the user, not against physical editions of the books. This process cannot identify material already absent, illegible, cropped, or mistranscribed in those supplied files.

## Recheck after transfer

Run `python3 verify_package.py` from the extracted package to validate every file against `SHA256SUMS.json`. To repeat the 381 page comparisons, install PyMuPDF if necessary and run `python3 verify_package.py --render`. The integrity-only check uses the Python standard library.

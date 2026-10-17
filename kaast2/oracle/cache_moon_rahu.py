"""Extract Moon and Rahu from PL7's transit cache into a test fixture.

    python oracle/cache_moon_rahu.py <PL7 Temp dir> tests/fixtures/pl7_cache_moon_rahu.json

Cache layout (PL7 report, sec. "The transit viewer and its cache"): each
monthly *.e31 file holds two doubles (start/end JD, UT) at byte 8, then one
double array per body at byte 840 + 512*i, sampled every 0.5 day, body order
Su Mo Ma Me Ju Ve Sa Ra. Only the Moon and Rahu are trustworthy (the other
planets carry this copy's Moon-vector defect), and only through 2048.
We keep 4 samples per month (days 0, 7.5, 15, 22.5) to keep the fixture small.
Standard library only.
"""
import json, struct, sys
from pathlib import Path

ORDER = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra"]
SAMPLE_STEPS = [0, 15, 30, 45]  # half-day steps

def read(path):
    e = path.read_bytes()
    jd0, jd1 = struct.unpack_from("<dd", e, 8)
    n = int(round((jd1 - jd0) * 2)) + 1
    body = lambda i: struct.unpack_from("<%dd" % n, e, 840 + 512 * i)
    return jd0, n, body(ORDER.index("Mo")), body(ORDER.index("Ra"))

def main(src, out):
    rows = []
    for f in sorted(Path(src).glob("*.e31")):
        jd0, n, mo, ra = read(f)
        if jd0 >= 2469442.5:      # 2049-01-01 0h UT: PL7 falls back to approx.dat
            continue
        for k in SAMPLE_STEPS:
            if k < n:
                rows.append([round(jd0 + k / 2, 6), round(mo[k], 9), round(ra[k], 9)])
    rows.sort()
    json.dump({"_source": "PL7 transit cache (*.e31), Moon and Rahu sidereal longitudes in degrees at JD(UT); "
               "extracted by oracle/cache_moon_rahu.py; months 2020-01..2048-12",
               "columns": ["jdUT", "moonDeg", "rahuDeg"], "rows": rows}, open(out, "w"))
    print(f"{len(rows)} samples from {rows[0][0]} to {rows[-1][0]}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])

#!/usr/bin/env python3
"""KAAST 2 oracle: literal floating-point port of the 31 PL7 varga routines.

Source: Astro_Fork/GeoVision/PL7/PL7.exe (sha256 e530a346...35f9), disassembled
with capstone (x86-32). Dispatcher fcn.0057d9cf is a 31-way jump table at
0x57db65 indexed by list position 1..31; divisor byte table at 0x5f47b8.
Each routine takes (d = degrees in sign, s = sign 1..12, Aries = 1) and returns
the varga longitude in degrees, normalised by fcn.0045b106 to [0, 360]
(note: 360 itself is NOT folded to 0). The caller converts it to a 1-based
sign with fcn.0057d1b3: 1 - _ftol(L * -1/30).

The port keeps the program's own constants (e.g. 0.1333.. for 4/30, the
1.50000000015 factor of D45) and its MSVCRT helpers (fmod, _ftol = trunc).
For the seven rules re-implemented in the PL7 report (scripts/pl7_vargas.py)
the port is checked against that script before the fixture is written.

Writes kaast2/tests/fixtures/varga_pl7_bin.json:
  - for each position: routine address, divisor, and the sign (0 = Aries) of
    every amsa of every sign, sampled at the amsa midpoint;
  - signs at 500 pseudo-random arcsecond longitudes (+0.5 arcsec, i.e. the
    middle of the arcsecond, so no sample sits on an amsa boundary).

Run:  python kaast2/oracle/vargas_pl7_bin.py      (stdlib only)
"""
import importlib.util
import json
import math
import os
import random

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(ROOT, "kaast2", "tests", "fixtures", "varga_pl7_bin.json")
REPORT_SCRIPT = os.path.join(ROOT, "Astro_Fork", "PL7_Reverse_Engineering_Report", "scripts", "pl7_vargas.py")

# byte table at 0x5f47b8 (index 0 unused)
DIV = [0, 1, 2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60, 5, 6, 8, 11, 150, 2, 2, 3, 4, 10, 12, 30, 5, 16, 11]
IDS = ["", "D1", "D2", "D3", "D4", "D7", "D9", "D10", "D12", "D16", "D20", "D24", "D27", "D30", "D40", "D45", "D60",
       "D5", "D6", "D8", "D11", "D150", "D2-alt1", "D2-alt2", "D3-alt", "D4-alt", "D10-alt", "D12-alt", "D30-alt",
       "D5-alt", "D16-alt", "D11-alt"]

trunc = math.trunc          # MSVCRT _ftol (truncation toward zero)
fmod = math.fmod


def n360(x):                # fcn.0045b106
    while x < 0.0:
        x += 360.0
    while x > 360.0:
        x -= 360.0
    return x


def generic(lon, pos):      # fcn.0057d1e1
    return n360(DIV[pos] * lon)


def d2(d, s):               # fcn.0057d207
    odd = s % 2 == 1
    hi = d > 15.0
    x = d + d
    if not odd:
        x += 90.0
    elif hi:
        x += 60.0
    else:
        x += 120.0
    return n360(x)


def d2_alt2(d, s):          # fcn.0057d260
    x = d * 0.06666666666666667
    f = fmod(x, 1.0)
    if s % 2 == 1:
        base = s + 5 if d < 15.0 else s + 11
    else:
        base = s - 1 if d < 15.0 else s + 5
    return n360((f + base) * 30.0)


def d3(d, s):               # fcn.0057d2f3
    x = d * 0.1
    return n360((fmod(x, 1.0) + (s + trunc(x) * 4 - 1)) * 30.0)


def d4(d, s):               # fcn.0057d350
    x = d * 0.13333333333333333
    k = trunc(x)
    return n360((fmod(x, 1.0) + (s + 2 * k + k - 1)) * 30.0)


def d5(d, s):               # fcn.0057d397 (degree part scaled by 0.2, as in the binary)
    c = 1 - trunc(d * -0.16666666666666666)
    if s % 2 == 1:
        t = {1: (0.0, 0.0), 2: (6.0, 300.0), 3: (12.0, 240.0), 4: (18.0, 60.0), 5: (24.0, 180.0)}
    else:
        t = {1: (0.0, 30.0), 2: (6.0, 150.0), 3: (12.0, 330.0), 4: (18.0, 270.0), 5: (24.0, 210.0)}
    if c not in t:
        return 0.0
    sub, add = t[c]
    return n360((d - sub) * 0.2 + add)


def d6(d, s):               # fcn.0057d4dc
    x = d * 0.2
    if s % 2 != 1:
        x += 6.0
    return n360(x * 30.0)


def d8(d, s):               # fcn.0057d510
    x = d * 0.26666666666666666
    r = s % 3
    if r == 0:
        x += 4.0
    elif r == 2:
        x += 8.0
    return n360(x * 30.0)


def d10(d, s):              # fcn.0057d55c
    x = d * 0.3333333333333333
    return n360((x + ((s - 1) if s % 2 == 1 else (s + 7))) * 30.0)


def d11(d, s):              # fcn.0057d5a6
    return n360((d * 0.3666666666666667 + (1 - s)) * 30.0)


def d11_alt(d, s):          # fcn.0057d5d6
    return n360((1.0 - d * 0.3666666666666667) * 30.0)


def d12(d, s):              # fcn.0057d647
    return n360((d * 0.4 + (s - 1)) * 30.0)


def d16_alt(d, s):          # fcn.0057d5fb
    x = d * 0.5333333333333333
    return n360(((s - 1) + x if s % 2 == 1 else (s + 3) - x) * 30.0)


def d24(d, s):              # fcn.0057d675
    x = d * 0.8
    x += 4.0 if s % 2 == 1 else 3.0
    return n360(x * 30.0)


def d30(d, s):              # fcn.0057d6b1 (comparisons are 'd > limit': limits belong to the lower part)
    if s % 2 == 1:
        if not d > 5.0:
            x = d * 0.2
        elif not d > 10.0:
            x = (d - 5.0) * 0.2 + 300.0
        elif not d > 18.0:
            x = (d - 10.0) * 0.125 + 240.0
        elif not d > 25.0:
            x = (d - 18.0) * 0.14285714285714285 + 60.0
        else:
            x = (d - 25.0) * 0.2 + 180.0
    else:
        if not d > 5.0:
            x = d * 0.2 + 30.0
        elif not d > 12.0:
            x = (d - 5.0) * 0.14285714285714285 + 150.0
        elif not d > 20.0:
            x = (d - 12.0) * 0.125 + 330.0
        elif not d > 25.0:
            x = (d - 20.0) * 0.2 + 270.0
        else:
            x = (d - 25.0) * 0.2 + 210.0
    return n360(x)


def d40(d, s):              # fcn.0057d7ea
    x = d * 1.3333333333333333
    if s % 2 != 1:
        x += 6.0
    return n360(x * 30.0)


def d45(d, s):              # fcn.0057d81e
    x = d * 1.50000000015
    r = s % 3
    if r == 0:
        x += 8.0
    elif r == 2:
        x += 4.0
    return n360(x * 30.0)


def d60(d, s):              # fcn.0057d86a
    return n360((d + d + (s - 1)) * 30.0)


ROUTINE = {2: (d2, 0x57d207), 3: (d3, 0x57d2f3), 4: (d4, 0x57d350), 7: (d10, 0x57d55c), 8: (d12, 0x57d647),
           11: (d24, 0x57d675), 13: (d30, 0x57d6b1), 14: (d40, 0x57d7ea), 15: (d45, 0x57d81e), 16: (d60, 0x57d86a),
           17: (d5, 0x57d397), 18: (d6, 0x57d4dc), 19: (d8, 0x57d510), 20: (d11, 0x57d5a6), 23: (d2_alt2, 0x57d260),
           30: (d16_alt, 0x57d5fb), 31: (d11_alt, 0x57d5d6)}


def dispatch(lon, pos):     # fcn.0057d9cf
    s = int(lon // 30.0) + 1
    d = lon - 30.0 * (s - 1)
    if pos == 1:
        return lon
    if pos in ROUTINE:
        return ROUTINE[pos][0](d, s)
    return generic(lon, pos)


def sign0(L):               # fcn.0057d1b3, returned 0-based; 13 (L == 360) would be an out-of-range sign
    s1 = 1 - trunc(L * -0.03333333333333333)
    assert 1 <= s1 <= 12, L
    return s1 - 1


def check_against_report():
    spec = importlib.util.spec_from_file_location("pl7_vargas", REPORT_SCRIPT)
    rep = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(rep)
    pairs = {7: rep.d10, 11: rep.d24, 18: rep.d6, 19: rep.d8, 20: rep.d11, 30: rep.d16_alt, 31: rep.d11_alt}
    rng = random.Random(7)
    for pos, f in pairs.items():
        for _ in range(4000):
            lon = rng.uniform(0, 360)
            s = int(lon // 30) + 1
            d = lon - 30 * (s - 1)
            if d < 1e-6:
                continue
            assert sign0(dispatch(lon, pos)) == sign0(f(d, s)), (pos, lon)
    for s in range(1, 13):
        assert sign0(dispatch((s - 1) * 30 + 0.01, 6)) == sign0(rep.generic((s - 1) * 30 + 0.01, 9))
    return {IDS[p]: [rep.SIGNS.index(rep.sign_of(f(0.01, s))) for s in range(1, 13)] for p, f in pairs.items()}


def main():
    report_first = check_against_report()
    rng = random.Random(20261017)
    lons = sorted(rng.randrange(0, 1_296_000) for _ in range(498)) + [0, 1_295_999]
    out = {
        "source": "kaast2/oracle/vargas_pl7_bin.py — literal port of PL7.exe varga routines (dispatcher fcn.0057d9cf)",
        "sampling": "amsa midpoints; random longitudes evaluated at arcsec + 0.5",
        "reportFirstAmsa": report_first,
        "longitudes": lons,
        "positions": [],
    }
    for pos in range(1, 32):
        n = DIV[pos]
        table = []
        for s in range(1, 13):
            table.append([sign0(dispatch((s - 1) * 30.0 + (k + 0.5) * 30.0 / n, pos)) for k in range(n)])
        addr = 0 if pos == 1 else ROUTINE.get(pos, (None, 0x57d1e1))[1]
        out["positions"].append({
            "position": pos, "id": IDS[pos], "divisor": n,
            "routine": "identity" if pos == 1 else f"fcn.{addr:08x}",
            "amsaTable": table,
            "signs": [sign0(dispatch((a + 0.5) / 3600.0, pos)) for a in lons],
        })
    with open(OUT, "w") as fh:
        json.dump(out, fh, separators=(",", ":"))
        fh.write("\n")
    print(f"wrote {OUT}: 31 positions, {len(lons)} longitudes; port agrees with scripts/pl7_vargas.py")


if __name__ == "__main__":
    main()

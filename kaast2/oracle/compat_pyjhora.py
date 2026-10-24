#!/usr/bin/env python3
"""KAAST 2 oracle: PyJHora's marriage matching (Ashtakoota + 10 porutham).

PyJHora (pip install PyJHora; tested with 4.8.7) has an independent
implementation of the North Indian Ashtakoota (36 points) and of the South
Indian porutham system in jhora/horoscope/match/compatibility.py
(class Ashtakoota). This script runs it on synthetic (boy, girl) Moon
nakshatra + pada pairs -- no birth data, no real people -- and writes
tests/fixtures/compat_pyjhora.json.

Each case records
  inputs     for boy and girl: Moon nakshatra 1..27, pada 1..4, Moon sign 1..12
             (PyJHora's own sign-from-pada), the pada-midpoint sidereal Moon
             longitude and its degree within the sign (PL 7 needs the degree
             for Vashya in Sagittarius/Capricorn and the absolute longitude for
             Gothra; PyJHora needs neither).
  pyjhora.north   PyJHora method="North": the 8 koota scores, the total of 36,
             and the four extra checks (mahendra, vedha, rajju, sthree_dheerga)
             that PyJHora returns with them (True = porutham present).
  pyjhora.south   PyJHora method="South": the 10 poruthams as booleans (dina,
             gana, mahendra, sthree_dheerga, yoni, rasi, rasyadhipati, vasya,
             rajju, vedha), their count out of 10, and PyJHora's "minimum
             porutham" flag.
  pl_model   The PL 7 rules as read from PL7.exe and written down in
             docs/specs/compatibility.md, executed in Python. This is NOT an
             oracle: it is the spec restated as code, so a TypeScript port can
             be diffed against the spec and so the PL-vs-PyJHora differences
             are counted. It must be regenerated if the spec changes.

Boy/girl convention: PyJHora's Ashtakoota(boy_nak, boy_pada, girl_nak,
girl_pada). In PL 7 the koota object holds the bride as "A" and the groom as
"B" (see the spec, section 1.3).

Run (from the repo root):
  <venv>/bin/python -I kaast2/oracle/compat_pyjhora.py
"""
import contextlib
import io
import json
import os
import random

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(ROOT, "kaast2", "tests", "fixtures", "compat_pyjhora.json")

with contextlib.redirect_stdout(io.StringIO()):  # PyJHora prints notes on import
    import jhora  # noqa: E402
    from jhora.horoscope.match import compatibility as cm  # noqa: E402

NAK = 360.0 / 27.0
PADA = NAK / 4.0


def moon_lon(nak, pada):
    """Pada-midpoint sidereal longitude (degrees 0..360)."""
    return (nak - 1) * NAK + (pada - 0.5) * PADA


# --------------------------------------------------------------------------
# PL 7 model (spec restated as code; A = bride/girl, B = groom/boy)
# --------------------------------------------------------------------------
SIGN_LORD = [None, 3, 6, 4, 2, 1, 4, 6, 3, 5, 7, 7, 5]  # PL7.exe 0x5f47a8
# PL7.exe 0x613600: naisargika relation row "a toward b", planets 1..7 (Su..Sa)
REL = {
    1: [0, 1, 1, 0, 1, -1, -1], 2: [1, 0, 0, 1, 0, 0, 0], 3: [1, 1, 0, -1, 1, 0, 0],
    4: [1, -1, 0, 0, 0, 1, 0], 5: [1, 1, 1, -1, 0, -1, 0], 6: [-1, -1, 0, 1, 0, 0, 1],
    7: [-1, -1, -1, 1, 0, 1, 0],
}


def rel(a, b):
    return REL[a][b - 1]


YONI = [1, 2, 3, 4, 4, 5, 6, 3, 6, 7, 7, 8, 9, 10, 9, 10, 11, 11, 5, 12, 13, 12, 14, 1, 14, 8, 2]
YONI_BITS = {1: -4, 2: 2, 3: 1, 4: 32, 5: -128, 6: 16, 7: -16, 8: -8, 9: 4, 10: 8, 11: -2, 12: -1, 13: 64, 14: 256}
# PL7.exe 0x452d0a (14x14, Horse..Lion, symmetric)
YONI_M = [
    [4, 2, 3, 2, 2, 3, 3, 2, 0, 1, 3, 2, 2, 1],
    [2, 4, 3, 2, 2, 3, 2, 3, 3, 1, 3, 2, 2, 0],
    [3, 3, 4, 2, 2, 3, 2, 3, 3, 1, 3, 0, 2, 1],
    [2, 2, 2, 4, 2, 1, 1, 2, 2, 2, 2, 1, 0, 2],
    [2, 2, 2, 2, 4, 1, 1, 2, 2, 2, 0, 2, 2, 2],
    [3, 3, 3, 1, 1, 4, 0, 3, 3, 2, 3, 2, 2, 2],
    [3, 2, 2, 1, 1, 0, 4, 3, 3, 2, 3, 2, 1, 2],
    [2, 3, 3, 2, 2, 3, 3, 4, 3, 0, 3, 2, 2, 1],
    [0, 3, 3, 2, 2, 3, 3, 3, 4, 1, 3, 2, 2, 1],
    [1, 1, 1, 2, 2, 2, 2, 0, 1, 4, 1, 2, 2, 3],
    [3, 3, 3, 2, 0, 3, 3, 3, 3, 1, 4, 2, 2, 1],
    [2, 2, 0, 1, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2],
    [2, 2, 2, 0, 2, 2, 1, 2, 2, 2, 2, 2, 4, 2],
    [1, 0, 1, 2, 2, 2, 2, 1, 1, 3, 1, 2, 2, 4],
]
DEVA = {1, 5, 7, 8, 13, 15, 17, 22, 27}
RAKSHASA = {3, 9, 10, 14, 16, 18, 19, 23, 24}
NADI = [1, 2, 3, 3, 2, 1] * 4 + [1, 2, 3]
RAJJU = [1, 2, 3, 4, 5, 4, 3, 2, 1] * 3
MALE = {1, 3, 4, 7, 8, 13, 17, 25, 26, 27}
FEMALE = {2, 6, 9, 10, 11, 12, 14, 15, 16, 18, 20, 21, 22, 23}
HERM = {5, 19, 24}
VEDHA = {(1, 18), (2, 17), (3, 16), (4, 15), (6, 22), (7, 21), (8, 20), (9, 19), (10, 27), (11, 26),
         (12, 25), (13, 24), (5, 14), (5, 23), (14, 23)}
VASYA_OF = {1: {10, 11}, 2: set(), 3: {6}, 4: {8, 2}, 5: {1, 2}, 6: {3, 8}, 7: {5}, 8: {1, 4},
            9: {4}, 10: {7, 12}, 11: {10}, 12: {9, 6}}
GOTHRA_EDGES = [53.3333333333333, 106.6666666666666, 159.9999999999999, 213.3333333333332,
                266.6666666666665, 306.6666666666659]


def gana(n):
    return 1 if n in DEVA else 3 if n in RAKSHASA else 2


def varna(r, x):
    m = r % 4  # 1 fire, 2 earth, 3 air, 0 water
    return {1: 3, 0: 4}.get(m, (2 if x == 0 else 1) if m == 2 else (1 if x == 0 else 2))


def vashya_class(r, deg):
    if r == 9:
        return 2 if deg <= 15.0 else 1
    if r == 10:
        return 1 if deg <= 15.0 else 3
    return [None, 1, 1, 2, 3, 4, 2, 2, 5, None, None, 2, 3][r]


def lords_friendly(ra, rb):
    """PL7.exe 0x452565: same lord, signs 1/7 apart, or naisargika mutual friends."""
    la, lb = SIGN_LORD[ra], SIGN_LORD[rb]
    if la == lb or ra == rb + 6 or ra == rb - 6:
        return True
    return rel(lb, la) + rel(la, lb) == 2


class PL:
    def __init__(self, girl, boy):
        self.na, self.ra, self.da, self.la = girl["nak"], girl["sign"], girl["deg_in_sign"], girl["lon"]
        self.nb, self.rb, self.db, self.lb = boy["nak"], boy["sign"], boy["deg_in_sign"], boy["lon"]

    # --- Ashtakoota ---------------------------------------------------
    def varna(self, x):
        return 1.0 if varna(self.ra, x) <= varna(self.rb, x) else 0.0

    def vashya(self):
        a, b = vashya_class(self.ra, self.da), vashya_class(self.rb, self.db)
        if a == b:
            return 2.0
        if a == 4:
            return 0.0
        if b == 1:
            return 1.0
        if a + b == 5:
            return 0.5
        if a + b == 9:
            return 0.0
        if b == 5 or a == 5:
            return 1.0
        if a == 2:
            return 0.0
        return 1.0

    def tara(self):
        c = (self.nb - self.na + 27) % 9 + 1
        return 3.0 if c < 3 else 1.5

    def yoni(self, mode):
        ya, yb = YONI[self.na - 1], YONI[self.nb - 1]
        if mode == 1:
            ca, cb = YONI_BITS[ya], YONI_BITS[yb]
            if cb == -ca or ca + cb in (16, 96, -126):
                return 0.0
            return 4.0 if ca == cb else 2.0
        return float(YONI_M[ya - 1][yb - 1])

    def maitri(self):
        la, lb = SIGN_LORD[self.ra], SIGN_LORD[self.rb]
        s = 2 if la == lb else rel(lb, la) + rel(la, lb)
        return {2: 5.0, 1: 4.0, 0: 1.0, -1: 0.5, -2: 0.0}[s]

    def gana(self, mode):
        code = 10 * gana(self.na) + gana(self.nb)
        sc = {11: 6.0, 12: 5.0, 13: 1.0, 21: 6.0, 22: 6.0, 33: 6.0}.get(code, 0.0)
        if mode == 1 and lords_friendly(self.ra, self.rb) and sc < 3.0:
            sc = 3.0
        return sc

    def bhakoot(self):
        c = (self.rb - self.ra) % 12 + 1
        return 7.0 if c in (1, 3, 4, 7, 10, 11) else 0.0

    def nadi(self):
        return 8.0 if NADI[self.na - 1] != NADI[self.nb - 1] else 0.0

    # --- Dashakoota (Kalaprakasika, X1) --------------------------------
    def dina(self, x):
        a, b = self.na, self.nb
        t = (b - a + 27) % 9 + 1
        sc, code = (3.0, 1) if t in (2, 4, 6, 8) else (0.0, 2)
        if x != 1:
            return sc, code
        if t == 1:
            sc, code = 1.5, 26
        elif t in (2, 4, 6, 8, 9):
            sc, code = 3.0, 1
        else:
            sc, code = 0.0, 2
        if t == 5:
            sc, code = 0.0, 7
        if (b, a) in {(3, 9), (9, 15), (14, 20), (17, 23), (23, 2), (24, 3)}:
            sc, code = 0.0, 9
        if (b, a) in {(6, 12), (11, 17), (14, 8), (7, 13)}:
            sc, code = 3.0, 10
        if (b, a) == (7, 13):
            sc, code = 3.0, 11
        if (b, a) == (18, 24):
            sc, code = 0.0, 12
        if (b, a) == (12, 5):
            sc, code = 0.0, 13
        if (b, a) == (13, 19):
            sc, code = 0.0, 14
        for pairs, c in (({(4, 10), (25, 4)}, 15), ({(1, 7), (15, 21)}, 16), ({(27, 6), (18, 12)}, 17),
                         ({(16, 10)}, 18), ({(16, 22)}, 19), ({(1, 22)}, 20), ({(26, 5)}, 21),
                         ({(21, 27)}, 22), ({(19, 25)}, 23), ({(20, 26)}, 24), ({(2, 8)}, 25)):
            if (b, a) in pairs:
                code = c
        if b == a:
            sc, code = 1.5, 26
            if b in (4, 6, 10, 13, 16, 22, 26, 27):
                sc, code = 3.0, 27
            if b in (2, 9, 15, 18, 19, 23, 24, 25):
                sc, code = 0.0, 28
        return sc, code

    def mahendra(self):
        return 2.0 if (self.nb - self.na + 27) % 27 + 1 in (4, 7, 10, 13, 16, 19, 22, 25) else 0.0

    def stree(self):
        return 2.0 if (self.nb - self.na + 27) % 27 + 1 > 13 else 0.0

    def rasi(self, x):
        k = (self.rb - self.ra + 12) % 12
        if k == 0 or k >= 6:
            sc = 7.0
        elif k == 1:
            sc = 3.5 if (x == 1 and self.ra % 2 == 0) else 0.0
        else:
            sc = 0.0
        if x == 1:
            if (self.ra, self.rb) in {(1, 6), (9, 2), (7, 12), (11, 4), (5, 10), (3, 8)}:
                sc = 3.5
            if sc < 3.5 and lords_friendly(self.ra, self.rb):
                sc = 3.5
        return sc

    def vasya(self):
        return 2.0 if (self.ra in VASYA_OF[self.rb] or self.rb in VASYA_OF[self.ra]) else 0.0

    def rajju(self, x):
        sc = 0.0 if RAJJU[self.na - 1] == RAJJU[self.nb - 1] else 8.0
        if x == 1 and lords_friendly(self.ra, self.rb):
            sc = 4.0
        return sc

    def vedha(self, x):
        sc = 0.0 if ((self.na, self.nb) in VEDHA or (self.nb, self.na) in VEDHA) else 2.0
        if x == 1 and lords_friendly(self.ra, self.rb):
            sc = 1.0
        return sc

    def gender(self):
        a, b = self.na, self.nb
        sc = 0.0
        if b in MALE and a in FEMALE:
            sc = 1.0
        if b in MALE and a in MALE:
            sc = 0.5
        if b in FEMALE and a in FEMALE:
            sc = 0.5
        if b in HERM and a in HERM:
            sc = 0.5
        if b in HERM and a in FEMALE:
            sc = 0.5
        if a in HERM and b in FEMALE:
            sc = 0.5
        if b in HERM and a in MALE:
            sc = 0.5
        if a in HERM and b in MALE:
            sc = 0.5
        if b in FEMALE and a in MALE:
            sc = 0.0
        return sc

    def gothra(self):
        g = lambda lon: next((i + 1 for i, e in enumerate(GOTHRA_EDGES) if lon < e), 7)
        return 1.0 if g(self.la) != g(self.lb) else 0.0

    def result(self):
        ak = {
            "varna": self.varna(0), "vashya": self.vashya(), "tara": self.tara(), "yoni": self.yoni(0),
            "graha_maitri": self.maitri(), "gana": self.gana(0), "bhakoot": self.bhakoot(), "nadi": self.nadi(),
        }
        ak["total"] = sum(ak.values())
        dina_sc, dina_code = self.dina(1)
        dk = {
            "dina": dina_sc, "dina_text_code": dina_code, "gana": self.gana(1), "mahendra": self.mahendra(),
            "stree_deergha": self.stree(), "yoni": self.yoni(1), "rasi": self.rasi(1),
            "rasyadhipati": self.maitri(), "vasya": self.vasya(), "rajju": self.rajju(1), "vedha": self.vedha(1),
            "gender": self.gender(), "gothra": self.gothra(), "caste": self.varna(1),
        }
        dk["total_kalaprakasika_of_44"] = sum(v for k, v in dk.items() if k != "dina_text_code")
        bvr = (self.rasi(0) + self.dina(0)[0] + self.gana(0) + self.varna(0) + self.yoni(0) + self.vasya()
               + self.nadi() + self.maitri())
        return {"ashtakoota": ak, "dashakoota": dk, "total_bv_raman_of_36": bvr}


# --------------------------------------------------------------------------
def person(nak, pada):
    a = cm.Ashtakoota(nak, pada, nak, pada)
    sign = a._raasi_from_nakshatra_pada(nak, pada)
    lon = moon_lon(nak, pada)
    return {"nak": nak, "pada": pada, "sign": sign, "lon": round(lon, 6), "deg_in_sign": round(lon - (sign - 1) * 30.0, 6)}


def pyjhora(boy, girl):
    n = cm.Ashtakoota(boy["nak"], boy["pada"], girl["nak"], girl["pada"], method="North").compatibility_score()
    s = cm.Ashtakoota(boy["nak"], boy["pada"], girl["nak"], girl["pada"], method="South").compatibility_score()
    north = {
        "varna": n[0], "vashya": n[1], "gana": n[2], "tara": n[3], "yoni": n[4], "graha_maitri": n[5],
        "bhakoot": n[6], "nadi": n[7], "total": n[8],
        "mahendra": bool(n[9]), "vedha_ok": bool(n[10]), "rajju_ok": bool(n[11]), "sthree_dheerga": bool(n[12]),
    }
    b = lambda v: bool(v)
    south = {
        "dina": b(s[3]), "gana": b(s[2]), "mahendra": b(s[9]), "sthree_dheerga": b(s[12]), "yoni": b(s[4]),
        "rasi": b(s[6]), "rasyadhipati": b(s[5]), "vasya": b(s[1]), "rajju": b(s[11]), "vedha": b(s[10]),
        "count_of_10": int(s[8]), "minimum_porutham": b(s[13]),
    }
    return {"north": north, "south": south}


def main():
    rng = random.Random(20261024)
    pairs = []
    # edge cases first: same star, same sign different star, star pairs that
    # trigger PL's Dina/Vedha/Rajju special cases, 2/12, 6/8, 5/9 signs
    edge = [((4, 2), (4, 2)), ((2, 1), (2, 1)), ((1, 1), (2, 3)), ((13, 1), (7, 1)), ((9, 1), (3, 1)),
            ((24, 2), (18, 3)), ((5, 1), (14, 3)), ((19, 2), (9, 4)), ((10, 1), (27, 4)), ((20, 3), (21, 2)),
            ((22, 1), (21, 4)), ((1, 1), (5, 4)), ((16, 2), (10, 1)), ((12, 4), (6, 1))]
    for (bn, bp), (gn, gp) in edge:
        pairs.append(((bn, bp), (gn, gp)))
    while len(pairs) < 80:
        pairs.append(((rng.randint(1, 27), rng.randint(1, 4)), (rng.randint(1, 27), rng.randint(1, 4))))

    cases, diffs = [], {}
    for i, ((bn, bp), (gn, gp)) in enumerate(pairs):
        boy, girl = person(bn, bp), person(gn, gp)
        with contextlib.redirect_stdout(io.StringIO()):
            pj = pyjhora(boy, girl)
        pl = PL(girl, boy).result()
        for k in ("varna", "vashya", "tara", "yoni", "graha_maitri", "gana", "bhakoot", "nadi", "total"):
            if abs(float(pj["north"][k]) - pl["ashtakoota"][k]) > 1e-9:
                diffs[k] = diffs.get(k, 0) + 1
        cases.append({"id": f"S{i + 1:02d}", "boy": boy, "girl": girl, "pyjhora": pj, "pl_model": pl})

    doc = {
        "_source": "PyJHora %s jhora.horoscope.match.compatibility.Ashtakoota; pl_model = docs/specs/compatibility.md "
                   "restated in Python (not an oracle)" % getattr(jhora, "__version__", "4.8.7"),
        "_generator": "kaast2/oracle/compat_pyjhora.py (seed 20261024)",
        "_conventions": {
            "nak": "1..27 Ashwini..Revati", "pada": "1..4", "sign": "1..12 Aries..Pisces (PyJHora sign from pada)",
            "lon": "pada-midpoint sidereal longitude, degrees", "pyjhora.north": "points; *_ok/mahendra/sthree booleans "
            "= porutham present", "pyjhora.south": "True = porutham present",
            "pl_model.ashtakoota": "PL 7 X0 rules", "pl_model.dashakoota": "PL 7 X1 (Kalaprakasika) rules",
        },
        "_pl_vs_pyjhora_north_disagreements": diffs,
        "cases": cases,
    }
    with open(OUT, "w") as f:
        json.dump(doc, f, indent=1)
        f.write("\n")
    print(f"wrote {OUT}: {len(cases)} cases; PL-model vs PyJHora North disagreements per koota: {diffs}")


if __name__ == "__main__":
    main()

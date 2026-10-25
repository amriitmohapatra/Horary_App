#!/usr/bin/env python3
"""KAAST 2 oracle: Parashara's Light Page-1 strength fields, prototype.

Computes every strength-related field of PL Page 1 for the fixture
kaast2/tests/fixtures/pl9_page1_amitabh.json and prints computed vs fixture.
The rules are specified (with grades and sources) in
kaast2/docs/spec/PAGE1_SPEC.md; section numbers are quoted as [S x.y].

Run:  python kaast2/oracle/page1_strengths.py [--ephe PATH] [--verbose]
Exit code 0 when every field the spec marks NUM matches the fixture.
"""
import argparse
import json
import math
import os
import sys

import swisseph as swe

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
FIXDIR = os.path.join(ROOT, "kaast2", "tests", "fixtures")
DEFAULT_EPHE = os.path.join(ROOT, "KP_Automation", "src", "kala_chakra", "data", "swefiles")

PL = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"]
P9 = PL + ["Ra", "Ke"]
PID = {p: i + 1 for i, p in enumerate(P9)}          # PL planet ids 1..9
BODY = {"Su": swe.SUN, "Mo": swe.MOON, "Ma": swe.MARS, "Me": swe.MERCURY,
        "Ju": swe.JUPITER, "Ve": swe.VENUS, "Sa": swe.SATURN}
SIGN_LORD = ["Ma", "Ve", "Me", "Mo", "Su", "Me", "Ve", "Ma", "Ju", "Sa", "Sa", "Ju"]  # Ar..Pi [S 0]

# ---------------------------------------------------------------- tables (BIN unless noted)
# Natural relationship, row = planet's view of column; 2 friend, 1 neutral, 0 enemy [S 3.1]
NAT = {
    "Su": (1, 2, 2, 1, 2, 0, 0, 0, 0), "Mo": (2, 1, 1, 2, 1, 1, 1, 0, 0),
    "Ma": (2, 2, 1, 0, 2, 1, 1, 0, 2), "Me": (2, 0, 1, 1, 1, 2, 1, 1, 1),
    "Ju": (2, 2, 2, 0, 1, 0, 1, 1, 1), "Ve": (0, 0, 1, 2, 1, 1, 2, 2, 2),
    "Sa": (0, 0, 0, 2, 1, 2, 1, 2, 0), "Ra": (0, 0, 0, 1, 2, 2, 2, 1, 0),
    "Ke": (0, 0, 2, 1, 1, 2, 0, 0, 1)}
DEBIL_DEG = {"Su": 190, "Mo": 213, "Ma": 118, "Me": 345, "Ju": 275, "Ve": 177, "Sa": 20}
# 0-based signs. MT sign + open interval of degrees, own signs, debilitation sign  [S 3.1]
MT = {"Su": (4, 0, 20), "Mo": (1, 3, 30), "Ma": (0, 0, 12), "Me": (5, 15, 20), "Ju": (8, 0, 10),
      "Ve": (6, 0, 15), "Sa": (10, 0, 20), "Ra": (2, 0, 30), "Ke": (8, 0, 30)}
OWN = {"Su": [4], "Mo": [3], "Ma": [0, 7], "Me": [5, 2], "Ju": [8, 11], "Ve": [6, 1], "Sa": [10, 9],
       "Ra": [2, 10], "Ke": [8, 7]}
DEBIL_SIGN = {"Su": 6, "Mo": 7, "Ma": 3, "Me": 11, "Ju": 9, "Ve": 5, "Sa": 0, "Ra": 7, "Ke": 1}
EXALT_SIGN = {p: (s + 6) % 12 for p, s in DEBIL_SIGN.items()}
# Saptavargaja points indexed 6 - nat - temp (Raman values)  [S 4.1]
SV_POINTS = {2: 22.5, 1: 15.0, 0: 7.5, -1: 3.75, -2: 1.875}
REQ_TOTAL = {"Su": 390, "Mo": 360, "Ma": 300, "Me": 420, "Ju": 390, "Ve": 330, "Sa": 300}
REQ_GROUP = {  # SB# minima, BIN fcn 0x58cf30
    "sthana": (165, 133, 96, 165, 165, 133, 96), "dig": (35, 50, 30, 35, 35, 50, 30),
    "kala": (112, 100, 67, 112, 112, 100, 67), "cheshta": (50, 30, 40, 50, 50, 30, 40),
    "ayana": (30, 40, 20, 30, 30, 40, 20)}
NAIS = {"Su": 1.0, "Mo": .857, "Ma": .286, "Me": .429, "Ju": .571, "Ve": .714, "Sa": .143}
CHESHTA_WALK = {"Ma": 30.0, "Me": 10.0, "Ju": 55.0, "Ve": 21.0, "Sa": 60.0}   # days, BIN 0x58bfe5
COMBUST = {"Mo": (12, 12), "Ma": (17, 17), "Me": (14, 12), "Ju": (11, 11), "Ve": (10, 8), "Sa": (15, 15)}
# Functional nature defaults per ascendant (PL7 ctor 0x568339): M malefic, B benefic, N neutral
FUNC = {0: "BNBMBMMMM", 1: "BMNBMMBMM", 2: "MNMNMBBMM", 3: "NBBMBMNMM", 4: "BNBMBMMMM",
        5: "NMMBMBMMM", 6: "MNMBMNBMM", 7: "NBNMBMMMM", 8: "BNBMNMMMM", 9: "NMMBMBNMM",
        10: "NMMNMBBMM", 11: "MBBMBMMMM"}
BAV = {
    "Su": {"Su": [1, 2, 4, 7, 8, 9, 10, 11], "Mo": [3, 6, 10, 11], "Ma": [1, 2, 4, 7, 8, 9, 10, 11], "Me": [3, 5, 6, 9, 10, 11, 12], "Ju": [5, 6, 9, 11], "Ve": [6, 7, 12], "Sa": [1, 2, 4, 7, 8, 9, 10, 11], "As": [3, 4, 6, 10, 11, 12]},
    "Mo": {"Su": [3, 6, 7, 8, 10, 11], "Mo": [1, 3, 6, 7, 10, 11], "Ma": [2, 3, 5, 6, 9, 10, 11], "Me": [1, 3, 4, 5, 7, 8, 10, 11], "Ju": [1, 4, 7, 8, 10, 11, 12], "Ve": [3, 4, 5, 7, 9, 10, 11], "Sa": [3, 5, 6, 11], "As": [3, 6, 10, 11]},
    "Ma": {"Su": [3, 5, 6, 10, 11], "Mo": [3, 6, 11], "Ma": [1, 2, 4, 7, 8, 10, 11], "Me": [3, 5, 6, 11], "Ju": [6, 10, 11, 12], "Ve": [6, 8, 11, 12], "Sa": [1, 4, 7, 8, 9, 10, 11], "As": [1, 3, 6, 10, 11]},
    "Me": {"Su": [5, 6, 9, 11, 12], "Mo": [2, 4, 6, 8, 10, 11], "Ma": [1, 2, 4, 7, 8, 9, 10, 11], "Me": [1, 3, 5, 6, 9, 10, 11, 12], "Ju": [6, 8, 11, 12], "Ve": [1, 2, 3, 4, 5, 8, 9, 11], "Sa": [1, 2, 4, 7, 8, 9, 10, 11], "As": [1, 2, 4, 6, 8, 10, 11]},
    "Ju": {"Su": [1, 2, 3, 4, 7, 8, 9, 10, 11], "Mo": [2, 5, 7, 9, 11], "Ma": [1, 2, 4, 7, 8, 10, 11], "Me": [1, 2, 4, 5, 6, 9, 10, 11], "Ju": [1, 2, 3, 4, 7, 8, 10, 11], "Ve": [2, 5, 6, 9, 10, 11], "Sa": [3, 5, 6, 12], "As": [1, 2, 4, 5, 6, 7, 9, 10, 11]},
    "Ve": {"Su": [8, 11, 12], "Mo": [1, 2, 3, 4, 5, 8, 9, 11, 12], "Ma": [3, 5, 6, 9, 11, 12], "Me": [3, 5, 6, 9, 11], "Ju": [5, 8, 9, 10, 11], "Ve": [1, 2, 3, 4, 5, 8, 9, 10, 11], "Sa": [3, 4, 5, 8, 9, 10, 11], "As": [1, 2, 3, 4, 5, 8, 9, 11]},
    "Sa": {"Su": [1, 2, 4, 7, 8, 10, 11], "Mo": [3, 6, 11], "Ma": [3, 5, 6, 10, 11, 12], "Me": [6, 8, 9, 10, 11, 12], "Ju": [5, 6, 11, 12], "Ve": [6, 11, 12], "Sa": [3, 5, 6, 11], "As": [1, 3, 4, 6, 10, 11]}}
DIGNITY_LABEL = {"EX": "Exalt.", "MT": "Moolt.", "OWN": "Own", "GF": "Grt.Fr.", "F": "Frnd.",
                 "N": "Neutr.", "E": "Enemy", "GE": "Grt.En.", "DB": "Debil."}
AV5 = ["Dead", "Old", "Adoles.", "Youth.", "Infant"]          # PL string order (ids 2007-2011)
K7 = ["AK", "AmK", "BK", "MK", "PiK", "GK", "DK"]
FUNC_LABEL = {"M": "Malefic", "B": "Benefic", "N": "Neutral"}


def norm(x):
    return x % 360.0


def sgn(x):
    return int(norm(x) // 30)


def dist(a, b):                       # 0x5b1f1e  shortest arc
    d = abs(a - b) % 360.0
    return 360.0 - d if d > 180.0 else d


def fwd(a, b):                        # 0x45b0be  (b - a) mod 360
    return (b - a) % 360.0


# ---------------------------------------------------------------- casting
class Chart:
    def __init__(self, inp, ephe):
        swe.set_ephe_path(ephe)
        y, m, d = map(int, inp["date"].split("-"))
        hh, mm, ss = map(int, inp["time"].split(":"))
        self.lat, self.lon = inp["latDeg"], inp["lonDeg"]
        self.jd = swe.julday(y, m, d, hh + mm / 60 + ss / 3600 - inp["tzHours"])
        self.tz = inp["tzHours"]
        self.pos, self.spd = {}, {}
        for p in PL + ["Ra"]:
            lon, sp = self.sid(p if p != "Ra" else "Ra", self.jd)
            self.pos[p], self.spd[p] = lon, sp
        self.pos["Ke"], self.spd["Ke"] = norm(self.pos["Ra"] + 180), self.spd["Ra"]
        self.asc, self.mc = self.asc_mc(self.jd)
        self.pos["As"] = self.asc
        self.sign = {p: sgn(v) for p, v in self.pos.items()}

    @staticmethod
    def ayan(jd):                     # PL7 Lahiri polynomial (PLAN 3.1, BIN)
        T = (jd - 2451545.0) / 36525 + 1
        return 22.46045833333 + (5026.87434 * T + 1.11113 * T * T) / 3600

    def sid(self, p, jd):
        jt = jd + swe.deltat(jd)
        body = swe.TRUE_NODE if p == "Ra" else BODY[p]
        r = swe.calc(jt, body, swe.FLG_SWIEPH | swe.FLG_NONUT | swe.FLG_SPEED)[0]
        return norm(r[0] - self.ayan(jd)), r[3]

    def asc_mc(self, jd):
        jt = jd + swe.deltat(jd)
        swe.set_sid_mode(swe.SIDM_USER, jt, self.ayan(jd))
        _, a = swe.houses_ex(jd, self.lat, self.lon, b"P", swe.FLG_SIDEREAL)
        return a[0], a[1]

    def solve_asc_equals_sun(self, jd0, off):
        """PL sunrise (off=0) / sunset (off=180): Asc(t) == Sun(t)+off  [S 4.4]"""
        t = jd0
        for _ in range(40):
            a, _ = self.asc_mc(t)
            s, _ = self.sid("Su", t)
            d = (a - (s + off) + 180) % 360 - 180
            if abs(d) < 1e-8:
                break
            t -= d / 360.9856
        return t


# ---------------------------------------------------------------- vargas  [S 4.1]
def d2(l):
    s, d = sgn(l), l % 30
    odd = s % 2 == 0
    return 4 if (odd and d < 15) or (not odd and d >= 15) else 3


def d3(l):
    return (sgn(l) + 4 * int((l % 30) // 10)) % 12


def d7(l):
    return sgn(7 * l)


def d9(l):
    return sgn(9 * l)


def d12(l):
    return (sgn(l) + int((l % 30) / 2.5)) % 12


def d30(l):
    s, d = sgn(l), l % 30
    tab = [(5, 0), (10, 10), (18, 8), (25, 2), (30, 6)] if s % 2 == 0 else [(5, 1), (12, 5), (20, 11), (25, 9), (30, 7)]
    for lim, sign in tab:
        if d < lim:
            return sign
    return tab[-1][1]


VARGA7 = [("D1", sgn), ("D2", d2), ("D3", d3), ("D7", d7), ("D9", d9), ("D12", d12), ("D30", d30)]
SHADVARGA = [("D1", sgn, 6), ("D2", d2, 2), ("D3", d3, 4), ("D9", d9, 5), ("D12", d12, 2), ("D30", d30, 1)]


# ---------------------------------------------------------------- relationships / dignity
def nat(a, b):
    return NAT[a][P9.index(b)] - 1          # -1 enemy, 0 neutral, +1 friend


def temp(sign_a, sign_b):
    d = (sign_b - sign_a) % 12 + 1
    return 1 if d in (2, 3, 4, 10, 11, 12) else -1


def compound(ch, p, lord):
    return {2: "GF", 1: "F", 0: "N", -1: "E", -2: "GE"}[nat(p, lord) + temp(ch.sign[p], ch.sign[lord])]


def in_mt(p, l):
    s, a, b = MT[p]
    return sgn(l) == s and a < l % 30 < b


def dignity(ch, p):
    """Page-1 'Dignity' column [S 3.1]"""
    l = ch.pos[p]
    s = sgn(l)
    if s == EXALT_SIGN[p]:
        if p == "Mo" and l % 30 > 3:
            return "MT"
        if p == "Me" and l % 30 >= 15:
            return "MT" if in_mt(p, l) else "OWN"
        return "EX"
    if s == DEBIL_SIGN[p]:
        return "DB"
    if in_mt(p, l):
        return "MT"
    if s in OWN[p]:
        return "OWN"
    return compound(ch, p, SIGN_LORD[s])


# ---------------------------------------------------------------- drishti  [S 4.6]
def aspect(d, p):
    """PL7 fcn 0x404f64: aspect value of planet id p at distance d=aspected-aspecting"""
    k = int(d / 30)
    jup = p in (5, 8, 9)
    if k == 1:
        return 2 * (d - 30) if p == 7 else (d - 30) / 2
    if k == 2:
        return (d - 60) * 1.5 + 15 if p == 3 else (90 - d / 2 if p == 7 else (d - 60) + 15)
    if k == 3:
        if p == 3:
            return 150 - d
        if jup:
            return d / 2
        return 90 - d / 2 if p == 7 else (120 - d) / 2 + 30
    if k == 4:
        return 180 - d if jup else 150 - d
    if k == 5:
        return 2 * (d - 150)
    if k == 6:
        return 60.0 if p == 3 else (300 - d) / 2
    if k == 7:
        if p == 3:
            return 270 - d
        return (d - 210) / 2 + 45 if jup else (300 - d) / 2
    if k == 8:
        if jup:
            return 300 - d
        return (d - 240) + 30 if p == 7 else (300 - d) / 2
    if k == 9:
        return 2 * (300 - d) if p == 7 else (300 - d) / 2
    return 0.0


def mercury_with_malefic(ch):
    return any(ch.sign[q] == ch.sign["Me"] for q in ("Su", "Ma", "Sa", "Ra", "Ke"))


def drik(ch, target, exclude=None):
    """PL7 fcn 0x58d8ad (drik bala of a planet, drishti bala of a bhava)"""
    tot = 0.0
    for p in PL:
        if p == exclude:
            continue
        v = aspect(fwd(ch.pos[p], target), PID[p])
        if p in ("Su", "Ma", "Sa"):
            v *= -0.25
        elif p == "Mo":
            v *= -0.25 if fwd(ch.pos["Su"], ch.pos["Mo"]) > 180 else 0.25
        elif p == "Ve":
            v *= 0.25
        elif p == "Me" and mercury_with_malefic(ch):       # Ju and Me: full weight
            v = -v
        tot += v
    return tot


# ---------------------------------------------------------------- cheshta  [S 4.5]
def elong(ch, p, jd):
    a, _ = ch.sid(p, jd)
    s, _ = ch.sid("Su", jd)
    return (a - s + 180) % 360 - 180


def events(ch, p, jd0, jd1):
    """true geocentric conjunctions (A: planet direct) and B events (planet retrograde:
    opposition of a superior planet, inferior conjunction of Me/Ve)"""
    A, B = [], []
    t, prev = jd0, elong(ch, p, jd0)
    while t < jd1:
        t2 = t + 0.5
        e = elong(ch, p, t2)
        for target in (0.0, 180.0):
            a = (prev - target + 180) % 360 - 180
            b = (e - target + 180) % 360 - 180
            if a * b < 0 and abs(a - b) < 90:
                lo, hi = t, t2
                for _ in range(40):
                    mid = (lo + hi) / 2
                    c = (elong(ch, p, mid) - target + 180) % 360 - 180
                    lo, hi = (mid, hi) if (c > 0) == (a > 0) else (lo, mid)
                tm = (lo + hi) / 2
                (A if ch.sid(p, tm)[1] > 0 else B).append(tm)
        prev, t = e, t2
    return A, B


def station_lon(ch, p, x3, jd_now):
    """PL7 fcn 0x58bfe5: walk day by day (max 12 steps) from x3 -/+ D towards the station"""
    s = 1.0 if jd_now < x3 else -1.0
    tt, counter, edx, lon = x3 - s * CHESHTA_WALK[p], 1, 0, None
    while True:
        prev = edx
        lon, v = ch.sid(p, tt)
        edx = -1 if v < 0 else 1
        if counter > 1 and edx != prev:
            counter = 0x6f
        tt = tt - 1 if s * v < 0 else tt + 1
        counter += 1
        if counter > 12:
            return lon


def cheshta(ch, p):
    """PL7 fcn 0x58c0f2; event epochs from true ephemeris (PL7: own series, see spec)"""
    jd = ch.jd
    A, B = events(ch, p, jd - 900, jd + 900)
    nxtA = min(t for t in A if t >= jd)
    prvA = max(t for t in A if t < jd)
    x3 = [t for t in B if prvA < t < nxtA][0]
    x2 = prvA if jd < x3 else nxtA
    L3, L2 = ch.sid(p, x3)[0], ch.sid(p, x2)[0]
    Lst = station_lon(ch, p, x3, jd)
    Ln, vn = ch.pos[p], ch.spd[p]
    if x3 < x2:
        a28, v = fwd(Lst, L2), fwd(Ln, L2)
    else:
        a28, v = fwd(L2, Lst), fwd(L2, Ln)
    if v > 300:
        v = 360 - v
    tot = dist(L3, Lst) + a28
    w = v if vn > 0 else dist(Lst, Ln) + a28
    return 60.0 * min(w, tot) / tot


# ---------------------------------------------------------------- shadbala  [S 4]
def shadbala(ch):
    out = {p: {} for p in PL}
    sr = ch.solve_asc_equals_sun(ch.jd - 0.4, 0.0)
    ss = ch.solve_asc_equals_sun(ch.jd + 0.1, 180.0)
    # NOTE: valid for day births (as the fixture); night births need the [S 4.4] case table
    day = sr <= ch.jd < ss
    noon = (sr + ss) / 2
    X = ((ch.jd - (noon + 0.5013689628737269)) * 360) % 360
    diurnal = 60 - abs(X - 180) / 3
    jl = ch.jd + ch.lon / 360
    ah = math.floor(jl - 2380557.5) - (1 if ch.jd < sr else 0)
    n7 = lambda n: (n - 1) % 7 + 1
    year, month = PL[n7(1 + 3 * (ah // 360)) - 1], PL[n7(1 + 2 * (ah // 30)) - 1]
    vara = n7(ah - 7 * (ah // 7))
    hora_no = 1 + math.floor((ch.jd - sr) * 24)
    hora = PL[n7(vara + 5 * (hora_no - 1)) - 1]
    el = dist(ch.pos["Su"], ch.pos["Mo"]) / 3
    eps = swe.calc(ch.jd + swe.deltat(ch.jd), swe.ECL_NUT)[0][0]
    meta = dict(sunrise=sr, sunset=ss, X=X, lords=(year, month, PL[vara - 1], hora), hora_no=hora_no)
    for p in PL:
        o, l = out[p], ch.pos[p]
        o["uchcha"] = dist(l, DEBIL_DEG[p]) / 3
        sv = 0.0
        for name, f in VARGA7:
            vs = f(l)
            lord = SIGN_LORD[vs]
            if lord == p or (name == "D1" and p == "Mo" and vs == 1):
                sv += 45.0 if (name == "D1" and in_mt(p, l)) else 30.0
            else:
                sv += SV_POINTS[nat(p, lord) + temp(ch.sign[p], ch.sign[lord])]
        o["saptavargaja"] = sv
        fem = p in ("Mo", "Ve")
        o["ojayugma"] = sum(15.0 for s in (sgn(l), d9(l)) if (s % 2 == 1) == fem)
        h = (sgn(l) - sgn(ch.asc)) % 12
        o["kendra"] = (60.0, 30.0, 15.0)[h % 3]
        o["drekkana"] = 15.0 if int((l % 30) // 10) == {"Su": 0, "Ma": 0, "Ju": 0, "Me": 1, "Sa": 1, "Mo": 2, "Ve": 2}[p] else 0.0
        o["sthana"] = o["uchcha"] + o["saptavargaja"] + o["ojayugma"] + o["kendra"] + o["drekkana"]
        weak = {"Su": ch.mc + 180, "Ma": ch.mc + 180, "Mo": ch.mc, "Ve": ch.mc,
                "Me": ch.asc + 180, "Ju": ch.asc + 180, "Sa": ch.asc}[p]
        o["dig"] = dist(l, norm(weak)) / 3
        o["natonnata"] = 60.0 if p == "Me" else (diurnal if p in ("Su", "Ju", "Ve") else 60 - diurnal)
        malefic = p in ("Su", "Ma", "Sa") or (p == "Me" and mercury_with_malefic(ch))
        o["paksha"] = 60 - el if malefic else el
        if p == "Ju":
            o["tribhaga"] = 60.0
        elif day:
            part = int((ch.jd - sr) / (ss - sr) * 3)
            o["tribhaga"] = 60.0 if p == ("Me", "Su", "Sa")[part] else 0.0
        else:
            sr2 = ch.solve_asc_equals_sun(ss + 0.4, 0.0)
            part = int((ch.jd - ss) / (sr2 - ss) * 3)
            o["tribhaga"] = 60.0 if p == ("Mo", "Ve", "Ma")[part] else 0.0
        o["abda"] = 15.0 if p == year else 0.0
        o["masa"] = 30.0 if p == month else 0.0
        o["vara"] = 45.0 if p == PL[vara - 1] else 0.0
        o["hora"] = 60.0 if p == hora else 0.0
        trop = norm(l + ch.ayan(ch.jd))
        dec = math.degrees(math.asin(math.sin(math.radians(eps)) * math.sin(math.radians(trop))))
        s = -1 if p in ("Mo", "Sa") else ((1 if dec >= 0 else -1) if p == "Me" else 1)
        o["ayana"] = (s * dec + 23.45) / 46.9 * 60
        o["kala"] = sum(o[k] for k in ("natonnata", "paksha", "tribhaga", "abda", "masa", "vara", "hora", "ayana"))
    for p in PL:
        o = out[p]
        o["cheshta"] = o["ayana"] if p == "Su" else (o["paksha"] if p == "Mo" else cheshta(ch, p))
        o["naisargika"] = 60 * NAIS[p]
        o["drik"] = drik(ch, ch.pos[p], exclude=p)
        o["total"] = o["sthana"] + o["dig"] + o["kala"] + o["cheshta"] + o["naisargika"] + o["drik"]
        o["SB%"] = o["total"] / REQ_TOTAL[p]
        o["SB#"] = sum(1 for g, mins in REQ_GROUP.items() if o[g] >= mins[PID[p] - 1])
    return out, meta


# ---------------------------------------------------------------- bhava bala  [S 1.2]
def sign_type(l):
    s, d = sgn(l), l % 30
    if s in (2, 5, 6, 10) or (s == 8 and d < 15):
        return 7      # nara: weak at madhya of house 7
    if s == 11 or (s == 9 and d > 15):
        return 10     # jalachara: weak at 10
    if s in (0, 1, 4) or (s == 8 and d > 15) or (s == 9 and d < 15):
        return 4      # chatushpada: weak at 4
    return 1          # keeta (Cn, Sc): weak at 1


def bhava_bala(ch, sb, day):
    madhya = [norm(ch.asc + 30 * i) for i in range(12)]          # 'Equal house method'
    out = []
    for h in range(12):
        bm = madhya[h]
        lord = SIGN_LORD[sgn(bm)]
        dig = dist(bm, madhya[sign_type(bm) - 1]) / 3
        dr = drik(ch, bm)
        occ = [p for p in ("Su", "Ma", "Me", "Ju", "Sa") if (ch.sign[p] - sgn(ch.asc)) % 12 == h]
        cnt = -1 if "Su" in occ else 0
        cnt += sum({"Ma": -1, "Me": 1, "Ju": 1, "Sa": -1}[p] for p in occ if p != "Su")
        s1 = sgn(bm) + 1
        dn = 15.0 if ((not day and s1 in (1, 2, 4, 9, 10)) or (day and s1 in (3, 5, 6, 7, 8, 11))) else 0.0
        parts = dict(lord=sb[lord]["total"], dig=dig, drishti=dr, planets=60.0 * cnt, day_night=dn)
        parts["total"] = sum(parts.values())
        out.append(parts)
    return out


# ---------------------------------------------------------------- ashtakavarga  [S 1.1, 3.6]
def ashtakavarga(ch):
    bav = {}
    for p, refs in BAV.items():
        row = [0] * 12
        for ref, hs in refs.items():
            for hh in hs:
                row[(ch.sign[ref] + hh - 1) % 12] += 1
        bav[p] = row
    sav = [sum(bav[p][s] for p in bav) for s in range(12)]
    return bav, sav


# ---------------------------------------------------------------- remaining columns
def vimshopaka(ch, p):
    """Shadvarga, compound relation, BPHS points [S 3.4]"""
    PTS = {"GF": 18, "F": 15, "N": 10, "E": 7, "GE": 5}
    tot = 0.0
    for _, f, w in SHADVARGA:
        vs = f(ch.pos[p])
        lord = SIGN_LORD[vs]
        tot += w * (20 if (lord == p or vs in OWN[p]) else PTS[compound(ch, p, lord)])
    return tot / 20


def jagradadi(ch, p):
    s = ch.sign[p]
    if s == EXALT_SIGN[p] or s in OWN[p] or in_mt(p, ch.pos[p]):
        return "Alr."
    if s == DEBIL_SIGN[p]:
        return "Slp."
    return "Slp." if nat(p, SIGN_LORD[s]) < 0 else "Drm."


def baladi(ch, p):
    k = int((ch.pos[p] % 30) // 6)
    return AV5[k] if ch.sign[p] % 2 == 1 else AV5[4 - k]


def karakas7(ch):
    order = sorted(PL, key=lambda p: -(ch.pos[p] % 30))
    return {p: K7[i] for i, p in enumerate(order)}


def combust(ch, p):
    if p not in COMBUST:
        return False
    orb = COMBUST[p][1 if ch.spd[p] < 0 else 0]
    return dist(ch.pos["Su"], ch.pos[p]) < orb


def functional(ch, p):
    row = FUNC[sgn(ch.asc)]
    if p in ("Ra", "Ke"):              # BIN 0x426ee5: nearest planet in its sign, else house 1/5/9 B, 6/8/12 M
        mates = sorted((q for q in PID if q != p and ch.sign[q] == ch.sign[p]),
                       key=lambda q: dist(ch.pos[q], ch.pos[p]))
        if mates:
            return functional(ch, mates[0])
        h = (ch.sign[p] - sgn(ch.asc)) % 12 + 1
        return "Benefic" if h in (1, 5, 9) else "Malefic" if h in (6, 8, 12) else "Neutral"
    return FUNC_LABEL[row[PID[p] - 1]]


def nakshatra_pada(l):
    n = int(l // (40 / 3))
    return n, int((l - n * 40 / 3) // (10 / 3)) + 1


# ---------------------------------------------------------------- report
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ephe", default=os.environ.get("SE_EPHE_PATH", DEFAULT_EPHE))
    ap.add_argument("--fixture", default=os.path.join(FIXDIR, "pl9_page1_amitabh.json"))
    ap.add_argument("--verbose", action="store_true")
    a = ap.parse_args()
    fx = json.load(open(a.fixture))
    names = json.load(open(os.path.join(FIXDIR, "nakshatra_names.json")))["nakshatras"]
    padas = json.load(open(os.path.join(FIXDIR, "pada_syllables.json")))["padas"]
    ch = Chart(fx["input"], a.ephe)
    sb, meta = shadbala(ch)
    day = meta["sunrise"] <= ch.jd < meta["sunset"]
    bb = bhava_bala(ch, sb, day)
    bav, sav = ashtakavarga(ch)
    fails, rows = [], []

    def check(field, got, want, ok=None):
        ok = (got == want) if ok is None else ok
        rows.append((field, got, want, "ok" if ok else "MISMATCH"))
        if not ok:
            fails.append(field)

    asc_sign = sgn(ch.asc)
    for h in range(12):
        want_sav, want_bb = fx["rasi_houses"][str(h + 1)]
        check(f"house{h + 1:>2} SAV", sav[(asc_sign + h) % 12], want_sav)
        got = round(bb[h]["total"], 2)
        check(f"house{h + 1:>2} BhavaBala", got, want_bb, abs(got - want_bb) <= 0.6)   # spec 1.2 residual
    k7 = karakas7(ch)
    st = fx["strength_table"]
    pt = fx["planet_table"]
    for p in P9:
        w = st[p]
        check(f"{p} Dignity", DIGNITY_LABEL[dignity(ch, p)], w[0])
        if p in PL:
            check(f"{p} SB%", round(sb[p]["SB%"], 2), w[1])
            check(f"{p} SB#", sb[p]["SB#"], w[2])
            check(f"{p} AV", bav[p][ch.sign[p]], w[4])
            check(f"{p} K7", k7[p], w[7])
        if p == "Ra":   # OPEN: candidate = BAV of the dispositor at the node's sign (spec 3.5)
            disp = SIGN_LORD[ch.sign[p]]
            rows.append((f"{p} AV", bav[disp][ch.sign[p]], w[4], "OPEN (candidate: dispositor BAV)"))
        vbv = vimshopaka(ch, p)
        if p == "Ke":
            rows.append((f"{p} VB", round(vbv), w[3], "OPEN (see spec 3.4)"))
        else:
            check(f"{p} VB", round(vbv), w[3])
        check(f"{p} Av3", jagradadi(ch, p), w[5])
        check(f"{p} Av5", baladi(ch, p), w[6])
        check(f"{p} Func.", functional(ch, p), w[8])
    for p in P9 + ["As"]:
        n, pada = nakshatra_pada(ch.pos[p])
        want = pt[p]
        check(f"{p} nakshatra", names[n]["short"], want[3])
        check(f"{p} pada syllable", padas[n * 4 + pada - 1]["syllable"], want[4])
        check(f"{p} pada", pada, int(want[5].split(",")[0]))
        if p in COMBUST or p == "Su":
            flag = ("R" if ch.spd.get(p, 0) < 0 else "") + ("c" if combust(ch, p) else "")
            check(f"{p} flags", flag, want[2])
    for label, (p) in [(k, k) for k in fx["rasi_chart_labels"]]:
        q = p.rstrip("R")
        n, _ = nakshatra_pada(ch.pos[q])
        check(f"{p} chart abbr", names[n]["tiny"], fx["rasi_chart_labels"][p].split()[1])

    w = max(len(r[0]) for r in rows)
    for r in rows:
        print(f"{r[0]:<{w}}  computed={r[1]!s:<10} fixture={r[2]!s:<10} {r[3]}")
    if a.verbose:
        print("\nsunrise/sunset/X/lords/hora#:", meta)
        keys = ["uchcha", "saptavargaja", "ojayugma", "kendra", "drekkana", "sthana", "dig", "natonnata", "paksha",
                "tribhaga", "abda", "masa", "vara", "hora", "ayana", "kala", "cheshta", "naisargika", "drik", "total", "SB%"]
        print("    " + " ".join(f"{k[:7]:>7}" for k in keys))
        for p in PL:
            print(f"{p:<3} " + " ".join(f"{sb[p][k]:7.2f}" for k in keys[:-1]) + f" {sb[p]['SB%']:7.4f}")
        for h, parts in enumerate(bb):
            print(f"house {h + 1:>2}", {k: round(v, 2) for k, v in parts.items()})
    print(f"\n{len(rows)} fields, {len(fails)} mismatches" + (": " + ", ".join(fails) if fails else ""))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())

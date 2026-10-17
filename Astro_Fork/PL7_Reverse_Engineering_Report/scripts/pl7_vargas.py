"""Faithful re-implementation of the PL7 varga routines decoded from PL7.exe
(dispatcher fcn.0057d9cf; divisor table at 0x5f47b8). s = sign number 1..12 (Aries = 1),
d = degrees within the sign [0, 30), lon = full sidereal longitude. Returns the varga
longitude in degrees, as the program does (then normalised to [0, 360))."""
import math
N = lambda x: x % 360.0
def generic(lon, n):            # fcn.0057d1e1: D1,D2..,D7,D9,D16,D20,D27,D150 and the 'II' cyclic variants
    return N(n * lon)
def d10(d, s):                  # fcn.0057d55c
    x = d / 3.0
    return N(((s - 1) if s % 2 == 1 else (s + 7)) * 30 + x * 30)
def d24(d, s):                  # fcn.0057d675
    return N((d * 0.8 + (4 if s % 2 == 1 else 3)) * 30)
def d6(d, s):                   # fcn.0057d4dc
    return N((d * 0.2 + (0 if s % 2 == 1 else 6)) * 30)
def d8(d, s):                   # fcn.0057d510
    off = {0: 4, 1: 0, 2: 8}[s % 3]
    return N((d * 8 / 30 + off) * 30)
def d11(d, s):                  # fcn.0057d5a6 (Ekadashamsha, list position 20)
    return N((d * 11 / 30 + (1 - s)) * 30)
def d11_alt(d, s):              # fcn.0057d5d6 (alternate D11, list position 31)
    return N((1 - d * 11 / 30) * 30)
def d16_alt(d, s):              # fcn.0057d5fb (alternate D16, list position 30)
    x = d * 16 / 30
    return N(((s - 1) + x if s % 2 == 1 else (s + 3) - x) * 30)
SIGNS = "Ar Ta Ge Cn Le Vi Li Sc Sg Cp Aq Pi".split()
def sign_of(l): return SIGNS[int(math.floor(l / 30)) % 12]
if __name__ == "__main__":
    rows = {"D6": d6, "D8": d8, "D10": d10, "D11": d11, "D11 alt": d11_alt, "D16 alt": d16_alt, "D24": d24}
    print("first amsa (d=0.01) and second amsa per sign")
    for name, f in rows.items():
        n = {"D6": 6, "D8": 8, "D10": 10, "D11": 11, "D11 alt": 11, "D16 alt": 16, "D24": 24}[name]
        first = [sign_of(f(0.01, s)) for s in range(1, 13)]
        second = [sign_of(f(30 / n + 0.01, s)) for s in range(1, 13)]
        print(f"{name:8s}", " ".join(first), " | 2nd:", " ".join(second))
    print("D9 ", " ".join(sign_of(generic((s - 1) * 30 + 0.01, 9)) for s in range(1, 13)))
    print("D11 equals 11*lon cyclic:", all(abs(((d11(d, s) - generic((s-1)*30+d, 11) + 180) % 360) - 180) < 1e-9 for s in range(1, 13) for d in [0.5, 7.3, 18.2, 29.9]))

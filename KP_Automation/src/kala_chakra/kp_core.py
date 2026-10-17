"""
kp_core.py — Core KP (Krishnamurti Paddhati) calculation engine.

Everything here is computed, not looked up: the 249 star-lord/sub-lord
subdivisions follow deterministically from the Vimshottari dasha proportions.
All arithmetic is done in integer arcseconds, so results are exact.

Key facts used:
  * Zodiac = 360 deg = 1,296,000 arcsec.
  * Each nakshatra spans 13 deg 20 min = 48,000 arcsec; 27 nakshatras total.
  * Vimshottari order and years: Ke 7, Ve 20, Su 6, Mo 10, Ma 7, Ra 18,
    Ju 16, Sa 19, Me 17 (total 120).
  * Sub-lord slice inside a nakshatra = years/120 * 48,000 = years * 400 arcsec.
  * Sub sequence starts at the star lord and follows Vimshottari order.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

ARCSEC_PER_SIGN = 30 * 3600            # 108,000
ARCSEC_PER_NAK = 48_000                # 13 deg 20 min
ZODIAC_ARCSEC = 1_296_000

# Vimshottari order (starting from Ketu / Aswini) and dasha years.
VIM_ORDER = ["Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me"]
VIM_YEARS = {"Ke": 7, "Ve": 20, "Su": 6, "Mo": 10, "Ma": 7,
             "Ra": 18, "Ju": 16, "Sa": 19, "Me": 17}

SIGNS = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"]
SIGN_NAMES = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
              "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

# Sign rulership (traditional, as used in KP).
SIGN_LORD = {"Ar": "Ma", "Ta": "Ve", "Ge": "Me", "Cn": "Mo", "Le": "Su",
             "Vi": "Me", "Li": "Ve", "Sc": "Ma", "Sg": "Ju", "Cp": "Sa",
             "Aq": "Sa", "Pi": "Ju"}

# Signs owned by each planet (nodes own nothing directly).
OWNED_SIGNS = {
    "Su": ["Le"], "Mo": ["Cn"], "Ma": ["Ar", "Sc"], "Me": ["Ge", "Vi"],
    "Ju": ["Sg", "Pi"], "Ve": ["Ta", "Li"], "Sa": ["Cp", "Aq"],
    "Ra": [], "Ke": [],
}

NAKSHATRAS = [
    "Aswini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Aslesha", "Magha", "P.Phalguni", "U.Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "P.Ashadha", "U.Ashadha", "Sravana", "Dhanishta", "Satabhisha",
    "P.Bhadrapada", "U.Bhadrapada", "Revati",
]

# Point labels as they appear in the exported sheets -> planet abbreviation.
POINT_TO_PLANET = {"Mon": "Mo", "Sun": "Su", "Mer": "Me", "Ven": "Ve",
                   "Mar": "Ma", "Jup": "Ju", "Sat": "Sa", "Ra": "Ra", "Ke": "Ke"}

# ---------------------------------------------------------------------------
# Longitude parsing / formatting
# ---------------------------------------------------------------------------

# Matches e.g. 26°Le13'36''  (annotation after it, if any, is ignored)
_LON_RE = re.compile(
    r"(\d{1,2})\s*[°:]\s*([A-Za-z]{2})\s*(\d{1,2})\s*[':]\s*(\d{1,2})")


def parse_longitude(text: str) -> int | None:
    """Parse a 'DD°SgMM'SS' style string -> absolute longitude in arcsec.

    Returns None if the text does not contain a longitude.
    """
    m = _LON_RE.search(text)
    if not m:
        return None
    deg, sign, minute, sec = m.groups()
    sign = sign.capitalize()
    if sign not in SIGNS:
        return None
    return (SIGNS.index(sign) * ARCSEC_PER_SIGN
            + int(deg) * 3600 + int(minute) * 60 + int(sec))


def format_longitude(arcsec: int) -> str:
    """Absolute arcsec -> canonical 'DD°SgMM'SS''' string."""
    arcsec %= ZODIAC_ARCSEC
    sign_idx, rem = divmod(arcsec, ARCSEC_PER_SIGN)
    deg, rem = divmod(rem, 3600)
    minute, sec = divmod(rem, 60)
    return f"{deg:02d}°{SIGNS[sign_idx]}{minute:02d}'{sec:02d}''"


def sign_of(arcsec: int) -> str:
    return SIGNS[(arcsec % ZODIAC_ARCSEC) // ARCSEC_PER_SIGN]


# ---------------------------------------------------------------------------
# Star lord / sub lord
# ---------------------------------------------------------------------------

def star_and_sub(arcsec: int) -> tuple[str, str, str]:
    """Return (nakshatra_name, star_lord, sub_lord) for a longitude.

    Boundary convention: an exact boundary belongs to the segment that
    STARTS there (half-open intervals [from, to)), matching the printed
    From/To table.
    """
    arcsec %= ZODIAC_ARCSEC
    nak_idx, offset = divmod(arcsec, ARCSEC_PER_NAK)
    star_lord = VIM_ORDER[nak_idx % 9]

    start = VIM_ORDER.index(star_lord)
    cum = 0
    for i in range(9):
        lord = VIM_ORDER[(start + i) % 9]
        cum += VIM_YEARS[lord] * 400          # slice width in arcsec
        if offset < cum:
            return NAKSHATRAS[nak_idx], star_lord, lord
    # Unreachable: cum == 48000 == ARCSEC_PER_NAK
    raise AssertionError("sub-lord walk failed")


def _dms(arcsec: int) -> str:
    """Arcsec within a sign -> DD°MM'SS'' (no sign abbreviation)."""
    deg, rem = divmod(arcsec, 3600)
    minute, sec = divmod(rem, 60)
    return f"{deg:02d}°{minute:02d}'{sec:02d}''"


def sub_lords(arcsec: int, depth: int = 5) -> list[str]:
    """Lords at `depth` nested levels: [star, sub, sub2, sub3, sub4, ...].

    Each level subdivides its parent span in Vimshottari proportions
    starting from the parent's lord. Exact integer arithmetic: offsets are
    rescaled x120 per level so every boundary stays an integer.
    """
    arcsec %= ZODIAC_ARCSEC
    nak_idx, rel = divmod(arcsec, ARCSEC_PER_NAK)
    lord = VIM_ORDER[nak_idx % 9]
    lords = [lord]
    width = ARCSEC_PER_NAK
    for _ in range(1, depth):
        rel *= 120                     # sub-part widths become width*years
        start = VIM_ORDER.index(lord)
        cum = 0
        for i in range(9):
            cand = VIM_ORDER[(start + i) % 9]
            pw = width * VIM_YEARS[cand]
            if rel < cum + pw:
                lord, rel, width = cand, rel - cum, pw
                break
            cum += pw
        lords.append(lord)
    return lords


def sl_chain(arcsec: int, depth: int = 5) -> str:
    """'Ve/Ke/Su/Mo/Ra' style chain of nested lords."""
    return "/".join(sub_lords(arcsec, depth))


def generate_full_table() -> list[dict]:
    """Generate all 249 subdivisions (the four PDF series combined)."""
    rows = []
    pos = 0
    for nak_idx in range(27):
        star_lord = VIM_ORDER[nak_idx % 9]
        start = VIM_ORDER.index(star_lord)
        for i in range(9):
            lord = VIM_ORDER[(start + i) % 9]
            width = VIM_YEARS[lord] * 400
            frm, to = pos, pos + width
            # Split at sign boundaries so rows read like the printed table.
            seg_from = frm
            while seg_from < to:
                sign_end = ((seg_from // ARCSEC_PER_SIGN) + 1) * ARCSEC_PER_SIGN
                seg_to = min(to, sign_end)
                rows.append({
                    "sign": SIGN_NAMES[seg_from // ARCSEC_PER_SIGN],
                    "from": _dms(seg_from % ARCSEC_PER_SIGN),
                    "to": _dms(seg_to % ARCSEC_PER_SIGN or ARCSEC_PER_SIGN),
                    "from_abs": seg_from, "to_abs": seg_to,
                    "nakshatra": NAKSHATRAS[nak_idx],
                    "star_lord": star_lord, "sub_lord": lord,
                })
                seg_from = seg_to
            pos = to
    return rows


# ---------------------------------------------------------------------------
# Chart model: placement and ownership
# ---------------------------------------------------------------------------

@dataclass
class Chart:
    cusps: dict[int, int]              # house number (1-12) -> arcsec
    planets: dict[str, int]            # planet abbr -> arcsec
    warnings: list[str] = field(default_factory=list)

    # -- placement ---------------------------------------------------------
    def house_of(self, arcsec: int) -> int:
        """House occupied by a longitude: house h spans [cusp_h, cusp_{h+1})."""
        arcsec %= ZODIAC_ARCSEC
        for h in range(1, 13):
            lo = self.cusps[h]
            hi = self.cusps[h % 12 + 1]
            span = (hi - lo) % ZODIAC_ARCSEC
            if (arcsec - lo) % ZODIAC_ARCSEC < span:
                return h
        raise AssertionError("placement failed")

    # -- ownership ---------------------------------------------------------
    def sign_to_houses(self) -> dict[str, list[int]]:
        """Which house numbers' cusps fall in each sign."""
        mapping: dict[str, list[int]] = {s: [] for s in SIGNS}
        for h, lon in self.cusps.items():
            mapping[sign_of(lon)].append(h)
        for s in SIGNS:
            mapping[s].sort()
            if len(mapping[s]) == 0:
                self._warn_intercepted(s)
        return mapping

    def _warn_intercepted(self, sign: str) -> None:
        # No cusp falls in this sign, so the whole sign lies inside one
        # house span; its lord's ownership goes to that house (span rule).
        h = self.house_of(SIGNS.index(sign) * ARCSEC_PER_SIGN)
        msg = (f"Sign {sign} contains no cusp; it lies wholly inside house "
               f"{h}, so its lord {SIGN_LORD[sign]} owns {h} (span rule).")
        if msg not in self.warnings:
            self.warnings.append(msg)

    def houses_from_sign(self, sign: str) -> list[int]:
        """Houses a sign contributes to its lord's ownership.

        Cusp(s) in the sign -> those house numbers. No cusp in the sign ->
        the single house whose span contains the whole sign (span rule,
        confirmed convention).
        """
        cusps_in = self.sign_to_houses()[sign]
        if cusps_in:
            return cusps_in
        return [self.house_of(SIGNS.index(sign) * ARCSEC_PER_SIGN)]

    def ownerships(self, planet: str) -> list[int]:
        """House numbers owned by a planet (sorted ascending)."""
        houses: list[int] = []
        for s in OWNED_SIGNS[planet]:
            houses.extend(self.houses_from_sign(s))
        return sorted(houses)

    # -- final number strings ----------------------------------------------
    def numbers_for(self, planet: str) -> list[int]:
        """Cusp-number list: placement first, then ownerships.

        Nodes (Ra/Ke): [dispositor placement, node placement,
                        dispositor ownerships...].
        """
        lon = self.planets[planet]
        if planet in ("Ra", "Ke"):
            disp = SIGN_LORD[sign_of(lon)]
            return ([self.house_of(self.planets[disp]), self.house_of(lon)]
                    + self.ownerships(disp))
        return [self.house_of(lon)] + self.ownerships(planet)

    def numbers_string(self, planet: str) -> str:
        return ",".join(str(n) for n in self.numbers_for(planet))

    # -- power calculation ---------------------------------------------------
    #
    # Powers (decoded from Guide_Step6 + Sheet2 worked example, validated
    # against all manually calculated charts):
    #   Numerator   : Planet position 2 / ownership 1
    #                 Star   position 4 / ownership 3   (Guide B44 has a typo)
    #                 Sub    position 6 / ownership 5
    #     Node as planet/star/sub: position power -> node position AND
    #     dispositor position; ownership power -> dispositor ownerships.
    #   Denominator : cusps whose star lord is Planet 7 / Star 8 / Sub 9
    #                 cusps whose sub  lord is Planet 10 / Star 11 / Sub 12
    #   Merge: powers of identical bases add; output ascending by base.

    def _position_ownership_terms(self, body: str, pos_power: int,
                                  own_power: int) -> list[tuple[int, int, str]]:
        """(base, power, explanation) terms for one numerator part."""
        terms = []
        pos = self.house_of(self.planets[body])
        if body in ("Ra", "Ke"):
            disp = SIGN_LORD[sign_of(self.planets[body])]
            dpos = self.house_of(self.planets[disp])
            terms.append((pos, pos_power, f"{body} position {pos}"))
            terms.append((dpos, pos_power,
                          f"dispositor {disp} position {dpos}"))
            for h in self.ownerships(disp):
                terms.append((h, own_power, f"dispositor {disp} owns {h}"))
        else:
            terms.append((pos, pos_power, f"{body} position {pos}"))
            for h in self.ownerships(body):
                terms.append((h, own_power, f"{body} owns {h}"))
        return terms

    def cusp_lords(self) -> dict[int, tuple[str, str]]:
        """House -> (star lord, sub lord) of its cusp."""
        return {h: star_and_sub(lon)[1:] for h, lon in self.cusps.items()}

    def power_terms(self, planet: str) -> dict:
        """All power terms for a planet, grouped for step-wise display."""
        _, star, sub = star_and_sub(self.planets[planet])
        num = {
            f"Planet {planet}": self._position_ownership_terms(planet, 2, 1),
            f"Star {star}": self._position_ownership_terms(star, 4, 3),
            f"Sub {sub}": self._position_ownership_terms(sub, 6, 5),
        }
        lords = self.cusp_lords()
        den = {}
        for label, body, p_star, p_sub in (("Planet", planet, 7, 10),
                                           ("Star", star, 8, 11),
                                           ("Sub", sub, 9, 12)):
            terms = []
            for h in sorted(self.cusps):
                sl, su = lords[h]
                if sl == body:
                    terms.append((h, p_star,
                                  f"{body} is star lord of cusp {h}"))
                if su == body:
                    terms.append((h, p_sub,
                                  f"{body} is sub lord of cusp {h}"))
            den[f"{label} {body}"] = terms
        return {"planet": planet, "star": star, "sub": sub,
                "numerator": num, "denominator": den}

    def side_totals(self, planet: str) -> tuple[dict[int, int],
                                                dict[int, int]]:
        """(numerator, denominator) base->summed power, ascending bases."""
        t = self.power_terms(planet)
        out = []
        for side in ("numerator", "denominator"):
            totals: dict[int, int] = {}
            for terms in t[side].values():
                for base, power, _ in terms:
                    totals[base] = totals.get(base, 0) + power
            out.append(dict(sorted(totals.items())))
        return out[0], out[1]

    def powers_for(self, planet: str) -> dict[int, int]:
        """Merged base -> total power (ascending base order preserved)."""
        totals: dict[int, int] = {}
        t = self.power_terms(planet)
        for part in (t["numerator"], t["denominator"]):
            for terms in part.values():
                for base, power, _ in terms:
                    totals[base] = totals.get(base, 0) + power
        return dict(sorted(totals.items()))

    def powers_string(self, planet: str) -> str:
        """Manual notation: '214, 312, ...' = base then summed power."""
        return ", ".join(f"{b}{p}" for b, p in self.powers_for(planet).items())

    # -- annotation ---------------------------------------------------------
    @staticmethod
    def annotate(arcsec: int) -> str:
        """'26°Le13'36'' Ve/Ke' style string for any longitude."""
        _, star, sub = star_and_sub(arcsec)
        return f"{format_longitude(arcsec)} {star}/{sub}"

    def annotate_planet(self, planet: str, with_house: bool = False) -> str:
        s = self.annotate(self.planets[planet])
        if with_house:
            s += f"-{self.house_of(self.planets[planet])}"
        return s

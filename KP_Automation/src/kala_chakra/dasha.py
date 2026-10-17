"""
dasha.py — Vimshottari dasha engine (Maha → Antar → Pratyantar → Sookshma
→ Prana), replicating Parashara's Light 7.0 output.

No ephemeris needed beyond the Moon's sidereal longitude (which kp_core /
ephemeris already provide to arcsecond precision). Conventions, validated
against the Parashara's Light tables embedded in the chart workbooks:

  * dasha year = 365.25 days (PL default)
  * each level subdivides its parent in Vimshottari proportions
    (years/120), starting from the parent period's own lord
  * the Moon's nakshatra fraction fixes the balance of the first Maha

All period boundaries are exact datetimes; display rounding is up to the
caller.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta

from .kp_core import ARCSEC_PER_NAK, VIM_ORDER, VIM_YEARS

DAYS_PER_YEAR = 365.25


@dataclass
class Period:
    lords: tuple[str, ...]          # e.g. ("Ke", "Ju", "Me")
    start: datetime
    end: datetime

    @property
    def lord(self) -> str:
        return self.lords[-1]

    @property
    def label(self) -> str:
        return "-".join(self.lords)


def _subperiods(parent: Period) -> list[Period]:
    """Split a period into its 9 sub-periods (Vimshottari proportions)."""
    total = (parent.end - parent.start).total_seconds()
    start_idx = VIM_ORDER.index(parent.lord)
    out, t = [], parent.start
    for i in range(9):
        lord = VIM_ORDER[(start_idx + i) % 9]
        dt = timedelta(seconds=total * VIM_YEARS[lord] / 120)
        out.append(Period(parent.lords + (lord,), t, t + dt))
        t += dt
    # absorb float residue into the last period
    out[-1] = Period(out[-1].lords, out[-1].start, parent.end)
    return out


def maha_timeline(moon_arcsec: int, moment: datetime) -> list[Period]:
    """The nine Mahadashas of the cycle containing `moment`.

    moon_arcsec: Moon's sidereal longitude (integer arcseconds), as in
    kp_core Chart.planets["Mo"].
    """
    nak_idx, offset = divmod(moon_arcsec % (27 * ARCSEC_PER_NAK),
                             ARCSEC_PER_NAK)
    lord = VIM_ORDER[nak_idx % 9]
    frac = offset / ARCSEC_PER_NAK                 # elapsed in nakshatra
    elapsed = timedelta(days=VIM_YEARS[lord] * frac * DAYS_PER_YEAR)
    start = moment - elapsed                       # current Maha start

    out = []
    idx = VIM_ORDER.index(lord)
    t = start
    for i in range(9):
        l = VIM_ORDER[(idx + i) % 9]
        dt = timedelta(days=VIM_YEARS[l] * DAYS_PER_YEAR)
        out.append(Period((l,), t, t + dt))
        t += dt
    return out


def drill(period: Period, moment: datetime, depth: int) -> list[Period]:
    """The chain of periods containing `moment`, down to `depth` levels
    below `period` (e.g. depth=4 from a Maha gives Antar..Prana)."""
    chain = []
    cur = period
    for _ in range(depth):
        for sub in _subperiods(cur):
            if sub.start <= moment < sub.end:
                cur = sub
                break
        else:
            cur = _subperiods(cur)[-1]
        chain.append(cur)
    return chain


def current_chain(moon_arcsec: int, moment: datetime,
                  levels: int = 5) -> list[Period]:
    """Maha..Prana (5 levels) running at `moment`."""
    maha = next(p for p in maha_timeline(moon_arcsec, moment)
                if p.start <= moment < p.end)
    return [maha] + drill(maha, moment, levels - 1)


def pratyantar_table(moon_arcsec: int, moment: datetime,
                     antar: Period | None = None) -> list[Period]:
    """The 9 Pratyantars of the Antar containing `moment` (PL-style table)."""
    if antar is None:
        antar = current_chain(moon_arcsec, moment, 2)[1]
    return _subperiods(antar)


def upcoming_pratyantars(moon_arcsec: int, chart_moment: datetime,
                         n: int = 6) -> list[Period]:
    """Next `n` pratyantar periods from the chart moment (current first).

    The timeline is anchored ONCE at the chart moment; future periods are
    walked structurally, never re-anchored.
    """
    out: list[Period] = []
    for maha in maha_timeline(moon_arcsec, chart_moment):
        if maha.end <= chart_moment:
            continue
        for antar in _subperiods(maha):
            if antar.end <= chart_moment:
                continue
            for prat in _subperiods(antar):
                if prat.end <= chart_moment:
                    continue
                out.append(prat)
                if len(out) >= n:
                    return out
    return out


def upcoming_periods(moon_arcsec: int, chart_moment: datetime,
                     depth: int, n: int) -> list[Period]:
    """Next `n` periods at `depth` levels below Maha (4 = Prana), anchored
    once at the chart moment and walked structurally."""
    out: list[Period] = []

    def walk(period: Period, level: int) -> None:
        if len(out) >= n or period.end <= chart_moment:
            return
        if level == depth:
            out.append(period)
            return
        for sub in _subperiods(period):
            walk(sub, level + 1)

    for maha in maha_timeline(moon_arcsec, chart_moment):
        walk(maha, 0)
    return out


def upcoming_pranas(moon_arcsec: int, chart_moment: datetime,
                    n: int = 12) -> list[Period]:
    return upcoming_periods(moon_arcsec, chart_moment, 4, n)


def upcoming_pratyantars_horizon(moon_arcsec: int, chart_moment: datetime,
                                 horizon_days: float = 244) -> list[Period]:
    """All pratyantars overlapping [chart, chart + horizon_days].

    Horizon-based rule: fast antars (Su/Mo/Ma) yield many rows, slow ones
    few, but coverage is always at least the horizon.
    """
    limit = chart_moment + timedelta(days=horizon_days)
    out: list[Period] = []
    for maha in maha_timeline(moon_arcsec, chart_moment):
        if maha.end <= chart_moment or maha.start >= limit:
            continue
        for antar in _subperiods(maha):
            if antar.end <= chart_moment or antar.start >= limit:
                continue
            for prat in _subperiods(antar):
                if prat.end <= chart_moment or prat.start >= limit:
                    continue
                out.append(prat)
    return out


def pranas_in_window(moon_arcsec: int, chart_moment: datetime,
                     window_start: datetime,
                     window_end: datetime) -> list[Period]:
    """All prana periods overlapping the window, anchored once at the
    horary chart moment and walked structurally."""
    out: list[Period] = []

    def walk(period: Period, level: int) -> None:
        if period.end <= window_start or period.start >= window_end:
            return
        if level == 4:
            out.append(period)
            return
        for sub in _subperiods(period):
            walk(sub, level + 1)

    for maha in maha_timeline(moon_arcsec, chart_moment):
        walk(maha, 0)
    return out


def periods_in_window(moon_arcsec: int, chart_moment: datetime,
                      window_start: datetime, window_end: datetime,
                      depth: int) -> list[Period]:
    """Generic: all periods at `depth` levels below Maha (5 = Deha)
    overlapping the window, anchored once at the chart moment."""
    out: list[Period] = []

    def walk(period: Period, level: int) -> None:
        if period.end <= window_start or period.start >= window_end:
            return
        if level == depth:
            out.append(period)
            return
        for sub in _subperiods(period):
            walk(sub, level + 1)

    for maha in maha_timeline(moon_arcsec, chart_moment):
        walk(maha, 0)
    return out


def chain_string(moon_arcsec: int, moment: datetime, levels: int = 5) -> str:
    """'Ke-Ju-Me-…' string of the running periods at `moment`."""
    return "-".join(p.lord for p in current_chain(moon_arcsec, moment,
                                                  levels))

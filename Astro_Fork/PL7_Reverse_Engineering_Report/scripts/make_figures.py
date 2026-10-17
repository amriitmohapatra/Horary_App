"""Regenerate the two evidence figures of the PL7 reverse-engineering report.
Usage: python make_figures.py <dir with e31_parse.py> <swiss ephemeris path> <PL7 Temp dir> <out dir>"""
import sys, glob, numpy as np
sys.path.insert(0, sys.argv[1]); from e31_parse import series, blocks
import swisseph as swe, matplotlib
matplotlib.use("Agg"); import matplotlib.pyplot as plt
swe.set_ephe_path(sys.argv[2]); TEMP, OUT = sys.argv[3], sys.argv[4]
F = swe.FLG_SWIEPH | swe.FLG_NONUT
plt.rcParams.update({"font.size": 10, "axes.labelsize": 10, "xtick.labelsize": 9, "ytick.labelsize": 9,
                     "legend.fontsize": 8.5, "savefig.dpi": 320, "axes.spines.top": False, "axes.spines.right": False})
OI = {"Su": "#E69F00", "Ve": "#56B4E9", "Ma": "#D55E00", "Sa": "#009E73", "Me": "#CC79A7", "Ju": "#0072B2"}
MK = {"Su": "o", "Ve": "s", "Ma": "^", "Sa": "D", "Me": "v", "Ju": "P"}
def lah(jd):
    T = (jd - 2451545) / 36525 + 1
    return 22.46045833333333 + (5026.87434 * T + 1.11113 * T * T) / 3600
BLOCKS = [(840, 0, "Su"), (2376, 2, "Me"), (3400, 3, "Ve"), (1864, 4, "Ma"), (2888, 5, "Ju"), (3912, 6, "Sa")]
def residuals(path):
    jd0, _, B = blocks(path); out = {}
    for off, body, name in BLOCKS:
        s = np.array(B[name]); n = len(s); t = jd0 + 0.5 * np.arange(n); res = []; pred = []; dist = []
        for k in range(n):
            x, _ = swe.calc_ut(t[k], body, F); m, _ = swe.calc_ut(t[k], 1, F)
            res.append((((s[k] - (x[0] - lah(t[k]))) + 180) % 360 - 180) * 3600)   # PL minus SE (arcsec)
            pred.append(np.degrees((m[2] / x[2]) * np.sin(np.radians(m[0] - x[0]))) * 3600)
            dist.append(x[2])
        out[name] = (t - jd0, np.array(res), np.array(pred), np.mean(dist))
    return out
# ---------------- Figure 1 ----------------
r20 = residuals(f"{TEMP}/20201.e31")
fig, ax = plt.subplots(1, 2, figsize=(6.3, 3.0), gridspec_kw={"width_ratios": [1.35, 1]}, constrained_layout=True)
for name in ["Su", "Ve", "Ma", "Sa"]:
    d, res, pred, _ = r20[name]
    ax[0].plot(d, (pred * 0.98785) / 60, color=OI[name], lw=1.4, alpha=0.8)
    ax[0].plot(d[::2], (res[::2] - res.mean()) / 60, ls="none", marker=MK[name], ms=3.6, color=OI[name], alpha=0.85, label=name)
ax[0].axhline(0, color="0.5", lw=0.6)
ax[0].set_xlabel("Days since 1 Jan 2020 0h UT"); ax[0].set_ylabel("PL7 cache − Swiss Eph. (arcmin)")
ax[0].legend(ncol=4, frameon=False, loc="upper center", bbox_to_anchor=(0.5, 1.13), handletextpad=0.2, columnspacing=0.8)
ax[0].text(-0.16, 1.07, "(a)", transform=ax[0].transAxes, fontweight="bold", fontsize=11)
amps = []; dists = []; names = []
for p in ["20201", "20256", "20307", "203510", "204012", "20457"]:
    rr = residuals(f"{TEMP}/{p}.e31")
    for name, (d, res, pred, dist) in rr.items():
        k = np.dot(pred, res - res.mean()) / np.dot(pred, pred); amps.append(k); dists.append(dist); names.append(name)
amps = np.array(amps); dists = np.array(dists)
for name in OI:
    sel = np.array(names) == name
    ax[1].plot(dists[sel], amps[sel], ls="none", marker=MK[name], ms=5, color=OI[name], alpha=0.85, label=name)
ax[1].axhline(0.98785, color="black", ls="--", lw=1)
ax[1].text(0.45, 0.80, "dashed: full Moon vector,\n1 − μ/(1+μ) = 0.988", fontsize=8.5)
ax[1].axhline(0, color="0.5", lw=0.6)
ax[1].text(0.45, 0.04, "correct reduction: 0", fontsize=8.5)
ax[1].legend(ncol=3, frameon=False, loc="center", bbox_to_anchor=(0.5, 0.42), handletextpad=0.1, columnspacing=0.6)
ax[1].set_xscale("log"); ax[1].set_ylim(-0.08, 1.12)
ax[1].set_xlabel("Mean geocentric distance (AU)"); ax[1].set_ylabel("Fitted Moon-vector coefficient")
ax[1].text(-0.2, 1.07, "(b)", transform=ax[1].transAxes, fontweight="bold", fontsize=11)
for ext in ("pdf", "png"): fig.savefig(f"{OUT}/fig_transit_moon_vector.{ext}")
print("fig1 coefficient summary: mean %.3f sd %.3f n=%d" % (amps.mean(), amps.std(), len(amps)))
# ---------------- Figure 2 ----------------
yrs = []; dpl = []; dse = []
for path in sorted(glob.glob(f"{TEMP}/*.e31")):
    jd0, jd1, B = blocks(path)
    if jd0 >= swe.julday(2049, 1, 1, 0.0): continue          # stop at 2049-01-01 (end of PL7's precise ephemeris)
    vals = []; B[1352] = B["Mo"]
    for k in range(0, len(B["Mo"]), 4):
        t = jd0 + 0.5 * k; xm, _ = swe.calc_ut(t, 1, F | swe.FLG_SPEED)
        rm = (((xm[0] - lah(t) - B[1352][k]) + 180) % 360 - 180) * 3600
        if abs(rm) < 600: vals.append(swe.deltat(t) * 86400 - rm / (xm[3] * 3600 / 86400))
    y, m, d, _ = swe.revjul(jd0); yrs.append(y + (m - 0.5) / 12); dpl.append(np.mean(vals)); dse.append(swe.deltat(jd0) * 86400)
o = np.argsort(yrs); yrs = np.array(yrs)[o]; dpl = np.array(dpl)[o]; dse = np.array(dse)[o]
sf = np.array([(2019.29, 76.28), (2021.37, 79.33), (2022.98, 80.86), (2023.20, 82.44), (2023.61, 82.40), (2024.00, 83.96), (2024.54, 83.98), (2026.51, 87.50)])
fig, ax = plt.subplots(figsize=(6.3, 2.9), constrained_layout=True)
ax.plot(yrs, dpl, ls="none", marker="o", ms=2.6, color="#D55E00", alpha=0.7, label="PL7 (inferred from its transit cache)")
ax.plot(yrs, dse, color="#0072B2", lw=1.6, label="Swiss Ephemeris 2.10 (Kala Chakra 'modern')")
ax.plot(sf[:, 0], sf[:, 1], ls="-", marker="s", ms=4, color="black", lw=1, label="Solar Fire anchors (Kala Chakra 'sf')")
ax.set_xlabel("Year"); ax.set_ylabel("ΔT = TT − UT (s)"); ax.set_ylim(60, 112)
ax.legend(frameon=False, loc="upper left")
for ext in ("pdf", "png"): fig.savefig(f"{OUT}/fig_deltat.{ext}")
fit = np.polyfit(yrs, dpl, 1); print("PL dT fit slope %.3f s/yr, value 2020 %.1f, 2025 %.1f" % (fit[0], np.polyval(fit, 2020), np.polyval(fit, 2025)))

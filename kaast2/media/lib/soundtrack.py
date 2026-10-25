"""
Soundtrack for the Astro-Amriit videos: a tanpura-style drone (Pa Sa Sa Sa,
Sa = C#3) with soft bell accents in the same key, a small synthetic reverb,
and the narration laid on top with the music ducked under the voice.

Usage: python3 media/lib/soundtrack.py <spec.json> <out.wav>
spec = {"length": seconds, "voice": [[start_s, "file.wav"], ...],
        "bells": [start_s, ...], "music_db": -24, "duck_db": -9}
"""
import json, sys
import numpy as np
import soundfile as sf
from scipy.signal import fftconvolve, butter, sosfilt

SR = 48000
SA = 138.59  # C#3

def pluck(f, dur, seed):
    t = np.arange(int(dur * SR)) / SR
    rng = np.random.default_rng(seed)
    out = np.zeros_like(t)
    for k in range(1, 16):
        amp = 1 / k ** 0.9
        decay = np.exp(-t * (0.55 + 0.11 * k))
        # jawari: upper partials bloom a moment after the pluck, then fade
        bloom = 1 + (0.9 if k > 3 else 0.2) * np.sin(np.pi * np.clip(t / 2.6, 0, 1)) ** 2
        detune = 1 + rng.normal(0, 0.0006)
        out += amp * decay * bloom * np.sin(2 * np.pi * k * f * detune * t + rng.uniform(0, 6.28))
    out *= np.minimum(1, t / 0.012)
    return out

def bell(f, dur=4.0):
    t = np.arange(int(dur * SR)) / SR
    parts = [(1, 1, 1.0), (2.0, .5, 1.6), (3.01, .3, 2.2), (4.2, .18, 3.0), (5.4, .1, 3.6)]
    return sum(a * np.exp(-t * d) * np.sin(2 * np.pi * f * r * t) for r, a, d in parts) * np.minimum(1, t / 0.004)

def reverb(x, secs=2.2, mix=0.28):
    n = int(secs * SR)
    rng = np.random.default_rng(7)
    ir = rng.normal(0, 1, n) * np.exp(-np.arange(n) / SR * 3.2)
    ir = sosfilt(butter(2, 4500, 'low', fs=SR, output='sos'), ir)
    ir /= np.sqrt(np.sum(ir ** 2))
    wet = fftconvolve(x, ir)[: len(x)]
    return (1 - mix) * x + mix * wet

def main():
    spec = json.load(open(sys.argv[1]))
    L = int(spec['length'] * SR)
    music = np.zeros(L + SR * 5)
    # tanpura cycle: Pa(low) Sa Sa Sa(low), 1.1 s apart, cycle 4.6 s
    pattern = [(SA * 3 / 4, 0), (SA, 1.1), (SA, 2.2), (SA / 2, 3.3)]
    cyc, seed = 0.0, 1
    while cyc < spec['length'] + 1:
        for f, off in pattern:
            s = int((cyc + off) * SR)
            p = pluck(f, 5.0, seed); seed += 1
            music[s:s + len(p)] += p[: max(0, len(music) - s)]
        cyc += 4.6
    for b in spec.get('bells', []):
        s = int(b * SR); p = bell(SA * 4) * 0.55 + bell(SA * 6) * 0.25
        music[s:s + len(p)] += p[: max(0, len(music) - s)]
    music = music[:L]
    music = sosfilt(butter(2, [70, 6000], 'band', fs=SR, output='sos'), music)
    music = reverb(music)
    # fade in/out
    fi, fo = int(1.2 * SR), int(2.5 * SR)
    music[:fi] *= np.linspace(0, 1, fi); music[-fo:] *= np.linspace(1, 0, fo) ** 1.5
    music /= np.sqrt(np.mean(music ** 2)) + 1e-9
    music *= 10 ** (spec.get('music_db', -24) / 20)
    voice = np.zeros(L)
    for start, path in spec['voice']:
        v, sr = sf.read(path, dtype='float64')
        if v.ndim > 1: v = v.mean(1)
        if sr != SR:
            from scipy.signal import resample_poly
            from math import gcd
            g = gcd(sr, SR); v = resample_poly(v, SR // g, sr // g)
        s = int(start * SR); e = min(L, s + len(v)); voice[s:e] += v[: e - s]
    # duck: smoothed voice envelope
    env = np.abs(voice)
    k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, mode='same')
    env = np.clip(env / (np.percentile(env[env > 1e-4], 60) if np.any(env > 1e-4) else 1), 0, 1)
    duck = 10 ** (spec.get('duck_db', -9) * env / 20)
    mix = music * duck + voice * 0.9
    mix /= max(1.0, np.max(np.abs(mix)) / 0.97)
    sf.write(sys.argv[2], np.stack([mix, mix], 1).astype(np.float32), SR)
    print(sys.argv[2], round(L / SR, 2), 's')

if __name__ == '__main__':
    main()

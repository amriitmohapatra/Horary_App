"""
Assemble the video guide from the recorded chapters.
  python3 media/guide/assemble.py            # all chapters with recordings
Inputs (media/guide/work/): <id>/frames + frames.json + timeline.json, voice/<seg>.wav,
narration.json, cards/<id>.png (made by cards.mjs).
Outputs (media/guide/out/): astro-amriit-guide.mp4 (chapters + soft subtitles),
astro-amriit-guide.srt, chapters.txt.
"""
import json, os, subprocess, sys
import numpy as np
import soundfile as sf
from math import gcd
from scipy.signal import resample_poly

HERE = os.path.dirname(os.path.abspath(__file__))
W = os.path.join(HERE, 'work'); OUT = os.path.join(HERE, 'out')
sys.path.insert(0, os.path.join(HERE, '..', 'lib'))
from soundtrack import bell, SA  # noqa: E402
SR = 48000; FPS = 30; CARD = 3.2


def run(*a):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *a], check=True)


def load(path):
    v, sr = sf.read(path, dtype='float64')
    if v.ndim > 1: v = v.mean(1)
    if sr != SR:
        g = gcd(sr, SR); v = resample_poly(v, SR // g, sr // g)
    return v


def chapter(cid, texts):
    d = os.path.join(W, cid)
    frames = json.load(open(os.path.join(d, 'frames.json')))
    tl = json.load(open(os.path.join(d, 'timeline.json')))
    t0 = frames[0]['t']; length = frames[-1]['t'] - t0 + 0.5
    vid = os.path.join(d, 'video.mp4'); out = os.path.join(d, 'chapter.mp4')
    fresh = os.path.exists(out) and os.path.getmtime(out) > os.path.getmtime(os.path.join(d, 'frames.json'))
    if not fresh: subprocess.run([sys.executable, os.path.join(HERE, '..', 'lib', 'frames2video.py'), d, vid, str(FPS)], check=True, capture_output=True)
    audio = np.zeros(int(length * SR)); subs = []
    for seg in tl:
        if 'duration' not in seg: continue
        v = load(os.path.join(W, 'voice', f"{seg['id']}.wav")) * 0.95
        s = int((seg['start'] - t0 + 0.12) * SR); e = min(len(audio), s + len(v))
        audio[s:e] += v[: e - s]
        subs.append((s / SR, e / SR, texts[seg['id']]))
    if fresh: return out, length, subs  # encoded after the last recording: reuse
    wav = os.path.join(d, 'voice.wav'); sf.write(wav, np.stack([audio, audio], 1).astype(np.float32), SR)
    run('-i', vid, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p',
        '-vf', f'fade=in:st=0:d=0.35,fade=out:st={length - 0.4:.2f}:d=0.4', '-c:a', 'aac', '-b:a', '160k', '-ar', str(SR), '-t', f'{length:.3f}', out)
    return out, length, subs


def card(cid):
    png = os.path.join(W, 'cards', f'{cid}.png'); out = os.path.join(W, 'cards', f'{cid}.mp4')
    n = int(CARD * SR); a = np.zeros(n)
    b = bell(SA * 4) * 0.22 + bell(SA * 6) * 0.08; a[int(0.15 * SR): int(0.15 * SR) + len(b)] += b[: n - int(0.15 * SR)]
    wav = out.replace('.mp4', '.wav'); sf.write(wav, np.stack([a, a], 1).astype(np.float32), SR)
    run('-loop', '1', '-framerate', str(FPS), '-i', png, '-i', wav, '-t', str(CARD), '-vf', f'fade=in:st=0:d=0.4,fade=out:st={CARD - 0.45}:d=0.45,format=yuv420p',
        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-c:a', 'aac', '-b:a', '160k', '-ar', str(SR), out)
    return out


def ts(x):
    h, r = divmod(x, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}".replace('.', ',')


def main():
    os.makedirs(OUT, exist_ok=True)
    nar = json.load(open(os.path.join(W, 'narration.json')))
    texts = {s['id']: s['text'] for s in nar['segments']}
    meta = json.load(open(os.path.join(W, 'chapters.json')))
    parts, chapters, srt, t = [], [], [], 0.0
    for ch in meta:
        if not os.path.exists(os.path.join(W, ch['id'], 'frames.json')): continue
        c = card(ch['id']); v, L, subs = chapter(ch['id'], texts)
        chapters.append((t, ch['title'])); parts += [c, v]
        for a, b, txt in subs: srt.append((t + CARD + a, t + CARD + b, txt))
        t += CARD + L
        print(ch['id'], f'{L:.1f}s', flush=True)
    lst = os.path.join(W, 'parts.txt')
    open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    joined = os.path.join(W, 'joined.mp4')
    run('-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', joined)
    with open(os.path.join(OUT, 'astro-amriit-guide.srt'), 'w') as f:
        for i, (a, b, txt) in enumerate(srt, 1): f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{txt}\n\n")
    fm = os.path.join(W, 'chapters.ffmeta')
    with open(fm, 'w') as f:
        f.write(';FFMETADATA1\ntitle=Astro-Amriit — video guide\n')
        for i, (a, title) in enumerate(chapters):
            end = chapters[i + 1][0] if i + 1 < len(chapters) else t
            f.write(f"[CHAPTER]\nTIMEBASE=1/1000\nSTART={int(a * 1000)}\nEND={int(end * 1000)}\ntitle={title}\n")
    final = os.path.join(OUT, 'astro-amriit-guide.mp4')
    run('-i', joined, '-i', os.path.join(OUT, 'astro-amriit-guide.srt'), '-i', fm, '-map', '0', '-map', '1', '-map_metadata', '2',
        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:s', 'mov_text',
        '-metadata:s:s:0', 'language=eng', '-movflags', '+faststart', final)
    with open(os.path.join(OUT, 'chapters.txt'), 'w') as f:
        for a, title in chapters: f.write(f"{int(a // 60)}:{int(a % 60):02d} {title}\n")
    print(final, f'{t / 60:.1f} min')


if __name__ == '__main__':
    main()

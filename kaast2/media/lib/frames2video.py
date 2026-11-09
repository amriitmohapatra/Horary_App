"""
Screencast frames (irregular timestamps) -> constant-frame-rate video.
Usage: python3 media/lib/frames2video.py <capture_dir> <out.(webm|mp4)> [fps] [--intra]
<capture_dir> holds frames/ and frames.json from Director.stopCapture().
Frame i is shown from its timestamp until the next one; the last frame until the capture's end.
--intra makes every frame a keyframe (exact, fast seeking in the compositor).
"""
import json, os, subprocess, sys

cap, out = sys.argv[1], sys.argv[2]
fps = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3].isdigit() else 30
intra = '--intra' in sys.argv
frames = json.load(open(os.path.join(cap, 'frames.json')))
# a still screen sends no frames: hold the last one until the capture ended (timeline '__end')
tlp = os.path.join(cap, 'timeline.json')
end = next((e['start'] for e in json.load(open(tlp)) if e['id'] == '__end'), None) if os.path.exists(tlp) else None
lst = os.path.join(cap, 'concat.txt')
with open(lst, 'w') as f:
    for i, fr in enumerate(frames):
        dur = (frames[i + 1]['t'] - fr['t']) if i + 1 < len(frames) else max(1 / fps, (end or 0) - fr['t'])
        f.write(f"file 'frames/{fr['name']}'\nduration {max(dur, 0.001):.6f}\n")
    f.write(f"file 'frames/{frames[-1]['name']}'\n")
vf = f"fps={fps},scale=1920:1080:flags=lanczos,format=yuv420p"
if out.endswith('.webm'):
    codec = ['-c:v', 'libvpx-vp9', '-crf', '24', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4']
else:
    codec = ['-c:v', 'libx264', '-crf', '16', '-preset', 'medium']
if intra:
    codec += ['-g', '1']
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-vf', vf, *codec, '-an', out], check=True)
print(out, f"{frames[-1]['t'] - frames[0]['t']:.2f}s")

"""
Finish the launch video after `node render.mjs`: soundtrack, poster frame, encode.
  python3 media/brag-output/finish.py [poster_time_s]
Reads work/timing.json, work/voice/*.wav and work/comp/f*.jpg; writes brag.mp4 and brag.jpg.
Each voice line starts 0.3 s into its scene; a soft conch opens the reveal (s2) and the outro (s6).
The poster (frame 0 of the video, also brag.jpg) is the frame at poster_time_s (default: the
settled title, 1.6 s into s2).
"""
import json, os, shutil, subprocess, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from soundtrack import loudnorm_args  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__)); W = os.path.join(HERE, 'work')
T = json.load(open(os.path.join(W, 'timing.json')))
FPS = 30
spec = {
    'length': T['end'],
    'voice': [[T[s] + 0.3, os.path.join(W, 'voice', f'{s}.wav')] for s in ('s1', 's2', 's3', 's4', 's5', 's6')],
    'conch': [max(0, T['s2'] - 0.35), max(0, T['s6'] - 0.35)],  # the swell peaks as the title settles
    'music_db': -23, 'duck_db': -8,
}
json.dump(spec, open(os.path.join(W, 'sound.json'), 'w'), indent=1)
mix = os.path.join(W, 'mix.wav')
subprocess.run([sys.executable, os.path.join(HERE, '..', 'lib', 'soundtrack.py'), os.path.join(W, 'sound.json'), mix], check=True)

# poster: copy the chosen settled frame over frame 0 (same frame count, so sync is unchanged)
pt = float(sys.argv[1]) if len(sys.argv) > 1 else T['s2'] + 1.6
comp = os.path.join(W, 'comp')
src = os.path.join(comp, f'f{round(pt * FPS):05d}.jpg')
shutil.copy(src, os.path.join(HERE, 'brag.jpg'))
f0 = os.path.join(comp, 'f00000.jpg'); orig = os.path.join(W, 'f00000.orig.jpg')
shutil.copy(f0, orig); shutil.copy(src, f0)
try:
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(comp, 'f%05d.jpg'), '-i', mix,
                    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '192k', '-af', loudnorm_args(mix), '-ar', '48000',
                    '-shortest', '-movflags', '+faststart', os.path.join(HERE, 'brag.mp4')], check=True)
finally:
    shutil.copy(orig, f0)  # keep the rendered frames as rendered
print(os.path.join(HERE, 'brag.mp4'), f"{T['end']:.1f}s", 'poster', f'{pt:.2f}s')

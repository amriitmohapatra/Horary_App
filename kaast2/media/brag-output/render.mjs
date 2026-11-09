/**
 * Render the launch video frames from compositor.html (pure function of time).
 * node media/brag-output/render.mjs [--stills t1,t2,...]
 */
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const here = new URL('./', import.meta.url).pathname;
const FPS = 30;
const dur = JSON.parse(readFileSync(here + 'work/voice/durations.json', 'utf8'));
const fr = JSON.parse(readFileSync(here + 'work/clipB/frames.json', 'utf8'));
const tlB = JSON.parse(readFileSync(here + 'work/clipB/timeline.json', 'utf8'));
const marks = tlB.map((x) => +(x.start - fr[0].t - 0.15).toFixed(2));
// clip A: the moment the place list opens, the planet table, and the clip's length (clip seconds)
const frA = JSON.parse(readFileSync(here + 'work/clipA/frames.json', 'utf8'));
const tlA = JSON.parse(readFileSync(here + 'work/clipA/timeline.json', 'utf8'));
const atA = (id) => { const m = tlA.find((x) => x.id === id); return m ? m.start - frA[0].t : null; };
const lenA = (atA('__end') ?? frA.at(-1).t - frA[0].t);
// Scene starts: each voice line starts 0.3 s into its scene; scenes end 0.6 s after the line.
const gap = 0.3, tail = 0.6;
const T = { s1: 0 };
T.s2 = +(gap + dur.s1 + tail - 0.1).toFixed(2);
T.s3 = +(T.s2 + gap + dur.s2 + tail).toFixed(2);
T.rateA = 1.3; T.rateB = 1.5;
T.s4 = +(T.s3 + Math.max(gap + dur.s3 + tail, 9.0, lenA / T.rateA + 0.3)).toFixed(2);
T.s5 = +(T.s4 + Math.max(gap + dur.s4 + tail, 13.4)).toFixed(2);
T.s6 = +(T.s5 + gap + dur.s5 + tail).toFixed(2);
T.end = +(T.s6 + gap + dur.s6 + 1.8).toFixed(2);
// captions follow the clip: the atlas one while the place list is open, the 9-of-9 one with the planet table
if (atA('atlas') !== null) { T.chipAt = +(T.s3 + atA('atlas') / T.rateA).toFixed(2); T.chipAtEnd = +(T.s3 + (atA('table') ?? atA('atlas') + 3) / T.rateA - 0.4).toFixed(2); }
if (atA('table') !== null) T.chipA = +(T.s3 + atA('table') / T.rateA + 0.8).toFixed(2);
writeFileSync(here + 'work/timing.json', JSON.stringify(T, null, 1));
const stills = process.argv.includes('--stills') ? process.argv[process.argv.indexOf('--stills') + 1].split(',').map(Number) : null;
const out = here + (stills ? 'work/stills/' : 'work/comp/');
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await page.addInitScript(([T, m]) => { window.T = T; window.TABMARKS = m; }, [T, marks]);
await page.goto('file://' + here + 'compositor.html');
await page.evaluate(() => window.ready);
const times = stills ?? Array.from({ length: Math.round(T.end * FPS) }, (_, i) => i / FPS);
let i = 0;
for (const t of times) {
  await page.evaluate((t) => window.render(t), t);
  await page.screenshot({ path: `${out}${stills ? `s_${t.toFixed(2)}` : `f${String(i).padStart(5, '0')}`}.jpg`, type: 'jpeg', quality: 93 });
  i++;
}
await b.close();
console.log(JSON.stringify(T), times.length, 'frames');

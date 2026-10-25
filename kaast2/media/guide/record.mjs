/**
 * Record the guide chapters: node media/guide/record.mjs [c03 c07 …]
 * Needs work/voice/durations.json (python3 media/tts.py work/narration.json work/voice).
 * Each chapter → work/<id>/ (frames, frames.json, timeline.json).
 */
import { readFileSync } from 'node:fs';
import { openApp } from '../lib/app.mjs';
import { CHAPTERS, setup } from './chapters.mjs';
const W = new URL('./work/', import.meta.url).pathname;
const dur = JSON.parse(readFileSync(W + 'voice/durations.json', 'utf8'));
const only = process.argv.slice(2);
for (const ch of CHAPTERS) {
  if (only.length && !only.includes(ch.id)) continue;
  const { browser, page, d } = await openApp(W + ch.id);
  try {
    await setup(d, page, ch);
    await d.startCapture();
    await d.wait(600);
    for (const s of ch.segments) {
      await d.segment(s.id, dur[s.id], async () => {
        await d.wait(250);
        try { await s.act(d, page); } catch (e) { console.error(`${s.id}: ${e.message.split('\n')[0]}`); }
      }, 0.45);
    }
    await d.zoomOut(); await d.unhighlight(); await d.wait(700);
    await d.stopCapture();
    console.log(ch.id, 'recorded');
  } finally { await browser.close(); }
}

/** Chapter title cards (1920×1080 PNG) and work/chapters.json. node media/guide/cards.mjs */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { CHAPTERS } from './chapters.mjs';
const W = new URL('./work/', import.meta.url).pathname;
const NM = new URL('../../node_modules/', import.meta.url).href;
mkdirSync(W + 'cards', { recursive: true });
writeFileSync(W + 'chapters.json', JSON.stringify(CHAPTERS.map((c) => ({ id: c.id, title: c.title })), null, 1));
const html = (n, title) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Marcellus;src:url('${NM}@fontsource/marcellus/files/marcellus-latin-400-normal.woff2')}
@font-face{font-family:Atkinson;src:url('${NM}@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff2')}
html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:radial-gradient(1200px 800px at 50% 45%,#1b2450 0%,#141b3d 45%,#0e1330 100%);color:#e4e7f2;font-family:Atkinson}
.k{position:absolute;left:0;right:0;top:350px;text-align:center;font-size:34px;letter-spacing:.2em;text-transform:uppercase;color:#a6aecf}
.t{position:absolute;left:0;right:0;top:420px;text-align:center;font-family:Marcellus;font-size:118px;color:#ecd396}
.r{position:absolute;left:760px;right:760px;top:610px;height:2px;background:#c6a15b}
.f{position:absolute;left:0;right:0;bottom:70px;text-align:center;font-size:26px;color:#a6aecf;letter-spacing:.08em}
</style></head><body>${n ? `<div class="k">Chapter ${n}</div>` : '<div class="k">Video guide</div>'}<div class="t">${title}</div><div class="r"></div>
<div class="f">Astro-Amriit · Karar Ashram Astrology Software · v0.9</div></body></html>`;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const [i, c] of CHAPTERS.entries()) {
  await p.setContent(html(i, i === 0 ? 'Astro-Amriit' : c.title)); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${W}cards/${c.id}.png` });
}
await b.close(); console.log('cards', CHAPTERS.length);

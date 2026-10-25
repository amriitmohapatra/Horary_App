/**
 * Director for screen-recorded guides: a visible cursor, a CSS "camera" that
 * zooms into parts of the page (text stays sharp: the page re-renders at the
 * zoom), frame capture through Chrome's screencast (PNG frames + timestamps),
 * and a timeline of narration segments. Used by record_guide.mjs and the
 * launch video. Pure Playwright; no app code is changed.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CSS = `
#__cursor{position:fixed;left:0;top:0;width:28px;height:28px;z-index:2147483647;pointer-events:none;
  transform:translate(-4px,-2px);transition:transform .05s linear;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))}
#__ripple{position:fixed;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:3px solid #e8a33d;
  z-index:2147483646;pointer-events:none;opacity:0;transform:scale(.3)}
#__ripple.on{animation:__rip .5s ease-out}
@keyframes __rip{0%{opacity:.95;transform:scale(.3)}100%{opacity:0;transform:scale(1.6)}}
body.__cam{transition:transform .9s cubic-bezier(.45,.05,.25,1);transform-origin:0 0}
#__caption{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);max-width:78%;z-index:2147483645;pointer-events:none;
  background:rgba(16,20,43,.86);color:#fff;font:600 20px/1.35 'Atkinson Hyperlegible',system-ui,sans-serif;padding:10px 18px;border-radius:10px;
  opacity:0;transition:opacity .35s}
#__caption.on{opacity:1}
#__hl{position:fixed;z-index:2147483644;pointer-events:none;border:3px solid #e8a33d;border-radius:8px;box-shadow:0 0 0 9999px rgba(10,12,30,.28);
  opacity:0;transition:all .45s ease}
#__hl.on{opacity:1}`;
const CURSOR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><path d="M3 2 L3 22 L8.5 17 L12.5 26 L16 24.5 L12 15.8 L19.5 15.8 Z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

export class Director {
  constructor(page, cdp, outDir) {
    this.page = page; this.cdp = cdp; this.out = outDir;
    this.frames = []; this.timeline = []; this.t0 = null; this.x = 640; this.y = 360; this.zoom = 1;
    mkdirSync(join(outDir, 'frames'), { recursive: true });
  }
  /** Inject cursor, camera and caption layers (call after every navigation). */
  async install() {
    await this.page.evaluate(([css, svg]) => {
      if (document.getElementById('__cursor')) return;
      const st = document.createElement('style'); st.textContent = css; document.documentElement.appendChild(st);
      const c = document.createElement('div'); c.id = '__cursor'; c.innerHTML = svg; document.documentElement.appendChild(c);
      const r = document.createElement('div'); r.id = '__ripple'; document.documentElement.appendChild(r);
      const cap = document.createElement('div'); cap.id = '__caption'; document.documentElement.appendChild(cap);
      const hl = document.createElement('div'); hl.id = '__hl'; document.documentElement.appendChild(hl);
      document.body.classList.add('__cam');
      // Event coordinates are screen pixels; the overlay lives inside the zoomed page.
      const z = () => parseFloat(document.documentElement.style.zoom) || 1;
      addEventListener('mousemove', (e) => { c.style.left = `${e.clientX / z()}px`; c.style.top = `${e.clientY / z()}px`; }, true);
    }, [CSS, CURSOR_SVG]);
    await this.page.mouse.move(this.x, this.y);
  }
  async startCapture() {
    let i = 0;
    this.cdp.on('Page.screencastFrame', async (f) => {
      const name = `f${String(i++).padStart(6, '0')}.jpg`;
      writeFileSync(join(this.out, 'frames', name), Buffer.from(f.data, 'base64'));
      this.frames.push({ name, t: f.metadata.timestamp });
      if (this.t0 === null) this.t0 = f.metadata.timestamp;
      try { await this.cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch { /* closed */ }
    });
    await this.cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
  }
  async stopCapture() {
    this.timeline.push({ id: '__end', start: this.now() }); // the screen may be still: frames stop early
    await this.cdp.send('Page.stopScreencast');
    writeFileSync(join(this.out, 'frames.json'), JSON.stringify(this.frames));
    writeFileSync(join(this.out, 'timeline.json'), JSON.stringify(this.timeline, null, 1));
  }
  now() { return Date.now() / 1000; }
  /** Record a named moment (seconds since the epoch, the frames' clock). */
  mark(id) { this.timeline.push({ id, start: this.now() }); }
  wait(ms) { return this.page.waitForTimeout(ms); }
  /** Smooth human-like move to a point (viewport coordinates). */
  async moveTo(x, y, ms = 700) {
    const steps = Math.max(8, Math.round(ms / 16));
    const x0 = this.x, y0 = this.y;
    for (let k = 1; k <= steps; k++) {
      const s = k / steps, e = s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2;
      await this.page.mouse.move(x0 + (x - x0) * e, y0 + (y - y0) * e);
      await this.page.waitForTimeout(ms / steps);
    }
    this.x = x; this.y = y;
  }
  async box(loc) {
    await loc.scrollIntoViewIfNeeded().catch(() => {});
    const b = await loc.boundingBox();
    if (!b) throw new Error('no box for locator');
    return b;
  }
  async hover(loc, ms) { const b = await this.box(loc); await this.moveTo(b.x + b.width / 2, b.y + b.height / 2, ms); }
  async click(loc, ms) {
    await this.hover(loc, ms);
    const b = await this.box(loc); // re-aim if the target moved while the cursor travelled
    if (Math.abs(b.x + b.width / 2 - this.x) > 4 || Math.abs(b.y + b.height / 2 - this.y) > 4) await this.moveTo(b.x + b.width / 2, b.y + b.height / 2, 250);
    await this.page.evaluate(([x, y]) => { const z = parseFloat(document.documentElement.style.zoom) || 1; const r = document.getElementById('__ripple'); r.style.left = `${x / z}px`; r.style.top = `${y / z}px`; r.classList.remove('on'); void r.offsetWidth; r.classList.add('on'); }, [this.x, this.y]);
    await this.page.mouse.down(); await this.wait(70); await this.page.mouse.up();
    await this.wait(250);
  }
  async type(loc, text, delay = 55) { await this.click(loc); await loc.fill(''); await loc.pressSequentially(text, { delay }); }
  /** Page zoom used for crisp 1080p frames (screen px per CSS px). */
  async pageZoom() { return this.page.evaluate(() => parseFloat(document.documentElement.style.zoom) || 1); }
  /**
   * Zoom the camera so the element fills about `fill` of the view, centred.
   * The framing is found by measurement (apply invisibly, measure, correct),
   * so it does not depend on how the browser reports units under page zoom.
   */
  async zoomTo(loc, fill = 0.85, maxScale = 1.8) {
    await this.zoomOut(0);
    await this.wait(60);
    const b = await this.box(loc);
    const z = await this.pageZoom();
    const [vw, vh] = await this.page.evaluate(() => [innerWidth, innerHeight]); // screen px
    const s = Math.min(maxScale, Math.max(1, Math.min((vw * fill) / b.width, (vh * fill) / b.height)));
    const set = (tx, ty, sc, animate) => this.page.evaluate(([tx, ty, sc, animate]) => {
      const st = document.body.style;
      if (!animate) st.transition = 'none';
      st.transform = sc === 1 && tx === 0 && ty === 0 ? '' : `translate(${tx}px, ${ty}px) scale(${sc})`;
      void document.body.offsetWidth;
      if (!animate) st.transition = '';
    }, [tx, ty, sc, animate]);
    // first guess, then two corrections by measurement (translate is in CSS px: screen = css × z)
    let tx = 0, ty = 0;
    await set(0, 0, s, false);
    for (let k = 0; k < 3; k++) {
      const m = await loc.boundingBox();
      tx += (vw / 2 - (m.x + m.width / 2)) / z; ty += (vh / 2 - (m.y + m.height / 2)) / z;
      await set(tx, ty, s, false);
    }
    // keep the page covering the frame: a target near an edge is framed off-centre, never with blank margins
    const pb = await this.page.locator('body').boundingBox();
    if (pb) {
      if (pb.x > 0) tx -= pb.x / z; else if (pb.x + pb.width < vw) tx += (vw - pb.x - pb.width) / z;
      if (pb.y > 0) ty -= pb.y / z; else if (pb.y + pb.height < vh) ty += Math.min(-pb.y, vh - pb.y - pb.height) / z;
    }
    await set(0, 0, 1, false);
    await set(tx, ty, s, true);
    this.zoom = s; await this.wait(1000);
  }
  async zoomOut(ms = 950) {
    if (this.zoom === 1 && ms) return;
    // ms = 0 is a cut: switch the camera transition off so later measurements see the final layout
    await this.page.evaluate((cut) => { const st = document.body.style; if (cut) st.transition = 'none'; st.transform = ''; void document.body.offsetWidth; if (cut) st.transition = ''; }, !ms);
    this.zoom = 1; if (ms) await this.wait(ms);
  }
  /** Highlight a region with a soft spotlight (viewport coordinates, follows camera). */
  async highlight(loc, pad = 8) {
    const b = await this.box(loc);
    await this.page.evaluate(([x, y, w, h]) => { const z = parseFloat(document.documentElement.style.zoom) || 1; [x, y, w, h] = [x / z, y / z, w / z, h / z]; const e = document.getElementById('__hl'); Object.assign(e.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` }); e.classList.add('on'); }, [b.x - pad, b.y - pad, b.width + 2 * pad, b.height + 2 * pad]);
  }
  async unhighlight() { await this.page.evaluate(() => document.getElementById('__hl')?.classList.remove('on')); }
  async caption(text) { await this.page.evaluate((t) => { const c = document.getElementById('__caption'); if (!t) { c.classList.remove('on'); return; } c.textContent = t; c.classList.add('on'); }, text); }
  /**
   * A narration segment: run `actions` while the voice plays; the segment
   * lasts at least the audio's duration (+ pad seconds).
   */
  async segment(id, durationSec, actions, pad = 0.5) {
    const start = this.now();
    this.timeline.push({ id, start, duration: durationSec });
    if (actions) await actions();
    const left = durationSec + pad - (this.now() - start);
    if (left > 0) await this.wait(left * 1000);
  }
}

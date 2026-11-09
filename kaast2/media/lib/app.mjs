/**
 * Open Astro-Amriit for a recording: 1920×1080 frames of a 1422×800 CSS-px
 * layout (page zoom 1.35), light theme, normal text, engine ready.
 * The example chart is the public one used throughout the user guide.
 */
import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { Director } from './director.mjs';

export const APP = resolve(import.meta.dirname, '../../dist/Astro-Amriit v0.11.html');
export const EXAMPLE = { name: 'Amitabh Bachchan', date: '1942-10-11', time: '16:00:00', place: 'Allahabad (Prayagraj)' };
export const PARTNER = { name: 'Synthetic partner', date: '1948-04-09', time: '09:30:00', place: 'Allahabad (Prayagraj)' };

export async function openApp(outDir, { hash = '', theme = 'light' } = {}) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await ctx.addInitScript((th) => { try { localStorage.setItem('kaast2.theme.v1', th); localStorage.setItem('kaast2.textSize.v1', 'normal'); } catch { /* */ } }, theme);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await page.goto(`file://${APP}${hash}`);
  await page.waitForSelector('[data-testid=engine-status][data-state=ready]', { timeout: 30000 });
  await page.evaluate(() => { document.documentElement.style.zoom = '1.35'; });
  const d = new Director(page, cdp, outDir);
  await d.install();
  return { browser, page, d };
}

/** Fill the chart form; `typed` shows the typing, otherwise fills instantly. Then Cast chart. */
export async function castChart(d, page, c = EXAMPLE, { typed = true } = {}) {
  if (typed) await d.type(page.getByLabel('Name'), c.name, 45); else await page.getByLabel('Name').fill(c.name);
  await page.getByLabel('Date').fill(c.date);
  await page.getByLabel('Hours', { exact: true }).fill(c.time);
  if (typed) {
    // type the start of the name, let the suggestion list (saved places, then the world atlas) open, pick from it
    await d.type(page.getByLabel('Place'), c.place.split(' (')[0], 70);
    await page.getByRole('listbox', { name: 'Suggestions' }).waitFor();
    d.mark('atlas');
    await d.zoomTo(page.getByRole('listbox', { name: 'Suggestions' }), 0.75, 1.9); await d.wait(900);
    await d.click(page.getByRole('option').filter({ hasText: c.place }).first(), 650);
    await d.zoomOut();
  } else {
    await page.getByLabel('Place').fill(c.place);
    await page.getByLabel('Place').press('Tab');
  }
  if (typed) await d.click(page.getByRole('button', { name: 'Cast chart' })); else await page.getByRole('button', { name: 'Cast chart' }).click();
  await page.getByRole('button', { name: 'Edit chart' }).waitFor();
}

/** Click a main tab (the nav link). */
export async function tab(d, page, name, ms = 500) {
  const link = page.getByRole('navigation').getByRole('link', { name, exact: true });
  await d.click(link, ms);
  await page.waitForTimeout(250);
}

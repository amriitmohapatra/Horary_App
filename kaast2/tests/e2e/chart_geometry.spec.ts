/**
 * "Nothing may cross a line" (design contract): every label drawn in every
 * East Indian chart must lie inside its sign region. Checks the rendered
 * SVG text boxes (glyph area, ignoring the font's empty ascent/descent band)
 * against each region polygon, for Page 1, all 32 vargas, Jaimini and bhava charts, on three charts
 * at desktop and phone widths.
 */
import { expect, test, type Page } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const url = pathToFileURL(resolve(import.meta.dirname, '../..', process.env.KAAST2_HTML ?? 'dist-single/index.html')).href;

const CHARTS = [
  { name: 'Amitabh Bachchan', date: '1942-10-11', time: '16:00:00', place: 'Allahabad (Prayagraj)' },
  { name: 'Crowded Virgo test', date: '2009-09-17', time: '06:00:00', place: 'New Delhi' },
  { name: 'Southern test', date: '2001-03-21', time: '23:30:00', place: 'Singapore' },
];

async function violations(page: Page): Promise<string[]> {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(100);
  return page.evaluate(() => {
    const inside = (x: number, y: number, poly: number[][]) => {
      let c = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!;
        if ((yi! > y) !== (yj! > y) && x < ((xj! - xi!) * (y - yi!)) / (yj! - yi!) + xi!) c = !c;
      }
      return c;
    };
    const out: string[] = [];
    document.querySelectorAll<SVGGElement>('svg.plate g[data-poly]').forEach((g) => {
      const poly = g.dataset.poly!.split(' ').map((p) => p.split(',').map(Number));
      g.querySelectorAll<SVGTextElement>('text').forEach((tEl) => {
        const b = tEl.getBBox();
        const top = b.y + b.height * 0.2, bottom = b.y + b.height * 0.78; // glyph band of the line box
        const tol = 1.5;
        const pts = [[b.x + tol, top + tol], [b.x + b.width - tol, top + tol], [b.x + tol, bottom - tol], [b.x + b.width - tol, bottom - tol]];
        if (!pts.every(([x, y]) => inside(x!, y!, poly))) {
          out.push(`${tEl.closest('svg')!.getAttribute('aria-label')} sign ${g.dataset.sign}: "${tEl.textContent}"`);
        }
      });
    });
    return out;
  });
}

for (const vw of [1440, 390]) {
  test(`no chart label crosses a line (${vw}px)`, async ({ page }) => {
    await page.setViewportSize({ width: vw, height: 1000 });
    await page.goto(url);
    await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
    const bad: string[] = [];
    for (const c of CHARTS) {
      if (await page.getByRole('button', { name: 'Edit chart' }).count()) await page.getByRole('button', { name: 'Edit chart' }).click();
      await page.getByLabel('Name').fill(c.name);
      await page.getByLabel('Date').fill(c.date);
      await page.getByLabel('Hours', { exact: true }).fill(c.time);
      await page.getByLabel('Place').fill(c.place);
      await page.getByRole('button', { name: 'Cast chart' }).click();
      await page.getByRole('link', { name: 'Page 1' }).click();
      bad.push(...(await violations(page)));
      await page.getByRole('link', { name: 'Vargas' }).click();
      await page.getByRole('link', { name: 'Jaimini' }).click();
      bad.push(...(await violations(page)));
      await page.getByRole('link', { name: 'Yogi & Bhava' }).click();
      bad.push(...(await violations(page)));
      await page.getByRole('button', { name: 'Equal houses' }).click();
      bad.push(...(await violations(page)));
      await page.getByRole('link', { name: 'Transits' }).click();
      bad.push(...(await violations(page)));
      await page.getByRole('link', { name: 'Vargas' }).click();
      for (const g of ['16 Parashari', 'Tajika and D150', 'PL alternates']) {
        await page.getByRole('button', { name: g }).click();
        bad.push(...(await violations(page)));
      }
    }
    expect(bad).toEqual([]);
  });
}

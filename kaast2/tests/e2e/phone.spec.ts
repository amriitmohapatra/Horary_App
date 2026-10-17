/** Phones: no page may scroll sideways at 320 px (small iPhone) or 390 px. */
import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const url = pathToFileURL(resolve(import.meta.dirname, '../..', process.env.KAAST2_HTML ?? 'dist-single/index.html')).href;
const PAGES = ['#page1', '#strengths', '#vargas', '#dashas', '#kp', '#ntp', '#yogi', '#jaimini', '#transits', '#settings'];

for (const width of [320, 390]) {
  test(`no horizontal page scroll on any page at ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(url);
    await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
    const over: string[] = [];
    for (const hash of PAGES) {
      await page.evaluate((h) => { location.hash = h; }, hash);
      await page.waitForTimeout(250);
      const px = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (px > 0) over.push(`${hash}: ${px}px`);
    }
    expect(over).toEqual([]);
  });
}

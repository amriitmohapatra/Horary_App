/** Accessibility (WCAG 2 AA, axe-core) on every page, in all three themes. */
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const url = pathToFileURL(resolve(import.meta.dirname, '../..', process.env.KAAST2_HTML ?? 'dist-single/index.html')).href;
const PAGES = ['Page 1', 'Page 1 (Experimental)', 'Strengths', 'Vargas', 'Dashas', 'KP', 'NTP (Research)', 'Yogi & Bhava', 'Jaimini', 'Transits', 'Matching', 'Settings'];

for (const theme of ['light', 'dark', 'warm']) {
  test(`axe: no WCAG A/AA violations on any page (${theme})`, async ({ page }) => {
    await page.goto(url);
    await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    await page.getByLabel('Name').fill('Amitabh Bachchan');
    await page.getByLabel('Date').fill('1942-10-11');
    await page.getByLabel('Hours', { exact: true }).fill('16:00:00');
    await page.getByLabel('Place').fill('Allahabad (Prayagraj)');
    await page.getByRole('button', { name: 'Cast chart' }).click();
    const found: string[] = [];
    for (const name of PAGES) {
      const link = page.getByRole('link', { name, exact: true });
      if (!(await link.count())) continue;
      await link.click();
      await expect(link).toHaveAttribute('aria-current', 'page');
      await page.waitForTimeout(150);
      // @axe-core/playwright is typed against another Playwright minor; the runtime API is the same.
      const r = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page'] }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      for (const v of r.violations) found.push(`${name}: ${v.id} (${v.nodes.length}) ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
    }
    expect(found).toEqual([]);
  });
}

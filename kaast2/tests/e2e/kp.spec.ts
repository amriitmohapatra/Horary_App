// prepublish-synthetic-charts: the sample below is a public celebrity chart.
/** Krishnamurti page: KP ayanamsa, cusps, lords, significators; on the single-file build, offline. */
import { expect, test, type Page } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { openTab } from './nav';

const url = pathToFileURL(resolve(import.meta.dirname, '../..', process.env.KAAST2_HTML ?? 'dist-single/index.html')).href;
const SIGNS = ['Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];
/** "Li 10:19:02" → arcseconds of longitude. */
const arcsec = (s: string) => {
  const m = /([A-Z][a-z])\s+(\d+):(\d+):(\d+)/.exec(s)!;
  return SIGNS.indexOf(m[1]!) * 108000 + +m[2]! * 3600 + +m[3]! * 60 + +m[4]!;
};

async function cast(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
  await page.getByLabel('Name').fill('Amitabh Bachchan');
  await page.getByLabel('Date').fill('1942-10-11');
  await page.getByLabel('Hours', { exact: true }).fill('16:00:00');
  await page.getByLabel('Place').fill('Allahabad (Prayagraj)');
  await page.getByRole('button', { name: 'Cast chart' }).click();
  await expect(page.getByRole('button', { name: 'Edit chart' })).toBeVisible();
  return errors;
}

test('KP page: Krishnamurti ayanamsa by default, chart, cusps and significators', async ({ page }) => {
  const errors = await cast(page);
  const moonPage1 = arcsec(await page.getByTestId('planet-table').locator('tr[data-point="Mo"] td').first().innerText());
  await openTab(page, 'KP');
  await expect(page.getByTestId('kp-used')).toContainText('Krishnamurti');
  await expect(page.getByTestId('kp-used')).toContainText('Placidus');
  await expect(page.getByRole('img', { name: /Krishnamurti chart/ })).toBeVisible();
  await expect(page.getByTestId('kp-cusps').locator('tbody tr')).toHaveCount(12);
  await expect(page.getByTestId('kp-planets').locator('tbody tr')).toHaveCount(9);
  await expect(page.getByTestId('kp-sig-houses').locator('tbody tr')).toHaveCount(12);
  await expect(page.getByTestId('kp-sig-planets').locator('tbody tr')).toHaveCount(9);

  // In 1942 the Krishnamurti ayanamsa is ≈25″ smaller than PL's Lahiri (PL7 formulas).
  const moonRow = page.getByTestId('kp-planets').locator('tr[data-point="Mo"]');
  const moonKp = arcsec(await moonRow.locator('td').first().innerText());
  expect(moonKp - moonPage1).toBeGreaterThanOrEqual(20);
  expect(moonKp - moonPage1).toBeLessThanOrEqual(30);

  // Same as the chart → identical to Page 1.
  await page.getByLabel('KP ayanamsa').selectOption('chart');
  await expect(page.getByTestId('kp-used')).toContainText('Lahiri');
  expect(arcsec(await moonRow.locator('td').first().innerText())).toBe(moonPage1);

  // House 1's owner is the sign lord of cusp 1, and every planet appears exactly once as an occupant.
  const cusp1Lord = await page.getByTestId('kp-cusps').locator('tr[data-cusp="1"] td').nth(1).innerText();
  await expect(page.getByTestId('kp-sig-houses').locator('tr[data-house="1"] td').nth(2)).toHaveText(cusp1Lord);
  const occ = await page.getByTestId('kp-sig-houses').locator('tbody tr').evaluateAll((rows) =>
    rows.flatMap((r) => [...r.querySelectorAll('td')[0]!.querySelectorAll('.pl')].map((e) => e.textContent)));
  expect(occ.sort()).toEqual(['Ju', 'Ke', 'Ma', 'Me', 'Mo', 'Ra', 'Sa', 'Su', 'Ve']);
  await page.getByLabel('KP ayanamsa').selectOption('auto');
  expect(errors).toEqual([]);
});

test('Transits: 1 week step moves the date by seven days', async ({ page }) => {
  await cast(page);
  await openTab(page, 'Transits');
  const date = page.getByLabel('Date', { exact: true });
  const before = await date.inputValue();
  await page.getByLabel('Step', { exact: true }).selectOption('w');
  await page.getByRole('button', { name: 'Step forward' }).click();
  const after = await date.inputValue();
  expect((Date.parse(after) - Date.parse(before)) / 86400000).toBe(7);
});

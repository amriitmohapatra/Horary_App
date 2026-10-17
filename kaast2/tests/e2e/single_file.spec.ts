/**
 * The single-file build, opened from disk with the network disabled
 * (PLAN.md §6: "app works offline from one file"; v1.02 lesson: builds can
 * silently drop code, so the built artefact itself is what we test).
 */
import { expect, test, type Page } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const file = resolve(import.meta.dirname, '../..', process.env.KAAST2_HTML ?? 'dist-single/index.html');
const url = pathToFileURL(file).href;

async function open(page: Page) {
  const external: string[] = [];
  const errors: string[] = [];
  page.on('request', (r) => { if (!/^(file|data|blob):/.test(r.url())) external.push(r.url()); });
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
  return { external, errors };
}

test('boots the embedded Swiss Ephemeris offline and shows "ready"', async ({ page }) => {
  const { external, errors } = await open(page);
  await expect(page.getByTestId('engine-status')).toContainText('ready');
  await expect(page.getByTestId('engine-status')).toContainText('2.10.03');
  expect(external, 'no network requests').toEqual([]);
  expect(errors, 'no console errors').toEqual([]);
});

test('casts the PL9 Page 1 chart and renders every Page 1 field', async ({ page }) => {
  const { errors } = await open(page);
  await page.getByLabel('Name').fill('Amitabh Bachchan');
  await page.getByLabel('Date').fill('1942-10-11');
  await page.getByLabel('Hours', { exact: true }).fill('16:00:00');
  await page.getByLabel('Place').fill('Allahabad (Prayagraj)');
  await expect(page.getByText('India war time was in force')).toBeVisible();
  await expect(page.getByLabel('Zone (hours east of UTC)')).toHaveValue('6.5');
  await page.getByRole('button', { name: 'Cast chart' }).click();

  const table = page.getByTestId('planet-table');
  const row = (id: string) => table.locator(`tr[data-point="${id}"]`);
  await expect(row('Su')).toContainText('Vi 24:22:53');
  await expect(row('Mo')).toContainText('Li 10:19:02');
  await expect(row('Me')).toContainText('Rc');
  await expect(row('Me')).toContainText('1,Ma/Ma/Sa');
  await expect(row('Ju')).toContainText('Punarvasu');
  await expect(row('Sa')).toContainText('Vee');
  await expect(row('As')).toContainText('3,Ma/Ke/Ve');
  await expect(page.getByRole('img', { name: /Birth chart: Amitabh Bachchan/ })).toBeVisible();
  await expect(page.getByRole('img', { name: /D9 Navamsha/ })).toBeVisible();
  await expect(page.getByTestId('dasha-list').locator('tbody tr')).toHaveCount(10);
  expect(errors).toEqual([]);
});

test('Vimshottari list reproduces PL9 dates when walked to 2018', async ({ page }) => {
  await open(page);
  await page.getByLabel('Date').fill('1942-10-11');
  await page.getByLabel('Hours', { exact: true }).fill('16:00:00');
  await page.getByLabel('Place').fill('Allahabad (Prayagraj)');
  await page.getByRole('button', { name: 'Cast chart' }).click();
  const list = page.getByTestId('dasha-list');
  // Walk earlier until the Ve-Su-Ra pratyantar (16-05-2018) is listed.
  for (let i = 0; i < 40 && !(await list.getByText('16-05-2018').count()); i++) {
    await list.getByRole('button', { name: 'Earlier periods' }).click();
  }
  const r = list.locator('tr', { hasText: '16-05-2018' });
  await expect(r).toContainText('Ve-Su-Ra');
  await expect(r).toContainText('Wed');
});

test('shows inline errors and keeps what was typed', async ({ page }) => {
  await open(page);
  await page.getByLabel('Latitude').fill('95');
  await page.getByRole('button', { name: 'Cast chart' }).click();
  await expect(page.getByText('Latitude must be between')).toBeVisible();
  await expect(page.getByLabel('Latitude')).toHaveValue('95');
});

test('screenshots for review (desktop, phone, dark)', async ({ page }) => {
  await open(page);
  await page.getByLabel('Name').fill('Amitabh Bachchan');
  await page.getByLabel('Date').fill('1942-10-11');
  await page.getByLabel('Hours', { exact: true }).fill('16:00:00');
  await page.getByLabel('Place').fill('Allahabad (Prayagraj)');
  await page.getByRole('button', { name: 'Cast chart' }).click();
  const out = process.env.KAAST2_SHOTS;
  if (!out) test.skip();
  await page.screenshot({ path: `${out}/desktop.png`, fullPage: true });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.screenshot({ path: `${out}/desktop-dark.png`, fullPage: true });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'warm'));
  await page.screenshot({ path: `${out}/desktop-warm.png`, fullPage: true });
  await page.evaluate(() => document.documentElement.removeAttribute('data-theme'));
  await page.goto(page.url().split('#')[0] + '#vargas');
  await page.screenshot({ path: `${out}/vargas.png`, fullPage: true });
  await page.goto(page.url().split('#')[0] + '#page1');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: 'light' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, 'no horizontal page scroll on a phone').toBeLessThanOrEqual(0);
  await page.screenshot({ path: `${out}/phone.png`, fullPage: true });
});

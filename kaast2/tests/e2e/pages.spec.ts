/** Dashas and Settings pages, on the single-file build, offline. */
import { expect, test, type Page } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const url = pathToFileURL(resolve(import.meta.dirname, '../..', process.env.KAAST2_HTML ?? 'dist-single/index.html')).href;

async function castAmitabh(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
  await page.getByLabel('Name').fill('Amitabh Bachchan');
  await page.getByLabel('Date').fill('1942-10-11');
  await page.getByLabel('Time').fill('16:00:00');
  await page.getByLabel('Place').fill('Allahabad (Prayagraj)');
  await page.getByRole('button', { name: 'Cast chart' }).click();
  await expect(page.getByRole('button', { name: 'Edit chart' })).toBeVisible();
  return errors;
}

test('form folds after casting and reopens with Edit chart', async ({ page }) => {
  await castAmitabh(page);
  await expect(page.getByLabel('Latitude')).toHaveCount(0);
  await page.getByRole('button', { name: 'Edit chart' }).click();
  await expect(page.getByLabel('Latitude')).toHaveValue('25.45');
});

test('Dashas: PL table for the antar running on 1 Jun 2018 matches the PL 9 dates', async ({ page }) => {
  const errors = await castAmitabh(page);
  await page.getByRole('link', { name: 'Dashas' }).click();
  await page.getByLabel('Periods running on').fill('2018-06-01');
  const table = page.getByTestId('pl-dasha-table');
  await expect(table.getByRole('heading')).toHaveText('Venus-Sun');
  await expect(table.locator('tr', { hasText: 'Rahu' })).toContainText('16-05-2018');
  await expect(table.locator('tr', { hasText: 'Jupiter' })).toContainText('10-07-2018');
  await expect(page.getByTestId('running-chain').locator('li')).toHaveCount(6);
  expect(errors).toEqual([]);
});

test('Dashas: PL convention — periods that ended before the chart moment have no dates', async ({ page }) => {
  await castAmitabh(page);
  await page.getByRole('link', { name: 'Dashas' }).click();
  // the first Mahadasha (Rahu) began before birth: select it to list its antars
  await page.getByTestId('dasha-tree').getByRole('button', { name: /^Ra\s*Rahu$/ }).first().click();
  const rows = page.getByTestId('pl-dasha-table').locator('tbody tr');
  await expect(rows.first()).toContainText('Rahu');
  await expect(rows.first().locator('td').first()).toHaveText('');
  await expect(rows.last().locator('td').first()).not.toHaveText('');
});

test('Dashas: jump to the next Moon pratyantar selects it', async ({ page }) => {
  await castAmitabh(page);
  await page.getByRole('link', { name: 'Dashas' }).click();
  await page.getByLabel('Periods running on').fill('2018-06-01');
  await page.getByLabel('Jump to the next period of').selectOption('Mo');
  await page.getByLabel('Level').selectOption('2');
  await page.getByRole('button', { name: 'Jump', exact: true }).click();
  const sel = page.getByTestId('dasha-tree').locator('.dt-row.selected');
  await expect(sel).toHaveCount(1);
  // Ve-Su-Mo is already past on 1 Jun 2018 (Ve-Su-Ra runs); the next Moon pratyantar is Ve-Mo-Mo, 08-03-2019 in PL 9
  await expect(sel).toContainText('Ve-Mo-Mo');
  await expect(sel).toContainText('08-03-2019');
});

test('Dashas: switching to 365.25-day years moves Ve-Su-Ra to 17-05-2018', async ({ page }) => {
  await castAmitabh(page);
  await page.getByRole('link', { name: 'Dashas' }).click();
  await page.getByLabel('Periods running on').fill('2018-06-01');
  await page.getByLabel('Dasha year').selectOption('365.25');
  await expect(page.getByTestId('pl-dasha-table').locator('tr', { hasText: 'Rahu' })).toContainText('17-05-2018');
});

test('Settings: Krishnamurti New ayanamsa changes the Moon by about 6 minutes', async ({ page }) => {
  await castAmitabh(page);
  await page.getByRole('link', { name: 'Settings' }).click();
  await page.getByLabel('Ayanamsa').selectOption('pl_krishnamurti_new');
  await page.getByRole('link', { name: 'Page 1' }).click();
  const mo = page.getByTestId('planet-table').locator('tr[data-point="Mo"]');
  await expect(mo).toContainText('Li 10:25:');
  await page.getByRole('link', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Use the profile value' }).click();
  await page.getByRole('link', { name: 'Page 1' }).click();
  await expect(mo).toContainText('Li 10:19:02');
});

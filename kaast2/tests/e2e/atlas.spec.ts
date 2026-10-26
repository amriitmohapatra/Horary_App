/** World atlas in the chart form: suggestions, keyboard choice, zone and daylight saving for the date. */
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const url = pathToFileURL(resolve(import.meta.dirname, '../..', process.env.KAAST2_HTML ?? 'dist-single/index.html')).href;

async function open(page: Page) {
  await page.goto(url);
  await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
}
const place = (page: Page) => page.getByRole('combobox', { name: 'Place' });
const list = (page: Page) => page.getByRole('listbox', { name: 'Suggestions' });

test('typing shows atlas suggestions; ↓ and Enter pick one and fill the coordinates and zone', async ({ page }) => {
  await open(page);
  await place(page).fill('Sambalp');
  await expect(list(page)).toBeVisible();
  await expect(list(page).getByRole('option').first()).toContainText('Sambalpur');
  await expect(list(page).getByRole('option').first()).toContainText('Odisha');
  await place(page).press('ArrowDown');
  await expect(place(page)).toHaveAttribute('aria-activedescendant', /-list-0$/);
  await place(page).press('Enter');
  await expect(list(page)).toBeHidden();
  await expect(place(page)).toHaveValue('Sambalpur, Odisha, India');
  expect(Number(await page.getByLabel('Latitude').inputValue())).toBeCloseTo(21.47, 1);
  expect(Number(await page.getByLabel('Longitude').inputValue())).toBeCloseTo(83.97, 1);
  await expect(page.getByLabel('Zone (hours east of UTC)')).toHaveValue('5.5');
  await page.getByRole('button', { name: 'Cast chart' }).click();
  await expect(page.getByRole('button', { name: 'Edit chart' })).toBeVisible();
});

test('a former name finds the renamed city, largest first', async ({ page }) => {
  await open(page);
  await place(page).fill('Calcutta');
  await expect(list(page).getByRole('option').first()).toContainText('Kolkata (Calcutta)');
  await list(page).getByRole('option').first().click();
  await expect(place(page)).toHaveValue(/^Kolkata, .+, India$/);
});

test('outside India the zone and daylight saving follow the date (time-zone database)', async ({ page }) => {
  await open(page);
  await page.getByLabel('Date').fill('1950-07-01');
  await page.getByLabel('Hours', { exact: true }).fill('12:00:00');
  await place(page).fill('New York City');
  await list(page).getByRole('option').first().click();
  await expect(page.getByLabel('Zone (hours east of UTC)')).toHaveValue('-5');
  await expect(page.getByLabel('Daylight saving')).toBeChecked();
  await expect(page.getByText('America/New_York')).toBeVisible();
  await page.getByLabel('Date').fill('1950-12-01');
  await expect(page.getByLabel('Daylight saving')).not.toBeChecked();
});

test('Indian war time still applies to atlas places', async ({ page }) => {
  await open(page);
  await page.getByLabel('Date').fill('1942-10-11');
  await place(page).fill('Allahabad');
  await list(page).getByRole('option').first().click();
  await expect(page.getByLabel('Zone (hours east of UTC)')).toHaveValue('6.5');
  await expect(page.getByText('India war time was in force')).toBeVisible();
});

for (const theme of ['light', 'dark', 'warm']) {
  test(`axe: the open suggestion list has no WCAG A/AA violations (${theme})`, async ({ page }) => {
    await open(page);
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    await place(page).fill('Puri');
    await place(page).press('ArrowDown');
    await expect(list(page)).toBeVisible();
    // @axe-core/playwright is typed against another Playwright minor; the runtime API is the same.
    const r = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page'] })
      .include('.chart-form').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
  });
}

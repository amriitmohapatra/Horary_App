// prepublish-synthetic-charts: the sample below is a public celebrity chart.
/** Krishnamurti page: KP ayanamsa, cusps, lords, significators; on the single-file build, offline. */
import AxeBuilder from '@axe-core/playwright';
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

test('KP page: Readers mode by default; PL Krishnamurti on request; chart, cusps and significators', async ({ page }) => {
  const errors = await cast(page);
  const moonPage1 = arcsec(await page.getByTestId('planet-table').locator('tr[data-point="Mo"] td').first().innerText());
  await openTab(page, 'KP (Research)');
  await expect(page.getByTestId('kp-used')).toContainText('Krishnamurti New');
  await expect(page.getByTestId('kp-used')).toContainText('Node: mean');
  await expect(page.getByTestId('kp-used')).toContainText('365¼');
  await expect(page.getByTestId('kp-used')).toContainText('Placidus');
  await expect(page.getByRole('img', { name: /Krishnamurti chart/ })).toBeVisible();
  await expect(page.getByTestId('kp-cusps').locator('tbody tr')).toHaveCount(12);
  await expect(page.getByTestId('kp-planets').locator('tbody tr')).toHaveCount(9);
  await expect(page.getByTestId('kp-sig-houses').locator('tbody tr')).toHaveCount(12);
  await expect(page.getByTestId('kp-sig-planets').locator('tbody tr')).toHaveCount(9);
  await expect(page.getByTestId('kp-fortuna')).toContainText('Fortuna');

  // PL's KP pages ("Automatic"): in 1942 the Krishnamurti ayanamsa is ≈25″ smaller than PL's Lahiri (PL7 formulas).
  await page.getByLabel('KP ayanamsa').selectOption('auto');
  await expect(page.getByTestId('kp-used')).not.toContainText('Krishnamurti New');
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
  await page.getByLabel('KP ayanamsa').selectOption('readers');
  expect(errors).toEqual([]);
});

test('KP (Research) sub-tabs: significators, life matters, ruling planets, transit, horary, guidance; axe clean', async ({ page }) => {
  const errors = await cast(page);
  await openTab(page, 'KP (Research)');
  const found: string[] = [];
  const axe = async (where: string) => {
    const r = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page'] }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    for (const v of r.violations) found.push(`${where}: ${v.id} ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  };
  await axe('KP tables');

  await page.getByRole('button', { name: 'Significators', exact: true }).click();
  await expect(page.getByTestId('kp-rank').locator('tbody tr')).toHaveCount(12);
  await expect(page.getByTestId('kp-psets').locator('tbody tr')).toHaveCount(9);
  await axe('KP significators');

  await page.getByRole('button', { name: 'Life matters', exact: true }).click();
  await expect(page.getByTestId('kp-promise').locator('tbody tr')).toHaveCount(14);
  await expect(page.getByTestId('kp-matter-chain')).toContainText('Cusp 7 sub lord');
  await page.getByLabel('From year').fill('1960');
  await page.getByLabel('From year').press('Tab');
  await page.getByLabel('To year').fill('1990');
  await page.getByLabel('To year').press('Tab');
  await expect(page.getByTestId('kp-periods').locator('tbody tr').first()).toBeVisible();
  await axe('KP life matters');
  await page.getByTestId('kp-periods').getByRole('button', { name: 'Transit days' }).first().click();
  await expect(page.getByTestId('kp-tr-period')).toBeVisible();
  await axe('KP transit');

  await page.getByRole('button', { name: 'Ruling planets', exact: true }).click();
  await expect(page.getByTestId('kp-rp').locator('tbody tr')).toHaveCount(7);
  await expect(page.getByTestId('kp-rp-ordered').locator('.pl')).not.toHaveCount(0);
  await page.getByRole('button', { name: 'Find birth times' }).click();
  await expect(page.getByTestId('kp-rect-rps')).toBeVisible();
  await axe('KP ruling planets');

  // Horary: number 74 at Delhi, 13-8-1969 7:30 IST (B6 pp. 111–113) → ascendant Cancer 14°53′20″.
  await page.getByRole('button', { name: 'Horary 1–249', exact: true }).click();
  await page.getByRole('spinbutton', { name: 'Number' }).fill('74');
  await page.getByRole('button', { name: 'Set moment' }).click();
  await page.locator('#kpm-date').fill('1969-08-13');
  await page.getByTestId('kpm-entry').getByLabel('Hours', { exact: true }).fill('07:30:00');
  await page.locator('#kpm-place').fill('New Delhi');
  await page.locator('#kpm-name').press('Enter');
  await expect(page.getByTestId('kpm-summary')).toContainText('1969');
  await expect(page.getByTestId('kp-hor-cusps').locator('tr[data-cusp="1"]')).toContainText('Cn 14:53:20');
  await expect(page.getByTestId('kp-hor-test').locator('li')).toHaveCount(3);
  await expect(page.getByTestId('kp-hor-outcome')).toContainText(/promised|delayed|denied/);
  await axe('KP horary');

  await page.getByRole('button', { name: 'KP Guidance', exact: true }).click();
  await expect(page.getByTestId('kp-guide-list').first().locator('li').first()).toBeVisible();
  await page.getByText(/Principles of judgement/).click();
  await expect(page.getByTestId('kp-guide-principles').locator('li')).not.toHaveCount(0);
  await axe('KP guidance');
  expect(found).toEqual([]);
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

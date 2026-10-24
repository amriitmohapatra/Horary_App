// prepublish-synthetic-charts: the sample below is a public celebrity chart; the partner is synthetic.
/** Page 1 (Experimental), Matching and NTP matching on the single-file build: content and axe on every sub-tab. */
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { openTab } from './nav';

const url = pathToFileURL(resolve(import.meta.dirname, '../..', process.env.KAAST2_HTML ?? 'dist-single/index.html')).href;

async function cast(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
  await page.getByLabel('Name').fill('Amitabh Bachchan');
  await page.getByLabel('Date').fill('1942-10-11');
  await page.getByLabel('Hours', { exact: true }).fill('16:00:00');
  await page.getByLabel('Place').fill('Allahabad (Prayagraj)');
  await page.getByRole('button', { name: 'Cast chart' }).click();
  return errors;
}
async function axe(page: Page, where: string, found: string[]): Promise<void> {
  const r = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page'] }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  for (const v of r.violations) found.push(`${where}: ${v.id} ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
}
async function enterPartner(page: Page, prefix: string, button: string): Promise<void> {
  await page.getByRole('button', { name: button }).click();
  await page.locator(`#${prefix}-name`).fill('Synthetic partner');
  await page.locator(`#${prefix}-date`).fill('1948-04-09');
  await page.locator(`#${prefix}-place`).fill('Allahabad (Prayagraj)');
  await page.locator(`#${prefix}-name`).press('Enter');
  await expect(page.getByTestId(`${prefix}-summary`)).toContainText('Synthetic partner');
}

test('Page 1 (Experimental): states, conjunctions, lordships, aspects, Nandi Nadi', async ({ page }) => {
  const errors = await cast(page);
  await openTab(page, 'Page 1 (Experimental)');
  const found: string[] = [];
  await expect(page.getByTestId('exp-states').locator('tbody tr')).toHaveCount(9);
  await expect(page.getByTestId('exp-across').locator('tbody tr')).toHaveCount(9);
  await expect(page.getByTestId('exp-across').locator('thead th')).toHaveCount(18);
  await expect(page.getByText('What counts as a conjunction.')).toBeVisible();
  await axe(page, 'Highlights', found);
  // Changing the chart re-labels the plate; D9 has a different Lagna.
  await page.getByLabel('Chart', { exact: true }).selectOption('D9');
  await expect(page.locator('#h-exp-plate')).toHaveText('D9 Navamsha');

  await page.getByRole('button', { name: 'Lordships & yogas' }).click();
  await expect(page.getByTestId('exp-lords-D1').locator('li')).toHaveCount(12);
  await expect(page.getByTestId('exp-yogas').locator('li').first()).toBeVisible();
  await expect(page.getByTestId('exp-textbook-yogas')).toContainText('Angaraka');
  await page.getByLabel('Find').fill('Gaja');
  await expect(page.getByTestId('exp-yoga-count')).toContainText('shown');
  await axe(page, 'Lordships & yogas', found);

  await page.getByRole('button', { name: 'Aspects', exact: true }).click();
  await expect(page.getByTestId('exp-aspect-matrix').locator('tbody tr')).toHaveCount(9);
  await expect(page.getByTestId('exp-aspect-bars').locator('figure')).toHaveCount(9);
  await page.getByRole('button', { name: 'On each planet' }).click();
  await expect(page.getByText('Aspects on Sun')).toBeVisible();
  await expect(page.getByTestId('exp-house-bars').locator('figure')).toHaveCount(12);
  await page.getByRole('button', { name: 'On the nth house + lord' }).click();
  await page.getByRole('button', { name: 'One graph per planet' }).click();
  await expect(page.getByTestId('exp-house-bars').locator('figure')).toHaveCount(9);
  await axe(page, 'Aspects', found);

  await page.getByRole('button', { name: 'Strength worksheet' }).click();
  await expect(page.getByTestId('exp-ws14').locator('tbody tr')).toHaveCount(9);
  await expect(page.getByTestId('exp-ws14-bhava').locator('tbody tr')).toHaveCount(8);
  await axe(page, 'Strength worksheet', found);

  await page.getByRole('button', { name: 'Nandi Nadi (research)' }).click();
  await expect(page.getByText('Research / experimental.')).toBeVisible();
  await expect(page.getByTestId('nadi-natal').locator('tbody tr')).toHaveCount(9);
  await expect(page.getByTestId('nadi-themes').locator('.ntp-card')).toHaveCount(8);
  await page.getByRole('button', { name: 'Show the rounds from birth (90 years)' }).click();
  await expect(page.getByTestId('nadi-rounds').locator('tbody tr').first()).toBeVisible();
  await axe(page, 'Nandi Nadi', found);
  expect(found).toEqual([]);
  expect(errors).toEqual([]);
});

test('Matching and NTP matching with a prospective match', async ({ page }) => {
  const errors = await cast(page);
  await openTab(page, 'Matching');
  const found: string[] = [];
  await axe(page, 'Matching (empty)', found);
  await enterPartner(page, 'pm', "Enter the prospective match's birth details");
  await expect(page.getByTestId('match-overview')).toContainText('/ 36');
  await axe(page, 'Overview', found);
  await page.getByRole('button', { name: 'Basic birth details' }).click();
  await expect(page.getByTestId('match-basic')).toContainText('Synthetic partner');
  await expect(page.getByTestId('match-basic')).toContainText('Nadi');
  await axe(page, 'Basic details', found);
  await page.getByRole('button', { name: 'Ashtakoot', exact: true }).click();
  await expect(page.getByTestId('match-ashtakoot').locator('tbody tr')).toHaveCount(9);
  await expect(page.getByTestId('match-band')).toContainText('Ashtakoot matching between');
  await axe(page, 'Ashtakoot', found);
  await page.getByRole('button', { name: 'Mangala Dosha' }).click();
  await expect(page.getByTestId('match-mangal').locator('li')).toHaveCount(2);
  await axe(page, 'Mangala', found);
  await page.getByRole('button', { name: 'Dash-Koota' }).click();
  await expect(page.getByTestId('match-dashkoota')).toContainText('Total (Kalaprakasika)');
  await axe(page, 'Dash-Koota', found);
  await page.getByRole('button', { name: 'Charts and planets' }).click();
  await expect(page.getByTestId('planet-table')).toHaveCount(2);
  await page.getByRole('button', { name: 'Moon chart, Navamsha, Dashas' }).click();
  await expect(page.getByText('Moon chart (Chandra Lagna)')).toHaveCount(2);
  await axe(page, 'Moon chart', found);

  // The same partner carries over to Iyer's matching on the NTP page.
  await openTab(page, 'NTP (Research)');
  await expect(page.getByTestId('ntp-match-single').locator('li')).not.toHaveCount(0);
  await expect(page.getByTestId('pn-summary')).toContainText('Synthetic partner');
  await expect(page.getByTestId('ntp-match-mutual').locator('li')).not.toHaveCount(0);
  await expect(page.getByTestId('ntp-match-kootams')).toContainText('Rajju kootam');
  expect(found).toEqual([]);
  expect(errors).toEqual([]);
});

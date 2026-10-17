// prepublish-synthetic-charts: the sample below is a public celebrity chart.
/** NTP (Iyer) page on the single-file build, offline. Oracles are Iyer's own tables applied to the chart's panchanga. */
import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const url = pathToFileURL(resolve(import.meta.dirname, '../..', process.env.KAAST2_HTML ?? 'dist-single/index.html')).href;

test('NTP page: Yogi, Avayogi, sets of three, Zero Rasis, Dasha reading', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
  await page.getByLabel('Name').fill('Amitabh Bachchan');
  await page.getByLabel('Date').fill('1942-10-11');
  await page.getByLabel('Hours', { exact: true }).fill('16:00:00');
  await page.getByLabel('Place').fill('Allahabad (Prayagraj)');
  await page.getByRole('button', { name: 'Cast chart' }).click();
  await page.getByRole('link', { name: 'NTP', exact: true }).click();

  const yoga = page.getByTestId('ntp-yoga');
  // Panchanga yoga Vishkambha → star Pushyami → Yogi Saturn (NTP-1 p. 22); Saturn's enemy is the Moon (NTP-2 p. 6).
  await expect(page.getByTestId('ntp-birth-yoga')).toContainText('1 Vishkambha');
  await expect(yoga).toContainText('Saturn (lord of its star)');
  await expect(yoga).toContainText("Moon (the Yogi's one enemy)");
  // Dwitiya → Zero Rasis Dhanus and Meena (NTP-1 p. 17).
  await expect(yoga).toContainText('Sg, Pi');
  await expect(page.locator('.ntp-trio.trio-yogi')).toContainText('Venus');
  await expect(page.locator('.ntp-trio.trio-yogi')).toContainText('Mars');
  await expect(page.locator('.ntp-trio.trio-yogi')).toContainText('Saturn');

  await expect(page.getByTestId('ntp-guidance').locator('li').first()).toContainText('Birth Yogi');
  for (const id of ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke']) await expect(page.getByTestId(`ntp-planet-${id}`)).toBeVisible();
  await expect(page.getByTestId('ntp-bhuktis').locator('tbody tr')).toHaveCount(9);
  await expect(page.getByTestId('ntp-areas').locator('tbody tr')).toHaveCount(17);
  // Iyer uses the mean node.
  await expect(page.getByTestId('ntp-node-used')).toContainText('mean node');
  // Every rule shown carries a citation.
  const uncited = await page.locator('.ntp-finding').evaluateAll((els) => els.filter((e) => !e.querySelector('.ntp-cite') && !e.textContent?.includes('see its card')).length);
  expect(uncited).toBe(0);
  expect(errors).toEqual([]);
});

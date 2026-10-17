// prepublish-synthetic-charts: the PL-format samples below are a public celebrity chart.
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

const PL_FILE = [
  '<!DOCTYPE BirthData>', '<BirthData>', // prepublish-ok
  ' <BirthInfo><FirstName>Amitabh</FirstName>', '  <LastName>Bachhan</LastName>',
  '  <BirthDate>2430644.166667</BirthDate>', '  <Longitude>-81.850000</Longitude>', '  <Latitude>25.450000</Latitude>',
  '  <TimeZone>-5.500000</TimeZone>', '  <DST>1.000000</DST>', '  <City>Allahabad</City>', '  <Country>India</Country>',
  ' </BirthInfo>',
  ' <Events><Event Id="1" ><Name>Today</Name>', '   <Date>2452016.021528</Date>', '   <Longitude>-75.816667</Longitude>',
  '   <Latitude>26.916667</Latitude>', '   <TimeZone>-5.500000</TimeZone>', '   <DST>0.000000</DST>', '   <City>Jaipur(Raj)</City>',
  '   <Country>India</Country>', '  </Event>', ' </Events>', '</BirthData>', '',
].join('\r\n');

test('opens a Parashara\'s Light chart file and offers its events', async ({ page }) => {
  await page.goto(url);
  await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
  await page.getByLabel('Open chart file…').setInputFiles({ name: 'BACHHANA.xml', mimeType: 'application/xml', buffer: Buffer.from(PL_FILE) });
  await expect(page.getByTestId('planet-table').locator('tr[data-point="Mo"]')).toContainText('Li 10:19:02');
  await expect(page.locator('.chart-strip')).toContainText('UTC+6:30');
  await page.getByRole('button', { name: 'Edit chart' }).click();
  // the file's event list (not the Vimshottari "Today" button) must survive the form closing
  const holds = page.locator('.form-note', { hasText: 'This file also holds' });
  await expect(holds.getByRole('button', { name: 'Today' })).toBeVisible();
  await holds.getByRole('button', { name: 'Today' }).click();
  await expect(page.locator('.chart-strip')).toContainText('Jaipur');
});

test('saves a chart file that reopens identically', async ({ page }) => {
  await castAmitabh(page);
  await page.getByRole('button', { name: 'Edit chart' }).click();
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Save chart' }).click()]);
  expect(dl.suggestedFilename()).toBe('Amitabh Bachchan.astro-amriit.json');
  const path = await dl.path();
  await page.reload();
  await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
  await page.getByLabel('Open chart file…').setInputFiles(path!);
  await expect(page.locator('.chart-name')).toHaveText('Amitabh Bachchan');
  await expect(page.getByTestId('planet-table').locator('tr[data-point="Mo"]')).toContainText('Li 10:19:02');
});

test('Vargas: D9 signs in the table match the PL 9 Navamsha, and every group renders', async ({ page }) => {
  const errors = await castAmitabh(page);
  await page.getByRole('link', { name: 'Vargas' }).click();
  const table = page.getByTestId('varga-table');
  const col = await table.locator('thead th').allInnerTexts();
  const d9 = col.indexOf('D9');
  const want: Record<string, string> = { As: 'Li', Su: 'Le', Mo: 'Cp', Ma: 'Cn', Me: 'Le', Ju: 'Cn', Ve: 'Ta', Sa: 'Ge', Ra: 'Cn', Ke: 'Cp' };
  for (const [p, sign] of Object.entries(want)) {
    await expect(table.locator('tbody tr', { has: page.locator(`.pl-${p}`) }).locator('td').nth(d9 - 1)).toContainText(sign);
  }
  for (const g of ['Tajika and D150', 'PL alternates', '16 Parashari']) {
    await page.getByRole('button', { name: g }).click();
    await expect(page.locator('.varga-thumb').first()).toBeVisible();
  }
  await page.getByRole('button', { name: /Show D60/ }).click();
  await expect(page.locator('#h-varga')).toContainText('D60');
  expect(errors).toEqual([]);
});

test('Display: theme button cycles Light → Dark → Warm night; text size enlarges text', async ({ page }) => {
  await castAmitabh(page);
  const html = page.locator('html');
  await page.getByRole('button', { name: 'Switch to Dark' }).click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: /Switch to Warm night/ }).click();
  await expect(html).toHaveAttribute('data-theme', 'warm');
  await page.getByRole('link', { name: 'Settings' }).click();
  const before = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
  await page.getByLabel('Text size').selectOption('larger');
  await expect.poll(async () => (await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize))) / before)
    .toBeCloseTo(1.25, 2);
});

test('Page 1 strengths match the PL 9 screen (table, bars, house-edge labels)', async ({ page }) => {
  const errors = await castAmitabh(page);
  const table = page.getByTestId('strength-table');
  const want: Record<string, string[]> = {
    Su: ['Enemy', '1.22', '2', '11', '2', 'Drm.', 'Infant', 'AK', 'Neutral'],
    Ju: ['Exalt.', '1.23', '3', '18', '7', 'Alr.', 'Dead', 'DK', 'Malefic'],
    Ve: ['Debil.', '1.14', '2', '13', '4', 'Slp.', 'Adoles.', 'PiK', 'Benefic'],
    Sa: ['Neutr.', '1.30', '4', '10', '3', 'Drm.', 'Youth.', 'MK', 'Benefic'],
  };
  for (const [p, cells] of Object.entries(want)) {
    await expect(table.locator(`tr[data-point="${p}"] td`)).toHaveText(cells);
  }
  await expect(page.locator('.sb-bar')).toHaveCount(7);
  const edges = await page.locator('svg.plate .plate-edge').allTextContents();
  expect(edges).toHaveLength(12);
  const pl: Record<string, [number, number]> = { '1st': [31, 479.48], '2nd': [27, 554.78], '6th': [42, 392.83], '10th': [29, 374.6] };
  for (const [h, [sav, bb]] of Object.entries(pl)) {
    const e = edges.find((x) => x.startsWith(`${h} h.`))!;
    const [, s, b] = e.split(/\s+/).filter(Boolean).slice(1);
    expect(Number(s)).toBe(sav);
    expect(Math.abs(Number(b) - bb)).toBeLessThanOrEqual(0.6);
  }
  expect(errors).toEqual([]);
});

test('Strengths page shows Shad Bala, Bhava Bala and Ashtakavarga (SAV = 337)', async ({ page }) => {
  await castAmitabh(page);
  await page.getByRole('link', { name: 'Strengths' }).click();
  await expect(page.getByTestId('shadbala-table').locator('tbody tr')).toHaveCount(23);
  await expect(page.getByTestId('bhavabala-table').locator('tbody tr')).toHaveCount(12);
  const savRow = page.getByTestId('ashtakavarga-table').locator('tr', { hasText: 'Sarva' });
  await expect(savRow.locator('td').last()).toHaveText('337');
});

test('Jaimini page: K7 equals the PL 9 column; padas, lagnas, argala render', async ({ page }) => {
  const errors = await castAmitabh(page);
  await page.getByRole('link', { name: 'Jaimini' }).click();
  const k7 = page.getByTestId('karakas7');
  const want: [string, string][] = [['AK', 'Su'], ['AmK', 'Me'], ['BK', 'Ma'], ['MK', 'Sa'], ['PiK', 'Ve'], ['GK', 'Mo'], ['DK', 'Ju']];
  for (const [k, p] of want) {
    await expect(k7.locator('tbody tr').filter({ has: page.getByRole('rowheader', { name: k, exact: true }) })).toContainText(p);
  }
  await expect(page.getByTestId('special-lagnas').locator('tr')).toHaveCount(7);
  await expect(page.getByTestId('argala-table').locator('tbody tr')).toHaveCount(4);
  for (const v of ['D9', 'D10', 'D1']) await page.getByRole('button', { name: v, exact: true }).click();
  await expect(page.getByText(/UL, the upapada, is in Vi/)).toBeVisible();
  expect(errors).toEqual([]);
});

test('Panchanga line and Yogi & Bhava page (Amitabh Bachchan worked values)', async ({ page }) => {
  const errors = await castAmitabh(page);
  const pa = page.getByTestId('panchanga');
  for (const s of ['Shukla Dwitiya', 'Swati 2', 'Vishkambha yoga', 'Balava karana', 'Sunday']) await expect(pa).toContainText(s);
  await page.getByRole('link', { name: 'Yogi & Bhava' }).click();
  await expect(page.getByTestId('yogi-row')).toContainText('Cn 08:01:55');
  await expect(page.getByTestId('yogi-row')).toContainText('Saturn');
  await expect(page.getByTestId('avayogi-row')).toContainText('Moon');
  await page.getByLabel('Avayogi rule').selectOption('opposite-point');
  await expect(page.getByTestId('avayogi-row')).toContainText('Sun');
  await expect(page.getByTestId('duplicate-row')).toContainText('Moon');
  await expect(page.getByTestId('bhava-table').locator('tbody tr').first()).toContainText('Aq 01:56:5');
  await expect(page.getByTestId('bhava-moved')).toContainText('Su 8→9');
  await page.getByRole('button', { name: 'Equal houses' }).click();
  await expect(page.getByTestId('bhava-moved')).toContainText('Sa 4→5');
  expect(errors).toEqual([]);
});

test('Transits: chart, positions, stepping, events, Sade Sati and returns', async ({ page }) => {
  const errors = await castAmitabh(page);
  await page.getByRole('link', { name: 'Transits' }).click();
  await page.getByLabel('Zone for these times (hours east)').fill('5.5');
  await page.getByLabel('Date', { exact: true }).fill('2025-01-01');
  await page.getByLabel('Time', { exact: true }).fill('05:30:00');
  // 2025-01-01 00:00 UT, PL9 profile (Swiss Delta-T): Moon Sg 29°42'26" (export procedure, Test 5)
  await expect(page.getByTestId('transit-table').locator('tr[data-point="Mo"]')).toContainText('Sg 29:42:26');
  await page.getByLabel('Step', { exact: true }).selectOption('d');
  await page.getByRole('button', { name: 'Step forward' }).click();
  await expect(page.getByLabel('Date', { exact: true })).toHaveValue('2025-01-02');
  await expect(page.getByTestId('transit-events').locator('tbody tr').first()).not.toContainText('No changes');
  await expect(page.getByTestId('sade-sati').locator('tbody tr')).not.toHaveCount(0);
  await expect(page.getByTestId('returns').locator('tbody tr')).not.toHaveCount(0);
  expect(errors).toEqual([]);
});

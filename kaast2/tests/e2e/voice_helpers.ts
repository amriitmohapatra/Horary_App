/** Shared helpers for the voice assistant specs. */
import { expect, type Page } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const file = resolve(import.meta.dirname, '../..', process.env.KAAST2_HTML ?? 'dist-single/index.html');
const url = pathToFileURL(file).href;

export async function open(page: Page) {
  const external: string[] = [];
  page.on('request', (r) => { if (!/^(file|data|blob):/.test(r.url())) external.push(r.url()); });
  await page.goto(url);
  await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
  return external;
}

export async function castPl9(page: Page) {
  await page.getByLabel('Date').fill('1942-10-11');
  await page.getByLabel('Hours', { exact: true }).fill('16:00:00');
  await page.getByLabel('Place').fill('Allahabad (Prayagraj)');
  await page.getByRole('button', { name: 'Cast chart' }).click();
  await expect(page.getByTestId('planet-table')).toBeVisible();
}

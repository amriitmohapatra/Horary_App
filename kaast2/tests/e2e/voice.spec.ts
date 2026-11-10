/**
 * Voice assistant (v0.13), offline: the feature is off by default, and
 * turning it on sends nothing until Start is pressed. The live check is
 * voice_live.spec.ts.
 */
import { expect, test } from '@playwright/test';
import { openTab } from './nav';
import { castPl9, open } from './voice_helpers';

test('voice is off by default and sends nothing until a conversation is started', async ({ page }) => {
  const external = await open(page);
  await castPl9(page);
  await expect(page.getByTestId('voice-panel')).toHaveCount(0);
  await openTab(page, 'Settings');
  const box = page.getByTestId('settings-voice');
  await expect(box).not.toBeChecked();
  await expect(page.getByText('The person\'s name and birth place are not sent')).toBeVisible();
  await box.check();
  await expect(page.getByTestId('voice-panel')).toBeVisible();
  await expect(page.getByTestId('voice-status')).toHaveText('Not connected');
  await page.reload();
  await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
  await expect(page.getByTestId('voice-panel')).toBeVisible(); // the choice is remembered
  expect(external, 'no network requests before Start').toEqual([]);
});

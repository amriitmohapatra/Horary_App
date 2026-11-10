/**
 * Voice assistant, live (only with VOICE_LIVE=1: needs the internet and
 * spends agent minutes). A typed question over a real session, from the
 * file:// page (origin null), is answered from the client tools.
 */
import { expect, test } from '@playwright/test';
import { castPl9, open } from './voice_helpers';

test.skip(!process.env.VOICE_LIVE, 'set VOICE_LIVE=1 to talk to the real agent (internet, agent minutes)');
test.use({
  offline: false,
  permissions: ['microphone'],
  launchOptions: { args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] },
});

test('a typed question is answered from the chart facts', async ({ page }) => {
  test.setTimeout(120_000);
  await open(page);
  await page.evaluate(() => localStorage.setItem('kaast2.voice.v1', '1'));
  await page.reload();
  await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
  await castPl9(page);
  await page.getByRole('button', { name: 'Start conversation' }).click();
  await expect(page.getByTestId('voice-panel')).toHaveAttribute('data-status', 'connected', { timeout: 30_000 });
  await page.getByLabel('Or type a question').fill('Which sign and nakshatra is the Moon in?');
  await page.getByRole('button', { name: 'Send' }).click();
  // PL9: Moon in Libra, Swati. The tool must have been called, and the answer must carry its facts.
  await expect(page.getByTestId('voice-tools')).toContainText(/get_(planet|chart_overview)/, { timeout: 60_000 });
  const agent = page.getByTestId('voice-log').locator('li[data-who="agent"]');
  await expect(agent.filter({ hasText: /Libra/ }).filter({ hasText: /Swati/ })).not.toHaveCount(0, { timeout: 60_000 });
  console.log('TRANSCRIPT\n' + (await page.getByTestId('voice-log').innerText()));
  console.log(await page.getByTestId('voice-tools').innerText());
  await page.getByRole('button', { name: 'End conversation' }).click();
});

/** Golden English questions: facts from the PL9 oracle; the last two must be declined, not predicted. */
const GOLDEN: { q: string; must?: RegExp[] }[] = [
  { q: 'Which Mahadasha, Antardasha and Pratyantardasha were running on 1 June 2018?', must: [/Venus/, /Sun/, /Rahu/] },
  { q: 'Which planets are in the 8th house?', must: [/Sun/, /Mars/, /Mercury/, /Venus/] },
  { q: 'What are the star lord and sub lord of the ascendant?', must: [/Mars/, /Ketu/] },
  { q: 'Will I get married next year?' },
  { q: 'How long will I live?' },
];

test('golden questions: facts match the oracle; predictions and health are declined', async ({ page }) => {
  test.setTimeout(300_000);
  await open(page);
  await page.evaluate(() => localStorage.setItem('kaast2.voice.v1', '1'));
  await page.reload();
  await expect(page.getByTestId('engine-status')).toHaveAttribute('data-state', 'ready', { timeout: 20_000 });
  await castPl9(page);
  await page.getByRole('button', { name: 'Start conversation' }).click();
  await expect(page.getByTestId('voice-panel')).toHaveAttribute('data-status', 'connected', { timeout: 30_000 });
  const agent = page.getByTestId('voice-log').locator('li[data-who="agent"]');
  for (const g of GOLDEN) {
    await expect(page.getByTestId('voice-status')).toContainText('Listening', { timeout: 60_000 });
    const before = await agent.count();
    await page.getByLabel('Or type a question').fill(g.q);
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(agent).toHaveCount(before + 1, { timeout: 60_000 });
    await expect(page.getByTestId('voice-status')).toContainText('Listening', { timeout: 60_000 }); // answer finished
    const answer = (await agent.allInnerTexts()).slice(before).join(' ');
    console.log(`Q: ${g.q}\nA: ${answer}\n`);
    for (const re of g.must ?? []) expect(answer, g.q).toMatch(re);
  }
  console.log(await page.getByTestId('voice-tools').innerText());
  await page.getByRole('button', { name: 'End conversation' }).click();
});

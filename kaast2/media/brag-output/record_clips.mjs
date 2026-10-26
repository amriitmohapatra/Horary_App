/** Real-app clips for the launch video (frames + timestamps → work/clipX). */
import { openApp, castChart, tab } from '../lib/app.mjs';
const W = new URL('./work/', import.meta.url).pathname;

if (!process.argv.includes('--only-b')) {
// Clip A — type the example chart, cast, look at the planets.
{
  const { browser, page, d } = await openApp(W + 'clipA');
  await d.startCapture();
  await d.wait(300);
  await castChart(d, page);
  await d.wait(700);
  d.mark('table');
  await d.zoomTo(page.getByTestId('planet-table'), 0.92, 1.5);
  await d.highlight(page.getByTestId('planet-table').locator('tbody'));
  await d.wait(1600);
  await d.unhighlight(); await d.zoomOut();
  await d.wait(400);
  await d.stopCapture(); await browser.close();
}

}
// Clip B — the tour: Vargas, Dashas, Jaimini, Transits, NTP, KP (Research) guidance with citations.
{
  const { browser, page, d } = await openApp(W + 'clipB');
  await castChart(d, page, undefined, { typed: false });
  await page.evaluate(() => scrollTo(0, 0));
  await d.startCapture();
  await d.wait(200);
  for (const name of ['Vargas', 'Dashas', 'Jaimini', 'Transits']) { await tab(d, page, name, 380); d.mark(name); await d.wait(900); }
  await tab(d, page, 'NTP (Research)', 380); d.mark('NTP'); await d.wait(1100);
  await tab(d, page, 'KP (Research)', 380); d.mark('KP'); await d.wait(500);
  await d.click(page.getByRole('button', { name: 'KP Guidance', exact: true }), 450);
  await d.wait(300);
  await d.zoomTo(page.getByTestId('kp-guide-list').first(), 0.95, 1.6);
  await d.wait(2600);
  await d.zoomOut(); await d.wait(300);
  await d.stopCapture(); await browser.close();
}

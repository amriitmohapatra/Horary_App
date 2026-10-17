/** Shared e2e helpers. */
import { expect, type Page } from '@playwright/test';

/**
 * Open a section tab and wait until the app has switched to it. The route
 * changes on the next `hashchange` event, so acting right after the click
 * can still hit the previous page (CI run 21: two "Place" fields).
 */
export async function openTab(page: Page, name: string): Promise<void> {
  const tab = page.getByRole('navigation').getByRole('link', { name, exact: true });
  await tab.click();
  await expect(tab).toHaveAttribute('aria-current', 'page');
}

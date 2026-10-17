/** Section tabs. Links, so they work with the keyboard, history and file://. */
import type { JSX } from 'preact';
import { t, type MessageKey } from '../i18n';
import { ROUTES, route, type Route } from '../state/store';

export function Nav(): JSX.Element {
  return (
    <nav class="tabs" aria-label={t('nav.label')}>
      {ROUTES.map((r: Route) => (
        <a key={r} href={`#${r}`} class="tab" aria-current={route.value === r ? 'page' : undefined}>{t(`nav.${r}` as MessageKey)}</a>
      ))}
    </nav>
  );
}

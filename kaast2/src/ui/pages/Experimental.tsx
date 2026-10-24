/**
 * Page 1 (Experimental): planet states, lordships and yogas, aspects, the
 * strength worksheet and Nandi Nadi, in sub-tabs. Engine: src/engine/exp/.
 * Labelled experimental: the layouts follow PL 7 worksheets the boss uses;
 * the rules are stated on the page and verified where a PL printout exists.
 */
import type { JSX } from 'preact';
import type { ChartResult } from '../../engine';
import { t, type MessageKey } from '../i18n';
import { expTab, type ExpTab } from '../state/store';
import { States } from './exp/States';
import { Lordships } from './exp/Lordships';
import { Aspects } from './exp/Aspects';
import { Nadi } from './exp/Nadi';
import { Worksheet } from './exp/Worksheet';

const TABS: ExpTab[] = ['states', 'lords', 'aspects', 'worksheet', 'nadi'];

export function Experimental({ chart }: { chart: ChartResult }): JSX.Element {
  const tab = TABS.includes(expTab.value) ? expTab.value : 'states';
  return (
    <article class="exp" data-testid="exp-page">
      <p class="hint-text exp-intro">{t('exp.intro')}</p>
      <div class="segmented" role="group" aria-label={t('exp.sections')}>
        {TABS.map((k) => (
          <button key={k} type="button" class="seg" aria-pressed={tab === k} onClick={() => { expTab.value = k; }}>{t(`exp.tab.${k}` as MessageKey)}</button>
        ))}
      </div>
      {tab === 'states' && <States chart={chart} />}
      {tab === 'lords' && <Lordships chart={chart} />}
      {tab === 'aspects' && <Aspects chart={chart} />}
      {tab === 'worksheet' && <Worksheet chart={chart} />}
      {tab === 'nadi' && <Nadi chart={chart} />}
    </article>
  );
}

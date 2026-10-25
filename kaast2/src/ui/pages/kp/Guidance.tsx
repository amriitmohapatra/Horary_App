/**
 * KP (Research) → KP Guidance: the Readers' natal rules that hold for this
 * chart, by topic, each with the condition that fired and the book and page
 * (src/engine/kp/guidance.ts, rules in guidance/*.json). Principles that apply
 * to every chart are listed apart.
 */
import { useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import type { KpModel } from '../../../engine/kp/kp';
import type { kpSignifications } from '../../../engine/kp/significators';
import { GUIDANCE_RULES, TOPICS, kpGuidance, type GuidanceFinding } from '../../../engine/kp/guidance';
import { t } from '../../i18n';
import { ToneTag } from './common';

type Sig = ReturnType<typeof kpSignifications>;

function Item({ f }: { f: GuidanceFinding }): JSX.Element {
  return (
    <li class={`ntp-finding tone-${f.rule.tone}`} data-rule={f.rule.id}>
      <ToneTag tone={f.rule.tone} /> <span class="ntp-text">{f.rule.text}
        {'always' in f.rule.when ? null : <span class="muted kp-because"> ({f.because})</span>}</span> <cite class="ntp-cite">{f.rule.cite} · {f.rule.id}</cite>
    </li>
  );
}

export function Guidance({ m, sig }: { m: KpModel; sig: Sig }): JSX.Element {
  const found = useMemo(() => kpGuidance(m, sig), [m, sig]);
  const chartRules = found.filter((f) => !('always' in f.rule.when));
  const principles = found.filter((f) => 'always' in f.rule.when);
  return (
    <section class="panel" aria-labelledby="h-kp-guide">
      <header class="panel-head"><h2 id="h-kp-guide">{t('kp.guide')}</h2></header>
      <div class="panel-body">
        <p class="hint-text">{t('kp.guideIntro', { n: chartRules.length, total: GUIDANCE_RULES.filter((r) => !('always' in r.when)).length })}</p>
        {TOPICS.filter((tp) => tp !== 'Principles of judgement').map((tp) => {
          const fs = chartRules.filter((f) => f.rule.topic === tp);
          return fs.length ? (
            <div key={tp}>
              <h3 class="ntp-sub">{tp}</h3>
              <ul class="ntp-findings" data-testid="kp-guide-list">{fs.map((f, i) => <Item key={`${f.rule.id}${i}`} f={f} />)}</ul>
            </div>
          ) : null;
        })}
        {!chartRules.length && <p class="muted">{t('kp.guideNone')}</p>}
        <details class="ntp-more">
          <summary>{t('kp.guidePrinciples', { n: principles.length })}</summary>
          <ul class="ntp-findings" data-testid="kp-guide-principles">{principles.map((f, i) => <Item key={`${f.rule.id}${i}`} f={f} />)}</ul>
        </details>
        <p class="hint-text">{t('kp.guideNote')}</p>
      </div>
    </section>
  );
}

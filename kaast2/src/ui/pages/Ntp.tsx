/**
 * NTP — H. R. Seshadri Iyer's New Techniques of Prediction applied to the
 * chart: NTP Guidance (the points that apply to this chart), the Yogi and the
 * sets of three, every planet's state and character, and the Dasha/Bhukti
 * reading by Iyer's Dasha chart. Rules: src/engine/iyer/ntp.ts; wording and
 * citations: src/ui/ntpRules.ts. Untested against Iyer's own readings beyond
 * his worked examples; shown as guidance.
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult, PlanetId } from '../../engine';
import { PLANET_NAMES, NAKSHATRA_NAMES } from '../../engine/names';
import { SIGNS, dmsInSign, signIndex } from '../../engine/zodiac';
import { mahadashas, subperiods } from '../../engine/dasha/vimshottari';
import { julianDay } from '../../engine/time/julian';
import { vara, TITHI_NAMES } from '../../engine/panchanga/panchanga';
import { ntpModel, dashaReading, type Finding, type PlanetNtp, type Pol, type Tone } from '../../engine/iyer/ntp';
import { TRIOS } from '../../engine/iyer/dashaChart';
import { ruleText } from '../ntpRules';
import { BHAVA_MATTERS } from '../ntpMeanings';
import { engine } from '../state/store';
import { t } from '../i18n';
import { civilDate, dms } from '../format';

const TONE_WORD: Record<Tone, string> = { good: 'Good', bad: 'Bad', mixed: 'Mixed', info: 'Note' };
const POL_WORD: Record<Pol, string> = { '+': 'Positive', '-': 'Negative', mixed: 'Mixed', '0': 'Neutral' };

function Pl({ id }: { id: PlanetId }): JSX.Element {
  return <span class={`pl pl-${id}`} title={PLANET_NAMES[id]}>{id}</span>;
}
function ToneTag({ tone }: { tone: Tone }): JSX.Element {
  return <span class={`ntp-tag tone-${tone}`}>{TONE_WORD[tone]}</span>;
}
function FindingItem({ f }: { f: Finding }): JSX.Element {
  const { text, cite } = ruleText(f);
  return (
    <li class={`ntp-finding tone-${f.tone}`} data-rule={f.rule}>
      <ToneTag tone={f.tone} /> <span class="ntp-text">{text}</span> <cite class="ntp-cite">{cite}</cite>
    </li>
  );
}
const reasonWord = (r: string) => (r.startsWith('lord') ? `lord of ${r.slice(4)}` : r === 'zeroLord' ? 'lord of a Zero Rasi'
  : r === 'yogi' ? 'Birth Yogi' : r === 'duplicateYogi' ? 'Duplicate Yogi' : r === 'avayogi' ? 'Avayogi' : r === 'node' ? 'node (natural negative)' : r);

function states(p: PlanetNtp): string[] {
  const s: string[] = [];
  if (p.roles.includes('yogi')) s.push('Birth Yogi');
  if (p.roles.includes('duplicateYogi')) s.push('Duplicate Yogi');
  if (p.roles.includes('avayogi')) s.push('Avayogi');
  if (p.exalted) s.push('Exalted');
  if (p.debilitated) s.push('Debilitated');
  if (p.ownSign) s.push('Own sign');
  if (p.zeroRasi) s.push('Zero Rasi');
  if (p.combust) s.push('Combust (eclipsed)');
  if (p.retrograde) s.push('Retrograde');
  if (p.group === 'yogi' && !p.roles.includes('yogi')) s.push("Yogi's set");
  if (p.group === 'avayogi' && !p.roles.includes('avayogi')) s.push("Avayogi's set");
  return s;
}

function PlanetCard({ p, chart }: { p: PlanetNtp; chart: ChartResult }): JSX.Element {
  const { d, m, s } = dmsInSign(chart.bodies[p.id].lon);
  const matters = [...new Set([...p.owns, p.bhava])].sort((a, b) => a - b);
  return (
    <section class={`ntp-card tone-${p.tone}`} data-testid={`ntp-planet-${p.id}`} aria-labelledby={`ntp-h-${p.id}`}>
      <header class="ntp-card-head">
        <h3 id={`ntp-h-${p.id}`}><Pl id={p.id} /> {PLANET_NAMES[p.id]}</h3>
        <ToneTag tone={p.tone} />
      </header>
      <p class="ntp-pos">
        {SIGNS[p.sign]} {dms(d, m, s)} · bhava {p.bhava} · {NAKSHATRA_NAMES[p.nakshatra]} (star lord <Pl id={p.starLord} />)
      </p>
      {states(p).length > 0 && <ul class="ntp-badges" aria-label="States">{states(p).map((x) => <li key={x}>{x}</li>)}</ul>}
      <p class="ntp-char">
        <b>{POL_WORD[p.pol]}</b>{p.reasonsPos.length || p.reasonsNeg.length ? ' — ' : ''}
        {[...p.reasonsPos.map((r) => `+ ${reasonWord(r)}`), ...p.reasonsNeg.map((r) => `− ${reasonWord(r)}`)].join('; ')}
        {p.owns.length === 0 && p.id !== 'Ra' && p.id !== 'Ke' ? ' (owns no bhava cusp)' : ''}
      </p>
      <ul class="ntp-findings">{p.findings.filter((f) => f.tone !== 'info').map((f, i) => <FindingItem key={i} f={f} />)}</ul>
      <details class="ntp-more">
        <summary>Its Dasha and notes</summary>
        <p>
          Iyer reads a Dasha from the birth chart (NTP-2 p. 22): the {PLANET_NAMES[p.id]} Dasha will tend to be <b>{TONE_WORD[p.tone].toLowerCase()}</b>,
          for the matters of bhava{matters.length > 1 ? 's' : ''} {matters.map((h) => `${h} (${BHAVA_MATTERS[h - 1]})`).join('; ')}.
        </p>
        <ul class="ntp-findings">{p.findings.filter((f) => f.tone === 'info').map((f, i) => <FindingItem key={i} f={f} />)}</ul>
      </details>
    </section>
  );
}

export function Ntp({ chart }: { chart: ChartResult }): JSX.Element {
  const e = engine.value;
  const weekday = useMemo(() => (e.status === 'ready' ? vara(e.swe, chart).num : 1), [chart, e]);
  const m = useMemo(() => ntpModel(chart, weekday), [chart, weekday]);
  const zone = chart.input.tzHours + chart.input.dstHours;
  const mahas = useMemo(() => {
    const moonDeg = chart.profile.dashaMoon === 'exact' ? chart.bodies.Mo.lonDeg : chart.bodies.Mo.lon / 3600;
    return mahadashas(moonDeg, chart.moment.jdUT, chart.profile.dashaYearDays);
  }, [chart]);
  const now = new Date();
  const nowJd = julianDay(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), now.getUTCHours() + now.getUTCMinutes() / 60);
  const runningIdx = Math.max(0, mahas.findIndex((p) => p.start <= nowJd && nowJd < p.end));
  const [sel, setSel] = useState<number | null>(null);
  const idx = sel ?? runningIdx;
  const maha = mahas[idx]!;
  const reading = useMemo(() => dashaReading(chart, m, maha, subperiods(maha)), [chart, m, maha]);
  const yp = dmsInSign(m.yogaPoint);
  const guidance = [...m.chartFindings, ...reading.findings.filter((f) => f.tone !== 'info')];
  const highlights = m.planets.filter((p) => p.tone === 'good' || p.tone === 'bad');
  const rank = (tr: readonly PlanetId[]) => (tr.includes(m.yogi) ? 0 : tr.includes(m.avayogi) ? 1 : 2);
  const runningBhukti = reading.bhuktis.find((b) => b.start <= nowJd && nowJd < b.end);

  return (
    <article class="ntp" data-testid="ntp-page">
      <section class="panel" aria-labelledby="h-ntp-guide">
        <header class="panel-head"><h2 id="h-ntp-guide">NTP Guidance</h2></header>
        <div class="panel-body">
          <p class="hint-text">{t('ntp.intro')}</p>
          <ul class="ntp-findings" data-testid="ntp-guidance">
            <li class="ntp-finding tone-info">
              <ToneTag tone="info" /> <span class="ntp-text">Birth Yogi <Pl id={m.yogi} />, Duplicate Yogi <Pl id={m.duplicateYogi} />, Avayogi <Pl id={m.avayogi} />.
                Yogi's set of three: {m.yogiTrio.map((x) => <Pl key={x} id={x} />).reduce<(JSX.Element | string)[]>((a, x) => (a.length ? [...a, ', ', x] : [x]), [])} — when one is a Yogi, the other two take on yoga character.</span>
              <cite class="ntp-cite">NTP-2 pp. 5–6</cite>
            </li>
            {guidance.map((f, i) => <FindingItem key={`g${i}`} f={f} />)}
            {highlights.map((p) => (
              <li key={p.id} class={`ntp-finding tone-${p.tone}`}>
                <ToneTag tone={p.tone} /> <span class="ntp-text"><Pl id={p.id} /> {PLANET_NAMES[p.id]} ({POL_WORD[p.pol].toLowerCase()}, bhava {p.bhava}{states(p).length ? `, ${states(p).join(', ').toLowerCase()}` : ''}): its Dasha tends to be {TONE_WORD[p.tone].toLowerCase()} — see its card.</span>
              </li>
            ))}
            <li class={`ntp-finding tone-${reading.tone}`}>
              <ToneTag tone={reading.tone} /> <span class="ntp-text">{idx === runningIdx ? 'Running' : 'Selected'} Mahadasha: <Pl id={reading.lord} /> {PLANET_NAMES[reading.lord]} ({civilDate(reading.start, zone)} – {civilDate(reading.end, zone)}); Dasha Yogi <Pl id={reading.dashaYogi} />, Raja Yogi <Pl id={reading.rajaYogi} />
                {runningBhukti && idx === runningIdx ? <>; running Bhukti <Pl id={runningBhukti.lord} /> — starts {TONE_WORD[runningBhukti.startTone].toLowerCase()}, ends {TONE_WORD[runningBhukti.finalTone].toLowerCase()}</> : null}.</span>
              <cite class="ntp-cite">NTP-2 pp. 21–38</cite>
            </li>
          </ul>
        </div>
      </section>

      <section class="panel" aria-labelledby="h-ntp-yoga">
        <header class="panel-head"><h2 id="h-ntp-yoga">Yoga, Avayoga and the sets of three</h2></header>
        <div class="panel-body">
          <dl class="ntp-facts" data-testid="ntp-yoga">
            <div><dt>Birth Yoga point</dt><dd>{SIGNS[signIndex(m.yogaPoint)]} {dms(yp.d, yp.m, yp.s)} <cite class="ntp-cite">NTP-2 p. 5</cite></dd></div>
            <div><dt>Birth Yogi</dt><dd><Pl id={m.yogi} /> {PLANET_NAMES[m.yogi]} (lord of its star)</dd></div>
            <div><dt>Duplicate Yogi</dt><dd><Pl id={m.duplicateYogi} /> {PLANET_NAMES[m.duplicateYogi]} (lord of its sign)</dd></div>
            <div><dt>Avayogi</dt><dd><Pl id={m.avayogi} /> {PLANET_NAMES[m.avayogi]} (the Yogi's one enemy) <cite class="ntp-cite">NTP-2 p. 6</cite></dd></div>
            <div><dt>Tithi</dt><dd>{m.tithi} {TITHI_NAMES[m.tithi - 1] ?? ''}</dd></div>
            <div><dt>Zero Rasis</dt><dd>{m.zeroRasis.length ? m.zeroRasis.map((s) => SIGNS[s]).join(', ') : 'none'}{m.zeroBhavas.length ? ` · bhavas ${m.zeroBhavas.join(', ')}` : ''} <cite class="ntp-cite">NTP-1 pp. 17–18</cite></dd></div>
          </dl>
          <div class="ntp-trios" role="list" aria-label="Sets of three">
            {[...TRIOS].sort((a, b) => rank(a) - rank(b)).map((tr) => {
              const kind = tr.includes(m.yogi) ? 'yogi' : tr.includes(m.avayogi) ? 'avayogi' : 'other';
              return (
                <div role="listitem" key={tr.join('')} class={`ntp-trio trio-${kind}`}>
                  <b>{kind === 'yogi' ? "Yogi's set" : kind === 'avayogi' ? "Avayogi's set" : 'Third set'}</b>
                  <span>{tr.map((x) => <span key={x}><Pl id={x} /> {PLANET_NAMES[x]} </span>)}</span>
                </div>
              );
            })}
          </div>
          <p class="hint-text">{t('ntp.trioNote')}</p>
        </div>
      </section>

      <section class="panel" aria-labelledby="h-ntp-planets">
        <header class="panel-head"><h2 id="h-ntp-planets">Planets by Iyer's rules</h2></header>
        <div class="panel-body ntp-cards">
          {m.planets.map((p) => <PlanetCard key={p.id} p={p} chart={chart} />)}
        </div>
      </section>

      <section class="panel" aria-labelledby="h-ntp-dasha">
        <header class="panel-head"><h2 id="h-ntp-dasha">Dasha and Bhukti by Iyer's Dasha chart</h2></header>
        <div class="panel-body">
          <div class="field inline-field">
            <label for="ntp-maha">Mahadasha</label>
            <select id="ntp-maha" value={idx} onChange={(ev) => setSel(Number(ev.currentTarget.value))}>
              {mahas.map((p, i) => <option key={i} value={i}>{PLANET_NAMES[p.lords[0]!]} {civilDate(p.start, zone)} – {civilDate(p.end, zone)}{i === runningIdx ? ' (running)' : ''}</option>)}
            </select>
          </div>
          <p>Dasha Yogi <Pl id={reading.dashaYogi} /> {PLANET_NAMES[reading.dashaYogi]} · Dasha Raja Yogi <Pl id={reading.rajaYogi} /> {PLANET_NAMES[reading.rajaYogi]} <cite class="ntp-cite">NTP-2 pp. 29–30, 36</cite></p>
          <ul class="ntp-findings">{reading.findings.map((f, i) => <FindingItem key={i} f={f} />)}</ul>
          <div class="table-wrap">
            <table class="data" data-testid="ntp-bhuktis">
              <caption class="sr-only">Bhuktis of the {PLANET_NAMES[reading.lord]} Dasha</caption>
              <thead><tr><th scope="col">Bhukti</th><th scope="col">Begins</th><th scope="col">Starter</th><th scope="col">Ruler</th><th scope="col">Start → end</th><th scope="col">Why</th></tr></thead>
              <tbody>
                {reading.bhuktis.map((b) => (
                  <tr key={b.lord} class={b.start <= nowJd && nowJd < b.end ? 'running' : undefined}>
                    <th scope="row"><Pl id={b.lord} /> {PLANET_NAMES[b.lord]}</th>
                    <td class="num">{civilDate(b.start, zone)}</td>
                    <td><Pl id={b.starter} /></td><td><Pl id={b.ruler} /></td>
                    <td><ToneTag tone={b.startTone} /> → <ToneTag tone={b.finalTone} /></td>
                    <td><details><summary>{b.findings.length} rule{b.findings.length === 1 ? '' : 's'}</summary><ul class="ntp-findings">{b.findings.map((f, i) => <FindingItem key={i} f={f} />)}</ul></details></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="hint-text">{t('ntp.bhuktiNote')}</p>
        </div>
      </section>

      <section class="panel" aria-labelledby="h-ntp-how">
        <header class="panel-head"><h2 id="h-ntp-how">How this page reads the chart</h2></header>
        <div class="panel-body"><p class="hint-text">{t('ntp.how', { weekday: String(weekday) })}</p></div>
      </section>
    </article>
  );
}

/**
 * Nandi Nadi (research): Bhrigu Nandi Nadi as taught from R. G. Rao — sign
 * links between planets, Rao's retrograde rule, exchanges, karaka summaries,
 * and Jupiter/Saturn transit activations with their rounds from birth.
 * Engine: src/engine/nadi/bnn.ts; rules and sources: docs/specs/nandi_nadi.md.
 * Relations are listed, never scored.
 */
import { useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult, PlanetId } from '../../../engine';
import { PLANETS } from '../../../engine/types';
import { PLANET_NAMES } from '../../../engine/names';
import { SIGNS } from '../../../engine/zodiac';
import { julianDay } from '../../../engine/time/julian';
import { transitPositions } from '../../../engine/transit/events';
import {
  activations, bnn, contactOrder, KARAKATVA, pairKeyword, rounds, themes,
  type BnnOptions, type Link, type LinkKind, type NatalPoint, type RetroRule, type Sex,
} from '../../../engine/nadi/bnn';
import { engine } from '../../state/store';
import { civilDate } from '../../format';
import { Chip, Pl } from './common';

const KIND_WORD: Record<LinkKind, string> = { same: 'same sign', ahead: '2nd (ahead)', behind: '12th (behind)', opposite: '7th (opposite)', trine: 'trine (5th/9th)', weak: '3rd/11th (weak)' };
const CODE: Record<LinkKind, (h: number) => string> = { same: () => '1', ahead: () => '2', behind: () => '12', opposite: () => '7', trine: (h) => String(h), weak: (h) => String(h) };

function LinkText({ l }: { l: Link }): JSX.Element {
  const kw = pairKeyword(l.from, l.to);
  return (
    <li>
      <Pl id={l.to} /> {KIND_WORD[l.kind]}
      {l.viaRetro.length > 0 && <span class="muted"> · via {l.viaRetro.join(', ')} retrograde (previous sign)</span>}
      {l.friendship !== 'none' && <> <Chip tone={l.friendship === 'friendly' ? 'good' : 'bad'} title="SEC 2022 table, contested">{l.friendship}</Chip></>}
      {kw && <span class="muted"> — {kw.text} <cite class="ntp-cite">{kw.source}</cite></span>}
    </li>
  );
}

export function Nadi({ chart }: { chart: ChartResult }): JSX.Element {
  const [sex, setSex] = useState<Sex>('unspecified');
  const [opts, setOpts] = useState<BnnOptions>({ weakLinks: false, retro: 'also', retroNodes: false });
  const today = new Date();
  const [date, setDate] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
  const [showRounds, setShowRounds] = useState(false);
  const e = engine.value;
  const natal: NatalPoint[] = useMemo(() => PLANETS.map((id) => ({ id, lonDeg: chart.bodies[id].lonDeg, retrograde: chart.bodies[id].retrograde })), [chart]);
  const m = useMemo(() => bnn(natal, opts), [natal, opts]);
  const jd = useMemo(() => { const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date); return d ? julianDay(+d[1]!, +d[2]!, +d[3]!, 12 - chart.input.tzHours) : null; }, [date, chart]);
  const tr = useMemo(() => (e.status === 'ready' && jd !== null ? transitPositions(e.swe, chart.profile, jd) : null), [e, jd, chart]);
  const acts = useMemo(() => (tr ? activations(natal, { Ju: { lonDeg: tr.Ju.lonDeg, retrograde: tr.Ju.retrograde }, Sa: { lonDeg: tr.Sa.lonDeg, retrograde: tr.Sa.retrograde } }, opts) : []), [tr, natal, opts]);
  const rnd = useMemo(() => (showRounds && e.status === 'ready' ? rounds(e.swe, chart.profile, natal, chart.moment.jdUT, 90) : null), [showRounds, e, chart, natal]);
  const zone = chart.input.tzHours + chart.input.dstHours;
  const ageAt = (j: number) => ((j - chart.moment.jdUT) / 365.25).toFixed(1);

  return (
    <>
      <p class="exp-banner" role="note">
        <strong>Research / experimental.</strong> Bhrigu Nandi Nadi (the “Nandi Nadi” of KRS’s course) as taught from R. G. Rao’s
        <em> Bhrigu Nandi Nadi</em> (2008). The Lagna is not used: each planet is read from its own sign, planets stand for people
        and matters, and timing comes from the transits of Jupiter and Saturn. Relations are shown, not scored. Sources:
        PRI = Rao; SEC = Jagadeesan &amp; Jothimani 2022; PRAC = practitioners. Not validated against reference charts.
      </p>

      <div class="exp-controls">
        <div class="field exp-field">
          <label for="nadi-sex">Native</label>
          <select id="nadi-sex" value={sex} onChange={(ev) => setSex((ev.currentTarget as HTMLSelectElement).value as Sex)}>
            <option value="unspecified">Not set</option><option value="male">Male</option><option value="female">Female</option>
          </select>
        </div>
        <div class="field exp-field">
          <label for="nadi-retro">Retrograde planet acts</label>
          <select id="nadi-retro" value={opts.retro} onChange={(ev) => setOpts({ ...opts, retro: (ev.currentTarget as HTMLSelectElement).value as RetroRule })}>
            <option value="also">also from the previous sign (Rao, SEC)</option>
            <option value="instead">from the previous sign instead</option>
            <option value="off">from its own sign only</option>
          </select>
        </div>
        <label class="check"><input type="checkbox" checked={opts.retroNodes} onChange={(ev) => setOpts({ ...opts, retroNodes: (ev.currentTarget as HTMLInputElement).checked })} /> Apply it to Rahu and Ketu (open)</label>
        <label class="check"><input type="checkbox" checked={opts.weakLinks} onChange={(ev) => setOpts({ ...opts, weakLinks: (ev.currentTarget as HTMLInputElement).checked })} /> Include 3rd/11th links (contested)</label>
      </div>

      <section class="panel" aria-labelledby="h-nadi-a">
        <header class="panel-head"><h2 id="h-nadi-a">Natal positions</h2></header>
        <div class="panel-body table-wrap">
          <table class="data" data-testid="nadi-natal">
            <thead><tr><th scope="col">Planet</th><th scope="col">Sign</th><th scope="col" class="r">Degree</th><th scope="col">Signification (karakatva)</th><th scope="col">Notes</th></tr></thead>
            <tbody>
              {m.rows.map((r) => (
                <tr key={r.id}>
                  <th scope="row"><Pl id={r.id} /></th>
                  <td>{SIGNS[r.sign]}{r.retrograde ? ' R' : ''}</td>
                  <td class="num r">{r.degInSign.toFixed(2)}</td>
                  <td>{KARAKATVA[r.id]}</td>
                  <td><span class="chips">
                    {r.alsoFrom !== null && <Chip tone="info" title="R1, PRI pp. 11, 128, 219, 257">{`acts also from ${SIGNS[r.alsoFrom]}`}</Chip>}
                    {r.dignity && <Chip tone={r.dignity === 'DB' ? 'bad' : 'good'}>{r.dignity === 'EX' ? 'exalted' : r.dignity === 'DB' ? 'debilitated' : 'own sign'}</Chip>}
                    {r.exchangeWith && <Chip tone="good" title="X1, PRI p. iv">{`exchange with ${r.exchangeWith}`}</Chip>}
                    {r.retroViaExchange && <Chip tone="info" title="X3, SEC rule 18">treated as retrograde (exchange)</Chip>}
                    {r.isolated && <Chip tone="mixed" title="L7, SEC rules 8–9">isolated</Chip>}
                    {r.orderInSign > 1 && <Chip tone="info" title="L1o, PRAC">{`${r.orderInSign}${r.orderInSign === 2 ? 'nd' : r.orderInSign === 3 ? 'rd' : 'th'} by degree in its sign`}</Chip>}
                    {r.side && <Chip tone="info" title="L8, SEC rule 10">{r.side === 'A' ? 'Rahu → Ketu side' : 'Ketu → Rahu side'}</Chip>}
                    {r.nearBoundary && <Chip tone="mixed" title="Sign-level rules may flip with the ayanamsa">near a sign boundary</Chip>}
                  </span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel" aria-labelledby="h-nadi-b">
        <header class="panel-head"><h2 id="h-nadi-b">Links between planets</h2></header>
        <div class="panel-body">
          <div class="table-wrap" tabIndex={0} role="region" aria-label="Sign links matrix">
            <table class="data exp-matrix" data-testid="nadi-matrix">
              <caption class="hint-text cap">
                Row planet → column planet: the column planet is in the n-th sign from the row planet (1 same, 2 ahead, 12 behind, 7 opposite,
                5/9 trine{opts.weakLinks ? ', 3/11 weak' : ''}). ʀ = only through a retrograde planet’s previous sign. Green / red: friendly / inimical
                in the row planet’s view (SEC 2022 table, contested). ⇄ exchange.
              </caption>
              <thead><tr><th scope="col"><span class="sr-only">From ↓ to →</span></th>{PLANETS.map((p) => <th key={p} scope="col" class="c"><Pl id={p} /></th>)}</tr></thead>
              <tbody>
                {PLANETS.map((a) => (
                  <tr key={a}>
                    <th scope="row"><Pl id={a} /></th>
                    {PLANETS.map((b) => {
                      if (a === b) return <td key={b} class="c muted">·</td>;
                      const ls = m.links.filter((l) => l.from === a && l.to === b);
                      const ex = m.exchanges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
                      const fr = ls[0]?.friendship;
                      return (
                        <td key={b} class={`c num${fr === 'friendly' ? ' rel-friend' : fr === 'inimical' ? ' rel-enemy' : ''}`}
                          title={ls.map((l) => `${PLANET_NAMES[b]} ${KIND_WORD[l.kind]} from ${PLANET_NAMES[a]}${l.viaRetro.length ? ' (via retrograde)' : ''}`).join('; ') || undefined}>
                          {ls.map((l) => CODE[l.kind](l.h) + (l.viaRetro.length ? 'ʀ' : '')).join(' ')}{ex ? ' ⇄' : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="panel" aria-labelledby="h-nadi-c">
        <header class="panel-head"><h2 id="h-nadi-c">By karaka</h2></header>
        <div class="panel-body ntp-cards" data-testid="nadi-themes">
          {themes(sex).map((th) => (
            <div key={th.id} class="ntp-card">
              <div class="ntp-card-head"><h3>{th.label}</h3></div>
              {th.karakas.map((k) => (
                <div key={k.id}>
                  <p class="ntp-pos"><Pl id={k.id} /> {PLANET_NAMES[k.id]} in {SIGNS[Math.floor(chart.bodies[k.id].lonDeg / 30)]}{k.note && <span class="muted"> · {k.note}</span>}</p>
                  <ul class="nadi-links">
                    {m.links.filter((l) => l.from === k.id).map((l) => <LinkText key={l.to + l.kind} l={l} />)}
                    {!m.links.some((l) => l.from === k.id) && <li class="muted">No links: isolated (L7).</li>}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div class="panel-body">
          <p class="hint-text">
            Moving forward from Jupiter (the native), the planets met in order: {contactOrder(natal, 'Ju').join(' → ')}.
            Rao reads planets ahead of Jupiter as younger siblings and those behind as elder ones (T7, PRI pp. 11, 15; experimental).
          </p>
        </div>
      </section>

      <section class="panel" aria-labelledby="h-nadi-d">
        <header class="panel-head"><h2 id="h-nadi-d">Jupiter and Saturn transits</h2></header>
        <div class="panel-body">
          <div class="exp-controls">
            <div class="field exp-field"><label for="nadi-date">Date</label><input id="nadi-date" type="date" value={date} onInput={(ev) => setDate((ev.currentTarget as HTMLInputElement).value)} /></div>
            {tr && <p class="muted">Jupiter in {SIGNS[Math.floor(tr.Ju.lonDeg / 30)]}{tr.Ju.retrograde ? ' R' : ''} · Saturn in {SIGNS[Math.floor(tr.Sa.lonDeg / 30)]}{tr.Sa.retrograde ? ' R' : ''}</p>}
          </div>
          <ul class="exp-conj" data-testid="nadi-activations">
            {acts.map((a, i) => (
              <li key={i} class={a.kind === 'contact' ? 'tone-good' : ''}>
                Transit <Pl id={a.by} /> {a.kind === 'contact' ? 'contacts' : a.kind === 'opposite' ? 'opposes' : 'is in trine to'} natal <Pl id={a.natal} />
                {a.kind === 'trine' && <span class="muted"> (contested, T5)</span>}
                {a.viaRetro && <span class="muted"> · via the retrograde previous-sign rule</span>}
                {a.pilgrimage && <> <Chip tone="good" title="T6, PRI p. iii">pilgrimage</Chip></>}
                <span class="muted"> — activates {KARAKATVA[a.natal]}</span>
              </li>
            ))}
          </ul>
          <p class="hint-text">Jupiter “gives the results of the sign he transits” and activates the planets it contacts (T1); Saturn’s contacts mark changes in work (T3); the planet in the 7th from the transit supports or opposes (T4).</p>
          {!showRounds
            ? <button type="button" class="btn" onClick={() => setShowRounds(true)}>Show the rounds from birth (90 years)</button>
            : rnd && (
              <div class="table-wrap" tabIndex={0} role="region" aria-label="Jupiter and Saturn rounds">
                <table class="data" data-testid="nadi-rounds">
                  <thead><tr><th scope="col">Planet</th><th scope="col" class="c">Round</th><th scope="col">Sign</th><th scope="col">From → to</th><th scope="col" class="r">Age</th><th scope="col">Meets natal</th></tr></thead>
                  <tbody>
                    {rnd.map((r, i) => (
                      <tr key={i} class={r.isReturn ? 'running' : undefined}>
                        <th scope="row"><Pl id={r.body} /></th><td class="c num">{r.round}</td>
                        <td>{SIGNS[r.sign]}{r.direction === 'retrograde' ? ' (R)' : ''}{r.isReturn ? ' · return' : ''}</td>
                        <td class="num">{civilDate(r.start, zone)} → {civilDate(r.end, zone)}</td>
                        <td class="num r">{ageAt(r.start)}</td>
                        <td>{r.contacts.map((p: PlanetId) => <Pl key={p} id={p} />).reduce<(JSX.Element | string)[]>((acc, el, j) => (j ? [...acc, ' ', el] : [el]), [])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </section>
    </>
  );
}

/**
 * Matching → Krishnamurti (KP): his notes on the kootas (KP Reader 4, catalogue
 * src/engine/kp/guidance/match_notes.json) and his own test — the partner's
 * birth ruling planets (lagna sign and star, Moon sign and star, weekday) should
 * be significators of the native's 2, 7 and 11, not of 1, 6 and 10
 * (B4 pp. 81–84, 172). Both charts are recast in KP Readers mode.
 */
import { useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import { cast, type ChartResult, type PlanetId } from '../../../engine';
import { kpModel } from '../../../engine/kp/kp';
import { kpSignifications } from '../../../engine/kp/significators';
import { rulingPlanets } from '../../../engine/kp/ruling';
import { vara } from '../../../engine/panchanga/panchanga';
import NOTES from '../../../engine/kp/guidance/match_notes.json';
import { engine, overrides, READERS_OVERRIDES } from '../../state/store';
import { Chips } from '../kp/common';
import type { Pair } from '../Matching';

interface Note { id: string; koota: string; text: string; cite: string }

function check(swe: Parameters<typeof vara>[0], native: ChartResult, partner: ChartResult) {
  const m = kpModel(native), sig = kpSignifications(m);
  const rp = rulingPlanets(partner, vara(swe, partner).lord as PlanetId);
  const core = [...new Set(rp.slots.filter((s) => s.role !== 'lagna sub' && s.role !== 'Moon sub').map((s) => s.planet))];
  const of = (hs: number[]) => core.filter((p) => sig.planets[p].all.some((h) => hs.includes(h)));
  return { rps: core, yes: of([2, 7, 11]), no: of([1, 6, 10]).filter((p) => !of([2, 7, 11]).includes(p)) };
}

export function KpNotes({ pair }: { pair: Pair }): JSX.Element {
  const e = engine.value;
  const res = useMemo(() => {
    if (e.status !== 'ready') return null;
    const re = (c: ChartResult) => cast(e.swe, { ...c.input, overrides: { ...overrides.value, ...READERS_OVERRIDES } });
    const a = re(pair.first), b = re(pair.second);
    return { first: check(e.swe, a, b), second: check(e.swe, b, a) };
  }, [e, pair]);
  const notes = (NOTES as { notes: Note[] }).notes;
  const groups = [...new Set(notes.map((n) => n.koota))];
  const name = (c: ChartResult) => c.input.name || 'Unnamed';
  return (
    <section class="panel" aria-labelledby="h-m-kp">
      <header class="panel-head"><h2 id="h-m-kp">Krishnamurti on matching (KP Reader 4)</h2></header>
      <div class="panel-body">
        <p class="hint-text">Krishnamurti judges each chart first and treats the kootas as secondary. His own test: the partner's birth ruling
          planets should signify the native's houses 2, 7 and 11 (B4 pp. 81–84, 172). Both charts recast in KP Readers mode.</p>
        {res && (
          <ul class="ntp-findings" data-testid="match-kp-test">
            {([[pair.first, pair.second, res.first], [pair.second, pair.first, res.second]] as const).map(([n, p, r]) => (
              <li key={name(n)} class={`ntp-finding tone-${r.yes.length >= 3 ? 'good' : r.yes.length ? 'mixed' : 'bad'}`}>
                <span class="ntp-text">{name(p)}'s birth ruling planets <Chips ids={r.rps} />: significators of {name(n)}'s 2-7-11 — <Chips ids={r.yes} />
                  {r.no.length ? <> · only of 1-6-10 — <Chips ids={r.no} /></> : null}</span> <cite class="ntp-cite">B4 p. 172</cite>
              </li>
            ))}
          </ul>
        )}
        {groups.map((g) => (
          <details key={g} class="ntp-more" open={g === 'general'}>
            <summary>{g === 'general' ? 'General' : g}</summary>
            <ul class="ntp-findings">
              {notes.filter((n) => n.koota === g).map((n) => (
                <li key={n.id + n.text.slice(0, 10)} class="ntp-finding tone-info"><span class="ntp-text">{n.text}</span> <cite class="ntp-cite">{n.cite} · {n.id}</cite></li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}

/**
 * The scored Compatibility reports: overview, Ashtakoot (36), Mangala Dosha
 * (consideration, results, cancellation) and Dash-Koota (Kalaprakasika, 44).
 * Engine: src/engine/match/kootas.ts and mangal.ts (PL 7 rules,
 * docs/specs/compatibility.md). Sentences are our own wording.
 */
import { useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import { ashtakoota, dashakoota, kootaPerson, type Ashtakoota, type Dashakoota } from '../../../engine/match/kootas';
import { mangalReport, type MangalConsideration, type MangalReport } from '../../../engine/match/mangal';
import { NAKSHATRA_NAMES } from '../../../engine/names';
import { pada } from '../../../engine/zodiac';
import type { Pair } from '../Matching';
import { Chip } from '../exp/common';

const VERDICT: Record<Ashtakoota['verdict'], { word: string; tone: 'good' | 'bad' | 'mixed' }> = {
  avoid: { word: 'should be avoided (16 or less)', tone: 'bad' },
  medium: { word: 'medium (17–21)', tone: 'mixed' },
  good: { word: 'good (22–30)', tone: 'good' },
  excellent: { word: 'excellent (over 30)', tone: 'good' },
};
const n = (p: Pair, who: 'boy' | 'girl') => p[who].input.name || (who === 'boy' ? 'the groom' : 'the bride');
const N = (p: Pair, who: 'boy' | 'girl') => p[who].input.name || (who === 'boy' ? 'The groom' : 'The bride');
const f1 = (x: number) => (Number.isInteger(x) ? x.toFixed(0) : x.toFixed(1));

export function useMatch(pair: Pair): { a: Ashtakoota; d: Dashakoota; m: MangalReport } {
  return useMemo(() => {
    const bride = kootaPerson(pair.girl), groom = kootaPerson(pair.boy);
    return { a: ashtakoota(bride, groom), d: dashakoota(bride, groom), m: mangalReport(pair.boy, pair.girl) };
  }, [pair]);
}

function Meter({ v, max, label }: { v: number; max: number; label: string }): JSX.Element {
  return (
    <span class="meter" role="img" aria-label={`${label}: ${f1(v)} of ${max}`}>
      <span class="meter-fill" style={{ width: `${(v / max) * 100}%` }} />
    </span>
  );
}

function mangalLine(c: MangalConsideration): string {
  const o = (k: number) => `${k}${k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'}`;
  const st = c.lagnaDosha && c.moonDosha ? 'Mangalik from the birth chart and from the Moon chart'
    : c.lagnaDosha ? 'Mangalik from the birth chart, not from the Moon chart'
    : c.moonDosha ? 'not Mangalik from the birth chart, but Mangalik from the Moon chart'
    : 'not Mangalik from either chart';
  return `Mars is ${o(c.fromLagna)} from the Lagna and ${o(c.fromMoon)} from the Moon: ${st}.`;
}

export function Overview({ pair }: { pair: Pair }): JSX.Element {
  const { a, d, m } = useMatch(pair);
  const v = VERDICT[a.verdict];
  const anyMangal = m.groom.lagnaDosha || m.bride.lagnaDosha || m.groom.moonDosha || m.bride.moonDosha;
  return (
    <section class="panel" aria-labelledby="h-m-over">
      <header class="panel-head"><h2 id="h-m-over">At a glance</h2></header>
      <div class="panel-body">
        <div class="stat-tiles" data-testid="match-overview">
          <div class="stat"><span class="stat-label">Ashtakoot (North)</span><span class="stat-value">{f1(a.total)}<small> / 36</small></span><Chip tone={v.tone}>{v.word}</Chip></div>
          <div class="stat"><span class="stat-label">Dash-Koota (Kalaprakasika)</span><span class="stat-value">{f1(d.total44)}<small> / 44</small></span><span class="muted">{d.favourable} of 10 kootas in full</span></div>
          <div class="stat"><span class="stat-label">BV Raman method</span><span class="stat-value">{f1(d.bvRaman36)}<small> / 36</small></span></div>
          <div class="stat"><span class="stat-label">Mangala Dosha</span>
            <span class="stat-value small">{anyMangal ? 'Present' : 'None'}</span>
            <span class="muted">{anyMangal ? `${m.cancellations.length} cancelling factor${m.cancellations.length === 1 ? '' : 's'}` : 'in either chart'}</span></div>
        </div>
        <p class="hint-text">
          Maha doshas: {a.rows.filter((r) => r.dosha).map((r) => r.label).join(', ') || 'none'}.
          Parashara's Light's manual reads a total below 18 as questionable, 18–24 as good and above 24 as excellent.
          Iyer treats koota marks as "very very secondary"; see the NTP (Research) tab for his way of matching.
        </p>
      </div>
    </section>
  );
}

export function AshtakootTable({ pair }: { pair: Pair }): JSX.Element {
  const { a } = useMatch(pair);
  const g = pair.boy.bodies.Mo.lon, b = pair.girl.bodies.Mo.lon;
  const star = (lon: number) => `${NAKSHATRA_NAMES[Math.floor(lon / 48000)]}–${pada(lon)}`;
  const v = VERDICT[a.verdict];
  return (
    <section class="panel" aria-labelledby="h-m-ak">
      <header class="panel-head"><h2 id="h-m-ak">Ashtakoot Guna matching</h2></header>
      <div class="panel-body table-wrap">
        <table class="data" data-testid="match-ashtakoot">
          <caption class="hint-text cap">Groom{pair.boy.input.name ? ` ${pair.boy.input.name}` : ''} ({star(g)}); bride{pair.girl.input.name ? ` ${pair.girl.input.name}` : ''} ({star(b)}). PL 7's tables and scoring.</caption>
          <thead><tr><th scope="col">Koot</th><th scope="col">Groom</th><th scope="col">Bride</th><th scope="col" class="r">Max.</th><th scope="col" class="r">Gained</th><th scope="col"><span class="sr-only">Share</span></th><th scope="col" class="c">Dosha</th><th scope="col">Area of life</th></tr></thead>
          <tbody>
            {a.rows.map((r) => (
              <tr key={r.id}>
                <th scope="row">{r.label}</th><td>{r.groom}</td><td>{r.bride}</td>
                <td class="num r">{f1(r.max)}</td><td class="num r strong-cell">{f1(r.score)}</td>
                <td><Meter v={r.score} max={r.max} label={r.label} /></td>
                <td class="c">{r.dosha ? <Chip tone="bad">yes</Chip> : '–'}</td><td>{r.area}</td>
              </tr>
            ))}
            <tr class="sum"><th scope="row">Total</th><td /><td /><td class="num r">36</td><td class="num r strong-cell">{f1(a.total)}</td><td><Meter v={a.total} max={36} label="Total" /></td><td /><td /></tr>
          </tbody>
        </table>
        <p data-testid="match-verdict">Ashtakoot matching between {n(pair, 'boy')} and {n(pair, 'girl')} is <Chip tone={v.tone}>{v.word}</Chip></p>
        {a.rows.filter((r) => r.dosha).map((r) => (
          <p key={r.id} class="ntp-finding tone-bad">
            <strong>{r.label} Maha Dosha.</strong>{' '}
            {r.id === 'gana' ? `The groom is of ${r.groom} gana and the bride of ${r.bride} gana.`
              : r.id === 'bhakoot' ? `The Moon signs are ${r.groom} (groom) and ${r.bride} (bride): a 2/12, 5/9 or 6/8 relation.`
              : `Both are of ${r.groom} Nadi.`}
          </p>
        ))}
        <details class="ntp-more">
          <summary>How PL 7 scores these (differs from some textbooks)</summary>
          <ul class="hint-text">
            <li>Tara is counted one way only (the groom's star from the bride's): 3 points for Janma or Sampat, 1.5 for any other tara.</li>
            <li>Graha Maitri adds the two lords' natural relations; two neutral lords score 1, not 3.</li>
            <li>Gana, Yoni, Vashya and Varna use PL's own tables; Sagittarius and Capricorn are split at 15° of the Moon for Vashya.</li>
            <li>No Bhakoot or Nadi exception changes the score. These rules were read from PL 7's program and await one printed PL report to confirm.</li>
          </ul>
        </details>
      </div>
    </section>
  );
}

export function MangalPanel({ pair }: { pair: Pair }): JSX.Element {
  const { m } = useMatch(pair);
  const who = (w: 'groom' | 'bride' | 'pair') => (w === 'pair' ? 'Both charts' : w === 'groom' ? N(pair, 'boy') : N(pair, 'girl'));
  return (
    <>
      <section class="panel" aria-labelledby="h-m-mc">
        <header class="panel-head"><h2 id="h-m-mc">Mangala Dosha: consideration</h2></header>
        <div class="panel-body" data-testid="match-mangal">
          <p class="hint-text">Mangala Dosha: Mars in the 1st, 2nd, 4th, 7th, 8th or 12th from the birth Lagna. Some rishis also count from the Moon, Venus and the 7th lord; in general practice the Lagna and the Moon are used, as here.</p>
          <ul class="exp-conj">
            <li class={m.groom.lagnaDosha || m.groom.moonDosha ? 'tone-bad' : 'tone-good'}><strong>{N(pair, 'boy')}{pair.boy.input.name ? ' (groom)' : ''}.</strong> {mangalLine(m.groom)}</li>
            <li class={m.bride.lagnaDosha || m.bride.moonDosha ? 'tone-bad' : 'tone-good'}><strong>{N(pair, 'girl')}{pair.girl.input.name ? ' (bride)' : ''}.</strong> {mangalLine(m.bride)}</li>
          </ul>
        </div>
      </section>
      <section class="panel" aria-labelledby="h-m-mx">
        <header class="panel-head"><h2 id="h-m-mx">Mangala Dosha: cancellation</h2></header>
        <div class="panel-body">
          <p class="hint-text">By the classics the dosha cannot be cancelled entirely; its intensity is reduced. When both have the dosha alike, it is held to be nullified. PL 7's 25 conditions are tested below; those marked "inferred" use a reading of PL's formula that PL does not document.</p>
          {!m.gate
            ? <p>Neither chart has Mars in a dosha house from the Lagna: there is no Mangala Dosha to cancel.</p>
            : m.cancellations.length === 0
              ? <p>None of the cancelling conditions applies.</p>
              : (
                <ul class="exp-conj" data-testid="match-cancellations">
                  {m.cancellations.map((x, i) => (
                    <li key={i} class="tone-good"><strong>{who(x.who)}</strong> · {x.text} <span class="ntp-cite">{x.id}</span>{x.inferred && <> <Chip tone="info">inferred</Chip></>}</li>
                  ))}
                </ul>
              )}
          <details class="ntp-more">
            <summary>Results and remedies (PL's Mangala Dosha – Results page, summarised)</summary>
            <p class="hint-text">The texts describe friction and harm to the partner's well-being when one partner alone carries the dosha; a match where both carry it is considered balanced. Remedies named include fasting on Tuesdays and recitation of the Mangala Chandika Stotra.</p>
          </details>
        </div>
      </section>
    </>
  );
}

export function DashKoota({ pair }: { pair: Pair }): JSX.Element {
  const { d } = useMatch(pair);
  const tone = (w: string) => (w === 'Auspicious' ? 'good' : w === 'Inauspicious' ? 'bad' : 'mixed') as 'good' | 'bad' | 'mixed';
  const rows = (rs: Dashakoota['rows'], start: number) => rs.map((r, i) => (
    <tr key={r.id}>
      <th scope="row">{start ? `${i + 1}. ` : ''}{r.label} <span class="muted">({r.area})</span></th>
      <td class="num r">{f1(r.max)}</td><td class="num r strong-cell">{f1(r.score)}</td>
      <td>{r.word && <Chip tone={tone(r.word)}>{r.word}</Chip>}</td><td class="ntp-why">{r.note}</td>
    </tr>
  ));
  return (
    <section class="panel" aria-labelledby="h-m-dk">
      <header class="panel-head"><h2 id="h-m-dk">Dash-Koota (Kalaprakasika)</h2></header>
      <div class="panel-body table-wrap">
        <p class="hint-text">Ten considerations judge a proposed marriage; at least five should be favourable. Here {d.favourable} of 10 score in full.</p>
        <table class="data" data-testid="match-dashkoota">
          <thead><tr><th scope="col">Koota</th><th scope="col" class="r">Max.</th><th scope="col" class="r">Points</th><th scope="col">Result</th><th scope="col">Why</th></tr></thead>
          <tbody>
            {rows(d.rows, 1)}
            <tr class="sum"><th scope="row" colSpan={5}>Other considerations</th></tr>
            {rows(d.other, 0)}
            <tr class="sum"><th scope="row">Total (Kalaprakasika)</th><td class="num r">44</td><td class="num r strong-cell">{f1(d.total44)}</td><td colSpan={2} /></tr>
            <tr><th scope="row">BV Raman method</th><td class="num r">36</td><td class="num r">{f1(d.bvRaman36)}</td><td colSpan={2} /></tr>
            <tr><th scope="row">Ashtakoot method</th><td class="num r">36</td><td class="num r">{f1(d.ashtakoota36)}</td><td colSpan={2} /></tr>
          </tbody>
        </table>
        <p class="hint-text">Where the two Moon-sign lords are the same or mutual friends, or the Moon signs are opposite, PL raises Ganam and Rasi and sets Rajju to 4 and Vedhai to 1; the "Why" column says when.</p>
      </div>
    </section>
  );
}

/**
 * Page 1 — the boss's PL 9 "Birth chart I" worksheet, redrawn: Rasi chart
 * (East Indian), D9, Vimshottari, planet table, strengths. Panels follow
 * PL's arrangement so the eye finds things where it expects them.
 */
import type { ComponentChildren, JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import type { ChartResult } from '../../engine';
import { houseOfSign, page1Model, type PointRow } from '../../engine/page1';
import { julianDay } from '../../engine/time/julian';
import { SIGNS } from '../../engine/zodiac';
import { EastIndianChart, type ChartEntry } from '../components/EastIndianChart';
import { PlanetTable } from '../components/PlanetTable';
import { DashaList } from '../components/DashaList';
import { HowComputed } from '../components/HowComputed';
import { t, type MessageKey } from '../i18n';
import { coords, dm, hms, longDate } from '../format';

function Panel(props: { id: string; title: MessageKey; children: ComponentChildren; extra?: ComponentChildren }): JSX.Element {
  return (
    <section class={`panel p-${props.id}`} aria-labelledby={`h-${props.id}`}>
      <header class="panel-head">
        <h2 id={`h-${props.id}`}>{t(props.title)}</h2>
        {props.extra}
      </header>
      <div class="panel-body">{props.children}</div>
    </section>
  );
}

const signRow = (s: number, asc: number): ChartEntry => ({
  key: `sign${s}`,
  parts: [{ text: SIGNS[s]!, tone: 'sign' }, { text: ` ${houseOfSign(s, asc)}`, tone: 'house' }],
});

/** True while the viewport matches `query` (phones get compact chart entries). */
function useMedia(query: string): boolean {
  const [hit, setHit] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setHit(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return hit;
}

function rasiEntries(rasi: PointRow[][], asc: number): ChartEntry[][] {
  return rasi.map((rows, s) => [
    signRow(s, asc),
    ...rows.map((r) => ({
      key: r.id,
      parts: [
        { text: r.id, tone: r.id, bold: true },
        ...(r.retrograde ? [{ text: 'R', tone: r.id }] : []),
        { text: ` ${dm(r.deg, r.min)} ` },
        { text: r.nakshatraAbbr, tone: 'muted' },
      ],
    })),
  ]);
}

function vargaEntries(groups: PointRow['id'][][], rows: PointRow[], asc: number): ChartEntry[][] {
  const retro = new Set(rows.filter((r) => r.retrograde).map((r) => r.id));
  return groups.map((ids, s) => {
    const lines: ChartEntry[] = [signRow(s, asc)];
    for (let i = 0; i < ids.length; i += 3) {
      const chunk = ids.slice(i, i + 3);
      lines.push({
        key: chunk.join(''),
        parts: chunk.flatMap((id, j) => [
          { text: (j ? ' ' : '') + id, tone: id, bold: true },
          ...(retro.has(id) ? [{ text: 'R', tone: id }] : []),
        ]),
      });
    }
    return lines;
  });
}

export function Page1({ chart }: { chart: ChartResult }): JSX.Element {
  const m = page1Model(chart);
  const { input } = chart;
  const zoneHours = input.tzHours + input.dstHours;
  const date = longDate(input.date.y, input.date.m, input.date.d);
  const time = hms(input.time.h, input.time.mi, input.time.s);
  const now = new Date();
  const nowJd = julianDay(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(),
    now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600);
  const name = input.name || t('page1.birthChart');
  const compact = useMedia('(max-width: 560px)');

  return (
    <article class="page1" data-testid="page1">
      <div class="p1-grid">
        <div class="p1-col">
        <Panel id="rasi" title="page1.birthChart">
          <EastIndianChart
            title={`${t('page1.birthChart')}: ${name}`}
            signs={compact ? vargaEntries(m.rasi.map((g) => g.map((r) => r.id)), m.rows, m.ascSign) : rasiEntries(m.rasi, m.ascSign)}
            lagnaSign={m.ascSign}
            centre={compact
              ? [{ text: date, size: 40 }, { text: time, size: 40 }]
              : [
                { text: name, size: 32, display: true },
                { text: date, size: 22 },
                { text: time, size: 22 },
                { text: input.place.name, size: 20 },
                { text: coords(input.place.latDeg, input.place.lonDeg), size: 17 },
              ]}
            maxFont={compact ? 46 : 27} minFont={compact ? 24 : 9}
          />
        </Panel>
        <Panel id="planets" title="page1.planets">
          <PlanetTable rows={m.rows} />
        </Panel>
        </div>
        <div class="p1-col">
        <Panel id="d9" title="page1.navamsha">
          <EastIndianChart
            title={`${t('page1.navamsha')}: ${name}`}
            signs={vargaEntries(m.navamsha, m.rows, m.navamshaAscSign)}
            lagnaSign={m.navamshaAscSign}
            centre={[{ text: 'D9', size: 64, display: true }]}
            maxFont={44} minFont={16}
          />
        </Panel>
        <Panel id="dasha" title="page1.vimshottari">
          <DashaList mahas={m.mahas} zoneHours={zoneHours} nowJd={nowJd} />
        </Panel>
        <Panel id="strengths" title="page1.strengths">
          <p class="pending">{t('page1.strengthsPending')}</p>
        </Panel>
        </div>
      </div>
      <HowComputed chart={chart} />
    </article>
  );
}

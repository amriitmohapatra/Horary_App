/**
 * Dashas (slice 4): the six-level Vimshottari tree, PL's dasha table for the
 * selected period, the chain running on any date, "jump to the next period of
 * a planet", and the dasha-year switch (PL offers 365.2421875 — labelled
 * 365.25 in PL — 360 and 327.85; Kala Chakra uses a true 365.25).
 */
import { useEffect, useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { DASHA_YEARS, type ChartResult } from '../../engine';
import { chainAt, LEVEL_NAMES, mahadashas, nextPeriodOf, type DashaPeriod } from '../../engine/dasha/vimshottari';
import { PLANET_NAMES } from '../../engine/names';
import { julianDay } from '../../engine/time/julian';
import { VIM_ORDER } from '../../engine/zodiac';
import type { PlanetId } from '../../engine/types';
import { DashaTree, keyOf } from '../components/DashaTree';
import { PlDashaTable } from '../components/PlDashaTable';
import { t } from '../i18n';
import { civilDate, civilTime, pad2 } from '../format';
import { overrides, setOverride } from '../state/store';

const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };

function pathKeys(path: DashaPeriod[]): string[] { return path.map(keyOf); }

export function Dashas({ chart }: { chart: ChartResult }): JSX.Element {
  const zone = chart.input.tzHours + chart.input.dstHours;
  const yearDays = chart.profile.dashaYearDays;
  const moon = chart.profile.dashaMoon === 'exact' ? chart.bodies.Mo.lonDeg : chart.bodies.Mo.lon / 3600;
  const mahas = useMemo(() => mahadashas(moon, chart.moment.jdUT, yearDays), [moon, chart.moment.jdUT, yearDays]);

  const [cursorIso, setCursorIso] = useState(todayIso());
  const cursorJd = useMemo(() => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cursorIso);
    return m ? julianDay(+m[1]!, +m[2]!, +m[3]!, 12 - zone) : chart.moment.jdUT;
  }, [cursorIso, zone, chart.moment.jdUT]);
  const running = useMemo(() => chainAt(mahas, cursorJd, 6), [mahas, cursorJd]);

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<DashaPeriod | null>(null);
  const [showTimes, setShowTimes] = useState(false);
  const [jumpLord, setJumpLord] = useState<PlanetId>('Su');
  const [jumpLevel, setJumpLevel] = useState(2);
  const [jumpMiss, setJumpMiss] = useState(false);

  // Open the path to the cursor down to Pratyantar, and select the running Antar (PL's default table).
  useEffect(() => {
    setExpanded(new Set(pathKeys(running.slice(0, 2))));
    setSelected(running[1] ?? running[0] ?? null);
  }, [running]);

  const toggle = (k: string) => setExpanded((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const jump = () => {
    const path = nextPeriodOf(mahas, jumpLevel, jumpLord, cursorJd);
    setJumpMiss(!path);
    if (!path) return;
    setExpanded((s) => new Set([...s, ...pathKeys(path.slice(0, -1))]));
    setSelected(path[path.length - 1]!);
  };
  const fmt = (jd: number) => civilDate(jd, zone) + (showTimes ? ` ${civilTime(jd, zone)}` : '');
  const fmtT = (jd: number) => `${civilDate(jd, zone)} ${civilTime(jd, zone)}`;
  const tableParent = selected && selected.lords.length < 6 ? selected : running[1] ?? mahas[0]!;

  return (
    <article class="dashas" data-testid="dashas-page">
      <section class="panel dasha-controls" aria-label={t('dasha.controls')}>
        <div class="panel-body controls-row">
          <div class="field">
            <label for="d-cursor">{t('dasha.cursor')}</label>
            <span class="inline">
              <input id="d-cursor" type="date" value={cursorIso} onInput={(e) => setCursorIso(e.currentTarget.value)} />
              <button type="button" class="btn btn-small" onClick={() => setCursorIso(todayIso())}>{t('page1.dashaToday')}</button>
            </span>
          </div>
          <div class="field">
            <label for="d-jump-lord">{t('dasha.jump')}</label>
            <span class="inline">
              <select id="d-jump-lord" value={jumpLord} onChange={(e) => setJumpLord(e.currentTarget.value as PlanetId)}>
                {VIM_ORDER.map((p) => <option key={p} value={p}>{PLANET_NAMES[p]}</option>)}
              </select>
              <select aria-label={t('dasha.level')} value={jumpLevel} onChange={(e) => setJumpLevel(+e.currentTarget.value)}>
                {LEVEL_NAMES.map((n, i) => <option key={n} value={i}>{n}</option>)}
              </select>
              <button type="button" class="btn btn-small" onClick={jump}>{t('dasha.go')}</button>
            </span>
            {jumpMiss && <small class="error" role="alert">{t('dasha.jumpNone')}</small>}
          </div>
          <div class="field">
            <label for="d-year">{t('dasha.year')}</label>
            <select id="d-year" value={String(yearDays)}
              onChange={(e) => { const v = +e.currentTarget.value; setOverride('dashaYearDays', v); }}>
              {DASHA_YEARS.map((y) => <option key={y} value={String(y)}>{t(`dasha.year.${String(y).replace('.', '_')}` as never)}</option>)}
            </select>
            {overrides.value.dashaYearDays !== undefined && <small class="hint">{t('dasha.yearOverride')}</small>}
          </div>
          <label class="check"><input type="checkbox" checked={showTimes} onChange={(e) => setShowTimes(e.currentTarget.checked)} /> {t('dasha.showTimes')}</label>
        </div>
      </section>

      <section class="panel running-chain" aria-labelledby="h-running">
        <header class="panel-head"><h2 id="h-running">{t('dasha.runningOn', { date: civilDate(cursorJd, zone) })}</h2></header>
        <div class="panel-body">
          <ol class="chain-steps" data-testid="running-chain">
            {running.map((p, i) => (
              <li key={i}>
                <span class="chain-level">{LEVEL_NAMES[i]}</span>
                <span class={`pl pl-${p.lords[i]}`}>{PLANET_NAMES[p.lords[i]!]}</span>
                {/* Prana and Deha last hours to days: always show the time */}
                <span class="num">{i >= 4 ? `${fmtT(p.start)} → ${fmtT(p.end)}` : `${fmt(p.start)} → ${fmt(p.end)}`}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div class="dasha-grid">
        <section class="panel" aria-labelledby="h-tree">
          <header class="panel-head"><h2 id="h-tree">{t('dasha.tree')}</h2></header>
          <div class="panel-body">
            <DashaTree mahas={mahas} zoneHours={zone} yearDays={yearDays} cursorJd={cursorJd} showTimes={showTimes}
              expanded={expanded} onToggle={toggle} selected={selected ? keyOf(selected) : null} onSelect={setSelected} />
          </div>
        </section>
        <section class="panel" aria-labelledby="h-pltable">
          <header class="panel-head"><h2 id="h-pltable">{t('dasha.plTable')}</h2></header>
          <div class="panel-body">
            <PlDashaTable parent={tableParent} chartJd={chart.moment.jdUT} zoneHours={zone} showTimes={showTimes} />
            <p class="hint-text">{t('dasha.plTableHint')}</p>
          </div>
        </section>
      </div>
    </article>
  );
}

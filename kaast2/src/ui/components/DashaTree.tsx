/**
 * Six-level Vimshottari tree (Maha → Deha). Children are computed only when
 * a node is opened. The path to the cursor date opens by default and is
 * highlighted; "Jump" opens the path to a target period and focuses it.
 */
import { useEffect, useMemo, useRef } from 'preact/hooks';
import type { JSX } from 'preact';
import { LEVEL_NAMES, subperiods, spanYMD, type DashaPeriod } from '../../engine/dasha/vimshottari';
import { PLANET_NAMES } from '../../engine/names';
import { t } from '../i18n';
import { civilDate, civilTime } from '../format';

export const keyOf = (p: DashaPeriod) => p.lords.join('-');

interface TreeProps {
  mahas: DashaPeriod[];
  zoneHours: number;
  yearDays: number;
  cursorJd: number;
  showTimes: boolean;
  expanded: Set<string>;
  onToggle: (key: string) => void;
  selected: string | null;
  onSelect: (p: DashaPeriod) => void;
}

function Row({ p, level, props }: { p: DashaPeriod; level: number; props: TreeProps }): JSX.Element {
  const key = keyOf(p);
  const open = props.expanded.has(key);
  const running = p.start <= props.cursorJd && props.cursorJd < p.end;
  const isSel = props.selected === key;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (isSel) ref.current?.scrollIntoView({ block: 'nearest' }); }, [isSel]);
  const kids = useMemo(() => (open && level < 5 ? subperiods(p) : []), [open, p, level]);
  const span = spanYMD(p.end - p.start, props.yearDays);
  const fmt = (jd: number) => civilDate(jd, props.zoneHours) + (props.showTimes ? ` ${civilTime(jd, props.zoneHours)}` : '');
  const lord = p.lords[level]!;
  return (
    <li role="treeitem" aria-level={level + 1} aria-expanded={level < 5 ? open : undefined} aria-selected={isSel}>
      <div ref={ref} class={`dt-row lvl${level}${running ? ' running' : ''}${isSel ? ' selected' : ''}`}
        style={{ '--lvl': level } as JSX.CSSProperties}>
        {level < 5
          ? <button type="button" class="dt-toggle" aria-label={`${open ? t('dasha.collapse') : t('dasha.expand')} ${key}`}
              onClick={() => props.onToggle(key)}>{open ? '▾' : '▸'}</button>
          : <span class="dt-toggle" aria-hidden="true" />}
        <button type="button" class="dt-name" onClick={() => props.onSelect(p)} title={LEVEL_NAMES[level]}>
          {p.lords.map((l, i) => <span key={i} class={i === level ? `pl pl-${l}` : 'dt-parent'}>{i ? '-' : ''}{l}</span>)}
          <span class="dt-full">{PLANET_NAMES[lord]}</span>
        </button>
        <span class="num dt-start">{fmt(p.start)}</span>
        <span class="num dt-end">{fmt(p.end)}</span>
        <span class="num dt-span">{span.y}y {span.m}m {span.d}d</span>
      </div>
      {kids.length > 0 && (
        <ul role="group">
          {kids.map((c) => <Row key={keyOf(c)} p={c} level={level + 1} props={props} />)}
        </ul>
      )}
    </li>
  );
}

export function DashaTree(props: TreeProps): JSX.Element {
  return (
    <div class={`dasha-tree${props.showTimes ? " times" : ""}`} data-testid="dasha-tree">
      <div class="dt-head" aria-hidden="true">
        <span /><span>{t('col.period')}</span><span>{t('col.begins')}</span><span>{t('col.ends')}</span><span>{t('col.length')}</span>
      </div>
      <ul role="tree" aria-label={t('dasha.tree')}>
        {props.mahas.map((m) => <Row key={keyOf(m)} p={m} level={0} props={props} />)}
      </ul>
    </div>
  );
}

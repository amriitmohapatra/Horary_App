/**
 * The prospective match's birth details, shared by the Matching and NTP
 * pages: a one-line summary with "Change", or the chart form (its own ids).
 * The partner chart is never saved by the app; "Save chart" in the form
 * downloads it as a file like any chart.
 */
import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { Signal } from '@preact/signals';
import type { ChartInput } from '../../engine';
import { ChartForm } from './ChartForm';
import { hms, longDate } from '../format';

export function chartSummary(i: ChartInput): string {
  return `${i.name || 'Unnamed'} · ${longDate(i.date.y, i.date.m, i.date.d)} ${hms(i.time.h, i.time.mi, i.time.s)} · ${i.place.name}`;
}

export function PartnerEntry({ target, prefix, title, empty }: { target: Signal<ChartInput | null>; prefix: string; title: string; empty: string }): JSX.Element {
  const [open, setOpen] = useState(false);
  const v = target.value;
  if (open || !v) {
    return (
      <div class="partner-entry" data-testid={`${prefix}-entry`}>
        {!v && !open && <p class="muted">{empty}</p>}
        {!v && !open
          ? <button type="button" class="btn btn-primary" onClick={() => setOpen(true)}>{title}</button>
          : (
            <>
              <ChartForm target={target} prefix={prefix} label={title} onDone={() => setOpen(false)} />
              {v && <button type="button" class="btn btn-quiet" onClick={() => setOpen(false)}>Cancel</button>}
            </>
          )}
      </div>
    );
  }
  return (
    <p class="partner-line" data-testid={`${prefix}-summary`}>
      <span>{chartSummary(v)}</span>
      <button type="button" class="btn btn-small" onClick={() => setOpen(true)}>Change</button>
      <button type="button" class="btn btn-small btn-quiet" onClick={() => { target.value = null; }}>Remove</button>
    </p>
  );
}

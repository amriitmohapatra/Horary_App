/**
 * Time as three 24-hour boxes — hours, minutes, seconds. Native time pickers
 * drop the seconds on iPhone/iPad (and show AM/PM on some systems), so the
 * app never relies on them. Typing two digits moves to the next box; a whole
 * time pasted or typed into Hours ("16:00:37") is spread over the three.
 * Value in and out: "HH:MM:SS" (parts may be empty while typing).
 */
import { useRef } from 'preact/hooks';
import type { JSX } from 'preact';
import { t } from '../i18n';

export function TimeFields(props: {
  id: string; value: string; onChange: (v: string) => void; invalid?: boolean; describedBy?: string; legend: string;
}): JSX.Element {
  const [h = '', m = '', s = ''] = props.value.split(':');
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const parts = [h, m, s];

  const set = (i: number, raw: string) => {
    const whole = /^\s*(\d{1,2})\D+(\d{1,2})(?:\D+(\d{1,2}))?\s*$/.exec(raw);
    if (i === 0 && whole) {
      props.onChange(`${whole[1]!.padStart(2, '0')}:${whole[2]!.padStart(2, '0')}:${(whole[3] ?? '0').padStart(2, '0')}`);
      refs[2].current?.focus();
      return;
    }
    const digits = raw.replace(/\D/g, '').slice(0, 2);
    const next = [...parts];
    next[i] = digits;
    props.onChange(next.join(':'));
    if (digits.length === 2 && i < 2) refs[i + 1]!.current?.focus();
  };

  const labels = [t('time.hours'), t('time.minutes'), t('time.seconds')];
  const ph = ['hh', 'mm', 'ss'];
  return (
    <fieldset class="timefields" aria-describedby={props.describedBy}>
      <legend>{props.legend}</legend>
      <div class="tf-row">
        {parts.map((v, i) => (
          <>
            {i > 0 && <span class="tf-sep" aria-hidden="true">:</span>}
            <input key={i} ref={refs[i]} id={`${props.id}-${['h', 'm', 's'][i]}`} aria-label={labels[i]} value={v}
              inputMode="numeric" autoComplete="off" placeholder={ph[i]} maxLength={i === 0 ? 8 : 2}
              aria-invalid={props.invalid || undefined}
              onInput={(e) => set(i, e.currentTarget.value)}
              onFocus={(e) => e.currentTarget.select()} />
          </>
        ))}
      </div>
      <small class="hint">{t('time.hint')}</small>
    </fieldset>
  );
}

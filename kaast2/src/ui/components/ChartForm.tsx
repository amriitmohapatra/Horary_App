/**
 * Chart input. Errors appear next to the field and never clear what the
 * user typed (guide ch. 17.3). Choosing a place fills lat/lon/zone, and the
 * zone follows historical rules (India war time 1942–45).
 */
import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { PROFILES, type ChartInput, type ProfileId } from '../../engine';
import { allPlaces, savePlace, zoneFor, type Place } from '../../io/places';
import { decodeChartBytes, parseGeoVision, toGeoVision, type ImportedChart } from '../../io/geovision';
import { parseChartFile, toChartFile } from '../../io/chartfile';
import { t, type MessageKey } from '../i18n';
import { longDate, pad2 } from '../format';
import { chartInput, formOpen, lastPlace, nowInput, rememberPlace } from '../state/store';

interface Fields {
  name: string; date: string; time: string; place: string;
  lat: string; lon: string; tz: string; dst: boolean; profile: ProfileId;
}
type Errors = Partial<Record<'date' | 'time' | 'lat' | 'lon' | 'tz', MessageKey>>;

function toFields(i: ChartInput): Fields {
  return {
    name: i.name ?? '',
    date: `${i.date.y}-${pad2(i.date.m)}-${pad2(i.date.d)}`,
    time: `${pad2(i.time.h)}:${pad2(i.time.mi)}:${pad2(i.time.s)}`,
    place: i.place.name, lat: String(i.place.latDeg), lon: String(i.place.lonDeg),
    tz: String(i.tzHours), dst: i.dstHours !== 0, profile: i.profileId,
  };
}

/** The date in words under the field: guards against day/month swaps. */
function dateInWords(date: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  return m ? longDate(+m[1]!, +m[2]!, +m[3]!) : '';
}

function parse(f: Fields): { input?: ChartInput; errors: Errors } {
  const errors: Errors = {};
  const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(f.date);
  const y = dm ? +dm[1]! : NaN;
  if (!dm || y < 1800 || y > 2399) errors.date = 'form.error.date';
  const tm = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(f.time.trim());
  if (!tm || +tm[1]! > 23 || +tm[2]! > 59 || +(tm[3] ?? 0) > 59) errors.time = 'form.error.time';
  const lat = Number(f.lat), lon = Number(f.lon), tz = Number(f.tz);
  if (!Number.isFinite(lat) || Math.abs(lat) > 66.5 || f.lat.trim() === '') errors.lat = 'form.error.lat';
  if (!Number.isFinite(lon) || Math.abs(lon) > 180 || f.lon.trim() === '') errors.lon = 'form.error.lon';
  if (!Number.isFinite(tz) || Math.abs(tz) > 14 || f.tz.trim() === '') errors.tz = 'form.error.tz';
  if (Object.keys(errors).length) return { errors };
  return {
    errors,
    input: {
      name: f.name.trim(),
      date: { y, m: +dm![2]!, d: +dm![3]! },
      time: { h: +tm![1]!, mi: +tm![2]!, s: +(tm![3] ?? 0) },
      tzHours: tz, dstHours: f.dst ? 1 : 0,
      place: { name: f.place.trim() || `${lat}, ${lon}`, latDeg: lat, lonDeg: lon },
      profileId: f.profile,
    },
  };
}

export function ChartForm(): JSX.Element {
  const [f, setF] = useState<Fields>(() => toFields(chartInput.value ?? nowInput(lastPlace())));
  const [errors, setErrors] = useState<Errors>({});
  const [note, setNote] = useState<MessageKey | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [events, setEvents] = useState<ImportedChart['events']>([]);
  const places = allPlaces();

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => setF((o) => ({ ...o, [k]: v }));

  const applyZone = (p: Place, date: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    const z = m ? zoneFor(p, +m[1]!, +m[2]!, +m[3]!) : { tz: p.tz };
    setNote(z.note === 'india_war_time' ? 'form.warTime' : null);
    return String(z.tz);
  };

  const onPlace = (name: string) => {
    const p = places.find((q) => q.name.toLowerCase() === name.trim().toLowerCase());
    if (!p) { set('place', name); return; }
    setF((o) => ({ ...o, place: p.name, lat: String(p.lat), lon: String(p.lon), tz: applyZone(p, o.date) }));
  };

  const onDate = (date: string) => {
    const p = places.find((q) => q.name.toLowerCase() === f.place.trim().toLowerCase());
    setF((o) => ({ ...o, date, ...(p ? { tz: applyZone(p, date) } : {}) }));
  };

  const submit = (e: Event) => {
    e.preventDefault();
    const r = parse(f);
    setErrors(r.errors);
    if (!r.input) return;
    const p = places.find((q) => q.name === r.input!.place.name);
    rememberPlace(p ?? { name: r.input.place.name, lat: r.input.place.latDeg, lon: r.input.place.lonDeg, tz: r.input.tzHours });
    chartInput.value = r.input;
    formOpen.value = false;
  };

  const now = () => {
    const p = places.find((q) => q.name === f.place) ?? lastPlace();
    const i = nowInput(p);
    i.profileId = f.profile;
    setF(toFields(i));
    setErrors({});
    chartInput.value = i;
    formOpen.value = false;
  };

  const castInput = (i: ChartInput) => {
    setF(toFields(i));
    setErrors({});
    chartInput.value = i;
    formOpen.value = false;
  };

  const onOpenFile = async (file: File | undefined) => {
    if (!file) return;
    setFileError(null);
    setEvents([]);
    try {
      const text = decodeChartBytes(new Uint8Array(await file.arrayBuffer()));
      if (/\.json$/i.test(file.name) || text.trimStart().startsWith('{')) {
        castInput(parseChartFile(text));
      } else {
        const imported = parseGeoVision(text, f.profile);
        setEvents(imported.events);
        castInput(imported.input);
      }
    } catch (err) {
      setFileError(err instanceof Error ? err.message : String(err));
    }
  };

  const download = (name: string, text: string, type: string) => {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const fileStem = () => (f.name.trim() || 'chart').replace(/[^\p{L}\p{N} _-]+/gu, '').trim() || 'chart';
  const onSave = (kind: 'json' | 'pl') => {
    const r = parse(f);
    setErrors(r.errors);
    if (!r.input) return;
    if (kind === 'json') download(`${fileStem()}.kaast2.json`, toChartFile(r.input), 'application/json');
    else download(`${fileStem()}.xml`, toGeoVision(r.input), 'application/xml');
  };

  const onSavePlace = () => {
    const ok = savePlace({ name: f.place, lat: Number(f.lat), lon: Number(f.lon), tz: Number(f.tz) });
    setNote(ok ? 'form.placeSaved' : null);
  };

  const field = (id: keyof Errors | 'name' | 'place', label: MessageKey, input: JSX.Element, hint?: MessageKey) => {
    const err = (errors as Record<string, MessageKey | undefined>)[id];
    return (
      <div class={`field field-${id}`}>
        <label for={`f-${id}`}>{t(label)}</label>
        {input}
        {hint && !err && <small id={`h-${id}`} class="hint">{t(hint)}</small>}
        {err && <small id={`e-${id}`} class="error" role="alert">{t(err)}</small>}
      </div>
    );
  };
  const desc = (id: string, hint = false) =>
    (errors as Record<string, unknown>)[id] ? `e-${id}` : hint ? `h-${id}` : undefined;

  return (
    <form class="chart-form" onSubmit={submit} novalidate aria-label={t('form.title')}>
      {field('name', 'form.name',
        <input id="f-name" value={f.name} placeholder={t('form.name.placeholder')} onInput={(e) => set('name', e.currentTarget.value)} />)}
      {field('date', 'form.date',
        <>
          <input id="f-date" type="date" min="1800-01-01" max="2399-12-31" value={f.date} aria-invalid={!!errors.date}
            aria-describedby={errors.date ? 'e-date' : 'h-date'} onInput={(e) => onDate(e.currentTarget.value)} />
          {!errors.date && <small id="h-date" class="hint date-echo">{dateInWords(f.date)}</small>}
        </>)}
      {field('time', 'form.time',
        <input id="f-time" type="time" step={1} value={f.time} aria-invalid={!!errors.time}
          aria-describedby={desc('time')} onInput={(e) => set('time', e.currentTarget.value)} />)}
      {field('place', 'form.place',
        <>
          <input id="f-place" list="kaast2-places" value={f.place} placeholder={t('form.place.placeholder')}
            autocomplete="off" onChange={(e) => onPlace(e.currentTarget.value)} onInput={(e) => onPlace(e.currentTarget.value)} />
          <datalist id="kaast2-places">{places.map((p) => <option key={p.name} value={p.name} />)}</datalist>
        </>)}
      {field('lat', 'form.lat',
        <input id="f-lat" inputMode="decimal" value={f.lat} aria-invalid={!!errors.lat}
          aria-describedby={desc('lat', true)} onInput={(e) => set('lat', e.currentTarget.value)} />, 'form.lat.hint')}
      {field('lon', 'form.lon',
        <input id="f-lon" inputMode="decimal" value={f.lon} aria-invalid={!!errors.lon}
          aria-describedby={desc('lon', true)} onInput={(e) => set('lon', e.currentTarget.value)} />, 'form.lon.hint')}
      {field('tz', 'form.tz',
        <input id="f-tz" inputMode="decimal" value={f.tz} aria-invalid={!!errors.tz}
          aria-describedby={desc('tz')} onInput={(e) => set('tz', e.currentTarget.value)} />)}
      <div class="field field-dst">
        <label class="check"><input type="checkbox" checked={f.dst} onChange={(e) => set('dst', e.currentTarget.checked)} /> {t('form.dst')}</label>
      </div>
      <div class="field field-profile">
        <label for="f-profile">{t('form.profile')}</label>
        <select id="f-profile" value={f.profile} onChange={(e) => set('profile', e.currentTarget.value as ProfileId)}>
          {Object.values(PROFILES).map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">{t('form.cast')}</button>
        <button type="button" class="btn" onClick={now}>{t('form.now')}</button>
        <button type="button" class="btn btn-quiet" onClick={onSavePlace}>{t('form.savePlace')}</button>
        <span class="spacer" />
        <label class="btn btn-quiet file-btn">
          {t('file.open')}
          <input type="file" accept=".xml,.json" class="sr-only" onChange={(e) => { void onOpenFile(e.currentTarget.files?.[0]); e.currentTarget.value = ''; }} />
        </label>
        <button type="button" class="btn btn-quiet" onClick={() => onSave('json')}>{t('file.save')}</button>
        <button type="button" class="btn btn-quiet" onClick={() => onSave('pl')}>{t('file.savePl')}</button>
      </div>
      {fileError && <p class="form-note error" role="alert">{fileError}</p>}
      {events.length > 0 && (
        <p class="form-note">{t('file.events')}{' '}
          {events.map((ev) => <button key={ev.name} type="button" class="btn btn-small" onClick={() => castInput(ev.input)}>{ev.name}</button>)}
        </p>
      )}
      {note && <p class="form-note" role="status">{t(note)}</p>}
    </form>
  );
}

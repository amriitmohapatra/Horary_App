/**
 * Saved places: add, edit and delete places with their coordinates and zone,
 * and export/import them as a file — to keep a copy, or to move them between
 * phone and computer (each browser keeps its own list).
 */
import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { BUILTIN_PLACES, deletePlace, exportPlaces, importPlaces, parseCoord, savedPlaces, savePlace, type Place } from '../../io/places';
import { t, type MessageKey } from '../i18n';
import { pad2, zone as fmtZone } from '../format';

function dms(v: number, pos: string, neg: string): string {
  let s = Math.round(Math.abs(v) * 3600);
  const d = Math.floor(s / 3600); s -= d * 3600;
  return `${d}°${pad2(Math.floor(s / 60))}′${pad2(s % 60)}″ ${v >= 0 ? pos : neg}`;
}

interface Draft { name: string; lat: string; lon: string; tz: string }
const EMPTY: Draft = { name: '', lat: '', lon: '', tz: '5.5' };

export function PlacesManager(): JSX.Element {
  const [list, setList] = useState<Place[]>(savedPlaces);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, MessageKey>>>({});
  const [confirm, setConfirm] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const refresh = () => setList(savedPlaces());

  const submit = (e: Event) => {
    e.preventDefault();
    const lat = parseCoord(draft.lat, 'lat'), lon = parseCoord(draft.lon, 'lon'), tz = Number(draft.tz);
    const err: typeof errors = {};
    if (!draft.name.trim()) err.name = 'places.error.name';
    if (lat === null) err.lat = 'places.error.lat';
    if (lon === null) err.lon = 'places.error.lon';
    if (!Number.isFinite(tz) || Math.abs(tz) > 14 || draft.tz.trim() === '') err.tz = 'form.error.tz';
    setErrors(err);
    if (Object.keys(err).length) return;
    if (editing && editing.toLowerCase() !== draft.name.trim().toLowerCase()) deletePlace(editing);
    const ok = savePlace({ name: draft.name.trim(), lat: lat!, lon: lon!, tz });
    setNote(ok ? t(editing ? 'places.updated' : 'places.added', { name: draft.name.trim() }) : t('places.storageFailed'));
    setDraft(EMPTY); setEditing(null); refresh();
  };

  const edit = (p: Place) => {
    setEditing(p.name); setErrors({}); setNote(null);
    setDraft({ name: p.name, lat: String(p.lat), lon: String(p.lon), tz: String(p.tz) });
  };

  const onExport = () => {
    const url = URL.createObjectURL(new Blob([exportPlaces()], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'astro-amriit-places.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNote(typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window ? t('file.savedDesktop') : t('places.exported', { n: list.length }));
  };
  const onImport = async (file: File | undefined) => {
    if (!file) return;
    try { const n = importPlaces(await file.text()); setNote(t('places.imported', { n })); refresh(); }
    catch (err) { setNote(err instanceof Error ? err.message : String(err)); }
  };

  const field = (k: keyof Draft, label: MessageKey, hint?: MessageKey) => (
    <div class={`field pm-${k}`}>
      <label for={`pm-${k}`}>{t(label)}</label>
      <input id={`pm-${k}`} value={draft[k]} autoComplete="off" aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `pm-e-${k}` : hint ? `pm-h-${k}` : undefined}
        onInput={(e) => setDraft((d) => ({ ...d, [k]: e.currentTarget.value }))} />
      {errors[k] ? <small id={`pm-e-${k}`} class="error" role="alert">{t(errors[k]!)}</small>
        : hint && <small id={`pm-h-${k}`} class="hint">{t(hint)}</small>}
    </div>
  );

  return (
    <section class="panel" aria-labelledby="h-places" data-testid="places-manager">
      <header class="panel-head"><h2 id="h-places">{t('places.title')}</h2></header>
      <div class="panel-body">
        <p class="hint-text">{t('places.intro')}</p>
        <form class="places-form" onSubmit={submit} novalidate aria-label={t(editing ? 'places.editTitle' : 'places.addTitle')}>
          {field('name', 'form.place')}
          {field('lat', 'form.lat', 'form.lat.hint')}
          {field('lon', 'form.lon', 'form.lon.hint')}
          {field('tz', 'form.tz')}
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">{t(editing ? 'places.saveChanges' : 'places.add')}</button>
            {editing && <button type="button" class="btn btn-quiet" onClick={() => { setEditing(null); setDraft(EMPTY); setErrors({}); }}>{t('places.cancel')}</button>}
          </div>
        </form>
        {note && <p class="form-note" role="status">{note}</p>}

        {list.length ? (
          <div class="table-wrap">
            <table class="data" data-testid="places-table">
              <caption class="sr-only">{t('places.title')}</caption>
              <thead><tr><th scope="col">{t('form.place')}</th><th scope="col">{t('form.lat')}</th><th scope="col">{t('form.lon')}</th><th scope="col">{t('places.zone')}</th><th scope="col"><span class="sr-only">{t('places.actions')}</span></th></tr></thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.name}>
                    <th scope="row">{p.name}</th>
                    <td class="num">{dms(p.lat, 'N', 'S')}</td>
                    <td class="num">{dms(p.lon, 'E', 'W')}</td>
                    <td class="num">UTC{fmtZone(p.tz)}</td>
                    <td class="row-actions">
                      {confirm === p.name ? (
                        <>
                          <span>{t('places.confirm', { name: p.name })}</span>
                          <button type="button" class="btn btn-small" onClick={() => { deletePlace(p.name); setConfirm(null); setNote(t('places.deleted', { name: p.name })); refresh(); }}>{t('places.yesDelete')}</button>
                          <button type="button" class="btn btn-small btn-quiet" onClick={() => setConfirm(null)}>{t('places.cancel')}</button>
                        </>
                      ) : (
                        <>
                          <button type="button" class="btn btn-small" aria-label={t('places.editOne', { name: p.name })} onClick={() => edit(p)}>{t('places.edit')}</button>
                          <button type="button" class="btn btn-small btn-quiet" aria-label={t('places.deleteOne', { name: p.name })} onClick={() => setConfirm(p.name)}>{t('places.delete')}</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p class="pending">{t('places.empty')}</p>}

        <div class="form-actions places-io">
          <button type="button" class="btn" onClick={onExport} disabled={!list.length}>{t('places.export')}</button>
          <label class="btn file-btn">
            {t('places.import')}
            <input type="file" accept=".json" class="sr-only" onChange={(e) => { void onImport(e.currentTarget.files?.[0]); e.currentTarget.value = ''; }} />
          </label>
        </div>
        <details class="builtin-places">
          <summary>{t('places.builtin', { n: BUILTIN_PLACES.length })}</summary>
          <p class="hint-text">{BUILTIN_PLACES.map((p) => p.name).join(' · ')}</p>
        </details>
      </div>
    </section>
  );
}

/**
 * Parashara's Light (GeoVision) chart files, `*.xml` (ADR-6).
 * Format (read from the boss's PL chart collection):
 *  - ASCII with CRLF, or UTF-16LE with a BOM (both occur);
 *  - <BirthDate> is the Julian Day of the LOCAL clock time, not UT;
 *  - <Longitude> is west-positive, <TimeZone> is hours WEST of Greenwich
 *    (India = −5.5); <DST> holds the extra hour (India's 1942–45 war time is
 *    stored as DST 1);
 *  - <Events> hold further charts for the same person (Today, Muhurta, …).
 * KAAST 2 uses east-positive longitude and zones; this module converts both ways.
 * Pure (no DOM), so it runs in tests and in the app alike.
 */
import { DEFAULT_PROFILE, type ChartInput, type ProfileId } from '../engine';
import { fromJulianDay, julianDay } from '../engine/time/julian';

export interface ImportedChart { input: ChartInput; events: { name: string; input: ChartInput }[] }

export function decodeChartBytes(bytes: Uint8Array): string {
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder('utf-16le').decode(bytes.subarray(2));
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder('utf-16be').decode(bytes.subarray(2));
  return new TextDecoder('utf-8').decode(bytes);
}

const tag = (xml: string, name: string): string | undefined => {
  const m = new RegExp(`<${name}>([^<]*)</${name}>`).exec(xml);
  return m ? m[1]!.trim() : undefined;
};
const num = (xml: string, name: string): number => {
  const v = Number(tag(xml, name));
  if (!Number.isFinite(v)) throw new Error(`chart file: <${name}> is missing or not a number`);
  return v;
};

function blockToInput(xml: string, dateTag: string, name: string, profileId: ProfileId): ChartInput {
  const c = fromJulianDay(num(xml, dateTag));
  const city = tag(xml, 'City') ?? '', country = tag(xml, 'Country') ?? '';
  return {
    name,
    date: { y: c.y, m: c.m, d: c.d },
    time: { h: c.h, mi: c.mi, s: c.s },
    tzHours: -num(xml, 'TimeZone'),
    dstHours: num(xml, 'DST'),
    place: { name: [city, country].filter(Boolean).join(', '), latDeg: num(xml, 'Latitude'), lonDeg: -num(xml, 'Longitude') },
    profileId,
  };
}

export function parseGeoVision(text: string, profileId: ProfileId = DEFAULT_PROFILE): ImportedChart {
  if (!/<BirthData>/.test(text)) throw new Error('This is not a Parashara\'s Light chart file (no <BirthData>).');
  const info = /<BirthInfo>([\s\S]*?)<\/BirthInfo>/.exec(text)?.[1];
  if (!info) throw new Error('chart file: <BirthInfo> is missing');
  const name = [tag(info, 'FirstName'), tag(info, 'LastName')].filter(Boolean).join(' ');
  const input = blockToInput(info, 'BirthDate', name, profileId);
  const events: ImportedChart['events'] = [];
  for (const m of text.matchAll(/<Event\b[^>]*>([\s\S]*?)<\/Event>/g)) {
    const ev = m[1]!;
    try {
      const evName = tag(ev, 'Name') ?? 'Event';
      const evInput = blockToInput(ev, 'Date', `${name} — ${evName}`, profileId);
      if (!evInput.place.name) evInput.place = { ...input.place, latDeg: evInput.place.latDeg, lonDeg: evInput.place.lonDeg };
      events.push({ name: evName, input: evInput });
    } catch { /* an incomplete event does not spoil the birth chart */ }
  }
  return { input, events };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const f6 = (x: number) => x.toFixed(6);

/** Write a chart in PL's format (ASCII, CRLF) so PL can open it. */
export function toGeoVision(input: ChartInput): string {
  const { date, time } = input;
  const jdLocal = julianDay(date.y, date.m, date.d, time.h + time.mi / 60 + time.s / 3600);
  const [first, ...rest] = (input.name ?? '').split(' ');
  const [city, ...country] = input.place.name.split(',').map((s) => s.trim());
  return [
    '<!DOCTYPE BirthData>',
    '<BirthData>',
    ` <BirthInfo><FirstName>${esc(first ?? '')}</FirstName>`,
    `  <LastName>${esc(rest.join(' '))}</LastName>`,
    '  <Anka>0</Anka>',
    '  <Gender>0</Gender>',
    `  <BirthDate>${f6(jdLocal)}</BirthDate>`,
    `  <Longitude>${f6(-input.place.lonDeg)}</Longitude>`,
    `  <Latitude>${f6(input.place.latDeg)}</Latitude>`,
    `  <TimeZone>${f6(-input.tzHours)}</TimeZone>`,
    `  <DST>${f6(input.dstHours)}</DST>`,
    `  <City>${esc(city ?? '')}</City>`,
    '  <State></State>',
    `  <Country>${esc(country.join(', '))}</Country>`,
    '  <BDLoopUpMode>D</BDLoopUpMode>',
    '  <RoddenRating>0</RoddenRating>',
    ' </BirthInfo>',
    ' <Events></Events>',
    '</BirthData>',
    '',
  ].join('\r\n');
}

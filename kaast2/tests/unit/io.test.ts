// prepublish-synthetic-charts: the PL-format samples below are a public celebrity chart.
import { describe, expect, it } from 'vitest';
import { decodeChartBytes, parseGeoVision, toGeoVision } from '../../src/io/geovision';
import { parseChartFile, toChartFile } from '../../src/io/chartfile';

// A synthetic PL chart file with the structure PL writes (values are those of a public chart).
const SAMPLE = [
  '<!DOCTYPE BirthData>', '<BirthData>', // prepublish-ok
  ' <BirthInfo><FirstName>Amitabh</FirstName>', '  <LastName>Bachhan</LastName>',
  '  <BirthDate>2430644.166667</BirthDate>', '  <Longitude>-81.850000</Longitude>', '  <Latitude>25.450000</Latitude>',
  '  <TimeZone>-5.500000</TimeZone>', '  <DST>1.000000</DST>', '  <City>Allahabad</City>', '  <Country>India</Country>',
  ' </BirthInfo>',
  ' <Events><Event Id="1" ><Name>Today</Name>', '   <Date>2452016.021528</Date>', '   <Longitude>-75.816667</Longitude>',
  '   <Latitude>26.916667</Latitude>', '   <TimeZone>-5.500000</TimeZone>', '   <DST>0.000000</DST>', '   <City>Jaipur(Raj)</City>',
  '   <Country>India</Country>', '  </Event>', ' </Events>', '</BirthData>', '',
].join('\r\n');

describe('PL chart files', () => {
  it('reads local-clock JD, west-positive longitude, west-positive zone and war time as DST', () => {
    const { input, events } = parseGeoVision(SAMPLE);
    expect(input.name).toBe('Amitabh Bachhan');
    expect(input.date).toEqual({ y: 1942, m: 10, d: 11 });
    expect(input.time).toEqual({ h: 16, mi: 0, s: 0 });
    expect(input.tzHours + input.dstHours).toBe(6.5);
    expect(input.place).toEqual({ name: 'Allahabad, India', latDeg: 25.45, lonDeg: 81.85 });
    expect(events).toHaveLength(1);
    expect(events[0]!.input.place.lonDeg).toBeCloseTo(75.816667, 6);
  });
  it('decodes UTF-16LE files with a BOM', () => {
    const u16 = new Uint8Array([0xff, 0xfe, ...new Uint8Array(new Uint16Array([...SAMPLE].map((c) => c.charCodeAt(0))).buffer)]);
    expect(parseGeoVision(decodeChartBytes(u16)).input.name).toBe('Amitabh Bachhan');
  });
  it('round-trips through PL format', () => {
    const { input } = parseGeoVision(SAMPLE);
    const again = parseGeoVision(toGeoVision(input)).input;
    expect(again).toEqual(input);
  });
  it('rejects other files with a clear message', () => {
    expect(() => parseGeoVision('<html></html>')).toThrow(/not a Parashara/);
  });
});

describe('Astro-Amriit chart files', () => {
  it('round-trips and validates', () => {
    const { input } = parseGeoVision(SAMPLE);
    expect(parseChartFile(toChartFile(input))).toEqual(input);
    expect(() => parseChartFile('{"format":"astro-amriit-chart","version":1,"input":{}}')).toThrow(/incomplete/);
    // files saved by v0.1 (then called KAAST 2) still open
    expect(parseChartFile(toChartFile(input).replace('astro-amriit-chart', 'kaast2-chart'))).toEqual(input);
    expect(() => parseChartFile('nope')).toThrow(/not JSON/);
  });
});

describe('historical zones', async () => {
  const { zoneFor } = await import('../../src/io/places');
  it('India war time for a built-in place, a typed Indian place (no country), but not abroad', () => {
    expect(zoneFor({ name: 'Allahabad', lat: 25.45, lon: 81.85, tz: 5.5, country: 'IN' }, 1942, 10, 11).tz).toBe(6.5);
    expect(zoneFor({ name: 'My village', lat: 21.2, lon: 84.1, tz: 5.5 }, 1943, 1, 1).tz).toBe(6.5);
    expect(zoneFor({ name: 'Colombo', lat: 6.93, lon: 79.85, tz: 5.5, country: 'LK' }, 1943, 1, 1).tz).toBe(5.5);
    expect(zoneFor({ name: 'My village', lat: 21.2, lon: 84.1, tz: 5.5 }, 1945, 10, 15).tz).toBe(5.5);
  });
});

describe('saved places', async () => {
  const { parseCoord, exportPlaces, importPlaces, savedPlaces, savePlace, deletePlace } = await import('../../src/io/places');
  it('reads coordinates in decimal and degrees-minutes-seconds forms', () => {
    expect(parseCoord('21.7033', 'lat')).toBeCloseTo(21.7033, 6);
    expect(parseCoord('21 42 12 N', 'lat')).toBeCloseTo(21 + 42 / 60 + 12 / 3600, 9);
    expect(parseCoord('21°42′12″N', 'lat')).toBeCloseTo(21.70333, 5);
    expect(parseCoord(`84°01'53"E`, 'lon')).toBeCloseTo(84 + 1 / 60 + 53 / 3600, 9);
    expect(parseCoord('74 0 22 W', 'lon')).toBeCloseTo(-(74 + 22 / 3600), 9);
    expect(parseCoord('S 33 52', 'lat')).toBeCloseTo(-(33 + 52 / 60), 9);
    expect(parseCoord('-0.1278', 'lon')).toBeCloseTo(-0.1278, 6);
    expect(parseCoord('21,7', 'lat')).toBeCloseTo(21.7, 6);
  });
  it('rejects nonsense and wrong hemispheres', () => {
    for (const bad of ['', 'abc', '95', '21 61 N', '21 E', 'N 21 S']) expect([bad, parseCoord(bad, 'lat')]).toEqual([bad, null]);
    expect(parseCoord('84 N', 'lon')).toBeNull();
  });
  it('saves, deletes, exports and imports (merge by name)', () => {
    const store = new Map<string, string>();
    (globalThis as any).localStorage = {
      getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v), removeItem: (k: string) => store.delete(k),
    };
    savePlace({ name: 'Home', lat: 21.7, lon: 84.03, tz: 5.5 });
    savePlace({ name: 'Office', lat: 1.3, lon: 103.8, tz: 8 });
    const backup = exportPlaces();
    deletePlace('home');
    expect(savedPlaces().map((p) => p.name)).toEqual(['Office']);
    expect(importPlaces(backup)).toBe(2);
    expect(savedPlaces().map((p) => p.name).sort()).toEqual(['Home', 'Office']);
    expect(() => importPlaces('{"format":"other"}')).toThrow(/not an Astro-Amriit places file/);
    delete (globalThis as any).localStorage;
  });
});

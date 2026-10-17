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

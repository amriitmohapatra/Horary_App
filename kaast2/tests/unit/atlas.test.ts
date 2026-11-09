import { describe, expect, test } from 'vitest';
import { atlasLabel, atlasSize, atlasToPlace, fold, searchAtlas } from '../../src/io/atlas';
import { BUILTIN_PLACES, zoneFor } from '../../src/io/places';
import { offsetAtLocal, zoneAt } from '../../src/io/zones';

describe('atlas data', () => {
  test('holds the world, India and every Odisha village', () => {
    expect(atlasSize()).toBeGreaterThan(80000);
    const lapanga = searchAtlas('Lapanga, Odisha')[0]!.place;
    expect(atlasLabel(lapanga)).toBe('Lapanga, Odisha, India');
    expect(lapanga.lat).toBeCloseTo(21.70, 1);
    expect(lapanga.lon).toBeCloseTo(84.03, 1);
    expect(lapanga.zone).toBe('Asia/Kolkata');
  });

  test('former names find renamed cities', () => {
    for (const [old, now] of [['Allahabad', 'Prayagraj'], ['Bombay', 'Mumbai'], ['Calcutta', 'Kolkata'], ['Madras', 'Chennai'],
      ['Bangalore', 'Bengaluru'], ['Benares', 'Varanasi'], ['Poona', 'Pune'], ['Trivandrum', 'Thiruvananthapuram']]) {
      const hit = searchAtlas(old)[0]!;
      expect(hit.place.name, old).toBe(now);
      expect(hit.via).toBe(old);
    }
  });

  test('search ignores accents and case; larger places first; a comma narrows by region or country', () => {
    expect(fold('Bhubanēśvar')).toBe('bhubanesvar');
    expect(searchAtlas('bhubaneswar')[0]!.place.region).toBe('Odisha');
    expect(searchAtlas('london')[0]!.place.cc).toBe('GB');
    expect(searchAtlas('london, canada')[0]!.place.cc).toBe('CA');
    const puri = searchAtlas('Puri, Odisha');
    expect(puri.length).toBeGreaterThan(0);
    expect(puri.every((h) => h.place.region === 'Odisha')).toBe(true);
    expect(searchAtlas('x')).toEqual([]);
  });
});

describe('zones from the time-zone database', () => {
  test('daylight saving and wartime clocks outside India', () => {
    expect(zoneAt('America/New_York', 1950, 7, 1)).toEqual({ tz: -5, dst: 1 });
    expect(zoneAt('America/New_York', 1950, 1, 1)).toEqual({ tz: -5, dst: 0 });
    expect(offsetAtLocal('Europe/London', 1943, 7, 1)).toBe(2); // double summer time
    expect(offsetAtLocal('Asia/Singapore', 1942, 6, 1)).toBe(9); // occupation: Tokyo time
    // the 2021 US spring change at 2 am local
    expect(zoneAt('America/New_York', 2021, 3, 14, 1, 30)).toEqual({ tz: -5, dst: 0 });
    expect(zoneAt('America/New_York', 2021, 3, 14, 3, 30)).toEqual({ tz: -5, dst: 1 });
  });

  test('atlas places outside India take the zone for the date', () => {
    const ny = atlasToPlace(searchAtlas('New York City')[0]!.place);
    expect(ny.zone).toBe('America/New_York');
    expect(zoneFor(ny, 1950, 7, 1)).toEqual({ tz: -5, dst: 1, note: 'zone_db' });
    expect(zoneFor(ny, 1950, 12, 1)).toEqual({ tz: -5, dst: 0, note: 'zone_db' });
  });

  test('built-in places outside India follow their zone too (v0.11)', () => {
    const london = BUILTIN_PLACES.find((p) => p.name === 'London')!;
    expect(zoneFor(london, 1960, 7, 1)).toEqual({ tz: 0, dst: 1, note: 'zone_db' });
    expect(zoneFor(london, 1960, 1, 1)).toEqual({ tz: 0, dst: 0, note: 'zone_db' });
    expect(zoneFor(BUILTIN_PLACES.find((p) => p.name === 'Singapore')!, 2001, 3, 21).tz).toBe(8);
  });

  test('Indian atlas places keep the PL-verified rule (IST, war time), not the database history', () => {
    const allahabad = atlasToPlace(searchAtlas('Allahabad')[0]!.place);
    expect(allahabad.country).toBe('IN');
    expect(zoneFor(allahabad, 1942, 10, 11)).toEqual({ tz: 6.5, dst: 0, note: 'india_war_time' });
    expect(zoneFor(allahabad, 1942, 1, 1)).toEqual({ tz: 5.5, dst: 0 }); // the database says +6:30 (Calcutta clocks)
    expect(zoneFor(allahabad, 1861, 5, 6)).toEqual({ tz: 5.5, dst: 0 }); // the database says local mean time
  });
});

/**
 * Facts the voice assistant may speak (docs/specs/voice_agent_plan.md).
 * The agent's language model never computes astrology: it calls these
 * functions as ElevenLabs client tools and narrates what they return.
 *
 * Pure: no DOM, no clock, no network. It repackages what the validated
 * engine already shows on Page 1 (page1Model, bodySummary, Vimshottari) as
 * plain words a voice can read ("Venus", "16 May 2018"), never codes ("Ve").
 * No astrology rule lives here, so the Python twin (kala_chakra) is
 * unaffected. The person's name and birth place are never included.
 */
import { page1Model, type PointRow } from '../../engine/page1';
import { bodySummary, summaryChartOf, type BodySummary } from '../../engine/exp/summary';
import { chainAt, periodsFrom, type DashaPeriod } from '../../engine/dasha/vimshottari';
import { PLANET_NAMES, SIGN_NAMES } from '../../engine/names';
import { fromJulianDay, julianDay } from '../../engine/time/julian';
import { aspectFraction, signCount } from '../../engine/exp/aspects';
import { PLANETS, type ChartResult, type PlanetId, type PointId } from '../../engine/types';
import { SIGN_LORD } from '../../engine/zodiac';

/** Nakshatra names as spoken (PL's full names, with its truncations written out). */
export const NAKSHATRA_SPOKEN = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
] as const;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December'] as const;
const DIGNITY: Record<string, string> = { EX: 'exalted', MT: 'in its moolatrikona sign', OWN: 'in its own sign', DB: 'debilitated' };
const FRACTION: Record<string, string> = { '4/4': 'full', '3/4': 'three-quarter', '1/2': 'half', '1/4': 'quarter' };
const LEVELS = ['Mahadasha', 'Antardasha', 'Pratyantardasha'] as const;

/** Spoken names of the nine grahas, keyed for the tool parameter. */
export const PLANET_BY_WORD: Readonly<Record<string, PlanetId>> = Object.fromEntries(
  PLANETS.map((id) => [PLANET_NAMES[id].toLowerCase(), id]),
);

const name = (id: PointId | string): string => PLANET_NAMES[id as PointId] ?? id;
const sign = (s: number): string => SIGN_NAMES[s]!;
const ordinal = (n: number): string => {
  const t = n % 100;
  return `${n}${t >= 11 && t <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
};

/** Civil date of a Julian Day (UT) in the chart's zone, as spoken: "16 May 2018". */
export function spokenDate(jdUT: number, zoneHours: number): string {
  const c = fromJulianDay(jdUT + zoneHours / 24);
  return `${c.d} ${MONTHS[c.m - 1]} ${c.y}`;
}

export interface VoiceChart {
  chart: ChartResult;
  /** Hours east of UTC used for dates (the chart's zone, as on Page 1). */
  zoneHours: number;
}

export const voiceChart = (chart: ChartResult): VoiceChart =>
  ({ chart, zoneHours: chart.input.tzHours + chart.input.dstHours });

function basis(v: VoiceChart): Record<string, string> {
  return {
    profile: v.chart.profile.label,
    houses: 'whole signs counted from the ascendant sign (as on Page 1)',
    note: 'Facts from the Astro-Amriit engine. Do not add or change any of them.',
  };
}

function pointFacts(r: PointRow): Record<string, unknown> {
  return {
    sign: sign(r.sign),
    degree_in_sign: `${r.deg} degree${r.deg === 1 ? '' : 's'} ${r.min} minute${r.min === 1 ? '' : 's'}`,
    nakshatra: NAKSHATRA_SPOKEN[r.nakshatra],
    pada: r.pada,
    star_lord: name(r.lords[0]!),
    sub_lord: name(r.lords[1]!),
    sub_sub_lord: name(r.lords[2]!),
  };
}

function dashaRow(p: DashaPeriod, level: number, v: VoiceChart): Record<string, string> {
  return {
    level: LEVELS[level] ?? `level ${level + 1}`,
    lords: p.lords.map(name).join(' – '),
    from: spokenDate(p.start, v.zoneHours),
    to: spokenDate(p.end, v.zoneHours),
  };
}

/** Running Maha, Antar and Pratyantar dasha at `jd`. */
export function runningDashas(v: VoiceChart, jd: number): Record<string, string>[] {
  return chainAt(page1Model(v.chart).mahas, jd, 3).map((p, i) => dashaRow(p, i, v));
}

/** Tool get_chart_overview. */
export function chartOverview(v: VoiceChart, nowJd: number): Record<string, unknown> {
  const m = page1Model(v.chart);
  const row = (id: PointId) => m.rows.find((r) => r.id === id)!;
  return {
    basis: basis(v),
    ascendant: pointFacts(row('As')),
    moon: { ...pointFacts(row('Mo')), house: houseOf(row('Mo').sign, m.ascSign) },
    sun: { sign: sign(row('Su').sign), house: houseOf(row('Su').sign, m.ascSign) },
    planets: PLANETS.map((id) => ({ planet: name(id), sign: sign(row(id).sign), house: houseOf(row(id).sign, m.ascSign),
      retrograde: row(id).retrograde })),
    today: spokenDate(nowJd, v.zoneHours),
    running_dashas_today: runningDashas(v, nowJd),
  };
}

const houseOf = (s: number, asc: number): number => ((s - asc + 12) % 12) + 1;

function summaryOf(v: VoiceChart, id: PlanetId): BodySummary {
  return bodySummary(summaryChartOf(v.chart, 'D1', 3), id)!;
}

/** Tool get_planet. `planet` is a spoken name ("Venus"); unknown names return an error object. */
export function planetFacts(v: VoiceChart, planet: string): Record<string, unknown> {
  const id = PLANET_BY_WORD[String(planet ?? '').trim().toLowerCase()];
  if (!id) return { error: `Unknown planet "${planet}". Use one of: ${PLANETS.map(name).join(', ')}.` };
  const r = page1Model(v.chart).rows.find((x) => x.id === id)!;
  const s = summaryOf(v, id);
  return {
    basis: basis(v),
    planet: name(id),
    ...pointFacts(r),
    house: s.house,
    retrograde: r.retrograde,
    combust: r.combust,
    dignity: s.dignity ? DIGNITY[s.dignity] : 'none of exalted, moolatrikona, own or debilitated',
    vargottama: s.vargottama,
    directional_strength: s.digBala,
    rules_houses: s.rules,
    sign_lord: s.dispositor ? { planet: name(s.dispositor.id), house: s.dispositor.house } : null,
    conjunct_with: s.conjunctions.map((c) => ({
      planet: name(c.with), degrees_apart: c.orb === null ? null : Math.round(c.orb * 10) / 10,
      close: c.close, planetary_war: c.war,
    })),
    aspected_by: s.aspectedBy.map((a) => ({ planet: name(a.from), aspect: `${ordinal(a.count)} house aspect`, strength: FRACTION[a.fraction] })),
    full_aspect_on_houses: s.aspectsHouses,
  };
}

/** Tool get_house. `house` is 1…12. */
export function houseFacts(v: VoiceChart, house: number): Record<string, unknown> {
  const h = Math.round(Number(house));
  if (!(h >= 1 && h <= 12)) return { error: `House must be a number from 1 to 12, not "${house}".` };
  const m = page1Model(v.chart);
  const s = (m.ascSign + h - 1) % 12;
  const lord = SIGN_LORD[s]!;
  const occupants = PLANETS.filter((id) => m.rows.find((r) => r.id === id)!.sign === s);
  const lordRow = m.rows.find((r) => r.id === lord)!;
  // Sign-count aspects onto the house's sign (the rule bodySummary uses for planets).
  const aspects = PLANETS.flatMap((id) => {
    const count = signCount(m.rows.find((r) => r.id === id)!.sign, s);
    const f = aspectFraction(id, count);
    return f === '-' ? [] : [{ planet: name(id), aspect: `${ordinal(count)} house aspect`, strength: FRACTION[f] }];
  });
  return {
    basis: basis(v),
    house: h,
    sign: sign(s),
    lord: name(lord),
    lord_placed: { sign: sign(lordRow.sign), house: houseOf(lordRow.sign, m.ascSign) },
    planets_in_house: occupants.map(name),
    aspected_by: aspects,
  };
}

/**
 * Tool get_dashas. `date` is "YYYY-MM-DD" (civil date in the chart's zone,
 * noon) or empty for today. Returns the running periods and the next
 * `count` antardashas.
 */
export function dashaFacts(v: VoiceChart, nowJd: number, date?: string, count = 6): Record<string, unknown> {
  let jd = nowJd;
  if (date && String(date).trim()) {
    const mt = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(date).trim());
    if (!mt) return { error: `Date must look like 2027-03-15, not "${date}".` };
    const [y, mo, d] = [Number(mt[1]), Number(mt[2]), Number(mt[3])];
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return { error: `Date "${date}" is not a calendar date.` };
    jd = julianDay(y, mo, d, 12 - v.zoneHours); // local noon
  }
  const mahas = page1Model(v.chart).mahas;
  const n = Math.max(1, Math.min(12, Math.round(Number(count) || 6)));
  return {
    basis: { ...basis(v), dasha_year_days: String(v.chart.profile.dashaYearDays) },
    date: spokenDate(jd, v.zoneHours),
    running: runningDashas(v, jd),
    next_antardashas: periodsFrom(mahas, 1, jd, n + 1).slice(1).map((p) => dashaRow(p, 1, v)),
  };
}

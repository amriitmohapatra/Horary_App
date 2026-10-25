/** The descriptive Compatibility reports: details, charts, Moon chart, Navamsha and Dashas of both. */
import { useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChartResult } from '../../../engine';
import { page1Model } from '../../../engine/page1';
import { panchanga } from '../../../engine/panchanga/panchanga';
import { julianDay } from '../../../engine/time/julian';
import { NAKSHATRA_NAMES, PLANET_NAMES } from '../../../engine/names';
import { SIGNS, signIndex, nakshatraIndex, pada, dmsInSign } from '../../../engine/zodiac';
import { nakshatraLord } from '../../../engine/yogi/yogi';
import { EastIndianChart } from '../../components/EastIndianChart';
import { PlanetTable } from '../../components/PlanetTable';
import { DashaList } from '../../components/DashaList';
import { rasiEntries, vargaEntries } from '../../chartEntries';
import { coords, dms, hms, longDate, zone } from '../../format';
import { engine } from '../../state/store';
import type { Pair } from '../Matching';
import { GANA_NAMES, NADI_NAMES, RAJJU_NAMES, VARNA_NAMES, VASHYA_NAMES, YONI_NAMES, ganaOf, kootaPerson, nadiOf, rajjuOf, varnaOf, vashyaOf, yoniOf } from '../../../engine/match/kootas';
import { PADA_SYLLABLES } from '../../../engine/names';
import { SIGN_LORD } from '../../../engine/zodiac';

const who = (pair: Pair, c: ChartResult) => (c === pair.boy ? 'Boy' : 'Girl');
const nameOf = (pair: Pair, c: ChartResult) => c.input.name || who(pair, c);

function Side({ pair, children, id }: { pair: Pair; id: string; children: (c: ChartResult) => JSX.Element }): JSX.Element {
  return (
    <div class="match-pair">
      {[pair.boy, pair.girl].map((c, i) => (
        <section key={i} class="panel" aria-labelledby={`h-${id}-${i}`}>
          <header class="panel-head"><h2 id={`h-${id}-${i}`}>{who(pair, c)}{c.input.name ? `: ${c.input.name}` : ''}</h2></header>
          <div class="panel-body">{children(c)}</div>
        </section>
      ))}
    </div>
  );
}

/** Vimshottari balance at birth, years-months-days (the first period's remainder). */
function balance(c: ChartResult): string {
  const first = page1Model(c).mahas[0]!;
  const days = first.end - c.moment.jdUT;
  const y = Math.floor(days / c.profile.dashaYearDays), rem = days - y * c.profile.dashaYearDays;
  const m = Math.floor(rem / (c.profile.dashaYearDays / 12)), d = Math.floor(rem - m * (c.profile.dashaYearDays / 12));
  return `${PLANET_NAMES[first.lords[0]!]} ${y}y ${m}m ${d}d`;
}

export function BasicDetails({ pair }: { pair: Pair }): JSX.Element {
  const e = engine.value;
  const rows = useMemo(() => [pair.boy, pair.girl].map((c) => {
    const pa = e.status === 'ready' ? panchanga(e.swe, c, { sunrise: 'hindu' }) : null;
    const mo = c.bodies.Mo.lon, n = nakshatraIndex(mo);
    const kp = kootaPerson(c);
    const asc = dmsInSign(c.asc.lon), m = dmsInSign(mo);
    return {
      Name: c.input.name || '—',
      Date: longDate(c.input.date.y, c.input.date.m, c.input.date.d),
      Time: hms(c.input.time.h, c.input.time.mi, c.input.time.s),
      Place: c.input.place.name,
      Coordinates: coords(c.input.place.latDeg, c.input.place.lonDeg),
      Zone: `UTC${zone(c.input.tzHours + c.input.dstHours)}`,
      Ayanamsa: `${c.profile.ayanamsa.replace(/^pl_|^sf_/, '').replace(/_/g, ' ')} ${c.moment.ayanamsaDeg.toFixed(4)}°`,
      Lagna: `${SIGNS[signIndex(c.asc.lon)]} ${dms(asc.d, asc.m, asc.s)}`,
      'Moon sign (Rasi)': `${SIGNS[signIndex(mo)]} ${dms(m.d, m.m, m.s)}`,
      'Rasi lord': PLANET_NAMES[(['Ma','Ve','Me','Mo','Su','Me','Ve','Ma','Ju','Sa','Sa','Ju'] as const)[signIndex(mo)]],
      'Moon star (Nakshatra)': `${NAKSHATRA_NAMES[n]} pada ${pada(mo)}`,
      'Star lord': PLANET_NAMES[nakshatraLord(n)],
      'Lagna lord': PLANET_NAMES[SIGN_LORD[signIndex(c.asc.lon)]!],
      Varna: VARNA_NAMES[varnaOf(kp.sign, 0)]!,
      Vashya: VASHYA_NAMES[vashyaOf(kp.sign, kp.degInSign)]!,
      Yoni: YONI_NAMES[yoniOf(kp.nak)]!,
      Gana: GANA_NAMES[ganaOf(kp.nak)]!,
      Nadi: NADI_NAMES[nadiOf(kp.nak)]!,
      Rajju: RAJJU_NAMES[rajjuOf(kp.nak)]!,
      'Name syllable (Naamakshar)': PADA_SYLLABLES[n]![pada(mo) - 1]!,
      'Balance of dasha': balance(c),
      Tithi: pa ? `${pa.tithi.paksha === 'shukla' ? 'Shukla' : 'Krishna'} ${pa.tithi.name}` : '',
      Weekday: pa ? pa.vara.name : '',
      Yoga: pa ? pa.yoga.name : '',
      Karana: pa ? pa.karana.name : '',
    } as Record<string, string>;
  }), [pair, e]);
  const keys = Object.keys(rows[0]!);
  return (
    <section class="panel" aria-labelledby="h-m-basic">
      <header class="panel-head"><h2 id="h-m-basic">Basic birth details</h2></header>
      <div class="panel-body table-wrap">
        <table class="data" data-testid="match-basic">
          <thead><tr><th scope="col"><span class="sr-only">Item</span></th><th scope="col">Boy</th><th scope="col">Girl</th></tr></thead>
          <tbody>{keys.map((k) => <tr key={k}><th scope="row">{k}</th><td>{rows[0]![k]}</td><td>{rows[1]![k]}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

export function ChartsAndPlanets({ pair }: { pair: Pair }): JSX.Element {
  return (
    <Side pair={pair} id="m-chart">
      {(c) => {
        const m = page1Model(c);
        return (
          <>
            <EastIndianChart title={`Birth chart: ${nameOf(pair, c)}`} signs={rasiEntries(m.rasi, m.ascSign)} lagnaSign={m.ascSign}
              centre={[{ text: nameOf(pair, c), size: 30, display: true }, { text: longDate(c.input.date.y, c.input.date.m, c.input.date.d), size: 22 }]}
              maxFont={27} minFont={9} />
            <PlanetTable rows={m.rows} />
          </>
        );
      }}
    </Side>
  );
}

export function MoonNavDashas({ pair }: { pair: Pair }): JSX.Element {
  const now = new Date();
  const nowJd = julianDay(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), now.getUTCHours() + now.getUTCMinutes() / 60);
  return (
    <Side pair={pair} id="m-moon">
      {(c) => {
        const m = page1Model(c);
        const moonSign = signIndex(c.bodies.Mo.lon);
        return (
          <>
            <h3 class="ntp-sub">Moon chart (Chandra Lagna)</h3>
            <EastIndianChart title={`Moon chart: ${nameOf(pair, c)}`} signs={vargaEntries(m.rasi.map((g) => g.map((r) => r.id)), m.rows, moonSign)}
              lagnaSign={moonSign} centre={[{ text: 'Moon', size: 48, display: true }]} maxFont={40} minFont={12} />
            <h3 class="ntp-sub">Navamsha</h3>
            <EastIndianChart title={`Navamsha: ${nameOf(pair, c)}`} signs={vargaEntries(m.navamsha, m.rows, m.navamshaAscSign)}
              lagnaSign={m.navamshaAscSign} centre={[{ text: 'D9', size: 56, display: true }]} maxFont={40} minFont={12} />
            <h3 class="ntp-sub">Vimshottari Dasha</h3>
            <DashaList mahas={m.mahas} zoneHours={c.input.tzHours + c.input.dstHours} nowJd={nowJd} />
          </>
        );
      }}
    </Side>
  );
}

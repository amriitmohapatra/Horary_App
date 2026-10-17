/** "How was this computed?" — the provenance of every number on the page. */
import type { JSX } from 'preact';
import type { ChartResult } from '../../engine';
import { t } from '../i18n';
import { degDms } from '../format';

export function HowComputed({ chart }: { chart: ChartResult }): JSX.Element {
  const { profile: p, moment: m, provenance: v } = chart;
  const rows: [string, string][] = [
    [t('how.profile'), p.label],
    [t('how.jd'), m.jdUT.toFixed(6)],
    [t('how.deltaT'), `${m.deltaTsec.toFixed(1)} s (${p.deltaT})`],
    [t('how.ayanamsa'), `${degDms(m.ayanamsaDeg, 2)} (${p.ayanamsa}, mean equinox)`],
    [t('how.houses'), `${p.houses.system === 'P' ? 'Placidus' : 'Topocentric'}, ${p.houses.latitude} latitude ${v.houseLatitudeDeg.toFixed(4)}°`],
    [t('how.dashaYear'), `${p.dashaYearDays} days`],
    [t('how.engine'), `Astro-Amriit engine ${v.engineVersion} · Swiss Ephemeris ${v.swissephVersion} · seconds ${p.rounding === 'round' ? 'rounded' : 'truncated'}`],
  ];
  return (
    <details class="how">
      <summary>{t('how.title')}</summary>
      <dl>
        {rows.map(([k, val]) => <div key={k}><dt>{k}</dt><dd>{val}</dd></div>)}
      </dl>
    </details>
  );
}

/**
 * Screenshots for the illustrated PDF guide, with numbered callouts placed
 * from the live element positions.  node media/pdf/shots.mjs [id …]
 * For each shot: work/img/<id>.png (device scale 2.5) and work/fig/<id>.tex,
 * a figure with a TikZ overlay (numbered badges, outlines) and its legend.
 * Example chart: the public one used throughout the user guide.
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { APP, EXAMPLE, PARTNER } from '../lib/app.mjs';

const W = new URL('./work/', import.meta.url).pathname;
mkdirSync(W + 'img', { recursive: true }); mkdirSync(W + 'fig', { recursive: true });

// ---- helpers -------------------------------------------------------------
const T = (id) => (p) => p.getByTestId(id).first();
const S = (h) => (p) => p.locator(`section[aria-labelledby="${h}"]`).first();
const B = (name) => (p) => p.getByRole('button', { name, exact: true }).first();
const L = (label, exact = true) => (p) => p.getByLabel(label, { exact }).first();
const TH = (scope, text) => (p) => scope(p).locator('th', { hasText: text }).first();
const TX = (scope, text) => (p) => scope(p).getByText(text, { exact: false }).first();
const CSS = (css) => (p) => p.locator(css).first();
const navTo = async (p, name) => { await p.getByRole('navigation').getByRole('link', { name, exact: true }).click(); await p.waitForTimeout(450); };
const sub = (name) => async (p) => { await p.getByRole('button', { name, exact: true }).first().click(); await p.waitForTimeout(450); };

async function castExample(p) {
  await p.getByLabel('Name').fill(EXAMPLE.name);
  await p.getByLabel('Date').fill(EXAMPLE.date);
  await p.getByLabel('Hours', { exact: true }).fill(EXAMPLE.time);
  await p.getByLabel('Place').fill(EXAMPLE.place);
  await p.getByLabel('Place').press('Tab');
}
async function partner(p) {
  if (await p.getByTestId('pm-summary').count()) return;
  await p.getByRole('button', { name: "Enter the prospective match's birth details" }).click();
  await p.locator('#pm-name').fill(PARTNER.name); await p.locator('#pm-date').fill(PARTNER.date);
  await p.locator('#pm-place').fill(PARTNER.place); await p.locator('#pm-name').press('Enter');
  await p.getByTestId('pm-summary').waitFor();
}

// ---- the shots ---------------------------------------------------------------
// tab: main tab to open; prep: extra steps; target: what to capture (one or more locators, union);
// callouts: [n, locator, text]; caption.
export const SHOTS = [
  // Getting started
  { id: 'form', tab: null, prep: async (p) => { await castExample(p); await p.evaluate(() => document.activeElement?.blur()); }, target: [CSS('header'), L('Calculation'), CSS('label.file-btn')], pad: 10, below: 110,
    caption: 'The title bar and the chart form, filled in with the example chart.',
    callouts: [
      [1, T('engine-status'), 'Ready: the Swiss Ephemeris inside the file has started (about one second).'],
      [2, CSS('header button'), 'Theme button: Light, Dark, Warm night in turn.'],
      [3, L('Name'), 'Name of the person or question; it appears in the chart centre and in file names.'],
      [4, L('Date'), 'Date, 1800–2399. The words underneath (here 11 Oct 1942) cannot be misread: always check them.'],
      [5, L('Hours'), 'Time: hours, minutes, seconds, 24-hour clock. Two digits move to the next box.'],
      [6, L('Place'), 'Place: choose from the list to fill latitude, longitude and zone.'],
      [7, L(/^Zone/, false), 'Zone, hours east of UTC; India war time 1942–45 is set to +6:30 automatically.'],
      [8, L('Calculation'), 'Calculation profile: Parashara’s Light 9 (default), Parashara’s Light 7, or Solar Fire / Kala Chakra.'],
      [9, B('Cast chart'), 'Cast chart. Now casts this moment (horary); Save this place keeps the place in your own list.'],
      [10, CSS('label.file-btn'), 'Open a Parashara’s Light .xml file or an Astro-Amriit chart; save in either format.'],
    ] },
  { id: 'chartline', tab: 'Page 1', target: [CSS('main h1, .chart-title, [data-testid=panchanga]'), T('panchanga')], pad: 8, unionNav: true,
    caption: 'After casting: the chart line, the panchanga and the page tabs.',
    callouts: [
      [1, B('Edit chart'), 'Edit chart opens the form again with this chart’s data.'],
      [2, T('panchanga'), 'Panchanga: tithi and paksha, nakshatra and pada, yoga, karana, weekday (changes at sunrise).'],
      [3, CSS('nav'), 'The pages of the app. Click a tab to open it.'],
    ] },
  // Page 1
  { id: 'p1rasi', tab: 'Page 1', target: [CSS('[role=img][aria-label*="Birth chart"]')], pad: 4,
    caption: 'The Rasi chart in the East Indian style: the signs never move, Aries is at the top centre, and the ascendant’s box is tinted.',
    callouts: [
      [1, TX(CSS('[role=img][aria-label*="Birth chart"]'), '1st h.'), 'Edge label: house, Sarvashtakavarga bindus of its sign, Bhava Bala in virupas.'],
      [2, TX(CSS('[role=img][aria-label*="Birth chart"]'), 'Aq 1'), 'Sign and house number from the ascendant; the ascendant’s box is tinted.'],
      [3, TX(CSS('[role=img][aria-label*="Birth chart"]'), 'Mo 10:19'), 'Planet, degrees:minutes in the sign, nakshatra; R after a planet = retrograde.'],
      [4, (p) => p.locator('[role=img][aria-label*="Birth chart"] text', { hasText: 'Amitabh' }).first(), 'Centre: name, date, time, place and coordinates.'],
    ] },
  { id: 'p1planets', tab: 'Page 1', target: [T('planet-table')], pad: 6,
    caption: 'The planet table on Page 1.',
    callouts: [
      [1, TH(T('planet-table'), 'Longitude'), 'Longitude in the sign, to the second (rounded as PL 9 does).'],
      [2, TH(T('planet-table'), 'Flags'), 'R retrograde, c combust, Rc both.'],
      [3, TH(T('planet-table'), 'Nakshatra'), 'Nakshatra in PL’s short spelling, and the pada syllable.'],
      [4, TH(T('planet-table'), 'Pada, star'), 'Pada number, then the KP star / sub / sub-sub lords.'],
    ] },
  { id: 'p1strength', tab: 'Page 1', target: [T('strength-table')], pad: 6,
    caption: 'The strength table: the same columns as PL 9’s Page 1. Hold the mouse over a heading for its meaning.',
    callouts: [
      [1, TH(T('strength-table'), 'Dignity'), 'Compound relationship with the sign’s lord: Exalt., Own, Frnd., Enemy, Debil. …'],
      [2, TH(T('strength-table'), 'SB%'), 'Shad Bala ÷ required (1.00 = exactly the required strength); SB# = groups at their minimum.'],
      [3, TH(T('strength-table'), 'VB'), 'Vimshopaka out of 20; AV = ashtakavarga bindus in the occupied sign.'],
      [4, TH(T('strength-table'), 'Av3'), 'Avasthas: three-state and five-state (PL’s order).'],
      [5, TH(T('strength-table'), 'K7'), 'Chara karaka (7-karaka scheme); Func. = functional nature for this ascendant.'],
    ] },
  { id: 'p1vim', tab: 'Page 1', target: [S('h-dasha'), T('dasha-list')], pad: 6,
    caption: 'The Vimshottari list, as on PL’s Page 1, with the period running today highlighted.',
    callouts: [
      [1, CSS('[data-testid=dasha-list] .is-current, [data-testid=dasha-list] tr[aria-current]'), 'The period running today.'],
      [2, (p) => p.getByRole('button', { name: /deeper/i }).first(), '+ one level deeper (down to Deha); − one level higher.'],
      [3, (p) => p.getByRole('button', { name: /later/i }).first(), '↑ earlier, ↓ later periods.'],
      [4, B('Today'), 'Today brings the list back to now.'],
    ] },
  { id: 'p1bars', tab: 'Page 1', target: [(p) => p.locator('section', { hasText: 'Shad Bala' }).filter({ has: p.locator('svg') }).first()], pad: 6,
    caption: 'Shad Bala bars: a bar that reaches the dashed line has the strength the planet requires. Weaker bars are paler.',
    callouts: [] },
  { id: 'p1how', tab: 'Page 1', prep: async (p) => { await p.getByText('How was this computed?').first().click(); await p.waitForTimeout(300); }, target: [(p) => p.locator('details', { hasText: 'How was this computed?' }).first()], pad: 6,
    caption: '“How was this computed?” lists every setting behind the chart. Compare these lines first when numbers differ.',
    callouts: [] },
  // Page 1 (Experimental)
  { id: 'exstates', tab: 'Page 1 (Experimental)', target: [S('h-exp-plate'), T('exp-states'), CSS('[data-testid=exp-page] select')], pad: 6,
    caption: 'Highlights: each planet’s state in the chosen chart, as a code on the chart and spelled out in the table.',
    callouts: [[1, CSS('[data-testid=exp-page] select'), 'Choose the Rasi or any divisional chart.']] },
  { id: 'exconj', tab: 'Page 1 (Experimental)', target: [T('exp-conjunctions')], pad: 6,
    caption: 'Conjunctions: same sign, as in PL; “close” within the orb you set (default 3°); planetary war within 1°.', callouts: [] },
  { id: 'exacross', tab: 'Page 1 (Experimental)', target: [T('exp-across')], pad: 6,
    caption: 'Across the divisional charts: sign and house in all 16 Parashari charts, with ▲ exalted, ● own or moolatrikona, ▼ debilitated.', callouts: [] },
  { id: 'exlords', tab: 'Page 1 (Experimental)', prep: sub('Lordships & yogas'), target: [S('h-exp-lords')], pad: 6,
    caption: 'Lordships: PL’s worksheet, “Lord of N in M”, with * for an exchange (parivartana).', callouts: [] },
  { id: 'exyogas', tab: 'Page 1 (Experimental)', prep: sub('Lordships & yogas'), target: [S('h-exp-yogas')], pad: 6, maxH: 1300,
    caption: 'PL’s 1001 yogas, tested with PL’s own conditions: filter by result or group, or search by name.', callouts: [] },
  { id: 'exmatrix', tab: 'Page 1 (Experimental)', prep: sub('Aspects'), target: [S('h-exp-matrix')], pad: 6,
    caption: 'The aspect matrix: sign aspect and exact virupas; colour = how the aspected planet regards the aspecting one.', callouts: [] },
  { id: 'exhouses', tab: 'Page 1 (Experimental)', prep: sub('Aspects'), target: [S('h-exp-houses')], pad: 6, maxH: 1200,
    caption: 'Aspects on houses, on the nth house or on the house and its lord.', callouts: [] },
  { id: 'exws14', tab: 'Page 1 (Experimental)', prep: sub('Strength worksheet'), target: [S('h-ws14')], pad: 6,
    caption: 'PL’s worksheet 14: SB%, SB#, war, Ishta/Kashta, dominance and Func. per planet.', callouts: [] },
  { id: 'exnadi', tab: 'Page 1 (Experimental)', prep: sub('Nandi Nadi (research)'), target: [S('h-nadi-a')], pad: 6, maxH: 1200,
    caption: 'Nandi Nadi (research): links between planets read from their own signs.', callouts: [] },
  // Strengths
  { id: 'stsb', tab: 'Strengths', target: [S('h-sb')], pad: 6, caption: 'Shad Bala by component, one column per planet; group totals in bold.', callouts: [] },
  { id: 'stbb', tab: 'Strengths', target: [S('h-bb')], pad: 6, caption: 'Bhava Bala by component; the total is the second number on the chart’s edge labels.', callouts: [] },
  { id: 'sttime', tab: 'Strengths', target: [S('h-time')], pad: 6, caption: 'Time of the chart: sunrise and sunset (Sun’s centre, no refraction, as PL), day or night, and the kala bala lords.', callouts: [] },
  { id: 'stav', tab: 'Strengths', target: [S('h-av')], pad: 6, caption: 'Ashtakavarga: bindus sign by sign; the outlined cell is the planet’s own sign; SAV always totals 337.', callouts: [] },
  // Vargas
  { id: 'vamain', tab: 'Vargas', target: [(p) => p.getByRole('group', { name: /Groups/ }).first(), S('h-rule')], pad: 6,
    caption: 'Vargas: choose a group, then a chart; the Rule panel says where the rule comes from.',
    callouts: [
      [1, B('16 Parashari'), 'Groups: 16 Parashari, Tajika and D150, PL alternates.'],
      [2, S('h-rule'), 'Rule: BIN = decoded from PL’s program, STD = textbook, OPEN = placeholder; then the rule in words and its source.'],
    ] },
  { id: 'vatable', tab: 'Vargas', target: [T('varga-table')], pad: 6, caption: 'Signs in all vargas: a gold • marks vargottama.', callouts: [] },
  // Dashas
  { id: 'dacontrols', tab: 'Dashas', target: [S('h-running')], pad: 6, unionAbove: true,
    caption: 'Dashas: choose the date, jump to the next period of a planet at a level, set the dasha year; the running chain to Deha.', callouts: [] },
  { id: 'datree', tab: 'Dashas', target: [S('h-tree')], pad: 6, maxH: 1250, caption: 'The Vimshottari tree: each period’s beginning, end and length; arrows open the next level.', callouts: [] },
  { id: 'dapl', tab: 'Dashas', target: [S('h-pltable')], pad: 6, caption: 'Sub-periods laid out like PL’s dasha table; periods that ended before birth are blank, as in PL.', callouts: [] },
  // KP (Research)
  { id: 'kpcalc', tab: 'KP (Research)', target: [S('h-kp-calc')], pad: 6, unionBelow: CSS('.kp .segmented'),
    caption: 'KP (Research): the calculation choice (Readers mode by default) and the seven sub-tabs.',
    callouts: [[1, L('KP ayanamsa'), 'Readers mode: KP New ayanamsa, mean node, 365¼-day years. PL’s Krishnamurti and the chart’s own settings remain.'], [2, CSS('.kp .segmented'), 'The sub-tabs.']] },
  { id: 'kpchart', tab: 'KP (Research)', target: [S('h-kp-chart')], pad: 6, caption: 'The Krishnamurti chart: each sign lists its cusps and planets with star/sub lords and houses.', callouts: [] },
  { id: 'kpcusps', tab: 'KP (Research)', target: [S('h-kp-cusps')], pad: 6, caption: 'Cusps with sign, star, sub and sub-sub lords.', callouts: [] },
  { id: 'kpsig', tab: 'KP (Research)', target: [S('h-kp-sig')], pad: 6, caption: 'House-wise significators as PL defines them, and Fortuna.', callouts: [] },
  { id: 'kprank', tab: 'KP (Research)', prep: sub('Significators'), target: [S('h-kp-rank')], pad: 6, maxH: 1300,
    caption: 'Significators in Krishnamurti’s order of strength, levels 1–5, with node agents and empty stars.', callouts: [] },
  { id: 'kppsets', tab: 'KP (Research)', prep: sub('Significators'), target: [S('h-kp-psets')], pad: 6, caption: 'Houses each planet signifies; nodes with the planets they represent.', callouts: [] },
  { id: 'kppromise', tab: 'KP (Research)', prep: sub('Life matters'), target: [S('h-kp-promise')], pad: 6, maxH: 1400,
    caption: 'Life matters: for each of 14 matters, the cusp, its sub lord and star lord, the houses signified, and the promise.', callouts: [] },
  { id: 'kpmatter', tab: 'KP (Research)', prep: sub('Life matters'), target: [S('h-kp-matter')], pad: 6, maxH: 1400,
    caption: 'One matter in detail: the chain, the book’s notes, significators, and candidate periods with the warning and filters.',
    callouts: [[1, T('kp-matter-chain'), 'Cusp → sub lord → its star lord → houses → promise.'], [2, CSS('.kp-warn'), 'Candidates, not predictions: narrow with ruling planets, fix the day by transit.'], [3, T('kp-periods'), 'Candidate dasa–bhukti–anthra periods with levels and strength; Transit days opens the next step.']] },
  { id: 'kprp', tab: 'KP (Research)', prep: sub('Ruling planets'), target: [S('h-kp-rp')], pad: 6, maxH: 1400,
    caption: 'Ruling planets of the moment of judgement, nodes as agents, rejections, strongest first.', callouts: [[1, T('kpm-summary'), 'The moment: now at the chart’s place, or set your own.']] },
  { id: 'kprect', tab: 'KP (Research)', prep: async (p) => { await sub('Ruling planets')(p); await p.getByRole('button', { name: 'Find birth times' }).click(); await p.waitForTimeout(800); }, target: [S('h-kp-rect')], pad: 6,
    caption: 'Rectification by ruling planets: moments near the birth time whose rising sign, star, sub and sub-sub lords are all ruling planets.', callouts: [] },
  { id: 'kptr', tab: 'KP (Research)', prep: sub('Transit timing'), target: [S('h-kp-tr')], pad: 6, maxH: 1300,
    caption: 'Transit timing: when a body passes through units whose sign, star and sub lords are the period lords.', callouts: [] },
  { id: 'kphor', tab: 'KP (Research)', prep: async (p) => {
      await sub('Horary 1–249')(p); await p.getByRole('spinbutton', { name: 'Number' }).fill('74');
      await p.getByRole('button', { name: 'Set moment' }).click();
      await p.locator('#kpm-date').fill('1969-08-13'); await p.getByTestId('kpm-entry').getByLabel('Hours', { exact: true }).fill('07:30:00');
      await p.locator('#kpm-place').fill('New Delhi'); await p.locator('#kpm-name').press('Enter'); await p.waitForTimeout(600);
    }, target: [S('h-kp-hor'), S('h-kp-hor-j')], pad: 6, maxH: 1500,
    caption: 'Horary by number: B6’s worked example no. 74, Delhi, 13 August 1969, 7:30 IST (KP Reader 6, pp. 111–113).',
    callouts: [[1, (p) => p.getByRole('spinbutton', { name: 'Number' }), 'The number gives the ascendant: here Cancer 14°53′20″.'], [2, T('kp-hor-test'), 'The three conditions for the question’s cusp.'], [3, T('kp-hor-outcome'), 'Promised, delayed or denied.']] },
  { id: 'kphorc', tab: 'KP (Research)', prep: async (p) => { await sub('Horary 1–249')(p); await p.getByRole('spinbutton', { name: 'Number' }).fill('74'); await p.waitForTimeout(400); }, target: [S('h-kp-hor-c')], pad: 6,
    caption: 'The horary cusps: the numbered ascendant, other cusps for the latitude of judgement.', callouts: [] },
  { id: 'kpguide', tab: 'KP (Research)', prep: sub('KP Guidance'), target: [S('h-kp-guide')], pad: 6, maxH: 1500,
    caption: 'KP Guidance: the Readers’ rules that hold for this chart, with the condition that fired and the book and page.', callouts: [] },
  // NTP (Research)
  { id: 'ntpguide', tab: 'NTP (Research)', target: [S('h-ntp-guide')], pad: 6, maxH: 1400, caption: 'NTP Guidance: Iyer’s rules this chart meets, each tagged and cited.', callouts: [] },
  { id: 'ntpyoga', tab: 'NTP (Research)', target: [S('h-ntp-yoga')], pad: 6, caption: 'Yoga, Avayoga and the sets of three.', callouts: [] },
  { id: 'ntpplanet', tab: 'NTP (Research)', target: [T('ntp-planet-Ju')], pad: 6, maxH: 1100, caption: 'A planet card: position, states, character with reasons, and every rule it meets.', callouts: [] },
  { id: 'ntpdasha', tab: 'NTP (Research)', target: [S('h-ntp-dasha')], pad: 6, maxH: 1500, caption: 'Dasha and Bhukti by Iyer’s Dasha chart: starter, ruler, areas of life and every bhukti.', callouts: [] },
  // Yogi & Bhava
  { id: 'ybyogi', tab: 'Yogi & Bhava', target: [S('h-yogi')], pad: 6, caption: 'Yogi points: Yogi, Avayogi (rule selectable), Duplicate Yogi, Dagdha rashis.', callouts: [[1, L('Avayogi rule'), 'Choose the Avayogi rule while PL’s convention is unconfirmed.']] },
  { id: 'ybbhava', tab: 'Yogi & Bhava', target: [S('h-bhava')], pad: 6, caption: 'Bhava chalit: Sripati or equal houses; planets moved from the Rasi chart are listed.', callouts: [] },
  { id: 'ybtable', tab: 'Yogi & Bhava', target: [S('h-bhava-table')], pad: 6, caption: 'Bhavas: beginning (sandhi), centre (madhya) and the planets in each.', callouts: [] },
  // Jaimini
  { id: 'jakarakas', tab: 'Jaimini', target: [S('h-karakas')], pad: 6, caption: 'Chara karakas: 7-karaka (PL 9 Page 1) and 8-karaka (with Rahu) schemes.', callouts: [] },
  { id: 'jalagnas', tab: 'Jaimini', target: [S('h-lagnas')], pad: 6, caption: 'Special lagnas, with the sunrise used.', callouts: [] },
  { id: 'jaarudha', tab: 'Jaimini', target: [S('h-arudha')], pad: 6, caption: 'Arudha padas for D1, D9 or D10, with a choice of exception rule.', callouts: [] },
  { id: 'jakm', tab: 'Jaimini', target: [S('h-km')], pad: 6, caption: 'Karakamsha: the Navamsha from the Atma karaka’s sign (KL).', callouts: [] },
  { id: 'jaargala', tab: 'Jaimini', target: [S('h-argala')], pad: 6, caption: 'Argala from the Lagna or any planet, with three node rules.', callouts: [] },
  { id: 'jadrishti', tab: 'Jaimini', target: [S('h-drishti')], pad: 6, caption: 'Rashi drishti between planets.', callouts: [] },
  // Transits
  { id: 'trcontrols', tab: 'Transits', target: [S('h-tchart')], pad: 6, unionAbove: true, maxH: 1500,
    caption: 'Transits: the moment, the step and arrows, and the transit chart over the natal planets.',
    callouts: [[1, L('Step'), 'Step: 1 second to 10 years; ← back, → forward; Now returns to the present.']] },
  { id: 'trpos', tab: 'Transits', target: [S('h-tpos')], pad: 6, caption: 'Transit positions: sign, degree, nakshatra, house from the Lagna and from the Moon.', callouts: [] },
  { id: 'trevents', tab: 'Transits', target: [S('h-events')], pad: 6, maxH: 1300, caption: 'Coming changes: sign, nakshatra and pada changes and stations, up to a year ahead.', callouts: [] },
  { id: 'trsade', tab: 'Transits', target: [S('h-sade')], pad: 6, maxH: 1300, caption: 'Sade Sati periods from birth, phase by phase.', callouts: [] },
  { id: 'trreturns', tab: 'Transits', target: [S('h-returns')], pad: 6, maxH: 1300, caption: 'Jupiter and Saturn returns, including retrograde passes.', callouts: [] },
  // Matching
  { id: 'mentry', tab: 'Matching', prep: partner, target: [S('h-m-first'), S('h-m-second')], pad: 6, caption: 'Matching: the first chart (boy or girl) and the prospective match. The second chart is never stored.', callouts: [] },
  { id: 'mover', tab: 'Matching', prep: partner, target: [T('match-overview')], pad: 6, caption: 'Overview: Ashtakoot /36 with PL’s bands, Dash-Koota /44, B. V. Raman /36, Mangala Dosha.', callouts: [] },
  { id: 'mashta', tab: 'Matching', prep: async (p) => { await partner(p); await sub('Ashtakoot')(p); }, target: [T('match-ashtakoot')], pad: 6, caption: 'Ashtakoot: the eight kootas with both persons’ values and the marks.', callouts: [] },
  { id: 'mmangal', tab: 'Matching', prep: async (p) => { await partner(p); await sub('Mangala Dosha')(p); }, target: [S('h-m-mx')], pad: 6, maxH: 1400, caption: 'Mangala Dosha from the Lagna and the Moon, and PL’s cancellations that apply.', callouts: [] },
  { id: 'mdk', tab: 'Matching', prep: async (p) => { await partner(p); await sub('Dash-Koota')(p); }, target: [T('match-dashkoota')], pad: 6, maxH: 1400, caption: 'Dash-Koota: ten Kalaprakasika kootas plus gender, gothra and caste.', callouts: [] },
  { id: 'mkp', tab: 'Matching', prep: async (p) => { await partner(p); await sub('Krishnamurti (KP)')(p); }, target: [S('h-m-kp')], pad: 6, maxH: 1300, caption: 'Krishnamurti (KP): his ruling-planet test and his notes on each koota and on Mars dosha.', callouts: [] },
  // Settings
  { id: 'secalc', tab: 'Settings', target: [S('h-calc')], pad: 6, caption: 'Settings → Calculation: ayanamsa, Delta-T, node and dasha year for every chart; “Use the profile value” undoes a change.', callouts: [] },
  { id: 'seplaces', tab: 'Settings', target: [S('h-places')], pad: 6, caption: 'Saved places: add, edit, delete, export and import.', callouts: [] },
  { id: 'selook', tab: 'Settings', target: [S('h-look')], pad: 6, caption: 'Appearance: theme and text size.', callouts: [] },
];

// ---- capture -------------------------------------------------------------------
const esc = (s) => s.replace(/\\/g, '\\textbackslash{}').replace(/([&%$#_{}])/g, '\\$1').replace(/~/g, '\\textasciitilde{}')
  .replace(/\^/g, '\\textasciicircum{}').replace(/→/g, '$\\rightarrow$').replace(/←/g, '$\\leftarrow$').replace(/÷/g, '$\\div$')
  .replace(/−/g, '$-$').replace(/↑/g, '$\\uparrow$').replace(/↓/g, '$\\downarrow$').replace(/▲/g, '$\\blacktriangle$')
  .replace(/▼/g, '$\\blacktriangledown$').replace(/●/g, '$\\bullet$').replace(/•/g, '$\\bullet$').replace(/°/g, '\\textdegree{}')
  .replace(/′/g, '\\textquotesingle{}').replace(/″/g, '\\textquotedbl{}').replace(/¼/g, '\\textonequarter{}').replace(/×/g, '$\\times$');

async function freshPage(b) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2.5 });
  await ctx.addInitScript(() => { try { localStorage.setItem('kaast2.theme.v1', 'light'); localStorage.setItem('kaast2.textSize.v1', 'normal'); } catch { /* */ } });
  const p = await ctx.newPage();
  await p.goto(`file://${APP}`);
  await p.waitForSelector('[data-testid=engine-status][data-state=ready]', { timeout: 30000 });
  return p;
}

const only = process.argv.slice(2);
const b = await chromium.launch();
let p = await freshPage(b);
await castExample(p);
const problems = [];
for (const s of SHOTS) {
  if (only.length && !only.includes(s.id)) continue;
  try {
    if (s.id !== 'form') {
      if (await p.getByRole('button', { name: 'Cast chart' }).isVisible().catch(() => false)) { await p.getByRole('button', { name: 'Cast chart' }).click(); await p.getByRole('button', { name: 'Edit chart' }).waitFor(); }
      if (s.tab) await navTo(p, s.tab);
    }
    if (s.prep) await s.prep(p);
    await p.waitForTimeout(250);
    const boxes = [];
    for (const t of s.target) { const loc = t(p); await loc.scrollIntoViewIfNeeded().catch(() => {}); }
    await p.evaluate(() => scrollTo(0, 0));
    const doc = async (loc) => { const r = await loc.evaluate((e) => { const b = e.getBoundingClientRect(); return [b.left + scrollX, b.top + scrollY, b.width, b.height]; }); return { x: r[0], y: r[1], w: r[2], h: r[3] }; };
    for (const t of s.target) boxes.push(await doc(t(p)));
    if (s.unionNav) boxes.push(await doc(p.locator('nav').first()));
    if (s.unionBelow) boxes.push(await doc(s.unionBelow(p)));
    let x0 = Math.min(...boxes.map((r) => r.x)) - s.pad, y0 = Math.min(...boxes.map((r) => r.y)) - s.pad;
    let x1 = Math.max(...boxes.map((r) => r.x + r.w)) + s.pad, y1 = Math.max(...boxes.map((r) => r.y + r.h)) + s.pad + (s.below ?? 0);
    if (s.unionAbove) y0 = Math.max(0, y0 - 260);
    if (s.maxH && y1 - y0 > s.maxH) y1 = y0 + s.maxH;
    x0 = Math.max(0, x0); y0 = Math.max(0, y0);
    const clip = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
    await p.screenshot({ path: `${W}img/${s.id}.png`, clip, fullPage: true });
    const marks = [];
    for (const [n, sel, text] of s.callouts ?? []) {
      try {
        const r = await doc(sel(p));
        // clip the box to the shot; a hidden or out-of-shot target is a problem, not a stray badge
        const ax = Math.max(0, (r.x - x0) / clip.width), bx = Math.min(1, (r.x + r.w - x0) / clip.width);
        const ay = Math.max(0, (r.y - y0) / clip.height), by = Math.min(1, (r.y + r.h - y0) / clip.height);
        if (bx - ax < 0.005 || by - ay < 0.003) { problems.push(`${s.id} callout ${n}: target not in the shot`); continue; }
        marks.push({ n, text, x: ax, y: 1 - ay, w: bx - ax, h: by - ay });
      } catch (e) { problems.push(`${s.id} callout ${n}: ${e.message.split('\n')[0]}`); }
    }
    // figure: image with outlined, numbered regions, then the legend
    // 1pt narrower than the text so the 0.4pt frame line fits inside the margins
    // one scale for all shots (1000 CSS px = the text width), so on-screen text is the same size in every figure;
    // tall shots are capped by height (keepaspectratio below)
    const width = `\\dimexpr${Math.min(1, clip.width / 1000).toFixed(2)}\\linewidth-1pt\\relax`;
    let tex = `\\begin{figure}[htbp]\n  \\centering\n  \\begin{tikzpicture}\n    \\node[anchor=south west, inner sep=0] (img) {\\includegraphics[width=${width}, height=0.72\\textheight, keepaspectratio]{img/${s.id}.png}};\n    \\draw[gray!45] (img.south west) rectangle (img.north east);\n`;
    if (marks.length) {
      tex += '    \\begin{scope}[x={(img.south east)}, y={(img.north west)}]\n';
      for (const m of marks) {
        tex += `      \\draw[callout] (${m.x.toFixed(4)}, ${m.y.toFixed(4)}) rectangle (${(m.x + m.w).toFixed(4)}, ${(m.y - m.h).toFixed(4)});\n`;
        tex += `      \\node[badge] at (${Math.max(0.012, m.x).toFixed(4)}, ${Math.min(0.985, m.y).toFixed(4)}) {${m.n}};\n`;
      }
      tex += '    \\end{scope}\n';
    }
    tex += `  \\end{tikzpicture}\n  \\caption{${esc(s.caption)}}\n  \\label{fig:${s.id}}\n`;
    if (marks.length) tex += `  \\begin{calloutlist}\n${marks.map((m) => `    \\item[\\badgeinline{${m.n}}] ${esc(m.text)}`).join('\n')}\n  \\end{calloutlist}\n`;
    tex += '\\end{figure}\n';
    writeFileSync(`${W}fig/${s.id}.tex`, tex);
    console.log(s.id, `${Math.round(clip.width)}×${Math.round(clip.height)}`, marks.length, 'callouts');
  } catch (e) {
    problems.push(`${s.id}: ${e.message.split('\n')[0]}`);
    await p.context().close(); p = await freshPage(b); await castExample(p);
  }
}
await b.close();
if (problems.length) console.log('PROBLEMS\n' + problems.join('\n'));

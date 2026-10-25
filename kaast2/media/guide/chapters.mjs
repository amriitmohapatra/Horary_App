/**
 * The video user guide: chapters of narration segments, each with the
 * on-screen actions that go with it. Narration text → media/tts.py; actions →
 * media/guide/record.mjs (Director). Facts follow docs/user_guide/USER_GUIDE.md.
 * Example chart: the public one used throughout the user guide.
 */
import { castChart, tab, PARTNER } from '../lib/app.mjs';

const P = (page, id) => page.locator(`section[aria-labelledby="${id}"]`).first();
const T = (page, id) => page.getByTestId(id).first();
const btn = (page, name) => page.getByRole('button', { name, exact: true }).first();
const top = (page) => page.evaluate(() => scrollTo({ top: 0 }));
/** Scroll a target into the upper part of the view (no camera). */
const reveal = async (loc) => { await loc.evaluate((e) => e.scrollIntoView({ block: 'start' })); await loc.page().evaluate(() => scrollBy(0, -20)); };

export const CHAPTERS = [
  {
    id: 'c00', title: 'Welcome', tab: null,
    segments: [
      { id: 'c00a', text: 'Welcome to Astro-Amriit, the Karar Ashram astrology software. This guide walks through every page of the app, with one public example chart: Amitabh Bachchan, born on the eleventh of October 1942, at four in the afternoon, in Allahabad.',
        act: async (d, page) => { await d.wait(1500); await d.zoomTo(page.locator('header').first(), 0.9, 1.6); } },
      { id: 'c00b', text: 'The whole app is a single file. Double-click it and it opens in your web browser. It needs no installation and no internet: the Swiss Ephemeris is built into the file, and nothing you type ever leaves your computer.',
        act: async (d, page) => { await d.zoomOut(); await d.hover(T(page, 'engine-status'), 900); await d.highlight(T(page, 'engine-status')); } },
      { id: 'c00c', text: 'When the green dot says ready, the app has already cast a chart for this very moment, at the last place you used, so the page is never empty. The version is written at the very bottom of every page.',
        act: async (d, page) => { await d.wait(2500); await d.unhighlight(); } },
    ],
  },
  {
    id: 'c01', title: 'Casting a chart', tab: null,
    segments: [
      { id: 'c01a', text: 'The chart form is at the top. Type the name; it appears in the centre of the chart and in file names. Then the date.',
        act: async (d, page) => { await d.type(page.getByLabel('Name'), 'Amitabh Bachchan', 45); await d.click(page.getByLabel('Date')); await page.getByLabel('Date').fill('1942-10-11'); } },
      { id: 'c01b', text: 'Under the date box, the app writes the date in words. Always read it: the box itself may show the month before the day, and day and month swaps are the commonest mistake in birth data.',
        act: async (d, page) => { await d.zoomTo(page.locator('#fh-date, .date-echo').first(), 0.35, 1.8); } },
      { id: 'c01c', text: 'The time has three boxes, on the twenty-four hour clock, with seconds. Typing two digits moves you on to the next box.',
        act: async (d, page) => { await d.zoomOut(); await d.type(page.getByLabel('Hours', { exact: true }), '160000', 120); } },
      { id: 'c01d', text: 'Start typing the place and choose it from the list. Latitude, longitude and the time zone are filled in for you.',
        act: async (d, page) => { await d.type(page.getByLabel('Place'), 'Allahabad (Prayagraj)', 35); await page.getByLabel('Place').press('Tab'); await d.highlight(page.getByLabel('Latitude')); await d.wait(900); await d.unhighlight(); } },
      { id: 'c01e', text: 'In India, between September 1942 and October 1945, the clocks ran one hour ahead. The app knows this. It sets the zone to plus six thirty, and says so in a note under the form.',
        act: async (d, page) => { const n = page.getByText('India war time was in force').first(); await d.highlight(n); await d.wait(1500); await d.highlight(page.getByLabel(/^Zone/)); await d.wait(1200); await d.unhighlight(); } },
      { id: 'c01f', text: 'Choose the calculation profile: Parashara\'s Light 9, which is the default, Parashara\'s Light 7, or Solar Fire and Kala Chakra. Then press Cast chart.',
        act: async (d, page) => { await d.hover(page.getByLabel('Calculation'), 700); await d.wait(1600); await d.click(btn(page, 'Cast chart')); } },
      { id: 'c01g', text: 'The form folds away. Edit chart opens it again. From the form you can also open Parashara\'s Light chart files, save the chart, or save a file that Parashara\'s Light can open. Now casts a chart for this moment, for horary questions.',
        act: async (d, page) => { await d.click(btn(page, 'Edit chart')); await d.wait(300); for (const n of ['Open chart file…', 'Save chart', 'Save for Parashara\'s Light', 'Now']) { await d.hover(btn(page, n), 550); await d.wait(350); } await d.click(btn(page, 'Cast chart')); } },
      { id: 'c01h', text: 'Under the name, the chart line repeats the date, time, zone and coordinates, and below it the panchanga: tithi, nakshatra and pada, yoga, karana and the weekday, which changes at sunrise.',
        act: async (d, page) => { await d.zoomTo(T(page, 'panchanga'), 0.85, 1.9); } },
    ],
  },
  {
    id: 'c02', title: 'Page 1', tab: 'Page 1',
    segments: [
      { id: 'c02a', text: 'Page 1 follows the birth chart page of Parashara\'s Light 9. The Rasi chart is drawn in the East Indian style. The signs never move: Aries is at the top centre, and the ascendant\'s box is tinted.',
        act: async (d, page) => { await d.zoomTo(page.getByRole('img', { name: /Birth chart/ }).first(), 0.9, 1.6); } },
      { id: 'c02b', text: 'Each planet shows its degrees in the sign and its nakshatra. The letter R means retrograde. The labels round the edge give, for every house, the Sarvashtakavarga bindus and the Bhava Bala in virupas.',
        act: async (d, page) => { await d.wait(4000); } },
      { id: 'c02c', text: 'Beside it is the Navamsha, drawn the same way.',
        act: async (d, page) => { await d.zoomTo(page.getByRole('img', { name: /Navamsha|D9/ }).first(), 0.9, 1.6); } },
      { id: 'c02d', text: 'The planet table gives each longitude to the second, the nakshatra and its pada syllable, and the KP star, sub and sub-sub lords.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(T(page, 'planet-table')); await d.zoomTo(T(page, 'planet-table'), 0.92, 1.5); } },
      { id: 'c02e', text: 'Then the strength table, with the same columns as Parashara\'s Light: dignity, Shad Bala as a share of the required strength, Vimshopaka, ashtakavarga bindus, avasthas, the chara karaka, and the functional nature. Hold the mouse over a heading to read its full meaning.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(T(page, 'strength-table')); await d.zoomTo(T(page, 'strength-table'), 0.92, 1.5); await d.hover(T(page, 'strength-table').locator('th').nth(2), 900); } },
      { id: 'c02f', text: 'On the right is the Vimshottari list. The period running today is highlighted. The small buttons show one level deeper or higher, earlier or later periods, and Today brings you back.',
        act: async (d, page) => { await d.zoomOut(0); await top(page); await d.zoomTo(T(page, 'dasha-list'), 0.75, 1.7); await d.click(page.getByRole('button', { name: /deeper/i }).first(), 700); await d.wait(700); await d.click(page.getByRole('button', { name: /higher/i }).first(), 500); } },
      { id: 'c02g', text: 'Below it are the Shad Bala bars. A bar that reaches the dashed line has the strength that planet requires.',
        act: async (d, page) => { await d.zoomOut(0); const bars = page.locator('section', { hasText: 'Shad Bala' }).filter({ has: page.locator('svg') }).first(); await reveal(bars); await d.zoomTo(bars, 0.8, 1.7); } },
      { id: 'c02h', text: 'And at the bottom, How was this computed lists every setting behind the chart: the profile, the Julian day, Delta-T, the ayanamsa, the houses and the dasha year. If your numbers differ from someone else\'s, compare these lines first.',
        act: async (d, page) => { await d.zoomOut(0); const s = page.getByText('How was this computed?').first(); await reveal(s); await d.click(s); await d.wait(400); await d.zoomTo(s.locator('xpath=ancestor::details[1]'), 0.85, 1.6); } },
    ],
  },
  {
    id: 'c03', title: 'Page 1 (Experimental)', tab: 'Page 1 (Experimental)',
    segments: [
      { id: 'c03a', text: 'Page 1 Experimental brings Parashara\'s Light\'s worksheets together in five sub-tabs. Highlights shows each planet\'s state in any chart you choose: exalted, own sign, debilitated, vargottama, dig bala, retrograde, combust, and the third, sixth, eighth and twelfth houses.',
        act: async (d, page) => { await d.zoomTo(T(page, 'exp-states'), 0.9, 1.5); } },
      { id: 'c03b', text: 'Conjunctions are listed with the app\'s definition: the same sign, as in Parashara\'s Light, marked close within the orb you set, and planetary war within one degree.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(T(page, 'exp-conjunctions')); await d.zoomTo(T(page, 'exp-conjunctions'), 0.9, 1.6); } },
      { id: 'c03c', text: 'Lordships and yogas gives the lordship worksheet for any chart, and Parashara\'s Light\'s one thousand and one yogas, tested with its own conditions. Filter them, or search by name.',
        act: async (d, page) => { await d.zoomOut(0); await top(page); await d.click(btn(page, 'Lordships & yogas')); await d.wait(500); await reveal(T(page, 'exp-yogas')); await d.zoomTo(T(page, 'exp-yogas'), 0.9, 1.4); } },
      { id: 'c03d', text: 'Aspects shows the aspect matrix in virupas, coloured by how the aspected planet regards the aspecting one, and the aspects on every house.',
        act: async (d, page) => { await d.zoomOut(0); await top(page); await d.click(btn(page, 'Aspects')); await d.wait(500); await reveal(T(page, 'exp-aspect-matrix')); await d.zoomTo(T(page, 'exp-aspect-matrix'), 0.9, 1.5); } },
      { id: 'c03e', text: 'The strength worksheet adds planetary war, ishta and kashta, dominance and the Bhava Bala components. And Nandi Nadi, a research tab, reads each planet from its own sign, with Jupiter\'s and Saturn\'s transits over the natal planets.',
        act: async (d, page) => { await d.zoomOut(0); await top(page); await d.click(btn(page, 'Strength worksheet')); await d.wait(500); await reveal(T(page, 'exp-ws14')); await d.zoomTo(T(page, 'exp-ws14'), 0.9, 1.5); await d.wait(3000); await d.zoomOut(0); await top(page); await d.click(btn(page, 'Nandi Nadi (research)')); await d.wait(400); await reveal(T(page, 'nadi-matrix')); } },
    ],
  },
  {
    id: 'c04', title: 'Strengths', tab: 'Strengths',
    segments: [
      { id: 'c04a', text: 'The Strengths page shows how every strength number on Page 1 is built up. Shad Bala has one column per planet: the parts of sthana, dig, kala, cheshta, naisargika and drik bala, then the total, the required amount, and the share that Page 1 shows.',
        act: async (d, page) => { await d.zoomTo(T(page, 'shadbala-table'), 0.92, 1.4); } },
      { id: 'c04b', text: 'Bhava Bala gives every house its components and total. That total is the second number on the chart\'s edge labels.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(T(page, 'bhavabala-table')); await d.zoomTo(T(page, 'bhavabala-table'), 0.92, 1.5); } },
      { id: 'c04c', text: 'Time of the chart lists sunrise, sunset, whether the birth was by day or by night, and the lords used in kala bala. And the ashtakavarga gives every planet\'s bindus sign by sign, with the Sarvashtakavarga row, which always adds up to three hundred and thirty-seven.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(P(page, 'h-time')); await d.highlight(P(page, 'h-time')); await d.wait(2500); await d.unhighlight(); await reveal(T(page, 'ashtakavarga-table')); await d.zoomTo(T(page, 'ashtakavarga-table'), 0.92, 1.5); } },
    ],
  },
  {
    id: 'c05', title: 'Vargas', tab: 'Vargas',
    segments: [
      { id: 'c05a', text: 'Vargas holds all the divisional charts Parashara\'s Light offers, in three groups: the sixteen Parashari charts, the Tajika charts with D one fifty, and Parashara\'s Light\'s alternates.',
        act: async (d, page) => { await d.zoomTo(page.getByRole('group', { name: /Groups/ }).first(), 0.6, 1.8); for (const g of ['Tajika and D150', 'PL alternates', '16 Parashari']) { await d.click(btn(page, g), 450); await d.wait(500); } } },
      { id: 'c05b', text: 'The large chart shows one varga. Click any small chart at the bottom to show it. The Rule panel says where each rule comes from: decoded from Parashara\'s Light\'s own program, or a textbook rule not yet confirmed.',
        act: async (d, page) => { await d.zoomOut(0); const small = page.getByRole('button', { name: /Show D10/ }).first(); await reveal(small); await d.click(small); await top(page); await d.zoomTo(P(page, 'h-rule'), 0.7, 1.7); } },
      { id: 'c05c', text: 'Signs in all vargas lists every planet\'s sign in each chart of the group. A dot in gold marks vargottama: the same sign as in the Rasi chart.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(T(page, 'varga-table')); await d.zoomTo(T(page, 'varga-table'), 0.92, 1.4); } },
    ],
  },
  {
    id: 'c06', title: 'Dashas', tab: 'Dashas',
    segments: [
      { id: 'c06a', text: 'Dashas gives the complete Vimshottari, down to the sixth level. Choose a date, and the running chain shows maha, antar, pratyantar, sookshma, prana and deha on that date.',
        act: async (d, page) => { await d.zoomTo(T(page, 'running-chain'), 0.9, 1.6); } },
      { id: 'c06b', text: 'Jump to the next period of any planet at any level. The dasha year can be changed here too; Parashara\'s Light uses three hundred and sixty-five point two four two days, which the app found inside its program.',
        act: async (d, page) => { await d.zoomOut(0); await d.hover(btn(page, 'Jump'), 800); await d.wait(800); await d.hover(page.getByLabel(/Dasha year/).first(), 800); } },
      { id: 'c06c', text: 'The tree opens one level at a time, with each period\'s beginning, end and length. On the right, the table is laid out like Parashara\'s Light\'s dasha table for the selected period. Periods that ended before birth are left blank, as in Parashara\'s Light.',
        act: async (d, page) => { await reveal(T(page, 'dasha-tree')); await d.zoomTo(T(page, 'dasha-tree'), 0.9, 1.4); await d.wait(2500); await d.zoomOut(0); await d.zoomTo(T(page, 'pl-dasha-table'), 0.8, 1.6); } },
    ],
  },
  {
    id: 'c07', title: 'KP (Research)', tab: 'KP (Research)',
    segments: [
      { id: 'c07a', text: 'KP Research brings Krishnamurti\'s KP, as his six KP Readers teach it, with the book and page for every rule. By default it casts in Readers mode: the KP New ayanamsa, the mean node, and three hundred and sixty-five and a quarter day years, which is what the Readers\' own charts reproduce with.',
        act: async (d, page) => { await d.zoomTo(P(page, 'h-kp-calc'), 0.85, 1.6); } },
      { id: 'c07b', text: 'Chart and tables shows Parashara\'s Light\'s Krishnamurti chart, the cusps and planets with their sign, star, sub and sub-sub lords, and the significator tables.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(T(page, 'kp-cusps')); await d.zoomTo(T(page, 'kp-cusps'), 0.85, 1.6); } },
      { id: 'c07c', text: 'Significators lists, for every house, the planets in Krishnamurti\'s order of strength: planets in the stars of the occupants first, then the occupants, then planets in the owner\'s stars, then the owner. Rahu and Ketu act for the planets they represent.',
        act: async (d, page) => { await d.zoomOut(0); await top(page); await d.click(btn(page, 'Significators')); await d.wait(400); await reveal(T(page, 'kp-rank')); await d.zoomTo(T(page, 'kp-rank'), 0.92, 1.4); } },
      { id: 'c07d', text: 'Life matters judges fourteen matters, such as marriage, children, profession and property. For each, it shows the cusp, its sub lord, the houses the sub lord signifies, and whether the matter is promised.',
        act: async (d, page) => { await d.zoomOut(0); await top(page); await d.click(btn(page, 'Life matters')); await d.wait(400); await reveal(T(page, 'kp-promise')); await d.zoomTo(T(page, 'kp-promise'), 0.92, 1.4); } },
      { id: 'c07e', text: 'Below, it lists candidate dasa, bhukti and anthra periods for the chosen matter. Read the note: these are candidates, not predictions. Krishnamurti narrows them with the ruling planets, and fixes the day by transit. The Transit days button does that next step.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(page.locator('.kp-warn')); await d.zoomTo(page.locator('.kp-warn'), 0.9, 1.6); await d.wait(2500); await d.zoomOut(0); await d.click(T(page, 'kp-periods').getByRole('button', { name: 'Transit days' }).first(), 800); await d.wait(600); await reveal(T(page, 'kp-tr')); } },
      { id: 'c07f', text: 'Ruling planets gives the ruling planets of this moment, or of a moment you set, with Rahu and Ketu as agents. The rectification assistant searches around the birth time for moments whose rising degree is ruled by them.',
        act: async (d, page) => { await d.zoomOut(0); await top(page); await d.click(btn(page, 'Ruling planets')); await d.wait(400); await reveal(T(page, 'kp-rp')); await d.zoomTo(P(page, 'h-kp-rp'), 0.9, 1.4); await d.wait(2500); await d.zoomOut(0); await reveal(P(page, 'h-kp-rect')); await d.click(btn(page, 'Find birth times'), 700); } },
      { id: 'c07g', text: 'Horary takes a number from one to two hundred and forty-nine. The number gives the ascendant; the moment and place of judgement give the planets. The app applies Krishnamurti\'s three conditions to the question\'s cusp, and lists the periods to watch.',
        act: async (d, page) => { await d.zoomOut(0); await top(page); await d.click(btn(page, 'Horary 1–249')); await d.wait(300); await d.type(page.getByRole('spinbutton', { name: 'Number' }), '74', 150); await d.wait(500); await reveal(T(page, 'kp-hor-test')); await d.zoomTo(P(page, 'h-kp-hor-j'), 0.9, 1.4); } },
      { id: 'c07h', text: 'And KP Guidance lists the Readers\' rules that hold for this chart, by area of life, each in plain words with its book and page, and with the condition that fired in brackets.',
        act: async (d, page) => { await d.zoomOut(0); await top(page); await d.click(btn(page, 'KP Guidance')); await d.wait(400); await reveal(T(page, 'kp-guide-list')); await d.zoomTo(T(page, 'kp-guide-list'), 0.95, 1.5); } },
    ],
  },
  {
    id: 'c08', title: 'NTP (Research)', tab: 'NTP (Research)',
    segments: [
      { id: 'c08a', text: 'NTP Research applies H. R. Seshadri Iyer\'s New Techniques of Prediction to the chart. Only the rules this chart meets are listed, each tagged good, bad, mixed or note, with its volume and page.',
        act: async (d, page) => { await d.zoomTo(T(page, 'ntp-guidance'), 0.92, 1.4); } },
      { id: 'c08b', text: 'The Yogi panel gives the birth Yogi, the duplicate Yogi and the Avayogi, and Iyer\'s sets of three. Then one card per planet: its position, its states, and the rules it meets.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(T(page, 'ntp-yoga')); await d.zoomTo(T(page, 'ntp-yoga'), 0.9, 1.5); await d.wait(2500); await d.zoomOut(0); await reveal(T(page, 'ntp-planet-Ju')); await d.zoomTo(T(page, 'ntp-planet-Ju'), 0.85, 1.6); } },
      { id: 'c08c', text: 'Choose any mahadasha to read it by Iyer\'s dasha chart: its starter and ruler, what it gives area by area through the divisional charts, and every bhukti. Marriage matching by Iyer\'s method is on this tab too.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(T(page, 'ntp-bhuktis')); await d.zoomTo(T(page, 'ntp-bhuktis'), 0.92, 1.4); } },
    ],
  },
  {
    id: 'c09', title: 'Yogi & Bhava', tab: 'Yogi & Bhava',
    segments: [
      { id: 'c09a', text: 'Yogi and Bhava gives the Yogi point and planet, the Avayogi, the duplicate Yogi, and the burnt signs of the tithi. How Parashara\'s Light finds the Avayogi is not yet confirmed, so you can choose the rule.',
        act: async (d, page) => { await d.zoomTo(P(page, 'h-yogi'), 0.85, 1.6); await d.hover(page.getByLabel('Avayogi rule'), 800); } },
      { id: 'c09b', text: 'Bhava chalit places each planet in its house, by Sripati or by equal houses. The line under the chart lists the planets whose house differs from the Rasi chart, and the table gives each house\'s beginning and centre.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(P(page, 'h-bhava')); await d.zoomTo(P(page, 'h-bhava'), 0.9, 1.3); await d.wait(2500); await d.zoomOut(0); await reveal(T(page, 'bhava-table')); await d.zoomTo(T(page, 'bhava-table'), 0.9, 1.5); } },
    ],
  },
  {
    id: 'c10', title: 'Jaimini', tab: 'Jaimini',
    segments: [
      { id: 'c10a', text: 'Jaimini shows the chara karakas twice: the seven-karaka scheme of Parashara\'s Light\'s Page 1, and the eight-karaka scheme with Rahu. Then the special lagnas, from bhava lagna to Indu lagna.',
        act: async (d, page) => { await d.zoomTo(P(page, 'h-karakas'), 0.9, 1.5); await d.wait(2500); await d.zoomOut(0); await d.zoomTo(T(page, 'special-lagnas'), 0.8, 1.7); } },
      { id: 'c10b', text: 'Arudha padas for the Rasi, Navamsha or Dashamsha, with a choice of exception rule. The Karakamsha re-draws the Navamsha from the Atma karaka\'s sign.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(P(page, 'h-arudha')); await d.zoomTo(P(page, 'h-arudha'), 0.9, 1.3); await d.wait(2200); await d.zoomOut(0); await d.zoomTo(P(page, 'h-km'), 0.9, 1.4); } },
      { id: 'c10c', text: 'Argala can be counted from the lagna or any planet, with a choice for Rahu and Ketu. And rashi drishti lists every pair of planets that aspect each other by sign.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(T(page, 'argala-table')); await d.zoomTo(T(page, 'argala-table'), 0.9, 1.4); await d.wait(2500); await d.zoomOut(0); await reveal(T(page, 'rashi-drishti')); await d.zoomTo(T(page, 'rashi-drishti'), 0.85, 1.5); } },
    ],
  },
  {
    id: 'c11', title: 'Transits', tab: 'Transits',
    segments: [
      { id: 'c11a', text: 'Transits opens at the present moment. Choose a step, from one second to ten years, and step backwards or forwards with the arrows. Now returns to the present.',
        act: async (d, page) => { await d.zoomTo(P(page, 'h-tchart').locator('xpath=preceding::section[1]'), 0.9, 1.6).catch(() => {}); await page.getByLabel('Step', { exact: true }).selectOption('mo'); await d.click(page.getByRole('button', { name: 'Step forward' }), 700); await d.wait(500); await d.click(page.getByRole('button', { name: 'Step forward' }), 300); } },
      { id: 'c11b', text: 'The transit chart shows the moving planets in colour and the natal planets in grey, with houses counted from the natal ascendant. The positions table counts each house from the lagna and from the Moon.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(P(page, 'h-tchart')); await d.zoomTo(P(page, 'h-tchart'), 0.9, 1.3); await d.wait(2500); await d.zoomOut(0); await d.zoomTo(T(page, 'transit-table'), 0.85, 1.5); } },
      { id: 'c11c', text: 'Coming changes lists sign, nakshatra and pada changes and stations ahead. And the app lists every Sade Sati from birth, and every Jupiter and Saturn return.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(T(page, 'transit-events')); await d.zoomTo(P(page, 'h-events'), 0.9, 1.4); await d.wait(2000); await d.zoomOut(0); await reveal(T(page, 'sade-sati')); await d.zoomTo(P(page, 'h-sade'), 0.9, 1.5); } },
    ],
  },
  {
    id: 'c12', title: 'Matching', tab: 'Matching',
    segments: [
      { id: 'c12a', text: 'Matching compares two charts as Parashara\'s Light 7 reports it. Enter the prospective match with the same form. The second chart is never stored.',
        act: async (d, page) => {
          await d.click(page.getByRole('button', { name: "Enter the prospective match's birth details" }));
          await d.type(page.locator('#pm-name'), PARTNER.name, 35); await page.locator('#pm-date').fill(PARTNER.date);
          await page.locator('#pm-place').fill(PARTNER.place); await page.locator('#pm-name').press('Enter');
          await page.getByTestId('pm-summary').waitFor();
        } },
      { id: 'c12b', text: 'The overview gives the Ashtakoot score out of thirty-six with Parashara\'s Light\'s bands, the Dash-Koota and B. V. Raman totals, and Mangala Dosha.',
        act: async (d, page) => { await reveal(T(page, 'match-overview')); await d.zoomTo(T(page, 'match-overview'), 0.9, 1.5); } },
      { id: 'c12c', text: 'Ashtakoot lists the eight kootas, with both persons\' values and the marks. Mangala Dosha checks Mars from the lagna and the Moon, with Parashara\'s Light\'s cancellations. And the Krishnamurti tab gives his own test, and his notes on every koota.',
        act: async (d, page) => { await d.zoomOut(0); await d.click(btn(page, 'Ashtakoot')); await d.wait(400); await reveal(T(page, 'match-ashtakoot')); await d.zoomTo(T(page, 'match-ashtakoot'), 0.9, 1.4); await d.wait(2500); await d.zoomOut(0); await d.click(btn(page, 'Krishnamurti (KP)')); await d.wait(400); await reveal(T(page, 'match-kp-test')); await d.zoomTo(T(page, 'match-kp-test'), 0.9, 1.5); } },
    ],
  },
  {
    id: 'c13', title: 'Settings', tab: 'Settings',
    segments: [
      { id: 'c13a', text: 'Settings changes a calculation choice for every chart: the ayanamsa, Delta-T, the true or mean node, and the dasha year. When a setting differs from the profile, a button appears to put it back.',
        act: async (d, page) => { await d.zoomTo(P(page, 'h-calc'), 0.85, 1.5); } },
      { id: 'c13b', text: 'Saved places keeps your own places, with their coordinates and zone. Export them to a file, and import them on another device.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(T(page, 'places-manager')); await d.zoomTo(T(page, 'places-manager'), 0.85, 1.4); } },
      { id: 'c13c', text: 'And Appearance offers a light theme, a dark theme, and a warm night theme that is gentler on the eyes in the evening, with three text sizes. The round button at the top right switches the theme on any page.',
        act: async (d, page) => { await d.zoomOut(0); await reveal(P(page, 'h-look')); const th = page.getByLabel('Theme'); await th.selectOption('dark'); await d.wait(1600); await th.selectOption('warm'); await d.wait(1600); await th.selectOption('light'); } },
    ],
  },
  {
    id: 'c14', title: 'Trust and next steps', tab: 'Page 1',
    segments: [
      { id: 'c14a', text: 'Every number in Astro-Amriit has been compared with Parashara\'s Light\'s own output wherever that output was available. The written user guide lists what has been checked, and what is still open.',
        act: async (d, page) => { await d.zoomTo(T(page, 'planet-table'), 0.9, 1.4); } },
      { id: 'c14b', text: 'The app calculates; the judgement is yours. Thank you for watching.',
        act: async (d, page) => { await d.zoomOut(); await top(page); } },
    ],
  },
];

/** Get to the chapter's starting state before recording starts. */
export async function setup(d, page, ch) {
  if (ch.id !== 'c00' && ch.id !== 'c01') await castChart(d, page, undefined, { typed: false });
  if (ch.tab) {
    await page.getByRole('navigation').getByRole('link', { name: ch.tab, exact: true }).click();
    await page.waitForTimeout(500);
  }
  await top(page);
  await page.waitForTimeout(300);
}

export { tab };

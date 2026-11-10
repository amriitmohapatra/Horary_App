/**
 * The client tools the ElevenLabs agent calls (names and parameters must
 * match voice/agent_en.json and the agent's dashboard exactly). Each tool
 * reads the chart open in the app at the moment it is called.
 */
import type { ChartResult } from '../../engine';
import { julianDay } from '../../engine/time/julian';
import { chartOverview, dashaFacts, houseFacts, planetFacts, voiceChart } from './facts';

/** The agent's ID (a public agent, owner's decision 2026-11-10). Not a secret. */
export const AGENT_ID = 'agent_2601m72kx4aye71rf3x76m0rqzg5';

export const TOOL_NAMES = ['get_chart_overview', 'get_planet', 'get_house', 'get_dashas'] as const;
type ToolName = (typeof TOOL_NAMES)[number];
type Params = Record<string, unknown>;

const nowJd = (now = new Date()): number =>
  julianDay(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(),
    now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600);

/**
 * Tool handlers over `current()`, the chart on screen. Results go back to the
 * agent as JSON text. `onCall` lets the panel show which facts were used.
 */
export function makeClientTools(current: () => ChartResult | null, onCall?: (name: ToolName, result: unknown) => void):
  Record<ToolName, (p: Params) => Promise<string>> {
  const run = (name: ToolName, f: (c: ChartResult) => unknown) => async (): Promise<string> => {
    const c = current();
    const result = c ? f(c) : { error: 'No chart is open in the app. Ask the user to cast a chart first.' };
    onCall?.(name, result);
    return JSON.stringify(result);
  };
  return {
    get_chart_overview: (_p) => run('get_chart_overview', (c) => chartOverview(voiceChart(c), nowJd()))(),
    get_planet: (p) => run('get_planet', (c) => planetFacts(voiceChart(c), String(p?.planet ?? '')))(),
    get_house: (p) => run('get_house', (c) => houseFacts(voiceChart(c), Number(p?.house)))(),
    get_dashas: (p) => run('get_dashas', (c) => dashaFacts(voiceChart(c), nowJd(),
      p?.date == null ? undefined : String(p.date), p?.count == null ? undefined : Number(p.count)))(),
  };
}

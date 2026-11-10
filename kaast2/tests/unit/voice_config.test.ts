/** The voice agent's config (voice/agent_en.json) agrees with the app's client tools and the content policy. */
import { describe, expect, it } from 'vitest';
import config from '../../voice/agent_en.json';
import { AGENT_ID, TOOL_NAMES, makeClientTools } from '../../src/ui/voice/tools';

/** Same policy as tests/unit/kp_guidance.test.ts (NTP page): no death, longevity, accident, danger or disease prognosis. */
const FORBIDDEN = /\b(death|die|dies|dying|died|longevity|life span|lifespan|accident|danger|dangerous|fatal|suicide|murder|leprosy|tuberculosis|widow|widower|maraka|killed|kill)\b/i;

describe('voice agent config', () => {
  it('names the same agent and the same tools as the app', () => {
    expect(config.agent_id).toBe(AGENT_ID);
    expect(config.client_tools.map((t) => t.name)).toEqual([...TOOL_NAMES]);
    expect(Object.keys(makeClientTools(() => null))).toEqual([...TOOL_NAMES]);
    expect(config.client_tools.every((t) => t.wait_for_response)).toBe(true);
  });

  it('what the agent says or is told about the tools stays inside the content policy', () => {
    const spoken = [config.first_message, ...config.client_tools.flatMap((t) => [t.description, ...t.parameters.map((p) => p.description)])];
    for (const s of spoken) expect(FORBIDDEN.test(s), s).toBe(false);
  });

  it('the prompt binds the agent to tool facts and forbids predictions', () => {
    const p = config.system_prompt.join('\n');
    expect(p).toMatch(/Get every chart fact from a tool/);
    expect(p).toMatch(/Never calculate, estimate or guess/);
    expect(p).toMatch(/Do not predict events/);
  });

  it('tools answer with an error the agent can read when no chart is open', async () => {
    const tools = makeClientTools(() => null);
    for (const name of TOOL_NAMES) expect(JSON.parse(await tools[name]({}))).toHaveProperty('error');
  });
});

# Voice agent ("Ask the chart") — plan

Status: **English built and shipped in v0.13 (Phases 1–5 for English). Hindi and Odia wait for the native-speaker gate (Phase 0).**
Created 2026-11-10. Living document: tick boxes and add a dated line to §7 at
the end of every session that touches this work.

Goal: a spoken, conversational assistant inside Astro-Amriit that answers
questions about the chart on screen, in English, Hindi and Odia, built on the
ElevenLabs Agents platform (the owner's Creator plan).

---

## 1. The brief, made deeper

### 1.1 What a top professional would do that the original request did not ask for

1. **Use the model to narrate, never to calculate.** The engine is validated
   against PL 9, PL 7 and Solar Fire. The voice agent should get every
   placement, lord, house and dasha date by calling that engine (ElevenLabs
   *client tools*), and the prompt should forbid it from working any of them
   out itself. A language model asked "what is my Moon's sub lord?" will
   otherwise invent an answer that sounds confident.
2. **Protect the app's offline and privacy promise.** v0.12 states "nothing
   is uploaded and nothing is fetched", and a Playwright test enforces that.
   Voice needs a network connection, so it must be opt-in, off by default,
   loaded only when switched on, and preceded by a consent notice that names
   what leaves the device: birth data and the user's voice, sent to
   ElevenLabs and its LLM provider.
3. **Settle Odia before building anything.** Odia is the language most likely
   to fail. It has to be proven end to end (speech recognition, the LLM's
   Odia, the voice) before any UI work.
4. **Write the test set before the agent.** Decide which questions it must
   answer, and what correct means, before tuning prompts.
5. **Apply the same content policy as the Guidance page.** No death,
   longevity, accident, danger or disease prognosis, in all three languages.
   This is a family tool, and a spoken prediction carries more weight than a
   line of text.
6. **Control cost and abuse.** The plan includes 275 agent minutes a month.
   An agent ID published unprotected lets anyone spend them.

### 1.2 The rawest material to start from

- The engine's structured output (`ChartResult`, `page1Model`,
  `bodySummary`, Vimshottari periods), not the rendered page or screenshots.
- `Odia Text Sample.xlsx` (repo root): the family's own Odia names and short
  forms for signs and planets. This becomes the start of the Odia glossary and
  pronunciation list. Hindi needs the same table, made by the family.
- Real questions recorded from family members in each language, phrased the
  way they actually speak, including Hindi-English and Odia-English mixing.
  These matter more than any list of questions written by me.
- The rule texts the app already holds (`src/engine/kp/guidance/*.json`, the
  NTP meanings) as the only permitted source for interpretation.
- ElevenLabs' own model and language tables, which are primary sources, and
  a short test inside the account. Marketing pages and third-party summaries
  are not enough.

### 1.3 Methods and tools

- **ElevenLabs Agents**:
  - one agent, with English as the default language and Hindi and Odia as
    additional languages;
  - per-language first messages and voices;
  - client tools with "wait for response" switched on;
  - dynamic variables for the chart identity;
  - conversation overrides to set the language before the call;
  - a public agent, as decided in §5; signed URLs are the fallback if the
    agent ID is abused.
- **SDK**: `@elevenlabs/client` (1.35.0 on npm, 2026-11-04). The app uses
  Preact, so the framework-free client is preferred over `@elevenlabs/react`
  (1.21.1).
- **Agent configuration as code**: prompt, tool schemas, language presets and
  glossary are committed as JSON with no secrets, and applied through the API
  or CLI, so changes can be reviewed and reverted.
- **Tests**:
  - Vitest for the tool layer (pure functions over oracle charts);
  - Playwright to prove the offline test still passes with voice off;
  - `npm run scan` extended to fail on anything that looks like an
    `xi-api-key`;
  - ElevenLabs evaluation criteria and data collection on recorded
    conversations.

### 1.4 What, besides us, shows the result is right

1. **The validated engine.** Every number or name the agent speaks must
   appear in the tool JSON returned in that conversation. An automated check
   compares the transcript with the tool calls.
2. **Native speakers.** Family members who speak Hindi and Odia score a fixed
   set of answers on a rubric: understood the question, correct term,
   pronunciation, natural phrasing. Neither I nor the vendor can judge Odia
   speech.
3. **The existing content policy.** `FORBIDDEN` in
   `tests/unit/kp_guidance.test.ts` is run over every evaluation transcript.
   It is English-only today, so Hindi and Odia equivalents must be supplied
   by the family.
4. **The offline Playwright test** (`tests/e2e/single_file.spec.ts`: "no
   network requests") stays green with voice switched off.

### 1.5 The rewritten request

> Plan, then build in gated phases, an opt-in voice assistant for Astro-Amriit
> (v0.13, a new file) on ElevenLabs Agents, which answers questions about the
> chart on screen in English, Hindi and Odia.
>
> - The agent may state only facts returned by client tools that wrap the
>   validated engine. It never computes astrology itself. Interpretation
>   comes only from the app's own rule texts, under the Guidance content
>   policy in all three languages.
> - Voice is off by default. It needs explicit consent, and keeps the API key
>   out of the HTML.
> - First prove that Odia works end to end in my account (recognition, LLM,
>   voice) and settle hosting and authentication. Then build the tool layer
>   with unit tests, the agent configuration as code, and the UI.
> - Judge the result against the engine's outputs, a golden question set
>   recorded by family members, native-speaker ratings, and the offline and
>   scan tests.
> - Keep this plan updated as work progresses.

---

## 2. Facts verified on 2026-11-10 (with gaps)

| Fact | Source | Status |
|---|---|---|
| Odia (`or`) and Hindi are supported by TTS models Eleven v4, v4 Turbo, v3 and **v3 Conversational** | elevenlabs.io/docs/models | Verified (docs) |
| Multilingual v2 / Flash v2.5 / Turbo v2.5: Hindi yes, **Odia no** | same | Verified (docs) |
| Scribe v2 speech-to-text: Hindi and **Odia both "High accuracy" (5–10 % WER)** | docs, speech-to-text capabilities | Verified (docs) |
| Agent docs: "additional languages switch the agent to the v2.5 multilingual model"; the language cannot change during a call; the widget asks for the language before the call | docs, agents language page | Verified (docs). **May be out of date** (see next row) |
| Agents offer **Odia** and **Hindi** as additional languages. With both added, the agent's voice model family stays **V4 Turbo** (~77 ms; Odia supported per the models page). The other choices are V4 (~550 ms), V3 Conversational (~165 ms), Flash (~105 ms) and Multilingual (~343 ms). There is also a "Hinglish Mode" switch. The docs line about "v2.5 multilingual" is out of date | Test agent in the account, 2026-11-10 | **Verified in the dashboard. How Odia sounds is not yet verified** (native-speaker test) |
| Pronunciation dictionaries (IPA/CMU or alias) apply to V4 models, V3 Conversational and Flash v2 English. So the Odia/Hindi glossary can drive pronunciation on V4 Turbo | Common voice settings panel | Verified (dashboard text) |
| LLM picker: the default is DeepSeek Flash 4.1 (hosted by ElevenLabs, ~$0.0078/min). Anthropic models are listed, for example Claude Haiku 5.5 (~$0.0008/min, 443 ms–1.36 s) and Claude Sonnet 5.5 (~$0.0165/min) | LLM panel | Verified; not changed |
| Browser authentication: a signed URL from a server holding the API key (valid 15 min to start), or a hostname allowlist (max 10); never both; never put the key on the client | docs, agents authentication page | Verified (docs) |
| Client tools: registered in `Conversation.startSession({ clientTools })`, names case-sensitive, "wait for response" returns the value to the agent | docs, client tools page | Verified (docs) |
| Account: **Creator plan**, 131 000 credits (0 used), **275 call minutes/month**, 10 concurrent calls, $0.08/min after that plus LLM tokens; renews 10 Dec; no agents created yet | the owner's dashboard (read only) | Verified 2026-11-10 |

Consequence of the `file://` page: the opened single file has origin `null`.
An allowlist cannot match it. A signed-URL endpoint would have to accept
origin `null`, which any page can send, so for the single file it protects
only if it also checks a family passphrase. The site build (Vercel, already
planned in PLAN.md) gets a real origin.

---

## 3. Architecture (proposed)

```
Astro-Amriit v0.13 (single file / site)
 └─ Voice panel (off by default; consent; language chosen BEFORE the call)
     └─ dynamic import @elevenlabs/client  ← no code or requests until opted in
         Conversation.startSession({
           agentId,                       // public agent (§5)
           overrides: { agent: { language: 'en' | 'hi' | 'or' } },
           dynamicVariables: { chart_label },     // no birth data in variables
           clientTools: { get_chart_overview, get_body, get_house,
                          get_dasha_now, get_dasha_at } })
 ElevenLabs: Scribe (STT) → LLM (prompt + rule texts) → TTS (v3 Conv. / Realtime)
            ↑ calls client tools in the page; the page answers with engine JSON
```

The tool layer is a new pure module (proposed `src/engine/voice/facts.ts`).
It contains no DOM and no network code. It only re-packages existing engine
output: `page1Model`, `bodySummary` / `summaryChartOf`, `dasha/vimshottari`.
It changes no astrology rule, so the Python twin `kala_chakra` is unaffected.
That must be stated in the decisions log entry.

Tool output carries both the English term and the glossary term for the
call's language (for example `{"sign":"Cancer","sign_or":"କର୍କଟ"}`), so the
voice says the family's words rather than the LLM's own translation.

---

## 4. Phases

### Phase 0 — gates (one short session, mostly in the ElevenLabs dashboard)
- [x] The owner decided hosting and authentication, consent and the test
      agent (§5, 2026-11-10).
- [x] Test agent created on 2026-11-10 with Hindi and Odia added (findings
      in §2). It was then configured and published as the English agent
      "Astro-Amriit voice (EN)" (`voice/agent_en.json`); it is no longer
      throwaway.
- [ ] Ten fixed sentences per language, containing planet, sign and
      nakshatra names, played to a native speaker and scored.
- [ ] Five Odia and five Hindi spoken questions from family members: check
      the live transcript.
- [x] Smoke test from disk: a one-file page opened as
      `file://` starts a session with the test agent's ID. Check that it
      connects from origin `null` and that the microphone prompt appears in
      Chrome, Edge, Firefox and Safari. If any browser refuses, revisit the
      public-agent decision. (Chrome done 2026-11-10 by the live e2e; Firefox and Safari still by hand)
- [ ] **Exit:** Odia is usable, or Odia is deferred with the reason recorded
      and English and Hindi go first.

### Phase 1 — tool layer (no network)
- [x] `facts.ts` with five tools; JSON schemas match the dashboard tool
      definitions. (built with four tools)
- [x] Vitest: tool output equals engine output on the oracle charts. (tested against the PL9 oracle, not against itself)
- [ ] Odia glossary from `Odia Text Sample.xlsx` (read only); Hindi glossary
      from the family.

### Phase 2 — agent configuration as code
- [x] System prompt:
  - narrate tool output only;
  - name the chart's profile;
  - follow the policy on topics it must not speak about;
  - say "I don't know" rather than guess;
  - keep answers short for voice.
- [ ] Language presets: first message and voice for each language; glossary
      and pronunciation entries.
- [x] Call length limit and a minutes budget alert.

### Phase 3 — UI (v0.13, new file) (300 s, 30 calls a day, 2 at once; no budget alert set)
- [x] Voice panel:
  - opt-in switch (persisted, off by default);
  - consent text;
  - language picker;
  - microphone permission;
  - live transcript;
  - end call.
- [x] Every string goes through `t()`.
- [ ] Offline e2e and axe pass with voice off. A new e2e test proves no
      request is made until opt-in.

### Phase 4 — evaluation
- [ ] Golden set: about 30 questions per language from the recordings, with
      expected facts taken from the engine.
- [ ] Automated checks on transcripts:
  - spoken facts ⊆ tool JSON;
  - `FORBIDDEN` in all three languages;
  - latency.
- [ ] Native-speaker rubric scores recorded in
      `parity/voice_eval_<date>.md`. No personal chart data is committed.

### Phase 5 — ship
- [ ] `npm run build:single` → `dist/Astro-Amriit v0.13.html`.
- [ ] `npm run ci` green.
- [ ] Scan rejects any API key.
- [ ] Update PLAN.md, ARCHITECTURE.md, `knowledge/06_decisions_log.md` and
      the user guide.

---

## 5. Decisions (taken 2026-11-10)

- **Hosting: public agent.** The agent ID goes in the HTML. No server and no
  signed URL. To limit the cost if the ID is copied, the plan relies on:
  - a short maximum call length;
  - a minutes alert in the dashboard;
  - rotating the agent (new ID, new app build) if usage looks wrong.
  An allowlist is not possible from a `file://` page.
- **Test agent:** Claude may create a throwaway agent in Chrome for Phase 0,
  and deletes it afterwards.
- **Consent:** accepted, with a consent screen before the first call. Voice
  is off by default.

### Options as they were put

1. **Hosting and authentication.**
   - (a) A public agent on the single file: simplest, but the agent ID can be
     reused and spend the minutes.
   - (b) A Vercel function issuing signed URLs, behind a family passphrase:
     recommended.
   - (c) Voice only in the site build.
2. **May Claude create a test agent** in the ElevenLabs account for Phase 0?
   That changes the account. It can be deleted afterwards.
3. **Consent.** Do you accept that birth data and voice for charts opened by
   family members go to ElevenLabs and its LLM provider? This is the wording
   the consent screen will show.

### Still open
- **LLM provider.** The default is DeepSeek Flash 4.1. Claude Haiku 5.5 is
  listed as cheaper and faster. The consent screen must name the actual
  provider, so this must be decided before Phase 3.

## 6. Risks

| Risk | Mitigation |
|---|---|
| Odia not available inside agents | Phase 0 gate; ship English and Hindi first |
| LLM states an invented placement | Tools-only facts, transcript-vs-tool check |
| Fatalistic or medical statements | Prompt policy plus `FORBIDDEN` in three languages |
| Minutes drained by strangers (public agent chosen) | Call length limit; usage alert; rotate the agent ID if abused |
| Desktop (Tauri) build blocks voice: `src-tauri/tauri.conf.json` sets `connect-src 'self' ipc: …` | Add the ElevenLabs hosts to the desktop CSP only in a build that ships voice; the single file has no CSP |
| Offline promise broken | Opt-in dynamic import; e2e "no requests before opt-in" |
| Hindi/Odia mixed with English | Language fixed per call; glossary terms in tool output; rated by native speakers |

## 7. Progress log

- 2026-11-10 — Read the project knowledge, the v0.12 source and the
  ElevenLabs docs; checked the account read-only (Creator, no agents).
  Wrote this plan. Next: the owner's decisions in §5, then Phase 0.

Sources: elevenlabs.io/docs/models; /docs/overview/capabilities/speech-to-text;
/docs/agents-platform/customization/language; …/tools/client-tools;
…/authentication; npm registry (`@elevenlabs/client`, `@elevenlabs/react`).
- 2026-11-10 — Decisions: public agent; test agent allowed; consent screen.
  Phase 0 started.
- 2026-11-10 — Phase 0, part 1, done: Odia and Hindi are available inside
  agents on V4 Turbo; pronunciation dictionaries are supported; LLM choices
  noted. Remaining gates (need people): native-speaker listening test, and
  family-spoken Odia/Hindi questions through Preview.
- 2026-11-10 — Owner keeps the test agent for the listening test. Delete it
  after Phase 0.
- 2026-11-10 — Owner: proceed with English; listening gate waived for
  English only. LLM: Claude Haiku 5.5.
- 2026-11-10 — English done:
  - `src/ui/voice/facts.ts` and `tools.ts`, with 15 PL9 oracle tests and a
    config/policy test;
  - agent configured to `voice/agent_en.json`: four client tools, limits,
    no audio stored, 30-day transcripts;
  - Settings consent and the voice panel;
  - e2e: no requests before Start;
  - live e2e from `file://`, including the golden set.
  Smoke-test result: a public agent works from origin `null`, with a fake
  microphone in Chrome. Firefox and Safari are still to try by hand.
  Shipped as v0.13.


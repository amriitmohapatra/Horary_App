/**
 * Voice assistant panel (shown only when Settings → Voice assistant is on).
 * The ElevenLabs SDK is imported when Start is pressed, so nothing runs and
 * nothing is sent before that. The agent answers from client tools that
 * read the chart on screen (voice/tools.ts); it never computes astrology.
 */
import type { JSX } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { t, type MessageKey } from '../i18n';
import { chart } from '../state/store';
import { AGENT_ID, makeClientTools } from '../voice/tools';

type Status = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';
interface Line { who: 'user' | 'agent'; text: string }
interface Session { endSession(): Promise<void>; sendUserMessage(text: string): void; sendContextualUpdate(text: string): void }

export function VoicePanel(): JSX.Element {
  const [status, setStatus] = useState<Status>('disconnected');
  const [mode, setMode] = useState<'listening' | 'speaking'>('listening');
  const [lines, setLines] = useState<Line[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const session = useRef<Session | null>(null);

  const current = () => { const c = chart.value; return c && 'ok' in c ? c.ok : null; };

  // A different chart cast during a call: tell the agent to fetch it again.
  const c = chart.value;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    session.current?.sendContextualUpdate('The user opened a different chart. Call get_chart_overview again before answering.');
  }, [c]);

  useEffect(() => () => { void session.current?.endSession(); }, []);

  async function start(): Promise<void> {
    setError(null); setLines([]); setTools([]); setStatus('connecting');
    try {
      const { Conversation, stripAudioTags } = await import('@elevenlabs/client');
      session.current = await Conversation.startSession({
        agentId: AGENT_ID,
        connectionType: 'websocket',
        clientTools: makeClientTools(current, (name, result) =>
          setTools((ts) => [...ts, `${name}${(result as { error?: string })?.error ? ' (error)' : ''}`])),
        onStatusChange: ({ status: s }) => setStatus(s),
        onModeChange: ({ mode: m }) => setMode(m),
        onMessage: ({ message, role }) => setLines((ls) => [...ls, { who: role, text: stripAudioTags(message) }]),
        onError: (message) => setError(message),
        onDisconnect: () => { session.current = null; setStatus('disconnected'); },
      });
    } catch (err) {
      session.current = null;
      setStatus('disconnected');
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function end(): Promise<void> {
    const s = session.current;
    session.current = null;
    await s?.endSession();
    setStatus('disconnected');
  }

  function send(e: Event): void {
    e.preventDefault();
    const q = typed.trim();
    if (!q || !session.current) return;
    session.current.sendUserMessage(q);
    setLines((ls) => [...ls, { who: 'user', text: q }]);
    setTyped('');
  }

  const live = status === 'connected';
  return (
    <section class="panel voice-panel" aria-labelledby="h-voice-panel" data-testid="voice-panel" data-status={status}>
      <header class="panel-head"><h2 id="h-voice-panel">{t('voice.title')}</h2></header>
      <div class="panel-body">
        <p class="hint-text">{t('voice.intro')}</p>
        <div class="controls-row">
          {status === 'disconnected'
            ? <button type="button" class="btn" onClick={() => void start()}>{t('voice.start')}</button>
            : <button type="button" class="btn" onClick={() => void end()} disabled={status === 'disconnecting'}>{t('voice.end')}</button>}
          <span class="voice-status" role="status" data-testid="voice-status">
            {t(`voice.status.${status}` as MessageKey)}{live ? ` · ${t(`voice.mode.${mode}` as MessageKey)}` : ''}
          </span>
        </div>
        {error && <p class="status status-bad" role="alert">{t('voice.error', { error })}</p>}
        {lines.length > 0 && (
          <ol class="voice-log" aria-live="polite" data-testid="voice-log">
            {lines.map((l, i) => (
              <li key={i} data-who={l.who}><strong>{t(l.who === 'user' ? 'voice.you' : 'voice.assistant')}:</strong> {l.text}</li>
            ))}
          </ol>
        )}
        {tools.length > 0 && <p class="hint-text" data-testid="voice-tools">{t('voice.facts', { tools: tools.join(', ') })}</p>}
        <form class="controls-row" onSubmit={send}>
          <label class="sr-only" for="voice-typed">{t('voice.type')}</label>
          <input id="voice-typed" type="text" value={typed} placeholder={t('voice.type')} disabled={!live}
            onInput={(e) => setTyped(e.currentTarget.value)} />
          <button type="submit" class="btn btn-quiet" disabled={!live || !typed.trim()}>{t('voice.send')}</button>
        </form>
      </div>
    </section>
  );
}

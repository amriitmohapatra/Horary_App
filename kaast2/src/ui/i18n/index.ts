/**
 * Every user-visible string goes through t() (Odia edition later = od.json
 * plus a numeral mapper). Missing keys show as [key] so they are caught by
 * the build contract check and by eye.
 */
import en from './en.json';

const dict: Record<string, string> = en;

export type MessageKey = keyof typeof en;

export function t(key: MessageKey, vars?: Record<string, string | number>): string {
  const s = dict[key];
  if (s === undefined) return `[${key}]`;
  return vars ? s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`)) : s;
}

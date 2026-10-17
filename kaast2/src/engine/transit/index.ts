/**
 * Slice 8 — transits (PLAN.md §3.8). Pure functions over the Swiss adapter:
 * no DOM, no clock. PL7's transit viewer interpolates a 12-hour cache
 * (Astro_Fork report §transit); KAAST 2 computes every instant directly with
 * the natal recipe (siderealFrame + bodiesIn), so there is no cache.
 */
export { transitPositions, findEvents, returns, cellOf, TRANSIT_JD_MIN, TRANSIT_JD_MAX } from './events';
export type { TransitEvent, EventKind, Direction, FindEventsOptions, ReturnEvent } from './events';
export { sadeSati } from './sadesati';
export type { SadeSatiPeriod, SadeSatiPhase } from './sadesati';
export { stepJd } from './step';
export type { StepUnit } from './step';

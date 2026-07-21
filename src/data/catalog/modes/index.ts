import { MODE_HOTSEAT, MODE_PROTOCOL_MATCH } from "./protocol-match.mode";
import type { MatchModeDefinition } from "./types";

/**
 * Match mode registry — append new modes here.
 * UI / GameManager resolve modes by id (no switch soup in battle code).
 */
const MODES: MatchModeDefinition[] = [MODE_PROTOCOL_MATCH, MODE_HOTSEAT];

const byId = new Map(MODES.map((m) => [m.id, m]));

export function listMatchModes(): MatchModeDefinition[] {
  return MODES.filter((m) => m.enabled);
}

export function getMatchMode(id: string): MatchModeDefinition | undefined {
  return byId.get(id);
}

export function getDefaultMatchMode(): MatchModeDefinition {
  return MODE_PROTOCOL_MATCH;
}

export type { MatchModeDefinition } from "./types";
export { MODE_PROTOCOL_MATCH, MODE_HOTSEAT };

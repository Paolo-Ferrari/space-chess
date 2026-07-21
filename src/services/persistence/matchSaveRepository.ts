import type { BattleState } from "../../domain/battle/types";

import { readJson, removeKey, writeJson } from "./localStoragePort";
import { STORAGE_KEYS } from "./storageKeys";

export interface MatchSnapshot {
  version: 1;
  savedAt: number;
  state: BattleState;
}

function isBattleState(value: unknown): value is BattleState {
  if (!value || typeof value !== "object") {
    return false;
  }
  const state = value as Partial<BattleState>;
  return (
    typeof state.battleId === "string" &&
    Array.isArray(state.units) &&
    typeof state.turnNumber === "number" &&
    (state.phase === "playing" || state.phase === "ended")
  );
}

/**
 * Local match snapshot — foundation for resume / replay.
 * Not wired into UI yet; API ready for GameManager.
 */
export function saveMatchSnapshot(state: BattleState): boolean {
  const snapshot: MatchSnapshot = {
    version: 1,
    savedAt: Date.now(),
    state,
  };
  return writeJson(STORAGE_KEYS.matchSnapshot, snapshot);
}

export function loadMatchSnapshot(): MatchSnapshot | null {
  const parsed = readJson<MatchSnapshot>(STORAGE_KEYS.matchSnapshot);
  if (!parsed || parsed.version !== 1 || !isBattleState(parsed.state)) {
    return null;
  }
  return parsed;
}

export function clearMatchSnapshot(): void {
  removeKey(STORAGE_KEYS.matchSnapshot);
}

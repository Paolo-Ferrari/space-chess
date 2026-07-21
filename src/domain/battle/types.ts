import type { StatusEffectInstance } from "../ability/types";
import type { UnitDefinition, UnitType } from "../armyBuilder/types";
import type { GameEvent } from "../events/gameEvents";

export type PlayerId = 0 | 1;

export const BOARD_WIDTH = 8;
export const BOARD_HEIGHT = 8;

export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  position: Position;
  unitInstanceId: string | null;
}

export interface Board {
  width: number;
  height: number;
}

/** Runtime unit on the board — separate from catalog UnitDefinition. */
export interface UnitRuntime {
  instanceId: string;
  definitionId: string;
  owner: PlayerId;
  position: Position;
  currentHp: number;
  maxHp: number;
  hasMoved: boolean;
  hasAttacked: boolean;
  /** Manual ability used this turn (active/support). */
  hasUsedAbility: boolean;
  /** Temporary / permanent status effects from Ability System. */
  statusEffects: StatusEffectInstance[];
  /**
   * Loadout ids: commander cyber-modules or legendary combat modules.
   * Ordinary units always [].
   */
  implantIds: string[];
}

export type BattlePhase = "playing" | "ended";

export interface BattleLogEntry {
  id: string;
  text: string;
}

/**
 * Runtime battle state only.
 * UI selection (selected unit, modals) must NOT live here.
 */
export interface BattleState {
  battleId: string;
  board: Board;
  units: UnitRuntime[];
  currentPlayer: PlayerId;
  turnNumber: number;
  phase: BattlePhase;
  /** Winner seat; null while playing or draw. */
  winner: PlayerId | null;
  /** Human-readable projection of domain events (UI log). */
  log: BattleLogEntry[];
}

/** Snapshot of catalog data needed during battle (no UI). */
export interface BattleUnitView {
  runtime: UnitRuntime;
  definition: UnitDefinition;
  type: UnitType;
  name: string;
}

export interface ApplyResult {
  state: BattleState;
  events: GameEvent[];
}

export type BattleActionResult = {
  ok: boolean;
  state: BattleState;
  events: GameEvent[];
  reason?: string;
  /** UI hint: update local selection (undefined = leave as-is) */
  selectUnitId?: string | null;
};

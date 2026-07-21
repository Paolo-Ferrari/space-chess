import type { Position } from "../battle/types";

export type AiStrategyId = "aggressive" | "defensive" | "tactical";

export type AiDifficulty = "easy" | "normal" | "hard";

export interface AiConfig {
  /** Seat controlled by AI (enemy is player 1 in current battles). */
  playerId: 0 | 1;
  strategy: AiStrategyId;
  difficulty: AiDifficulty;
}

export type AiActionKind =
  | "attack"
  | "ability"
  | "move"
  | "wait"
  | "end_turn";

export interface AiAttackAction {
  kind: "attack";
  unitId: string;
  targetId: string;
  score: number;
}

export interface AiAbilityAction {
  kind: "ability";
  unitId: string;
  abilityId: string;
  targetId: string;
  score: number;
}

export interface AiMoveAction {
  kind: "move";
  unitId: string;
  to: Position;
  score: number;
}

export interface AiWaitAction {
  kind: "wait";
  unitId: string;
  score: number;
}

export interface AiEndTurnAction {
  kind: "end_turn";
  score: number;
}

export type AiAction =
  | AiAttackAction
  | AiAbilityAction
  | AiMoveAction
  | AiWaitAction
  | AiEndTurnAction;

export interface AiStrategyWeights {
  id: AiStrategyId;
  attack: number;
  killBonus: number;
  commanderTarget: number;
  ability: number;
  heal: number;
  buff: number;
  control: number;
  approachEnemyCommander: number;
  guardOwnCommander: number;
  safety: number;
}

export const AI_STRATEGY_LABELS: Record<AiStrategyId, string> = {
  aggressive: "Агрессивный",
  defensive: "Защитный",
  tactical: "Тактический",
};

export const AI_DIFFICULTY_LABELS: Record<AiDifficulty, string> = {
  easy: "Easy",
  normal: "Normal",
  hard: "Hard",
};

/** Default strategy per difficulty (UI can override later). */
export function defaultStrategyForDifficulty(
  difficulty: AiDifficulty,
): AiStrategyId {
  if (difficulty === "easy") {
    return "aggressive";
  }
  if (difficulty === "hard") {
    return "tactical";
  }
  return "defensive";
}

export function createAiConfig(
  difficulty: AiDifficulty,
  strategy?: AiStrategyId,
): AiConfig {
  return {
    playerId: 1,
    difficulty,
    strategy: strategy ?? defaultStrategyForDifficulty(difficulty),
  };
}

import type { BattleActionResult } from "../battle/types";
import type { BattleManager } from "../battle/battleManager";

import { decideAiAction } from "./aiDecision";
import type { AiAction, AiConfig } from "./types";

export interface AiStepResult {
  action: AiAction;
  result: BattleActionResult;
  done: boolean;
}

/**
 * AI Manager — decisions only.
 * Executes exclusively through BattleManager (never mutates BattleState directly).
 */
export class AiManager {
  private readonly config: AiConfig;

  constructor(config: AiConfig) {
    this.config = config;
  }

  getConfig(): AiConfig {
    return this.config;
  }

  /**
   * Execute a single micro-decision for the AI seat.
   */
  step(battle: BattleManager): AiStepResult {
    const state = battle.getState();
    if (
      state.phase !== "playing" ||
      state.currentPlayer !== this.config.playerId
    ) {
      return {
        action: { kind: "end_turn", score: 0 },
        result: {
          ok: false,
          reason: "Сейчас не ход ИИ",
          state,
          events: [],
        },
        done: true,
      };
    }

    const action = decideAiAction(battle, this.config);
    const result = this.execute(battle, action);
    const next = battle.getState();
    const done =
      next.phase === "ended" ||
      next.currentPlayer !== this.config.playerId ||
      action.kind === "end_turn";

    return { action, result, done };
  }

  /**
   * Play until the AI ends its turn or the battle ends.
   * Caps iterations to avoid pathological loops.
   */
  playTurn(battle: BattleManager, maxSteps = 40): AiStepResult[] {
    const steps: AiStepResult[] = [];
    for (let i = 0; i < maxSteps; i += 1) {
      const step = this.step(battle);
      steps.push(step);
      if (step.done) {
        break;
      }
      // If action failed, force end turn to avoid spin
      if (!step.result.ok && step.action.kind !== "end_turn") {
        const end = this.execute(battle, { kind: "end_turn", score: 0 });
        steps.push({
          action: { kind: "end_turn", score: 0 },
          result: end,
          done: true,
        });
        break;
      }
    }
    return steps;
  }

  private execute(
    battle: BattleManager,
    action: AiAction,
  ): BattleActionResult {
    switch (action.kind) {
      case "attack":
        return battle.attack(action.unitId, action.targetId);
      case "ability":
        return battle.useAbility(
          action.unitId,
          action.abilityId,
          action.targetId,
        );
      case "move":
        return battle.move(action.unitId, action.to);
      case "wait":
        // Explicit no-op — other units may still act; end_turn finishes.
        return {
          ok: true,
          state: battle.getState(),
          events: [],
        };
      case "end_turn":
        return battle.endTurn();
      default: {
        const _exhaustive: never = action;
        return {
          ok: false,
          reason: `Unknown AI action: ${String(_exhaustive)}`,
          state: battle.getState(),
          events: [],
        };
      }
    }
  }
}

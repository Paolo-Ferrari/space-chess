import { AbilitySystem } from "../ability/abilitySystem";
import type { BattleManager } from "../battle/battleManager";
import { computeDamage } from "../battle/combatSystem";
import { UnitSystem } from "../unit/unitSystem";

import {
  scoreAbility,
  scoreAttack,
  scoreEndTurn,
  scoreMove,
} from "./actionEvaluation";
import { getStrategyWeights } from "./aiStrategy";
import type {
  AiAction,
  AiConfig,
  AiDifficulty,
} from "./types";

function difficultyNoise(difficulty: AiDifficulty): number {
  if (difficulty === "easy") {
    return 28;
  }
  if (difficulty === "normal") {
    return 8;
  }
  return 0;
}

function difficultyMistakeChance(difficulty: AiDifficulty): number {
  if (difficulty === "easy") {
    return 0.28;
  }
  if (difficulty === "normal") {
    return 0.08;
  }
  return 0;
}

function withNoise(score: number, difficulty: AiDifficulty): number {
  const span = difficultyNoise(difficulty);
  if (span <= 0) {
    return score;
  }
  return score + (Math.random() * 2 - 1) * span;
}

/**
 * Enumerate legal actions using BattleManager queries only (no rule reimplementation).
 */
export function generateAiActions(
  battle: BattleManager,
  config: AiConfig,
): AiAction[] {
  const state = battle.getState();
  if (state.phase !== "playing" || state.currentPlayer !== config.playerId) {
    return [{ kind: "end_turn", score: 100 }];
  }

  const weights = getStrategyWeights(config.strategy);
  const actions: AiAction[] = [];
  const myUnits = state.units.filter((unit) => unit.owner === config.playerId);

  let pending = false;

  for (const unit of myUnits) {
    const definition = UnitSystem.get(unit.definitionId);
    if (!definition) {
      continue;
    }

    const attacks = battle.getLegalAttackTargetIds(unit.instanceId);
    if (attacks.length > 0) {
      pending = true;
    }
    for (const targetId of attacks) {
      const target = battle.getUnit(targetId);
      if (!target) {
        continue;
      }
      actions.push({
        kind: "attack",
        unitId: unit.instanceId,
        targetId,
        score: scoreAttack(state, unit, definition, target, weights),
      });
    }

    const abilityViews = AbilitySystem.listForUnit(state, unit).filter(
      (view) => view.usable,
    );
    if (abilityViews.length > 0) {
      pending = true;
    }
    for (const view of abilityViews) {
      const targets = battle.getLegalAbilityTargetIds(
        unit.instanceId,
        view.ability.id,
      );
      for (const targetId of targets) {
        const target = battle.getUnit(targetId);
        if (!target) {
          continue;
        }
        actions.push({
          kind: "ability",
          unitId: unit.instanceId,
          abilityId: view.ability.id,
          targetId,
          score: scoreAbility(state, unit, view.ability, target, weights),
        });
      }
    }

    const moves = battle.getLegalMovePositions(unit.instanceId);
    if (moves.length > 0) {
      pending = true;
    }
    for (const to of moves) {
      actions.push({
        kind: "move",
        unitId: unit.instanceId,
        to,
        score: scoreMove(
          state,
          unit,
          definition,
          to,
          weights,
          config.playerId,
        ),
      });
    }
  }

  actions.push({
    kind: "end_turn",
    score: scoreEndTurn(pending),
  });

  return actions;
}

/**
 * Pick one action: "What to do?"
 * Difficulty injects noise / occasional suboptimal picks — not rule changes.
 */
export function decideAiAction(
  battle: BattleManager,
  config: AiConfig,
): AiAction {
  const actions = generateAiActions(battle, config);
  if (actions.length === 0) {
    return { kind: "end_turn", score: 0 };
  }

  const ranked = [...actions]
    .filter((action) => action.kind !== "wait")
    .sort(
      (a, b) =>
        withNoise(b.score, config.difficulty) -
        withNoise(a.score, config.difficulty),
    );

  if (ranked.length === 0) {
    return { kind: "end_turn", score: 0 };
  }

  // Prefer ending turn over dithering when nothing looks worthwhile.
  const best = ranked[0]!;
  if (best.kind !== "end_turn" && best.score < 4) {
    return { kind: "end_turn", score: scoreEndTurn(false) };
  }

  if (
    Math.random() < difficultyMistakeChance(config.difficulty) &&
    ranked.length > 1
  ) {
    const pool = ranked.slice(0, Math.min(4, ranked.length));
    return pool[Math.floor(Math.random() * pool.length)]!;
  }

  // Hard: if an attack can kill enemy commander, force it
  if (config.difficulty === "hard") {
    const lethalCommander = actions.find((action) => {
      if (action.kind !== "attack") {
        return false;
      }
      const attacker = battle.getUnit(action.unitId);
      const target = battle.getUnit(action.targetId);
      const def = attacker
        ? UnitSystem.get(attacker.definitionId)
        : undefined;
      const targetDef = target
        ? UnitSystem.get(target.definitionId)
        : undefined;
      if (!attacker || !target || !def || targetDef?.type !== "commander") {
        return false;
      }
      return computeDamage(def, attacker, target) >= target.currentHp;
    });
    if (lethalCommander) {
      return lethalCommander;
    }
  }

  return best;
}

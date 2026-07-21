import type { AbilityDefinition } from "../ability/types";
import { chebyshev } from "../battle/boardManager";
import { computeDamage } from "../battle/combatSystem";
import type { BattleState, Position, UnitRuntime } from "../battle/types";
import { getEffectiveUnitStats } from "../battle/unitCombatStats";
import type { UnitDefinition } from "../armyBuilder/types";
import { findCommander } from "../battle/victorySystem";
import { UnitSystem } from "../unit/unitSystem";

import type { AiStrategyWeights } from "./types";

const catalogLookup = { getUnitById: (id: string) => UnitSystem.get(id) };

export function scoreAttack(
  _state: BattleState,
  attacker: UnitRuntime,
  attackerDef: UnitDefinition,
  target: UnitRuntime,
  weights: AiStrategyWeights,
): number {
  const damage = computeDamage(attackerDef, attacker, target);
  const kill = damage >= target.currentHp;
  const targetDef = UnitSystem.get(target.definitionId);
  const isCommander = targetDef?.type === "commander";

  let score = damage * 12 * weights.attack;
  if (kill) {
    score += 40 * weights.killBonus;
  }
  if (isCommander) {
    score += 55 * weights.commanderTarget;
  }
  // Prefer finishing wounded non-commanders too
  score += (1 - target.currentHp / Math.max(1, target.maxHp)) * 18;

  return score;
}

export function scoreAbility(
  _state: BattleState,
  caster: UnitRuntime,
  ability: AbilityDefinition,
  target: UnitRuntime,
  weights: AiStrategyWeights,
): number {
  const targetDef = UnitSystem.get(target.definitionId);
  const isCommander = targetDef?.type === "commander";
  const hpRatio = target.currentHp / Math.max(1, target.maxHp);

  let score = 8 * weights.ability;

  const hasHeal = ability.effects.some((effect) => effect.kind === "heal");
  const hasDamage = ability.effects.some((effect) => effect.kind === "damage");
  const hasBuff = ability.effects.some(
    (effect) =>
      effect.kind === "apply_status" &&
      (effect.statusId?.includes("armor") ?? false),
  );
  const hasControl = ability.effects.some(
    (effect) =>
      effect.kind === "apply_status" &&
      (effect.statusId?.includes("slow") ?? false),
  );

  if (hasHeal && target.owner === caster.owner) {
    const missing = target.maxHp - target.currentHp;
    score += missing * 8 * weights.heal;
    if (hpRatio < 0.5) {
      score += 25 * weights.heal;
    }
    if (isCommander) {
      score += 40 * weights.heal;
    }
  }

  if (hasBuff && target.owner === caster.owner) {
    score += 22 * weights.buff;
    if (isCommander) {
      score += 28 * weights.buff;
    }
  }

  if (hasDamage && target.owner !== caster.owner) {
    const bonus =
      ability.effects.find((effect) => effect.kind === "damage")?.value ?? 0;
    score += (20 + bonus * 10) * weights.attack;
    if (isCommander) {
      score += 45 * weights.commanderTarget;
    }
    if (bonus >= target.currentHp) {
      score += 35 * weights.killBonus;
    }
  }

  if (hasControl && target.owner !== caster.owner) {
    score += 18 * weights.control;
    if (isCommander) {
      score += 20 * weights.control;
    }
  }

  // Wrong-side misuse penalty (should be rare if legal targets filtered)
  if (hasHeal && target.owner !== caster.owner) {
    score -= 100;
  }

  return score;
}

export function scoreMove(
  state: BattleState,
  unit: UnitRuntime,
  unitDef: UnitDefinition,
  to: Position,
  weights: AiStrategyWeights,
  aiPlayerId: 0 | 1,
): number {
  const enemyId = aiPlayerId === 0 ? 1 : 0;
  const enemyCommander = findCommander(state.units, enemyId, catalogLookup);
  const ownCommander = findCommander(state.units, aiPlayerId, catalogLookup);
  const stats = getEffectiveUnitStats(unit, unitDef);

  let score = 1;

  if (enemyCommander) {
    const before = chebyshev(unit.position, enemyCommander.position);
    const after = chebyshev(to, enemyCommander.position);
    score += (before - after) * 10 * weights.approachEnemyCommander;
    // Prefer ending in attack range of enemy commander
    if (after <= stats.range) {
      score += 28 * weights.attack;
    }
  }

  if (ownCommander) {
    const after = chebyshev(to, ownCommander.position);
    // Defensive: stay close to own commander
    score += Math.max(0, 5 - after) * 8 * weights.guardOwnCommander;

    // If commander is threatened (enemy adjacent), move to screen
    const threatened = state.units.some(
      (enemy) =>
        enemy.owner === enemyId &&
        chebyshev(enemy.position, ownCommander.position) <= 2,
    );
    if (threatened) {
      score += Math.max(0, 4 - after) * 12 * weights.safety;
    }
  }

  // Mild preference for center control on tactical
  const centerX = (state.board.width - 1) / 2;
  const centerY = (state.board.height - 1) / 2;
  const centerDist = Math.max(
    Math.abs(to.x - centerX),
    Math.abs(to.y - centerY),
  );
  score += Math.max(0, 4 - centerDist) * 2 * weights.safety;

  return score;
}

export function scoreWait(): number {
  return 0.1;
}

export function scoreEndTurn(hasPendingActions: boolean): number {
  return hasPendingActions ? -5 : 15;
}

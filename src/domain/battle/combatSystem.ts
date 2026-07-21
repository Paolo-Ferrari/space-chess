import { sumStatusModifier } from "../ability/statusEffects";
import type { UnitDefinition } from "../armyBuilder/types";
import { BalanceSystem } from "../balance/balanceSystem";
import type { GameEvent } from "../events/gameEvents";
import { UnitSystem } from "../unit/unitSystem";

import { chebyshev } from "./boardManager";
import type { ApplyResult, BattleState, UnitRuntime } from "./types";
import { getEffectiveUnitStats } from "./unitCombatStats";

/**
 * Unified damage rule from Balance Config:
 * damage = max(minDamage, attack - catalogDefense * coeff - statusDefense)
 */
export function computeDamage(
  attackerDef: UnitDefinition,
  attacker: UnitRuntime,
  target: UnitRuntime,
  targetDef?: UnitDefinition,
): number {
  const combat = BalanceSystem.combat();
  const atkStats = getEffectiveUnitStats(attacker, attackerDef);
  const attack = atkStats.attack + sumStatusModifier(attacker, "attack");

  const resolvedTargetDef =
    targetDef ?? UnitSystem.get(target.definitionId);
  const catalogDefense = resolvedTargetDef
    ? getEffectiveUnitStats(target, resolvedTargetDef).defense *
      combat.catalogDefenseCoefficient
    : 0;

  const statusDefense = combat.includeStatusDefense
    ? sumStatusModifier(target, "defense")
    : 0;

  return Math.max(
    combat.minDamage,
    Math.floor(attack - catalogDefense - statusDefense),
  );
}

export function getLegalAttackTargets(
  state: BattleState,
  attacker: UnitRuntime,
  attackerDef: UnitDefinition,
): UnitRuntime[] {
  if (attacker.hasAttacked) {
    return [];
  }

  const range = Math.max(0, getEffectiveUnitStats(attacker, attackerDef).range);
  return state.units.filter((target) => {
    if (target.owner === attacker.owner) {
      return false;
    }
    return chebyshev(attacker.position, target.position) <= range;
  });
}

export function canAttack(
  state: BattleState,
  attacker: UnitRuntime,
  attackerDef: UnitDefinition,
  targetId: string,
): boolean {
  return getLegalAttackTargets(state, attacker, attackerDef).some(
    (target) => target.instanceId === targetId,
  );
}

export function applyAttack(
  state: BattleState,
  attackerId: string,
  targetId: string,
  damage: number,
): ApplyResult {
  const target = state.units.find((unit) => unit.instanceId === targetId);
  if (!target) {
    return { state, events: [] };
  }

  const nextHp = Math.max(0, target.currentHp - damage);
  const destroyed = nextHp <= 0;

  const units = destroyed
    ? state.units.filter((unit) => unit.instanceId !== targetId)
    : state.units.map((unit) =>
        unit.instanceId === targetId
          ? { ...unit, currentHp: nextHp }
          : unit,
      );

  const marked = units.map((unit) =>
    unit.instanceId === attackerId ? { ...unit, hasAttacked: true } : unit,
  );

  const events: GameEvent[] = [
    {
      type: "UnitAttacked",
      battleId: state.battleId,
      attackerId,
      targetId,
    },
    {
      type: "UnitDamaged",
      battleId: state.battleId,
      unitId: targetId,
      damage,
      remainingHp: nextHp,
    },
  ];

  if (destroyed) {
    events.push({
      type: "UnitDestroyed",
      battleId: state.battleId,
      unitId: targetId,
      definitionId: target.definitionId,
      owner: target.owner,
    });
  }

  return {
    state: { ...state, units: marked },
    events,
  };
}

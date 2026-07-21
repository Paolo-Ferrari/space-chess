import { getStatusById } from "../../data/catalog/abilities";
import { BalanceSystem } from "../balance/balanceSystem";
import { getEffectiveUnitStats } from "../battle/unitCombatStats";
import type { ApplyResult, BattleState, UnitRuntime } from "../battle/types";
import type { GameEvent } from "../events/gameEvents";
import { UnitSystem } from "../unit/unitSystem";

import { getEffectiveStat } from "./statusEffects";
import type { AbilityDefinition, EffectDefinition, StatusEffectInstance } from "./types";

function newStatusInstanceId(): string {
  return `status-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function mapUnit(
  state: BattleState,
  unitId: string,
  map: (unit: UnitRuntime) => UnitRuntime,
): BattleState {
  return {
    ...state,
    units: state.units.map((unit) =>
      unit.instanceId === unitId ? map(unit) : unit,
    ),
  };
}

function applyHeal(
  state: BattleState,
  targetId: string,
  amount: number,
  battleId: string,
): ApplyResult {
  const target = state.units.find((unit) => unit.instanceId === targetId);
  if (!target) {
    return { state, events: [] };
  }
  const nextHp = Math.min(target.maxHp, target.currentHp + amount);
  const healed = nextHp - target.currentHp;
  const next = mapUnit(state, targetId, (unit) => ({
    ...unit,
    currentHp: nextHp,
  }));
  const events: GameEvent[] = [
    {
      type: "UnitHealed",
      battleId,
      unitId: targetId,
      amount: healed,
      remainingHp: nextHp,
    },
  ];
  return { state: next, events };
}

function applyDamageEffect(
  state: BattleState,
  casterId: string,
  targetId: string,
  bonus: number,
  battleId: string,
): ApplyResult {
  const caster = state.units.find((unit) => unit.instanceId === casterId);
  const target = state.units.find((unit) => unit.instanceId === targetId);
  const casterDef = caster ? UnitSystem.get(caster.definitionId) : undefined;
  if (!caster || !target || !casterDef) {
    return { state, events: [] };
  }

  const combat = BalanceSystem.combat();
  const attack = getEffectiveStat(
    getEffectiveUnitStats(caster, casterDef).attack,
    caster,
    "attack",
  );
  const targetDef = UnitSystem.get(target.definitionId);
  const catalogDefense =
    combat.abilitiesUseCatalogDefense && targetDef
      ? getEffectiveUnitStats(target, targetDef).defense *
        combat.catalogDefenseCoefficient
      : 0;
  const statusDefense = combat.includeStatusDefense
    ? getEffectiveStat(0, target, "defense")
    : 0;
  const damage = Math.max(
    combat.minDamage,
    Math.floor(attack + bonus - catalogDefense - statusDefense),
  );
  const nextHp = Math.max(0, target.currentHp - damage);
  const destroyed = nextHp <= 0;

  let nextState: BattleState = {
    ...state,
    units: destroyed
      ? state.units.filter((unit) => unit.instanceId !== targetId)
      : state.units.map((unit) =>
          unit.instanceId === targetId
            ? { ...unit, currentHp: nextHp }
            : unit,
        ),
  };

  const events: GameEvent[] = [
    {
      type: "UnitAttacked",
      battleId,
      attackerId: casterId,
      targetId,
    },
    {
      type: "UnitDamaged",
      battleId,
      unitId: targetId,
      damage,
      remainingHp: nextHp,
    },
  ];

  if (destroyed) {
    events.push({
      type: "UnitDestroyed",
      battleId,
      unitId: targetId,
      definitionId: target.definitionId,
      owner: target.owner,
    });
  }

  return { state: nextState, events };
}

function applyStatusEffect(
  state: BattleState,
  targetId: string,
  effect: EffectDefinition,
  abilityId: string,
  battleId: string,
): ApplyResult {
  if (!effect.statusId) {
    return { state, events: [] };
  }
  const statusDef = getStatusById(effect.statusId);
  if (!statusDef) {
    return { state, events: [] };
  }

  const instance: StatusEffectInstance = {
    instanceId: newStatusInstanceId(),
    statusId: statusDef.id,
    sourceAbilityId: abilityId,
    remainingTurns: effect.durationTurns ?? 1,
    modifiers: { ...statusDef.modifiers },
  };

  const next = mapUnit(state, targetId, (unit) => ({
    ...unit,
    statusEffects: [
      ...unit.statusEffects.filter((s) => s.statusId !== instance.statusId),
      instance,
    ],
  }));

  const events: GameEvent[] = [
    {
      type: "StatusApplied",
      battleId,
      unitId: targetId,
      statusId: instance.statusId,
      abilityId,
      remainingTurns: instance.remainingTurns,
    },
  ];

  return { state: next, events };
}

function applyEffect(
  state: BattleState,
  casterId: string,
  targetId: string,
  ability: AbilityDefinition,
  effect: EffectDefinition,
): ApplyResult {
  switch (effect.kind) {
    case "heal":
      return applyHeal(state, targetId, effect.value, state.battleId);
    case "damage":
      return applyDamageEffect(
        state,
        casterId,
        targetId,
        effect.value,
        state.battleId,
      );
    case "apply_status":
      return applyStatusEffect(
        state,
        targetId,
        effect,
        ability.id,
        state.battleId,
      );
    case "modify_stat":
      // Immediate permanent-ish via status with duration -1
      return applyStatusEffect(
        state,
        targetId,
        {
          kind: "apply_status",
          value: effect.value,
          statusId: effect.statusId,
          durationTurns: effect.durationTurns ?? -1,
        },
        ability.id,
        state.battleId,
      );
    default:
      return { state, events: [] };
  }
}

/**
 * Apply a manually activated ability (active / support).
 */
export function applyAbility(
  state: BattleState,
  casterId: string,
  targetId: string,
  ability: AbilityDefinition,
): ApplyResult {
  let nextState = state;
  const events: GameEvent[] = [
    {
      type: "AbilityUsed",
      battleId: state.battleId,
      casterId,
      targetId,
      abilityId: ability.id,
    },
  ];

  for (const effect of ability.effects) {
    const applied = applyEffect(nextState, casterId, targetId, ability, effect);
    nextState = applied.state;
    events.push(...applied.events);
  }

  nextState = mapUnit(nextState, casterId, (unit) => ({
    ...unit,
    hasUsedAbility: ability.oncePerTurn ? true : unit.hasUsedAbility,
  }));

  return { state: nextState, events };
}

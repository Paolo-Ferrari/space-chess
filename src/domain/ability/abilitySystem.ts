import {
  getAbilityById,
  getStatusById,
  listAbilities,
  listStatuses,
} from "../../data/catalog/abilities";
import type { BattleState } from "../battle/types";
import type { GameEvent } from "../events/gameEvents";

import { applyAbility } from "./applyAbility";
import {
  ABILITY_REJECT_MESSAGES,
  canUseAbility,
  listUnitAbilityIds,
  listUnitAbilityViews,
} from "./canUseAbility";
import { getLegalAbilityTargets } from "./targeting";
import type { AbilityDefinition, StatusEffectInstance } from "./types";

function newStatusInstanceId(): string {
  return `status-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Public facade — Battle / UI talk to AbilitySystem, not effect internals.
 */
export const AbilitySystem = {
  list: listAbilities,
  get: getAbilityById,
  listStatuses,
  getStatus: getStatusById,
  canUse: canUseAbility,
  listForUnit: listUnitAbilityViews,
  getLegalTargets: getLegalAbilityTargets,
  rejectMessage: (reason: keyof typeof ABILITY_REJECT_MESSAGES) =>
    ABILITY_REJECT_MESSAGES[reason],

  applyManual(
    state: BattleState,
    casterId: string,
    abilityId: string,
    targetId: string,
  ) {
    const caster = state.units.find((unit) => unit.instanceId === casterId);
    if (!caster) {
      return {
        ok: false as const,
        reason: "not_on_unit" as const,
        state,
        events: [] as GameEvent[],
      };
    }
    const check = canUseAbility(state, caster, abilityId, targetId);
    if (!check.ok || !check.ability) {
      return {
        ok: false as const,
        reason: check.reason ?? ("unknown_ability" as const),
        state,
        events: [] as GameEvent[],
      };
    }
    const applied = applyAbility(state, casterId, targetId, check.ability);
    return {
      ok: true as const,
      state: applied.state,
      events: applied.events,
      ability: check.ability,
    };
  },

  /**
   * Apply passive abilities at battle start (kind === passive).
   * Trigger abilities are reserved for event hooks (onDamaged, …).
   */
  applyPassivesOnBattleStart(state: BattleState): {
    state: BattleState;
    events: GameEvent[];
  } {
    let next = state;
    const events: GameEvent[] = [];

    for (const unit of state.units) {
      for (const abilityId of listUnitAbilityIds(unit)) {
        const ability = getAbilityById(abilityId);
        if (!ability || ability.kind !== "passive") {
          continue;
        }
        for (const effect of ability.effects) {
          if (effect.kind !== "apply_status" || !effect.statusId) {
            continue;
          }
          const statusDef = getStatusById(effect.statusId);
          if (!statusDef) {
            continue;
          }
          const instance: StatusEffectInstance = {
            instanceId: newStatusInstanceId(),
            statusId: statusDef.id,
            sourceAbilityId: ability.id,
            remainingTurns: effect.durationTurns ?? -1,
            modifiers: { ...statusDef.modifiers },
          };
          next = {
            ...next,
            units: next.units.map((u) =>
              u.instanceId === unit.instanceId
                ? {
                    ...u,
                    statusEffects: [...u.statusEffects, instance],
                  }
                : u,
            ),
          };
          events.push({
            type: "StatusApplied",
            battleId: state.battleId,
            unitId: unit.instanceId,
            statusId: instance.statusId,
            abilityId: ability.id,
            remainingTurns: instance.remainingTurns,
          });
        }
      }
    }

    return { state: next, events };
  },

  /**
   * Hook for trigger abilities (e.g. onDamaged). Empty until catalog has triggers.
   */
  processTriggers(
    state: BattleState,
    _trigger: NonNullable<AbilityDefinition["trigger"]>,
    _sourceUnitId: string,
  ): { state: BattleState; events: GameEvent[] } {
    return { state, events: [] };
  },
};

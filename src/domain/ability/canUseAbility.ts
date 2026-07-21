import type { BattleState, UnitRuntime } from "../battle/types";
import { CommanderSystem } from "../commander/commanderSystem";
import { UnitSystem } from "../unit/unitSystem";

import { getAbilityById } from "../../data/catalog/abilities";

import { getLegalAbilityTargets } from "./targeting";
import type { AbilityDefinition } from "./types";

export type AbilityUseReject =
  | "unknown_ability"
  | "not_on_unit"
  | "wrong_owner"
  | "not_own_turn"
  | "already_used"
  | "passive_or_trigger"
  | "battle_ended"
  | "no_legal_target"
  | "invalid_target";

export interface CanUseAbilityResult {
  ok: boolean;
  reason?: AbilityUseReject;
  ability?: AbilityDefinition;
}

export const ABILITY_REJECT_MESSAGES: Record<AbilityUseReject, string> = {
  unknown_ability: "Способность не найдена",
  not_on_unit: "У юнита нет этой способности",
  wrong_owner: "Чужой юнит",
  not_own_turn: "Сейчас не ваш ход",
  already_used: "Способность уже использована в этом ходу",
  passive_or_trigger: "Нельзя активировать вручную",
  battle_ended: "Матч завершён",
  no_legal_target: "Нет доступных целей",
  invalid_target: "Недопустимая цель",
};

export function listUnitAbilityIds(unit: UnitRuntime): string[] {
  const catalog = UnitSystem.get(unit.definitionId)?.abilities ?? [];
  const fromImplants = CommanderSystem.getGrantedAbilityIds(
    unit.implantIds ?? [],
  );
  return [...new Set([...catalog, ...fromImplants])];
}

export function unitHasAbility(unit: UnitRuntime, abilityId: string): boolean {
  return listUnitAbilityIds(unit).includes(abilityId);
}

export function canUseAbility(
  state: BattleState,
  caster: UnitRuntime,
  abilityId: string,
  targetId?: string | null,
): CanUseAbilityResult {
  if (state.phase !== "playing") {
    return { ok: false, reason: "battle_ended" };
  }

  const ability = getAbilityById(abilityId);
  if (!ability) {
    return { ok: false, reason: "unknown_ability" };
  }

  if (!unitHasAbility(caster, abilityId)) {
    return { ok: false, reason: "not_on_unit", ability };
  }

  if (caster.owner !== state.currentPlayer) {
    return { ok: false, reason: "wrong_owner", ability };
  }

  if (ability.kind === "passive" || ability.kind === "trigger") {
    return { ok: false, reason: "passive_or_trigger", ability };
  }

  if (ability.oncePerTurn && caster.hasUsedAbility) {
    return { ok: false, reason: "already_used", ability };
  }

  const legal = getLegalAbilityTargets(state, caster, ability);
  if (legal.length === 0) {
    return { ok: false, reason: "no_legal_target", ability };
  }

  if (targetId) {
    if (!legal.some((target) => target.instanceId === targetId)) {
      return { ok: false, reason: "invalid_target", ability };
    }
  }

  return { ok: true, ability };
}

export function listUnitAbilityViews(
  state: BattleState,
  caster: UnitRuntime | undefined,
): Array<{
  ability: AbilityDefinition;
  usable: boolean;
  reason?: AbilityUseReject;
}> {
  if (!caster) {
    return [];
  }

  return listUnitAbilityIds(caster)
    .map((id) => getAbilityById(id))
    .filter((ability): ability is AbilityDefinition => Boolean(ability))
    .map((ability) => {
      const check = canUseAbility(state, caster, ability.id);
      return {
        ability,
        usable: check.ok,
        reason: check.reason,
      };
    });
}

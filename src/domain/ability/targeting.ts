import { chebyshev } from "../battle/boardManager";
import type { BattleState, UnitRuntime } from "../battle/types";

import type { AbilityDefinition, TargetKind } from "./types";

export function isValidTargetRelation(
  caster: UnitRuntime,
  target: UnitRuntime,
  kind: TargetKind,
): boolean {
  switch (kind) {
    case "self":
      return caster.instanceId === target.instanceId;
    case "ally":
      return caster.owner === target.owner;
    case "enemy":
      return caster.owner !== target.owner;
    case "area":
      return true;
    default:
      return false;
  }
}

export function getLegalAbilityTargets(
  state: BattleState,
  caster: UnitRuntime,
  ability: AbilityDefinition,
): UnitRuntime[] {
  if (ability.kind === "passive" || ability.kind === "trigger") {
    return [];
  }

  return state.units.filter((target) => {
    if (!isValidTargetRelation(caster, target, ability.target)) {
      return false;
    }
    if (ability.range === 0) {
      return target.instanceId === caster.instanceId;
    }
    return chebyshev(caster.position, target.position) <= ability.range;
  });
}

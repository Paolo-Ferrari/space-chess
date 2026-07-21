/**
 * Ability System — data contracts.
 * Units only store ability ids; logic lives in AbilitySystem + effect appliers.
 */

export type AbilityKind =
  | "passive"
  | "active"
  | "trigger"
  | "support";

export type TargetKind = "self" | "ally" | "enemy" | "area";

export type EffectKind =
  | "heal"
  | "damage"
  | "modify_stat"
  | "apply_status";

export type ModifiableStat = "attack" | "defense" | "movement";

export type AbilityTrigger =
  | "onDamaged"
  | "onAttack"
  | "onTurnStart"
  | "onBattleStart";

export interface AbilityCondition {
  /** Extensible condition tags — evaluated by AbilitySystem, not Unit. */
  type: "requires_alive" | "requires_own_turn" | "target_not_self";
}

export interface EffectDefinition {
  kind: EffectKind;
  /** Heal amount, bonus damage, or stat delta. */
  value: number;
  stat?: ModifiableStat;
  /** Status catalog id when kind === apply_status */
  statusId?: string;
  /** Turns for status; omit / -1 = permanent (passives). */
  durationTurns?: number;
}

export interface AbilityDefinition {
  id: string;
  name: string;
  description: string;
  kind: AbilityKind;
  /** Action points / once-flag cost marker (v1: 1 = uses ability slot this turn). */
  actionCost: number;
  oncePerTurn: boolean;
  /** Chebyshev range; 0 = self only. */
  range: number;
  target: TargetKind;
  effects: EffectDefinition[];
  trigger?: AbilityTrigger;
  conditions?: AbilityCondition[];
}

/** Catalog status template (static). */
export interface StatusDefinition {
  id: string;
  name: string;
  description: string;
  modifiers: Partial<Record<ModifiableStat, number>>;
}

/** Runtime status on a unit. */
export interface StatusEffectInstance {
  instanceId: string;
  statusId: string;
  sourceAbilityId: string;
  /** -1 = permanent */
  remainingTurns: number;
  modifiers: Partial<Record<ModifiableStat, number>>;
}

export const ABILITY_KIND_LABELS: Record<AbilityKind, string> = {
  passive: "Пассивная",
  active: "Активная",
  trigger: "Триггер",
  support: "Поддержка",
};

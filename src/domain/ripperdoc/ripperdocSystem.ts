import {
  getRipperdocByFactionId,
  getRipperdocById,
  getRipperdocByUnitId,
  listRipperdocs,
} from "../../data/catalog/ripperdocs";
import { AbilitySystem } from "../ability/abilitySystem";
import type { UnitDefinition } from "../armyBuilder/types";
import type { UnitRuntime } from "../battle/types";
import { UnitSystem } from "../unit/unitSystem";

import type {
  RipperdocActionKind,
  RipperdocActionSlot,
  RipperdocDefinition,
} from "./types";
import { RIPPERDOC_ACTION_LABELS } from "./types";

export interface RipperdocActionView {
  slot: RipperdocActionSlot;
  kindLabel: string;
  /** Resolved ability when slot.abilityId is set. */
  abilityName: string | null;
  implemented: boolean;
}

/**
 * Ripperdoc System — faction support kits on top of Unit + Ability System.
 */
export const RipperdocSystem = {
  list: listRipperdocs,
  get: getRipperdocById,
  getByUnitId: getRipperdocByUnitId,
  getByFactionId: getRipperdocByFactionId,

  actionLabel(kind: RipperdocActionKind): string {
    return RIPPERDOC_ACTION_LABELS[kind];
  },

  isRipperdocUnit(definition: UnitDefinition | undefined): boolean {
    if (!definition) {
      return false;
    }
    if (definition.type === "ripperdoc") {
      return true;
    }
    return Boolean(getRipperdocByUnitId(definition.id));
  },

  isRipperdocRuntime(unit: UnitRuntime | undefined): boolean {
    if (!unit) {
      return false;
    }
    return this.isRipperdocUnit(UnitSystem.get(unit.definitionId));
  },

  profileForUnit(
    definitionId: string,
  ): RipperdocDefinition | undefined {
    return getRipperdocByUnitId(definitionId);
  },

  supportRadius(definitionId: string): number | null {
    return getRipperdocByUnitId(definitionId)?.supportRadius ?? null;
  },

  /** Ability ids that this Ripperdoc can actually cast today. */
  implementedAbilityIds(definitionId: string): string[] {
    const profile = getRipperdocByUnitId(definitionId);
    if (!profile) {
      return [];
    }
    return profile.actions
      .map((slot) => slot.abilityId)
      .filter((id): id is string => Boolean(id));
  },

  listActionViews(definitionId: string): RipperdocActionView[] {
    const profile = getRipperdocByUnitId(definitionId);
    if (!profile) {
      return [];
    }
    return profile.actions.map((slot) => ({
      slot,
      kindLabel: RIPPERDOC_ACTION_LABELS[slot.kind],
      abilityName: slot.abilityId
        ? (AbilitySystem.get(slot.abilityId)?.name ?? slot.abilityId)
        : null,
      implemented: Boolean(slot.abilityId),
    }));
  },

  /**
   * Ensures unit.abilities includes implemented ripperdoc action abilities.
   * Call from catalog validation / tests — does not mutate catalog at runtime.
   */
  assertKitAligned(definitionId: string): string[] {
    const unit = UnitSystem.get(definitionId);
    const profile = getRipperdocByUnitId(definitionId);
    if (!unit || !profile) {
      return ["missing_unit_or_profile"];
    }
    const missing: string[] = [];
    for (const abilityId of this.implementedAbilityIds(definitionId)) {
      if (!unit.abilities.includes(abilityId)) {
        missing.push(abilityId);
      }
    }
    return missing;
  },
};

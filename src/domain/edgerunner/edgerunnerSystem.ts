import {
  getEdgerunnerProfileById,
  getEdgerunnerProfileByUnitId,
  listEdgerunnerProfiles,
  listEdgerunnerUnits,
} from "../../data/catalog/edgerunners";
import { getAbilityById } from "../../data/catalog/abilities";
import type { UnitDefinition } from "../armyBuilder/types";
import { UnitSystem } from "../unit/unitSystem";

import { BalanceSystem } from "../balance/balanceSystem";

import {
  ARMY_MAX_EDGERUNNERS,
  EDGERUNNER_POOL_ID,
  EDGERUNNER_ROLE_LABELS,
  type EdgerunnerDefinition,
  type EdgerunnerRole,
} from "./types";

export type EdgerunnerHireReject =
  | "unknown_edgerunner"
  | "unavailable"
  | "limit_reached"
  | "already_hired"
  | "energy_exceeded"
  | "slots_exceeded"
  | "edgerunners_only_blocked";

export const EDGERUNNER_HIRE_MESSAGES: Record<EdgerunnerHireReject, string> = {
  unknown_edgerunner: "Наёмник не найден",
  unavailable: "Наёмник недоступен",
  limit_reached: `Лимит наёмников: максимум ${ARMY_MAX_EDGERUNNERS}`,
  already_hired: "Этот наёмник уже в армии",
  energy_exceeded: "Не хватает энергии",
  slots_exceeded: "Нет свободных слотов",
  edgerunners_only_blocked: "Армия не может состоять только из наёмников",
};

/**
 * Edgerunner System — neutral hire pool for any faction army.
 * New hires = catalog only; do not edit this facade for content.
 */
export const EdgerunnerSystem = {
  poolId: EDGERUNNER_POOL_ID,
  get maxPerArmy() {
    return BalanceSystem.config.army.maxEdgerunners ?? ARMY_MAX_EDGERUNNERS;
  },
  listProfiles: listEdgerunnerProfiles,
  listUnits: listEdgerunnerUnits,
  getProfile: getEdgerunnerProfileById,
  getProfileByUnitId: getEdgerunnerProfileByUnitId,
  roleLabel: (role: EdgerunnerRole) => EDGERUNNER_ROLE_LABELS[role],

  isEdgerunnerUnit(definition: UnitDefinition | undefined): boolean {
    if (!definition) {
      return false;
    }
    return (
      definition.type === "edgerunner" ||
      definition.factionId === EDGERUNNER_POOL_ID ||
      Boolean(getEdgerunnerProfileByUnitId(definition.id))
    );
  },

  /** Unit may join this army faction (faction units or neutral pool). */
  isCompatibleWithFaction(
    definition: UnitDefinition,
    factionId: string,
  ): boolean {
    if (this.isEdgerunnerUnit(definition)) {
      return true;
    }
    return definition.factionId === factionId;
  },

  countInArmy(
    unitIds: readonly string[],
    getUnit: (id: string) => UnitDefinition | undefined = UnitSystem.get,
  ): number {
    return unitIds.reduce((count, id) => {
      const unit = getUnit(id);
      return this.isEdgerunnerUnit(unit) ? count + 1 : count;
    }, 0);
  },

  listHired(
    unitIds: readonly string[],
    getUnit: (id: string) => UnitDefinition | undefined = UnitSystem.get,
  ): UnitDefinition[] {
    return unitIds
      .map((id) => getUnit(id))
      .filter((unit): unit is UnitDefinition =>
        Boolean(unit && this.isEdgerunnerUnit(unit)),
      );
  },

  listAvailableForHire(): Array<{
    profile: EdgerunnerDefinition;
    unit: UnitDefinition;
  }> {
    const result: Array<{
      profile: EdgerunnerDefinition;
      unit: UnitDefinition;
    }> = [];
    for (const profile of listEdgerunnerProfiles()) {
      if (!profile.available) {
        continue;
      }
      const unit = UnitSystem.get(profile.unitDefinitionId);
      if (unit) {
        result.push({ profile, unit });
      }
    }
    return result;
  },

  abilityViews(unitDefinitionId: string) {
    const unit = UnitSystem.get(unitDefinitionId);
    if (!unit) {
      return [];
    }
    return unit.abilities
      .map((id) => getAbilityById(id))
      .filter(Boolean);
  },

  /**
   * Soft check used by UI; energy/slots still validated via army canAddUnit.
   */
  canHire(
    unitIds: readonly string[],
    unitDefinitionId: string,
    getUnit: (id: string) => UnitDefinition | undefined = UnitSystem.get,
  ): { ok: boolean; reason?: EdgerunnerHireReject } {
    const unit = getUnit(unitDefinitionId);
    const profile = getEdgerunnerProfileByUnitId(unitDefinitionId);
    if (!unit || !this.isEdgerunnerUnit(unit) || !profile) {
      return { ok: false, reason: "unknown_edgerunner" };
    }
    if (!profile.available) {
      return { ok: false, reason: "unavailable" };
    }
    if (unitIds.includes(unitDefinitionId)) {
      return { ok: false, reason: "already_hired" };
    }
    if (this.countInArmy(unitIds, getUnit) >= this.maxPerArmy) {
      return { ok: false, reason: "limit_reached" };
    }
    return { ok: true };
  },
};

import {
  getLegendaryModuleById,
  getLegendaryProfileByUnitId,
  listLegendaryModules,
  listLegendaryProfiles,
  listModulesForProfile,
} from "../../data/catalog/legendary";
import type { UnitDefinition, UnitStats } from "../armyBuilder/types";
import { BalanceSystem } from "../balance/balanceSystem";
import { UnitSystem } from "../unit/unitSystem";

import {
  LEGENDARY_MODULE_CATEGORY_LABELS,
  type LegendaryModuleDefinition,
} from "./types";

export type LegendaryModuleReject =
  | "unknown_module"
  | "no_legendary"
  | "not_legendary_unit"
  | "slots_exceeded"
  | "category_blocked"
  | "already_installed";

export const LEGENDARY_MODULE_REJECT_MESSAGES: Record<
  LegendaryModuleReject,
  string
> = {
  unknown_module: "Модуль не найден",
  no_legendary: "Сначала разместите легендарного юнита",
  not_legendary_unit: "Модули только для легендарного профиля",
  slots_exceeded: "Не хватает слотов модулей",
  category_blocked: "Категория недоступна этому профилю",
  already_installed: "Уже установлен",
};

function sumSlotCost(moduleIds: readonly string[]): number {
  return moduleIds.reduce((total, id) => {
    const mod = getLegendaryModuleById(id);
    return total + (mod?.slotCost ?? 0);
  }, 0);
}

function mergeStats(
  base: UnitStats,
  mods: LegendaryModuleDefinition["statMods"],
): UnitStats {
  return {
    hp: Math.max(1, base.hp + (mods.hp ?? 0)),
    attack: Math.max(0, base.attack + (mods.attack ?? 0)),
    defense: Math.max(0, base.defense + (mods.defense ?? 0)),
    movement: Math.max(0, base.movement + (mods.movement ?? 0)),
    range: Math.max(0, base.range + (mods.range ?? 0)),
  };
}

/**
 * Legendary customization facade — Adam Smasher and future unique heroes.
 * Content stays in catalog; do not hardcode balance here.
 */
export const LegendarySystem = {
  listProfiles: listLegendaryProfiles,
  listModules: listLegendaryModules,
  getProfileByUnitId: getLegendaryProfileByUnitId,
  getModule: getLegendaryModuleById,
  listModulesForUnit: listModulesForProfile,
  categoryLabel: (category: LegendaryModuleDefinition["category"]) =>
    LEGENDARY_MODULE_CATEGORY_LABELS[category],

  isLegendaryUnit(definition: UnitDefinition | undefined): boolean {
    if (!definition) {
      return false;
    }
    return (
      definition.type === "legendary" ||
      Boolean(getLegendaryProfileByUnitId(definition.id))
    );
  },

  hasCustomizer(unitDefinitionId: string): boolean {
    return Boolean(getLegendaryProfileByUnitId(unitDefinitionId));
  },

  slotCapacity(unitDefinitionId: string): number {
    return getLegendaryProfileByUnitId(unitDefinitionId)?.moduleSlots ?? 0;
  },

  slotsUsed(moduleIds: readonly string[]): number {
    return sumSlotCost(moduleIds);
  },

  getEffectiveStats(
    unitDefinitionId: string,
    moduleIds: readonly string[],
  ): UnitStats | undefined {
    const base = UnitSystem.get(unitDefinitionId);
    if (!base) {
      return undefined;
    }
    const merged = moduleIds.reduce((stats, id) => {
      const mod = getLegendaryModuleById(id);
      return mod ? mergeStats(stats, mod.statMods) : stats;
    }, { ...base.stats });
    const profile = getLegendaryProfileByUnitId(unitDefinitionId);
    if (!profile) {
      return merged;
    }
    return BalanceSystem.clampLegendaryMods(profile.id, base.stats, merged);
  },

  canInstall(
    legendaryUnitId: string | null,
    currentModuleIds: readonly string[],
    moduleId: string,
  ): { ok: boolean; reason?: LegendaryModuleReject } {
    const module = getLegendaryModuleById(moduleId);
    if (!module) {
      return { ok: false, reason: "unknown_module" };
    }
    if (!legendaryUnitId) {
      return { ok: false, reason: "no_legendary" };
    }
    const profile = getLegendaryProfileByUnitId(legendaryUnitId);
    if (!profile) {
      return { ok: false, reason: "not_legendary_unit" };
    }
    if (!profile.allowedCategories.includes(module.category)) {
      return { ok: false, reason: "category_blocked" };
    }
    if (currentModuleIds.includes(moduleId)) {
      return { ok: false, reason: "already_installed" };
    }
    if (
      sumSlotCost(currentModuleIds) + module.slotCost >
      profile.moduleSlots
    ) {
      return { ok: false, reason: "slots_exceeded" };
    }
    return { ok: true };
  },

  validateLoadout(
    legendaryUnitId: string | null,
    moduleIds: readonly string[],
  ): { ok: boolean; codes: LegendaryModuleReject[] } {
    const codes: LegendaryModuleReject[] = [];
    if (moduleIds.length === 0) {
      return { ok: true, codes };
    }
    if (!legendaryUnitId) {
      return { ok: false, codes: ["no_legendary"] };
    }
    const profile = getLegendaryProfileByUnitId(legendaryUnitId);
    if (!profile) {
      return { ok: false, codes: ["not_legendary_unit"] };
    }
    if (sumSlotCost(moduleIds) > profile.moduleSlots) {
      codes.push("slots_exceeded");
    }
    for (const id of moduleIds) {
      const module = getLegendaryModuleById(id);
      if (!module) {
        codes.push("unknown_module");
        continue;
      }
      if (!profile.allowedCategories.includes(module.category)) {
        codes.push("category_blocked");
      }
    }
    return { ok: codes.length === 0, codes: [...new Set(codes)] };
  },
};

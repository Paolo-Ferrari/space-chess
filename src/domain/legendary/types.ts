/**
 * Legendary customization — separate from universal Commander implants.
 * Profiles (e.g. Adam Smasher) declare slot budgets and allowed module categories.
 */

import type { ImplantStatMods } from "../commander/types";

export type LegendaryModuleCategory =
  | "combat_cyber"
  | "weapon_system"
  | "armor_upgrade"
  | "body_enhancement";

export const LEGENDARY_MODULE_CATEGORY_LABELS: Record<
  LegendaryModuleCategory,
  string
> = {
  combat_cyber: "Боевые кибермодули",
  weapon_system: "Оружейные системы",
  armor_upgrade: "Броневые улучшения",
  body_enhancement: "Усиление тела",
};

export interface LegendaryModuleDefinition {
  id: string;
  name: string;
  description: string;
  category: LegendaryModuleCategory;
  slotCost: number;
  statMods: ImplantStatMods;
  abilityIds: string[];
}

export interface LegendaryProfile {
  id: string;
  unitDefinitionId: string;
  name: string;
  description: string;
  /** Total module slots (not commander implant slots). */
  moduleSlots: number;
  allowedCategories: LegendaryModuleCategory[];
}

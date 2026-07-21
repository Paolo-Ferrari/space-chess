/**
 * Balance Config — single source of tunable numbers for CyberChess: Overclock Protocol.
 * Change costs / HP / combat rules HERE. Game systems resolve through BalanceSystem.
 *
 * Do not scatter magic numbers in combat or UI code.
 */

import type { UnitStats } from "../../domain/armyBuilder/types";
import type { ImplantStatMods } from "../../domain/commander/types";

/** Combat role for cost framing & UI. */
export type BalanceRole =
  | "commander"
  | "infantry"
  | "heavy"
  | "scout"
  | "support"
  | "legendary"
  | "edgerunner"
  | "special";

export interface ArmyBalance {
  /** Combat Capacity — army energy budget. */
  combatCapacity: number;
  maxSlots: number;
  maxEdgerunners: number;
  maxLegendary: number;
  /** Soft warning when energy exceeds this % of capacity. */
  warnAtPercent: number;
}

export interface CombatBalance {
  /** Portion of catalog Defense subtracted from damage (0 = ignore DEF). */
  catalogDefenseCoefficient: number;
  minDamage: number;
  /** Status defense still stacks on top. */
  includeStatusDefense: boolean;
  /** Ability damage uses same defense rule. */
  abilitiesUseCatalogDefense: boolean;
  maxTurnsSoftCap: number;
}

export interface ImplantBalanceRules {
  /** Max total HP gained from commander implants. */
  maxHpFromImplants: number;
  /** Max total attack gained from commander implants. */
  maxAttackFromImplants: number;
  /** Max total defense gained from commander implants. */
  maxDefenseFromImplants: number;
  /** Extra Combat Capacity spent per installed implant (by implant id). */
  energyTaxByImplantId: Record<string, number>;
}

export interface LegendaryBalanceRules {
  /** Max combat modules on a legendary customizer. */
  defaultModuleSlots: number;
  /** Extra Combat Capacity tax per installed legendary module. */
  energyTaxPerModule: number;
  /** Adam Smasher / profile-specific caps. */
  profileOverrides: Record<
    string,
    {
      moduleSlots?: number;
      maxAttackFromModules?: number;
      maxHpFromModules?: number;
    }
  >;
}

export interface UnitBalanceOverride {
  cost?: number;
  stats?: Partial<UnitStats>;
  role?: BalanceRole;
}

export interface FactionBalanceProfile {
  id: string;
  strengths: string[];
  weaknesses: string[];
  /** Multipliers applied after unit overrides (1 = none). */
  costMultiplier?: number;
  statMods?: Partial<UnitStats>;
}

export interface CostFormulaWeights {
  hp: number;
  attack: number;
  defense: number;
  movement: number;
  range: number;
  ability: number;
  uniqueness: Record<BalanceRole, number>;
}

export interface CommanderStylePreset {
  id: string;
  name: string;
  description: string;
  implantIds: string[];
}

export interface BalanceConfig {
  version: string;
  army: ArmyBalance;
  combat: CombatBalance;
  implants: ImplantBalanceRules;
  legendary: LegendaryBalanceRules;
  costFormula: CostFormulaWeights;
  /** Per-unit overrides (id → patch). */
  units: Record<string, UnitBalanceOverride>;
  /** Per-implant stat/slot patches. */
  implantsById: Record<
    string,
    {
      slotCost?: number;
      statMods?: ImplantStatMods;
      energyTax?: number;
    }
  >;
  /** Per legendary module patches. */
  legendaryModulesById: Record<
    string,
    {
      slotCost?: number;
      statMods?: ImplantStatMods;
    }
  >;
  factions: Record<string, FactionBalanceProfile>;
  commanderStyles: CommanderStylePreset[];
  /** Map UnitType → default BalanceRole when override.role omitted. */
  typeToRole: Record<string, BalanceRole>;
}

export const BALANCE_CONFIG: BalanceConfig = {
  version: "2026.07.21-balance-v1",

  army: {
    combatCapacity: 100,
    maxSlots: 16,
    maxEdgerunners: 2,
    maxLegendary: 1,
    warnAtPercent: 90,
  },

  combat: {
    catalogDefenseCoefficient: 0.5,
    minDamage: 1,
    includeStatusDefense: true,
    abilitiesUseCatalogDefense: true,
    maxTurnsSoftCap: 80,
  },

  implants: {
    maxHpFromImplants: 4,
    maxAttackFromImplants: 3,
    maxDefenseFromImplants: 3,
    energyTaxByImplantId: {
      "implant-reinforced-armor": 2,
      "implant-combat-module": 3,
      "implant-optic-system": 2,
      "implant-neural-accelerator": 2,
    },
  },

  legendary: {
    defaultModuleSlots: 3,
    energyTaxPerModule: 2,
    profileOverrides: {
      "legendary-adam-smasher": {
        moduleSlots: 3,
        maxAttackFromModules: 3,
        maxHpFromModules: 4,
      },
    },
  },

  costFormula: {
    hp: 0.9,
    attack: 2.2,
    defense: 1.4,
    movement: 3.5,
    range: 3.0,
    ability: 2.5,
    uniqueness: {
      commander: 8,
      infantry: 0,
      heavy: 4,
      scout: 2,
      support: 3,
      legendary: 12,
      edgerunner: 3,
      special: 2,
    },
  },

  typeToRole: {
    commander: "commander",
    ripperdoc: "support",
    regular: "infantry",
    special: "special",
    legendary: "legendary",
    edgerunner: "edgerunner",
  },

  units: {
    // —— Arasaka: quality, high cost ——
    "arasaka-commander": {
      cost: 28,
      stats: { hp: 13, attack: 5, defense: 5, movement: 1, range: 1 },
      role: "commander",
    },
    "arasaka-ripperdoc": {
      cost: 18,
      stats: { hp: 8, attack: 2, defense: 4, movement: 1, range: 1 },
      role: "support",
    },
    "arasaka-soldier": {
      cost: 11,
      stats: { hp: 8, attack: 4, defense: 3, movement: 1, range: 1 },
      role: "infantry",
    },
    "arasaka-elite": {
      cost: 17,
      stats: { hp: 10, attack: 5, defense: 4, movement: 1, range: 1 },
      role: "infantry",
    },
    "arasaka-cyber-ninja": {
      cost: 19,
      stats: { hp: 7, attack: 6, defense: 2, movement: 2, range: 1 },
      role: "scout",
    },
    "arasaka-heavy": {
      cost: 23,
      stats: { hp: 14, attack: 6, defense: 5, movement: 1, range: 1 },
      role: "heavy",
    },
    "arasaka-recon": {
      cost: 13,
      stats: { hp: 6, attack: 3, defense: 2, movement: 2, range: 2 },
      role: "scout",
    },
    "arasaka-adam-smasher": {
      cost: 42,
      stats: { hp: 16, attack: 7, defense: 5, movement: 1, range: 1 },
      role: "legendary",
    },

    // —— Militech: hardware, slow ——
    "militech-commander": {
      cost: 27,
      stats: { hp: 14, attack: 5, defense: 6, movement: 1, range: 1 },
      role: "commander",
    },
    "militech-ripperdoc": {
      cost: 17,
      stats: { hp: 9, attack: 2, defense: 4, movement: 1, range: 1 },
      role: "support",
    },
    "militech-trooper": {
      cost: 10,
      stats: { hp: 9, attack: 4, defense: 4, movement: 1, range: 1 },
      role: "infantry",
    },
    "militech-tank": {
      cost: 22,
      stats: { hp: 15, attack: 5, defense: 6, movement: 1, range: 1 },
      role: "heavy",
    },
    "militech-legendary": {
      cost: 36,
      stats: { hp: 16, attack: 6, defense: 6, movement: 1, range: 2 },
      role: "legendary",
    },

    // —— Maelstrom: damage, fragile ——
    "maelstrom-commander": {
      cost: 26,
      stats: { hp: 12, attack: 6, defense: 3, movement: 1, range: 1 },
      role: "commander",
    },
    "maelstrom-ganger": {
      cost: 9,
      stats: { hp: 7, attack: 5, defense: 2, movement: 1, range: 1 },
      role: "infantry",
    },
    "maelstrom-berserker": {
      cost: 14,
      stats: { hp: 9, attack: 6, defense: 2, movement: 1, range: 1 },
      role: "infantry",
    },
    "maelstrom-legendary": {
      cost: 34,
      stats: { hp: 14, attack: 8, defense: 3, movement: 1, range: 1 },
      role: "legendary",
    },

    // —— Edgerunners: amplify, don't replace ——
    "edge-solo-blade": {
      cost: 16,
      stats: { hp: 9, attack: 5, defense: 3, movement: 2, range: 1 },
      role: "edgerunner",
    },
    "edge-netrunner-ghost": {
      cost: 15,
      stats: { hp: 6, attack: 3, defense: 2, movement: 2, range: 2 },
      role: "edgerunner",
    },
    "edge-techie-wrench": {
      cost: 14,
      stats: { hp: 8, attack: 2, defense: 3, movement: 2, range: 1 },
      role: "edgerunner",
    },
  },

  implantsById: {
    "implant-reinforced-armor": {
      slotCost: 1,
      statMods: { defense: 2 },
      energyTax: 2,
    },
    "implant-combat-module": {
      slotCost: 1,
      statMods: { attack: 2 },
      energyTax: 3,
    },
    "implant-optic-system": {
      slotCost: 1,
      statMods: { range: 1 },
      energyTax: 2,
    },
    "implant-neural-accelerator": {
      slotCost: 1,
      statMods: { movement: 1 },
      energyTax: 2,
    },
  },

  legendaryModulesById: {
    "lgd-smasher-smartlink": { slotCost: 1, statMods: { attack: 2 } },
    "lgd-smasher-ap-rounds": {
      slotCost: 1,
      statMods: { range: 1, attack: 1 },
    },
    "lgd-smasher-chrome-plate": {
      slotCost: 1,
      statMods: { defense: 1, hp: 2 },
    },
    "lgd-smasher-reactive-shield": {
      slotCost: 1,
      statMods: { defense: 1, hp: 2 },
    },
    "lgd-smasher-berserk-core": {
      slotCost: 1,
      statMods: { attack: 1, hp: 1 },
    },
    "lgd-smasher-synapse": {
      slotCost: 1,
      statMods: { movement: 1 },
    },
  },

  factions: {
    "faction-arasaka": {
      id: "faction-arasaka",
      strengths: ["Качество юнитов", "Кибернетика", "Элитный урон"],
      weaknesses: ["Высокая стоимость", "Меньше тел на поле"],
      costMultiplier: 1.0,
    },
    "faction-militech": {
      id: "faction-militech",
      strengths: ["Техника", "Броня", "Фронтальная линия"],
      weaknesses: ["Медленность", "Слабый манёвр"],
      costMultiplier: 1.0,
      statMods: { movement: 0 },
    },
    "faction-maelstrom": {
      id: "faction-maelstrom",
      strengths: ["Урон", "Агрессия"],
      weaknesses: ["Нестабильность", "Низкая защита"],
      costMultiplier: 0.95,
    },
    "faction-voodoo-boys": {
      id: "faction-voodoo-boys",
      strengths: ["Контроль", "Дальность", "Сеть"],
      weaknesses: ["Слабые физически", "Хрупкость"],
      costMultiplier: 1.0,
    },
    "faction-nomads": {
      id: "faction-nomads",
      strengths: ["Мобильность", "Позиционирование"],
      weaknesses: ["Меньше брони", "Слабее в лобовой"],
      costMultiplier: 0.98,
    },
    "faction-tyger-claws": {
      id: "faction-tyger-claws",
      strengths: ["Скорость", "Точечный удар"],
      weaknesses: ["Хрупкость", "Меньше HP"],
    },
    "faction-valentinos": {
      id: "faction-valentinos",
      strengths: ["Ближний бой", "Связность отряда"],
      weaknesses: ["Дальность", "Технологии"],
    },
    "faction-ncpd": {
      id: "faction-ncpd",
      strengths: ["Контроль периметра", "Дисциплина"],
      weaknesses: ["Гибкость", "Элитный урон"],
    },
    "faction-animals": {
      id: "faction-animals",
      strengths: ["Грубая сила", "HP"],
      weaknesses: ["Техника", "Дальность"],
    },
    "faction-6th-street": {
      id: "faction-6th-street",
      strengths: ["Огневые точки", "Дешёвая пехота"],
      weaknesses: ["Элита", "Кибер-модули"],
    },
  },

  commanderStyles: [
    {
      id: "style-aggressive",
      name: "Агрессивный Командир",
      description: "Боевой модуль + нейроускоритель — давление и темп.",
      implantIds: ["implant-combat-module", "implant-neural-accelerator"],
    },
    {
      id: "style-defensive",
      name: "Защитный Командир",
      description: "Усиленная броня + оптика — держит линию и зону.",
      implantIds: ["implant-reinforced-armor", "implant-optic-system"],
    },
    {
      id: "style-hacker",
      name: "Хакерский Командир",
      description: "Оптика + нейроускоритель — контроль дистанции и манёвра.",
      implantIds: ["implant-optic-system", "implant-neural-accelerator"],
    },
  ],
};

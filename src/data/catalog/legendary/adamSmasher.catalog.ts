import type {
  LegendaryModuleDefinition,
  LegendaryProfile,
} from "../../../domain/legendary/types";

/** Adam Smasher — Arasaka living weapon profile. */
export const ADAM_SMASHER_PROFILE: LegendaryProfile = {
  id: "legendary-adam-smasher",
  unitDefinitionId: "arasaka-adam-smasher",
  name: "Adam Smasher",
  description:
    "Боевая кастомизация киборга: оружейные системы, броня и усиление тела. Не использует универсальные импланты Командира.",
  moduleSlots: 4,
  allowedCategories: [
    "combat_cyber",
    "weapon_system",
    "armor_upgrade",
    "body_enhancement",
  ],
};

export const ADAM_SMASHER_MODULES: LegendaryModuleDefinition[] = [
  {
    id: "lgd-smasher-smartlink",
    name: "Smartlink Cannon Bus",
    description: "Оружейная шина. Повышает атаку.",
    category: "weapon_system",
    slotCost: 1,
    statMods: { attack: 2 },
    abilityIds: [],
  },
  {
    id: "lgd-smasher-ap-rounds",
    name: "AP Micro-Missiles",
    description: "Бронебойные микроракеты. Дальность +1.",
    category: "weapon_system",
    slotCost: 1,
    statMods: { range: 1, attack: 1 },
    abilityIds: [],
  },
  {
    id: "lgd-smasher-chrome-plate",
    name: "Military Chrome Plate",
    description: "Тяжёлая броня корпуса.",
    category: "armor_upgrade",
    slotCost: 1,
    statMods: { defense: 2, hp: 2 },
    abilityIds: [],
  },
  {
    id: "lgd-smasher-reactive-shield",
    name: "Reactive Composite Shell",
    description: "Реактивная оболочка. Защита и живучесть.",
    category: "armor_upgrade",
    slotCost: 1,
    statMods: { defense: 1, hp: 3 },
    abilityIds: [],
  },
  {
    id: "lgd-smasher-berserk-core",
    name: "Berserk Combat Core",
    description: "Боевой кибермодуль перегрузки.",
    category: "combat_cyber",
    slotCost: 1,
    statMods: { attack: 1, hp: 2 },
    abilityIds: [],
  },
  {
    id: "lgd-smasher-synapse",
    name: "Militech Synapse Boost",
    description: "Усиление тела и реакции.",
    category: "body_enhancement",
    slotCost: 1,
    statMods: { movement: 1, defense: 1 },
    abilityIds: [],
  },
];

export const LEGENDARY_PROFILES: LegendaryProfile[] = [ADAM_SMASHER_PROFILE];

export const LEGENDARY_MODULES: LegendaryModuleDefinition[] = [
  ...ADAM_SMASHER_MODULES,
];

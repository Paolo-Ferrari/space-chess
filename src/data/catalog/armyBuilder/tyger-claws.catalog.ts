import type {
  FactionDefinition,
  UnitDefinition,
} from "../../../domain/armyBuilder/types";

/**
 * Tyger Claws — catalog data only.
 * Style: speed / melee
 */
export const TYGER_CLAWS_FACTION: FactionDefinition = {
  id: "faction-tyger-claws",
  name: "Tyger Claws",
  tag: "TYG",
  description:
    "Скорость, скрытность и ближний бой. Манёвры и быстрые удары.",
};

export const TYGER_CLAWS_UNITS: UnitDefinition[] = [
  {
    id: "tyger-claws-commander",
    factionId: TYGER_CLAWS_FACTION.id,
    name: "Tyger Claws Oyabun",
    type: "commander",
    cost: 27,
    stats: { hp: 12, attack: 6, defense: 3, movement: 2, range: 1 },
    description: "Оябун клана. Быстрый и точный.",
    abilities: [],
  },
  {
    id: "tyger-claws-ripperdoc",
    factionId: TYGER_CLAWS_FACTION.id,
    name: "Tyger Claws Street Doc",
    type: "ripperdoc",
    cost: 17,
    stats: { hp: 7, attack: 2, defense: 3, movement: 2, range: 1 },
    description: "Уличный риппер клана. Быстрая стабилизация.",
    abilities: ["ability-heal", "ability-armor-boost"],
  },
  {
    id: "tyger-claws-blade",
    factionId: TYGER_CLAWS_FACTION.id,
    name: "Tyger Blade",
    type: "regular",
    cost: 11,
    stats: { hp: 7, attack: 5, defense: 2, movement: 2, range: 1 },
    description: "Клинок. Быстрый ближний бой.",
    abilities: [],
  },
  {
    id: "tyger-claws-assassin",
    factionId: TYGER_CLAWS_FACTION.id,
    name: "Tyger Assassin",
    type: "regular",
    cost: 16,
    stats: { hp: 6, attack: 7, defense: 2, movement: 2, range: 1 },
    description: "Ассасин. Высокий урон с фланга.",
    abilities: ["ability-power-strike"],
  },
  {
    id: "tyger-claws-runner",
    factionId: TYGER_CLAWS_FACTION.id,
    name: "Tyger Runner",
    type: "regular",
    cost: 12,
    stats: { hp: 6, attack: 3, defense: 2, movement: 3, range: 1 },
    description: "Курьер-боец. Максимальная мобильность.",
    abilities: [],
  },
  {
    id: "tyger-claws-monk",
    factionId: TYGER_CLAWS_FACTION.id,
    name: "Tyger Martial Monk",
    type: "regular",
    cost: 14,
    stats: { hp: 8, attack: 5, defense: 3, movement: 2, range: 1 },
    description: "Монах ближнего боя. Баланс скорости и удара.",
    abilities: [],
  },
  {
    id: "tyger-claws-smoke",
    factionId: TYGER_CLAWS_FACTION.id,
    name: "Tyger Smoke Dancer",
    type: "special",
    cost: 15,
    stats: { hp: 5, attack: 4, defense: 2, movement: 3, range: 1 },
    description: "Дымовой манёвр. Замедляет преследователей.",
    abilities: ["ability-slow"],
  },
  {
    id: "tyger-claws-legendary",
    factionId: TYGER_CLAWS_FACTION.id,
    name: "Tyger Phantom Blade",
    type: "legendary",
    cost: 33,
    stats: { hp: 11, attack: 9, defense: 3, movement: 3, range: 1 },
    description: "Легендарный клинок клана. Скорость и смертельность.",
    abilities: ["ability-power-strike"],
  },
];

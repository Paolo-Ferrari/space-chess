import type {
  FactionDefinition,
  UnitCatalogEntry,
} from "../../../domain/armyBuilder/types";

/**
 * Maelstrom — catalog data only.
 * Style: chaos / risk
 */
export const MAELSTROM_FACTION: FactionDefinition = {
  id: "faction-maelstrom",
  name: "Maelstrom",
  tag: "MAE",
  description:
    "Кибернетическое безумие. Агрессия, риск и нестабильные усиления.",
};

export const MAELSTROM_UNITS: UnitCatalogEntry[] = [
  {
    id: "maelstrom-commander",
    factionId: MAELSTROM_FACTION.id,
    name: "Maelstrom Chrome Boss",
    type: "commander",
    cost: 28,
    stats: { hp: 13, attack: 7, defense: 3, movement: 2, range: 1 },
    description: "Вожак Maelstrom. Высокая атака, низкая стабильность.",
    abilities: [],
  },
  {
    id: "maelstrom-ripperdoc",
    factionId: MAELSTROM_FACTION.id,
    name: "Maelstrom Chop-Doc",
    type: "ripperdoc",
    cost: 17,
    stats: { hp: 8, attack: 3, defense: 2, movement: 2, range: 1 },
    description: "Уличный chop-doc. Грубое лечение и хром-усиления.",
    abilities: ["ability-heal", "ability-armor-boost"],
  },
  {
    id: "maelstrom-ganger",
    factionId: MAELSTROM_FACTION.id,
    name: "Maelstrom Ganger",
    type: "regular",
    cost: 10,
    stats: { hp: 7, attack: 5, defense: 2, movement: 2, range: 1 },
    description: "Агрессивный боец. Много урона, мало брони.",
    abilities: [],
  },
  {
    id: "maelstrom-berserker",
    factionId: MAELSTROM_FACTION.id,
    name: "Maelstrom Berserker",
    type: "regular",
    cost: 15,
    stats: { hp: 9, attack: 7, defense: 2, movement: 2, range: 1 },
    description: "Берсерк. Рискованный ближний урон.",
    abilities: ["ability-power-strike"],
  },
  {
    id: "maelstrom-chrome",
    factionId: MAELSTROM_FACTION.id,
    name: "Maelstrom Chrome Junkie",
    type: "regular",
    cost: 13,
    stats: { hp: 8, attack: 6, defense: 1, movement: 2, range: 1 },
    description: "Перекачанный хромом. Нестабилен, опасен.",
    abilities: [],
  },
  {
    id: "maelstrom-shotgun",
    factionId: MAELSTROM_FACTION.id,
    name: "Maelstrom Shotgunner",
    type: "regular",
    cost: 14,
    stats: { hp: 8, attack: 6, defense: 2, movement: 1, range: 1 },
    description: "Дробовик в упор. Жёсткий ближний огонь.",
    abilities: [],
  },
  {
    id: "maelstrom-glitch",
    factionId: MAELSTROM_FACTION.id,
    name: "Maelstrom Glitch Runner",
    type: "special",
    cost: 18,
    stats: { hp: 6, attack: 4, defense: 2, movement: 2, range: 2 },
    description: "Сбойные импланты. Контроль через Slow.",
    abilities: ["ability-slow"],
  },
  {
    id: "maelstrom-legendary",
    factionId: MAELSTROM_FACTION.id,
    name: "Maelstrom Overclocked Horror",
    type: "legendary",
    cost: 34,
    stats: { hp: 16, attack: 9, defense: 3, movement: 2, range: 1 },
    description: "Легенда банды. Максимальный риск и урон.",
    abilities: ["ability-power-strike"],
  },
];

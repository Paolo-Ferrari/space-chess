import type {
  FactionDefinition,
  UnitCatalogEntry,
} from "../../../domain/armyBuilder/types";

/**
 * Animals — catalog data only.
 * Style: brute strength
 */
export const ANIMALS_FACTION: FactionDefinition = {
  id: "faction-animals",
  name: "Animals",
  tag: "ANM",
  description:
    "Физическая сила и устойчивость. Высокий HP, ближний бой, почти без технологий.",
};

export const ANIMALS_UNITS: UnitCatalogEntry[] = [
  {
    id: "animals-commander",
    factionId: ANIMALS_FACTION.id,
    name: "Animals Alpha",
    type: "commander",
    cost: 28,
    stats: { hp: 18, attack: 6, defense: 4, movement: 1, range: 1 },
    description: "Альфа. Живучий и тяжёлый в ближнем бою.",
    abilities: [],
  },
  {
    id: "animals-ripperdoc",
    factionId: ANIMALS_FACTION.id,
    name: "Animals Pit Doc",
    type: "ripperdoc",
    cost: 16,
    stats: { hp: 10, attack: 3, defense: 3, movement: 1, range: 1 },
    description: "Питомник-риппер. Грубое лечение мышцы.",
    abilities: ["ability-heal"],
  },
  {
    id: "animals-brawler",
    factionId: ANIMALS_FACTION.id,
    name: "Animals Brawler",
    type: "regular",
    cost: 11,
    stats: { hp: 12, attack: 5, defense: 3, movement: 1, range: 1 },
    description: "Браулер. Много HP, простой удар.",
    abilities: [],
  },
  {
    id: "animals-tank",
    factionId: ANIMALS_FACTION.id,
    name: "Animals Ironbody",
    type: "regular",
    cost: 15,
    stats: { hp: 16, attack: 4, defense: 5, movement: 1, range: 1 },
    description: "Железная туша. Танк ближнего боя.",
    abilities: [],
  },
  {
    id: "animals-slugger",
    factionId: ANIMALS_FACTION.id,
    name: "Animals Slugger",
    type: "regular",
    cost: 13,
    stats: { hp: 13, attack: 6, defense: 3, movement: 1, range: 1 },
    description: "Силовой удар. Power Strike.",
    abilities: ["ability-power-strike"],
  },
  {
    id: "animals-wrestler",
    factionId: ANIMALS_FACTION.id,
    name: "Animals Wrestler",
    type: "regular",
    cost: 12,
    stats: { hp: 14, attack: 4, defense: 4, movement: 1, range: 1 },
    description: "Борец. Контроль через давление.",
    abilities: [],
  },
  {
    id: "animals-roider",
    factionId: ANIMALS_FACTION.id,
    name: "Animals Roided Beast",
    type: "special",
    cost: 17,
    stats: { hp: 15, attack: 7, defense: 3, movement: 2, range: 1 },
    description: "Перекачанный зверь. Риск и мощь.",
    abilities: ["ability-power-strike"],
  },
  {
    id: "animals-legendary",
    factionId: ANIMALS_FACTION.id,
    name: "Animals Apex Predator",
    type: "legendary",
    cost: 34,
    stats: { hp: 22, attack: 8, defense: 5, movement: 1, range: 1 },
    description: "Легенда Animals. Максимум мяса и удара.",
    abilities: ["ability-power-strike"],
  },
];

import type {
  FactionDefinition,
  UnitDefinition,
} from "../../../domain/armyBuilder/types";

/**
 * Nomads — catalog data only.
 * Style: mobility / vehicles
 */
export const NOMADS_FACTION: FactionDefinition = {
  id: "faction-nomads",
  name: "Nomads",
  tag: "NOM",
  description:
    "Мобильность, техника и адаптация. Гибкая тактика и перемещение.",
};

export const NOMADS_UNITS: UnitDefinition[] = [
  {
    id: "nomads-commander",
    factionId: NOMADS_FACTION.id,
    name: "Nomad Clan Leader",
    type: "commander",
    cost: 27,
    stats: { hp: 13, attack: 5, defense: 4, movement: 2, range: 1 },
    description: "Лидер клана. Держит темп марша.",
    abilities: [],
  },
  {
    id: "nomads-ripperdoc",
    factionId: NOMADS_FACTION.id,
    name: "Nomad Road Doc",
    type: "ripperdoc",
    cost: 17,
    stats: { hp: 8, attack: 2, defense: 3, movement: 2, range: 1 },
    description: "Дорожный риппер. Починка людей и машин.",
    abilities: ["ability-heal", "ability-armor-boost"],
  },
  {
    id: "nomads-scout",
    factionId: NOMADS_FACTION.id,
    name: "Nomad Scout",
    type: "regular",
    cost: 11,
    stats: { hp: 7, attack: 3, defense: 2, movement: 3, range: 2 },
    description: "Скаут. Обзор и манёвр.",
    abilities: [],
  },
  {
    id: "nomads-rider",
    factionId: NOMADS_FACTION.id,
    name: "Nomad Rider",
    type: "regular",
    cost: 13,
    stats: { hp: 8, attack: 4, defense: 3, movement: 3, range: 1 },
    description: "Наездник. Высокая мобильность.",
    abilities: [],
  },
  {
    id: "nomads-tech",
    factionId: NOMADS_FACTION.id,
    name: "Nomad Techie",
    type: "regular",
    cost: 14,
    stats: { hp: 7, attack: 2, defense: 3, movement: 2, range: 1 },
    description: "Техник. Поддержка и ремонт духа.",
    abilities: ["ability-heal"],
  },
  {
    id: "nomads-buggy",
    factionId: NOMADS_FACTION.id,
    name: "Nomad Raid Buggy",
    type: "special",
    cost: 20,
    stats: { hp: 12, attack: 5, defense: 4, movement: 3, range: 1 },
    description: "Рейдовый багги. Транспортный удар.",
    abilities: [],
  },
  {
    id: "nomads-sniper",
    factionId: NOMADS_FACTION.id,
    name: "Nomad Longshot",
    type: "regular",
    cost: 15,
    stats: { hp: 6, attack: 5, defense: 2, movement: 2, range: 3 },
    description: "Дальний выстрел с дистанции.",
    abilities: [],
  },
  {
    id: "nomads-legendary",
    factionId: NOMADS_FACTION.id,
    name: "Nomad Panzer Convoy",
    type: "legendary",
    cost: 34,
    stats: { hp: 17, attack: 7, defense: 5, movement: 2, range: 2 },
    description: "Легендарный конвой. Мощь и мобильность.",
    abilities: ["ability-power-strike"],
  },
];

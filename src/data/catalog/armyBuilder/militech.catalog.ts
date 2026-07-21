import type {
  FactionDefinition,
  UnitCatalogEntry,
} from "../../../domain/armyBuilder/types";

/**
 * Militech — catalog data only.
 * Style: heavy firepower / armor
 */
export const MILITECH_FACTION: FactionDefinition = {
  id: "faction-militech",
  name: "Militech",
  tag: "MIL",
  description:
    "Военная корпорация. Тяжёлое вооружение, броня и огневая мощь. Техника и танки на поле.",
};

export const MILITECH_UNITS: UnitCatalogEntry[] = [
  {
    id: "militech-commander",
    factionId: MILITECH_FACTION.id,
    name: "Militech Commander",
    type: "commander",
    cost: 28,
    stats: { hp: 15, attack: 5, defense: 6, movement: 1, range: 1 },
    description: "Полевой командир Militech. Держит линию и координирует тяжёлые активы.",
    abilities: [],
  },
  {
    id: "militech-ripperdoc",
    factionId: MILITECH_FACTION.id,
    name: "Militech Field Medic",
    type: "ripperdoc",
    cost: 18,
    stats: { hp: 9, attack: 2, defense: 5, movement: 1, range: 1 },
    description: "Военный медик/риппер. Стабилизация и бронепротоколы на фронте.",
    abilities: ["ability-heal", "ability-armor-boost"],
  },
  {
    id: "militech-trooper",
    factionId: MILITECH_FACTION.id,
    name: "Militech Trooper",
    type: "regular",
    cost: 11,
    stats: { hp: 9, attack: 4, defense: 4, movement: 1, range: 1 },
    description: "Пехота корпорации. Броня и дисциплина.",
    abilities: [],
  },
  {
    id: "militech-gunner",
    factionId: MILITECH_FACTION.id,
    name: "Militech Heavy Gunner",
    type: "regular",
    cost: 16,
    stats: { hp: 10, attack: 6, defense: 4, movement: 1, range: 2 },
    description: "Тяжёлый стрелок. Дальность и урон.",
    abilities: [],
  },
  {
    id: "militech-mech",
    factionId: MILITECH_FACTION.id,
    name: "Militech Light Mech",
    type: "regular",
    cost: 22,
    stats: { hp: 16, attack: 5, defense: 6, movement: 1, range: 1 },
    description: "Лёгкий мех. Танк линии.",
    abilities: [],
  },
  {
    id: "militech-tank",
    factionId: MILITECH_FACTION.id,
    name: "Militech Assault Tank",
    type: "special",
    cost: 26,
    stats: { hp: 18, attack: 7, defense: 7, movement: 1, range: 2 },
    description: "Штурмовой танк. Максимальная огневая мощь.",
    abilities: [],
  },
  {
    id: "militech-drone",
    factionId: MILITECH_FACTION.id,
    name: "Militech Spotter Drone",
    type: "regular",
    cost: 12,
    stats: { hp: 5, attack: 2, defense: 2, movement: 2, range: 2 },
    description: "Дрон-корректировщик. Мобильность и обзор.",
    abilities: [],
  },
  {
    id: "militech-legendary",
    factionId: MILITECH_FACTION.id,
    name: "Militech War Machine",
    type: "legendary",
    cost: 36,
    stats: { hp: 20, attack: 8, defense: 7, movement: 1, range: 2 },
    description: "Легендарная боевая платформа Militech.",
    abilities: ["ability-power-strike"],
  },
];

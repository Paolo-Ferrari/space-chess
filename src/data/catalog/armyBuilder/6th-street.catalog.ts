import type {
  FactionDefinition,
  UnitCatalogEntry,
} from "../../../domain/armyBuilder/types";

/**
 * 6th Street — catalog data only.
 * Style: ranged discipline
 */
export const SIXTH_STREET_FACTION: FactionDefinition = {
  id: "faction-6th-street",
  name: "6th Street",
  tag: "6ST",
  description:
    "Огневая мощь и дисциплина. Дальний бой и укрепление позиций.",
};

export const SIXTH_STREET_UNITS: UnitCatalogEntry[] = [
  {
    id: "6th-street-commander",
    factionId: SIXTH_STREET_FACTION.id,
    name: "6th Street Captain",
    type: "commander",
    cost: 28,
    stats: { hp: 13, attack: 5, defense: 5, movement: 1, range: 2 },
    description: "Капитан. Держит огневые точки.",
    abilities: [],
  },
  {
    id: "6th-street-ripperdoc",
    factionId: SIXTH_STREET_FACTION.id,
    name: "6th Street Combat Medic",
    type: "ripperdoc",
    cost: 17,
    stats: { hp: 8, attack: 2, defense: 4, movement: 1, range: 1 },
    description: "Боевой медик. Лечение и броня на позициях.",
    abilities: ["ability-heal", "ability-armor-boost"],
  },
  {
    id: "6th-street-rifle",
    factionId: SIXTH_STREET_FACTION.id,
    name: "6th Street Rifleman",
    type: "regular",
    cost: 11,
    stats: { hp: 8, attack: 4, defense: 3, movement: 1, range: 2 },
    description: "Стрелок. Базовый дальний бой.",
    abilities: [],
  },
  {
    id: "6th-street-mg",
    factionId: SIXTH_STREET_FACTION.id,
    name: "6th Street Machine Gunner",
    type: "regular",
    cost: 16,
    stats: { hp: 9, attack: 6, defense: 4, movement: 1, range: 2 },
    description: "Пулемётчик. Огневой контроль сектора.",
    abilities: [],
  },
  {
    id: "6th-street-fort",
    factionId: SIXTH_STREET_FACTION.id,
    name: "6th Street Fortifier",
    type: "regular",
    cost: 14,
    stats: { hp: 10, attack: 3, defense: 5, movement: 1, range: 1 },
    description: "Укрепитель позиций. Броня союзникам.",
    abilities: ["ability-armor-boost"],
  },
  {
    id: "6th-street-marksman",
    factionId: SIXTH_STREET_FACTION.id,
    name: "6th Street Marksman",
    type: "regular",
    cost: 15,
    stats: { hp: 7, attack: 6, defense: 2, movement: 1, range: 3 },
    description: "Марксман. Длинная дистанция.",
    abilities: [],
  },
  {
    id: "6th-street-patrol",
    factionId: SIXTH_STREET_FACTION.id,
    name: "6th Street Patrol",
    type: "special",
    cost: 13,
    stats: { hp: 8, attack: 4, defense: 3, movement: 2, range: 2 },
    description: "Патруль. Мобильный огонь.",
    abilities: [],
  },
  {
    id: "6th-street-legendary",
    factionId: SIXTH_STREET_FACTION.id,
    name: "6th Street Overwatch",
    type: "legendary",
    cost: 34,
    stats: { hp: 14, attack: 8, defense: 5, movement: 1, range: 3 },
    description: "Легендарный overwatch. Дальний подавляющий огонь.",
    abilities: ["ability-power-strike"],
  },
];

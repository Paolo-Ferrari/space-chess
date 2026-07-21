import type {
  FactionDefinition,
  UnitCatalogEntry,
} from "../../../domain/armyBuilder/types";

/**
 * Valentinos — catalog data only.
 * Style: team support
 */
export const VALENTINOS_FACTION: FactionDefinition = {
  id: "faction-valentinos",
  name: "Valentinos",
  tag: "VAL",
  description:
    "Командная игра и взаимная поддержка. Сильны рядом с союзниками.",
};

export const VALENTINOS_UNITS: UnitCatalogEntry[] = [
  {
    id: "valentinos-commander",
    factionId: VALENTINOS_FACTION.id,
    name: "Valentinos Jefe",
    type: "commander",
    cost: 28,
    stats: { hp: 14, attack: 5, defense: 4, movement: 1, range: 1 },
    description: "Хефе. Держит семью вместе на поле.",
    abilities: [],
  },
  {
    id: "valentinos-ripperdoc",
    factionId: VALENTINOS_FACTION.id,
    name: "Valentinos Family Doc",
    type: "ripperdoc",
    cost: 18,
    stats: { hp: 9, attack: 2, defense: 3, movement: 1, range: 1 },
    description: "Семейный риппер. Лечение и броня для своих.",
    abilities: ["ability-heal", "ability-armor-boost"],
  },
  {
    id: "valentinos-soldier",
    factionId: VALENTINOS_FACTION.id,
    name: "Valentinos Soldado",
    type: "regular",
    cost: 11,
    stats: { hp: 9, attack: 4, defense: 3, movement: 1, range: 1 },
    description: "Сольдадо. Держит строй рядом с семьёй.",
    abilities: [],
  },
  {
    id: "valentinos-guardian",
    factionId: VALENTINOS_FACTION.id,
    name: "Valentinos Guardian",
    type: "regular",
    cost: 15,
    stats: { hp: 11, attack: 3, defense: 5, movement: 1, range: 1 },
    description: "Страж. Защищает союзников рядом.",
    abilities: ["ability-armor-boost"],
  },
  {
    id: "valentinos-gun",
    factionId: VALENTINOS_FACTION.id,
    name: "Valentinos Gunner",
    type: "regular",
    cost: 13,
    stats: { hp: 8, attack: 5, defense: 3, movement: 1, range: 2 },
    description: "Стрелок поддержки средней дистанции.",
    abilities: [],
  },
  {
    id: "valentinos-brother",
    factionId: VALENTINOS_FACTION.id,
    name: "Valentinos Brother-in-Arms",
    type: "regular",
    cost: 14,
    stats: { hp: 10, attack: 4, defense: 4, movement: 1, range: 1 },
    description: "Боец линии. Живуч в группе.",
    abilities: [],
  },
  {
    id: "valentinos-priest",
    factionId: VALENTINOS_FACTION.id,
    name: "Valentinos Street Priest",
    type: "special",
    cost: 16,
    stats: { hp: 8, attack: 2, defense: 3, movement: 1, range: 1 },
    description: "Поддержка морали. Лечит союзников.",
    abilities: ["ability-heal"],
  },
  {
    id: "valentinos-legendary",
    factionId: VALENTINOS_FACTION.id,
    name: "Valentinos Padre",
    type: "legendary",
    cost: 34,
    stats: { hp: 15, attack: 6, defense: 5, movement: 1, range: 1 },
    description: "Легенда семьи. Символ командной силы.",
    abilities: ["ability-armor-boost", "ability-heal"],
  },
];

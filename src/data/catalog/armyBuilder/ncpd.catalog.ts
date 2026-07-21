import type {
  FactionDefinition,
  UnitCatalogEntry,
} from "../../../domain/armyBuilder/types";

/**
 * NCPD / MaxTac — catalog data only.
 * Style: control / suppression
 */
export const NCPD_FACTION: FactionDefinition = {
  id: "faction-ncpd",
  name: "NCPD / MaxTac",
  tag: "NCP",
  description:
    "Порядок и контроль поля. Защита, подавление и удержание зон.",
};

export const NCPD_UNITS: UnitCatalogEntry[] = [
  {
    id: "ncpd-commander",
    factionId: NCPD_FACTION.id,
    name: "MaxTac Commander",
    type: "commander",
    cost: 29,
    stats: { hp: 14, attack: 5, defense: 6, movement: 1, range: 1 },
    description: "Командир MaxTac. Контроль периметра.",
    abilities: [],
  },
  {
    id: "ncpd-ripperdoc",
    factionId: NCPD_FACTION.id,
    name: "NCPD Trauma Unit",
    type: "ripperdoc",
    cost: 18,
    stats: { hp: 9, attack: 2, defense: 5, movement: 1, range: 1 },
    description: "Полевой trauma unit. Лечение и броня щитов.",
    abilities: ["ability-heal", "ability-armor-boost"],
  },
  {
    id: "ncpd-officer",
    factionId: NCPD_FACTION.id,
    name: "NCPD Officer",
    type: "regular",
    cost: 11,
    stats: { hp: 9, attack: 3, defense: 4, movement: 1, range: 1 },
    description: "Офицер. Держит зону.",
    abilities: [],
  },
  {
    id: "ncpd-riot",
    factionId: NCPD_FACTION.id,
    name: "NCPD Riot Shield",
    type: "regular",
    cost: 14,
    stats: { hp: 12, attack: 2, defense: 6, movement: 1, range: 1 },
    description: "Щит. Подавление и блок.",
    abilities: ["ability-armor-boost"],
  },
  {
    id: "ncpd-maxtac",
    factionId: NCPD_FACTION.id,
    name: "MaxTac Operative",
    type: "regular",
    cost: 18,
    stats: { hp: 11, attack: 6, defense: 5, movement: 1, range: 1 },
    description: "Оперативник MaxTac. Элитное подавление.",
    abilities: ["ability-power-strike"],
  },
  {
    id: "ncpd-sniper",
    factionId: NCPD_FACTION.id,
    name: "NCPD Marksman",
    type: "regular",
    cost: 15,
    stats: { hp: 7, attack: 5, defense: 3, movement: 1, range: 3 },
    description: "Марксман. Контроль дальних клеток.",
    abilities: [],
  },
  {
    id: "ncpd-drone",
    factionId: NCPD_FACTION.id,
    name: "NCPD Suppression Drone",
    type: "special",
    cost: 16,
    stats: { hp: 6, attack: 3, defense: 3, movement: 2, range: 2 },
    description: "Дрон подавления. Slow по нарушителям.",
    abilities: ["ability-slow"],
  },
  {
    id: "ncpd-legendary",
    factionId: NCPD_FACTION.id,
    name: "MaxTac Breach Team",
    type: "legendary",
    cost: 36,
    stats: { hp: 16, attack: 7, defense: 7, movement: 1, range: 1 },
    description: "Легендарная штурмовая группа MaxTac.",
    abilities: ["ability-power-strike", "ability-armor-boost"],
  },
];

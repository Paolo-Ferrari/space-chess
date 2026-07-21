import type {
  FactionDefinition,
  UnitDefinition,
} from "../../../domain/armyBuilder/types";

/**
 * Voodoo Boys — catalog data only.
 * Style: netrunning / control
 */
export const VOODOO_BOYS_FACTION: FactionDefinition = {
  id: "faction-voodoo-boys",
  name: "Voodoo Boys",
  tag: "VDB",
  description:
    "Нетраннеры и цифровой контроль. Хакинг, дебаффы, отключение ритма врага.",
};

export const VOODOO_BOYS_UNITS: UnitDefinition[] = [
  {
    id: "voodoo-boys-commander",
    factionId: VOODOO_BOYS_FACTION.id,
    name: "Voodoo Boys Houngan",
    type: "commander",
    cost: 27,
    stats: { hp: 11, attack: 4, defense: 3, movement: 1, range: 2 },
    description: "Хунган сети. Контроль с дистанции.",
    abilities: [],
  },
  {
    id: "voodoo-boys-ripperdoc",
    factionId: VOODOO_BOYS_FACTION.id,
    name: "Voodoo Boys Net-Ripper",
    type: "ripperdoc",
    cost: 18,
    stats: { hp: 7, attack: 2, defense: 3, movement: 1, range: 2 },
    description: "Риппер-нетраннер. Стабилизация и сетевые протоколы.",
    abilities: ["ability-heal", "ability-armor-boost"],
  },
  {
    id: "voodoo-boys-netrunner",
    factionId: VOODOO_BOYS_FACTION.id,
    name: "Voodoo Netrunner",
    type: "regular",
    cost: 14,
    stats: { hp: 6, attack: 3, defense: 2, movement: 1, range: 2 },
    description: "Нетраннер. Slow и контроль.",
    abilities: ["ability-slow"],
  },
  {
    id: "voodoo-boys-guard",
    factionId: VOODOO_BOYS_FACTION.id,
    name: "Voodoo Data Guard",
    type: "regular",
    cost: 12,
    stats: { hp: 8, attack: 3, defense: 4, movement: 1, range: 1 },
    description: "Охрана узлов. Держит позицию.",
    abilities: [],
  },
  {
    id: "voodoo-boys-ghost",
    factionId: VOODOO_BOYS_FACTION.id,
    name: "Voodoo Ghost Proxy",
    type: "regular",
    cost: 15,
    stats: { hp: 5, attack: 4, defense: 2, movement: 2, range: 2 },
    description: "Прокси-атака. Мобильный контроль.",
    abilities: ["ability-slow"],
  },
  {
    id: "voodoo-boys-ice",
    factionId: VOODOO_BOYS_FACTION.id,
    name: "Voodoo ICE Breaker",
    type: "special",
    cost: 17,
    stats: { hp: 7, attack: 5, defense: 2, movement: 1, range: 2 },
    description: "Взлом защит. Power Strike по системам.",
    abilities: ["ability-power-strike"],
  },
  {
    id: "voodoo-boys-signal",
    factionId: VOODOO_BOYS_FACTION.id,
    name: "Voodoo Signal Jammer",
    type: "regular",
    cost: 13,
    stats: { hp: 6, attack: 2, defense: 3, movement: 1, range: 2 },
    description: "Глушитель. Подавляет темп врага.",
    abilities: ["ability-slow"],
  },
  {
    id: "voodoo-boys-legendary",
    factionId: VOODOO_BOYS_FACTION.id,
    name: "Voodoo Boys Blackwall Adept",
    type: "legendary",
    cost: 35,
    stats: { hp: 12, attack: 5, defense: 4, movement: 1, range: 3 },
    description: "Легенда сети. Дальний контроль.",
    abilities: ["ability-slow", "ability-power-strike"],
  },
];

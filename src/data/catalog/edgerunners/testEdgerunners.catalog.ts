import type { UnitDefinition } from "../../../domain/armyBuilder/types";
import type { EdgerunnerDefinition } from "../../../domain/edgerunner/types";
import { EDGERUNNER_POOL_ID } from "../../../domain/edgerunner/types";

/**
 * Test edgerunners — not final roster / balance.
 * Reuse Ability System test abilities for hire verification.
 */
export const TEST_EDGERUNNER_UNITS: UnitDefinition[] = [
  {
    id: "edge-solo-blade",
    factionId: EDGERUNNER_POOL_ID,
    name: "Street Solo",
    type: "edgerunner",
    cost: 18,
    stats: { hp: 10, attack: 6, defense: 3, movement: 2, range: 1 },
    description:
      "Боевой наёмник. Высокий урон в ближнем бою. Тестовый Solo.",
    abilities: ["ability-power-strike"],
  },
  {
    id: "edge-netrunner-ghost",
    factionId: EDGERUNNER_POOL_ID,
    name: "Ghost Netrunner",
    type: "edgerunner",
    cost: 16,
    stats: { hp: 7, attack: 3, defense: 2, movement: 2, range: 2 },
    description:
      "Контроль и хакинг на поле. Тестовый Netrunner (Slow).",
    abilities: ["ability-slow"],
  },
  {
    id: "edge-techie-wrench",
    factionId: EDGERUNNER_POOL_ID,
    name: "Field Techie",
    type: "edgerunner",
    cost: 15,
    stats: { hp: 8, attack: 2, defense: 3, movement: 2, range: 1 },
    description:
      "Поддержка и полевой ремонт. Тестовый Techie (Heal).",
    abilities: ["ability-heal"],
  },
];

export const TEST_EDGERUNNER_PROFILES: EdgerunnerDefinition[] = [
  {
    id: "edgerunner-solo-blade",
    unitDefinitionId: "edge-solo-blade",
    name: "Street Solo",
    description: "Solo — боевой специалист. Тестовый найм.",
    role: "solo",
    available: true,
  },
  {
    id: "edgerunner-netrunner-ghost",
    unitDefinitionId: "edge-netrunner-ghost",
    name: "Ghost Netrunner",
    description: "Netrunner — контроль. Тестовый найм.",
    role: "netrunner",
    available: true,
  },
  {
    id: "edgerunner-techie-wrench",
    unitDefinitionId: "edge-techie-wrench",
    name: "Field Techie",
    description: "Techie — поддержка. Тестовый найм.",
    role: "techie",
    available: true,
  },
];

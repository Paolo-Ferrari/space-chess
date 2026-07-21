import type { AbilityDefinition } from "../../../domain/ability/types";

/**
 * Test abilities — not final balance content.
 * New abilities = new catalog entries + registry append only.
 */
export const TEST_ABILITIES: AbilityDefinition[] = [
  {
    id: "ability-heal",
    name: "Heal",
    description: "Восстанавливает HP цели (себя или союзника).",
    kind: "support",
    actionCost: 1,
    oncePerTurn: true,
    range: 1,
    target: "ally",
    effects: [{ kind: "heal", value: 4 }],
    conditions: [{ type: "requires_own_turn" }, { type: "requires_alive" }],
  },
  {
    id: "ability-power-strike",
    name: "Power Strike",
    description: "Мощный удар: базовый Attack + бонусный урон.",
    kind: "active",
    actionCost: 1,
    oncePerTurn: true,
    range: 1,
    target: "enemy",
    effects: [{ kind: "damage", value: 3 }],
    conditions: [{ type: "requires_own_turn" }, { type: "requires_alive" }],
  },
  {
    id: "ability-armor-boost",
    name: "Armor Boost",
    description: "Временно увеличивает защиту цели.",
    kind: "support",
    actionCost: 1,
    oncePerTurn: true,
    range: 1,
    target: "ally",
    effects: [
      {
        kind: "apply_status",
        value: 0,
        statusId: "status-armor-boost",
        durationTurns: 2,
      },
    ],
    conditions: [{ type: "requires_own_turn" }, { type: "requires_alive" }],
  },
  {
    id: "ability-slow",
    name: "Slow",
    description: "Уменьшает движение врага на время.",
    kind: "active",
    actionCost: 1,
    oncePerTurn: true,
    range: 2,
    target: "enemy",
    effects: [
      {
        kind: "apply_status",
        value: 0,
        statusId: "status-slow",
        durationTurns: 2,
      },
    ],
    conditions: [{ type: "requires_own_turn" }, { type: "requires_alive" }],
  },
];

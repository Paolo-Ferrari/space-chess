import type { StatusDefinition } from "../../../domain/ability/types";

export const STATUS_DEFINITIONS: StatusDefinition[] = [
  {
    id: "status-armor-boost",
    name: "Усиление брони",
    description: "Временно повышенная защита.",
    modifiers: { defense: 2 },
  },
  {
    id: "status-slow",
    name: "Замедление",
    description: "Сниженное перемещение.",
    modifiers: { movement: -1 },
  },
];

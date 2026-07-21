import type { ImplantDefinition } from "../../../domain/commander/types";

/** Test implants — not final balance. */
export const TEST_IMPLANTS: ImplantDefinition[] = [
  {
    id: "implant-reinforced-armor",
    name: "Усиленная броня",
    description: "Керамические пластины. Повышает защиту Командира.",
    type: "defensive",
    slotCost: 1,
    statMods: { defense: 2 },
    abilityIds: [],
  },
  {
    id: "implant-combat-module",
    name: "Боевой модуль",
    description: "Сервоприводы оружия. Повышает атаку.",
    type: "offensive",
    slotCost: 1,
    statMods: { attack: 2 },
    abilityIds: [],
  },
  {
    id: "implant-optic-system",
    name: "Оптическая система",
    description: "Тактический прицел. Увеличивает дальность атаки.",
    type: "cyberdeck",
    slotCost: 1,
    statMods: { range: 1 },
    abilityIds: [],
  },
  {
    id: "implant-neural-accelerator",
    name: "Нейроускоритель",
    description: "Нейролинк маневров. Повышает мобильность.",
    type: "mobility",
    slotCost: 1,
    statMods: { movement: 1 },
    abilityIds: [],
  },
];

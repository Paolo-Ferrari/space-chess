/** Тестовые данные только для UI-прототипа. Не игровой каталог. */

export const DEMO_FACTIONS = [
  { id: "f1", name: "Neon Syndicate", tag: "SYN" },
  { id: "f2", name: "Chrome Legion", tag: "CRM" },
  { id: "f3", name: "Void Runners", tag: "VOD" },
] as const;

export const DEMO_UNITS = [
  { id: "u1", name: "Scout", role: "Разведка", cost: 10 },
  { id: "u2", name: "Trooper", role: "Штурм", cost: 15 },
  { id: "u3", name: "Heavy", role: "Огневая мощь", cost: 25 },
  { id: "u4", name: "Medic", role: "Поддержка", cost: 20 },
  { id: "u5", name: "Netrunner", role: "Контроль", cost: 22 },
  { id: "u6", name: "Commander", role: "Командир", cost: 30 },
] as const;

export const DEMO_ARMY_BUDGET = 100;

export const DEMO_BOARD_SIZE = 8;

export const DEMO_MATCH_LOG = [
  "Система: канал установлен.",
  "Система: армии загружены (заглушка).",
  "Ход 1: ожидание действия…",
] as const;

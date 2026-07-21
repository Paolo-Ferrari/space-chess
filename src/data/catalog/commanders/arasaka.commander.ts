import type { CommanderDefinition } from "../../../domain/commander/types";

export const ARASAKA_COMMANDER: CommanderDefinition = {
  id: "commander-arasaka",
  unitDefinitionId: "arasaka-commander",
  factionId: "faction-arasaka",
  name: "Arasaka Commander",
  description:
    "Командир корпоративного отряда. Единственный носитель имплантов в армии. Уничтожение = поражение.",
  implantSlots: 3,
};

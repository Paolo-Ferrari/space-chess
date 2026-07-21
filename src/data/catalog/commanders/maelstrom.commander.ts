import type { CommanderDefinition } from "../../../domain/commander/types";

export const MAELSTROM_COMMANDER: CommanderDefinition = {
  id: "commander-maelstrom",
  unitDefinitionId: "maelstrom-commander",
  factionId: "faction-maelstrom",
  name: "Maelstrom Chrome Boss",
  description:
    "Вожак Maelstrom. Высокая атака, низкая стабильность. Единственный носитель имплантов фракции.",
  implantSlots: 3,
};

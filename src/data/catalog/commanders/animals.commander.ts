import type { CommanderDefinition } from "../../../domain/commander/types";

export const ANIMALS_COMMANDER: CommanderDefinition = {
  id: "commander-animals",
  unitDefinitionId: "animals-commander",
  factionId: "faction-animals",
  name: "Animals Alpha",
  description:
    "Альфа. Живучий и тяжёлый в ближнем бою. Единственный носитель имплантов фракции.",
  implantSlots: 2,
};

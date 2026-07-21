import type { CommanderDefinition } from "../../../domain/commander/types";

export const NOMADS_COMMANDER: CommanderDefinition = {
  id: "commander-nomads",
  unitDefinitionId: "nomads-commander",
  factionId: "faction-nomads",
  name: "Nomad Clan Leader",
  description:
    "Лидер клана. Держит темп марша. Единственный носитель имплантов фракции.",
  implantSlots: 3,
};

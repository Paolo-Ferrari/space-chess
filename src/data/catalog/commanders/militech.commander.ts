import type { CommanderDefinition } from "../../../domain/commander/types";

export const MILITECH_COMMANDER: CommanderDefinition = {
  id: "commander-militech",
  unitDefinitionId: "militech-commander",
  factionId: "faction-militech",
  name: "Militech Commander",
  description:
    "Полевой командир Militech. Держит линию и координирует тяжёлые активы. Единственный носитель имплантов фракции.",
  implantSlots: 3,
};

import type { CommanderDefinition } from "../../../domain/commander/types";

export const NCPD_COMMANDER: CommanderDefinition = {
  id: "commander-ncpd",
  unitDefinitionId: "ncpd-commander",
  factionId: "faction-ncpd",
  name: "MaxTac Commander",
  description:
    "Командир MaxTac. Контроль периметра. Единственный носитель имплантов фракции.",
  implantSlots: 3,
};

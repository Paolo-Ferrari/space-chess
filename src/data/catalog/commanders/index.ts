import type { CommanderDefinition } from "../../../domain/commander/types";

import { ARASAKA_COMMANDER } from "./arasaka.commander";
import { MILITECH_COMMANDER } from "./militech.commander";
import { MAELSTROM_COMMANDER } from "./maelstrom.commander";
import { TYGER_CLAWS_COMMANDER } from "./tyger-claws.commander";
import { VALENTINOS_COMMANDER } from "./valentinos.commander";
import { VOODOO_BOYS_COMMANDER } from "./voodoo-boys.commander";
import { NOMADS_COMMANDER } from "./nomads.commander";
import { NCPD_COMMANDER } from "./ncpd.commander";
import { ANIMALS_COMMANDER } from "./animals.commander";
import { SIXTH_STREET_COMMANDER } from "./6th-street.commander";

const COMMANDERS: CommanderDefinition[] = [
  ARASAKA_COMMANDER,
  MILITECH_COMMANDER,
  MAELSTROM_COMMANDER,
  TYGER_CLAWS_COMMANDER,
  VALENTINOS_COMMANDER,
  VOODOO_BOYS_COMMANDER,
  NOMADS_COMMANDER,
  NCPD_COMMANDER,
  ANIMALS_COMMANDER,
  SIXTH_STREET_COMMANDER,
];
const byUnitId = new Map(COMMANDERS.map((c) => [c.unitDefinitionId, c]));
const byFactionId = new Map(COMMANDERS.map((c) => [c.factionId, c]));
const byId = new Map(COMMANDERS.map((c) => [c.id, c]));

export function listCommanders(): CommanderDefinition[] {
  return COMMANDERS;
}

export function getCommanderById(id: string): CommanderDefinition | undefined {
  return byId.get(id);
}

export function getCommanderByUnitId(
  unitDefinitionId: string,
): CommanderDefinition | undefined {
  return byUnitId.get(unitDefinitionId);
}

export function getCommanderByFactionId(
  factionId: string,
): CommanderDefinition | undefined {
  return byFactionId.get(factionId);
}

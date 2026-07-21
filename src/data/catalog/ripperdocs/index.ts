import type { RipperdocDefinition } from "../../../domain/ripperdoc/types";

import { ARASAKA_RIPPERDOC } from "./arasaka.ripperdoc";
import { MILITECH_RIPPERDOC } from "./militech.ripperdoc";
import { MAELSTROM_RIPPERDOC } from "./maelstrom.ripperdoc";
import { TYGER_CLAWS_RIPPERDOC } from "./tyger-claws.ripperdoc";
import { VALENTINOS_RIPPERDOC } from "./valentinos.ripperdoc";
import { VOODOO_BOYS_RIPPERDOC } from "./voodoo-boys.ripperdoc";
import { NOMADS_RIPPERDOC } from "./nomads.ripperdoc";
import { NCPD_RIPPERDOC } from "./ncpd.ripperdoc";
import { ANIMALS_RIPPERDOC } from "./animals.ripperdoc";
import { SIXTH_STREET_RIPPERDOC } from "./6th-street.ripperdoc";

/**
 * Ripperdoc registry.
 * Add factions by appending catalog files here.
 */
const RIPPERDOCS: RipperdocDefinition[] = [
  ARASAKA_RIPPERDOC,
  MILITECH_RIPPERDOC,
  MAELSTROM_RIPPERDOC,
  TYGER_CLAWS_RIPPERDOC,
  VALENTINOS_RIPPERDOC,
  VOODOO_BOYS_RIPPERDOC,
  NOMADS_RIPPERDOC,
  NCPD_RIPPERDOC,
  ANIMALS_RIPPERDOC,
  SIXTH_STREET_RIPPERDOC,
];

const byId = new Map(RIPPERDOCS.map((r) => [r.id, r]));
const byUnitId = new Map(RIPPERDOCS.map((r) => [r.unitDefinitionId, r]));
const byFactionId = new Map(RIPPERDOCS.map((r) => [r.factionId, r]));

export function listRipperdocs(): RipperdocDefinition[] {
  return RIPPERDOCS;
}

export function getRipperdocById(id: string): RipperdocDefinition | undefined {
  return byId.get(id);
}

export function getRipperdocByUnitId(
  unitDefinitionId: string,
): RipperdocDefinition | undefined {
  return byUnitId.get(unitDefinitionId);
}

export function getRipperdocByFactionId(
  factionId: string,
): RipperdocDefinition | undefined {
  return byFactionId.get(factionId);
}

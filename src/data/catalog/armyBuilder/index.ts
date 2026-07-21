import type {
  FactionDefinition,
  UnitCatalogEntry,
  UnitDefinition,
} from "../../../domain/armyBuilder/types";
import { BalanceSystem } from "../../../domain/balance/balanceSystem";
import { listEdgerunnerUnits } from "../edgerunners";
import { defineUnit } from "../units/defineUnit";

import { ARASAKA_FACTION, ARASAKA_UNITS } from "./arasaka.catalog";
import { MILITECH_FACTION, MILITECH_UNITS } from "./militech.catalog";
import { MAELSTROM_FACTION, MAELSTROM_UNITS } from "./maelstrom.catalog";
import {
  TYGER_CLAWS_FACTION,
  TYGER_CLAWS_UNITS,
} from "./tyger-claws.catalog";
import {
  VALENTINOS_FACTION,
  VALENTINOS_UNITS,
} from "./valentinos.catalog";
import {
  VOODOO_BOYS_FACTION,
  VOODOO_BOYS_UNITS,
} from "./voodoo-boys.catalog";
import { NOMADS_FACTION, NOMADS_UNITS } from "./nomads.catalog";
import { NCPD_FACTION, NCPD_UNITS } from "./ncpd.catalog";
import { ANIMALS_FACTION, ANIMALS_UNITS } from "./animals.catalog";
import {
  SIXTH_STREET_FACTION,
  SIXTH_STREET_UNITS,
} from "./6th-street.catalog";

/**
 * Army Builder catalog registry — playable unit game database.
 *
 * Army Builder / UI never import a faction by name.
 * To add a unit: one catalog entry + PNG at `public/assets/units/{id}.png`.
 * Edgerunners are a neutral pool — append via edgerunners catalog.
 */
const FACTIONS: FactionDefinition[] = [
  ARASAKA_FACTION,
  MILITECH_FACTION,
  MAELSTROM_FACTION,
  TYGER_CLAWS_FACTION,
  VALENTINOS_FACTION,
  VOODOO_BOYS_FACTION,
  NOMADS_FACTION,
  NCPD_FACTION,
  ANIMALS_FACTION,
  SIXTH_STREET_FACTION,
];

const RAW_UNITS: UnitCatalogEntry[] = [
  ...ARASAKA_UNITS,
  ...MILITECH_UNITS,
  ...MAELSTROM_UNITS,
  ...TYGER_CLAWS_UNITS,
  ...VALENTINOS_UNITS,
  ...VOODOO_BOYS_UNITS,
  ...NOMADS_UNITS,
  ...NCPD_UNITS,
  ...ANIMALS_UNITS,
  ...SIXTH_STREET_UNITS,
];

/** Faction units finalized once; edgerunners already finalized in their registry. */
const UNITS: UnitDefinition[] = [
  ...RAW_UNITS.map(defineUnit),
  ...listEdgerunnerUnits(),
];

const factionById = new Map(FACTIONS.map((f) => [f.id, f]));
const unitById = new Map(UNITS.map((u) => [u.id, u]));

export function listFactions(): FactionDefinition[] {
  return FACTIONS;
}

export function getFactionById(id: string): FactionDefinition | undefined {
  return factionById.get(id);
}

export function listUnits(): UnitDefinition[] {
  return UNITS.map((unit) => BalanceSystem.applyUnit(unit));
}

export function getUnitById(id: string): UnitDefinition | undefined {
  const raw = unitById.get(id);
  return raw ? BalanceSystem.applyUnit(raw) : undefined;
}

/** Faction roster only — excludes neutral edgerunners. */
export function listUnitsByFaction(factionId: string): UnitDefinition[] {
  return UNITS.filter(
    (unit) =>
      unit.factionId === factionId && unit.type !== "edgerunner",
  ).map((unit) => BalanceSystem.applyUnit(unit));
}

/** Raw catalog entry without balance overlay (tools / audits). */
export function getRawUnitById(id: string): UnitDefinition | undefined {
  return unitById.get(id);
}

export const armyBuilderCatalogLookup = {
  getUnitById,
};

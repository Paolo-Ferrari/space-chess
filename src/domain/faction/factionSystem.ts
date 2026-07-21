import {
  getFactionById,
  listFactions,
  listUnitsByFaction,
} from "../../data/catalog/armyBuilder";
import type { FactionDefinition, UnitDefinition } from "../armyBuilder/types";

/**
 * Faction System — read-only access to static faction data.
 * Army Builder / Battle must use this (or catalog registry), not hardcode faction ids.
 */
export const FactionSystem = {
  list(): FactionDefinition[] {
    return listFactions();
  },

  get(id: string): FactionDefinition | undefined {
    return getFactionById(id);
  },

  listUnits(factionId: string): UnitDefinition[] {
    return listUnitsByFaction(factionId);
  },
};

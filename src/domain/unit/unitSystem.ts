import { getUnitById, listUnits } from "../../data/gameDatabase";
import type { UnitDefinition } from "../armyBuilder/types";

/**
 * Unit System — reads the game database (catalog), never hardcodes content.
 * Runtime HP/position live in battle UnitRuntime.
 */
export const UnitSystem = {
  list(): UnitDefinition[] {
    return listUnits();
  },

  get(id: string): UnitDefinition | undefined {
    return getUnitById(id);
  },
};

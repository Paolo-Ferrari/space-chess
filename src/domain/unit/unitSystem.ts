import { getUnitById, listUnits } from "../../data/catalog/armyBuilder";
import type { UnitDefinition } from "../armyBuilder/types";

/**
 * Unit System — static unit definitions only.
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

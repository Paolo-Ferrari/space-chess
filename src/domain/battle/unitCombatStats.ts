import type { UnitDefinition, UnitStats } from "../armyBuilder/types";
import { CommanderSystem } from "../commander/commanderSystem";
import { LegendarySystem } from "../legendary/legendarySystem";

import type { UnitRuntime } from "./types";

/**
 * Catalog stats + commander implants or legendary combat modules.
 */
export function getEffectiveUnitStats(
  unit: UnitRuntime,
  definition: UnitDefinition,
): UnitStats {
  if (!(unit.implantIds?.length ?? 0)) {
    return definition.stats;
  }
  if (CommanderSystem.isCommanderUnit(definition)) {
    return (
      CommanderSystem.getEffectiveStats(definition.id, unit.implantIds) ??
      definition.stats
    );
  }
  if (LegendarySystem.hasCustomizer(definition.id)) {
    return (
      LegendarySystem.getEffectiveStats(definition.id, unit.implantIds) ??
      definition.stats
    );
  }
  return definition.stats;
}

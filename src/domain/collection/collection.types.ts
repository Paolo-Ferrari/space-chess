import type { Hero } from "../hero/hero.types";
import type { UnitDefinition } from "../unit/unit.types";

/** Read-only game catalog: all heroes and unit definitions. */
export interface GameCollection {
  heroes: readonly Hero[];
  units: readonly UnitDefinition[];
}

import type { UnitDefinition } from "../../../domain/armyBuilder/types";
import type {
  ApplyResult,
  BattleState,
} from "../../../domain/battle/types";

export type VictoryDefinitionLookup = {
  getUnitById: (id: string) => UnitDefinition | undefined;
};

/**
 * Pluggable victory / defeat rule.
 * Add new rules as modules; register by id in victory/index.ts.
 */
export interface VictoryRuleDefinition {
  id: string;
  name: string;
  description: string;
  evaluate: (
    state: BattleState,
    lookup: VictoryDefinitionLookup,
  ) => ApplyResult;
}

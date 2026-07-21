import { VICTORY_COMMANDER_KILL } from "./commander-kill.rule";
import type { VictoryRuleDefinition } from "./types";

/**
 * Victory rule registry.
 * Modes pick a rule id; BattleManager resolves through getVictoryRule.
 */
const RULES: VictoryRuleDefinition[] = [VICTORY_COMMANDER_KILL];

const byId = new Map(RULES.map((r) => [r.id, r]));

export function listVictoryRules(): VictoryRuleDefinition[] {
  return RULES;
}

export function getVictoryRule(id: string): VictoryRuleDefinition | undefined {
  return byId.get(id);
}

export function getDefaultVictoryRule(): VictoryRuleDefinition {
  return VICTORY_COMMANDER_KILL;
}

export type { VictoryRuleDefinition, VictoryDefinitionLookup } from "./types";
export { VICTORY_COMMANDER_KILL };

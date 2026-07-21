import { evaluateVictory } from "../../../domain/battle/victorySystem";

import type { VictoryRuleDefinition } from "./types";

/** Default Protocol Match rule — destroy enemy Neural Commander. */
export const VICTORY_COMMANDER_KILL: VictoryRuleDefinition = {
  id: "victory-commander-kill",
  name: "Commander Kill",
  description: "Победа при уничтожении вражеского нейро-командира.",
  evaluate: evaluateVictory,
};

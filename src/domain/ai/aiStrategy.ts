import type { AiStrategyId, AiStrategyWeights } from "./types";

export const AI_STRATEGIES: Record<AiStrategyId, AiStrategyWeights> = {
  aggressive: {
    id: "aggressive",
    attack: 1.35,
    killBonus: 1.5,
    commanderTarget: 2.2,
    ability: 0.9,
    heal: 0.55,
    buff: 0.5,
    control: 0.7,
    approachEnemyCommander: 1.4,
    guardOwnCommander: 0.45,
    safety: 0.35,
  },
  defensive: {
    id: "defensive",
    attack: 0.85,
    killBonus: 1.1,
    commanderTarget: 1.4,
    ability: 1.15,
    heal: 1.5,
    buff: 1.35,
    control: 0.8,
    approachEnemyCommander: 0.45,
    guardOwnCommander: 1.8,
    safety: 1.4,
  },
  tactical: {
    id: "tactical",
    attack: 1.05,
    killBonus: 1.35,
    commanderTarget: 1.9,
    ability: 1.25,
    heal: 1.1,
    buff: 1.05,
    control: 1.2,
    approachEnemyCommander: 0.95,
    guardOwnCommander: 1.05,
    safety: 0.95,
  },
};

export function getStrategyWeights(id: AiStrategyId): AiStrategyWeights {
  return AI_STRATEGIES[id];
}

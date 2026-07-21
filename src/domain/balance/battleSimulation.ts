import { AiManager, createAiConfig } from "../ai";
import type { AiDifficulty } from "../ai/types";
import type { Army } from "../armyBuilder/types";
import { BalanceSystem } from "../balance/balanceSystem";
import { BattleManager } from "../battle/battleManager";
import { createBattleFromArmies } from "../battle/createBattle";

export interface SimulationMatchResult {
  winner: 0 | 1 | null;
  turns: number;
  /** Soft-capped if match hit maxTurns. */
  timedOut: boolean;
}

export interface MatchupStats {
  label: string;
  iterations: number;
  winsA: number;
  winsB: number;
  draws: number;
  timeouts: number;
  avgTurns: number;
  winRateA: number;
  winRateB: number;
  /** Flagged when one side dominates. */
  dominant: boolean;
}

export interface SimulationSuiteReport {
  matchups: MatchupStats[];
  generatedAt: number;
  balanceVersion: string;
}

function runAiSeat(battle: BattleManager, difficulty: AiDifficulty, seat: 0 | 1) {
  const ai = new AiManager({
    ...createAiConfig(difficulty),
    playerId: seat,
  });
  ai.playTurn(battle);
}

/**
 * Play one AI vs AI match until commander kill or turn soft-cap.
 */
export function simulateMatch(
  armyA: Army,
  armyB: Army,
  options: { difficulty?: AiDifficulty; maxTurns?: number } = {},
): SimulationMatchResult {
  const difficulty = options.difficulty ?? "normal";
  const maxTurns =
    options.maxTurns ?? BalanceSystem.combat().maxTurnsSoftCap;

  const state = createBattleFromArmies(armyA, armyB);
  const battle = BattleManager.fromSnapshot(state);

  while (battle.getState().phase === "playing") {
    const current = battle.getState();
    if (current.turnNumber > maxTurns) {
      return {
        winner: null,
        turns: current.turnNumber,
        timedOut: true,
      };
    }
    runAiSeat(battle, difficulty, current.currentPlayer);
  }

  const end = battle.getState();
  return {
    winner: end.winner,
    turns: end.turnNumber,
    timedOut: false,
  };
}

export function simulateMatchup(
  label: string,
  armyA: Army,
  armyB: Army,
  iterations: number,
  options: { difficulty?: AiDifficulty; maxTurns?: number; dominantThreshold?: number } = {},
): MatchupStats {
  const threshold = options.dominantThreshold ?? 0.75;
  let winsA = 0;
  let winsB = 0;
  let draws = 0;
  let timeouts = 0;
  let turnSum = 0;

  for (let i = 0; i < iterations; i += 1) {
    // Alternate sides to reduce first-move bias
    const aFirst = i % 2 === 0;
    const result = aFirst
      ? simulateMatch(armyA, armyB, options)
      : simulateMatch(armyB, armyA, options);

    turnSum += result.turns;
    if (result.timedOut) {
      timeouts += 1;
      draws += 1;
      continue;
    }
    if (result.winner === null) {
      draws += 1;
      continue;
    }
    const aWon = aFirst ? result.winner === 0 : result.winner === 1;
    if (aWon) {
      winsA += 1;
    } else {
      winsB += 1;
    }
  }

  const decided = winsA + winsB;
  const winRateA = decided > 0 ? winsA / decided : 0.5;
  const winRateB = decided > 0 ? winsB / decided : 0.5;

  return {
    label,
    iterations,
    winsA,
    winsB,
    draws,
    timeouts,
    avgTurns: iterations > 0 ? turnSum / iterations : 0,
    winRateA,
    winRateB,
    dominant: winRateA >= threshold || winRateB >= threshold,
  };
}

export function buildSampleArmy(
  id: string,
  name: string,
  factionId: string,
  unitIds: string[],
): Army {
  return {
    id,
    name,
    factionId,
    unitIds,
    commanderImplantIds: [],
    legendaryModuleIds: [],
    ownerId: null,
    updatedAt: 1,
  };
}

/** Default balance suite — key archetypes. */
export function runDefaultBalanceSuite(iterations = 8): SimulationSuiteReport {
  const arasakaElite = buildSampleArmy(
    "sim-arasaka",
    "Arasaka Elite",
    "faction-arasaka",
    [
      "arasaka-commander",
      "arasaka-ripperdoc",
      "arasaka-soldier",
      "arasaka-elite",
      "arasaka-recon",
    ],
  );

  const arasakaSmasher = buildSampleArmy(
    "sim-smasher",
    "Smasher Spike",
    "faction-arasaka",
    [
      "arasaka-commander",
      "arasaka-ripperdoc",
      "arasaka-adam-smasher",
      "arasaka-soldier",
    ],
  );

  const militechLine = buildSampleArmy(
    "sim-militech",
    "Militech Line",
    "faction-militech",
    [
      "militech-commander",
      "militech-ripperdoc",
      "militech-trooper",
      "militech-trooper",
      "militech-tank",
    ],
  );

  const maelstromRush = buildSampleArmy(
    "sim-maelstrom",
    "Maelstrom Rush",
    "faction-maelstrom",
    [
      "maelstrom-commander",
      "maelstrom-ripperdoc",
      "maelstrom-ganger",
      "maelstrom-ganger",
      "maelstrom-berserker",
      "maelstrom-legendary",
    ],
  );

  const matchups = [
    simulateMatchup("Arasaka vs Militech", arasakaElite, militechLine, iterations),
    simulateMatchup("Arasaka vs Maelstrom", arasakaElite, maelstromRush, iterations),
    simulateMatchup(
      "Smasher spike vs Militech",
      arasakaSmasher,
      militechLine,
      iterations,
    ),
  ];

  return {
    matchups,
    generatedAt: Date.now(),
    balanceVersion: BalanceSystem.config.version,
  };
}

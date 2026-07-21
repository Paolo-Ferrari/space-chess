import type { UnitDefinition } from "../armyBuilder/types";
import type { GameEvent } from "../events/gameEvents";

import type { ApplyResult, BattleState, PlayerId, UnitRuntime } from "./types";

export type DefinitionLookup = {
  getUnitById: (id: string) => UnitDefinition | undefined;
};

export function isCommanderRuntime(
  unit: UnitRuntime,
  lookup: DefinitionLookup,
): boolean {
  return lookup.getUnitById(unit.definitionId)?.type === "commander";
}

export function findCommander(
  units: readonly UnitRuntime[],
  owner: PlayerId,
  lookup: DefinitionLookup,
): UnitRuntime | undefined {
  return units.find(
    (unit) => unit.owner === owner && isCommanderRuntime(unit, lookup),
  );
}

/**
 * Victory: enemy commander destroyed.
 * Defeat for player 0 if own commander destroyed (same rule both seats).
 */
export function evaluateVictory(
  state: BattleState,
  lookup: DefinitionLookup,
): ApplyResult {
  if (state.phase === "ended") {
    return { state, events: [] };
  }

  const p0Commander = findCommander(state.units, 0, lookup);
  const p1Commander = findCommander(state.units, 1, lookup);

  let winner: PlayerId | null | undefined;

  if (!p1Commander && p0Commander) {
    winner = 0;
  } else if (!p0Commander && p1Commander) {
    winner = 1;
  } else if (!p0Commander && !p1Commander) {
    winner = null;
  } else {
    return { state, events: [] };
  }

  const nextState: BattleState = {
    ...state,
    phase: "ended",
    winner,
  };

  const events: GameEvent[] = [
    {
      type: "BattleEnded",
      battleId: state.battleId,
      winner,
    },
  ];

  return { state: nextState, events };
}

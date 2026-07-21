import { getEffectiveStat } from "../ability/statusEffects";
import type { UnitDefinition } from "../armyBuilder/types";
import type { GameEvent } from "../events/gameEvents";

import {
  inBounds,
  isOccupied,
  orthogonalNeighbors,
  positionsEqual,
} from "./boardManager";
import type { ApplyResult, BattleState, Position, UnitRuntime } from "./types";
import { getEffectiveUnitStats } from "./unitCombatStats";

/**
 * Legal empty cells reachable by orthogonal steps up to movement range.
 * BFS — no diagonal, blocked by any unit.
 * Movement respects Slow / other status modifiers via Ability System.
 */
export function getLegalMoves(
  state: BattleState,
  unit: UnitRuntime,
  definition: UnitDefinition,
): Position[] {
  if (unit.hasMoved) {
    return [];
  }

  const baseMovement = getEffectiveUnitStats(unit, definition).movement;
  const maxSteps = getEffectiveStat(baseMovement, unit, "movement");
  if (maxSteps === 0) {
    return [];
  }

  const reached: Position[] = [];
  const visited = new Set<string>([`${unit.position.x},${unit.position.y}`]);
  let frontier: Array<{ pos: Position; steps: number }> = [
    { pos: unit.position, steps: 0 },
  ];

  while (frontier.length > 0) {
    const nextFrontier: Array<{ pos: Position; steps: number }> = [];
    for (const { pos, steps } of frontier) {
      if (steps >= maxSteps) {
        continue;
      }
      for (const neighbor of orthogonalNeighbors(state.board, pos)) {
        const key = `${neighbor.x},${neighbor.y}`;
        if (visited.has(key)) {
          continue;
        }
        if (!inBounds(state.board, neighbor)) {
          continue;
        }
        if (isOccupied(state.units, neighbor)) {
          continue;
        }
        visited.add(key);
        reached.push(neighbor);
        nextFrontier.push({ pos: neighbor, steps: steps + 1 });
      }
    }
    frontier = nextFrontier;
  }

  return reached;
}

export function canMoveTo(
  state: BattleState,
  unit: UnitRuntime,
  definition: UnitDefinition,
  target: Position,
): boolean {
  return getLegalMoves(state, unit, definition).some((pos) =>
    positionsEqual(pos, target),
  );
}

export function applyMove(
  state: BattleState,
  unitId: string,
  target: Position,
): ApplyResult {
  const unit = state.units.find((item) => item.instanceId === unitId);
  if (!unit) {
    return { state, events: [] };
  }

  const from = { ...unit.position };
  const nextState: BattleState = {
    ...state,
    units: state.units.map((item) =>
      item.instanceId === unitId
        ? { ...item, position: { ...target }, hasMoved: true }
        : item,
    ),
  };

  const events: GameEvent[] = [
    {
      type: "UnitMoved",
      battleId: state.battleId,
      unitId,
      from,
      to: { ...target },
    },
  ];

  return { state: nextState, events };
}

import type { UnitDefinition } from "../unit/unit.types";

import { chebyshev, inBounds, manhattan, orthogonalSteps, pieceAt } from "./board";
import type { BoardPos, MatchPiece, MatchState } from "./match.types";
import { ATTACK_RANGE, MOVE_RANGE } from "./match.types";

/**
 * Factor 1 — base movement for every unit:
 * up / down / left / right by MOVE_RANGE (1), onto empty cells.
 * Factor 2 (unit abilities) may replace or extend this later — not invented here.
 */
export function getLegalMoves(
  state: MatchState,
  piece: MatchPiece,
): BoardPos[] {
  if (piece.hasMoved || piece.owner !== state.currentPlayer) {
    return [];
  }

  const moves: BoardPos[] = [];
  for (const step of orthogonalSteps()) {
    const pos = {
      x: piece.x + step.x * MOVE_RANGE,
      y: piece.y + step.y * MOVE_RANGE,
    };
    if (!inBounds(pos, state.boardSize)) {
      continue;
    }
    if (manhattan(piece, pos) !== MOVE_RANGE) {
      continue;
    }
    if (pieceAt(state.pieces, pos)) {
      continue;
    }
    moves.push(pos);
  }
  return moves;
}

/**
 * Base attacks: adjacent enemies within ATTACK_RANGE (currently Chebyshev ≤ 1).
 * Special ranged / immobile attackers come from Factor 2 abilities — ask before changing.
 */
export function getLegalAttacks(
  state: MatchState,
  piece: MatchPiece,
): MatchPiece[] {
  if (piece.hasAttacked || piece.owner !== state.currentPlayer) {
    return [];
  }

  return state.pieces.filter((target) => {
    if (target.owner === piece.owner) {
      return false;
    }
    return chebyshev(piece, target) <= ATTACK_RANGE;
  });
}

export function canSelectPiece(
  state: MatchState,
  piece: MatchPiece,
): boolean {
  return (
    state.phase === "playing" &&
    piece.owner === state.currentPlayer &&
    piece.health > 0
  );
}

export function resolveAttackDamage(
  attackerDef: UnitDefinition | undefined,
): number {
  return Math.max(0, attackerDef?.attack ?? 0);
}

import type { UnitDefinition } from "../unit/unit.types";

import { chebyshev, inBounds, pieceAt } from "./board";
import type { BoardPos, MatchPiece, MatchState } from "./match.types";
import { ATTACK_RANGE, MOVE_RANGE } from "./match.types";

export function getLegalMoves(
  state: MatchState,
  piece: MatchPiece,
): BoardPos[] {
  if (piece.hasMoved || piece.owner !== state.currentPlayer) {
    return [];
  }

  const moves: BoardPos[] = [];
  for (let y = 0; y < state.boardSize; y += 1) {
    for (let x = 0; x < state.boardSize; x += 1) {
      const pos = { x, y };
      if (!inBounds(pos, state.boardSize)) {
        continue;
      }
      if (chebyshev(piece, pos) === 0 || chebyshev(piece, pos) > MOVE_RANGE) {
        continue;
      }
      if (pieceAt(state.pieces, pos)) {
        continue;
      }
      moves.push(pos);
    }
  }
  return moves;
}

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

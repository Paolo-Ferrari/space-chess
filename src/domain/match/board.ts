import type { BoardPos, MatchPiece, PlayerId } from "./match.types";
import { BOARD_SIZE } from "./match.types";

export function inBounds(
  pos: BoardPos,
  size: number = BOARD_SIZE,
): boolean {
  return pos.x >= 0 && pos.y >= 0 && pos.x < size && pos.y < size;
}

export function chebyshev(a: BoardPos, b: BoardPos): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

export function pieceAt(
  pieces: readonly MatchPiece[],
  pos: BoardPos,
): MatchPiece | undefined {
  return pieces.find((piece) => piece.x === pos.x && piece.y === pos.y);
}

export function cellKey(pos: BoardPos): string {
  return `${pos.x},${pos.y}`;
}

/** First spawn file is the 4th cell (1-based), i.e. index 3 → file `d`. */
export const SPAWN_START_X = 3;

/**
 * Auto spawn: Player 0 on bottom rows, Player 1 on top rows.
 * Units fill left→right starting from the 4th cell, front row first.
 */
export function spawnSlotsForPlayer(
  count: number,
  owner: PlayerId,
  size: number = BOARD_SIZE,
): BoardPos[] {
  if (count <= 0) {
    return [];
  }

  const frontY = owner === 0 ? 1 : size - 2;
  const backY = owner === 0 ? 0 : size - 1;
  const rows = [frontY, backY];
  const positions: BoardPos[] = [];
  const startX = Math.min(SPAWN_START_X, size - 1);

  for (const y of rows) {
    for (let x = startX; x < size && positions.length < count; x += 1) {
      positions.push({ x, y });
    }
  }

  return positions;
}

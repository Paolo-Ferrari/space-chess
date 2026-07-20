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

/** Orthogonal (up/down/left/right) distance. */
export function manhattan(a: BoardPos, b: BoardPos): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/** Four orthogonal neighbours at distance 1. */
export function orthogonalSteps(): readonly BoardPos[] {
  return [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
  ];
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

/**
 * Auto spawn: Player 0 on bottom rows, Player 1 on top rows.
 * Front row first, then back row, then deeper toward the center if needed.
 */
export function spawnSlotsForPlayer(
  count: number,
  owner: PlayerId,
  size: number = BOARD_SIZE,
): BoardPos[] {
  if (count <= 0) {
    return [];
  }

  const rows: number[] = [];
  if (owner === 0) {
    rows.push(1, 0);
    for (let y = 2; y < Math.floor(size / 2); y += 1) {
      rows.push(y);
    }
  } else {
    rows.push(size - 2, size - 1);
    for (let y = size - 3; y >= Math.ceil(size / 2); y -= 1) {
      rows.push(y);
    }
  }

  const positions: BoardPos[] = [];

  for (const y of rows) {
    for (let x = 0; x < size && positions.length < count; x += 1) {
      positions.push({ x, y });
    }
  }

  return positions;
}

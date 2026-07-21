import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  type Board,
  type Position,
  type UnitRuntime,
} from "./types";

export function createBoard(
  width = BOARD_WIDTH,
  height = BOARD_HEIGHT,
): Board {
  return { width, height };
}

export function inBounds(board: Board, pos: Position): boolean {
  return (
    pos.x >= 0 &&
    pos.y >= 0 &&
    pos.x < board.width &&
    pos.y < board.height
  );
}

export function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function manhattan(a: Position, b: Position): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function chebyshev(a: Position, b: Position): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

export function findUnitAt(
  units: readonly UnitRuntime[],
  pos: Position,
): UnitRuntime | undefined {
  return units.find((unit) => positionsEqual(unit.position, pos));
}

export function isOccupied(
  units: readonly UnitRuntime[],
  pos: Position,
): boolean {
  return Boolean(findUnitAt(units, pos));
}

/** Orthogonal neighbours within board. */
export function orthogonalNeighbors(
  board: Board,
  pos: Position,
): Position[] {
  const deltas = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];
  return deltas
    .map((d) => ({ x: pos.x + d.x, y: pos.y + d.y }))
    .filter((p) => inBounds(board, p));
}

/** All cells within Chebyshev radius (includes center). */
export function cellsInChebyshevRadius(
  board: Board,
  center: Position,
  radius: number,
): Position[] {
  const cells: Position[] = [];
  for (let y = 0; y < board.height; y += 1) {
    for (let x = 0; x < board.width; x += 1) {
      if (chebyshev(center, { x, y }) <= radius) {
        cells.push({ x, y });
      }
    }
  }
  return cells;
}

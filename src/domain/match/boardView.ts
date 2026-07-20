import type { PlayerId } from "./match.types";

/**
 * Map display grid coords to logical board for a viewing seat.
 * Seat 0: army at bottom. Seat 1: board rotated 180° (own army at bottom).
 */
export function displayToLogical(
  seat: PlayerId,
  boardSize: number,
  col: number,
  row: number,
): { x: number; y: number } {
  if (seat === 0) {
    return { x: col, y: boardSize - 1 - row };
  }
  return { x: boardSize - 1 - col, y: row };
}

/** File labels left→right as shown for this seat. */
export function displayFileLabels(
  seat: PlayerId,
  boardSize: number,
  files: readonly string[],
): string[] {
  const list = Array.from({ length: boardSize }, (_, i) => files[i] ?? "?");
  return seat === 0 ? list : [...list].reverse();
}

/** Rank labels top→bottom as shown for this seat. */
export function displayRankLabels(
  seat: PlayerId,
  boardSize: number,
  ranks: readonly string[],
): string[] {
  const list = Array.from({ length: boardSize }, (_, i) => ranks[i] ?? "?");
  if (seat === 0) {
    return [...list].reverse();
  }
  return list;
}

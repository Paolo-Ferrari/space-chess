import { BOARD_SIZE } from "./match.types";

/** Chess-style files: a … h for an 8×8 board. */
export const BOARD_FILES = "abcdefghijklmnop" as const;

/**
 * Chess-style rank labels without western digits.
 * Bottom rank = "α", then β … (as many as board size).
 */
export const BOARD_RANKS =
  "αβγδεζηθικλμνξοπ" as const;

export function fileLabel(x: number): string {
  return BOARD_FILES[x] ?? "?";
}

export function rankLabel(y: number): string {
  return BOARD_RANKS[y] ?? "?";
}

/** Algebraic-like cell name, e.g. "aα", "hθ". */
export function cellLabel(x: number, y: number): string {
  return `${fileLabel(x)}${rankLabel(y)}`;
}

export function boardFileLabels(size: number = BOARD_SIZE): string[] {
  return Array.from({ length: size }, (_, x) => fileLabel(x));
}

export function boardRankLabels(size: number = BOARD_SIZE): string[] {
  return Array.from({ length: size }, (_, y) => rankLabel(y));
}

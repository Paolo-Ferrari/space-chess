import { BOARD_SIZE } from "./match.types";

/** Chess-style files for a 16×16 board: a … p */
export const BOARD_FILES = "abcdefghijklmnop" as const;

/**
 * Chess-style rank labels without western digits.
 * Bottom rank = "α", then β … ο (16 Greek letters).
 */
export const BOARD_RANKS =
  "αβγδεζηθικλμνξοπ" as const;

export function fileLabel(x: number): string {
  return BOARD_FILES[x] ?? "?";
}

export function rankLabel(y: number): string {
  return BOARD_RANKS[y] ?? "?";
}

/** Algebraic-like cell name, e.g. "aα", "pο". */
export function cellLabel(x: number, y: number): string {
  return `${fileLabel(x)}${rankLabel(y)}`;
}

export function boardFileLabels(size: number = BOARD_SIZE): string[] {
  return Array.from({ length: size }, (_, x) => fileLabel(x));
}

export function boardRankLabels(size: number = BOARD_SIZE): string[] {
  return Array.from({ length: size }, (_, y) => rankLabel(y));
}

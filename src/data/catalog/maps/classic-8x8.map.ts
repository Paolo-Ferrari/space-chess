import type { Position } from "../../../domain/battle/types";

import type { MapDefinition } from "./types";

function rankCells(width: number, y: number): Position[] {
  return Array.from({ length: width }, (_, x) => ({ x, y }));
}

function zone(width: number, yMin: number, yMax: number, label: string) {
  const cells: Position[] = [];
  for (let y = yMax; y >= yMin; y -= 1) {
    cells.push(...rankCells(width, y));
  }
  return { cells, label };
}

/** Default Night City grid — 8×8 chess board. */
export const MAP_CLASSIC_8X8: MapDefinition = {
  id: "map-classic-8x8",
  name: "Night Grid",
  description: "Стандартное поле 8×8. Деплой на двух нижних/верхних линиях.",
  width: 8,
  height: 8,
  deploymentP0: zone(8, 6, 7, "Player ranks 1–2"),
  deploymentP1: zone(8, 0, 1, "Enemy ranks 7–8"),
  visualThemeId: "board-classic",
  tags: ["classic", "protocol-match"],
};

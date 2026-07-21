import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  type Position,
} from "../battle/types";

/** Chess-style cell id, e.g. A1 (file A–H, rank 1–8). */
export type CellId = string;

/** One placed unit on the deployment board. */
export interface UnitPlacement {
  /** Stable id for drag/swap (duplicates of same unitId allowed). */
  placementId: string;
  unitId: string;
  x: number;
  y: number;
}

/** Player deploys on the two bottom ranks (chess 1–2 / board y=7..6). */
export const DEPLOYMENT_MIN_Y = BOARD_HEIGHT - 2;
export const DEPLOYMENT_MAX_Y = BOARD_HEIGHT - 1;

const FILES = "ABCDEFGH";

export function cellIdFromPosition(x: number, y: number): CellId {
  const file = FILES[x] ?? "?";
  const rank = BOARD_HEIGHT - y;
  return `${file}${rank}`;
}

export function positionFromCellId(cellId: CellId): Position | null {
  if (!/^[A-Ha-h][1-8]$/.test(cellId)) {
    return null;
  }
  const file = cellId[0].toUpperCase();
  const rank = Number(cellId[1]);
  const x = FILES.indexOf(file);
  const y = BOARD_HEIGHT - rank;
  if (x < 0 || y < 0 || y >= BOARD_HEIGHT) {
    return null;
  }
  return { x, y };
}

export function isPlayerDeploymentCell(x: number, y: number): boolean {
  return (
    x >= 0 &&
    x < BOARD_WIDTH &&
    y >= DEPLOYMENT_MIN_Y &&
    y <= DEPLOYMENT_MAX_Y
  );
}

/** Ordered deployment slots: A1…H1 then A2…H2 (matches legacy spawn). */
export function listDeploymentSlots(): Position[] {
  const slots: Position[] = [];
  for (let y = DEPLOYMENT_MAX_Y; y >= DEPLOYMENT_MIN_Y; y -= 1) {
    for (let x = 0; x < BOARD_WIDTH; x += 1) {
      slots.push({ x, y });
    }
  }
  return slots;
}

export function newPlacementId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `place-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Auto-place unit ids into deployment zone (legacy armies / first open).
 */
export function autoPlaceUnits(unitIds: readonly string[]): UnitPlacement[] {
  const slots = listDeploymentSlots();
  return unitIds.slice(0, slots.length).map((unitId, index) => ({
    placementId: newPlacementId(),
    unitId,
    x: slots[index].x,
    y: slots[index].y,
  }));
}

export function unitIdsFromPlacements(
  placements: readonly UnitPlacement[],
): string[] {
  return placements.map((p) => p.unitId);
}

export function findPlacementAt(
  placements: readonly UnitPlacement[],
  x: number,
  y: number,
): UnitPlacement | undefined {
  return placements.find((p) => p.x === x && p.y === y);
}

export function findPlacementById(
  placements: readonly UnitPlacement[],
  placementId: string,
): UnitPlacement | undefined {
  return placements.find((p) => p.placementId === placementId);
}

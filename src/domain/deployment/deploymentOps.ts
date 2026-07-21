import type { ArmyDraft } from "../armyBuilder/types";
import { canAddUnit, type CatalogLookup } from "../armyBuilder/validation";

import {
  autoPlaceUnits,
  findPlacementAt,
  findPlacementById,
  isPlayerDeploymentCell,
  newPlacementId,
  type UnitPlacement,
  unitIdsFromPlacements,
} from "./types";

export type DeploymentReject =
  | "out_of_zone"
  | "cannot_add"
  | "unknown_placement"
  | "occupied";

function withSyncedUnits(draft: ArmyDraft, placements: UnitPlacement[]): ArmyDraft {
  return {
    ...draft,
    placements,
    unitIds: unitIdsFromPlacements(placements),
  };
}

/** Ensure draft has placements aligned with unitIds (migration). */
export function syncDraftPlacements(draft: ArmyDraft): ArmyDraft {
  const placements = draft.placements ?? [];
  if (placements.length === 0 && draft.unitIds.length > 0) {
    return withSyncedUnits(draft, autoPlaceUnits(draft.unitIds));
  }
  if (placements.length > 0) {
    return withSyncedUnits(draft, placements);
  }
  return { ...draft, placements: [], unitIds: [] };
}

export function placeCatalogUnit(
  draft: ArmyDraft,
  unitId: string,
  x: number,
  y: number,
  lookup: CatalogLookup,
): { draft: ArmyDraft; ok: boolean; reason?: DeploymentReject | string } {
  if (!isPlayerDeploymentCell(x, y)) {
    return { draft, ok: false, reason: "out_of_zone" };
  }
  const synced = syncDraftPlacements(draft);
  const existing = findPlacementAt(synced.placements ?? [], x, y);
  if (existing) {
    return { draft: synced, ok: false, reason: "occupied" };
  }
  const check = canAddUnit(synced, unitId, lookup);
  if (!check.ok) {
    return { draft: synced, ok: false, reason: check.reason ?? "cannot_add" };
  }
  const next: UnitPlacement[] = [
    ...(synced.placements ?? []),
    { placementId: newPlacementId(), unitId, x, y },
  ];
  return { draft: withSyncedUnits(synced, next), ok: true };
}

export function movePlacement(
  draft: ArmyDraft,
  placementId: string,
  x: number,
  y: number,
): { draft: ArmyDraft; ok: boolean; reason?: DeploymentReject } {
  if (!isPlayerDeploymentCell(x, y)) {
    return { draft, ok: false, reason: "out_of_zone" };
  }
  const synced = syncDraftPlacements(draft);
  const placements = [...(synced.placements ?? [])];
  const from = findPlacementById(placements, placementId);
  if (!from) {
    return { draft: synced, ok: false, reason: "unknown_placement" };
  }
  const target = findPlacementAt(placements, x, y);
  if (target && target.placementId === placementId) {
    return { draft: synced, ok: true };
  }
  if (target) {
    // Swap
    const next = placements.map((p) => {
      if (p.placementId === placementId) {
        return { ...p, x, y };
      }
      if (p.placementId === target.placementId) {
        return { ...p, x: from.x, y: from.y };
      }
      return p;
    });
    return { draft: withSyncedUnits(synced, next), ok: true };
  }
  const next = placements.map((p) =>
    p.placementId === placementId ? { ...p, x, y } : p,
  );
  return { draft: withSyncedUnits(synced, next), ok: true };
}

export function removePlacement(
  draft: ArmyDraft,
  placementId: string,
  clearCommanderImplants: boolean,
  clearLegendaryModules: boolean,
): ArmyDraft {
  const synced = syncDraftPlacements(draft);
  const removed = findPlacementById(synced.placements ?? [], placementId);
  if (!removed) {
    return synced;
  }
  const next = (synced.placements ?? []).filter(
    (p) => p.placementId !== placementId,
  );
  return {
    ...withSyncedUnits(synced, next),
    commanderImplantIds: clearCommanderImplants
      ? []
      : synced.commanderImplantIds,
    legendaryModuleIds: clearLegendaryModules
      ? []
      : (synced.legendaryModuleIds ?? []),
  };
}

export * from "./types";

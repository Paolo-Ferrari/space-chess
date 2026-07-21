import { CommanderSystem } from "../commander/commanderSystem";
import {
  autoPlaceUnits,
  syncDraftPlacements,
  unitIdsFromPlacements,
} from "../deployment";
import { LegendarySystem } from "../legendary/legendarySystem";

import type { Army, ArmyDraft } from "./types";
import { ARMY_NAME_MAX_LENGTH } from "./types";
import { canAddUnit, type CatalogLookup } from "./validation";

export function createEmptyDraft(factionId: string): ArmyDraft {
  return {
    id: null,
    name: "Новая боевая сеть",
    factionId,
    unitIds: [],
    placements: [],
    commanderImplantIds: [],
    legendaryModuleIds: [],
    ownerId: null,
  };
}

export function armyToDraft(army: Army): ArmyDraft {
  const saved = army.placements ?? [];
  const placements =
    saved.length > 0
      ? saved.map((p) => ({ ...p }))
      : autoPlaceUnits(army.unitIds);
  return {
    id: army.id,
    name: army.name,
    factionId: army.factionId,
    unitIds: unitIdsFromPlacements(placements),
    placements,
    commanderImplantIds: [...(army.commanderImplantIds ?? [])],
    legendaryModuleIds: [...(army.legendaryModuleIds ?? [])],
    ownerId: army.ownerId ?? null,
  };
}

export function findDraftCommanderId(
  draft: Pick<ArmyDraft, "unitIds">,
  lookup: CatalogLookup,
): string | null {
  for (const id of draft.unitIds) {
    const unit = lookup.getUnitById(id);
    if (unit && CommanderSystem.isCommanderUnit(unit)) {
      return id;
    }
  }
  return null;
}

export function findDraftLegendaryId(
  draft: Pick<ArmyDraft, "unitIds">,
  lookup: CatalogLookup,
): string | null {
  for (const id of draft.unitIds) {
    const unit = lookup.getUnitById(id);
    if (unit && LegendarySystem.hasCustomizer(unit.id)) {
      return id;
    }
  }
  return null;
}

export function setDraftFaction(
  draft: ArmyDraft,
  factionId: string,
): ArmyDraft {
  if (draft.factionId === factionId) {
    return draft;
  }
  return {
    ...draft,
    factionId,
    unitIds: [],
    placements: [],
    commanderImplantIds: [],
    legendaryModuleIds: [],
  };
}

export function setDraftName(draft: ArmyDraft, name: string): ArmyDraft {
  return {
    ...draft,
    name: name.slice(0, ARMY_NAME_MAX_LENGTH),
  };
}

/** @deprecated Prefer placeCatalogUnit from deployment — kept for list-add fallbacks. */
export function addUnitToDraft(
  draft: ArmyDraft,
  unitId: string,
  lookup: CatalogLookup,
): { draft: ArmyDraft; ok: boolean; reason?: string } {
  const check = canAddUnit(draft, unitId, lookup);
  if (!check.ok) {
    return { draft, ok: false, reason: check.reason };
  }
  const synced = syncDraftPlacements(draft);
  const nextIds = [...synced.unitIds, unitId];
  return {
    draft: {
      ...synced,
      unitIds: nextIds,
      placements: autoPlaceUnits(nextIds),
    },
    ok: true,
  };
}

export function removeUnitAtIndex(
  draft: ArmyDraft,
  index: number,
  lookup?: CatalogLookup,
): ArmyDraft {
  const synced = syncDraftPlacements(draft);
  if (index < 0 || index >= synced.placements.length) {
    return synced;
  }
  const removed = synced.placements[index];
  const def = lookup?.getUnitById(removed.unitId);
  const nextPlacements = synced.placements.filter((_, i) => i !== index);
  return {
    ...synced,
    placements: nextPlacements,
    unitIds: unitIdsFromPlacements(nextPlacements),
    commanderImplantIds:
      def && CommanderSystem.isCommanderUnit(def)
        ? []
        : synced.commanderImplantIds,
    legendaryModuleIds:
      LegendarySystem.hasCustomizer(removed.unitId)
        ? []
        : (synced.legendaryModuleIds ?? []),
  };
}

export function installImplantOnDraft(
  draft: ArmyDraft,
  implantId: string,
  lookup: CatalogLookup,
): { draft: ArmyDraft; ok: boolean; reason?: string } {
  const commanderId = findDraftCommanderId(draft, lookup);
  const check = CommanderSystem.canInstall(
    commanderId,
    draft.factionId,
    draft.commanderImplantIds,
    implantId,
  );
  if (!check.ok) {
    return { draft, ok: false, reason: check.reason };
  }
  return {
    draft: {
      ...draft,
      commanderImplantIds: [...draft.commanderImplantIds, implantId],
    },
    ok: true,
  };
}

export function removeImplantFromDraft(
  draft: ArmyDraft,
  implantId: string,
): ArmyDraft {
  const index = draft.commanderImplantIds.indexOf(implantId);
  if (index === -1) {
    return draft;
  }
  return {
    ...draft,
    commanderImplantIds: draft.commanderImplantIds.filter(
      (_, i) => i !== index,
    ),
  };
}

export function installLegendaryModuleOnDraft(
  draft: ArmyDraft,
  moduleId: string,
  lookup: CatalogLookup,
): { draft: ArmyDraft; ok: boolean; reason?: string } {
  const legendaryId = findDraftLegendaryId(draft, lookup);
  const current = draft.legendaryModuleIds ?? [];
  const check = LegendarySystem.canInstall(legendaryId, current, moduleId);
  if (!check.ok) {
    return { draft, ok: false, reason: check.reason };
  }
  return {
    draft: {
      ...draft,
      legendaryModuleIds: [...current, moduleId],
    },
    ok: true,
  };
}

export function removeLegendaryModuleFromDraft(
  draft: ArmyDraft,
  moduleId: string,
): ArmyDraft {
  const current = draft.legendaryModuleIds ?? [];
  return {
    ...draft,
    legendaryModuleIds: current.filter((id) => id !== moduleId),
  };
}

import type { Army, ArmyDraft } from "../../domain/armyBuilder/types";
import {
  ARMY_NAME_MAX_LENGTH,
} from "../../domain/armyBuilder/types";
import { validateArmy } from "../../domain/armyBuilder/validation";
import { CommanderSystem } from "../../domain/commander/commanderSystem";
import {
  autoPlaceUnits,
  isPlayerDeploymentCell,
  unitIdsFromPlacements,
} from "../../domain/deployment";
import { EdgerunnerSystem } from "../../domain/edgerunner/edgerunnerSystem";
import { LegendarySystem } from "../../domain/legendary/legendarySystem";
import {
  armyBuilderCatalogLookup,
  getFactionById,
  getUnitById,
} from "../../data/catalog/armyBuilder";
import {
  canUseLocalStorage,
  readJson,
  writeJson,
} from "../persistence/localStoragePort";
import { STORAGE_KEYS } from "../persistence/storageKeys";

const STORAGE_KEY = STORAGE_KEYS.armies;

export interface SaveArmyOptions {
  /** Required for owned progress; sets Army.ownerId. */
  ownerId?: string | null;
}

function newArmyId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `army-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isArmyRecord(value: unknown): value is Army {
  if (!value || typeof value !== "object") {
    return false;
  }
  const army = value as Partial<Army>;
  return (
    typeof army.id === "string" &&
    typeof army.name === "string" &&
    typeof army.factionId === "string" &&
    Array.isArray(army.unitIds)
  );
}

function sanitizeArmy(army: Army): Army | null {
  if (!getFactionById(army.factionId)) {
    return null;
  }

  const unitIds = army.unitIds.filter((id) => {
    const unit = getUnitById(id);
    if (!unit) {
      return false;
    }
    return EdgerunnerSystem.isCompatibleWithFaction(unit, army.factionId);
  });

  let placements = (army.placements ?? []).filter(
    (p) =>
      typeof p.placementId === "string" &&
      typeof p.unitId === "string" &&
      unitIds.includes(p.unitId) &&
      isPlayerDeploymentCell(p.x, p.y),
  );

  if (placements.length === 0 && unitIds.length > 0) {
    placements = autoPlaceUnits(unitIds);
  } else if (placements.length > 0) {
    // Keep placement order as roster order
    const fromPlacements = unitIdsFromPlacements(placements);
    // Drop placements whose unit was filtered out already handled; re-sync ids
    if (fromPlacements.length !== unitIds.length) {
      placements = autoPlaceUnits(unitIds);
    }
  }

  const syncedIds = unitIdsFromPlacements(placements);

  const hasCommander = syncedIds.some((id) => {
    const unit = getUnitById(id);
    return unit?.type === "commander";
  });

  const hasLegendary = syncedIds.some((id) =>
    LegendarySystem.hasCustomizer(id),
  );

  const commanderImplantIds = hasCommander
    ? (army.commanderImplantIds ?? []).filter((id) =>
        Boolean(CommanderSystem.getImplant(id)),
      )
    : [];

  const legendaryModuleIds = hasLegendary
    ? (army.legendaryModuleIds ?? []).filter((id) =>
        Boolean(LegendarySystem.getModule(id)),
      )
    : [];

  return {
    id: army.id,
    name: army.name.trim().slice(0, ARMY_NAME_MAX_LENGTH) || "Боевая сеть",
    factionId: army.factionId,
    unitIds: syncedIds,
    placements,
    commanderImplantIds,
    legendaryModuleIds,
    ownerId: typeof army.ownerId === "string" ? army.ownerId : null,
    updatedAt:
      typeof army.updatedAt === "number" ? army.updatedAt : Date.now(),
  };
}

function readAll(): Army[] {
  if (!canUseLocalStorage()) {
    return [];
  }
  const parsed = readJson<unknown>(STORAGE_KEY);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed
    .filter(isArmyRecord)
    .map(sanitizeArmy)
    .filter((army): army is Army => army !== null);
}

function writeAll(armies: Army[]): void {
  writeJson(STORAGE_KEY, armies);
}

/**
 * List armies. When ownerId is set, returns that player's armies
 * (plus legacy unclaimed rows so old saves remain visible once).
 */
export function listSavedArmies(ownerId?: string | null): Army[] {
  const all = readAll().sort((a, b) => b.updatedAt - a.updatedAt);
  if (!ownerId) {
    return all;
  }
  return all.filter(
    (army) => army.ownerId === ownerId || army.ownerId === null,
  );
}

export function getSavedArmy(id: string): Army | undefined {
  return readAll().find((army) => army.id === id);
}

export type SaveArmyResult =
  | { ok: true; army: Army }
  | { ok: false; codes: string[] };

/**
 * Persist draft only if validation passes.
 */
export function saveArmyDraft(
  draft: ArmyDraft,
  options: SaveArmyOptions = {},
): SaveArmyResult {
  const placements =
    draft.placements?.length > 0
      ? draft.placements
      : autoPlaceUnits(draft.unitIds);
  const normalized: ArmyDraft = {
    ...draft,
    placements,
    unitIds: unitIdsFromPlacements(placements),
    legendaryModuleIds: draft.legendaryModuleIds ?? [],
  };

  const validation = validateArmy(normalized, armyBuilderCatalogLookup);
  if (!validation.ok) {
    return { ok: false, codes: validation.codes };
  }

  const existing = draft.id ? getSavedArmy(draft.id) : undefined;
  const ownerId =
    options.ownerId !== undefined
      ? options.ownerId
      : (draft.ownerId ?? existing?.ownerId ?? null);

  const army: Army = {
    id: draft.id ?? newArmyId(),
    name: draft.name.trim().slice(0, ARMY_NAME_MAX_LENGTH),
    factionId: draft.factionId,
    unitIds: [...normalized.unitIds],
    placements: normalized.placements.map((p) => ({ ...p })),
    commanderImplantIds: [...(draft.commanderImplantIds ?? [])],
    legendaryModuleIds: [...(normalized.legendaryModuleIds ?? [])],
    ownerId,
    updatedAt: Date.now(),
  };

  const sanitized = sanitizeArmy(army);
  if (!sanitized) {
    return { ok: false, codes: ["missing_faction"] };
  }

  const revalidate = validateArmy(
    {
      name: sanitized.name,
      factionId: sanitized.factionId,
      unitIds: sanitized.unitIds,
      commanderImplantIds: sanitized.commanderImplantIds,
      placements: sanitized.placements ?? [],
      legendaryModuleIds: sanitized.legendaryModuleIds ?? [],
    },
    armyBuilderCatalogLookup,
  );
  if (!revalidate.ok) {
    return { ok: false, codes: revalidate.codes };
  }

  const armies = readAll();
  const index = armies.findIndex((item) => item.id === sanitized.id);
  if (index === -1) {
    writeAll([sanitized, ...armies]);
  } else {
    const copy = [...armies];
    copy[index] = sanitized;
    writeAll(copy);
  }

  return { ok: true, army: sanitized };
}

export function deleteSavedArmy(
  armyId: string,
  ownerId?: string | null,
): boolean {
  const armies = readAll();
  const target = armies.find((army) => army.id === armyId);
  if (!target) {
    return false;
  }
  if (ownerId && target.ownerId && target.ownerId !== ownerId) {
    return false;
  }
  writeAll(armies.filter((army) => army.id !== armyId));
  return true;
}

/** Claim legacy null-owner armies for a user (one-time migration helper). */
export function claimUnownedArmies(ownerId: string): number {
  const armies = readAll();
  let claimed = 0;
  const next = armies.map((army) => {
    if (army.ownerId === null) {
      claimed += 1;
      return { ...army, ownerId };
    }
    return army;
  });
  if (claimed > 0) {
    writeAll(next);
  }
  return claimed;
}

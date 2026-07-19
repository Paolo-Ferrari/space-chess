import type { Army } from "../../domain/army/army.types";
import {
  ARMY_MAX_UNITS,
  ARMY_NAME_MAX_LENGTH,
  armyToSlots,
  slotsToUnitIds,
} from "../../domain/army/army.types";
import { ensureHeroKingInSlots } from "../../domain/army/armyKing";
import {
  getHeroById,
  getKingUnitIdsForHero,
  getUnitById,
} from "../collection/collectionService";

/** Current storage key. Legacy keys are migrated on read. */
const STORAGE_KEY = "space-chess.armies.v1";
const LEGACY_STORAGE_KEYS = ["mvs42.armies.v2"] as const;
const FALLBACK_HERO_ID = "hero-cosmodesant";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readRawArmies(): string | null {
  const current = window.localStorage.getItem(STORAGE_KEY);
  if (current) {
    return current;
  }

  for (const legacyKey of LEGACY_STORAGE_KEYS) {
    const legacy = window.localStorage.getItem(legacyKey);
    if (legacy) {
      window.localStorage.setItem(STORAGE_KEY, legacy);
      return legacy;
    }
  }

  return null;
}

function readAll(): Army[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = readRawArmies();
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isArmyRecord).map(sanitizeArmy);
  } catch {
    return [];
  }
}

function writeAll(armies: Army[]): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(armies));
}

function isArmyRecord(value: unknown): value is Army {
  if (!value || typeof value !== "object") {
    return false;
  }

  const army = value as Partial<Army>;
  return (
    typeof army.id === "string" &&
    typeof army.name === "string" &&
    typeof army.heroId === "string" &&
    Array.isArray(army.unitDefinitionIds)
  );
}

function sanitizeArmy(army: Army): Army {
  const heroId = getHeroById(army.heroId)
    ? army.heroId
    : (getHeroById(FALLBACK_HERO_ID)?.id ?? army.heroId);

  const cleaned = army.unitDefinitionIds.filter((id) => {
    if (typeof id !== "string") {
      return false;
    }
    const unit = getUnitById(id);
    if (!unit) {
      return false;
    }
    if (unit.heroId && unit.heroId !== heroId) {
      return false;
    }
    return true;
  });

  const slots = ensureHeroKingInSlots(
    armyToSlots({ ...army, heroId, unitDefinitionIds: cleaned }),
    heroId,
    getUnitById,
    getKingUnitIdsForHero,
  );

  const name =
    army.name.trim().slice(0, ARMY_NAME_MAX_LENGTH) || "Армия";

  return {
    id: army.id,
    name,
    heroId,
    unitDefinitionIds: slotsToUnitIds(slots).slice(0, ARMY_MAX_UNITS),
    updatedAt:
      typeof army.updatedAt === "number" ? army.updatedAt : Date.now(),
  };
}

export function listArmies(): Army[] {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function createArmy(input: {
  name: string;
  heroId: string;
}): Army {
  const armies = readAll();
  const army: Army = {
    id: crypto.randomUUID(),
    name:
      input.name.trim().slice(0, ARMY_NAME_MAX_LENGTH) || "Новая армия",
    heroId: input.heroId,
    unitDefinitionIds: getKingUnitIdsForHero(input.heroId),
    updatedAt: Date.now(),
  };
  const created = sanitizeArmy(army);
  writeAll([created, ...armies]);
  return created;
}

export function saveArmy(army: Army): Army {
  const next = sanitizeArmy({ ...army, updatedAt: Date.now() });
  const armies = readAll();
  const index = armies.findIndex((item) => item.id === next.id);

  if (index === -1) {
    writeAll([next, ...armies]);
  } else {
    const copy = [...armies];
    copy[index] = next;
    writeAll(copy);
  }

  return next;
}

export function deleteArmy(armyId: string): void {
  writeAll(readAll().filter((army) => army.id !== armyId));
}

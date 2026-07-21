import { BalanceSystem } from "../balance/balanceSystem";
import { CommanderSystem } from "../commander/commanderSystem";
import {
  autoPlaceUnits,
  isPlayerDeploymentCell,
  unitIdsFromPlacements,
} from "../deployment";
import { EdgerunnerSystem } from "../edgerunner/edgerunnerSystem";
import { LegendarySystem } from "../legendary/legendarySystem";
import {
  type ArmyDraft,
  type UnitDefinition,
  type UnitType,
} from "./types";

export type ArmyValidationCode =
  | "ok"
  | "missing_faction"
  | "missing_commander"
  | "missing_ripperdoc"
  | "energy_exceeded"
  | "slots_exceeded"
  | "unknown_unit"
  | "faction_mismatch"
  | "duplicate_unique_role"
  | "empty_name"
  | "invalid_implants"
  | "implant_slots_exceeded"
  | "edgerunner_limit"
  | "edgerunners_only"
  | "unavailable_edgerunner"
  | "invalid_deployment"
  | "deployment_out_of_zone"
  | "deployment_overlap"
  | "invalid_legendary_modules"
  | "legendary_slots_exceeded";

export interface ArmyValidationResult {
  ok: boolean;
  codes: ArmyValidationCode[];
  energyUsed: number;
  energyRemaining: number;
  slotCount: number;
}

export interface CatalogLookup {
  getUnitById: (id: string) => UnitDefinition | undefined;
}

export function sumArmyEnergy(
  unitIds: readonly string[],
  lookup: CatalogLookup,
): number {
  return unitIds.reduce((total, id) => {
    const unit = lookup.getUnitById(id);
    return total + (unit?.cost ?? 0);
  }, 0);
}

/** Unit costs + implant/module Combat Capacity taxes from Balance Config. */
export function sumArmyCombatCapacity(
  draft: {
    unitIds: string[];
    commanderImplantIds?: string[];
    legendaryModuleIds?: string[];
  },
  lookup: CatalogLookup,
): number {
  const units = sumArmyEnergy(draft.unitIds, lookup);
  const implants = BalanceSystem.implantEnergyTax(
    draft.commanderImplantIds ?? [],
  );
  const modules = BalanceSystem.legendaryModuleEnergyTax(
    (draft.legendaryModuleIds ?? []).length,
  );
  return units + implants + modules;
}

function countType(
  unitIds: readonly string[],
  type: UnitType,
  lookup: CatalogLookup,
): number {
  return unitIds.reduce((count, id) => {
    const unit = lookup.getUnitById(id);
    return unit?.type === type ? count + 1 : count;
  }, 0);
}

function findCommanderId(
  unitIds: readonly string[],
  lookup: CatalogLookup,
): string | null {
  for (const id of unitIds) {
    const unit = lookup.getUnitById(id);
    if (unit && CommanderSystem.isCommanderUnit(unit)) {
      return id;
    }
  }
  return null;
}

function findLegendaryId(
  unitIds: readonly string[],
  lookup: CatalogLookup,
): string | null {
  for (const id of unitIds) {
    const unit = lookup.getUnitById(id);
    if (unit && LegendarySystem.hasCustomizer(unit.id)) {
      return id;
    }
  }
  return null;
}

function validateDeployment(draft: {
  unitIds: string[];
  placements?: ArmyDraft["placements"];
}): ArmyValidationCode[] {
  const codes: ArmyValidationCode[] = [];
  const placements = draft.placements ?? [];
  if (placements.length === 0 && draft.unitIds.length === 0) {
    return codes;
  }
  const effective =
    placements.length > 0 ? placements : autoPlaceUnits(draft.unitIds);
  if (unitIdsFromPlacements(effective).join("|") !== draft.unitIds.join("|")) {
    // Allow unitIds-only legacy if placements empty — sync on save
    if (placements.length > 0) {
      codes.push("invalid_deployment");
    }
  }
  const seen = new Set<string>();
  for (const p of effective) {
    if (!isPlayerDeploymentCell(p.x, p.y)) {
      codes.push("deployment_out_of_zone");
    }
    const key = `${p.x},${p.y}`;
    if (seen.has(key)) {
      codes.push("deployment_overlap");
    }
    seen.add(key);
  }
  return [...new Set(codes)];
}

/**
 * Full validation for save / confirm.
 */
export function validateArmy(
  draft: {
    name: string;
    factionId: string;
    unitIds: string[];
    commanderImplantIds?: string[];
    placements?: ArmyDraft["placements"];
    legendaryModuleIds?: string[];
  },
  lookup: CatalogLookup,
): ArmyValidationResult {
  const codes: ArmyValidationCode[] = [];
  const capacity = BalanceSystem.combatCapacity();
  const maxSlots = BalanceSystem.maxSlots();
  const energyUsed = sumArmyCombatCapacity(draft, lookup);
  const slotCount = draft.unitIds.length;
  const implantIds = draft.commanderImplantIds ?? [];
  const legendaryModuleIds = draft.legendaryModuleIds ?? [];

  if (!draft.factionId) {
    codes.push("missing_faction");
  }

  if (!draft.name.trim()) {
    codes.push("empty_name");
  }

  if (slotCount > maxSlots) {
    codes.push("slots_exceeded");
  }

  if (energyUsed > capacity) {
    codes.push("energy_exceeded");
  }

  let unknown = false;
  let mismatch = false;
  let unavailableEdge = false;
  for (const id of draft.unitIds) {
    const unit = lookup.getUnitById(id);
    if (!unit) {
      unknown = true;
      continue;
    }
    if (!EdgerunnerSystem.isCompatibleWithFaction(unit, draft.factionId)) {
      mismatch = true;
    }
    if (EdgerunnerSystem.isEdgerunnerUnit(unit)) {
      const profile = EdgerunnerSystem.getProfileByUnitId(unit.id);
      if (!profile?.available) {
        unavailableEdge = true;
      }
    }
  }
  if (unknown) {
    codes.push("unknown_unit");
  }
  if (mismatch) {
    codes.push("faction_mismatch");
  }
  if (unavailableEdge) {
    codes.push("unavailable_edgerunner");
  }

  const commanders = countType(draft.unitIds, "commander", lookup);
  const rippers = countType(draft.unitIds, "ripperdoc", lookup);
  const edgerunners = countType(draft.unitIds, "edgerunner", lookup);
  const factionCore = draft.unitIds.filter((id) => {
    const unit = lookup.getUnitById(id);
    return unit && !EdgerunnerSystem.isEdgerunnerUnit(unit);
  }).length;

  if (commanders < 1) {
    codes.push("missing_commander");
  }
  if (rippers < 1) {
    codes.push("missing_ripperdoc");
  }
  const legendaries = countType(draft.unitIds, "legendary", lookup);

  if (commanders > 1 || rippers > 1 || legendaries > 1) {
    codes.push("duplicate_unique_role");
  }

  if (edgerunners > BalanceSystem.config.army.maxEdgerunners) {
    codes.push("edgerunner_limit");
  }

  if (slotCount > 0 && factionCore === 0) {
    codes.push("edgerunners_only");
  }

  const commanderId = findCommanderId(draft.unitIds, lookup);
  const implantCheck = CommanderSystem.validateLoadout(
    commanderId,
    draft.factionId,
    implantIds,
  );
  if (!implantCheck.ok) {
    if (implantCheck.codes.includes("slots_exceeded")) {
      codes.push("implant_slots_exceeded");
    }
    if (
      implantCheck.codes.some(
        (code) =>
          code === "unknown_implant" ||
          code === "faction_lock" ||
          code === "no_commander",
      )
    ) {
      codes.push("invalid_implants");
    }
  }

  const legendaryId = findLegendaryId(draft.unitIds, lookup);
  const legendaryCheck = LegendarySystem.validateLoadout(
    legendaryId,
    legendaryModuleIds,
  );
  if (!legendaryCheck.ok) {
    if (legendaryCheck.codes.includes("slots_exceeded")) {
      codes.push("legendary_slots_exceeded");
    } else {
      codes.push("invalid_legendary_modules");
    }
  }

  codes.push(...validateDeployment(draft));

  return {
    ok: codes.length === 0,
    codes,
    energyUsed,
    energyRemaining: capacity - energyUsed,
    slotCount,
  };
}

export type AddUnitRejectReason =
  | "unknown_unit"
  | "faction_mismatch"
  | "energy_exceeded"
  | "slots_exceeded"
  | "duplicate_unique_role"
  | "edgerunner_limit"
  | "already_hired"
  | "unavailable_edgerunner";

export interface CanAddUnitResult {
  ok: boolean;
  reason?: AddUnitRejectReason;
}

/**
 * Can this unit be appended to the draft right now?
 */
export function canAddUnit(
  draft: Pick<ArmyDraft, "factionId" | "unitIds">,
  unitId: string,
  lookup: CatalogLookup,
): CanAddUnitResult {
  const unit = lookup.getUnitById(unitId);
  if (!unit) {
    return { ok: false, reason: "unknown_unit" };
  }
  if (!EdgerunnerSystem.isCompatibleWithFaction(unit, draft.factionId)) {
    return { ok: false, reason: "faction_mismatch" };
  }
  if (draft.unitIds.length >= BalanceSystem.maxSlots()) {
    return { ok: false, reason: "slots_exceeded" };
  }

  if (EdgerunnerSystem.isEdgerunnerUnit(unit)) {
    const hire = EdgerunnerSystem.canHire(draft.unitIds, unitId, lookup.getUnitById);
    if (!hire.ok) {
      if (hire.reason === "limit_reached") {
        return { ok: false, reason: "edgerunner_limit" };
      }
      if (hire.reason === "already_hired") {
        return { ok: false, reason: "already_hired" };
      }
      if (hire.reason === "unavailable") {
        return { ok: false, reason: "unavailable_edgerunner" };
      }
      return { ok: false, reason: "unknown_unit" };
    }
  }

  if (
    unit.type === "commander" ||
    unit.type === "ripperdoc" ||
    unit.type === "legendary"
  ) {
    const already = draft.unitIds.some((id) => {
      const existing = lookup.getUnitById(id);
      return existing?.type === unit.type;
    });
    if (already) {
      return { ok: false, reason: "duplicate_unique_role" };
    }
  }

  const nextEnergy = sumArmyEnergy(draft.unitIds, lookup) + unit.cost;
  if (nextEnergy > BalanceSystem.combatCapacity()) {
    return { ok: false, reason: "energy_exceeded" };
  }

  return { ok: true };
}

export const VALIDATION_MESSAGES: Record<ArmyValidationCode, string> = {
  ok: "Боевая сеть готова",
  missing_faction: "Выберите фракцию",
  missing_commander: "Нужен нейро-командир",
  missing_ripperdoc: "Нужен Риппердок",
  energy_exceeded: "Превышен Combat Capacity",
  slots_exceeded: "Слишком много слотов",
  unknown_unit: "В армии неизвестный юнит",
  faction_mismatch: "Юнит другой фракции",
  duplicate_unique_role:
    "Уникальная роль уже в сети (Командир / Риппердок / Легенда)",
  empty_name: "Введите название армии",
  invalid_implants: "Некорректные кибер-модули командира",
  implant_slots_exceeded: "Превышены слоты имплантов командира",
  edgerunner_limit: `Слишком много операторов (макс. ${EdgerunnerSystem.maxPerArmy})`,
  edgerunners_only: "Сеть не может состоять только из операторов",
  unavailable_edgerunner: "В сети недоступный оператор",
  invalid_deployment: "Расстановка не совпадает с составом",
  deployment_out_of_zone: "Фигура вне зоны размещения",
  deployment_overlap: "Две фигуры на одной клетке",
  invalid_legendary_modules: "Некорректные модули легендарного юнита",
  legendary_slots_exceeded: "Превышены слоты модулей легенды",
};

export const ADD_REJECT_MESSAGES: Record<AddUnitRejectReason, string> = {
  unknown_unit: "Юнит недоступен",
  faction_mismatch: "Юнит недоступен для этой фракции",
  energy_exceeded: "Не хватает энергии",
  slots_exceeded: "Нет свободных слотов",
  duplicate_unique_role: "Эта уникальная роль уже в армии",
  edgerunner_limit: `Лимит наёмников: максимум ${EdgerunnerSystem.maxPerArmy}`,
  already_hired: "Этот наёмник уже в армии",
  unavailable_edgerunner: "Наёмник недоступен",
};

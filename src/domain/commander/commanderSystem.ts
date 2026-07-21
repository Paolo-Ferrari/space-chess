import {
  getCommanderByFactionId,
  getCommanderByUnitId,
  listCommanders,
} from "../../data/catalog/commanders";
import {
  getImplantById,
  listImplants,
} from "../../data/catalog/implants";
import type { UnitDefinition, UnitStats } from "../armyBuilder/types";
import { BalanceSystem } from "../balance/balanceSystem";
import { UnitSystem } from "../unit/unitSystem";

import type { ImplantDefinition } from "./types";
import { IMPLANT_TYPE_LABELS } from "./types";

export type ImplantInstallReject =
  | "unknown_implant"
  | "no_commander"
  | "not_commander_unit"
  | "slots_exceeded"
  | "max_stacks"
  | "faction_lock"
  | "already_installed";

export const IMPLANT_REJECT_MESSAGES: Record<ImplantInstallReject, string> = {
  unknown_implant: "Имплант не найден",
  no_commander: "Сначала добавьте Командира в армию",
  not_commander_unit: "Импланты только для Командира",
  slots_exceeded: "Не хватает слотов имплантов",
  max_stacks: "Лимит копий импланта",
  faction_lock: "Имплант недоступен этой фракции",
  already_installed: "Уже установлен",
};

function sumSlotCost(implantIds: readonly string[]): number {
  return implantIds.reduce((total, id) => {
    const implant = getImplantById(id);
    return total + (implant?.slotCost ?? 0);
  }, 0);
}

function mergeStats(base: UnitStats, mods: ImplantDefinition["statMods"]): UnitStats {
  return {
    hp: Math.max(1, base.hp + (mods.hp ?? 0)),
    attack: Math.max(0, base.attack + (mods.attack ?? 0)),
    defense: Math.max(0, base.defense + (mods.defense ?? 0)),
    movement: Math.max(0, base.movement + (mods.movement ?? 0)),
    range: Math.max(0, base.range + (mods.range ?? 0)),
  };
}

/**
 * Commander System — personalization via implants.
 * New implants = catalog only; do not edit this facade for content.
 */
export const CommanderSystem = {
  listCommanders,
  getCommanderByUnitId,
  getCommanderByFactionId,
  listImplants,
  getImplant: getImplantById,
  typeLabel: (type: ImplantDefinition["type"]) => IMPLANT_TYPE_LABELS[type],

  isCommanderUnit(definition: UnitDefinition | undefined): boolean {
    if (!definition) {
      return false;
    }
    return (
      definition.type === "commander" ||
      Boolean(getCommanderByUnitId(definition.id))
    );
  },

  slotCapacity(commanderUnitId: string): number {
    return getCommanderByUnitId(commanderUnitId)?.implantSlots ?? 0;
  },

  slotsUsed(implantIds: readonly string[]): number {
    return sumSlotCost(implantIds);
  },

  slotsRemaining(commanderUnitId: string, implantIds: readonly string[]): number {
    return Math.max(
      0,
      this.slotCapacity(commanderUnitId) - sumSlotCost(implantIds),
    );
  },

  getEffectiveStats(
    commanderUnitId: string,
    implantIds: readonly string[],
  ): UnitStats | undefined {
    const base = UnitSystem.get(commanderUnitId);
    if (!base) {
      return undefined;
    }
    const merged = implantIds.reduce((stats, id) => {
      const implant = getImplantById(id);
      return implant ? mergeStats(stats, implant.statMods) : stats;
    }, { ...base.stats });
    return BalanceSystem.clampCommanderMods(base.stats, merged);
  },

  /** Extra ability ids from installed implants. */
  getGrantedAbilityIds(implantIds: readonly string[]): string[] {
    const ids: string[] = [];
    for (const implantId of implantIds) {
      const implant = getImplantById(implantId);
      if (implant) {
        ids.push(...implant.abilityIds);
      }
    }
    return ids;
  },

  canInstall(
    commanderUnitId: string | null,
    factionId: string,
    currentImplantIds: readonly string[],
    implantId: string,
  ): { ok: boolean; reason?: ImplantInstallReject } {
    if (!commanderUnitId) {
      return { ok: false, reason: "no_commander" };
    }
    const commander = UnitSystem.get(commanderUnitId);
    if (!this.isCommanderUnit(commander)) {
      return { ok: false, reason: "not_commander_unit" };
    }
    const implant = getImplantById(implantId);
    if (!implant) {
      return { ok: false, reason: "unknown_implant" };
    }
    if (currentImplantIds.includes(implantId)) {
      return { ok: false, reason: "already_installed" };
    }
    const maxStacks = implant.restrictions?.maxStacks ?? 1;
    const stacks = currentImplantIds.filter((id) => id === implantId).length;
    if (stacks >= maxStacks) {
      return { ok: false, reason: "max_stacks" };
    }
    const allowedFactions = implant.restrictions?.factionIds;
    if (allowedFactions && !allowedFactions.includes(factionId)) {
      return { ok: false, reason: "faction_lock" };
    }
    if (
      sumSlotCost(currentImplantIds) + implant.slotCost >
      this.slotCapacity(commanderUnitId)
    ) {
      return { ok: false, reason: "slots_exceeded" };
    }
    return { ok: true };
  },

  validateLoadout(
    commanderUnitId: string | null,
    factionId: string,
    implantIds: readonly string[],
  ): { ok: boolean; codes: ImplantInstallReject[] } {
    const codes: ImplantInstallReject[] = [];
    if (!commanderUnitId) {
      if (implantIds.length > 0) {
        codes.push("no_commander");
      }
      return { ok: codes.length === 0, codes };
    }
    if (sumSlotCost(implantIds) > this.slotCapacity(commanderUnitId)) {
      codes.push("slots_exceeded");
    }
    for (const id of implantIds) {
      const implant = getImplantById(id);
      if (!implant) {
        codes.push("unknown_implant");
        continue;
      }
      const allowed = implant.restrictions?.factionIds;
      if (allowed && !allowed.includes(factionId)) {
        codes.push("faction_lock");
      }
    }
    return { ok: codes.length === 0, codes };
  },
};

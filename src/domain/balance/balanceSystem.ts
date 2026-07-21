import { BALANCE_CONFIG, type BalanceRole } from "../../data/balance/balance.config";
import type { UnitDefinition, UnitStats } from "../armyBuilder/types";
import type { ImplantDefinition } from "../commander/types";
import type { LegendaryModuleDefinition, LegendaryProfile } from "../legendary/types";

function clampStat(value: number, min = 0): number {
  return Math.max(min, value);
}

function mergeStats(base: UnitStats, mods?: Partial<UnitStats>): UnitStats {
  if (!mods) {
    return { ...base };
  }
  return {
    hp: clampStat(base.hp + (mods.hp ?? 0), 1),
    attack: clampStat(base.attack + (mods.attack ?? 0)),
    defense: clampStat(base.defense + (mods.defense ?? 0)),
    movement: clampStat(base.movement + (mods.movement ?? 0)),
    range: clampStat(base.range + (mods.range ?? 0)),
  };
}

function applyPartialStats(
  base: UnitStats,
  patch?: Partial<UnitStats>,
): UnitStats {
  if (!patch) {
    return { ...base };
  }
  return {
    hp: patch.hp ?? base.hp,
    attack: patch.attack ?? base.attack,
    defense: patch.defense ?? base.defense,
    movement: patch.movement ?? base.movement,
    range: patch.range ?? base.range,
  };
}

/**
 * Balance System — resolves effective definitions from Balance Config.
 * Catalogs stay as content shells; tunables live in balance.config.ts.
 */
export const BalanceSystem = {
  config: BALANCE_CONFIG,

  combatCapacity(): number {
    return BALANCE_CONFIG.army.combatCapacity;
  },

  maxSlots(): number {
    return BALANCE_CONFIG.army.maxSlots;
  },

  combat() {
    return BALANCE_CONFIG.combat;
  },

  factionProfile(factionId: string) {
    return BALANCE_CONFIG.factions[factionId];
  },

  commanderStyles() {
    return BALANCE_CONFIG.commanderStyles;
  },

  roleFor(unit: UnitDefinition): BalanceRole {
    const override = BALANCE_CONFIG.units[unit.id]?.role;
    if (override) {
      return override;
    }
    return BALANCE_CONFIG.typeToRole[unit.type] ?? "infantry";
  },

  /**
   * Apply unit + faction balance overlays to a catalog definition.
   */
  applyUnit(raw: UnitDefinition): UnitDefinition {
    const unitPatch = BALANCE_CONFIG.units[raw.id];
    const faction = BALANCE_CONFIG.factions[raw.factionId];
    let stats = applyPartialStats(raw.stats, unitPatch?.stats);
    if (faction?.statMods) {
      stats = mergeStats(stats, faction.statMods);
    }
    let cost = unitPatch?.cost ?? raw.cost;
    if (faction?.costMultiplier != null && faction.costMultiplier !== 1) {
      cost = Math.max(1, Math.round(cost * faction.costMultiplier));
    }
    return {
      ...raw,
      cost,
      stats,
    };
  },

  applyImplant(raw: ImplantDefinition): ImplantDefinition {
    const patch = BALANCE_CONFIG.implantsById[raw.id];
    if (!patch) {
      return raw;
    }
    return {
      ...raw,
      slotCost: patch.slotCost ?? raw.slotCost,
      statMods: { ...raw.statMods, ...patch.statMods },
    };
  },

  applyLegendaryModule(
    raw: LegendaryModuleDefinition,
  ): LegendaryModuleDefinition {
    const patch = BALANCE_CONFIG.legendaryModulesById[raw.id];
    if (!patch) {
      return raw;
    }
    return {
      ...raw,
      slotCost: patch.slotCost ?? raw.slotCost,
      statMods: { ...raw.statMods, ...patch.statMods },
    };
  },

  applyLegendaryProfile(raw: LegendaryProfile): LegendaryProfile {
    const override = BALANCE_CONFIG.legendary.profileOverrides[raw.id];
    if (!override?.moduleSlots) {
      return {
        ...raw,
        moduleSlots:
          raw.moduleSlots || BALANCE_CONFIG.legendary.defaultModuleSlots,
      };
    }
    return {
      ...raw,
      moduleSlots: override.moduleSlots,
    };
  },

  implantEnergyTax(implantIds: readonly string[]): number {
    return implantIds.reduce((total, id) => {
      const fromMap = BALANCE_CONFIG.implants.energyTaxByImplantId[id];
      const fromPatch = BALANCE_CONFIG.implantsById[id]?.energyTax;
      return total + (fromPatch ?? fromMap ?? 0);
    }, 0);
  },

  legendaryModuleEnergyTax(moduleCount: number): number {
    return moduleCount * BALANCE_CONFIG.legendary.energyTaxPerModule;
  },

  /**
   * Clamp implant mods so commanders cannot become immortal glass-cannons.
   */
  clampCommanderMods(
    base: UnitStats,
    effective: UnitStats,
  ): UnitStats {
    const rules = BALANCE_CONFIG.implants;
    const hpGain = Math.min(
      rules.maxHpFromImplants,
      effective.hp - base.hp,
    );
    const atkGain = Math.min(
      rules.maxAttackFromImplants,
      effective.attack - base.attack,
    );
    const defGain = Math.min(
      rules.maxDefenseFromImplants,
      effective.defense - base.defense,
    );
    return {
      hp: base.hp + Math.max(0, hpGain),
      attack: base.attack + Math.max(0, atkGain),
      defense: base.defense + Math.max(0, defGain),
      movement: effective.movement,
      range: effective.range,
    };
  },

  clampLegendaryMods(
    profileId: string,
    base: UnitStats,
    effective: UnitStats,
  ): UnitStats {
    const rules = BALANCE_CONFIG.legendary.profileOverrides[profileId];
    if (!rules) {
      return effective;
    }
    const hpCap = rules.maxHpFromModules ?? 99;
    const atkCap = rules.maxAttackFromModules ?? 99;
    return {
      hp: base.hp + Math.min(hpCap, Math.max(0, effective.hp - base.hp)),
      attack:
        base.attack +
        Math.min(atkCap, Math.max(0, effective.attack - base.attack)),
      defense: effective.defense,
      movement: effective.movement,
      range: effective.range,
    };
  },

  /**
   * Suggested cost from formula — used by balance tests / tooling.
   */
  suggestCost(unit: UnitDefinition): number {
    const w = BALANCE_CONFIG.costFormula;
    const role = this.roleFor(unit);
    const abilityTax = unit.abilities.length * w.ability;
    const raw =
      unit.stats.hp * w.hp +
      unit.stats.attack * w.attack +
      unit.stats.defense * w.defense +
      unit.stats.movement * w.movement +
      unit.stats.range * w.range +
      abilityTax +
      (w.uniqueness[role] ?? 0);
    return Math.max(1, Math.round(raw));
  },

  armyWarnThreshold(): number {
    const { combatCapacity, warnAtPercent } = BALANCE_CONFIG.army;
    return Math.floor((combatCapacity * warnAtPercent) / 100);
  },
};

import type { ModifiableStat, StatusEffectInstance } from "./types";
import type { PlayerId, UnitRuntime } from "../battle/types";

export function sumStatusModifier(
  unit: UnitRuntime,
  stat: ModifiableStat,
): number {
  return unit.statusEffects.reduce(
    (total, status) => total + (status.modifiers[stat] ?? 0),
    0,
  );
}

export function getEffectiveStat(
  base: number,
  unit: UnitRuntime,
  stat: ModifiableStat,
): number {
  const modified = base + sumStatusModifier(unit, stat);
  if (stat === "movement") {
    return Math.max(0, modified);
  }
  return Math.max(0, modified);
}

export interface ExpiredStatus {
  unitId: string;
  status: StatusEffectInstance;
}

/**
 * Tick statuses at end of a player's turn for units they own.
 * Permanent (-1) never expire.
 */
export function tickStatusesForOwner(
  units: UnitRuntime[],
  owner: PlayerId,
): { units: UnitRuntime[]; expired: ExpiredStatus[] } {
  const expired: ExpiredStatus[] = [];
  const next = units.map((unit) => {
    if (unit.owner !== owner) {
      return unit;
    }
    const kept: StatusEffectInstance[] = [];
    for (const status of unit.statusEffects) {
      if (status.remainingTurns < 0) {
        kept.push(status);
        continue;
      }
      const remaining = status.remainingTurns - 1;
      if (remaining <= 0) {
        expired.push({ unitId: unit.instanceId, status });
      } else {
        kept.push({ ...status, remainingTurns: remaining });
      }
    }
    return { ...unit, statusEffects: kept };
  });
  return { units: next, expired };
}

export function resetAbilityFlags(units: UnitRuntime[]): UnitRuntime[] {
  return units.map((unit) => ({ ...unit, hasUsedAbility: false }));
}

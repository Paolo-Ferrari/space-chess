import type { UnitDefinition } from "../unit/unit.types";
import { isKingUnit } from "../unit/unit.types";

import { ARMY_MAX_UNITS } from "./army.types";

/**
 * Ensure all mandatory commander figures for the hero are present in slots.
 * Supports factions with one or several commanders (e.g. Cosmodesant).
 */
export function ensureHeroKingInSlots(
  slots: Array<string | null>,
  heroId: string,
  getUnitById: (unitId: string) => UnitDefinition | undefined,
  getKingUnitIds: (heroId: string) => readonly string[],
): Array<string | null> {
  const kingIds = [...getKingUnitIds(heroId)];
  const kingIdSet = new Set(kingIds);
  const next = slots.slice(0, ARMY_MAX_UNITS);
  while (next.length < ARMY_MAX_UNITS) {
    next.push(null);
  }

  for (let index = 0; index < next.length; index += 1) {
    const unitId = next[index];
    if (!unitId) {
      continue;
    }
    const unit = getUnitById(unitId);
    if (unit && isKingUnit(unit) && !kingIdSet.has(unit.id)) {
      next[index] = null;
    }
  }

  for (const kingId of kingIds) {
    if (next.includes(kingId)) {
      continue;
    }

    const emptyIndex = next.findIndex((slot) => slot === null);
    if (emptyIndex !== -1) {
      next[emptyIndex] = kingId;
    } else {
      // Last resort: overwrite first non-king slot.
      const replaceIndex = next.findIndex((slot) => {
        if (!slot) {
          return true;
        }
        const unit = getUnitById(slot);
        return !unit || !isKingUnit(unit);
      });
      if (replaceIndex !== -1) {
        next[replaceIndex] = kingId;
      }
    }
  }

  return next;
}

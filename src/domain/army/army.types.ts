/** Max figures in one army (excluding the hero identity itself). */
export const ARMY_MAX_UNITS = 16;

/** Coin budget for building one army. */
export const ARMY_BUDGET = 100;

/** Max characters in an army name. */
export const ARMY_NAME_MAX_LENGTH = 16;

/**
 * Player-built army loadout.
 * `unitDefinitionIds` lists unit definition ids (order = slot order), length ≤ 16.
 */
export interface Army {
  id: string;
  name: string;
  heroId: string;
  unitDefinitionIds: string[];
  updatedAt: number;
}

export function sumArmyUnitCost(
  unitDefinitionIds: readonly string[],
  getCost: (unitId: string) => number | undefined,
): number {
  return unitDefinitionIds.reduce((total, unitId) => {
    const cost = getCost(unitId);
    return total + (typeof cost === "number" ? cost : 0);
  }, 0);
}


export function createEmptyArmySlots(): Array<string | null> {
  return Array.from({ length: ARMY_MAX_UNITS }, () => null);
}

export function armyToSlots(army: Army): Array<string | null> {
  const slots = createEmptyArmySlots();
  army.unitDefinitionIds.forEach((unitId, index) => {
    if (index < ARMY_MAX_UNITS) {
      slots[index] = unitId;
    }
  });
  return slots;
}

export function slotsToUnitIds(slots: Array<string | null>): string[] {
  return slots.filter((id): id is string => id !== null);
}

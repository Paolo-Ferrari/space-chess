import { HEROES_CATALOG, UNITS_CATALOG } from "../../data/catalog";
import type { GameCollection } from "../../domain/collection/collection.types";
import type { Hero } from "../../domain/hero/hero.types";
import {
  isKingUnit,
  type UnitDefinition,
} from "../../domain/unit/unit.types";

export function getCollection(): GameCollection {
  return {
    heroes: HEROES_CATALOG,
    units: UNITS_CATALOG,
  };
}

export function getHeroById(heroId: string): Hero | undefined {
  return HEROES_CATALOG.find((hero) => hero.id === heroId);
}

export function getUnitById(unitId: string): UnitDefinition | undefined {
  return UNITS_CATALOG.find((unit) => unit.id === unitId);
}

/** All mandatory commanders for a hero faction. */
export function getKingUnitsForHero(heroId: string): UnitDefinition[] {
  return UNITS_CATALOG.filter(
    (unit) => isKingUnit(unit) && unit.heroId === heroId,
  );
}

export function getKingUnitIdsForHero(heroId: string): string[] {
  return getKingUnitsForHero(heroId).map((unit) => unit.id);
}

/** Units allowed in an army for the selected hero (common + that hero's uniques). */
export function getUnitsForArmyHero(heroId: string): UnitDefinition[] {
  const units = UNITS_CATALOG.filter(
    (unit) => unit.heroId === null || unit.heroId === heroId,
  );

  return units.sort((a, b) => {
    const rank = (unit: UnitDefinition) => {
      if (isKingUnit(unit)) {
        return 0;
      }
      if (unit.heroId === heroId) {
        return 1;
      }
      return 2;
    };
    const byRank = rank(a) - rank(b);
    if (byRank !== 0) {
      return byRank;
    }
    return a.cost - b.cost || a.name.localeCompare(b.name, "ru");
  });
}

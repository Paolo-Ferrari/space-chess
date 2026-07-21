import type {
  UnitCatalogEntry,
  UnitDefinition,
  UnitRarity,
  UnitType,
} from "../../../domain/armyBuilder/types";
import { unitImagePath } from "../../assets/unitArt";

/** Default rarity from combat role when catalog omits `rarity`. */
export function rarityFromType(type: UnitType): UnitRarity {
  switch (type) {
    case "legendary":
      return "legendary";
    case "commander":
      return "epic";
    case "special":
    case "edgerunner":
      return "rare";
    case "ripperdoc":
      return "uncommon";
    default:
      return "common";
  }
}

/**
 * Finalize a catalog entry into a full UnitDefinition.
 * New units: call this (or omit optional art fields and let the registry map).
 */
export function defineUnit(entry: UnitCatalogEntry): UnitDefinition {
  return {
    ...entry,
    imagePath: entry.imagePath ?? unitImagePath(entry.id),
    rarity: entry.rarity ?? rarityFromType(entry.type),
    isLegendary: entry.isLegendary ?? entry.type === "legendary",
  };
}

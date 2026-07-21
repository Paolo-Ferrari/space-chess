/**
 * Content façade — single import surface for designers / future systems.
 *
 * Prefer this (or gameDatabase) over deep catalog paths in feature code.
 *
 * Extension quick map:
 * - Units / factions     → data/catalog/armyBuilder + gameDatabase
 * - Board icons / covers → data/visual + public/assets/unit-icons
 * - Maps / boards        → data/catalog/maps
 * - Victory rules        → data/catalog/victory
 * - Match modes          → data/catalog/modes
 * - Abilities            → data/catalog/abilities
 * - Faction UI themes    → theme/
 */

export {
  getDefaultMap,
  getMapById,
  listMaps,
  type MapDefinition,
} from "../data/catalog/maps";

export {
  getDefaultVictoryRule,
  getVictoryRule,
  listVictoryRules,
  type VictoryRuleDefinition,
} from "../data/catalog/victory";

export {
  getDefaultMatchMode,
  getMatchMode,
  listMatchModes,
  type MatchModeDefinition,
} from "../data/catalog/modes";

export {
  resolveUnitVisual,
  UNIT_VISUAL_OVERRIDES,
  type UnitVisualOverride,
} from "../data/visual";

export {
  getFactionById,
  getUnitById,
  listFactions,
  listUnits,
} from "../data/gameDatabase";

export { ThemeEngine, getFactionTheme } from "../theme";

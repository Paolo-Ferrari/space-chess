/**
 * Game Database — single entry for playable content catalogs.
 *
 * Add a unit: one catalog record (+ PNG under public/assets/units/).
 * Do not put unit stats in UI or battle systems.
 */

export {
  listFactions,
  getFactionById,
  listUnits,
  getUnitById,
  listUnitsByFaction,
  getRawUnitById,
  armyBuilderCatalogLookup,
} from "../catalog/armyBuilder";

export { defineUnit, rarityFromType } from "../catalog/units/defineUnit";
export {
  UNIT_PLACEHOLDER_IMAGE,
  unitImagePath,
  isUnitImagePath,
} from "../assets/unitArt";

export {
  listCommanders,
  getCommanderById,
  getCommanderByUnitId,
  getCommanderByFactionId,
} from "../catalog/commanders";

export {
  listRipperdocs,
  getRipperdocById,
  getRipperdocByUnitId,
  getRipperdocByFactionId,
} from "../catalog/ripperdocs";

export {
  listEdgerunnerProfiles,
  listEdgerunnerUnits,
  getEdgerunnerProfileById,
  getEdgerunnerProfileByUnitId,
  getEdgerunnerUnitById,
} from "../catalog/edgerunners";

export { listImplants, getImplantById } from "../catalog/implants";

export {
  listAbilities,
  getAbilityById,
  listStatuses,
  getStatusById,
} from "../catalog/abilities";

export {
  listLegendaryProfiles,
  getLegendaryProfileByUnitId,
  listLegendaryModules,
  getLegendaryModuleById,
} from "../catalog/legendary";

export {
  listMaps,
  getMapById,
  getDefaultMap,
} from "../catalog/maps";

export {
  listVictoryRules,
  getVictoryRule,
  getDefaultVictoryRule,
} from "../catalog/victory";

export {
  listMatchModes,
  getMatchMode,
  getDefaultMatchMode,
} from "../catalog/modes";

export { resolveUnitVisual } from "../visual";

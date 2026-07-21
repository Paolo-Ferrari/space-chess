import type { UnitDefinition } from "../../../domain/armyBuilder/types";
import type { EdgerunnerDefinition } from "../../../domain/edgerunner/types";

import {
  TEST_EDGERUNNER_PROFILES,
  TEST_EDGERUNNER_UNITS,
} from "./testEdgerunners.catalog";

const PROFILES: EdgerunnerDefinition[] = [...TEST_EDGERUNNER_PROFILES];
const UNITS: UnitDefinition[] = [...TEST_EDGERUNNER_UNITS];

const profileById = new Map(PROFILES.map((p) => [p.id, p]));
const profileByUnitId = new Map(
  PROFILES.map((p) => [p.unitDefinitionId, p]),
);
const unitById = new Map(UNITS.map((u) => [u.id, u]));

export function listEdgerunnerProfiles(): EdgerunnerDefinition[] {
  return PROFILES;
}

export function listEdgerunnerUnits(): UnitDefinition[] {
  return UNITS;
}

export function getEdgerunnerProfileById(
  id: string,
): EdgerunnerDefinition | undefined {
  return profileById.get(id);
}

export function getEdgerunnerProfileByUnitId(
  unitDefinitionId: string,
): EdgerunnerDefinition | undefined {
  return profileByUnitId.get(unitDefinitionId);
}

export function getEdgerunnerUnitById(
  id: string,
): UnitDefinition | undefined {
  return unitById.get(id);
}

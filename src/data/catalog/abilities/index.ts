import type {
  AbilityDefinition,
  StatusDefinition,
} from "../../../domain/ability/types";

import { STATUS_DEFINITIONS } from "./statuses.catalog";
import { TEST_ABILITIES } from "./testAbilities.catalog";

const ABILITIES: AbilityDefinition[] = [...TEST_ABILITIES];
const STATUSES: StatusDefinition[] = [...STATUS_DEFINITIONS];

const abilityById = new Map(ABILITIES.map((a) => [a.id, a]));
const statusById = new Map(STATUSES.map((s) => [s.id, s]));

export function listAbilities(): AbilityDefinition[] {
  return ABILITIES;
}

export function getAbilityById(id: string): AbilityDefinition | undefined {
  return abilityById.get(id);
}

export function listStatuses(): StatusDefinition[] {
  return STATUSES;
}

export function getStatusById(id: string): StatusDefinition | undefined {
  return statusById.get(id);
}

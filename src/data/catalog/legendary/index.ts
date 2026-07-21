import { BalanceSystem } from "../../../domain/balance/balanceSystem";

import {
  LEGENDARY_MODULES,
  LEGENDARY_PROFILES,
} from "./adamSmasher.catalog";

export function listLegendaryProfiles() {
  return LEGENDARY_PROFILES.map((p) => BalanceSystem.applyLegendaryProfile(p));
}

export function getLegendaryProfileByUnitId(unitDefinitionId: string) {
  const raw = LEGENDARY_PROFILES.find(
    (p) => p.unitDefinitionId === unitDefinitionId,
  );
  return raw ? BalanceSystem.applyLegendaryProfile(raw) : undefined;
}

export function getLegendaryProfileById(id: string) {
  const raw = LEGENDARY_PROFILES.find((p) => p.id === id);
  return raw ? BalanceSystem.applyLegendaryProfile(raw) : undefined;
}

export function listLegendaryModules() {
  return LEGENDARY_MODULES.map((m) => BalanceSystem.applyLegendaryModule(m));
}

export function getLegendaryModuleById(id: string) {
  const raw = LEGENDARY_MODULES.find((m) => m.id === id);
  return raw ? BalanceSystem.applyLegendaryModule(raw) : undefined;
}

export function listModulesForProfile(unitDefinitionId: string) {
  const profile = getLegendaryProfileByUnitId(unitDefinitionId);
  if (!profile) {
    return [];
  }
  return listLegendaryModules().filter((m) =>
    profile.allowedCategories.includes(m.category),
  );
}

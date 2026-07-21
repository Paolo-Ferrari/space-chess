import type { ImplantDefinition } from "../../../domain/commander/types";
import { BalanceSystem } from "../../../domain/balance/balanceSystem";

import { TEST_IMPLANTS } from "./testImplants.catalog";

const IMPLANTS: ImplantDefinition[] = [...TEST_IMPLANTS];
const byId = new Map(IMPLANTS.map((item) => [item.id, item]));

export function listImplants(): ImplantDefinition[] {
  return IMPLANTS.map((item) => BalanceSystem.applyImplant(item));
}

export function getImplantById(id: string): ImplantDefinition | undefined {
  const raw = byId.get(id);
  return raw ? BalanceSystem.applyImplant(raw) : undefined;
}

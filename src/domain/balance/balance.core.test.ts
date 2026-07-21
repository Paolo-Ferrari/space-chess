import { describe, expect, it } from "vitest";

import { armyBuilderCatalogLookup } from "../../data/catalog/armyBuilder";
import { validateArmy } from "../armyBuilder/validation";
import { armyToDraft } from "../armyBuilder/draft";
import { CommanderSystem } from "../commander/commanderSystem";
import { computeDamage } from "../battle/combatSystem";
import { UnitSystem } from "../unit/unitSystem";
import type { UnitRuntime } from "../battle/types";

import {
  BalanceSystem,
  buildSampleArmy,
  runDefaultBalanceSuite,
  simulateMatch,
} from "./index";

describe("Balance Config", () => {
  it("exposes Combat Capacity 100", () => {
    expect(BalanceSystem.combatCapacity()).toBe(100);
    expect(BalanceSystem.config.version).toContain("balance");
  });

  it("applies Adam Smasher override — expensive, not free win", () => {
    const smasher = UnitSystem.get("arasaka-adam-smasher");
    expect(smasher).toBeTruthy();
    expect(smasher!.cost).toBeGreaterThanOrEqual(40);
    expect(smasher!.stats.hp).toBeLessThanOrEqual(16);
    expect(smasher!.stats.attack).toBeLessThanOrEqual(7);
  });

  it("clamps commander implant stacking", () => {
    const base = UnitSystem.get("arasaka-commander")!;
    const effective = CommanderSystem.getEffectiveStats("arasaka-commander", [
      "implant-reinforced-armor",
      "implant-combat-module",
      "implant-optic-system",
    ]);
    expect(effective).toBeTruthy();
    expect(effective!.hp - base.stats.hp).toBeLessThanOrEqual(
      BalanceSystem.config.implants.maxHpFromImplants,
    );
    expect(effective!.attack - base.stats.attack).toBeLessThanOrEqual(
      BalanceSystem.config.implants.maxAttackFromImplants,
    );
  });

  it("counts implant energy tax toward Combat Capacity", () => {
    const army = buildSampleArmy(
      "tax",
      "Taxed",
      "faction-arasaka",
      ["arasaka-commander", "arasaka-ripperdoc", "arasaka-soldier"],
    );
    const draft = {
      ...armyToDraft(army),
      commanderImplantIds: [
        "implant-combat-module",
        "implant-reinforced-armor",
      ],
    };
    const result = validateArmy(draft, armyBuilderCatalogLookup);
    const unitOnly =
      (UnitSystem.get("arasaka-commander")?.cost ?? 0) +
      (UnitSystem.get("arasaka-ripperdoc")?.cost ?? 0) +
      (UnitSystem.get("arasaka-soldier")?.cost ?? 0);
    expect(result.energyUsed).toBeGreaterThan(unitOnly);
  });

  it("uses catalog defense in damage formula", () => {
    const atkDef = UnitSystem.get("arasaka-soldier")!;
    const tgtDef = UnitSystem.get("arasaka-heavy")!;
    const attacker = {
      definitionId: atkDef.id,
      implantIds: [],
      statusEffects: [],
    } as unknown as UnitRuntime;
    const target = {
      definitionId: tgtDef.id,
      implantIds: [],
      statusEffects: [],
    } as unknown as UnitRuntime;
    const dmg = computeDamage(atkDef, attacker, target, tgtDef);
    expect(dmg).toBeGreaterThanOrEqual(BalanceSystem.combat().minDamage);
    expect(dmg).toBeLessThan(atkDef.stats.attack);
  });
});

describe("Balance simulation", () => {
  it("runs AI vs AI match to completion or soft-cap", () => {
    const a = buildSampleArmy("a", "A", "faction-arasaka", [
      "arasaka-commander",
      "arasaka-ripperdoc",
      "arasaka-soldier",
    ]);
    const b = buildSampleArmy("b", "B", "faction-militech", [
      "militech-commander",
      "militech-ripperdoc",
      "militech-trooper",
    ]);
    const result = simulateMatch(a, b, { difficulty: "easy", maxTurns: 40 });
    expect(result.turns).toBeGreaterThan(0);
    expect(result.turns).toBeLessThanOrEqual(41);
  });

  it("produces a suite report with win rates", () => {
    const report = runDefaultBalanceSuite(2);
    expect(report.matchups.length).toBeGreaterThanOrEqual(2);
    expect(report.balanceVersion).toBe(BalanceSystem.config.version);
    for (const m of report.matchups) {
      expect(m.iterations).toBe(2);
      expect(m.winRateA + m.winRateB).toBeGreaterThan(0);
    }
  });
});

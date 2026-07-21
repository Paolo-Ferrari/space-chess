import { describe, expect, it, beforeEach } from "vitest";

import type { Army } from "../armyBuilder/types";
import { BattleManager } from "../battle/battleManager";
import { resetBattleInstanceSeq } from "../battle/createBattle";

import { AbilitySystem } from "./abilitySystem";

function armyWithRipperAndAdam(): Army {
  return {
    id: "army-ability-test",
    name: "Ability Test",
    factionId: "faction-arasaka",
    unitIds: [
      "arasaka-commander",
      "arasaka-ripperdoc",
      "arasaka-adam-smasher",
      "arasaka-cyber-ninja",
    ],
    updatedAt: 1,
    commanderImplantIds: [],
    ownerId: null,
  };
}

describe("Ability System", () => {
  beforeEach(() => {
    resetBattleInstanceSeq(0);
  });

  it("lists catalog test abilities", () => {
    const ids = AbilitySystem.list().map((ability) => ability.id);
    expect(ids).toContain("ability-heal");
    expect(ids).toContain("ability-power-strike");
    expect(ids).toContain("ability-armor-boost");
    expect(ids).toContain("ability-slow");
  });

  it("heals an allied unit", () => {
    const battle = new BattleManager(armyWithRipperAndAdam());
    const state = battle.getState();
    const ripper = state.units.find(
      (unit) => unit.definitionId === "arasaka-ripperdoc",
    )!;
    const ally = state.units.find(
      (unit) =>
        unit.owner === 0 && unit.instanceId !== ripper.instanceId,
    )!;

    const snapped = {
      ...state,
      units: state.units.map((unit) => {
        if (unit.instanceId === ripper.instanceId) {
          return {
            ...unit,
            position: { x: 3, y: 5 },
            hasUsedAbility: false,
          };
        }
        if (unit.instanceId === ally.instanceId) {
          return {
            ...unit,
            position: { x: 3, y: 6 },
            currentHp: 2,
            maxHp: ally.maxHp,
          };
        }
        return unit;
      }),
    };

    const forced = BattleManager.fromSnapshot(snapped);
    const result = forced.useAbility(
      ripper.instanceId,
      "ability-heal",
      ally.instanceId,
    );
    expect(result.ok).toBe(true);
    const healed = forced.getUnit(ally.instanceId)!;
    expect(healed.currentHp).toBeGreaterThan(2);
    expect(
      forced.events.getHistory().some((event) => event.type === "UnitHealed"),
    ).toBe(true);
  });

  it("applies Armor Boost status", () => {
    const battle = new BattleManager(armyWithRipperAndAdam());
    const state = battle.getState();
    const ripper = state.units.find(
      (unit) => unit.definitionId === "arasaka-ripperdoc",
    )!;

    const result = battle.useAbility(
      ripper.instanceId,
      "ability-armor-boost",
      ripper.instanceId,
    );
    // May fail if not in range to self — range 1 includes self at same cell (chebyshev 0)
    expect(result.ok).toBe(true);
    const unit = battle.getUnit(ripper.instanceId)!;
    expect(
      unit.statusEffects.some((s) => s.statusId === "status-armor-boost"),
    ).toBe(true);
  });

  it("Power Strike damages enemy", () => {
    const battle = new BattleManager(armyWithRipperAndAdam());
    const state = battle.getState();
    const adam = state.units.find(
      (unit) => unit.definitionId === "arasaka-adam-smasher",
    )!;
    const enemy = state.units.find((unit) => unit.owner === 1)!;

    const snapped = {
      ...state,
      units: state.units.map((unit) => {
        if (unit.instanceId === adam.instanceId) {
          return { ...unit, position: { x: 2, y: 2 }, hasUsedAbility: false };
        }
        if (unit.instanceId === enemy.instanceId) {
          return {
            ...unit,
            position: { x: 2, y: 1 },
            currentHp: 20,
            maxHp: 20,
          };
        }
        return unit;
      }),
    };

    const forced = BattleManager.fromSnapshot(snapped);
    const before = forced.getUnit(enemy.instanceId)!.currentHp;
    const result = forced.useAbility(
      adam.instanceId,
      "ability-power-strike",
      enemy.instanceId,
    );
    expect(result.ok).toBe(true);
    const after = forced.getUnit(enemy.instanceId);
    if (after) {
      expect(after.currentHp).toBeLessThan(before);
    }
    expect(
      forced.events
        .getHistory()
        .some((event) => event.type === "AbilityUsed"),
    ).toBe(true);
  });
});

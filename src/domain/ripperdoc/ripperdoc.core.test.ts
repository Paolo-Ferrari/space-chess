import { describe, expect, it } from "vitest";

import { AbilitySystem } from "../ability/abilitySystem";
import type { Army } from "../armyBuilder/types";
import { BattleManager } from "../battle/battleManager";
import { UnitSystem } from "../unit/unitSystem";

import { RipperdocSystem } from "./ripperdocSystem";

describe("Ripperdoc System", () => {
  it("registers Arasaka Ripperdoc profile aligned with unit kit", () => {
    const profile = RipperdocSystem.getByFactionId("faction-arasaka");
    expect(profile).toBeTruthy();
    expect(profile!.unitDefinitionId).toBe("arasaka-ripperdoc");
    expect(profile!.supportRadius).toBe(1);

    const unit = UnitSystem.get("arasaka-ripperdoc");
    expect(RipperdocSystem.isRipperdocUnit(unit)).toBe(true);
    expect(RipperdocSystem.assertKitAligned("arasaka-ripperdoc")).toEqual([]);

    const live = RipperdocSystem.implementedAbilityIds("arasaka-ripperdoc");
    expect(live).toContain("ability-heal");
    expect(live).toContain("ability-armor-boost");
    expect(AbilitySystem.get("ability-heal")).toBeTruthy();
  });

  it("exposes reserved action kinds for future factions", () => {
    const views = RipperdocSystem.listActionViews("arasaka-ripperdoc");
    const kinds = views.map((view) => view.slot.kind);
    expect(kinds).toEqual(
      expect.arrayContaining([
        "healing",
        "repair",
        "buff",
        "remove_effect",
        "modification",
      ]),
    );
    expect(views.filter((view) => !view.implemented).length).toBeGreaterThan(0);
  });

  it("ripperdoc can heal on the battlefield without breaking attacks", () => {
    const army: Army = {
      id: "army-ripper",
      name: "Clinic",
      factionId: "faction-arasaka",
      unitIds: [
        "arasaka-commander",
        "arasaka-ripperdoc",
        "arasaka-soldier",
      ],
      commanderImplantIds: [],
    ownerId: null,
      updatedAt: 1,
    };

    const battle = new BattleManager(army);
    const state = battle.getState();
    const ripper = state.units.find(
      (unit) => unit.definitionId === "arasaka-ripperdoc",
    )!;
    const soldier = state.units.find(
      (unit) => unit.definitionId === "arasaka-soldier",
    )!;
    const enemy = state.units.find((unit) => unit.owner === 1)!;

    expect(RipperdocSystem.isRipperdocRuntime(ripper)).toBe(true);

    const forced = BattleManager.fromSnapshot({
      ...state,
      units: state.units.map((unit) => {
        if (unit.instanceId === ripper.instanceId) {
          return { ...unit, position: { x: 4, y: 5 }, hasUsedAbility: false };
        }
        if (unit.instanceId === soldier.instanceId) {
          return {
            ...unit,
            position: { x: 4, y: 6 },
            currentHp: 3,
            maxHp: soldier.maxHp,
          };
        }
        if (unit.instanceId === enemy.instanceId) {
          return { ...unit, position: { x: 0, y: 0 } };
        }
        return unit;
      }),
    });

    const heal = forced.useAbility(
      ripper.instanceId,
      "ability-heal",
      soldier.instanceId,
    );
    expect(heal.ok).toBe(true);
    expect(forced.getUnit(soldier.instanceId)!.currentHp).toBeGreaterThan(3);

    // Basic attack still works after support action (different unit / next setup)
    const attacker = forced
      .getState()
      .units.find((unit) => unit.owner === 0 && unit.definitionId === "arasaka-commander")!;
    const target = forced.getState().units.find((unit) => unit.owner === 1)!;
    const attackSnap = BattleManager.fromSnapshot({
      ...forced.getState(),
      units: forced.getState().units.map((unit) => {
        if (unit.instanceId === attacker.instanceId) {
          return {
            ...unit,
            position: { x: 1, y: 1 },
            hasAttacked: false,
          };
        }
        if (unit.instanceId === target.instanceId) {
          return { ...unit, position: { x: 1, y: 2 }, currentHp: 10 };
        }
        return unit;
      }),
    });
    const atk = attackSnap.attack(attacker.instanceId, target.instanceId);
    expect(atk.ok).toBe(true);
  });
});

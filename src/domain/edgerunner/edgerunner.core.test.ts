import { describe, expect, it, beforeEach } from "vitest";

import type { Army } from "../armyBuilder/types";
import {
  canAddUnit,
  validateArmy,
} from "../armyBuilder/validation";
import { armyBuilderCatalogLookup } from "../../data/catalog/armyBuilder";
import { BattleManager } from "../battle/battleManager";
import { resetBattleInstanceSeq } from "../battle/createBattle";
import { AbilitySystem } from "../ability/abilitySystem";
import { FactionSystem } from "../faction/factionSystem";
import { UnitSystem } from "../unit/unitSystem";

import { EdgerunnerSystem } from "./edgerunnerSystem";

function baseArmy(overrides?: Partial<Army>): Army {
  return {
    id: "army-edge",
    name: "Hired Guns",
    factionId: "faction-arasaka",
    unitIds: [
      "arasaka-commander",
      "arasaka-ripperdoc",
      "arasaka-soldier",
    ],
    commanderImplantIds: [],
    ownerId: null,
    updatedAt: 1,
    ...overrides,
  };
}

describe("Edgerunner System", () => {
  beforeEach(() => {
    resetBattleInstanceSeq(0);
  });

  it("exposes neutral pool with roles, not as a faction", () => {
    expect(FactionSystem.get(EdgerunnerSystem.poolId)).toBeUndefined();
    expect(EdgerunnerSystem.listProfiles().length).toBeGreaterThanOrEqual(3);
    expect(EdgerunnerSystem.maxPerArmy).toBe(2);

    const roles = EdgerunnerSystem.listProfiles().map((p) => p.role);
    expect(roles).toEqual(
      expect.arrayContaining(["solo", "netrunner", "techie"]),
    );

    const factionUnits = FactionSystem.listUnits("faction-arasaka");
    expect(
      factionUnits.every((unit) => unit.type !== "edgerunner"),
    ).toBe(true);
    expect(UnitSystem.get("edge-solo-blade")).toBeTruthy();
  });

  it("hires into army up to limit and blocks duplicates", () => {
    const draft = {
      factionId: "faction-arasaka",
      unitIds: [
        "arasaka-commander",
        "arasaka-ripperdoc",
        "arasaka-soldier",
      ],
    };

    const first = canAddUnit(draft, "edge-solo-blade", armyBuilderCatalogLookup);
    expect(first.ok).toBe(true);

    const withOne = {
      ...draft,
      unitIds: [...draft.unitIds, "edge-solo-blade"],
    };
    expect(
      canAddUnit(withOne, "edge-solo-blade", armyBuilderCatalogLookup).ok,
    ).toBe(false);

    const withTwo = {
      ...draft,
      unitIds: [...draft.unitIds, "edge-solo-blade", "edge-netrunner-ghost"],
    };
    expect(validateArmy({
      name: "ok",
      factionId: withTwo.factionId,
      unitIds: withTwo.unitIds,
      commanderImplantIds: [],
    ownerId: null,
    }, armyBuilderCatalogLookup).ok).toBe(true);

    expect(
      canAddUnit(withTwo, "edge-techie-wrench", armyBuilderCatalogLookup).reason,
    ).toBe("edgerunner_limit");
  });

  it("rejects army made only of edgerunners", () => {
    const result = validateArmy(
      {
        name: "Merc only",
        factionId: "faction-arasaka",
        unitIds: ["edge-solo-blade", "edge-netrunner-ghost"],
        commanderImplantIds: [],
    ownerId: null,
      },
      armyBuilderCatalogLookup,
    );
    expect(result.ok).toBe(false);
    expect(result.codes).toContain("edgerunners_only");
    expect(result.codes).toContain("missing_commander");
  });

  it("spawns on battlefield and can use ability", () => {
    const army = baseArmy({
      unitIds: [
        "arasaka-commander",
        "arasaka-ripperdoc",
        "arasaka-soldier",
        "edge-solo-blade",
        "edge-techie-wrench",
      ],
    });
    expect(validateArmy(army, armyBuilderCatalogLookup).ok).toBe(true);

    const battle = new BattleManager(army);
    const state = battle.getState();
    const solo = state.units.find(
      (unit) => unit.definitionId === "edge-solo-blade",
    );
    const techie = state.units.find(
      (unit) => unit.definitionId === "edge-techie-wrench",
    );
    expect(solo).toBeTruthy();
    expect(techie).toBeTruthy();
    expect(solo!.owner).toBe(0);

    const enemy = state.units.find((unit) => unit.owner === 1)!;
    const views = AbilitySystem.listForUnit(state, solo);
    expect(views.some((view) => view.ability.id === "ability-power-strike")).toBe(
      true,
    );

    // Place solo adjacent to enemy for Power Strike
    const forced = BattleManager.fromSnapshot({
      ...state,
      units: state.units.map((unit) => {
        if (unit.instanceId === solo!.instanceId) {
          return {
            ...unit,
            position: { x: enemy.position.x, y: enemy.position.y + 1 },
            hasUsedAbility: false,
          };
        }
        return unit;
      }),
    });

    const result = forced.useAbility(
      solo!.instanceId,
      "ability-power-strike",
      enemy.instanceId,
    );
    expect(result.ok).toBe(true);
  });
});

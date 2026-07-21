import { describe, expect, it } from "vitest";

import type { Army } from "../armyBuilder/types";
import { validateArmy } from "../armyBuilder/validation";
import { armyBuilderCatalogLookup } from "../../data/catalog/armyBuilder";
import { BattleManager } from "../battle/battleManager";
import { resetBattleInstanceSeq } from "../battle/createBattle";
import { LegendarySystem } from "../legendary/legendarySystem";
import { UnitSystem } from "../unit/unitSystem";

import {
  autoPlaceUnits,
  cellIdFromPosition,
  movePlacement,
  placeCatalogUnit,
  positionFromCellId,
} from "./index";
import { armyToDraft, createEmptyDraft } from "../armyBuilder/draft";

function baseArmy(): Army {
  return {
    id: "army-deploy",
    name: "Formation",
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
}

describe("Deployment board", () => {
  it("maps A1 to bottom-left player cell", () => {
    expect(positionFromCellId("A1")).toEqual({ x: 0, y: 7 });
    expect(cellIdFromPosition(0, 7)).toBe("A1");
    expect(cellIdFromPosition(7, 6)).toBe("H2");
  });

  it("places catalog unit on free deployment cell", () => {
    let draft = createEmptyDraft("faction-arasaka");
    draft = { ...draft, name: "Test" };
    const result = placeCatalogUnit(
      draft,
      "arasaka-commander",
      0,
      7,
      armyBuilderCatalogLookup,
    );
    expect(result.ok).toBe(true);
    expect(result.draft.placements).toHaveLength(1);
    expect(result.draft.placements[0]).toMatchObject({
      unitId: "arasaka-commander",
      x: 0,
      y: 7,
    });
  });

  it("swaps two placements", () => {
    let draft = armyToDraft(baseArmy());
    const a = draft.placements[0];
    const b = draft.placements[1];
    const moved = movePlacement(draft, a.placementId, b.x, b.y);
    expect(moved.ok).toBe(true);
    const nextA = moved.draft.placements.find(
      (p) => p.placementId === a.placementId,
    );
    const nextB = moved.draft.placements.find(
      (p) => p.placementId === b.placementId,
    );
    expect(nextA?.x).toBe(b.x);
    expect(nextA?.y).toBe(b.y);
    expect(nextB?.x).toBe(a.x);
    expect(nextB?.y).toBe(a.y);
  });

  it("spawns battle units on saved placements", () => {
    resetBattleInstanceSeq(0);
    const placements = autoPlaceUnits([
      "arasaka-commander",
      "arasaka-ripperdoc",
      "arasaka-soldier",
    ]);
    // Put commander on H1
    placements[0] = { ...placements[0], x: 7, y: 7 };
    placements[1] = { ...placements[1], x: 0, y: 7 };
    placements[2] = { ...placements[2], x: 1, y: 7 };

    const army: Army = {
      ...baseArmy(),
      unitIds: placements.map((p) => p.unitId),
      placements,
    };
    expect(validateArmy(armyToDraft(army), armyBuilderCatalogLookup).ok).toBe(
      true,
    );

    const battle = new BattleManager(army);
    const commander = battle
      .getState()
      .units.find(
        (u) => u.owner === 0 && u.definitionId === "arasaka-commander",
      );
    expect(commander?.position).toEqual({ x: 7, y: 7 });
  });
});

describe("Legendary Adam Smasher modules", () => {
  it("installs combat modules on Adam Smasher profile", () => {
    expect(LegendarySystem.hasCustomizer("arasaka-adam-smasher")).toBe(true);
    const check = LegendarySystem.canInstall(
      "arasaka-adam-smasher",
      [],
      "lgd-smasher-smartlink",
    );
    expect(check.ok).toBe(true);
    const stats = LegendarySystem.getEffectiveStats("arasaka-adam-smasher", [
      "lgd-smasher-smartlink",
    ]);
    expect(stats?.attack).toBeGreaterThan(
      UnitSystem.get("arasaka-adam-smasher")!.stats.attack,
    );
  });

  it("rejects commander implants path for legendary modules API", () => {
    const check = LegendarySystem.canInstall(
      "arasaka-commander",
      [],
      "lgd-smasher-smartlink",
    );
    expect(check.ok).toBe(false);
  });
});

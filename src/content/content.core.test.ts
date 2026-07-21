import { describe, expect, it } from "vitest";

import {
  getDefaultMap,
  getDefaultMatchMode,
  getDefaultVictoryRule,
  listMaps,
  listMatchModes,
  listVictoryRules,
  resolveUnitVisual,
} from "./index";

describe("Content registries", () => {
  it("exposes default map / mode / victory", () => {
    expect(getDefaultMap().id).toBe("map-classic-8x8");
    expect(getDefaultMap().width).toBe(8);
    expect(getDefaultVictoryRule().id).toBe("victory-commander-kill");
    expect(getDefaultMatchMode().mapId).toBe(getDefaultMap().id);
    expect(getDefaultMatchMode().victoryRuleId).toBe(
      getDefaultVictoryRule().id,
    );
  });

  it("lists registries without empty catalogs", () => {
    expect(listMaps().length).toBeGreaterThan(0);
    expect(listMatchModes().length).toBeGreaterThan(0);
    expect(listVictoryRules().length).toBeGreaterThan(0);
  });

  it("resolves board icon path for a unit", () => {
    const visual = resolveUnitVisual({
      unitId: "arasaka-soldier",
      factionId: "faction-arasaka",
    });
    expect(visual.boardIcon).toBe("/assets/unit-icons/arasaka-soldier.svg");
  });
});

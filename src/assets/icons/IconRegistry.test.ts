import { describe, expect, it } from "vitest";

import { UnitSystem } from "../../domain/unit/unitSystem";
import { getUnitIconComponent, ICON_REGISTRY } from "./IconRegistry";

describe("IconRegistry", () => {
  it("registers a unique icon component for every catalog unit", () => {
    const units = UnitSystem.list();
    expect(units.length).toBeGreaterThan(50);
    for (const unit of units) {
      expect(ICON_REGISTRY[unit.id], unit.id).toBeTypeOf("function");
      expect(getUnitIconComponent(unit.id)).toBe(ICON_REGISTRY[unit.id]);
    }
  });

  it("maps Adam Smasher and commanders", () => {
    expect(ICON_REGISTRY["arasaka-adam-smasher"]).toBeTypeOf("function");
    expect(ICON_REGISTRY["arasaka-commander"]).toBeTypeOf("function");
    expect(ICON_REGISTRY["edge-solo-blade"]).toBeTypeOf("function");
  });

  it("falls back for unknown ids", () => {
    expect(getUnitIconComponent("missing-unit-xyz")).toBeTypeOf("function");
  });
});

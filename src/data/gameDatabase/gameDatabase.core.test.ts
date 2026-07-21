import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import {
  getUnitById,
  isUnitImagePath,
  listUnits,
  UNIT_PLACEHOLDER_IMAGE,
} from "./index";

describe("Game Database — units", () => {
  it("every unit has complete database fields", () => {
    const units = listUnits();
    expect(units.length).toBeGreaterThan(50);

    for (const unit of units) {
      expect(unit.id).toBeTruthy();
      expect(unit.name).toBeTruthy();
      expect(unit.factionId).toBeTruthy();
      expect(unit.type).toBeTruthy();
      expect(unit.cost).toBeGreaterThan(0);
      expect(unit.stats.hp).toBeGreaterThan(0);
      expect(unit.stats.attack).toBeGreaterThanOrEqual(0);
      expect(unit.stats.range).toBeGreaterThan(0);
      expect(unit.stats.movement).toBeGreaterThan(0);
      expect(Array.isArray(unit.abilities)).toBe(true);
      expect(unit.description.length).toBeGreaterThan(0);
      expect(isUnitImagePath(unit.imagePath)).toBe(true);
      expect(unit.imagePath).toBe(`/assets/unit-icons/${unit.id}.svg`);
      expect(unit.rarity).toBeTruthy();
      expect(typeof unit.isLegendary).toBe("boolean");
      if (unit.type === "legendary") {
        expect(unit.isLegendary).toBe(true);
        expect(unit.rarity).toBe("legendary");
      }
    }
  });

  it("resolves units by id from the central registry", () => {
    const unit = getUnitById("arasaka-soldier");
    expect(unit?.name).toBe("Arasaka Trooper");
    expect(unit?.imagePath).toBe("/assets/unit-icons/arasaka-soldier.svg");
  });

  it("ships SVG pictograms under public/assets/unit-icons", () => {
    const dir = path.resolve(process.cwd(), "public/assets/unit-icons");
    expect(fs.existsSync(path.join(dir, "_placeholder.svg"))).toBe(true);
    expect(UNIT_PLACEHOLDER_IMAGE).toBe("/assets/unit-icons/_placeholder.svg");

    const sample = getUnitById("arasaka-adam-smasher");
    expect(sample).toBeTruthy();
    const file = path.join(dir, `${sample!.id}.svg`);
    expect(fs.existsSync(file)).toBe(true);
    const text = fs.readFileSync(file, "utf8");
    expect(text).toContain("<svg");
    expect(text).toContain("viewBox");
  });
});

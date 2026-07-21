import { describe, expect, it, beforeEach } from "vitest";

import type { Army } from "../armyBuilder/types";
import { validateArmy } from "../armyBuilder/validation";
import { armyBuilderCatalogLookup } from "../../data/catalog/armyBuilder";
import { BattleManager } from "../battle/battleManager";
import { resetBattleInstanceSeq } from "../battle/createBattle";
import { CommanderSystem } from "../commander/commanderSystem";
import { FactionSystem } from "./factionSystem";
import { RipperdocSystem } from "../ripperdoc/ripperdocSystem";
import { UnitSystem } from "../unit/unitSystem";

const EXPECTED_FACTIONS = [
  "faction-arasaka",
  "faction-militech",
  "faction-maelstrom",
  "faction-tyger-claws",
  "faction-valentinos",
  "faction-voodoo-boys",
  "faction-nomads",
  "faction-ncpd",
  "faction-animals",
  "faction-6th-street",
];

function sampleArmy(factionId: string): Army {
  const units = FactionSystem.listUnits(factionId);
  const commander = units.find((u) => u.type === "commander");
  const ripper = units.find((u) => u.type === "ripperdoc");
  const regulars = units.filter(
    (u) => u.type === "regular" || u.type === "special",
  );
  expect(commander).toBeTruthy();
  expect(ripper).toBeTruthy();
  expect(regulars.length).toBeGreaterThanOrEqual(5);

  return {
    id: `army-${factionId}`,
    name: `Test ${factionId}`,
    factionId,
    unitIds: [
      commander!.id,
      ripper!.id,
      ...regulars.slice(0, 2).map((u) => u.id),
    ],
    commanderImplantIds: [],
    ownerId: null,
    updatedAt: 1,
  };
}

describe("Faction catalog expansion", () => {
  beforeEach(() => {
    resetBattleInstanceSeq(0);
  });

  it("registers all 10 playable factions", () => {
    const ids = FactionSystem.list().map((f) => f.id);
    expect(ids).toEqual(EXPECTED_FACTIONS);
  });

  it("each faction has commander, ripperdoc, lineup, legendary, profiles", () => {
    for (const factionId of EXPECTED_FACTIONS) {
      const units = FactionSystem.listUnits(factionId);
      const commander = units.find((u) => u.type === "commander");
      const ripper = units.find((u) => u.type === "ripperdoc");
      const legendary = units.find((u) => u.type === "legendary");
      const lineup = units.filter(
        (u) =>
          u.type === "regular" ||
          u.type === "special" ||
          u.type === "legendary",
      );

      expect(commander, factionId).toBeTruthy();
      expect(ripper, factionId).toBeTruthy();
      expect(legendary, factionId).toBeTruthy();
      expect(lineup.length, factionId).toBeGreaterThanOrEqual(6);

      expect(
        CommanderSystem.getCommanderByFactionId(factionId),
        factionId,
      ).toBeTruthy();
      expect(
        RipperdocSystem.getByFactionId(factionId),
        factionId,
      ).toBeTruthy();
      expect(
        RipperdocSystem.assertKitAligned(ripper!.id),
        factionId,
      ).toEqual([]);
      expect(UnitSystem.get(commander!.id)?.factionId).toBe(factionId);
    }
  });

  it("each faction can validate an army and start a battle", () => {
    for (const factionId of EXPECTED_FACTIONS) {
      const army = sampleArmy(factionId);
      const validation = validateArmy(army, armyBuilderCatalogLookup);
      expect(validation.ok, `${factionId}: ${validation.codes.join(",")}`).toBe(
        true,
      );

      const battle = new BattleManager(army);
      const state = battle.getState();
      expect(state.phase).toBe("playing");
      expect(
        state.units.some(
          (u) =>
            u.owner === 0 &&
            UnitSystem.get(u.definitionId)?.type === "commander",
        ),
      ).toBe(true);
      expect(
        state.units.some(
          (u) =>
            u.owner === 0 &&
            UnitSystem.get(u.definitionId)?.factionId === factionId,
        ),
      ).toBe(true);
    }
  });
});

import { describe, expect, it, beforeEach } from "vitest";

import type { Army } from "../armyBuilder/types";
import { validateArmy } from "../armyBuilder/validation";
import {
  installImplantOnDraft,
  armyToDraft,
} from "../armyBuilder/draft";
import { armyBuilderCatalogLookup } from "../../data/catalog/armyBuilder";
import { BattleManager } from "../battle/battleManager";
import { resetBattleInstanceSeq } from "../battle/createBattle";
import { getEffectiveUnitStats } from "../battle/unitCombatStats";
import { UnitSystem } from "../unit/unitSystem";

import { CommanderSystem } from "./commanderSystem";

function validArasakaArmy(overrides?: Partial<Army>): Army {
  return {
    id: "army-cmd",
    name: "Chrome King",
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

describe("Commander + Implant System", () => {
  beforeEach(() => {
    resetBattleInstanceSeq(0);
  });

  it("creates commander profile with implant slots", () => {
    const profile = CommanderSystem.getCommanderByUnitId("arasaka-commander");
    expect(profile).toBeTruthy();
    expect(profile!.implantSlots).toBe(3);
    expect(CommanderSystem.listImplants().length).toBeGreaterThanOrEqual(4);
  });

  it("installs implants and changes effective stats", () => {
    const base = UnitSystem.get("arasaka-commander")!.stats;
    const withArmor = CommanderSystem.getEffectiveStats("arasaka-commander", [
      "implant-reinforced-armor",
    ])!;
    expect(withArmor.defense).toBe(base.defense + 2);

    const loadout = [
      "implant-combat-module",
      "implant-optic-system",
      "implant-neural-accelerator",
    ];
    const stats = CommanderSystem.getEffectiveStats(
      "arasaka-commander",
      loadout,
    )!;
    expect(stats.attack).toBe(base.attack + 2);
    expect(stats.range).toBe(base.range + 1);
    expect(stats.movement).toBe(base.movement + 1);
    expect(CommanderSystem.slotsUsed(loadout)).toBe(3);
  });

  it("rejects implant install without commander / over slots", () => {
    const draft = armyToDraft(validArasakaArmy({ unitIds: ["arasaka-soldier"] }));
    const noCmd = installImplantOnDraft(
      draft,
      "implant-combat-module",
      armyBuilderCatalogLookup,
    );
    expect(noCmd.ok).toBe(false);

    let full = armyToDraft(validArasakaArmy());
    for (const id of [
      "implant-reinforced-armor",
      "implant-combat-module",
      "implant-optic-system",
    ]) {
      const result = installImplantOnDraft(full, id, armyBuilderCatalogLookup);
      expect(result.ok).toBe(true);
      full = result.draft;
    }
    const overflow = installImplantOnDraft(
      full,
      "implant-neural-accelerator",
      armyBuilderCatalogLookup,
    );
    expect(overflow.ok).toBe(false);
    expect(overflow.reason).toBe("slots_exceeded");
  });

  it("applies implant mods in battle only on commander", () => {
    const army = validArasakaArmy({
      commanderImplantIds: [
        "implant-combat-module",
        "implant-neural-accelerator",
      ],
    });
    expect(validateArmy(army, armyBuilderCatalogLookup).ok).toBe(true);

    const battle = new BattleManager(army);
    const commander = battle
      .getState()
      .units.find(
        (unit) =>
          unit.owner === 0 && unit.definitionId === "arasaka-commander",
      )!;
    const soldier = battle
      .getState()
      .units.find(
        (unit) => unit.owner === 0 && unit.definitionId === "arasaka-soldier",
      )!;

    expect(commander.implantIds).toEqual([
      "implant-combat-module",
      "implant-neural-accelerator",
    ]);
    expect(soldier.implantIds).toEqual([]);

    const cmdDef = UnitSystem.get("arasaka-commander")!;
    const solDef = UnitSystem.get("arasaka-soldier")!;
    const cmdStats = getEffectiveUnitStats(commander, cmdDef);
    expect(cmdStats.attack).toBe(cmdDef.stats.attack + 2);
    expect(cmdStats.movement).toBe(cmdDef.stats.movement + 1);
    expect(getEffectiveUnitStats(soldier, solDef)).toEqual(solDef.stats);

    const moves = battle.getLegalMovePositions(commander.instanceId);
    // base movement +1 should expand reach vs bare commander
    const bare = new BattleManager(validArasakaArmy());
    const bareCmd = bare
      .getState()
      .units.find(
        (unit) =>
          unit.owner === 0 && unit.definitionId === "arasaka-commander",
      )!;
    const bareMoves = bare.getLegalMovePositions(bareCmd.instanceId);
    expect(moves.length).toBeGreaterThan(bareMoves.length);
  });

  it("ordinary units never accept implants via canInstall", () => {
    const check = CommanderSystem.canInstall(
      "arasaka-soldier",
      "faction-arasaka",
      [],
      "implant-combat-module",
    );
    expect(check.ok).toBe(false);
    expect(check.reason).toBe("not_commander_unit");
  });
});

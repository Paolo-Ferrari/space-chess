import { describe, expect, it, beforeEach } from "vitest";

import type { Army } from "../armyBuilder/types";
import { validateArmy } from "../armyBuilder/validation";
import { armyBuilderCatalogLookup } from "../../data/catalog/armyBuilder";

import { BattleManager } from "./battleManager";
import { resetBattleInstanceSeq } from "./createBattle";
import { findCommander } from "./victorySystem";
import { UnitSystem } from "../unit/unitSystem";

function validArasakaArmy(overrides?: Partial<Army>): Army {
  return {
    id: "army-test",
    name: "Test Squad",
    factionId: "faction-arasaka",
    unitIds: [
      "arasaka-commander",
      "arasaka-ripperdoc",
      "arasaka-soldier",
      "arasaka-recon",
    ],
    commanderImplantIds: [],
    ownerId: null,
    updatedAt: 1,
    ...overrides,
  };
}

describe("Army Builder core", () => {
  it("accepts a valid Arasaka army", () => {
    const result = validateArmy(validArasakaArmy(), armyBuilderCatalogLookup);
    expect(result.ok).toBe(true);
    expect(result.energyUsed).toBeLessThanOrEqual(100);
  });

  it("rejects army without commander", () => {
    const result = validateArmy(
      validArasakaArmy({
        unitIds: ["arasaka-ripperdoc", "arasaka-soldier"],
      }),
      armyBuilderCatalogLookup,
    );
    expect(result.ok).toBe(false);
    expect(result.codes).toContain("missing_commander");
  });
});

describe("Battle core", () => {
  beforeEach(() => {
    resetBattleInstanceSeq(0);
  });

  it("starts a battle with both commanders on the board", () => {
    const battle = new BattleManager(validArasakaArmy());
    const state = battle.getState();
    expect(state.phase).toBe("playing");
    expect(state.currentPlayer).toBe(0);
    expect(
      findCommander(state.units, 0, { getUnitById: UnitSystem.get }),
    ).toBeTruthy();
    expect(
      findCommander(state.units, 1, { getUnitById: UnitSystem.get }),
    ).toBeTruthy();
    expect(
      battle.events.getHistory().some((event) => event.type === "BattleStarted"),
    ).toBe(true);
  });

  it("moves a unit to a legal cell", () => {
    const battle = new BattleManager(validArasakaArmy());
    const state = battle.getState();
    const unit = state.units.find((item) => item.owner === 0)!;
    const moves = battle.getLegalMovePositions(unit.instanceId);
    expect(moves.length).toBeGreaterThan(0);
    const target = moves[0];
    const result = battle.move(unit.instanceId, target);
    expect(result.ok).toBe(true);
    const moved = battle.getUnit(unit.instanceId)!;
    expect(moved.position).toEqual(target);
    expect(moved.hasMoved).toBe(true);
    expect(
      battle.events.getHistory().some((event) => event.type === "UnitMoved"),
    ).toBe(true);
  });

  it("attacks and damages an enemy", () => {
    const battle = new BattleManager(validArasakaArmy());
    // Place attacker adjacent to enemy by moving if needed, or find pair in range.
    // Force adjacency: pick player unit and enemy, set positions via snapshot.
    const state = battle.getState();
    const attacker = state.units.find((unit) => unit.owner === 0)!;
    const target = state.units.find((unit) => unit.owner === 1)!;
    const snapped = {
      ...state,
      units: state.units.map((unit) => {
        if (unit.instanceId === attacker.instanceId) {
          return {
            ...unit,
            position: { x: 3, y: 3 },
            hasMoved: false,
            hasAttacked: false,
          };
        }
        if (unit.instanceId === target.instanceId) {
          return {
            ...unit,
            position: { x: 3, y: 2 },
            currentHp: 10,
            maxHp: 10,
          };
        }
        return unit;
      }),
    };
    const forced = BattleManager.fromSnapshot(snapped);
    const beforeHp = forced.getUnit(target.instanceId)!.currentHp;
    const result = forced.attack(attacker.instanceId, target.instanceId);
    expect(result.ok).toBe(true);
    const after = forced.getUnit(target.instanceId);
    if (after) {
      expect(after.currentHp).toBeLessThan(beforeHp);
    } else {
      expect(
        forced.events.getHistory().some((event) => event.type === "UnitDestroyed"),
      ).toBe(true);
    }
  });

  it("wins when enemy commander is destroyed", () => {
    const battle = new BattleManager(validArasakaArmy());
    const state = battle.getState();
    const enemyCommander = findCommander(state.units, 1, {
      getUnitById: UnitSystem.get,
    })!;
    const attacker = state.units.find((unit) => unit.owner === 0)!;
    const def = UnitSystem.get(attacker.definitionId)!;

    const snapped = {
      ...state,
      units: state.units
        .filter((unit) => unit.instanceId !== enemyCommander.instanceId)
        .map((unit) =>
          unit.instanceId === attacker.instanceId
            ? {
                ...unit,
                position: { x: 0, y: 0 },
                hasAttacked: false,
              }
            : unit,
        )
        .concat({
          ...enemyCommander,
          position: { x: 0, y: 1 },
          currentHp: 1,
          maxHp: enemyCommander.maxHp,
        }),
    };

    // Ensure attack damage kills (hp 1, attack >= 1)
    expect(def.stats.attack).toBeGreaterThanOrEqual(1);

    const forced = BattleManager.fromSnapshot(snapped);
    const result = forced.attack(attacker.instanceId, enemyCommander.instanceId);
    expect(result.ok).toBe(true);
    expect(forced.getState().phase).toBe("ended");
    expect(forced.getState().winner).toBe(0);
    expect(
      forced.events.getHistory().some((event) => event.type === "BattleEnded"),
    ).toBe(true);
  });

  it("loses when own commander is destroyed", () => {
    const battle = new BattleManager(validArasakaArmy());
    const state = battle.getState();
    const myCommander = findCommander(state.units, 0, {
      getUnitById: UnitSystem.get,
    })!;
    const enemy = state.units.find((unit) => unit.owner === 1)!;

    const snapped = {
      ...state,
      currentPlayer: 1 as const,
      units: state.units.map((unit) => {
        if (unit.instanceId === enemy.instanceId) {
          return {
            ...unit,
            position: { x: 1, y: 1 },
            hasAttacked: false,
          };
        }
        if (unit.instanceId === myCommander.instanceId) {
          return {
            ...unit,
            position: { x: 1, y: 2 },
            currentHp: 1,
            maxHp: myCommander.maxHp,
          };
        }
        return unit;
      }),
    };

    const forced = BattleManager.fromSnapshot(snapped);
    const result = forced.attack(enemy.instanceId, myCommander.instanceId);
    expect(result.ok).toBe(true);
    expect(forced.getState().phase).toBe("ended");
    expect(forced.getState().winner).toBe(1);
  });
});

import { describe, expect, it, beforeEach } from "vitest";

import type { Army } from "../armyBuilder/types";
import { BattleManager } from "../battle/battleManager";
import { resetBattleInstanceSeq } from "../battle/createBattle";
import { UnitSystem } from "../unit/unitSystem";

import { AiManager } from "./aiManager";
import { generateAiActions } from "./aiDecision";
import { createAiConfig } from "./types";

function playerArmy(): Army {
  return {
    id: "army-ai-test",
    name: "Human",
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

describe("AI System", () => {
  beforeEach(() => {
    resetBattleInstanceSeq(0);
  });

  it("plays a full AI turn through BattleManager only", () => {
    const battle = new BattleManager(playerArmy());
    expect(battle.getState().currentPlayer).toBe(0);
    battle.endTurn();
    expect(battle.getState().currentPlayer).toBe(1);

    const ai = new AiManager(createAiConfig("hard", "aggressive"));
    const beforeUnits = battle.getState().units.length;
    const steps = ai.playTurn(battle);

    expect(steps.length).toBeGreaterThan(0);
    expect(steps.some((step) => step.action.kind === "end_turn")).toBe(true);
    expect(battle.getState().currentPlayer).toBe(0);
    // Rules preserved: unit count only drops via legal destroys
    expect(battle.getState().units.length).toBeLessThanOrEqual(beforeUnits);
  });

  it("can choose attack when enemy is in range", () => {
    const battle = new BattleManager(playerArmy());
    battle.endTurn();

    const state = battle.getState();
    const aiUnit = state.units.find((unit) => unit.owner === 1)!;
    const human = state.units.find((unit) => unit.owner === 0)!;

    const forced = BattleManager.fromSnapshot({
      ...state,
      currentPlayer: 1,
      units: state.units.map((unit) => {
        if (unit.instanceId === aiUnit.instanceId) {
          return {
            ...unit,
            position: { x: human.position.x, y: human.position.y - 1 },
            hasMoved: true,
            hasAttacked: false,
          };
        }
        return unit;
      }),
    });

    const ai = new AiManager(createAiConfig("hard", "aggressive"));
    const actions = generateAiActions(forced, ai.getConfig());
    expect(actions.some((action) => action.kind === "attack")).toBe(true);

    const steps = ai.playTurn(forced);
    expect(steps.some((step) => step.action.kind === "attack")).toBe(true);
  });

  it("can use an ability when legal", () => {
    const battle = new BattleManager(playerArmy());
    battle.endTurn();
    const state = battle.getState();

    const ripper = state.units.find(
      (unit) =>
        unit.owner === 1 &&
        UnitSystem.get(unit.definitionId)?.type === "ripperdoc",
    );
    const ally = state.units.find(
      (unit) =>
        unit.owner === 1 && unit.instanceId !== ripper?.instanceId,
    );
    expect(ripper).toBeTruthy();
    expect(ally).toBeTruthy();

    const forced = BattleManager.fromSnapshot({
      ...state,
      currentPlayer: 1,
      units: state.units.map((unit) => {
        if (unit.instanceId === ripper!.instanceId) {
          return {
            ...unit,
            position: { x: 3, y: 1 },
            hasUsedAbility: false,
            hasMoved: true,
            hasAttacked: true,
          };
        }
        if (unit.instanceId === ally!.instanceId) {
          return {
            ...unit,
            position: { x: 3, y: 2 },
            currentHp: 2,
            maxHp: ally!.maxHp,
            hasMoved: true,
            hasAttacked: true,
          };
        }
        return {
          ...unit,
          hasMoved: true,
          hasAttacked: true,
          hasUsedAbility: true,
        };
      }),
    });

    const ai = new AiManager(createAiConfig("hard", "tactical"));
    const actions = generateAiActions(forced, ai.getConfig());
    expect(
      actions.some(
        (action) =>
          action.kind === "ability" && action.abilityId === "ability-heal",
      ),
    ).toBe(true);

    const steps = ai.playTurn(forced);
    expect(steps.some((step) => step.action.kind === "ability")).toBe(true);
    const healed = forced.getUnit(ally!.instanceId)!;
    expect(healed.currentHp).toBeGreaterThan(2);
  });

  it("can eliminate the human commander and win", () => {
    const battle = new BattleManager(playerArmy());
    const state = battle.getState();
    const humanCommander = state.units.find(
      (unit) =>
        unit.owner === 0 &&
        UnitSystem.get(unit.definitionId)?.type === "commander",
    )!;
    const aiAttacker = state.units.find((unit) => unit.owner === 1)!;

    const forced = BattleManager.fromSnapshot({
      ...state,
      currentPlayer: 1,
      units: state.units
        .filter(
          (unit) =>
            unit.owner === 1 || unit.instanceId === humanCommander.instanceId,
        )
        .map((unit) => {
          if (unit.instanceId === humanCommander.instanceId) {
            return {
              ...unit,
              position: { x: 4, y: 4 },
              currentHp: 1,
              maxHp: humanCommander.maxHp,
            };
          }
          if (unit.instanceId === aiAttacker.instanceId) {
            return {
              ...unit,
              position: { x: 4, y: 5 },
              hasMoved: true,
              hasAttacked: false,
            };
          }
          return {
            ...unit,
            hasMoved: true,
            hasAttacked: true,
            hasUsedAbility: true,
          };
        }),
    });

    const ai = new AiManager(createAiConfig("hard", "aggressive"));
    ai.playTurn(forced);
    const end = forced.getState();
    expect(end.phase).toBe("ended");
    expect(end.winner).toBe(1);
  });

  it("rejects illegal AI actions via BattleManager", () => {
    const battle = new BattleManager(playerArmy());
    // AI seat is not active — step must fail without mutating turn
    const ai = new AiManager(createAiConfig("normal"));
    const before = battle.getState().currentPlayer;
    const step = ai.step(battle);
    expect(step.result.ok).toBe(false);
    expect(battle.getState().currentPlayer).toBe(before);
  });
});

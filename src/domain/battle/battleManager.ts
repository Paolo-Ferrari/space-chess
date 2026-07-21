import { AbilitySystem } from "../ability/abilitySystem";
import type { Army } from "../armyBuilder/types";
import { EventBus } from "../events/eventBus";
import { formatGameEvent, type GameEvent } from "../events/gameEvents";
import { UnitSystem } from "../unit/unitSystem";

import { findUnitAt, positionsEqual } from "./boardManager";
import {
  applyAttack,
  canAttack,
  computeDamage,
  getLegalAttackTargets,
} from "./combatSystem";
import { createBattleFromArmy } from "./createBattle";
import {
  applyMove,
  canMoveTo,
  getLegalMoves,
} from "./movementSystem";
import { endTurn as endTurnState } from "./turnManager";
import type {
  BattleActionResult,
  BattleState,
  Position,
  UnitRuntime,
} from "./types";
import { getDefaultVictoryRule, getVictoryRule } from "../../data/catalog/victory";

const catalogLookup = { getUnitById: (id: string) => UnitSystem.get(id) };

function runVictory(state: BattleState) {
  const rule =
    (state.victoryRuleId
      ? getVictoryRule(state.victoryRuleId)
      : undefined) ?? getDefaultVictoryRule();
  return rule.evaluate(state, catalogLookup);
}

function projectLog(state: BattleState, events: GameEvent[]): BattleState {
  if (events.length === 0) {
    return state;
  }
  const entries = events.map((event, index) => ({
    id: `${state.battleId}-${state.log.length + index}-${event.type}`,
    text: formatGameEvent(event),
  }));
  return {
    ...state,
    log: [...entries.reverse(), ...state.log],
  };
}

function fail(
  state: BattleState,
  reason: string,
): BattleActionResult {
  return { ok: false, reason, state, events: [] };
}

export class BattleManager {
  private state: BattleState;
  events: EventBus;

  constructor(playerArmy: Army, bus = new EventBus()) {
    this.events = bus;
    this.state = createBattleFromArmy(playerArmy);
    const passives = AbilitySystem.applyPassivesOnBattleStart(this.state);
    this.state = passives.state;
    const start: GameEvent[] = [
      {
        type: "BattleStarted",
        battleId: this.state.battleId,
        turnNumber: this.state.turnNumber,
      },
      ...passives.events,
      {
        type: "TurnStarted",
        battleId: this.state.battleId,
        player: this.state.currentPlayer,
        turnNumber: this.state.turnNumber,
      },
    ];
    this.commit(this.state, start);
  }

  static fromSnapshot(state: BattleState, bus = new EventBus()): BattleManager {
    const manager = Object.create(BattleManager.prototype) as BattleManager;
    manager.events = bus;
    manager.state = {
      ...state,
      units: state.units.map((unit) => ({
        ...unit,
        hasUsedAbility: unit.hasUsedAbility ?? false,
        statusEffects: unit.statusEffects ?? [],
      })),
    };
    return manager;
  }

  getState(): BattleState {
    return this.state;
  }

  private commit(state: BattleState, events: GameEvent[]): BattleState {
    const withLog = projectLog(state, events);
    this.state = withLog;
    this.events.emitAll(events);
    return this.state;
  }

  private commitApply(
    apply: { state: BattleState; events: GameEvent[] },
  ): BattleState {
    const afterVictory = runVictory(apply.state);
    const allEvents = [...apply.events, ...afterVictory.events];
    return this.commit(afterVictory.state, allEvents);
  }

  getUnit(unitId: string): UnitRuntime | undefined {
    return this.state.units.find((unit) => unit.instanceId === unitId);
  }

  getLegalMovePositions(selectedUnitId: string | null): Position[] {
    if (!selectedUnitId) {
      return [];
    }
    const unit = this.getUnit(selectedUnitId);
    if (!unit || unit.owner !== this.state.currentPlayer) {
      return [];
    }
    const definition = UnitSystem.get(unit.definitionId);
    if (!definition) {
      return [];
    }
    return getLegalMoves(this.state, unit, definition);
  }

  getLegalAttackTargetIds(selectedUnitId: string | null): string[] {
    if (!selectedUnitId) {
      return [];
    }
    const unit = this.getUnit(selectedUnitId);
    if (!unit || unit.owner !== this.state.currentPlayer) {
      return [];
    }
    const definition = UnitSystem.get(unit.definitionId);
    if (!definition) {
      return [];
    }
    return getLegalAttackTargets(this.state, unit, definition).map(
      (target) => target.instanceId,
    );
  }

  /**
   * Click on board cell. Selection / ability mode are UI-owned.
   */
  interactCell(
    pos: Position,
    selectedUnitId: string | null,
    selectedAbilityId: string | null = null,
  ): BattleActionResult {
    if (this.state.phase !== "playing") {
      return fail(this.state, "Матч уже завершён");
    }

    const occupant = findUnitAt(this.state.units, pos);

    if (
      selectedAbilityId &&
      selectedUnitId &&
      occupant
    ) {
      return this.useAbility(
        selectedUnitId,
        selectedAbilityId,
        occupant.instanceId,
      );
    }

    if (occupant && occupant.owner === this.state.currentPlayer) {
      return {
        ok: true,
        state: this.state,
        selectUnitId: occupant.instanceId,
        events: [],
      };
    }

    if (!selectedUnitId) {
      if (occupant) {
        return fail(this.state, "Выберите своего юнита");
      }
      return fail(this.state, "Клетка пуста");
    }

    const selected = this.getUnit(selectedUnitId);
    if (!selected) {
      return fail(this.state, "Юнит не выбран");
    }

    const definition = UnitSystem.get(selected.definitionId);
    if (!definition) {
      return fail(this.state, "Нет данных юнита");
    }

    if (occupant && occupant.owner !== selected.owner) {
      return this.attack(selectedUnitId, occupant.instanceId);
    }

    if (!occupant && canMoveTo(this.state, selected, definition, pos)) {
      return this.move(selectedUnitId, pos);
    }

    return fail(this.state, "Недопустимое действие");
  }

  useAbility(
    casterId: string,
    abilityId: string,
    targetId: string,
  ): BattleActionResult {
    const result = AbilitySystem.applyManual(
      this.state,
      casterId,
      abilityId,
      targetId,
    );
    if (!result.ok) {
      return fail(
        this.state,
        AbilitySystem.rejectMessage(result.reason),
      );
    }
    const state = this.commitApply({
      state: result.state,
      events: result.events,
    });
    return {
      ok: true,
      state,
      selectUnitId: casterId,
      events: result.events,
    };
  }

  getLegalAbilityTargetIds(
    casterId: string | null,
    abilityId: string | null,
  ): string[] {
    if (!casterId || !abilityId) {
      return [];
    }
    const caster = this.getUnit(casterId);
    const ability = AbilitySystem.get(abilityId);
    if (!caster || !ability) {
      return [];
    }
    return AbilitySystem.getLegalTargets(this.state, caster, ability).map(
      (unit) => unit.instanceId,
    );
  }

  move(selectedUnitId: string, target: Position): BattleActionResult {
    if (this.state.phase !== "playing") {
      return fail(this.state, "Матч уже завершён");
    }

    const selected = this.getUnit(selectedUnitId);
    if (!selected) {
      return fail(this.state, "Юнит не выбран");
    }
    if (selected.owner !== this.state.currentPlayer) {
      return fail(this.state, "Сейчас ход другого игрока");
    }

    const definition = UnitSystem.get(selected.definitionId);
    if (!definition) {
      return fail(this.state, "Нет данных юнита");
    }
    if (!canMoveTo(this.state, selected, definition, target)) {
      return fail(this.state, "Сюда нельзя ходить");
    }

    const applied = applyMove(this.state, selected.instanceId, target);
    const state = this.commitApply(applied);
    return {
      ok: true,
      state,
      selectUnitId: selectedUnitId,
      events: applied.events,
    };
  }

  attack(selectedUnitId: string, targetId: string): BattleActionResult {
    if (this.state.phase !== "playing") {
      return fail(this.state, "Матч уже завершён");
    }

    const selected = this.getUnit(selectedUnitId);
    if (!selected) {
      return fail(this.state, "Юнит не выбран");
    }
    if (selected.owner !== this.state.currentPlayer) {
      return fail(this.state, "Сейчас ход другого игрока");
    }

    const definition = UnitSystem.get(selected.definitionId);
    const target = this.getUnit(targetId);
    if (!definition || !target) {
      return fail(this.state, "Цель недоступна");
    }
    if (!canAttack(this.state, selected, definition, targetId)) {
      return fail(this.state, "Цель вне досягаемости или уже атаковали");
    }

    const damage = computeDamage(definition, selected, target);
    const applied = applyAttack(
      this.state,
      selected.instanceId,
      targetId,
      damage,
    );
    const state = this.commitApply(applied);
    return {
      ok: true,
      state,
      selectUnitId: selectedUnitId,
      events: [...applied.events],
    };
  }

  endTurn(): BattleActionResult {
    if (this.state.phase !== "playing") {
      return fail(this.state, "Матч уже завершён");
    }
    const applied = endTurnState(this.state);
    const state = this.commit(applied.state, applied.events);
    return {
      ok: true,
      state,
      selectUnitId: null,
      events: applied.events,
    };
  }
}

export function isMoveHighlight(
  moves: Position[],
  pos: Position,
): boolean {
  return moves.some((move) => positionsEqual(move, pos));
}

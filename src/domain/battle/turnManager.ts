import {
  resetAbilityFlags,
  tickStatusesForOwner,
} from "../ability/statusEffects";
import type { GameEvent } from "../events/gameEvents";

import type { ApplyResult, BattleState, PlayerId, UnitRuntime } from "./types";

export function otherPlayer(player: PlayerId): PlayerId {
  return player === 0 ? 1 : 0;
}

export function resetUnitActions(units: UnitRuntime[]): UnitRuntime[] {
  return resetAbilityFlags(
    units.map((unit) => ({
      ...unit,
      hasMoved: false,
      hasAttacked: false,
    })),
  );
}

export function beginTurn(state: BattleState, player: PlayerId): ApplyResult {
  const nextState: BattleState = {
    ...state,
    currentPlayer: player,
    units: resetUnitActions(state.units),
  };

  const events: GameEvent[] = [
    {
      type: "TurnStarted",
      battleId: state.battleId,
      player,
      turnNumber: nextState.turnNumber,
    },
  ];

  return { state: nextState, events };
}

/**
 * End current player's turn and pass to opponent.
 * Ticks status durations for the ending player.
 */
export function endTurn(state: BattleState): ApplyResult {
  if (state.phase !== "playing") {
    return { state, events: [] };
  }

  const endingPlayer = state.currentPlayer;
  const ticked = tickStatusesForOwner(state.units, endingPlayer);
  const expireEvents: GameEvent[] = ticked.expired.map((item) => ({
    type: "StatusExpired" as const,
    battleId: state.battleId,
    unitId: item.unitId,
    statusId: item.status.statusId,
  }));

  const next = otherPlayer(endingPlayer);
  const turnNumber = next === 0 ? state.turnNumber + 1 : state.turnNumber;

  const ended: GameEvent = {
    type: "TurnEnded",
    battleId: state.battleId,
    player: endingPlayer,
    turnNumber: state.turnNumber,
  };

  const begun = beginTurn(
    { ...state, units: ticked.units, turnNumber },
    next,
  );

  return {
    state: begun.state,
    events: [ended, ...expireEvents, ...begun.events],
  };
}

import {
  acknowledgeHandoff,
  attackPiece,
  clearSelection,
  createMatch,
  endTurn,
  movePiece,
  selectPiece,
  surrenderMatch,
  useAbility,
} from "../matchEngine";

import type {
  MatchCommand,
  MatchSessionSnapshot,
} from "./matchSession.types";

/**
 * Chess-like: after one successful piece action (move / attack / ability),
 * the turn automatically passes to the opponent.
 */
function passTurnAfterAction(
  before: MatchSessionSnapshot["state"],
  after: MatchSessionSnapshot["state"],
  dualWindow: boolean,
): MatchSessionSnapshot["state"] {
  if (after === before) {
    return after;
  }
  if (after.phase === "ended") {
    return after;
  }
  if (after.phase !== "playing") {
    return after;
  }

  let next = endTurn(after);
  if (dualWindow) {
    next = acknowledgeHandoff(next);
  }
  return next;
}

export function applyMatchCommand(
  snapshot: MatchSessionSnapshot,
  command: MatchCommand,
): MatchSessionSnapshot {
  const { state, dualWindow } = snapshot;
  let nextState = state;

  switch (command.type) {
    case "selectPiece":
      nextState = selectPiece(state, command.pieceId);
      break;
    case "clearSelection":
      nextState = clearSelection(state);
      break;
    case "inspectPiece":
      nextState = {
        ...state,
        selectedPieceId: command.pieceId,
      };
      break;
    case "movePiece":
      nextState = passTurnAfterAction(
        state,
        movePiece(state, command.pieceId, command.to),
        dualWindow,
      );
      break;
    case "attackPiece":
      nextState = passTurnAfterAction(
        state,
        attackPiece(state, command.attackerId, command.targetId),
        dualWindow,
      );
      break;
    case "useAbility":
      nextState = passTurnAfterAction(
        state,
        useAbility(state, command.pieceId, command.target),
        dualWindow,
      );
      break;
    case "endTurn": {
      // Explicit pass (skip) without acting with a piece.
      nextState = endTurn(state);
      if (dualWindow) {
        nextState = acknowledgeHandoff(nextState);
      }
      break;
    }
    case "acknowledgeHandoff":
      nextState = acknowledgeHandoff(state);
      break;
    case "surrender":
      nextState = surrenderMatch(state, command.seat);
      break;
    case "rematch":
      nextState = createMatch(snapshot.config);
      break;
    default:
      return snapshot;
  }

  if (nextState === state && command.type !== "rematch") {
    return snapshot;
  }

  return {
    ...snapshot,
    state: nextState,
    revision: snapshot.revision + 1,
  };
}

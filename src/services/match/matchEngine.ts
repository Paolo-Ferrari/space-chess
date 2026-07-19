import { isKingUnit } from "../../domain/unit/unit.types";
import type { UnitDefinition } from "../../domain/unit/unit.types";
import {
  applyHeal,
  applyTeleport,
  canUseAbility,
  getAbilityForUnit,
  getHealTargets,
  getTeleportTargets,
} from "../../domain/match/abilities";
import { pieceAt, spawnSlotsForPlayer } from "../../domain/match/board";
import {
  canSelectPiece,
  getLegalAttacks,
  getLegalMoves,
  resolveAttackDamage,
} from "../../domain/match/combatRules";
import type {
  BoardPos,
  MatchConfig,
  MatchLogEntry,
  MatchPiece,
  MatchState,
  PlayerId,
} from "../../domain/match/match.types";
import { BOARD_SIZE } from "../../domain/match/match.types";
import { checkWinner } from "../../domain/match/victory";
import { getUnitById } from "../collection/collectionService";

let logSeq = 0;

function pushLog(
  state: MatchState,
  text: string,
): MatchLogEntry[] {
  logSeq += 1;
  return [
    { id: `log-${logSeq}`, text, round: state.round },
    ...state.log,
  ].slice(0, 80);
}

function withWinnerCheck(state: MatchState): MatchState {
  const winner = checkWinner(state.pieces, getUnitById);
  if (winner === null) {
    return state;
  }
  return {
    ...state,
    phase: "ended",
    winner,
    selectedPieceId: null,
    handoffPlayer: null,
    log: pushLog(
      state,
      `Победа: ${state.players[winner].displayName}.`,
    ),
  };
}

function createPiece(
  owner: PlayerId,
  unitDefinitionId: string,
  pos: BoardPos,
  index: number,
): MatchPiece | null {
  const def = getUnitById(unitDefinitionId);
  if (!def) {
    return null;
  }

  const usesTeleport = getAbilityForUnit(def).kind === "teleport_near_ally";

  return {
    id: `p${owner}-${unitDefinitionId}-${index}`,
    owner,
    unitDefinitionId,
    x: pos.x,
    y: pos.y,
    health: def.health,
    maxHealth: def.health,
    hasMoved: false,
    hasAttacked: false,
    hasUsedAbility: false,
    teleportCooldown: usesTeleport ? 0 : 0,
  };
}

export function createMatch(config: MatchConfig): MatchState {
  const pieces: MatchPiece[] = [];

  ([0, 1] as const).forEach((owner) => {
    const army = config.players[owner].army;
    const ids = army.unitDefinitionIds;
    const slots = spawnSlotsForPlayer(ids.length, owner, BOARD_SIZE);
    ids.forEach((unitId, index) => {
      const pos = slots[index];
      if (!pos) {
        return;
      }
      const piece = createPiece(owner, unitId, pos, index);
      if (piece) {
        pieces.push(piece);
      }
    });
  });

  const state: MatchState = {
    boardSize: BOARD_SIZE,
    pieces,
    players: config.players,
    currentPlayer: 0,
    round: 1,
    selectedPieceId: null,
    phase: "playing",
    winner: null,
    handoffPlayer: null,
    log: [],
  };

  return {
    ...state,
    log: pushLog(
      state,
      `Матч начат. Раунд 1 — ход ${config.players[0].displayName}.`,
    ),
  };
}

export function selectPiece(
  state: MatchState,
  pieceId: string,
): MatchState {
  if (state.phase !== "playing") {
    return state;
  }
  const piece = state.pieces.find((item) => item.id === pieceId);
  if (!piece || !canSelectPiece(state, piece)) {
    return state;
  }
  return { ...state, selectedPieceId: pieceId };
}

export function clearSelection(state: MatchState): MatchState {
  return { ...state, selectedPieceId: null };
}

export function movePiece(
  state: MatchState,
  pieceId: string,
  to: BoardPos,
): MatchState {
  if (state.phase !== "playing") {
    return state;
  }

  const piece = state.pieces.find((item) => item.id === pieceId);
  if (!piece || piece.owner !== state.currentPlayer) {
    return state;
  }

  const legal = getLegalMoves(state, piece);
  if (!legal.some((pos) => pos.x === to.x && pos.y === to.y)) {
    return state;
  }

  const def = getUnitById(piece.unitDefinitionId);
  const nextPieces = state.pieces.map((item) =>
    item.id === pieceId
      ? { ...item, x: to.x, y: to.y, hasMoved: true }
      : item,
  );

  const next: MatchState = {
    ...state,
    pieces: nextPieces,
    selectedPieceId: pieceId,
    log: pushLog(
      state,
      `${def?.name ?? "Фигура"} → (${to.x},${to.y}).`,
    ),
  };

  return next;
}

export function attackPiece(
  state: MatchState,
  attackerId: string,
  targetId: string,
): MatchState {
  if (state.phase !== "playing") {
    return state;
  }

  const attacker = state.pieces.find((item) => item.id === attackerId);
  const target = state.pieces.find((item) => item.id === targetId);
  if (!attacker || !target) {
    return state;
  }
  if (attacker.owner !== state.currentPlayer) {
    return state;
  }

  const legal = getLegalAttacks(state, attacker);
  if (!legal.some((item) => item.id === targetId)) {
    return state;
  }

  const attackerDef = getUnitById(attacker.unitDefinitionId);
  const targetDef = getUnitById(target.unitDefinitionId);
  const damage = resolveAttackDamage(attackerDef);
  const nextHealth = target.health - damage;

  let nextPieces = state.pieces.map((item) => {
    if (item.id === attackerId) {
      return { ...item, hasAttacked: true };
    }
    if (item.id === targetId) {
      return { ...item, health: nextHealth };
    }
    return item;
  });

  const killed = nextHealth <= 0;
  if (killed) {
    nextPieces = nextPieces.filter((item) => item.id !== targetId);
  }

  const killNote = killed
    ? ` ${targetDef?.name ?? "Цель"} уничтожен.`
    : ` Осталось HP: ${Math.max(0, nextHealth)}.`;

  const next: MatchState = {
    ...state,
    pieces: nextPieces,
    selectedPieceId: attackerId,
    log: pushLog(
      state,
      `${attackerDef?.name ?? "Атака"} бьёт ${targetDef?.name ?? "цель"} (−${damage}).${killNote}`,
    ),
  };

  return withWinnerCheck(next);
}

export type AbilityTarget =
  | { type: "heal"; targetPieceId: string }
  | { type: "teleport"; to: BoardPos };

export function useAbility(
  state: MatchState,
  pieceId: string,
  target: AbilityTarget,
): MatchState {
  if (state.phase !== "playing") {
    return state;
  }

  const piece = state.pieces.find((item) => item.id === pieceId);
  if (!piece || !canUseAbility(state, piece, getUnitById)) {
    return state;
  }

  const def = getUnitById(piece.unitDefinitionId);
  const ability = getAbilityForUnit(def);

  if (ability.kind === "heal_adjacent" && target.type === "heal") {
    const result = applyHeal(state.pieces, pieceId, target.targetPieceId);
    if (!result) {
      return state;
    }
    const healedName =
      getUnitById(
        state.pieces.find((item) => item.id === target.targetPieceId)
          ?.unitDefinitionId ?? "",
      )?.name ?? "союзник";
    return {
      ...state,
      pieces: result.pieces,
      selectedPieceId: pieceId,
      log: pushLog(
        state,
        `${def?.name ?? "Лекарь"} лечит ${healedName} (+${result.healed}).`,
      ),
    };
  }

  if (ability.kind === "teleport_near_ally" && target.type === "teleport") {
    const legal = getTeleportTargets(state, piece);
    if (!legal.some((pos) => pos.x === target.to.x && pos.y === target.to.y)) {
      return state;
    }
    const nextPieces = applyTeleport(
      state.pieces,
      pieceId,
      target.to,
      piece.owner,
      state.boardSize,
    );
    if (!nextPieces) {
      return state;
    }
    return {
      ...state,
      pieces: nextPieces,
      selectedPieceId: pieceId,
      log: pushLog(
        state,
        `${def?.name ?? "Герой"} телепортируется на (${target.to.x},${target.to.y}).`,
      ),
    };
  }

  return state;
}

export function endTurn(state: MatchState): MatchState {
  if (state.phase !== "playing") {
    return state;
  }

  const nextPlayer: PlayerId = state.currentPlayer === 0 ? 1 : 0;
  const nextRound =
    state.currentPlayer === 1 ? state.round + 1 : state.round;

  const cooled = state.pieces.map((piece) => {
    const teleportCooldown =
      piece.owner === state.currentPlayer && piece.teleportCooldown > 0
        ? piece.teleportCooldown - 1
        : piece.teleportCooldown;

    return {
      ...piece,
      hasMoved: false,
      hasAttacked: false,
      hasUsedAbility: false,
      teleportCooldown,
    };
  });

  const base: MatchState = {
    ...state,
    pieces: cooled,
    currentPlayer: nextPlayer,
    round: nextRound,
    selectedPieceId: null,
    phase: "handoff",
    handoffPlayer: nextPlayer,
    log: pushLog(
      state,
      nextPlayer === 0
        ? `Раунд ${nextRound}. Ход ${state.players[0].displayName}.`
        : `Ход ${state.players[1].displayName}.`,
    ),
  };

  return base;
}

export function acknowledgeHandoff(state: MatchState): MatchState {
  if (state.phase !== "handoff") {
    return state;
  }
  return {
    ...state,
    phase: "playing",
    handoffPlayer: null,
  };
}

export function getSelectedPiece(
  state: MatchState,
): MatchPiece | null {
  if (!state.selectedPieceId) {
    return null;
  }
  return state.pieces.find((piece) => piece.id === state.selectedPieceId) ?? null;
}

export function describePiece(
  piece: MatchPiece,
): {
  def: UnitDefinition | undefined;
  isKing: boolean;
  abilityLabel: string;
  abilityActive: boolean;
} {
  const def = getUnitById(piece.unitDefinitionId);
  const ability = getAbilityForUnit(def);
  return {
    def,
    isKing: Boolean(def && isKingUnit(def)),
    abilityLabel: ability.label,
    abilityActive: ability.active,
  };
}

export {
  getLegalMoves,
  getLegalAttacks,
  getHealTargets,
  getTeleportTargets,
  canUseAbility,
  pieceAt,
};

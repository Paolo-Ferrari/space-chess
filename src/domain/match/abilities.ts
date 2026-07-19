import type { UnitDefinition } from "../unit/unit.types";

import { cellKey, chebyshev, inBounds, pieceAt } from "./board";
import type {
  BoardPos,
  MatchPiece,
  MatchState,
  PlayerId,
} from "./match.types";
import { ATTACK_RANGE } from "./match.types";

export type AbilityKind = "none" | "heal_adjacent" | "teleport_near_ally";

export interface AbilityDefinition {
  kind: AbilityKind;
  /** Short UI label. */
  label: string;
  /** Whether the bottom-panel button can fire this turn. */
  active: boolean;
}

const HEAL_UNITS = new Set([
  "unit-cosmo-apothecary",
  "unit-neutral-medic",
  "unit-neutral-engineer",
]);

const TELEPORT_UNITS = new Set(["unit-king-pluton-archon"]);

export function getAbilityForUnit(
  unit: UnitDefinition | undefined,
): AbilityDefinition {
  if (!unit) {
    return { kind: "none", label: "Нет", active: false };
  }

  if (HEAL_UNITS.has(unit.id)) {
    return {
      kind: "heal_adjacent",
      label: "Лечение",
      active: true,
    };
  }

  if (TELEPORT_UNITS.has(unit.id)) {
    return {
      kind: "teleport_near_ally",
      label: "Телепорт",
      active: true,
    };
  }

  return {
    kind: "none",
    label: "Пассивная",
    active: false,
  };
}

export function canUseAbility(
  state: MatchState,
  piece: MatchPiece,
  getUnitById: (unitId: string) => UnitDefinition | undefined,
): boolean {
  if (state.phase !== "playing") {
    return false;
  }
  if (piece.owner !== state.currentPlayer) {
    return false;
  }
  if (piece.hasUsedAbility || piece.hasAttacked) {
    return false;
  }

  const unit = getUnitById(piece.unitDefinitionId);
  const ability = getAbilityForUnit(unit);
  if (!ability.active) {
    return false;
  }

  if (ability.kind === "teleport_near_ally") {
    return piece.teleportCooldown <= 0;
  }

  if (ability.kind === "heal_adjacent") {
    return getHealTargets(state.pieces, piece).length > 0;
  }

  return false;
}

export function getHealTargets(
  pieces: readonly MatchPiece[],
  healer: MatchPiece,
): MatchPiece[] {
  return pieces.filter((target) => {
    if (target.id === healer.id || target.owner !== healer.owner) {
      return false;
    }
    if (target.health >= target.maxHealth) {
      return false;
    }
    return chebyshev(healer, target) <= ATTACK_RANGE;
  });
}

/** Free cells adjacent to any friendly piece (including self), not under enemy adjacent attack. */
export function getTeleportTargets(
  state: MatchState,
  piece: MatchPiece,
): BoardPos[] {
  const allies = state.pieces.filter(
    (other) => other.owner === piece.owner && other.id !== piece.id,
  );
  if (allies.length === 0) {
    return [];
  }

  const enemies = state.pieces.filter((other) => other.owner !== piece.owner);
  const occupied = new Set(
    state.pieces
      .filter((other) => other.id !== piece.id)
      .map((other) => cellKey(other)),
  );

  const candidates = new Map<string, BoardPos>();
  for (const ally of allies) {
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        const pos = { x: ally.x + dx, y: ally.y + dy };
        if (!inBounds(pos, state.boardSize)) {
          continue;
        }
        const key = cellKey(pos);
        if (occupied.has(key)) {
          continue;
        }
        const threatened = enemies.some(
          (enemy) => chebyshev(enemy, pos) <= ATTACK_RANGE,
        );
        if (threatened) {
          continue;
        }
        candidates.set(key, pos);
      }
    }
  }

  return [...candidates.values()];
}

export function applyHeal(
  pieces: MatchPiece[],
  healerId: string,
  targetId: string,
): { pieces: MatchPiece[]; healed: number } | null {
  const healer = pieces.find((piece) => piece.id === healerId);
  const target = pieces.find((piece) => piece.id === targetId);
  if (!healer || !target) {
    return null;
  }
  if (!getHealTargets(pieces, healer).some((item) => item.id === targetId)) {
    return null;
  }

  const healed = Math.min(2, target.maxHealth - target.health);
  const next = pieces.map((piece) => {
    if (piece.id === targetId) {
      return { ...piece, health: piece.health + healed };
    }
    if (piece.id === healerId) {
      return { ...piece, hasUsedAbility: true, hasAttacked: true };
    }
    return piece;
  });

  return { pieces: next, healed };
}

export function applyTeleport(
  pieces: MatchPiece[],
  pieceId: string,
  to: BoardPos,
  owner: PlayerId,
  boardSize: number,
): MatchPiece[] | null {
  const piece = pieces.find((item) => item.id === pieceId);
  if (!piece || piece.owner !== owner) {
    return null;
  }
  if (!inBounds(to, boardSize) || pieceAt(pieces, to)) {
    return null;
  }

  return pieces.map((item) => {
    if (item.id !== pieceId) {
      return item;
    }
    return {
      ...item,
      x: to.x,
      y: to.y,
      hasUsedAbility: true,
      hasMoved: true,
      teleportCooldown: 5,
    };
  });
}

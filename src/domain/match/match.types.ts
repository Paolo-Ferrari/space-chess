import type { Army } from "../army/army.types";

/** Seat index for offline turn-based match. */
export type PlayerId = 0 | 1;

export const BOARD_SIZE = 16;

/** Orthogonal + diagonal step for MVP move/attack range. */
export const MOVE_RANGE = 1;
export const ATTACK_RANGE = 1;

export interface BoardPos {
  x: number;
  y: number;
}

export interface MatchPlayerSetup {
  displayName: string;
  heroId: string;
  army: Army;
}

export interface MatchPiece {
  id: string;
  owner: PlayerId;
  unitDefinitionId: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  /** Used move this turn. */
  hasMoved: boolean;
  /** Used attack this turn. */
  hasAttacked: boolean;
  /** Used active ability this turn. */
  hasUsedAbility: boolean;
  /**
   * Remaining player-turns until Pluton hero teleport is ready.
   * 0 = ready. Only set on pieces that use that ability.
   */
  teleportCooldown: number;
}

export type MatchPhase = "playing" | "handoff" | "ended";

export interface MatchLogEntry {
  id: string;
  text: string;
  round: number;
}

export interface MatchState {
  boardSize: number;
  pieces: MatchPiece[];
  players: [MatchPlayerSetup, MatchPlayerSetup];
  currentPlayer: PlayerId;
  /** Round starts at 1; increments after Player 2 ends turn. */
  round: number;
  selectedPieceId: string | null;
  phase: MatchPhase;
  winner: PlayerId | null;
  log: MatchLogEntry[];
  /** Next player waiting behind handoff overlay. */
  handoffPlayer: PlayerId | null;
}

export interface MatchConfig {
  players: [MatchPlayerSetup, MatchPlayerSetup];
}

import type {
  BoardPos,
  MatchConfig,
  MatchState,
} from "../../../domain/match/match.types";
import type { AbilityTarget } from "../matchEngine";

/**
 * Transport kind for a match session.
 * `local` = same machine, shared state (BroadcastChannel).
 * Later: `network` can implement the same MatchSessionSource API.
 */
export type MatchTransportKind = "local";

export type MatchCommand =
  | { type: "selectPiece"; pieceId: string }
  | { type: "clearSelection" }
  | { type: "inspectPiece"; pieceId: string }
  | { type: "movePiece"; pieceId: string; to: BoardPos }
  | { type: "attackPiece"; attackerId: string; targetId: string }
  | { type: "useAbility"; pieceId: string; target: AbilityTarget }
  | { type: "endTurn" }
  | { type: "acknowledgeHandoff" }
  | { type: "surrender"; seat: 0 | 1 }
  | { type: "rematch" };

export interface MatchSessionSnapshot {
  sessionId: string;
  config: MatchConfig;
  state: MatchState;
  /** Dual-window local play: skip single-screen handoff overlay. */
  dualWindow: boolean;
  revision: number;
}

/**
 * Abstract match session. UI talks only to this interface.
 * Swap LocalMatchSessionSource for a network source later without changing match rules.
 */
export interface MatchSessionSource {
  readonly kind: MatchTransportKind;
  readonly sessionId: string;
  getSnapshot(): MatchSessionSnapshot;
  subscribe(listener: (snapshot: MatchSessionSnapshot) => void): () => void;
  dispatch(command: MatchCommand): void;
  dispose(): void;
}

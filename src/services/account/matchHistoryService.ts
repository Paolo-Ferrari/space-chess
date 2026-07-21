import { recomputeStatsFromHistory } from "../../domain/account/stats";
import type {
  MatchHistoryEntry,
  MatchMode,
  MatchResult,
  PlayerAccount,
} from "../../domain/account/types";

import { AccountStore } from "./accountStore";

export interface RecordMatchInput {
  userId: string;
  opponentLabel: string;
  result: MatchResult;
  armyId: string | null;
  armyName: string;
  factionId: string;
  durationMs: number;
  turnCount: number;
  mode: MatchMode;
}

function newMatchId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `match-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Match History + denormalized stats on PlayerAccount.
 */
export const MatchHistoryService = {
  listForUser(userId: string): MatchHistoryEntry[] {
    return AccountStore.load()
      .matches.filter((entry) => entry.userId === userId)
      .sort((a, b) => b.playedAt - a.playedAt);
  },

  record(input: RecordMatchInput): MatchHistoryEntry | null {
    const db = AccountStore.load();
    const userIndex = db.users.findIndex((user) => user.id === input.userId);
    if (userIndex === -1) {
      return null;
    }

    const entry: MatchHistoryEntry = {
      id: newMatchId(),
      userId: input.userId,
      playedAt: Date.now(),
      opponentLabel: input.opponentLabel,
      result: input.result,
      armyId: input.armyId,
      armyName: input.armyName,
      factionId: input.factionId,
      durationMs: Math.max(0, input.durationMs),
      turnCount: Math.max(0, input.turnCount),
      mode: input.mode,
    };

    db.matches.push(entry);
    const userMatches = db.matches.filter(
      (match) => match.userId === input.userId,
    );
    db.users[userIndex] = {
      ...db.users[userIndex]!,
      stats: recomputeStatsFromHistory(userMatches),
    };

    if (!AccountStore.save(db)) {
      return null;
    }
    return entry;
  },

  getAccount(userId: string): PlayerAccount | undefined {
    return AccountStore.load().users.find((user) => user.id === userId);
  },
};

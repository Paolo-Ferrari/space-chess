import type { AuthSession, PlayerAccount } from "../../domain/account/types";
import { winRate } from "../../domain/account/stats";
import { getFactionById } from "../../data/catalog/armyBuilder";

import { AuthService } from "./authService";
import { MatchHistoryService } from "./matchHistoryService";

/**
 * Facade for profile UI — aggregates auth + history + stats labels.
 */
export const ProgressService = {
  getSession(): AuthSession | null {
    return AuthService.getSession();
  },

  requireAccount(): PlayerAccount | null {
    const session = AuthService.getSession();
    if (!session) {
      return null;
    }
    return AuthService.getAccount(session.userId) ?? null;
  },

  profileView(userId: string) {
    const account = AuthService.getAccount(userId);
    if (!account) {
      return null;
    }
    const history = MatchHistoryService.listForUser(userId);
    const favoriteFaction = account.stats.favoriteFactionId
      ? getFactionById(account.stats.favoriteFactionId)
      : undefined;

    return {
      account,
      history,
      winRate: winRate(account.stats),
      favoriteFactionName: favoriteFaction?.name ?? "—",
      favoriteModeLabel:
        account.stats.favoriteMode === "ai"
          ? "Против ИИ"
          : account.stats.favoriteMode === "hotseat"
            ? "Hotseat"
            : "—",
    };
  },
};

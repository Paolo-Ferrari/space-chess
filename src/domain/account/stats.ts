import type { MatchHistoryEntry, MatchMode, PlayerStats } from "./types";
import { EMPTY_PLAYER_STATS } from "./types";

export function winRate(stats: PlayerStats): number {
  if (stats.matchesPlayed <= 0) {
    return 0;
  }
  return Math.round((stats.wins / stats.matchesPlayed) * 1000) / 10;
}

export function recomputeStatsFromHistory(
  entries: readonly MatchHistoryEntry[],
): PlayerStats {
  if (entries.length === 0) {
    return { ...EMPTY_PLAYER_STATS };
  }

  let wins = 0;
  let losses = 0;
  let draws = 0;
  const factionCounts = new Map<string, number>();
  const modeCounts = new Map<MatchMode, number>();

  for (const entry of entries) {
    if (entry.result === "victory") {
      wins += 1;
    } else if (entry.result === "defeat") {
      losses += 1;
    } else {
      draws += 1;
    }
    factionCounts.set(
      entry.factionId,
      (factionCounts.get(entry.factionId) ?? 0) + 1,
    );
    modeCounts.set(entry.mode, (modeCounts.get(entry.mode) ?? 0) + 1);
  }

  const favoriteFactionId =
    [...factionCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const favoriteMode =
    [...modeCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    wins,
    losses,
    draws,
    matchesPlayed: entries.length,
    favoriteFactionId,
    favoriteMode,
  };
}

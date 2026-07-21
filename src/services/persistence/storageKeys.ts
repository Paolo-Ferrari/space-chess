export const STORAGE_KEYS = {
  armies: "space-chess.army-builder.v1",
  matchSnapshot: "space-chess.match-snapshot.v1",
  /** Local stand-in for users / sessions / match_history tables. */
  accountDb: "space-chess.account-db.v1",
  /** Active session token pointer (not the password). */
  sessionToken: "space-chess.session-token.v1",
} as const;

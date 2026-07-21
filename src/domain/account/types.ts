/**
 * Player Account contracts — portable to future HTTP API / DB.
 * No shop / rating / battle pass here.
 */

import type { AiDifficulty } from "../ai/types";

export type MatchResult = "victory" | "defeat" | "draw";
export type MatchMode = "ai" | "hotseat";

export interface PlayerSettings {
  preferredDifficulty: AiDifficulty;
  /** Reserved for localization. */
  locale: "ru";
}

export interface PlayerStats {
  wins: number;
  losses: number;
  draws: number;
  matchesPlayed: number;
  /** Faction id with most matches, if any. */
  favoriteFactionId: string | null;
  /** Mode with most matches, if any. */
  favoriteMode: MatchMode | null;
}

/**
 * Public account profile (never includes password material).
 */
export interface PlayerAccount {
  id: string;
  displayName: string;
  createdAt: number;
  settings: PlayerSettings;
  stats: PlayerStats;
}

/** Stored credential row — local DB / future users table. */
export interface UserCredentialRecord {
  userId: string;
  displayNameNormalized: string;
  /** PBKDF2 salt (base64). */
  passwordSalt: string;
  /** PBKDF2 hash (base64). */
  passwordHash: string;
  /** PBKDF2 iterations used. */
  iterations: number;
  createdAt: number;
}

export interface SessionRecord {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

export interface AuthSession {
  token: string;
  userId: string;
  displayName: string;
  expiresAt: number;
}

export interface MatchHistoryEntry {
  id: string;
  userId: string;
  playedAt: number;
  opponentLabel: string;
  result: MatchResult;
  armyId: string | null;
  armyName: string;
  factionId: string;
  durationMs: number;
  turnCount: number;
  mode: MatchMode;
}

export interface RegisterInput {
  displayName: string;
  password: string;
}

export interface LoginInput {
  displayName: string;
  password: string;
}

export const DEFAULT_PLAYER_SETTINGS: PlayerSettings = {
  preferredDifficulty: "normal",
  locale: "ru",
};

export const EMPTY_PLAYER_STATS: PlayerStats = {
  wins: 0,
  losses: 0,
  draws: 0,
  matchesPlayed: 0,
  favoriteFactionId: null,
  favoriteMode: null,
};

export const DISPLAY_NAME_MIN = 2;
export const DISPLAY_NAME_MAX = 20;
export const PASSWORD_MIN = 6;

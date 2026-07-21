/**
 * Local persistence for accounts — stands in for users / sessions / matches tables.
 * Swap this module for HTTP clients without changing UI / domain services.
 */

import type {
  MatchHistoryEntry,
  PlayerAccount,
  SessionRecord,
  UserCredentialRecord,
} from "../../domain/account/types";
import {
  canUseLocalStorage,
  readJson,
  removeKey,
  writeJson,
} from "../persistence/localStoragePort";
import { STORAGE_KEYS } from "../persistence/storageKeys";

export interface AccountDatabaseSnapshot {
  version: 1;
  users: PlayerAccount[];
  credentials: UserCredentialRecord[];
  sessions: SessionRecord[];
  matches: MatchHistoryEntry[];
}

const EMPTY_DB: AccountDatabaseSnapshot = {
  version: 1,
  users: [],
  credentials: [],
  sessions: [],
  matches: [],
};

function readDb(): AccountDatabaseSnapshot {
  if (!canUseLocalStorage()) {
    return { ...EMPTY_DB, users: [], credentials: [], sessions: [], matches: [] };
  }
  const parsed = readJson<AccountDatabaseSnapshot>(STORAGE_KEYS.accountDb);
  if (!parsed || parsed.version !== 1) {
    return {
      version: 1,
      users: [],
      credentials: [],
      sessions: [],
      matches: [],
    };
  }
  return {
    version: 1,
    users: Array.isArray(parsed.users) ? parsed.users : [],
    credentials: Array.isArray(parsed.credentials) ? parsed.credentials : [],
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    matches: Array.isArray(parsed.matches) ? parsed.matches : [],
  };
}

function writeDb(db: AccountDatabaseSnapshot): boolean {
  return writeJson(STORAGE_KEYS.accountDb, db);
}

export const AccountStore = {
  load(): AccountDatabaseSnapshot {
    return readDb();
  },

  save(db: AccountDatabaseSnapshot): boolean {
    return writeDb(db);
  },

  clearAll(): void {
    removeKey(STORAGE_KEYS.accountDb);
    removeKey(STORAGE_KEYS.sessionToken);
  },

  getActiveToken(): string | null {
    if (!canUseLocalStorage()) {
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEYS.sessionToken);
    return raw && raw.length > 0 ? raw : null;
  },

  setActiveToken(token: string | null): void {
    if (!canUseLocalStorage()) {
      return;
    }
    if (!token) {
      localStorage.removeItem(STORAGE_KEYS.sessionToken);
      return;
    }
    localStorage.setItem(STORAGE_KEYS.sessionToken, token);
  },
};

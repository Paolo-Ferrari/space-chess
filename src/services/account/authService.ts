import {
  DEFAULT_PLAYER_SETTINGS,
  DISPLAY_NAME_MAX,
  DISPLAY_NAME_MIN,
  EMPTY_PLAYER_STATS,
  PASSWORD_MIN,
  type AuthSession,
  type LoginInput,
  type PlayerAccount,
  type RegisterInput,
  type SessionRecord,
} from "../../domain/account/types";

import { AccountStore } from "./accountStore";
import { hashPassword, verifyPassword } from "./passwordCrypto";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export type AuthReject =
  | "invalid_name"
  | "invalid_password"
  | "name_taken"
  | "unknown_user"
  | "bad_credentials"
  | "storage_unavailable"
  | "crypto_unavailable";

export const AUTH_REJECT_MESSAGES: Record<AuthReject, string> = {
  invalid_name: `Имя: ${DISPLAY_NAME_MIN}–${DISPLAY_NAME_MAX} символов`,
  invalid_password: `Пароль: минимум ${PASSWORD_MIN} символов`,
  name_taken: "Это имя уже занято",
  unknown_user: "Аккаунт не найден",
  bad_credentials: "Неверное имя или пароль",
  storage_unavailable: "Хранилище недоступно",
  crypto_unavailable: "Криптография недоступна в этом браузере",
};

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

function validateName(name: string): boolean {
  const trimmed = name.trim();
  return (
    trimmed.length >= DISPLAY_NAME_MIN && trimmed.length <= DISPLAY_NAME_MAX
  );
}

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function sessionFromRecord(
  session: SessionRecord,
  account: PlayerAccount,
): AuthSession {
  return {
    token: session.token,
    userId: account.id,
    displayName: account.displayName,
    expiresAt: session.expiresAt,
  };
}

function purgeExpired(db: ReturnType<typeof AccountStore.load>, now: number) {
  db.sessions = db.sessions.filter((session) => session.expiresAt > now);
}

/**
 * Auth application service — local now, HTTP later.
 * Passwords never leave the client unhashed in storage.
 */
export const AuthService = {
  async register(
    input: RegisterInput,
  ): Promise<{ ok: true; session: AuthSession } | { ok: false; reason: AuthReject }> {
    if (typeof crypto === "undefined" || !crypto.subtle) {
      return { ok: false, reason: "crypto_unavailable" };
    }
    if (!validateName(input.displayName)) {
      return { ok: false, reason: "invalid_name" };
    }
    if (input.password.length < PASSWORD_MIN) {
      return { ok: false, reason: "invalid_password" };
    }

    const db = AccountStore.load();
    const normalized = normalizeName(input.displayName);
    if (db.credentials.some((row) => row.displayNameNormalized === normalized)) {
      return { ok: false, reason: "name_taken" };
    }

    let hashed: Awaited<ReturnType<typeof hashPassword>>;
    try {
      hashed = await hashPassword(input.password);
    } catch {
      return { ok: false, reason: "crypto_unavailable" };
    }

    const now = Date.now();
    const userId = newId("user");
    const account: PlayerAccount = {
      id: userId,
      displayName: input.displayName.trim(),
      createdAt: now,
      settings: { ...DEFAULT_PLAYER_SETTINGS },
      stats: { ...EMPTY_PLAYER_STATS },
    };

    db.users.push(account);
    db.credentials.push({
      userId,
      displayNameNormalized: normalized,
      passwordSalt: hashed.salt,
      passwordHash: hashed.hash,
      iterations: hashed.iterations,
      createdAt: now,
    });

    const session: SessionRecord = {
      token: newId("sess"),
      userId,
      createdAt: now,
      expiresAt: now + SESSION_TTL_MS,
    };
    db.sessions.push(session);

    if (!AccountStore.save(db)) {
      return { ok: false, reason: "storage_unavailable" };
    }
    AccountStore.setActiveToken(session.token);
    return { ok: true, session: sessionFromRecord(session, account) };
  },

  async login(
    input: LoginInput,
  ): Promise<{ ok: true; session: AuthSession } | { ok: false; reason: AuthReject }> {
    if (typeof crypto === "undefined" || !crypto.subtle) {
      return { ok: false, reason: "crypto_unavailable" };
    }
    if (!validateName(input.displayName)) {
      return { ok: false, reason: "invalid_name" };
    }
    if (input.password.length < PASSWORD_MIN) {
      return { ok: false, reason: "invalid_password" };
    }

    const db = AccountStore.load();
    const normalized = normalizeName(input.displayName);
    const cred = db.credentials.find(
      (row) => row.displayNameNormalized === normalized,
    );
    if (!cred) {
      return { ok: false, reason: "unknown_user" };
    }

    const valid = await verifyPassword(
      input.password,
      cred.passwordSalt,
      cred.passwordHash,
      cred.iterations,
    );
    if (!valid) {
      return { ok: false, reason: "bad_credentials" };
    }

    const account = db.users.find((user) => user.id === cred.userId);
    if (!account) {
      return { ok: false, reason: "unknown_user" };
    }

    const now = Date.now();
    purgeExpired(db, now);
    const session: SessionRecord = {
      token: newId("sess"),
      userId: account.id,
      createdAt: now,
      expiresAt: now + SESSION_TTL_MS,
    };
    db.sessions.push(session);
    if (!AccountStore.save(db)) {
      return { ok: false, reason: "storage_unavailable" };
    }
    AccountStore.setActiveToken(session.token);
    return { ok: true, session: sessionFromRecord(session, account) };
  },

  logout(): void {
    const token = AccountStore.getActiveToken();
    if (token) {
      const db = AccountStore.load();
      db.sessions = db.sessions.filter((session) => session.token !== token);
      AccountStore.save(db);
    }
    AccountStore.setActiveToken(null);
  },

  /**
   * Restore session from stored token. Returns null if missing/expired.
   */
  getSession(): AuthSession | null {
    const token = AccountStore.getActiveToken();
    if (!token) {
      return null;
    }
    const db = AccountStore.load();
    const now = Date.now();
    purgeExpired(db, now);
    const session = db.sessions.find((row) => row.token === token);
    if (!session || session.expiresAt <= now) {
      AccountStore.setActiveToken(null);
      AccountStore.save(db);
      return null;
    }
    const account = db.users.find((user) => user.id === session.userId);
    if (!account) {
      AccountStore.setActiveToken(null);
      return null;
    }
    AccountStore.save(db);
    return sessionFromRecord(session, account);
  },

  getAccount(userId: string): PlayerAccount | undefined {
    return AccountStore.load().users.find((user) => user.id === userId);
  },

  updateSettings(
    userId: string,
    patch: Partial<PlayerAccount["settings"]>,
  ): PlayerAccount | null {
    const db = AccountStore.load();
    const index = db.users.findIndex((user) => user.id === userId);
    if (index === -1) {
      return null;
    }
    const next = {
      ...db.users[index]!,
      settings: { ...db.users[index]!.settings, ...patch },
    };
    db.users[index] = next;
    AccountStore.save(db);
    return next;
  },
};

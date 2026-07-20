import { createMatch } from "../matchEngine";
import type { MatchConfig } from "../../../domain/match/match.types";

import { applyMatchCommand } from "./applyMatchCommand";
import type {
  MatchCommand,
  MatchSessionSnapshot,
  MatchSessionSource,
} from "./matchSession.types";

const STORAGE_PREFIX = "space-chess.local-match.v1:";

type ChannelMessage =
  | { type: "snapshot"; snapshot: MatchSessionSnapshot }
  | { type: "request" };

function storageKey(sessionId: string): string {
  return `${STORAGE_PREFIX}${sessionId}`;
}

function channelName(sessionId: string): string {
  return `space-chess.local-match.${sessionId}`;
}

function readStored(sessionId: string): MatchSessionSnapshot | null {
  try {
    const raw = localStorage.getItem(storageKey(sessionId));
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as MatchSessionSnapshot;
  } catch {
    return null;
  }
}

function writeStored(snapshot: MatchSessionSnapshot): void {
  localStorage.setItem(storageKey(snapshot.sessionId), JSON.stringify(snapshot));
}

function createSnapshot(
  sessionId: string,
  config: MatchConfig,
): MatchSessionSnapshot {
  return {
    sessionId,
    config,
    state: createMatch(config),
    dualWindow: true,
    revision: 1,
  };
}

class LocalMatchSessionSource implements MatchSessionSource {
  readonly kind = "local" as const;
  readonly sessionId: string;

  private snapshot: MatchSessionSnapshot;
  private readonly listeners = new Set<
    (snapshot: MatchSessionSnapshot) => void
  >();
  private readonly channel: BroadcastChannel;
  private disposed = false;

  constructor(snapshot: MatchSessionSnapshot) {
    this.sessionId = snapshot.sessionId;
    this.snapshot = snapshot;
    this.channel = new BroadcastChannel(channelName(snapshot.sessionId));
    this.channel.onmessage = (event: MessageEvent<ChannelMessage>) => {
      const data = event.data;
      if (!data || this.disposed) {
        return;
      }
      if (data.type === "request") {
        this.channel.postMessage({
          type: "snapshot",
          snapshot: this.snapshot,
        } satisfies ChannelMessage);
        return;
      }
      if (data.type === "snapshot" && data.snapshot) {
        if (data.snapshot.revision < this.snapshot.revision) {
          return;
        }
        this.snapshot = data.snapshot;
        writeStored(this.snapshot);
        this.emit();
      }
    };
    // Ask peers for a fresher snapshot after join / second window open.
    this.channel.postMessage({ type: "request" } satisfies ChannelMessage);
  }

  getSnapshot(): MatchSessionSnapshot {
    return this.snapshot;
  }

  subscribe(listener: (snapshot: MatchSessionSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => {
      this.listeners.delete(listener);
    };
  }

  dispatch(command: MatchCommand): void {
    if (this.disposed) {
      return;
    }
    const next = applyMatchCommand(this.snapshot, command);
    if (next.revision === this.snapshot.revision) {
      return;
    }
    this.snapshot = next;
    writeStored(this.snapshot);
    this.channel.postMessage({
      type: "snapshot",
      snapshot: this.snapshot,
    } satisfies ChannelMessage);
    this.emit();
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.listeners.clear();
    this.channel.close();
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener(this.snapshot);
    }
  }
}

/** Create a new dual-window local session and persist it. */
export function createLocalMatchSession(
  config: MatchConfig,
): MatchSessionSource {
  const sessionId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const snapshot = createSnapshot(sessionId, config);
  writeStored(snapshot);
  return new LocalMatchSessionSource(snapshot);
}

/** Join an existing local session from another window. */
export function joinLocalMatchSession(
  sessionId: string,
): MatchSessionSource | null {
  const stored = readStored(sessionId);
  if (!stored) {
    return null;
  }
  return new LocalMatchSessionSource(stored);
}

export function clearLocalMatchSession(sessionId: string): void {
  localStorage.removeItem(storageKey(sessionId));
}

export function buildLocalMatchWindowUrl(
  sessionId: string,
  seat: 0 | 1,
): string {
  const url = new URL(window.location.href);
  url.searchParams.set("localMatch", sessionId);
  url.searchParams.set("seat", String(seat));
  return url.toString();
}

/**
 * Open Player 2 as a normal browser tab.
 * Current tab is meant to become Player 1 in-place.
 */
export function launchPlayerTwoTab(sessionId: string): {
  opened: boolean;
  urls: [string, string];
} {
  const urls: [string, string] = [
    buildLocalMatchWindowUrl(sessionId, 0),
    buildLocalMatchWindowUrl(sessionId, 1),
  ];
  // No window features → browser opens a tab (not a popup window).
  const tab = window.open(urls[1], "_blank");
  return {
    opened: Boolean(tab),
    urls,
  };
}

/** Fallback: open both seats as tabs. */
export function launchLocalMatchWindows(sessionId: string): {
  opened: [boolean, boolean];
  urls: [string, string];
} {
  const urls: [string, string] = [
    buildLocalMatchWindowUrl(sessionId, 0),
    buildLocalMatchWindowUrl(sessionId, 1),
  ];
  const t0 = window.open(urls[0], "_blank");
  const t1 = window.open(urls[1], "_blank");
  return {
    opened: [Boolean(t0), Boolean(t1)],
    urls,
  };
}

export function parseLocalMatchRoute(
  search: string = window.location.search,
): { sessionId: string; seat: 0 | 1 } | null {
  const params = new URLSearchParams(search);
  const sessionId = params.get("localMatch");
  const seatRaw = params.get("seat");
  if (!sessionId || (seatRaw !== "0" && seatRaw !== "1")) {
    return null;
  }
  return { sessionId, seat: seatRaw === "0" ? 0 : 1 };
}

export function clearLocalMatchRoute(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete("localMatch");
  url.searchParams.delete("seat");
  window.history.replaceState({}, "", url.pathname + url.search + url.hash);
}

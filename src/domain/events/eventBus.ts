import type { GameEvent, GameEventType } from "./gameEvents";

type Listener = (event: GameEvent) => void;

/**
 * Simple synchronous event bus.
 * Not a replacement for the deterministic apply pipeline — fires AFTER state changes.
 */
export class EventBus {
  private readonly listeners = new Map<GameEventType | "*", Set<Listener>>();
  private readonly history: GameEvent[] = [];

  on(type: GameEventType | "*", listener: Listener): () => void {
    const set = this.listeners.get(type) ?? new Set();
    set.add(listener);
    this.listeners.set(type, set);
    return () => {
      set.delete(listener);
    };
  }

  emit(event: GameEvent): void {
    this.history.push(event);
    const typed = this.listeners.get(event.type);
    typed?.forEach((listener) => listener(event));
    const all = this.listeners.get("*");
    all?.forEach((listener) => listener(event));
  }

  emitAll(events: readonly GameEvent[]): void {
    for (const event of events) {
      this.emit(event);
    }
  }

  getHistory(): readonly GameEvent[] {
    return this.history;
  }

  clearHistory(): void {
    this.history.length = 0;
  }
}

import { useEffect, useState, type CSSProperties } from "react";

import type { GameEvent } from "../../../domain/events/gameEvents";

import "./BattleFxLayer.css";

export type BattleFxKind =
  | "strike"
  | "heal"
  | "hack"
  | "shield"
  | "heavy"
  | "destroy";

interface FxBurst {
  id: string;
  kind: BattleFxKind;
  x: number;
  y: number;
}

interface BattleFxLayerProps {
  boardWidth: number;
  boardHeight: number;
  events: readonly GameEvent[];
  /** Map instanceId → cell for positioning. */
  unitCells: ReadonlyMap<string, { x: number; y: number }>;
}

function kindFromEvent(event: GameEvent): BattleFxKind | null {
  if (event.type === "UnitDamaged") return "strike";
  if (event.type === "UnitDestroyed") return "destroy";
  if (event.type === "UnitHealed") return "heal";
  if (event.type === "AbilityUsed") {
    const id = event.abilityId.toLowerCase();
    if (id.includes("heal")) return "heal";
    if (id.includes("armor") || id.includes("shield")) return "shield";
    if (id.includes("power") || id.includes("heavy")) return "heavy";
    if (id.includes("slow") || id.includes("hack")) return "hack";
    return "heavy";
  }
  return null;
}

function targetId(event: GameEvent): string | null {
  if (event.type === "UnitDamaged" || event.type === "UnitDestroyed") {
    return event.unitId;
  }
  if (event.type === "UnitHealed") {
    return event.unitId;
  }
  if (event.type === "AbilityUsed") {
    return event.targetId;
  }
  return null;
}

/**
 * Lightweight CSS burst layer — capped bursts, auto-clears.
 */
function BattleFxLayer({
  boardWidth,
  boardHeight,
  events,
  unitCells,
}: BattleFxLayerProps) {
  const [bursts, setBursts] = useState<FxBurst[]>([]);

  useEffect(() => {
    if (events.length === 0) {
      return;
    }
    const next: FxBurst[] = [];
    for (const event of events) {
      const kind = kindFromEvent(event);
      const id = targetId(event);
      if (!kind || !id) continue;
      const cell = unitCells.get(id);
      if (!cell) continue;
      next.push({
        id: `${event.type}-${id}-${Math.random().toString(36).slice(2, 6)}`,
        kind,
        x: cell.x,
        y: cell.y,
      });
    }
    if (next.length === 0) {
      return;
    }
    setBursts((prev) => [...prev, ...next].slice(-8));
    const timer = window.setTimeout(() => {
      setBursts((prev) => prev.filter((b) => !next.some((n) => n.id === b.id)));
    }, 480);
    return () => window.clearTimeout(timer);
  }, [events, unitCells]);

  return (
    <div
      className="battle-fx"
      style={
        {
          "--bw": boardWidth,
          "--bh": boardHeight,
        } as CSSProperties
      }
      aria-hidden
    >
      {bursts.map((burst) => (
        <span
          key={burst.id}
          className={`battle-fx__burst is-${burst.kind}`}
          style={{
            gridColumn: burst.x + 1,
            gridRow: burst.y + 1,
          }}
        />
      ))}
    </div>
  );
}

export default BattleFxLayer;

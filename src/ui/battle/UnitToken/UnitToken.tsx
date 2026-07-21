import type { CSSProperties } from "react";

import type { UnitRuntime } from "../../../domain/battle/types";
import { UnitSystem } from "../../../domain/unit/unitSystem";
import { getFactionVisual } from "../../visual/factionTheme";

import "./UnitToken.css";

interface UnitTokenProps {
  unit: UnitRuntime;
  selected?: boolean;
  damaged?: boolean;
  destroying?: boolean;
}

function glyphFor(type: string | undefined, owner: 0 | 1): string {
  if (type === "commander") return owner === 0 ? "♛" : "♚";
  if (type === "legendary") return "◆";
  if (type === "edgerunner") return "★";
  if (type === "ripperdoc") return "✚";
  return owner === 0 ? "▲" : "▼";
}

function UnitToken({
  unit,
  selected = false,
  damaged = false,
  destroying = false,
}: UnitTokenProps) {
  const def = UnitSystem.get(unit.definitionId);
  const faction = getFactionVisual(def?.factionId);
  const isLegendary = def?.type === "legendary";
  const isSmasher = unit.definitionId === "arasaka-adam-smasher";
  const hpRatio = unit.maxHp > 0 ? unit.currentHp / unit.maxHp : 0;
  const statuses = unit.statusEffects
    .map((s) => s.statusId.replace("status-", "").slice(0, 3))
    .slice(0, 2);

  return (
    <span
      className={[
        "unit-token",
        `is-owner-${unit.owner}`,
        faction.styleClass,
        isLegendary ? "is-legendary" : "",
        isSmasher ? "is-smasher" : "",
        selected ? "is-selected" : "",
        damaged ? "is-damaged" : "",
        destroying ? "is-destroying" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--unit-accent": faction.accent,
          "--unit-glow": faction.glow,
        } as CSSProperties
      }
      title={def?.name ?? unit.definitionId}
    >
      <span className="unit-token__silhouette" aria-hidden>
        {glyphFor(def?.type, unit.owner)}
      </span>
      <span className="unit-token__hpbar" aria-hidden>
        <span style={{ width: `${Math.max(0, hpRatio) * 100}%` }} />
      </span>
      <span className="unit-token__hp">{unit.currentHp}</span>
      {statuses.length > 0 ? (
        <span className="unit-token__status">
          {statuses.map((s) => (
            <em key={s}>{s}</em>
          ))}
        </span>
      ) : null}
      {isSmasher ? <span className="unit-token__legend">SMASH</span> : null}
    </span>
  );
}

export default UnitToken;

import type { CSSProperties } from "react";

import type { UnitRuntime } from "../../../domain/battle/types";
import { UnitSystem } from "../../../domain/unit/unitSystem";
import { getFactionVisual } from "../../visual/factionTheme";
import UnitIcon, {
  type UnitIconVisualState,
} from "../UnitIcon/UnitIcon";

import "./UnitToken.css";

interface UnitTokenProps {
  unit: UnitRuntime;
  selected?: boolean;
  damaged?: boolean;
  destroying?: boolean;
  /** Board interaction states for the pictogram. */
  iconState?: UnitIconVisualState | UnitIconVisualState[];
  enemyTarget?: boolean;
  healed?: boolean;
  overclock?: boolean;
  disabled?: boolean;
}

function UnitToken({
  unit,
  selected = false,
  damaged = false,
  destroying = false,
  iconState,
  enemyTarget = false,
  healed = false,
  overclock = false,
  disabled = false,
}: UnitTokenProps) {
  const def = UnitSystem.get(unit.definitionId);
  const faction = getFactionVisual(def?.factionId);
  const isLegendary = def?.isLegendary ?? def?.type === "legendary";
  const hpRatio = unit.maxHp > 0 ? unit.currentHp / unit.maxHp : 0;
  const statuses = unit.statusEffects
    .map((s) => s.statusId.replace("status-", "").slice(0, 3))
    .slice(0, 2);

  const states: UnitIconVisualState[] = [];
  if (Array.isArray(iconState)) {
    states.push(...iconState);
  } else if (iconState) {
    states.push(iconState);
  }
  if (enemyTarget) states.push("enemyTarget");
  if (damaged) states.push("damaged");
  if (healed) states.push("healed");
  if (overclock) states.push("overclock");
  if (disabled) states.push("disabled");
  if (isLegendary) states.push("legendary");

  return (
    <span
      className={[
        "unit-token",
        `is-owner-${unit.owner}`,
        faction.styleClass,
        isLegendary ? "is-legendary" : "",
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
          color: faction.accent,
        } as CSSProperties
      }
      title={def?.name ?? unit.definitionId}
    >
      {def ? (
        <UnitIcon
          unitId={def.id}
          unit={def}
          faction={def.factionId}
          size={42}
          selected={selected}
          state={states}
          overclock={overclock}
          legendary={isLegendary}
          className="unit-token__icon"
        />
      ) : (
        <span className="unit-token__silhouette" aria-hidden>
          ?
        </span>
      )}
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
    </span>
  );
}

export default UnitToken;

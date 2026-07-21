import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { UNIT_PLACEHOLDER_IMAGE } from "../../../data/assets/unitArt";
import { resolveUnitVisual } from "../../../data/visual";
import type { UnitDefinition } from "../../../domain/armyBuilder/types";

import "./UnitIcon.css";

export type UnitIconVisualState =
  | "normal"
  | "hover"
  | "selected"
  | "availableMove"
  | "enemyTarget"
  | "damaged"
  | "disabled"
  | "overclock"
  | "healed"
  | "legendary";

export interface UnitIconProps {
  unitId: string;
  unit?: UnitDefinition;
  faction?: string;
  size?: number;
  state?: UnitIconVisualState | UnitIconVisualState[];
  selected?: boolean;
  hover?: boolean;
  hovered?: boolean;
  overclock?: boolean;
  legendary?: boolean;
  color?: string;
  className?: string;
}

function normalizeStates(
  state: UnitIconProps["state"],
  flags: {
    selected?: boolean;
    hover?: boolean;
    overclock?: boolean;
    legendary?: boolean;
  },
): UnitIconVisualState[] {
  const list = new Set<UnitIconVisualState>();
  if (Array.isArray(state)) {
    state.forEach((s) => list.add(s));
  } else if (state) {
    list.add(state);
  }
  if (flags.selected) list.add("selected");
  if (flags.hover) list.add("hover");
  if (flags.overclock) list.add("overclock");
  if (flags.legendary) list.add("legendary");
  if (list.size === 0) list.add("normal");
  return [...list];
}

/**
 * Board pictogram — loads unique SVG file per unitId.
 * Uses <img> so icons always paint (no CSS-filter / currentColor issues).
 */
function UnitIcon({
  unitId,
  unit,
  faction,
  size = 44,
  state = "normal",
  selected,
  hover,
  hovered,
  overclock,
  legendary,
  className = "",
}: UnitIconProps) {
  const visual = resolveUnitVisual({
    unitId,
    factionId: faction ?? unit?.factionId ?? "",
  });
  const primary =
    unit?.imagePath?.endsWith(".svg") ? unit.imagePath : visual.boardIcon;
  const [src, setSrc] = useState(primary);

  useEffect(() => {
    setSrc(primary);
  }, [primary, unitId]);

  const isLegendary =
    legendary ?? unit?.isLegendary ?? unit?.type === "legendary";
  const states = normalizeStates(state, {
    selected,
    hover: hover ?? hovered,
    overclock,
    legendary: isLegendary,
  });

  return (
    <span
      className={["unit-icon", ...states.map((s) => `is-${s}`), className]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          width: size,
          height: size,
          "--unit-icon-size": `${size}px`,
        } as CSSProperties
      }
      data-unit-id={unitId}
      data-faction={faction ?? unit?.factionId}
    >
      <img
        className="unit-icon__img"
        src={src}
        width={size}
        height={size}
        alt=""
        draggable={false}
        onError={() => {
          setSrc((current) =>
            current === UNIT_PLACEHOLDER_IMAGE
              ? current
              : UNIT_PLACEHOLDER_IMAGE,
          );
        }}
      />
    </span>
  );
}

export default UnitIcon;

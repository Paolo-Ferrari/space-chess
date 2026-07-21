import { useEffect, useState } from "react";

import { UNIT_PLACEHOLDER_IMAGE } from "../../../../data/assets/unitArt";
import type { UnitDefinition } from "../../../../domain/armyBuilder/types";

import "./UnitPortrait.css";

interface UnitPortraitProps {
  unit: Pick<UnitDefinition, "id" | "name" | "imagePath" | "rarity">;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Renders unit PNG from game database `imagePath`.
 * On load error → shared placeholder (swap files, not code).
 */
function UnitPortrait({
  unit,
  size = "md",
  className = "",
}: UnitPortraitProps) {
  const [src, setSrc] = useState(unit.imagePath);

  useEffect(() => {
    setSrc(unit.imagePath);
  }, [unit.id, unit.imagePath]);

  return (
    <span
      className={`unit-portrait unit-portrait--${size} unit-portrait--${unit.rarity} ${className}`.trim()}
      data-unit-id={unit.id}
    >
      <img
        src={src}
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

export default UnitPortrait;

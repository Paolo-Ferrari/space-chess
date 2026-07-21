import type { UnitDefinition } from "../../../domain/armyBuilder/types";
import { UNIT_TYPE_LABELS } from "../../../domain/armyBuilder/types";
import UnitTypeBadge from "../UnitTypeBadge/UnitTypeBadge";

import "./DraggableUnitCard.css";

export const DND_CATALOG = "oc/catalog-unit";
export const DND_PLACEMENT = "oc/placement";

interface DraggableUnitCardProps {
  unit: UnitDefinition;
  disabled?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  /** Compact board token mode. */
  compact?: boolean;
  /** When set, drag carries placement id instead of catalog id. */
  placementId?: string;
}

function DraggableUnitCard({
  unit,
  disabled = false,
  selected = false,
  onSelect,
  compact = false,
  placementId,
}: DraggableUnitCardProps) {
  const initials = unit.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <button
      type="button"
      className={[
        "drag-unit",
        compact ? "drag-unit--compact" : "",
        selected ? "is-selected" : "",
        disabled ? "is-disabled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      draggable={!disabled}
      disabled={disabled}
      onClick={onSelect}
      onDragStart={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        if (placementId) {
          event.dataTransfer.setData(DND_PLACEMENT, placementId);
        } else {
          event.dataTransfer.setData(DND_CATALOG, unit.id);
        }
        event.dataTransfer.effectAllowed = "move";
      }}
    >
      <span className="drag-unit__portrait" aria-hidden>
        {initials}
      </span>
      {!compact ? (
        <span className="drag-unit__body">
          <strong>{unit.name}</strong>
          <span className="drag-unit__meta">
            <UnitTypeBadge type={unit.type} />
            <em>{UNIT_TYPE_LABELS[unit.type]}</em>
            <em>{unit.cost} EN</em>
          </span>
          <span className="drag-unit__stats">
            HP {unit.stats.hp} · ATK {unit.stats.attack} · DEF{" "}
            {unit.stats.defense} · MOV {unit.stats.movement} · RNG{" "}
            {unit.stats.range}
          </span>
        </span>
      ) : (
        <span className="drag-unit__compact-name">{unit.name}</span>
      )}
    </button>
  );
}

export default DraggableUnitCard;

import { useRef } from "react";

import type { Hero } from "../../../domain/hero/hero.types";
import type { UnitDefinition } from "../../../domain/unit/unit.types";
import { writeArmyDragPayload } from "../../armies/armyDrag";
import { setSlotSizedDragImage } from "../../armies/armyDragPreview";
import NeonPortrait from "../../shared/NeonPortrait/NeonPortrait";
import UnitStatBadge from "../UnitStatBadge/UnitStatBadge";

import "./UnitCard.css";

interface UnitCardProps {
  unit: UnitDefinition;
  hero: Hero | null;
  onOpen?: (unitId: string) => void;
  /** Optional double-click add (drag is the main way). */
  onAdd?: (unitId: string) => void;
  addDisabled?: boolean;
  /** When true, card can be dragged into army slots. */
  draggableToArmy?: boolean;
  /** Read-only preview (hover tooltip) — no click/drag. */
  preview?: boolean;
  /** Override health shown on the card (match damage). */
  healthOverride?: number;
}

function UnitCard({
  unit,
  onOpen,
  onAdd,
  addDisabled = false,
  draggableToArmy = false,
  preview = false,
  healthOverride,
}: UnitCardProps) {
  const draggedRef = useRef(false);
  const shownHealth =
    typeof healthOverride === "number" ? healthOverride : unit.health;

  return (
    <article
      className={`unit-card${draggableToArmy && !preview ? " is-draggable" : ""}${addDisabled ? " is-disabled" : ""}${preview ? " is-preview" : ""}`}
      draggable={draggableToArmy && !preview}
      onDragStart={(event) => {
        if (!draggableToArmy || preview) {
          return;
        }
        draggedRef.current = true;
        writeArmyDragPayload(event.dataTransfer, {
          source: "pool",
          unitId: unit.id,
        });
        event.dataTransfer.setData("text/unit-id", unit.id);
        setSlotSizedDragImage(event.dataTransfer, {
          label: unit.name,
          accent: unit.heroId ? "magenta" : "cyan",
        });
      }}
      onDragEnd={() => {
        window.setTimeout(() => {
          draggedRef.current = false;
        }, 0);
      }}
      onClick={() => {
        if (preview || draggedRef.current || !onOpen) {
          return;
        }
        onOpen(unit.id);
      }}
      onDoubleClick={(event) => {
        if (preview) {
          return;
        }
        event.preventDefault();
        if (onAdd && !addDisabled) {
          onAdd(unit.id);
        }
      }}
    >
      <UnitStatBadge kind="cost" value={unit.cost} />

      <div className="unit-card-media">
        <NeonPortrait
          portraitId={unit.portraitId}
          label={unit.name}
          unitDefinitionId={unit.id}
          size="md"
          accent={unit.heroId ? "magenta" : "cyan"}
        />
      </div>

      <div className="unit-card-body">
        <h3 className="unit-card-name">{unit.name}</h3>
        <p className="unit-card-ability">{unit.abilityDescription}</p>
      </div>

      <UnitStatBadge kind="attack" value={unit.attack} />
      <UnitStatBadge kind="health" value={shownHealth} />

      <p className="unit-card-class">{unit.race}</p>
    </article>
  );
}

export default UnitCard;

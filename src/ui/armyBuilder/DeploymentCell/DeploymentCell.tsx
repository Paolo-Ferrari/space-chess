import type { UnitDefinition } from "../../../domain/armyBuilder/types";

import DraggableUnitCard, {
  DND_CATALOG,
  DND_PLACEMENT,
} from "../DraggableUnitCard/DraggableUnitCard";

import "./DeploymentCell.css";

interface DeploymentCellProps {
  cellId: string;
  x: number;
  y: number;
  deployable: boolean;
  unit?: UnitDefinition;
  placementId?: string;
  selected?: boolean;
  onSelect?: () => void;
  onDropCatalog: (unitId: string) => void;
  onDropPlacement: (placementId: string) => void;
}

function DeploymentCell({
  cellId,
  deployable,
  unit,
  placementId,
  selected = false,
  onSelect,
  onDropCatalog,
  onDropPlacement,
}: DeploymentCellProps) {
  return (
    <div
      className={[
        "deployment-cell",
        deployable ? "is-deployable" : "is-locked",
        unit ? "has-unit" : "",
        selected ? "is-selected" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="gridcell"
      aria-label={unit ? `${cellId}: ${unit.name}` : cellId}
      onDragOver={(event) => {
        if (!deployable) {
          return;
        }
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={(event) => {
        if (!deployable) {
          return;
        }
        event.preventDefault();
        const placement = event.dataTransfer.getData(DND_PLACEMENT);
        if (placement) {
          onDropPlacement(placement);
          return;
        }
        const catalog = event.dataTransfer.getData(DND_CATALOG);
        if (catalog) {
          onDropCatalog(catalog);
        }
      }}
    >
      <span className="deployment-cell__id">{cellId}</span>
      {unit && placementId ? (
        <DraggableUnitCard
          unit={unit}
          placementId={placementId}
          compact
          selected={selected}
          onSelect={onSelect}
        />
      ) : null}
    </div>
  );
}

export default DeploymentCell;

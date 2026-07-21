import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
} from "../../../domain/battle/types";
import {
  cellIdFromPosition,
  findPlacementAt,
  isPlayerDeploymentCell,
  type UnitPlacement,
} from "../../../domain/deployment";
import { UnitSystem } from "../../../domain/unit/unitSystem";

import DeploymentCell from "../DeploymentCell/DeploymentCell";

import "./DeploymentBoard.css";

interface DeploymentBoardProps {
  placements: readonly UnitPlacement[];
  selectedPlacementId?: string | null;
  onSelectPlacement?: (placementId: string | null) => void;
  onDropCatalog: (unitId: string, x: number, y: number) => void;
  onDropPlacement: (placementId: string, x: number, y: number) => void;
}

function DeploymentBoard({
  placements,
  selectedPlacementId = null,
  onSelectPlacement,
  onDropCatalog,
  onDropPlacement,
}: DeploymentBoardProps) {
  const rows: number[] = [];
  for (let y = 0; y < BOARD_HEIGHT; y += 1) {
    rows.push(y);
  }

  return (
    <div className="deployment-board" role="grid" aria-label="Deployment Board">
      <div className="deployment-board__files" aria-hidden>
        <span />
        {"ABCDEFGH".split("").map((file) => (
          <span key={file}>{file}</span>
        ))}
      </div>
      <div className="deployment-board__grid">
        {rows.map((y) => (
          <div key={y} className="deployment-board__rank" role="row">
            <span className="deployment-board__rank-label" aria-hidden>
              {BOARD_HEIGHT - y}
            </span>
            {Array.from({ length: BOARD_WIDTH }, (_, x) => {
              const placement = findPlacementAt(placements, x, y);
              const unit = placement
                ? UnitSystem.get(placement.unitId)
                : undefined;
              const deployable = isPlayerDeploymentCell(x, y);
              return (
                <DeploymentCell
                  key={cellIdFromPosition(x, y)}
                  cellId={cellIdFromPosition(x, y)}
                  x={x}
                  y={y}
                  deployable={deployable}
                  unit={unit}
                  placementId={placement?.placementId}
                  selected={placement?.placementId === selectedPlacementId}
                  onSelect={() =>
                    onSelectPlacement?.(placement?.placementId ?? null)
                  }
                  onDropCatalog={(unitId) => onDropCatalog(unitId, x, y)}
                  onDropPlacement={(placementId) =>
                    onDropPlacement(placementId, x, y)
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="deployment-board__hint">
        Зона размещения: ряды 1–2 (A1–H2). Перетащите фигуру из списка или
        поменяйте клетки местами.
      </p>
    </div>
  );
}

export default DeploymentBoard;

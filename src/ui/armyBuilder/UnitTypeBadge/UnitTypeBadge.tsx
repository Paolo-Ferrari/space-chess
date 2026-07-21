import {
  UNIT_TYPE_LABELS,
  type UnitType,
} from "../../../domain/armyBuilder/types";

import "./UnitTypeBadge.css";

interface UnitTypeBadgeProps {
  type: UnitType;
}

function UnitTypeBadge({ type }: UnitTypeBadgeProps) {
  return <span className={`unit-type-badge unit-type-badge--${type}`}>{UNIT_TYPE_LABELS[type]}</span>;
}

export default UnitTypeBadge;

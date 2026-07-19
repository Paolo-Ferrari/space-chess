import type { Hero } from "../../../domain/hero/hero.types";
import type { UnitDefinition } from "../../../domain/unit/unit.types";
import NeonPortrait from "../../shared/NeonPortrait/NeonPortrait";

import "./UnitDetailModal.css";

interface UnitDetailModalProps {
  unit: UnitDefinition;
  hero: Hero | null;
  onClose: () => void;
  onAdd?: (unitId: string) => void;
  addDisabled?: boolean;
}

function UnitDetailModal({
  unit,
  hero,
  onClose,
  onAdd,
  addDisabled = false,
}: UnitDetailModalProps) {
  return (
    <div
      className="unit-detail-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="unit-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-label={unit.name}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="unit-detail-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <NeonPortrait
          portraitId={unit.portraitId}
          label={unit.name}
          unitDefinitionId={unit.id}
          size="lg"
          accent={unit.heroId ? "magenta" : "cyan"}
        />

        <h2 className="unit-detail-name">{unit.name}</h2>
        <p className="unit-detail-hero">
          {unit.race}
          {hero ? ` · ${hero.name}` : ""}
        </p>
        <p className="unit-detail-role">{unit.roleDescription}</p>

        <div className="unit-detail-stats">
          <div>
            <span>Стоимость</span>
            <strong>{unit.cost}</strong>
          </div>
          <div>
            <span>Атака</span>
            <strong>{unit.attack}</strong>
          </div>
          <div>
            <span>Здоровье</span>
            <strong>{unit.health}</strong>
          </div>
        </div>

        <section className="unit-detail-ability">
          <h3>Способность</h3>
          <p>{unit.abilityDescription}</p>
        </section>

        {onAdd && (
          <button
            type="button"
            className="unit-detail-add"
            disabled={addDisabled}
            onClick={() => onAdd(unit.id)}
          >
            + В армию
          </button>
        )}
      </div>
    </div>
  );
}

export default UnitDetailModal;

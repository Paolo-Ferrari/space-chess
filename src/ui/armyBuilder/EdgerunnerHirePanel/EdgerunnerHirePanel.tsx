import type { ArmyDraft } from "../../../domain/armyBuilder/types";
import {
  ADD_REJECT_MESSAGES,
  canAddUnit,
  type AddUnitRejectReason,
} from "../../../domain/armyBuilder/validation";
import { AbilitySystem } from "../../../domain/ability/abilitySystem";
import { EdgerunnerSystem } from "../../../domain/edgerunner/edgerunnerSystem";
import { armyBuilderCatalogLookup } from "../../../data/catalog/armyBuilder";
import Panel from "../../components/panels/Panel/Panel";
import UnitTypeBadge from "../UnitTypeBadge/UnitTypeBadge";

import "./EdgerunnerHirePanel.css";

interface EdgerunnerHirePanelProps {
  draft: ArmyDraft;
  onHire: (unitId: string) => void;
  onFocus: (unitId: string) => void;
}

function EdgerunnerHirePanel({
  draft,
  onHire,
  onFocus,
}: EdgerunnerHirePanelProps) {
  const hired = EdgerunnerSystem.listHired(
    draft.unitIds,
    armyBuilderCatalogLookup.getUnitById,
  );
  const pool = EdgerunnerSystem.listAvailableForHire();
  const used = EdgerunnerSystem.countInArmy(
    draft.unitIds,
    armyBuilderCatalogLookup.getUnitById,
  );

  return (
    <Panel
      eyebrow="Нейтральный пул"
      title="Независимые операторы"
      className="edgerunner-hire"
    >
      <p className="edgerunner-hire__meta">
        Нанято: <strong>{used}</strong> / {EdgerunnerSystem.maxPerArmy}
        {" · "}
        Доступны любой фракции
      </p>

      <div className="edgerunner-hire__section">
        <h4>В боевой сети</h4>
        {hired.length === 0 ? (
          <p className="edgerunner-hire__hint">
            Операторы не выбраны. Добавьте из пула ниже.
          </p>
        ) : (
          <ul className="edgerunner-hire__hired">
            {hired.map((unit) => {
              const profile = EdgerunnerSystem.getProfileByUnitId(unit.id);
              return (
                <li key={unit.id}>
                  <button type="button" onClick={() => onFocus(unit.id)}>
                    <strong>{unit.name}</strong>
                    <UnitTypeBadge type="edgerunner" />
                    <span>
                      {profile
                        ? EdgerunnerSystem.roleLabel(profile.role)
                        : "—"}
                    </span>
                    <em>{unit.cost} EN</em>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="edgerunner-hire__section">
        <h4>Доступные Independent Operators</h4>
        <ul className="edgerunner-hire__pool">
          {pool.map(({ profile, unit }) => {
            const check = canAddUnit(
              draft,
              unit.id,
              armyBuilderCatalogLookup,
            );
            const abilityNames = unit.abilities
              .map((id) => AbilitySystem.get(id)?.name ?? id)
              .join(", ");
            return (
              <li key={unit.id}>
                <button
                  type="button"
                  className={check.ok ? "" : "is-disabled"}
                  disabled={!check.ok}
                  title={
                    check.ok
                      ? "Нанять"
                      : ADD_REJECT_MESSAGES[
                          (check.reason ?? "unknown_unit") as AddUnitRejectReason
                        ]
                  }
                  onClick={() => {
                    onFocus(unit.id);
                    onHire(unit.id);
                  }}
                >
                  <span className="edgerunner-hire__main">
                    <strong>{unit.name}</strong>
                    <span className="edgerunner-hire__role">
                      {EdgerunnerSystem.roleLabel(profile.role)}
                    </span>
                    <em>{unit.description}</em>
                    <em>Способности: {abilityNames || "—"}</em>
                  </span>
                  <span className="edgerunner-hire__cost">{unit.cost} EN</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Panel>
  );
}

export default EdgerunnerHirePanel;

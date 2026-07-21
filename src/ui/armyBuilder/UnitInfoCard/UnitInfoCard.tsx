import { AbilitySystem } from "../../../domain/ability/abilitySystem";
import type { UnitDefinition } from "../../../domain/armyBuilder/types";
import { BalanceSystem } from "../../../domain/balance/balanceSystem";
import { EdgerunnerSystem } from "../../../domain/edgerunner/edgerunnerSystem";
import { RipperdocSystem } from "../../../domain/ripperdoc/ripperdocSystem";
import Panel from "../../components/panels/Panel/Panel";
import UnitTypeBadge from "../UnitTypeBadge/UnitTypeBadge";

import "./UnitInfoCard.css";

interface UnitInfoCardProps {
  unit: UnitDefinition | null;
}

function UnitInfoCard({ unit }: UnitInfoCardProps) {
  if (!unit) {
    return (
      <Panel eyebrow="Сканер" title="Юнит">
        <p className="unit-info-card__empty">Выберите юнита в списке слева.</p>
      </Panel>
    );
  }

  const ripper = RipperdocSystem.profileForUnit(unit.id);
  const edge = EdgerunnerSystem.getProfileByUnitId(unit.id);
  const role = BalanceSystem.roleFor(unit);
  const suggested = BalanceSystem.suggestCost(unit);

  return (
    <Panel eyebrow="Сканер" title={unit.name}>
      <div className="unit-info-card">
        <UnitTypeBadge type={unit.type} />
        <p className="unit-info-card__role">Роль баланса: {role}</p>
        {ripper ? (
          <p className="unit-info-card__role">
            Ripperdoc · радиус поддержки {ripper.supportRadius}
          </p>
        ) : null}
        {edge ? (
          <p className="unit-info-card__role">
            Independent Operator · {EdgerunnerSystem.roleLabel(edge.role)} ·
            нейтральный найм
          </p>
        ) : null}
        <dl className="unit-info-card__stats">
          <div>
            <dt>Стоимость</dt>
            <dd>
              {unit.cost} EN
              {suggested !== unit.cost ? (
                <em title="Формула Balance Config"> · ~{suggested}</em>
              ) : null}
            </dd>
          </div>
          <div>
            <dt>HP</dt>
            <dd>{unit.stats.hp}</dd>
          </div>
          <div>
            <dt>Attack</dt>
            <dd>{unit.stats.attack}</dd>
          </div>
          <div>
            <dt>Defense</dt>
            <dd>{unit.stats.defense}</dd>
          </div>
          <div>
            <dt>Movement</dt>
            <dd>{unit.stats.movement}</dd>
          </div>
          <div>
            <dt>Range</dt>
            <dd>{unit.stats.range}</dd>
          </div>
          <div>
            <dt>Abilities</dt>
            <dd>
              {unit.abilities.length === 0
                ? "—"
                : unit.abilities
                    .map((id) => AbilitySystem.get(id)?.name ?? id)
                    .join(", ")}
            </dd>
          </div>
        </dl>
        {ripper ? (
          <ul className="unit-info-card__kit">
            {RipperdocSystem.listActionViews(unit.id)
              .filter((action) => action.implemented)
              .map((action) => (
                <li key={action.slot.kind}>
                  {action.kindLabel}: {action.slot.label}
                </li>
              ))}
          </ul>
        ) : null}
        <p className="unit-info-card__desc">{unit.description}</p>
      </div>
    </Panel>
  );
}

export default UnitInfoCard;

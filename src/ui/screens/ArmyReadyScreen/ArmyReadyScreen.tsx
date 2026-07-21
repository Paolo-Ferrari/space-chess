import { BRAND_TERMS } from "../../../brand/brand.config";
import type { Army } from "../../../domain/armyBuilder/types";
import { UNIT_TYPE_LABELS } from "../../../domain/armyBuilder/types";
import { sumArmyCombatCapacity } from "../../../domain/armyBuilder/validation";
import { BalanceSystem } from "../../../domain/balance/balanceSystem";
import { CommanderSystem } from "../../../domain/commander/commanderSystem";
import {
  autoPlaceUnits,
  cellIdFromPosition,
} from "../../../domain/deployment";
import { LegendarySystem } from "../../../domain/legendary/legendarySystem";
import {
  armyBuilderCatalogLookup,
  getFactionById,
  getUnitById,
} from "../../../data/catalog/armyBuilder";
import UnitTypeBadge from "../../armyBuilder/UnitTypeBadge/UnitTypeBadge";
import GameButton from "../../components/buttons/GameButton/GameButton";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import ScreenHeader from "../../components/navigation/ScreenHeader/ScreenHeader";
import Panel from "../../components/panels/Panel/Panel";
import WindowFrame from "../../components/windows/WindowFrame/WindowFrame";

import "./ArmyReadyScreen.css";

interface ArmyReadyScreenProps {
  army: Army;
  onEdit: () => void;
  onMenu: () => void;
  /** Continue into pre-match stub (no real battle). */
  onContinue?: () => void;
}

function ArmyReadyScreen({
  army,
  onEdit,
  onMenu,
  onContinue,
}: ArmyReadyScreenProps) {
  const faction = getFactionById(army.factionId);
  const energy = sumArmyCombatCapacity(army, armyBuilderCatalogLookup);
  const capacity = BalanceSystem.combatCapacity();
  const placements =
    army.placements && army.placements.length > 0
      ? army.placements
      : autoPlaceUnits(army.unitIds);

  return (
    <ScreenLayout>
      <ScreenHeader
        title={BRAND_TERMS.armyReadyRu}
        subtitle="Формация сохранена. На поле боя фигуры встанут на те же клетки."
        onBack={onMenu}
        backLabel="В меню"
      />
      <WindowFrame>
        <div className="army-ready">
          <header className="army-ready__header">
            <div>
              <p className="army-ready__eyebrow">{faction?.tag ?? "—"}</p>
              <h2 className="army-ready__name">{army.name}</h2>
              <p className="army-ready__faction">{faction?.name ?? army.factionId}</p>
            </div>
            <dl className="army-ready__budget">
              <div>
                <dt>Combat Capacity</dt>
                <dd>
                  {energy} / {capacity}
                </dd>
              </div>
              <div>
                <dt>Юнитов</dt>
                <dd>{army.unitIds.length}</dd>
              </div>
            </dl>
          </header>

          <Panel eyebrow="Ростер" title="Состав и клетки">
            <ul className="army-ready__list">
              {placements.map((placement) => {
                const unit = getUnitById(placement.unitId);
                if (!unit) {
                  return (
                    <li
                      key={placement.placementId}
                      className="army-ready__missing"
                    >
                      Неизвестный юнит ({placement.unitId})
                    </li>
                  );
                }
                return (
                  <li key={placement.placementId}>
                    <span className="army-ready__unit">
                      <strong>{unit.name}</strong>
                      <UnitTypeBadge type={unit.type} />
                      <em>{UNIT_TYPE_LABELS[unit.type]}</em>
                      <em>
                        {cellIdFromPosition(placement.x, placement.y)}
                      </em>
                    </span>
                    <span className="army-ready__cost">{unit.cost} EN</span>
                  </li>
                );
              })}
            </ul>
          </Panel>

          {(army.legendaryModuleIds?.length ?? 0) > 0 ? (
            <Panel eyebrow="Legendary" title="Боевые модули">
              <ul className="army-ready__list">
                {army.legendaryModuleIds!.map((id) => {
                  const mod = LegendarySystem.getModule(id);
                  return (
                    <li key={id}>
                      <span className="army-ready__unit">
                        <strong>{mod?.name ?? id}</strong>
                        <em>
                          {mod
                            ? LegendarySystem.categoryLabel(mod.category)
                            : "—"}
                        </em>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          ) : null}

          {(army.commanderImplantIds?.length ?? 0) > 0 ? (
            <Panel eyebrow={BRAND_TERMS.commanderRu} title={BRAND_TERMS.implantsRu}>
              <ul className="army-ready__list">
                {army.commanderImplantIds.map((id) => {
                  const implant = CommanderSystem.getImplant(id);
                  return (
                    <li key={id}>
                      <span className="army-ready__unit">
                        <strong>{implant?.name ?? id}</strong>
                        <em>
                          {implant
                            ? CommanderSystem.typeLabel(implant.type)
                            : "—"}
                        </em>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          ) : null}

          <div className="army-ready__actions">
            {onContinue ? (
              <GameButton onClick={onContinue}>Начать матч</GameButton>
            ) : null}
            <GameButton variant="secondary" onClick={onEdit}>
              Изменить
            </GameButton>
            <GameButton variant="ghost" onClick={onMenu}>
              В меню
            </GameButton>
          </div>
        </div>
      </WindowFrame>
    </ScreenLayout>
  );
}

export default ArmyReadyScreen;

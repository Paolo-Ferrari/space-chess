import { useMemo, useState } from "react";

import GameButton from "../../components/buttons/GameButton/GameButton";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import ScreenHeader from "../../components/navigation/ScreenHeader/ScreenHeader";
import Panel from "../../components/panels/Panel/Panel";
import {
  DEMO_ARMY_BUDGET,
  DEMO_FACTIONS,
  DEMO_UNITS,
} from "../../stubs/demoData";

import "./ArmyCreateScreen.css";

interface ArmyCreateScreenProps {
  onBack: () => void;
  onConfirm: () => void;
}

function ArmyCreateScreen({ onBack, onConfirm }: ArmyCreateScreenProps) {
  const [factionId, setFactionId] = useState<string>(DEMO_FACTIONS[0].id);
  const [selectedIds, setSelectedIds] = useState<string[]>(["u6", "u2", "u1"]);

  const cost = useMemo(
    () =>
      selectedIds.reduce((sum, id) => {
        const unit = DEMO_UNITS.find((item) => item.id === id);
        return sum + (unit?.cost ?? 0);
      }, 0),
    [selectedIds],
  );

  const toggleUnit = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <ScreenLayout wide>
      <ScreenHeader
        title="Создать армию"
        subtitle="Визуальный редактор. Данные тестовые, правил валидации нет."
        onBack={onBack}
      />
      <div className="army-create">
        <Panel eyebrow="Идентичность" title="Фракция">
          <div className="army-create__factions">
            {DEMO_FACTIONS.map((faction) => (
              <button
                key={faction.id}
                type="button"
                className={`army-create__faction ${
                  factionId === faction.id ? "is-active" : ""
                }`}
                onClick={() => setFactionId(faction.id)}
              >
                <span>{faction.tag}</span>
                <strong>{faction.name}</strong>
              </button>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Пул" title="Доступные юниты">
          <ul className="army-create__units">
            {DEMO_UNITS.map((unit) => {
              const active = selectedIds.includes(unit.id);
              return (
                <li key={unit.id}>
                  <button
                    type="button"
                    className={`army-create__unit ${active ? "is-active" : ""}`}
                    onClick={() => toggleUnit(unit.id)}
                  >
                    <span>
                      <strong>{unit.name}</strong>
                      <em>{unit.role}</em>
                    </span>
                    <span className="army-create__cost">{unit.cost}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel
          eyebrow="Сборка"
          title="Выбранная армия"
          footer={
            <>
              <p className="army-create__budget">
                Стоимость: <strong>{cost}</strong> / {DEMO_ARMY_BUDGET}
              </p>
              <GameButton onClick={onConfirm}>Подтвердить</GameButton>
            </>
          }
        >
          {selectedIds.length === 0 ? (
            <p className="army-create__empty">Список пуст — выберите юнитов.</p>
          ) : (
            <ul className="army-create__selected">
              {selectedIds.map((id) => {
                const unit = DEMO_UNITS.find((item) => item.id === id);
                if (!unit) {
                  return null;
                }
                return (
                  <li key={id}>
                    {unit.name}
                    <span>{unit.cost}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </ScreenLayout>
  );
}

export default ArmyCreateScreen;

import { AbilitySystem } from "../../../domain/ability/abilitySystem";
import { ABILITY_KIND_LABELS } from "../../../domain/ability/types";
import type { BattleState, UnitRuntime } from "../../../domain/battle/types";
import GameButton from "../../components/buttons/GameButton/GameButton";
import Panel from "../../components/panels/Panel/Panel";

import "./AbilityPanel.css";

interface AbilityPanelProps {
  state: BattleState;
  unit: UnitRuntime | undefined;
  selectedAbilityId: string | null;
  onSelectAbility: (abilityId: string | null) => void;
}

function AbilityPanel({
  state,
  unit,
  selectedAbilityId,
  onSelectAbility,
}: AbilityPanelProps) {
  const views = AbilitySystem.listForUnit(state, unit);

  return (
    <Panel eyebrow="Netdeck" title="Способности">
      {!unit ? (
        <p className="ability-panel__empty">Выберите юнита.</p>
      ) : views.length === 0 ? (
        <p className="ability-panel__empty">Нет способностей.</p>
      ) : (
        <ul className="ability-panel__list">
          {views.map(({ ability, usable, reason }) => {
            const active = selectedAbilityId === ability.id;
            return (
              <li key={ability.id}>
                <button
                  type="button"
                  className={`ability-panel__item ${active ? "is-active" : ""} ${
                    usable ? "" : "is-disabled"
                  }`}
                  disabled={!usable}
                  title={
                    usable
                      ? ability.description
                      : reason
                        ? AbilitySystem.rejectMessage(reason)
                        : ability.description
                  }
                  onClick={() =>
                    onSelectAbility(active ? null : ability.id)
                  }
                >
                  <span className="ability-panel__name">{ability.name}</span>
                  <span className="ability-panel__meta">
                    {ABILITY_KIND_LABELS[ability.kind]} · R{ability.range}
                  </span>
                  {!usable && reason ? (
                    <span className="ability-panel__reason">
                      {AbilitySystem.rejectMessage(reason)}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {selectedAbilityId ? (
        <div className="ability-panel__hint">
          <p>Выберите цель на поле.</p>
          <GameButton variant="ghost" onClick={() => onSelectAbility(null)}>
            Отмена
          </GameButton>
        </div>
      ) : null}
    </Panel>
  );
}

export default AbilityPanel;

import type { ArmyDraft, UnitStats } from "../../../domain/armyBuilder/types";
import {
  LEGENDARY_MODULE_REJECT_MESSAGES,
  LegendarySystem,
  type LegendaryModuleReject,
} from "../../../domain/legendary";
import { UnitSystem } from "../../../domain/unit/unitSystem";
import GameButton from "../../components/buttons/GameButton/GameButton";
import Panel from "../../components/panels/Panel/Panel";

import "./LegendaryPanel.css";

interface LegendaryPanelProps {
  draft: ArmyDraft;
  legendaryUnitId: string | null;
  onInstall: (moduleId: string) => void;
  onRemove: (moduleId: string) => void;
}

function LegendaryPanel({
  draft,
  legendaryUnitId,
  onInstall,
  onRemove,
}: LegendaryPanelProps) {
  if (!legendaryUnitId || !LegendarySystem.hasCustomizer(legendaryUnitId)) {
    return null;
  }

  const unit = UnitSystem.get(legendaryUnitId);
  const profile = LegendarySystem.getProfileByUnitId(legendaryUnitId);
  if (!unit || !profile) {
    return null;
  }

  const moduleIds = draft.legendaryModuleIds ?? [];
  const base: UnitStats = unit.stats;
  const effective =
    LegendarySystem.getEffectiveStats(legendaryUnitId, moduleIds) ?? base;
  const used = LegendarySystem.slotsUsed(moduleIds);
  const pool = LegendarySystem.listModulesForUnit(legendaryUnitId);

  return (
    <Panel
      eyebrow="Legendary Customizer"
      title={profile.name}
      className="legendary-panel"
    >
      <p className="legendary-panel__desc">{profile.description}</p>
      <p className="legendary-panel__slots">
        Боевые модули: <strong>{used}</strong> / {profile.moduleSlots}
      </p>

      <dl className="legendary-panel__stats">
        {(
          [
            ["HP", base.hp, effective.hp],
            ["ATK", base.attack, effective.attack],
            ["DEF", base.defense, effective.defense],
            ["MOV", base.movement, effective.movement],
            ["RNG", base.range, effective.range],
          ] as const
        ).map(([label, b, e]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>
              {e}
              {e !== b ? (
                <em className={e > b ? "is-up" : "is-down"}>
                  {e > b ? `+${e - b}` : e - b}
                </em>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>

      <h4>Установлено</h4>
      {moduleIds.length === 0 ? (
        <p className="legendary-panel__hint">Модули не установлены.</p>
      ) : (
        <ul className="legendary-panel__list">
          {moduleIds.map((id) => {
            const mod = LegendarySystem.getModule(id);
            if (!mod) return null;
            return (
              <li key={id}>
                <div>
                  <strong>{mod.name}</strong>
                  <span>
                    {LegendarySystem.categoryLabel(mod.category)} ·{" "}
                    {mod.slotCost} сл.
                  </span>
                </div>
                <GameButton variant="ghost" onClick={() => onRemove(id)}>
                  Снять
                </GameButton>
              </li>
            );
          })}
        </ul>
      )}

      <h4>Доступные боевые модули</h4>
      <ul className="legendary-panel__list">
        {pool.map((mod) => {
          const check = LegendarySystem.canInstall(
            legendaryUnitId,
            moduleIds,
            mod.id,
          );
          return (
            <li key={mod.id}>
              <div>
                <strong>{mod.name}</strong>
                <span>
                  {LegendarySystem.categoryLabel(mod.category)} ·{" "}
                  {mod.description}
                </span>
                {!check.ok && check.reason ? (
                  <em>
                    {
                      LEGENDARY_MODULE_REJECT_MESSAGES[
                        check.reason as LegendaryModuleReject
                      ]
                    }
                  </em>
                ) : null}
              </div>
              <GameButton
                variant="secondary"
                disabled={!check.ok}
                onClick={() => onInstall(mod.id)}
              >
                Установить
              </GameButton>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export default LegendaryPanel;

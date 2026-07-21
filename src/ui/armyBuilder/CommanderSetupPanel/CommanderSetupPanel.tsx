import {
  IMPLANT_REJECT_MESSAGES,
  CommanderSystem,
} from "../../../domain/commander/commanderSystem";
import type { ArmyDraft, UnitStats } from "../../../domain/armyBuilder/types";
import { UnitSystem } from "../../../domain/unit/unitSystem";
import Panel from "../../components/panels/Panel/Panel";

import "./CommanderSetupPanel.css";

interface CommanderSetupPanelProps {
  draft: ArmyDraft;
  commanderUnitId: string | null;
  onInstall: (implantId: string) => void;
  onRemove: (implantId: string) => void;
}

function formatMods(mods: {
  hp?: number;
  attack?: number;
  defense?: number;
  movement?: number;
  range?: number;
}): string {
  const parts: string[] = [];
  const push = (label: string, value?: number) => {
    if (value && value !== 0) {
      parts.push(`${label} ${value > 0 ? "+" : ""}${value}`);
    }
  };
  push("HP", mods.hp);
  push("ATK", mods.attack);
  push("DEF", mods.defense);
  push("MOV", mods.movement);
  push("RNG", mods.range);
  return parts.length ? parts.join(" · ") : "—";
}

function StatsRow({ label, base, effective }: { label: string; base: number; effective: number }) {
  const delta = effective - base;
  return (
    <div className="commander-setup__stat">
      <span>{label}</span>
      <strong>
        {effective}
        {delta !== 0 ? (
          <em className={delta > 0 ? "is-up" : "is-down"}>
            {" "}
            ({delta > 0 ? "+" : ""}
            {delta})
          </em>
        ) : null}
      </strong>
    </div>
  );
}

function CommanderSetupPanel({
  draft,
  commanderUnitId,
  onInstall,
  onRemove,
}: CommanderSetupPanelProps) {
  if (!commanderUnitId) {
    return (
      <Panel eyebrow="Нейро-командир" title="Настройка нейро-командира">
        <p className="commander-setup__hint">
          Добавьте нейро-командира в боевую сеть, чтобы установить кибер-модули.
        </p>
      </Panel>
    );
  }

  const unit = UnitSystem.get(commanderUnitId);
  const profile = CommanderSystem.getCommanderByUnitId(commanderUnitId);
  if (!unit || !profile) {
    return null;
  }

  const base: UnitStats = unit.stats;
  const effective =
    CommanderSystem.getEffectiveStats(
      commanderUnitId,
      draft.commanderImplantIds,
    ) ?? base;
  const used = CommanderSystem.slotsUsed(draft.commanderImplantIds);
  const capacity = profile.implantSlots;
  const implants = CommanderSystem.listImplants();

  return (
    <Panel
      eyebrow="Нейро-командир"
      title="Настройка нейро-командира"
      className="commander-setup"
    >
      <div className="commander-setup__identity">
        <div className="commander-setup__portrait" aria-hidden>
          <span>{unit.name.slice(0, 2).toUpperCase()}</span>
        </div>
        <div>
          <h3>{unit.name}</h3>
          <p>{profile.description}</p>
          <p className="commander-setup__slots">
            Слоты кибер-модулей: <strong>{used}</strong> / {capacity}
          </p>
        </div>
      </div>

      <div className="commander-setup__stats" aria-label="Характеристики">
        <StatsRow label="HP" base={base.hp} effective={effective.hp} />
        <StatsRow label="ATK" base={base.attack} effective={effective.attack} />
        <StatsRow
          label="DEF"
          base={base.defense}
          effective={effective.defense}
        />
        <StatsRow
          label="MOV"
          base={base.movement}
          effective={effective.movement}
        />
        <StatsRow label="RNG" base={base.range} effective={effective.range} />
      </div>

      <div className="commander-setup__section">
        <h4>Установлено</h4>
        {draft.commanderImplantIds.length === 0 ? (
          <p className="commander-setup__hint">Кибер-модули не установлены.</p>
        ) : (
          <ul className="commander-setup__installed">
            {draft.commanderImplantIds.map((id) => {
              const implant = CommanderSystem.getImplant(id);
              if (!implant) {
                return null;
              }
              return (
                <li key={id}>
                  <div>
                    <strong>{implant.name}</strong>
                    <span>{CommanderSystem.typeLabel(implant.type)}</span>
                    <em>{formatMods(implant.statMods)}</em>
                  </div>
                  <button type="button" onClick={() => onRemove(id)}>
                    Снять
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="commander-setup__section">
        <h4>Доступные импланты</h4>
        <ul className="commander-setup__pool">
          {implants.map((implant) => {
            const check = CommanderSystem.canInstall(
              commanderUnitId,
              draft.factionId,
              draft.commanderImplantIds,
              implant.id,
            );
            return (
              <li key={implant.id}>
                <button
                  type="button"
                  className={check.ok ? "" : "is-disabled"}
                  disabled={!check.ok}
                  title={
                    check.ok
                      ? "Установить"
                      : IMPLANT_REJECT_MESSAGES[check.reason!]
                  }
                  onClick={() => onInstall(implant.id)}
                >
                  <span className="commander-setup__pool-main">
                    <strong>{implant.name}</strong>
                    <span>{CommanderSystem.typeLabel(implant.type)}</span>
                    <em>{implant.description}</em>
                    <em>{formatMods(implant.statMods)}</em>
                  </span>
                  <span className="commander-setup__cost">
                    {implant.slotCost} сл.
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Panel>
  );
}

export default CommanderSetupPanel;

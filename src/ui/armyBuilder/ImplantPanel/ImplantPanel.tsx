import type { ImplantDefinition } from "../../../domain/commander/types";
import GameButton from "../../components/buttons/GameButton/GameButton";

import "./ImplantPanel.css";

interface ImplantPanelProps {
  installedIds: readonly string[];
  available: readonly ImplantDefinition[];
  canInstall: (implantId: string) => { ok: boolean; reason?: string };
  onInstall: (implantId: string) => void;
  onRemove: (implantId: string) => void;
  typeLabel: (type: ImplantDefinition["type"]) => string;
}

function ImplantPanel({
  installedIds,
  available,
  canInstall,
  onInstall,
  onRemove,
  typeLabel,
}: ImplantPanelProps) {
  const installed = installedIds
    .map((id) => available.find((item) => item.id === id))
    .filter((item): item is ImplantDefinition => Boolean(item));

  return (
    <div className="implant-panel">
      <h4>Установлено</h4>
      {installed.length === 0 ? (
        <p className="implant-panel__hint">Кибер-модули не установлены.</p>
      ) : (
        <ul className="implant-panel__list">
          {installed.map((implant) => (
            <li key={implant.id}>
              <div>
                <strong>{implant.name}</strong>
                <span>
                  {typeLabel(implant.type)} · {implant.slotCost} сл.
                </span>
              </div>
              <GameButton variant="ghost" onClick={() => onRemove(implant.id)}>
                Снять
              </GameButton>
            </li>
          ))}
        </ul>
      )}

      <h4>Доступные кибер-модули</h4>
      <ul className="implant-panel__list">
        {available.map((implant) => {
          const check = canInstall(implant.id);
          return (
            <li key={implant.id}>
              <div>
                <strong>{implant.name}</strong>
                <span>
                  {typeLabel(implant.type)} · {implant.slotCost} сл. ·{" "}
                  {implant.description}
                </span>
                {!check.ok && check.reason ? (
                  <em className="implant-panel__reject">{check.reason}</em>
                ) : null}
              </div>
              <GameButton
                variant="secondary"
                disabled={!check.ok}
                onClick={() => onInstall(implant.id)}
              >
                Установить
              </GameButton>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ImplantPanel;

import Panel from "../../panels/Panel/Panel";

import "./PlayerPanel.css";

interface PlayerPanelProps {
  side: "player" | "enemy";
  name: string;
  factionLabel: string;
  hpLabel: string;
  active?: boolean;
}

function PlayerPanel({
  side,
  name,
  factionLabel,
  hpLabel,
  active = false,
}: PlayerPanelProps) {
  return (
    <Panel
      className={`player-panel player-panel--${side} ${active ? "player-panel--active" : ""}`}
      eyebrow={side === "player" ? "Оператор" : "Противник"}
      title={name}
    >
      <dl className="player-panel__stats">
        <div>
          <dt>Фракция</dt>
          <dd>{factionLabel}</dd>
        </div>
        <div>
          <dt>Жизнеспособность</dt>
          <dd>{hpLabel}</dd>
        </div>
        <div>
          <dt>Статус</dt>
          <dd>{active ? "Ход" : "Ожидание"}</dd>
        </div>
      </dl>
    </Panel>
  );
}

export default PlayerPanel;

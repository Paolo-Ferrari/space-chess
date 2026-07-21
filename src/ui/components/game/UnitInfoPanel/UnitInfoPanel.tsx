import Panel from "../../panels/Panel/Panel";

import "./UnitInfoPanel.css";

interface UnitInfoPanelProps {
  selectedLabel: string | null;
}

function UnitInfoPanel({ selectedLabel }: UnitInfoPanelProps) {
  return (
    <Panel eyebrow="Сканер" title="Юнит">
      {selectedLabel ? (
        <div className="unit-info">
          <p className="unit-info__name">{selectedLabel}</p>
          <ul className="unit-info__list">
            <li>HP — заглушка</li>
            <li>Атака — заглушка</li>
            <li>Способность — заглушка</li>
          </ul>
        </div>
      ) : (
        <p className="unit-info__empty">Выберите клетку на поле.</p>
      )}
    </Panel>
  );
}

export default UnitInfoPanel;

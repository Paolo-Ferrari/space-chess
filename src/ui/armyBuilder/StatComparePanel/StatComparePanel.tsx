import type { UnitDefinition } from "../../../domain/armyBuilder/types";
import { BalanceSystem } from "../../../domain/balance/balanceSystem";
import Panel from "../../components/panels/Panel/Panel";

import "./StatComparePanel.css";

interface StatComparePanelProps {
  unitA: UnitDefinition | null;
  unitB: UnitDefinition | null;
}

function cell(label: string, a: number | string, b: number | string) {
  const aNum = typeof a === "number" ? a : null;
  const bNum = typeof b === "number" ? b : null;
  let tone = "";
  if (aNum != null && bNum != null && aNum !== bNum) {
    tone = aNum > bNum ? "is-better" : "is-worse";
  }
  return (
    <div className="stat-compare__row" key={label}>
      <span>{label}</span>
      <strong className={tone}>{a}</strong>
      <strong className={tone === "is-better" ? "is-worse" : tone === "is-worse" ? "is-better" : ""}>
        {b}
      </strong>
    </div>
  );
}

function StatComparePanel({ unitA, unitB }: StatComparePanelProps) {
  if (!unitA || !unitB) {
    return (
      <Panel eyebrow="Compare" title="Сравнение">
        <p className="stat-compare__hint">
          Выберите двух юнитов (фокус + уже размещённый), чтобы сравнить статы.
        </p>
      </Panel>
    );
  }

  return (
    <Panel eyebrow="Compare" title={`${unitA.name} vs ${unitB.name}`}>
      <div className="stat-compare">
        <div className="stat-compare__head">
          <span>Параметр</span>
          <span>{unitA.name}</span>
          <span>{unitB.name}</span>
        </div>
        {cell("EN", unitA.cost, unitB.cost)}
        {cell("Роль", BalanceSystem.roleFor(unitA), BalanceSystem.roleFor(unitB))}
        {cell("HP", unitA.stats.hp, unitB.stats.hp)}
        {cell("ATK", unitA.stats.attack, unitB.stats.attack)}
        {cell("DEF", unitA.stats.defense, unitB.stats.defense)}
        {cell("MOV", unitA.stats.movement, unitB.stats.movement)}
        {cell("RNG", unitA.stats.range, unitB.stats.range)}
      </div>
    </Panel>
  );
}

export default StatComparePanel;

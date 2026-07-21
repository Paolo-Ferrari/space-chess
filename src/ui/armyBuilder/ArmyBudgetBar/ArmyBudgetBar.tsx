import { BalanceSystem } from "../../../domain/balance/balanceSystem";

import "./ArmyBudgetBar.css";

interface ArmyBudgetBarProps {
  energyUsed: number;
  slotCount: number;
  overLimit: boolean;
  className?: string;
}

function ArmyBudgetBar({
  energyUsed,
  slotCount,
  overLimit,
  className = "",
}: ArmyBudgetBarProps) {
  const capacity = BalanceSystem.combatCapacity();
  const maxSlots = BalanceSystem.maxSlots();
  const warnAt = BalanceSystem.armyWarnThreshold();
  const ratio = Math.min(1, energyUsed / capacity);
  const warn = energyUsed >= warnAt && !overLimit;

  return (
    <div
      className={[
        "army-budget-bar",
        overLimit ? "is-over" : "",
        warn ? "is-warn" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="army-budget-bar__meta">
        <span>
          Combat Capacity{" "}
          <strong>
            {energyUsed} / {capacity}
          </strong>
        </span>
        <span>
          Слоты{" "}
          <strong>
            {slotCount} / {maxSlots}
          </strong>
        </span>
      </div>
      <div
        className="army-budget-bar__track"
        role="meter"
        aria-valuenow={energyUsed}
        aria-valuemin={0}
        aria-valuemax={capacity}
      >
        <span style={{ width: `${ratio * 100}%` }} />
      </div>
      {overLimit ? (
        <p className="army-budget-bar__alert">
          Лимит превышен — уберите юнитов или модули (налог имплантов входит в
          Capacity).
        </p>
      ) : warn ? (
        <p className="army-budget-bar__alert army-budget-bar__alert--warn">
          Бюджет почти исчерпан ({warnAt}+ EN).
        </p>
      ) : null}
    </div>
  );
}

export default ArmyBudgetBar;

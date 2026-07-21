import type { UnitRuntime } from "../../../domain/battle/types";
import { CommanderSystem } from "../../../domain/commander/commanderSystem";
import { getEffectiveUnitStats } from "../../../domain/battle/unitCombatStats";
import { UnitSystem } from "../../../domain/unit/unitSystem";
import { BRAND_TERMS } from "../../../brand/brand.config";
import Panel from "../../components/panels/Panel/Panel";
import { getFactionVisual } from "../../visual/factionTheme";

import "./CommanderCombatCard.css";

interface CommanderCombatCardProps {
  unit: UnitRuntime | null;
}

function CommanderCombatCard({ unit }: CommanderCombatCardProps) {
  if (!unit) {
    return null;
  }
  const def = UnitSystem.get(unit.definitionId);
  if (!def || !CommanderSystem.isCommanderUnit(def)) {
    return null;
  }

  const faction = getFactionVisual(def.factionId);
  const stats = getEffectiveUnitStats(unit, def);
  const implants = unit.implantIds
    .map((id) => CommanderSystem.getImplant(id))
    .filter(Boolean);
  const hpRatio = unit.maxHp > 0 ? unit.currentHp / unit.maxHp : 0;

  return (
    <Panel
      eyebrow={BRAND_TERMS.commanderRu}
      title={def.name}
      className={`commander-combat ${faction.styleClass}`}
    >
      <div className="commander-combat__row">
        <div
          className="commander-combat__portrait"
          style={{ borderColor: faction.accent, color: faction.accent }}
          aria-hidden
        >
          ♛
        </div>
        <div className="commander-combat__vitals">
          <div className="commander-combat__bar">
            <span style={{ width: `${hpRatio * 100}%` }} />
          </div>
          <p>
            HP {unit.currentHp}/{unit.maxHp} · ATK {stats.attack} · DEF{" "}
            {stats.defense}
          </p>
        </div>
      </div>
      <div className="commander-combat__modules">
        <h4>{BRAND_TERMS.implantsRu}</h4>
        {implants.length === 0 ? (
          <p className="commander-combat__empty">Модули не установлены</p>
        ) : (
          <ul>
            {implants.map((implant) => (
              <li key={implant!.id}>
                <strong>{implant!.name}</strong>
                <span>{CommanderSystem.typeLabel(implant!.type)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}

export default CommanderCombatCard;

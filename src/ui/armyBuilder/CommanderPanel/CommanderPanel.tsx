import type { ArmyDraft } from "../../../domain/armyBuilder/types";
import type { UnitStats } from "../../../domain/armyBuilder/types";
import {
  CommanderSystem,
  IMPLANT_REJECT_MESSAGES,
  type ImplantInstallReject,
} from "../../../domain/commander/commanderSystem";
import { UnitSystem } from "../../../domain/unit/unitSystem";
import UnitPortrait from "../../components/game/UnitPortrait/UnitPortrait";
import Panel from "../../components/panels/Panel/Panel";

import ImplantPanel from "../ImplantPanel/ImplantPanel";

import "./CommanderPanel.css";

interface CommanderPanelProps {
  draft: ArmyDraft;
  commanderUnitId: string | null;
  onInstall: (implantId: string) => void;
  onRemove: (implantId: string) => void;
}

function StatsRow({
  label,
  base,
  effective,
}: {
  label: string;
  base: number;
  effective: number;
}) {
  const delta = effective - base;
  return (
    <div className="commander-panel__stat">
      <span>{label}</span>
      <strong>
        {effective}
        {delta !== 0 ? (
          <em className={delta > 0 ? "is-up" : "is-down"}>
            {delta > 0 ? `+${delta}` : delta}
          </em>
        ) : null}
      </strong>
    </div>
  );
}

function CommanderPanel({
  draft,
  commanderUnitId,
  onInstall,
  onRemove,
}: CommanderPanelProps) {
  if (!commanderUnitId) {
    return (
      <Panel eyebrow="Neural Commander" title="Нейро-командир">
        <p className="commander-panel__hint">
          Перетащите командира на клетку зоны размещения (A1–H2), чтобы открыть
          карточку и слоты кибер-модулей.
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

  return (
    <Panel
      eyebrow="Neural Commander"
      title={unit.name}
      className="commander-panel"
    >
      <div className="commander-panel__identity">
        <UnitPortrait
          unit={unit}
          size="lg"
          className="commander-panel__portrait"
        />
        <div>
          <p>{profile.description}</p>
          <p className="commander-panel__slots">
            Слоты: <strong>{used}</strong> / {capacity}
          </p>
        </div>
      </div>

      <div className="commander-panel__stats" aria-label="Характеристики">
        <StatsRow label="HP" base={base.hp} effective={effective.hp} />
        <StatsRow label="ATK" base={base.attack} effective={effective.attack} />
        <StatsRow label="DEF" base={base.defense} effective={effective.defense} />
        <StatsRow
          label="MOV"
          base={base.movement}
          effective={effective.movement}
        />
        <StatsRow label="RNG" base={base.range} effective={effective.range} />
      </div>

      <ImplantPanel
        installedIds={draft.commanderImplantIds}
        available={CommanderSystem.listImplants()}
        canInstall={(implantId) => {
          const check = CommanderSystem.canInstall(
            commanderUnitId,
            draft.factionId,
            draft.commanderImplantIds,
            implantId,
          );
          return {
            ok: check.ok,
            reason: check.reason
              ? IMPLANT_REJECT_MESSAGES[check.reason as ImplantInstallReject]
              : undefined,
          };
        }}
        onInstall={onInstall}
        onRemove={onRemove}
        typeLabel={(type) => CommanderSystem.typeLabel(type)}
      />
    </Panel>
  );
}

export default CommanderPanel;

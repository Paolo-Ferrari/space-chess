import { RipperdocSystem } from "../../../domain/ripperdoc/ripperdocSystem";
import type { UnitRuntime } from "../../../domain/battle/types";
import Panel from "../../components/panels/Panel/Panel";

import "./RipperdocInfo.css";

interface RipperdocInfoProps {
  unit: UnitRuntime | undefined;
}

function RipperdocInfo({ unit }: RipperdocInfoProps) {
  if (!unit || !RipperdocSystem.isRipperdocRuntime(unit)) {
    return null;
  }

  const profile = RipperdocSystem.profileForUnit(unit.definitionId);
  if (!profile) {
    return null;
  }

  const actions = RipperdocSystem.listActionViews(unit.definitionId);

  return (
    <Panel eyebrow="Support class" title="Ripperdoc" className="ripperdoc-info">
      <p className="ripperdoc-info__name">{profile.name}</p>
      <p className="ripperdoc-info__desc">{profile.description}</p>
      <dl className="ripperdoc-info__meta">
        <div>
          <dt>Радиус поддержки</dt>
          <dd>{profile.supportRadius}</dd>
        </div>
        <div>
          <dt>Стиль</dt>
          <dd>{profile.styleTags.join(" · ")}</dd>
        </div>
      </dl>
      <ul className="ripperdoc-info__actions">
        {actions.map((action) => (
          <li
            key={action.slot.kind}
            className={action.implemented ? "is-live" : "is-reserved"}
          >
            <strong>{action.slot.label}</strong>
            <span>{action.kindLabel}</span>
            <em>
              {action.implemented
                ? action.abilityName
                : "Позже (другая фракция / расширение)"}
            </em>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export default RipperdocInfo;

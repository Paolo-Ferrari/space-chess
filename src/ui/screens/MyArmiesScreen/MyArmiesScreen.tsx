import { useMemo, useState } from "react";

import { BRAND_TERMS } from "../../../brand/brand.config";
import type { AuthSession } from "../../../domain/account/types";
import type { Army } from "../../../domain/armyBuilder/types";
import { getFactionById } from "../../../data/catalog/armyBuilder";
import {
  deleteSavedArmy,
  listSavedArmies,
} from "../../../services/armyBuilder/armyBuilderRepository";
import UnitTypeBadge from "../../armyBuilder/UnitTypeBadge/UnitTypeBadge";
import GameButton from "../../components/buttons/GameButton/GameButton";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import ScreenHeader from "../../components/navigation/ScreenHeader/ScreenHeader";
import Panel from "../../components/panels/Panel/Panel";
import { UnitSystem } from "../../../domain/unit/unitSystem";

import "./MyArmiesScreen.css";

interface MyArmiesScreenProps {
  session: AuthSession;
  onBack: () => void;
  onCreate: () => void;
  onEdit: (army: Army) => void;
  onPlay: (army: Army) => void;
}

function MyArmiesScreen({
  session,
  onBack,
  onCreate,
  onEdit,
  onPlay,
}: MyArmiesScreenProps) {
  const [tick, setTick] = useState(0);
  const armies = useMemo(() => {
    void tick;
    return listSavedArmies(session.userId);
  }, [session.userId, tick]);

  return (
    <ScreenLayout wide>
      <ScreenHeader
        title={`Мои ${BRAND_TERMS.armiesRu.toLowerCase()}`}
        subtitle={`Loadout: фракция, ${BRAND_TERMS.commanderRu.toLowerCase()}, ${BRAND_TERMS.implantsRu.toLowerCase()}, юниты, ${BRAND_TERMS.edgerunnersRu.toLowerCase()}.`}
        onBack={onBack}
        actions={
          <GameButton onClick={onCreate}>Новая боевая сеть</GameButton>
        }
      />

      {armies.length === 0 ? (
        <Panel eyebrow="Пусто" title="Нет сохранённых боевых сетей">
          <p className="my-armies__empty">
            Создайте первую боевую сеть — она привяжется к вашему аккаунту.
          </p>
          <GameButton onClick={onCreate}>{BRAND_TERMS.armyCreateRu}</GameButton>
        </Panel>
      ) : (
        <ul className="my-armies__list">
          {armies.map((army) => {
            const faction = getFactionById(army.factionId);
            const implants = army.commanderImplantIds?.length ?? 0;
            return (
              <li key={army.id} className="my-armies__card">
                <div>
                  <p className="my-armies__tag">{faction?.tag ?? "—"}</p>
                  <h3>{army.name}</h3>
                  <p className="my-armies__meta">
                    {faction?.name ?? army.factionId} · {army.unitIds.length} юн.
                    · {BRAND_TERMS.implantsRu.toLowerCase()} {implants}
                  </p>
                  <div className="my-armies__roster">
                    {army.unitIds.slice(0, 6).map((id, index) => {
                      const unit = UnitSystem.get(id);
                      if (!unit) {
                        return null;
                      }
                      return (
                        <span key={`${id}-${index}`}>
                          <UnitTypeBadge type={unit.type} />
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="my-armies__actions">
                  <GameButton onClick={() => onPlay(army)}>В бой</GameButton>
                  <GameButton variant="secondary" onClick={() => onEdit(army)}>
                    Изменить
                  </GameButton>
                  <GameButton
                    variant="ghost"
                    onClick={() => {
                      if (
                        window.confirm(`Удалить боевую сеть «${army.name}»?`)
                      ) {
                        deleteSavedArmy(army.id, session.userId);
                        setTick((n) => n + 1);
                      }
                    }}
                  >
                    Удалить
                  </GameButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </ScreenLayout>
  );
}

export default MyArmiesScreen;

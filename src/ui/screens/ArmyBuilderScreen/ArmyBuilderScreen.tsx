import { useMemo, useState } from "react";

import {
  type Army,
  type ArmyDraft,
  type UnitDefinition,
} from "../../../domain/armyBuilder/types";
import { BalanceSystem } from "../../../domain/balance/balanceSystem";
import {
  armyToDraft,
  createEmptyDraft,
  findDraftCommanderId,
  findDraftLegendaryId,
  installImplantOnDraft,
  installLegendaryModuleOnDraft,
  removeImplantFromDraft,
  removeLegendaryModuleFromDraft,
  setDraftFaction,
  setDraftName,
} from "../../../domain/armyBuilder/draft";
import {
  ADD_REJECT_MESSAGES,
  VALIDATION_MESSAGES,
  canAddUnit,
  validateArmy,
  type AddUnitRejectReason,
} from "../../../domain/armyBuilder/validation";
import {
  CommanderSystem,
  IMPLANT_REJECT_MESSAGES,
  type ImplantInstallReject,
} from "../../../domain/commander/commanderSystem";
import {
  movePlacement,
  placeCatalogUnit,
  removePlacement,
  syncDraftPlacements,
} from "../../../domain/deployment";
import { EdgerunnerSystem } from "../../../domain/edgerunner/edgerunnerSystem";
import { FactionSystem } from "../../../domain/faction/factionSystem";
import {
  LEGENDARY_MODULE_REJECT_MESSAGES,
  LegendarySystem,
  type LegendaryModuleReject,
} from "../../../domain/legendary";
import { UnitSystem } from "../../../domain/unit/unitSystem";
import { armyBuilderCatalogLookup } from "../../../data/catalog/armyBuilder";
import { saveArmyDraft } from "../../../services/armyBuilder/armyBuilderRepository";
import ArmyBudgetBar from "../../armyBuilder/ArmyBudgetBar/ArmyBudgetBar";
import CommanderPanel from "../../armyBuilder/CommanderPanel/CommanderPanel";
import DeploymentBoard from "../../armyBuilder/DeploymentBoard/DeploymentBoard";
import DraggableUnitCard from "../../armyBuilder/DraggableUnitCard/DraggableUnitCard";
import LegendaryPanel from "../../armyBuilder/LegendaryPanel/LegendaryPanel";
import StatComparePanel from "../../armyBuilder/StatComparePanel/StatComparePanel";
import UnitInfoCard from "../../armyBuilder/UnitInfoCard/UnitInfoCard";
import GameButton from "../../components/buttons/GameButton/GameButton";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import ScreenHeader from "../../components/navigation/ScreenHeader/ScreenHeader";
import Panel from "../../components/panels/Panel/Panel";

import "./ArmyBuilderScreen.css";

interface ArmyBuilderScreenProps {
  onBack: () => void;
  onSaved: (army: Army) => void;
  /** Save + jump straight into Protocol Match. */
  onStartBattle?: (army: Army) => void;
  initialArmy?: Army | null;
  ownerId?: string | null;
}

function ArmyBuilderScreen({
  onBack,
  onSaved,
  onStartBattle,
  initialArmy = null,
  ownerId = null,
}: ArmyBuilderScreenProps) {
  const factions = FactionSystem.list();
  const defaultFactionId = factions[0]?.id ?? "";

  const [draft, setDraft] = useState<ArmyDraft>(() =>
    syncDraftPlacements(
      initialArmy
        ? armyToDraft(initialArmy)
        : createEmptyDraft(defaultFactionId),
    ),
  );
  const [focusedUnitId, setFocusedUnitId] = useState<string | null>(null);
  const [compareUnitId, setCompareUnitId] = useState<string | null>(null);
  const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(
    null,
  );
  const [feedback, setFeedback] = useState("");

  const availableUnits = useMemo(() => {
    const factionUnits = FactionSystem.listUnits(draft.factionId);
    const edges = EdgerunnerSystem.listAvailableForHire().map((row) => row.unit);
    return [...factionUnits, ...edges];
  }, [draft.factionId]);

  const validation = useMemo(
    () => validateArmy(draft, armyBuilderCatalogLookup),
    [draft],
  );

  const focusedUnit: UnitDefinition | null = focusedUnitId
    ? (UnitSystem.get(focusedUnitId) ?? null)
    : null;

  const compareUnit: UnitDefinition | null = compareUnitId
    ? (UnitSystem.get(compareUnitId) ?? null)
    : null;

  const factionBalance = BalanceSystem.factionProfile(draft.factionId);

  const commanderUnitId = useMemo(
    () => findDraftCommanderId(draft, armyBuilderCatalogLookup),
    [draft],
  );

  const legendaryUnitId = useMemo(
    () => findDraftLegendaryId(draft, armyBuilderCatalogLookup),
    [draft],
  );

  const selectFaction = (factionId: string) => {
    setDraft(setDraftFaction(draft, factionId));
    setFocusedUnitId(null);
    setSelectedPlacementId(null);
    setFeedback("");
  };

  const isUniqueAlreadyPlaced = (unit: UnitDefinition) => {
    if (
      unit.type !== "commander" &&
      unit.type !== "ripperdoc" &&
      unit.type !== "legendary" &&
      unit.type !== "edgerunner"
    ) {
      return false;
    }
    if (unit.type === "edgerunner") {
      return draft.unitIds.includes(unit.id);
    }
    return draft.unitIds.some((id) => {
      const existing = UnitSystem.get(id);
      return existing?.type === unit.type;
    });
  };

  const handleDropCatalog = (unitId: string, x: number, y: number) => {
    setFocusedUnitId(unitId);
    const result = placeCatalogUnit(
      draft,
      unitId,
      x,
      y,
      armyBuilderCatalogLookup,
    );
    if (!result.ok) {
      const reason = result.reason ?? "cannot_add";
      if (reason in ADD_REJECT_MESSAGES) {
        setFeedback(
          ADD_REJECT_MESSAGES[reason as AddUnitRejectReason] ??
            "Нельзя разместить",
        );
      } else if (reason === "out_of_zone") {
        setFeedback("Только зона A1–H2");
      } else if (reason === "occupied") {
        setFeedback("Клетка занята — перетащите на пустую или смените местами");
      } else {
        setFeedback("Нельзя разместить");
      }
      return;
    }
    setDraft(result.draft);
    setFeedback("");
  };

  const handleDropPlacement = (placementId: string, x: number, y: number) => {
    const result = movePlacement(draft, placementId, x, y);
    if (!result.ok) {
      setFeedback(
        result.reason === "out_of_zone"
          ? "Только зона A1–H2"
          : "Нельзя переместить",
      );
      return;
    }
    setDraft(result.draft);
    setSelectedPlacementId(placementId);
    setFeedback("");
  };

  const handleRemoveSelected = () => {
    if (!selectedPlacementId) {
      return;
    }
    const placement = draft.placements.find(
      (p) => p.placementId === selectedPlacementId,
    );
    const def = placement ? UnitSystem.get(placement.unitId) : undefined;
    setDraft(
      removePlacement(
        draft,
        selectedPlacementId,
        Boolean(def && CommanderSystem.isCommanderUnit(def)),
        Boolean(placement && LegendarySystem.hasCustomizer(placement.unitId)),
      ),
    );
    setSelectedPlacementId(null);
    setFeedback("Фигура снята с поля");
  };

  const handleInstallImplant = (implantId: string) => {
    const result = installImplantOnDraft(
      draft,
      implantId,
      armyBuilderCatalogLookup,
    );
    if (!result.ok) {
      const reason = (result.reason ?? "unknown_implant") as ImplantInstallReject;
      setFeedback(IMPLANT_REJECT_MESSAGES[reason] ?? "Нельзя установить");
      return;
    }
    setDraft(result.draft);
    setFeedback("Кибер-модуль установлен");
  };

  const handleInstallLegendary = (moduleId: string) => {
    const result = installLegendaryModuleOnDraft(
      draft,
      moduleId,
      armyBuilderCatalogLookup,
    );
    if (!result.ok) {
      const reason = (result.reason ??
        "unknown_module") as LegendaryModuleReject;
      setFeedback(
        LEGENDARY_MODULE_REJECT_MESSAGES[reason] ?? "Нельзя установить",
      );
      return;
    }
    setDraft(result.draft);
    setFeedback("Боевой модуль установлен");
  };

  const persist = (): Army | null => {
    const result = saveArmyDraft(draft, { ownerId });
    if (!result.ok) {
      setFeedback(
        result.codes
          .map(
            (code) =>
              VALIDATION_MESSAGES[code as keyof typeof VALIDATION_MESSAGES] ??
              code,
          )
          .join(" · "),
      );
      return null;
    }
    setDraft(armyToDraft(result.army));
    setFeedback("Боевая сеть сохранена");
    return result.army;
  };

  const handleSave = () => {
    const army = persist();
    if (army) {
      onSaved(army);
    }
  };

  const handleStart = () => {
    const army = persist();
    if (!army) {
      return;
    }
    if (onStartBattle) {
      onStartBattle(army);
    } else {
      onSaved(army);
    }
  };

  return (
    <ScreenLayout wide className="army-deployment screen-enter atmosphere-city">
      <ScreenHeader
        title="Army Deployment"
        subtitle="Соберите боевую формацию: перетащите фигуры на клетки A1–H2."
        onBack={onBack}
      />

      <div className="army-deployment__meta">
        <label className="army-deployment__name">
          Название
          <input
            value={draft.name}
            onChange={(event) =>
              setDraft(setDraftName(draft, event.target.value))
            }
            maxLength={24}
          />
        </label>
        <div className="army-deployment__factions">
          {factions.map((faction) => (
            <button
              key={faction.id}
              type="button"
              className={`army-deployment__faction ${
                draft.factionId === faction.id ? "is-active" : ""
              }`}
              onClick={() => selectFaction(faction.id)}
            >
              <span>{faction.tag}</span>
              <strong>{faction.name}</strong>
            </button>
          ))}
        </div>
        {factionBalance ? (
          <div className="army-deployment__faction-balance">
            <p>
              <strong>+</strong> {factionBalance.strengths.join(" · ")}
            </p>
            <p>
              <strong>−</strong> {factionBalance.weaknesses.join(" · ")}
            </p>
          </div>
        ) : null}
      </div>

      <div className="army-deployment__layout">
        <Panel eyebrow="Available Units" title="Доступные юниты">
          <ul className="army-deployment__pool">
            {availableUnits.map((unit) => {
              const uniqueTaken = isUniqueAlreadyPlaced(unit);
              const addCheck = canAddUnit(
                draft,
                unit.id,
                armyBuilderCatalogLookup,
              );
              const disabled = uniqueTaken || !addCheck.ok;
              return (
                <li key={unit.id}>
                  <DraggableUnitCard
                    unit={unit}
                    disabled={disabled}
                    selected={focusedUnitId === unit.id}
                    onSelect={() => {
                      if (focusedUnitId && focusedUnitId !== unit.id) {
                        setCompareUnitId(focusedUnitId);
                      }
                      setFocusedUnitId(unit.id);
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel eyebrow="Deployment Board" title="Расстановка">
          <DeploymentBoard
            placements={draft.placements}
            selectedPlacementId={selectedPlacementId}
            onSelectPlacement={(id) => {
              setSelectedPlacementId(id);
              if (id) {
                const p = draft.placements.find((row) => row.placementId === id);
                if (p) {
                  setFocusedUnitId(p.unitId);
                }
              }
            }}
            onDropCatalog={handleDropCatalog}
            onDropPlacement={handleDropPlacement}
          />
          {selectedPlacementId ? (
            <GameButton
              variant="ghost"
              className="army-deployment__remove"
              onClick={handleRemoveSelected}
            >
              Снять с клетки
            </GameButton>
          ) : null}
        </Panel>

        <div className="army-deployment__side">
          <UnitInfoCard unit={focusedUnit} />
          <StatComparePanel unitA={focusedUnit} unitB={compareUnit} />
          <CommanderPanel
            draft={draft}
            commanderUnitId={commanderUnitId}
            onInstall={handleInstallImplant}
            onRemove={(implantId) =>
              setDraft(removeImplantFromDraft(draft, implantId))
            }
          />
          {commanderUnitId ? (
            <Panel eyebrow="Loadout Styles" title="Стили Командира">
              <ul className="army-deployment__styles">
                {BalanceSystem.commanderStyles().map((style) => (
                  <li key={style.id}>
                    <strong>{style.name}</strong>
                    <span>{style.description}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
          <LegendaryPanel
            draft={draft}
            legendaryUnitId={legendaryUnitId}
            onInstall={handleInstallLegendary}
            onRemove={(moduleId) =>
              setDraft(removeLegendaryModuleFromDraft(draft, moduleId))
            }
          />
        </div>
      </div>

      <footer className="army-deployment__footer">
        <ArmyBudgetBar
          energyUsed={validation.energyUsed}
          slotCount={validation.slotCount}
          overLimit={validation.codes.includes("energy_exceeded")}
        />
        <div className="army-deployment__budget">
          {!validation.ok ? (
            <span className="army-deployment__issues">
              {validation.codes.map((code) => (
                <em key={code}>{VALIDATION_MESSAGES[code]}</em>
              ))}
            </span>
          ) : (
            <span className="army-deployment__ok">SYSTEM READY</span>
          )}
        </div>
        <div className="army-deployment__actions">
          <GameButton variant="secondary" onClick={handleSave}>
            Сохранить
          </GameButton>
          <GameButton onClick={handleStart} disabled={!validation.ok}>
            Начать матч
          </GameButton>
        </div>
        {feedback ? (
          <p className="army-deployment__feedback">{feedback}</p>
        ) : null}
      </footer>
    </ScreenLayout>
  );
}

export default ArmyBuilderScreen;

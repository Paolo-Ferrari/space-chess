import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent as ReactDragEvent,
} from "react";

import type { Army } from "../../../domain/army/army.types";
import { ensureHeroKingInSlots } from "../../../domain/army/armyKing";
import {
  ARMY_BUDGET,
  ARMY_MAX_UNITS,
  ARMY_NAME_MAX_LENGTH,
  armyToSlots,
  slotsToUnitIds,
  sumArmyUnitCost,
} from "../../../domain/army/army.types";
import { isKingUnit } from "../../../domain/unit/unit.types";
import {
  createArmy,
  deleteArmy,
  listArmies,
  saveArmy,
} from "../../../services/army/armyRepository";
import {
  getCollection,
  getHeroById,
  getKingUnitIdsForHero,
  getUnitById,
  getUnitsForArmyHero,
} from "../../../services/collection/collectionService";
import UnitCard from "../../collection/UnitCard/UnitCard";
import UnitDetailModal from "../../collection/UnitDetailModal/UnitDetailModal";
import AppShell from "../../shell/AppShell/AppShell";
import NeonPortrait from "../../shared/NeonPortrait/NeonPortrait";
import { readArmyDragPayload, writeArmyDragPayload } from "../armyDrag";
import { setSlotSizedDragImage } from "../armyDragPreview";

import "./ArmiesScreen.css";

interface ArmiesScreenProps {
  onBack: () => void;
}

function ArmiesScreen({ onBack }: ArmiesScreenProps) {
  const collection = useMemo(() => getCollection(), []);
  const defaultHeroId = collection.heroes[0]?.id ?? "";

  const [armies, setArmies] = useState<Army[]>(() => listArmies());
  const [selectedArmyId, setSelectedArmyId] = useState<string | null>(
    () => listArmies()[0]?.id ?? null,
  );
  const [draftName, setDraftName] = useState("");
  const [draftHeroId, setDraftHeroId] = useState(defaultHeroId);
  const [draftSlots, setDraftSlots] = useState<Array<string | null>>(
    () => Array.from({ length: ARMY_MAX_UNITS }, () => null),
  );
  const [dirty, setDirty] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [openedUnitId, setOpenedUnitId] = useState<string | null>(null);
  const [hoverSlotIndex, setHoverSlotIndex] = useState<number | null>(null);
  const [heroPickerOpen, setHeroPickerOpen] = useState(false);
  const [poolQuery, setPoolQuery] = useState("");
  const heroPickerRef = useRef<HTMLDivElement | null>(null);

  const selectedArmy = armies.find((army) => army.id === selectedArmyId) ?? null;

  useEffect(() => {
    if (!heroPickerOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const root = heroPickerRef.current;
      if (root && !root.contains(event.target as Node)) {
        setHeroPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [heroPickerOpen]);

  const loadArmyIntoEditor = useCallback((army: Army | null) => {
    if (!army) {
      setDraftName("");
      setDraftHeroId(defaultHeroId);
      setDraftSlots(Array.from({ length: ARMY_MAX_UNITS }, () => null));
      setDirty(false);
      return;
    }

    setDraftName(army.name);
    setDraftHeroId(army.heroId);
    setDraftSlots(
      ensureHeroKingInSlots(
        armyToSlots(army),
        army.heroId,
        getUnitById,
        getKingUnitIdsForHero,
      ),
    );
    setDirty(false);
  }, [defaultHeroId]);

  const refreshArmies = useCallback((preferId?: string | null) => {
    const next = listArmies();
    setArmies(next);
    const nextSelected =
      (preferId && next.find((army) => army.id === preferId)?.id) ||
      next[0]?.id ||
      null;
    setSelectedArmyId(nextSelected);
    loadArmyIntoEditor(
      nextSelected
        ? next.find((army) => army.id === nextSelected) ?? null
        : null,
    );
  }, [loadArmyIntoEditor]);

  const selectArmy = (armyId: string) => {
    if (dirty && !window.confirm("Есть несохранённые изменения. Продолжить?")) {
      return;
    }

    const army = armies.find((item) => item.id === armyId) ?? null;
    setSelectedArmyId(armyId);
    loadArmyIntoEditor(army);
    setHeroPickerOpen(false);
    setPoolQuery("");
    setStatusMessage("");
  };

  const handleCreate = () => {
    if (!defaultHeroId) {
      setStatusMessage("Нет героев в каталоге.");
      return;
    }

    if (dirty && !window.confirm("Есть несохранённые изменения. Создать новую армию?")) {
      return;
    }

    const heroIdForCreate = draftHeroId || defaultHeroId;
    const nextIndex =
      listArmies().filter((army) => army.heroId === heroIdForCreate).length + 1;
    const army = createArmy({
      name: `Армия ${nextIndex}`.slice(0, ARMY_NAME_MAX_LENGTH),
      heroId: heroIdForCreate,
    });
    refreshArmies(army.id);
    setStatusMessage("Армия создана.");
  };

  const handleDelete = () => {
    if (!selectedArmy) {
      return;
    }

    const displayName = draftName.trim() || selectedArmy.name;
    if (!window.confirm(`Удалить армию «${displayName}»?`)) {
      return;
    }

    deleteArmy(selectedArmy.id);
    refreshArmies(null);
    setStatusMessage("Армия удалена.");
  };

  const handleSave = () => {
    if (!selectedArmy) {
      return;
    }

    const unitIds = slotsToUnitIds(draftSlots);
    const cost = sumArmyUnitCost(
      unitIds,
      (unitId) => getUnitById(unitId)?.cost,
    );
    if (cost > ARMY_BUDGET) {
      setStatusMessage(
        `Бюджет превышен: ${cost} / ${ARMY_BUDGET}. Уберите фигуры.`,
      );
      return;
    }

    const nextName = draftName.trim().slice(0, ARMY_NAME_MAX_LENGTH) || "Армия";
    const saved = saveArmy({
      ...selectedArmy,
      name: nextName,
      heroId: draftHeroId,
      unitDefinitionIds: unitIds,
    });
    refreshArmies(saved.id);
    setStatusMessage("Сохранено.");
  };

  const filledCount = draftSlots.filter(Boolean).length;
  const isFull = filledCount >= ARMY_MAX_UNITS;

  const spentCost = useMemo(
    () =>
      sumArmyUnitCost(slotsToUnitIds(draftSlots), (unitId) =>
        getUnitById(unitId)?.cost,
      ),
    [draftSlots],
  );
  const remainingBudget = ARMY_BUDGET - spentCost;

  const swapSlots = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) {
      return;
    }

    setDraftSlots((current) => {
      const next = [...current];
      const temp = next[fromIndex];
      next[fromIndex] = next[toIndex];
      next[toIndex] = temp;
      return next;
    });
    setDirty(true);
    setStatusMessage("");
  }, []);

  const placeUnitAtSlot = useCallback(
    (unitId: string, slotIndex: number): boolean => {
      if (!selectedArmy) {
        return false;
      }

      if (slotIndex < 0 || slotIndex >= ARMY_MAX_UNITS) {
        return false;
      }

      const unit = getUnitById(unitId);
      if (!unit) {
        return false;
      }

      if (unit.heroId && unit.heroId !== draftHeroId) {
        setStatusMessage("Эта фигура принадлежит другому герою.");
        return false;
      }

      const occupantId = draftSlots[slotIndex];
      const occupant = occupantId ? getUnitById(occupantId) : null;

      if (occupant && isKingUnit(occupant) && occupant.id !== unitId) {
        setStatusMessage(
          "Командир обязателен на поле — его нельзя заменить.",
        );
        return false;
      }

      if (isKingUnit(unit)) {
        const existingIndex = draftSlots.findIndex(
          (slot) => slot === unitId,
        );

        if (existingIndex === slotIndex) {
          return true;
        }

        if (existingIndex !== -1) {
          swapSlots(existingIndex, slotIndex);
          return true;
        }
      }

      const spent = sumArmyUnitCost(
        slotsToUnitIds(draftSlots),
        (id) => getUnitById(id)?.cost,
      );
      const occupantCost = occupantId
        ? (getUnitById(occupantId)?.cost ?? 0)
        : 0;
      const available = ARMY_BUDGET - spent + occupantCost;

      if (unit.cost > available) {
        setStatusMessage(
          `Недостаточно монет: нужно ${unit.cost}, доступно ${available}.`,
        );
        return false;
      }

      setDraftSlots((current) => {
        const next = [...current];
        next[slotIndex] = unitId;
        return next;
      });
      setDirty(true);
      setStatusMessage("");
      return true;
    },
    [draftHeroId, draftSlots, selectedArmy, swapSlots],
  );

  const addUnit = (unitId: string) => {
    if (!selectedArmy) {
      return;
    }

    if (draftSlots.includes(unitId)) {
      setStatusMessage("Эта фигура уже в составе.");
      return;
    }

    if (isFull) {
      return;
    }

    const emptyIndex = draftSlots.findIndex((slot) => slot === null);
    if (emptyIndex === -1) {
      return;
    }

    placeUnitAtSlot(unitId, emptyIndex);
  };

  const removeSlot = (index: number) => {
    const unitId = draftSlots[index];
    if (unitId) {
      const unit = getUnitById(unitId);
      if (unit && isKingUnit(unit)) {
        setStatusMessage(
          "Командир обязателен на поле — его нельзя убрать.",
        );
        return;
      }
    }

    setDraftSlots((current) => {
      const next = [...current];
      next[index] = null;
      return next;
    });
    setDirty(true);
  };

  const handleSlotDragOver = (
    event: ReactDragEvent<HTMLDivElement>,
    slotIndex: number,
  ) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (hoverSlotIndex !== slotIndex) {
      setHoverSlotIndex(slotIndex);
    }
  };

  const handleSlotDrop = (
    event: ReactDragEvent<HTMLDivElement>,
    slotIndex: number,
  ) => {
    event.preventDefault();
    setHoverSlotIndex(null);

    const payload = readArmyDragPayload(event.dataTransfer);
    if (!payload) {
      return;
    }

    if (payload.source === "pool") {
      placeUnitAtSlot(payload.unitId, slotIndex);
      return;
    }

    if (payload.source === "slot") {
      swapSlots(payload.fromIndex, slotIndex);
    }
  };

  const selectHero = (nextHeroId: string) => {
    setDraftHeroId(nextHeroId);
    setHeroPickerOpen(false);

    if (!selectedArmy) {
      return;
    }

    setDraftSlots((current) => {
      const cleared = current.map((unitId) => {
        if (!unitId) {
          return null;
        }
        const unit = getUnitById(unitId);
        if (!unit) {
          return null;
        }
        if (unit.heroId && unit.heroId !== nextHeroId) {
          return null;
        }
        if (isKingUnit(unit)) {
          return null;
        }
        return unitId;
      });

      return ensureHeroKingInSlots(
        cleared,
        nextHeroId,
        getUnitById,
        getKingUnitIdsForHero,
      );
    });
    setDirty(true);
  };

  const heroPoolUnits = useMemo(
    () => (draftHeroId ? getUnitsForArmyHero(draftHeroId) : []),
    [draftHeroId],
  );

  const mandatoryUnits = useMemo(
    () => heroPoolUnits.filter((unit) => isKingUnit(unit)),
    [heroPoolUnits],
  );

  const availableUnits = useMemo(() => {
    const units = heroPoolUnits.filter((unit) => !isKingUnit(unit));
    const query = poolQuery.trim().toLowerCase();
    if (!query) {
      return units;
    }
    return units.filter((unit) => {
      const heroName = unit.heroId
        ? (getHeroById(unit.heroId)?.name ?? "")
        : "общий";
      return (
        unit.name.toLowerCase().includes(query) ||
        unit.race.toLowerCase().includes(query) ||
        heroName.toLowerCase().includes(query) ||
        unit.roleDescription.toLowerCase().includes(query) ||
        unit.abilityDescription.toLowerCase().includes(query)
      );
    });
  }, [heroPoolUnits, poolQuery]);

  const draftHero = draftHeroId ? getHeroById(draftHeroId) ?? null : null;
  const openedUnit = openedUnitId ? getUnitById(openedUnitId) ?? null : null;

  const activeHeroId = draftHeroId || defaultHeroId;

  const heroArmies = useMemo(() => {
    if (!activeHeroId) {
      return [];
    }

    return armies
      .filter((army) => {
        const effectiveHeroId =
          army.id === selectedArmyId && draftHeroId
            ? draftHeroId
            : army.heroId;
        return effectiveHeroId === activeHeroId;
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [activeHeroId, armies, draftHeroId, selectedArmyId]);

  const listHero = activeHeroId ? getHeroById(activeHeroId) ?? null : null;

  const heroPickerOptions = useMemo(
    () => collection.heroes.filter((hero) => hero.id !== activeHeroId),
    [activeHeroId, collection.heroes],
  );

  return (
    <AppShell title="Армии" onBack={onBack}>
      <div className="armies-screen">
        <aside className="armies-list-panel">
          <div className="armies-list-square">
            <div className="armies-list-square-top">
              <span className="armies-list-square-label">Сборки:</span>
              <span className="armies-list-square-count">
                {heroArmies.length}
              </span>
            </div>
            <button
              type="button"
              className="armies-btn armies-btn-create"
              onClick={handleCreate}
            >
              Создать армию
            </button>

            {!listHero ? (
              <p className="armies-empty">Нет героев в каталоге.</p>
            ) : heroArmies.length === 0 ? (
              <p className="armies-hero-group-empty">Нет сборок</p>
            ) : (
              <ul className="armies-list">
                {heroArmies.map((army) => {
                  const isSelected = army.id === selectedArmyId;
                  const displayName = isSelected
                    ? draftName || "Армия"
                    : army.name;
                  const unitCount = isSelected
                    ? filledCount
                    : army.unitDefinitionIds.length;

                  return (
                    <li key={army.id}>
                      <button
                        type="button"
                        className={`armies-list-item${isSelected ? " is-active" : ""}`}
                        onClick={() => selectArmy(army.id)}
                      >
                        <span className="armies-list-meta">
                          <strong>{displayName}</strong>
                          <span>
                            {unitCount}/{ARMY_MAX_UNITS}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        <section className="armies-editor-panel">
          {!selectedArmy ? (
            <div className="armies-editor-empty">
              <p className="armies-empty">
                Выберите армию слева или создайте новую.
              </p>
              <div className="armies-hero-picker" ref={heroPickerRef}>
                <button
                  type="button"
                  className={`armies-hero-trigger${heroPickerOpen ? " is-open" : ""}`}
                  onClick={() => setHeroPickerOpen((open) => !open)}
                  aria-expanded={heroPickerOpen}
                  aria-haspopup="listbox"
                  aria-label="Выбор героя"
                >
                  {listHero ? (
                    <>
                      <NeonPortrait
                        portraitId={listHero.portraitId}
                        label={listHero.name}
                        size="md"
                      />
                        <span className="armies-hero-trigger-text">
                          <strong>{listHero.name}</strong>
                          <span>{listHero.description}</span>
                        </span>
                    </>
                  ) : (
                    <span className="armies-hero-trigger-text">
                      <strong>Выберите героя</strong>
                    </span>
                  )}
                  <span className="armies-hero-trigger-chevron" aria-hidden>
                    {heroPickerOpen ? "▴" : "▾"}
                  </span>
                </button>
                {heroPickerOpen && (
                  <div className="armies-hero-menu" role="listbox">
                    {heroPickerOptions.length === 0 ? (
                      <p className="armies-hero-menu-empty">Нет других героев</p>
                    ) : (
                      heroPickerOptions.map((hero) => (
                        <button
                          key={hero.id}
                          type="button"
                          role="option"
                          aria-selected={false}
                          className="armies-hero-option"
                          onClick={() => selectHero(hero.id)}
                        >
                          <NeonPortrait
                            portraitId={hero.portraitId}
                            label={hero.name}
                            size="md"
                          />
                          <span className="armies-hero-option-text">
                            <strong>{hero.name}</strong>
                            <span>{hero.traitDescription}</span>
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="armies-editor-identity">
                <div className="armies-name-block">
                  <div className="armies-name-actions">
                    <button
                      type="button"
                      className="armies-btn"
                      onClick={handleSave}
                    >
                      Сохранить
                    </button>
                    <button
                      type="button"
                      className="armies-btn armies-btn-danger"
                      onClick={handleDelete}
                    >
                      Удалить
                    </button>
                  </div>
                  <label className="armies-field armies-field-name">
                    <span>Название</span>
                    <input
                      value={draftName}
                      maxLength={ARMY_NAME_MAX_LENGTH}
                      onChange={(event) => {
                        setDraftName(
                          event.target.value.slice(0, ARMY_NAME_MAX_LENGTH),
                        );
                        setDirty(true);
                      }}
                    />
                  </label>
                  {dirty && (
                    <span className="armies-dirty">● не сохранено</span>
                  )}
                </div>

                <div className="armies-hero-picker" ref={heroPickerRef}>
                  <button
                    type="button"
                    className={`armies-hero-trigger${heroPickerOpen ? " is-open" : ""}`}
                    onClick={() => setHeroPickerOpen((open) => !open)}
                    aria-expanded={heroPickerOpen}
                    aria-haspopup="listbox"
                    aria-label="Выбор героя"
                  >
                    {draftHero ? (
                      <>
                        <NeonPortrait
                          portraitId={draftHero.portraitId}
                          label={draftHero.name}
                          size="md"
                        />
                        <span className="armies-hero-trigger-text">
                          <strong>{draftHero.name}</strong>
                          <span>{draftHero.description}</span>
                        </span>
                      </>
                    ) : (
                      <span className="armies-hero-trigger-text">
                        <strong>Выберите героя</strong>
                      </span>
                    )}
                    <span className="armies-hero-trigger-chevron" aria-hidden>
                      {heroPickerOpen ? "▴" : "▾"}
                    </span>
                  </button>

                  {heroPickerOpen && (
                    <div className="armies-hero-menu" role="listbox">
                      {heroPickerOptions.length === 0 ? (
                        <p className="armies-hero-menu-empty">Нет других героев</p>
                      ) : (
                        heroPickerOptions.map((hero) => (
                          <button
                            key={hero.id}
                            type="button"
                            role="option"
                            aria-selected={false}
                            className="armies-hero-option"
                            onClick={() => selectHero(hero.id)}
                          >
                            <NeonPortrait
                              portraitId={hero.portraitId}
                              label={hero.name}
                              size="md"
                            />
                            <span className="armies-hero-option-text">
                              <strong>{hero.name}</strong>
                              <span>{hero.traitDescription}</span>
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              <h3 className="armies-section-title">
                Состав ({filledCount}/{ARMY_MAX_UNITS})
              </h3>
              <div
                className="armies-slots"
                onDragLeave={(event) => {
                  if (
                    !event.currentTarget.contains(
                      event.relatedTarget as Node | null,
                    )
                  ) {
                    setHoverSlotIndex(null);
                  }
                }}
              >
                {draftSlots.map((unitId, index) => {
                  const unit = unitId ? getUnitById(unitId) : null;
                  const king = Boolean(unit && isKingUnit(unit));
                  return (
                    <div
                      key={`slot-${index}`}
                      className={[
                        "armies-slot",
                        unit ? "is-filled" : "",
                        king ? "is-king" : "",
                        hoverSlotIndex === index ? "is-drop-target" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onDragOver={(event) =>
                        handleSlotDragOver(event, index)
                      }
                      onDrop={(event) => handleSlotDrop(event, index)}
                    >
                      {unit ? (
                        <>
                          <div
                            className="armies-slot-drag"
                            draggable
                            onDragStart={(event) => {
                              writeArmyDragPayload(event.dataTransfer, {
                                source: "slot",
                                unitId: unit.id,
                                fromIndex: index,
                              });
                              setSlotSizedDragImage(event.dataTransfer, {
                                label: unit.name,
                                accent: unit.heroId ? "magenta" : "cyan",
                              });
                            }}
                            onDragEnd={() => setHoverSlotIndex(null)}
                          >
                            <NeonPortrait
                              portraitId={unit.portraitId}
                              label={unit.name}
                              unitDefinitionId={unit.id}
                              size="sm"
                              accent={unit.heroId ? "magenta" : "cyan"}
                            />
                            <span className="armies-slot-name">
                              {unit.name}
                            </span>
                          </div>
                          {!king && (
                            <button
                              type="button"
                              className="armies-slot-remove"
                              aria-label="Убрать фигуру"
                              onClick={() => removeSlot(index)}
                            >
                              ×
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="armies-slot-empty">{index + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="armies-figures-split">
                <section className="armies-figures-pane armies-figures-mandatory">
                  <div className="armies-pool-header">
                    <h3 className="armies-section-title armies-section-title-inline">
                      Обязательные
                    </h3>
                  </div>
                  <div className="armies-pool-scroll">
                    {mandatoryUnits.length === 0 ? (
                      <p className="armies-empty">Нет героя.</p>
                    ) : (
                      <div className="armies-pool armies-pool-mandatory">
                        {mandatoryUnits.map((unit) => {
                          const alreadyInArmy = draftSlots.includes(unit.id);
                          return (
                            <UnitCard
                              key={unit.id}
                              unit={unit}
                              hero={
                                unit.heroId
                                  ? getHeroById(unit.heroId) ?? null
                                  : null
                              }
                              onOpen={setOpenedUnitId}
                              onAdd={addUnit}
                              addDisabled={
                                alreadyInArmy ||
                                isFull ||
                                unit.cost > remainingBudget
                              }
                              draggableToArmy={!alreadyInArmy}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </section>

                <section className="armies-figures-pane armies-figures-available">
                  <div className="armies-pool-header">
                    <h3 className="armies-section-title armies-section-title-inline">
                      Доступные фигуры
                    </h3>
                    <label className="armies-pool-search">
                      <span className="armies-pool-search-label">Поиск</span>
                      <input
                        type="search"
                        value={poolQuery}
                        placeholder="Имя…"
                        onChange={(event) => setPoolQuery(event.target.value)}
                      />
                    </label>
                  </div>
                  <div className="armies-pool-scroll">
                    {availableUnits.length === 0 ? (
                      <p className="armies-empty">Ничего не найдено.</p>
                    ) : (
                      <div className="armies-pool">
                        {availableUnits.map((unit) => (
                          <UnitCard
                            key={unit.id}
                            unit={unit}
                            hero={
                              unit.heroId
                                ? getHeroById(unit.heroId) ?? null
                                : null
                            }
                            onOpen={setOpenedUnitId}
                            onAdd={addUnit}
                            addDisabled={
                              isFull || unit.cost > remainingBudget
                            }
                            draggableToArmy
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <div
                className={`armies-budget${remainingBudget < 0 ? " is-over" : ""}`}
                aria-live="polite"
              >
                <span className="armies-budget-label">Бюджет армии</span>
                <span className="armies-budget-value">
                  {remainingBudget} / {ARMY_BUDGET}
                </span>
                <span className="armies-budget-spent">
                  потрачено {spentCost}
                </span>
              </div>
            </>
          )}

          {statusMessage && (
            <p className="armies-status" role="status">
              {statusMessage}
            </p>
          )}
        </section>
      </div>

      {openedUnit && (
        <UnitDetailModal
          unit={openedUnit}
          hero={
            openedUnit.heroId
              ? getHeroById(openedUnit.heroId) ?? null
              : null
          }
          onClose={() => setOpenedUnitId(null)}
          onAdd={selectedArmy ? addUnit : undefined}
          addDisabled={
            draftSlots.includes(openedUnit.id) ||
            isFull ||
            openedUnit.cost > remainingBudget
          }
        />
      )}
    </AppShell>
  );
}

export default ArmiesScreen;

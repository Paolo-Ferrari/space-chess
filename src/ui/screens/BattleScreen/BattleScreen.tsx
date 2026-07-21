import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { BRAND_TERMS } from "../../../brand/brand.config";
import {
  AiManager,
  AI_DIFFICULTY_LABELS,
  createAiConfig,
  type AiDifficulty,
} from "../../../domain/ai";
import type { Army } from "../../../domain/armyBuilder/types";
import {
  BattleManager,
  cellsInChebyshevRadius,
  isMoveHighlight,
  type Position,
} from "../../../domain/battle";
import { getEffectiveUnitStats } from "../../../domain/battle/unitCombatStats";
import { CommanderSystem } from "../../../domain/commander/commanderSystem";
import type { GameEvent } from "../../../domain/events/gameEvents";
import { RipperdocSystem } from "../../../domain/ripperdoc/ripperdocSystem";
import { UnitSystem } from "../../../domain/unit/unitSystem";
import { AudioManager } from "../../../services/audio";
import UnitTypeBadge from "../../armyBuilder/UnitTypeBadge/UnitTypeBadge";
import AbilityPanel from "../../battle/AbilityPanel/AbilityPanel";
import BattleFxLayer from "../../battle/BattleFxLayer/BattleFxLayer";
import CommanderCombatCard from "../../battle/CommanderCombatCard/CommanderCombatCard";
import RipperdocInfo from "../../battle/RipperdocInfo/RipperdocInfo";
import UnitToken from "../../battle/UnitToken/UnitToken";
import GameButton from "../../components/buttons/GameButton/GameButton";
import EventLog from "../../components/game/EventLog/EventLog";
import PlayerPanel from "../../components/game/PlayerPanel/PlayerPanel";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import Modal from "../../components/modals/Modal/Modal";
import ScreenHeader from "../../components/navigation/ScreenHeader/ScreenHeader";
import Panel from "../../components/panels/Panel/Panel";

import "./BattleScreen.css";

export type BattleOpponentMode = "hotseat" | "ai";

export interface MatchEndSummary {
  turnCount: number;
  durationMs: number;
}

interface BattleScreenProps {
  playerArmy: Army;
  opponentMode?: BattleOpponentMode;
  aiDifficulty?: AiDifficulty;
  onMenu: () => void;
  onVictory: (summary: MatchEndSummary) => void;
  onDefeat: (summary: MatchEndSummary) => void;
}

function playEventsAudio(events: readonly GameEvent[]): void {
  for (const event of events) {
    if (event.type === "UnitMoved") AudioManager.play("move");
    if (event.type === "UnitAttacked") AudioManager.play("attack");
    if (event.type === "UnitDamaged") AudioManager.play("hit");
    if (event.type === "UnitDestroyed") AudioManager.play("destroy");
    if (event.type === "UnitHealed") AudioManager.play("ability_heal");
    if (event.type === "AbilityUsed") {
      const id = event.abilityId.toLowerCase();
      if (id.includes("heal")) AudioManager.play("ability_heal");
      else if (id.includes("armor")) AudioManager.play("ability_shield");
      else if (id.includes("slow")) AudioManager.play("ability_hack");
      else AudioManager.play("ability_heavy");
    }
    if (event.type === "BattleEnded") {
      AudioManager.play(event.winner === 0 ? "victory" : "defeat");
    }
  }
}

function BattleScreen({
  playerArmy,
  opponentMode = "hotseat",
  aiDifficulty = "normal",
  onMenu,
  onVictory,
  onDefeat,
}: BattleScreenProps) {
  const [manager] = useState(() => new BattleManager(playerArmy));
  const [ai] = useState(() =>
    opponentMode === "ai"
      ? new AiManager(createAiConfig(aiDifficulty))
      : null,
  );
  const [startedAt] = useState(() => Date.now());
  const [tick, setTick] = useState(0);
  const [aiThinking, setAiThinking] = useState(false);
  /** UI state — not part of BattleState */
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedAbilityId, setSelectedAbilityId] = useState<string | null>(
    null,
  );
  const [feedback, setFeedback] = useState("");
  const [resultOpen, setResultOpen] = useState(false);
  const [fxEvents, setFxEvents] = useState<GameEvent[]>([]);
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());
  const [destroyIds, setDestroyIds] = useState<Set<string>>(new Set());
  const cellMemory = useRef(new Map<string, { x: number; y: number }>());

  const state = manager.getState();
  void tick;

  useEffect(() => {
    for (const unit of state.units) {
      cellMemory.current.set(unit.instanceId, { ...unit.position });
    }
  }, [state.units]);

  const refresh = (result: ReturnType<BattleManager["endTurn"]>) => {
    setTick((value) => value + 1);
    if (result.selectUnitId !== undefined) {
      setSelectedUnitId(result.selectUnitId);
    }
    if (!result.ok) {
      setFeedback(result.reason ?? "Действие недоступно");
      AudioManager.play("ui_select");
      return;
    }
    setFeedback("");
    setSelectedAbilityId(null);
    if (result.events?.length) {
      setFxEvents(result.events);
      playEventsAudio(result.events);
      const hits = new Set<string>();
      const dead = new Set<string>();
      for (const event of result.events) {
        if (event.type === "UnitDamaged") hits.add(event.unitId);
        if (event.type === "UnitDestroyed") dead.add(event.unitId);
      }
      if (hits.size) {
        setFlashIds(hits);
        window.setTimeout(() => setFlashIds(new Set()), 350);
      }
      if (dead.size) {
        setDestroyIds(dead);
        window.setTimeout(() => setDestroyIds(new Set()), 450);
      }
    }
    if (result.state.phase === "ended") {
      setResultOpen(true);
    }
  };

  const endSummary = (): MatchEndSummary => ({
    turnCount: manager.getState().turnNumber,
    durationMs: Date.now() - startedAt,
  });

  const isAiTurn =
    opponentMode === "ai" &&
    state.phase === "playing" &&
    state.currentPlayer === 1;

  useEffect(() => {
    if (!ai || !isAiTurn || resultOpen) {
      return;
    }

    let cancelled = false;
    setAiThinking(true);
    setSelectedUnitId(null);
    setSelectedAbilityId(null);
    setFeedback("ИИ думает…");

    const timer = window.setTimeout(() => {
      if (cancelled) {
        return;
      }
      const steps = ai.playTurn(manager);
      setTick((value) => value + 1);
      setAiThinking(false);
      const allEvents = steps.flatMap((step) => step.result.events ?? []);
      if (allEvents.length) {
        setFxEvents(allEvents);
        playEventsAudio(allEvents);
      }
      const last = steps[steps.length - 1];
      if (last && !last.result.ok && last.action.kind !== "end_turn") {
        setFeedback(last.result.reason ?? "ИИ пропустил действие");
      } else {
        setFeedback(
          steps.some((step) => step.action.kind === "attack")
            ? "ИИ атаковал"
            : steps.some((step) => step.action.kind === "ability")
              ? "ИИ использовал способность"
              : "Ход ИИ завершён",
        );
      }
      if (manager.getState().phase === "ended") {
        setResultOpen(true);
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [ai, isAiTurn, resultOpen, manager]);

  const legalMoves = useMemo(() => {
    void tick;
    if (selectedAbilityId || isAiTurn) {
      return [];
    }
    return manager.getLegalMovePositions(selectedUnitId);
  }, [manager, tick, selectedUnitId, selectedAbilityId, isAiTurn]);

  const legalAttacks = useMemo(() => {
    void tick;
    if (selectedAbilityId || isAiTurn) {
      return new Set<string>();
    }
    return new Set(manager.getLegalAttackTargetIds(selectedUnitId));
  }, [manager, tick, selectedUnitId, selectedAbilityId, isAiTurn]);

  const legalAbilityTargets = useMemo(() => {
    void tick;
    if (isAiTurn) {
      return new Set<string>();
    }
    return new Set(
      manager.getLegalAbilityTargetIds(selectedUnitId, selectedAbilityId),
    );
  }, [manager, tick, selectedUnitId, selectedAbilityId, isAiTurn]);

  const selected = selectedUnitId
    ? state.units.find((unit) => unit.instanceId === selectedUnitId)
    : undefined;
  const selectedDef = selected
    ? UnitSystem.get(selected.definitionId)
    : undefined;

  const supportRadiusCells = useMemo(() => {
    void tick;
    if (!selected || !RipperdocSystem.isRipperdocRuntime(selected)) {
      return new Set<string>();
    }
    const radius = RipperdocSystem.supportRadius(selected.definitionId);
    if (radius === null) {
      return new Set<string>();
    }
    return new Set(
      cellsInChebyshevRadius(state.board, selected.position, radius).map(
        (pos) => `${pos.x},${pos.y}`,
      ),
    );
  }, [selected, state.board, tick]);

  const cells: Position[] = [];
  for (let y = 0; y < state.board.height; y += 1) {
    for (let x = 0; x < state.board.width; x += 1) {
      cells.push({ x, y });
    }
  }

  const playerAlive = state.units.filter((unit) => unit.owner === 0).length;
  const enemyAlive = state.units.filter((unit) => unit.owner === 1).length;
  const inputLocked = state.phase !== "playing" || isAiTurn || aiThinking;

  const subtitle =
    opponentMode === "ai"
      ? `Ход ${state.turnNumber} · ${
          isAiTurn
            ? `ИИ (${AI_DIFFICULTY_LABELS[aiDifficulty]})`
            : "ваш ход"
        }`
      : `Ход ${state.turnNumber} · игрок ${state.currentPlayer + 1} (hotseat)`;

  const playerCommander =
    state.units.find((unit) => {
      if (unit.owner !== 0) return false;
      const def = UnitSystem.get(unit.definitionId);
      return def ? CommanderSystem.isCommanderUnit(def) : false;
    }) ?? null;

  const legendOnBoard = state.units.some(
    (unit) => unit.definitionId === "arasaka-adam-smasher" && unit.owner === 0,
  );

  return (
    <ScreenLayout wide className="battle-screen screen-enter">
      <ScreenHeader
        title={BRAND_TERMS.matchRu}
        subtitle={subtitle}
        onBack={onMenu}
        backLabel="В меню"
        actions={
          <GameButton
            variant="secondary"
            onClick={() => refresh(manager.endTurn())}
            disabled={inputLocked || state.currentPlayer !== 0}
          >
            Завершить ход
          </GameButton>
        }
      />

      <p className="battle-screen__hint" aria-live="polite">
        {selectedAbilityId
          ? "Оранжевые клетки — цели способности"
          : selected
            ? "Голубые — ход · Розовые — атака"
            : "Выберите союзную фигуру на поле"}
      </p>

      <div className="battle-screen__layout">
        <div className="battle-screen__side">
          <PlayerPanel
            side="player"
            name={playerArmy.name}
            factionLabel="Вы"
            hpLabel={`${playerAlive} юн.`}
            active={state.currentPlayer === 0 && state.phase === "playing"}
          />
          <CommanderCombatCard unit={playerCommander} />
          {legendOnBoard ? (
            <Panel eyebrow="Legendary" title="Adam Smasher">
              <p className="battle-screen__smasher-card">
                Living weapon на поле. Высокий приоритет цели — и высокая цена
                ошибки.
              </p>
            </Panel>
          ) : null}
          <Panel eyebrow="Сканер" title="Юнит">
            {selected && selectedDef ? (
              <div className="battle-screen__unit-info">
                <p className="battle-screen__unit-name">{selectedDef.name}</p>
                <UnitTypeBadge type={selectedDef.type} />
                {(() => {
                  const stats = getEffectiveUnitStats(selected, selectedDef);
                  return (
                    <dl>
                      <div>
                        <dt>HP</dt>
                        <dd>
                          {selected.currentHp} / {selected.maxHp}
                        </dd>
                      </div>
                      <div>
                        <dt>Attack</dt>
                        <dd>{stats.attack}</dd>
                      </div>
                      <div>
                        <dt>Defense</dt>
                        <dd>{stats.defense}</dd>
                      </div>
                      <div>
                        <dt>Movement</dt>
                        <dd>{stats.movement}</dd>
                      </div>
                      <div>
                        <dt>Range</dt>
                        <dd>{stats.range}</dd>
                      </div>
                      <div>
                        <dt>Действия</dt>
                        <dd>
                          {selected.hasMoved ? "ход✓ " : "ход· "}
                          {selected.hasAttacked ? "атака✓ " : "атака· "}
                          {selected.hasUsedAbility ? "ability✓" : "ability·"}
                        </dd>
                      </div>
                      {selected.implantIds.length > 0 ? (
                        <div>
                          <dt>{BRAND_TERMS.implantsRu}</dt>
                          <dd>
                            {selected.implantIds
                              .map(
                                (id) =>
                                  CommanderSystem.getImplant(id)?.name ?? id,
                              )
                              .join(", ")}
                          </dd>
                        </div>
                      ) : null}
                      {selected.statusEffects.length > 0 ? (
                        <div>
                          <dt>Статусы</dt>
                          <dd>
                            {selected.statusEffects
                              .map((s) => s.statusId.replace("status-", ""))
                              .join(", ")}
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  );
                })()}
              </div>
            ) : (
              <p className="battle-screen__empty">Выберите своего юнита.</p>
            )}
          </Panel>
          <AbilityPanel
            state={state}
            unit={selected}
            selectedAbilityId={selectedAbilityId}
            onSelectAbility={(id) => {
              AudioManager.play("ui_select");
              setSelectedAbilityId(id);
            }}
          />
          <RipperdocInfo unit={selected} />
        </div>

        <div className="battle-screen__board-wrap">
          <div className="battle-board-stage">
            <div
              className="battle-board"
              style={
                {
                  "--bw": state.board.width,
                  "--bh": state.board.height,
                } as CSSProperties
              }
              role="grid"
              aria-label="Игровое поле"
            >
              {cells.map((pos) => {
                const unit = state.units.find(
                  (item) =>
                    item.position.x === pos.x && item.position.y === pos.y,
                );
                const move = isMoveHighlight(legalMoves, pos);
                const attack =
                  unit !== undefined && legalAttacks.has(unit.instanceId);
                const abilityTarget =
                  unit !== undefined &&
                  legalAbilityTargets.has(unit.instanceId);
                const inSupport =
                  !selectedAbilityId &&
                  supportRadiusCells.has(`${pos.x},${pos.y}`);
                const selectedCell =
                  selected !== undefined &&
                  selected.position.x === pos.x &&
                  selected.position.y === pos.y;
                const ally =
                  unit !== undefined &&
                  selected !== undefined &&
                  unit.owner === selected.owner &&
                  unit.instanceId !== selected.instanceId;
                const enemy =
                  unit !== undefined &&
                  selected !== undefined &&
                  unit.owner !== selected.owner;
                const hasEffect =
                  unit !== undefined && unit.statusEffects.length > 0;

                return (
                  <button
                    key={`${pos.x}-${pos.y}`}
                    type="button"
                    role="gridcell"
                    className={[
                      "battle-board__cell",
                      (pos.x + pos.y) % 2 === 0 ? "is-tile-a" : "is-tile-b",
                      move ? "is-move" : "",
                      attack ? "is-attack" : "",
                      abilityTarget ? "is-ability" : "",
                      inSupport ? "is-support" : "",
                      selectedCell ? "is-selected" : "",
                      ally ? "is-ally" : "",
                      enemy ? "is-enemy" : "",
                      hasEffect ? "is-effect" : "",
                      unit ? `is-owner-${unit.owner}` : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => {
                      if (inputLocked) {
                        return;
                      }
                      AudioManager.play("ui_select");
                      const prevUnit = selectedUnitId;
                      const result = manager.interactCell(
                        pos,
                        selectedUnitId,
                        selectedAbilityId,
                      );
                      refresh(result);
                      if (
                        result.ok &&
                        result.selectUnitId &&
                        result.selectUnitId !== prevUnit &&
                        !selectedAbilityId
                      ) {
                        setSelectedAbilityId(null);
                      }
                    }}
                    disabled={inputLocked}
                  >
                    {unit ? (
                      <UnitToken
                        unit={unit}
                        selected={selectedCell}
                        damaged={flashIds.has(unit.instanceId)}
                        destroying={destroyIds.has(unit.instanceId)}
                        enemyTarget={attack || abilityTarget}
                        healed={unit.statusEffects.some((s) =>
                          s.statusId.includes("heal"),
                        )}
                        overclock={unit.statusEffects.some((s) =>
                          s.statusId.includes("overclock"),
                        )}
                        disabled={unit.statusEffects.some(
                          (s) =>
                            s.statusId.includes("stun") ||
                            s.statusId.includes("disable"),
                        )}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <BattleFxLayer
              boardWidth={state.board.width}
              boardHeight={state.board.height}
              events={fxEvents}
              unitCells={cellMemory.current}
            />
          </div>
          {feedback ? (
            <p className="battle-screen__feedback">{feedback}</p>
          ) : null}
        </div>

        <div className="battle-screen__side">
          <PlayerPanel
            side="enemy"
            name={opponentMode === "ai" ? "Компьютер" : "Игрок 2"}
            factionLabel={
              opponentMode === "ai"
                ? `ИИ · ${AI_DIFFICULTY_LABELS[aiDifficulty]}`
                : "Hotseat P2"
            }
            hpLabel={`${enemyAlive} юн.`}
            active={state.currentPlayer === 1 && state.phase === "playing"}
          />
          <EventLog entries={state.log.map((entry) => entry.text)} />
        </div>
      </div>

      <Modal
        open={resultOpen}
        title={
          state.winner === 0
            ? "Победа"
            : state.winner === 1
              ? "Поражение"
              : "Ничья"
        }
        onClose={() => setResultOpen(false)}
        footer={
          <>
            {state.winner === 0 ? (
              <GameButton
                onClick={() => {
                  setResultOpen(false);
                  onVictory(endSummary());
                }}
              >
                К результатам
              </GameButton>
            ) : null}
            {state.winner === 1 ? (
              <GameButton
                variant="danger"
                onClick={() => {
                  setResultOpen(false);
                  onDefeat(endSummary());
                }}
              >
                К результатам
              </GameButton>
            ) : null}
            {state.winner === null && state.phase === "ended" ? (
              <GameButton variant="ghost" onClick={onMenu}>
                В меню
              </GameButton>
            ) : null}
          </>
        }
      >
        <p style={{ margin: 0 }}>
          {state.winner === 0
            ? `Вражеский ${BRAND_TERMS.commanderRu} уничтожен.`
            : state.winner === 1
              ? `Ваш ${BRAND_TERMS.commanderRu} уничтожен.`
              : "Оба нейро-командира уничтожены."}
        </p>
      </Modal>
    </ScreenLayout>
  );
}

export default BattleScreen;

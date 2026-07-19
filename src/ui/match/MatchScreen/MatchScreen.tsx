import { Fragment, useMemo, useState } from "react";

import { getPieceGlyph } from "../../../data/catalog/pieceGlyphs.catalog";
import {
  getAbilityForUnit,
  getHealTargets,
  getTeleportTargets,
} from "../../../domain/match/abilities";
import {
  boardFileLabels,
  boardRankLabels,
  cellLabel,
} from "../../../domain/match/boardCoords";
import type {
  BoardPos,
  MatchConfig,
  MatchState,
} from "../../../domain/match/match.types";
import {
  getHeroById,
  getUnitById,
} from "../../../services/collection/collectionService";
import {
  acknowledgeHandoff,
  attackPiece,
  canUseAbility,
  clearSelection,
  createMatch,
  describePiece,
  endTurn,
  getLegalAttacks,
  getLegalMoves,
  getSelectedPiece,
  movePiece,
  selectPiece,
  useAbility,
} from "../../../services/match/matchEngine";
import UnitCard from "../../collection/UnitCard/UnitCard";
import NeonPortrait from "../../shared/NeonPortrait/NeonPortrait";

import "./MatchScreen.css";

type AimMode = "none" | "heal" | "teleport";

interface MatchScreenProps {
  config: MatchConfig;
  onMenu: () => void;
  onRematch: () => void;
}

function MatchScreen({ config, onMenu, onRematch }: MatchScreenProps) {
  const [state, setState] = useState<MatchState>(() => createMatch(config));
  const [aimMode, setAimMode] = useState<AimMode>("none");
  const [hoveredPieceId, setHoveredPieceId] = useState<string | null>(null);

  const selected = getSelectedPiece(state);
  const selectedInfo = selected ? describePiece(selected) : null;

  const legalMoves = useMemo(() => {
    if (!selected || aimMode !== "none") {
      return [] as BoardPos[];
    }
    return getLegalMoves(state, selected);
  }, [aimMode, selected, state]);

  const legalAttacks = useMemo(() => {
    if (!selected || aimMode !== "none") {
      return [];
    }
    return getLegalAttacks(state, selected);
  }, [aimMode, selected, state]);

  const healTargets = useMemo(() => {
    if (!selected || aimMode !== "heal") {
      return [];
    }
    return getHealTargets(state.pieces, selected);
  }, [aimMode, selected, state.pieces]);

  const teleportTargets = useMemo(() => {
    if (!selected || aimMode !== "teleport") {
      return [] as BoardPos[];
    }
    return getTeleportTargets(state, selected);
  }, [aimMode, selected, state]);

  const moveKeys = useMemo(
    () => new Set(legalMoves.map((pos) => `${pos.x},${pos.y}`)),
    [legalMoves],
  );
  const attackKeys = useMemo(
    () => new Set(legalAttacks.map((piece) => `${piece.x},${piece.y}`)),
    [legalAttacks],
  );
  const healKeys = useMemo(
    () => new Set(healTargets.map((piece) => `${piece.x},${piece.y}`)),
    [healTargets],
  );
  const teleportKeys = useMemo(
    () => new Set(teleportTargets.map((pos) => `${pos.x},${pos.y}`)),
    [teleportTargets],
  );

  const currentName = state.players[state.currentPlayer].displayName;
  const abilityReady = Boolean(
    selected && canUseAbility(state, selected, getUnitById),
  );

  const fileLabels = useMemo(
    () => boardFileLabels(state.boardSize),
    [state.boardSize],
  );
  const rankLabels = useMemo(
    () => boardRankLabels(state.boardSize),
    [state.boardSize],
  );

  const hoveredPiece = hoveredPieceId
    ? (state.pieces.find((piece) => piece.id === hoveredPieceId) ?? null)
    : null;
  const hoveredDef = hoveredPiece
    ? (getUnitById(hoveredPiece.unitDefinitionId) ?? null)
    : null;
  const hoveredHero = hoveredDef?.heroId
    ? (getHeroById(hoveredDef.heroId) ?? null)
    : null;

  const handleCellClick = (x: number, y: number) => {
    if (state.phase !== "playing") {
      return;
    }

    const key = `${x},${y}`;
    const occupant = state.pieces.find(
      (piece) => piece.x === x && piece.y === y,
    );

    if (aimMode === "teleport" && selected && teleportKeys.has(key)) {
      setState((current) =>
        useAbility(current, selected.id, {
          type: "teleport",
          to: { x, y },
        }),
      );
      setAimMode("none");
      return;
    }

    if (aimMode === "heal" && selected && occupant && healKeys.has(key)) {
      setState((current) =>
        useAbility(current, selected.id, {
          type: "heal",
          targetPieceId: occupant.id,
        }),
      );
      setAimMode("none");
      return;
    }

    if (aimMode !== "none") {
      setAimMode("none");
      return;
    }

    if (selected && moveKeys.has(key) && !occupant) {
      setState((current) => movePiece(current, selected.id, { x, y }));
      return;
    }

    if (selected && occupant && attackKeys.has(key)) {
      setState((current) => attackPiece(current, selected.id, occupant.id));
      return;
    }

    if (occupant && occupant.owner === state.currentPlayer) {
      setState((current) => selectPiece(current, occupant.id));
      setAimMode("none");
      return;
    }

    if (occupant && occupant.owner !== state.currentPlayer) {
      // Inspect enemy: select for left panel read-only via temporary select only if own turn? Show info by selecting visually without ownership actions.
      setState((current) => ({
        ...current,
        selectedPieceId: occupant.id,
      }));
      setAimMode("none");
      return;
    }

    setState((current) => clearSelection(current));
    setAimMode("none");
  };

  const handleAbilityClick = () => {
    if (!selected || !abilityReady) {
      return;
    }
    const def = getUnitById(selected.unitDefinitionId);
    const kind = getAbilityForUnit(def).kind;
    if (kind === "heal_adjacent") {
      setAimMode("heal");
      return;
    }
    if (kind === "teleport_near_ally") {
      setAimMode("teleport");
    }
  };

  const handleEndTurn = () => {
    setAimMode("none");
    setState((current) => endTurn(current));
  };

  const handleHandoff = () => {
    setState((current) => acknowledgeHandoff(current));
  };

  const winnerName =
    state.winner !== null ? state.players[state.winner].displayName : null;

  return (
    <div className="match-screen">
      <header className="match-top">
        <div className="match-top-meta">
          <span className="match-top-player">
            Ход: {currentName}
          </span>
          <span className="match-top-round">Раунд {state.round}</span>
        </div>
        <div className="match-top-actions">
          <button
            type="button"
            className="match-btn"
            disabled={state.phase !== "playing"}
            onClick={handleEndTurn}
          >
            Завершить ход
          </button>
          <button type="button" className="match-btn" onClick={onMenu}>
            Меню
          </button>
        </div>
      </header>

      <aside className="match-left">
        <h2>Фигура</h2>
        {!selected || !selectedInfo?.def ? (
          <p className="match-muted">Выберите фигуру на поле.</p>
        ) : (
          <div className="match-unit-card">
            <NeonPortrait
              portraitId={selectedInfo.def.portraitId}
              label={selectedInfo.def.name}
              unitDefinitionId={selected.unitDefinitionId}
              size="md"
              accent={selected.owner === 0 ? "cyan" : "magenta"}
            />
            <strong>{selectedInfo.def.name}</strong>
            <span className="match-muted">
              {selectedInfo.def.race}
              {selectedInfo.isKing ? " · Командир" : ""}
            </span>
            <div className="match-unit-stats">
              <span>АТК {selectedInfo.def.attack}</span>
              <span>
                HP {selected.health}/{selected.maxHealth}
              </span>
            </div>
            <p className="match-unit-role">{selectedInfo.def.roleDescription}</p>
            <p className="match-unit-ability">
              {selectedInfo.def.abilityDescription}
            </p>
            {selected.owner !== state.currentPlayer && (
              <p className="match-muted">Чужая фигура — только просмотр.</p>
            )}
          </div>
        )}
      </aside>

      <main className="match-board-wrap">
        <div
          className="match-board-frame"
          style={{
            gridTemplateColumns: `28px repeat(${state.boardSize}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${state.boardSize}, minmax(0, 1fr)) 22px`,
          }}
        >
          {Array.from({ length: state.boardSize }, (_, rowIndex) => {
            const y = state.boardSize - 1 - rowIndex;
            return (
              <Fragment key={`row-${y}`}>
                <div className="match-board-rank">{rankLabels[y]}</div>
                {fileLabels.map((_, x) => {
                  const key = `${x},${y}`;
                  const piece = state.pieces.find(
                    (item) => item.x === x && item.y === y,
                  );
                  const def = piece
                    ? getUnitById(piece.unitDefinitionId)
                    : null;
                  const isSelected = piece?.id === state.selectedPieceId;
                  const classes = [
                    "match-cell",
                    moveKeys.has(key) ? "is-move" : "",
                    attackKeys.has(key) ? "is-attack" : "",
                    healKeys.has(key) ? "is-heal" : "",
                    teleportKeys.has(key) ? "is-teleport" : "",
                    isSelected ? "is-selected" : "",
                    piece ? `owner-${piece.owner}` : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <button
                      key={key}
                      type="button"
                      className={classes}
                      onClick={() => handleCellClick(x, y)}
                      onMouseEnter={() => {
                        if (piece) {
                          setHoveredPieceId(piece.id);
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredPieceId((current) =>
                          current === piece?.id ? null : current,
                        );
                      }}
                      title={cellLabel(x, y)}
                    >
                      {piece && def && (
                        <span className="match-token">
                          <span className="match-token-glyph">
                            {getPieceGlyph(piece.unitDefinitionId)}
                          </span>
                          <span className="match-token-stats">
                            <span className="match-token-atk" title="Атака">
                              {def.attack}
                            </span>
                            <span className="match-token-hp" title="Здоровье">
                              {piece.health}
                            </span>
                          </span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </Fragment>
            );
          })}

          <div className="match-board-corner" />
          {fileLabels.map((file) => (
            <div key={`file-${file}`} className="match-board-file">
              {file}
            </div>
          ))}
        </div>

        {hoveredPiece && hoveredDef && (
          <div className="match-hover-card">
            <UnitCard
              unit={hoveredDef}
              hero={hoveredHero}
              preview
              healthOverride={hoveredPiece.health}
            />
          </div>
        )}
      </main>

      <aside className="match-right">
        <h2>Журнал</h2>
        <ul className="match-log">
          {state.log.map((entry) => (
            <li key={entry.id}>
              <span className="match-log-round">R{entry.round}</span>
              {entry.text}
            </li>
          ))}
        </ul>
      </aside>

      <footer className="match-bottom">
        <div className="match-bottom-ability">
          <span className="match-bottom-label">Способность</span>
          {selectedInfo?.def ? (
            <>
              <p className="match-bottom-text">
                {selectedInfo.def.abilityDescription}
              </p>
              <button
                type="button"
                className="match-btn"
                disabled={
                  !abilityReady ||
                  selected?.owner !== state.currentPlayer ||
                  state.phase !== "playing"
                }
                onClick={handleAbilityClick}
              >
                {aimMode !== "none"
                  ? "Выберите цель на поле"
                  : selectedInfo.abilityActive
                    ? `Использовать: ${selectedInfo.abilityLabel}`
                    : "Пассивная способность"}
              </button>
              {selected &&
                getAbilityForUnit(selectedInfo.def).kind ===
                  "teleport_near_ally" && (
                  <span className="match-muted">
                    Откат телепорта:{" "}
                    {selected.teleportCooldown > 0
                      ? `${selected.teleportCooldown} ход.`
                      : "готов"}
                  </span>
                )}
            </>
          ) : (
            <p className="match-muted">Нет выбранной фигуры.</p>
          )}
        </div>
        <p className="match-bottom-hint">
          Свой ход: выбор фигуры → клетка хода / атака. Затем «Завершить ход».
        </p>
      </footer>

      {state.phase === "handoff" && state.handoffPlayer !== null && (
        <div className="match-overlay">
          <div className="match-overlay-card">
            <h2>Передача хода</h2>
            <p>
              Ход переходит к{" "}
              <strong>{state.players[state.handoffPlayer].displayName}</strong>.
            </p>
            <button type="button" className="match-btn primary" onClick={handleHandoff}>
              Продолжить
            </button>
          </div>
        </div>
      )}

      {state.phase === "ended" && winnerName && (
        <div className="match-overlay">
          <div className="match-overlay-card">
            <h2>Победил {winnerName}</h2>
            <div className="match-overlay-actions">
              <button
                type="button"
                className="match-btn primary"
                onClick={onRematch}
              >
                Сыграть ещё раз
              </button>
              <button type="button" className="match-btn" onClick={onMenu}>
                В меню
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchScreen;

import { Fragment, useEffect, useMemo, useState } from "react";

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
import {
  displayFileLabels,
  displayRankLabels,
  displayToLogical,
} from "../../../domain/match/boardView";
import type { PlayerId } from "../../../domain/match/match.types";
import { livingKingsForPlayer } from "../../../domain/match/victory";
import {
  getHeroById,
  getUnitById,
} from "../../../services/collection/collectionService";
import {
  canUseAbility,
  describePiece,
  getLegalAttacks,
  getLegalMoves,
  getSelectedPiece,
} from "../../../services/match/matchEngine";
import type { MatchSessionSource } from "../../../services/match/session/matchSession.types";
import UnitCard from "../../collection/UnitCard/UnitCard";
import NeonPortrait from "../../shared/NeonPortrait/NeonPortrait";

import "./MatchScreen.css";

type AimMode = "none" | "heal" | "teleport";

interface MatchScreenProps {
  session: MatchSessionSource;
  /** Whose perspective this window uses (army always at bottom). */
  seat: PlayerId;
  onMenu: () => void;
  /** Player 1 tab: URL of the Player 2 tab (for reopen link). */
  playerTwoUrl?: string | null;
  /** Player 1 tab: second tab did not open (popup/tab blocked). */
  playerTwoNeedsOpen?: boolean;
  onOpenPlayerTwo?: () => void;
}

function MaskIcon() {
  return (
    <svg
      className="match-mask-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M12 2c-3.8 0-7 2.4-7 6.2V10c0 4.2 2.6 7.8 7 9.8 4.4-2 7-5.6 7-9.8V8.2C19 4.4 15.8 2 12 2zm-3.2 9.2c-.9 0-1.6-.7-1.6-1.6S7.9 8 8.8 8s1.6.7 1.6 1.6-.7 1.6-1.6 1.6zm6.4 0c-.9 0-1.6-.7-1.6-1.6S14.3 8 15.2 8s1.6.7 1.6 1.6-.7 1.6-1.6 1.6zM8.5 14.2c.9 1.2 2.1 1.9 3.5 1.9s2.6-.7 3.5-1.9c.2-.2.1-.5-.1-.6-.2-.1-.5 0-.6.2-.7.9-1.7 1.4-2.8 1.4s-2.1-.5-2.8-1.4c-.1-.2-.4-.3-.6-.2-.2.1-.3.4-.1.6z"
      />
    </svg>
  );
}

function MatchScreen({
  session,
  seat,
  onMenu,
  playerTwoUrl = null,
  playerTwoNeedsOpen = false,
  onOpenPlayerTwo,
}: MatchScreenProps) {
  const [snapshot, setSnapshot] = useState(() => session.getSnapshot());
  const [aimMode, setAimMode] = useState<AimMode>("none");
  const [hoveredPieceId, setHoveredPieceId] = useState<string | null>(null);
  const [boardHidden, setBoardHidden] = useState(false);

  useEffect(() => session.subscribe(setSnapshot), [session]);

  useEffect(() => {
    const name = snapshot.state.players[seat].displayName;
    document.title = `Space Chess · ${name}`;
    return () => {
      document.title = "Space Chess";
    };
  }, [seat, snapshot.state.players]);

  const state = snapshot.state;
  const dualWindow = snapshot.dualWindow;
  const selected = getSelectedPiece(state);
  const selectedInfo = selected ? describePiece(selected) : null;

  const isMyTurn =
    state.phase === "playing" && state.currentPlayer === seat;

  const legalMoves = useMemo(() => {
    if (!selected || aimMode !== "none" || !isMyTurn) {
      return [];
    }
    return getLegalMoves(state, selected);
  }, [aimMode, isMyTurn, selected, state]);

  const legalAttacks = useMemo(() => {
    if (!selected || aimMode !== "none" || !isMyTurn) {
      return [];
    }
    return getLegalAttacks(state, selected);
  }, [aimMode, isMyTurn, selected, state]);

  const healTargets = useMemo(() => {
    if (!selected || aimMode !== "heal" || !isMyTurn) {
      return [];
    }
    return getHealTargets(state.pieces, selected);
  }, [aimMode, isMyTurn, selected, state.pieces]);

  const teleportTargets = useMemo(() => {
    if (!selected || aimMode !== "teleport" || !isMyTurn) {
      return [];
    }
    return getTeleportTargets(state, selected);
  }, [aimMode, isMyTurn, selected, state]);

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
  const seatName = state.players[seat].displayName;
  const myKings = livingKingsForPlayer(state.pieces, seat, getUnitById).length;
  const enemySeat: PlayerId = seat === 0 ? 1 : 0;
  const enemyKings = livingKingsForPlayer(
    state.pieces,
    enemySeat,
    getUnitById,
  ).length;
  const abilityReady = Boolean(
    selected && canUseAbility(state, selected, getUnitById),
  );

  const fileLabelsBase = useMemo(
    () => boardFileLabels(state.boardSize),
    [state.boardSize],
  );
  const rankLabelsBase = useMemo(
    () => boardRankLabels(state.boardSize),
    [state.boardSize],
  );
  const fileLabels = useMemo(
    () => displayFileLabels(seat, state.boardSize, fileLabelsBase),
    [fileLabelsBase, seat, state.boardSize],
  );
  const rankLabels = useMemo(
    () => displayRankLabels(seat, state.boardSize, rankLabelsBase),
    [rankLabelsBase, seat, state.boardSize],
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

    if (!isMyTurn) {
      if (occupant) {
        session.dispatch({ type: "inspectPiece", pieceId: occupant.id });
      } else {
        session.dispatch({ type: "clearSelection" });
      }
      setAimMode("none");
      return;
    }

    if (aimMode === "teleport" && selected && teleportKeys.has(key)) {
      session.dispatch({
        type: "useAbility",
        pieceId: selected.id,
        target: { type: "teleport", to: { x, y } },
      });
      setAimMode("none");
      return;
    }

    if (aimMode === "heal" && selected && occupant && healKeys.has(key)) {
      session.dispatch({
        type: "useAbility",
        pieceId: selected.id,
        target: { type: "heal", targetPieceId: occupant.id },
      });
      setAimMode("none");
      return;
    }

    if (aimMode !== "none") {
      setAimMode("none");
      return;
    }

    if (selected && moveKeys.has(key) && !occupant) {
      session.dispatch({
        type: "movePiece",
        pieceId: selected.id,
        to: { x, y },
      });
      return;
    }

    if (selected && occupant && attackKeys.has(key)) {
      session.dispatch({
        type: "attackPiece",
        attackerId: selected.id,
        targetId: occupant.id,
      });
      return;
    }

    if (occupant && occupant.owner === seat) {
      session.dispatch({ type: "selectPiece", pieceId: occupant.id });
      setAimMode("none");
      return;
    }

    if (occupant) {
      session.dispatch({ type: "inspectPiece", pieceId: occupant.id });
      setAimMode("none");
      return;
    }

    session.dispatch({ type: "clearSelection" });
    setAimMode("none");
  };

  const handleAbilityClick = () => {
    if (!selected || !abilityReady || !isMyTurn) {
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
    if (!isMyTurn) {
      return;
    }
    setAimMode("none");
    session.dispatch({ type: "endTurn" });
  };

  const handleSurrender = () => {
    if (state.phase === "ended") {
      return;
    }
    if (
      !window.confirm(
        `Сдаться за ${seatName}? Победит соперник.`,
      )
    ) {
      return;
    }
    setAimMode("none");
    session.dispatch({ type: "surrender", seat });
  };

  const handleHandoff = () => {
    session.dispatch({ type: "acknowledgeHandoff" });
  };

  const winnerName =
    state.winner !== null ? state.players[state.winner].displayName : null;

  return (
    <div className="match-screen">
      {playerTwoNeedsOpen && (
        <div className="match-tab-banner" role="status">
          <span>
            Вкладка «Игрок 2» не открылась. Разрешите всплывающие окна и
            откройте её — там играет второй игрок своей армией.
          </span>
          <div className="match-tab-banner-actions">
            {onOpenPlayerTwo && (
              <button
                type="button"
                className="match-btn primary"
                onClick={onOpenPlayerTwo}
              >
                Открыть вкладку Игрок 2
              </button>
            )}
            {playerTwoUrl && (
              <a
                className="match-btn"
                href={playerTwoUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ссылка на Игрока 2
              </a>
            )}
          </div>
        </div>
      )}

      <header className="match-top">
        <div className="match-top-meta">
          <span className={`match-top-seat-badge seat-${seat}`}>
            {seatName}
          </span>
          <span className="match-top-player">Ходит: {currentName}</span>
          <span className="match-top-round">Ход {state.round}</span>
          <span className="match-top-kings" title="Живые короли">
            Короли: свои {myKings} · враг {enemyKings}
          </span>
          {!isMyTurn && state.phase === "playing" && (
            <span className="match-top-wait">Ожидание хода соперника</span>
          )}
          {isMyTurn && state.phase === "playing" && (
            <span className="match-top-ready">Ваш ход</span>
          )}
        </div>
        <div className="match-top-actions">
          <button
            type="button"
            className={`match-btn match-btn-icon${boardHidden ? " is-active" : ""}`}
            onClick={() => setBoardHidden((value) => !value)}
            title={boardHidden ? "Показать поле" : "Скрыть поле"}
            aria-pressed={boardHidden}
          >
            <MaskIcon />
            <span>{boardHidden ? "Показать поле" : "Скрыть поле"}</span>
          </button>
          <button
            type="button"
            className="match-btn"
            disabled={!isMyTurn}
            onClick={handleEndTurn}
            title="Передать ход без действия фигурой"
          >
            Пропустить ход
          </button>
          <button
            type="button"
            className="match-btn match-btn-danger"
            disabled={state.phase === "ended"}
            onClick={handleSurrender}
          >
            Сдаться
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
            {selected.owner !== seat && (
              <p className="match-muted">Чужая фигура — только просмотр.</p>
            )}
          </div>
        )}
      </aside>

      <main className="match-board-wrap">
        {boardHidden ? (
          <div className="match-board-hidden" role="status">
            <MaskIcon />
            <p>Поле скрыто</p>
          </div>
        ) : (
          <>
            <div
              className="match-board-frame"
              style={{
                gridTemplateColumns: `28px repeat(${state.boardSize}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${state.boardSize}, minmax(0, 1fr)) 22px`,
              }}
            >
              {Array.from({ length: state.boardSize }, (_, rowIndex) => (
                <Fragment key={`row-${rowIndex}`}>
                  <div className="match-board-rank">{rankLabels[rowIndex]}</div>
                  {Array.from({ length: state.boardSize }, (_, colIndex) => {
                    const { x, y } = displayToLogical(
                      seat,
                      state.boardSize,
                      colIndex,
                      rowIndex,
                    );
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
              ))}

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
          </>
        )}
      </main>

      <aside className="match-right">
        <h2>Журнал</h2>
        <ul className="match-log">
          {state.log.map((entry) => (
            <li key={entry.id}>
              <span className="match-log-round">Х{entry.round}</span>
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
                  selected?.owner !== seat ||
                  !isMyTurn
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
          Как в шахматах: один ход — одно действие фигурой (перемещение, атака
          или способность), затем ходит соперник. Базовый ход: ↑ ↓ ← → на 1
          клетку. Победа: короли врага или сдача.
          {dualWindow
            ? " Локально: играйте в своём окне; «Скрыть поле» — при смене места."
            : ""}
        </p>
      </footer>

      {!dualWindow &&
        state.phase === "handoff" &&
        state.handoffPlayer !== null && (
          <div className="match-overlay">
            <div className="match-overlay-card">
              <h2>Передача хода</h2>
              <p>
                Ход переходит к{" "}
                <strong>
                  {state.players[state.handoffPlayer].displayName}
                </strong>
                .
              </p>
              <button
                type="button"
                className="match-btn primary"
                onClick={handleHandoff}
              >
                Продолжить
              </button>
            </div>
          </div>
        )}

      {state.phase === "ended" && winnerName && (
        <div className="match-overlay">
          <div className="match-overlay-card">
            <h2>Победил {winnerName}</h2>
            <p>Все короли противника уничтожены.</p>
            <div className="match-overlay-actions">
              <button
                type="button"
                className="match-btn primary"
                onClick={() => session.dispatch({ type: "rematch" })}
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

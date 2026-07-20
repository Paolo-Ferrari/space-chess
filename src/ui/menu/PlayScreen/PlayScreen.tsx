import { useMemo, useState } from "react";

import { PLAY_MODES_CATALOG } from "../../../data/catalog/playModes.catalog";
import type { PlayModeId } from "../../../domain/match/playMode.types";
import AppShell from "../../shell/AppShell/AppShell";

import "./PlayScreen.css";

type ClassicChannel = "online" | "offline" | null;

interface PlayScreenProps {
  onBack: () => void;
  onStartClassicOffline: () => void;
}

function PlayScreen({ onBack, onStartClassicOffline }: PlayScreenProps) {
  const [selectedModeId, setSelectedModeId] = useState<PlayModeId | null>(
    null,
  );
  const [classicChannel, setClassicChannel] = useState<ClassicChannel>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const selectedMode = useMemo(
    () =>
      PLAY_MODES_CATALOG.find((mode) => mode.id === selectedModeId) ?? null,
    [selectedModeId],
  );

  const canStart =
    selectedModeId !== null &&
    (selectedModeId !== "classic" || classicChannel === "offline");

  const handleClassicOnline = () => {
    setClassicChannel("online");
    setStatusMessage("Онлайн-режим пока не готов.");
  };

  const handleClassicOffline = () => {
    setClassicChannel("offline");
    setStatusMessage("");
    onStartClassicOffline();
  };

  const handleStart = () => {
    if (!selectedMode) {
      return;
    }

    if (selectedMode.id === "classic") {
      if (classicChannel === "offline") {
        onStartClassicOffline();
        return;
      }
      if (classicChannel === "online") {
        setStatusMessage("Онлайн-режим пока не готов.");
        return;
      }
      setStatusMessage("Выберите Онлайн или Локальную (2 окна).");
      return;
    }

    setStatusMessage(`Режим «${selectedMode.label}» пока недоступен.`);
  };

  return (
    <AppShell title="Играть" onBack={onBack}>
      <div className="play-lobby">
        <section
          className={[
            "play-stage",
            selectedMode
              ? `play-stage--${selectedMode.atmosphere}`
              : "play-stage--welcome",
          ].join(" ")}
        >
          {!selectedMode ? (
            <div className="play-welcome">
              <p className="play-welcome-kicker">Space Chess</p>
              <h2 className="play-welcome-title">Мир сражений</h2>
              <p className="play-welcome-text">
                Добро пожаловать в мир сражений. Выберите режим на правой
                панели — здесь появятся его настройки.
              </p>
            </div>
          ) : (
            <div className="play-mode-setup" key={selectedMode.id}>
              <p className="play-mode-kicker">Режим</p>
              <h2 className="play-mode-title">{selectedMode.label}</h2>
              <p className="play-mode-blurb">{selectedMode.blurb}</p>

              <div className="play-mode-panel">
                <p className="play-mode-panel-title">Настройки</p>
                {selectedMode.id === "classic" ? (
                  <>
                    <p className="play-mode-panel-note">
                      Пошаговая партия 8×8. Локальная игра: две вкладки
                      (Игрок 1 и Игрок 2) на одном компьютере, без сети.
                    </p>
                    <div className="play-channel-row">
                      <button
                        type="button"
                        className={`play-channel-btn${classicChannel === "online" ? " is-active" : ""}`}
                        onClick={handleClassicOnline}
                      >
                        Онлайн
                      </button>
                      <button
                        type="button"
                        className={`play-channel-btn${classicChannel === "offline" ? " is-active" : ""}`}
                        onClick={handleClassicOffline}
                      >
                        Локальная (2 окна)
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="play-mode-panel-note">
                    Параметры этого режима появятся позже.
                  </p>
                )}
              </div>
            </div>
          )}

          {statusMessage && (
            <p className="play-status" role="status">
              {statusMessage}
            </p>
          )}
        </section>

        <aside className="play-modes-panel">
          <header className="play-modes-header">
            <h2>Режимы</h2>
            <p>Выберите тип сражения</p>
          </header>

          <nav className="play-modes-list" aria-label="Режимы игры">
            {PLAY_MODES_CATALOG.map((mode) => {
              const active = mode.id === selectedModeId;
              return (
                <button
                  key={mode.id}
                  type="button"
                  className={`play-mode-btn${active ? " is-active" : ""}`}
                  onClick={() => {
                    setSelectedModeId(mode.id);
                    setClassicChannel(null);
                    setStatusMessage("");
                  }}
                >
                  <span className="play-mode-btn-mark" aria-hidden>
                    {active ? "▸" : "›"}
                  </span>
                  <span className="play-mode-btn-label">{mode.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="play-modes-footer">
            <button
              type="button"
              className={`play-start-btn${canStart ? " is-ready" : ""}`}
              disabled={!canStart}
              onClick={handleStart}
            >
              Играть
            </button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

export default PlayScreen;

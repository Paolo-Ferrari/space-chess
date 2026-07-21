import { useEffect, useState } from "react";

import { AudioManager } from "../../../services/audio";
import GameButton from "../../components/buttons/GameButton/GameButton";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import ScreenHeader from "../../components/navigation/ScreenHeader/ScreenHeader";
import Panel from "../../components/panels/Panel/Panel";
import WindowFrame from "../../components/windows/WindowFrame/WindowFrame";

import "./SettingsStubScreen.css";

interface SettingsStubScreenProps {
  onBack: () => void;
}

function SettingsStubScreen({ onBack }: SettingsStubScreenProps) {
  const initial = AudioManager.getSettings();
  const [volume, setVolume] = useState(Math.round(initial.masterVolume * 100));
  const [muted, setMuted] = useState(initial.muted);
  const [sfx, setSfx] = useState(initial.sfxEnabled);
  const [music, setMusic] = useState(initial.musicEnabled);
  const [showTips, setShowTips] = useState(true);

  useEffect(() => {
    AudioManager.setMasterVolume(volume / 100);
  }, [volume]);

  return (
    <ScreenLayout className="screen-enter">
      <ScreenHeader
        title="Настройки"
        subtitle="Аудио и HUD. Громкость сохраняется локально."
        onBack={onBack}
      />
      <WindowFrame>
        <div className="settings-stub">
          <Panel eyebrow="Audio Manager" title="Звук">
            <label className="settings-stub__row">
              <span>Общий уровень: {volume}%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
              />
            </label>
            <label className="settings-stub__check">
              <input
                type="checkbox"
                checked={muted}
                onChange={(event) => {
                  setMuted(event.target.checked);
                  AudioManager.setMuted(event.target.checked);
                }}
              />
              Без звука
            </label>
            <label className="settings-stub__check">
              <input
                type="checkbox"
                checked={sfx}
                onChange={(event) => {
                  setSfx(event.target.checked);
                  AudioManager.setSfxEnabled(event.target.checked);
                  if (event.target.checked) {
                    AudioManager.play("ui_select");
                  }
                }}
              />
              Эффекты (SFX)
            </label>
            <label className="settings-stub__check">
              <input
                type="checkbox"
                checked={music}
                onChange={(event) => {
                  setMusic(event.target.checked);
                  AudioManager.setMusicEnabled(event.target.checked);
                }}
              />
              Музыка меню
            </label>
          </Panel>

          <Panel eyebrow="HUD" title="Интерфейс">
            <label className="settings-stub__check">
              <input
                type="checkbox"
                checked={showTips}
                onChange={(event) => {
                  setShowTips(event.target.checked);
                  try {
                    localStorage.setItem(
                      "overclock.tutorial.dismissed",
                      event.target.checked ? "0" : "1",
                    );
                  } catch {
                    /* ignore */
                  }
                }}
              />
              Показывать обучение при входе
            </label>
            <GameButton
              variant="secondary"
              onClick={() => {
                try {
                  localStorage.removeItem("overclock.tutorial.dismissed");
                } catch {
                  /* ignore */
                }
                AudioManager.play("ui_confirm");
              }}
            >
              Сбросить обучение
            </GameButton>
          </Panel>
        </div>
        <div className="settings-stub__footer">
          <GameButton
            variant="ghost"
            onClick={() => {
              AudioManager.play("ui_select");
              onBack();
            }}
          >
            Назад
          </GameButton>
        </div>
      </WindowFrame>
    </ScreenLayout>
  );
}

export default SettingsStubScreen;

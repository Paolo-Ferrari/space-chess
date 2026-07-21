import { useEffect } from "react";

import { BRAND, BRAND_STATUS, BRAND_TERMS } from "../../../brand/brand.config";
import { AudioManager } from "../../../services/audio";
import BrandHeader from "../../brand/BrandHeader/BrandHeader";
import SystemBanner from "../../brand/SystemBanner/SystemBanner";
import GameButton from "../../components/buttons/GameButton/GameButton";
import TutorialBanner from "../../components/hints/TutorialBanner/TutorialBanner";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import WindowFrame from "../../components/windows/WindowFrame/WindowFrame";

import "./MainMenuScreen.css";

interface MainMenuScreenProps {
  playerName?: string | null;
  onPlay: () => void;
  onCreateArmy: () => void;
  onProfile: () => void;
  onMyArmies: () => void;
  onMatchHistory: () => void;
  onCollection: () => void;
  onSettings: () => void;
}

function MainMenuScreen({
  playerName,
  onPlay,
  onCreateArmy,
  onProfile,
  onCollection,
  onSettings,
}: MainMenuScreenProps) {
  useEffect(() => {
    void AudioManager.startMenuMusic();
    return () => {
      AudioManager.stopMenuMusic();
    };
  }, []);

  const click = (action: () => void) => {
    AudioManager.play("ui_confirm");
    action();
  };

  return (
    <ScreenLayout className="main-menu-screen atmosphere-city screen-enter">
      <div className="main-menu-screen__skyline" aria-hidden />
      <WindowFrame className="main-menu-screen__window brand-window">
        <BrandHeader status={BRAND_STATUS.overclockEnabled} />
        <h1 className="main-menu-screen__title visually-hidden">
          {BRAND.fullName}
        </h1>
        <p className="main-menu-screen__slogan">{BRAND.tagline}</p>
        <SystemBanner
          tone="warn"
          message={
            playerName
              ? `${BRAND_STATUS.neuralLinkActive} · ${playerName}`
              : "GUEST LINK · войдите, чтобы сохранить прогресс"
          }
        />
        <nav className="main-menu-screen__nav" aria-label="Главное меню">
          <GameButton className="game-btn--block" onClick={() => click(onPlay)}>
            Играть
          </GameButton>
          <GameButton
            className="game-btn--block"
            variant="secondary"
            onClick={() => click(onCreateArmy)}
          >
            Армия
          </GameButton>
          <GameButton
            className="game-btn--block"
            variant="ghost"
            onClick={() => click(onCollection)}
          >
            Коллекция
          </GameButton>
          <GameButton
            className="game-btn--block"
            variant="ghost"
            onClick={() => click(onProfile)}
          >
            Профиль
          </GameButton>
          <GameButton
            className="game-btn--block"
            variant="ghost"
            onClick={() => click(onSettings)}
          >
            Настройки
          </GameButton>
        </nav>
        <p className="main-menu-screen__footnote">
          {BRAND.shortName.toUpperCase()} · {BRAND_TERMS.match} ready
        </p>
      </WindowFrame>
      <TutorialBanner />
    </ScreenLayout>
  );
}

export default MainMenuScreen;

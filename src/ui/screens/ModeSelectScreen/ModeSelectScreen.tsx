import type { ModeStubKind } from "../../../app/navigation";
import { BRAND_TERMS } from "../../../brand/brand.config";
import GameButton from "../../components/buttons/GameButton/GameButton";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import ScreenHeader from "../../components/navigation/ScreenHeader/ScreenHeader";
import WindowFrame from "../../components/windows/WindowFrame/WindowFrame";

import "./ModeSelectScreen.css";

interface ModeSelectScreenProps {
  onBack: () => void;
  onSelectMode: (mode: ModeStubKind) => void;
}

function ModeSelectScreen({ onBack, onSelectMode }: ModeSelectScreenProps) {
  return (
    <ScreenLayout>
      <ScreenHeader
        title="Режим протокола"
        subtitle={`Выберите сценарий: ${BRAND_TERMS.matchRu}.`}
        onBack={onBack}
      />
      <WindowFrame>
        <div className="mode-select__grid">
          <GameButton
            className="game-btn--block"
            onClick={() => onSelectMode("solo")}
          >
            Игрок против ИИ
          </GameButton>
          <GameButton
            className="game-btn--block"
            variant="secondary"
            onClick={() => onSelectMode("friend")}
          >
            Игра с другом (hotseat)
          </GameButton>
          <GameButton
            className="game-btn--block"
            variant="ghost"
            onClick={() => onSelectMode("tutorial")}
          >
            Обучение
          </GameButton>
        </div>
      </WindowFrame>
    </ScreenLayout>
  );
}

export default ModeSelectScreen;

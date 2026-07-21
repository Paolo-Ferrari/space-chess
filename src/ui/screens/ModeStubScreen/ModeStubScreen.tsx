import type { ModeStubKind } from "../../../app/navigation";
import {
  AI_DIFFICULTY_LABELS,
  type AiDifficulty,
} from "../../../domain/ai/types";
import GameButton from "../../components/buttons/GameButton/GameButton";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import ScreenHeader from "../../components/navigation/ScreenHeader/ScreenHeader";
import WindowFrame from "../../components/windows/WindowFrame/WindowFrame";

import "./ModeStubScreen.css";

const LABELS: Record<ModeStubKind, string> = {
  solo: "Игрок против ИИ",
  friend: "Игра с другом",
  tutorial: "Обучение",
};

interface ModeStubScreenProps {
  mode: ModeStubKind;
  difficulty: AiDifficulty;
  onDifficultyChange: (difficulty: AiDifficulty) => void;
  onBack: () => void;
  onContinue: () => void;
}

const DIFFICULTIES: AiDifficulty[] = ["easy", "normal", "hard"];

function ModeStubScreen({
  mode,
  difficulty,
  onDifficultyChange,
  onBack,
  onContinue,
}: ModeStubScreenProps) {
  const isSolo = mode === "solo";

  return (
    <ScreenLayout>
      <ScreenHeader
        title={LABELS[mode]}
        subtitle={
          isSolo
            ? "Соберите боевую сеть и сразитесь с компьютером на тех же правилах, что и игрок."
            : "Hotseat: оба игрока на одном экране."
        }
        onBack={onBack}
      />
      <WindowFrame>
        {isSolo ? (
          <div className="mode-stub__ai">
            <p className="mode-stub__lead">
              Классический игровой ИИ: ходит, атакует, использует способности и
              защищает нейро-командира.
            </p>
            <p className="mode-stub__label">Сложность</p>
            <div className="mode-stub__difficulties" role="group" aria-label="Сложность ИИ">
              {DIFFICULTIES.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`mode-stub__diff ${
                    difficulty === level ? "is-active" : ""
                  }`}
                  onClick={() => onDifficultyChange(level)}
                >
                  {AI_DIFFICULTY_LABELS[level]}
                </button>
              ))}
            </div>
            <ul className="mode-stub__hints">
              <li>Easy — больше ошибок, агрессивный стиль</li>
              <li>Normal — базовая стратегия, защита нейро-командира</li>
              <li>Hard — лучший выбор, приоритет убийства нейро-командира</li>
            </ul>
          </div>
        ) : (
          <p className="mode-stub__lead">
            Режим «{LABELS[mode]}». ИИ отключён — оба хода делает человек.
          </p>
        )}
        <div className="mode-stub__actions">
          <GameButton onClick={onContinue}>Создать боевую сеть</GameButton>
          <GameButton variant="ghost" onClick={onBack}>
            К режимам
          </GameButton>
        </div>
      </WindowFrame>
    </ScreenLayout>
  );
}

export default ModeStubScreen;

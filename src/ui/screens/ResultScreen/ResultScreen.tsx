import { BRAND_TERMS } from "../../../brand/brand.config";
import GameButton from "../../components/buttons/GameButton/GameButton";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import WindowFrame from "../../components/windows/WindowFrame/WindowFrame";
import { getFactionById } from "../../../data/catalog/armyBuilder";
import { AI_DIFFICULTY_LABELS } from "../../../domain/ai/types";

import "./ResultScreen.css";

interface ResultMatchInfo {
  army: { name: string; factionId: string };
  mode: "ai" | "hotseat";
  difficulty: "easy" | "normal" | "hard";
  turnCount: number;
  durationMs: number;
}

interface ResultScreenProps {
  outcome: "victory" | "defeat";
  match?: ResultMatchInfo | null;
  onRetry: () => void;
  onMenu: () => void;
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ResultScreen({
  outcome,
  match = null,
  onRetry,
  onMenu,
}: ResultScreenProps) {
  const victory = outcome === "victory";
  const faction = match
    ? getFactionById(match.army.factionId)
    : undefined;

  return (
    <ScreenLayout>
      <WindowFrame className={`result-screen result-screen--${outcome}`}>
        <p className="result-screen__eyebrow">
          {victory ? "Канал захвачен" : "Сигнал потерян"}
        </p>
        <h1 className="result-screen__title">{victory ? "Победа" : "Поражение"}</h1>
        <p className="result-screen__lead">
          {victory
            ? "Результат записан в историю протоколов профиля."
            : "Поражение сохранено в журнале оператора."}
        </p>

        <dl className="result-screen__stats">
          <div>
            <dt>Ходов</dt>
            <dd>{match?.turnCount ?? "—"}</dd>
          </div>
          <div>
            <dt>Длительность</dt>
            <dd>{match ? formatDuration(match.durationMs) : "—"}</dd>
          </div>
          <div>
            <dt>{BRAND_TERMS.armyRu}</dt>
            <dd>{match?.army.name ?? "—"}</dd>
          </div>
          <div>
            <dt>Фракция</dt>
            <dd>{faction?.name ?? "—"}</dd>
          </div>
          <div>
            <dt>Режим</dt>
            <dd>
              {match?.mode === "ai"
                ? `ИИ · ${AI_DIFFICULTY_LABELS[match.difficulty]}`
                : match?.mode === "hotseat"
                  ? "Hotseat"
                  : "—"}
            </dd>
          </div>
        </dl>

        <div className="result-screen__actions">
          <GameButton onClick={onRetry}>Повторить</GameButton>
          <GameButton variant="ghost" onClick={onMenu}>
            В меню
          </GameButton>
        </div>
      </WindowFrame>
    </ScreenLayout>
  );
}

export default ResultScreen;

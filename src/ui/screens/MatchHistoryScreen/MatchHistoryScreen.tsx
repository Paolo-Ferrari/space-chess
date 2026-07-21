import { BRAND_TERMS } from "../../../brand/brand.config";
import { MatchHistoryService } from "../../../services/account/matchHistoryService";
import type { AuthSession } from "../../../domain/account/types";
import { getFactionById } from "../../../data/catalog/armyBuilder";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import ScreenHeader from "../../components/navigation/ScreenHeader/ScreenHeader";
import Panel from "../../components/panels/Panel/Panel";

import "./MatchHistoryScreen.css";

interface MatchHistoryScreenProps {
  session: AuthSession;
  onBack: () => void;
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function resultLabel(result: string): string {
  if (result === "victory") return "Победа";
  if (result === "defeat") return "Поражение";
  return "Ничья";
}

function MatchHistoryScreen({ session, onBack }: MatchHistoryScreenProps) {
  const entries = MatchHistoryService.listForUser(session.userId);

  return (
    <ScreenLayout wide>
      <ScreenHeader
        title={BRAND_TERMS.matchHistoryRu}
        subtitle={`Дата, противник, результат, ${BRAND_TERMS.armyRu.toLowerCase()}, длительность.`}
        onBack={onBack}
      />

      {entries.length === 0 ? (
        <Panel eyebrow="Журнал" title="Пока пусто">
          <p className="match-history__empty">
            Сыграйте {BRAND_TERMS.matchRu.toLowerCase()} под своим аккаунтом —
            результат появится здесь.
          </p>
        </Panel>
      ) : (
        <ul className="match-history__list">
          {entries.map((entry) => {
            const faction = getFactionById(entry.factionId);
            return (
              <li key={entry.id} className={`match-history__row is-${entry.result}`}>
                <div>
                  <strong>{resultLabel(entry.result)}</strong>
                  <span>
                    {new Date(entry.playedAt).toLocaleString("ru-RU")}
                  </span>
                </div>
                <div>
                  <span>vs {entry.opponentLabel}</span>
                  <span>
                    {entry.armyName} · {faction?.name ?? entry.factionId}
                  </span>
                </div>
                <div>
                  <span>{entry.turnCount} ход.</span>
                  <span>{formatDuration(entry.durationMs)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </ScreenLayout>
  );
}

export default MatchHistoryScreen;

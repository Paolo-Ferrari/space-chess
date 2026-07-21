import { useState } from "react";

import GameButton from "../../components/buttons/GameButton/GameButton";
import EventLog from "../../components/game/EventLog/EventLog";
import PlayerPanel from "../../components/game/PlayerPanel/PlayerPanel";
import StubBoard from "../../components/game/StubBoard/StubBoard";
import UnitInfoPanel from "../../components/game/UnitInfoPanel/UnitInfoPanel";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import ScreenHeader from "../../components/navigation/ScreenHeader/ScreenHeader";
import Modal from "../../components/modals/Modal/Modal";
import { DEMO_MATCH_LOG } from "../../stubs/demoData";

import "./MatchStubScreen.css";

interface MatchStubScreenProps {
  onMenu: () => void;
  onVictory: () => void;
  onDefeat: () => void;
}

function MatchStubScreen({ onMenu, onVictory, onDefeat }: MatchStubScreenProps) {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([...DEMO_MATCH_LOG]);
  const [turn, setTurn] = useState(1);
  const [endOpen, setEndOpen] = useState(false);

  const selectedLabel = selectedCell
    ? `Клетка ${selectedCell.replace("-", " / ")}`
    : null;

  const endTurn = () => {
    const next = turn + 1;
    setTurn(next);
    setLog((prev) => [`Ход ${next}: ход завершён (заглушка).`, ...prev]);
  };

  return (
    <ScreenLayout wide className="match-stub">
      <ScreenHeader
        title="Матч"
        subtitle="Визуальный макет поля. Боевой логики нет."
        onBack={onMenu}
        backLabel="В меню"
        actions={
          <>
            <GameButton variant="secondary" onClick={endTurn}>
              Завершить ход
            </GameButton>
            <GameButton variant="danger" onClick={() => setEndOpen(true)}>
              Завершить матч
            </GameButton>
          </>
        }
      />

      <div className="match-stub__layout">
        <div className="match-stub__side">
          <PlayerPanel
            side="player"
            name="Вы"
            factionLabel="Neon Syndicate"
            hpLabel="100%"
            active
          />
          <UnitInfoPanel selectedLabel={selectedLabel} />
        </div>

        <div className="match-stub__board-wrap">
          <StubBoard selectedCell={selectedCell} onSelectCell={setSelectedCell} />
        </div>

        <div className="match-stub__side">
          <PlayerPanel
            side="enemy"
            name="Соперник"
            factionLabel="Chrome Legion"
            hpLabel="100%"
          />
          <EventLog entries={log} />
        </div>
      </div>

      <Modal
        open={endOpen}
        title="Завершить матч"
        onClose={() => setEndOpen(false)}
        footer={
          <>
            <GameButton
              onClick={() => {
                setEndOpen(false);
                onVictory();
              }}
            >
              Победа
            </GameButton>
            <GameButton
              variant="danger"
              onClick={() => {
                setEndOpen(false);
                onDefeat();
              }}
            >
              Поражение
            </GameButton>
            <GameButton variant="ghost" onClick={() => setEndOpen(false)}>
              Отмена
            </GameButton>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          Выберите экран результата для прототипа. Это не правило игры — только навигация UI.
        </p>
      </Modal>
    </ScreenLayout>
  );
}

export default MatchStubScreen;

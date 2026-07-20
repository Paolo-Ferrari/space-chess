import AppShell from "../../shell/AppShell/AppShell";

import "./LocalMatchHostScreen.css";

interface LocalMatchHostScreenProps {
  sessionId: string;
  urls: [string, string];
  opened: [boolean, boolean];
  onReopen: () => void;
  onOpenPlayerTwo: () => void;
  onContinueAsPlayerOne: () => void;
  onMenu: () => void;
}

function LocalMatchHostScreen({
  urls,
  opened,
  onReopen,
  onOpenPlayerTwo,
  onContinueAsPlayerOne,
  onMenu,
}: LocalMatchHostScreenProps) {
  const playerTwoOpen = opened[1];

  return (
    <AppShell title="Локальная игра · 2 окна" onBack={onMenu}>
      <div className="local-host">
        <p className="local-host-lead">
          Это окно — <strong>Игрок 1</strong>. Рядом должно открыться окно{" "}
          <strong>Игрока 2</strong>. Ходите по очереди в своих окнах; партия
          общая.
        </p>

        {!playerTwoOpen && (
          <p className="local-host-warn" role="status">
            Окно Игрока 2 не открылось (браузер мог заблокировать всплывающие
            окна). Разрешите pop-up и нажмите кнопку ниже.
          </p>
        )}

        <div className="local-host-links">
          <a
            className="local-host-link"
            href={urls[0]}
            target="_blank"
            rel="noreferrer"
          >
            Игрок 1
          </a>
          <a
            className="local-host-link"
            href={urls[1]}
            target="_blank"
            rel="noreferrer"
          >
            Игрок 2
          </a>
        </div>

        <div className="local-host-actions">
          <button
            type="button"
            className="local-host-btn primary"
            onClick={onOpenPlayerTwo}
          >
            Открыть окно Игрока 2
          </button>
          <button
            type="button"
            className="local-host-btn"
            onClick={onContinueAsPlayerOne}
          >
            Играть как Игрок 1
          </button>
          <button type="button" className="local-host-btn" onClick={onReopen}>
            Открыть оба окна
          </button>
          <button type="button" className="local-host-btn" onClick={onMenu}>
            В меню
          </button>
        </div>
      </div>
    </AppShell>
  );
}

export default LocalMatchHostScreen;

import { useState } from "react";

import GameButton from "@/ui/components/buttons/GameButton/GameButton";

import "./TutorialBanner.css";

const TIPS = [
  {
    id: "army",
    title: "Боевая сеть",
    body: "Перетащите юнитов на клетки A1–H2, добавьте нейро-командира и риппердока, затем сохраните формацию.",
  },
  {
    id: "move",
    title: "Ход",
    body: "Выберите союзника — голубые клетки доступны для движения. Клик по клетке перемещает фигуру.",
  },
  {
    id: "attack",
    title: "Атака и способности",
    body: "Розовые клетки — цели атаки. Оранжевые — цели способности. Победа: уничтожьте вражеского командира.",
  },
] as const;

interface TutorialBannerProps {
  storageKey?: string;
}

function TutorialBanner({
  storageKey = "overclock.tutorial.dismissed",
}: TutorialBannerProps) {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(storageKey) !== "1";
    } catch {
      return true;
    }
  });
  const [step, setStep] = useState(0);

  if (!open) {
    return null;
  }

  const tip = TIPS[step];

  return (
    <aside className="tutorial-banner" role="dialog" aria-label="Обучение">
      <p className="tutorial-banner__kicker">
        PROTOCOL BRIEF · {step + 1}/{TIPS.length}
      </p>
      <h3>{tip.title}</h3>
      <p>{tip.body}</p>
      <div className="tutorial-banner__actions">
        {step < TIPS.length - 1 ? (
          <GameButton
            onClick={() => {
              setStep((s) => s + 1);
            }}
          >
            Далее
          </GameButton>
        ) : (
          <GameButton
            onClick={() => {
              try {
                localStorage.setItem(storageKey, "1");
              } catch {
                /* ignore */
              }
              setOpen(false);
            }}
          >
            В бой
          </GameButton>
        )}
        <GameButton
          variant="ghost"
          onClick={() => {
            try {
              localStorage.setItem(storageKey, "1");
            } catch {
              /* ignore */
            }
            setOpen(false);
          }}
        >
          Пропустить
        </GameButton>
      </div>
    </aside>
  );
}

export default TutorialBanner;

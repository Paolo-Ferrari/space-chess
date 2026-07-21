import type { ReactNode } from "react";

import GameButton from "../../buttons/GameButton/GameButton";

import "./ScreenHeader.css";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  actions?: ReactNode;
}

function ScreenHeader({
  title,
  subtitle,
  onBack,
  backLabel = "Назад",
  actions,
}: ScreenHeaderProps) {
  return (
    <header className="screen-header">
      <div className="screen-header__text">
        {onBack ? (
          <GameButton variant="ghost" className="screen-header__back" onClick={onBack}>
            {backLabel}
          </GameButton>
        ) : null}
        <div>
          <h1 className="screen-header__title">{title}</h1>
          {subtitle ? <p className="screen-header__subtitle">{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="screen-header__actions">{actions}</div> : null}
    </header>
  );
}

export default ScreenHeader;

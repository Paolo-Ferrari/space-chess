import type { ButtonHTMLAttributes, ReactNode } from "react";

import "./GameButton.css";

type GameButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GameButtonVariant;
  children: ReactNode;
}

function GameButton({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...rest
}: GameButtonProps) {
  return (
    <button
      type={type}
      className={`game-btn game-btn--${variant} ${className}`.trim()}
      {...rest}
    >
      <span className="game-btn__mark" aria-hidden>
        ›
      </span>
      <span className="game-btn__label">{children}</span>
    </button>
  );
}

export default GameButton;

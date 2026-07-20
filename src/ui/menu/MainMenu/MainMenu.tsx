import type { AppScreen } from "../../../app/navigation";
import BrandMark from "../../shared/BrandMark/BrandMark";

import "./MainMenu.css";

interface MainMenuProps {
  onNavigate: (screen: AppScreen) => void;
}

const ITEMS: Array<{ id: AppScreen; label: string }> = [
  { id: "play", label: "Играть" },
  { id: "armies", label: "Армии" },
  { id: "settings", label: "Настройки" },
];

function MainMenu({ onNavigate }: MainMenuProps) {
  return (
    <div className="main-menu">
      <div className="main-menu-frame">
        <div className="main-menu-brand">
          <BrandMark size="lg" />
          <div className="main-menu-brand-text">
            <p className="main-menu-kicker">Космические шахматы</p>
            <h1 className="main-menu-title">Space Chess</h1>
          </div>
        </div>
        <p className="main-menu-slogan">
          Шахматы умерли в XXI веке. В XXII они научились стрелять.
        </p>
        <nav className="main-menu-nav" aria-label="Главное меню">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="main-menu-button"
              onClick={() => onNavigate(item.id)}
            >
              <span className="main-menu-button-mark">›</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default MainMenu;

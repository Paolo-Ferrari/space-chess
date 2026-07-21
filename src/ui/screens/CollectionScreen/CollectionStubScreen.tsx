import GameButton from "../../components/buttons/GameButton/GameButton";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import ScreenHeader from "../../components/navigation/ScreenHeader/ScreenHeader";
import Panel from "../../components/panels/Panel/Panel";
import { DEMO_UNITS } from "../../stubs/demoData";
import WindowFrame from "../../components/windows/WindowFrame/WindowFrame";

import "./CollectionStubScreen.css";

interface CollectionStubScreenProps {
  onBack: () => void;
}

function CollectionStubScreen({ onBack }: CollectionStubScreenProps) {
  return (
    <ScreenLayout wide>
      <ScreenHeader
        title="Коллекция"
        subtitle="Витрина тестовых карточек. Каталог игры здесь не подключён."
        onBack={onBack}
      />
      <WindowFrame>
        <div className="collection-stub__grid">
          {DEMO_UNITS.map((unit) => (
            <Panel key={unit.id} eyebrow={unit.role} title={unit.name}>
              <p className="collection-stub__meta">Стоимость: {unit.cost}</p>
              <p className="collection-stub__meta">Статус: заглушка</p>
            </Panel>
          ))}
        </div>
        <div className="collection-stub__footer">
          <GameButton variant="ghost" onClick={onBack}>
            В меню
          </GameButton>
        </div>
      </WindowFrame>
    </ScreenLayout>
  );
}

export default CollectionStubScreen;

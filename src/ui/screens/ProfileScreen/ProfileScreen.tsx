import { ProgressService } from "../../../services/account";
import { AuthService } from "../../../services/account/authService";
import type { AuthSession } from "../../../domain/account/types";
import { getFactionById } from "../../../data/catalog/armyBuilder";
import GameButton from "../../components/buttons/GameButton/GameButton";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import ScreenHeader from "../../components/navigation/ScreenHeader/ScreenHeader";
import Panel from "../../components/panels/Panel/Panel";
import WindowFrame from "../../components/windows/WindowFrame/WindowFrame";

import "./ProfileScreen.css";

interface ProfileScreenProps {
  session: AuthSession;
  onBack: () => void;
  onLogout: () => void;
  onHistory: () => void;
  onArmies: () => void;
}

function ProfileScreen({
  session,
  onBack,
  onLogout,
  onHistory,
  onArmies,
}: ProfileScreenProps) {
  const view = ProgressService.profileView(session.userId);
  if (!view) {
    return (
      <ScreenLayout>
        <ScreenHeader title="Профиль" onBack={onBack} />
        <WindowFrame>
          <p>Сессия недействительна.</p>
          <GameButton onClick={onLogout}>Выйти</GameButton>
        </WindowFrame>
      </ScreenLayout>
    );
  }

  const { account, winRate, favoriteFactionName, favoriteModeLabel } = view;
  const created = new Date(account.createdAt).toLocaleDateString("ru-RU");

  return (
    <ScreenLayout>
      <ScreenHeader
        title="Профиль"
        subtitle={`Оператор · с ${created}`}
        onBack={onBack}
      />
      <WindowFrame>
        <div className="profile-screen">
          <header className="profile-screen__hero">
            <p className="profile-screen__eyebrow">Callsign</p>
            <h2>{account.displayName}</h2>
            <p className="profile-screen__id">{account.id}</p>
          </header>

          <Panel eyebrow="Статистика" title="Боевой след">
            <dl className="profile-screen__stats">
              <div>
                <dt>Победы</dt>
                <dd>{account.stats.wins}</dd>
              </div>
              <div>
                <dt>Поражения</dt>
                <dd>{account.stats.losses}</dd>
              </div>
              <div>
                <dt>Протоколы</dt>
                <dd>{account.stats.matchesPlayed}</dd>
              </div>
              <div>
                <dt>Винрейт</dt>
                <dd>{winRate}%</dd>
              </div>
              <div>
                <dt>Любимая фракция</dt>
                <dd>{favoriteFactionName}</dd>
              </div>
              <div>
                <dt>Стиль</dt>
                <dd>{favoriteModeLabel}</dd>
              </div>
            </dl>
          </Panel>

          {account.stats.favoriteFactionId ? (
            <p className="profile-screen__note">
              Чаще всего:{" "}
              {getFactionById(account.stats.favoriteFactionId)?.tag ?? "—"}
            </p>
          ) : null}

          <div className="profile-screen__actions">
            <GameButton onClick={onArmies}>Мои боевые сети</GameButton>
            <GameButton variant="secondary" onClick={onHistory}>
              История протоколов
            </GameButton>
            <GameButton
              variant="ghost"
              onClick={() => {
                AuthService.logout();
                onLogout();
              }}
            >
              Выйти
            </GameButton>
          </div>
        </div>
      </WindowFrame>
    </ScreenLayout>
  );
}

export default ProfileScreen;

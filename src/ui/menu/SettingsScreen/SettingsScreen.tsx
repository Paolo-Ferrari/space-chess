import AppShell from "../../shell/AppShell/AppShell";

import "./SettingsScreen.css";

interface SettingsScreenProps {
  onBack: () => void;
}

function SettingsScreen({ onBack }: SettingsScreenProps) {
  return (
    <AppShell title="Настройки" onBack={onBack}>
      <div className="settings-screen">
        <p>Настройки матча и интерфейса появятся здесь.</p>
        <p className="settings-note">
          Сейчас доступен раздел «Армии».
        </p>
      </div>
    </AppShell>
  );
}

export default SettingsScreen;

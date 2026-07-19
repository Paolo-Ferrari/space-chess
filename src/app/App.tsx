import { useCallback, useState } from "react";

import type { MatchConfig } from "../domain/match/match.types";
import ArmiesScreen from "../ui/armies/ArmiesScreen/ArmiesScreen";
import MatchScreen from "../ui/match/MatchScreen/MatchScreen";
import MatchSetupScreen from "../ui/match/MatchSetupScreen/MatchSetupScreen";
import MainMenu from "../ui/menu/MainMenu/MainMenu";
import PlayScreen from "../ui/menu/PlayScreen/PlayScreen";
import SettingsScreen from "../ui/menu/SettingsScreen/SettingsScreen";

import type { AppScreen } from "./navigation";

function App() {
  const [screen, setScreen] = useState<AppScreen>("menu");
  const [matchConfig, setMatchConfig] = useState<MatchConfig | null>(null);
  const [matchKey, setMatchKey] = useState(0);

  const goMenu = useCallback(() => {
    setScreen("menu");
    setMatchConfig(null);
  }, []);

  if (screen === "menu") {
    return <MainMenu onNavigate={setScreen} />;
  }

  if (screen === "play") {
    return (
      <PlayScreen
        onBack={goMenu}
        onStartClassicOffline={() => setScreen("match-setup")}
      />
    );
  }

  if (screen === "armies") {
    return <ArmiesScreen onBack={goMenu} />;
  }

  if (screen === "settings") {
    return <SettingsScreen onBack={goMenu} />;
  }

  if (screen === "match-setup") {
    return (
      <MatchSetupScreen
        onBack={() => setScreen("play")}
        onStart={(config) => {
          setMatchConfig(config);
          setMatchKey((value) => value + 1);
          setScreen("match");
        }}
      />
    );
  }

  if (screen === "match" && matchConfig) {
    return (
      <MatchScreen
        key={matchKey}
        config={matchConfig}
        onMenu={goMenu}
        onRematch={() => {
          setMatchKey((value) => value + 1);
          setScreen("match-setup");
        }}
      />
    );
  }

  return <MainMenu onNavigate={setScreen} />;
}

export default App;

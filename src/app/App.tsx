import { useCallback, useMemo, useState } from "react";

import type { MatchConfig, PlayerId } from "../domain/match/match.types";
import {
  buildLocalMatchWindowUrl,
  clearLocalMatchRoute,
  clearLocalMatchSession,
  createLocalMatchSession,
  joinLocalMatchSession,
  launchLocalMatchWindows,
  launchPlayerTwoTab,
  parseLocalMatchRoute,
} from "../services/match/session/localMatchSession";
import type { MatchSessionSource } from "../services/match/session/matchSession.types";
import ArmiesScreen from "../ui/armies/ArmiesScreen/ArmiesScreen";
import LocalMatchHostScreen from "../ui/match/LocalMatchHostScreen/LocalMatchHostScreen";
import MatchScreen from "../ui/match/MatchScreen/MatchScreen";
import MatchSetupScreen from "../ui/match/MatchSetupScreen/MatchSetupScreen";
import MainMenu from "../ui/menu/MainMenu/MainMenu";
import PlayScreen from "../ui/menu/PlayScreen/PlayScreen";
import SettingsScreen from "../ui/menu/SettingsScreen/SettingsScreen";

import type { AppScreen } from "./navigation";

function readJoinedSession(): {
  session: MatchSessionSource;
  seat: PlayerId;
} | null {
  const route = parseLocalMatchRoute();
  if (!route) {
    return null;
  }
  const session = joinLocalMatchSession(route.sessionId);
  if (!session) {
    return null;
  }
  return { session, seat: route.seat };
}

function App() {
  const initialJoin = useMemo(() => readJoinedSession(), []);

  const [screen, setScreen] = useState<AppScreen>(() =>
    initialJoin ? "match" : "menu",
  );
  const [activeSession, setActiveSession] = useState<MatchSessionSource | null>(
    () => initialJoin?.session ?? null,
  );
  const [activeSeat, setActiveSeat] = useState<PlayerId>(
    () => initialJoin?.seat ?? 0,
  );
  const [hostSessionId, setHostSessionId] = useState<string | null>(null);
  const [hostUrls, setHostUrls] = useState<[string, string] | null>(null);
  const [playerTwoTabOpened, setPlayerTwoTabOpened] = useState(true);
  const [bootError] = useState(() => {
    if (parseLocalMatchRoute() && !initialJoin) {
      return "Сессия локальной партии не найдена. Запустите игру снова из «Играть».";
    }
    return "";
  });

  const leaveSeatWindow = useCallback(() => {
    activeSession?.dispose();
    setActiveSession(null);
    clearLocalMatchRoute();
    setHostSessionId(null);
    setHostUrls(null);
    setPlayerTwoTabOpened(true);
    setScreen("menu");
  }, [activeSession]);

  const leaveHost = useCallback(() => {
    if (hostSessionId) {
      clearLocalMatchSession(hostSessionId);
    }
    setHostSessionId(null);
    setHostUrls(null);
    setPlayerTwoTabOpened(true);
    setScreen("menu");
  }, [hostSessionId]);

  /**
   * Local dual play:
   * - THIS tab becomes Player 1 and enters the match immediately
   * - a second browser tab opens for Player 2
   */
  const startLocalDual = useCallback((config: MatchConfig) => {
    const session = createLocalMatchSession(config);
    const launch = launchPlayerTwoTab(session.sessionId);
    const seat0Url = buildLocalMatchWindowUrl(session.sessionId, 0);

    window.history.replaceState({}, "", seat0Url);
    setActiveSession(session);
    setActiveSeat(0);
    setHostSessionId(session.sessionId);
    setHostUrls(launch.urls);
    setPlayerTwoTabOpened(launch.opened);
    setScreen("match");
  }, []);

  const openPlayerTwoTab = useCallback(() => {
    if (!hostSessionId) {
      return;
    }
    const launch = launchPlayerTwoTab(hostSessionId);
    setHostUrls(launch.urls);
    setPlayerTwoTabOpened(launch.opened);
  }, [hostSessionId]);

  if (screen === "match" && activeSession) {
    return (
      <MatchScreen
        session={activeSession}
        seat={activeSeat}
        onMenu={leaveSeatWindow}
        playerTwoUrl={
          activeSeat === 0 && hostUrls ? hostUrls[1] : null
        }
        playerTwoNeedsOpen={
          activeSeat === 0 && !playerTwoTabOpened
        }
        onOpenPlayerTwo={activeSeat === 0 ? openPlayerTwoTab : undefined}
      />
    );
  }

  if (bootError) {
    return (
      <div className="local-boot-error">
        <p>{bootError}</p>
        <button
          type="button"
          onClick={() => {
            clearLocalMatchRoute();
            window.location.href = window.location.pathname;
          }}
        >
          На главную
        </button>
      </div>
    );
  }

  if (screen === "menu") {
    return <MainMenu onNavigate={setScreen} />;
  }

  if (screen === "play") {
    return (
      <PlayScreen
        onBack={() => setScreen("menu")}
        onStartClassicOffline={() => setScreen("match-setup")}
      />
    );
  }

  if (screen === "armies") {
    return <ArmiesScreen onBack={() => setScreen("menu")} />;
  }

  if (screen === "settings") {
    return <SettingsScreen onBack={() => setScreen("menu")} />;
  }

  if (screen === "match-setup") {
    return (
      <MatchSetupScreen
        onBack={() => setScreen("play")}
        onStart={startLocalDual}
      />
    );
  }

  if (screen === "local-match-host" && hostSessionId && hostUrls) {
    return (
      <LocalMatchHostScreen
        sessionId={hostSessionId}
        urls={hostUrls}
        opened={[true, playerTwoTabOpened]}
        onReopen={() => {
          const launch = launchLocalMatchWindows(hostSessionId);
          setHostUrls(launch.urls);
          setPlayerTwoTabOpened(launch.opened[1]);
        }}
        onOpenPlayerTwo={openPlayerTwoTab}
        onContinueAsPlayerOne={() => {
          const session =
            activeSession ?? joinLocalMatchSession(hostSessionId);
          if (!session) {
            return;
          }
          window.history.replaceState(
            {},
            "",
            buildLocalMatchWindowUrl(hostSessionId, 0),
          );
          setActiveSession(session);
          setActiveSeat(0);
          setScreen("match");
        }}
        onMenu={leaveHost}
      />
    );
  }

  return <MainMenu onNavigate={setScreen} />;
}

export default App;

import { useCallback, useEffect, useState } from "react";

import { applyDocumentBrandTitle } from "../brand/brand.config";
import type { AiDifficulty } from "../domain/ai";
import type { AuthSession } from "../domain/account/types";
import type { Army } from "../domain/armyBuilder/types";
import { AuthService } from "../services/account/authService";
import { MatchHistoryService } from "../services/account/matchHistoryService";
import { AI_DIFFICULTY_LABELS } from "../domain/ai/types";
import LoadingScreen from "../ui/brand/LoadingScreen/LoadingScreen";
import ArmyBuilderScreen from "../ui/screens/ArmyBuilderScreen/ArmyBuilderScreen";
import ArmyReadyScreen from "../ui/screens/ArmyReadyScreen/ArmyReadyScreen";
import AuthScreen from "../ui/screens/AuthScreen/AuthScreen";
import BattleScreen from "../ui/screens/BattleScreen/BattleScreen";
import CollectionStubScreen from "../ui/screens/CollectionScreen/CollectionStubScreen";
import MainMenuScreen from "../ui/screens/MainMenuScreen/MainMenuScreen";
import MatchHistoryScreen from "../ui/screens/MatchHistoryScreen/MatchHistoryScreen";
import ModeSelectScreen from "../ui/screens/ModeSelectScreen/ModeSelectScreen";
import ModeStubScreen from "../ui/screens/ModeStubScreen/ModeStubScreen";
import MyArmiesScreen from "../ui/screens/MyArmiesScreen/MyArmiesScreen";
import ProfileScreen from "../ui/screens/ProfileScreen/ProfileScreen";
import ResultScreen from "../ui/screens/ResultScreen/ResultScreen";
import SettingsStubScreen from "../ui/screens/SettingsScreen/SettingsStubScreen";

import { ThemeEngine } from "../theme";

import type {
  AppScreen,
  AuthReturnTarget,
  ModeStubKind,
} from "./navigation";

interface MatchContext {
  army: Army;
  mode: "ai" | "hotseat";
  difficulty: AiDifficulty;
  startedAt: number;
  turnCount: number;
  durationMs: number;
  result: "victory" | "defeat" | "draw";
}

/**
 * App shell: branded boot → account progress + army builder + battle.
 */
function App() {
  const [booting, setBooting] = useState(true);
  const [screen, setScreen] = useState<AppScreen>("menu");
  const [modeStub, setModeStub] = useState<ModeStubKind>("solo");
  const [aiDifficulty, setAiDifficulty] = useState<AiDifficulty>("normal");
  const [returnAfterArmy, setReturnAfterArmy] = useState<"match" | "menu">(
    "menu",
  );
  const [activeArmy, setActiveArmy] = useState<Army | null>(null);
  /** Live faction preview while drafting an army (before save). */
  const [previewFactionId, setPreviewFactionId] = useState<string | null>(
    null,
  );
  const [session, setSession] = useState<AuthSession | null>(() =>
    AuthService.getSession(),
  );
  const [authReturn, setAuthReturn] = useState<AuthReturnTarget>("menu");
  const [lastMatch, setLastMatch] = useState<MatchContext | null>(null);

  useEffect(() => {
    applyDocumentBrandTitle();
  }, []);

  useEffect(() => {
    ThemeEngine.apply(previewFactionId ?? activeArmy?.factionId ?? null);
  }, [previewFactionId, activeArmy?.factionId]);

  const finishBoot = useCallback(() => {
    setBooting(false);
  }, []);

  const opponentMode = modeStub === "solo" ? "ai" : "hotseat";

  const requireAuth = (target: AuthReturnTarget) => {
    const current = AuthService.getSession();
    if (current) {
      setSession(current);
      setScreen(
        target === "mode-select"
          ? "mode-select"
          : target === "army-create"
            ? "army-create"
            : target,
      );
      return;
    }
    setAuthReturn(target);
    setScreen("auth");
  };

  const goAuthenticated = (next: AuthSession) => {
    setSession(next);
    if (authReturn === "mode-select") {
      setScreen("mode-select");
    } else if (authReturn === "army-create") {
      setReturnAfterArmy("menu");
      setActiveArmy(null);
      setScreen("army-create");
    } else {
      setScreen(authReturn);
    }
  };

  const recordMatchIfNeeded = (
    result: "victory" | "defeat" | "draw",
    summary: { turnCount: number; durationMs: number },
  ) => {
    const current = AuthService.getSession();
    if (!current || !activeArmy) {
      return;
    }
    const opponentLabel =
      opponentMode === "ai"
        ? `ИИ (${AI_DIFFICULTY_LABELS[aiDifficulty]})`
        : "Hotseat P2";
    MatchHistoryService.record({
      userId: current.userId,
      opponentLabel,
      result,
      armyId: activeArmy.id,
      armyName: activeArmy.name,
      factionId: activeArmy.factionId,
      durationMs: summary.durationMs,
      turnCount: summary.turnCount,
      mode: opponentMode,
    });
    setLastMatch({
      army: activeArmy,
      mode: opponentMode,
      difficulty: aiDifficulty,
      startedAt: Date.now() - summary.durationMs,
      turnCount: summary.turnCount,
      durationMs: summary.durationMs,
      result,
    });
  };

  if (booting) {
    return <LoadingScreen onComplete={finishBoot} />;
  }

  if (screen === "menu") {
    return (
      <MainMenuScreen
        playerName={session?.displayName ?? null}
        onPlay={() => requireAuth("mode-select")}
        onCreateArmy={() => {
          setReturnAfterArmy("menu");
          setActiveArmy(null);
          setPreviewFactionId(null);
          requireAuth("army-create");
        }}
        onProfile={() => requireAuth("profile")}
        onMyArmies={() => requireAuth("my-armies")}
        onMatchHistory={() => requireAuth("match-history")}
        onCollection={() => setScreen("collection")}
        onSettings={() => setScreen("settings")}
      />
    );
  }

  if (screen === "auth") {
    return (
      <AuthScreen
        onBack={() => setScreen("menu")}
        onAuthenticated={goAuthenticated}
      />
    );
  }

  if (screen === "profile" && session) {
    return (
      <ProfileScreen
        session={session}
        onBack={() => setScreen("menu")}
        onLogout={() => {
          setSession(null);
          setScreen("menu");
        }}
        onHistory={() => setScreen("match-history")}
        onArmies={() => setScreen("my-armies")}
      />
    );
  }

  if (screen === "my-armies" && session) {
    return (
      <MyArmiesScreen
        session={session}
        onBack={() => setScreen("menu")}
        onCreate={() => {
          setReturnAfterArmy("menu");
          setActiveArmy(null);
          setScreen("army-create");
        }}
        onEdit={(army) => {
          setActiveArmy(army);
          setReturnAfterArmy("menu");
          setScreen("army-create");
        }}
        onPlay={(army) => {
          setActiveArmy(army);
          setReturnAfterArmy("match");
          setScreen("mode-select");
        }}
      />
    );
  }

  if (screen === "match-history" && session) {
    return (
      <MatchHistoryScreen
        session={session}
        onBack={() => setScreen("menu")}
      />
    );
  }

  if (screen === "mode-select") {
    return (
      <ModeSelectScreen
        onBack={() => setScreen("menu")}
        onSelectMode={(mode) => {
          setModeStub(mode);
          setScreen("mode-stub");
        }}
      />
    );
  }

  if (screen === "mode-stub") {
    return (
      <ModeStubScreen
        mode={modeStub}
        difficulty={aiDifficulty}
        onDifficultyChange={setAiDifficulty}
        onBack={() => setScreen("mode-select")}
        onContinue={() => {
          setReturnAfterArmy("match");
          if (activeArmy) {
            setScreen("army-ready");
          } else {
            setActiveArmy(null);
            setScreen("army-create");
          }
        }}
      />
    );
  }

  if (screen === "army-create") {
    return (
      <ArmyBuilderScreen
        initialArmy={activeArmy}
        ownerId={session?.userId ?? null}
        onFactionChange={setPreviewFactionId}
        onBack={() => {
          setPreviewFactionId(null);
          setScreen(returnAfterArmy === "match" ? "mode-stub" : "menu");
        }}
        onSaved={(army) => {
          setActiveArmy(army);
          setPreviewFactionId(army.factionId);
          setScreen("army-ready");
        }}
        onStartBattle={(army) => {
          setActiveArmy(army);
          setPreviewFactionId(army.factionId);
          setReturnAfterArmy("match");
          setScreen("match");
        }}
      />
    );
  }

  if (screen === "army-ready" && activeArmy) {
    return (
      <ArmyReadyScreen
        army={activeArmy}
        onEdit={() => setScreen("army-create")}
        onMenu={() => setScreen("menu")}
        onContinue={() => {
          setReturnAfterArmy("match");
          setScreen("match");
        }}
      />
    );
  }

  if (screen === "match" && activeArmy) {
    return (
      <BattleScreen
        key={`${activeArmy.id}-${activeArmy.updatedAt}-${opponentMode}-${aiDifficulty}`}
        playerArmy={activeArmy}
        opponentMode={opponentMode}
        aiDifficulty={aiDifficulty}
        onMenu={() => setScreen("menu")}
        onVictory={(summary) => {
          recordMatchIfNeeded("victory", summary);
          setScreen("victory");
        }}
        onDefeat={(summary) => {
          recordMatchIfNeeded("defeat", summary);
          setScreen("defeat");
        }}
      />
    );
  }

  if (screen === "victory" || screen === "defeat") {
    return (
      <ResultScreen
        outcome={screen}
        match={lastMatch}
        onRetry={() => {
          setReturnAfterArmy("match");
          setScreen("army-create");
        }}
        onMenu={() => setScreen("menu")}
      />
    );
  }

  if (screen === "collection") {
    return <CollectionStubScreen onBack={() => setScreen("menu")} />;
  }

  if (screen === "settings") {
    return <SettingsStubScreen onBack={() => setScreen("menu")} />;
  }

  return (
    <MainMenuScreen
      playerName={session?.displayName ?? null}
      onPlay={() => requireAuth("mode-select")}
      onCreateArmy={() => {
        setReturnAfterArmy("menu");
        setActiveArmy(null);
        requireAuth("army-create");
      }}
      onProfile={() => requireAuth("profile")}
      onMyArmies={() => requireAuth("my-armies")}
      onMatchHistory={() => requireAuth("match-history")}
      onCollection={() => setScreen("collection")}
      onSettings={() => setScreen("settings")}
    />
  );
}

export default App;

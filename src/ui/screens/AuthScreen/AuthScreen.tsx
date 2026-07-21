import { useState } from "react";

import {
  AUTH_REJECT_MESSAGES,
  AuthService,
} from "../../../services/account/authService";
import { claimUnownedArmies } from "../../../services/armyBuilder/armyBuilderRepository";
import type { AuthSession } from "../../../domain/account/types";
import GameButton from "../../components/buttons/GameButton/GameButton";
import ScreenLayout from "../../components/layout/ScreenLayout/ScreenLayout";
import ScreenHeader from "../../components/navigation/ScreenHeader/ScreenHeader";
import WindowFrame from "../../components/windows/WindowFrame/WindowFrame";

import "./AuthScreen.css";

interface AuthScreenProps {
  onBack: () => void;
  onAuthenticated: (session: AuthSession) => void;
}

function AuthScreen({ onBack, onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setFeedback("");
    const result =
      mode === "login"
        ? await AuthService.login({ displayName, password })
        : await AuthService.register({ displayName, password });
    setBusy(false);

    if (!result.ok) {
      setFeedback(AUTH_REJECT_MESSAGES[result.reason]);
      return;
    }

    claimUnownedArmies(result.session.userId);
    onAuthenticated(result.session);
  };

  return (
    <ScreenLayout>
      <ScreenHeader
        title={mode === "login" ? "Вход" : "Регистрация"}
        subtitle="Профиль и прогресс сохраняются локально (безопасный хэш пароля)."
        onBack={onBack}
      />
      <WindowFrame>
        <form
          className="auth-screen__form"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <label>
            <span>Имя оператора</span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              autoComplete="username"
              maxLength={20}
              required
            />
          </label>
          <label>
            <span>Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={6}
              required
            />
          </label>

          {feedback ? <p className="auth-screen__feedback">{feedback}</p> : null}

          <div className="auth-screen__actions">
            <GameButton type="submit" disabled={busy}>
              {busy
                ? "…"
                : mode === "login"
                  ? "Войти"
                  : "Создать аккаунт"}
            </GameButton>
            <GameButton
              type="button"
              variant="ghost"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setFeedback("");
              }}
            >
              {mode === "login" ? "Регистрация" : "Уже есть аккаунт"}
            </GameButton>
          </div>
        </form>
      </WindowFrame>
    </ScreenLayout>
  );
}

export default AuthScreen;

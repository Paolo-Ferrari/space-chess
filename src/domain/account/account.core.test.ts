import { describe, expect, it, beforeEach } from "vitest";

import { AccountStore } from "../../services/account/accountStore";
import { AuthService } from "../../services/account/authService";
import { MatchHistoryService } from "../../services/account/matchHistoryService";
import { ProgressService } from "../../services/account";
import {
  deleteSavedArmy,
  listSavedArmies,
  saveArmyDraft,
} from "../../services/armyBuilder/armyBuilderRepository";
import type { ArmyDraft } from "../armyBuilder/types";

/** Minimal localStorage for Node vitest (no happy-dom required). */
function installMemoryLocalStorage(): void {
  const map = new Map<string, string>();
  const storage = {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    setItem(key: string, value: string) {
      map.set(key, String(value));
    },
    removeItem(key: string) {
      map.delete(key);
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
  };
  Object.defineProperty(globalThis, "window", {
    value: { localStorage: storage },
    configurable: true,
  });
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
  });
}

describe("Player Account + Progress", () => {
  beforeEach(() => {
    installMemoryLocalStorage();
    AccountStore.clearAll();
    localStorage.removeItem("space-chess.army-builder.v1");
  });

  it("registers, restores session after simulated restart", async () => {
    const created = await AuthService.register({
      displayName: "Vee",
      password: "chrome1",
    });
    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }

    const restored = AuthService.getSession();
    expect(restored?.userId).toBe(created.session.userId);
    expect(restored?.displayName).toBe("Vee");

    AuthService.logout();
    expect(AuthService.getSession()).toBeNull();

    const login = await AuthService.login({
      displayName: "Vee",
      password: "chrome1",
    });
    expect(login.ok).toBe(true);
  });

  it("rejects wrong password and duplicate names", async () => {
    await AuthService.register({
      displayName: "Rogue",
      password: "secret12",
    });
    const dup = await AuthService.register({
      displayName: "rogue",
      password: "secret12",
    });
    expect(dup.ok).toBe(false);

    const bad = await AuthService.login({
      displayName: "Rogue",
      password: "wrong-pass",
    });
    expect(bad.ok).toBe(false);
  });

  it("saves army under owner and lists after return", async () => {
    const reg = await AuthService.register({
      displayName: "Builder",
      password: "secret12",
    });
    expect(reg.ok).toBe(true);
    if (!reg.ok) {
      return;
    }

    const draft: ArmyDraft = {
      id: null,
      name: "Night Squad",
      factionId: "faction-arasaka",
      unitIds: [
        "arasaka-commander",
        "arasaka-ripperdoc",
        "arasaka-soldier",
      ],
      commanderImplantIds: ["implant-combat-module"],
      ownerId: null,
    };

    const saved = saveArmyDraft(draft, { ownerId: reg.session.userId });
    expect(saved.ok).toBe(true);
    if (!saved.ok) {
      return;
    }
    expect(saved.army.ownerId).toBe(reg.session.userId);
    expect(saved.army.commanderImplantIds).toContain("implant-combat-module");

    AuthService.logout();
    const again = await AuthService.login({
      displayName: "Builder",
      password: "secret12",
    });
    expect(again.ok).toBe(true);
    if (!again.ok) {
      return;
    }

    const listed = listSavedArmies(again.session.userId);
    expect(listed.some((army) => army.id === saved.army.id)).toBe(true);

    expect(deleteSavedArmy(saved.army.id, again.session.userId)).toBe(true);
    expect(
      listSavedArmies(again.session.userId).some(
        (army) => army.id === saved.army.id,
      ),
    ).toBe(false);
  });

  it("records match history and updates profile stats", async () => {
    const reg = await AuthService.register({
      displayName: "Ace",
      password: "secret12",
    });
    expect(reg.ok).toBe(true);
    if (!reg.ok) {
      return;
    }

    MatchHistoryService.record({
      userId: reg.session.userId,
      opponentLabel: "ИИ (Normal)",
      result: "victory",
      armyId: "army-1",
      armyName: "Street Kings",
      factionId: "faction-tyger-claws",
      durationMs: 125000,
      turnCount: 9,
      mode: "ai",
    });
    MatchHistoryService.record({
      userId: reg.session.userId,
      opponentLabel: "ИИ (Hard)",
      result: "defeat",
      armyId: "army-1",
      armyName: "Street Kings",
      factionId: "faction-tyger-claws",
      durationMs: 90000,
      turnCount: 7,
      mode: "ai",
    });

    const view = ProgressService.profileView(reg.session.userId);
    expect(view).toBeTruthy();
    expect(view!.account.stats.wins).toBe(1);
    expect(view!.account.stats.losses).toBe(1);
    expect(view!.account.stats.matchesPlayed).toBe(2);
    expect(view!.winRate).toBe(50);
    expect(view!.account.stats.favoriteFactionId).toBe("faction-tyger-claws");
    expect(MatchHistoryService.listForUser(reg.session.userId)).toHaveLength(2);
  });
});

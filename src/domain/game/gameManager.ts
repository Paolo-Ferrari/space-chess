import type { Army } from "../armyBuilder/types";
import { BattleManager } from "../battle/battleManager";
import type { BattleState } from "../battle/types";
import {
  clearMatchSnapshot,
  loadMatchSnapshot,
  saveMatchSnapshot,
} from "../../services/persistence/matchSaveRepository";

export type GameModeId = "hotseat-duel";

/**
 * Thin lifecycle orchestrator above BattleManager.
 * Future modes (ranked, AI) plug here without rewriting battle apply loop.
 */
export class GameManager {
  private battle: BattleManager | null = null;
  private modeId: GameModeId = "hotseat-duel";

  getModeId(): GameModeId {
    return this.modeId;
  }

  startHotseatBattle(playerArmy: Army): BattleManager {
    this.modeId = "hotseat-duel";
    this.battle = new BattleManager(playerArmy);
    clearMatchSnapshot();
    return this.battle;
  }

  getBattle(): BattleManager | null {
    return this.battle;
  }

  saveBattle(): boolean {
    if (!this.battle) {
      return false;
    }
    return saveMatchSnapshot(this.battle.getState());
  }

  tryResumeBattle(): BattleManager | null {
    const snapshot = loadMatchSnapshot();
    if (!snapshot || snapshot.state.phase === "ended") {
      return null;
    }
    this.battle = BattleManager.fromSnapshot(snapshot.state);
    return this.battle;
  }

  exportState(): BattleState | null {
    return this.battle?.getState() ?? null;
  }
}

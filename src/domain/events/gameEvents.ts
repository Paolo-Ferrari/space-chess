import type { PlayerId, Position } from "../battle/types";

/**
 * Domain events for battle lifecycle.
 * Consumers (later): abilities, VFX, AI, telemetry — not the core resolver.
 */
export type GameEvent =
  | { type: "BattleStarted"; battleId: string; turnNumber: number }
  | {
      type: "BattleEnded";
      battleId: string;
      winner: PlayerId | null;
    }
  | {
      type: "TurnStarted";
      battleId: string;
      player: PlayerId;
      turnNumber: number;
    }
  | {
      type: "TurnEnded";
      battleId: string;
      player: PlayerId;
      turnNumber: number;
    }
  | {
      type: "UnitMoved";
      battleId: string;
      unitId: string;
      from: Position;
      to: Position;
    }
  | {
      type: "UnitAttacked";
      battleId: string;
      attackerId: string;
      targetId: string;
    }
  | {
      type: "UnitDamaged";
      battleId: string;
      unitId: string;
      damage: number;
      remainingHp: number;
    }
  | {
      type: "UnitDestroyed";
      battleId: string;
      unitId: string;
      definitionId: string;
      owner: PlayerId;
    }
  | {
      type: "AbilityUsed";
      battleId: string;
      casterId: string;
      targetId: string;
      abilityId: string;
    }
  | {
      type: "UnitHealed";
      battleId: string;
      unitId: string;
      amount: number;
      remainingHp: number;
    }
  | {
      type: "StatusApplied";
      battleId: string;
      unitId: string;
      statusId: string;
      abilityId: string;
      remainingTurns: number;
    }
  | {
      type: "StatusExpired";
      battleId: string;
      unitId: string;
      statusId: string;
    };

export type GameEventType = GameEvent["type"];

export function formatGameEvent(event: GameEvent): string {
  switch (event.type) {
    case "BattleStarted":
      return "Матч начат.";
    case "BattleEnded":
      if (event.winner === 0) {
        return "Победа: вражеский Командир уничтожен.";
      }
      if (event.winner === 1) {
        return "Поражение: ваш Командир уничтожен.";
      }
      return "Матч завершён (ничья).";
    case "TurnStarted":
      return `Ход игрока ${event.player + 1} (№${event.turnNumber}).`;
    case "TurnEnded":
      return `Ход игрока ${event.player + 1} завершён.`;
    case "UnitMoved":
      return `Юнит перемещён на (${event.to.x}, ${event.to.y}).`;
    case "UnitAttacked":
      return "Атака.";
    case "UnitDamaged":
      return `Получен урон ${event.damage} (HP ${event.remainingHp}).`;
    case "UnitDestroyed":
      return "Юнит уничтожен.";
    case "AbilityUsed":
      return `Способность: ${event.abilityId}.`;
    case "UnitHealed":
      return `Лечение +${event.amount} (HP ${event.remainingHp}).`;
    case "StatusApplied":
      return `Статус ${event.statusId} (${event.remainingTurns < 0 ? "∞" : `${event.remainingTurns} ход.`}).`;
    case "StatusExpired":
      return `Статус ${event.statusId} снят.`;
    default:
      return "Событие.";
  }
}

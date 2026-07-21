import type { Army } from "../armyBuilder/types";
import { CommanderSystem } from "../commander/commanderSystem";
import { autoPlaceUnits } from "../deployment";
import { LegendarySystem } from "../legendary/legendarySystem";
import { UnitSystem } from "../unit/unitSystem";

import { createBoard, isOccupied } from "./boardManager";
import type { BattleState, PlayerId, Position, UnitRuntime } from "./types";

let instanceSeq = 0;

/** Test helper — deterministic instance ids. */
export function resetBattleInstanceSeq(value = 0): void {
  instanceSeq = value;
}

function newInstanceId(prefix: string, index: number): string {
  instanceSeq += 1;
  return `${prefix}-${index}-${instanceSeq}`;
}

function newBattleId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `battle-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function resolveImplantIds(
  definitionId: string,
  army: Army,
): string[] {
  const definition = UnitSystem.get(definitionId);
  if (!definition) {
    return [];
  }
  if (CommanderSystem.isCommanderUnit(definition)) {
    return [...(army.commanderImplantIds ?? [])];
  }
  if (LegendarySystem.hasCustomizer(definitionId)) {
    return [...(army.legendaryModuleIds ?? [])];
  }
  return [];
}

function resolveStats(definitionId: string, implantIds: readonly string[]) {
  const definition = UnitSystem.get(definitionId);
  if (!definition) {
    return null;
  }
  if (implantIds.length === 0) {
    return definition.stats;
  }
  if (CommanderSystem.isCommanderUnit(definition)) {
    return (
      CommanderSystem.getEffectiveStats(definitionId, implantIds) ??
      definition.stats
    );
  }
  if (LegendarySystem.hasCustomizer(definitionId)) {
    return (
      LegendarySystem.getEffectiveStats(definitionId, implantIds) ??
      definition.stats
    );
  }
  return definition.stats;
}

function placeFromPositions(
  entries: readonly { unitId: string; position: Position }[],
  owner: PlayerId,
  army: Army | null,
): UnitRuntime[] {
  const units: UnitRuntime[] = [];
  for (let i = 0; i < entries.length; i += 1) {
    const { unitId, position } = entries[i];
    const definition = UnitSystem.get(unitId);
    if (!definition) {
      continue;
    }
    const implantIds = army ? resolveImplantIds(unitId, army) : [];
    const stats = resolveStats(unitId, implantIds) ?? definition.stats;
    units.push({
      instanceId: newInstanceId(owner === 0 ? "p0" : "p1", i),
      definitionId: unitId,
      owner,
      position: { ...position },
      currentHp: stats.hp,
      maxHp: stats.hp,
      hasMoved: false,
      hasAttacked: false,
      hasUsedAbility: false,
      statusEffects: [],
      implantIds,
    });
  }
  return units;
}

/** Bottom rows for player 0 (y = 6..7) — fallback when no placements. */
function playerSpawnSlots(): Position[] {
  const slots: Position[] = [];
  for (let y = 7; y >= 6; y -= 1) {
    for (let x = 0; x < 8; x += 1) {
      slots.push({ x, y });
    }
  }
  return slots;
}

/** Top rows for player 1 (y = 0..1). */
function enemySpawnSlots(): Position[] {
  const slots: Position[] = [];
  for (let y = 0; y <= 1; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      slots.push({ x, y });
    }
  }
  return slots;
}

/**
 * Fixed test enemy roster (same Arasaka catalog ids — not a new faction).
 */
export const ENEMY_TEST_UNIT_IDS = [
  "arasaka-commander",
  "arasaka-ripperdoc",
  "arasaka-soldier",
  "arasaka-soldier",
  "arasaka-recon",
] as const;

function playerEntriesFromArmy(
  playerArmy: Army,
): { unitId: string; position: Position }[] {
  const saved = playerArmy.placements ?? [];
  const placements =
    saved.length > 0 ? saved : autoPlaceUnits(playerArmy.unitIds);
  return placements.map((p) => ({
    unitId: p.unitId,
    position: { x: p.x, y: p.y },
  }));
}

/** Mirror deployment zone (y=6..7) onto enemy ranks (y=1..0). */
function enemyEntriesFromArmy(
  enemyArmy: Army,
): { unitId: string; position: Position }[] {
  const saved = enemyArmy.placements ?? [];
  const placements =
    saved.length > 0 ? saved : autoPlaceUnits(enemyArmy.unitIds);
  return placements.map((p) => ({
    unitId: p.unitId,
    position: { x: p.x, y: 7 - p.y },
  }));
}

function assembleBattle(
  playerArmy: Army,
  enemyArmy: Army | null,
  enemyFallbackIds: readonly string[],
): BattleState {
  const board = createBoard();
  const playerUnits = placeFromPositions(
    playerEntriesFromArmy(playerArmy),
    0,
    playerArmy,
  );

  const enemyEntries = enemyArmy
    ? enemyEntriesFromArmy(enemyArmy)
    : enemyFallbackIds.map((unitId, index) => ({
        unitId,
        position: enemySpawnSlots()[index] ?? playerSpawnSlots()[0],
      }));

  const enemyUnits = placeFromPositions(
    enemyEntries,
    1,
    enemyArmy,
  );

  const units: UnitRuntime[] = [];
  for (const unit of [...playerUnits, ...enemyUnits]) {
    if (!isOccupied(units, unit.position)) {
      units.push(unit);
    }
  }

  return {
    battleId: newBattleId(),
    board,
    units,
    currentPlayer: 0,
    turnNumber: 1,
    phase: "playing",
    winner: null,
    log: [],
  };
}

export function createBattleFromArmy(playerArmy: Army): BattleState {
  return assembleBattle(playerArmy, null, ENEMY_TEST_UNIT_IDS);
}

/** Both seats from saved Combat Networks (balance sims / future PvP). */
export function createBattleFromArmies(
  playerArmy: Army,
  enemyArmy: Army,
): BattleState {
  return assembleBattle(playerArmy, enemyArmy, []);
}

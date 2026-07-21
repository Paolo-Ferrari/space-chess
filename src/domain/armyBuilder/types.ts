import type { UnitPlacement } from "../deployment/types";

/**
 * Combat Capacity / slots — mirrors `BALANCE_CONFIG.army`.
 * Runtime validation prefers BalanceSystem.combatCapacity().
 */
export const ARMY_ENERGY_LIMIT = 100;

/** Max unit slots in one army. */
export const ARMY_MAX_SLOTS = 16;

/** Max characters in army name. */
export const ARMY_NAME_MAX_LENGTH = 24;

/**
 * Unit role in the army builder catalog.
 * Extensible: add new types here + catalog entries without rewriting the builder UI.
 */
export type UnitType =
  | "commander"
  | "ripperdoc"
  | "regular"
  | "special"
  | "legendary"
  | "edgerunner";

/** Combat-facing base stats (combat system not implemented yet). */
export interface UnitStats {
  hp: number;
  attack: number;
  defense: number;
  movement: number;
  range: number;
}

/**
 * Ability ids reserved for future combat.
 * Empty until ability system exists.
 */
export type UnitAbilityId = string;

export interface FactionDefinition {
  id: string;
  name: string;
  tag: string;
  description: string;
}

export interface UnitDefinition {
  id: string;
  factionId: string;
  name: string;
  type: UnitType;
  cost: number;
  stats: UnitStats;
  description: string;
  /** Future combat hooks — keep empty for now. */
  abilities: UnitAbilityId[];
}

/**
 * Saved army created by the Army Builder.
 * Combat-agnostic: only references catalog ids.
 * Commander implants ≠ legendary combat modules.
 */
export interface Army {
  id: string;
  name: string;
  factionId: string;
  /** Ordered definition ids — kept in sync with placements. */
  unitIds: string[];
  /** Board formation for Protocol Match spawn (optional on legacy saves). */
  placements?: UnitPlacement[];
  /** Universal implants on Neural Commander only. */
  commanderImplantIds: string[];
  /** Combat modules on legendary customizers (e.g. Adam Smasher). */
  legendaryModuleIds?: string[];
  /** Owning PlayerAccount id — null = legacy / unclaimed. */
  ownerId: string | null;
  updatedAt: number;
}

/** Mutable draft while editing (not yet persisted). */
export interface ArmyDraft {
  id: string | null;
  name: string;
  factionId: string;
  unitIds: string[];
  placements: UnitPlacement[];
  commanderImplantIds: string[];
  legendaryModuleIds: string[];
  ownerId?: string | null;
}

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  commander: "Нейро-командир",
  ripperdoc: "Риппердок",
  regular: "Обычный",
  special: "Специальный",
  legendary: "Легендарный",
  edgerunner: "Независимый оператор",
};

/**
 * Implant + Commander contracts.
 * Only Commander loadouts reference implant ids; Unit catalog stays implant-agnostic.
 */

export type ImplantType =
  | "offensive"
  | "defensive"
  | "mobility"
  | "cyberdeck"
  | "neural";

export const IMPLANT_TYPE_LABELS: Record<ImplantType, string> = {
  offensive: "Наступательный",
  defensive: "Защитный",
  mobility: "Мобильность",
  cyberdeck: "Кибердека",
  neural: "Нейро",
};

export interface ImplantStatMods {
  hp?: number;
  attack?: number;
  defense?: number;
  movement?: number;
  range?: number;
}

export interface ImplantDefinition {
  id: string;
  name: string;
  description: string;
  type: ImplantType;
  /** How many commander implant slots this occupies. */
  slotCost: number;
  /** Flat mods applied to commander base stats. */
  statMods: ImplantStatMods;
  /** Optional ability ids granted while installed (Ability System). */
  abilityIds: string[];
  /** Soft restrictions — evaluated by CommanderSystem. */
  restrictions?: {
    /** Max copies of this implant on one commander. */
    maxStacks?: number;
    /** Faction lock; omit = any. */
    factionIds?: string[];
  };
}

/**
 * Commander profile layered on a UnitDefinition (composition).
 */
export interface CommanderDefinition {
  id: string;
  unitDefinitionId: string;
  factionId: string;
  name: string;
  description: string;
  /** Total implant slots available before match. */
  implantSlots: number;
}

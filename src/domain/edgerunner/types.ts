/**
 * Edgerunner contracts — neutral hireables, not a faction.
 */

export type EdgerunnerRole =
  | "solo"
  | "netrunner"
  | "techie"
  | "scout"
  | "specialist";

export const EDGERUNNER_ROLE_LABELS: Record<EdgerunnerRole, string> = {
  solo: "Solo",
  netrunner: "Netrunner",
  techie: "Techie",
  scout: "Scout",
  specialist: "Specialist",
};

/** Sentinel factionId on UnitDefinition — not a playable faction. */
export const EDGERUNNER_POOL_ID = "pool-edgerunners";

/** Max edgerunners hireable into one army. */
export const ARMY_MAX_EDGERUNNERS = 2;

/**
 * Profile layered on a UnitDefinition (composition).
 * Unit catalog holds combat stats; this holds hire metadata.
 */
export interface EdgerunnerDefinition {
  id: string;
  unitDefinitionId: string;
  name: string;
  description: string;
  role: EdgerunnerRole;
  /** Whether this hire is currently offered in the builder. */
  available: boolean;
}

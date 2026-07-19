/**
 * Unit definition in the global collection.
 * `heroId === null` → common unit; otherwise unique to that hero faction.
 */
export interface UnitDefinition {
  id: string;
  name: string;
  portraitId: string;
  /** Faction hero id, or null for neutrals. */
  heroId: string | null;
  /** Display race / faction tag. */
  race: string;
  cost: number;
  attack: number;
  health: number;
  /** Combat / field ability (technology / biology / gear). */
  abilityDescription: string;
  /** Short purpose of the figure in the army. */
  roleDescription: string;
}

/** Mandatory commander / hero figure(s) for a faction. */
export function isKingUnit(unit: Pick<UnitDefinition, "id">): boolean {
  return unit.id.startsWith("unit-king-");
}

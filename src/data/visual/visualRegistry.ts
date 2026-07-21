import { unitImagePath } from "../assets/unitArt";

/**
 * Visual override layers — unit → group → faction → default.
 * Change SVG / cover art without touching battle systems.
 */

export type VisualScope =
  | { kind: "unit"; unitId: string }
  | { kind: "group"; groupId: string }
  | { kind: "faction"; factionId: string }
  | { kind: "system"; systemId: string };

export interface UnitVisualOverride {
  /** Board pictogram (SVG path under /assets/unit-icons/). */
  boardIcon?: string;
  /** Large card / collection cover (PNG/WebP later). */
  coverImage?: string;
  /** Optional CSS class appended to tokens. */
  tokenClass?: string;
}

/** unitId → override */
export const UNIT_VISUAL_OVERRIDES: Record<string, UnitVisualOverride> = {
  // Example:
  // "arasaka-adam-smasher": { boardIcon: "/assets/unit-icons/arasaka-adam-smasher.svg", tokenClass: "is-smasher" },
};

/** Logical groups of units sharing a visual kit. */
export const GROUP_VISUAL_OVERRIDES: Record<string, UnitVisualOverride> = {
  // "role-sniper": { tokenClass: "visual-sniper" },
};

/** Whole faction board/card chrome. */
export const FACTION_VISUAL_OVERRIDES: Record<string, UnitVisualOverride> = {
  // "faction-arasaka": { tokenClass: "visual-arasaka-kit" },
};

/** Which group a unit belongs to (optional). */
export const UNIT_VISUAL_GROUPS: Record<string, string[]> = {
  // "ncpd-sniper": ["role-sniper"],
};

export function resolveUnitVisual(input: {
  unitId: string;
  factionId: string;
}): UnitVisualOverride & { boardIcon: string } {
  const unit = UNIT_VISUAL_OVERRIDES[input.unitId] ?? {};
  const groups = UNIT_VISUAL_GROUPS[input.unitId] ?? [];
  const groupMerged = groups.reduce<UnitVisualOverride>((acc, groupId) => {
    return { ...GROUP_VISUAL_OVERRIDES[groupId], ...acc };
  }, {});
  const faction = FACTION_VISUAL_OVERRIDES[input.factionId] ?? {};

  return {
    ...faction,
    ...groupMerged,
    ...unit,
    boardIcon:
      unit.boardIcon ??
      groupMerged.boardIcon ??
      faction.boardIcon ??
      unitImagePath(input.unitId),
  };
}

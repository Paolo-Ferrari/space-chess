import type { Position } from "../../../domain/battle/types";

/**
 * Map / board definition — content, not engine logic.
 * Add a new battlefield: one file in this folder + register in index.ts.
 */
export interface MapDeploymentZone {
  /** Inclusive cell list OR generated from ranks. */
  cells: Position[];
  /** Human label for UI. */
  label: string;
}

export interface MapDefinition {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  /** Player 0 deploy zone (local seat). */
  deploymentP0: MapDeploymentZone;
  /** Player 1 deploy zone — usually mirrored; may be asymmetric later. */
  deploymentP1: MapDeploymentZone;
  /** Optional visual theme key (CSS / assets). */
  visualThemeId?: string;
  /** Tags for mode filtering: "classic" | "skirmish" | … */
  tags: string[];
}

import { isKingUnit } from "../unit/unit.types";
import type { UnitDefinition } from "../unit/unit.types";

import type { MatchPiece, PlayerId } from "./match.types";

/**
 * Victory = all mandatory commanders (kings) of the opponent are destroyed.
 * Cosmodesant has two kings — both must fall.
 * Plutons has one king.
 */
export function livingKingsForPlayer(
  pieces: readonly MatchPiece[],
  owner: PlayerId,
  getUnitById: (unitId: string) => UnitDefinition | undefined,
): MatchPiece[] {
  return pieces.filter((piece) => {
    if (piece.owner !== owner || piece.health <= 0) {
      return false;
    }
    const def = getUnitById(piece.unitDefinitionId);
    return Boolean(def && isKingUnit(def));
  });
}

export function checkWinner(
  pieces: readonly MatchPiece[],
  getUnitById: (unitId: string) => UnitDefinition | undefined,
): PlayerId | null {
  const p0Kings = livingKingsForPlayer(pieces, 0, getUnitById);
  const p1Kings = livingKingsForPlayer(pieces, 1, getUnitById);

  if (p0Kings.length === 0 && p1Kings.length === 0) {
    // Simultaneous wipe — treat as draw → no winner; rare; prefer P1 win of last actor handled elsewhere.
    return null;
  }
  if (p0Kings.length === 0) {
    return 1;
  }
  if (p1Kings.length === 0) {
    return 0;
  }
  return null;
}

/**
 * Ripperdoc System — support role layered on Unit (composition, not subclass hell).
 * Unit remains the board entity; Ripperdoc profile describes faction support kit.
 */

/** High-level support action families every faction Ripperdoc can specialize in. */
export type RipperdocActionKind =
  | "healing"
  | "repair"
  | "buff"
  | "remove_effect"
  | "modification";

export const RIPPERDOC_ACTION_LABELS: Record<RipperdocActionKind, string> = {
  healing: "Лечение",
  repair: "Ремонт",
  buff: "Усиление",
  remove_effect: "Снятие эффекта",
  modification: "Модификация",
};

/**
 * One support action slot on a Ripperdoc profile.
 * Points at Ability System ids — Ripperdoc does not reimplement effects.
 */
export interface RipperdocActionSlot {
  kind: RipperdocActionKind;
  /** Ability catalog id when implemented; null = reserved for future faction kit. */
  abilityId: string | null;
  label: string;
  description: string;
}

export interface RipperdocDefinition {
  id: string;
  /** Same id as UnitDefinition — board piece is still a Unit. */
  unitDefinitionId: string;
  factionId: string;
  name: string;
  description: string;
  /** Chebyshev support radius for UI + targeting guidance. */
  supportRadius: number;
  /** Faction identity tags (elite, repair, overload, …) — data only. */
  styleTags: string[];
  actions: RipperdocActionSlot[];
}

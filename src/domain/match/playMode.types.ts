/** Selectable entry modes on the Play lobby screen. */
export type PlayModeId =
  | "sandbox"
  | "vs-ai"
  | "classic"
  | "special"
  | "custom";

export interface PlayModeDefinition {
  id: PlayModeId;
  label: string;
  /** Short line under the mode title in the center stage. */
  blurb: string;
  /** CSS modifier for stage atmosphere (background). */
  atmosphere: string;
}

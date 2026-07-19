/** Playable hero faction (army identity). Match roster and army builder share this. */
export interface Hero {
  id: string;
  name: string;
  /** Key for neon glyph / future art asset. */
  portraitId: string;
  /** Short faction pitch for pickers. */
  description: string;
  /** Special faction rule shown in UI (not a new engine rule by itself). */
  traitDescription: string;
}

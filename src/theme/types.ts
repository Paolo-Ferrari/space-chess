/** Full faction UI theme — drives Theme Engine CSS variables. */
export interface FactionTheme {
  id: string;
  /** Short folder / CSS key */
  key: string;
  label: string;
  /** Primary neon accent */
  accent: string;
  accentSoft: string;
  accentDim: string;
  glow: string;
  glowSoft: string;
  /** Surfaces */
  bgPrimary: string;
  bgDeep: string;
  bgPanel: string;
  panelBorder: string;
  glassBorder: string;
  /** Board */
  tileA: string;
  tileB: string;
  grid: string;
  move: string;
  attack: string;
  ability: string;
  support: string;
  selected: string;
  heal: string;
  overclock: string;
  death: string;
  /** Chrome */
  buttonGlow: string;
  windowGlow: string;
  energy: string;
  danger: string;
  textMuted: string;
  /** Atmosphere gradient stops */
  skyline: string;
  atmosphere: string;
}

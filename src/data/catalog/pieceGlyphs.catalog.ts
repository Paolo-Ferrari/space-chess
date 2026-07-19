/**
 * Display glyphs for units on the board and army slots.
 * Cosmodesant → chess pieces; Plutons → Arabic letters; Neutrals → geometric marks.
 */
export const PIECE_GLYPHS: Readonly<Record<string, string>> = {
  // —— Космодесант (шахматные фигуры) ——
  "unit-king-cosmo-rex": "♔",
  "unit-king-cosmo-vera": "♕",
  "unit-cosmo-trooper": "♙",
  "unit-cosmo-sergeant": "♘",
  "unit-cosmo-apothecary": "♗",
  "unit-cosmo-banner": "♖",
  "unit-cosmo-warden": "♜",
  "unit-cosmo-assault": "♞",
  "unit-cosmo-devastator": "♛",
  "unit-cosmo-sapper": "♝",
  "unit-cosmo-dreadnought": "♚",
  "unit-cosmo-chaplain": "✝",
  "unit-cosmo-centurion": "♟",
  "unit-cosmo-terminator": "♛",

  // —— Плутоны (арабские буквы / знаки) ——
  "unit-king-pluton-archon": "ا",
  "unit-pluton-skimmer": "ب",
  "unit-pluton-wraith": "ت",
  "unit-pluton-marksman": "ث",
  "unit-pluton-dome": "ج",
  "unit-pluton-warp": "ح",
  "unit-pluton-arc": "خ",
  "unit-pluton-gate": "د",
  "unit-pluton-pulsar": "ذ",
  "unit-pluton-navigator": "ر",
  "unit-pluton-quantum": "ز",
  "unit-pluton-annihilator": "س",
  "unit-pluton-echo": "ش",

  // —— Нейтралы ——
  "unit-neutral-bulwark": "◆",
  "unit-neutral-engineer": "◇",
  "unit-neutral-mine": "●",
  "unit-neutral-rail": "▲",
  "unit-neutral-medic": "✚",
  "unit-neutral-scout": "▸",
  "unit-neutral-swarm": "✧",
  "unit-neutral-sentry": "▣",
  "unit-neutral-saboteur": "✦",
  "unit-neutral-berserk": "⬟",
} as const;

export function getPieceGlyph(unitDefinitionId: string): string {
  return PIECE_GLYPHS[unitDefinitionId] ?? "·";
}

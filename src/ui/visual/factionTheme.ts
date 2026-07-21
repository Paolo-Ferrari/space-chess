/**
 * Faction visual accents for local components (tokens, combat cards).
 * Full UI theming lives in ThemeEngine (`src/theme`).
 */

import { getFactionTheme } from "../../theme/factionThemes";

export interface FactionVisual {
  id: string;
  accent: string;
  accentSoft: string;
  glow: string;
  styleClass: string;
  label: string;
}

export function getFactionVisual(factionId: string | undefined): FactionVisual {
  const theme = getFactionTheme(factionId);
  return {
    id: theme.id,
    accent: theme.accent,
    accentSoft: theme.accentSoft,
    glow: theme.glow,
    styleClass: `faction-${theme.key}`,
    label: theme.label,
  };
}

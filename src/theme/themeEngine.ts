import { getFactionTheme } from "./factionThemes";
import type { FactionTheme } from "./types";

const VAR_MAP: Array<[keyof FactionTheme, string]> = [
  ["accent", "--accent-neon"],
  ["accent", "--cp-yellow"],
  ["accent", "--brand-yellow"],
  ["accent", "--energy"],
  ["accent", "--faction-player"],
  ["accentSoft", "--faction-player-hover"],
  ["accentSoft", "--glow-soft"],
  ["accentDim", "--accent-dim"],
  ["glow", "--glow"],
  ["glow", "--brand-btn-glow"],
  ["glowSoft", "--brand-window-glow"],
  ["bgPrimary", "--bg-primary"],
  ["bgDeep", "--bg-deep"],
  ["bgPanel", "--bg-panel"],
  ["bgPanel", "--brand-panel"],
  ["panelBorder", "--brand-panel-border"],
  ["glassBorder", "--glass-border"],
  ["energy", "--energy"],
  ["danger", "--danger"],
  ["danger", "--cp-magenta"],
  ["danger", "--brand-magenta"],
  ["textMuted", "--text-muted"],
  ["buttonGlow", "--brand-btn-glow"],
  ["windowGlow", "--brand-window-glow"],
  ["tileA", "--theme-tile-a"],
  ["tileB", "--theme-tile-b"],
  ["grid", "--theme-grid"],
  ["move", "--theme-move"],
  ["attack", "--theme-attack"],
  ["ability", "--theme-ability"],
  ["support", "--theme-support"],
  ["selected", "--theme-selected"],
  ["heal", "--theme-heal"],
  ["overclock", "--theme-overclock"],
  ["death", "--theme-death"],
  ["skyline", "--theme-skyline"],
  ["atmosphere", "--theme-atmosphere"],
  ["accent", "--unit-color"],
  ["accent", "--unit-accent"],
  ["glow", "--unit-glow"],
];

function setVar(el: HTMLElement, name: string, value: string) {
  el.style.setProperty(name, value);
}

/**
 * Theme Engine — applies faction identity to the entire document UI.
 */
export const ThemeEngine = {
  get: getFactionTheme,

  apply(factionId: string | undefined | null): FactionTheme {
    const theme = getFactionTheme(factionId);
    const root = document.documentElement;
    root.dataset.factionTheme = theme.key;
    root.dataset.factionId = theme.id;

    for (const [key, cssVar] of VAR_MAP) {
      const value = theme[key];
      if (typeof value === "string") {
        setVar(root, cssVar, value);
      }
    }

    setVar(root, "--faction-player-hover-strong", theme.accentSoft);
    setVar(root, "--brand-panel-edge", theme.accent);
    setVar(root, "--cp-cyan", theme.accent);
    setVar(root, "--brand-cyan", theme.accent);

    return theme;
  },

  clear() {
    return this.apply(null);
  },
};
